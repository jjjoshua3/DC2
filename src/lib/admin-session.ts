import { adminAccount } from "@/lib/admins"

const EMAIL_KEY = "dc.admin.email"
const NAME_KEY = "dc.admin.name"
const ROLE_KEY = "dc.admin.role"
const TOKEN_KEY = "dc.admin.token"

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
  if (!email || !token || !adminAccount(email)) return null
  const account = adminAccount(email)
  return {
    email,
    name: sessionStorage.getItem(NAME_KEY) || account?.name || email,
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
  sessionStorage.removeItem("dc.admin.user")
  sessionStorage.removeItem("dc.admin.pass")
}

export function clearAdminSession() {
  sessionStorage.removeItem(EMAIL_KEY)
  sessionStorage.removeItem(NAME_KEY)
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem("dc.admin.user")
  sessionStorage.removeItem("dc.admin.pass")
}
