import { createFileRoute } from "@tanstack/react-router"
import { buildRobots, originFromRequest } from "@/lib/sitemap-data"

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildRobots(originFromRequest()), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
})
