import { ipFromHeaders, lookupPlace } from "@/lib/analytics"
import { ensureVisitTable } from "@/lib/stats-query"

export async function handleVisitRequest(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => null)) as {
      visitorId?: unknown
      path?: unknown
      visitId?: unknown
      seconds?: unknown
    } | null
    const sql = await ensureVisitTable()
    if (typeof body?.visitId === "string" && body.visitId) {
      const seconds =
        typeof body.seconds === "number" && Number.isFinite(body.seconds)
          ? Math.max(0, Math.min(60 * 60 * 6, Math.round(body.seconds)))
          : 0
      await sql`
        update site_visit
        set duration_seconds = ${seconds}, last_seen_at = now()
        where id = ${body.visitId}
      `
      return Response.json({ ok: true })
    }
    const visitorId = typeof body?.visitorId === "string" ? body.visitorId : ""
    if (visitorId.length < 8 || visitorId.length > 80) {
      return Response.json({ error: "Ongeldige bezoeker" }, { status: 400 })
    }
    const place = await lookupPlace(ipFromHeaders(request.headers))
    const ip = ipFromHeaders(request.headers)
    const path = typeof body?.path === "string" ? body.path.slice(0, 120) : "/"
    const id = crypto.randomUUID()
    await sql`
      insert into site_visit (id, visitor_id, country, city, region, ip, path)
      values (${id}, ${visitorId}, ${place.country}, ${place.city}, ${place.region}, ${ip}, ${path})
    `
    return Response.json({ visitId: id, city: place.city, country: place.country })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout"
    return Response.json({ error: message }, { status: 500 })
  }
}
