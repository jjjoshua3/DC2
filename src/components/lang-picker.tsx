import { EDIT_LANGS, type EditLang } from "@/lib/i18n"

export function LangPicker({ lang, onChange }: { lang: EditLang; onChange: (lang: EditLang) => void }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Taal van deze tekst">
      {EDIT_LANGS.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={id === lang}
          onClick={() => onChange(id)}
          className={`min-h-11 rounded-full px-4 text-sm font-bold ${id === lang ? "bg-ink text-paper" : "border border-line bg-card"}`}
        >
          {id.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
