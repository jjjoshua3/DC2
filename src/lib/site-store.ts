import { createServerFn } from "@tanstack/react-start"
import { getSql } from "@/lib/db"

const ADMIN_USER = "admin"
const ADMIN_PASSWORD = "Admin"

function readLogin(input: unknown): { username: string; password: string } {
  if (!input || typeof input !== "object") throw new Error("Ongeldige invoer")
  const username = (input as { username?: unknown }).username
  const password = (input as { password?: unknown }).password
  if (typeof username !== "string" || typeof password !== "string") throw new Error("Ongeldige invoer")
  return { username: username.trim(), password }
}

function allowed(username: string, password: string) {
  return username.toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD
}

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(readLogin)
  .handler(async ({ data }) => {
    return { ok: allowed(data.username, data.password) }
  })

export const fetchSiteDocument = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql()
  const rows = await sql<{ data: string }>`
    select data::text as data from site_document where id = 'main'
  `
  return rows[0]?.data ?? null
})

export const saveSiteDocument = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Ongeldige invoer")
    const username = (input as { username?: unknown }).username
    const password = (input as { password?: unknown }).password
    const document = (input as { document?: unknown }).document
    if (typeof username !== "string" || typeof password !== "string" || typeof document !== "string") {
      throw new Error("Ongeldige invoer")
    }
    if (document.length > 6_000_000) throw new Error("De site is te groot om op te slaan")
    JSON.parse(document)
    return { username: username.trim(), password, document }
  })
  .handler(async ({ data }) => {
    if (!allowed(data.username, data.password)) throw new Error("Geen toegang")
    const sql = await getSql()
    await sql`
      insert into site_document (id, data, updated_at)
      values ('main', ${data.document}::jsonb, now())
      on conflict (id) do update set data = excluded.data, updated_at = now()
    `
    return { ok: true as const }
  })
