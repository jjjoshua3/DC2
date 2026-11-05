import { useEffect, useState } from "react"
import { defaultSite } from "@/lib/site-defaults"
import type { SiteData } from "@/lib/site-types"
import { projectCategories } from "@/lib/site-types"
import { inkForAccent } from "@/lib/media"
import { fetchSiteDocument } from "@/lib/site-store"

export const STORAGE_KEY = "deconnectors.site.v1"

type Listener = () => void
const listeners = new Set<Listener>()

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function isSite(value: unknown): value is SiteData {
  if (!value || typeof value !== "object") return false
  const v = value as SiteData
  return Array.isArray(v.projects) && !!v.copy && !!v.design && Array.isArray(v.design.clients)
}

function placeholderPoems(poems: { body?: string }[] | undefined) {
  if (!Array.isArray(poems) || poems.length === 0) return true
  return poems.every((poem) => /plak hier/i.test(poem.body || "") || /^gedicht \d/i.test(poem.body || ""))
}

function withoutMinutes(body: string) {
  const cut = body.search(/verder wil ik in de notulen/i)
  return cut === -1 ? body : body.slice(0, cut).trim()
}

function placeholderLead(lead: string | undefined) {
  if (!lead) return true
  return lead.startsWith("Drie gedichten")
}

export function normalizeSite(value: SiteData): SiteData {
  const next = clone(value)
  if (!Array.isArray(next.posts)) next.posts = clone(defaultSite.posts)
  const base = clone(defaultSite.copy)
  next.copy = { ...base, ...next.copy }
  if (!next.copy.poem) next.copy.poem = base.poem
  if (next.copy.aboutTitle === "Over De Connectors") next.copy.aboutTitle = "Over mij"
  if (next.copy.clientsTitle === "Organisaties voor wie we werkten") {
    next.copy.clientsTitle = "Organisaties waarvoor ik werkte"
  }
  if (next.copy.blogButton === "Naar de blogs") next.copy.blogButton = "Naar mijn blogs"
  const savedPeople = Array.isArray(value.copy?.people) ? value.copy.people : []
  if (savedPeople.length === 0) {
    next.copy.people = [
      {
        id: "stefanie",
        name: next.copy.whoName,
        role: next.copy.whoRole,
        text: next.copy.whoBody,
        photos: next.copy.whoPhoto ? [next.copy.whoPhoto] : [],
      },
    ]
  } else {
    next.copy.people = savedPeople
  }
  next.copy.people = next.copy.people.map((person) => ({
    ...person,
    photos: Array.isArray(person.photos) ? person.photos.filter(Boolean) : [],
  }))
  if (!Array.isArray(next.copy.styles) || next.copy.styles.length === 0) next.copy.styles = base.styles
  if (!Array.isArray(next.copy.services) || next.copy.services.length === 0) next.copy.services = base.services
  const watBase = clone(defaultSite.wat)
  const saved = Array.isArray(next.wat) ? next.wat : []
  next.wat = watBase.map((page) => {
    const found = saved.find((item) => item.slug === page.slug)
    const merged = !found
      ? page
      : {
          ...page,
          ...found,
          cards: Array.isArray(found.cards) && found.cards.length ? found.cards : page.cards,
          poems: (placeholderPoems(found.poems) ? page.poems : found.poems)?.map((poem) => ({
            ...poem,
            body: withoutMinutes(poem.body),
          })),
          poemPageTitle: found.poemPageTitle || page.poemPageTitle,
          poemLead: found.poemLead || (placeholderLead(found.lead) ? found.lead : page.poemLead),
          poemPhoto: found.poemPhoto || (placeholderLead(found.lead) ? found.mediaUrl : page.poemPhoto),
          lead: placeholderLead(found.lead) ? page.lead : found.lead,
          body: placeholderLead(found.lead) && !found.body ? page.body : found.body,
          mediaUrl: placeholderLead(found.lead) ? page.mediaUrl : found.mediaUrl,
          exampleUrl: found.exampleUrl || page.exampleUrl,
          offerText: found.offerText || page.offerText,
        }
    if (merged.slug === "artistiek") {
      return { ...merged, layout: "default" as const, poemPageTitle: merged.poemPageTitle || "Gedichten" }
    }
    return merged
  })
  next.projects = next.projects.map((project) => {
    const categories = projectCategories(project)
    return { ...project, categories, category: categories.join(" · ") }
  })
  return next
}

/** Central data layer. The shared copy lives in the database; this browser keeps a copy too. */
export const DataService = {
  load(): SiteData {
    if (typeof window === "undefined") return clone(defaultSite)
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return clone(defaultSite)
      const parsed: unknown = JSON.parse(raw)
      if (!isSite(parsed)) return clone(defaultSite)
      return normalizeSite(parsed)
    } catch {
      return clone(defaultSite)
    }
  },
  save(data: SiteData) {
    const next = normalizeSite({ ...data, updatedAt: data.updatedAt ?? Date.now() })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    listeners.forEach((listener) => listener())
    return next
  },
  reset() {
    window.localStorage.removeItem(STORAGE_KEY)
    listeners.forEach((listener) => listener())
  },
  exportJson(data: SiteData) {
    return JSON.stringify(data, null, 2)
  },
  importJson(raw: string): SiteData {
    const parsed: unknown = JSON.parse(raw)
    if (!isSite(parsed)) throw new Error("Dit bestand is geen DE CONNECTORS-export.")
    return normalizeSite({ ...parsed, updatedAt: Date.now() })
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(defaultSite)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const local = DataService.load()
    setData(local)
    setReady(true)
    let cancelled = false
    void fetchSiteDocument()
      .then((raw) => {
        if (cancelled || !raw) return
        const parsed: unknown = JSON.parse(raw)
        if (!isSite(parsed)) return
        const remote = normalizeSite(parsed)
        const current = DataService.load()
        if ((remote.updatedAt ?? 0) >= (current.updatedAt ?? 0)) {
          DataService.save(remote)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return DataService.subscribe(() => setData(DataService.load()))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const accent = /^#[0-9a-fA-F]{6}$/.test(data.design.accent) ? data.design.accent : "#E11D48"
    root.style.setProperty("--color-accent", accent)
    root.style.setProperty("--color-accent-ink", inkForAccent(accent))
    root.style.setProperty(
      "--font-display",
      data.design.headingFont === "montserrat"
        ? '"Montserrat", "Plus Jakarta Sans", sans-serif'
        : '"Plus Jakarta Sans", sans-serif',
    )
  }, [data.design.accent, data.design.headingFont])

  return { data, ready }
}
