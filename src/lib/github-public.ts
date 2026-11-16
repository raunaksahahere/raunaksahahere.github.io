/** Public API code shared by the build and the browser. No credentials live here. */
export const GITHUB_API = "https://api.github.com";
export const GITHUB_REFRESH_MS = 5 * 60 * 1000;

export type RepoSummary = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
};

export type ActivityItem = {
  id: string;
  kind: "push" | "pr" | "release" | "create" | "public";
  repo: string;
  url: string;
  date: string;
  detail?: string;
};

export type GitHubSnapshot = {
  fetchedAt: string;
  originalRepos: number;
  createdAt: string;
  languages: { name: string; count: number }[];
  recentRepos: RepoSummary[];
  activity: ActivityItem[];
  /** Daily public-event counts for the last 28 UTC days (oldest first). */
  eventDays: { date: string; count: number }[];
  /** Optional build-time calendar. The browser never requests authenticated data. */
  calendar: { total: number; weeks: { date: string; count: number }[][] } | null;
};

type RawRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  pushed_at: string;
  size: number;
};

type RawEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    release?: { tag_name?: string; name?: string };
    pull_request?: { title?: string; merged?: boolean };
  };
};

export class GitHubAPIError extends Error {
  constructor(public readonly retryAt: number) {
    super("GitHub could not refresh the public activity.");
    this.name = "GitHubAPIError";
  }
}

function toActivity(e: RawEvent, user: string): ActivityItem | null {
  const repo = e.repo.name.replace(new RegExp(`^${user}/`, "i"), "");
  const base = { id: e.id, repo, url: `https://github.com/${e.repo.name}`, date: e.created_at };
  switch (e.type) {
    case "PushEvent":
      return { ...base, kind: "push", detail: e.payload.ref?.replace("refs/heads/", "") };
    case "PullRequestEvent":
      if (e.payload.action !== "opened" && e.payload.action !== "closed") return null;
      return {
        ...base,
        kind: "pr",
        detail: e.payload.action === "closed"
          ? (e.payload.pull_request?.merged ? "merged a PR" : "closed a PR")
          : "opened a PR",
      };
    case "ReleaseEvent":
      return { ...base, kind: "release", detail: e.payload.release?.tag_name ?? e.payload.release?.name };
    case "CreateEvent":
      return e.payload.ref_type === "repository" ? { ...base, kind: "create" } : null;
    case "PublicEvent":
      return { ...base, kind: "public" };
    default:
      return null;
  }
}

export async function fetchPublicGitHubSnapshot(
  user: string,
  options: { signal?: AbortSignal; headers?: HeadersInit; createdAt?: string } = {},
): Promise<{ snapshot: GitHubSnapshot; nextRefreshAt: number }> {
  let nextRefreshAt = Date.now() + GITHUB_REFRESH_MS;
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/vnd.github+json");
  headers.set("X-GitHub-Api-Version", "2022-11-28");
  const username = encodeURIComponent(user);

  async function getJSON<T>(path: string): Promise<{ data: T; hasNext: boolean }> {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers,
      cache: "no-cache",
      signal: options.signal,
    });
    const pollSeconds = Number(res.headers.get("x-poll-interval"));
    if (Number.isFinite(pollSeconds) && pollSeconds > 0) {
      nextRefreshAt = Math.max(nextRefreshAt, Date.now() + pollSeconds * 1000);
    }

    if (!res.ok) {
      let retryAt = Date.now() + GITHUB_REFRESH_MS;
      const retryAfter = res.headers.get("retry-after");
      if (retryAfter) {
        const seconds = Number(retryAfter);
        const deadline = Number.isFinite(seconds) ? Date.now() + seconds * 1000 : Date.parse(retryAfter);
        if (Number.isFinite(deadline)) retryAt = Math.max(retryAt, deadline);
      }
      if (res.headers.get("x-ratelimit-remaining") === "0") {
        const reset = Number(res.headers.get("x-ratelimit-reset"));
        if (Number.isFinite(reset)) retryAt = Math.max(retryAt, reset * 1000 + 1000);
      }
      throw new GitHubAPIError(Math.max(retryAt, nextRefreshAt));
    }

    return { data: await res.json() as T, hasNext: /rel="next"/.test(res.headers.get("link") ?? "") };
  }

  async function getPages<T>(path: string, maxPages = Infinity): Promise<T[]> {
    const items: T[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const result = await getJSON<T[]>(`${path}&page=${page}`);
      items.push(...result.data);
      if (!result.hasNext) break;
    }
    return items;
  }

  // Reuse the immutable account creation date to keep polling below API limits.
  // Stop pagination at GitHub's last page instead of making three empty requests.
  const [createdAt, repos, events] = await Promise.all([
    options.createdAt ?? getJSON<{ created_at: string }>(`/users/${username}`).then(({ data }) => data.created_at),
    getPages<RawRepo>(`/users/${username}/repos?per_page=100&sort=pushed&direction=desc`),
    getPages<RawEvent>(`/users/${username}/events/public?per_page=100`, 3),
  ]);

  const original = repos.filter((r) => !r.fork && r.size > 0 && r.name.toLowerCase() !== user.toLowerCase());
  const langCounts = new Map<string, number>();
  for (const r of original) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  const languages = [...langCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const recentRepos = original.slice(0, 5).map((r) => ({
    name: r.name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    pushedAt: r.pushed_at,
  }));

  events.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const activity: ActivityItem[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    const item = toActivity(event, user);
    if (!item) continue;
    const key = item.kind === "release" ? item.id : `${item.kind}:${item.repo}`;
    if (seen.has(key)) continue;
    seen.add(key);
    activity.push(item);
    if (activity.length >= 6) break;
  }

  const today = new Date();
  const counts = new Map<string, number>();
  for (const event of events) {
    const date = event.created_at.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  const eventDays = Array.from({ length: 28 }, (_, i) => {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - (27 - i));
    const date = day.toISOString().slice(0, 10);
    return { date, count: counts.get(date) ?? 0 };
  });

  return {
    snapshot: {
      fetchedAt: today.toISOString(),
      originalRepos: original.length,
      createdAt,
      languages,
      recentRepos,
      activity,
      eventDays,
      calendar: null,
    },
    nextRefreshAt: Math.max(nextRefreshAt, Date.now() + GITHUB_REFRESH_MS),
  };
}
