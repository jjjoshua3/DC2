import { Link } from "@tanstack/react-router"
import { useLocaleSite, useI18n } from "@/lib/i18n"
import { sanitizeHtml } from "@/lib/media"
import { SiteShell } from "@/components/site-shell"
import type { Post } from "@/lib/site-types"

export function formatPostDate(iso: string, locale = "nl") {
  if (!iso) return ""
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  const map = { nl: "nl-NL", en: "en-GB", fr: "fr-FR", de: "de-DE" } as const
  const lang = map[locale as keyof typeof map] ?? "nl-NL"
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(date)
}

export function BlogIndex() {
  const { data } = useLocaleSite()
  const { t } = useI18n()
  const posts = (data.posts ?? []).filter((post) => post.status === "published")
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Blog</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {data.copy.blogTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{data.copy.blogLead}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length === 0 ? <p className="mt-8 text-ink-soft">{t("noPosts")}</p> : null}
      </div>
    </SiteShell>
  )
}

export function BlogCard({ post }: { post: Post }) {
  const { locale } = useI18n()
  return (
    <Link
      to="/blog/$postId"
      params={{ postId: post.id }}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="block aspect-[4/3] overflow-hidden bg-ink">
        {post.image ? (
          <img src={post.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <span className="grid h-full place-items-center px-6 text-center font-display text-lg font-bold text-paper">
            {post.title}
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">{formatPostDate(post.date, locale)}</span>
        <span className="font-display text-xl font-extrabold leading-tight">{post.title}</span>
        {post.lead ? <span className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{post.lead}</span> : null}
      </span>
    </Link>
  )
}

export function BlogArticle({ postId }: { postId: string }) {
  const { data } = useLocaleSite()
  const { t, locale } = useI18n()
  const post = (data.posts ?? []).find((item) => item.id === postId && item.status === "published")
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/blog" className="text-sm font-semibold text-accent">
          {t("allPosts")}
        </Link>
        {post ? (
          <article className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{formatPostDate(post.date, locale)}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
            {post.lead ? <p className="mt-5 text-lg font-semibold leading-relaxed">{post.lead}</p> : null}
            {post.image ? (
              <img src={post.image} alt="" className="mt-6 aspect-[16/9] w-full rounded-card object-cover" />
            ) : null}
            <div
              className="story mt-6 font-story text-base leading-relaxed text-ink-soft"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body) }}
            />
          </article>
        ) : (
          <p className="mt-8 text-ink-soft">Dit blog staat niet live of bestaat niet.</p>
        )}
      </div>
    </SiteShell>
  )
}
