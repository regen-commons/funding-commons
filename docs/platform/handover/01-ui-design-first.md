# Handover prompt: interface design before any build

Paste everything below the line into a new session. It assumes the session can read the `regen-commons/funding-commons` repository (branch `docs/tend-platform-plan` until it is merged) and the living plan doc.

---

You are designing the interface for Weave, the first version of the Regen Commons platform at weave.regencommons.com. This session is design only: do not write application code, create the app, or touch the database. The output is a reviewed set of screens that a later build session will implement.

## Read first, in this order

1. The living plan doc: https://claude.ai/artifact/YEjb6QGeaF5iGLaQRczUhH (tabs: Proposal brief, Product requirements, Saving and accounts, Design system, Open decisions). If it and the repository disagree, the doc wins; note the difference.
2. In the repository: `docs/platform/01-proposal-brief.md`, `docs/platform/04-prd.md` (sections 6 and 7, R1 to R47), `docs/platform/08-accounts-and-saving.md`, `docs/platform/open-decisions.md`.
3. The design system: `DESIGN.md`, `design-system/README.md`, `design-system/brand/BRAND.md`, `design-system/brand/VOICE.md`, `design-system/COMPONENTS.md`, `design-system/decision-log.md`, and `design-system/principles/` (the three books, the review checklist and the usability testing plan).
4. The existing example pages in `design-system/patterns/pages/` (home, step-needs, finish, matches, matches-empty, code, saved). Run `bun run design:serve` and open `http://localhost:4173/patterns/index.html` to see them rendered.

## What the first version must do (November 2026, live by 30 November)

- Intake is a three-step conversation: your initiative, your needs, your offers. Each step works by voice, by file or link, or by typing, and works with no AI at all.
- Local AI runs in the browser; cloud AI is a per-use, logged choice that names the provider and retention.
- Step 1 asks for four public fields only: name, locations, description, links. Stage, lenses, themes, place and eligibility are derived from those and shown only so they can be corrected (pencil until confirmed, never a question).
- Needs and offers are cards with forms of capital (eight capital tiles), place scope, timeframe or capacity and exchange terms.
- Matches have two tabs. Opportunities show solo fit plus a "stronger with" partner suggestion. Partners work as give to get: before someone shares their initiative, they see how many partners match and why, with names hidden; names, cards and "Ask for an introduction" open once they add their initiative to the list. Anyone can still browse the public directory.
- Saving asks for an email and nothing else, inline, after the first opportunities and the partner teaser. Code-first sign-in. Private by default; who can see it (Only you, People signed in, Anyone) is a separate choice.
- Regen Commons branding and identity from day one: use only the design system's tokens, patterns, voice and plain labels.

## Screens to design

Mobile first at 360 px, then 1280 px, in both themes:

1. Home for a first-time visitor (what this is, a plain tagline, one primary action, browse the directory).
2. Step 1 in each input mode (speaking, attaching a deck or link, typing), plus the model-download prompt and the cloud consent dialog.
3. The initiative card with derived details in pencil and how a person corrects one.
4. Step 2 (needs) and step 3 (offers) with suggested cards in pencil and kept cards in ink.
5. Finish: first opportunities, the partner teaser, "your card", and the save panel.
6. The share decision that unlocks partner names, and the Partners tab before and after sharing.
7. Opportunities tab and an opportunity detail with "stronger with".
8. Email and code flow, including every error row in `08-accounts-and-saving.md`.
9. Public directory of initiatives, with search and filters.
10. Empty, loading, offline, error and very-long-content states for each of the above.

## How to work

- Start by listing the screens and states, and the patterns from `COMPONENTS.md` each one uses. Flag any new pattern you need and why an existing one does not fit.
- Build the screens as static HTML pages in `design-system/patterns/pages/`, using only existing CSS layers and tokens, so the design is the same code the build will use. Use fictional example content and say so on the page.
- Run the five-minute review in `design-system/principles/ui-review-checklist.md` on every screen at 360 px and 1280 px, and `bun run test` before each commit (the design system test checks tokens, contrast, links and banned copy).
- Record settled questions in `design-system/decision-log.md`. Anything that needs the council goes in `docs/platform/open-decisions.md`.
- Draft the script for the one usability round that runs before 30 November (three participants, tasks from `usability-testing.md`, including test T8 on whether the partner teaser encourages sharing).
- Keep commits small, on a branch named `design/first-version-screens`, and open a draft pull request. Do not merge, deploy or publish.

## Done means

Every screen above exists as a rendered page in both themes and both widths, passes the review checklist and the test suite, and is linked from the pattern library index. A short summary lists new patterns, open questions and anything in the plan the design shows to be wrong.
