import { useEffect } from "react"
import { heartbeatVisit, startVisit } from "@/lib/analytics"

const VISITOR_KEY = "dc.visitor"

function visitorId() {
  const existing = window.localStorage.getItem(VISITOR_KEY)
  if (existing) return existing
  const next = crypto.randomUUID()
  window.localStorage.setItem(VISITOR_KEY, next)
  return next
}

export function VisitTracker() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return
    const started = Date.now()
    let visitId = ""
    let cancelled = false

    void startVisit({ data: { visitorId: visitorId(), path: window.location.pathname } })
      .then((result) => {
        if (!cancelled) visitId = result.visitId
      })
      .catch(() => {})

    const send = () => {
      if (!visitId) return
      const seconds = Math.max(1, Math.round((Date.now() - started) / 1000))
      void heartbeatVisit({ data: { visitId, seconds } }).catch(() => {})
    }
    const timer = window.setInterval(send, 20000)
    window.addEventListener("pagehide", send)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      window.removeEventListener("pagehide", send)
      send()
    }
  }, [])

  return null
}
