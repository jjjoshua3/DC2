import type { SiteData } from "@/lib/site-types"

export const SITE_ORIGIN_FALLBACK = "https://deconnectors2.netlify.app"

export const HOME = {
  title: "DE CONNECTORS | Celebrating People",
  description:
    "Stefanie Vermeulen maakt journalistieke en artistieke verhalen die mensen een stem geven. Freelance journalist en producer, DE CONNECTORS.",
}

export const PAGES = {
  projects: {
    title: "Projecten",
    description: "Kranten, documentaires, live events en samenwerkingen van Stefanie Vermeulen. De projecten van DE CONNECTORS.",
  },
  blog: {
    title: "Blog",
    description: "Achtergronden, verslagen en notities van Stefanie Vermeulen. Het blog van DE CONNECTORS.",
  },
  contact: {
    title: "Contact",
    description: "Neem contact op met Stefanie Vermeulen van DE CONNECTORS. Een koffie, een verhaal of een eerste vraag.",
  },
  wat: {
    journalistiek: {
      title: "Journalistiek",
      description: "Journalistieke producties van Stefanie Vermeulen. Verhalen en interviews waarin mensen zelf aan het woord komen.",
    },
    artistiek: {
      title: "Artistiek",
      description: "Stories en gedichten van Stefanie Vermeulen. Artistiek werk van DE CONNECTORS, met een eigen vorm en stem.",
    },
    "artistiek-journalistiek": {
      title: "Artistiek journalistiek",
      description: "Journalistiek en kunst in één productie. Stefanie Vermeulen maakt verhalen die kloppen en blijven hangen.",
    },
  },
} as const

export function clip(value: string, max = 158) {
  const text = value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, "")
  return `${cut || text.slice(0, max - 1)}…`
}

export function pageTitle(title: string) {
  const clean = title.trim()
  if (!clean) return HOME.title
  if (/de connectors/i.test(clean)) return clean
  return `${clean} | DE CONNECTORS`
}

export function pageHead(input: { title: string; description: string; path: string; origin: string; index?: boolean; canonical?: boolean }) {
  const title = pageTitle(input.title)
  const description = clip(input.description)
  const origin = (input.origin || SITE_ORIGIN_FALLBACK).replace(/\/$/, "")
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`
  const url = `${origin}${path}`
  const index = input.index !== false
  const canonical = index && input.canonical !== false
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: index ? "index, follow, max-image-preview:large" : "noindex, nofollow" },
      { property: "og:locale", content: "nl_NL" },
      { property: "og:site_name", content: "DE CONNECTORS" },
    ],
    links: canonical ? [{ rel: "canonical", href: url }] : [],
  }
}

export function seoContext(matches: ReadonlyArray<{ routeId: string; loaderData?: unknown }>) {
  const root = matches.find((match) => match.routeId === "__root__")
  const data = root?.loaderData as { site?: string | null; origin?: string } | undefined
  const origin = data?.origin || SITE_ORIGIN_FALLBACK
  let site: SiteData | null = null
  if (data?.site) {
    try {
      const parsed = JSON.parse(data.site) as SiteData
      if (parsed?.copy && Array.isArray(parsed.projects)) site = parsed
    } catch {
      site = null
    }
  }
  return { origin, site }
}

export function organizationJsonLd(origin: string) {
  const base = origin.replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "DE CONNECTORS",
        url: `${base}/`,
        slogan: "Celebrating People",
        description: HOME.description,
        founder: { "@id": `${base}/#stefanie` },
      },
      {
        "@type": "Person",
        "@id": `${base}/#stefanie`,
        name: "Stefanie Vermeulen",
        jobTitle: "Journalist en producer",
        url: `${base}/`,
        worksFor: { "@id": `${base}/#organization` },
        sameAs: ["https://www.linkedin.com/in/stefanie-vermeulen-89424111"],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: "DE CONNECTORS",
        inLanguage: "nl-NL",
        publisher: { "@id": `${base}/#organization` },
      },
    ],
  }
}
