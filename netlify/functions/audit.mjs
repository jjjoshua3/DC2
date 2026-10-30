import pg from "pg"

const SUPABASE_URL = "https://zaljeyembygscuhzdnng.supabase.co"
const SUPABASE_KEY = "sb_publishable__QNkTn2UekwNv9rMjT4uMQ__MCQ_lkj"
const ADMINS = {
  "joshua.bosma@kpnmail.nl": { name: "Joshua Bosma", role: "Webdeveloper" },
  "stefanie@deconnectors.com": { name: "Stefanie Vermeulen", role: "Eigenaar" },
}

async function accountFromToken(token) {
  if (!token) return null
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null
  const user = await response.json().catch(() => null)
  const email = user?.email?.trim().toLowerCase() ?? ""
  const account = ADMINS[email]
  if (!account) return null
  return { email, ...account }
}

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

function allowed() {
  return false
}

async function withDb(run) {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) throw new Error("DATABASE_URL ontbreekt op Netlify")
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

async function ensureTable(pool) {
  await pool.query(`
    create table if not exists site_audit (
      id text primary key,
      at timestamptz not null default now(),
      kind text not null,
      username text not null default '',
      ip text not null default '',
      city text not null default '',
      country text not null default '',
      ok boolean,
      summary text not null default '',
      detail text not null default ''
    )
  `)
}

async function writeEvent(pool, input) {
  await ensureTable(pool)
  await pool.query(
    `insert into site_audit (id, kind, username, ip, city, country, ok, summary, detail)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      crypto.randomUUID(),
      input.kind,
      input.username.slice(0, 80),
      input.ip.slice(0, 80),
      input.city.slice(0, 80),
      input.country.slice(0, 80),
      input.ok,
      input.summary.slice(0, 240),
      input.detail.slice(0, 2000),
    ],
  )
}

export default async (request, context) => {
  try {
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    const action = typeof body?.action === "string" ? body.action : ""
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : ""
    const token = typeof body?.token === "string" ? body.token : ""
    const ip = clientIp(request, context)
    const place = await placeFor(ip)
    const account = await accountFromToken(token)

    return await withDb(async (pool) => {
      if (action === "login") {
        const known = ADMINS[username]
        await writeEvent(pool, {
          kind: "login",
          username: username || "(leeg)",
          ip,
          city: place.city,
          country: place.country,
          ok: !!known,
          summary: known ? "Inloglink verstuurd" : "Inloggen geweigerd",
          detail: known ? "Magische link" : "Onbekend e-mailadres",
        })
        return Response.json({ ok: !!known })
      }
      if (action === "session") {
        if (!account) return Response.json({ error: "Geen toegang" }, { status: 401 })
        await writeEvent(pool, {
          kind: "login",
          username: account.email,
          ip,
          city: place.city,
          country: place.country,
          ok: true,
          summary: `Ingelogd als ${account.role}`,
          detail: "Magische link",
        })
        return Response.json({ ok: true, account })
      }
      if (!account) return Response.json({ error: "Geen toegang" }, { status: 401 })
      if (action === "logout") {
        await writeEvent(pool, {
          kind: "logout",
          username: account.email,
          ip,
          city: place.city,
          country: place.country,
          ok: null,
          summary: "Uitgelogd",
          detail: account.role,
        })
        return Response.json({ ok: true })
      }
      if (action === "change") {
        const summary = typeof body?.summary === "string" && body.summary.trim() ? body.summary.trim() : "Wijziging opgeslagen"
        const detail = typeof body?.detail === "string" ? body.detail.trim() : ""
        await writeEvent(pool, {
          kind: "change",
          username: account.email,
          ip,
          city: place.city,
          country: place.country,
          ok: null,
          summary,
          detail: detail || summary,
        })
        return Response.json({ ok: true })
      }
      if (action === "list") {
        await ensureTable(pool)
        const rows = await pool.query(
          `select id, at, kind, username, ip, city, country, ok, summary, detail
           from site_audit order by at desc limit 200`,
        )
        return Response.json({
          events: rows.rows.map((event) => ({
            ...event,
            at: event.at instanceof Date ? event.at.toISOString() : String(event.at),
          })),
        })
      }
      return Response.json({ error: "Onbekende actie" }, { status: 400 })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
