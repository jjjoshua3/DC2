export const SUPABASE_URL = "https://zaljeyembygscuhzdnng.supabase.co"
export const SUPABASE_KEY = "sb_publishable__QNkTn2UekwNv9rMjT4uMQ__MCQ_lkj"

export const ADMINS: Record<string, { name: string; role: string }> = {
  "joshua.bosma@kpnmail.nl": { name: "Joshua Bosma", role: "Webdeveloper" },
  "stefanie@deconnectors.com": { name: "Stefanie Vermeulen", role: "Eigenaar" },
}

export function adminAccount(email: string) {
  return ADMINS[email.trim().toLowerCase()] ?? null
}

export async function accountFromToken(token: string) {
  if (!token) return null
  const { sessionAccount } = await import("@/lib/magic-server")
  const session = await sessionAccount(token).catch(() => null)
  if (session) return session
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null
  const user = (await response.json().catch(() => null)) as { email?: string } | null
  const email = user?.email?.trim().toLowerCase() ?? ""
  const account = adminAccount(email)
  if (!account) return null
  return { email, name: account.name, role: account.role }
}
