import { createFileRoute } from "@tanstack/react-router"
import { AdminGate } from "@/components/admin-gate"

export const Route = createFileRoute("/admin")({ component: AdminGate })
