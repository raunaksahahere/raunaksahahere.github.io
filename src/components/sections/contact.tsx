"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { site } from "@/data/site";
import { Magnetic } from "../ui/magnetic";
import { Reveal } from "../ui/reveal";
import { GitHubIcon, LinkedInIcon } from "../ui/icons";

function Rocket({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.svg
      viewBox="0 0 120 160"
      className="h-full w-full overflow-visible"
      aria-hidden
      animate={reduce ? undefined : { y: [0, -10, 0], rotate: [12, 9, 12] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ rotate: 12 }}
    >
      <motion.path
        d="M50 128c-4 14 0 24 10 30 10-6 14-16 10-30z"
        fill="#ff6b2c"
        stroke="#15130f"
        strokeWidth="3"
        strokeLinejoin="round"
        animate={reduce ? undefined : { scaleY: [1, 1.25, 0.9, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformBox: "fill-box", transformOrigin: "top" }}
      />
      <path d="M38 100l-18 14 4-30 16-8zM82 100l18 14-4-30-16-8z" fill="#2f4bff" stroke="#15130f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M60 6c26 18 30 60 22 122H38C30 66 34 24 60 6Z" fill="#fbf8f2" stroke="#15130f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M45 22c8-6 22-6 30 0" fill="none" stroke="#15130f" strokeWidth="3" />
      <circle cx="60" cy="58" r="13" fill="#c8f03c" stroke="#15130f" strokeWidth="3" />
      <circle cx="56" cy="54" r="3.5" fill="#fbf8f2" />
      <path d="M44 128h32" stroke="#15130f" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}

export function Contact() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-blue py-24 text-paper sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#fbf8f2 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
              <span className="rounded-full border border-paper/80 px-2 py-0.5 text-paper">06</span>
              Contact
            </p>
            <h2
              id="contact-title"
              className="font-display text-[clamp(2.8rem,9vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-balance"
            >
              Have something <span className="font-serif font-normal italic text-lime">interesting</span> in mind?
            </h2>
            <p className="mt-6 max-w-[34ch] text-xl leading-snug text-paper/85 sm:text-2xl">
              Let&apos;s build something ridiculous. Or something useful. Ideally both.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.22}>
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-lime px-5 py-4 text-base font-semibold sm:gap-3 sm:px-6 sm:text-lg text-ink shadow-[5px_5px_0_0_#15130f] transition-[box-shadow,transform] duration-200 hover:shadow-[7px_7px_0_0_#15130f] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  <Mail className="size-5" aria-hidden />
                  <span>{site.email}</span>
                  <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" aria-hidden />
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border-2 border-paper/80 px-5 py-4 font-semibold transition-colors hover:bg-paper hover:text-ink"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                      <Check className="size-5" aria-hidden />
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                      <Copy className="size-5" aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
                <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
              </button>
            </div>

            <ul className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
              {[
                { href: site.socials.github, label: "GitHub", handle: `@${site.githubUser}`, icon: <GitHubIcon size={22} /> },
                { href: site.socials.linkedin, label: "LinkedIn", handle: "Raunak Saha", icon: <LinkedInIcon size={22} /> },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border-2 border-ink bg-paper p-4 text-ink transition-transform duration-200 hover:-translate-y-1"
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-ink text-paper">{s.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{s.label}</span>
                      <span className="block truncate font-mono text-xs text-ink-mute">{s.handle}</span>
                    </span>
                    <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="relative mx-auto hidden h-[340px] w-[220px] lg:col-span-4 lg:block">
            <div className="absolute -left-10 top-6 size-24 rounded-full border-2 border-ink bg-orange" aria-hidden />
            <div className="absolute bottom-4 right-0 size-14 rounded-full border-2 border-ink bg-lime" aria-hidden />
            <div className="relative h-full w-full">
              <Rocket reduce={reduce} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
