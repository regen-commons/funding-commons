# Decisions from the prototype reviews

The maker (the lead builder, who holds the design for now; see D11 in [open decisions](../open-decisions.md)) walked through the [prototype](README.md) twice: version 2 on 3 November 2026 and version 3 on 4 November 2026. They then answered four questions, on the adding flow, filters, several partners for one fund and images. Version 4 shows every decision below.

Step 0 places the plan changes in the PRD and 08, appends DL-019 to DL-029, and records the questions with recommendations and owners in open decisions. Product-wide choices remain proposed for the council; locked log entries record the maker's design confirmation, not completed patterns. Each row links its current placement and names the work still due. Pattern guidance and technical contracts move with the implementation steps in the [handover](../handover/03-interface-implementation.md#then-build-in-this-order-one-small-draft-pull-request-each). Three decisions change existing guidance, marked **Changes**.

The canonical files are [DESIGN.md](../../../DESIGN.md), [COMPONENTS.md](../../../packages/design-system/COMPONENTS.md), [VOICE.md](../../../packages/design-system/brand/VOICE.md), the [decision log](../../../packages/design-system/decision-log.md), the [review checklist](../../../packages/design-system/principles/ui-review-checklist.md), the [PRD](../04-prd.md), [08 Saving and accounts](../08-accounts-and-saving.md), the [technical specification](../05-technical-spec.md) and [open decisions](../open-decisions.md).

## Layout and lists

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 1 | **Use the width.** On wide screens, partners, funding and initiatives are card grids with columns of at least 18 rem. Cards in a row share one height, with their actions at the bottom. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: DESIGN.md layout and COMPONENTS.md Card grid. |
| 2 | **One left edge.** Every page lines up with the logo. Only the home hero and empty states are centred, so `rc-narrow` stops centring. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: DESIGN.md and `css/templates.css`. |
| 3 | **Partners and Funding are separate pages,** never tabs. The navigation is Home, Partners, Funding and Initiatives. | [PRD 6.3](../04-prd.md#63-what-the-user-sees-after-finishing), [DL-024](../../../packages/design-system/decision-log.md#dl-024-one-filter-bar-and-separate-list-pages). Step 1: COMPONENTS.md and routes. |
| 4 | **One filter bar on every list.** Search, then filter buttons that open small menus, then sort. Chosen filters show as removable chips with a count ("3 of 7 initiatives"). The kinds-of-support filter looks in offers, needs or both. Once a person has an initiative, Partners adds "Offers what you need" and "Needs what you offer". | [PRD 6.3](../04-prd.md#63-what-the-user-sees-after-finishing), [DL-024](../../../packages/design-system/decision-log.md#dl-024-one-filter-bar-and-separate-list-pages). Step 1: Filter bar replaces Directory filters in COMPONENTS.md. |
| 5 | **Align what people compare.** Card titles take two lines, so the fit line sits at the same height across a row. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: COMPONENTS.md Card. |
| 6 | **A footer on every page:** Weave (describe, Partners, Funding, Initiatives), Your data (What we store, What the assistant did, Settings) and Regen Commons (website, membership, data policy). The focused steps get a slim row. | [DL-028](../../../packages/design-system/decision-log.md#dl-028-no-decorative-labels-and-a-footer-on-every-page). Step 1: COMPONENTS.md Footer. |
| 7 | **Home in five parts:** the hero, three numbered steps (the first is the way in), the eight kinds of support, recently shared initiatives, and funding closing soon (the three funds closing first, with days left). | [PRD 6](../04-prd.md#6-experience). Step 2: the home example and app page. |

## Words and pictures

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 8 | **No decorative labels above headings.** No small-capital kickers or eyebrows: a heading and one line. Labels that stay are sentence case. **Changes** how the Eyebrow pattern is used: keep it only where it carries a fact no heading can. | [DL-028](../../../packages/design-system/decision-log.md#dl-028-no-decorative-labels-and-a-footer-on-every-page). Step 1: DESIGN.md, VOICE.md and COMPONENTS.md Eyebrow. |
| 9 | **Say less, show more.** One line under a heading; the rest behind a link or in a pop-up. Initiatives carry photographs and funding does not. External links show as link previews. | [PRD 6.3](../04-prd.md#63-what-the-user-sees-after-finishing) places the public-page requirements; [D30](../open-decisions.md#for-the-builders) owns images. Steps 1 and 6: COMPONENTS.md Media and Link preview, with no third-party app images until decided. |
| 10 | **The eight kinds by their own names:** Living, Material, Intellectual, Experiential, Social, Financial, Cultural and Spiritual as titles, with the plain meaning beneath and more in a tooltip. **Changes** VOICE.md's plain-name table for these eight and revisits DL-014. | [DL-026](../../../packages/design-system/decision-log.md#dl-026-the-eight-kinds-by-their-own-names), [T3](../open-decisions.md#waiting-on-people). Step 2: VOICE.md's eight titles. |
| 11 | **Tooltips explain compact signs.** Capital tiles, kind tags, type-of-work tags and fit lines open a tooltip on hover or focus, through `interestfor` and a hint popover, with a small fallback. The same words reach screen readers. | [DL-027](../../../packages/design-system/decision-log.md#dl-027-tooltips-pop-ups-for-small-tasks-and-settings-in-place). Step 1: COMPONENTS.md Tooltip and its fallback. |
| 12 | **Type-of-work tags** carry an icon each and an outlined style, so they read apart from themes and kinds of support. Two icons are proposed for the sprite, `rcp-research` and `rcp-culture` in `src/page.template.html`. | Pending Step 1: COMPONENTS.md Work tag and `brand/icons.svg`. |

## Describing an initiative

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 13 | **Describing is a conversation led by voice.** The assistant asks one short thing at a time. A large Speak button comes first, typing sits below it for when speaking is not possible, and files or links can be added at any point. People can change their words after. When enough is in, Build my card reads everything on the device and works out the key details, themes and structure. The card fills in beside the conversation. Supersedes version 3's form with a live preview. | [PRD 6.1 and 6.2](../04-prd.md#61-principles), [DL-022](../../../packages/design-system/decision-log.md#dl-022-describing-is-a-conversation-led-by-voice). Step 3: COMPONENTS.md Conversation and Composer; script question in D36. |
| 14 | **Needs and offers the same way.** Each need or offer appears as a card beside the conversation as it is said, with Keep, Change and Remove. At most five of each, with a counter ("3 of 5"). When more are heard, the first five show and the page says so. | [PRD 6.2](../04-prd.md#62-the-three-step-conversation) and [R3](../04-prd.md#7-functional-requirements), [DL-023](../../../packages/design-system/decision-log.md#dl-023-needs-and-offers-carry-every-applicable-kind-five-of-each-at-most). Step 4: Ask card and spec's six-card extraction limit. |
| 15 | **A need or offer shows every kind of support it carries,** all alike, and the form asks for every kind that applies. The data model already allows several (`capital_forms` is an array). | [PRD R3](../04-prd.md#7-functional-requirements), [DL-023](../../../packages/design-system/decision-log.md#dl-023-needs-and-offers-carry-every-applicable-kind-five-of-each-at-most). Step 4: Ask card and spec's four-kind schema cap. |
| 16 | **The download is optional and sold as privacy:** "Keep your words on this device", the size for this device, nothing without a tap, resumable and removable in Settings. The keyword draft works meanwhile. Proposed sizes are under [A smaller download](#a-smaller-download). | [PRD R9](../04-prd.md#7-functional-requirements), [D32](../open-decisions.md#for-the-builders). Step 3: technical specification AI pipeline after model and size validation; removal UI in Step 8. |

## Saving, sharing and partners

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 17 | **Two ways to be on Weave:** "Private, for finding funding" (only you see it, and funding matches still work) and "Shared with the community" (a public page and a place in the directory). Replaces the three visibility levels in R27 and 08. | [08 Lifecycle](../08-accounts-and-saving.md#lifecycle), [PRD R27](../04-prd.md#7-functional-requirements), [DL-020](../../../packages/design-system/decision-log.md#dl-020-two-ways-to-be-on-weave), proposed in D26. Step 7/server track: align the spec's visibility and RLS after council confirmation. |
| 18 | **Partners are for shared initiatives.** A private initiative sees funding, the number of partner matches and how to share. Names, cards and introductions open once it is shared, as R16 and R43 say. Team slots show a private initiative counts, never names. Supersedes version 3's "partners after saving" and the veiled card. | [PRD 6.3 and R16](../04-prd.md#63-what-the-user-sees-after-finishing), [08](../08-accounts-and-saving.md#lifecycle), [DL-019](../../../packages/design-system/decision-log.md#dl-019-partners-are-for-shared-initiatives), [T8](../open-decisions.md#waiting-on-people); council D27. Step 6: interface and spec's teaser wording. |
| 19 | **One email door.** Anything that needs an email (save, share, remind, introduce) saves the initiative to that email. Once signed in, the action just happens: Remind me turns the reminder on. | [08 The flow](../08-accounts-and-saving.md#the-flow), [PRD R36 to R39](../04-prd.md#7-functional-requirements), [DL-021](../../../packages/design-system/decision-log.md#dl-021-one-email-door-with-saving-where-the-reason-is), proposed in D28. Step 7: typed adapter; live sign-in and email remain the server track. |
| 20 | **Save where the reason is.** The email field and the code step sit in the share card that says what saving or sharing opens, on Finish and on Partners before sharing. | [08 When we ask](../08-accounts-and-saving.md#when-we-ask), [DL-021](../../../packages/design-system/decision-log.md#dl-021-one-email-door-with-saving-where-the-reason-is) refines DL-018. Steps 4 and 6: Share card; Step 7: email flow. |
| 21 | **Several partners for one fund: team slots.** A fund lists what it asks from partners. Each ask shows candidates to pick, a team fit sums up the picks, and one button asks them all for introductions. Funding cards say how many asks the list could cover. Extends R14's "one or two partners". | [PRD R14](../04-prd.md#7-functional-requirements), [DL-025](../../../packages/design-system/decision-log.md#dl-025-team-slots-for-several-partners-per-fund), [D29](../open-decisions.md#for-the-builders). Step 5: Team slots and spec 7.4; asks remain labelled fixtures. |
| 22 | **Once signed in,** the header shows Saved and an account button that leads to Settings. | [08 The flow](../08-accounts-and-saving.md#the-flow). Step 1: COMPONENTS.md App header; live state waits for the sign-in adapter. |

## Pop-ups and settings

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 23 | **Small tasks and information open over the page.** Sign in, save, sharing, delete, What we store and the assistant record open as a dialog on wide screens and a sheet from the bottom on phones. The unprompted save prompt on Finish stays inline (DL-018). **Changes** the Code panel's "never a modal" and the Dialog's "never for saving" in COMPONENTS.md. | [PRD R38](../04-prd.md#7-functional-requirements), [08](../08-accounts-and-saving.md#when-we-ask), [DL-027](../../../packages/design-system/decision-log.md#dl-027-tooltips-pop-ups-for-small-tasks-and-settings-in-place). Steps 7 and 8: Dialog, Sheet, Code panel, app dialect and related checklist guidance. |
| 24 | **What we store is five short answers,** about 55 words, with a link to the full data policy. **The assistant record** is one summary line, then one row per step with where it ran and how many words went to the cloud, never the text. | [08 What we store and what the assistant did](../08-accounts-and-saving.md#what-we-store-and-what-the-assistant-did). Step 8: COMPONENTS.md Record list and local record; cloud audit alignment remains D35. |
| 25 | **Settings are set in place.** Who can see the initiative and which emails arrive change where they are shown. Assistant, Appearance and Your data follow. Signing out and deleting sit at the bottom under Leave, set apart. Membership moves to the footer. | [DL-027](../../../packages/design-system/decision-log.md#dl-027-tooltips-pop-ups-for-small-tasks-and-settings-in-place), [08 membership](../08-accounts-and-saving.md#accounts-are-not-membership). Step 8: COMPONENTS.md Settings template. |

## From the first review, still standing

| # | Decision | Canonical placement and remaining work |
|---|---|---|
| 26 | **Equal heights.** A field and its button share the large control height (`--control-lg-height`), and the steps of one flow keep one height, so nothing jumps. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: COMPONENTS.md Inline field and review checklist. |
| 27 | **Motion says what changed.** Screens cross-fade, cards rise in a few at a time, linked cards lift on hover, sheets slide and confirmations arrive as a toast. Durations and easing are tokens, and all of it stops under reduced motion. The woven-thread backdrop behind the home page is the only decoration. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: DESIGN.md motion; Step 2: still backdrop under reduced motion. |
| 28 | **Phone first, without jumps.** New screens start at the top with the heading focused, and the hero stays short on phones. | [DL-029](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review). Step 1: review checklist; Step 2: home hero. |

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

Entries placed after DL-018 in Step 0. Product-wide choices stay proposed for the council; locked entries record the maker's design confirmation.

| Entry | Rows | Status |
|---|---|---|
| [DL-019: Partners are for shared initiatives](../../../packages/design-system/decision-log.md#dl-019-partners-are-for-shared-initiatives) | 18 | proposed |
| [DL-020: Two ways to be on Weave](../../../packages/design-system/decision-log.md#dl-020-two-ways-to-be-on-weave) | 17 | proposed |
| [DL-021: One email door, with saving where the reason is](../../../packages/design-system/decision-log.md#dl-021-one-email-door-with-saving-where-the-reason-is) | 19, 20 | proposed |
| [DL-022: Describing is a conversation led by voice](../../../packages/design-system/decision-log.md#dl-022-describing-is-a-conversation-led-by-voice) | 13 | locked |
| [DL-023: Every applicable kind, five of each at most](../../../packages/design-system/decision-log.md#dl-023-needs-and-offers-carry-every-applicable-kind-five-of-each-at-most) | 14, 15 | locked |
| [DL-024: One filter bar and separate list pages](../../../packages/design-system/decision-log.md#dl-024-one-filter-bar-and-separate-list-pages) | 3, 4 | locked |
| [DL-025: Team slots for several partners per fund](../../../packages/design-system/decision-log.md#dl-025-team-slots-for-several-partners-per-fund) | 21 | locked |
| [DL-026: The eight kinds by their own names](../../../packages/design-system/decision-log.md#dl-026-the-eight-kinds-by-their-own-names) | 10 | locked |
| [DL-027: Tooltips, pop-ups and settings in place](../../../packages/design-system/decision-log.md#dl-027-tooltips-pop-ups-for-small-tasks-and-settings-in-place) | 11, 23, 25 | locked |
| [DL-028: No decorative labels and a footer](../../../packages/design-system/decision-log.md#dl-028-no-decorative-labels-and-a-footer-on-every-page) | 6, 8 | locked |
| [DL-029: Layout and motion from the first review](../../../packages/design-system/decision-log.md#dl-029-layout-and-motion-from-the-first-review) | 1, 2, 5, 26, 27, 28 | locked |

## Questions for open decisions

Each now has a recommendation and owner in [open decisions](../open-decisions.md).

1. **Where do a fund's asks come from?** Team slots need structured partner requirements; the catalog has free-text eligibility today. Assistant proposals checked by a steward, or steward entry? Tracked as **D29**, including the team scoring contract.
2. **The kinds' names.** Framework names reverse the plain-name rule for these eight. Compare both with people in **T3**.
3. **The conversation's questions.** Fixed script or model-chosen from missing details? The prototype uses a fixed script. Tracked as **D36**.
4. **Images in the app.** Upload, site preview or both, and who checks them? Tracked as **D30**.
5. **Can a shared initiative go back to private** while introductions are open? The prototype allows it and keeps open introductions. Tracked as **D31**; this is not a confirmed live privacy policy.
6. **Download sizes.** Confirm the [model proposals](#a-smaller-download) with the technical specification owner. Tracked as **D32**, with real-user evidence needed by 20 November 2026.
7. **Still open from version 2:** directory navigation label (**T9**); per-field cloud consent omitted by the prototype (**D35**); typed public locations versus derived place proposals in R4 (**D33**); visitor Funding's unranked catalog (**D34**); Keep all and pencil against ink (**T5**); and six or eight code digits (**D14**, six as the labelled prototype default).

## What the plan needs to change

Placed in Step 0:

- **[08](../08-accounts-and-saving.md):** two visibility choices, partners only after sharing, one email door and the share card replace three labels and separate resumptions. The storage-evicted row distinguishes saved initiatives from the lost local draft. Single-fund reminders move into the Phase 0 proposal (D28); weekly updates stay Phase 1. The short privacy answers and local assistant record are placed, with the cloud audit boundary still explicit.
- **[PRD](../04-prd.md):** separate Partners and Funding pages, the share card in R16, two visibility choices in R27, team slots in R14, voice-led conversation in 6.1 and 6.2, five needs and offers with every applicable kind in R3, optional downloads in R9, and explicit versus unsolicited save presentation in R38. Scale leaves R2 and 6.2 because it repeats place and stage and cannot be corrected meaningfully. Home's five parts are in section 6.
- **Decision log and questions:** the eleven linked entries above and D26 to D36, with T3, T5, T8 and T9 and the existing D14. Recommendations and owners do not resolve the questions.

Still to place with implementation:

- **COMPONENTS.md and app dialect:** Code panel's "never a modal", Dialog's "never for saving" and the dialect's blanket exclusion conflict with row 23. Steps 7 and 8 narrow them with the new patterns; Step 1 adds the filter bar, tooltip, footer, media and navigation changes, and Step 5 adds Team slots. The example pages still show Places in navigation, outside Phase 0.
- **DESIGN.md, VOICE.md and review checklist:** layout, motion, factual labels only, the eight framework titles, overlays and the new review rules move with their patterns from Step 1 onward; the eight titles land in Step 2. No token or CSS change is part of Step 0.
- **Data and technical specification:** D29 owns structured fund requirements and team scoring beyond the current two-partner limit. Step 4 aligns the six-card extraction limit to five and the four-kind schema cap to all eight. Step 7/server track aligns visibility and RLS after D26; Step 6 reconciles count-only Partners with the spec's teaser. D35 aligns per-field consent and the local assistant record with server consent and call auditing before cloud integration.
- **AI pipeline:** Step 3 validates the proposed sizes below (D32) and corrects `SpeechRecognition.available()` with its required `langs` option. The pattern library's "about 40 MB" notice describes the existing embeddings tier, not the assistant. Dependencies, model hosting and CSP changes need separate approval.
- **`css/base.css`:** Step 1 fixes the box-sizing rule, which lists elements by name and leaves out `span` and `p`, so a padded span sized to its container overflows.

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
