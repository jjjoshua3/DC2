import { createHash, randomBytes } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"
import { Secret, TOTP } from "otpauth"
import QRCode from "qrcode"
import { adminAccount } from "@/lib/admins"

const TOTP_EVERY = 5

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

async function withDb<T>(run: (sql: import("pg").Pool) => Promise<T>) {
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

async function ensureTables(pool: import("pg").Pool) {
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
    create table if not exists site_totp (
      email text primary key,
      secret text not null,
      enabled boolean not null default false,
      login_count integer not null default 0,
      last_verified_at timestamptz
    )
  `)
}

export async function sessionAccount(token: string) {
  if (!token || token.length < 20) return null
  return withDb(async (pool) => {
    await ensureTables(pool)
    const rows = await pool.query(
      `select email from site_session where token_hash = $1 and expires_at > now()`,
      [hashToken(token)],
    )
    const email = rows.rows[0]?.email as string | undefined
    if (!email) return null
    const account = adminAccount(email)
    if (!account) return null
    return { email, name: account.name, role: account.role }
  })
}

export async function handleMagicRequest(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown
      token?: unknown
      action?: unknown
      code?: unknown
    } | null
    const origin = request.headers.get("origin") || "https://deconnectors2.netlify.app"
    return await withDb(async (pool) => {
      await ensureTables(pool)
      const action = typeof body?.action === "string" ? body.action : ""
      if (action === "totp-setup" || action === "totp-confirm" || action === "totp-verify") {
        const account = await sessionAccount(String(body?.token || ""))
        if (!account) return Response.json({ error: "Log opnieuw in." }, { status: 401 })
        if (action === "totp-setup") {
          const existing = await pool.query(`select secret from site_totp where email = $1`, [account.email])
          const secret = (existing.rows[0]?.secret as string | undefined) || new Secret({ size: 20 }).base32
          if (!existing.rows[0]) {
            await pool.query(`insert into site_totp (email, secret) values ($1, $2)`, [account.email, secret])
          }
          const totp = new TOTP({
            issuer: "DE CONNECTORS",
            label: account.email,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: Secret.fromBase32(secret),
          })
          const qr = await QRCode.toDataURL(totp.toString(), { margin: 1, width: 240 })
          return Response.json({ ok: true, qr, secret })
        }
        const found = await pool.query(`select secret from site_totp where email = $1`, [account.email])
        const secret = found.rows[0]?.secret as string | undefined
        const code = String(body?.code || "").replace(/\s/g, "")
        const totp = secret
          ? new TOTP({
              issuer: "DE CONNECTORS",
              label: account.email,
              algorithm: "SHA1",
              digits: 6,
              period: 30,
              secret: Secret.fromBase32(secret),
            })
          : null
        if (!totp || !/^\d{6}$/.test(code) || totp.validate({ token: code, window: 1 }) === null) {
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
          `select id, email from site_magic_link
           where token_hash = $1 and used_at is null and expires_at > now()`,
          [hashToken(body.token)],
        )
        const row = found.rows[0]
        if (!row) return Response.json({ error: "Deze link is ongeldig of verlopen." }, { status: 401 })
        const account = adminAccount(row.email)
        if (!account) return Response.json({ error: "Geen toegang" }, { status: 401 })
        await pool.query(`update site_magic_link set used_at = now() where id = $1`, [row.id])
        const session = randomBytes(32).toString("base64url")
        await pool.query(
          `insert into site_session (token_hash, email, expires_at) values ($1, $2, now() + interval '14 days')`,
          [hashToken(session), row.email],
        )
        const totp = await pool.query(
          `select enabled, login_count, last_verified_at from site_totp where email = $1`,
          [row.email],
        )
        const state = totp.rows[0] as
          | { enabled: boolean; login_count: number; last_verified_at: string | null }
          | undefined
        const stale =
          !state?.last_verified_at ||
          Date.now() - new Date(state.last_verified_at).getTime() > 14 * 24 * 60 * 60 * 1000
        let step = "skip"
        if (!state?.enabled) step = "setup"
        else if (stale || (state.login_count > 0 && state.login_count % TOTP_EVERY === 0)) step = "challenge"
        else await pool.query(`update site_totp set login_count = login_count + 1 where email = $1`, [row.email])
        return Response.json({
          ok: true,
          token: session,
          account: { email: row.email, name: account.name, role: account.role },
          totp: step,
        })
      }

      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
      const account = adminAccount(email)
      if (!account) return Response.json({ error: "Dit e-mailadres heeft geen toegang." }, { status: 403 })
      const token = randomBytes(32).toString("base64url")
      await pool.query(
        `insert into site_magic_link (id, email, token_hash, expires_at)
         values ($1, $2, $3, now() + interval '30 minutes')`,
        [crypto.randomUUID(), email, hashToken(token)],
      )
      const link = `${origin.replace(/\/$/, "")}/admin?magic=${encodeURIComponent(token)}`
      await pool.query(
        `create table if not exists site_magic_outbox (
          id text primary key,
          email text not null,
          link text not null,
          created_at timestamptz not null default now(),
          sent_at timestamptz
        )`,
      )
      const outboxId = crypto.randomUUID()
      await pool.query(`insert into site_magic_outbox (id, email, link) values ($1, $2, $3)`, [
        outboxId,
        email,
        link,
      ])
      const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "")
      if (!password) {
        throw new Error("GMAIL_APP_PASSWORD ontbreekt. Zet het app-wachtwoord van aa0271n8@gmail.com.")
      }
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: "aa0271n8@gmail.com", pass: password },
      })
      await transport.sendMail({
        from: "DE CONNECTORS <aa0271n8@gmail.com>",
        to: email,
        subject: "Inloglink DE CONNECTORS",
        text: `Hoi ${account.name},\n\nHier is je inloglink voor het beheer. De link is 30 minuten geldig en werkt één keer.\n\n${link}\n`,
        html: `<p>Hoi ${account.name},</p><p>Hier is je inloglink voor het beheer. De link is 30 minuten geldig en werkt één keer.</p><p><a href="${link}">Open het beheer</a></p>`,
      })
      await pool.query(`update site_magic_outbox set sent_at = now() where id = $1`, [outboxId])
      return Response.json({ ok: true })
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
