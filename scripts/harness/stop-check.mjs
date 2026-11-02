#!/usr/bin/env node
// When an agent stops with uncommitted changes, names the checks from the ladder in
// AGENTS.md that match them. It asks once for each set of changes: Claude Code gets a
// block with the reason, so the agent reports its validation; Codex gets a message.
//
// Usage: node scripts/harness/stop-check.mjs claude|codex < hook-event.json
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CATALOG = /^(research\/|dist\/data\/|scripts\/(import-data\.py|collect-sources\.py|build-ai\.mjs|check\.mjs|research-validation\.mjs)$)/;
const LIVE_SITE = /^(dist\/|src\/|serve\.mjs$)/;
const GUIDANCE = /(^|\/)(AGENTS|CLAUDE)\.md$|^\.claude\/|^\.agents\/|^docs\/.*\.md$|^README\.md$/;
const HARNESS = /^\.claude\/settings\.json$|^\.codex\/|^scripts\/(harness|quality)\//;
const MANIFESTS = /(^|\/)(package\.json|bun\.lock|bunfig\.toml|vercel\.json)$|^\.github\/workflows\//;

/** The checks the ladder in AGENTS.md asks for, given repository-relative changed paths. */
export function checksFor(paths, packageName = () => undefined) {
  const checks = new Set();
  for (const path of paths) {
    if (CATALOG.test(path)) checks.add("Catalog: `bun run research:import` when research inputs changed, then `bun run build`, then `bun run test`.");
    else if (LIVE_SITE.test(path)) checks.add("Live site: `bun run build`, `bun run test`, and a rendered check at 360 px and 1280 px with the keyboard.");
    if (path === "DESIGN.md" || path.startsWith("packages/design-system/")) checks.add("Design system: `bun run design:check`.");
    const workspace = /^packages\/([^/]+)\//.exec(path)?.[1];
    if (workspace) {
      const name = packageName(workspace);
      checks.add(name ? `Package: \`bun run --filter ${name} test\`.` : `Package: the tests in \`packages/${workspace}\`.`);
    }
    if (GUIDANCE.test(path)) checks.add("Guidance: `bun run guidance:check`.");
    if (HARNESS.test(path)) checks.add("Hooks and checkers: `node --test scripts/harness/*.test.mjs scripts/quality/*.test.mjs`.");
    if (MANIFESTS.test(path)) checks.add("Manifests or workflows: what CI runs, `bun install --frozen-lockfile`, `bun run build`, `bun run test`.");
  }
  if (paths.length) checks.add("Every change: the focused test for the behavior, and `git diff --check`.");
  return [...checks];
}

function changedPaths(root) {
  const status = execFileSync("git", ["-C", root, "status", "--porcelain=v1", "-uall"], { encoding: "utf8" });
  return status.split("\n").filter(Boolean).map((line) => line.slice(3).split(" -> ").at(-1).replace(/^"|"$/g, ""));
}

function main() {
  const harness = process.argv[2];
  if (!["claude", "codex"].includes(harness)) {
    console.error("Stop check: expected claude or codex.");
    process.exitCode = 2;
    return;
  }
  let event = {};
  try { event = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
  if (event.stop_hook_active) return;

  let root;
  let paths;
  try {
    root = execFileSync("git", ["-C", event.cwd ?? process.cwd(), "rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
    paths = changedPaths(root);
  } catch {
    return;
  }
  if (!paths.length) return;

  // Ask once per set of changes, so a second stop with the same edits goes through.
  const stamp = paths.map((path) => {
    try { return `${path}:${statSync(join(root, path)).mtimeMs}`; } catch { return `${path}:gone`; }
  });
  const fingerprint = createHash("sha256").update(stamp.sort().join("\n")).digest("hex");
  const stateDir = process.env.HOOK_STATE_DIR ?? join(tmpdir(), "funding-commons-hooks");
  const stateFile = join(stateDir, `stop-${String(event.session_id ?? "session").replace(/[^\w-]/g, "")}`);
  if (existsSync(stateFile) && readFileSync(stateFile, "utf8") === fingerprint) return;
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(stateFile, fingerprint);

  const packageName = (dir) => {
    try { return JSON.parse(readFileSync(join(root, "packages", dir, "package.json"), "utf8")).name; } catch { return undefined; }
  };
  const shown = paths.slice(0, 8).map((path) => `- ${path}`).join("\n");
  const more = paths.length > 8 ? `\n- and ${paths.length - 8} more` : "";
  const message = `${paths.length} uncommitted ${paths.length === 1 ? "change" : "changes"}:\n${shown}${more}\n\n`
    + `Before finishing, run the checks that match, or say which already ran and what they showed:\n`
    + checksFor(paths, packageName).map((check) => `- ${check}`).join("\n");
  process.stdout.write(JSON.stringify(harness === "claude" ? { decision: "block", reason: message } : { systemMessage: message }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
