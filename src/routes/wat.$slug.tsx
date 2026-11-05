import { createFileRoute } from "@tanstack/react-router"
import { WatDetailPage } from "@/components/site-pages"
import { PAGES, clip, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/wat/$slug")({
  validateSearch: (search: Record<string, unknown>): { gedicht?: string } => {
    const gedicht = typeof search.gedicht === "string" ? search.gedicht : ""
    return gedicht ? { gedicht } : {}
  },
  head: (ctx) => {
    const { params, matches } = ctx
    const search = (ctx as { search?: { gedicht?: string } }).search
    const { origin, site } = seoContext(matches)
    const fallback = PAGES.wat[params.slug as keyof typeof PAGES.wat]
    const page = site?.wat?.find((item) => item.slug === params.slug)
    const poem = search?.gedicht ? page?.poems?.find((item) => item.id === search.gedicht) : undefined
    const image = page?.mediaType === "image" ? page.mediaUrl : ""
    if (poem) {
      return pageHead({
        title: poem.title,
        description: clip(poem.body || fallback?.description || page?.lead || ""),
        path: `/wat/${params.slug}?gedicht=${encodeURIComponent(poem.id)}`,
        origin,
        image: poem.image || image,
      })
    }
    return pageHead({
      title: page?.title || fallback?.title || "Wat",
      description: clip(page?.lead || fallback?.description || "Het werk van Stefanie Vermeulen, DE CONNECTORS."),
      path: `/wat/${params.slug}`,
      origin,
      image,
    })
  },
  component: function WatSlug() {
    const { slug } = Route.useParams()
    const { gedicht } = Route.useSearch()
    return <WatDetailPage slug={slug} gedicht={gedicht} />
  },
})


