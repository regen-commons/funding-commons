# Regen Commons design system

The shared visual language, brand and interface patterns for Regen Commons products. It is built from the website's existing brand and three books on interface design.

To see it, run the library:

```bash
bun run design:serve
```

Then open <http://localhost:4173/patterns/index.html>.

## What is here

| Path | What it holds |
|---|---|
| [`../../DESIGN.md`](../../DESIGN.md) | The source of all tokens, plus the reasoning and interface principles. Start here. |
| [`brand/BRAND.md`](brand/BRAND.md) | The brand: character, mark, names, colour and type stories, imagery |
| [`brand/VOICE.md`](brand/VOICE.md) | Voice, tone map, plain names, words to avoid |
| [`COMPONENTS.md`](COMPONENTS.md) | Every pattern with status, limits and lineage, and how to add one |
| [`decision-log.md`](decision-log.md) | Settled questions and why |
| [`principles/`](principles/README.md) | How the three books apply, the review checklist, the usability testing plan |
| [`dialects/`](dialects/README.md) | Extra rules for the app, website, desk and email |
| `css/` | The layered CSS. Import `css/index.css` |
| `tokens/` | Generated CSS and JSON. Never edit these |
| `fonts/` | Self-hosted fonts and licenses |
| `patterns/` | The pattern library and example pages |
| `source/` | A pinned copy of the website's tokens, for comparison |

## Use it

```html
<meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="/design-system/css/index.css">
```

From a workspace package, import the same CSS by name: `import "@regen-commons/design-system/css";`.

The page then follows the system theme. To pin a theme, set `data-theme="light"` or `data-theme="dark"` on the root or on a section. To restore a saved choice before first paint, use the short inline script at the top of [patterns/pages/home.html](patterns/pages/home.html).

Compose pages from the [patterns](COMPONENTS.md), and use role tokens such as `--surface` and `--text-muted` for anything new. Read `tokens.generated.json` where CSS cannot reach, as in email.

A site that only wants tokens can load `tokens/tokens.generated.css` alone. See the [website dialect](dialects/website.md).

## Change it

| To change | Do this |
|---|---|
| A token | Edit `DESIGN.md`, then run `bun run design:tokens` |
| A pattern | Follow [the steps in COMPONENTS.md](COMPONENTS.md#add-or-change-a-pattern) |
| A settled question | Add an entry to the [decision log](decision-log.md) |

Checks:

```bash
bun run design:check
```

```bash
bun run --filter @regen-commons/design-system test
```

The tests check that generated files are current, the linter is clean, website values are preserved, every role pair meets contrast in both themes, CSS uses only tokens, every class is documented and used, this file's links resolve, and example pages use plain copy and labelled fields.

## How it changes

- **Who owns it.** One maker with authority over the system, currently the lead builder, and one steward who represents its users. Proposed until the council confirms it.
- **Who uses it.** People and coding agents. Both propose changes through pull requests.
- **New patterns** arrive as candidates with the feature that needs them, and become stable on their second real use.
- **Breaking changes** mean a removed token or a changed stable pattern. They get a major version, a changelog entry and a named replacement. Deprecations last at least one build phase.
- **Reviews** happen at every phase gate, with a look at unused patterns, stale candidates and the health of the [checklist](principles/ui-review-checklist.md).

## Known gaps

- No React components yet. They arrive in Phase 0.
- Fonts cover Latin only. See [DL-009](decision-log.md#dl-009-add-latin-extended-font-subsets).
- Example pages use invented content. Replace it with real hub rows and real assistant output as soon as those exist.
- Nothing here has been tested with people yet. The first round is in the [testing plan](principles/usability-testing.md).

## Changelog

### Unreleased, Step 1

- Added Card grid, Filter bar, Menu, Tooltip, Footer, Media, Link preview, Inline field and Account button patterns, plus research and culture icons. New initiative and funding examples exercise them.
- Modified stable App header, Card, Page shell, List layout and Narrow layout: one left edge, two-line listing titles, bottom actions and four navigation sections. Existing example uses were updated and rechecked.
- Fixed the minimum button target width, including short quiet actions in existing examples.
- Modified Eyebrow to factual sentence-case labels only. Deprecated Tabs for partner/funding navigation in favour of separate pages; keep the CSS for sibling views through Phase 0, with removal considered at its phase gate.
- Added the framework-free `./overlays` behaviour export; dispose listeners when a React component unmounts.

### 0.1.0, 2026-10-31

First definition: tokens from the website, new scales, CSS through templates, pattern library, brand and voice guides.
