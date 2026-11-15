"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const INK = "#15130f";
const PAPER = "#fbf8f2";
const CREAM = "#f5efe3";
const SAND = "#ebe3d3";
const BLUE = "#2f4bff";
const ORANGE = "#ff6b2c";
const LIME = "#c8f03c";
const TERM = "#17150f";

const quips = [
  "beep. ship it.",
  "statistics decides. I just explain.",
  "it worked on my machine.",
  "proposal pending review…",
  "rolling back. calmly.",
  "boop. that's my whole job.",
];

const terminalLines = [
  { t: "$ git push origin main", c: LIME },
  { t: "› validating idea…", c: "#bdb6a8" },
  { t: "› probably shouldn't exist", c: ORANGE },
  { t: "✓ shipped anyway", c: LIME },
];

/** Moves a layer by `depth` px against the pointer. */
function useLayer(px: MotionValue<number>, py: MotionValue<number>, depth: number) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return { x, y };
}

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [quip, setQuip] = useState<number | null>(null);
  const [typed, setTyped] = useState(reduce ? terminalLines.length : 0);

  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const planetY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  const back = useLayer(px, py, 6);
  const mid = useLayer(px, py, 12);
  const front = useLayer(px, py, 22);

  // Type the laptop terminal out line by line.
  useEffect(() => {
    if (reduce) return;
    if (typed >= terminalLines.length) return;
    const id = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 700 : 900);
    return () => clearTimeout(id);
  }, [typed, reduce]);

  // Auto-hide the robot's speech bubble.
  useEffect(() => {
    if (quip === null) return;
    const id = setTimeout(() => setQuip(null), 2600);
    return () => clearTimeout(id);
  }, [quip]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * -2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * -2);
  }

  function poke() {
    setQuip((q) => ((q ?? -1) + 1) % quips.length);
  }

  const float = (amp: number, dur: number, delay = 0) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -amp, 0] },
          transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  const twinkle = (dur: number, delay = 0) =>
    reduce
      ? {}
      : {
          animate: { scale: [1, 0.6, 1], rotate: [0, 20, 0] },
          transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  const origin = { transformBox: "fill-box" as const, transformOrigin: "center" };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ y: sceneY }}
      className="relative mx-auto aspect-[56/52] w-full max-w-[560px] select-none"
    >
      <svg
        viewBox="0 0 560 520"
        className="h-full w-full overflow-visible"
        role="img"
        aria-labelledby="hero-scene-title"
      >
        <title id="hero-scene-title">
          An illustrated desk at night: a laptop typing out a deploy log, a tiny robot named Bit, a mug of coffee,
          a plant, and a ringed planet floating through a blue window of stars.
        </title>

        {/* ---------------------------------------------------------- back */}
        <motion.g style={back}>
          <circle cx="292" cy="236" r="196" fill={BLUE} stroke={INK} strokeWidth="3" />
          {/* stars */}
          {[
            [190, 120, 2.2], [250, 82, 1.6], [360, 100, 2.4], [410, 160, 1.4], [150, 200, 1.6],
            [330, 60, 1.4], [220, 170, 1.2], [440, 230, 2], [130, 280, 1.4], [395, 300, 1.2],
          ].map(([cx, cy, r], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={PAPER}
              {...(reduce
                ? {}
                : {
                    animate: { opacity: [1, 0.25, 1] },
                    transition: { duration: 2.4 + (i % 4) * 0.7, repeat: Infinity, delay: i * 0.3 },
                  })}
            />
          ))}
          {/* orbit */}
          <ellipse cx="292" cy="236" rx="250" ry="70" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round" transform="rotate(-14 292 236)" />
          {/* moon */}
          <motion.g {...float(6, 5, 0.6)}>
            <circle cx="150" cy="128" r="22" fill={LIME} stroke={INK} strokeWidth="3" />
            <circle cx="143" cy="122" r="4" fill="none" stroke={INK} strokeWidth="2" />
            <circle cx="158" cy="136" r="2.6" fill="none" stroke={INK} strokeWidth="2" />
          </motion.g>
        </motion.g>

        {/* ringed planet, drifts up on scroll */}
        <motion.g style={{ ...back, translateY: planetY }}>
          <motion.g {...float(10, 6.5)} data-cursor="hover">
            <motion.g
              style={origin}
              whileHover={reduce ? undefined : { rotate: 18, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
            >
              <path d="M418 104c-16-9-7-30 40-36s96 2 96 16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" transform="rotate(-8 480 92)" />
              <circle cx="480" cy="92" r="40" fill={ORANGE} stroke={INK} strokeWidth="3" />
              <path d="M450 80c14 6 40 6 60-4M448 100c18 6 42 6 62-2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
              <path d="M554 84c4 14-40 30-86 34s-66-4-62-16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" transform="rotate(-8 480 92)" />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* ----------------------------------------------------------- mid */}
        <motion.g style={mid}>
          {/* shadow under desk */}
          <ellipse cx="290" cy="500" rx="230" ry="9" fill={INK} opacity="0.1" />
          {/* desk legs */}
          <rect x="78" y="398" width="16" height="98" rx="4" fill={SAND} stroke={INK} strokeWidth="3" />
          <rect x="486" y="398" width="16" height="98" rx="4" fill={SAND} stroke={INK} strokeWidth="3" />
          <path d="M94 440h392" stroke={INK} strokeWidth="3" />
          {/* desk top */}
          <rect x="36" y="378" width="508" height="24" rx="7" fill={PAPER} stroke={INK} strokeWidth="3" />
          <path d="M48 386h480" stroke={INK} strokeWidth="1.4" opacity="0.25" strokeLinecap="round" />

          {/* laptop screen */}
          <rect x="176" y="206" width="220" height="160" rx="12" fill={INK} stroke={INK} strokeWidth="3" />
          <rect x="187" y="217" width="198" height="136" rx="6" fill={TERM} />
          <circle cx="198" cy="227" r="3" fill={ORANGE} />
          <circle cx="208" cy="227" r="3" fill={LIME} />
          <circle cx="218" cy="227" r="3" fill={PAPER} opacity="0.5" />
          {terminalLines.slice(0, typed).map((line, i) => (
            <motion.text
              key={line.t}
              x="197"
              y={252 + i * 20}
              fill={line.c}
              fontSize="12"
              fontFamily="var(--nf-mono), ui-monospace, monospace"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {line.t}
            </motion.text>
          ))}
          <rect className="caret" x="197" y={242 + Math.min(typed, terminalLines.length) * 20} width="7" height="13" fill={LIME} />
          {/* laptop base */}
          <path d="M150 366h272l16 12H134z" fill={SAND} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M262 370h48" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />

          {/* cable */}
          <path d="M424 376c26 4 40 14 46 30s-2 34-24 46-30 26-20 40" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <rect x="418" y="488" width="22" height="14" rx="3" fill={ORANGE} stroke={INK} strokeWidth="2.5" transform="rotate(-12 429 495)" />

          {/* plant */}
          <g>
            <path d="M74 318c-12-24-4-48 10-58 4 22 2 40-10 58Z" fill={LIME} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M80 320c6-30 26-46 44-46-6 22-22 38-44 46Z" fill={LIME} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M76 322c-16-12-34-12-46-4 14 12 30 12 46 4Z" fill={LIME} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M58 322h44l-6 56H64z" fill={ORANGE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M56 322h48" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* --------------------------------------------------------- front */}
        <motion.g style={front}>
          {/* mug with steam */}
          <g>
            {[0, 1].map((i) => (
              <motion.path
                key={i}
                d={`M${128 + i * 14} 330c-6-8 6-14 0-24s4-14 0-20`}
                fill="none"
                stroke={INK}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.5"
                {...(reduce
                  ? {}
                  : {
                      animate: { y: [0, -8, 0], opacity: [0.15, 0.6, 0.15] },
                      transition: { duration: 2.6, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" },
                    })}
              />
            ))}
            <path d="M156 346c16 0 16 22 0 22" fill="none" stroke={INK} strokeWidth="3" />
            <rect x="114" y="336" width="44" height="42" rx="8" fill={PAPER} stroke={INK} strokeWidth="3" />
            <path d="M122 352h28" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Bit the robot: click to talk */}
          <motion.g
            role="button"
            tabIndex={0}
            aria-label="Poke Bit the robot"
            onClick={poke}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                poke();
              }
            }}
            style={{ cursor: "pointer", outline: "none" }}
            whileHover={reduce ? undefined : { y: -6 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            className="[&:focus-visible>rect:first-of-type]:stroke-blue"
          >
            <rect x="424" y="248" width="96" height="136" fill="transparent" />
            {/* antenna */}
            <path d="M472 262v-16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <motion.circle
              cx="472"
              cy="242"
              r="6"
              fill={quip !== null ? LIME : ORANGE}
              stroke={INK}
              strokeWidth="2.5"
              {...(reduce ? {} : { animate: { scale: [1, 1.2, 1] }, transition: { duration: 1.6, repeat: Infinity } })}
              style={origin}
            />
            {/* head */}
            <rect x="440" y="262" width="64" height="50" rx="14" fill={PAPER} stroke={INK} strokeWidth="3" />
            <rect x="449" y="273" width="46" height="26" rx="9" fill={INK} />
            <motion.g
              style={origin}
              {...(reduce
                ? {}
                : { animate: { scaleY: [1, 1, 0.1, 1] }, transition: { duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] } })}
            >
              {quip !== null ? (
                <>
                  <path d="M458 288l5-5 5 5M476 288l5-5 5 5" fill="none" stroke={LIME} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <circle cx="463" cy="286" r="4.2" fill={LIME} />
                  <circle cx="481" cy="286" r="4.2" fill={LIME} />
                </>
              )}
            </motion.g>
            <circle cx="436" cy="288" r="5" fill={ORANGE} stroke={INK} strokeWidth="2.5" />
            <circle cx="508" cy="288" r="5" fill={ORANGE} stroke={INK} strokeWidth="2.5" />
            {/* body */}
            <rect x="448" y="316" width="48" height="50" rx="10" fill={LIME} stroke={INK} strokeWidth="3" />
            <rect x="460" y="328" width="24" height="12" rx="3" fill={PAPER} stroke={INK} strokeWidth="2" />
            <circle cx="466" cy="352" r="2.6" fill={INK} />
            <circle cx="478" cy="352" r="2.6" fill={INK} />
            {/* arms: right one waves when poked */}
            <path d="M448 330c-12 4-16 14-14 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <motion.path
              d="M496 330c12-4 18-14 18-24"
              fill="none"
              stroke={INK}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transformBox: "view-box", transformOrigin: "496px 330px" }}
              animate={quip !== null && !reduce ? { rotate: [0, -24, 10, -24, 0] } : { rotate: 0 }}
              transition={{ duration: 0.9 }}
            />
            {/* legs */}
            <path d="M462 366v12M482 366v12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* floating code sticker */}
          <motion.g {...float(8, 4.6, 0.3)}>
            <g transform="rotate(-10 88 214)">
              <rect x="44" y="194" width="88" height="40" rx="12" fill={LIME} stroke={INK} strokeWidth="3" />
              <text x="88" y="221" textAnchor="middle" fontSize="18" fontWeight="700" fill={INK} fontFamily="var(--nf-mono), ui-monospace, monospace">
                {"</>"}
              </text>
            </g>
          </motion.g>

          {/* paper plane */}
          <motion.g {...float(12, 5.4, 1.1)}>
            <g transform="rotate(12 250 64)">
              <path d="M222 70l56-26-18 40-10-12z" fill={PAPER} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M250 72l28-28" stroke={INK} strokeWidth="2" />
              <path d="M196 84c8-2 14-6 20-10" stroke={INK} strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" fill="none" />
            </g>
          </motion.g>

          {/* sparkles */}
          {[
            { x: 28, y: 140, s: 26, f: ORANGE, d: 3.2 },
            { x: 518, y: 196, s: 22, f: LIME, d: 2.6 },
            { x: 352, y: 22, s: 18, f: PAPER, d: 3.6 },
            { x: 532, y: 330, s: 14, f: CREAM, d: 2.2 },
          ].map((s, i) => (
            <motion.g key={i} style={origin} {...twinkle(s.d, i * 0.4)}>
              <path
                transform={`translate(${s.x} ${s.y}) scale(${s.s / 24})`}
                d="M12 1.5c.6 4.6 2.3 7.6 7.9 9.4.5.2.5.9 0 1.1-5.6 1.8-7.3 4.8-7.9 9.5-.1.6-.9.6-1 0-.6-4.7-2.3-7.7-7.9-9.5-.5-.2-.5-.9 0-1.1 5.6-1.8 7.3-4.8 7.9-9.4.1-.6.9-.6 1 0Z"
                fill={s.f}
                stroke={INK}
                strokeWidth={1.6 / (s.s / 24)}
                strokeLinejoin="round"
              />
            </motion.g>
          ))}
        </motion.g>
      </svg>

      {/* speech bubble, as HTML so it stays crisp and readable */}
      <AnimatePresence>
        {quip !== null ? (
          <motion.p
            key={quip}
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="absolute right-[2%] top-[30%] max-w-[46%] rounded-2xl rounded-br-sm border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] leading-snug shadow-sticker sm:text-xs"
          >
            {quips[quip]}
          </motion.p>
        ) : null}
      </AnimatePresence>
      <p className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
        psst — poke the robot
      </p>
    </motion.div>
  );
}
