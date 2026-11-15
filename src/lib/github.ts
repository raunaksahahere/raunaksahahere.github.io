import { cacheLife } from "next/cache";
import { site } from "@/data/site";

/**
 * Public GitHub data, cached for an hour. Nothing here is ever invented: if a
 * request fails, the caller gets `null` and renders an honest fallback.
 *
 * Set GITHUB_TOKEN (no scopes needed) to raise rate limits and unlock the
 * contribution calendar, which is only available through the GraphQL API.
 */

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
  /** Daily public-event counts for the last 28 days (oldest first). */
  eventDays: { date: string; count: number }[];
  /** Full-year contribution calendar, only with GITHUB_TOKEN. */
  calendar: { total: number; weeks: { date: string; count: number }[][] } | null;
};

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

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

async function fetchCalendar(user: string): Promise<GitHubSnapshot["calendar"]> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
          };
        };
      };
    };
  };
  const cal = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
  };
}

function toActivity(e: RawEvent): ActivityItem | null {
  const repo = e.repo.name.replace(`${site.githubUser}/`, "");
  const url = `https://github.com/${e.repo.name}`;
  const base = { id: e.id, repo, url, date: e.created_at };
  switch (e.type) {
    case "PushEvent":
      return { ...base, kind: "push", detail: e.payload.ref?.replace("refs/heads/", "") };
    case "PullRequestEvent":
      if (e.payload.action !== "opened" && e.payload.action !== "closed") return null;
      return {
        ...base,
        kind: "pr",
        detail:
          e.payload.action === "closed" ? (e.payload.pull_request?.merged ? "merged a PR" : "closed a PR") : "opened a PR",
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

export async function getGitHubSnapshot(): Promise<GitHubSnapshot | null> {
  "use cache";
  const user = site.githubUser;

  try {
    const [profile, repos, events, calendar] = await Promise.all([
      getJSON<{ created_at: string }>(`/users/${user}`),
      getJSON<RawRepo[]>(`/users/${user}/repos?per_page=100&sort=pushed`),
      Promise.all([1, 2, 3].map((page) => getJSON<RawEvent[]>(`/users/${user}/events/public?per_page=100&page=${page}`).catch(() => []))).then(
        (pages) => pages.flat(),
      ),
      fetchCalendar(user).catch(() => null),
    ]);

    cacheLife("hours");

    const original = repos.filter((r) => !r.fork && r.size > 0 && r.name !== user);

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

    // Newest first, one line per repo and kind so the feed stays readable.
    events.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const activity: ActivityItem[] = [];
    const seen = new Set<string>();
    for (const e of events) {
      const item = toActivity(e);
      if (!item) continue;
      const key = item.kind === "release" ? item.id : `${item.kind}:${item.repo}`;
      if (seen.has(key)) continue;
      seen.add(key);
      activity.push(item);
      if (activity.length >= 6) break;
    }

    const today = new Date();
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const counts = new Map<string, number>();
    for (const e of events) {
      const k = e.created_at.slice(0, 10);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const eventDays = Array.from({ length: 28 }, (_, i) => {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - (27 - i));
      const k = dayKey(d);
      return { date: k, count: counts.get(k) ?? 0 };
    });

    return {
      fetchedAt: today.toISOString(),
      originalRepos: original.length,
      createdAt: profile.created_at,
      languages,
      recentRepos,
      activity,
      eventDays,
      calendar,
    };
  } catch {
    // Don't hold on to a failure for long.
    cacheLife("minutes");
    return null;
  }
}
