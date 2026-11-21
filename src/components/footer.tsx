import Link from "next/link";
import { site } from "@/data/site";
import { RobotMark } from "./illustrations/robot-mark";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-lime">
            <RobotMark className="size-6" />
          </span>
          <p className="text-sm text-ink-soft">
            {site.name} · {site.location}
            <br />
            <span className="text-ink-mute">Built with Next.js, Tailwind CSS and Motion.</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <li><Link className="hover:text-blue" href="/projects">All projects</Link></li>
          <li><a className="hover:text-blue" href={site.socials.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="hover:text-blue" href={site.socials.youtube} target="_blank" rel="noreferrer">More demos on YouTube</a></li>
          <li><a className="hover:text-blue" href={site.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a className="hover:text-blue" href={`mailto:${site.email}`}>Email</a></li>
          <li><a className="hover:text-blue" href="#main">Back to top ↑</a></li>
        </ul>
      </div>
    </footer>
  );
}
