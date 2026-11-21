"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Globe, Play } from "lucide-react";
import type { Accent, Category } from "@/data/projects";
import { GitHubIcon } from "../ui/icons";

type Item = {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  stack: string[];
  repo: string;
  live?: string;
  demoUrl?: string;
  status: string;
  accent: Accent;
  featured: boolean;
};

const dot: Record<Accent, string> = { blue: "bg-blue", orange: "bg-orange", lime: "bg-lime" };

export function ProjectIndex({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="mt-12">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        {categories.map((c) => {
          const on = c === filter;
          const count = c === "All" ? items.length : items.filter((i) => i.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={on}
              className={`relative shrink-0 rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors ${on ? "text-paper" : "bg-paper hover:bg-sand"}`}
            >
              {on ? <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} /> : null}
              <span className="relative whitespace-nowrap">
                {c} <span className={`font-mono text-xs ${on ? "text-lime" : "text-ink-mute"}`}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 border-t-2 border-ink">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative border-b-2 border-ink"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-lime/50 transition-transform duration-500 ease-out group-hover:scale-x-100" aria-hidden />
              <div className="relative grid gap-3 py-6 md:grid-cols-12 md:items-center md:gap-6">
                <div className="flex items-center gap-3 md:col-span-4">
                  <span className={`size-3 shrink-0 rounded-full border-2 border-ink ${dot[p.accent]}`} aria-hidden />
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {p.featured ? (
                      <Link href={`/projects/${p.slug}`} className="hover:underline decoration-orange decoration-[3px] underline-offset-4">
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </h2>
                  {p.featured ? (
                    <span className="rounded-full border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">Featured</span>
                  ) : null}
                </div>
                <div className="md:col-span-5">
                  <p className="text-pretty text-ink-soft">{p.tagline}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-ink-mute">
                    {p.category} · {p.stack.slice(0, 4).join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
                  {p.featured ? (
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-ink px-3 py-1.5 text-sm font-semibold text-paper hover:bg-blue"
                    >
                      Case study <ArrowUpRight className="size-3.5" aria-hidden />
                      <span className="sr-only">: {p.name}</span>
                    </Link>
                  ) : null}
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.name} on GitHub`}
                    className="grid size-9 place-items-center rounded-full border-2 border-ink bg-paper hover:bg-sand"
                  >
                    <GitHubIcon size={16} />
                  </a>
                  {p.live ? (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.name} live site`}
                      className="grid size-9 place-items-center rounded-full border-2 border-ink bg-lime hover:bg-[#b5e01f]"
                    >
                      <Globe className="size-4" aria-hidden />
                    </a>
                  ) : null}
                  {p.demoUrl ? (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Watch ${p.name} demo on YouTube`}
                      title="Watch demo"
                      className="grid size-9 place-items-center rounded-full border-2 border-ink bg-paper transition-colors hover:bg-sand"
                    >
                      <Play className="size-4" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
