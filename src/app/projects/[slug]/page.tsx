import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredOrder, featuredProjects, getProject, isFeatured } from "@/data/projects";
import { ProjectPreview } from "@/components/project/preview";
import { ProjectShort } from "@/components/project/project-short";
import { CategoryChip, ProjectLinks } from "@/components/project/project-bits";
import { Reveal } from "@/components/ui/reveal";
import { Sparkle } from "@/components/illustrations/sparkle";

export function generateStaticParams() {
  return featuredOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !isFeatured(slug)) return { title: "Project not found" };
  return {
    title: `${project.name}: ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.name, description: project.tagline, url: `/projects/${project.slug}` },
  };
}

async function CaseStudy({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !isFeatured(slug)) notFound();

  const i = featuredProjects.findIndex((p) => p.slug === slug);
  const next = featuredProjects[(i + 1) % featuredProjects.length];

  return (
    <article className="pb-8">
      <header className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/#work" className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-semibold hover:bg-sand">
            <ArrowLeft className="size-4" aria-hidden /> Selected work
          </Link>
          <Link href="/projects" className="rounded-full px-3 py-1.5 font-medium text-ink-soft hover:text-ink">
            All projects
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
          <CategoryChip project={project} />
          <span className="font-mono text-xs text-ink-mute">{project.status}</span>
        </div>
        <h1 className="mt-5 font-display text-[clamp(3rem,11vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
          {project.name}
        </h1>
        <p className="mt-6 max-w-[32ch] font-serif text-[clamp(1.5rem,3.4vw,2.3rem)] italic leading-[1.15]">
          {project.tagline}
        </p>
        <div className="mt-8">
          <ProjectLinks project={project} caseStudy={false} />
        </div>
      </header>

      {project.preview || project.youtubeShortId ? (
        <Reveal className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
          <div className={project.preview && project.youtubeShortId ? "grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_14rem]" : undefined}>
            {project.preview ? (
              <div
                className={`min-w-0 rounded-[32px] border-2 border-ink p-4 sm:p-10 ${
                  project.accent === "blue" ? "bg-blue" : project.accent === "orange" ? "bg-orange" : "bg-lime"
                }`}
              >
                <div className={project.preview.kind === "image" && project.preview.frame === "plain" ? "mx-auto max-w-md" : "mx-auto max-w-4xl"}>
                  <ProjectPreview preview={project.preview} url={project.live} priority sizes="(min-width: 1024px) 896px, 100vw" />
                </div>
              </div>
            ) : null}
            {project.youtubeShortId ? <ProjectShort id={project.youtubeShortId} name={project.name} /> : null}
          </div>
        </Reveal>
      ) : null}

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-5 sm:mt-24 sm:px-8 lg:grid-cols-12">
        <aside className="min-w-0 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-2xl border-2 border-ink bg-paper p-5">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Built with</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-sm font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {project.links?.length ? (
              <div className="rounded-2xl border-2 border-ink bg-paper p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">More</h2>
                <ul className="mt-3 space-y-2">
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer" className="font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-orange">
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.evidence?.length ? (
              <div className="rounded-2xl border-2 border-dashed border-ink/40 p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">From the repo</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                  {project.evidence.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 space-y-16 lg:col-span-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">The problem</h2>
            <p className="mt-4 text-pretty text-xl leading-relaxed text-ink">{project.problem}</p>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">{project.summary}</p>
          </Reveal>

          {project.features?.length ? (
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">What it does</h2>
              <ul className="mt-6 grid gap-3">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3 rounded-2xl border-2 border-ink bg-paper p-4 leading-relaxed">
                    <Sparkle className="mt-1 size-4 shrink-0" fill={project.accent === "lime" ? "#c8f03c" : project.accent === "orange" ? "#ff6b2c" : "#2f4bff"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {project.howItWorks?.length ? (
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
              <ol className="mt-6 space-y-5">
                {project.howItWorks.map((step, n) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-ink font-mono text-sm text-lime">
                      {n + 1}
                    </span>
                    <p className="pt-1 text-pretty text-lg leading-relaxed text-ink-soft">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {project.decisions?.length ? (
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Decisions worth noting</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {project.decisions.map((d, n) => (
                  <div
                    key={d.title}
                    className={`rounded-2xl border-2 border-ink p-5 shadow-sticker ${n % 2 ? "bg-lime" : "bg-paper"}`}
                  >
                    <h3 className="font-display text-xl font-semibold leading-tight">{d.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{d.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {project.gallery?.length ? (
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">More views</h2>
              <div className="mt-6 grid gap-6">
                {project.gallery.map((g, n) => (
                  <div key={n} className={g.kind === "image" && g.frame === "plain" ? "max-w-sm" : ""}>
                    <ProjectPreview preview={g} url={project.live} sizes="(min-width: 1024px) 66vw, 100vw" />
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-col gap-3 rounded-[28px] border-2 border-ink bg-ink p-7 text-paper transition-colors hover:bg-blue sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <span>
            <span className="block font-mono text-xs uppercase tracking-[0.18em] text-paper/60">Next project</span>
            <span className="mt-2 block font-display text-4xl font-semibold tracking-tight sm:text-5xl">{next.name}</span>
            <span className="mt-1 block text-paper/75">{next.tagline}</span>
          </span>
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:translate-x-1">
            <ArrowRight className="size-6" aria-hidden />
          </span>
        </Link>
      </div>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-40 sm:px-8" aria-busy="true" aria-label="Loading case study">
      <div className="h-6 w-40 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-6 h-24 w-3/4 animate-pulse rounded-2xl bg-ink/10" />
      <div className="mt-6 h-8 w-1/2 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-14 aspect-video animate-pulse rounded-[32px] bg-ink/10" />
    </div>
  );
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<CaseStudySkeleton />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}
