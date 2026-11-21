"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { youtubeShortUrl } from "@/data/projects";

export function ProjectShort({ id, name }: { id: string; name: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <aside id="demo" aria-label={`${name} video demo`} className="mx-auto w-full max-w-56 scroll-mt-28">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] border-2 border-ink bg-ink shadow-sticker">
        {playing ? (
          <iframe
            ref={(player) => { player?.focus(); }}
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
            title={`${name} video demo`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${name} demo`}
            className="group/play absolute inset-0 grid size-full place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-lime"
          >
            <Image
              src={`/projects/short-${id}.webp`}
              alt=""
              fill
              sizes="224px"
              className="object-cover"
            />
            <span className="relative grid size-14 place-items-center rounded-full border-2 border-ink bg-lime text-ink shadow-sticker transition-transform motion-safe:group-hover/play:scale-105">
              <Play className="ml-0.5 size-6 fill-current" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <a
        href={youtubeShortUrl(id)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-blue"
      >
        Watch on YouTube <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    </aside>
  );
}
