import { createServerFn } from "@tanstack/react-start"
import { randomBytes } from "node:crypto"
import { getSql } from "@/lib/db"
import { accountFromToken } from "@/lib/admins"

export async function ensureMediaTable() {
  const sql = await getSql()
  await sql`
    create table if not exists site_media (
      id text primary key,
      content_type text not null,
      bytes bytea not null,
      created_at timestamptz not null default now()
    )
  `
  await sql`alter table site_media enable row level security`
  await sql`alter table site_media force row level security`
}

export const uploadMedia = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Ongeldige invoer")
    const token = (input as { token?: unknown }).token
    const dataUrl = (input as { dataUrl?: unknown }).dataUrl
    if (typeof token !== "string" || typeof dataUrl !== "string") throw new Error("Ongeldige invoer")
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/)
    if (!match) throw new Error("Dit is geen afbeelding")
    return { token, contentType: match[1], base64: match[2].replace(/\s/g, "") }
  })
  .handler(async ({ data }) => {
    const account = await accountFromToken(data.token)
    if (!account) throw new Error("Geen toegang")
    await ensureMediaTable()
    const id = randomBytes(12).toString("hex")
    const sql = await getSql()
    await sql`
      insert into site_media (id, content_type, bytes)
      values (${id}, ${data.contentType}, decode(${data.base64}, 'base64'))
    `
    return { url: `/media/u/${id}` }
  })
