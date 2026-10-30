import { useEffect, useState, type FormEvent } from "react"
import { CmsPage } from "@/components/cms-page"
import { clearAdminSession, setAdminSession, adminSession } from "@/lib/admin-session"
import { postAudit } from "@/lib/audit-client"
import { adminAccount } from "@/lib/admins"

type Pending = {
  token: string
  email: string
  name: string
  role: string
  totp: "setup" | "challenge" | "skip"
}

export function AdminGate() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const fromUrl = await sessionFromUrl()
      if (cancelled) return
      if (fromUrl) {
        if (fromUrl.totp === "skip") {
          setAdminSession(fromUrl)
          void postAudit({ action: "session", token: fromUrl.token }).catch(() => {})
          setAuthed(true)
        } else {
          setPending(fromUrl)
        }
        window.history.replaceState(null, "", window.location.pathname)
        setReady(true)
        return
      }
      const existing = adminSession()
      if (existing) setAuthed(true)
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-ink text-paper">Admin laden…</div>
  }
  if (pending) {
    return (
      <TotpStep
        pending={pending}
        onDone={() => {
          setAdminSession(pending)
          void postAudit({ action: "session", token: pending.token }).catch(() => {})
          setPending(null)
          setAuthed(true)
        }}
      />
    )
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

function magicUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/magic`
}

async function sessionFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const magic = params.get("magic")
  if (!magic) return null
  const response = await fetch(magicUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: magic }),
  })
  const data = (await response.json().catch(() => null)) as {
    token?: string
    account?: { email: string; name: string; role: string }
    totp?: "setup" | "challenge" | "skip"
  } | null
  if (!response.ok || !data?.token || !data.account) return null
  return { ...data.account, token: data.token, totp: data.totp || "skip" }
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
      const response = await fetch(magicUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(data?.error || "De link kon niet worden verstuurd.")
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
      </form>
    </div>
  )
}

function TotpStep({ pending, onDone }: { pending: Pending; onDone: () => void }) {
  const [qr, setQr] = useState("")
  const [secret, setSecret] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (pending.totp !== "setup") return
    void fetch(magicUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "totp-setup", token: pending.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        setQr(data.qr || "")
        setSecret(data.secret || "")
      })
      .catch(() => setError("De authenticator kon niet worden klaargezet."))
  }, [pending])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const response = await fetch(magicUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: pending.totp === "setup" ? "totp-confirm" : "totp-verify",
          token: pending.token,
          code,
        }),
      })
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(data?.error || "De code is onjuist.")
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : "De code is onjuist.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-paper">
      <form onSubmit={submit} className="w-full max-w-md rounded-card bg-card p-8 text-ink">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">DE CONNECTORS</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {pending.totp === "setup" ? "Authenticator instellen" : "Authenticator"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {pending.totp === "setup"
            ? "Scan de code met Google Authenticator. Daarna vul je de 6 cijfers in."
            : "Vul de 6 cijfers uit Google Authenticator in."}
        </p>
        {pending.totp === "setup" && qr ? (
          <img src={qr} alt="QR-code voor Google Authenticator" className="mx-auto mt-5 h-48 w-48 rounded-xl bg-white p-2" />
        ) : null}
        {pending.totp === "setup" && secret ? (
          <p className="mt-3 break-all text-center text-xs text-muted">Of typ deze sleutel: {secret}</p>
        ) : null}
        <label className="mt-6 block text-sm font-semibold" htmlFor="code">
          Code
        </label>
        <input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="123456"
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 text-center text-lg tracking-[0.3em] outline-none focus:border-accent"
        />
        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink disabled:opacity-60"
        >
          {busy ? "Bezig…" : "Bevestigen"}
        </button>
      </form>
    </div>
  )
}