import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { archiveProjects, featuredProjects, type Project } from "@/data/projects";
import { SectionHeading } from "../ui/section-heading";
import { Reveal } from "../ui/reveal";
import { ProjectPreview } from "../project/preview";
import { CategoryChip, ProjectLinks, StackList } from "../project/project-bits";
import { Sparkle } from "../illustrations/sparkle";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Large two-column editorial spread. */
function Spread({ project, index, reverse }: { project: Project; index: number; reverse?: boolean }) {
  return (
    <Reveal>
      <article className="group grid items-center gap-8 md:grid-cols-12 md:gap-10" aria-labelledby={`p-${project.slug}`}>
        <div className={`min-w-0 md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
          <div className={`relative ${project.preview?.kind === "image" && project.preview.frame === "plain" ? "mx-auto max-w-sm md:max-w-md" : ""}`}>
            <div
              className={`absolute -inset-3 -z-10 rounded-[28px] border-2 border-ink ${
                project.accent === "blue" ? "bg-blue" : project.accent === "orange" ? "bg-orange" : "bg-lime"
              } transition-transform duration-500 group-hover:rotate-0 ${reverse ? "rotate-2" : "-rotate-2"}`}
              aria-hidden
            />
            {project.preview ? (
              <ProjectPreview preview={project.preview} url={project.live} sizes="(min-width: 768px) 58vw, 100vw" />
            ) : null}
          </div>
        </div>
        <div className={`min-w-0 md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-ink-mute">{pad(index)}</span>
            <CategoryChip project={project} />
          </div>
          <h3 id={`p-${project.slug}`} className="font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            <Link href={`/projects/${project.slug}`} className="decoration-orange decoration-[3px] underline-offset-[6px] hover:underline">
              {project.name}
            </Link>
          </h3>
          <p className="mt-4 font-serif text-[1.45rem] italic leading-snug text-ink">{project.tagline}</p>
          <p className="mt-4 text-pretty leading-relaxed text-ink-soft">{project.problem}</p>
          <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-ink-soft">
            {project.features?.slice(0, 3).map((f) => (
              <li key={f} className="flex gap-2.5">
                <Sparkle className="mt-1 size-3.5 shrink-0" fill="#c8f03c" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <StackList stack={project.stack} max={6} />
          </div>
          <p className="mt-4 font-mono text-xs text-ink-mute">{project.status}</p>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Wide terminal card: output on one side, story on the other. */
function TerminalCard({ project, index, wide }: { project: Project; index: number; wide?: boolean }) {
  return (
    <Reveal className={`min-w-0 ${wide ? "md:col-span-2" : ""}`} delay={wide ? 0 : 0.08}>
      <article
        className={`group h-full rounded-[28px] border-2 border-ink bg-paper p-5 transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg sm:p-7 ${
          wide ? "grid gap-8 lg:grid-cols-2 lg:items-center" : "flex flex-col"
        }`}
        aria-labelledby={`p-${project.slug}`}
      >
        <div className={`min-w-0 ${wide ? "lg:order-2" : "order-2 mt-6"}`}>
          {project.preview ? <ProjectPreview preview={project.preview} /> : null}
        </div>
        <div className={`min-w-0 ${wide ? "" : "order-1"}`}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-ink-mute">{pad(index)}</span>
            <CategoryChip project={project} />
            <span className="font-mono text-xs text-ink-mute">{project.status}</span>
          </div>
          <h3 id={`p-${project.slug}`} className="font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            <Link href={`/projects/${project.slug}`} className="decoration-orange decoration-[3px] underline-offset-[6px] hover:underline">
              {project.name}
            </Link>
          </h3>
          <p className="mt-3 font-serif text-xl italic leading-snug">{project.tagline}</p>
          <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{project.problem}</p>
          <div className="mt-5">
            <StackList stack={project.stack} max={5} />
          </div>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Screenshot-led card used in the side-by-side duo. */
function ShotCard({ project, index, offset }: { project: Project; index: number; offset?: boolean }) {
  return (
    <Reveal className={`min-w-0 ${offset ? "md:mt-28" : ""}`} delay={offset ? 0.1 : 0}>
      <article className="group" aria-labelledby={`p-${project.slug}`}>
        {project.preview ? (
          <ProjectPreview preview={project.preview} url={project.live} sizes="(min-width: 768px) 46vw, 100vw" />
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-ink-mute">{pad(index)}</span>
          <CategoryChip project={project} />
        </div>
        <h3 id={`p-${project.slug}`} className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em]">
          <Link href={`/projects/${project.slug}`} className="decoration-orange decoration-[3px] underline-offset-[6px] hover:underline">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 font-serif text-xl italic leading-snug">{project.tagline}</p>
        <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{project.summary}</p>
        <div className="mt-5">
          <StackList stack={project.stack} max={5} />
        </div>
        <p className="mt-3 font-mono text-xs text-ink-mute">{project.status}</p>
        <div className="mt-5">
          <ProjectLinks project={project} />
        </div>
      </article>
    </Reveal>
  );
}

/** Compact row with a small preview. */
function Row({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal>
      <article
        className="group grid gap-6 border-t-2 border-ink py-8 md:grid-cols-12 md:items-center md:gap-8"
        aria-labelledby={`p-${project.slug}`}
      >
        <div className="hidden md:col-span-1 md:block md:self-start md:pt-1">
          <span className="font-mono text-sm text-ink-mute">{pad(index)}</span>
        </div>
        <div className="min-w-0 md:col-span-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <CategoryChip project={project} />
            <span className="font-mono text-xs text-ink-mute">{project.status}</span>
          </div>
          <h3 id={`p-${project.slug}`} className="font-display text-4xl font-semibold tracking-[-0.035em]">
            <Link href={`/projects/${project.slug}`} className="decoration-orange decoration-[3px] underline-offset-[6px] hover:underline">
              {project.name}
            </Link>
          </h3>
          <p className="mt-2 font-serif text-xl italic leading-snug">{project.tagline}</p>
          <p className="mt-3 max-w-prose text-pretty leading-relaxed text-ink-soft">{project.summary}</p>
          <div className="mt-5">
            <StackList stack={project.stack} max={6} />
          </div>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
        <div className="min-w-0 md:col-span-5">
          {project.preview ? (
            <div className="transition-transform duration-500 group-hover:-rotate-1">
              <ProjectPreview preview={project.preview} sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

export function Work() {
  const p = featuredProjects;
  const spreads = p.slice(0, 2);
  const trio = p.slice(2, 5);
  const duo = p.slice(5, 7);
  const rows = p.slice(7);

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="work-title"
          index="01"
          eyebrow="Selected work"
          title={
            <>
              Real products, <span className="font-serif font-normal italic text-blue">shipped</span> and
              documented.
            </>
          }
        >
          Every project here has a public repository you can read. Descriptions come straight from what the code
          and READMEs actually do. No mock-ups, no invented numbers.
        </SectionHeading>

        <div className="space-y-24 sm:space-y-32">
          {spreads.map((project, i) => (
            <Spread key={project.slug} project={project} index={i} reverse={i % 2 === 1} />
          ))}
        </div>

        {trio.length > 0 ? (
          <div className="mt-28 sm:mt-36">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h3 className="max-w-[20ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                Infrastructure that knows how to say <span className="scribble">“no.”</span>
              </h3>
              <p className="max-w-sm text-ink-soft">
                Three tools with the same instinct: when the evidence is thin, refuse to guess.
              </p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {trio.map((project, i) => (
                <TerminalCard key={project.slug} project={project} index={i + 2} wide={i === 0} />
              ))}
            </div>
          </div>
        ) : null}

        {duo.length > 0 ? (
          <div className="mt-28 grid gap-16 sm:mt-36 md:grid-cols-2 md:gap-10">
            {duo.map((project, i) => (
              <ShotCard key={project.slug} project={project} index={i + 5} offset={i === 1} />
            ))}
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className="mt-28 border-b-2 border-ink sm:mt-36">
            {rows.map((project, i) => (
              <Row key={project.slug} project={project} index={i + 7} />
            ))}
          </div>
        ) : null}

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] border-2 border-dashed border-ink/40 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              …and {archiveProjects.length} more in the archive.
            </p>
            <p className="mt-1 text-ink-soft">
              A billing starter, a Linux distro, a social-deduction game, multiplayer chess with a secret helper.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-lime px-5 py-3 font-semibold shadow-sticker transition-transform hover:-translate-y-0.5"
          >
            Browse all projects
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
