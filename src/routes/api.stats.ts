import { createFileRoute } from "@tanstack/react-router"
import { handleStatsRequest } from "@/lib/analytics"

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      POST: ({ request }) => handleStatsRequest(request),
    },
  },
})