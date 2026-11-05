import { createFileRoute } from "@tanstack/react-router"
import { CustomPageView } from "@/components/custom-page"
import { clip, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/pagina/$slug")({
  head: ({ params, matches }) => {
    const { origin, site } = seoContext(matches)
    const page = site?.pages?.find((item) => item.slug === params.slug && item.status === "published")
    const text = page?.blocks?.map((block) => block.text).find((value) => value.trim()) || ""
    if (!page) {
      return pageHead({ title: "Pagina", description: "Deze pagina staat niet live.", path: `/pagina/${params.slug}`, origin, index: false })
    }
    return pageHead({
      title: page.title,
      description: clip(text || page.title),
      path: `/pagina/${page.slug}`,
      origin,
    })
  },
  component: function PaginaRoute() {
    const { slug } = Route.useParams()
    return <CustomPageView slug={slug} />
  },
})

