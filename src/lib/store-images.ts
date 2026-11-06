import { uploadMedia } from "@/lib/media-store"
import type { SiteData } from "@/lib/site-types"

async function walk(value: unknown, token: string, cache: Map<string, string>): Promise<unknown> {
  if (typeof value === "string" && value.startsWith("data:image/")) {
    const known = cache.get(value)
    if (known) return known
    const result = await uploadMedia({ data: { token, dataUrl: value } })
    cache.set(value, result.url)
    return result.url
  }
  if (Array.isArray(value)) {
    const next = []
    for (const item of value) next.push(await walk(item, token, cache))
    return next
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) next[key] = await walk(item, token, cache)
    return next
  }
  return value
}

/** Move embedded photos out of the site document so a save stays small. */
export async function externalizeImages(site: SiteData, token: string): Promise<SiteData> {
  if (!JSON.stringify(site).includes("data:image/")) return site
  return (await walk(site, token, new Map())) as SiteData
}
