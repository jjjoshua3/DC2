import { createFileRoute } from "@tanstack/react-router"
import { BlogArticle } from "@/components/blog-page"
import { PAGES, clip, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/blog/$postId")({
  head: ({ params, matches }) => {
    const { origin, site } = seoContext(matches)
    const post = site?.posts?.find((item) => item.id === params.postId && item.status === "published")
    if (!post) {
      return pageHead({ title: PAGES.blog.title, description: PAGES.blog.description, path: `/blog/${params.postId}`, origin, index: false })
    }
    return pageHead({
      title: post.title,
      description: clip(post.lead || post.body || PAGES.blog.description),
      path: `/blog/${post.id}`,
      origin,
    })
  },
  component: function PostRoute() {
    const { postId } = Route.useParams()
    return <BlogArticle postId={postId} />
  },
})

