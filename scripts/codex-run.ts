#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import readline from "readline";

type Cfg = {
  default: { temperature: number; top_p?: number; max_tokens?: number };
  profiles: Record<string, Partial<{ temperature: number; top_p: number; max_tokens: number }>>;
  routing: { match: string; use: string }[];
};

const cfgPath = path.resolve(process.cwd(), "codex.config.json");
const cfg: Cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error("Usage: codex-run \"<task title or brief>\"");
  process.exit(1);
}

const profileKey =
  cfg.routing.find(r => new RegExp(r.match, "i").test(title))?.use ?? "default";
const base = cfg.default;
const prof = profileKey === "default" ? {} : (cfg.profiles[profileKey] ?? {});
const params = { ...base, ...prof };

console.log(`🧭 Task: ${title}`);
console.log(`🎛️ Profile: ${profileKey}`);
console.log(`🌡️ Temperature: ${params.temperature}\n`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const q = (s: string) => new Promise<string>(res => rl.question(s, res));

(async () => {
  const sys = await q("System role (optional, ENTER for default): ");
  const prompt = await q("Paste your Codex prompt (end with ENTER): ");
  rl.close();

  // --- OpenAI call (replace with your SDK / agent call) ---
  // Example with fetch; keep deterministic defaults from params.
  const body = {
    model: "gpt-5-code",                         // <- your code model
    temperature: params.temperature,
    top_p: params.top_p ?? 1,
    max_tokens: params.max_tokens ?? 2000,
    messages: [
      { role: "system", content: sys || "You are a senior full-stack engineer. Output diffs and strict JSON as requested." },
      { role: "user", content: prompt }
    ]
  };

  // Pseudo-call so the script is self-contained; replace with real call.
  console.log("\n[DRY-RUN] Request payload:");
  console.log(JSON.stringify(body, null, 2));
  console.log("\n🔁 Replace the DRY-RUN block with your OpenAI client to execute.");
})();
