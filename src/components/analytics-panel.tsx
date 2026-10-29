import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { adminSession } from "@/lib/admin-session"
import { fetchAnalytics, type Analytics } from "@/lib/analytics"

function formatDuration(seconds: number) {
  if (!seconds) return "—"
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (!minutes) return `${rest} sec`
  return `${minutes} min ${rest} sec`
}

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Analytics | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const session = adminSession()
    if (!session) return
    void fetchAnalytics({ data: session })
      .then(setStats)
      .catch(() => setError("De cijfers konden niet geladen worden."))
  }, [])

  if (error) return <p className="text-sm text-muted">{error}</p>
  if (!stats) return <p className="text-sm text-muted">Cijfers laden…</p>

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
          <>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.places} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <XAxis type="number" allowDecimals={false} stroke="#64707e" fontSize={12} />
                  <YAxis type="category" dataKey="label" width={140} stroke="#64707e" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="visits" name="Bezoeken" fill="#E11D48" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 divide-y divide-line text-sm">
              {stats.places.map((place) => (
                <li key={place.label} className="flex items-center justify-between py-2">
                  <span>{place.label}</span>
                  <span className="text-muted">
                    {place.visits} bezoeken · {place.people} personen
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
