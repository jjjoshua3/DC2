import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"
import { Secret, TOTP } from "otpauth"
import QRCode from "qrcode"

const FROM = "DE CONNECTORS <aa0271n8@gmail.com>"
const TOTP_CHANCE = 0.28
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
  await pool.query(`
    create table if not exists site_totp (
      email text primary key,
      secret text not null,
      enabled boolean not null default false,
      login_count integer not null default 0,
      last_verified_at timestamptz
    )
  `)
}

async function sendLink(email, name, link) {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")
  if (!password) {
    throw new Error("GMAIL_APP_PASSWORD ontbreekt op Netlify. Zet daar het app-wachtwoord van aa0271n8@gmail.com.")
  }
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: "aa0271n8@gmail.com", pass: password },
  })
  await transport.sendMail({
    from: FROM,
    to: email,
    subject: "Inloglink DE CONNECTORS",
    text: `Hoi ${name},\n\nHier is je inloglink voor het beheer. De link is 30 minuten geldig en werkt één keer.\n\n${link}\n`,
    html: `<p>Hoi ${name},</p><p>Hier is je inloglink voor het beheer. De link is 30 minuten geldig en werkt één keer.</p><p><a href="${link}">Open het beheer</a></p>`,
  })
}

function totpFor(email, secret) {
  return new TOTP({
    issuer: "DE CONNECTORS",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  })
}

function codeOk(email, secret, code) {
  const value = String(code || "").replace(/\s/g, "")
  if (!/^\d{6}$/.test(value)) return false
  return totpFor(email, secret).validate({ token: value, window: 1 }) !== null
}

async function totpState(pool, email) {
  const found = await pool.query(`select secret, enabled, login_count, last_verified_at from site_totp where email = $1`, [
    email,
  ])
  return found.rows[0] || null
}

async function needsChallenge(row) {
  if (!row?.enabled) return false
  const stale =
    !row.last_verified_at || Date.now() - new Date(row.last_verified_at).getTime() > 14 * 24 * 60 * 60 * 1000
  return stale || Math.random() < TOTP_CHANCE
}

async function accountFromSession(pool, token) {
  if (!token) return null
  const found = await pool.query(
    `select email from site_session where token_hash = $1 and expires_at > now()`,
    [hashToken(token)],
  )
  const email = found.rows[0]?.email?.trim().toLowerCase() ?? ""
  return ADMINS[email] ? { email, ...ADMINS[email] } : null
}

export default async (request) => {
  try {
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    const origin = request.headers.get("origin") || "https://deconnectors2.netlify.app"
    return await withDb(async (pool) => {
      await ensureTables(pool)
      const action = typeof body?.action === "string" ? body.action : ""
      if (action === "totp-setup" || action === "totp-confirm" || action === "totp-verify") {
        const account = await accountFromSession(pool, body?.token)
        if (!account) return Response.json({ error: "Log opnieuw in." }, { status: 401 })
        if (action === "totp-setup") {
          const existing = await totpState(pool, account.email)
          const secret = existing?.secret || new Secret({ size: 20 }).base32
          if (!existing) {
            await pool.query(`insert into site_totp (email, secret) values ($1, $2)`, [account.email, secret])
          }
          const uri = totpFor(account.email, secret).toString()
          const qr = await QRCode.toDataURL(uri, { margin: 1, width: 240 })
          return Response.json({ ok: true, qr, secret })
        }
        const row = await totpState(pool, account.email)
        if (!row) return Response.json({ error: "Authenticator is nog niet ingesteld." }, { status: 400 })
        if (!codeOk(account.email, row.secret, body?.code)) {
          return Response.json({ error: "De code is onjuist." }, { status: 401 })
        }
        await pool.query(
          `update site_totp set enabled = true, login_count = login_count + 1, last_verified_at = now() where email = $1`,
          [account.email],
        )
        return Response.json({ ok: true })
      }
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
        const totp = await totpState(pool, row.email)
        let step = "skip"
        if (!totp?.enabled) step = "setup"
        else if (await needsChallenge(totp)) step = "challenge"
        else await pool.query(`update site_totp set login_count = login_count + 1 where email = $1`, [row.email])
        return Response.json({
          ok: true,
          token: session,
          account: { email: row.email, ...ADMINS[row.email] },
          totp: step,
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
      const outboxId = crypto.randomUUID()
      await pool.query(`insert into site_magic_outbox (id, email, link) values ($1, $2, $3)`, [
        outboxId,
        email,
        link,
      ])
      await sendLink(email, ADMINS[email].name, link)
      await pool.query(`update site_magic_outbox set sent_at = now() where id = $1`, [outboxId])
      return Response.json({ ok: true })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
