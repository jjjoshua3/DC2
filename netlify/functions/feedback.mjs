import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"

const ADMINS = {
  "joshua.bosma@kpnmail.nl": { name: "Joshua Bosma", role: "Webdeveloper" },
  "stefanie@deconnectors.com": { name: "Stefanie Vermeulen", role: "Eigenaar" },
}
const STATUS = {
  nieuw: "open",
  gezien: "bekeken",
  bezig: "open",
  klaar: "opgelost",
  open: "open",
  bekeken: "bekeken",
  gesloten: "gesloten",
  opgelost: "opgelost",
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex")
}

function cleanStatus(value) {
  return STATUS[value] || "open"
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
    create table if not exists site_feedback (
      id text primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      site text not null default 'deconnectors',
      author_email text not null,
      author_name text not null default '',
      message text not null,
      status text not null default 'open',
      reply text not null default ''
    )
  `)
  await pool.query(`
    create table if not exists site_feedback_note (
      id text primary key,
      ticket_id text not null,
      created_at timestamptz not null default now(),
      author_email text not null,
      author_name text not null,
      body text not null
    )
  `)
}

async function accountFromToken(pool, token) {
  if (!token) return null
  const found = await pool.query(
    `select email from site_session where token_hash = $1 and expires_at > now()`,
    [hashToken(token)],
  )
  const email = found.rows[0]?.email?.trim().toLowerCase() ?? ""
  return ADMINS[email] ? { email, ...ADMINS[email] } : null
}

function rowOut(row, notes) {
  const thread = [
    {
      at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      authorName: row.author_name,
      authorEmail: row.author_email,
      body: row.message,
      mine: false,
    },
    ...notes.map((note) => ({
      at: note.created_at instanceof Date ? note.created_at.toISOString() : String(note.created_at),
      authorName: note.author_name,
      authorEmail: note.author_email,
      body: note.body,
      mine: false,
    })),
  ]
  if (row.reply && !notes.some((note) => note.body === row.reply)) {
    thread.push({
      at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      authorName: "Joshua Bosma",
      authorEmail: "joshua.bosma@kpnmail.nl",
      body: row.reply,
      mine: false,
    })
  }
  return {
    id: row.id,
    at: thread[0].at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    site: row.site,
    authorEmail: row.author_email,
    authorName: row.author_name,
    message: row.message,
    status: cleanStatus(row.status),
    notes: thread,
  }
}

async function notesByTicket(pool, ids) {
  const grouped = new Map()
  if (!ids.length) return grouped
  const found = await pool.query(
    `select * from site_feedback_note where ticket_id = any($1::text[]) order by created_at`,
    [ids],
  )
  for (const note of found.rows) {
    const list = grouped.get(note.ticket_id) || []
    list.push(note)
    grouped.set(note.ticket_id, list)
  }
  return grouped
}

async function sendMail(to, subject, text, replyTo) {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")
  if (!password) return
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: "aa0271n8@gmail.com", pass: password },
  })
  await transport.sendMail({
    from: "DE CONNECTORS <aa0271n8@gmail.com>",
    to,
    replyTo,
    subject,
    text,
  })
}

async function loadOne(pool, id) {
  const found = await pool.query(`select * from site_feedback where id = $1`, [id])
  const row = found.rows[0]
  if (!row) return null
  const notes = await notesByTicket(pool, [id])
  return rowOut(row, notes.get(id) || [])
}

export default async (request) => {
  try {
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    const action = typeof body?.action === "string" ? body.action : "list"
    return await withDb(async (pool) => {
      await ensureTable(pool)
      const account = await accountFromToken(pool, typeof body?.token === "string" ? body.token : "")
      if (!account) return Response.json({ error: "Log opnieuw in." }, { status: 401 })

      if (action === "create") {
        const message = typeof body?.message === "string" ? body.message.trim() : ""
        if (message.length < 4 || message.length > 4000) {
          return Response.json({ error: "Schrijf een korte, duidelijke feedback." }, { status: 400 })
        }
        const id = randomBytes(12).toString("hex")
        await pool.query(
          `insert into site_feedback (id, author_email, author_name, message, status) values ($1, $2, $3, $4, 'open')`,
          [id, account.email, account.name, message],
        )
        await sendMail(
          "joshua.bosma@kpnmail.nl",
          `Nieuw ticket van ${account.name}`,
          `${account.name} opende een ticket.\n\n${message}\n`,
          account.email,
        ).catch(() => {})
        return Response.json({ ok: true, item: await loadOne(pool, id) })
      }

      if (action === "reply") {
        const id = typeof body?.id === "string" ? body.id : ""
        const text = typeof body?.message === "string" ? body.message.trim() : ""
        if (text.length < 1 || text.length > 4000) return Response.json({ error: "Schrijf een antwoord." }, { status: 400 })
        const ticket = await pool.query(`select * from site_feedback where id = $1`, [id])
        const row = ticket.rows[0]
        if (!row) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        if (account.role !== "Webdeveloper" && row.author_email !== account.email) {
          return Response.json({ error: "Geen toegang" }, { status: 403 })
        }
        await pool.query(
          `insert into site_feedback_note (id, ticket_id, author_email, author_name, body) values ($1, $2, $3, $4, $5)`,
          [randomBytes(12).toString("hex"), id, account.email, account.name, text],
        )
        if (account.role === "Webdeveloper" && cleanStatus(row.status) === "open") {
          await pool.query(`update site_feedback set status = 'bekeken', updated_at = now() where id = $1`, [id])
        } else {
          await pool.query(`update site_feedback set updated_at = now() where id = $1`, [id])
        }
        if (account.role === "Webdeveloper") {
          await sendMail(row.author_email, "Joshua reageerde op je feedback", `${account.name}:\n\n${text}\n`, account.email).catch(
            () => {},
          )
        } else {
          await sendMail("joshua.bosma@kpnmail.nl", `Antwoord van ${account.name}`, `${account.name}:\n\n${text}\n`, account.email).catch(
            () => {},
          )
        }
        return Response.json({ ok: true, item: await loadOne(pool, id) })
      }

      if (action === "status") {
        if (account.role !== "Webdeveloper") return Response.json({ error: "Geen toegang" }, { status: 403 })
        const id = typeof body?.id === "string" ? body.id : ""
        const status = cleanStatus(typeof body?.status === "string" ? body.status : "")
        if (!STATUS[body?.status]) return Response.json({ error: "Onbekende status" }, { status: 400 })
        const updated = await pool.query(`update site_feedback set status = $2, updated_at = now() where id = $1 returning id`, [
          id,
          status,
        ])
        if (!updated.rows[0]) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        return Response.json({ ok: true, item: await loadOne(pool, id) })
      }

      const rows =
        account.role === "Webdeveloper"
          ? await pool.query(`select * from site_feedback order by updated_at desc limit 80`)
          : await pool.query(
              `select * from site_feedback where author_email = $1 order by updated_at desc limit 80`,
              [account.email],
            )
      const notes = await notesByTicket(
        pool,
        rows.rows.map((row) => row.id),
      )
      return Response.json({ items: rows.rows.map((row) => rowOut(row, notes.get(row.id) || [])) })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
