import { getSql } from "@/lib/db"
import { originFromRequest } from "@/lib/origin.server"

export { originFromRequest }

function xml(value: string) {
  return value.replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;")
}

export async function buildSitemap(origin: string) {
  const base = origin.replace(/\/$/, "")
  const paths = [
    "/",
    "/projecten",
    "/blog",
    "/contact",
    "/wat/journalistiek",
    "/wat/artistiek",
    "/wat/artistiek-journalistiek",
  ]
  let lastmod = ""
  try {
    const sql = await getSql()
    const rows = await sql<{ data: string }>`select data::text as data from site_document where id = 'main'`
    const site = JSON.parse(rows[0]?.data ?? "null") as {
      updatedAt?: number
      posts?: { id?: string; status?: string }[]
      pages?: { slug?: string; status?: string }[]
    } | null
    if (site?.updatedAt) lastmod = new Date(site.updatedAt).toISOString().slice(0, 10)
    for (const post of site?.posts ?? []) {
      if (post.status === "published" && post.id) paths.push(`/blog/${encodeURIComponent(post.id)}`)
    }
    for (const page of site?.pages ?? []) {
      if (page.status === "published" && page.slug) paths.push(`/pagina/${encodeURIComponent(page.slug)}`)
    }
  } catch {
    // The public pages above stay in the sitemap even if the database is quiet.
  }
  const urls = paths
    .map((path) => {
      const loc = xml(`${base}${path}`)
      return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
    })
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobots(origin: string) {
  const base = origin.replace(/\/$/, "")
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /beheer\n\nSitemap: ${base}/sitemap.xml\n`
}
