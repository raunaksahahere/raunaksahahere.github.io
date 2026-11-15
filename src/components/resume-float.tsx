"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { site } from "@/data/site";
import { ResumeSheet } from "./resume-link";

/**
 * A sticky cartoon sticker that downloads the resume. It appears once the
 * visitor has scrolled past the hero, so it's always one tap away.
 */
export function ResumeFloat() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => {
    setShow(y > Math.max(480, window.innerHeight * 0.6));
  });

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="resume-float"
          initial={{ opacity: 0, y: 40, scale: 0.7, rotate: -12 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
          exit={{ opacity: 0, y: 40, scale: 0.7, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="fixed bottom-5 right-4 z-40 sm:bottom-7 sm:right-7"
        >
          <motion.a
            href={site.resume.href}
            download={site.resume.fileName}
            aria-label="Download Raunak Saha's resume (PDF)"
            whileHover={reduce ? undefined : { rotate: 0, y: -4, scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            className="group flex items-center gap-3 rounded-[22px] border-2 border-ink bg-lime py-2.5 pl-2.5 pr-5 shadow-sticker-lg transition-shadow duration-200 hover:shadow-[8px_8px_0_0_#15130f] focus-visible:outline-blue"
          >
            <span className="grid size-12 place-items-center rounded-2xl border-2 border-ink bg-paper transition-transform duration-300 group-hover:-rotate-6">
              <ResumeSheet className="size-9" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-tight">Resume</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">Download PDF</span>
            </span>
          </motion.a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
