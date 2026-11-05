import { createFileRoute } from "@tanstack/react-router"
import { WatDetailPage } from "@/components/site-pages"

export const Route = createFileRoute("/wat/$slug")({
  validateSearch: (search: Record<string, unknown>): { gedicht?: string } => {
    const gedicht = typeof search.gedicht === "string" ? search.gedicht : ""
    return gedicht ? { gedicht } : {}
  },
  component: function WatSlug() {
    const { slug } = Route.useParams()
    const { gedicht } = Route.useSearch()
    return <WatDetailPage slug={slug} gedicht={gedicht} />
  },
})

