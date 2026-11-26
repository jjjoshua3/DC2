import type { ErrorComponentProps } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

/**
 * Ongeacht welke fout er optreedt (crypto.randomUUID, runtime errors, etc.),
 * tonen we een nette 404-pagina. Geen "Something went wrong" meer voor bezoekers.
 */
export function AppErrorComponent(_props: ErrorComponentProps) {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">404</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            Pagina niet gevonden
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/75">
            Deze pagina bestaat niet of er is iets misgegaan. Ga terug naar de startpagina.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink"
            >
              Naar de start
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <img src="/media/404.jpg" alt="Stefanie Vermeulen" className="w-full rounded-card object-cover" />
        </div>
      </section>
    </main>
  )
}
