"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { ResumeLink } from "./resume-link";
import { navLinks, site } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "./ui/icons";
import { RobotMark } from "./illustrations/robot-mark";

export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Hide while scrolling down, reveal on the way back up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > prev && !open);
  });

  // Track which home-page section is on screen.
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navLinks.map((l) => l.href.split("#")[1]);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  // Lock scrolling behind the mobile menu and close it with Escape.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentActive = pathname === "/" ? active : null;
  const highlighted = hovered ?? currentActive;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-2 py-2 transition-[background-color,border-color,box-shadow] duration-300 sm:px-3 ${
            scrolled || open
              ? "border-ink/10 bg-paper/85 shadow-soft backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
            aria-label={`${site.name}, home`}
          >
            <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-lime transition-transform duration-300 group-hover:-rotate-12">
              <RobotMark className="size-6" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              raunak<span className="text-orange">.</span>
            </span>
          </Link>

          <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            {navLinks.map((link) => {
              const id = link.href.split("#")[1];
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHovered(id)}
                    onFocus={() => setHovered(id)}
                    onBlur={() => setHovered(null)}
                    aria-current={currentActive === id ? "location" : undefined}
                    className="relative z-10 block rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink aria-[current=location]:text-ink"
                  >
                    {link.label}
                  </Link>
                  {highlighted === id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-sand"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ResumeLink className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-4 py-2 text-sm font-semibold text-ink transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker md:inline-flex">
              <Download className="size-4" aria-hidden /> Resume
            </ResumeLink>
            <Link
              href="/projects"
              className="hidden items-center gap-1 rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-blue hover:shadow-sticker lg:inline-flex"
            >
              All projects <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <ResumeLink className="grid size-11 place-items-center rounded-full border-2 border-ink bg-lime md:hidden" onClick={() => setOpen(false)}>
              <Download className="size-5" aria-hidden />
              <span className="sr-only">Download resume (PDF)</span>
            </ResumeLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border-2 border-ink bg-paper md:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pb-8 pt-28 md:hidden"
          >
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <ul className="relative flex flex-col gap-1">
              {[...navLinks, { href: "/projects", label: "All projects" }].map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 py-2 font-display text-[2.6rem] font-semibold leading-none tracking-tight"
                  >
                    <span className="font-mono text-xs text-ink-mute">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="relative mt-auto flex flex-col gap-3"
            >
              <ResumeLink
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-lime px-5 py-3.5 text-base font-semibold shadow-sticker"
              >
                <Download className="size-5" aria-hidden /> Download resume (PDF)
              </ResumeLink>
              <div className="flex items-center gap-3">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noreferrer"
                className="grid size-12 place-items-center rounded-full border-2 border-ink bg-paper"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="grid size-12 place-items-center rounded-full border-2 border-ink bg-paper"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href={`mailto:${site.email}`}
                className="ml-auto truncate rounded-full border-2 border-ink bg-lime px-4 py-3 text-sm font-semibold"
              >
                {site.email}
              </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
