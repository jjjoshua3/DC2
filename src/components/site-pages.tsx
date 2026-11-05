import { useEffect, useState, type FormEvent } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight, BadgeCheck, Heart, Mail, Smile } from "lucide-react"
import { useLocaleSite, useI18n } from "@/lib/i18n"
import type { PoemItem, Project, WatPage } from "@/lib/site-types"
import { CATEGORIES, projectCategories } from "@/lib/site-types"
import { ProjectCard, ProjectDialog } from "@/components/project-views"
import { ClientLogos, MediaPane, Poem, SiteShell, SocialsRow } from "@/components/site-shell"
import { EditablePhoto, EditableText, publishSite, useEditor } from "@/components/live-edit"
import { compressImage } from "@/lib/media"

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

function ContactBand() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const { copy } = data
  function setCopy(part: Partial<typeof copy>, summary: string) {
    publishSite({ ...data, copy: { ...copy, ...part } }, summary)
  }
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("contact")}</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            <EditableText value={copy.contactTitle} onSave={(contactTitle) => setCopy({ contactTitle }, "Contacttitel aangepast")} />
          </h2>
          <p className="mt-3 leading-relaxed text-paper/80">
            <EditableText value={copy.contactLead} multiline onSave={(contactLead) => setCopy({ contactLead }, "Contacttekst aangepast")} />
          </p>
          <a href={`mailto:${copy.email}`} className="mt-4 inline-flex font-bold underline decoration-accent underline-offset-4">
            {copy.email}
          </a>
        </div>
        <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-accent-ink">
          {t("touch")}
        </Link>
      </div>
    </section>
  )
}

function storiesSubtitle(value?: string) {
  if (!value || value === "Gedichten") return "Stories & Gedichten"
  return value
}

export function HomePage() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const editing = useEditor()
  const { copy } = data
  function setCopy(part: Partial<typeof copy>, summary: string) {
    publishSite({ ...data, copy: { ...copy, ...part } }, summary)
  }
  const person = copy.people[0]
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <EditableText value={copy.heroTagline} onSave={(heroTagline) => setCopy({ heroTagline }, "Tagline aangepast")} />
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            <EditableText value={copy.heroTitle} onSave={(heroTitle) => setCopy({ heroTitle }, "Hoofdtitel aangepast")} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            <EditableText value={copy.heroSubtitle} multiline onSave={(heroSubtitle) => setCopy({ heroSubtitle }, "Intro aangepast")} />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projecten" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">
              {t("seeProjects")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 py-2.5 text-sm font-bold">
              {t("touch")}
            </Link>
            <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold">
              <EditableText value={copy.blogButton} onSave={(blogButton) => setCopy({ blogButton }, "Blogknop aangepast")} />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-card bg-accent" />
            <div className="relative">
              <PhotoShow photos={person?.photos ?? []} alt={person?.name || copy.whoName} />
            </div>
          </div>
          {editing ? (
            <label className="relative mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-card px-4 text-sm font-semibold">
              Foto toevoegen
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file || !person) return
                  void compressImage(file).then((url) => {
                    const people = copy.people.map((item, index) => (index === 0 ? { ...item, photos: [...item.photos, url] } : item))
                    publishSite({ ...data, copy: { ...copy, people, whoPhoto: people[0]?.photos[0] ?? "" } }, "Foto toegevoegd")
                  })
                }}
              />
            </label>
          ) : null}
          <p className="relative mt-4 text-sm text-muted">
            <span className="font-semibold text-ink">
              <EditableText value={person?.name || copy.whoName} onSave={(name) => {
                const people = copy.people.map((item, index) => (index === 0 ? { ...item, name } : item))
                publishSite({ ...data, copy: { ...copy, people, whoName: name } }, "Naam aangepast")
              }} />
            </span>
            {" — "}
            <EditableText value={person?.role || copy.whoRole} onSave={(role) => {
              const people = copy.people.map((item, index) => (index === 0 ? { ...item, role } : item))
              publishSite({ ...data, copy: { ...copy, people, whoRole: role } }, "Rol aangepast")
            }} />
          </p>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          {copy.aboutPhoto || editing ? (
            <div className="relative">
              <div className="absolute -bottom-3 -left-3 h-full w-full rounded-card bg-accent" />
              <div className="relative">
                <EditablePhoto
                  src={copy.aboutPhoto}
                  alt={copy.whoName}
                  className="aspect-[4/5] w-full rounded-card object-cover object-top"
                  onSave={(aboutPhoto) => setCopy({ aboutPhoto }, "Foto bij Over mij toegevoegd")}
                />
              </div>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("about")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
              <EditableText value={copy.aboutTitle} onSave={(aboutTitle) => setCopy({ aboutTitle }, "Over-titel aangepast")} />
            </h2>
            <div className="mt-6 space-y-4">
              <p className="leading-relaxed text-ink-soft">
                <EditableText value={copy.aboutLead} multiline onSave={(aboutLead) => setCopy({ aboutLead }, "Over-tekst aangepast")} />
              </p>
              <p className="leading-relaxed text-ink-soft">
                <EditableText value={copy.aboutLeft} multiline onSave={(aboutLeft) => setCopy({ aboutLeft }, "Over-tekst aangepast")} />
              </p>
              <p className="leading-relaxed text-ink-soft">
                <EditableText value={copy.aboutRight} multiline onSave={(aboutRight) => setCopy({ aboutRight }, "Over-tekst aangepast")} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl font-extrabold tracking-tight">{t("whatIDo")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {data.wat.map((page) => (
            <Link key={page.slug} to="/wat/$slug" params={{ slug: page.slug }} className="group flex h-full flex-col rounded-card border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent">
              <span className="font-display text-2xl font-extrabold">
                <EditableText
                  value={page.title}
                  onSave={(title) =>
                    publishSite(
                      { ...data, wat: data.wat.map((item) => (item.slug === page.slug ? { ...item, title } : item)) },
                      "Titel Wat ik doe aangepast",
                    )
                  }
                />
              </span>
              <span className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                <EditableText
                  value={page.lead}
                  multiline
                  onSave={(lead) =>
                    publishSite(
                      { ...data, wat: data.wat.map((item) => (item.slug === page.slug ? { ...item, lead } : item)) },
                      "Korte tekst Wat ik doe aangepast",
                    )
                  }
                />
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">
                {t("readMore")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <p className="mx-auto max-w-4xl px-4 py-16 text-center font-story text-3xl italic sm:text-5xl">
          <EditableText value={copy.bannerText} onSave={(bannerText) => setCopy({ bannerText }, "Banner aangepast")} />
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <Poem bare />
        {(copy.poemPhoto || editing) ? (
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-card bg-accent" />
            <div className="relative">
              <EditablePhoto
                src={copy.poemPhoto}
                alt=""
                className="aspect-[4/5] w-full rounded-card object-cover object-top"
                onSave={(poemPhoto) => setCopy({ poemPhoto }, "Foto bij spoken word toegevoegd")}
              />
            </div>
          </div>
        ) : null}
      </section>

      {(copy.smaakmaker || editing) ? (
        <section className="mx-auto max-w-3xl px-4 pb-4">
          <div className="rounded-card border border-line bg-card px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Smaakmaker</p>
            <p className="mt-2 leading-relaxed text-ink-soft">
              <EditableText
                value={copy.smaakmaker}
                multiline
                onSave={(smaakmaker) => setCopy({ smaakmaker }, "Tekst Smaakmaker aangepast")}
              />
            </p>
          </div>
        </section>
      ) : null}

      <ClientLogos />
      <ContactBand />
    </SiteShell>
  )
}

export function OverPage() {
  const { data } = useLocaleSite()
  const { copy } = data
  const [first, ...others] = copy.people
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Over mij</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.aboutTitle}</h1>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <PhotoShow photos={first?.photos ?? []} alt={first?.name || copy.whoName} />
            <p className="mt-4 font-display text-lg font-extrabold">{first?.name || copy.whoName}</p>
            <p className="text-sm text-muted">{first?.role || copy.whoRole}</p>
            <a href={`mailto:${copy.email}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Mail className="h-4 w-4" />
              {copy.email}
            </a>
          </div>
          <div className="lg:col-span-7">
            {copy.aboutLead ? <p className="text-xl font-semibold leading-relaxed">{copy.aboutLead}</p> : null}
            <div className="mt-6 grid gap-6">
              {copy.aboutLeft ? <p className="leading-relaxed text-ink-soft">{copy.aboutLeft}</p> : null}
              {copy.aboutRight ? <p className="leading-relaxed text-ink-soft">{copy.aboutRight}</p> : null}
            </div>
          </div>
        </div>
        {others.map((person) => (
          <div key={person.id} className="mt-16 grid items-start gap-10 border-t border-line pt-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <PhotoShow photos={person.photos} alt={person.name} />
            </div>
            <div className="lg:col-span-7">
              <p className="font-display text-2xl font-extrabold">{person.name}</p>
              <p className="mt-1 text-sm text-muted">{person.role}</p>
              {person.text ? <p className="mt-6 leading-relaxed text-ink-soft">{person.text}</p> : null}
            </div>
          </div>
        ))}
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
      <Poem />
    </SiteShell>
  )
}

export function WatIndexPage() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("whatIDo")}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{t("oneVoice")}</h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink-soft lg:col-span-5">{t("chooseLine")}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {data.wat.map((page, index) => {
            const dark = index === 1
            return (
              <Link
                key={page.slug}
                to="/wat/$slug"
                params={{ slug: page.slug }}
                className={`group flex h-full flex-col rounded-card border p-7 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  dark ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-accent"
                }`}
              >
                <span className="font-display text-sm font-bold tracking-[0.2em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 font-display text-3xl font-extrabold leading-tight">{page.title}</span>
                <span className={`mt-4 flex-1 font-story text-base italic leading-relaxed ${dark ? "text-paper/80" : "text-ink-soft"}`}>
                  {page.lead}
                </span>
                <span className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${dark ? "text-paper" : "text-ink"}`}>
                  {t("readMore")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </SiteShell>
  )
}

export function GedichtenPage() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const editing = useEditor()
  const source = data.wat.find((item) => item.slug === "artistiek")
  const photo = source?.poemPhoto || ""
  const lead = source?.poemLead || ""
  function patch(part: Partial<NonNullable<typeof source>>, summary: string) {
    if (!source) return
    publishSite(
      { ...data, wat: data.wat.map((item) => (item.slug === "artistiek" ? { ...item, ...part } : item)) },
      summary,
    )
  }
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("notFoundLabel")}</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          <EditableText value={source?.poemPageTitle || "Gedichten"} onSave={(poemPageTitle) => patch({ poemPageTitle }, "Titel gedichten aangepast")} />
        </h1>
        {photo || lead || editing ? (
          <div className={`mt-10 grid items-center gap-10 ${photo || editing ? "lg:grid-cols-2" : ""}`}>
            {photo || editing ? (
              <div className="relative max-w-md">
                <div className="absolute -bottom-3 -left-3 h-full w-full rounded-card bg-accent" />
                <div className="relative">
                  <EditablePhoto
                    src={photo}
                    alt=""
                    className="aspect-[4/5] w-full rounded-card object-cover object-top"
                    onSave={(poemPhoto) => patch({ poemPhoto }, "Foto bij gedichten toegevoegd")}
                  />
                </div>
              </div>
            ) : null}
            <div>
              <p className="text-xl font-semibold leading-relaxed">
                <EditableText value={lead} multiline onSave={(poemLead) => patch({ poemLead }, "Intro bij gedichten aangepast")} />
              </p>
            </div>
          </div>
        ) : null}
      </section>
      <GedichtenZaal poems={source?.poems ?? []} />
    </SiteShell>
  )
}

export function WatDetailPage({ slug, gedicht = "" }: { slug: string; gedicht?: string }) {
  const { data } = useLocaleSite()
  const page = data.wat.find((item) => item.slug === slug)
  if (page?.slug === "artistiek") return <ArtistiekPage page={page} gedicht={gedicht} />
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <WatTabs current={slug} />
        {page ? <WatBody page={page} /> : <p className="mt-10 text-ink-soft">Deze pagina bestaat niet.</p>}
      </section>
    </SiteShell>
  )
}

function ArtistiekPage({ page, gedicht }: { page: WatPage; gedicht: string }) {
  const { data } = useLocaleSite()
  const poem = (page.poems ?? []).find((item) => item.id === gedicht) || null
  function patch(part: Partial<WatPage>, summary: string) {
    publishSite(
      { ...data, wat: data.wat.map((item) => (item.slug === "artistiek" ? { ...item, ...part } : item)) },
      summary,
    )
  }
  function patchPoem(id: string, part: Partial<PoemItem>, summary: string) {
    patch(
      { poems: (page.poems ?? []).map((item) => (item.id === id ? { ...item, ...part } : item)) },
      summary,
    )
  }
  if (poem) {
    return (
      <SiteShell>
        <article className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 font-story sm:py-16 lg:grid-cols-2">
          <div>
            <PoemPhoto
              src={poem.image || ""}
              onSave={(image) => patchPoem(poem.id, { image }, "Foto bij gedicht toegevoegd")}
            />
          </div>
          <div>
            <Link to="/wat/$slug" params={{ slug: "artistiek" }} search={{ gedicht: "" }} className="text-sm font-semibold text-accent">
              Artistiek
            </Link>
            <h1 className="mt-4 font-story text-4xl italic leading-tight sm:text-5xl">
              <EditableText value={poem.title} onSave={(title) => patchPoem(poem.id, { title }, "Titel gedicht aangepast")} />
            </h1>
            <div className="mt-8 font-story text-xl italic leading-snug text-ink sm:text-2xl">
              <EditableText
                className="whitespace-pre-wrap"
                value={poem.body}
                multiline
                onSave={(body) => patchPoem(poem.id, { body }, "Gedicht aangepast")}
              />
            </div>
          </div>
        </article>
      </SiteShell>
    )
  }
  const intro = page.poemLead?.startsWith("Drie gedichten") ? "" : page.poemLead || ""
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 font-story sm:py-20">
        <h1 className="font-story text-5xl leading-none sm:text-6xl">
          <EditableText value={page.title || "Artistiek"} onSave={(title) => patch({ title }, "Titel Artistiek aangepast")} />
        </h1>
        <p className="mt-4 font-story text-2xl italic text-ink-soft">
          <EditableText
            value={storiesSubtitle(page.poemPageTitle)}
            onSave={(poemPageTitle) => patch({ poemPageTitle }, "Subtitel Artistiek aangepast")}
          />
        </p>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <PoemPhoto src={page.poemPhoto || ""} onSave={(poemPhoto) => patch({ poemPhoto }, "Foto bij Artistiek toegevoegd")} />
          <p className="font-story text-xl italic leading-relaxed text-ink-soft">
            <EditableText value={intro} multiline onSave={(poemLead) => patch({ poemLead }, "Tekst bij Artistiek aangepast")} />
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(page.poems ?? []).map((item) => (
            <Link
              key={item.id}
              to="/wat/$slug"
              params={{ slug: "artistiek" }}
              search={{ gedicht: item.id }}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="block aspect-[4/3] overflow-hidden bg-ink">
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <span className="grid h-full place-items-center px-6 text-center font-story text-3xl italic text-paper">{item.title}</span>
                )}
              </span>
              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className="font-story text-2xl italic leading-tight">{item.title}</span>
                {item.body ? <span className="line-clamp-3 font-story text-sm italic leading-relaxed text-ink-soft">{item.body.split("\n").find((line) => line.trim())}</span> : null}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <ContactBand />
    </SiteShell>
  )
}

function PoemPhoto({ src, onSave }: { src: string; onSave: (url: string) => void }) {
  const editing = useEditor()
  return (
    <div>
      {src ? (
        <img src={src} alt="" className="aspect-[4/5] w-full rounded-card object-cover object-top" />
      ) : editing ? (
        <div className="grid aspect-[4/5] place-items-center rounded-card border border-dashed border-line bg-card font-story text-2xl italic text-muted">Foto</div>
      ) : null}
      {editing ? (
        <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-card px-4 text-sm font-semibold">
          Foto uploaden
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              void compressImage(file).then(onSave)
            }}
          />
        </label>
      ) : null}
    </div>
  )
}

function WatTabs({ current }: { current: string }) {
  const { data } = useLocaleSite()
  return (
    <div className="flex flex-wrap gap-2">
      {data.wat.map((page, index) => (
        <Link
          key={page.slug}
          to="/wat/$slug"
          params={{ slug: page.slug }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ${
            page.slug === current ? "bg-ink text-paper" : "border border-line bg-card text-ink hover:border-accent"
          }`}
        >
          <span className="text-xs tracking-widest text-accent">{String(index + 1).padStart(2, "0")}</span>
          {page.title}
        </Link>
      ))}
    </div>
  )
}

function GedichtenZaal({ poems }: { poems: PoemItem[] }) {
  const { t } = useI18n()
  if (!poems.length) return null
  return (
    <div>
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mt-3 font-display text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">{t("poemsHeading")}</p>
          </div>
          <nav className="flex flex-col gap-2">
            {poems.map((poem, index) => (
              <a key={poem.id} href={`#gedicht-${poem.id}`} className="group inline-flex items-baseline gap-3 font-story text-2xl italic text-paper/80 hover:text-paper">
                <span className="font-display text-sm font-bold not-italic tracking-widest text-accent">{String(index + 1).padStart(2, "0")}</span>
                {poem.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
      {poems.map((poem, index) => {
        const lines = poem.body.split("\n").map((line) => line.trim()).filter(Boolean)
        return (
          <section id={`gedicht-${poem.id}`} key={poem.id} className="scroll-mt-16">
            <PoemEditor poem={poem} />
            <PoemPoster index={index} title={poem.title} lines={lines} />
          </section>
        )
      })}
    </div>
  )
}

function poemKind(title: string) {
  const name = title.toLowerCase()
  if (name.includes("offer")) return "offer"
  if (name.includes("stad")) return "stad"
  if (name.includes("passen") || name.includes("vak")) return "vak"
  return "plain"
}

function PoemPoster({ index, title, lines }: { index: number; title: string; lines: string[] }) {
  const kind = poemKind(title)
  if (kind === "offer") return <OfferPoster index={index} title={title} lines={lines} />
  if (kind === "stad") return <StadPoster index={index} title={title} lines={lines} />
  if (kind === "vak") return <VakPoster index={index} title={title} lines={lines} />
  return <PlainPoster index={index} title={title} lines={lines} />
}

function OfferPoster({ index, title, lines }: { index: number; title: string; lines: string[] }) {
  const last = lines[lines.length - 1] ?? ""
  const refusal = /^(niet|not|pas|nicht)\b/i
  const hasCliff = Boolean(last) && !refusal.test(last)
  const body = hasCliff ? lines.slice(0, -1) : lines
  const cut = body.findIndex((line) => !refusal.test(line))
  const refusals = cut === -1 ? body : body.slice(0, cut)
  const minutes = cut === -1 ? [] : body.slice(cut)
  return (
    <article className="relative overflow-hidden bg-ink text-paper">
      <p aria-hidden className="pointer-events-none absolute -left-4 top-6 select-none font-display text-[22vw] font-extrabold leading-none text-white/[0.04]">
        {title}
      </p>
      <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-accent">
          {String(index + 1).padStart(2, "0")} — {title}
        </p>
        <div className="mt-10 columns-1 sm:columns-2 sm:gap-x-16">
          {refusals.map((line, i) => (
            <p key={`${i}-${line}`} className="break-inside-avoid border-b border-white/10 py-2.5 font-story text-2xl leading-snug sm:text-3xl">
              <span className="text-accent">{line.match(/^(niet|not|pas|nicht)/i)?.[0]}</span>
              {line.replace(/^(niet|not|pas|nicht)/i, "")}
            </p>
          ))}
        </div>
        {minutes.length ? (
          <div className="mt-14 max-w-lg border-l border-accent pl-5">
            {minutes.map((line, i) => (
              <p key={`${i}-${line}`} className="py-0.5 text-xs uppercase leading-relaxed tracking-[0.16em] text-paper/75">
                {line}
              </p>
            ))}
          </div>
        ) : null}
        {hasCliff ? <p className="mt-16 font-story text-5xl italic leading-[0.95] sm:text-7xl">{last}</p> : null}
      </div>
    </article>
  )
}

function StadPoster({ index, title, lines }: { index: number; title: string; lines: string[] }) {
  const close = lines.slice(-2)
  const open = lines.slice(0, -2)
  return (
    <article className="relative overflow-hidden bg-[#f4efe6]">
      <div aria-hidden className="absolute -right-16 top-16 h-72 w-72 rounded-full border border-accent/40 sm:h-[28rem] sm:w-[28rem]" />
      <div aria-hidden className="absolute -right-8 top-24 h-56 w-56 rounded-full bg-accent/10 sm:h-96 sm:w-96" />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-accent">
          {String(index + 1).padStart(2, "0")} — {title}
        </p>
        <div className="mt-12 flex flex-col gap-2">
          {open.map((line, i) => (
            <p key={`${i}-${line}`} className="font-story text-xl italic leading-snug text-ink-soft sm:text-2xl">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-14">
          {close.map((line, i) => (
            <p key={`${i}-${line}`} className={`font-display font-extrabold leading-none tracking-tight ${i === close.length - 1 ? "text-5xl text-accent sm:text-8xl" : "text-4xl text-ink sm:text-6xl"}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}

function VakPoster({ index, title, lines }: { index: number; title: string; lines: string[] }) {
  const last = lines[lines.length - 1] ?? ""
  const boxed = lines.slice(0, -1)
  return (
    <article className="bg-paper px-4 py-20 sm:py-28">
      <div className="relative mx-auto max-w-3xl pb-8">
        <div className="relative border border-ink px-6 py-10 sm:px-12 sm:py-14">
          <span aria-hidden className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2 border-accent" />
          <span aria-hidden className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2 border-accent" />
          <span aria-hidden className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-accent" />
          <span aria-hidden className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-accent" />
          <p className="font-display text-xs font-bold uppercase tracking-[0.32em]">
            {String(index + 1).padStart(2, "0")} — {title}
          </p>
          <div className="mt-8">
            {boxed.map((line, i) => (
              <p key={`${i}-${line}`} className="border-b border-dashed border-line py-2.5 font-story text-lg leading-snug sm:text-2xl">
                {line}
              </p>
            ))}
          </div>
        </div>
        <p className="-mt-6 ml-6 max-w-4xl bg-paper pr-4 font-story text-4xl italic leading-tight text-accent sm:ml-16 sm:text-6xl">{last}</p>
      </div>
    </article>
  )
}

function PlainPoster({ index, title, lines }: { index: number; title: string; lines: string[] }) {
  return (
    <article className="bg-card px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-accent">
          {String(index + 1).padStart(2, "0")} — {title}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {lines.map((line, i) => (
            <p key={`${i}-${line}`} className="font-story text-2xl italic leading-snug sm:text-4xl">
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}

function PoemEditor({ poem }: { poem: PoemItem }) {
  const editing = useEditor()
  const { data } = useLocaleSite()
  if (!editing) return null
  function save(part: Partial<PoemItem>) {
    publishSite(
      {
        ...data,
        wat: data.wat.map((item) =>
          item.slug === "artistiek"
            ? { ...item, poems: (item.poems ?? []).map((entry) => (entry.id === poem.id ? { ...entry, ...part } : entry)) }
            : item,
        ),
      },
      "Gedicht aangepast",
    )
  }
  return (
    <div className="bg-paper px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Dit gedicht aanpassen</p>
        <p className="mt-2 font-display text-2xl font-extrabold">
          <EditableText value={poem.title} onSave={(title) => save({ title })} />
        </p>
        <div className="mt-2 text-sm">
          <EditableText value={poem.body} multiline onSave={(body) => save({ body })} />
        </div>
      </div>
    </div>
  )
}

function WatBody({ page }: { page: WatPage }) {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const editing = useEditor()
  function save(part: Partial<WatPage>, summary: string) {
    publishSite(
      { ...data, wat: data.wat.map((item) => (item.slug === page.slug ? { ...item, ...part } : item)) },
      summary,
    )
  }
  return (
    <div className="mt-12">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-card bg-accent" />
          <div className="relative">
            {page.mediaType === "image" && (page.mediaUrl || editing) ? (
              <EditablePhoto
                src={page.mediaUrl}
                alt={page.title}
                className="aspect-[4/3] w-full rounded-card object-cover"
                onSave={(mediaUrl) => save({ mediaUrl, mediaType: "image" }, "Beeld aangepast")}
              />
            ) : (
              <MediaPane type={page.mediaType} url={page.mediaUrl} label={page.title} />
            )}
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("whatIDo")}</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            <EditableText value={page.title} onSave={(title) => save({ title }, "Titel aangepast")} />
          </h1>
          <p className="mt-6 font-story text-xl italic leading-relaxed text-ink">
            <EditableText value={page.lead} multiline onSave={(lead) => save({ lead }, "Tekst aangepast")} />
          </p>
          <p className="mt-5 leading-relaxed text-ink-soft">
            <EditableText value={page.body} multiline onSave={(body) => save({ body }, "Tekst aangepast")} />
          </p>
        </div>
      </div>
      {page.exampleUrl ? (
        <div className="mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{t("example")}</p>
          <div className="mt-4 max-w-3xl">
            <MediaPane type={page.exampleType} url={page.exampleUrl} label={`${page.title} voorbeeld`} />
          </div>
        </div>
      ) : null}
      <div className="mt-20 border-t border-line pt-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">{page.offerTitle || "Wat ik voor je kan doen"}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{page.offerText}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.cards.map((card) => (
            <article key={card.title} className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-card shadow-sm">
              {card.image ? (
                <img src={card.image} alt="" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[4/3] place-items-center bg-ink px-6 text-center font-display text-lg font-bold text-paper">{card.title}</div>
              )}
              <div className="flex flex-1 flex-col p-5">
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
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const [filter, setFilter] = useState("Alles")
  const [active, setActive] = useState<Project | null>(null)
  const published = data.projects.filter((project) => project.status === "published")
  const visible = filter === "Alles" ? published : published.filter((project) => projectCategories(project).includes(filter))
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Projecten</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="max-w-xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t("projectsTitle")}</h1>
          <div className="flex flex-wrap gap-2">
            {["Alles", ...CATEGORIES].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold ${filter === category ? "bg-ink text-paper" : "border border-line bg-card"}`}
              >
                {category === "Alles" ? t("all") : category === "Artikel" ? t("article") : category}
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
          <p className="mt-10 text-ink-soft">{t("noProjects")}</p>
        )}
      </section>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </SiteShell>
  )
}

export function ContactPage() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
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
    setSentNote(t("sent"))
  }
  return (
    <SiteShell>
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("contact")}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <EditableText value={copy.contactTitle} onSave={(contactTitle) => publishSite({ ...data, copy: { ...copy, contactTitle } }, "Contacttitel aangepast")} />
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/80">
              <EditableText value={copy.contactLead} multiline onSave={(contactLead) => publishSite({ ...data, copy: { ...copy, contactLead } }, "Contacttekst aangepast")} />
            </p>
            <a href={`mailto:${copy.email}`} className="mt-6 inline-flex text-lg font-bold underline decoration-accent underline-offset-4">
              {copy.email}
            </a>
            <div className="mt-6">
              <SocialsRow socials={data.design.socials} tone="paper" />
            </div>
          </div>
          <form onSubmit={submitContact} className="rounded-card bg-card p-6 text-ink sm:p-8">
            <label className="block text-sm font-semibold" htmlFor="name">{t("name")}</label>
            <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <label className="mt-4 block text-sm font-semibold" htmlFor="email">{t("email")}</label>
            <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <label className="mt-4 block text-sm font-semibold" htmlFor="message">{t("message")}</label>
            <textarea id="message" name="message" required rows={5} className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent" />
            <button type="submit" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">{t("send")}</button>
            {sentNote ? <p className="mt-3 text-sm text-muted">{sentNote}</p> : null}
          </form>
        </div>
      </section>
    </SiteShell>
  )
}
