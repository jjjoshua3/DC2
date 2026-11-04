import { createFileRoute } from "@tanstack/react-router"
import { WatDetailPage } from "@/components/site-pages"

export const Route = createFileRoute("/wat/$slug")({
  component: function WatSlug() {
    const { slug } = Route.useParams()
    return <WatDetailPage slug={slug} />
  },
})
