import { createFileRoute } from "@tanstack/react-router"
import { getSql } from "@/lib/db"
import { ensureMediaTable } from "@/lib/media-store"

export const Route = createFileRoute("/media/u/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await ensureMediaTable()
        const sql = await getSql()
        const rows = await sql<{ content_type: string; data: string }>`
          select content_type, encode(bytes, 'base64') as data
          from site_media
          where id = ${params.id}
        `
        const row = rows[0]
        if (!row?.data) return new Response("Niet gevonden", { status: 404 })
        const bytes = Buffer.from(row.data, "base64")
        return new Response(bytes, {
          headers: {
            "content-type": row.content_type || "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        })
      },
    },
  },
})
