import Link from "next/link";
import { RobotMark } from "@/components/illustrations/robot-mark";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-5 pt-28 text-center">
      <div className="grid size-24 rotate-[-8deg] place-items-center rounded-3xl border-2 border-ink bg-lime shadow-sticker">
        <RobotMark className="size-16" />
      </div>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-ink-mute">404 · page not found</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
        This one <span className="font-serif font-normal italic text-blue">doesn&apos;t</span> exist yet.
      </h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">Bit looked everywhere. Maybe one of these instead?</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full border-2 border-ink bg-ink px-5 py-3 font-semibold text-paper shadow-sticker hover:bg-blue">
          Back home
        </Link>
        <Link href="/projects" className="rounded-full border-2 border-ink bg-paper px-5 py-3 font-semibold hover:bg-sand">
          All projects
        </Link>
      </div>
    </div>
  );
}
