import { createServerFn } from "@tanstack/react-start"
import { getSql } from "@/lib/db"

const ADMIN_USER = "admin"
const ADMIN_PASSWORD = "Admin"

type Place = { country: string; city: string; region: string }
const placeCache = new Map<string, Place>()

function allowed(username: string, password: string) {
  return username.toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD
}

async function ensureTable() {
  const sql = await getSql()
  await sql`
    create table if not exists site_visit (
      id text primary key,
      visitor_id text not null,
      country text not null default 'Onbekend',
      city text not null default '',
      region text not null default '',
      started_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now(),
      duration_seconds integer not null default 0
    )
  `
  return sql
}

async function clientIp() {
  try {
    const mod = await import("@tanstack/react-start/server")
    const request = mod.getRequest()
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    return forwarded || mod.getRequestIP({ xForwardedFor: true }) || ""
  } catch {
    return ""
  }
}

async function placeFor(ip: string): Promise<Place> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return { country: "Onbekend", city: "", region: "" }
  }
  const cached = placeCache.get(ip)
  if (cached) return cached
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
    })
    const data = (await response.json()) as {
      success?: boolean
      country?: string
      city?: string
      region?: string
    }
    const place = data.success
      ? { country: data.country || "Onbekend", city: data.city || "", region: data.region || "" }
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
    const sql = await ensureTable()
    const place = await placeFor(clientIp())
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
    const sql = await ensureTable()
    await sql`
      update site_visit
      set duration_seconds = ${data.seconds}, last_seen_at = now()
      where id = ${data.visitId}
    `
    return { ok: true as const }
  })

export type Analytics = {
  sessions: number
  uniques: number
  avgSeconds: number
  avgReturns: number
  returnRate: number
  places: { label: string; country: string; city: string; visits: number; people: number }[]
}

export const fetchAnalytics = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const username = (input as { username?: unknown })?.username
    const password = (input as { password?: unknown })?.password
    if (typeof username !== "string" || typeof password !== "string" || !allowed(username, password)) {
      throw new Error("Geen toegang")
    }
    return { username, password }
  })
  .handler(async (): Promise<Analytics> => {
    try {
      const sql = await ensureTable()
      const totals = await sql<{ sessions: string; uniques: string; avg_seconds: string }>`
        select
          count(*)::text as sessions,
          count(distinct visitor_id)::text as uniques,
          coalesce(avg(nullif(duration_seconds, 0)), 0)::text as avg_seconds
        from site_visit
      `
      const perVisitor = await sql<{ n: string }>`
        select count(*)::text as n from site_visit group by visitor_id
      `
      const places = await sql<{ country: string; city: string; visits: string; people: string }>`
        select country, city, count(*)::text as visits, count(distinct visitor_id)::text as people
        from site_visit
        group by country, city
        order by count(*) desc
        limit 12
      `
      const counts = perVisitor.map((row) => Number(row.n) || 0)
      const returning = counts.filter((n) => n > 1).length
      const uniques = Number(totals[0]?.uniques ?? 0) || 0
      return {
        sessions: Number(totals[0]?.sessions ?? 0) || 0,
        uniques,
        avgSeconds: Math.round(Number(totals[0]?.avg_seconds ?? 0) || 0),
        avgReturns: counts.length ? Math.round((counts.reduce((sum, n) => sum + n, 0) / counts.length) * 10) / 10 : 0,
        returnRate: uniques ? Math.round((returning / uniques) * 100) : 0,
        places: places.map((place) => ({
          label: place.city ? `${place.city}, ${place.country}` : place.country || "Onbekend",
          country: place.country || "Onbekend",
          city: place.city || "",
          visits: Number(place.visits) || 0,
          people: Number(place.people) || 0,
        })),
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Onbekende fout"
      throw new Error(`Cijfers laden mislukt: ${message}`)
    }
  })
