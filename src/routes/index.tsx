import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/site-pages"
import { HOME, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/")({
  component: HomePage,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({ title: HOME.title, description: HOME.description, path: "/", origin })
  },
})

