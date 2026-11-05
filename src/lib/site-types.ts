export type LangCode = "en" | "fr" | "de"
export type TextPack = Partial<Record<string, string>>
export type I18nMap = Partial<Record<LangCode, TextPack>>

export type Project = {
  id: string
  title: string
  category: string
  categories?: string[]
  status: "published" | "draft"
  mediaType: "image" | "video"
  mediaUrl: string
  poster: string
  lead: string
  body: string
  gallery: string[]
  ctaLabel: string
  ctaUrl: string
  i18n?: I18nMap
}

export type StyleCard = { title: string; text: string }
export type ServiceCard = { title: string; text: string }
export type WhoPerson = {
  id: string
  name: string
  role: string
  text: string
  photos: string[]
}

export type OfferCard = { title: string; text: string; image: string; i18n?: I18nMap }

export type PoemItem = { id: string; title: string; body: string; i18n?: I18nMap }

export type WatPage = {
  slug: "journalistiek" | "artistiek" | "artistiek-journalistiek"
  title: string
  lead: string
  body: string
  mediaType: "image" | "video"
  mediaUrl: string
  exampleType: "image" | "video"
  exampleUrl: string
  offerTitle: string
  offerText: string
  cards: OfferCard[]
  layout?: "default" | "poems"
  poemPageTitle?: string
  poemLead?: string
  poemPhoto?: string
  poems?: PoemItem[]
  i18n?: I18nMap
}

export type PageCopy = {
  heroTitle: string
  heroTagline: string
  heroSubtitle: string
  aboutTitle: string
  aboutLead: string
  aboutLeft: string
  aboutRight: string
  aboutPhoto: string
  stylesTitle: string
  styles: StyleCard[]
  servicesTitle: string
  services: ServiceCard[]
  bannerText: string
  whoTitle: string
  whoBody: string
  whoName: string
  whoRole: string
  whoPhoto: string
  people: WhoPerson[]
  quote: string
  poem: string
  poemPhoto: string
  clientsTitle: string
  contactTitle: string
  contactLead: string
  email: string
  blogTitle: string
  blogLead: string
  blogButton: string
  i18n?: I18nMap
}

export type ClientLogo = {
  id: string
  name: string
  image: string
}

export type Socials = {
  youtube: string
  vimeo: string
  x: string
  flickr: string
  linkedin: string
}

export type DesignSettings = {
  accent: string
  headingFont: "jakarta" | "montserrat"
  clients: ClientLogo[]
  socials: Socials
}

export type Post = {
  id: string
  title: string
  date: string
  status: "published" | "draft"
  image: string
  lead: string
  body: string
  i18n?: I18nMap
}

export type SiteData = {
  projects: Project[]
  posts: Post[]
  wat: WatPage[]
  copy: PageCopy
  design: DesignSettings
  updatedAt?: number
}

export const CATEGORIES = ["Video / Docu", "Artikel", "Event"] as const

const LEGACY_CATEGORY: Record<string, (typeof CATEGORIES)[number]> = {
  Journalistiek: "Artikel",
  Project: "Artikel",
  Artikel: "Artikel",
  "Video / Docu": "Video / Docu",
  Event: "Event",
}

export function projectCategories(project: { category?: string; categories?: string[] }): string[] {
  const raw = project.categories?.length
    ? project.categories
    : String(project.category || "")
        .split(/[,·]/)
        .map((part) => part.trim())
        .filter(Boolean)
  const mapped = raw
    .map((name) => LEGACY_CATEGORY[name])
    .filter((name): name is (typeof CATEGORIES)[number] => Boolean(name))
  return [...new Set(mapped)]
}
