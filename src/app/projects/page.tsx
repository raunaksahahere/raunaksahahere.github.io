import type { Metadata } from "next";
import { projects, isFeatured, youtubeShortUrl } from "@/data/projects";
import { ProjectIndex } from "@/components/project/project-index";

export const metadata: Metadata = {
  title: "All projects",
  description:
    "Every meaningful public project by Raunak Saha: developer tools, applied AI, fintech and security, offline mobile apps, a programming language and a few experiments.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const items = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    stack: p.stack,
    repo: p.repo,
    live: p.live,
    demoUrl: p.youtubeShortId ? youtubeShortUrl(p.youtubeShortId) : undefined,
    status: p.status,
    accent: p.accent,
    featured: isFeatured(p.slug),
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">Index · {items.length} projects</p>
      <h1 className="max-w-[14ch] font-display text-[clamp(2.8rem,9vw,6rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
        Everything, <span className="font-serif font-normal italic text-blue">including</span> the weird ones.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
        Featured projects have full case studies. The rest link straight to their code. Forks, coursework and empty
        repositories are left out on purpose.
      </p>
      <ProjectIndex items={items} />
    </div>
  );
}
