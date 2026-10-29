import { useEffect, useRef, useState, type ReactNode } from "react"
import { Bold, Heading3, ImagePlus, Italic, Link2, Quote } from "lucide-react"
import { compressImage, sanitizeHtml } from "@/lib/media"

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const focused = useRef(false)

  useEffect(() => {
    if (ref.current && !focused.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  function exec(command: string, arg?: string) {
    ref.current?.focus()
    document.execCommand(command, false, arg)
    if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
  }

  return (
    <div>
      <div className="mt-2 flex flex-wrap gap-1">
        <ToolButton label="Tussenkopje" onClick={() => exec("formatBlock", "h3")}>
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Vetgedrukt" onClick={() => exec("bold")}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Cursief" onClick={() => exec("italic")}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Quote" onClick={() => exec("formatBlock", "blockquote")}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Link"
          onClick={() => {
            const url = window.prompt("Linkadres (https://…)")
            if (url) exec("createLink", url)
          }}
        >
          <Link2 className="h-4 w-4" />
        </ToolButton>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline
        aria-label="Het verhaal"
        className="story mt-2 min-h-48 rounded-xl border border-line bg-card px-3 py-3 font-story text-sm leading-relaxed outline-none focus:border-accent"
        onInput={() => {
          if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
        }}
        onFocus={() => {
          focused.current = true
        }}
        onBlur={() => {
          focused.current = false
        }}
        onPaste={(event) => {
          event.preventDefault()
          const text = event.clipboardData.getData("text/plain")
          document.execCommand("insertText", false, text)
        }}
      />
    </div>
  )
}

function ToolButton({
  label: name,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={name}
      title={name}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-card text-ink hover:border-accent"
    >
      {children}
    </button>
  )
}

export function DropImage({
  label: name,
  onFile,
}: {
  label: string
  onFile: (url: string) => void
}) {
  const [over, setOver] = useState(false)
  async function take(file: File | undefined) {
    if (!file) return
    onFile(await compressImage(file))
  }
  return (
    <label
      className={`mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-3 py-4 text-center text-sm ${
        over ? "border-accent bg-paper" : "border-line bg-card"
      }`}
      onDragOver={(event) => {
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setOver(false)
        void take(event.dataTransfer.files[0])
      }}
    >
      <ImagePlus className="mb-2 h-5 w-5 text-accent" />
      <span className="font-semibold">{name}</span>
      <span className="text-xs text-muted">Sleep een foto of klik om te kiezen</span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          void take(event.target.files?.[0])
          event.target.value = ""
        }}
      />
    </label>
  )
}
