"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Pause, Play, Rss } from "lucide-react";
import { fetchLiveMediumSnapshot, isMediumSnapshot, MEDIUM_PROFILE, MEDIUM_REFRESH_MS, type MediumPost, type MediumSnapshot } from "@/lib/medium";

const date = (value: string) => new Intl.DateTimeFormat("en", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(value));

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const serverReducedMotion = () => true;

function Cover({ post }: { post: MediumPost }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative flex aspect-[16/9] shrink-0 items-center justify-center overflow-hidden border-b-2 border-ink bg-cream md:aspect-auto md:min-h-[300px] md:border-b-0 md:border-r-2">
      {post.thumbnail && !failed ? (
        <Image
          src={post.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1100px) 30vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain transition-transform duration-700 group-hover:scale-[1.025]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="dot-grid flex h-full min-h-52 w-full items-center justify-center" aria-hidden>
          <BookOpen className="size-20 -rotate-6 text-blue" strokeWidth={1.2} />
        </div>
      )}
    </div>
  );
}

function Story({ post, latest = true, duplicate = false, compact = false }: {
  post: MediumPost; latest?: boolean; duplicate?: boolean; compact?: boolean;
}) {
  return (
    <article>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`${post.title} — read on Medium (opens in a new tab)`}
        className="group grid h-full overflow-hidden rounded-[24px] border-2 border-ink bg-paper transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-sticker-lg md:grid-cols-[1.15fr_1fr]"
      >
        <Cover post={post} />
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
            {latest ? <span className="rounded-full border border-ink bg-lime px-2.5 py-1 text-ink">Latest story</span> : null}
            <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time>
          </div>
          <h3 className={`font-display font-semibold leading-[1.08] tracking-[-0.035em] transition-colors group-hover:text-blue ${compact ? "text-[clamp(1.5rem,2.2vw,2.1rem)]" : "text-[clamp(1.8rem,3vw,2.8rem)]"}`}>
            {post.title}
          </h3>
          <p className={`mt-4 text-pretty text-base leading-relaxed text-ink-soft ${compact ? "line-clamp-3" : ""}`}>{post.excerpt}</p>
          {post.tags.length ? (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Article topics">
              {post.tags.map((tag) => <li key={tag} className="rounded-full border border-ink/15 px-2.5 py-1 text-xs capitalize text-ink-soft">{tag}</li>)}
            </ul>
          ) : null}
          <span className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm font-semibold">
            Read on Medium
            <span className="grid size-10 place-items-center rounded-full border-2 border-ink bg-lime transition-colors group-hover:bg-orange">
              <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" aria-hidden />
            </span>
          </span>
        </div>
      </a>
    </article>
  );
}

/** Full centre card and complete, smaller neighbours; loop copies never crop them. */
function StoryCarousel({ posts }: { posts: MediumPost[] }) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverReducedMotion);
  const viewport = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const width = useRef(posts.length);
  const manualTarget = useRef<number | null>(null);
  const inView = useRef(false);
  const focused = useRef(false);
  const announcedIndex = useRef(0);
  const layout = useRef({ cardWidth: 800, cardHeight: 550, sideScale: 0.36, stacked: false });
  const [playing, setPlaying] = useState(true);
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const multiple = posts.length > 1;

  const paint = useCallback((normalized: number) => {
    if (!track.current) return;
    const { cardWidth, cardHeight, sideScale, stacked } = layout.current;
    const horizontalStep = stacked
      ? (cardWidth * sideScale + 20) / 2
      : cardWidth * (1 + sideScale) / 2 + 20;
    const verticalStep = stacked ? cardHeight * (1 + sideScale) / 2 + 20 : 0;
    const cards = track.current.querySelectorAll<HTMLElement>("[data-story-index]");
    cards.forEach((card, i) => {
      const distance = i - width.current - normalized;
      const magnitude = Math.abs(distance);
      const horizontalDistance = Math.max(-1, Math.min(1, distance));
      const scale = 1 - Math.min(1, magnitude) * (1 - sideScale);
      const opacity = magnitude <= 1 ? 1 - magnitude * 0.75 : Math.max(0, 0.25 * (1 - (magnitude - 1) / 0.4));
      card.style.transform = `translate3d(calc(-50% + ${horizontalDistance * horizontalStep}px), ${Math.min(1, magnitude) * verticalStep}px, 0) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.visibility = magnitude < 1.4 ? "visible" : "hidden";
      card.style.pointerEvents = magnitude <= 1.05 ? "auto" : "none";
      card.style.zIndex = String(Math.round(100 - magnitude * 10));
    });
  }, []);

  useEffect(() => {
    const frame = viewport.current;
    const strip = track.current;
    if (!multiple || !frame || !strip) return;
    const measure = () => {
      const frameWidth = frame.clientWidth;
      const stacked = frameWidth < 1100;
      const cardWidth = stacked ? Math.min(640, frameWidth - 48) : Math.min(960, (frameWidth - 48) * 0.56);
      const sideScale = stacked ? 0.42 : 0.36;
      strip.style.setProperty("--story-width", `${cardWidth}px`);
      strip.style.removeProperty("--story-height");
      const cards = Array.from(strip.querySelectorAll<HTMLElement>("[data-story-index]"));
      const cardHeight = Math.max(...cards.map((card) => card.scrollHeight));
      strip.style.setProperty("--story-height", `${cardHeight}px`);
      strip.style.height = `${cardHeight * (stacked ? 1 + sideScale : 1) + (stacked ? 36 : 16)}px`;
      layout.current = { cardWidth, cardHeight, sideScale, stacked };
      manualTarget.current = null;
      position.current = Math.round(position.current) % posts.length;
      paint(position.current);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(frame);
    const observer = new IntersectionObserver(([entry]) => { inView.current = entry.isIntersecting; });
    observer.observe(frame);
    void document.fonts.ready.then(() => { if (track.current === strip) measure(); });
    return () => { resize.disconnect(); observer.disconnect(); };
  }, [multiple, posts, paint]);

  useEffect(() => {
    if (!multiple) return;
    if (reducedMotion) {
      position.current = Math.round(position.current);
      manualTarget.current = null;
    }
    let frame: number;
    let last = 0;
    const hoverCapable = window.matchMedia("(hover: hover)");
    const animate = (time: number) => {
      const seconds = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      if (inView.current && !document.hidden) {
        const canAdvance = playing && !reducedMotion && !focused.current && !(hoverCapable.matches && container.current?.matches(":hover"));
        if (manualTarget.current !== null) {
          const remaining = manualTarget.current - position.current;
          position.current += reducedMotion ? remaining : remaining * (1 - Math.exp(-seconds * 10));
          if (Math.abs(remaining) < 0.001 || reducedMotion) {
            position.current = manualTarget.current;
            manualTarget.current = null;
          }
        } else if (canAdvance) {
          // Continuous travel: one card every eight seconds, without a dwell.
          position.current += seconds / 8;
        }
        const normalized = ((position.current % width.current) + width.current) % width.current;
        if (manualTarget.current === null) position.current = normalized;
        paint(normalized);
        const index = Math.round(normalized) % posts.length;
        if (announcedIndex.current !== index) {
          announcedIndex.current = index;
          setActive(index);
        }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [multiple, playing, reducedMotion, posts.length, paint]);

  function move(direction: -1 | 1) {
    const index = Math.round(manualTarget.current ?? position.current) + direction;
    manualTarget.current = index;
    const nextIndex = ((index % posts.length) + posts.length) % posts.length;
    setAnnouncement(`Story ${nextIndex + 1} of ${posts.length}: ${posts[nextIndex].title}`);
  }

  return (
    <div
      ref={container}
      role="region"
      aria-roledescription="carousel"
      aria-label="Medium articles"
      onPointerDownCapture={() => { focused.current = false; }}
      onKeyDownCapture={() => { focused.current = true; }}
      onFocusCapture={(event) => {
        focused.current = (event.target as HTMLElement).matches(":focus-visible");
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) focused.current = false;
      }}
    >
      {multiple ? (
        <div
          ref={viewport}
          id="blog-carousel-track"
          className="blog-carousel-stage relative left-1/2 w-screen -translate-x-1/2 overflow-clip pb-4 pt-2"
          onFocusCapture={(event) => {
            const card = (event.target as HTMLElement).closest<HTMLElement>("[data-story-index]");
            if (card && (event.target as HTMLElement).matches(":focus-visible")) {
              position.current = Number(card.dataset.storyIndex);
              manualTarget.current = null;
              paint(position.current);
            }
          }}
        >
          <div ref={track} className="relative">
            {[0, 1, 2].map((copy) => (
              <div key={copy} aria-hidden={copy !== 1 ? true : undefined} className="contents">
                {posts.map((post, index) => {
                  const initialDistance = copy * posts.length + index - posts.length;
                  const initialMagnitude = Math.abs(initialDistance);
                  return (
                    <div
                      key={post.url}
                      data-story-index={index}
                      role={copy === 1 ? "group" : undefined}
                      aria-roledescription={copy === 1 ? "slide" : undefined}
                      aria-label={copy === 1 ? `${index + 1} of ${posts.length}` : undefined}
                      className="absolute left-1/2 top-0 w-[var(--story-width)] origin-center h-[var(--story-height,auto)] [&>article]:h-full [&>article]:w-full"
                      style={{
                        opacity: initialMagnitude <= 1 ? 1 - initialMagnitude * 0.75 : 0,
                        visibility: initialMagnitude <= 1 ? "visible" : "hidden",
                        transform: `translate3d(calc(-50% + var(--story-shift) * ${initialDistance}), calc(var(--story-drop) * ${Math.min(1, initialMagnitude)}), 0) scale(${initialMagnitude === 0 ? 1 : "var(--story-side-scale)"})`,
                      }}
                    >
                      <Story post={post} compact latest={index === 0} duplicate={copy !== 1} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : <Story post={posts[0]} />}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-3 font-mono text-xs text-ink-mute">
          <span className="text-ink">{String(active + 1).padStart(2, "0")} <span className="text-ink-mute">/ {String(posts.length).padStart(2, "0")}</span></span>
          {multiple ? <span className="hidden sm:inline">{reducedMotion ? "Explore the stories" : "Hover to take your time"}</span> : null}
        </p>
        <div className="flex items-center gap-2">
          {multiple && !reducedMotion ? (
            <button type="button" onClick={() => {
              if (!playing) focused.current = false;
              setPlaying((value) => !value);
            }} aria-label={playing ? "Pause automatic scrolling" : "Resume automatic scrolling"} aria-pressed={!playing} className="mr-2 grid size-11 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-sand">
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
          ) : null}
          <button type="button" onClick={() => move(-1)} disabled={!multiple} aria-label="Previous article" aria-controls={multiple ? "blog-carousel-track" : undefined} className="grid size-12 place-items-center rounded-full border-2 border-ink bg-paper transition-[transform,background-color] hover:-translate-x-0.5 hover:bg-sand disabled:cursor-default disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:bg-paper">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => move(1)} disabled={!multiple} aria-label="Next article" aria-controls={multiple ? "blog-carousel-track" : undefined} className="grid size-12 place-items-center rounded-full border-2 border-ink bg-lime transition-[transform,background-color] hover:translate-x-0.5 hover:bg-orange disabled:cursor-default disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:bg-lime">
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}

export function BlogStories({ initialData }: { initialData: MediumSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialData);

  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;
    let nextRefreshAt = 0;
    function accept(data: MediumSnapshot) {
      setSnapshot((previous) => {
        // A converter cache can lag behind the snapshot already on the page.
        const previousLatest = Date.parse(previous.posts[0]?.publishedAt ?? "");
        const incomingLatest = Date.parse(data.posts[0]?.publishedAt ?? "");
        return incomingLatest < previousLatest ? previous : data;
      });
    }
    async function refresh(force = false) {
      if (document.hidden || inFlight || (!force && Date.now() < nextRefreshAt)) return;
      inFlight = true;
      nextRefreshAt = Date.now() + MEDIUM_REFRESH_MS;
      try {
        // GitHub Pages is static: the converter exposes Medium RSS with CORS.
        // This runs on every page opening, independently of site deployments.
        accept(await fetchLiveMediumSnapshot(controller.signal));
      } catch {
        if (controller.signal.aborted) return;
        try {
          const response = await fetch("/medium-posts.json", { cache: "no-cache", signal: controller.signal });
          if (!response.ok) return;
          const data: unknown = await response.json();
          if (isMediumSnapshot(data)) accept(data);
        } catch {
          // Keep the rendered articles when both refresh paths are unavailable.
        }
      } finally {
        inFlight = false;
      }
    }
    void refresh(true);
    const timer = setInterval(() => { void refresh(); }, MEDIUM_REFRESH_MS);
    const onVisible = () => { void refresh(); };
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) void refresh(true); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return (
    <div>
      {snapshot.posts.length ? (
        <StoryCarousel key={snapshot.posts.map((post) => post.url).join("|")} posts={snapshot.posts} />
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-ink/30 p-8 sm:p-12">
          <BookOpen className="mb-4 size-8 text-blue" aria-hidden />
          <h3 className="font-display text-2xl font-semibold">The next story starts here.</h3>
          <p className="mt-2 text-ink-soft">Visit my Medium profile for my latest writing.</p>
        </div>
      )}
      <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-ink/15 pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-ink-mute"><Rss className="size-4 text-orange" aria-hidden /> Published on Medium. Collected here.</p>
        <a href={MEDIUM_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper">
          All stories on Medium <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
