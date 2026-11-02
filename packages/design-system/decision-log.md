# Design decision log

Settled questions, so each session does not reopen them. Entries are append-only. Change a decision by adding a new entry that supersedes the old one.

Status: `open` while unanswered, `proposed` until the council or the maker confirms it, `locked` once confirmed, `codified` once tests or tokens enforce it, `superseded` once replaced. Nothing here is `locked` as of 2026-10-31. Confirmation of product-wide choices belongs to the council. See [open decisions](../../docs/platform/open-decisions.md).

## DL-001: DESIGN.md is the single source of tokens

**Status:** codified. Root `DESIGN.md` in the DesignMD format holds all tokens and reasoning. `packages/design-system/scripts/generate-tokens.mjs` produces CSS and JSON, and tests fail on stale output. Green Goods and Coop use the same format. Groups the format lacks (fonts, motion, shadows) live in a fenced block in the same file, so there is still one source. The linter runs on a pinned `@google/design.md` 0.4.0, a newer release than Green Goods' 0.1.1.

## DL-002: Keep every website value

**Status:** codified. The website's dark values are ramp step 400 and its light values are step 700. New steps extend the ramps. A pinned copy of the website's tokens and a test prove nothing drifted. `--pad`, `--card-radius`, the RGB triplets, glow and grain are all preserved under their website names.

## DL-003: Public ink-dim becomes the token

**Status:** codified. The website's token file has `--ink-dim` at `#787060` and `#8A7A60`, which fail text contrast, and its public pages override them with `#A49A87` and `#5D503B`. The overrides become the token, which also fixes the steward desk. The originals retire. `soil-600` (`#86765D`) serves as the control boundary in both themes, slightly darker than the light original so it holds 3:1 on tinted panels.

## DL-004: Follow the system theme, with explicit generated blocks

**Status:** codified. The default follows the operating system. `data-theme` pins a page or a section, and the website pins dark. Tokens use media and attribute blocks instead of `light-dark()`, because the website's RGB triplets and non-colour theme values cannot use it and these blocks work on older phones that `light-dark()` would leave unstyled. Generation removes the cost of repeating values. In the app the control lives in settings, not the header.

## DL-005: Eight capitals get eight colours within the palette

**Status:** proposed. The website uses six tokens in about three hue families, so Intellectual matches Living and Cultural matches Spiritual. This system moves Intellectual to circuit and Spiritual to signal, adding no new hue. Several pairs still look alike under colour blindness, so colour only groups, and the word and glyph identify. Links do not use signal. The website's map keeps its colours until it adopts this.

## DL-006: Capital glyphs are square tiles

**Status:** proposed. The website uses small circles. A square tile with a 2 px radius reads like a specimen label, holds two letters at the 14 px label size, and fits the small-corner language. Tiles have three states: filled, dashed and hollow.

## DL-007: Pencil and ink

**Status:** codified in the patterns. Dashed means an assistant suggested this and no person has confirmed it. Solid means confirmed. This applies to proposals, tiles and imported records. It carries the product rule that nothing derived is applied silently, using the field notebook metaphor.

## DL-008: Corners are 2, 4 and 8 px

**Status:** codified. 2 px for cards, tags and tiles, matching the website's `--card-radius`. 4 px for buttons and inputs. 8 px for sheets and dialogs. Full only for avatars and dots. *Refactoring UI* notes suggested 4 px for cards, but we kept the website's value. No pill buttons. Organic blob outlines stay on website marketing pages.

## DL-009: Add Latin Extended font subsets

**Status:** open. The self-hosted fonts are Latin only. Portuguese and Spanish are covered. Yoruba's dotted vowels and Vietnamese fall back to the system face. Add `latin-ext` subsets before launch in places that need them, and measure the added weight.

## DL-010: 12 px floor, sentence case, two weights

**Status:** codified. 12 px is the smallest text. Buttons and labels use sentence case. Task screens use weights 400 and 600. Weight 300 starts at 48 px. The website's 0.52 to 0.65 rem tracked capitals retire when it adopts the scale. Capitals survive in one small label, used only to say what kind of record something is.

## DL-011: Add madder for errors and destruction

**Status:** proposed. The website has no error hue, and uses copper plus thicker borders. Destructive confirmations and form errors need something distinct from the copper accent, so this system adds one red ramp named after a plant dye. It is always paired with an icon and words.

## DL-012: Class prefix, data attributes and cascade layers

**Status:** codified. Classes start with `rc-` to coexist with the website's global classes during migration. Variants use data attributes and ARIA state. Cascade layers follow the atomic levels, so larger patterns can specialize smaller ones without specificity tricks. No BEM and no utility framework. CSS nesting is avoided so older phones keep working.

## DL-013: The system lives here until a second consumer needs it

**Status:** proposed. `packages/design-system/` is self-contained, outside `dist/`, so deploys are unaffected and it can move to a shared `regen-commons` repository when the website or desk adopts it. Moving it is an [open decision](../../docs/platform/open-decisions.md).

## DL-014: Plain labels first, tested with people

**Status:** proposed. Domain terms stay in data and documents. People read plain labels, listed in [VOICE.md](brand/VOICE.md#plain-names). Each one is a hypothesis for [usability testing](principles/usability-testing.md). "Initiative" stays as the default because it is the community's word, with "project or group" as the test alternative.

## DL-015: One CSS source, thin React components

**Status:** proposed. React components in `packages/app/src/ui` render these classes and own no visual CSS. The *Atomic Design* notes proposed CSS modules per component. One global layered source keeps the library, app and website adoption simple. Revisit if class collisions appear.

## DL-016: Static pattern library for now

**Status:** proposed. Plain HTML pages show the patterns until React exists. They load the same CSS and need only a static server. Storybook stays deferred, and a live `/library` route replaces these pages in Phase 0.

## DL-017: Fit is a word, not a number

**Status:** proposed. Match strength shows as Strong, Good or Possible fit plus bar length. The PRD's scores stay internal. *Refactoring UI* treats a score as data worth showing, such as a percent. Here, people have not seen the rubric, and scores built from sparse data would imply more certainty than exists, so plain words win.

## DL-018: The save prompt is inline, once per seam

**Status:** proposed. Saving appears as a panel in the page flow, after a person has seen value, never as a modal or wall. The panel is the same pattern everywhere. A dismissed prompt stays dismissed. See [08-accounts-and-saving.md](../../docs/platform/08-accounts-and-saving.md).
