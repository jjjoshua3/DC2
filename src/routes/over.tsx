import { createFileRoute } from "@tanstack/react-router"
import { OverPage } from "@/components/site-pages"

export const Route = createFileRoute("/over")({ component: OverPage })
