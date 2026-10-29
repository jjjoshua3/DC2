import { createFileRoute } from "@tanstack/react-router"
import { BlogArticle } from "@/components/blog-page"

export const Route = createFileRoute("/blog/$postId")({
  component: function PostRoute() {
    const { postId } = Route.useParams()
    return <BlogArticle postId={postId} />
  },
})
