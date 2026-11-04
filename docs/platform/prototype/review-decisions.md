# Decisions from the prototype reviews

The maker (the lead builder, who holds the design for now; see D11 in [open decisions](../open-decisions.md)) walked through the [prototype](README.md) twice: version 2 on 3 November 2026 and version 3 on 4 November 2026. They then answered four questions, on the adding flow, filters, several partners for one fund and images. Version 4 shows every decision below.

None of these decisions is in the canonical documents yet. Each row says where it belongs. Place a decision in the change that builds it, then replace its "Belongs in" entry with a link to where it now lives. Changes to the plan documents (the PRD and 08) come first, in a docs-only pull request the maker approves. Three decisions change existing guidance, marked **Changes**.

The canonical files are [DESIGN.md](../../../DESIGN.md), [COMPONENTS.md](../../../packages/design-system/COMPONENTS.md), [VOICE.md](../../../packages/design-system/brand/VOICE.md), the [decision log](../../../packages/design-system/decision-log.md), the [review checklist](../../../packages/design-system/principles/ui-review-checklist.md), the [PRD](../04-prd.md), [08 Saving and accounts](../08-accounts-and-saving.md), the [technical specification](../05-technical-spec.md) and [open decisions](../open-decisions.md).

## Layout and lists

| # | Decision | Belongs in |
|---|---|---|
| 1 | **Use the width.** On wide screens, partners, funding and initiatives are card grids with columns of at least 18 rem. Cards in a row share one height, with their actions at the bottom. | DESIGN.md (layout), COMPONENTS.md (Card grid) |
| 2 | **One left edge.** Every page lines up with the logo. Only the home hero and empty states are centred, so `rc-narrow` stops centring. | DESIGN.md, `css/templates.css` |
| 3 | **Partners and Funding are separate pages,** never tabs. The navigation is Home, Partners, Funding and Initiatives. | COMPONENTS.md, PRD 6.3 |
| 4 | **One filter bar on every list.** Search, then filter buttons that open small menus, then sort. Chosen filters show as removable chips with a count ("3 of 7 initiatives"). The kinds-of-support filter looks in offers, needs or both. Once a person has an initiative, Partners adds "Offers what you need" and "Needs what you offer". | COMPONENTS.md (Filter bar, replacing the planned Directory filters) |
| 5 | **Align what people compare.** Card titles take two lines, so the fit line sits at the same height across a row. | COMPONENTS.md (Card) |
| 6 | **A footer on every page:** Weave (describe, Partners, Funding, Initiatives), Your data (What we store, What the assistant did, Settings) and Regen Commons (website, membership, data policy). The focused steps get a slim row. | COMPONENTS.md (Footer) |
| 7 | **Home in five parts:** the hero, three numbered steps (the first is the way in), the eight kinds of support, recently shared initiatives, and funding closing soon (the three funds closing first, with days left). | PRD 6, the home example page |

## Words and pictures

| # | Decision | Belongs in |
|---|---|---|
| 8 | **No decorative labels above headings.** No small-capital kickers or eyebrows: a heading and one line. Labels that stay are sentence case. **Changes** how the Eyebrow pattern is used: keep it only where it carries a fact no heading can. | DESIGN.md, VOICE.md, COMPONENTS.md (Eyebrow) |
| 9 | **Say less, show more.** One line under a heading; the rest behind a link or in a pop-up. Initiatives carry photographs and funding does not. External links show as link previews. | COMPONENTS.md (Media, Link preview) |
| 10 | **The eight kinds by their own names:** Living, Material, Intellectual, Experiential, Social, Financial, Cultural and Spiritual as titles, with the plain meaning beneath and more in a tooltip. **Changes** VOICE.md's plain-name table for these eight and revisits DL-014. | VOICE.md, decision log, T3 in open decisions |
| 11 | **Tooltips explain compact signs.** Capital tiles, kind tags, type-of-work tags and fit lines open a tooltip on hover or focus, through `interestfor` and a hint popover, with a small fallback. The same words reach screen readers. | COMPONENTS.md (Tooltip) |
| 12 | **Type-of-work tags** carry an icon each and an outlined style, so they read apart from themes and kinds of support. Two icons are proposed for the sprite, `rcp-research` and `rcp-culture` in `src/page.template.html`. | COMPONENTS.md (Work tag), `brand/icons.svg` |

## Describing an initiative

| # | Decision | Belongs in |
|---|---|---|
| 13 | **Describing is a conversation led by voice.** The assistant asks one short thing at a time. A large Speak button comes first, typing sits below it for when speaking is not possible, and files or links can be added at any point. People can change their words after. When enough is in, Build my card reads everything on the device and works out the key details, themes and structure. The card fills in beside the conversation. Supersedes version 3's form with a live preview. | PRD 6.1 and 6.2, COMPONENTS.md (Conversation, Composer) |
| 14 | **Needs and offers the same way.** Each need or offer appears as a card beside the conversation as it is said, with Keep, Change and Remove. At most five of each, with a counter ("3 of 5"). When more are heard, the first five show and the page says so. | PRD 6.2 and R3, COMPONENTS.md (Ask card) |
| 15 | **A need or offer shows every kind of support it carries,** all alike, and the form asks for every kind that applies. The data model already allows several (`capital_forms` is an array). | COMPONENTS.md (Ask card) |
| 16 | **The download is optional and sold as privacy:** "Keep your words on this device", the size for this device, nothing without a tap, resumable and removable in Settings. The keyword draft works meanwhile. Proposed sizes are under [A smaller download](#a-smaller-download). | Technical specification (AI pipeline), PRD R9 |

## Saving, sharing and partners

| # | Decision | Belongs in |
|---|---|---|
| 17 | **Two ways to be on Weave:** "Private, for finding funding" (only you see it, and funding matches still work) and "Shared with the community" (a public page and a place in the directory). Replaces the three visibility levels in R27 and 08. | 08, PRD R27, technical specification (visibility) |
| 18 | **Partners are for shared initiatives.** A private initiative sees funding, the number of partner matches and how to share. Names, cards and introductions open once it is shared, as R16 and R43 say. Team slots show a private initiative counts, never names. Supersedes version 3's "partners after saving" and the veiled card. | PRD 6.3, 08, T8 in open decisions |
| 19 | **One email door.** Anything that needs an email (save, share, remind, introduce) saves the initiative to that email. Once signed in, the action just happens: Remind me turns the reminder on. | 08 |
| 20 | **Save where the reason is.** The email field and the code step sit in the share card that says what saving or sharing opens, on Finish and on Partners before sharing. | 08, DL-018 |
| 21 | **Several partners for one fund: team slots.** A fund lists what it asks from partners. Each ask shows candidates to pick, a team fit sums up the picks, and one button asks them all for introductions. Funding cards say how many asks the list could cover. Extends R14's "one or two partners". | PRD R14, COMPONENTS.md (Team slots) |
| 22 | **Once signed in,** the header shows Saved and an account button that leads to Settings. | COMPONENTS.md (App header) |

## Pop-ups and settings

| # | Decision | Belongs in |
|---|---|---|
| 23 | **Small tasks and information open over the page.** Sign in, save, sharing, delete, What we store and the assistant record open as a dialog on wide screens and a sheet from the bottom on phones. The unprompted save prompt on Finish stays inline (DL-018). **Changes** the Code panel's "never a modal" and the Dialog's "never for saving" in COMPONENTS.md. | COMPONENTS.md (Dialog, Sheet, Code panel), decision log |
| 24 | **What we store is five short answers,** about 55 words, with a link to the full data policy. **The assistant record** is one summary line, then one row per step with where it ran and how many words went to the cloud, never the text. | 08, COMPONENTS.md (Record list) |
| 25 | **Settings are set in place.** Who can see the initiative and which emails arrive change where they are shown. Assistant, Appearance and Your data follow. Signing out and deleting sit at the bottom under Leave, set apart. Membership moves to the footer. | COMPONENTS.md (Settings template) |

## From the first review, still standing

| # | Decision | Belongs in |
|---|---|---|
| 26 | **Equal heights.** A field and its button share the large control height (`--control-lg-height`), and the steps of one flow keep one height, so nothing jumps. | COMPONENTS.md (Inline field), review checklist |
| 27 | **Motion says what changed.** Screens cross-fade, cards rise in a few at a time, linked cards lift on hover, sheets slide and confirmations arrive as a toast. Durations and easing are tokens, and all of it stops under reduced motion. The woven-thread backdrop behind the home page is the only decoration. | DESIGN.md (motion) |
| 28 | **Phone first, without jumps.** New screens start at the top with the heading focused, and the hero stays short on phones. | Review checklist |

## Checklist additions

For the review checklist:

- Any list in one narrow column at 1280 px, any tab where a page would do, and any list without search, a filter and a sort.
- Any decorative label above a heading.
- Any fit or price line at different heights across a row.
- Any compact sign without a tooltip.
- Any small task or information page that leaves the page.
- Any partner name shown to a private initiative.
- Any page without the footer.

## Decision-log entries

Proposed entries after DL-018, numbered when placed, each covering these rows:

| Entry | Rows |
|---|---|
| Partners are for shared initiatives; private ones see funding only | 18 |
| Two ways to be on Weave | 17 |
| One email door, with saving where the reason is | 19, 20 |
| Describing is a conversation led by voice; the on-device model builds the card | 13 |
| Needs and offers carry every kind that applies, five of each at most | 14, 15 |
| One filter bar on every list; Partners and Funding are pages | 3, 4 |
| Team slots for several partners per fund | 21 |
| The eight kinds by their own names (revisits DL-014) | 10 |
| Tooltips, pop-ups for small tasks, settings set in place | 11, 23, 25 |
| No decorative labels; a footer on every page | 6, 8 |
| Layout and motion from the first review | 1, 2, 5, 26, 27, 28 |

## Questions for open decisions

1. **Where do a fund's asks come from?** Team slots need each fund's partner requirements as data, and the catalog has free-text eligibility today. Extracted from the funder's page by the assistant and checked by a steward, or entered by stewards?
2. **The kinds' names.** Framework names as titles reverse VOICE.md's plain-name rule for these eight. Test both with people (T3).
3. **The conversation's questions.** A fixed short script, or chosen by the on-device model from what is missing? The prototype uses a fixed script.
4. **Images in the app.** An upload, the site's preview image, or both, and who checks them?
5. **Can a shared initiative go back to private** while introductions are open? The prototype allows it and keeps the open introductions.
6. **Download sizes.** Confirm the models and sizes under [A smaller download](#a-smaller-download) with the technical specification's owner.
7. **Still open from version 2:** the directory's navigation label (Initiatives or Directory); per-field cloud consent in R10, which the prototype leaves out; typed locations as a public field against bioregion, watershed and country as a derived proposal in pencil, which R4 blends; what a visitor's Funding page shows (the prototype shows the whole catalog unranked, with a prompt to describe); whether Keep all blurs pencil against ink (T5); and six or eight digits for codes (D14; the prototype assumes six).

## What the plan needs to change

- **08:** two ways to be on Weave, partners only when shared and one email door replace the three labels and the separate resumptions. The storage-evicted row should say what is kept (saved initiatives) and what is lost (the draft on this device). Reminders are Phase 1 in 08's build order, but the PRD's Phase 0 matches show them; the prototype puts them behind the email door.
- **PRD:** Partners is its own page (6.3), and the teaser becomes the share card (R16). R27 drops to two levels, and R14 grows into team slots. 6.1 stays a conversation, now voice first with typing and files beside it and the card built at the end. "Scale" leaves R2 and 6.2, because it repeats place and stage and cannot be corrected meaningfully.
- **COMPONENTS.md:** the Code panel's "never a modal" and the Dialog's "never for saving" conflict with row 23. There are no patterns yet for the filter bar, tooltips, team slots, the footer, media or link previews. The example pages put Places in the navigation, which Phase 0 does not have.
- **VOICE.md:** the plain-name table for the eight kinds no longer matches what people see first.
- **Data:** funds need structured partner requirements for team slots.
- **Technical specification:** the download sizes below, and `SpeechRecognition.available()` needs its required `langs` option. The pattern library's "about 40 MB" notice names the keyword tier's model, not the assistant's.
- **`css/base.css`:** the box-sizing rule lists elements by name and leaves out `span` and `p`, so a padded span sized to its container overflows.

## A smaller download

A proposal from research on 4 November 2026. Sizes are the file sizes in the model listings on Hugging Face; quality figures are the model makers' own. It needs the technical specification owner's check against the spec's golden fixtures before it is a decision. Sources are in the notes' Smaller download tab, in [src/notes.html](src/notes.html).

| Device | What runs | Download |
|---|---|---|
| Every device | Keyword rules and the embeddings the spec already ships | Nothing extra |
| Phone, speech | Whisper tiny, multilingual. Moonshine tiny is 28 MB but English only; Whisper base (77 MB) if tiny proves too weak | 41 MB |
| Phone, assistant, asked first | LFM2.5-350M at 4 bits, or Gemma 3 270M (273 MB plus a 20 MB tokenizer) | 255 MB |
| Phone, optional upgrade | Qwen3-0.6B at 4 bits, today's plan | 570 MB |
| Computer | The browser's own model where it exists (Chrome desktop 148 and later; Edge in preview) and on-device speech (Chrome desktop 139 and later); otherwise the phone models on WebGPU and Whisper base | Nothing, otherwise 255 or 570 MB, plus 77 MB for speech |

Caveats:

- No independent extraction benchmark was found. Test on the golden fixtures and keep the spec's 95 percent schema gate.
- The LFM models use Liquid's own licence (lfm1.0). Read it before choosing.
- Chrome's built-in model is desktop only, with steep hardware needs. Safari has none, and WebKit opposes the API.
- Not verified: Cache API and OPFS limits, `navigator.storage.persist`, Background Fetch, resumable range requests, detecting Wi-Fi or Save-Data, and sharing a cached model across sites.

## Proposed patterns

The `rcp-` classes in [src/prototype.css](src/prototype.css) are proposals. Each moves into the design system (COMPONENTS.md, the CSS layers and the pattern library) before the app uses it, following [the steps for adding a pattern](../../../packages/design-system/COMPONENTS.md#add-or-change-a-pattern). The `proto-` classes are the prototype's own chrome and never move.

| Pattern | Prototype class | Level | Job |
|---|---|---|---|
| Conversation and Composer | `rcp-convo-log`, `rcp-composer` | Organism | The intake as short questions and answers, voice first, with typing and files beside it and words that can be changed |
| Share card | `rcp-share-card` | Card variant | What matches, what sharing opens, and the email field and code step in one card |
| Filter bar and Menu | `rcp-filterbar`, `rcp-menu` | Organism | Search, filter menus in popovers, sort and removable chips, the same on every list |
| Tooltip | `rcp-tooltip` | Molecule | A native hint popover shown by interest in its trigger, with a fallback |
| Team slots | `rcp-slots` | Organism | A fund's asks, candidates per ask, the team's fit and one request for all |
| Record list | `rcp-ledger` | Molecule | The assistant record as rows, with where each step ran |
| Footer | `rcp-footer` | Organism | The same links on every page, slim on the focused steps |
| Backdrop | `rcp-backdrop` | Template part | The woven-thread canvas behind the home page |

Kept from version 3: Card grid, Media, Link preview, Hero band, Steps, Kinds of support, Ask card, Preview card, Sheet, Inline field, Toast, Account button, Two-column detail and Work tag. Kept from version 2: File field, Card form, Chip row and Holdings; Recorder and Pairing now live inside the Composer and Team slots. Withdrawn: List toolbar (into the Filter bar), Veiled card and Directory filters.

## Usability round

Phase 0 includes one usability round before 30 November. The participants, script, task cards, measures and debrief are in the notes' Usability script tab, in [src/notes.html](src/notes.html), and follow [usability-testing.md](../../../packages/design-system/principles/usability-testing.md). Run it on the prototype, or on the app for any step the app already does.
