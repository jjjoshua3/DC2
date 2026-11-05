import { createFileRoute } from "@tanstack/react-router"
import { buildSitemap, originFromRequest } from "@/lib/seo.server"

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(originFromRequest()), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
})
