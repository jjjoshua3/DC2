import { createHash, randomBytes } from "node:crypto"
import pg from "pg"

const ADMINS = {
  "joshua.bosma@kpnmail.nl": { name: "Joshua Bosma", role: "Webdeveloper" },
  "stefanie@deconnectors.com": { name: "Stefanie Vermeulen", role: "Eigenaar" },
}

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

async function ensureTables(pool) {
  await pool.query(`
    create table if not exists site_magic_link (
      id text primary key,
      email text not null,
      token_hash text not null,
      created_at timestamptz not null default now(),
      expires_at timestamptz not null,
      used_at timestamptz
    )
  `)
  await pool.query(`
    create table if not exists site_session (
      token_hash text primary key,
      email text not null,
      created_at timestamptz not null default now(),
      expires_at timestamptz not null
    )
  `)
  await pool.query(`
    create table if not exists site_magic_outbox (
      id text primary key,
      email text not null,
      link text not null,
      created_at timestamptz not null default now(),
      sent_at timestamptz
    )
  `)
}

export default async (request) => {
  try {
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    const origin = request.headers.get("origin") || "https://deconnectors2.netlify.app"
    return await withDb(async (pool) => {
      await ensureTables(pool)
      if (typeof body?.token === "string" && body.token) {
        const found = await pool.query(
          `select id, email from site_magic_link where token_hash = $1 and used_at is null and expires_at > now()`,
          [hashToken(body.token)],
        )
        const row = found.rows[0]
        if (!row || !ADMINS[row.email]) return Response.json({ error: "Deze link is ongeldig of verlopen." }, { status: 401 })
        await pool.query(`update site_magic_link set used_at = now() where id = $1`, [row.id])
        const session = randomBytes(32).toString("base64url")
        await pool.query(
          `insert into site_session (token_hash, email, expires_at) values ($1, $2, now() + interval '14 days')`,
          [hashToken(session), row.email],
        )
        return Response.json({
          ok: true,
          token: session,
          account: { email: row.email, ...ADMINS[row.email] },
        })
      }
      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
      if (!ADMINS[email]) return Response.json({ error: "Dit e-mailadres heeft geen toegang." }, { status: 403 })
      const token = randomBytes(32).toString("base64url")
      await pool.query(
        `insert into site_magic_link (id, email, token_hash, expires_at) values ($1, $2, $3, now() + interval '30 minutes')`,
        [crypto.randomUUID(), email, hashToken(token)],
      )
      const link = `${origin.replace(/\/$/, "")}/admin?magic=${encodeURIComponent(token)}`
      await pool.query(`insert into site_magic_outbox (id, email, link) values ($1, $2, $3)`, [
        crypto.randomUUID(),
        email,
        link,
      ])
      return Response.json({ ok: true })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
