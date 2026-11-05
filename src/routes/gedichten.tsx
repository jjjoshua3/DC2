import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/gedichten")({
  beforeLoad: () => {
    throw redirect({ to: "/wat/$slug", params: { slug: "artistiek" } })
  },
})

