#!/usr/bin/env node
// Shell command guardrails shared by the Claude Code and Codex hooks.
// A guard for ordinary commands, not a shell interpreter or a security sandbox:
// normal permissions still apply. The scanner is adapted from Green Goods'
// scripts/harness/command-policy.mjs.
//
// Usage: node scripts/harness/command-policy.mjs claude|codex < hook-event.json
// "block" stops the command in both harnesses. "ask" asks the person in Claude Code
// and blocks in Codex, which has no confirmation step, so the person runs it there.
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

function scanCommands(source) {
  const commands = [];
  let words = [];
  let cursor = 0;
  let partial = false;
  const heredocs = [];
  const finish = () => {
    if (words.length) commands.push(words);
    words = [];
  };

  // Substitutions are consumed as opaque data, never evaluated.
  function substitution(open, close) {
    let depth = 1;
    let quote = "";
    cursor += 2;
    while (cursor < source.length && depth) {
      const char = source[cursor++];
      if (char === "\\" && quote !== "'") cursor++;
      else if (quote) { if (char === quote) quote = ""; }
      else if (char === "'" || char === '"') quote = char;
      else if (char === open) depth++;
      else if (char === close) depth--;
    }
    partial = true;
  }

  function word() {
    let value = "";
    let quote = "";
    let quoted = false;
    let dynamic = false;
    while (cursor < source.length) {
      const char = source[cursor];
      if (!quote && /[\s;&|<>()]/.test(char)) break;
      if (char === "\\" && quote !== "'") {
        const next = source[cursor + 1];
        if (next === "\n") cursor += 2;
        else if (next === undefined) { partial = true; cursor++; }
        else if (!quote || /[$`"\\]/.test(next)) { value += next; cursor += 2; }
        else { value += char; cursor++; }
      } else if (char === quote) { quote = ""; cursor++; }
      else if (!quote && (char === "'" || char === '"')) { quote = char; quoted = true; cursor++; }
      else if (quote !== "'" && char === "$" && /[({]/.test(source[cursor + 1] ?? "")) {
        substitution(source[cursor + 1], source[cursor + 1] === "(" ? ")" : "}");
        dynamic = true;
      } else if (quote !== "'" && char === "`") {
        cursor++;
        while (cursor < source.length && source[cursor] !== "`") cursor += source[cursor] === "\\" ? 2 : 1;
        if (source[cursor] === "`") cursor++;
        dynamic = true;
        partial = true;
      } else {
        if (quote !== "'" && char === "$") dynamic = true;
        value += char;
        cursor++;
      }
    }
    if (quote) partial = true;
    return { value, dynamic, quoted };
  }

  while (cursor < source.length) {
    const char = source[cursor];
    if (char === "\n") {
      finish();
      cursor++;
      for (const { delimiter, stripTabs } of heredocs.splice(0)) {
        let closed = false;
        while (cursor < source.length) {
          const end = source.indexOf("\n", cursor);
          const line = source.slice(cursor, end < 0 ? source.length : end);
          cursor = end < 0 ? source.length : end + 1;
          if ((stripTabs ? line.replace(/^\t+/, "") : line) === delimiter) { closed = true; break; }
        }
        if (!closed) partial = true;
      }
    } else if (/\s/.test(char)) cursor++;
    else if (char === "#") {
      const end = source.indexOf("\n", cursor);
      cursor = end < 0 ? source.length : end;
    } else if (/[;&|()]/.test(char)) { finish(); cursor++; }
    else if (/[<>]/.test(char) || /^\d+[<>]/.test(source.slice(cursor))) {
      const redirect = source.slice(cursor).match(/^\d*(<<<|<<-|<<|>>|<>|[<>]&?)/)[0];
      cursor += redirect.length;
      const operator = redirect.replace(/^\d+/, "");
      while (/[ \t]/.test(source[cursor] ?? "")) cursor++;
      const target = word();
      if (/<<-?$/.test(operator)) {
        heredocs.push({ delimiter: target.value, stripTabs: operator.endsWith("-") });
        if (!target.quoted) partial = true;
      } else if (operator.startsWith("<") && !operator.startsWith("<<<") && target.value) {
        // An input redirect reads a file, whatever the executable is.
        words.push({ ...target, inputFile: true });
      }
    } else {
      const next = word();
      if (next.value || next.quoted || next.dynamic) words.push(next);
    }
  }
  finish();
  if (heredocs.length) partial = true;
  return { commands, partial };
}

function executableWords(words) {
  const args = words.filter((word) => !word.inputFile);
  while (args.length && /^[A-Za-z_][A-Za-z_0-9]*=/.test(args[0].value)) args.shift();
  while (["env", "command", "exec"].includes(args[0]?.value)) {
    args.shift();
    while (args[0] && (args[0].value === "--" || /^[A-Za-z_][A-Za-z_0-9]*=/.test(args[0].value))) args.shift();
  }
  return args;
}

const isSecretFile = (value) => /^\.env(?:\..+)?$/.test(basename(value)) && basename(value) !== ".env.example";

function readOperands(executable, args) {
  let needsProgram = ["grep", "rg", "sed", "awk"].includes(executable);
  const files = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--") {
      files.push(...args.slice(index + 1 + (needsProgram ? 1 : 0)));
      break;
    }
    if (["-e", "--regexp", "--expression", "-f", "--file"].includes(arg)) {
      needsProgram = false;
      if (["-f", "--file"].includes(arg)) files.push(args[index + 1] ?? "");
      index++;
    } else if (/^--(regexp|expression)=|^-e./.test(arg)) needsProgram = false;
    else if (["-g", "--glob", "-t", "--type", "-T", "--type-not", "-m", "--max-count"].includes(arg) ||
      (["head", "tail"].includes(executable) && ["-n", "-c", "--lines", "--bytes"].includes(arg))) index++;
    else if (arg.startsWith("-")) continue;
    else if (needsProgram) needsProgram = false;
    else files.push(arg);
  }
  return files;
}

const block = (message) => ({ action: "block", message });
const ask = (message) => ({ action: "ask", message });

// True when a short flag appears alone or in a group, as `f` does in `-fd`.
const hasShortFlag = (flags, letter) => flags.some((flag) => /^-[a-zA-Z]+$/.test(flag) && flag.includes(letter));

function gitDecision(values) {
  const rest = values.slice(1);
  while (["-C", "-c", "--git-dir", "--work-tree"].includes(rest[0])) rest.splice(0, 2);
  const [subcommand, ...options] = rest;
  const flags = options.filter((arg) => arg.startsWith("-"));
  const operands = options.filter((arg) => arg && !arg.startsWith("-"));

  if (subcommand === "push") {
    const forced = flags.some((arg) => /^--force(?:$|=|-with-lease)/.test(arg)) || hasShortFlag(flags, "f") || operands.some((arg) => arg.startsWith("+"));
    if (!forced) return null;
    const toMain = operands.slice(1).some((arg) => /^(?:\+?[^:]+:)?\+?(?:refs\/heads\/)?(?:main|master)$/.test(arg));
    return toMain ? block("Never force-push to main.") : ask("Force push: confirm the branch is yours alone before rewriting it.");
  }
  if (subcommand === "add" && (flags.includes("--all") || hasShortFlag(flags, "A") || operands.includes(".") || operands.includes(":/"))) {
    return ask("Broad staging can sweep in another session's work. Stage the task's paths by name instead.");
  }
  if (subcommand === "reset" && flags.includes("--hard")) return ask("`git reset --hard` discards uncommitted work, including other sessions' work.");
  if (subcommand === "clean" && (flags.includes("--force") || hasShortFlag(flags, "f"))) return ask("`git clean` deletes untracked files, including other sessions' new files.");
  if (subcommand === "checkout" && (options.includes("--") || operands.includes("."))) return ask("This `git checkout` discards uncommitted changes.");
  if (subcommand === "restore") {
    const staged = flags.includes("--staged") || hasShortFlag(flags, "S");
    const worktree = flags.includes("--worktree") || hasShortFlag(flags, "W");
    if (!staged || worktree) return ask("`git restore` discards uncommitted changes.");
  }
  if (subcommand === "stash" && !["list", "show"].includes(operands[0])) return ask("The stash stack is shared by every worktree of this repository. Use a work-in-progress commit instead.");
  if (subcommand === "branch" && hasShortFlag(flags, "D")) return ask("`git branch -D` deletes a branch whether or not it is merged.");
  return null;
}

function commandDecision(words) {
  const args = executableWords(words);
  const values = args.map((word) => (word.dynamic ? "" : word.value));
  const executable = basename(values[0] ?? "");

  if (executable === "bun" && values[1] === "test") {
    return block("Use `bun run test`, never `bun test`: the suites run under `node --test`.");
  }
  const readers = ["cat", "head", "tail", "less", "more", "source", ".", "bat", "grep", "rg", "sed", "awk"];
  const inputRead = words.some((word) => word.inputFile && !word.dynamic && isSecretFile(word.value));
  if (inputRead || (readers.includes(executable) && readOperands(executable, values.slice(1)).some(isSecretFile))) {
    return block("Do not read `.env` files through the shell. Use `.env.example`, or ask the person for the non-secret value you need.");
  }
  if (executable === "git") return gitDecision(values);
  if (executable === "gh" && values[1] === "pr" && values[2] === "merge") return ask("Merging needs the person's explicit approval for this pull request.");
  if (executable === "vercel" && (values.includes("--prod") || ["promote", "alias", "dns", "domains"].includes(values[1]))) {
    return ask("This changes a live deployment or domain, which needs the person's explicit approval.");
  }
  if (executable === "supabase" && ((values[1] === "db" && values[2] === "push") || values[1] === "link" || (values[1] === "projects" && values[2] === "create"))) {
    return ask("This touches a hosted Supabase project. Migrations reach it only through the website repository's release step.");
  }
  return null;
}

export function evaluateCommand(command) {
  const { commands, partial } = scanCommands(command);
  const decisions = commands.map(commandDecision).filter(Boolean);
  const opaqueProgram = commands.some((words) => {
    const args = executableWords(words);
    return args[0]?.dynamic || ["eval", "bash", "sh", "zsh", "if", "for", "while", "case", "function"].includes(basename(args[0]?.value ?? ""));
  });
  return { decisions, partial: partial || opaqueProgram };
}

function main() {
  const harness = process.argv[2];
  if (!["claude", "codex"].includes(harness)) {
    console.error("Command policy: expected claude or codex.");
    process.exitCode = 2;
    return;
  }
  let event;
  try { event = JSON.parse(readFileSync(0, "utf8")); }
  catch {
    console.error("Command policy: invalid event input; no policy decision. Normal permissions apply.");
    return;
  }
  const command = event?.tool_input?.command;
  if (typeof command !== "string") {
    console.error("Command policy: command unavailable; no policy decision. Normal permissions apply.");
    return;
  }
  const { decisions } = evaluateCommand(command);
  const blocked = decisions.filter((decision) => decision.action === "block" || harness === "codex");
  if (blocked.length) {
    for (const { action, message } of blocked) {
      console.error(`BLOCKED: ${message}${action === "ask" ? " If the person has asked for this, they can run it themselves." : ""}`);
    }
    process.exitCode = 2;
    return;
  }
  const asks = decisions.filter((decision) => decision.action === "ask");
  if (asks.length) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: asks.map(({ message }) => message).join(" "),
      },
    }));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
