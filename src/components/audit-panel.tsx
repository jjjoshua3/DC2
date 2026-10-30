import { useEffect, useState } from "react"
import { adminSession } from "@/lib/admin-session"
import { formatStamp, postAudit, type AuditEvent } from "@/lib/audit-client"

function passwordLabel(event: AuditEvent) {
  if (event.kind !== "login") return "—"
  return event.ok ? "Juist" : "Verkeerd"
}

function placeLabel(event: AuditEvent) {
  if (event.city && event.country) return `${event.city}, ${event.country}`
  return event.country || "Onbekend"
}

export function AuditPanel() {
  const [events, setEvents] = useState<AuditEvent[] | null>(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "login" | "change">("all")

  useEffect(() => {
    const session = adminSession()
    if (!session) {
      setError("Log opnieuw in om de audit te zien.")
      return
    }
    let cancelled = false
    void postAudit({ action: "list", username: session.username, password: session.password })
      .then((data) => {
        if (!cancelled) setEvents(data?.events ?? [])
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "De audit kon niet geladen worden.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const shown = (events ?? []).filter((event) => {
    if (filter === "login") return event.kind === "login" || event.kind === "logout"
    if (filter === "change") return event.kind === "change"
    return true
  })

  return (
    <section>
      <h1 className="font-display text-2xl font-extrabold">Audit</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Elke inlogpoging en elke opgeslagen wijziging. Datum als dag-maand-jaar, tijd in 24 uur.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "Alles"],
            ["login", "Inloggen"],
            ["change", "Wijzigingen"],
          ] as const
        ).map(([id, name]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
              filter === id ? "bg-accent text-accent-ink" : "border border-line bg-card"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {error ? <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-sm">{error}</p> : null}
      {!events && !error ? <p className="mt-4 text-sm text-muted">Audit laden…</p> : null}
      {events && shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nog niets gelogd. Log opnieuw in of sla een wijziging op.</p>
      ) : null}
      {shown.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-card">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-3 font-bold">Datum</th>
                <th className="px-3 py-3 font-bold">Tijd</th>
                <th className="px-3 py-3 font-bold">Gebeurtenis</th>
                <th className="px-3 py-3 font-bold">Gebruikersnaam</th>
                <th className="px-3 py-3 font-bold">Wachtwoord</th>
                <th className="px-3 py-3 font-bold">IP</th>
                <th className="px-3 py-3 font-bold">Plaats</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((event) => {
                const stamp = formatStamp(event.at)
                return (
                  <tr key={event.id} className="border-b border-line align-top last:border-0">
                    <td className="whitespace-nowrap px-3 py-3 font-semibold">{stamp.date}</td>
                    <td className="whitespace-nowrap px-3 py-3">{stamp.time}</td>
                    <td className="px-3 py-3">
                      <p className="font-semibold">{event.summary}</p>
                      {event.detail && event.detail !== event.summary ? (
                        <p className="mt-1 text-muted">{event.detail}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{event.username || "—"}</td>
                    <td className="px-3 py-3">
                      <span className={event.kind === "login" && event.ok === false ? "font-semibold text-accent" : ""}>
                        {passwordLabel(event)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs">{event.ip || "Onbekend"}</td>
                    <td className="px-3 py-3">{placeLabel(event)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
