import { createFileRoute } from "@tanstack/react-router"
import { WatIndexPage } from "@/components/site-pages"

export const Route = createFileRoute("/wat/")({ component: WatIndexPage })
