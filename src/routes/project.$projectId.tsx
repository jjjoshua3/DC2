import { Link, createFileRoute } from "@tanstack/react-router"
import { ArticleBody } from "@/components/project-views"
import { SiteShell } from "@/components/site-shell"
import { useLocaleSite } from "@/lib/i18n"
import { clip, pageHead, seoContext } from "@/lib/seo"

export const Route = createFileRoute("/project/$projectId")({
  head: ({ params, matches }) => {
    const { origin, site } = seoContext(matches)
    const project = site?.projects?.find((item) => item.id === params.projectId && item.status === "published")
    if (!project) {
      return pageHead({ title: "Project", description: "Dit project staat niet live.", path: `/project/${params.projectId}`, origin, index: false })
    }
    const image = project.mediaType === "image" ? project.mediaUrl : project.poster
    return pageHead({
      title: project.title,
      description: clip(project.lead || project.body || "Een project van Stefanie Vermeulen, DE CONNECTORS."),
      path: `/project/${project.id}`,
      origin,
      image,
      type: "article",
    })
  },
  component: function ProjectRoute() {
    const { projectId } = Route.useParams()
    const { data } = useLocaleSite()
    const project = data.projects.find((item) => item.id === projectId && item.status === "published")
    return (
      <SiteShell>
        <article className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <Link to="/projecten" className="text-sm font-semibold text-accent">
            Alle projecten
          </Link>
          {project ? (
            <div className="mt-6">
              <ArticleBody project={project} stacked />
            </div>
          ) : (
            <p className="mt-8 text-ink-soft">Dit project staat niet live of bestaat niet.</p>
          )}
        </article>
      </SiteShell>
    )
  },
})
