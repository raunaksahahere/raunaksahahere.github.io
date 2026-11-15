import { SectionHeading } from "../ui/section-heading";
import { Reveal } from "../ui/reveal";
import { Pinboard } from "./pinboard";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden border-y-2 border-ink bg-sand/60 py-20 sm:py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="about-title"
          index="02"
          eyebrow="About"
          title={
            <>
              Learning by <span className="font-serif font-normal italic text-orange">shipping</span>, mostly.
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="space-y-5 text-pretty text-lg leading-relaxed text-ink-soft lg:col-span-6">
            <p className="text-2xl leading-snug text-ink">
              I&apos;m Raunak, a B.Tech student in Artificial Intelligence &amp; Data Science in Kolkata, and a
              developer who likes working across the whole stack.
            </p>
            <p>
              Most of what I know, I learned by building something and watching where it broke. I like having
              something concrete to show for an idea: a CLI that runs, an app you can install, a demo that makes the
              point in thirty seconds.
            </p>
            <p>
              The projects wander. A programming language written in plain English. A walkie-talkie that translates
              between Indian languages with no network at all. A tool that checks whether an LLM server is secretly
              serving quantized weights. Another that catches a migration quietly dropping an index before it
              reaches production.
            </p>
            <p>
              What ties them together is curiosity about how systems fail, and a stubborn preference for tools that
              show their evidence. I&apos;m most interested in AI where it&apos;s useful and accountable, and in
              software architecture that makes the right thing the easy thing.
            </p>
            <dl className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
              {[
                ["Based in", "Kolkata, India"],
                ["Studying", "B.Tech, AI & DS"],
                ["Writes in", "TS · Python · Go · Kotlin"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border-2 border-ink bg-paper p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">{k}</dt>
                  <dd className="mt-1 font-display text-base font-semibold leading-tight text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="lg:col-span-6">
            <Pinboard />
          </div>
        </div>
      </div>
    </section>
  );
}
