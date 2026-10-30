import { useEffect, useState, type FormEvent } from "react"
import { CmsPage } from "@/components/cms-page"
import { clearAdminSession, setAdminSession, adminSession } from "@/lib/admin-session"
import { postAudit } from "@/lib/audit-client"
import { SUPABASE_KEY, SUPABASE_URL, accountFromToken, adminAccount } from "@/lib/admins"

export function AdminGate() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const fromUrl = await sessionFromUrl()
      if (cancelled) return
      if (fromUrl) {
        setAdminSession(fromUrl)
        window.history.replaceState(null, "", window.location.pathname)
        void postAudit({ action: "session", token: fromUrl.token }).catch(() => {})
        setAuthed(true)
        setReady(true)
        return
      }
      const existing = adminSession()
      if (existing) {
        const account = await accountFromToken(existing.token).catch(() => null)
        if (!account) clearAdminSession()
        if (!cancelled) setAuthed(!!account)
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-ink text-paper">Admin laden…</div>
  }
  if (!authed) return <AdminLogin />
  return (
    <CmsPage
      onLogout={() => {
        clearAdminSession()
        setAuthed(false)
      }}
    />
  )
}

function readToken() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""))
  const query = new URLSearchParams(window.location.search)
  return hash.get("access_token") || query.get("access_token") || ""
}

async function sessionFromUrl() {
  const token = readToken()
  if (!token) return null
  const account = await accountFromToken(token)
  if (!account) return null
  return { ...account, token }
}

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    setSent("")
    const account = adminAccount(email)
    if (!account) {
      setError("Dit e-mailadres heeft geen toegang.")
      setBusy(false)
      return
    }
    try {
      const redirect = `${window.location.origin}/admin`
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirect)}`,
        {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, "content-type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        },
      )
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { msg?: string } | null
        throw new Error(data?.msg || "De link kon niet worden verstuurd.")
      }
      void postAudit({
        action: "login",
        username: email.trim().toLowerCase(),
        summary: "Inloglink verstuurd",
        detail: "Magische link",
        ok: true,
      }).catch(() => {})
      setSent(`De inloglink is verstuurd naar ${email.trim().toLowerCase()}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "De link kon niet worden verstuurd.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-paper">
      <form onSubmit={submit} className="w-full max-w-md rounded-card bg-card p-8 text-ink">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">DE CONNECTORS</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">Admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Vul je e-mailadres in. Je krijgt een magische link om in te loggen.
        </p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="email">
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="naam@deconnectors.com"
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 outline-none focus:border-accent"
        />
        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
        {sent ? <p className="mt-3 text-sm text-ink">{sent}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink disabled:opacity-60"
        >
          {busy ? "Bezig…" : "Stuur inloglink"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Alleen Joshua en Stefanie kunnen inloggen. De link opent deze beheerpagina.
        </p>
      </form>
    </div>
  )
}
