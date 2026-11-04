import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "@/components/site-pages"

export const Route = createFileRoute("/projecten")({ component: ProjectsPage })
