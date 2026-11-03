import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"
import { adminAccount } from "@/lib/admins"

const STATUSES = new Set(["nieuw", "gezien", "bezig", "klaar"])

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
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

export async function handleFeedbackRequest(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      action?: string
      token?: string
      message?: string
      id?: string
      status?: string
      reply?: string
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
          status text not null default 'nieuw',
          reply text not null default ''
        )
      `)
      const token = typeof body?.token === "string" ? body.token : ""
      const found = token
        ? await pool.query(`select email from site_session where token_hash = $1 and expires_at > now()`, [
            hashToken(token),
          ])
        : { rows: [] }
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
        const inserted = await pool.query(
          `insert into site_feedback (id, author_email, author_name, message) values ($1, $2, $3, $4) returning *`,
          [id, who.email, who.name, message],
        )
        const item = inserted.rows[0]
        const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")
        if (password) {
          const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: "aa0271n8@gmail.com", pass: password },
          })
          await transport
            .sendMail({
              from: "DE CONNECTORS <aa0271n8@gmail.com>",
              to: "joshua.bosma@kpnmail.nl",
              replyTo: who.email,
              subject: `Feedback van ${who.name}`,
              text: `${who.name} stuurde feedback.\n\n${message}\n`,
            })
            .catch(() => {})
        }
        return Response.json({ ok: true, item: mapRow(item) })
      }

      if (action === "update") {
        if (who.role !== "Webdeveloper") return Response.json({ error: "Geen toegang" }, { status: 403 })
        const status = body?.status || ""
        if (!STATUSES.has(status)) return Response.json({ error: "Onbekende status" }, { status: 400 })
        const updated = await pool.query(
          `update site_feedback set status = $2, reply = $3, updated_at = now() where id = $1 returning *`,
          [body?.id || "", status, (body?.reply || "").trim().slice(0, 2000)],
        )
        if (!updated.rows[0]) return Response.json({ error: "Niet gevonden" }, { status: 404 })
        return Response.json({ ok: true, item: mapRow(updated.rows[0]) })
      }

      const rows =
        who.role === "Webdeveloper"
          ? await pool.query(`select * from site_feedback order by created_at desc limit 80`)
          : await pool.query(`select * from site_feedback where author_email = $1 order by created_at desc limit 80`, [
              who.email,
            ])
      return Response.json({ items: rows.rows.map(mapRow) })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}

function mapRow(row: Record<string, unknown>) {
  const at = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
  const updatedAt = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at)
  return {
    id: row.id,
    at,
    updatedAt,
    site: row.site,
    authorEmail: row.author_email,
    authorName: row.author_name,
    message: row.message,
    status: row.status,
    reply: row.reply || "",
  }
}
