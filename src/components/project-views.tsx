import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Play, X } from "lucide-react"
import type { Project } from "@/lib/site-types"
import { sanitizeHtml, toEmbedUrl } from "@/lib/media"

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  const image = project.mediaType === "image" ? project.mediaUrl : project.poster
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-ink">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid h-full place-items-center font-display text-lg font-bold text-paper">
            {project.title || "Nieuw verhaal"}
          </span>
        )}
        {project.mediaType === "video" ? (
          <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink shadow-md">
            <Play className="h-5 w-5 fill-current" aria-hidden />
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          {project.category || "Project"}
        </span>
        <span className="font-display text-xl font-extrabold leading-tight text-ink">
          {project.title || "Zonder titel"}
        </span>
        {project.lead ? (
          <span className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{project.lead}</span>
        ) : null}
      </span>
    </button>
  )
}

function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!images.length) return null
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(src)}
            className="overflow-hidden rounded-xl border border-line bg-paper"
          >
            <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
          </button>
        ))}
      </div>
      {open ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-4"
          role="dialog"
          aria-modal
          aria-label="Foto"
        >
          <button
            type="button"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-card text-ink"
            onClick={() => setOpen(null)}
            aria-label="Sluit foto"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={open} alt="" className="max-h-[86vh] max-w-full rounded-xl object-contain" />
        </div>
      ) : null}
    </>
  )
}

export function ArticleBody({ project, stacked = false }: { project: Project; stacked?: boolean }) {
  const embed = project.mediaType === "video" ? toEmbedUrl(project.mediaUrl) : null
  const image = project.mediaType === "image" ? project.mediaUrl : ""
  return (
    <div className={stacked ? "flex flex-col" : "grid max-h-[92vh] lg:grid-cols-2"}>
      <div className="bg-ink">
        {embed ? (
          <div className={stacked ? "aspect-video w-full" : "aspect-video w-full lg:aspect-auto lg:h-full lg:min-h-80"}>
            <iframe
              src={embed}
              title={project.title}
              className="h-full min-h-56 w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : image ? (
          <img
            src={image}
            alt=""
            className={
              stacked
                ? "h-56 w-full object-cover"
                : "h-64 w-full object-cover lg:h-full lg:min-h-80 lg:max-h-[92vh]"
            }
          />
        ) : (
          <div className="grid h-56 place-items-center px-8 text-center font-display text-2xl font-extrabold text-paper lg:h-full">
            {project.title || "Nieuw verhaal"}
          </div>
        )}
      </div>
      <div className={stacked ? "px-5 py-6" : "overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:max-h-[92vh]"}>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          {project.category || "Project"}
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {project.title || "Zonder titel"}
        </h2>
        {project.lead ? (
          <p className="mt-4 text-lg font-semibold leading-relaxed text-ink">{project.lead}</p>
        ) : null}
        {project.body ? (
          <div
            className="story mt-4 font-story text-base leading-relaxed text-ink-soft"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.body) }}
          />
        ) : null}
        <Gallery images={project.gallery} />
        {project.ctaLabel && project.ctaUrl ? (
          <a
            href={project.ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink"
          >
            {project.ctaLabel}
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  return (
    <Dialog.Root open={!!project} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(1080px,calc(100%-1rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card bg-card outline-none">
          <Dialog.Close
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-card text-ink shadow-sm"
            aria-label="Sluiten"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
          {project ? (
            <>
              <Dialog.Title className="sr-only">{project.title}</Dialog.Title>
              <ArticleBody project={project} />
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
