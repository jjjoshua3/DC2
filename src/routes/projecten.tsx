import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "@/components/site-pages"
import { PAGES, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/projecten")({
  component: ProjectsPage,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({ title: PAGES.projects.title, description: PAGES.projects.description, path: "/projecten", origin })
  },
})

