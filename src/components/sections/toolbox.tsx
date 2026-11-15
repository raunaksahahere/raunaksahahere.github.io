"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toolbox } from "@/data/toolbox";

/**
 * A toolbox with drawers. Pick a drawer, then hover or focus any tool to see
 * which projects it was actually used in.
 */
export function Toolbox() {
  const reduce = useReducedMotion();
  const [groupId, setGroupId] = useState(toolbox[0].id);
  const [tool, setTool] = useState<string | null>(null);
  const group = toolbox.find((g) => g.id === groupId) ?? toolbox[0];
  const activeTool = group.tools.find((t) => t.name === tool) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* drawers */}
      <div
        role="tablist"
        aria-label="Tool categories"
        aria-orientation="vertical"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        onKeyDown={(e) => {
          const i = toolbox.findIndex((g) => g.id === groupId);
          const next =
            e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
          if (next === null) return;
          e.preventDefault();
          const g = toolbox[(next + toolbox.length) % toolbox.length];
          setGroupId(g.id);
          setTool(null);
          document.getElementById(`tab-${g.id}`)?.focus();
        }}
      >
        {toolbox.map((g, i) => {
          const selected = g.id === groupId;
          return (
            <button
              key={g.id}
              id={`tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="toolbox-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                setGroupId(g.id);
                setTool(null);
              }}
              className={`relative flex shrink-0 items-center justify-between gap-4 rounded-2xl border-2 border-ink px-4 py-3 text-left transition-colors lg:py-3.5 ${
                selected ? "text-paper" : "bg-paper hover:bg-sand"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId="drawer-active"
                  className="absolute inset-0 rounded-[14px] bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <span className="relative flex items-center gap-3">
                <span className={`font-mono text-[11px] ${selected ? "text-lime" : "text-ink-mute"}`}>0{i + 1}</span>
                <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">{g.label}</span>
              </span>
              <span
                className={`relative hidden h-1.5 w-8 rounded-full border border-current lg:block ${selected ? "bg-lime" : ""}`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {/* open drawer */}
      <div
        id="toolbox-panel"
        role="tabpanel"
        aria-labelledby={`tab-${group.id}`}
        className="relative min-h-[360px] overflow-hidden rounded-[28px] border-2 border-ink bg-paper p-5 shadow-sticker-lg sm:p-8 lg:col-span-8"
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={group.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{group.label}</p>
            <p className="mt-1 text-ink-soft">{group.blurb}</p>

            <ul className="mt-7 flex flex-wrap gap-2.5" onMouseLeave={() => setTool(null)}>
              {group.tools.map((t, i) => {
                const on = tool === t.name;
                return (
                  <motion.li
                    key={t.name}
                    initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: i % 2 ? 4 : -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20, delay: i * 0.035 }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setTool(t.name)}
                      onFocus={() => setTool(t.name)}
                      onClick={() => setTool(on ? null : t.name)}
                      aria-pressed={on}
                      className={`rounded-full border-2 border-ink px-4 py-2 text-[15px] font-medium transition-[background-color,transform,box-shadow] duration-200 ${
                        on ? "-translate-x-0.5 -translate-y-0.5 bg-lime shadow-sticker" : "bg-cream hover:bg-sand"
                      }`}
                    >
                      {t.name}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 min-h-[84px] rounded-2xl border-2 border-dashed border-ink/30 p-4" aria-live="polite">
              {activeTool ? (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
                    {activeTool.name} shows up in
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-display text-lg font-semibold">
                    {activeTool.usedIn.map((p, i) => (
                      <span key={p}>
                        {p}
                        {i < activeTool.usedIn.length - 1 ? <span className="text-orange"> · </span> : null}
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <p className="font-mono text-sm text-ink-mute">Hover or tap a tool to see where it was used →</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
