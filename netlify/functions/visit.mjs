import pg from "pg"

function isPrivateIp(ip) {
  const value = ip.trim().toLowerCase()
  if (!value || value === "unknown" || value === "127.0.0.1" || value === "::1" || value === "0.0.0.0") return true
  if (value.startsWith("10.") || value.startsWith("192.168.") || value.startsWith("169.254.")) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80")) return true
  return false
}

function clientIp(request, context) {
  const raw = [
    context?.ip,
    request.headers.get("x-nf-client-connection-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for"),
  ]
  for (const entry of raw) {
    if (!entry) continue
    for (const part of String(entry).split(",")) {
      const ip = part.trim().replace(/^::ffff:/, "")
      if (!isPrivateIp(ip)) return ip
    }
  }
  return ""
}

function countryName(code, fallback) {
  if (!code) return fallback || "Onbekend"
  try {
    return new Intl.DisplayNames(["nl"], { type: "region" }).of(code.toUpperCase()) || fallback || "Onbekend"
  } catch {
    return fallback || "Onbekend"
  }
}

async function placeFor(ip) {
  if (!ip || isPrivateIp(ip)) return { country: "Onbekend", city: "", region: "" }
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(4000) })
    const data = await response.json()
    if (!data.success) return { country: "Onbekend", city: "", region: "" }
    return {
      country: countryName(data.country_code || "", data.country || ""),
      city: data.city || "",
      region: data.region || "",
    }
  } catch {
    return { country: "Onbekend", city: "", region: "" }
  }
}

async function withDb(run) {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) throw new Error("DATABASE_URL ontbreekt")
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("supabase") ? { rejectUnauthorized: false } : undefined,
    max: 1,
    connectionTimeoutMillis: 8000,
  })
  try {
    return await run(pool)
  } finally {
    await pool.end()
  }
}

export default async (request, context) => {
  try {
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    return await withDb(async (pool) => {
      await pool.query(`
        create table if not exists site_visit (
          id text primary key,
          visitor_id text not null,
          country text not null default 'Onbekend',
          city text not null default '',
          region text not null default '',
          started_at timestamptz not null default now(),
          last_seen_at timestamptz not null default now(),
          duration_seconds integer not null default 0,
          ip text not null default '',
          path text not null default ''
        )
      `)
      await pool.query(`alter table site_visit add column if not exists ip text not null default ''`)
      await pool.query(`alter table site_visit add column if not exists path text not null default ''`)
      if (typeof body?.visitId === "string" && body.visitId) {
        const seconds =
          typeof body.seconds === "number" && Number.isFinite(body.seconds)
            ? Math.max(0, Math.min(60 * 60 * 6, Math.round(body.seconds)))
            : 0
        await pool.query(`update site_visit set duration_seconds = $1, last_seen_at = now() where id = $2`, [
          seconds,
          body.visitId,
        ])
        return Response.json({ ok: true })
      }
      const visitorId = typeof body?.visitorId === "string" ? body.visitorId : ""
      if (visitorId.length < 8 || visitorId.length > 80) {
        return Response.json({ error: "Ongeldige bezoeker" }, { status: 400 })
      }
      const ip = clientIp(request, context)
      const place = await placeFor(ip)
      const path = typeof body?.path === "string" ? body.path.slice(0, 120) : "/"
      const id = crypto.randomUUID()
      await pool.query(
        `insert into site_visit (id, visitor_id, country, city, region, ip, path) values ($1, $2, $3, $4, $5, $6, $7)`,
        [id, visitorId, place.country, place.city, place.region, ip, path],
      )
      return Response.json({ visitId: id, city: place.city, country: place.country })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
