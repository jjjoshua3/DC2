import { createFileRoute } from "@tanstack/react-router"
import { handleStatsRequest } from "@/lib/stats-query"

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      POST: ({ request }) => handleStatsRequest(request),
    },
  },
})