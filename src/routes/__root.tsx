import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { VisitTracker } from "@/components/visit-tracker";
import { NotFoundPage } from "@/components/not-found";
import { LocaleProvider } from "@/lib/i18n";
import { seedSite } from "@/lib/data-service";
import { fetchPublicOrigin, fetchSiteDocument } from "@/lib/site-store";
import { HOME, SITE_ORIGIN_FALLBACK, organizationJsonLd, pageHead } from "@/lib/seo";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: async () => {
    try {
      const [site, origin] = await Promise.all([fetchSiteDocument(), fetchPublicOrigin()])
      return { site, origin: origin || SITE_ORIGIN_FALLBACK }
    } catch {
      return { site: null, origin: SITE_ORIGIN_FALLBACK }
    }
  },
  head: ({ matches }) => {
    const origin = matches.find((match) => match.routeId === "__root__")?.loaderData?.origin || SITE_ORIGIN_FALLBACK
    const seo = pageHead({ title: HOME.title, description: HOME.description, path: "/", origin, canonical: false })
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...seo.meta,
        { name: "theme-color", content: "#1E293B" },
        { name: "author", content: "Stefanie Vermeulen" },
      ],
      links: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,500;0,600;0,700;0,800;1,600&display=swap",
        },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  component: function Root() {
    const { site, origin } = Route.useLoaderData()
    seedSite(site)
    return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(origin)) }} />
      </head>
      <body>
        <PreviewHostBridge />
        <VisitTracker />
        <AuthProvider>
          <LocaleProvider>
            <Outlet />
          </LocaleProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
    )
  },
});
