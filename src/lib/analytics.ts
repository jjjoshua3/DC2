import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { ensureVisitTable } from "@/lib/stats-query"

const placeCache = new Map<string, Place>()

type Place = { country: string; city: string; region: string }

function isPrivateIp(ip: string) {
  const value = ip.trim().toLowerCase()
  if (!value || value === "unknown" || value === "127.0.0.1" || value === "::1" || value === "0.0.0.0") return true
  if (value.startsWith("10.") || value.startsWith("192.168.") || value.startsWith("169.254.")) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80")) return true
  return false
}

export function ipFromHeaders(headers: Headers) {
  const raw = [
    headers.get("x-nf-client-connection-ip"),
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for"),
  ]
  for (const entry of raw) {
    if (!entry) continue
    for (const part of entry.split(",")) {
      const ip = part.trim().replace(/^::ffff:/, "")
      if (!isPrivateIp(ip)) return ip
    }
  }
  return ""
}

function countryName(code: string, fallback: string) {
  if (!code) return fallback || "Onbekend"
  try {
    return new Intl.DisplayNames(["nl"], { type: "region" }).of(code.toUpperCase()) || fallback || "Onbekend"
  } catch {
    return fallback || "Onbekend"
  }
}

export async function lookupPlace(ip: string): Promise<Place> {
  if (!ip || isPrivateIp(ip)) return { country: "Onbekend", city: "", region: "" }
  const cached = placeCache.get(ip)
  if (cached) return cached
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(4000),
    })
    const data = (await response.json()) as {
      success?: boolean
      country?: string
      country_code?: string
      city?: string
      region?: string
    }
    const place = data.success
      ? {
          country: countryName(data.country_code || "", data.country || ""),
          city: data.city || "",
          region: data.region || "",
        }
      : { country: "Onbekend", city: "", region: "" }
    placeCache.set(ip, place)
    return place
  } catch {
    return { country: "Onbekend", city: "", region: "" }
  }
}

export const startVisit = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const visitorId = (input as { visitorId?: unknown })?.visitorId
    const path = (input as { path?: unknown })?.path
    if (typeof visitorId !== "string" || visitorId.length < 8 || visitorId.length > 80) {
      throw new Error("Ongeldige bezoeker")
    }
    return { visitorId, path: typeof path === "string" ? path.slice(0, 120) : "/" }
  })
  .handler(async ({ data }) => {
    const sql = await ensureVisitTable()
    const place = await lookupPlace(ipFromHeaders(getRequest().headers))
    const id = crypto.randomUUID()
    await sql`
      insert into site_visit (id, visitor_id, country, city, region)
      values (${id}, ${data.visitorId}, ${place.country}, ${place.city}, ${place.region})
    `
    const earlier = await sql<{ n: number }>`
      select count(*)::int as n from site_visit where visitor_id = ${data.visitorId}
    `
    return { visitId: id, returning: (earlier[0]?.n ?? 1) > 1 }
  })

export const heartbeatVisit = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const visitId = (input as { visitId?: unknown })?.visitId
    const seconds = (input as { seconds?: unknown })?.seconds
    if (typeof visitId !== "string" || !visitId) throw new Error("Ongeldig bezoek")
    const duration = typeof seconds === "number" && Number.isFinite(seconds) ? Math.max(0, Math.min(60 * 60 * 6, Math.round(seconds))) : 0
    return { visitId, seconds: duration }
  })
  .handler(async ({ data }) => {
    const sql = await ensureVisitTable()
    await sql`
      update site_visit
      set duration_seconds = ${data.seconds}, last_seen_at = now()
      where id = ${data.visitId}
    `
    return { ok: true as const }
  })

