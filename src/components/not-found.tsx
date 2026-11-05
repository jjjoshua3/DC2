import { Link } from "@tanstack/react-router"
import { SiteShell } from "@/components/site-shell"
import { useI18n } from "@/lib/i18n"

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <SiteShell>
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">404</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">{t("missing")}</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/75">{t("missingBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">
                {t("about")}
              </Link>
              <Link to="/wat/$slug" params={{ slug: "artistiek" }} className="inline-flex min-h-11 items-center rounded-full border border-paper/30 px-5 py-2.5 text-sm font-bold">
                Artistiek
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <img src="/media/404.jpg" alt="Stefanie Vermeulen" className="w-full rounded-card object-cover" />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}