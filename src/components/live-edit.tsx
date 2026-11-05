import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { adminSession } from "@/lib/admin-session"
import { DataService } from "@/lib/data-service"
import { saveSiteDocument } from "@/lib/site-store"
import { logChange } from "@/lib/audit-client"
import { compressImage } from "@/lib/media"
import type { SiteData } from "@/lib/site-types"

let saveTimer: number | null = null

export function useEditor() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    setOn(Boolean(adminSession()))
  }, [])
  return on
}

export function publishSite(next: SiteData, summary: string) {
  const stamped = { ...next, updatedAt: Date.now() }
  DataService.save(stamped)
  const session = adminSession()
  if (!session) return
  if (saveTimer) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    logChange(summary, summary)
    void saveSiteDocument({
      data: { token: session.token, document: JSON.stringify(DataService.load()) },
    }).catch(() => {})
  }, 500)
}

export function EditableText({
  value,
  onSave,
  className,
  multiline,
}: {
  value: string
  onSave: (value: string) => void
  className?: string
  multiline?: boolean
}) {
  const editing = useEditor()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  if (!editing) {
    if (!value) return null
    return <span className={className}>{value}</span>
  }
  if (!open) {
    return (
      <span
        role="button"
        tabIndex={0}
        className={`${className ?? ""} cursor-text rounded-sm outline outline-1 outline-dashed outline-transparent hover:outline-accent`}
        title="Klik om aan te passen"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDraft(value)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setDraft(value)
            setOpen(true)
          }
        }}
      >
        {value || "Tekst toevoegen"}
      </span>
    )
  }
  const finish = () => {
    setOpen(false)
    if (draft !== value) onSave(draft)
  }
  if (multiline) {
    return (
      <textarea
        autoFocus
        rows={Math.min(12, Math.max(3, draft.split("\n").length + 1))}
        className="w-full rounded-md bg-card p-2 font-sans text-base not-italic text-ink outline outline-2 outline-accent"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={finish}
      />
    )
  }
  return (
    <input
      autoFocus
      className="w-full rounded-md bg-card px-2 font-sans text-base not-italic text-ink outline outline-2 outline-accent"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={finish}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur()
        if (event.key === "Escape") setOpen(false)
      }}
    />
  )
}

export function EditablePhoto({
  src,
  alt,
  className,
  onSave,
  label = "Foto",
}: {
  src: string
  alt: string
  className: string
  onSave: (url: string) => void
  label?: string
}) {
  const editing = useEditor()
  if (!src && !editing) return null
  return (
    <div className="relative">
      {src ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className={`${className} grid place-items-center bg-ink px-6 text-center font-display text-lg font-bold text-paper`}>
          Foto toevoegen
        </div>
      )}
      {editing ? (
        <label className="absolute bottom-3 right-3 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-4 text-sm font-bold text-accent-ink">
          {label}
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

export function EditBar() {
  const on = useEditor()
  if (!on) return null
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-ink px-4 py-2 text-sm text-paper shadow-lg">
      <span>Klik een tekst of foto om die live aan te passen.</span>
      <Link to="/admin" className="shrink-0 font-semibold text-accent">
        Meer
      </Link>
    </div>
  )
}
