import { Link } from "@tanstack/react-router"
import { MediaPane, SiteShell } from "@/components/site-shell"
import { useLocaleSite, useI18n } from "@/lib/i18n"
import type { PageBlock } from "@/lib/site-types"

export function CustomPageView({ slug }: { slug: string }) {
  const { data } = useLocaleSite()
  const page = (data.pages ?? []).find((item) => item.slug === slug && item.status === "published")
  if (!page) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl font-extrabold">Pagina niet gevonden</h1>
          <Link to="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-accent">Terug naar home</Link>
        </section>
      </SiteShell>
    )
  }
  return (
    <SiteShell>
      <article>
        {page.blocks.map((block) => (
          <BlockView key={block.id} block={block} />
        ))}
      </article>
    </SiteShell>
  )
}

function BlockView({ block }: { block: PageBlock }) {
  if (block.kind === "banner") {
    return (
      <section className="bg-ink text-paper">
        <p className="mx-auto max-w-4xl whitespace-pre-wrap px-4 py-16 text-center font-story text-3xl italic sm:text-5xl">{block.text}</p>
      </section>
    )
  }
  if (block.kind === "contact") return <ContactStrip />
  if (block.kind === "cards") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        {block.title ? <h2 className="font-display text-3xl font-extrabold">{block.title}</h2> : null}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {block.cards.map((card, index) => (
            <article key={`${card.title}-${index}`} className="overflow-hidden rounded-card border border-line bg-card">
              {card.image ? <img src={card.image} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" /> : null}
              <div className="p-5">
                <h3 className="font-display text-xl font-extrabold">{card.title}</h3>
                {card.text ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{card.text}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
  if (block.kind === "split") {
    const media = <MediaPane type={block.mediaType} url={block.mediaUrl} label={block.title || "Beeld"} />
    const copy = (
      <div>
        {block.title ? <h2 className="font-display text-4xl font-extrabold tracking-tight">{block.title}</h2> : null}
        {block.text ? <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ink-soft">{block.text}</p> : null}
      </div>
    )
    return (
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        {block.mediaSide === "right" ? copy : media}
        {block.mediaSide === "right" ? media : copy}
      </section>
    )
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      {block.title ? <h2 className="font-display text-4xl font-extrabold tracking-tight">{block.title}</h2> : null}
      {block.text ? <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink-soft">{block.text}</p> : null}
    </section>
  )
}

function ContactStrip() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const { copy } = data
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{t("contact")}</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold">{copy.contactTitle}</h2>
          <p className="mt-3 leading-relaxed text-paper/80">{copy.contactLead}</p>
          <a href={`mailto:${copy.email}`} className="mt-4 inline-flex font-bold underline decoration-accent underline-offset-4">{copy.email}</a>
        </div>
        <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-accent-ink">{t("touch")}</Link>
      </div>
    </section>
  )
}
