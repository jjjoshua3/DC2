import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"
import { adminAccount } from "@/lib/admins"

const STATUS: Record<string, string> = {
  nieuw: "open",
  gezien: "bekeken",
  bezig: "open",
  klaar: "opgelost",
  open: "open",
  bekeken: "bekeken",
  gesloten: "gesloten",
  opgelost: "opgelost",
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function cleanStatus(value: string) {
  return STATUS[value] || "open"
}

async function withDb<T>(run: (pool: pg.Pool) => Promise<T>) {
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

async function sendMail(to: string, subject: string, text: string, replyTo?: string) {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")
  if (!password) return
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: "aa0271n8@gmail.com", pass: password },
  })
  await transport.sendMail({ from: "DE CONNECTORS <aa0271n8@gmail.com>", to, replyTo, subject, text }).catch(() => {})
}

export async function handleFeedbackRequest(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      action?: string
      token?: string
      message?: string
      id?: string
      status?: string
    } | null
    const action = body?.action || "list"
    return await withDb(async (pool) => {
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
      const token = typeof body?.token === "string" ? body.token : ""
      const found = token
        ? await pool.query(`select email from site_session where token_hash = $1 and expires_at > now()`, [hashToken(token)])
        : { rows: [] as { email?: string }[] }
      const email = String(found.rows[0]?.email || "").toLowerCase()
      const account = adminAccount(email)
      if (!account) return Response.json({ error: "Log opnieuw in." }, { status: 401 })
      const who = { email, ...account }

      if (action === "create") {
        const message = (body?.message || "").trim()
        if (message.length < 4 || message.length > 4000) {
          return Response.json({ error: "Schrijf een korte, duidelijke feedback." }, { status: 400 })
        }
        const id = randomBytes(12).toString("hex")
        await pool.query(
          `insert into site_feedback (id, author_email, author_name, message, status) values ($1, $2, $3, $4, 'open')`,
          [id, who.email, who.name, message],
        )
        await sendMail("joshua.bosma@kpnmail.nl", `Nieuw ticket van ${who.name}`, `${who.name} opende een ticket.\n\n${message}\n`, who.email)
        return Response.json({ ok: true, item: await loadOne(pool, id) })
      }

      if (action === "reply") {
        const id = body?.id || ""
        const text = (body?.message || "").trim()
        if (text.length < 1 || text.length > 4000) return Response.json({ error: "Schrijf een antwoord." }, { status: 400 })
        const ticket = await pool.query(`select * from site_feedback where id = $1`, [id])
        const row = ticket.rows[0]
        if (!row) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        if (who.role !== "Webdeveloper" && row.author_email !== who.email) {
          return Response.json({ error: "Geen toegang" }, { status: 403 })
        }
        await pool.query(
          `insert into site_feedback_note (id, ticket_id, author_email, author_name, body) values ($1, $2, $3, $4, $5)`,
          [randomBytes(12).toString("hex"), id, who.email, who.name, text],
        )
        if (who.role === "Webdeveloper" && cleanStatus(row.status) === "open") {
          await pool.query(`update site_feedback set status = 'bekeken', updated_at = now() where id = $1`, [id])
        } else {
          await pool.query(`update site_feedback set updated_at = now() where id = $1`, [id])
        }
        const to = who.role === "Webdeveloper" ? row.author_email : "joshua.bosma@kpnmail.nl"
        const subject = who.role === "Webdeveloper" ? "Joshua reageerde op je feedback" : `Antwoord van ${who.name}`
        await sendMail(to, subject, `${who.name}:\n\n${text}\n`, who.email)
        return Response.json({ ok: true, item: await loadOne(pool, id) })
      }

      if (action === "status") {
        if (who.role !== "Webdeveloper") return Response.json({ error: "Geen toegang" }, { status: 403 })
        const status = body?.status || ""
        if (!STATUS[status]) return Response.json({ error: "Onbekende status" }, { status: 400 })
        const updated = await pool.query(`update site_feedback set status = $2, updated_at = now() where id = $1 returning id`, [
          body?.id || "",
          cleanStatus(status),
        ])
        if (!updated.rows[0]) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        return Response.json({ ok: true, item: await loadOne(pool, body?.id || "") })
      }

      const rows =
        who.role === "Webdeveloper"
          ? await pool.query(`select * from site_feedback order by updated_at desc limit 80`)
          : await pool.query(`select * from site_feedback where author_email = $1 order by updated_at desc limit 80`, [who.email])
      const items = []
      for (const row of rows.rows) items.push(await loadOne(pool, row.id))
      return Response.json({ items })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}

async function loadOne(pool: pg.Pool, id: string) {
  const found = await pool.query(`select * from site_feedback where id = $1`, [id])
  const row = found.rows[0]
  if (!row) return null
  const notes = await pool.query(`select * from site_feedback_note where ticket_id = $1 order by created_at`, [id])
  const thread = [
    {
      at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      authorName: row.author_name,
      authorEmail: row.author_email,
      body: row.message,
    },
    ...notes.rows.map((note) => ({
      at: note.created_at instanceof Date ? note.created_at.toISOString() : String(note.created_at),
      authorName: note.author_name,
      authorEmail: note.author_email,
      body: note.body,
    })),
  ]
  if (row.reply && !notes.rows.some((note) => note.body === row.reply)) {
    thread.push({
      at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      authorName: "Joshua Bosma",
      authorEmail: "joshua.bosma@kpnmail.nl",
      body: row.reply,
    })
  }
  return {
    id: row.id,
    at: thread[0].at,
    site: row.site,
    authorEmail: row.author_email,
    authorName: row.author_name,
    message: row.message,
    status: cleanStatus(row.status),
    notes: thread,
  }
}
