/**
 * Technologies found in Raunak's public repositories (READMEs, manifests and
 * GitHub language statistics). `usedIn` names the projects where each one
 * actually appears, so the toolbox doubles as an index into the work.
 */
export type Tool = { name: string; usedIn: string[] };
export type ToolGroup = { id: string; label: string; blurb: string; tools: Tool[] };

export const toolbox: ToolGroup[] = [
  {
    id: "languages",
    label: "Languages",
    blurb: "What the repos are actually written in.",
    tools: [
      { name: "TypeScript", usedIn: ["CodeMeet", "Kavach Pay", "AI XBRL Studio", "Your Manager"] },
      { name: "Python", usedIn: ["Parity", "Web Threat Detection", "LoopSatellite", "B#"] },
      { name: "Go", usedIn: ["PlanTwin", "cfgcanary"] },
      { name: "Kotlin", usedIn: ["EchoBharat"] },
      { name: "JavaScript", usedIn: ["CodeLens", "Real-time Chess", "Draw With Words"] },
      { name: "SQL", usedIn: ["PlanTwin", "Kavach Pay", "cfgcanary"] },
      { name: "Solidity", usedIn: ["Web Threat Detection"] },
      { name: "C", usedIn: ["PlanTwin"] },
      { name: "Shell", usedIn: ["PandaOS", "cfgcanary"] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Interfaces for the web, phones and the desktop.",
    tools: [
      { name: "Next.js", usedIn: ["Kavach Pay", "Virtual Valley", "Auric Billing"] },
      { name: "React", usedIn: ["Web Threat Detection", "LoopSatellite", "AI XBRL Studio", "CodeLens"] },
      { name: "Vite", usedIn: ["LoopSatellite", "Web Threat Detection", "KisanSarthi"] },
      { name: "Tailwind CSS", usedIn: ["Kavach Pay", "Auric Billing"] },
      { name: "Framer Motion", usedIn: ["KisanSarthi", "Auric Billing"] },
      { name: "Jetpack Compose", usedIn: ["EchoBharat"] },
      { name: "React Native + Expo", usedIn: ["Your Manager"] },
      { name: "MapLibre", usedIn: ["LoopSatellite"] },
      { name: "Recharts", usedIn: ["LoopSatellite", "Auric Billing"] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "APIs, realtime sync and the boring parts that keep money correct.",
    tools: [
      { name: "Node.js", usedIn: ["CodeMeet", "Kavach Pay", "Real-time Chess"] },
      { name: "FastAPI", usedIn: ["Web Threat Detection", "LoopSatellite", "AI XBRL Studio"] },
      { name: "Hono", usedIn: ["Kavach Pay"] },
      { name: "Socket.IO", usedIn: ["CodeMeet", "Real-time Chess"] },
      { name: "Yjs (CRDT)", usedIn: ["CodeMeet"] },
      { name: "Zod", usedIn: ["Kavach Pay"] },
      { name: "Clerk", usedIn: ["Kavach Pay", "Auric Billing"] },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Mostly Postgres, sometimes on the inside.",
    tools: [
      { name: "PostgreSQL", usedIn: ["PlanTwin", "CodeMeet", "Kavach Pay", "cfgcanary"] },
      { name: "Drizzle ORM", usedIn: ["Kavach Pay"] },
      { name: "Supabase", usedIn: ["AI XBRL Studio", "Auric Billing"] },
      { name: "Neon", usedIn: ["CodeMeet", "Kavach Pay"] },
      { name: "SQLite", usedIn: ["Your Manager", "SkillGraph"] },
      { name: "DuckDB", usedIn: ["Parity"] },
    ],
  },
  {
    id: "infra",
    label: "Infrastructure",
    blurb: "Where things run, and how they're rolled out safely.",
    tools: [
      { name: "Docker", usedIn: ["PlanTwin", "cfgcanary", "Kavach Pay", "Web Threat Detection"] },
      { name: "Prometheus", usedIn: ["cfgcanary"] },
      { name: "WebAssembly (wazero)", usedIn: ["cfgcanary"] },
      { name: "Vercel", usedIn: ["Kavach Pay", "LoopSatellite", "AI XBRL Studio"] },
      { name: "Render", usedIn: ["Kavach Pay", "Web Threat Detection"] },
      { name: "Fly.io", usedIn: ["AI XBRL Studio"] },
      { name: "Bluetooth LE mesh", usedIn: ["EchoBharat"] },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    blurb: "Models that explain; statistics that decide.",
    tools: [
      { name: "Gemini API", usedIn: ["Kavach Pay", "Web Threat Detection"] },
      { name: "PyTorch", usedIn: ["Parity"] },
      { name: "Hugging Face Transformers", usedIn: ["Parity"] },
      { name: "llama.cpp", usedIn: ["Parity"] },
      { name: "ONNX Runtime", usedIn: ["EchoBharat"] },
      { name: "IndicTrans2", usedIn: ["EchoBharat"] },
      { name: "Google Earth Engine", usedIn: ["LoopSatellite"] },
      { name: "OpenRouter", usedIn: ["AI XBRL Studio", "Web Threat Detection"] },
      { name: "Ollama", usedIn: ["Web Threat Detection"] },
      { name: "NumPy + SciPy", usedIn: ["Parity"] },
    ],
  },
  {
    id: "tools",
    label: "Developer tools",
    blurb: "Things that keep the work honest.",
    tools: [
      { name: "Git + GitHub", usedIn: ["Everything"] },
      { name: "VS Code extensions", usedIn: ["CodeMeet", "B#"] },
      { name: "Vitest", usedIn: ["Kavach Pay"] },
      { name: "Playwright", usedIn: ["Kavach Pay"] },
      { name: "pytest", usedIn: ["Web Threat Detection"] },
      { name: "Foundry", usedIn: ["Web Threat Detection"] },
      { name: "CUE", usedIn: ["cfgcanary"] },
      { name: "Make", usedIn: ["PlanTwin", "cfgcanary"] },
    ],
  },
];
