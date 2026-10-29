const ALLOWED = new Set([
  "P",
  "DIV",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "H2",
  "H3",
  "BLOCKQUOTE",
  "A",
  "UL",
  "OL",
  "LI",
])

export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
  }
  const doc = new DOMParser().parseFromString(html, "text/html")
  const clean = (parent: Node) => {
    for (const node of [...parent.childNodes]) {
      if (node.nodeType !== 1) continue
      const el = node as HTMLElement
      const tag = el.tagName
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME" || tag === "OBJECT") {
        el.remove()
        continue
      }
      if (!ALLOWED.has(tag)) {
        clean(el)
        el.replaceWith(...el.childNodes)
        continue
      }
      const href = tag === "A" ? el.getAttribute("href") : null
      for (const attr of [...el.attributes]) el.removeAttribute(attr.name)
      if (tag === "A") {
        const safe = href?.trim() ?? ""
        if (/^(https?:|mailto:|\/|#)/i.test(safe)) {
          el.setAttribute("href", safe)
          el.setAttribute("rel", "noopener noreferrer")
          el.setAttribute("target", "_blank")
        } else {
          el.replaceWith(...el.childNodes)
          continue
        }
      }
      clean(el)
    }
  }
  clean(doc.body)
  return doc.body.innerHTML
}

export function toEmbedUrl(raw: string): string | null {
  const url = raw.trim()
  if (!url) return null
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i,
  )
  if (yt) {
    const start = url.match(/[?&](?:t|start)=(\d+)/)
    const params = new URLSearchParams()
    if (start) params.set("start", start[1])
    const q = params.toString()
    return `https://www.youtube-nocookie.com/embed/${yt[1]}${q ? `?${q}` : ""}`
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  if (/youtube(?:-nocookie)?\.com\/embed\//i.test(url) || /player\.vimeo\.com\/video\//i.test(url)) {
    return url
  }
  return null
}

export function inkForAccent(hex: string): string {
  const raw = hex.replace("#", "").trim()
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return "#ffffff"
  const r = parseInt(raw.slice(0, 2), 16)
  const g = parseInt(raw.slice(2, 4), 16)
  const b = parseInt(raw.slice(4, 6), 16)
  const y = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return y > 0.64 ? "#1e293b" : "#ffffff"
}

export function compressImage(file: File, max = 1400, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        URL.revokeObjectURL(blobUrl)
        reject(new Error("canvas"))
        return
      }
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(blobUrl)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      reject(new Error("image"))
    }
    img.src = blobUrl
  })
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}
