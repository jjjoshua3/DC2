import { createFileRoute } from "@tanstack/react-router"

async function contact(request: Request) {
  const { handleContactRequest } = await import("../../netlify/functions/contact.mjs")
  return handleContactRequest(request) as Promise<Response>
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      GET: ({ request }) => contact(request),
      POST: ({ request }) => contact(request),
    },
  },
})
