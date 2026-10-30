import { createServerFn } from "@tanstack/react-start"
import { getSql } from "@/lib/db"
import { accountFromToken } from "@/lib/admins"

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
    const token = (input as { token?: unknown }).token
    const document = (input as { document?: unknown }).document
    if (typeof token !== "string" || typeof document !== "string") throw new Error("Ongeldige invoer")
    if (document.length > 6_000_000) throw new Error("De site is te groot om op te slaan")
    JSON.parse(document)
    return { token, document }
  })
  .handler(async ({ data }) => {
    const account = await accountFromToken(data.token)
    if (!account) throw new Error("Geen toegang")
    const sql = await getSql()
    await sql`
      insert into site_document (id, data, updated_at)
      values ('main', ${data.document}::jsonb, now())
      on conflict (id) do update set data = excluded.data, updated_at = now()
    `
    return { ok: true as const }
  })
