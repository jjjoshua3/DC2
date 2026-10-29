import { useMemo, useState, type ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  Linkedin,
  Mail,
  Menu,
  Twitter,
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
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
          <a href="#home" className="min-w-0">
            <span className="block font-display text-xl font-medium tracking-[0.18em]">DE CONNECTORS</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.28em] text-muted">Celebrating People</span>
          </a>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            <NavItems itemClass="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft hover:text-ink" />
          </nav>
          <Link
            to="/admin"
            className="hidden border border-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper lg:inline-flex"
          >
            Beheer
          </Link>
          <button
            type="button"
            className="ml-auto grid h-11 w-11 place-items-center border border-line lg:hidden"
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
          <div className="mx-auto grid max-w-6xl items-end gap-12 px-4 py-16 sm:py-24 lg:grid-cols-12 lg:py-28">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Breda · sinds 2003
              </p>
              <h1 className="mt-6 font-display text-6xl font-medium leading-[0.88] text-ink sm:text-7xl lg:text-8xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-6 max-w-md font-story text-3xl italic leading-snug text-accent sm:text-4xl">{copy.heroTagline}</p>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">{copy.heroSubtitle}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#projecten"
                  className="inline-flex min-h-11 items-center gap-3 bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-paper"
                >
                  Bekijk onze projecten
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink underline decoration-accent underline-offset-4"
                >
                  Get in touch
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="border border-accent p-2">
                <img
                  src={copy.whoPhoto}
                  alt={copy.whoName}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted">
                <span className="text-ink">{copy.whoName}</span> — {copy.whoRole}
              </p>
            </div>
          </div>
        </section>

        <section id="over" className="scroll-mt-24 border-t border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Over
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-none sm:text-6xl">
              {copy.aboutTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-ink">{copy.aboutLead}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <p className="leading-relaxed text-ink-soft">{copy.aboutLeft}</p>
              <p className="leading-relaxed text-ink-soft">{copy.aboutRight}</p>
            </div>
            <h3 className="mt-16 font-display text-3xl font-medium">{copy.stylesTitle}</h3>
            <div className="mt-8 grid gap-px bg-line md:grid-cols-3">
              {copy.styles.map((card, index) => (
                <article key={card.title} className="bg-paper p-8">
                  <p className="font-display text-3xl text-accent">{String(index + 1).padStart(2, "0")}</p>
                  <h4 className="mt-4 font-display text-2xl font-medium">{card.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="wat" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Wat
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-none sm:text-6xl">
              {copy.servicesTitle}
            </h2>
            <div className="mt-12 divide-y divide-line border-y border-line">
              {copy.services.map((service, index) => (
                <article key={service.title} className="grid gap-3 py-7 sm:grid-cols-[5rem_1fr_2fr] sm:items-baseline sm:gap-8">
                  <span className="font-display text-2xl text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-3xl font-medium leading-tight">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="bg-ink text-paper">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 sm:flex-row sm:items-end">
              <p className="max-w-3xl font-story text-4xl italic leading-tight sm:text-5xl">{copy.bannerText}</p>
              <a
                href="#contact"
                className="inline-flex items-center border border-accent px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-paper"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <section id="wie" className="scroll-mt-24 bg-card">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <div className="border border-accent p-2">
              <img
                src={copy.whoPhoto}
                alt={copy.whoName}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Wie
              </p>
              <h2 className="mt-4 font-display text-5xl font-medium leading-none sm:text-6xl">{copy.whoTitle}</h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">{copy.whoBody}</p>
              <p className="mt-6 font-display text-lg font-semibold">{copy.whoName}</p>
              <p className="text-sm text-muted">{copy.whoRole}</p>
              <a href={`mailto:${copy.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                <Mail className="h-4 w-4" />
                {copy.email}
              </a>
            </div>
          </div>
          <div className="border-y border-line bg-paper">
            <div className="mx-auto max-w-5xl px-4 py-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent">Atelier</p>
              <blockquote className="mt-6 font-story text-4xl italic leading-[1.15] text-ink sm:text-6xl">
                {copy.quote}
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
                      <span className="font-display text-lg font-semibold text-ink">{client.name}</span>
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
              <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
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
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{copy.blogTitle}</h2>
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
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{copy.contactTitle}</h2>
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
          <div className="text-sm text-muted">
            <p>© De Connectors · Celebrating People</p>
            <p className="mt-1">
              Ontworpen door Joshua. Beveiligingslek melden? Dat kan via:{" "}
              <a className="underline decoration-line underline-offset-2 hover:text-ink" href="mailto:aa0271n8@gmail.com">
                aa0271n8@gmail.com
              </a>
            </p>
          </div>
          <SocialsRow socials={design.socials} />
        </div>
      </footer>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  )
}
