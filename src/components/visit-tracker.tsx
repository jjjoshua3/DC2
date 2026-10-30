import { useEffect } from "react"

const VISITOR_KEY = "dc.visitor"
let tracked = false

function visitorId() {
  const existing = window.localStorage.getItem(VISITOR_KEY)
  if (existing) return existing
  const next = crypto.randomUUID()
  window.localStorage.setItem(VISITOR_KEY, next)
  return next
}

function visitUrl() {
  const match = window.location.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)
  return `${match?.[1] ?? ""}/api/visit`
}

export function VisitTracker() {
  useEffect(() => {
    if (tracked) return
    tracked = true
    const started = Date.now()
    let visitId = ""

    void fetch(visitUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitorId: visitorId(), path: window.location.pathname }),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { visitId?: string } | null
        if (data?.visitId) visitId = data.visitId
      })
      .catch(() => {})

    const send = () => {
      if (!visitId) return
      const seconds = Math.max(1, Math.round((Date.now() - started) / 1000))
      void fetch(visitUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitId, seconds }),
        keepalive: true,
      }).catch(() => {})
    }
    const timer = window.setInterval(send, 20000)
    window.addEventListener("pagehide", send)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("pagehide", send)
      send()
    }
  }, [])

  return null
}
