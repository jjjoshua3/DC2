export type Project = {
  id: string
  title: string
  category: string
  status: "published" | "draft"
  mediaType: "image" | "video"
  mediaUrl: string
  poster: string
  lead: string
  body: string
  gallery: string[]
  ctaLabel: string
  ctaUrl: string
}

export type StyleCard = { title: string; text: string }
export type ServiceCard = { title: string; text: string }

export type PageCopy = {
  heroTitle: string
  heroTagline: string
  heroSubtitle: string
  aboutTitle: string
  aboutLead: string
  aboutLeft: string
  aboutRight: string
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
  quote: string
  clientsTitle: string
  contactTitle: string
  contactLead: string
  email: string
  blogTitle: string
  blogLead: string
  blogButton: string
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
}

export type SiteData = {
  projects: Project[]
  posts: Post[]
  copy: PageCopy
  design: DesignSettings
  updatedAt?: number
}

export const CATEGORIES = ["Project", "Journalistiek", "Video / Docu", "Event"] as const
