import { useEffect, useState, type FormEvent } from "react"
import { MessageSquare, X } from "lucide-react"
import { adminSession } from "@/lib/admin-session"
import { formatStamp } from "@/lib/audit-client"

type Note = { at: string; authorName: string; authorEmail: string; body: string }
type Item = {
  id: string
  at: string
  authorName: string
  authorEmail: string
  message: string
  status: string
  notes: Note[]
}

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  bekeken: "Bekeken",
  gesloten: "Gesloten",
  opgelost: "Opgelost",
}

function feedbackUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/feedback`
}

export function FeedbackDock() {
  const session = adminSession()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState("alle")
  const token = session?.token || ""
  const developer = session?.role === "Webdeveloper"
  const ticket = items.find((item) => item.id === active) || null
  const shown = items.filter((item) => filter === "alle" || item.status === filter)

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

  async function call(body: Record<string, unknown>) {
    const response = await fetch(feedbackUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: session?.token, ...body }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data?.error || "Mislukt.")
    return data
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const data = await call(ticket ? { action: "reply", id: ticket.id, message } : { action: "create", message })
      setItems((current) => {
        const next = current.filter((item) => item.id !== data.item.id)
        return [data.item, ...next]
      })
      if (!ticket) setActive(data.item.id)
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Versturen mislukt.")
    } finally {
      setBusy(false)
    }
  }

  async function setStatus(status: string) {
    if (!ticket) return
    setError("")
    try {
      const data = await call({ action: "status", id: ticket.id, status })
      setItems((current) => current.map((item) => (item.id === data.item.id ? data.item : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status wijzigen mislukt.")
    }
  }

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-3 sm:items-center" onClick={() => setOpen(false)}>
          <section
            className="flex h-[min(92vh,760px)] w-full max-w-5xl flex-col overflow-hidden rounded-card border border-line bg-card text-ink shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <div>
                <p className="font-display text-lg font-extrabold">Feedback</p>
                <p className="text-xs text-muted">Tickets, status en het gesprek.</p>
              </div>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-paper" onClick={() => setOpen(false)} aria-label="Sluiten">
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="grid min-h-0 flex-1 lg:grid-cols-[18rem_1fr]">
              <aside className={`min-h-0 overflow-y-auto border-line lg:border-r ${ticket ? "hidden lg:block" : ""}`}>
                <div className="flex gap-2 overflow-x-auto px-3 py-3">
                  {[["alle", "Alles"], ...Object.entries(STATUS_LABEL)].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${filter === id ? "bg-ink text-paper" : "bg-paper text-ink"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <ul className="space-y-2 px-3 pb-3">
                  {shown.length === 0 ? <li className="px-1 text-sm text-muted">Geen tickets in deze lijst.</li> : null}
                  {shown.map((item) => {
                    const stamp = formatStamp(item.at)
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActive(item.id)}
                          className={`w-full rounded-xl border px-3 py-3 text-left ${item.id === active ? "border-ink bg-paper" : "border-line bg-card"}`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted">{stamp.date} · {stamp.time}</span>
                            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-paper">{STATUS_LABEL[item.status] || item.status}</span>
                          </span>
                          <span className="mt-2 line-clamp-2 block text-sm leading-relaxed">{item.message}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </aside>
              <div className={`flex min-h-0 flex-col ${ticket ? "" : "hidden lg:flex"}`}>
                {ticket ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
                      <button type="button" className="text-sm font-semibold text-muted lg:hidden" onClick={() => setActive(null)}>
                        ← Tickets
                      </button>
                      <p className="mr-auto text-sm font-semibold">{ticket.authorName}</p>
                      <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-paper">{STATUS_LABEL[ticket.status] || ticket.status}</span>
                    </div>
                    {developer ? (
                      <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
                        <span className="self-center text-xs font-bold uppercase tracking-wide text-muted">Status</span>
                        {Object.entries(STATUS_LABEL).map(([id, label]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setStatus(id)}
                            className={`min-h-10 rounded-full px-3 text-xs font-bold ${ticket.status === id ? "bg-accent text-accent-ink" : "bg-paper text-ink"}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                      {ticket.notes.map((note, index) => {
                        const fromJoshua = note.authorEmail === "joshua.bosma@kpnmail.nl"
                        const stamp = formatStamp(note.at)
                        return (
                          <li key={`${note.at}-${index}`} className={`max-w-[40rem] rounded-2xl px-4 py-3 ${fromJoshua ? "ml-auto bg-ink text-paper" : "bg-paper"}`}>
                            <p className={`text-xs ${fromJoshua ? "text-paper/70" : "text-muted"}`}>
                              {fromJoshua ? "Joshua" : "Stefanie"} · {stamp.date} {stamp.time}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <div className="grid flex-1 place-items-center px-6 text-center text-sm text-muted">Kies links een ticket, of schrijf hieronder een nieuw bericht.</div>
                )}
                <form onSubmit={submit} className="border-t border-line px-4 py-3">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted" htmlFor="feedback-message">
                    {ticket ? "Antwoord" : "Nieuw ticket"}
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={3}
                    placeholder={ticket ? "Schrijf een antwoord." : "Wat moet er anders, of wat loopt vast?"}
                    className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
                  <button type="submit" disabled={busy} className="mt-2 inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-bold text-accent-ink disabled:opacity-60">
                    {busy ? "Versturen…" : ticket ? "Verstuur antwoord" : "Open ticket"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      ) : null}
      <div className="fixed right-4 bottom-4 z-40">
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-paper shadow-lg">
          <MessageSquare className="h-4 w-4" />
          Feedback
        </button>
      </div>
    </>
  )
}
