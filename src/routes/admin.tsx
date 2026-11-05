import { createFileRoute } from "@tanstack/react-router"
import { AdminGate } from "@/components/admin-gate"
import { pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/admin")({
  component: AdminGate,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({ title: "Beheer", description: "Beheer van DE CONNECTORS.", path: "/admin", origin, index: false })
  },
})

