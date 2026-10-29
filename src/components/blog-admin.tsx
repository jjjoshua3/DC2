import { useState } from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { DropImage, RichText } from "@/components/editor-fields"
import { ArticleBody, ProjectCard } from "@/components/project-views"
import { newId } from "@/lib/media"
import type { Post, Project, SiteData } from "@/lib/site-types"

const field =
  "mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
const label = "mt-4 block text-xs font-bold uppercase tracking-wide text-muted"

function asProject(post: Post): Project {
  return {
    id: post.id,
    title: post.title,
    category: post.date || "Blog",
    status: post.status,
    mediaType: "image",
    mediaUrl: post.image,
    poster: post.image,
    lead: post.lead,
    body: post.body,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  }
}

export function BlogAdmin({ data, commit }: { data: SiteData; commit: (next: SiteData) => void }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [preview, setPreview] = useState<"card" | "article">("article")
  const posts = data.posts ?? []
  const current = posts.find((post) => post.id === editing) ?? null

  function write(next: Post[]) {
    commit({ ...data, posts: next })
  }

  function patch(id: string, partial: Partial<Post>) {
    write(posts.map((post) => (post.id === id ? { ...post, ...partial } : post)))
  }

  function move(id: string, dir: -1 | 1) {
    const list = [...posts]
    const index = list.findIndex((post) => post.id === id)
    const target = index + dir
    if (index < 0 || target < 0 || target >= list.length) return
    const [item] = list.splice(index, 1)
    list.splice(target, 0, item)
    write(list)
  }

  if (!current) {
    return (
      <section>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold">Blogs</h1>
            <p className="mt-1 text-sm text-muted">Zelfde editor als een bericht. Live zodra je op Live zet.</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-bold text-accent-ink"
            onClick={() => {
              const post: Post = {
                id: newId(),
                title: "",
                date: new Date().toISOString().slice(0, 10),
                status: "draft",
                image: "",
                lead: "",
                body: "",
              }
              write([post, ...posts])
              setEditing(post.id)
            }}
          >
            <Plus className="h-4 w-4" />
            Nieuw blog
          </button>
        </div>
        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-2 px-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{post.title || "Zonder titel"}</p>
                <p className="text-xs text-muted">
                  {post.date} · {post.status === "published" ? "Live" : "Concept"}
                </p>
              </div>
              <button type="button" aria-label="Omhoog" className="grid h-11 w-11 place-items-center" onClick={() => move(post.id, -1)}>
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Omlaag" className="grid h-11 w-11 place-items-center" onClick={() => move(post.id, 1)}>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="min-h-11 rounded-full border border-line px-3 text-sm font-semibold"
                onClick={() => setEditing(post.id)}
              >
                Bewerk
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const view = asProject(current)
  return (
    <section>
      <button type="button" className="text-sm font-semibold text-accent" onClick={() => setEditing(null)}>
        ← Terug naar blogs
      </button>
      <div className="mt-4 grid items-start gap-6 lg:grid-cols-2">
        <form className="rounded-card border border-line bg-paper p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-xl font-extrabold">Blog</h1>
            <button
              type="button"
              onClick={() => patch(current.id, { status: current.status === "published" ? "draft" : "published" })}
              className={`min-h-11 rounded-full px-4 text-sm font-bold ${
                current.status === "published" ? "bg-ink text-paper" : "border border-line bg-card text-ink"
              }`}
            >
              {current.status === "published" ? "Live" : "Concept"}
            </button>
          </div>
          <label className={label} htmlFor="blog-title">Titel</label>
          <input id="blog-title" className={field} value={current.title} onChange={(event) => patch(current.id, { title: event.target.value })} />
          <label className={label} htmlFor="blog-date">Datum</label>
          <input id="blog-date" type="date" className={field} value={current.date} onChange={(event) => patch(current.id, { date: event.target.value })} />
          <label className={label} htmlFor="blog-image">Cover-URL</label>
          <input id="blog-image" className={field} value={current.image} onChange={(event) => patch(current.id, { image: event.target.value })} />
          <DropImage label="Of upload een cover" onFile={(url) => patch(current.id, { image: url })} />
          <label className={label} htmlFor="blog-lead">Korte samenvatting</label>
          <textarea id="blog-lead" rows={3} className={field} value={current.lead} onChange={(event) => patch(current.id, { lead: event.target.value })} />
          <p className={label}>Het verhaal</p>
          <RichText key={current.id} value={current.body} onChange={(body) => patch(current.id, { body })} />
          <button
            type="button"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
            onClick={() => {
              if (!window.confirm("Dit blog verwijderen?")) return
              write(posts.filter((post) => post.id !== current.id))
              setEditing(null)
            }}
          >
            <Trash2 className="h-4 w-4" />
            Verwijder blog
          </button>
        </form>
        <aside className="lg:sticky lg:top-6">
          <div className="mb-3 flex gap-2">
            <button type="button" onClick={() => setPreview("card")} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${preview === "card" ? "bg-ink text-paper" : "bg-card"}`}>Kaart</button>
            <button type="button" onClick={() => setPreview("article")} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${preview === "article" ? "bg-ink text-paper" : "bg-card"}`}>Artikel</button>
          </div>
          <div className="max-h-[78vh] overflow-auto rounded-card border border-line bg-card">
            {preview === "card" ? (
              <div className="p-4">
                <ProjectCard project={view} onOpen={() => setPreview("article")} />
              </div>
            ) : (
              <ArticleBody project={view} stacked />
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
