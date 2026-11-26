// @ts-nocheck

function poolerUrl(url) {
  if (!url) return url
  return url.replace(/:5432\//, ":6543/")
}
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto"
import pg from "pg"
import nodemailer from "nodemailer"

const TO = "stefanie@deconnectors.com"
const FROM = "DE CONNECTORS <noreply@deconnectors.com>"
const USER = "noreply@deconnectors.com"

function captchaKey() {
  return process.env.CONTACT_CAPTCHA_SECRET || process.env.CONTACT_SMTP_PASS || process.env.DATABASE_URL || "dc-contact-dev"
}

function issueChallenge() {
  const a = randomInt(2, 9)
  const b = randomInt(2, 9)
  const exp = Date.now() + 15 * 60 * 1000
  const sum = `${a}+${b}`
  const answer = String(a + b)
  const sig = createHmac("sha256", captchaKey()).update(`${sum}|${exp}|${answer}`).digest("hex")
  return { question: `${a} + ${b}`, token: `${sum}.${exp}.${sig}` }
}

function validChallenge(token, given) {
  if (typeof token !== "string" || typeof given !== "string") return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [sum, exp, sig] = parts
  const bits = sum.split("+")
  if (bits.length !== 2) return false
  const a = Number(bits[0])
  const b = Number(bits[1])
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 2 || a > 9 || b < 2 || b > 9) return false
  if (Number(exp) < Date.now() || Number(exp) > Date.now() + 16 * 60 * 1000) return false
  const answer = String(a + b)
  const expect = createHmac("sha256", captchaKey()).update(`${sum}|${exp}|${answer}`).digest("hex")
  const left = Buffer.from(sig)
  const right = Buffer.from(expect)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false
  return given.trim() === answer
}

function clientIp(request) {
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("client-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  )
}

function poolFromEnv() {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) return null
  return new pg.Pool({
    connectionString: poolerUrl(databaseUrl),
    ssl: databaseUrl.includes("supabase") ? { rejectUnauthorized: false } : undefined,
    max: 1,
    connectionTimeoutMillis: 8000,
  })
}

async function smtpPassword(pool) {
  const fromEnv = process.env.CONTACT_SMTP_PASS?.trim()
  if (fromEnv) return fromEnv
  if (!pool) return ""
  await pool.query(`create table if not exists site_private (id text primary key, value text not null)`)
  await pool.query(`alter table site_private enable row level security`)
  const found = await pool.query(`select value from site_private where id = 'smtp_pass'`)
  return String(found.rows[0]?.value || "")
}

async function tooFast(pool, hash) {
  if (!pool) return false
  await pool.query(`
    create table if not exists site_contact_hit (
      id bigserial primary key,
      ip_hash text not null,
      created_at timestamptz not null default now()
    )
  `)
  await pool.query(`alter table site_contact_hit enable row level security`)
  const recent = await pool.query(
    `select count(*)::int as n, max(created_at) as last from site_contact_hit where ip_hash = $1 and created_at > now() - interval '1 hour'`,
    [hash],
  )
  const count = recent.rows[0]?.n || 0
  const last = recent.rows[0]?.last ? new Date(recent.rows[0].last).getTime() : 0
  if (count >= 8 || (last && Date.now() - last < 20_000)) return true
  await pool.query(`insert into site_contact_hit (ip_hash) values ($1)`, [hash])
  if (count === 0) await pool.query(`delete from site_contact_hit where created_at < now() - interval '2 days'`)
  return false
}

async function sendMail(password, name, email, message) {
  const transport = nodemailer.createTransport({
    host: "mail.antagonist.nl",
    port: 465,
    secure: true,
    auth: { user: USER, pass: password },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
  })
  const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 120)
  const text = `Nieuw bericht via DE CONNECTORS\n\nNaam: ${name}\nE-mail: ${email}\n\n${message}\n`
  await transport.sendMail({
    from: FROM,
    to: TO,
    cc: email.toLowerCase() === TO ? undefined : email,
    replyTo: email,
    subject: `Bericht van ${safeName} via DE CONNECTORS`,
    text,
  })
}

export async function handleContactRequest(request) {
  try {
    if (request.method === "GET") return Response.json(issueChallenge())
    if (request.method !== "POST") return Response.json({ error: "Method Not Allowed" }, { status: 405 })
    const body = await request.json().catch(() => null)
    if (typeof body?.website === "string" && body.website.trim()) return Response.json({ ok: true })
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim() : ""
    const message = typeof body?.message === "string" ? body.message.trim() : ""
    if (name.length < 1 || name.length > 120) return Response.json({ error: "Vul je naam in." }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      return Response.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 })
    }
    if (message.length < 4 || message.length > 4000) {
      return Response.json({ error: "Schrijf een kort bericht." }, { status: 400 })
    }
    const pool = poolFromEnv()
    try {
      const hash = createHash("sha256").update(clientIp(request)).digest("hex")
      if (await tooFast(pool, hash)) {
        return Response.json({ error: "Even wachten, en dan nog een keer proberen." }, { status: 429 })
      }
      if (!validChallenge(body?.token, typeof body?.answer === "string" ? body.answer : "")) {
        return Response.json({ error: "De som klopt niet. Probeer de nieuwe som." }, { status: 400 })
      }
      const password = await smtpPassword(pool)
      if (!password) return Response.json({ error: "De mail staat nog niet aan." }, { status: 503 })
      await sendMail(password, name, email, message)
      return Response.json({ ok: true })
    } finally {
      await pool?.end()
    }
  } catch {
    return Response.json({ error: "De mailserver nam het bericht niet aan." }, { status: 502 })
  }
}

export default handleContactRequest
