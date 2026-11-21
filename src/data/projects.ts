/**
 * Project catalog.
 *
 * Every description, feature and technology below was taken from the
 * repository itself (README, manifests, language stats) at
 * github.com/raunaksahahere. Live links are only listed where the deployment
 * answered with HTTP 200 when this catalog was written.
 *
 * To change what appears in "Selected work", edit `featuredOrder` at the
 * bottom of this file. Any project can be featured; featured projects get a
 * case-study page at /projects/[slug].
 */

export type Accent = "blue" | "orange" | "lime";

export type Category =
  | "Developer tools"
  | "AI & ML infrastructure"
  | "Fintech & security"
  | "Applied AI"
  | "Mobile & offline"
  | "Language design"
  | "Web apps"
  | "Games & experiments";

/** How a project is previewed. Images are real screenshots or repo assets. */
export type Preview =
  | { kind: "image"; src: string; alt: string; width: number; height: number; frame?: "browser" | "plain" }
  | { kind: "terminal"; title: string; lines: TerminalLine[] }
  | { kind: "mesh" };

export type TerminalLine = {
  text: string;
  tone?: "cmd" | "pass" | "fail" | "warn" | "muted" | "plain" | "accent";
};

export type Project = {
  slug: string;
  name: string;
  category: Category;
  /** One line. Shown everywhere. */
  tagline: string;
  /** Two or three sentences. */
  summary: string;
  /** The problem, in plain language. */
  problem?: string;
  /** Verified features. */
  features?: string[];
  stack: string[];
  repo: string;
  live?: string;
  youtubeShortId?: string;
  /** Extra verified links (demo video, docs). */
  links?: { label: string; href: string }[];
  /** Status as stated by the repository. */
  status: string;
  accent: Accent;
  preview?: Preview;
  /** Optional second preview, shown on the case-study page. */
  gallery?: Preview[];
  /** Case-study notes: how it works and the decisions behind it. */
  howItWorks?: string[];
  decisions?: { title: string; body: string }[];
  /** Evidence quoted from the README, e.g. test counts. */
  evidence?: string[];
};

const gh = (repo: string) => `https://github.com/raunaksahahere/${repo}`;

export const youtubeShortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;

export const projects: Project[] = [
  {
    slug: "codemeet",
    name: "CodeMeet",
    youtubeShortId: "m-Mwb8jSyVA",
    category: "Developer tools",
    tagline: "Pair-program with your team and your AI agents, in VS Code or the terminal.",
    summary:
      "Self-hosted collaborative coding for teams and their Claude and Codex agents. Code syncs live across VS Code and the terminal, AI changes arrive as reviewable diffs, and everything durable lives in your own PostgreSQL.",
    problem:
      "Live-share tools show an anonymous “AI edit” or nothing at all. When several people each bring an agent into the same project, you need to know which agent changed what, for whom, and to approve it before it lands.",
    features: [
      "Humans and agents as first-class identities: teammates see “Sam” and “Sam's Claude”, bound by the server so nobody can impersonate another person's agent.",
      "Agents work in an isolated snapshot and publish a diff proposal. Only the host or the agent's owner can approve; approval applies exactly once and stale proposals are refused.",
      "Agent-to-agent chat is off until both owners consent: mutual, scoped, expiring and revocable, enforced server-side.",
      "One authoritative Yjs document per file, so concurrent edits, late joiners and reconnects converge without duplicated text.",
      "VS Code extension and standalone CLI speak the same protocol and can share a room.",
      "Secrets (.env, keys, .git, node_modules) are never shared; path traversal and symlink escapes are blocked; conflicting files are backed up, never overwritten.",
    ],
    stack: ["TypeScript", "Node.js", "Socket.IO", "Yjs", "PostgreSQL", "VS Code API", "Docker"],
    repo: gh("codemeet"),
    links: [
      { label: "Watch the demo", href: "https://github.com/raunaksahahere/codemeet/blob/main/docs/media/codemeet-demo.mp4" },
    ],
    status: "v0.1.0 · install from source",
    accent: "blue",
    preview: {
      kind: "image",
      src: "/projects/codemeet.webp",
      alt: "Two VS Code windows, one for Ava and one for Sam, showing the same total.js file kept in sync by CodeMeet.",
      width: 720,
      height: 900,
      frame: "plain",
    },
    howItWorks: [
      "Each participant runs the VS Code extension or the CLI daemon. Both connect to a CodeMeet server that one person on the team runs, backed by Neon, Supabase or local Postgres.",
      "The server keeps one Yjs CRDT document per file. Local changes are detected by comparing content rather than timers, so a file CodeMeet just wrote never echoes back.",
      "When an agent runs, it works on a snapshot of the project and publishes a proposal. The owner reviews the diff; approval applies it once, and a proposal built on stale code is rejected rather than overwriting newer work.",
    ],
    decisions: [
      { title: "Bring your own database", body: "Nothing runs on a CodeMeet cloud. The database URL never leaves the server owner's machine, and each person's Claude or Codex stays logged in on their own laptop." },
      { title: "Consent as a server rule", body: "Agent-to-agent messaging needs both owners' consent. Revoking it cancels queued messages and kills an in-flight reply, not just future ones." },
    ],
  },
  {
    slug: "detloop",
    name: "Detloop",
    youtubeShortId: "8ugFwQOOrQQ",
    category: "Developer tools",
    tagline: "Find timing bugs in Python asyncio services and replay a failing run from its seed.",
    summary:
      "Detloop runs asyncio tests with a virtual clock, seeded scheduling and a simulated network. It records the decisions behind a failure so you can replay the run, reduce the fault sequence and inspect the events in an offline report.",
    problem:
      "Distributed asyncio tests can pass hundreds of times before a delayed message or a node crash exposes a race. Finding the bug is only half the job. To diagnose it, you need to recreate the order of events that caused it.",
    features: [
      "Explore a range of seeds from pytest or the CLI, with simulated message delays, network partitions and node crashes.",
      "Check invariants during a run and detect inconsistencies such as stale reads with a bounded linearizability checker.",
      "Replay a saved failure, shrink the fault sequence and open a self-contained HTML report with node timelines and operation history.",
    ],
    stack: ["Python", "asyncio", "pytest"],
    repo: gh("detloop"),
    links: [
      { label: "Install from PyPI", href: "https://pypi.org/project/detloop/" },
      { label: "Read the benchmarks", href: `${gh("detloop")}/blob/main/docs/BENCHMARKS.md` },
    ],
    status: "Alpha",
    accent: "lime",
    preview: {
      kind: "image",
      src: "/projects/detloop.webp",
      alt: "Detloop's lost-ack report shows the node crash, a one-way network partition and the operation history that failed the linearizability check.",
      width: 1300,
      height: 1180,
      frame: "browser",
    },
    howItWorks: [
      "A custom asyncio event loop runs standard tasks, futures and streams. When no callbacks are runnable, the virtual clock jumps to the next timer.",
      "Each simulated node keeps asyncio's callback order. Seeded decisions choose which node runs next and control network timing, workload randomness and faults.",
      "A failing run writes a trace and a replay manifest. Exact replay checks the recorded decisions for divergence. The shrinker reruns candidates and keeps a simpler sequence when it preserves the failure signature.",
    ],
    decisions: [
      { title: "Keep real I/O outside the simulation", body: "Detloop rejects documented sources of nondeterminism such as real sockets, threads and TLS. Replay depends on the code, configuration and Python minor version." },
      { title: "Give incomplete runs their own outcome", body: "A run that hits a budget or exceeds the checker's search limit is marked incomplete, so CI can distinguish it from a passing run." },
    ],
    evidence: [
      "In the bundled Raft-style KV demo on CPython 3.12, a planted split-brain bug failed on 16 of 300 seeds. Seed 17 replayed with an identical trace, and the corrected implementation passed all 300 seeds.",
      "The shrinker reduced the demo's lost-ack failure from three scheduled faults to one while preserving its failure signature.",
    ],
  },
  {
    slug: "kavach-pay",
    name: "Kavach Pay",
    category: "Fintech & security",
    tagline: "A UPI-style payment app with a fraud shield that speaks up before money leaves.",
    summary:
      "A simulated UPI payment app where every payment and collect request passes through a deterministic risk engine first. When something looks wrong, the user gets a risk score and a plain-language reason in English, Hindi or Bengali.",
    problem:
      "Scammers dress up collect requests as refunds, cashback or prizes, so people approve payments that send money out of their account. The warning has to arrive in the ten seconds before the PIN is entered, in the user's own language.",
    features: [
      "Pay to a UPI ID, request money, and approve or decline collect requests, with balance and history.",
      "Risk sheet with three outcomes: allow (PIN only), warn (reasons shown, type the amount to continue) and hold (30-minute cooling period).",
      "Eight rules, from direction mismatch and young payees to mule fan-in and pass-through, scored 0–100 from a single config file.",
      "“Check a message”: paste an SMS or WhatsApp text, or attach a screenshot, and see what it really asks you to do.",
      "Analyst dashboard with rule traces, a mule-ring network graph, a hash-chained audit log and an AI copilot limited to read-only tools.",
      "Double-entry ledger with idempotency keys, a payment state machine, row locking and a CHECK constraint against negative balances.",
    ],
    stack: ["Next.js", "TypeScript", "Hono", "PostgreSQL", "Drizzle", "Gemini API", "Clerk", "Zod", "Vitest", "Playwright"],
    repo: gh("kavachPay"),
    live: "https://kavach-pay-pi.vercel.app",
    status: "Hackathon prototype · HackMatrix, fintech track",
    accent: "orange",
    preview: {
      kind: "image",
      src: "/projects/kavachpay.webp",
      alt: "Kavach Pay landing page: “The moment before money leaves. That is where we stop the scam.” with a shield illustration.",
      width: 1440,
      height: 900,
      frame: "browser",
    },
    howItWorks: [
      "A payment moves through initiated → risk_checked → held or confirmed → settled. Illegal transitions throw.",
      "Rules R1–R7 compute facts from SQL and memory; R8 adds a capped number of points for validated Gemini scam signals.",
      "Gemini reads messages and screenshots and rewrites fired rules as a warning in the user's language. Deterministic code decides every ledger entry, balance and final verdict.",
    ],
    decisions: [
      { title: "The AI decision boundary", body: "The model extracts fields and writes explanations; fixed tables turn those into points. A generated warning is only shown if every number in it appears in the rule facts, otherwise a built-in template is used." },
      { title: "Money that can't drift", body: "A deferred database trigger rejects any transaction whose entries don't sum to zero, and ledger rows can't be updated or deleted." },
    ],
    evidence: ["114 unit, integration and in-process API tests", "Simulated payment rail; all users and payments are synthetic"],
  },
  {
    slug: "parity",
    name: "Parity",
    youtubeShortId: "OOgO_8i89uo",
    category: "AI & ML infrastructure",
    tagline: "Statistical testing for LLM endpoints: is the server really running those weights?",
    summary:
      "Parity sends cheap probes to an OpenAI-compatible endpoint, runs the same inputs through a pinned reference implementation of the same open-weight model, and uses statistics to decide whether the two differ by more than benign numerical noise.",
    problem:
      "Quantized weights, a broken chat template, ignored sampling parameters and silently truncated prompts all still produce fluent text. You can't catch them by reading outputs.",
    features: [
      "Six probes, cheapest first: chat template, teacher-forced distribution, greedy agreement, sampler conformance, long-context needle and structured tool calls.",
      "Three verdicts only: PASS, DEVIATION or INCONCLUSIVE, with exit codes 0, 1 and 2 for CI.",
      "Calibration against known-good deployments that differ in harmless ways, so honest changes aren't flagged.",
      "Every report lists what the result does not prove.",
      "Faults injected into a real llama.cpp deployment (Q8_0, Q4_K_M and Q2_K weights, wrong templates, dropped sampling parameters, smaller context) were detected in every repetition of the validation study.",
    ],
    stack: ["Python", "PyTorch", "Transformers", "NumPy", "SciPy", "DuckDB", "Typer", "llama.cpp"],
    repo: gh("parity"),
    links: [{ label: "Watch the 30-second intro", href: "https://github.com/raunaksahahere/parity/blob/main/docs/assets/parity-intro.mp4" }],
    status: "Install from a checkout",
    accent: "lime",
    preview: {
      kind: "terminal",
      title: "parity run — Qwen3-0.6B",
      lines: [
        { text: "$ parity run --model Qwen/Qwen3-0.6B --target http://127.0.0.1:8081", tone: "cmd" },
        { text: "Running suite 'core' (reference hf:local)", tone: "muted" },
        { text: "  template.token_counts        PASS", tone: "pass" },
        { text: "  distribution.teacher_forced  PASS", tone: "pass" },
        { text: "  greedy.agreement             PASS", tone: "pass" },
        { text: "  sampler.conformance          PASS", tone: "pass" },
        { text: "  longctx.needle               PASS", tone: "pass" },
        { text: "  tools.structured             PASS", tone: "pass" },
        { text: "Verdict: PASS. No deviation from the reference was detected.", tone: "accent" },
      ],
    },
    gallery: [
      {
        kind: "image",
        src: "/projects/parity.webp",
        alt: "Frame from the Parity intro: reference and endpoint next-token probability bars compared on the same input.",
        width: 420,
        height: 525,
        frame: "plain",
      },
    ],
    howItWorks: [
      "Probes send token-id prompts where the server accepts them, so the endpoint and the reference see exactly the same tokens.",
      "Evidence is judged with calibrated thresholds, sequential tests (SPRT), bootstrap confidence intervals and Holm–Bonferroni correction.",
      "With --fail-fast, a DEVIATION can be reached after as few as seven requests.",
    ],
    decisions: [
      { title: "Never guess", body: "When evidence is thin, Parity says INCONCLUSIVE instead of picking a side. A verdict is evidence, not a certificate." },
    ],
  },
  {
    slug: "plantwin",
    name: "PlanTwin",
    category: "Developer tools",
    tagline: "Catch PostgreSQL query-plan regressions in pull requests, with no production rows.",
    summary:
      "PlanTwin loads production planner statistics into an empty PostgreSQL 18 database in CI, compares the plans before and after a migration or query change, and reports what shifted.",
    problem:
      "A migration can pass every test and still turn an index scan into a sequential scan in production, because CI databases are empty and the planner chooses differently there.",
    features: [
      "Exports the statistics the planner uses from a read replica with a role that cannot read table rows, into a redacted, ed25519-signed bundle.",
      "Builds base and head “twins” from your migrations plus the imported stats, then diffs canonical plan shapes.",
      "Detects the migration tool: plain SQL, Flyway, Django, Rails, Prisma, Alembic or Atlas.",
      "Reports as a Markdown PR comment, JSON with a schema version, or SARIF 2.1.0 for code scanning.",
      "plantwin accept records intentional changes; plantwin doctor checks Docker, the bundle, its signature and its age.",
    ],
    stack: ["Go", "PostgreSQL 18", "C", "Docker", "SARIF"],
    repo: gh("planTwin"),
    links: [{ label: "Releases", href: "https://github.com/raunaksahahere/planTwin/releases" }],
    status: "v1.0.0 released",
    accent: "blue",
    preview: {
      kind: "terminal",
      title: "plantwin demo",
      lines: [
        { text: "$ ./bin/plantwin demo", tone: "cmd" },
        { text: "## PlanTwin: HEAD~1 → HEAD", tone: "plain" },
        { text: "Result: failing. 1 error(s), 0 warning(s), 1 info.", tone: "fail" },
        { text: "### customer_lookup", tone: "plain" },
        { text: "ERROR lost_index (estimated)", tone: "fail" },
        { text: "Index use lost on orders: the table is now read", tone: "muted" },
        { text: "by a sequential scan (about 500K rows).", tone: "muted" },
        { text: "Fix: recreate the index, or run `plantwin accept`.", tone: "accent" },
      ],
    },
    howItWorks: [
      "Export runs in a read-only session with server-side timeouts and writes a signed statistics bundle.",
      "Each twin is a throwaway PostgreSQL 18 container; a small extension loaded only in CI makes the planner use the imported table sizes.",
      "Every query in a catalog is explained on both twins, reduced to its shape (operators, relations, indexes, join order) and diffed against documented thresholds.",
    ],
    decisions: [
      { title: "A compatibility promise", body: "From 1.0.0, CLI flags, exit codes, config keys and the JSON report's schema_version 1 stay compatible within 1.x." },
      { title: "Typos are errors", body: "Unknown keys in plantwin.yaml fail with the line number, so a misspelled option can't be silently ignored." },
    ],
    evidence: ["On a clean GitHub-hosted runner, the quick start produces a first report in 65 seconds (per the repo's verification notes)"],
  },
  {
    slug: "cfgcanary",
    name: "cfgcanary",
    youtubeShortId: "1szqd9I5GS0",
    category: "Developer tools",
    tagline: "Progressive delivery for configuration: validate, canary, promote and roll back config like code.",
    summary:
      "Every config version is validated (including by the consumer's own parser, sandboxed), signed and delivered ring by ring. A Prometheus health gate compares each ring with instances that didn't get the change, then promotes, halts or rolls back.",
    problem:
      "Code goes through canaries; runtime configuration often doesn't. A generated feature file or policy document is published and the whole fleet reads it within seconds, so a bad file breaks everything at once.",
    features: [
      "Validation before delivery: byte and item limits, relative-change guards, strict JSON, JSON Schema, CUE, and the consumer's parser compiled to WASM and run in a wazero sandbox.",
      "Ring-by-ring rollout with a holdout control cohort.",
      "Three gate verdicts: PASS promotes, FAIL rolls back, INCONCLUSIVE keeps baking and halts. Unknown evidence never promotes.",
      "Agents apply updates atomically; the Go SDK keeps applications on their last-known-good config when anything goes wrong.",
      "Compose demo with 50 simulated instances running the real agent and SDK.",
    ],
    stack: ["Go", "Prometheus", "WebAssembly", "wazero", "CUE", "PostgreSQL", "Docker Compose"],
    repo: gh("cfgcanary"),
    status: "Active",
    accent: "orange",
    preview: {
      kind: "terminal",
      title: "cfgcanary demo",
      lines: [
        { text: "$ docker compose run --rm cli demo", tone: "cmd" },
        { text: "bad-oversized.json      rejected [limits/too_large]", tone: "fail" },
        { text: "bad-doubled.json        rejected [relative/size_grew] x2.42", tone: "fail" },
        { text: "bad-blank-service.json  rejected [schema/minLength]", tone: "fail" },
        { text: "v3-harmful-timeout.json → v3 (validation passed)", tone: "plain" },
        { text: "BAKING      ring=0 accepted=8/8", tone: "warn" },
        { text: "ROLLED_BACK ring=0 gate=FAIL(look 1)", tone: "fail" },
        { text: "blast radius: 8 of 50 instances", tone: "accent" },
        { text: "detect 20.6s · roll back 200ms", tone: "accent" },
      ],
    },
    howItWorks: [
      "A submission passes schema, CUE, limits, relative-change and WASM-parser checks; anything rejected reaches no instance.",
      "Ring 0 is the canary. The gate compares it to a control cohort with a non-inferiority test and decides at declared looks.",
      "On FAIL, a new generation pointing at the previous version is rolled out and confirmed per instance.",
    ],
    decisions: [
      { title: "Time is not evidence", body: "An INCONCLUSIVE gate halts after its last look. A release is never promoted just because nothing went wrong for long enough." },
    ],
    evidence: ["Demo numbers are from a real laptop run in the README: 50 simulated instances, 40 synthetic requests per second each"],
  },
  {
    slug: "web-threat-detection",
    name: "Web Threat Detection",
    category: "Fintech & security",
    tagline: "Paste a suspicious link, message, raw e-mail or QR code. Get evidence, not vibes.",
    summary:
      "An evidence-based risk assessment for links, messages, e-mails and QR codes. Every finding carries its source and limits, the AI explanation is grounded in those findings, and report integrity can be anchored on-chain and verified independently.",
    problem:
      "Phishing checks usually return a score with no reasons. People need to know what was checked, what was found, and what the result does not prove.",
    features: [
      "URL and domain investigation in an isolated, SSRF-safe inspector: homographs, typosquats, brand-in-domain, credential forms posting elsewhere.",
      "TLS analysis: independent path verification, expiry, weak crypto, Certificate Transparency and distrust lists.",
      "Message and raw e-mail analysis: SPF, DKIM, DMARC, look-alike senders, disguised links and risky attachments (never opened).",
      "QR codes decoded locally; upi://pay codes presented as “scan to receive money” are flagged.",
      "AI explanations with cited findings, validated in code, falling back from Gemini to OpenRouter to a local Ollama model.",
      "Threat-report registry in Solidity with an independent Node verifier that recomputes the commitment.",
    ],
    stack: ["Python", "FastAPI", "React", "Vite", "Solidity", "Foundry", "viem", "Gemini API", "Docker"],
    repo: gh("webThreatDetection"),
    live: "https://web-threat-detection-delta.vercel.app",
    status: "Hackathon prototype · AI, cybersecurity, Web3",
    accent: "lime",
    preview: {
      kind: "image",
      src: "/projects/wtd-verdict.webp",
      alt: "Web Threat Detection report showing a HIGH RISK verdict for a fake bank KYC message, with cited indicators and next steps.",
      width: 1366,
      height: 900,
      frame: "browser",
    },
    gallery: [
      {
        kind: "image",
        src: "/projects/wtd-investigate.webp",
        alt: "Web Threat Detection investigate screen with inputs for links, messages, e-mails and QR codes.",
        width: 1366,
        height: 900,
        frame: "browser",
      },
    ],
    howItWorks: [
      "A submission runs through submit → investigate → analyse → assess risk → report and verify.",
      "Classification uses five classes and auditable rules, lists contradictions, and reports coverage counts.",
      "Only a salted commitment hash, a classification code and a note hash go on-chain; a match proves a report is unchanged, not that it is true.",
    ],
    decisions: [
      { title: "Low risk is not safe", body: "The app states plainly that automated checks cannot prove a site is safe; “Low Risk” means no significant indicator in the checks listed." },
    ],
    evidence: ["251 backend tests and 22 contract tests, per the README"],
  },
  {
    slug: "loopsatellite",
    name: "LoopSatellite",
    category: "Applied AI",
    tagline: "Every wetland pond shrinks in April. Only some of them were filled in.",
    summary:
      "Satellite-based monitoring of the East Kolkata Wetlands that tells seasonal shrinkage apart from encroachment, then builds an evidence-backed case an officer can act on. Built with team Loop Errors.",
    problem:
      "The East Kolkata Wetlands are 125 km² of Ramsar-protected water bodies being encroached, with no reliable, current, reproducible measurement of how much water surface is left.",
    features: [
      "Deterministic detection: MNDWI water thresholding, STL seasonal decomposition and Seasonal-Hybrid ESD anomaly flags.",
      "“Ask about an area” answers in milliseconds from precomputed results; “Monitor a new area” is a separate, honest slow path through Earth Engine.",
      "A language model only corroborates, explains and drafts around findings statistics already made.",
      "Map console with flagged ponds, before/after chips and time series.",
    ],
    stack: ["Python", "FastAPI", "Google Earth Engine", "React", "Vite", "MapLibre", "Recharts", "PostgreSQL"],
    repo: gh("LoopSatellite"),
    live: "https://loop-satellite.vercel.app",
    status: "Team project · Loop Errors",
    accent: "blue",
    preview: {
      kind: "image",
      src: "/projects/loopsatellite.webp",
      alt: "LoopSatellite landing page with a chart of a pond's observed water area falling below its expected seasonal curve.",
      width: 1440,
      height: 900,
      frame: "browser",
    },
    decisions: [
      { title: "Statistics detects. The LLM builds the case.", body: "No model call appears anywhere in the detection path, and a test walks the import graph and fails the build if that line is ever crossed." },
    ],
  },
  {
    slug: "echobharat",
    name: "EchoBharat",
    category: "Mobile & offline",
    tagline: "Speak in your language. Be heard in theirs. No network required.",
    summary:
      "A fully offline, multilingual voice transceiver for Android. Speech becomes text on one phone, only the text crosses a Bluetooth LE mesh, and the listening phone speaks it aloud in its reader's language.",
    problem:
      "When a flood takes out the towers, phones stop being useful for talking to people. Radios need extra hardware and don't translate Marathi for a Tamil speaker.",
    features: [
      "On-device speech recognition, translation and synthesis with ONNX Runtime: no internet, no servers, no accounts.",
      "Sends text plus a language tag, a couple of hundred bytes per sentence instead of tens of kilobytes of audio.",
      "Ten Indian languages, multi-select, switchable mid-conversation.",
      "Bluetooth LE mesh relayed phone to phone, with distress calls and an alert mode.",
      "Voice packs provisioned without internet, identified by SHA-256.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "ONNX Runtime", "IndicTrans2", "IndicConformer", "Bluetooth LE"],
    repo: gh("EchoBharat"),
    status: "1.4.1 snapshot · security hardening in progress",
    accent: "orange",
    preview: { kind: "mesh" },
  },
  {
    slug: "bsharp",
    name: "B#",
    category: "Language design",
    tagline: "A human-centric programming language written in plain English.",
    summary:
      "B# compiles plain-English source to bytecode and runs it on its own virtual machine, with a CLI for running, tracing, linting, testing and disassembling programs, plus VS Code tooling.",
    problem:
      "First-time programmers fight syntax before they get to think about logic. B# reads like a sentence: let x be 5, say \"Hello\", for each n from 1 to 10.",
    features: [
      "Compiler from .bsharp source to .bsc bytecode, cached next to the source and reused when unchanged.",
      "Virtual machine with step-by-step --trace and --disasm output.",
      "Typed variables, conditionals, loops, functions and standard libraries such as math, string and window.",
      "Linter for errors and bad patterns, and a built-in test runner.",
      "VS Code extension.",
    ],
    stack: ["Python", "Bytecode VM", "Compilers", "VS Code extension"],
    repo: gh("Bsharp-b-"),
    links: [{ label: "Language tour", href: "https://github.com/raunaksahahere/Bsharp-b-/blob/main/docs/languagetour.md" }],
    status: "v1.2.1",
    accent: "lime",
    preview: {
      kind: "terminal",
      title: "hello.bsharp",
      lines: [
        { text: "use math", tone: "accent" },
        { text: "use string", tone: "accent" },
        { text: "", tone: "plain" },
        { text: "let msg be \"hello world\"", tone: "plain" },
        { text: "say call string.upper with msg", tone: "plain" },
        { text: "say call math.sqrt with 25", tone: "plain" },
        { text: "", tone: "plain" },
        { text: "$ bsharp build hello.bsharp --disasm", tone: "cmd" },
      ],
    },
  },

  /* ---------------------------------------------------------------- archive */
  {
    slug: "xbrl-studio",
    name: "AI XBRL Studio",
    category: "Applied AI",
    tagline: "Upload a company's financial statements, get back a validated XBRL filing.",
    summary:
      "Generates MCA/XBRL filings from financial statements through a seven-stage pipeline. A React SPA and a long-lived Python worker talk only through Supabase; stages are resumable and XML serialisation is deterministic, not generated.",
    problem: "Preparing statutory XBRL filings by hand is slow and error-prone.",
    features: [
      "Seven-stage pipeline: extract text, extract figures, map taxonomy, validate, generate XML, validate XML, report.",
      "Jobs claimed with FOR UPDATE SKIP LOCKED and recovered by lease expiry.",
    ],
    stack: ["React", "Vite", "Python", "FastAPI", "Supabase", "OpenRouter", "Fly.io"],
    repo: gh("xblr-studio"),
    status: "Active",
    accent: "blue",
  },
  {
    slug: "your-manager",
    name: "Your Manager",
    category: "Mobile & offline",
    tagline: "One app for everything: passwords, GitHub, expenses and browser tabs.",
    summary:
      "A privacy-first productivity hub for Windows and Android with an AES-256 encrypted local vault, a GitHub dashboard, an expense tracker and a live view of desktop browser tabs over a localhost bridge.",
    problem: "Developers juggle four separate apps for things they check every day.",
    features: ["Local encrypted vault with biometrics", "GitHub PRs and repos at a glance", "Tab sync over localhost only"],
    stack: ["TypeScript", "React Native", "Expo", "SQLite"],
    repo: gh("yourmanager"),
    status: "Active",
    accent: "orange",
  },
  {
    slug: "rogue-signal",
    name: "Rogue Signal",
    category: "Games & experiments",
    tagline: "First-person social deduction for 4–10 players. Trust is a vulnerability.",
    summary:
      "A crew of developers is sent underground to bring a server back online, and one of them works for the other side. Hands-on 3D repair tasks, proximity voice chat, roles with evidence, LAN and bots. The public repo hosts the Windows installer.",
    stack: ["Windows", "Multiplayer", "Proximity voice"],
    repo: gh("roguesignal-releases"),
    links: [{ label: "Download for Windows", href: "https://github.com/raunaksahahere/roguesignal-releases/releases/latest" }],
    status: "Installer releases",
    accent: "lime",
  },
  {
    slug: "codelens",
    name: "CodeLens",
    category: "Language design",
    tagline: "See what happens between writing code and seeing output.",
    summary:
      "A beginner-friendly learning tool that walks source code through tokens, abstract syntax tree, bytecode or native compilation, execution and output, comparing Python, Java, C and C++.",
    stack: ["React", "Vite", "JavaScript"],
    repo: gh("codelens"),
    status: "Learning tool",
    accent: "blue",
  },
  {
    slug: "chess",
    name: "Real-time Chess",
    category: "Web apps",
    tagline: "Multiplayer chess with private rooms, matchmaking and one very secret helper.",
    summary:
      "Private rooms with shareable six-character codes, random matchmaking, auto-forfeit after 30 seconds of disconnect, and a hidden Stockfish hint panel that only appears for one particular player name. It's a prank.",
    stack: ["React", "Vite", "Node.js", "Express", "Socket.IO"],
    repo: gh("chess-app"),
    status: "Side project",
    accent: "orange",
  },
  {
    slug: "virtual-valley",
    name: "Virtual Valley",
    category: "Web apps",
    tagline: "Marketing site for a studio that builds digital presence for growing brands.",
    summary: "The website for Virtual Valley: services, website plans, reviews, a brochure download and call booking.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    repo: gh("virtualValley"),
    live: "https://thevirtualvalley.com",
    status: "Live",
    accent: "blue",
    preview: {
      kind: "image",
      src: "/projects/virtualvalley.webp",
      alt: "Virtual Valley homepage hero reading “We build, you dominate”.",
      width: 1440,
      height: 900,
      frame: "browser",
    },
  },
  {
    slug: "draw-with-words",
    name: "Draw With Words",
    category: "Web apps",
    tagline: "Type a word, get a simple reference drawing, then draw and colour it yourself.",
    summary:
      "A gentle drawing website for kids inspired by MS Paint: a word-to-drawing reference generated with pure canvas logic, a paint canvas, a fill tool and a small kid-friendly palette. No backend, no APIs.",
    stack: ["JavaScript", "Canvas API", "HTML", "CSS"],
    repo: gh("DrawGuideForKids"),
    live: "https://drawguide.netlify.app",
    status: "Live",
    accent: "lime",
  },
  {
    slug: "skillgraph",
    name: "SkillGraph",
    category: "Applied AI",
    tagline: "Skill-gap analysis that models skills as a directed graph.",
    summary:
      "Tracks progress across a directed graph of skills and uses an LLM to summarise gaps and explain a personalised learning path.",
    stack: ["Python", "JavaScript", "SQLite", "OpenAI API"],
    repo: gh("SkillsGraph"),
    status: "Prototype",
    accent: "orange",
  },
  {
    slug: "auric-billing",
    name: "Auric Billing",
    category: "Web apps",
    tagline: "A SaaS billing starter with a live-preview invoice builder and PDF export.",
    summary:
      "Invoice builder with GST maths, discounts, template switching and PDF export, plus customers, products, analytics and a protected dashboard.",
    stack: ["Next.js", "TypeScript", "Clerk", "Supabase", "Recharts", "jsPDF"],
    repo: gh("billing-site"),
    status: "Starter",
    accent: "blue",
  },
  {
    slug: "kisansarthi",
    name: "KisanSarthi",
    category: "Web apps",
    tagline: "A responsive landing page refactored into a modular React app.",
    summary: "Language context, toasts and scroll animations in a component-based React and Vite codebase.",
    stack: ["React", "Vite", "Framer Motion"],
    repo: gh("KisanSarhi"),
    status: "Side project",
    accent: "lime",
  },
  {
    slug: "pandaos",
    name: "PandaOS",
    category: "Games & experiments",
    tagline: "A custom Linux distribution: Windows workflow, macOS aesthetics.",
    summary: "An automated build system that produces a bootable PandaOS ISO from an Ubuntu or Debian host. Still in development.",
    stack: ["Shell", "Linux"],
    repo: gh("pandaos"),
    status: "In development",
    accent: "orange",
  },
];

/**
 * Manually curated "Selected work", in display order.
 * The home page lays these out in an editorial sequence:
 *   [0..2] alternating spreads, [3..5] terminal trio,
 *   [6..7] side-by-side duo, [8..] compact rows.
 */
export const featuredOrder = [
  "codemeet",
  "detloop",
  "kavach-pay",
  "parity",
  "plantwin",
  "cfgcanary",
  "web-threat-detection",
  "loopsatellite",
  "echobharat",
  "bsharp",
] as const;

export const featuredProjects = featuredOrder
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => Boolean(p));

export const archiveProjects = projects.filter(
  (p) => !(featuredOrder as readonly string[]).includes(p.slug),
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function isFeatured(slug: string) {
  return (featuredOrder as readonly string[]).includes(slug);
}
