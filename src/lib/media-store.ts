import { createServerFn } from "@tanstack/react-start"
import { randomBytes } from "node:crypto"
import sharp from "sharp"
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

async function optimizeImage(base64: string, contentType: string): Promise<{ bytes: Buffer; contentType: string }> {
  try {
    const input = Buffer.from(base64, "base64")
    const image = sharp(input, { failOn: "none" })
    const meta = await image.metadata()
    const maxWidth = 1600
    let pipeline = image
    if (meta.width && meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })
    }
    // Prefer WebP for size, fall back to original if needed
    const webp = await pipeline.webp({ quality: 80, effort: 4 }).toBuffer()
    if (webp.length < input.length * 0.9 || !contentType.includes("png")) {
      return { bytes: webp, contentType: "image/webp" }
    }
    // Keep original format if WebP didn't help much (e.g. already optimized PNG with transparency)
    const optimized = await pipeline.jpeg({ quality: 82, progressive: true }).toBuffer()
    return { bytes: optimized.length < input.length ? optimized : input, contentType: optimized.length < input.length ? "image/jpeg" : contentType }
  } catch {
    return { bytes: Buffer.from(base64, "base64"), contentType }
  }
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
    const optimized = await optimizeImage(data.base64, data.contentType)
    const id = randomBytes(12).toString("hex")
    const sql = await getSql()
    await sql`
      insert into site_media (id, content_type, bytes)
      values (${id}, ${optimized.contentType}, ${optimized.bytes})
    `
    return { url: `/media/u/${id}` }
  })
