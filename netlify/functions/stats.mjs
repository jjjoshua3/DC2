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
  return ADMINS[email] ? { email, ...ADMINS[email] } : null
}

function amsterdamDay(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

function dayLabel(day) {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(new Date(`${day}T12:00:00`))
}

function lastDays(rows) {
  const byDay = new Map(rows.map((row) => [row.day, row]))
  const days = []
  const today = new Date()
  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const day = amsterdamDay(date)
    const row = byDay.get(day)
    days.push({
      day,
      label: dayLabel(day),
      visits: row?.visits ?? 0,
      people: row?.people ?? 0,
    })
  }
  return days
}

async function load(sql) {
  await sql.query(`
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
  `)
  const totals = await sql.query(`
    select count(*)::text as sessions,
           count(distinct visitor_id)::text as uniques,
           coalesce(avg(nullif(duration_seconds, 0)), 0)::text as avg_seconds
    from site_visit
  `)
  const perVisitor = await sql.query(`select count(*)::text as n from site_visit group by visitor_id`)
  const places = await sql.query(`
    select country, city, count(*)::text as visits, count(distinct visitor_id)::text as people
    from site_visit
    group by country, city
    order by count(*) desc
    limit 8
  `)
  const daily = await sql.query(`
    select to_char(started_at at time zone 'Europe/Amsterdam', 'YYYY-MM-DD') as day,
           count(*)::text as visits,
           count(distinct visitor_id)::text as people
    from site_visit
    where started_at > now() - interval '14 days'
    group by 1
  `)
  await sql.query(`alter table site_visit add column if not exists ip text not null default ''`)
  await sql.query(`alter table site_visit add column if not exists path text not null default ''`)
  const recent = await sql.query(`
    select started_at as at, ip, city, country, path, duration_seconds::text as seconds
    from site_visit
    order by started_at desc
    limit 40
  `)
  const counts = perVisitor.rows.map((row) => Number(row.n) || 0)
  const returning = counts.filter((n) => n > 1).length
  const uniques = Number(totals.rows[0]?.uniques ?? 0) || 0
  return {
    sessions: Number(totals.rows[0]?.sessions ?? 0) || 0,
    uniques,
    avgSeconds: Math.round(Number(totals.rows[0]?.avg_seconds ?? 0) || 0),
    avgReturns: counts.length ? Math.round((counts.reduce((sum, n) => sum + n, 0) / counts.length) * 10) / 10 : 0,
    returnRate: uniques ? Math.round((returning / uniques) * 100) : 0,
    places: places.rows.map((place) => ({
      label: place.city ? `${place.city}, ${place.country}` : place.country || "Onbekend",
      country: place.country || "Onbekend",
      city: place.city || "",
      visits: Number(place.visits) || 0,
      people: Number(place.people) || 0,
    })),
    days: lastDays(
      daily.rows.map((row) => ({
        day: row.day,
        visits: Number(row.visits) || 0,
        people: Number(row.people) || 0,
      })),
    ),
    recent: recent.rows.map((row) => ({
      at: row.at instanceof Date ? row.at.toISOString() : String(row.at),
      ip: row.ip || "",
      city: row.city || "",
      country: row.country || "Onbekend",
      path: row.path || "/",
      seconds: Number(row.seconds) || 0,
    })),
  }
}

export default async (request) => {
  try {
    if (request.method !== "POST") {
      return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    }
    const body = await request.json().catch(() => null)
    const token = typeof body?.token === "string" ? body.token : ""
    if (!(await accountFromToken(token))) {
      return Response.json({ error: "Geen toegang" }, { status: 401 })
    }
    const databaseUrl = process.env.DATABASE_URL?.trim()
    if (!databaseUrl) {
      return Response.json(
        { error: "De database is niet gekoppeld op Netlify. Zet daar de variabele DATABASE_URL." },
        { status: 500 },
      )
    }
    const pool = new pg.Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("supabase") ? { rejectUnauthorized: false } : undefined,
      max: 1,
      connectionTimeoutMillis: 8000,
    })
    try {
      return Response.json(await load(pool))
    } finally {
      await pool.end()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: `Cijfers laden mislukt: ${message}` }, { status: 500 })
  }
}
