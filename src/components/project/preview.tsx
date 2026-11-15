import Image from "next/image";
import type { Accent, Preview, TerminalLine } from "@/data/projects";

const toneClass: Record<NonNullable<TerminalLine["tone"]>, string> = {
  cmd: "text-[#f5efe3]",
  pass: "text-lime",
  fail: "text-[#ff8a5c]",
  warn: "text-[#ffd35c]",
  muted: "text-[#a59e90]",
  plain: "text-[#e6dfd1]",
  accent: "text-[#9fb0ff]",
};

export const accentBg: Record<Accent, string> = {
  blue: "bg-blue",
  orange: "bg-orange",
  lime: "bg-lime",
};

export function Terminal({
  title,
  lines,
  className = "",
}: {
  title: string;
  lines: TerminalLine[];
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl border-2 border-ink bg-term text-left shadow-sticker ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-orange" />
        <span className="size-2.5 rounded-full bg-lime" />
        <span className="size-2.5 rounded-full bg-[#f5efe3]/40" />
        <figcaption className="ml-2 truncate font-mono text-[11px] text-[#a59e90]">{title}</figcaption>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[11.5px] leading-[1.75] sm:text-[12.5px]">
        <code>
          {lines.map((l, i) => (
            <span key={i} className={`block whitespace-pre ${toneClass[l.tone ?? "plain"]}`}>
              {l.text || " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function BrowserFrame({ children, url }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-sticker">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-sand px-3 py-2">
        <span className="size-2.5 rounded-full border border-ink bg-orange" />
        <span className="size-2.5 rounded-full border border-ink bg-lime" />
        <span className="size-2.5 rounded-full border border-ink bg-paper" />
        {url ? (
          <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-paper px-3 py-0.5 font-mono text-[10px] text-ink-mute">
            {url.replace(/^https?:\/\//, "")}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** EchoBharat: phone → text over a Bluetooth mesh → phone. Mirrors the README diagram. */
function MeshIllustration() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-4 shadow-sticker sm:p-6">
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />
      <svg viewBox="0 0 420 220" className="relative w-full" role="img" aria-labelledby="mesh-title">
        <title id="mesh-title">
          One phone turns speech into text, a couple of hundred bytes hop across other phones over Bluetooth LE, and the
          receiving phone speaks it aloud in another language.
        </title>
        {/* phone A */}
        <g>
          <rect x="14" y="40" width="78" height="142" rx="14" fill="#fbf8f2" stroke="#15130f" strokeWidth="3" />
          <rect x="24" y="56" width="58" height="96" rx="6" fill="#ff6b2c" stroke="#15130f" strokeWidth="2" />
          <text x="53" y="98" textAnchor="middle" fontSize="20" fill="#15130f" fontWeight="700">हिं</text>
          <path d="M40 116h26M44 126h18" stroke="#15130f" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="53" cy="166" r="6" fill="none" stroke="#15130f" strokeWidth="2" />
        </g>
        {/* relays */}
        {[
          [150, 70],
          [210, 150],
          [270, 70],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 16} y={y - 24} width="32" height="48" rx="7" fill="#fbf8f2" stroke="#15130f" strokeWidth="2.4" />
            <circle cx={x} cy={y} r="22" fill="none" stroke="#2f4bff" strokeWidth="1.6" strokeDasharray="3 5" />
          </g>
        ))}
        <path d="M94 100 C120 80 126 72 134 70M166 74 C186 100 196 130 194 146M226 146 C240 120 250 90 254 74M286 70 C300 80 316 92 326 100" fill="none" stroke="#15130f" strokeWidth="2.4" strokeDasharray="6 6" strokeLinecap="round" />
        {/* packet */}
        <g>
          <rect x="130" y="6" width="160" height="28" rx="14" fill="#c8f03c" stroke="#15130f" strokeWidth="2.4" />
          <text x="210" y="25" textAnchor="middle" fontSize="11" fill="#15130f" fontFamily="ui-monospace, monospace">text + lang · ~200 B</text>
        </g>
        {/* phone B */}
        <g>
          <rect x="328" y="40" width="78" height="142" rx="14" fill="#fbf8f2" stroke="#15130f" strokeWidth="3" />
          <rect x="338" y="56" width="58" height="96" rx="6" fill="#2f4bff" stroke="#15130f" strokeWidth="2" />
          <text x="367" y="98" textAnchor="middle" fontSize="20" fill="#fbf8f2" fontWeight="700">বাং</text>
          <path d="M352 118c6-6 6-14 0-20M360 124c10-10 10-26 0-36" fill="none" stroke="#fbf8f2" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="367" cy="166" r="6" fill="none" stroke="#15130f" strokeWidth="2" />
        </g>
        <text x="53" y="204" textAnchor="middle" fontSize="11" fill="#4b463e" fontFamily="ui-monospace, monospace">speech → text</text>
        <text x="367" y="204" textAnchor="middle" fontSize="11" fill="#4b463e" fontFamily="ui-monospace, monospace">text → speech</text>
        <text x="210" y="206" textAnchor="middle" fontSize="11" fill="#4b463e" fontFamily="ui-monospace, monospace">Bluetooth LE mesh</text>
      </svg>
    </div>
  );
}

export function ProjectPreview({
  preview,
  url,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  preview: Preview;
  url?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (preview.kind === "terminal") {
    return <Terminal title={preview.title} lines={preview.lines} className={className} />;
  }
  if (preview.kind === "mesh") {
    return (
      <div className={className}>
        <MeshIllustration />
      </div>
    );
  }
  const img = (
    <Image
      src={preview.src}
      alt={preview.alt}
      width={preview.width}
      height={preview.height}
      sizes={sizes}
      preload={priority}
      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
  if (preview.frame === "browser") {
    return (
      <div className={className}>
        <BrowserFrame url={url}>
          <div className="overflow-hidden">{img}</div>
        </BrowserFrame>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden rounded-2xl border-2 border-ink shadow-sticker ${className}`}>{img}</div>
  );
}
