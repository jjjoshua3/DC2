import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"

const ADMINS = {
  "joshua.bosma@kpnmail.nl": { name: "Joshua Bosma", role: "Webdeveloper" },
  "stefanie@deconnectors.com": { name: "Stefanie Vermeulen", role: "Eigenaar" },
}
const STATUSES = new Set(["nieuw", "gezien", "bezig", "klaar"])

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex")
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
      status text not null default 'nieuw',
      reply text not null default ''
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

function rowOut(row) {
  return {
    id: row.id,
    at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    site: row.site,
    authorEmail: row.author_email,
    authorName: row.author_name,
    message: row.message,
    status: row.status,
    reply: row.reply || "",
  }
}

async function notifyJoshua(item) {
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
    to: "joshua.bosma@kpnmail.nl",
    replyTo: item.author_email,
    subject: `Feedback van ${item.author_name}`,
    text: `${item.author_name} (${item.author_email}) stuurde feedback via DE CONNECTORS.\n\n${item.message}\n`,
  })
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
        const inserted = await pool.query(
          `insert into site_feedback (id, author_email, author_name, message)
           values ($1, $2, $3, $4)
           returning *`,
          [id, account.email, account.name, message],
        )
        const item = inserted.rows[0]
        await notifyJoshua(item).catch(() => {})
        return Response.json({ ok: true, item: rowOut(item) })
      }

      if (action === "update") {
        if (account.role !== "Webdeveloper") return Response.json({ error: "Geen toegang" }, { status: 403 })
        const id = typeof body?.id === "string" ? body.id : ""
        const status = typeof body?.status === "string" ? body.status : ""
        const reply = typeof body?.reply === "string" ? body.reply.trim().slice(0, 2000) : ""
        if (!STATUSES.has(status)) return Response.json({ error: "Onbekende status" }, { status: 400 })
        const updated = await pool.query(
          `update site_feedback set status = $2, reply = $3, updated_at = now() where id = $1 returning *`,
          [id, status, reply],
        )
        if (!updated.rows[0]) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        return Response.json({ ok: true, item: rowOut(updated.rows[0]) })
      }

      const rows =
        account.role === "Webdeveloper"
          ? await pool.query(`select * from site_feedback order by created_at desc limit 80`)
          : await pool.query(`select * from site_feedback where author_email = $1 order by created_at desc limit 80`, [
              account.email,
            ])
      return Response.json({ items: rows.rows.map(rowOut) })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
