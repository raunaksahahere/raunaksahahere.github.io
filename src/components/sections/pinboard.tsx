"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

type Note = {
  id: string;
  rotate: number;
  className: string;
  tape: string;
  content: React.ReactNode;
};

const notes: Note[] = [
  {
    id: "rule",
    rotate: -3,
    className: "bg-paper sm:col-span-2",
    tape: "bg-orange/80",
    content: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">A rule I keep rewriting</p>
        <p className="mt-3 font-serif text-[1.7rem] italic leading-[1.15]">
          “Let deterministic code decide. Let the model explain.”
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Kavach Pay&apos;s rules engine owns every verdict; Gemini only writes the warning. LoopSatellite&apos;s
          statistics flag the pond; the LLM builds the case. Web Threat Detection cites its evidence or says nothing.
        </p>
      </>
    ),
  },
  {
    id: "exploring",
    rotate: 2.5,
    className: "bg-lime",
    tape: "bg-blue/70",
    content: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/70">Currently poking at</p>
        <ul className="mt-3 space-y-1.5 font-display text-lg font-semibold leading-tight">
          <li>Database internals</li>
          <li>Real-time collaboration</li>
          <li>On-device AI</li>
          <li>Offline-first architecture</li>
        </ul>
      </>
    ),
  },
  {
    id: "team",
    rotate: -1.5,
    className: "bg-blue text-paper",
    tape: "bg-lime/80",
    content: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70">Hackathon habit</p>
        <p className="mt-3 font-display text-lg font-semibold leading-snug">
          Kavach Pay was built for HackMatrix. LoopSatellite shipped with team Loop Errors.
        </p>
      </>
    ),
  },
  {
    id: "offscreen",
    rotate: 3,
    className: "bg-orange sm:col-span-2",
    tape: "bg-paper/80",
    content: (
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden>
          <rect x="4" y="10" width="30" height="28" rx="5" fill="#fbf8f2" stroke="#15130f" strokeWidth="2.5" />
          <path d="M34 20l10-6v20l-10-6z" fill="#c8f03c" stroke="#15130f" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="19" cy="24" r="5" fill="#15130f" />
        </svg>
        <p className="font-display text-lg font-semibold leading-snug">
          Off-screen, I edit videos. Same instinct, different timeline.
        </p>
      </div>
    ),
  },
];

export function Pinboard() {
  const reduce = useReducedMotion();
  const board = useRef<HTMLDivElement>(null);

  return (
    <div ref={board} className="relative grid gap-5 sm:grid-cols-2">
      {notes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: note.rotate }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.08 }}
          whileHover={reduce ? undefined : { rotate: 0, scale: 1.02, zIndex: 10 }}
          drag={!reduce}
          dragConstraints={board}
          dragElastic={0.15}
          dragSnapToOrigin
          data-cursor="hover"
          className={`relative cursor-grab touch-pan-y rounded-2xl border-2 border-ink p-5 shadow-sticker active:cursor-grabbing sm:p-6 ${note.className}`}
        >
          <span
            className={`absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] border border-ink/20 ${note.tape}`}
            aria-hidden
          />
          {note.content}
        </motion.div>
      ))}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute sm:col-span-2">
        ↑ the notes are draggable. they always come back.
      </p>
    </div>
  );
}
