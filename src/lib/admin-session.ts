import { adminAccount } from "@/lib/admins"

const EMAIL_KEY = "dc.admin.email"
const NAME_KEY = "dc.admin.name"
const ROLE_KEY = "dc.admin.role"
const TOKEN_KEY = "dc.admin.token"
const SEEN_KEY = "dc.admin.seen"
const IDLE_KEY = "dc.admin.idle"
const FORCED_KEY = "dc.admin.forced"
const IDLE_MS = 60 * 60 * 1000

export type AdminSession = {
  email: string
  name: string
  role: string
  token: string
  username: string
}

export function adminSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  const email = sessionStorage.getItem(EMAIL_KEY)
  const token = sessionStorage.getItem(TOKEN_KEY)
  const name = sessionStorage.getItem(NAME_KEY)
  if (!email || !token || !name) return null
  const account = adminAccount(email)
  return {
    email,
    name,
    role: sessionStorage.getItem(ROLE_KEY) || account?.role || "",
    token,
    username: email,
  }
}

export function setAdminSession(input: { email: string; name: string; role: string; token: string }) {
  sessionStorage.setItem(EMAIL_KEY, input.email)
  sessionStorage.setItem(NAME_KEY, input.name)
  sessionStorage.setItem(ROLE_KEY, input.role)
  sessionStorage.setItem(TOKEN_KEY, input.token)
  sessionStorage.setItem(SEEN_KEY, String(Date.now()))
  sessionStorage.removeItem("dc.admin.user")
  sessionStorage.removeItem("dc.admin.pass")
}

export function touchAdminActivity() {
  if (!adminSession()) return
  sessionStorage.setItem(SEEN_KEY, String(Date.now()))
}

export function adminIdleDue() {
  const seen = Number(sessionStorage.getItem(SEEN_KEY) || 0)
  if (!seen || !adminSession()) return false
  return Date.now() - seen >= IDLE_MS
}

export function markIdleLogout() {
  clearAdminSession()
  sessionStorage.setItem(IDLE_KEY, "1")
}

export function takeIdleNotice() {
  const on = sessionStorage.getItem(IDLE_KEY) === "1"
  if (on) sessionStorage.removeItem(IDLE_KEY)
  return on
}

export function markForcedLogout() {
  clearAdminSession()
  sessionStorage.setItem(FORCED_KEY, "1")
}

export function takeForcedNotice() {
  const on = sessionStorage.getItem(FORCED_KEY) === "1"
  if (on) sessionStorage.removeItem(FORCED_KEY)
  return on
}

export function clearAdminSession() {
  sessionStorage.removeItem(EMAIL_KEY)
  sessionStorage.removeItem(NAME_KEY)
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem("dc.admin.user")
  sessionStorage.removeItem("dc.admin.pass")
}
