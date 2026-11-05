import { createFileRoute } from "@tanstack/react-router"
import { GedichtenPage } from "@/components/site-pages"

export const Route = createFileRoute("/gedichten")({ component: GedichtenPage })
