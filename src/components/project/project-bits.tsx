import Link from "next/link";
import { ArrowUpRight, Globe, Play } from "lucide-react";
import type { Accent, Project } from "@/data/projects";
import { GitHubIcon } from "../ui/icons";

const chipAccent: Record<Accent, string> = {
  blue: "bg-blue text-paper",
  orange: "bg-orange text-ink",
  lime: "bg-lime text-ink",
};

export function CategoryChip({ project }: { project: Project }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] ${chipAccent[project.accent]}`}
    >
      {project.category}
    </span>
  );
}

export function StackList({ stack, max }: { stack: string[]; max?: number }) {
  const shown = max ? stack.slice(0, max) : stack;
  const rest = max ? stack.length - shown.length : 0;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {shown.map((s) => (
        <li key={s} className="rounded-full border border-ink/20 bg-paper/70 px-2.5 py-1 font-mono text-[11px] text-ink-soft">
          {s}
        </li>
      ))}
      {rest > 0 ? (
        <li className="rounded-full px-1.5 py-1 font-mono text-[11px] text-ink-mute">+{rest}</li>
      ) : null}
    </ul>
  );
}

export function ProjectLinks({ project, caseStudy = true }: { project: Project; caseStudy?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {caseStudy ? (
        <Link
          href={`/projects/${project.slug}`}
          className="group/cs inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-[background-color,box-shadow,transform] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-blue hover:shadow-sticker"
        >
          Case study
          <ArrowUpRight className="size-4 transition-transform group-hover/cs:rotate-45" aria-hidden />
          <span className="sr-only">: {project.name}</span>
        </Link>
      ) : null}
      <a
        href={project.repo}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold transition-colors hover:bg-sand"
      >
        <GitHubIcon size={15} /> Code<span className="sr-only"> for {project.name} on GitHub</span>
      </a>
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#b5e01f]"
        >
          <Globe className="size-4" aria-hidden /> Live<span className="sr-only"> site for {project.name}</span>
        </a>
      ) : null}
      {project.youtubeShortId ? (
        <Link
          href={caseStudy ? `/projects/${project.slug}#demo` : "#demo"}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold transition-colors hover:bg-sand"
        >
          <Play className="size-4" aria-hidden /> Watch demo<span className="sr-only"> for {project.name}</span>
        </Link>
      ) : null}
    </div>
  );
}
