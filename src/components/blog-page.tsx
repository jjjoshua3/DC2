import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useSiteData } from "@/lib/data-service"
import { sanitizeHtml } from "@/lib/media"
import type { Post } from "@/lib/site-types"

export function formatPostDate(iso: string) {
  if (!iso) return ""
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

function TopBar() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" />
          DE CONNECTORS
        </Link>
        <Link to="/admin" className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-semibold">
          Beheer
        </Link>
      </div>
    </header>
  )
}

export function BlogIndex() {
  const { data } = useSiteData()
  const posts = (data.posts ?? []).filter((post) => post.status === "published")
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
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
        {posts.length === 0 ? <p className="mt-8 text-ink-soft">Er staan nog geen blogs live.</p> : null}
      </main>
    </div>
  )
}

export function BlogCard({ post }: { post: Post }) {
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
        <span className="text-xs font-bold uppercase tracking-widest text-accent">{formatPostDate(post.date)}</span>
        <span className="font-display text-xl font-extrabold leading-tight">{post.title}</span>
        {post.lead ? <span className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{post.lead}</span> : null}
      </span>
    </Link>
  )
}

export function BlogArticle({ postId }: { postId: string }) {
  const { data } = useSiteData()
  const post = (data.posts ?? []).find((item) => item.id === postId && item.status === "published")
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/blog" className="text-sm font-semibold text-accent">
          Alle blogs
        </Link>
        {post ? (
          <article className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{formatPostDate(post.date)}</p>
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
      </main>
    </div>
  )
}
