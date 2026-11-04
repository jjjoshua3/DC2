import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/site-pages"

export const Route = createFileRoute("/")({ component: HomePage })
