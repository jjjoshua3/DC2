import { createFileRoute } from "@tanstack/react-router"
import { BlogIndex } from "@/components/blog-page"
import { PAGES, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: ({ matches }) => {
    const { origin } = seoContext(matches)
    return pageHead({ title: PAGES.blog.title, description: PAGES.blog.description, path: "/blog", origin })
  },
})

