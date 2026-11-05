import { createFileRoute } from "@tanstack/react-router"
import { WatIndexPage } from "@/components/site-pages"
import { pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/wat/")({
  component: WatIndexPage,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({
      title: "Wat ik doe",
      description: "Journalistiek, artistiek en artistiek journalistiek. Het werk van Stefanie Vermeulen, DE CONNECTORS.",
      path: "/wat",
      origin,
    })
  },
})

