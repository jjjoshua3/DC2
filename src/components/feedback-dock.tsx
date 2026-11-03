import { useEffect, useState, type FormEvent } from "react"
import { MessageSquare, X } from "lucide-react"
import { adminSession } from "@/lib/admin-session"
import { formatStamp } from "@/lib/audit-client"

type Item = {
  id: string
  at: string
  authorName: string
  message: string
  status: string
  reply: string
}

const STATUS_LABEL: Record<string, string> = {
  nieuw: "Nieuw",
  gezien: "Gezien",
  bezig: "In behandeling",
  klaar: "Klaar",
}

function feedbackUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/feedback`
}

export function FeedbackDock() {
  const session = adminSession()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const token = session?.token || ""

  useEffect(() => {
    if (!open || !token) return
    void fetch(feedbackUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "list", token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.error) setError(data.error)
        else setItems(data.items || [])
      })
      .catch(() => setError("Feedback laden mislukt."))
  }, [open, token])

  if (!session) return null

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    setBusy(true)
    setError("")
    try {
      const response = await fetch(feedbackUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", token: session.token, message }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || "Versturen mislukt.")
      setItems((current) => [data.item, ...current])
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Versturen mislukt.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      {open ? (
        <section className="flex max-h-[70vh] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-card border border-line bg-card text-ink shadow-xl">
          <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="font-display text-lg font-extrabold">Feedback</p>
              <p className="text-xs text-muted">Voor Joshua. Je ziet hier de status.</p>
            </div>
            <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-paper" onClick={() => setOpen(false)} aria-label="Sluiten">
              <X className="h-4 w-4" />
            </button>
          </header>
          <form onSubmit={submit} className="border-b border-line px-4 py-3">
            <label className="text-xs font-bold uppercase tracking-wide text-muted" htmlFor="feedback-message">
              Nieuw bericht
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              placeholder="Wat moet er anders, of wat loopt vast?"
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-bold text-accent-ink disabled:opacity-60"
            >
              {busy ? "Versturen…" : "Verstuur naar Joshua"}
            </button>
          </form>
          <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {items.length === 0 ? <li className="text-sm text-muted">Nog geen feedback.</li> : null}
            {items.map((item) => {
              const stamp = formatStamp(item.at)
              return (
                <li key={item.id} className="rounded-xl border border-line bg-paper px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted">
                      {stamp.date} · {stamp.time}
                    </p>
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-paper">
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{item.message}</p>
                  {item.reply ? <p className="mt-2 text-sm text-muted">Joshua: {item.reply}</p> : null}
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-paper shadow-lg"
      >
        <MessageSquare className="h-4 w-4" />
        Feedback
      </button>
    </div>
  )
}
