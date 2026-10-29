const USER_KEY = "dc.admin.user"
const PASS_KEY = "dc.admin.pass"

export function adminSession(): { username: string; password: string } | null {
  if (typeof window === "undefined") return null
  const username = sessionStorage.getItem(USER_KEY)
  const password = sessionStorage.getItem(PASS_KEY)
  if (!username || !password) return null
  return { username, password }
}

export function setAdminSession(username: string, password: string) {
  sessionStorage.setItem(USER_KEY, username)
  sessionStorage.setItem(PASS_KEY, password)
}

export function clearAdminSession() {
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(PASS_KEY)
}
