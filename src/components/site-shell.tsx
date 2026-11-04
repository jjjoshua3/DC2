import { useState, type ReactNode } from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { Linkedin, Menu, Twitter, X, Youtube } from "lucide-react"
import { useSiteData } from "@/lib/data-service"
import type { Socials } from "@/lib/site-types"
import { toEmbedUrl } from "@/lib/media"

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/over", label: "Over mij" },
  { to: "/wat", label: "Wat" },
  { to: "/projecten", label: "Projecten" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const

function FlickrIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <circle cx="7.2" cy="12" r="3.1" fill="currentColor" />
      <circle cx="16.8" cy="12" r="3.1" fill="currentColor" />
    </svg>
  )
}

function VimeoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M22.4 7.1c-.1 2.2-1.6 5.2-4.5 9-3 4-5.6 6-7.7 6-1.3 0-2.4-1.2-3.3-3.6L5.6 13.4c-.6-2.3-1.3-3.4-2-3.4-.2 0-.7.3-1.7 1L.8 9.6c1.1-1 2.2-2 3.3-3 1.5-1.3 2.6-2 3.4-2.1 1.8-.2 2.9 1.1 3.3 3.7.5 2.6.8 4.2 1 4.9.6 2.5 1.2 3.8 1.9 3.8.6 0 1.4-.9 2.6-2.8 1.1-1.8 1.7-3.2 1.8-4.2.2-1.6-.5-2.4-1.9-2.4-.7 0-1.4.2-2.1.5 1.5-4.8 4.2-7.1 8.2-7 3 .1 4.4 2 4.1 6.1z"
      />
    </svg>
  )
}

function SocialLink({ href, label, tone = "ink", children }: { href: string; label: string; tone?: "ink" | "paper"; children: ReactNode }) {
  if (!href) return null
  const color = tone === "paper" ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-paper hover:text-accent"
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={`grid h-11 w-11 place-items-center rounded-full transition ${color}`}>
      {children}
    </a>
  )
}

export function SocialsRow({ socials, tone = "ink" }: { socials: Socials; tone?: "ink" | "paper" }) {
  return (
    <div className="flex items-center">
      <SocialLink href={socials.youtube} label="YouTube" tone={tone}><Youtube className="h-4 w-4" /></SocialLink>
      <SocialLink href={socials.vimeo} label="Vimeo" tone={tone}><VimeoIcon /></SocialLink>
      <SocialLink href={socials.x} label="X" tone={tone}><Twitter className="h-4 w-4" /></SocialLink>
      <SocialLink href={socials.flickr} label="Flickr" tone={tone}><FlickrIcon /></SocialLink>
      <SocialLink href={socials.linkedin} label="LinkedIn" tone={tone}><Linkedin className="h-4 w-4" /></SocialLink>
    </div>
  )
}

function active(path: string, to: string) {
  if (to === "/") return path === "/"
  return path === to || path.startsWith(`${to}/`)
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { data } = useSiteData()
  const path = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xs font-extrabold text-paper">
              DC
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold tracking-wide">DE CONNECTORS</span>
              <span className="block text-xs text-muted">Celebrating People</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center lg:flex">
            {LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-2.5 py-2 text-sm font-semibold ${active(path, item.to) ? "text-accent" : "text-ink-soft hover:text-ink"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center xl:flex">
            <SocialsRow socials={data.design.socials} />
          </div>
          <Link to="/admin" className="ml-1 hidden min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-semibold text-ink hover:border-accent lg:inline-flex">
            Beheer
          </Link>
          <button type="button" className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <nav className="border-t border-line px-4 py-3 lg:hidden">
            {LINKS.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex min-h-11 items-center text-base font-semibold">
                {item.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="flex min-h-11 items-center text-base font-semibold">
              Beheer
            </Link>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            <p>© De Connectors · Celebrating People</p>
            <p className="mt-1">
              Ontworpen door Joshua. Beveiligingslek melden? Dat kan via:{" "}
              <a className="underline decoration-line underline-offset-2 hover:text-ink" href="mailto:aa0271n8@gmail.com">
                aa0271n8@gmail.com
              </a>
            </p>
          </div>
          <SocialsRow socials={data.design.socials} />
        </div>
      </footer>
    </div>
  )
}

export function ClientLogos() {
  const { data } = useSiteData()
  const clients = data.design.clients
  if (!clients.length) return null
  return (
    <div className="border-t border-line py-14">
      <p className="px-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-muted">{data.copy.clientsTitle}</p>
      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 justify-items-center gap-5 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {clients.map((client) => (
          <div key={client.id} className="grid h-36 w-full max-w-64 place-items-center rounded-2xl bg-ink px-6 sm:h-40">
            {client.image ? (
              <img src={client.image} alt={client.name} className="max-h-24 w-auto max-w-full object-contain sm:max-h-28" />
            ) : (
              <span className="text-center font-display text-xl font-extrabold text-paper">{client.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MediaPane({ type, url, label }: { type: "image" | "video"; url: string; label: string }) {
  const embed = type === "video" ? toEmbedUrl(url) : null
  if (embed) {
    return (
      <div className="aspect-video overflow-hidden rounded-card bg-ink">
        <iframe title={label} src={embed} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    )
  }
  if (type === "video" && url) {
    return <video src={url} controls className="aspect-video w-full rounded-card bg-ink" />
  }
  if (url) return <img src={url} alt="" className="aspect-[4/3] w-full rounded-card object-cover" />
  return <div className="grid aspect-[4/3] place-items-center rounded-card bg-ink px-6 text-center font-display text-lg font-bold text-paper">Beeld volgt</div>
}

export function Poem() {
  const { data } = useSiteData()
  const lines = data.copy.poem.split("\n").map((line) => line.trim()).filter(Boolean)
  if (!lines.length) return null
  return (
    <div className="border-y border-line bg-paper">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-14">
        {lines.map((line) =>
          /geschreven door/i.test(line) ? (
            <p key={line} className="mt-4 text-sm text-muted">{line}</p>
          ) : (
            <p key={line} className="font-story text-2xl italic leading-snug text-ink sm:text-4xl">{line}</p>
          ),
        )}
      </div>
    </div>
  )
}
