import { previewPathPrefix } from "@/lib/preview-path-prefix"

const PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i

/**
 * Path-based previews serve the app under `/hds-…/` and strip that prefix
 * before it reaches the server. Server function calls use a root-absolute
 * `/_serverFn/…` URL, which skips the prefix and never reaches this app.
 * Rewrite those calls so the shared save actually arrives.
 */
export function installPreviewServerFnRewrite() {
  if (typeof window === "undefined") return
  const flag = "__dcPreviewServerFnPatched__"
  if ((window as unknown as Record<string, boolean>)[flag]) return
  ;(window as unknown as Record<string, boolean>)[flag] = true

  const prefix =
    previewPathPrefix(window.location.hostname, window.location.pathname) ??
    PORT_ID_PREFIX.exec(window.location.pathname)?.[0]
  if (!prefix) return

  const original = window.fetch.bind(window)
  window.fetch = (input, init) => {
    const rewritten = rewriteServerFnUrl(input, prefix)
    return original(rewritten as RequestInfo, init)
  }
}

function rewriteServerFnUrl(input: RequestInfo | URL, prefix: string): RequestInfo | URL {
  const needsPrefix = (pathname: string) =>
    (pathname.startsWith("/_serverFn") || pathname.startsWith("/api/")) && !pathname.startsWith(`${prefix}/`)

  if (typeof input === "string") {
    if (input.startsWith("/_serverFn") || input.startsWith("/api/")) {
      if (!input.startsWith(`${prefix}/`)) return `${prefix}${input}`
    }
    return input
  }
  if (input instanceof URL) {
    if (needsPrefix(input.pathname)) input.pathname = `${prefix}${input.pathname}`
    return input
  }
  if (input instanceof Request) {
    const url = new URL(input.url)
    if (needsPrefix(url.pathname)) {
      url.pathname = `${prefix}${url.pathname}`
      return new Request(url.toString(), input)
    }
  }
  return input
}
