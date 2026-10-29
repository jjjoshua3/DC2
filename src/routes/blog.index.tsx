import { createFileRoute } from "@tanstack/react-router"
import { BlogIndex } from "@/components/blog-page"

export const Route = createFileRoute("/blog/")({ component: BlogIndex })
