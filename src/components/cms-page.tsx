import { useEffect, useRef, useState, type RefObject, Component, type ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  Download,
  RotateCcw,
} from "lucide-react"
import { DataService, useSiteData } from "@/lib/data-service"
import { defaultSite } from "@/lib/site-defaults"
import { CATEGORIES, type PageCopy, type Project, type SiteData } from "@/lib/site-types"
import { ArticleBody, ProjectCard } from "@/components/project-views"
import { DropImage, RichText } from "@/components/editor-fields"
import { compressImage, newId, toEmbedUrl } from "@/lib/media"
import { adminSession, clearAdminSession } from "@/lib/admin-session"
import { saveSiteDocument } from "@/lib/site-store"
import { BlogAdmin } from "@/components/blog-admin"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { AuditPanel } from "@/components/audit-panel"
import { describeChange } from "@/lib/change-summary"
import { logChange, logLogout } from "@/lib/audit-client"

type Tab = "projects" | "posts" | "copy" | "design" | "stats" | "audit"

const field =
  "mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
const label = "mt-4 block text-xs font-bold uppercase tracking-wide text-muted"

export function CmsPage({ onLogout }: { onLogout?: () => void }) {
  const { data, ready } = useSiteData()
  const [tab, setTab] = useState<Tab>("projects")
  const [editing, setEditing] = useState<string | null>(null)
  const [preview, setPreview] = useState<"card" | "article">("article")
  const [notice, setNotice] = useState("")
  const [dragId, setDragId] = useState<string | null>(null)
  const [sync, setSync] = useState<"idle" | "saving" | "live" | "local">("idle")
  const fileRef = useRef<HTMLInputElement>(null)
  const remoteTimer = useRef<number | null>(null)
  const lastAudited = useRef<SiteData | null>(null)
  const pendingNote = useRef("")

  useEffect(() => {
    if (ready && !lastAudited.current) lastAudited.current = data
  }, [ready, data])

  function commit(next: SiteData, note?: string) {
    const stamped = { ...next, updatedAt: Date.now() }
    try {
      DataService.save(stamped)
      setNotice("")
    } catch {
      setNotice("De browseropslag zit vol. Gebruik een kleinere foto of een afbeeldings-URL.")
      return
    }
    if (note) pendingNote.current = note
    const session = adminSession()
    if (!session) return
    if (remoteTimer.current) window.clearTimeout(remoteTimer.current)
    setSync("saving")
    remoteTimer.current = window.setTimeout(() => {
      const current = DataService.load()
      const described = lastAudited.current
        ? describeChange(lastAudited.current, current)
        : { summary: "Wijziging opgeslagen", detail: "" }
      if (pendingNote.current) {
        described.summary = pendingNote.current
        described.detail = pendingNote.current
        pendingNote.current = ""
      }
      lastAudited.current = current
      logChange(described.summary, described.detail)
      void saveSiteDocument({
        data: {
          token: session.token,
          document: JSON.stringify(current),
        },
      })
        .then(() => setSync("live"))
        .catch((error: unknown) => {
          setSync("local")
          const detail = error instanceof Error ? error.message : ""
          setNotice(
            detail
              ? `Bewaard op dit apparaat. Gedeelde opslag: ${detail}`
              : "Bewaard op dit apparaat. De gedeelde opslag reageerde niet — probeer het nog eens.",
          )
        })
    }, 800)
  }

  function patchProject(id: string, patch: Partial<Project>) {
    commit({
      ...data,
      projects: data.projects.map((project) => (project.id === id ? { ...project, ...patch } : project)),
    })
  }

  function move(id: string, dir: -1 | 1) {
    const list = [...data.projects]
    const index = list.findIndex((project) => project.id === id)
    const target = index + dir
    if (index < 0 || target < 0 || target >= list.length) return
    const [item] = list.splice(index, 1)
    list.splice(target, 0, item)
    commit({ ...data, projects: list })
  }

  const current = data.projects.find((project) => project.id === editing) ?? null
  const embedNote = current?.mediaType === "video" ? toEmbedUrl(current.mediaUrl) : null

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-paper text-muted">Studio laden…</div>
  }

  const syncLabel =
    sync === "saving"
      ? "Opslaan…"
      : sync === "live"
        ? "Live voor iedereen"
        : sync === "local"
          ? "Alleen op dit apparaat"
          : "Wijzigingen worden automatisch bewaard"

  const tabs = (
    [
      ["projects", "Projecten"],
      ["posts", "Blogs"],
      ["copy", "Paginateksten"],
      ["design", "Vormgeving"],
      ["stats", "Bezoekers"],
      ["audit", "Audit"],
    ] as const
  ).map(([id, name]) => (
    <button
      key={id}
      type="button"
      onClick={() => {
        setTab(id)
        setEditing(null)
      }}
      className={`min-h-11 shrink-0 rounded-full px-4 text-left text-sm font-semibold lg:w-full lg:rounded-xl ${
        tab === id ? "bg-accent text-accent-ink" : "text-paper/80 hover:bg-white/10"
      }`}
    >
      {name}
    </button>
  ))

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="bg-ink text-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-start justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-display text-sm font-extrabold tracking-wide">DE CONNECTORS</p>
            <p className="text-xs text-paper/60">{adminSession()?.name || "Admin"}</p>
            <p className="text-xs text-paper/50">{adminSession()?.role}</p>
            <p className="mt-2 text-xs text-paper/70">{syncLabel}</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible">{tabs}</nav>
        <div className="mt-auto flex flex-wrap gap-2 px-3 pb-4 lg:flex-col">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold"
            onClick={() => {
              logLogout()
              clearAdminSession()
              onLogout?.()
            }}
          >
            Uitloggen
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-paper px-4 text-sm font-bold text-ink"
          >
            Bekijk de site
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
      {notice ? (
        <p className="mx-4 mt-4 rounded-xl border border-accent bg-card px-4 py-3 text-sm">{notice}</p>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {tab === "projects" && !current ? (
          <section>
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-display text-2xl font-extrabold">Projecten & berichten</h1>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-bold text-accent-ink"
                onClick={() => {
                  const project: Project = {
                    id: newId(),
                    title: "",
                    category: "Project",
                    status: "draft",
                    mediaType: "image",
                    mediaUrl: "",
                    poster: "",
                    lead: "",
                    body: "",
                    gallery: [],
                    ctaLabel: "",
                    ctaUrl: "",
                  }
                  commit({ ...data, projects: [project, ...data.projects] })
                  setEditing(project.id)
                  setPreview("article")
                }}
              >
                <Plus className="h-4 w-4" />
                Nieuw bericht
              </button>
            </div>
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
              {data.projects.map((project) => (
                <li
                  key={project.id}
                  draggable
                  onDragStart={() => setDragId(project.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (!dragId || dragId === project.id) return
                    const list = [...data.projects]
                    const from = list.findIndex((item) => item.id === dragId)
                    const to = list.findIndex((item) => item.id === project.id)
                    const [item] = list.splice(from, 1)
                    list.splice(to, 0, item)
                    commit({ ...data, projects: list })
                    setDragId(null)
                  }}
                  className="flex items-center gap-2 px-3 py-3"
                >
                  <GripVertical className="hidden h-4 w-4 shrink-0 text-muted sm:block" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{project.title || "Zonder titel"}</p>
                    <p className="text-xs text-muted">
                      {project.category} · {project.status === "published" ? "Live" : "Concept"}
                    </p>
                  </div>
                  <button type="button" aria-label="Omhoog" className="grid h-11 w-11 place-items-center" onClick={() => move(project.id, -1)}>
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Omlaag" className="grid h-11 w-11 place-items-center" onClick={() => move(project.id, 1)}>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-full border border-line px-3 text-sm font-semibold"
                    onClick={() => setEditing(project.id)}
                  >
                    Bewerk
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "projects" && current ? (
          <section>
            <button type="button" className="text-sm font-semibold text-accent" onClick={() => setEditing(null)}>
              ← Terug naar overzicht
            </button>
            <div className="mt-4 grid items-start gap-6 lg:grid-cols-2">
              <form
                className="rounded-card border border-line bg-paper p-4 sm:p-5"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="flex items-center justify-between gap-3">
                  <h1 className="font-display text-xl font-extrabold">Bericht</h1>
                  <button
                    type="button"
                    onClick={() =>
                      patchProject(current.id, {
                        status: current.status === "published" ? "draft" : "published",
                      })
                    }
                    className={`min-h-11 rounded-full px-4 text-sm font-bold ${
                      current.status === "published" ? "bg-ink text-paper" : "bg-card text-ink border border-line"
                    }`}
                  >
                    {current.status === "published" ? "Live" : "Concept"}
                  </button>
                </div>

                <label className={label} htmlFor="title">
                  Titel
                </label>
                <input
                  id="title"
                  className={field}
                  value={current.title}
                  onChange={(event) => patchProject(current.id, { title: event.target.value })}
                />

                <label className={label} htmlFor="category">
                  Categorie
                </label>
                <input
                  id="category"
                  list="categories"
                  className={field}
                  value={current.category}
                  onChange={(event) => patchProject(current.id, { category: event.target.value })}
                />
                <datalist id="categories">
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>

                <p className={label}>Hoofdmedia</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["image", "video"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => patchProject(current.id, { mediaType: type })}
                      className={`min-h-11 rounded-xl text-sm font-semibold ${
                        current.mediaType === type ? "bg-ink text-paper" : "border border-line bg-card"
                      }`}
                    >
                      {type === "image" ? "Afbeelding" : "Video"}
                    </button>
                  ))}
                </div>
                <label className={label} htmlFor="media">
                  {current.mediaType === "image" ? "Afbeeldings-URL" : "YouTube- of Vimeo-link"}
                </label>
                <input
                  id="media"
                  className={field}
                  placeholder={current.mediaType === "video" ? "https://www.youtube.com/watch?v=…" : "https://…"}
                  value={current.mediaUrl}
                  onChange={(event) => patchProject(current.id, { mediaUrl: event.target.value })}
                />
                {current.mediaType === "video" ? (
                  <p className="mt-2 text-xs text-muted">
                    {embedNote ? "Video wordt automatisch ingesloten." : "Plak een gewone YouTube- of Vimeo-link."}
                  </p>
                ) : (
                  <DropImage
                    label="Of upload een foto"
                    onFile={(url) => patchProject(current.id, { mediaUrl: url, poster: url, mediaType: "image" })}
                  />
                )}
                {current.mediaType === "video" ? (
                  <>
                    <label className={label} htmlFor="poster">
                      Posterfoto voor de kaart (optioneel)
                    </label>
                    <input
                      id="poster"
                      className={field}
                      value={current.poster}
                      onChange={(event) => patchProject(current.id, { poster: event.target.value })}
                    />
                    <DropImage label="Upload poster" onFile={(url) => patchProject(current.id, { poster: url })} />
                  </>
                ) : null}

                <label className={label} htmlFor="lead">
                  Korte samenvatting
                </label>
                <textarea
                  id="lead"
                  rows={3}
                  className={field}
                  value={current.lead}
                  onChange={(event) => patchProject(current.id, { lead: event.target.value })}
                />

                <p className={label}>Het verhaal</p>
                <RichText
                  key={current.id}
                  value={current.body}
                  onChange={(body) => patchProject(current.id, { body })}
                />

                <p className={label}>Extra foto’s</p>
                <DropImage
                  label="Voeg een foto toe aan het grid"
                  onFile={(url) => patchProject(current.id, { gallery: [...current.gallery, url] })}
                />
                {current.gallery.length ? (
                  <ul className="mt-3 grid grid-cols-3 gap-2">
                    {current.gallery.map((src, index) => (
                      <li key={`${src}-${index}`} className="relative">
                        <img src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          aria-label="Verwijder foto"
                          className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-card"
                          onClick={() =>
                            patchProject(current.id, {
                              gallery: current.gallery.filter((_, item) => item !== index),
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <label className={label} htmlFor="cta">
                  Knoptekst
                </label>
                <input
                  id="cta"
                  className={field}
                  placeholder="Lees de krant online"
                  value={current.ctaLabel}
                  onChange={(event) => patchProject(current.id, { ctaLabel: event.target.value })}
                />
                <label className={label} htmlFor="ctaUrl">
                  Knop-link
                </label>
                <input
                  id="ctaUrl"
                  className={field}
                  placeholder="https://…"
                  value={current.ctaUrl}
                  onChange={(event) => patchProject(current.id, { ctaUrl: event.target.value })}
                />

                <button
                  type="button"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
                  onClick={() => {
                    if (!window.confirm("Dit bericht verwijderen?")) return
                    commit({ ...data, projects: data.projects.filter((project) => project.id !== current.id) })
                    setEditing(null)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Verwijder bericht
                </button>
              </form>

              <aside className="lg:sticky lg:top-6">
                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview("card")}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold ${preview === "card" ? "bg-ink text-paper" : "bg-card"}`}
                  >
                    Kaart
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreview("article")}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold ${preview === "article" ? "bg-ink text-paper" : "bg-card"}`}
                  >
                    Artikel
                  </button>
                </div>
                <div className="max-h-[78vh] overflow-auto rounded-card border border-line bg-card">
                  {preview === "card" ? (
                    <div className="p-4">
                      <ProjectCard project={current} onOpen={() => setPreview("article")} />
                    </div>
                  ) : (
                    <ArticleBody project={current} stacked />
                  )}
                </div>
              </aside>
            </div>
          </section>
        ) : null}

        {tab === "posts" ? <BlogAdmin data={data} commit={commit} /> : null}

        {tab === "copy" ? <CopyForm data={data} commit={commit} /> : null}
        {tab === "design" ? (
          <DesignForm
            data={data}
            commit={commit}
            fileRef={fileRef}
            onNotice={setNotice}
          />
        ) : null}
        {tab === "stats" ? (
          <PanelBoundary>
            <AnalyticsPanel />
          </PanelBoundary>
        ) : null}
        {tab === "audit" ? <AuditPanel /> : null}
      </div>
      </div>
    </div>
  )
}

class PanelBoundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: "" }
  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : "De bezoekerscijfers konden niet getoond worden." }
  }
  render() {
    if (this.state.error) {
      return <p className="rounded-xl border border-line bg-card px-4 py-3 text-sm">{this.state.error}</p>
    }
    return this.props.children
  }
}

function CopyForm({ data, commit }: { data: SiteData; commit: (next: SiteData) => void }) {
  const copy = data.copy
  function set<K extends keyof PageCopy>(key: K, value: PageCopy[K]) {
    commit({ ...data, copy: { ...copy, [key]: value } })
  }
  return (
    <section className="max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold">Vaste paginateksten</h1>
      <p className="mt-2 text-sm text-muted">Pas de vaste teksten aan. De opmaak van de pagina blijft staan.</p>
      <Field label="Hero-titel" value={copy.heroTitle} onChange={(value) => set("heroTitle", value)} />
      <Field label="Tagline" value={copy.heroTagline} onChange={(value) => set("heroTagline", value)} />
      <Area label="Hero-subtitel" value={copy.heroSubtitle} onChange={(value) => set("heroSubtitle", value)} />
      <Field label="Over-titel" value={copy.aboutTitle} onChange={(value) => set("aboutTitle", value)} />
      <Area label="Over-intro" value={copy.aboutLead} onChange={(value) => set("aboutLead", value)} />
      <Area label="Over, linker kolom" value={copy.aboutLeft} onChange={(value) => set("aboutLeft", value)} />
      <Area label="Over, rechter kolom" value={copy.aboutRight} onChange={(value) => set("aboutRight", value)} />
      <Field label="Stijl-titel" value={copy.stylesTitle} onChange={(value) => set("stylesTitle", value)} />
      {copy.styles.map((card, index) => (
        <div key={index} className="mt-4 rounded-xl border border-line bg-card p-4">
          <Field
            label={`Stijl ${index + 1} titel`}
            value={card.title}
            onChange={(value) => {
              const styles = copy.styles.map((item, i) => (i === index ? { ...item, title: value } : item))
              set("styles", styles)
            }}
          />
          <Area
            label="Tekst"
            value={card.text}
            onChange={(value) => {
              const styles = copy.styles.map((item, i) => (i === index ? { ...item, text: value } : item))
              set("styles", styles)
            }}
          />
        </div>
      ))}
      <Field label="Diensten-titel" value={copy.servicesTitle} onChange={(value) => set("servicesTitle", value)} />
      {copy.services.map((card, index) => (
        <div key={index} className="mt-4 rounded-xl border border-line bg-card p-4">
          <Field
            label={`Dienst ${index + 1}`}
            value={card.title}
            onChange={(value) => {
              const services = copy.services.map((item, i) => (i === index ? { ...item, title: value } : item))
              set("services", services)
            }}
          />
          <Area
            label="Tekst"
            value={card.text}
            onChange={(value) => {
              const services = copy.services.map((item, i) => (i === index ? { ...item, text: value } : item))
              set("services", services)
            }}
          />
        </div>
      ))}
      <Field label="Banner" value={copy.bannerText} onChange={(value) => set("bannerText", value)} />
      <Field label="Wie-titel" value={copy.whoTitle} onChange={(value) => set("whoTitle", value)} />
      <Area label="Wie-tekst" value={copy.whoBody} onChange={(value) => set("whoBody", value)} />
      <Field label="Naam" value={copy.whoName} onChange={(value) => set("whoName", value)} />
      <Field label="Rol" value={copy.whoRole} onChange={(value) => set("whoRole", value)} />
      <Field label="Portret-URL" value={copy.whoPhoto} onChange={(value) => set("whoPhoto", value)} />
      <DropImage label="Upload portret" onFile={(url) => set("whoPhoto", url)} />
      <Field label="Citaat" value={copy.quote} onChange={(value) => set("quote", value)} />
      <Field label="Klanten-titel" value={copy.clientsTitle} onChange={(value) => set("clientsTitle", value)} />
      <Field label="Contacttitel" value={copy.contactTitle} onChange={(value) => set("contactTitle", value)} />
      <Area label="Contacttekst" value={copy.contactLead} onChange={(value) => set("contactLead", value)} />
      <Field label="E-mail" value={copy.email} onChange={(value) => set("email", value)} />
      <Field label="Blog-titel" value={copy.blogTitle} onChange={(value) => set("blogTitle", value)} />
      <Area label="Blog-intro" value={copy.blogLead} onChange={(value) => set("blogLead", value)} />
      <Field label="Knop naar de blogs" value={copy.blogButton} onChange={(value) => set("blogButton", value)} />
    </section>
  )
}

function Field({ label: name, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block text-sm font-semibold">
      {name}
      <input className={field} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Area({ label: name, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block text-sm font-semibold">
      {name}
      <textarea rows={4} className={field} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function DesignForm({
  data,
  commit,
  fileRef,
  onNotice,
}: {
  data: SiteData
  commit: (next: SiteData, note?: string) => void
  fileRef: RefObject<HTMLInputElement | null>
  onNotice: (message: string) => void
}) {
  const { design } = data
  const presets = [
    { name: "Koraal", value: "#E11D48" },
    { name: "Oranje", value: "#EA580C" },
    { name: "Terracotta", value: "#C2410C" },
    { name: "Wijnrood", value: "#9F1239" },
  ]
  return (
    <section className="max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold">Designer instellingen</h1>
      <p className={label}>Accentkleur</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => commit({ ...data, design: { ...design, accent: preset.value } })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-3 text-sm font-semibold"
          >
            <span className="h-4 w-4 rounded-full" style={{ background: preset.value }} />
            {preset.name}
          </button>
        ))}
        <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-3 text-sm font-semibold">
          Eigen
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(design.accent) ? design.accent : "#E11D48"}
            onChange={(event) => commit({ ...data, design: { ...design, accent: event.target.value } })}
            aria-label="Eigen accentkleur"
          />
        </label>
      </div>
      <p className={label}>Lettertype koppen</p>
      <div className="mt-2 flex gap-2">
        {(
          [
            ["jakarta", "Plus Jakarta Sans"],
            ["montserrat", "Montserrat"],
          ] as const
        ).map(([id, name]) => (
          <button
            key={id}
            type="button"
            onClick={() => commit({ ...data, design: { ...design, headingFont: id } })}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
              design.headingFont === id ? "bg-ink text-paper" : "border border-line bg-card"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-display text-xl font-extrabold">Socials</h2>
      {(
        [
          ["youtube", "YouTube"],
          ["vimeo", "Vimeo"],
          ["x", "X / Twitter"],
          ["flickr", "Flickr"],
          ["linkedin", "LinkedIn"],
        ] as const
      ).map(([key, name]) => (
        <Field
          key={key}
          label={name}
          value={design.socials[key]}
          onChange={(value) =>
            commit({ ...data, design: { ...design, socials: { ...design.socials, [key]: value } } })
          }
        />
      ))}

      <h2 className="mt-8 font-display text-xl font-extrabold">Klantlogo’s</h2>
      <ul className="mt-3 space-y-3">
        {design.clients.map((client, index) => (
          <li key={client.id} className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
            <div className="grid h-12 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-paper">
              {client.image ? (
                <img src={client.image} alt="" className="max-h-10 max-w-16 object-contain" />
              ) : (
                <span className="text-[10px] font-bold text-muted">TEKST</span>
              )}
            </div>
            <input
              className="w-full rounded-lg border border-line px-2 py-2 text-sm"
              value={client.name}
              aria-label="Naam organisatie"
              onChange={(event) => {
                const clients = design.clients.map((item, i) =>
                  i === index ? { ...item, name: event.target.value } : item,
                )
                commit({ ...data, design: { ...design, clients } })
              }}
            />
            <label className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line" aria-label="Logo uploaden">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ""
                  if (!file) return
                  void compressImage(file, 600, 0.8).then((url) => {
                    const clients = design.clients.map((item, i) => (i === index ? { ...item, image: url } : item))
                    commit({ ...data, design: { ...design, clients } })
                  })
                }}
              />
            </label>
            <button
              type="button"
              aria-label="Verwijder logo"
              className="grid h-11 w-11 shrink-0 place-items-center"
              onClick={() =>
                commit({
                  ...data,
                  design: { ...design, clients: design.clients.filter((item) => item.id !== client.id) },
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
        onClick={() =>
          commit({
            ...data,
            design: {
              ...design,
              clients: [...design.clients, { id: newId(), name: "Nieuwe organisatie", image: "" }],
            },
          })
        }
      >
        <Plus className="h-4 w-4" />
        Organisatie toevoegen
      </button>

      <h2 className="mt-10 font-display text-xl font-extrabold">Back-up</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-paper"
          onClick={() => {
            const blob = new Blob([DataService.exportJson(data)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "de-connectors.json"
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download className="h-4 w-4" />
          Exporteer JSON
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Importeer JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (!file) return
            void file.text().then((raw) => {
              try {
                commit(DataService.importJson(raw), "JSON-bestand geïmporteerd")
                onNotice("Import gelukt.")
              } catch {
                onNotice("Dit bestand kon niet worden gelezen.")
              }
            })
          }}
        />
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold"
          onClick={() => {
            if (!window.confirm("Alle lokale aanpassingen wissen en de originele site terugzetten?")) return
            commit(defaultSite, "Originele site teruggezet")
            DataService.reset()
            commit(defaultSite, "Originele site teruggezet")
            onNotice("Originele site teruggezet.")
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Herstel origineel
        </button>
      </div>
    </section>
  )
}
