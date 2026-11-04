import { useEffect, useState, type FormEvent } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight, BadgeCheck, Heart, Mail, Smile } from "lucide-react"
import { useSiteData } from "@/lib/data-service"
import type { Project, WatPage, WhoPerson } from "@/lib/site-types"
import { CATEGORIES, projectCategories } from "@/lib/site-types"
import { ProjectCard, ProjectDialog } from "@/components/project-views"
import { ClientLogos, MediaPane, Poem, SiteShell, SocialsRow } from "@/components/site-shell"

const STYLE_ICONS = [Heart, BadgeCheck, Smile]

function PhotoShow({ photos, alt }: { photos: string[]; alt: string }) {
  const frames = photos.filter(Boolean)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (frames.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % frames.length), 4500)
    return () => window.clearInterval(timer)
  }, [frames.length])
  const src = frames[index % Math.max(frames.length, 1)]
  if (!src) {
    return <div className="grid aspect-[4/5] place-items-center rounded-card bg-ink font-display text-lg font-bold text-paper">Foto volgt</div>
  }
  return (
    <div className="relative">
      <img src={src} alt={alt} className="aspect-[4/5] w-full rounded-card object-cover object-top" />
      {frames.length > 1 ? (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {frames.map((photo, dot) => (
            <button
              key={`${photo}-${dot}`}
              type="button"
              aria-label={`Foto ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-2.5 w-2.5 rounded-full ${dot === index % frames.length ? "bg-accent" : "bg-paper"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function WhoBlock({ person, title }: { person: WhoPerson; title?: string }) {
  const { data } = useSiteData()
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
      <PhotoShow photos={person.photos} alt={person.name} />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Wie</p>
        {title ? <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h2> : null}
        {person.text ? <p className="mt-6 text-lg leading-relaxed text-ink-soft">{person.text}</p> : null}
        <p className="mt-6 font-display text-lg font-extrabold">{person.name}</p>
        <p className="text-sm text-muted">{person.role}</p>
        <a href={`mailto:${data.copy.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <Mail className="h-4 w-4" />
          {data.copy.email}
        </a>
      </div>
    </div>
  )
}

export function HomePage() {
  const { data } = useSiteData()
  const { copy } = data
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{copy.heroTagline}</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">{copy.heroTitle}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{copy.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projecten" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">
              Bekijk mijn projecten <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 py-2.5 text-sm font-bold">
              Get in touch
            </Link>
            <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold">
              {copy.blogButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-card bg-accent" />
            <div className="relative">
              <PhotoShow photos={copy.people[0]?.photos ?? []} alt={copy.people[0]?.name || copy.whoName} />
            </div>
          </div>
          <p className="relative mt-4 text-sm text-muted">
            <span className="font-semibold text-ink">{copy.people[0]?.name || copy.whoName}</span> — {copy.people[0]?.role || copy.whoRole}
          </p>
        </div>
      </section>
      <ClientLogos />
    </SiteShell>
  )
}

export function OverPage() {
  const { data } = useSiteData()
  const { copy } = data
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Over mij</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.aboutTitle}</h1>
        <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed">{copy.aboutLead}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="leading-relaxed text-ink-soft">{copy.aboutLeft}</p>
          <p className="leading-relaxed text-ink-soft">{copy.aboutRight}</p>
        </div>
        <h2 className="mt-16 font-display text-2xl font-extrabold">{copy.stylesTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {copy.styles.map((card, index) => {
            const Icon = STYLE_ICONS[index % STYLE_ICONS.length]
            return (
              <article key={card.title} className="rounded-card border border-line bg-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.text}</p>
              </article>
            )
          })}
        </div>
      </section>
      <section className="bg-card">
        {copy.people.map((person, index) => (
          <WhoBlock key={person.id} person={person} title={index === 0 ? copy.whoTitle : undefined} />
        ))}
      </section>
      <Poem />
      <ClientLogos />
    </SiteShell>
  )
}

export function WatIndexPage() {
  const { data } = useSiteData()
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Wat</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{data.copy.servicesTitle}</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {data.wat.map((page) => (
            <Link key={page.slug} to="/wat/$slug" params={{ slug: page.slug }} className="group overflow-hidden rounded-card border border-line bg-card">
              <MediaPane type={page.mediaType} url={page.mediaUrl} label={page.title} />
              <span className="block p-5">
                <span className="font-display text-2xl font-extrabold">{page.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{page.lead}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent">
                  Bekijk <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}

export function WatDetailPage({ slug }: { slug: string }) {
  const { data } = useSiteData()
  const page = data.wat.find((item) => item.slug === slug)
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <WatTabs current={slug} />
        {page ? <WatBody page={page} /> : <p className="mt-10 text-ink-soft">Deze pagina bestaat niet.</p>}
      </section>
    </SiteShell>
  )
}

function WatTabs({ current }: { current: string }) {
  const { data } = useSiteData()
  return (
    <div className="flex flex-wrap gap-2">
      {data.wat.map((page) => (
        <Link
          key={page.slug}
          to="/wat/$slug"
          params={{ slug: page.slug }}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${
            page.slug === current ? "bg-ink text-paper" : "border border-line bg-card"
          }`}
        >
          {page.title}
        </Link>
      ))}
    </div>
  )
}

function WatBody({ page }: { page: WatPage }) {
  return (
    <div className="mt-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <MediaPane type={page.mediaType} url={page.mediaUrl} label={page.title} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Wat</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-xl font-semibold leading-relaxed">{page.lead}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{page.body}</p>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Voorbeeld</p>
        <div className="mt-4 max-w-3xl">
          <MediaPane type={page.exampleType} url={page.exampleUrl} label={`${page.title} voorbeeld`} />
        </div>
      </div>
      <div className="mt-16">
        <h2 className="font-display text-3xl font-extrabold">{page.offerTitle}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">{page.offerText}</p>
        <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
          {page.cards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-card border border-line bg-card shadow-sm">
              {card.image ? (
                <img src={card.image} alt="" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[4/3] place-items-center bg-ink px-6 text-center font-display text-lg font-bold text-paper">{card.title}</div>
              )}
              <div className="p-5">
                <h3 className="font-display text-xl font-extrabold leading-tight">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectsPage() {
  const { data } = useSiteData()
  const [filter, setFilter] = useState("Alles")
  const [active, setActive] = useState<Project | null>(null)
  const published = data.projects.filter((project) => project.status === "published")
  const visible = filter === "Alles" ? published : published.filter((project) => projectCategories(project).includes(filter))
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Projecten</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="max-w-xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Blik op mijn projecten</h1>
          <div className="flex flex-wrap gap-2">
            {["Alles", ...CATEGORIES].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold ${filter === category ? "bg-ink text-paper" : "border border-line bg-card"}`}
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
      </section>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </SiteShell>
  )
}

export function ContactPage() {
  const { data } = useSiteData()
  const { copy } = data
  const [sentNote, setSentNote] = useState("")
  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const message = String(form.get("message") || "")
    const body = encodeURIComponent(`${name}\n${email}\n\n${message}`)
    window.location.href = `mailto:${copy.email}?subject=${encodeURIComponent("Bericht via DE CONNECTORS")}&body=${body}`
    setSentNote("Je e-mailprogramma opent met dit bericht.")
  }
  return (
    <SiteShell>
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Contact</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.contactTitle}</h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/80">{copy.contactLead}</p>
            <a href={`mailto:${copy.email}`} className="mt-6 inline-flex text-lg font-bold underline decoration-accent underline-offset-4">
              {copy.email}
            </a>
            <div className="mt-6">
              <SocialsRow socials={data.design.socials} tone="paper" />
            </div>
          </div>
          <form onSubmit={submitContact} className="rounded-card bg-card p-6 text-ink sm:p-8">
            <label className="block text-sm font-semibold" htmlFor="name">Naam</label>
            <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <label className="mt-4 block text-sm font-semibold" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <label className="mt-4 block text-sm font-semibold" htmlFor="message">Bericht</label>
            <textarea id="message" name="message" required rows={5} className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <button type="submit" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">Verstuur</button>
            {sentNote ? <p className="mt-3 text-sm text-muted">{sentNote}</p> : null}
          </form>
        </div>
      </section>
    </SiteShell>
  )
}
