import { createFileRoute } from "@tanstack/react-router"
import { ContactPage } from "@/components/site-pages"
import { PAGES, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({ title: PAGES.contact.title, description: PAGES.contact.description, path: "/contact", origin })
  },
})

