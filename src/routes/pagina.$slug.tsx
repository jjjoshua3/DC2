import { createFileRoute } from "@tanstack/react-router"
import { CustomPageView } from "@/components/custom-page"

export const Route = createFileRoute("/pagina/$slug")({
  component: function PaginaRoute() {
    const { slug } = Route.useParams()
    return <CustomPageView slug={slug} />
  },
})
