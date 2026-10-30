import { ipFromHeaders, lookupPlace } from "@/lib/analytics"
import { accountFromToken, adminAccount } from "@/lib/admins"
import { getSql } from "@/lib/db"

async function ensureAuditTable() {
  const sql = await getSql()
  await sql`
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
  `
  return sql
}

async function writeEvent(input: {
  kind: string
  username: string
  ip: string
  city: string
  country: string
  ok: boolean | null
  summary: string
  detail: string
}) {
  const sql = await ensureAuditTable()
  const id = crypto.randomUUID()
  await sql`
    insert into site_audit (id, kind, username, ip, city, country, ok, summary, detail)
    values (
      ${id},
      ${input.kind},
      ${input.username.slice(0, 80)},
      ${input.ip.slice(0, 80)},
      ${input.city.slice(0, 80)},
      ${input.country.slice(0, 80)},
      ${input.ok},
      ${input.summary.slice(0, 240)},
      ${input.detail.slice(0, 2000)}
    )
  `
}

export async function handleAuditRequest(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => null)) as {
      action?: unknown
      username?: unknown
      token?: unknown
      summary?: unknown
      detail?: unknown
      ok?: unknown
    } | null
    const action = typeof body?.action === "string" ? body.action : ""
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : ""
    const token = typeof body?.token === "string" ? body.token : ""
    const ip = ipFromHeaders(request.headers)
    const place = await lookupPlace(ip)
    const account = token ? await accountFromToken(token) : null

    if (action === "login") {
      const known = adminAccount(username)
      await writeEvent({
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
      await writeEvent({
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

    if (!account) {
      return Response.json({ error: "Geen toegang" }, { status: 401 })
    }

    if (action === "logout") {
      await writeEvent({
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
      await writeEvent({
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
      const sql = await ensureAuditTable()
      const events = await sql<{
        id: string
        at: string
        kind: string
        username: string
        ip: string
        city: string
        country: string
        ok: boolean | null
        summary: string
        detail: string
      }>`
        select id, at, kind, username, ip, city, country, ok, summary, detail
        from site_audit
        order by at desc
        limit 200
      `
      return Response.json({
        events: events.map((event) => ({
          ...event,
          at: typeof event.at === "string" ? event.at : new Date(event.at as string | number).toISOString(),
        })),
      })
    }

    return Response.json({ error: "Onbekende actie" }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
