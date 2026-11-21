"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, MapPin, Play } from "lucide-react";
import { HeroScene } from "../illustrations/hero-scene";
import { Magnetic } from "../ui/magnetic";
import { GitHubIcon, LinkedInIcon } from "../ui/icons";
import { Sparkle } from "../illustrations/sparkle";
import { site } from "@/data/site";

type TickerItem = { slug: string; name: string; category: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ ticker }: { ticker: TickerItem[] }) {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-16">
        <div className="relative z-10">
          <motion.p
            {...up(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] shadow-sticker"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-90 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[#5a8a00]" />
            </span>
            Open to hackathons &amp; collaborations
          </motion.p>

          <h1 id="hero-title" className="font-display font-semibold tracking-[-0.045em]">
            <motion.span {...up(0.08)} className="block text-[clamp(3.2rem,11vw,6.6rem)] leading-[0.9]">
              Hey, I&apos;m{" "}
              <span className="relative inline-block font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-blue">
                Raunak.
                <Sparkle className="absolute -right-6 -top-3 size-7 sm:-right-8 sm:size-9" fill="#c8f03c" />
              </span>
            </motion.span>
            <motion.span
              {...up(0.2)}
              className="mt-5 block max-w-[17ch] text-[clamp(1.55rem,4.2vw,2.5rem)] leading-[1.08] tracking-[-0.03em] text-ink"
            >
              I build things that <span className="scribble">probably shouldn&apos;t exist yet.</span>
            </motion.span>
          </h1>

          <motion.p {...up(0.32)} className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-ink-soft">
            Developer, builder, and professional overthinker of interesting problems. Lately that means
            collaborative coding with AI agents, fraud shields for UPI payments, and tools that tell you
            when your database or your LLM endpoint is quietly lying.
          </motion.p>

          <motion.div {...up(0.44)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-6 py-3.5 font-semibold text-paper shadow-sticker transition-[background-color,box-shadow,transform] duration-200 hover:bg-blue active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                See the work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </Magnetic>
            <div className="flex items-center gap-2">
              {[
                { href: site.socials.github, label: "GitHub", icon: <GitHubIcon size={19} />, ext: true },
                { href: site.socials.linkedin, label: "LinkedIn", icon: <LinkedInIcon size={18} />, ext: true },
                { href: site.socials.youtube, label: "YouTube", icon: <Play size={19} />, ext: true },
                { href: `mailto:${site.email}`, label: "Email", icon: <Mail className="size-[19px]" aria-hidden />, ext: false },
              ].map((s) => (
                <Magnetic key={s.label} strength={0.4}>
                  <a
                    href={s.href}
                    {...(s.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    aria-label={s.label}
                    className="grid size-12 place-items-center rounded-full border-2 border-ink bg-paper transition-colors hover:bg-lime"
                  >
                    {s.icon}
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>

          <motion.p {...up(0.54)} className="mt-6 flex items-center gap-2 text-sm text-ink-mute">
            <MapPin className="size-4" aria-hidden /> {site.location} · B.Tech, Artificial Intelligence &amp; Data Science
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[520px] pb-8 lg:max-w-none"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Featured-work ticker */}
      <div className="marquee-pause relative border-y-2 border-ink bg-ink py-3 text-paper">
        <p className="sr-only">Featured projects:</p>
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {ticker.map((p) => (
                <li key={p.slug} className="flex items-center">
                  <Link
                    href={`/projects/${p.slug}`}
                    tabIndex={dup === 1 ? -1 : undefined}
                    className="group flex items-center gap-3 px-6 font-display text-xl font-semibold tracking-tight sm:text-2xl"
                  >
                    <span className="transition-colors group-hover:text-lime">{p.name}</span>
                    <span className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-paper/55">
                      {p.category}
                    </span>
                  </Link>
                  <Sparkle className="size-4" fill="#ff6b2c" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

    </section>
  );
}
