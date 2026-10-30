import { useEffect, useState } from "react"
import { adminSession } from "@/lib/admin-session"
import type { Analytics } from "@/lib/stats-query"

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
  return typeof row.uniques === "number" && Array.isArray(row.places) && Array.isArray(row.days)
}

function statsUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/stats`
}

function errorText(data: unknown) {
  if (!data || typeof data !== "object") return ""
  const row = data as { error?: unknown; errorMessage?: unknown }
  if (typeof row.error === "string" && row.error) return row.error
  if (typeof row.errorMessage === "string" && row.errorMessage) return row.errorMessage
  return ""
}

function ReturnDonut({ rate }: { rate: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const filled = (Math.max(0, Math.min(100, rate)) / 100) * circumference
  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36" role="img" aria-label={`${rate} procent komt terug`}>
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#E7E1D8" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#E11D48"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" textAnchor="middle" fill="#1E293B" fontSize="22" fontWeight="700">
        {rate}%
      </text>
      <text x="60" y="76" textAnchor="middle" fill="#64707e" fontSize="9">
        komt terug
      </text>
    </svg>
  )
}

function DayChart({ days }: { days: Analytics["days"] }) {
  const max = Math.max(1, ...days.map((day) => day.visits))
  const width = 640
  const height = 180
  const pad = 16
  const gap = 8
  const barWidth = (width - pad * 2 - gap * (days.length - 1)) / days.length
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="Bezoeken per dag">
      {days.map((day, index) => {
        const barHeight = Math.max(day.visits ? 6 : 2, Math.round((day.visits / max) * (height - 42)))
        const x = pad + index * (barWidth + gap)
        const y = height - 28 - barHeight
        return (
          <g key={day.day}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="5" fill={day.visits ? "#E11D48" : "#E7E1D8"} />
            {day.visits > 0 ? (
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">
                {day.visits}
              </text>
            ) : null}
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fill="#64707e" fontSize="10">
              {index % 2 === 0 ? day.label : ""}
            </text>
          </g>
        )
      })}
    </svg>
  )
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
    void fetch(statsUrl(), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "*/*" },
      body: JSON.stringify(session),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as unknown
        if (cancelled) return
        if (!response.ok || !isAnalytics(data)) {
          setError(errorText(data) || "De cijfers konden niet geladen worden.")
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

  const maxPlace = Math.max(1, ...stats.places.map((place) => place.visits))
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
        Herkomst op basis van IP, hoe lang iemand blijft, en hoe vaak die terugkomt.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([name, value]) => (
          <article key={name} className="rounded-card border border-line bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{name}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
        <article className="flex flex-col items-center rounded-card border border-line bg-card p-5 text-center">
          <h2 className="font-display text-lg font-extrabold">Terugkeer</h2>
          <div className="mt-4">
            <ReturnDonut rate={stats.returnRate} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {stats.uniques ? `${stats.avgReturns}× gemiddeld per bezoeker` : "Nog geen bezoeken"}
          </p>
        </article>
        <article className="rounded-card border border-line bg-card p-5">
          <h2 className="font-display text-lg font-extrabold">Bezoeken per dag</h2>
          <p className="mt-1 text-sm text-muted">De laatste 14 dagen</p>
          <div className="mt-3">
            <DayChart days={stats.days} />
          </div>
        </article>
      </div>

      <div className="mt-4 rounded-card border border-line bg-card p-5">
        <h2 className="font-display text-lg font-extrabold">Waar komen ze vandaan</h2>
        {stats.places.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nog geen bezoeken.</p>
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
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(8, Math.round((place.visits / maxPlace) * 100))}%` }}
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
