import { Reveal } from "./reveal";

/** Editorial section header: index number, eyebrow and a large title. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
  id,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">
          <span className="rounded-full border border-ink/80 px-2 py-0.5 text-ink">{index}</span>
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display text-[clamp(2.4rem,7vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <div className="text-pretty text-base leading-relaxed text-ink-soft md:col-span-4 md:pb-2">{children}</div>
      ) : null}
    </Reveal>
  );
}
