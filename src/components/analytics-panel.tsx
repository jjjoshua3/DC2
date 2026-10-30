import { useEffect, useState } from "react"
import { adminSession } from "@/lib/admin-session"
import type { Analytics } from "@/lib/analytics"

function formatDuration(seconds: number) {
  if (!seconds) return "—"
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (!minutes) return `${rest} sec`
  return `${minutes} min ${rest} sec`
}

function isAnalytics(value: unknown): value is Analytics {
  if (!value || typeof value !== "object") return false
  const row = value as Partial<Analytics>
  return typeof row.uniques === "number" && Array.isArray(row.places)
}

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Analytics | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const session = adminSession()
    if (!session) {
      setError("Log opnieuw in om de cijfers te zien.")
      return
    }
    let cancelled = false
    void fetch("/api/stats", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(session),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { error?: string } | Analytics | null
        if (cancelled) return
        if (!response.ok || !isAnalytics(data)) {
          setError(data && "error" in data && data.error ? data.error : "De cijfers konden niet geladen worden.")
          return
        }
        setStats(data)
      })
      .catch(() => {
        if (!cancelled) setError("De cijfers konden niet geladen worden.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <section>
        <h1 className="font-display text-2xl font-extrabold">Bezoekers</h1>
        <p className="mt-3 rounded-xl border border-line bg-card px-4 py-3 text-sm">{error}</p>
      </section>
    )
  }
  if (!stats) return <p className="text-sm text-muted">Cijfers laden…</p>

  const max = Math.max(1, ...stats.places.map((place) => place.visits))
  const cards = [
    ["Unieke bezoekers", String(stats.uniques)],
    ["Gemiddeld op de site", formatDuration(stats.avgSeconds)],
    ["Komt gemiddeld terug", stats.uniques ? `${stats.avgReturns}×` : "—"],
    ["Komt vaker terug", stats.uniques ? `${stats.returnRate}%` : "—"],
  ]

  return (
    <section>
      <h1 className="font-display text-2xl font-extrabold">Bezoekers</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Herkomst op basis van IP. Tijd op de site, unieke bezoekers en hoe vaak iemand terugkomt.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([name, value]) => (
          <article key={name} className="rounded-card border border-line bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{name}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-card border border-line bg-card p-5">
        <h2 className="font-display text-xl font-extrabold">Waar komen ze vandaan</h2>
        {stats.places.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nog geen bezoeken. Open de site in een ander venster, dan verschijnt het hier.</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {stats.places.map((place) => (
              <li key={place.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold">{place.label}</span>
                  <span className="text-muted">
                    {place.visits} bezoeken · {place.people} personen
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(8, Math.round((place.visits / max) * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
