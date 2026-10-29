import { useMemo, useState, type ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Heart,
  Linkedin,
  Mail,
  Menu,
  Megaphone,
  Mic,
  Newspaper,
  Smile,
  Twitter,
  Users,
  Waypoints,
  X,
  Youtube,
} from "lucide-react"
import { useSiteData } from "@/lib/data-service"
import type { Project, Socials } from "@/lib/site-types"
import { ProjectCard, ProjectDialog } from "@/components/project-views"
import { BlogCard } from "@/components/blog-page"

const NAV: { label: string; href?: string; to?: "/blog" }[] = [
  { href: "#home", label: "Home" },
  { href: "#over", label: "Over" },
  { href: "#wat", label: "Wat" },
  { href: "#wie", label: "Wie" },
  { href: "#projecten", label: "Projecten" },
  { to: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
]

const STYLE_ICONS = [Heart, BadgeCheck, Smile]
const SERVICE_ICONS = [Megaphone, Waypoints, Users, Mic, Newspaper, Building2]

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

function SocialLink({
  href,
  label,
  tone = "ink",
  children,
}: {
  href: string
  label: string
  tone?: "ink" | "paper"
  children: ReactNode
}) {
  if (!href) return null
  const color = tone === "paper" ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-paper hover:text-accent"
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-full transition ${color}`}
    >
      {children}
    </a>
  )
}

function SocialsRow({ socials, tone = "ink" }: { socials: Socials; tone?: "ink" | "paper" }) {
  return (
    <div className="flex items-center">
      <SocialLink href={socials.youtube} label="YouTube" tone={tone}>
        <Youtube className="h-4 w-4" />
      </SocialLink>
      <SocialLink href={socials.vimeo} label="Vimeo" tone={tone}>
        <VimeoIcon />
      </SocialLink>
      <SocialLink href={socials.x} label="X" tone={tone}>
        <Twitter className="h-4 w-4" />
      </SocialLink>
      <SocialLink href={socials.flickr} label="Flickr" tone={tone}>
        <FlickrIcon />
      </SocialLink>
      <SocialLink href={socials.linkedin} label="LinkedIn" tone={tone}>
        <Linkedin className="h-4 w-4" />
      </SocialLink>
    </div>
  )
}

function NavItems({ onNavigate, itemClass }: { onNavigate?: () => void; itemClass: string }) {
  return (
    <>
      {NAV.map((item) =>
        item.to ? (
          <Link key={item.to} to={item.to} onClick={onNavigate} className={itemClass}>
            {item.label}
          </Link>
        ) : (
          <a key={item.href} href={item.href} onClick={onNavigate} className={itemClass}>
            {item.label}
          </a>
        ),
      )}
    </>
  )
}

export function SitePage() {
  const { data } = useSiteData()
  const { copy, design } = data
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState("Alles")
  const [active, setActive] = useState<Project | null>(null)
  const [sentNote, setSentNote] = useState("")

  const published = data.projects.filter((project) => project.status === "published")
  const categories = useMemo(() => {
    const set = new Set(published.map((project) => project.category).filter(Boolean))
    return ["Alles", ...set]
  }, [published])
  const visible = filter === "Alles" ? published : published.filter((project) => project.category === filter)
  const latestPosts = (data.posts ?? []).filter((post) => post.status === "published").slice(0, 3)

  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const message = String(form.get("message") || "")
    const body = encodeURIComponent(`${name}\n${email}\n\n${message}`)
    const subject = encodeURIComponent("Bericht via DE CONNECTORS")
    window.location.href = `mailto:${copy.email}?subject=${subject}&body=${body}`
    setSentNote("Je e-mailprogramma opent met dit bericht.")
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xs font-extrabold text-paper">
              DC
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold tracking-wide">DE CONNECTORS</span>
              <span className="block text-xs text-muted">Celebrating People</span>
            </span>
          </a>
          <nav className="ml-auto hidden items-center lg:flex">
            <NavItems itemClass="rounded-full px-2.5 py-2 text-sm font-semibold text-ink-soft hover:text-ink" />
          </nav>
          <div className="hidden items-center xl:flex">
            <SocialsRow socials={design.socials} />
          </div>
          <Link
            to="/admin"
            className="ml-1 hidden min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-semibold text-ink hover:border-accent lg:inline-flex"
          >
            Beheer
          </Link>
          <button
            type="button"
            className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-card lg:hidden"
            aria-label={menuOpen ? "Sluit menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen ? (
          <div className="border-t border-line bg-card px-4 py-3 lg:hidden">
            <NavItems
              onNavigate={() => setMenuOpen(false)}
              itemClass="block min-h-11 py-3 font-semibold"
            />
            <div className="flex items-center justify-between pt-2">
              <SocialsRow socials={design.socials} />
              <Link to="/admin" className="min-h-11 rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper">
                Beheer
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section id="home" className="scroll-mt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Breda · sinds 2003</p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-3 font-story text-3xl italic text-accent sm:text-4xl">{copy.heroTagline}</p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{copy.heroSubtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projecten"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink"
                >
                  Bekijk onze projecten
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-11 items-center rounded-full border border-ink bg-transparent px-5 py-2.5 text-sm font-bold text-ink"
                >
                  Get in touch
                </a>
                <Link
                  to="/blog"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold text-ink"
                >
                  {copy.blogButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -bottom-3 -right-3 h-full w-full rounded-card bg-accent" />
                <img
                  src={copy.whoPhoto}
                  alt={copy.whoName}
                  className="relative aspect-[4/5] w-full rounded-card object-cover object-top"
                />
              </div>
              <p className="relative mt-4 text-sm text-muted">
                <span className="font-semibold text-ink">{copy.whoName}</span> — {copy.whoRole}
              </p>
            </div>
          </div>
        </section>

        <section id="over" className="scroll-mt-24 border-t border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Over</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {copy.aboutTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-ink">{copy.aboutLead}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <p className="leading-relaxed text-ink-soft">{copy.aboutLeft}</p>
              <p className="leading-relaxed text-ink-soft">{copy.aboutRight}</p>
            </div>
            <h3 className="mt-16 font-display text-2xl font-extrabold">{copy.stylesTitle}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {copy.styles.map((card, index) => {
                const Icon = STYLE_ICONS[index % STYLE_ICONS.length]
                return (
                  <article key={card.title} className="rounded-card border border-line bg-paper p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-5 font-display text-lg font-extrabold">{card.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="wat" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Wat</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {copy.servicesTitle}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.services.map((service, index) => {
                const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length]
                return (
                  <article key={service.title} className="rounded-card border border-line bg-card p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-accent" />
                      <span className="font-display text-sm font-bold text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-extrabold leading-tight">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
          <div className="bg-ink text-paper">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
              <p className="font-story text-3xl italic sm:text-4xl">{copy.bannerText}</p>
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <section id="wie" className="scroll-mt-24 bg-card">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <img
              src={copy.whoPhoto}
              alt={copy.whoName}
              className="aspect-[4/5] w-full rounded-card object-cover object-top"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Wie</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.whoTitle}</h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">{copy.whoBody}</p>
              <p className="mt-6 font-display text-lg font-extrabold">{copy.whoName}</p>
              <p className="text-sm text-muted">{copy.whoRole}</p>
              <a href={`mailto:${copy.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                <Mail className="h-4 w-4" />
                {copy.email}
              </a>
            </div>
          </div>
          <div className="border-y border-line bg-paper">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <blockquote className="max-w-4xl font-story text-3xl italic leading-snug text-ink sm:text-5xl">
                <span className="text-accent">“</span>
                {copy.quote}
                <span className="text-accent">”</span>
              </blockquote>
            </div>
          </div>
          <div className="py-12">
            <p className="px-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-muted">
              {copy.clientsTitle}
            </p>
            <div className="mt-8 overflow-hidden">
              <div className="marquee-track flex w-max items-center gap-14 pr-14">
                {[...design.clients, ...design.clients].map((client, index) => (
                  <div key={`${client.id}-${index}`} className="flex h-14 items-center">
                    {client.image ? (
                      <img src={client.image} alt={client.name} className="h-10 w-auto max-w-40 object-contain" />
                    ) : (
                      <span className="font-display text-lg font-extrabold text-ink">{client.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projecten" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Projecten</p>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Blik op onze projecten
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
                      filter === category ? "bg-ink text-paper" : "border border-line bg-card text-ink"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {visible.length ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((project) => (
                  <ProjectCard key={project.id} project={project} onOpen={() => setActive(project)} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-ink-soft">Nog geen gepubliceerde projecten in deze categorie.</p>
            )}
          </div>
        </section>

        <section className="scroll-mt-24 border-t border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Blog</p>
                <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.blogTitle}</h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{copy.blogLead}</p>
              </div>
              <Link
                to="/blog"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper"
              >
                {copy.blogButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {latestPosts.length ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="mt-8 text-ink-soft">Er staan nog geen blogs live.</p>
            )}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-ink text-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Contact</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.contactTitle}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/80">{copy.contactLead}</p>
              <a href={`mailto:${copy.email}`} className="mt-6 inline-flex text-lg font-bold text-paper underline decoration-accent underline-offset-4">
                {copy.email}
              </a>
              <div className="mt-6">
                <SocialsRow socials={design.socials} tone="paper" />
              </div>
            </div>
            <form onSubmit={submitContact} className="rounded-card bg-card p-6 text-ink sm:p-8">
              <label className="block text-sm font-semibold" htmlFor="name">
                Naam
              </label>
              <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
              <label className="mt-4 block text-sm font-semibold" htmlFor="email">
                E-mail
              </label>
              <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
              <label className="mt-4 block text-sm font-semibold" htmlFor="message">
                Bericht
              </label>
              <textarea id="message" name="message" required rows={5} className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
              <button type="submit" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">
                Verstuur
              </button>
              {sentNote ? <p className="mt-3 text-sm text-muted">{sentNote}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">© De Connectors · Celebrating People</p>
          <SocialsRow socials={design.socials} />
        </div>
      </footer>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  )
}
