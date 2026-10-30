import { getSql } from "@/lib/db"

const ADMIN_USER = "admin"
const ADMIN_PASSWORD = "Admin"

export type Analytics = {
  sessions: number
  uniques: number
  avgSeconds: number
  avgReturns: number
  returnRate: number
  places: { label: string; country: string; city: string; visits: number; people: number }[]
  days: { day: string; label: string; visits: number; people: number }[]
}

export async function ensureVisitTable() {
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

function amsterdamDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}
function dayLabel(day: string) {
  const date = new Date(`${day}T12:00:00`)
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(date)
}

function lastDays(rows: { day: string; visits: number; people: number }[]) {
  const byDay = new Map(rows.map((row) => [row.day, row]))
  const days: Analytics["days"] = []
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

export async function loadAnalytics(): Promise<Analytics> {
  const sql = await ensureVisitTable()
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
    limit 8
  `
  const daily = await sql<{ day: string; visits: string; people: string }>`
    select to_char(started_at at time zone 'Europe/Amsterdam', 'YYYY-MM-DD') as day,
           count(*)::text as visits,
           count(distinct visitor_id)::text as people
    from site_visit
    where started_at > now() - interval '14 days'
    group by 1
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
    days: lastDays(
      daily.map((row) => ({
        day: row.day,
        visits: Number(row.visits) || 0,
        people: Number(row.people) || 0,
      })),
    ),
  }
}

export async function handleStatsRequest(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null
    const username = typeof body?.username === "string" ? body.username : ""
    const password = typeof body?.password === "string" ? body.password : ""
    if (username.toLowerCase() !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Geen toegang" }, { status: 401 })
    }
    if (!process.env.DATABASE_URL?.trim()) {
      return Response.json(
        { error: "De database is niet gekoppeld op Netlify. Zet daar de variabele DATABASE_URL." },
        { status: 500 },
      )
    }
    return Response.json(await loadAnalytics())
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: `Cijfers laden mislukt: ${message}` }, { status: 500 })
  }
}
