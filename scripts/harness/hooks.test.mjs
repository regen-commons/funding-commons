// Runs the hook commands exactly as .claude/settings.json and .codex/hooks.json
// configure them, so a typo in either file or a policy change fails here.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const CONFIG = {
  claude: JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8")),
  codex: JSON.parse(readFileSync(join(ROOT, ".codex/hooks.json"), "utf8")),
};
const STATE = mkdtempSync(join(tmpdir(), "hooks-test-"));
test.after(() => rmSync(STATE, { recursive: true, force: true }));

function run(command, event, cwd = ROOT) {
  const result = spawnSync("/bin/bash", ["-c", command], {
    cwd,
    input: typeof event === "string" ? event : JSON.stringify(event),
    env: { ...process.env, CLAUDE_PROJECT_DIR: ROOT, HOOK_STATE_DIR: STATE },
    encoding: "utf8",
    timeout: 10000,
  });
  assert.ifError(result.error);
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

function hooks(harness, eventName, toolName) {
  return (CONFIG[harness].hooks[eventName] ?? [])
    .filter((entry) => !toolName || new RegExp(`^(?:${entry.matcher})$`).test(toolName))
    .flatMap((entry) => entry.hooks.map((hook) => hook.command));
}

const shell = (harness, command) => hooks(harness, "PreToolUse", "Bash").map((hook) => run(hook, { tool_name: "Bash", tool_input: { command } }));
const decisionOf = (result) => (result.code === 2 ? "block" : result.stdout.includes('"permissionDecision":"ask"') ? "ask" : "allow");

test("every configured hook runs a script that exists", () => {
  for (const [harness, config] of Object.entries(CONFIG)) {
    for (const entries of Object.values(config.hooks)) {
      for (const { command } of entries.flatMap((entry) => entry.hooks)) {
        const script = /scripts\/harness\/[\w-]+\.mjs/.exec(command)?.[0];
        assert.ok(script && existsSync(join(ROOT, script)), `${harness}: ${command}`);
      }
    }
  }
});

test("both harnesses run the same policy scripts for shell commands and edits", () => {
  for (const [event, tool] of [["PreToolUse", "Bash"], ["PreToolUse", "Edit"], ["PostToolUse", "Edit"], ["Stop"], ["SessionStart"]]) {
    const scripts = (harness) => hooks(harness, event, tool).map((command) => /scripts\/harness\/[\w-]+\.mjs( \w+)?/.exec(command)[0].replace(/ (claude|codex)$/, ""));
    assert.deepEqual(scripts("codex"), scripts("claude"), `${event} ${tool ?? ""}`);
  }
});

const allowed = [
  "bun run test",
  "bun run build && bun run test",
  "git status --short",
  "git add AGENTS.md packages/app/src/main.tsx",
  "git push -u origin claude/weave-app-shell",
  "git restore --staged AGENTS.md",
  "git stash list",
  "git checkout claude/weave-foundation",
  "git switch -c claude/next-step",
  "rg 'bun test' AGENTS.md",
  "cat .env.example",
  "printf '%s' 'git add -A'",
  "git log --grep='bun test'",
  "cat <<'DOC'\nbun test\nDOC\nbun run test",
  "gh pr create --draft --base main",
  "vercel ls",
  "supabase start",
];
for (const command of allowed) {
  test(`allowed: ${command.split("\n")[0]}`, () => {
    for (const harness of ["claude", "codex"]) {
      for (const result of shell(harness, command)) assert.equal(decisionOf(result), "allow", `${harness}: ${result.stderr}${result.stdout}`);
    }
  });
}

const blockedEverywhere = [
  "bun test",
  "bun run build && bun test",
  "MODE=ci bun test packages",
  "cat .env",
  "grep KEY packages/app/.env.local",
  "head -n 1 < .env.production",
  "git push --force origin main",
  "git push origin +main",
  "git -C ../other push -f origin HEAD:main",
];
for (const command of blockedEverywhere) {
  test(`blocked in both harnesses: ${command}`, () => {
    for (const harness of ["claude", "codex"]) {
      assert.ok(shell(harness, command).some((result) => decisionOf(result) === "block"), harness);
    }
  });
}

const confirmFirst = [
  "git add -A",
  "git add .",
  "git add --all packages",
  "git push --force-with-lease",
  "git push -f origin claude/weave-app-shell",
  "git reset --hard HEAD~1",
  "git clean -fd",
  "git checkout -- .",
  "git restore AGENTS.md",
  "git stash",
  "git stash pop",
  "git branch -D claude/old",
  "gh pr merge 12 --squash",
  "vercel --prod",
  "vercel promote https://example.vercel.app",
  "supabase db push",
];
for (const command of confirmFirst) {
  test(`asks in Claude Code and blocks in Codex: ${command}`, () => {
    assert.ok(shell("claude", command).some((result) => decisionOf(result) === "ask"), "claude asks");
    assert.ok(shell("claude", command).every((result) => decisionOf(result) !== "block"), "claude does not block");
    assert.ok(shell("codex", command).some((result) => decisionOf(result) === "block"), "codex blocks");
  });
}

test("malformed shell events fall back to normal permissions", () => {
  for (const harness of ["claude", "codex"]) {
    for (const input of ["{", "null", "{}", ""]) {
      for (const hook of hooks(harness, "PreToolUse", "Bash")) assert.equal(run(hook, input).code, 0, `${harness}: ${input}`);
    }
  }
});

const edit = (harness, phase, event) => hooks(harness, phase, harness === "claude" ? "Edit" : "apply_patch").map((hook) => run(hook, event));

test("edits to secrets and generated files are blocked in both harnesses", () => {
  const paths = [
    ".env",
    "packages/app/.env.local",
    "packages/design-system/tokens/tokens.generated.css",
    "dist/data/funders.json",
    "dist/data/research-followup-round-1.json",
    "dist/data/program-conditions.json",
    "dist/data/fund-vectors.json",
  ];
  for (const path of paths) {
    assert.ok(edit("claude", "PreToolUse", { tool_name: "Edit", tool_input: { file_path: join(ROOT, path) } }).some((result) => result.code === 2), `claude: ${path}`);
    const patch = `*** Begin Patch\n*** Update File: ${path}\n@@\n-a\n+b\n*** End Patch`;
    assert.ok(edit("codex", "PreToolUse", { tool_name: "apply_patch", cwd: ROOT, tool_input: { command: patch } }).some((result) => result.code === 2), `codex: ${path}`);
  }
});

test("edits to sources next to generated files are allowed", () => {
  for (const path of ["DESIGN.md", ".env.example", "research/supplemental-funders.json", "dist/app.js", "dist/data/enrichment.schema.json"]) {
    for (const result of edit("claude", "PreToolUse", { tool_name: "Edit", tool_input: { file_path: join(ROOT, path) } })) assert.equal(result.code, 0, `${path}: ${result.stderr}`);
  }
});

test("edits to critical and configuration surfaces add a notice afterwards", () => {
  const notice = (path) => edit("claude", "PostToolUse", { tool_name: "Edit", tool_input: { file_path: join(ROOT, path) } }).map((result) => result.stdout).join("");
  assert.match(notice("supabase/migrations/0001_weave.sql"), /Critical surface/);
  assert.match(notice("packages/api/src/health.ts"), /Critical surface/);
  assert.match(notice("package.json"), /Manifest, lockfile, workflow or agent configuration/);
  assert.match(notice(".github/workflows/design.yml"), /additionalContext/);
  assert.equal(notice("docs/platform/04-prd.md"), "");
});

test("after compaction both harnesses reprint the essential rules from AGENTS.md", () => {
  for (const harness of ["claude", "codex"]) {
    const [result] = hooks(harness, "SessionStart").map((hook) => run(hook, { hook_event_name: "SessionStart", source: "compact" }));
    const context = JSON.parse(result.stdout).hookSpecificOutput.additionalContext;
    assert.match(context, /## Essential rules/);
    assert.match(context, /never `bun test`/);
    assert.match(context, /never `git add -A`/);
  }
});

test("a stop with uncommitted changes asks once for the matching checks", () => {
  const repo = mkdtempSync(join(tmpdir(), "stop-check-"));
  try {
    const git = (...args) => spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
    git("init", "-q");
    const event = (extra = {}) => ({ session_id: `test-${process.pid}`, cwd: repo, hook_event_name: "Stop", ...extra });
    const [claudeStop] = hooks("claude", "Stop");
    const [codexStop] = hooks("codex", "Stop");

    assert.equal(run(claudeStop, event()).stdout, "", "a clean tree stops quietly");

    writeFileSync(join(repo, "DESIGN.md"), "# Tokens\n");
    const first = JSON.parse(run(claudeStop, event()).stdout);
    assert.equal(first.decision, "block");
    assert.match(first.reason, /DESIGN\.md/);
    assert.match(first.reason, /bun run design:check/);

    assert.equal(run(claudeStop, event({ stop_hook_active: true })).stdout, "", "a stop already continued by the hook goes through");
    assert.equal(run(claudeStop, event()).stdout, "", "the same changes are not asked about twice");

    const codex = JSON.parse(run(codexStop, event({ session_id: `codex-${process.pid}` })).stdout);
    assert.match(codex.systemMessage, /bun run design:check/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
