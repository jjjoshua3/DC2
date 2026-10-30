import { adminSession } from "@/lib/admin-session"

export type AuditEvent = {
  id: string
  at: string
  kind: string
  username: string
  ip: string
  city: string
  country: string
  ok: boolean | null
  summary: string
  detail: string
}

export function auditUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/audit`
}

export function formatStamp(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return { date: "—", time: "—" }
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("nl-NL", {
      timeZone: "Europe/Amsterdam",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  )
  return {
    date: `${parts.day}-${parts.month}-${parts.year}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  }
}

export async function postAudit(body: Record<string, unknown>) {
  const response = await fetch(auditUrl(), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  })
  const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; events?: AuditEvent[] } | null
  if (!response.ok) throw new Error(data?.error || "Audit mislukt")
  return data
}

export function logChange(summary: string, detail: string) {
  const session = adminSession()
  if (!session) return
  void postAudit({
    action: "change",
    username: session.username,
    password: session.password,
    summary,
    detail,
  }).catch(() => {})
}

export function logLogout() {
  const session = adminSession()
  if (!session) return
  void postAudit({
    action: "logout",
    username: session.username,
    password: session.password,
  }).catch(() => {})
}
