# Handover prompt: repository scaffolding, agent skills and the Regen Commons design system

Paste everything below the line into a new session. It assumes the session can read and push to the `regen-commons/funding-commons` repository.

---

You are setting up the `regen-commons/funding-commons` repository so that coding agents can build Weave, the first version of the Regen Commons platform (weave.regencommons.com), during November 2026. This session is scaffolding only: agent guidance, checks, and an empty app shell wired to the Regen Commons design system. No product features.

## Current state

- `main` holds the live Funding Commons site (static, Bun 1.4.2, Node 24, esbuild), the funder catalog and its research workflow. Its only agent guidance is `docs/maintenance.md`.
- Branch `docs/tend-platform-plan` holds the platform plan in `docs/platform/` and the Regen Commons design system: `DESIGN.md` (DesignMD tokens), `design-system/` (brand, voice, layered CSS, fonts, 57 patterns, example pages, principles) and `tests/design-system.test.mjs`. Merge or rebase onto it first; do not recreate it.
- The living plan doc is https://claude.ai/artifact/YEjb6QGeaF5iGLaQRczUhH. If it and the repository disagree, the doc wins.
- Hosting is Vercel, a new project in the Regen Commons team (Hobby now, Pro once needed). Data is the shared Supabase project "Regen Commons / Website", schema `weave`, with the website repository as the single migration owner for Phase 0.

## Read first

`docs/platform/07-agent-scaffolding.md` is the plan you are carrying out. Also read `docs/platform/05-technical-spec.md` sections 2 and 3, `docs/platform/04-prd.md` section 9, `DESIGN.md`, `design-system/README.md` and `design-system/brand/VOICE.md`. Use the Regen Commons website repository (`regen-commons/website`, read `origin/main`) and Green Goods as the sources to adapt, as the plan describes.

## Build, in this order, one small pull request each

1. **Foundation.** Root `AGENTS.md` (under about 150 lines: where to work, essential rules, scope, shared-checkout safety, domain language, skills table, check ladder, writing rules), `CLAUDE.md` containing only `@AGENTS.md`, `.claude/skills/` with `plan`, `debug`, `review` and `ship` adapted from the website, and the `.agents/skills` symlink for Codex. Check: a fresh agent session can say where to work and which check to run without reading anything else.
2. **Design wiring.** A `design` skill that requires the three-book workflow, `.claude/rules/frontend-design.md`, `design-system/AGENTS.md`, and `design:check` in CI. Check: a raw hex value in `design-system/css` fails CI.
3. **Guardrails.** Hooks in `.claude/settings.json` and `.codex/hooks`, the shared `scripts/harness/command-policy.mjs`, and `scripts/quality/check-guidance.mjs` for links and skill frontmatter. Check: each blocked action fails in a test.
4. **Catalog skill.** Move `docs/maintenance.md` into a `catalog-research` skill and point the Monday and Thursday routines at it, with no change in behaviour.
5. **App shell.** `app/`: React 19 and Vite PWA in TypeScript, no CSS framework, rendering the design system's CSS and tokens (thin components in `app/src/ui` that use those classes), the Regen Commons mark and fonts, light and dark themes following the system, routes stubbed for home, the three intake steps, matches, directory and saving. `api/` with one health-check Vercel function. `app/AGENTS.md` and `api/AGENTS.md`. A Vercel config that keeps funding-commons.vercel.app serving the current site until DNS for the subdomain is ready. Check: `bun run build` and `bun run test` pass, and the shell renders at 360 px and 1280 px in both themes with no raw values.

## Rules

- Work on branches, keep each pull request small with its own check, and open drafts. Do not merge, deploy, change DNS, create Vercel or Supabase projects, or add secrets; list anything that needs a person in the pull request.
- Change dependencies only where a step requires it, and name each one in the pull request.
- The repository is public: no secrets, contact details or private call content.
- Leave out agent teams, Codex lanes, Linear routing, QA apps, selector tooling and skill registries, as the plan says.

## Done means

Five draft pull requests (or one per step if you combine none), each passing CI, with a short summary of what each adds, what a person must do next (Vercel project, subdomain, Supabase access), and anything in the plan that turned out to be wrong.
