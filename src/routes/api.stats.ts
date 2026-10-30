import { createFileRoute } from "@tanstack/react-router"
import { adminAllowed, loadAnalytics } from "@/lib/analytics"

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { username?: unknown; password?: unknown }
          const username = typeof body.username === "string" ? body.username : ""
          const password = typeof body.password === "string" ? body.password : ""
          if (!adminAllowed(username, password)) {
            return Response.json({ error: "Geen toegang" }, { status: 401 })
          }
          return Response.json(await loadAnalytics())
        } catch (error) {
          const message = error instanceof Error ? error.message : "Onbekende fout"
          return Response.json({ error: `Cijfers laden mislukt: ${message}` }, { status: 500 })
        }
      },
    },
  },
})
