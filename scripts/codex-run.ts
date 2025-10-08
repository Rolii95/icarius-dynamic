#!/usr/bin/env tsx
/**
 * Codex runner (hardened for Node 22 + tsx)
 * - Reads codex.config.json
 * - Auto-selects profile + temperature from routing
 * - Enforces local strict-profile temperature <= 0.2
 * - Prints a DRY-RUN payload you can send to your code model
 */
import fs from "fs";
import path from "path";
import readline from "readline";

type Profile = Partial<{ temperature: number; top_p: number; max_tokens: number }>; 
type Cfg = {
  default: { temperature: number; top_p?: number; max_tokens?: number };
  profiles: Record<string, Profile>;
  routing: { match: string; use: string }[];
};

function readConfig(cfgPath: string): Cfg {
  if (!fs.existsSync(cfgPath)) {
    console.error(`codex.config.json not found at: ${cfgPath}`);
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(cfgPath, "utf8");
    return JSON.parse(raw) as Cfg;
  } catch (e: any) {
    console.error("Failed to parse codex.config.json:", e?.message ?? e);
    process.exit(1);
  }
}

const cfgPath = path.resolve(process.cwd(), "codex.config.json");
const cfg = readConfig(cfgPath);

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: codex-run "<task title or brief>"');
  process.exit(1);
}

// Decide profile via routing
let profileKey = "default";
for (const r of cfg.routing || []) {
  try {
    const re = new RegExp(r.match, "i");
    if (re.test(title)) { profileKey = r.use; break; }
  } catch {
    // Bad regex in config — skip
  }
}
const base = cfg.default || { temperature: 0.1 };
const prof = (profileKey !== "default" ? (cfg.profiles?.[profileKey] || {}) : {}) as Profile;
const params = { ...base, ...prof };

// Local guard: code.strict must be <= 0.2
if (profileKey === "code.strict" && (params.temperature ?? 0.1) > 0.2) {
  console.error(`Strict profile requires temperature ≤ 0.2 (got ${params.temperature}).`);
  process.exit(1);
}

// UX I/O
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const q = (s: string) => new Promise<string>(res => rl.question(s, res));

(async () => {
  const sys = await q("System role (optional, ENTER for default): ");
  const prompt = await q("Paste your Codex prompt (end with ENTER): ");
  rl.close();

  const body = {
    model: "gpt-5-code",
    temperature: params.temperature ?? 0.1,
    top_p: params.top_p ?? 1,
    max_tokens: params.max_tokens ?? 2000,
    messages: [
      { role: "system", content: sys || "You are a senior full-stack engineer. Output diffs and strict JSON as requested." },
      { role: "user", content: prompt }
    ]
  };

  console.log(`\n🧭 Task: ${title}`);
  console.log(`🎛️ Profile: ${profileKey}`);
  console.log(`🌡️ Temperature: ${params.temperature}`);

  // DRY-RUN OUTPUT
  console.log("\n[DRY-RUN] Request payload:");
  console.log(JSON.stringify(body, null, 2));
  console.log("\n🔁 Replace the DRY-RUN block with your OpenAI client to execute.");
})();
