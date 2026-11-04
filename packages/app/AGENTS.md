# App package

Use the [root guide](../../AGENTS.md) for shared workflow and the
[design skill](../../.claude/skills/design/SKILL.md) for anything people see.
`@weave/app` is Weave: a React 19 PWA built with Vite, in TypeScript, with no CSS
framework. It is the root directory of the Weave Vercel project. Read the
[app dialect](../design-system/dialects/app.md) before changing a screen.

Today it is a shell: stub routes for home, the three intake steps, matches, the
directory and saving, listed in [src/routes.ts](src/routes.ts). Each stub says what
the page will do and offers one working link. Never show a control that does not
work yet.

## Structure

| Path | Holds |
|---|---|
| `src/routes.ts` | Every page: path, title, whether it is a form page |
| `src/router.tsx` | The small history router and `Link` |
| `src/ui/` | Thin components, one per design-system pattern, named by structure |
| `src/pages/` | Pages composed from `src/ui` |
| `api/` | One-line Vercel entry files that re-export `@weave/api` handlers |
| `public/brand/` | Copied from the design system by `scripts/copy-brand.mjs`; ignored by Git |
| `vercel.json` | The Weave project's build, rewrites, security headers and caching |

## Boundaries

- The app owns no visual CSS. It imports `@regen-commons/design-system/css` once, in
  `src/main.tsx`, and components render the system's markup and `rc-` classes. No
  inline styles, no raw values. A missing pattern goes into the design system first.
- Labels come from [VOICE.md](../design-system/brand/VOICE.md): sentence case, plain
  names, no em dashes or arrows. Every page has one `h1`, and the tab title echoes it.
- The theme follows the system. There is no theme toggle in the header.
- Drafts stay on the device until the person saves. Nothing calls a third party:
  the content security policy in `vercel.json` allows only this origin. Widen it only
  with the change that needs it, such as the Supabase project or model files.
- Server code belongs in `@weave/api`. A file in `api/` is a single re-export, and
  the entry test fails on anything else.
- funding-commons.vercel.app is a different Vercel project, rooted at the repository
  root. Nothing here changes it.

## Checks

| When | Run |
|---|---|
| Any change | `bun run --filter @weave/app test` and `bun run --filter @weave/app typecheck` |
| Before push | `bun run --filter @weave/app build`, then root `bun run build` and `bun run test` |
| Anything people see | Start the `app` server in `.claude/launch.json` (`bun run --filter @weave/app dev`, port 5173) and check 360 px and 1280 px in both themes, with the keyboard, then run the five-minute review |

The tests check the route table, that every `rc-` class exists in the design system,
that there are no inline styles, raw values or app CSS files, the voice rules, and
that each `api/` entry loads and exports only HTTP handlers. Label rendered proof as
`fixture` until the app talks to a backend.
