import type { PageCopy, Post, Project, SiteData } from "@/lib/site-types"

const COPY_LABELS: Record<keyof PageCopy, string> = {
  heroTitle: "hoofdtitel",
  heroTagline: "ondertitel",
  heroSubtitle: "intro",
  aboutTitle: "over-titel",
  aboutLead: "over-lead",
  aboutLeft: "over-links",
  aboutRight: "over-rechts",
  stylesTitle: "stijlen-titel",
  styles: "stijlen",
  servicesTitle: "diensten-titel",
  services: "diensten",
  bannerText: "banner",
  whoTitle: "wie-titel",
  whoBody: "wie-tekst",
  whoName: "naam",
  whoRole: "rol",
  whoPhoto: "foto",
  quote: "quote",
  clientsTitle: "klanten-titel",
  contactTitle: "contact-titel",
  contactLead: "contact-lead",
  email: "e-mail",
  blogTitle: "blog-titel",
  blogLead: "blog-lead",
  blogButton: "blog-knop",
}

function nameOf(item: { title?: string } | undefined, fallback = "zonder titel") {
  const title = item?.title?.trim()
  return title || fallback
}

function projectFields(before: Project, after: Project) {
  const fields: string[] = []
  if (before.title !== after.title) fields.push("titel")
  if (before.category !== after.category) fields.push("categorie")
  if (before.status !== after.status) fields.push(after.status === "published" ? "live gezet" : "op concept gezet")
  if (before.lead !== after.lead) fields.push("samenvatting")
  if (before.body !== after.body) fields.push("verhaal")
  if (before.mediaUrl !== after.mediaUrl || before.mediaType !== after.mediaType) fields.push("hoofdmedia")
  if (before.poster !== after.poster) fields.push("poster")
  if (JSON.stringify(before.gallery) !== JSON.stringify(after.gallery)) fields.push("extra foto’s")
  if (before.ctaLabel !== after.ctaLabel || before.ctaUrl !== after.ctaUrl) fields.push("actieknop")
  return fields
}

function postFields(before: Post, after: Post) {
  const fields: string[] = []
  if (before.title !== after.title) fields.push("titel")
  if (before.date !== after.date) fields.push("datum")
  if (before.status !== after.status) fields.push(after.status === "published" ? "live gezet" : "op concept gezet")
  if (before.lead !== after.lead) fields.push("samenvatting")
  if (before.body !== after.body) fields.push("verhaal")
  if (before.image !== after.image) fields.push("foto")
  return fields
}

function orderChanged(before: { id: string }[], after: { id: string }[]) {
  if (before.length !== after.length) return false
  return before.some((item, index) => item.id !== after[index]?.id)
}

export function describeChange(before: SiteData, after: SiteData): { summary: string; detail: string } {
  const lines: string[] = []
  const beforeProjects = new Map(before.projects.map((item) => [item.id, item]))
  const afterProjects = new Map(after.projects.map((item) => [item.id, item]))
  for (const item of after.projects) {
    const old = beforeProjects.get(item.id)
    if (!old) lines.push(`Nieuw project: ${nameOf(item)}`)
    else {
      const fields = projectFields(old, item)
      if (fields.length) lines.push(`Project “${nameOf(item, nameOf(old))}” aangepast: ${fields.join(", ")}`)
    }
  }
  for (const item of before.projects) {
    if (!afterProjects.has(item.id)) lines.push(`Project verwijderd: ${nameOf(item)}`)
  }
  if (orderChanged(before.projects, after.projects)) lines.push("Volgorde van projecten gewijzigd")

  const beforePosts = new Map((before.posts ?? []).map((item) => [item.id, item]))
  const afterPosts = new Map((after.posts ?? []).map((item) => [item.id, item]))
  for (const item of after.posts ?? []) {
    const old = beforePosts.get(item.id)
    if (!old) lines.push(`Nieuw blog: ${nameOf(item)}`)
    else {
      const fields = postFields(old, item)
      if (fields.length) lines.push(`Blog “${nameOf(item, nameOf(old))}” aangepast: ${fields.join(", ")}`)
    }
  }
  for (const item of before.posts ?? []) {
    if (!afterPosts.has(item.id)) lines.push(`Blog verwijderd: ${nameOf(item)}`)
  }
  if (orderChanged(before.posts ?? [], after.posts ?? [])) lines.push("Volgorde van blogs gewijzigd")

  for (const key of Object.keys(COPY_LABELS) as (keyof PageCopy)[]) {
    if (JSON.stringify(before.copy[key]) !== JSON.stringify(after.copy[key])) {
      lines.push(`Paginatekst aangepast: ${COPY_LABELS[key]}`)
    }
  }
  if (before.design.accent !== after.design.accent) lines.push(`Accentkleur gewijzigd naar ${after.design.accent}`)
  if (before.design.headingFont !== after.design.headingFont) lines.push("Lettertype van de koppen gewijzigd")
  if (JSON.stringify(before.design.socials) !== JSON.stringify(after.design.socials)) lines.push("Socials aangepast")
  if (JSON.stringify(before.design.clients) !== JSON.stringify(after.design.clients)) lines.push("Logo’s / organisaties aangepast")

  if (!lines.length) return { summary: "Wijziging opgeslagen", detail: "Geen zichtbaar verschil in de inhoud." }
  return { summary: lines[0], detail: lines.join(" · ") }
}
