"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

/** A paper sheet with a folded corner and a little bobbing arrow. */
export function ResumeSheet({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M9 4h15l8 8v22a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#fbf8f2" stroke="#15130f" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 4v7a1 1 0 0 0 1 1h7" fill="#c8f03c" stroke="#15130f" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M12 19h14M12 23h14M12 27h9" stroke="#15130f" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <motion.g
        animate={reduce ? undefined : { y: [0, 3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="28" cy="30" r="6.5" fill="#ff6b2c" stroke="#15130f" strokeWidth="2.2" />
        <path d="M28 27v6M25.5 30.8 28 33.3l2.5-2.5" fill="none" stroke="#15130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

/** Plain anchor that downloads the resume. Used in the nav and the mobile menu. */
export function ResumeLink({ className, children, onClick }: { className: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a href={site.resume.href} download={site.resume.fileName} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
