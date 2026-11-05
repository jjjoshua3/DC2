import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { SITE_ORIGIN_FALLBACK } from "@/lib/seo"

export function originFromRequest() {
  try {
    const req = getRequest()
    const rawHost = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(",")[0].trim()
    const proto = (req.headers.get("x-forwarded-proto") || "https").split(",")[0].trim()
    if (!rawHost) return SITE_ORIGIN_FALLBACK
    return `${proto}://${rawHost}`
  } catch {
    return SITE_ORIGIN_FALLBACK
  }
}

export const fetchPublicOrigin = createServerFn({ method: "GET" }).handler(async () => originFromRequest())
