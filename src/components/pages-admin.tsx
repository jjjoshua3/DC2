import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { DropImage } from "@/components/editor-fields"
import { newId } from "@/lib/media"
import type { CustomPage, PageBlock, PageBlockKind, PageCard, SiteData } from "@/lib/site-types"

const field = "mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
const RESERVED = new Set(["admin", "beheer", "blog", "contact", "gedichten", "over", "projecten", "wat", "api", "pagina"])

const KINDS: { id: PageBlockKind; label: string }[] = [
  { id: "split", label: "Beeld en tekst" },
  { id: "text", label: "Alleen tekst" },
  { id: "cards", label: "Blokjes naast elkaar" },
  { id: "banner", label: "Banner" },
  { id: "contact", label: "Contactvak" },
]

const STARTS: { id: string; label: string; note: string; blocks: () => PageBlock[] }[] = [
  { id: "wat", label: "Zoals Wat", note: "Beeld links, tekst rechts, daaronder blokjes.", blocks: () => [split("left"), cards()] },
  { id: "rechts", label: "Beeld rechts", note: "Tekst links, foto of film rechts.", blocks: () => [split("right")] },
  { id: "tekst", label: "Alleen tekst", note: "Een titel en een stuk tekst.", blocks: () => [blank("text")] },
  { id: "banner", label: "Banner", note: "Een zin over de volle breedte.", blocks: () => [blank("banner", { text: "Een korte zin." })] },
  { id: "leeg", label: "Leeg", note: "Zelf blokken kiezen.", blocks: () => [] },
]

function blank(kind: PageBlockKind, extra: Partial<PageBlock> = {}): PageBlock {
  return { id: newId(), kind, title: "", text: "", mediaType: "image", mediaUrl: "", mediaSide: "left", cards: [], ...extra }
}

function split(side: "left" | "right"): PageBlock {
  return blank("split", { title: "Titel", text: "Tekst naast het beeld.", mediaSide: side })
}

function cards(): PageBlock {
  const card = (): PageCard => ({ title: "Blok", text: "", image: "" })
  return blank("cards", { title: "Wat ik voor je kan doen", cards: [card(), card(), card()] })
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || "pagina"
}

function uniqueSlug(title: string, pages: CustomPage[]) {
  const base = slugify(title)
  let slug = RESERVED.has(base) ? `${base}-pagina` : base
  let n = 2
  while (pages.some((page) => page.slug === slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

export function PagesAdmin({ data, commit }: { data: SiteData; commit: (next: SiteData) => void }) {
  const pages = data.pages ?? []
  function save(next: CustomPage[]) {
    commit({ ...data, pages: next })
  }
  function patch(id: string, part: Partial<CustomPage>) {
    save(pages.map((page) => (page.id === id ? { ...page, ...part } : page)))
  }
  return (
    <section className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Eigen pagina’s</h1>
          <p className="mt-2 text-sm text-muted">Kies een layout. Daarna zet je zelf blokken neer, verplaatst ze of haalt ze weg.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {STARTS.map((start) => (
          <button
            key={start.id}
            type="button"
            className="rounded-card border border-line bg-card p-4 text-left hover:border-accent"
            onClick={() => {
              const title = "Nieuwe pagina"
              const page: CustomPage = {
                id: newId(),
                slug: uniqueSlug(title, pages),
                title,
                status: "draft",
                inMenu: false,
                blocks: start.blocks(),
              }
              save([page, ...pages])
            }}
          >
            <p className="font-display font-extrabold">{start.label}</p>
            <p className="mt-1 text-sm text-muted">{start.note}</p>
          </button>
        ))}
      </div>
      <ul className="mt-8 space-y-6">
        {pages.map((page, index) => (
          <li key={page.id} className="rounded-card border border-line bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-lg font-extrabold">{page.title || "Zonder titel"}</p>
              <div className="flex gap-2">
                <button type="button" aria-label="Omhoog" className="grid h-11 w-11 place-items-center rounded-full border border-line" onClick={() => move(pages, index, -1, save)}>
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Omlaag" className="grid h-11 w-11 place-items-center rounded-full border border-line" onClick={() => move(pages, index, 1, save)}>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm font-semibold text-accent" onClick={() => save(pages.filter((item) => item.id !== page.id))}>
                  <Trash2 className="h-4 w-4" />
                  Verwijder
                </button>
              </div>
            </div>
            <label className="mt-3 block text-sm font-semibold">
              Titel
              <input className={field} value={page.title} onChange={(event) => patch(page.id, { title: event.target.value })} />
            </label>
            <label className="mt-3 block text-sm font-semibold">
              Adres
              <input
                className={field}
                value={page.slug}
                onChange={(event) => patch(page.id, { slug: slugify(event.target.value) })}
              />
            </label>
            <p className="mt-1 text-xs text-muted">/pagina/{page.slug || "…"}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <label className="inline-flex min-h-11 items-center gap-2">
                <input type="checkbox" checked={page.inMenu} onChange={(event) => patch(page.id, { inMenu: event.target.checked })} />
                In het menu
              </label>
              <label className="inline-flex min-h-11 items-center gap-2">
                <input type="checkbox" checked={page.status === "published"} onChange={(event) => patch(page.id, { status: event.target.checked ? "published" : "draft" })} />
                Live
              </label>
            </div>
            <div className="mt-4 space-y-3">
              {page.blocks.map((block, blockIndex) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(next) => patch(page.id, { blocks: page.blocks.map((item) => (item.id === block.id ? next : item)) })}
                  onRemove={() => patch(page.id, { blocks: page.blocks.filter((item) => item.id !== block.id) })}
                  onUp={() => patch(page.id, { blocks: swap(page.blocks, blockIndex, -1) })}
                  onDown={() => patch(page.id, { blocks: swap(page.blocks, blockIndex, 1) })}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {KINDS.map((kind) => (
                <button
                  key={kind.id}
                  type="button"
                  className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold"
                  onClick={() => patch(page.id, { blocks: [...page.blocks, kind.id === "cards" ? cards() : kind.id === "split" ? split("left") : blank(kind.id)] })}
                >
                  <Plus className="h-4 w-4" />
                  {kind.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function move(pages: CustomPage[], index: number, dir: -1 | 1, save: (next: CustomPage[]) => void) {
  const target = index + dir
  if (target < 0 || target >= pages.length) return
  const next = [...pages]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  save(next)
}

function swap<T>(list: T[], index: number, dir: -1 | 1) {
  const target = index + dir
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  onUp,
  onDown,
}: {
  block: PageBlock
  onChange: (next: PageBlock) => void
  onRemove: () => void
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select className="min-h-11 rounded-full border border-line bg-card px-3 text-sm font-semibold" value={block.kind} onChange={(event) => onChange({ ...block, kind: event.target.value as PageBlockKind })}>
          {KINDS.map((kind) => (
            <option key={kind.id} value={kind.id}>{kind.label}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="button" aria-label="Blok omhoog" className="grid h-11 w-11 place-items-center" onClick={onUp}><ChevronUp className="h-4 w-4" /></button>
          <button type="button" aria-label="Blok omlaag" className="grid h-11 w-11 place-items-center" onClick={onDown}><ChevronDown className="h-4 w-4" /></button>
          <button type="button" className="text-sm font-semibold text-accent" onClick={onRemove}>Weg</button>
        </div>
      </div>
      {block.kind === "contact" ? <p className="mt-3 text-sm text-muted">Gebruikt het contactvak van de site.</p> : null}
      {block.kind === "banner" ? (
        <label className="mt-3 block text-sm font-semibold">
          Tekst
          <textarea rows={2} className={field} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />
        </label>
      ) : null}
      {block.kind === "text" || block.kind === "split" || block.kind === "cards" ? (
        <>
          <label className="mt-3 block text-sm font-semibold">
            Titel
            <input className={field} value={block.title} onChange={(event) => onChange({ ...block, title: event.target.value })} />
          </label>
          {block.kind !== "cards" ? (
            <label className="mt-3 block text-sm font-semibold">
              Tekst
              <textarea rows={4} className={field} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />
            </label>
          ) : null}
        </>
      ) : null}
      {block.kind === "split" ? (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`min-h-11 rounded-full px-3 text-sm font-semibold ${block.mediaSide === "left" ? "bg-ink text-paper" : "border border-line"}`} onClick={() => onChange({ ...block, mediaSide: "left" })}>Beeld links</button>
            <button type="button" className={`min-h-11 rounded-full px-3 text-sm font-semibold ${block.mediaSide === "right" ? "bg-ink text-paper" : "border border-line"}`} onClick={() => onChange({ ...block, mediaSide: "right" })}>Beeld rechts</button>
            <button type="button" className={`min-h-11 rounded-full px-3 text-sm font-semibold ${block.mediaType === "image" ? "bg-ink text-paper" : "border border-line"}`} onClick={() => onChange({ ...block, mediaType: "image" })}>Foto</button>
            <button type="button" className={`min-h-11 rounded-full px-3 text-sm font-semibold ${block.mediaType === "video" ? "bg-ink text-paper" : "border border-line"}`} onClick={() => onChange({ ...block, mediaType: "video" })}>Video</button>
          </div>
          <label className="mt-3 block text-sm font-semibold">
            {block.mediaType === "video" ? "YouTube-, Vimeo- of videolink" : "Foto-URL"}
            <input className={field} value={block.mediaUrl} onChange={(event) => onChange({ ...block, mediaUrl: event.target.value })} />
          </label>
          {block.mediaType === "image" ? <DropImage label="Upload foto" onFile={(url) => onChange({ ...block, mediaUrl: url })} /> : null}
        </div>
      ) : null}
      {block.kind === "cards" ? (
        <div className="mt-3 space-y-3">
          {block.cards.map((card, index) => (
            <div key={`${block.id}-${index}`} className="rounded-xl border border-line p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold">Blokje {index + 1}</p>
                <button type="button" className="text-sm font-semibold text-accent" onClick={() => onChange({ ...block, cards: block.cards.filter((_, i) => i !== index) })}>Weg</button>
              </div>
              <input className={field} placeholder="Titel" value={card.title} onChange={(event) => onChange({ ...block, cards: block.cards.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)) })} />
              <textarea rows={2} className={field} placeholder="Tekst" value={card.text} onChange={(event) => onChange({ ...block, cards: block.cards.map((item, i) => (i === index ? { ...item, text: event.target.value } : item)) })} />
              <DropImage label="Foto bij dit blokje" onFile={(url) => onChange({ ...block, cards: block.cards.map((item, i) => (i === index ? { ...item, image: url } : item)) })} />
            </div>
          ))}
          <button type="button" className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm font-semibold" onClick={() => onChange({ ...block, cards: [...block.cards, { title: "Blok", text: "", image: "" }] })}>
            Blokje toevoegen
          </button>
        </div>
      ) : null}
    </div>
  )
}
