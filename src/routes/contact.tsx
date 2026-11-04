import { createFileRoute } from "@tanstack/react-router"
import { ContactPage } from "@/components/site-pages"

export const Route = createFileRoute("/contact")({ component: ContactPage })
