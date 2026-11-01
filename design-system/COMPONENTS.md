# Component inventory

Every pattern in the system, with its status, limits and lineage. The [pattern library](patterns/index.html) shows them running. Tests hold this file to the CSS and to the example pages, so the "Used in" column stays true.

Names describe structure, not content. The product's words live in variants and pages.

## Status

| Status | Meaning |
|---|---|
| `stable` | A foundation atom, or used in at least two pages. Documented, shown in the library and tested. |
| `candidate` | Used in one page or only in the library. Can still change freely. |
| `deprecated` | Still works, and names a replacement and a removal phase in the changelog. |
| `retired` | Removed, with a changelog entry. |

Status words are separate from the stage names (Seed, Sprout) used for initiatives and build phases.

## Atoms

| Pattern | Class | Status | Job and parts | Variants | Limits | Used in |
|---|---|---|---|---|---|---|
| Heading | `rc-heading` | stable | Page and section titles | `data-size`: hero, page, section | Three lines at most on a phone | home, step-needs, finish, code, saved, matches, matches-empty |
| Eyebrow | `rc-eyebrow` | stable | Says what kind of record this is. Never above every heading | Optional icon | Three words | matches |
| Prose | `rc-prose` | stable | Reading text at a comfortable measure |  | Paragraphs of four lines or fewer | home |
| Meta | `rc-meta` | stable | Small supporting text |  |  | home, step-needs, finish, code, saved, matches, matches-empty |
| Icon | `rc-icon` | stable | Inline icon from `brand/icons.svg` | `data-size`: sm, lg | Never the only name of a control | home, step-needs, finish, code, saved, matches, matches-empty |
| Logo | `rc-logo` | stable | Mark and product name. Returns home. Part: `rc-logo-mark` |  |  | home, step-needs, finish, code, saved, matches, matches-empty |
| Button | `rc-button` | stable | Starts an action | `data-variant`: primary, secondary, quiet, danger. `data-size`: sm, lg. `data-width`: full. `aria-busy`, `disabled` | Label under five words. One primary per region | home, step-needs, finish, code, saved, matches, matches-empty |
| Icon button | `rc-icon-button` | stable | An action with a widely known icon, such as close |  | Requires `aria-label` | library only |
| Input | `rc-input` | stable | Text, select and text area | `data-kind`: code. `aria-invalid`, `disabled` | Always inside a Field | step-needs, finish, code |
| Check | `rc-check` | stable | Native checkbox and radio |  |  | saved |
| Switch | `rc-switch` | stable | A setting that applies at once | `role="switch"` | Never pre-checked for email | library only |
| Chip | `rc-chip` | stable | A choice you tap. Part: `rc-chip-remove` | Selectable, removable | 44 px high | library only |
| Tag | `rc-tag` | stable | A label you read | Plain, with an icon, `data-capital` | Three words | home, step-needs |
| Tile | `rc-tile` | stable | Glyph for a form of capital | `data-state`: suggested, empty | Two letters | home, step-needs |
| Stage | `rc-stage` | stable | Stage of growth, with icon and plain word | `data-stage`: seed, sprout, flowering, tree |  | step-needs, finish, matches |
| Fit | `rc-fit` | stable | Strength of a match as a word and bar. Part: `rc-fit-bar` | `data-level`: strong, good, possible | Never a number | finish, matches |
| Timestamp | `rc-time` | stable | When a record was last confirmed | `data-stale` | Stale after 180 days | finish, matches |
| Spinner | `rc-spinner` | stable | Short waits, inside a button |  |  | library only |
| Skeleton | `rc-skeleton` | stable | Space held for content that is loading |  |  | library only |
| Surface | `rc-surface` | stable | A plain raised or tinted panel | `data-level`: raised, tint |  | library only |
| Skip link | `rc-skip-link` | stable | First stop for keyboard users |  | On every page | home, step-needs, finish, code, saved, matches, matches-empty |
| Visually hidden | `rc-visually-hidden` | stable | Text only for assistive technology |  |  | step-needs |

## Molecules

| Pattern | Class | Status | Job and parts | Variants | Limits | Used in |
|---|---|---|---|---|---|---|
| Form | `rc-form` | stable | Stacks fields at the right rhythm |  | 28 rem wide | finish, code, saved |
| Field | `rc-field` | stable | Label, hint, control, error. Parts: `rc-hint`, `rc-error` |  | Label always visible | finish, code |
| Composer | `rc-composer` | candidate | The box a person writes in. Part: `rc-composer-actions` | Speak and Attach when working |  | step-needs |
| Proposal | `rc-proposal` | candidate | A suggested value awaiting confirmation. Parts: `rc-proposal-source`, `rc-proposal-value` | `data-state`: confirmed | Value under 12 words | step-needs |
| Choice group | `rc-choice-group` | candidate | Selectable cards for a short vocabulary. Parts: `rc-choice`, `rc-choice-text`, `rc-choice-title`, `rc-choice-note` | Radio or checkbox | Five options for radios | saved |
| Stepper | `rc-stepper` | candidate | Where you are in a short sequence. Part: `rc-stepper-mark` | `aria-current`, `data-state`: done | Three to five steps | step-needs |
| Reason | `rc-reasons` | stable | Why something appears for you. Part: `rc-reason` |  | Three lines of one sentence | finish, matches |
| Card | `rc-card` | stable | One record. Parts: `rc-card-header`, `rc-card-title`, `rc-card-meta`, `rc-card-summary` | `data-stage`, `data-kind`: need, offer. `data-pencil` | Title three lines, summary three lines | step-needs, finish, matches |
| Tag list | `rc-tag-list` | stable | A row of tags |  |  | home, step-needs |
| Tile list | `rc-tile-list` | candidate | A row of tiles with each state in words |  | Eight tiles | step-needs |
| Record | `rc-record` | candidate | What is known, with room for what is missing | `data-empty` on a value |  | step-needs |
| Stamp | `rc-stamp` | stable | Last confirmed, and a way to confirm again |  |  | finish, matches |
| Notice | `rc-notice` | candidate | A message in the flow of the page. Parts: `rc-notice-body`, `rc-notice-title` | `data-tone`: success, info, warning, danger | Two sentences | saved |
| Message | `rc-message` | candidate | One turn of conversation | `data-from`: assistant, person |  | step-needs |
| Tabs | `rc-tabs` | stable | Sibling views. The active tab joins its content | `aria-current` | Three tabs on a phone, with counts | matches, matches-empty |
| Action bar | `rc-action-bar` | stable | The things you can do with a record |  | One primary | step-needs, finish, saved, matches |
| Progress | `rc-progress` | candidate | A long task, with a way to stop |  |  | library only |
| Save status | `rc-save-status` | stable | Says where the work lives | `data-state`: device, account | Visible through the intake | step-needs, finish, code, saved, matches |
| Search | `rc-search` | candidate | A box, a button and the word Search |  | No scope menu before results | library only |
| Breadcrumbs | `rc-breadcrumbs` | candidate | A place inside its larger places |  |  | library only |
| Facts | `rc-facts` | candidate | Plain terms for consent and privacy |  |  | library only |
| Empty state | `rc-empty` | candidate | A first screen with one thing to do. Part: `rc-empty-title` |  | One action, no filters | matches-empty |

## Organisms

| Pattern | Class | Status | Job and parts | Variants | Limits | Used in |
|---|---|---|---|---|---|---|
| App header | `rc-app-header` | stable | Product name, sections and save or sign-in state. Part: `rc-app-nav` | Form pages drop the sections |  | home, step-needs, finish, code, saved, matches, matches-empty |
| Bottom navigation | `rc-bottom-nav` | stable | Sections on phones |  | Four items, icon and word | home, finish, saved, matches, matches-empty |
| Guide panel | `rc-guide` | candidate | The conversation for one step. Parts: `rc-guide-log`, `rc-guide-status` |  |  | step-needs |
| Review sheet | `rc-review` | candidate | Suggestions waiting for you. Part: `rc-review-list` |  |  | step-needs |
| Code panel | `rc-code-panel` | stable | Save or sign in by email code. Parts: `rc-code-panel-title`, `rc-code-panel-actions` | Email step, code step, error | One field per step, never a modal | finish, code |
| Card list | `rc-card-list` | stable | A counted list of cards. Parts: `rc-card-list-header`, `rc-card-list-items` |  |  | finish, matches |
| Dialog | `rc-dialog` | candidate | Consent and confirming steps. Parts: `rc-dialog-body`, `rc-dialog-title` |  | Never for saving | library only |
| Data table | `rc-table` | candidate | Desk lists and the record of assistant use. Part: `rc-table-scroll` | `data-align`: end |  | library only |

## Templates

| Pattern | Class | Status | Job and parts | Variants | Limits | Used in |
|---|---|---|---|---|---|---|
| Page shell | `rc-page` | stable | Header, main and navigation. Parts: `rc-main`, `rc-stack` |  |  | home, step-needs, finish, code, saved, matches, matches-empty |
| Step layout | `rc-step-layout` | stable | One column, then a sticky side panel. Parts: `rc-step-main`, `rc-step-aside` |  |  | step-needs, finish |
| List layout | `rc-list-layout` | stable | One comfortable list column |  | 40 rem | matches, matches-empty |
| Narrow layout | `rc-narrow` | stable | Focused single tasks |  | 28 rem | code, saved |
| Home hero | `rc-home-hero` | candidate | Says what this is and where to start. Part: `rc-home-actions` |  | Fits one phone screen | home |

## Planned

These have no code yet. They come with the phase that first needs them, and stay with that feature until a second use, following the rule below.

| Pattern | Level | Phase | Job |
|---|---|---|---|
| Place summary | Organism | 2 | A place's own name, counts, and needs with cited sources, under breadcrumbs |
| Partnership board | Organism | 2 | Purpose, who is in, roles needed, how to join and leave |
| Revision history | Organism | 1 | Who changed what and why, on the desk and on an initiative |
| Weekly update email | Template | 1 | The card and reason patterns in email-safe markup |
| Directory filters | Molecule | 0 | Type-of-work filter, a variant of Choice group |

## Add or change a pattern

1. **Look first.** Search this file and the library for an existing pattern or variant, and reuse it.
2. **Build it with the feature.** If nothing fits, build a candidate where it is used, from existing atoms and tokens only.
3. **Name it.** Blur the content and describe what remains, without product nouns. `Card`, not NeedCard.
4. **Compose.** Include smaller patterns. Never copy their markup.
5. **Take content as input.** Show empty, one, many, long, stale, error, no-assistant, dark and light.
6. **Check it.** Resize continuously from 320 to 1440 px, use the keyboard, then run the [review](../DESIGN.md#how-we-follow-them).
7. **Record it.** Add a row here, show it in the library, and re-check every listed use if you changed a stable pattern.
8. **Promote it.** On its second real use, mark it `stable` and add a changelog line. When changing a stable pattern, say whether it modifies, adds or removes. Deprecate instead of deleting.

A pull request lists the patterns it touched, every use it re-checked, screenshots at stated widths in both themes, and whether the count of patterns went up or down.

## In React

Phase 0 adds thin React components in `app/src/ui`, one per pattern, that render this markup and these classes. CSS stays here, so the static library and the app share one source. A live `/library` route then replaces the static pages, and lineage comes from the import graph instead of this table.
