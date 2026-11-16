import { site } from "@/data/site";
import { GITHUB_API, fetchPublicGitHubSnapshot, type GitHubSnapshot } from "./github-public";

/** Build-time fallback only. Credentials stay in this server module. */
function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function fetchCalendar(user: string): Promise<GitHubSnapshot["calendar"]> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch(`${GITHUB_API}/graphql`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } }),
    signal: AbortSignal.timeout(15000),
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

export async function getGitHubSnapshot(): Promise<GitHubSnapshot | null> {
  try {
    const [{ snapshot }, calendar] = await Promise.all([
      fetchPublicGitHubSnapshot(site.githubUser, { headers: headers(), signal: AbortSignal.timeout(15000) }),
      fetchCalendar(site.githubUser).catch(() => null),
    ]);
    return { ...snapshot, calendar };
  } catch {
    return null;
  }
}
