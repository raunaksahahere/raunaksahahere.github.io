import { ArrowUpRight, GitBranch, GitPullRequest, Package, Plus, Eye } from "lucide-react";
import { getGitHubSnapshot, type ActivityItem } from "@/lib/github";
import { site } from "@/data/site";
import { GitHubIcon } from "../ui/icons";

const langColor: Record<string, string> = {
  TypeScript: "#2f4bff",
  JavaScript: "#f1d34a",
  Python: "#3d7ab8",
  Go: "#2bb5c9",
  Kotlin: "#a77bff",
  Rust: "#c46a3b",
  HTML: "#ff6b2c",
  Shell: "#7fbf3f",
  CSS: "#7a4fd1",
  Java: "#b07219",
};

const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
const fmtLong = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

const kindMeta: Record<ActivityItem["kind"], { icon: React.ReactNode; verb: string }> = {
  push: { icon: <GitBranch className="size-3.5" aria-hidden />, verb: "Pushed to" },
  pr: { icon: <GitPullRequest className="size-3.5" aria-hidden />, verb: "" },
  release: { icon: <Package className="size-3.5" aria-hidden />, verb: "Released" },
  create: { icon: <Plus className="size-3.5" aria-hidden />, verb: "Created" },
  public: { icon: <Eye className="size-3.5" aria-hidden />, verb: "Open-sourced" },
};

function level(count: number, max: number) {
  if (count === 0) return "bg-ink/[0.07]";
  const r = count / Math.max(max, 1);
  if (r > 0.66) return "bg-ink";
  if (r > 0.33) return "bg-blue";
  return "bg-lime";
}

export async function GitHubActivity() {
  const data = await getGitHubSnapshot();

  if (!data) {
    return (
      <div className="rounded-[28px] border-2 border-ink bg-paper p-8 text-center">
        <p className="font-display text-2xl font-semibold">GitHub isn&apos;t answering right now.</p>
        <p className="mt-2 text-ink-soft">Rather than show made-up numbers, here&apos;s the real thing:</p>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-lime px-5 py-2.5 font-semibold"
        >
          <GitHubIcon size={16} /> github.com/{site.githubUser}
        </a>
      </div>
    );
  }

  const maxDay = Math.max(...data.eventDays.map((d) => d.count));
  const totalLang = data.languages.reduce((s, l) => s + l.count, 0);
  const calMax = data.calendar ? Math.max(...data.calendar.weeks.flat().map((d) => d.count)) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {/* overview */}
      <div className="flex flex-col rounded-[28px] border-2 border-ink bg-paper p-6 sm:p-7 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[#5a8a00]" />
            </span>
            Live from the GitHub API · refreshed hourly
          </p>
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-blue"
          >
            @{site.githubUser} <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-ink-mute">Original public repos</dt>
            <dd className="font-display text-5xl font-semibold tracking-tight">{data.originalRepos}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-mute">On GitHub since</dt>
            <dd className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {fmtLong.format(new Date(data.createdAt))}
            </dd>
          </div>
        </dl>

        {data.calendar ? (
          <div className="mt-7">
            <p className="mb-3 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{data.calendar.total.toLocaleString("en-IN")}</span> contributions
              in the last year
            </p>
            <div className="no-scrollbar overflow-x-auto">
              <div className="flex w-max gap-[3px]" role="img" aria-label={`${data.calendar.total} contributions in the last year`}>
                {data.calendar.weeks.map((w, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {w.map((d) => (
                      <span key={d.date} title={`${d.count} on ${d.date}`} className={`size-[10px] rounded-[3px] ${level(d.count, calMax)}`} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7">
            <p className="mb-3 text-sm text-ink-soft">Public events per day, last 28 days</p>
            <div
              className="flex h-20 items-end gap-[3px] sm:gap-1"
              role="img"
              aria-label={`Public GitHub events over the last 28 days, busiest day had ${maxDay}`}
            >
              {data.eventDays.map((d) => (
                <span
                  key={d.date}
                  title={`${d.count} public event${d.count === 1 ? "" : "s"} on ${d.date}`}
                  className={`flex-1 rounded-t-[4px] border border-ink/10 ${level(d.count, maxDay)}`}
                  style={{ height: `${d.count === 0 ? 6 : 14 + (d.count / Math.max(maxDay, 1)) * 86}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-mute">
              <span>{fmt.format(new Date(data.eventDays[0].date))}</span>
              <span>today</span>
            </div>
          </div>
        )}

        <div className="mt-7 lg:mt-auto lg:pt-7">
          <p className="mb-3 text-sm text-ink-soft">Primary language across original repos</p>
          <div className="flex h-3 overflow-hidden rounded-full border-2 border-ink">
            {data.languages.map((l) => (
              <span
                key={l.name}
                style={{ width: `${(l.count / totalLang) * 100}%`, background: langColor[l.name] ?? "#b9b1a2" }}
                title={`${l.name}: ${l.count}`}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {data.languages.slice(0, 7).map((l) => (
              <li key={l.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-ink/40" style={{ background: langColor[l.name] ?? "#b9b1a2" }} />
                {l.name} <span className="font-mono text-xs text-ink-mute">{l.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* feed */}
      <div className="flex flex-col gap-5 lg:col-span-5">
        <div className="rounded-[28px] border-2 border-ink bg-ink p-6 text-paper sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">Recently</p>
          <ol className="mt-4 space-y-3">
            {data.activity.map((a) => {
              const meta = kindMeta[a.kind];
              return (
                <li key={a.id} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime text-ink">{meta.icon}</span>
                  <span className="min-w-0 flex-1">
                    {a.kind === "pr" ? `${a.detail?.charAt(0).toUpperCase()}${a.detail?.slice(1)} in` : meta.verb}{" "}
                    <a href={a.url} target="_blank" rel="noreferrer" className="font-semibold underline decoration-paper/30 underline-offset-4 hover:decoration-lime">
                      {a.repo}
                    </a>
                    {a.kind === "release" && a.detail ? <span className="font-mono text-xs text-lime"> {a.detail}</span> : null}
                  </span>
                  <time dateTime={a.date} className="shrink-0 font-mono text-xs text-paper/50">
                    {fmt.format(new Date(a.date))}
                  </time>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-[28px] border-2 border-ink bg-paper p-6 sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">Last pushed</p>
          <ul className="mt-3 divide-y divide-ink/10">
            {data.recentRepos.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 py-2.5">
                  <span className="size-2.5 shrink-0 rounded-full border border-ink/40" style={{ background: langColor[r.language ?? ""] ?? "#b9b1a2" }} />
                  <span className="min-w-0 flex-1 truncate font-semibold group-hover:text-blue">{r.name}</span>
                  <time dateTime={r.pushedAt} className="font-mono text-xs text-ink-mute">
                    {fmt.format(new Date(r.pushedAt))}
                  </time>
                  <ArrowUpRight className="size-4 text-ink-mute transition-transform group-hover:rotate-45 group-hover:text-ink" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function GitHubActivitySkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-12" aria-busy="true" aria-label="Loading GitHub activity">
      <div className="h-[420px] animate-pulse rounded-[28px] border-2 border-ink/20 bg-paper lg:col-span-7" />
      <div className="flex flex-col gap-5 lg:col-span-5">
        <div className="h-[230px] animate-pulse rounded-[28px] border-2 border-ink/20 bg-ink/10" />
        <div className="h-[170px] animate-pulse rounded-[28px] border-2 border-ink/20 bg-paper" />
      </div>
    </div>
  );
}
