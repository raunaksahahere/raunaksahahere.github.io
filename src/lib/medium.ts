export const MEDIUM_PROFILE = "https://medium.com/@raunaksaha22";
export const MEDIUM_FEED = "https://medium.com/feed/@raunaksaha22";
export const MEDIUM_LIVE_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_FEED)}`;
export const MEDIUM_REFRESH_MS = 5 * 60 * 1000;

export type MediumPost = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  thumbnail: string | null;
  tags: string[];
};

export type MediumSnapshot = {
  profileUrl: string;
  fetchedAt: string;
  posts: MediumPost[];
};

function mediumURL(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      (url.hostname === "medium.com" || url.hostname.endsWith(".medium.com"));
  } catch {
    return false;
  }
}

function cleanMediumURL(value: unknown): string | null {
  if (!mediumURL(value)) return null;
  const url = new URL(value);
  url.search = "";
  url.hash = "";
  return url.href;
}

/** Browser-only parser. Remote story HTML is read as data, never rendered. */
export function parseMediumFeed(value: unknown): MediumSnapshot {
  if (!value || typeof value !== "object") throw new Error("Invalid Medium response");
  const data = value as { status?: unknown; feed?: { url?: unknown }; items?: unknown };
  if (data.status !== "ok" || data.feed?.url !== MEDIUM_FEED || !Array.isArray(data.items)) {
    throw new Error("Medium feed unavailable");
  }
  const posts: MediumPost[] = [];
  const seen = new Set<string>();
  for (const value of data.items) {
    if (!value || typeof value !== "object") continue;
    const item = value as Record<string, unknown>;
    const url = cleanMediumURL(item.link);
    const title = typeof item.title === "string" ? item.title.replace(/\s+/g, " ").trim() : "";
    if (!url || !title || seen.has(url) || typeof item.pubDate !== "string") continue;
    // rss2json expresses RSS dates in UTC without a timezone suffix.
    const timestamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(item.pubDate)
      ? `${item.pubDate.replace(" ", "T")}Z` : item.pubDate;
    if (!Number.isFinite(Date.parse(timestamp))) continue;
    const html = typeof item.content === "string" ? item.content : typeof item.description === "string" ? item.description : "";
    const document = new DOMParser().parseFromString(html, "text/html");
    document.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    const paragraphs = Array.from(document.querySelectorAll("p"), (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "");
    let excerpt = paragraphs.find((p) => p.length >= 100) ?? paragraphs.find(Boolean) ?? "";
    if (excerpt.length > 240) excerpt = `${excerpt.slice(0, 237).replace(/\s+\S*$/, "")}…`;
    const thumbnail = cleanMediumURL(item.thumbnail) ?? cleanMediumURL(document.querySelector("img[src]")?.getAttribute("src"));
    posts.push({
      title, url, publishedAt: new Date(timestamp).toISOString(), excerpt, thumbnail,
      tags: Array.isArray(item.categories)
        ? item.categories.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.replace(/[-_]/g, " ").trim()).filter(Boolean).slice(0, 3)
        : [],
    });
    seen.add(url);
  }
  if (data.items.length && !posts.length) throw new Error("Medium feed has no valid articles");
  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return { profileUrl: MEDIUM_PROFILE, fetchedAt: new Date().toISOString(), posts };
}

export async function fetchLiveMediumSnapshot(signal: AbortSignal): Promise<MediumSnapshot> {
  const response = await fetch(MEDIUM_LIVE_API, {
    cache: "no-cache", signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
    credentials: "omit", referrerPolicy: "no-referrer",
  });
  if (!response.ok) throw new Error(`Medium refresh failed (${response.status})`);
  return parseMediumFeed(await response.json());
}

/** Validate the public snapshot before replacing the already-rendered articles. */
export function isMediumSnapshot(value: unknown): value is MediumSnapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<MediumSnapshot>;
  return data.profileUrl === MEDIUM_PROFILE && typeof data.fetchedAt === "string" &&
    Number.isFinite(Date.parse(data.fetchedAt)) && Array.isArray(data.posts) &&
    data.posts.every((p) =>
      p && typeof p.title === "string" && mediumURL(p.url) &&
      typeof p.publishedAt === "string" && Number.isFinite(Date.parse(p.publishedAt)) &&
      typeof p.excerpt === "string" && (p.thumbnail === null || mediumURL(p.thumbnail)) &&
      Array.isArray(p.tags) && p.tags.every((t: unknown) => typeof t === "string"),
    );
}
