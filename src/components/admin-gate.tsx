import { useEffect, useState, type FormEvent } from "react"
import { CmsPage } from "@/components/cms-page"
import { clearAdminSession, setAdminSession, adminSession } from "@/lib/admin-session"
import { loginAdmin } from "@/lib/site-store"

export function AdminGate() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setAuthed(!!adminSession())
    setReady(true)
  }, [])

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-ink text-paper">Admin laden…</div>
  }
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />
  return (
    <CmsPage
      onLogout={() => {
        clearAdminSession()
        setAuthed(false)
      }}
    />
  )
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const result = await loginAdmin({ data: { username, password } })
      if (!result.ok) {
        setError("Gebruikersnaam of wachtwoord klopt niet.")
        setBusy(false)
        return
      }
      setAdminSession(username.trim(), password)
      onSuccess()
    } catch {
      setError("Inloggen lukt nu niet. Probeer het opnieuw.")
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-paper">
      <form onSubmit={submit} className="w-full max-w-md rounded-card bg-card p-8 text-ink">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">DE CONNECTORS</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">Admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Hier pas je de one-pager en de blogs aan. Wat je opslaat, zien alle bezoekers.
        </p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="user">
          Gebruikersnaam
        </label>
        <input
          id="user"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent"
        />
        <label className="mt-4 block text-sm font-semibold" htmlFor="pass">
          Wachtwoord
        </label>
        <input
          id="pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent"
        />
        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink disabled:opacity-60"
        >
          {busy ? "Bezig…" : "Inloggen"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Tijdelijk: gebruikersnaam en wachtwoord zijn allebei Admin. Dit vervang je straks door Supabase.
        </p>
      </form>
    </div>
  )
}
