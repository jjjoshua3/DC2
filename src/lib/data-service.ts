import { useEffect, useState } from "react"
import { defaultSite } from "@/lib/site-defaults"
import type { SiteData } from "@/lib/site-types"
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

export function normalizeSite(value: SiteData): SiteData {
  const next = clone(value)
  if (!Array.isArray(next.posts)) next.posts = clone(defaultSite.posts)
  const base = clone(defaultSite.copy)
  next.copy = { ...base, ...next.copy }
  if (!Array.isArray(next.copy.styles) || next.copy.styles.length === 0) next.copy.styles = base.styles
  if (!Array.isArray(next.copy.services) || next.copy.services.length === 0) next.copy.services = base.services
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
    const accent = /^#[0-9a-fA-F]{6}$/.test(data.design.accent) ? data.design.accent : "#8C734B"
    root.style.setProperty("--color-accent", accent)
    root.style.setProperty("--color-accent-ink", inkForAccent(accent))
    root.style.setProperty(
      "--font-display",
      '"Cormorant Garamond", Georgia, "Times New Roman", serif',
    )
  }, [data.design.accent, data.design.headingFont])

  return { data, ready }
}
