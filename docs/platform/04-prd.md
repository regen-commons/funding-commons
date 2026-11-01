# Product requirements: Regen Commons Tend (working name)

Status: draft for council review · Author: Afolabi Aiyeloja with Claude · Date: 2026-10-31
Companion documents: [proposal brief](01-proposal-brief.md) · [business model canvas](02-business-model-canvas.md) · [logical architecture](03-logical-architecture.md) · [technical spec](05-technical-spec.md) · [research digest](06-research-digest.md) · [agent scaffolding](07-agent-scaffolding.md) · [saving and accounts](08-accounts-and-saving.md) · [open decisions](open-decisions.md) · [design system](../../DESIGN.md)

## 1. Summary

Funding Commons today is a browser-local directory of 699 funders and 768 programs with local-AI ranking against a project profile. This revamp turns it into a place where regenerative initiatives say who they are, what they need and what they can offer across eight forms of capital, and get matched to partners and to funding opportunities, both alone and in partnership. Curation is organised by bioregion and watershed and across five lenses: art and culture, research, technology, place-based community, and funders.

The product promise in one line: tell us about your work in three short conversations, and we will show you who to work with and what to apply for, together.

## 2. Problem

- Initiatives write the same proposals in parallel, compete for the same pools and rebuild partnerships from scratch each cycle. The September 2026 "Regen Partnerships & Funding Hub" Google Doc was built to fix this by hand; it has seven initiative rows, forty funders and eight partnership calls, and it is hard to navigate and keep fresh.
- Funders see financial need but not the material, intellectual, social, cultural, experiential, living and spiritual capital that place-based work already holds. Stewards raised this directly on the October council sync: many groups doing the most important work are hard for funders to read, because their work is diversified and they will not narrow it to chase a fund.
- Funding calls increasingly ask for cross-discipline teams (a place-based pilot, a research partner, a tooling provider, a cultural component). Nobody can see at a glance who would complete whom.
- Static lists get little uptake. A grants doc shared in mid-2026 drew no responses; live calls and a weekly pulse do better.
- Data entry is the enemy. Forms with twenty fields are abandoned, and scraped initiative data goes stale and annoys the people it describes.

## 3. Goals and non-goals

Goals

1. An initiative can be captured in under ten minutes on a phone, by talking, typing or dropping a deck or website link, in three steps: initiative, needs, offers.
2. Every need and offer carries forms of capital and place, so matching works on complementarity, not just keywords.
3. Each initiative sees ranked partners and ranked opportunities, with an explicit "stronger together" score and a suggested partner set for each opportunity.
4. Bioregion and watershed are first-class ways to browse, curate and receive a weekly pulse.
5. Local AI by default; cloud AI only with explicit, logged consent.
6. Every record is self-submitted, dated and easy to confirm or retire, so the directory stays trustworthy.
7. The platform feeds the Regen Commons membership funnel and is stewarded through the existing steward desk.
8. Records are portable and interoperable (open schemas, open identifiers), so the platform is one node among many rather than a silo.

Non-goals (for the first two phases)

- No on-chain transactions, wallets or token issuance. Commitment-pooling interoperability is designed for, not shipped, until Phase 3.
- No automated scraping of initiatives from other directories.
- No replacement for funders' own application portals; the platform points at official calls and keeps its "opportunity is not eligibility" stance.
- No public contact details. Introductions are relayed with consent.
- No single-issue taxonomy. Initiatives are described in their own words, with tags as an index, never as the identity.

## 4. Users and jobs to be done

| Who | Job to be done | Today | With the platform |
|---|---|---|---|
| Place-based initiative (community hub, restoration crew, agroecology coop) | Find money and partners for the next chapter without a grant writer | Word of mouth, Telegram, one-off calls | Three-step intake by voice, weekly pulse, partner suggestions, recipes to join |
| Technology or tooling builder (Green Goods, Gardens, Coop) | Find communities to pilot with and co-applicants for ecosystem grants | Cold outreach | Offers of tooling matched to needs for tooling; opportunity matches that need a tech partner |
| Researcher or academic (Metagov, universities, methodology groups) | Find place-based partners and funders that want a research component | Conference serendipity | Offers of research capacity matched to needs; research-flavoured opportunities |
| Artist, storyteller, culture bearer | Join regenerative work with cultural and spiritual capital; find funds that value it | Mostly invisible to funders | Culture lens in curation, culture-tagged offers and opportunities |
| Funder, allocator, round operator, bioregional financing facility | Find ready partnerships and understand regional needs | Inbound applications | Browse initiatives and needs by region and theme; publish calls; see what a region needs |
| Network stewards (Regen Commons council, Bloom, Greenpill, ReFi DAO, Regen Coordination) | Keep the commons tidy, run challenges, make the network legible to funders | Spreadsheets and docs | Steward desk views, regional curation, challenge cohorts, exports |

Personas are deliberately framed by lens rather than by organisation type, because curation and recipes use the same five lenses: art and culture, research, technology, place-based community, funders.

## 5. Core concepts and vocabulary

- Initiative: a project, organisation, collective or place-based effort. Four public fields: name, location(s), description, links. Everything else is derived and editable. It starts as a draft in the browser, becomes private when saved, and is shared only if its owner chooses. See [saving and accounts](08-accounts-and-saving.md).
- Need: something an initiative is looking for, with one or more forms of capital, a place scope, a timeframe and the exchange terms it would accept.
- Offer: something an initiative has in surplus and can give, exchange, sell or commit, with the same structure plus capacity.
- Forms of capital (from Roland and Landua, used by Regen Commons already): financial, material, living, social, intellectual, experiential, cultural, spiritual. A need or offer can carry several.
- Lenses: art and culture · research · technology · place-based community · funders. An initiative can carry several lenses; recipes use lenses as roles.
- Opportunity: a funder program or call from the existing Funding Commons catalog, with its researched eligibility, award, route and dates. Opportunity is never eligibility.
- Match: a scored, explained suggestion between an initiative and a partner, or an initiative and an opportunity. Opportunity matches show a solo score and a partnership score.
- Recipe: a partnership forming around an opportunity or a shared problem. It names the base (the opportunity or problem), the ingredients needed (lenses and forms of capital), who has joined, status (forming, drafting, submitted, funded, not this time) and a working doc. This is the Partnerships tab of the hub doc, made live.
- Place: a bioregion, subrealm, realm, watershed basin, country or a custom named place. Initiatives relate to places as based in, works in, or global.
- Pulse: the weekly email digest, personal to each initiative and region.
- Account: an email that can sign in. An account holds saved initiatives. It is not membership.
- Member: a Regen Commons member profile (existing data model). A person becomes a member only by choosing to apply.
- Steward: a council member with the existing steward role; stewards tidy, they do not filter.

## 6. Experience

### 6.1 Principles

Fun, simple, intuitive. Conversation over forms. Speak or paste first, edit second. Show value before asking for anything. Mobile first. Progress saved locally so nothing is lost. Everything the AI derives is shown as an editable card, never silently applied. Plain language in the Regen Commons voice: warm, second person, no jargon, with botanical language kept to places where nothing depends on it.

All interface work follows [DESIGN.md](../../DESIGN.md) and the three books it applies: *Don't Make Me Think* for how people use it, *Refactoring UI* for how screens show what matters, and *Atomic Design* for how the system stays whole. Labels use the plain names in [VOICE.md](../../design-system/brand/VOICE.md). Domain terms in this document, such as recipe, pulse and lens, are not necessarily what people read.

### 6.2 The three-step conversation

The guide is a small conversational panel ("the Gardener" in prototypes; name to be decided) with a text box, a microphone button and an attach button. Each step has a goal, a few guiding prompts, and a confirmation card.

Step 1, Your initiative. Prompt: "Tell me about your work the way you would to a friend outside the movement." Inputs: free text, voice (transcribed locally), a website or social link (fetched server-side and summarised), an uploaded deck or PDF (parsed locally). Output card with the four public fields: name, location(s) (free text; "global" allowed; multiple places allowed; an optional map pin or place search attaches bioregion, subrealm, realm, watershed and country chips), description (two to four sentences in the initiative's own words, lightly edited), links. Hidden derived fields shown as chips to confirm or remove: stage (seed, sprout, flowering, tree), lenses, themes (aligned with the funder catalog's theme vocabulary), beneficiaries, languages, scale. Optional eligibility details (legal form, registration country, applicant type, funding instruments preferred) are offered as "this helps us screen funds for you" and can be skipped.

Step 2, Your needs. Prompt: "What would unlock the next chapter?" Guidance text and examples: money with an amount and purpose; a co-applicant with a specific profile; an introduction; land access; a template; a reviewer; volunteers; equipment; a fiscal host. The guide listens, drafts two to five need cards and asks for confirmation. Each card: title, one-line description, forms of capital, amount and currency (financial only), timeframe and urgency, place scope (here, our region, anywhere), exchange terms acceptable (gift, exchange, paid, commitment, open), what you would do with it. The guide nudges once: "Most initiatives need financial capital. What else would help?"

Step 3, Your offers. Prompt: "What do you have in surplus?" Guidance by form of capital: a track record with a funder (social), a methodology (intellectual), land or a venue (living, material), a workshop you run (experiential), a story or art practice (cultural), a ceremony or practice of care (spiritual), a tool or dataset (intellectual, material). Each offer card: title, description, forms of capital, capacity (how much, how often), place scope, terms (gift, exchange, paid, commitment), who it is for.

Finish. First matches come first, with "your card" beside them. Then three separate decisions, not one form. Keep it: an email and a code save a private copy. Who can see it: Only you (the default), People signed in, or Anyone. Sharing onward: open networks such as Murmurations and the knowledge commons, off by default. A draft never requires an email and lives in the browser until saved. See [saving and accounts](08-accounts-and-saving.md).

Each step must be completable by voice only, by typing only, and by upload only. Each step must work with no AI at all (plain fields with sensible defaults) so the product never blocks on a model download.

### 6.3 What the user sees after finishing

- Matches: two tabs, Partners and Opportunities. Partner cards show why (a need you have that they offer, an offer you have that they need, shared place, shared theme, complementary lens) and a strength band. Opportunity cards show the solo fit and readiness from the existing engine, plus "stronger with" one or two suggested partners and the reason (covers a requirement, brings a missing lens, is in the required geography). Actions: save, dismiss with reason, say hello (consented introduction relay), open a recipe.
- Recipes: open a recipe from an opportunity or a problem; name the ingredients needed; others join with what they bring; a working doc link; status. Recipes are visible to members by default and optionally public.
- Places: a bioregion or watershed page lists initiatives, open needs, offers, opportunities with regional scope, and recipes forming. Later it carries a synthesised "needs of this place" summary built from consented records.
- Directory: the existing funder directory stays, with the matching panel pointing at the user's initiative instead of a local project profile.
- Pulse: a weekly email per initiative: new partners, opportunities closing within three weeks in your themes and places, needs in your watershed you could meet, recipes that need your ingredient, and a one-tap "still accurate" link that refreshes the record's confirmed date.

### 6.4 Steward experience

New sections in the existing steward desk: Initiatives (list, detail, verify, merge duplicates, hide with reason, revision history), Needs and offers (flag, hide), Opportunities (the existing Monday discovery and Thursday freshness workflow stays in the repository; the desk shows the catalog state and lets stewards pin regional or thematic highlights), Recipes (support, close), Matching (quality feedback counts, dismissed reasons, weights preview), Pulse (preview, pause, regional pulses), Challenges (create a time-boxed cohort; track groups formed). Steward actions keep the existing pattern: revision checks, mandatory private reasons, audit events, idempotent commands.

### 6.5 Accessibility and devices

Mobile first, with the full three-step flow usable at 360 px wide. Keyboard and screen-reader paths for every action. All animation respects reduced motion. Voice is optional and never the only route. Model downloads are explicit, show their size first and can be cancelled. Supported targets: current Chrome and Edge on desktop and Android, Safari 26 on iOS and macOS, Firefox desktop. Minimum-capability devices get keyword matching and plain forms with no degradation of core tasks.

## 7. Functional requirements

Requirement identifiers are stable so the technical spec and tests can reference them.

Intake and records

- R1 Three-step intake with voice, text, link and file input; each step independently savable; drafts stored locally without sign-in.
- R2 The four public initiative fields plus derived chips (stage, lenses, themes, beneficiaries, languages, scale) and optional eligibility details.
- R3 Need and offer cards with forms of capital (multi-select of eight), place scope, timeframe or capacity, exchange terms and status (open, met, withdrawn, expired).
- R4 Location capture that accepts free text, "global", multiple places, and an optional pin or place search; the system attaches bioregion, subrealm, realm, watershed basin and country, shown as removable chips.
- R5 Editing after saving with revision history; records show last confirmed date; records unconfirmed for 180 days are marked "may be out of date" and excluded from pulse suggestions until confirmed.
- R6 Import of the September 2026 hub doc rows and the existing local project profiles as unconfirmed records for their owners to claim. Imported records show in pencil until claimed.

AI assistance

- R7 Local transcription of voice notes; multilingual by default; audio never leaves the device unless the user opts into cloud transcription.
- R8 Local extraction of the initiative draft, need cards and offer cards from text, transcript or parsed documents, constrained to the platform's schemas; every derived field is shown for confirmation.
- R9 Capability detection that chooses a local tier (browser model, desktop WebGPU model, mobile WebGPU model, WASM keyword mode) and shows the user which tier is active and what it costs to download.
- R10 Consented cloud fallback for extraction and transcription: default off; consent per session or per field; the dialog names provider, model, region, retention and exactly what is sent; a consent and call ledger the user can view and export.
- R11 Heuristic (no-model) fallback that still produces valid cards from keywords and simple rules.

Matching

- R12 Partner matching that scores complementarity (my needs against their offers), reciprocity (their needs against my offers), place affinity, theme overlap and lens complementarity, with a plain-language reason for each suggestion.
- R13 Opportunity matching that reuses the existing thematic-fit, readiness and research-priority engine for the solo score.
- R14 Partnership scoring: for each strong-but-gated opportunity, identify the gaps (requirement, geography, lens) and propose one or two partners that close them, with a partnership score and reasons.
- R15 Feedback loop: save, dismiss with reason, and introduction outcomes are recorded and used to tune weights; exposure caps keep any one initiative or funder from dominating pulses.
- R16 Matching runs for drafts in the browser against shared records, so a visitor sees value before giving an email. Saved private initiatives keep one-way matches and never appear in anyone else's.

Places and curation

- R17 Reference places: bioregions, subrealms, realms (One Earth or ecoregion equivalent), watershed basins (HydroBASINS levels 5 to 7), countries, and steward-defined custom places (a valley, a city region, an island).
- R18 Place pages with initiatives, needs, offers, opportunities, recipes and later a synthesised needs-of-the-place summary with sources.
- R19 Five-lens curation on every list; recipes name lenses as roles.
- R20 Steward highlights: pinned opportunities and recipes per place and lens, with an expiry.

Recipes and introductions

- R21 Recipes with base (opportunity or problem), ingredients (lenses, forms of capital, specific asks), lead, joiners, status, deadline and working doc; join and leave; stewards can close.
- R22 Introduction relay: "say hello" sends a message through the platform; contact details are shared only when both sides accept.

Pulse and notifications

- R23 Opt-in weekly pulse per saved initiative, off by default, with new partners, closing opportunities, regional needs, recipes needing an ingredient, and the "still accurate" confirmation; unsubscribe and frequency controls; regional pulses for stewards and funders who opt in.
- R24 Transactional emails: sign-in code, introduction requests and acceptances, recipe updates, steward notices.

Accounts, membership and access

- R25 Email plus one-time code sign-in using the shared Regen Commons Supabase Auth project; no passwords; no third-party sign-in; asks for an email and nothing else.
- R26 A platform profile per account, linked to a Regen Commons member profile only when one exists; a separate "apply for membership" path that pre-fills the six-step application from the initiative, offered in context and never straight after saving.
- R27 Visibility levels: private, network and public, chosen by the owner, with private as the default; and sharing scopes: open directory networks, knowledge commons, off by default. Changing scope stops future sharing and emits a retraction event to connected networks. Stewards cannot read private initiatives.
- R28 Access tiers configurable by stewards: open (anyone can browse, save and share), members-first (saving open, matches and pulse for members and people who have applied), members-only (whole platform behind membership). Phase 0 and 1 run open; the council can tighten later without a code change.

Interoperability and knowledge

- R29 Public records exportable as JSON, CSV and as profiles in the Murmurations organisations and offers-and-wants schemas; the platform publishes consented public profiles to the Murmurations index.
- R30 Every public record has a stable reference identifier (an ORN in a `regencommons` namespace) and a content hash, and the platform can act as a KOI partial node that publishes new, update and forget events for consented records.
- R31 Export of candidate knowledge objects (initiatives as organisations, places, funding mechanisms, recipes outcomes as case studies) in the Regen Knowledge Commons base shape, for review, never direct publication.
- R32 Offers can be marked as offerings with the fields a commitment-pool voucher needs (unit, capacity, place, timing, restrictions, terms), and accepted exchanges can be recorded as commitments (proposed, accepted, fulfilled, discharged) off-chain, so a later pool integration needs no data migration.

Stewardship and operations

- R33 Steward desk sections listed in 6.4, built on the existing revision, reason and audit pattern.
- R34 Funder catalog pipeline unchanged in substance: Monday discovery and Thursday freshness produce reviewed pull requests; the platform imports the published catalog on deploy and on a schedule.
- R35 Metrics for stewards and funders: initiatives shared, needs met, introductions accepted, recipes submitted and funded, pulse engagement, regional coverage; shown as counts with definitions, never as vanity dashboards.

Saving and accounts

- R36 Saving is separate from sharing: an email and a code store a private copy, with no name, password or other field requested.
- R37 Browsing, search, the full conversation, local AI, matches for a draft, copying your own draft, help and privacy pages never require an email.
- R38 The request for an email is inline, offered once per moment, and tied to what it does for the person. Declining is one tap and stays declined. No modal, wall, partial results or pre-checked box.
- R39 The code step accepts paste, keeps what was typed on error, allows fixing a wrong email and resending after 60 seconds, survives a round trip to the mail app, and then resumes the action that asked for it.
- R40 Signing in merges local drafts without overwriting or duplicating. One email can hold several initiatives.
- R41 A status line always says where the work lives: on this device, or saved.
- R42 People can export everything and delete their account, which deletes private initiatives and retracts anything shared.
- R43 An introduction can share a card with one recipient after confirmation, without changing its visibility.

Design quality

- R44 Every screen is built from the design system: tokens from [DESIGN.md](../../DESIGN.md), patterns from the [inventory](../../design-system/COMPONENTS.md), words from [VOICE.md](../../design-system/brand/VOICE.md).
- R45 Every UI change passes the [five-minute review](../../DESIGN.md#how-we-follow-them). New screens pass the [checklist](../../design-system/principles/ui-review-checklist.md).
- R46 Anything the assistant derives shows in pencil until a person confirms it.
- R47 Three people test the product every two weeks through Phase 1, then monthly. Fixes follow the [testing plan](../../design-system/principles/usability-testing.md).

## 8. Quality requirements

- Privacy: drafts stay in the browser until the person saves; saved initiatives are private until the person shares them; embeddings of saved text may be stored server-side; audio and files never leave the device without explicit consent; cloud AI calls store hashes and derived fields, not raw prompts; the user can view and export their consent and AI-call ledger; retraction propagates to connected networks.
- Performance: first meaningful paint under 2 s on a mid-range Android over 4G; the directory and matching work before any model download; local extraction returns a draft within 20 s on a desktop WebGPU tier and within 60 s on the mobile tier, with the keyword fallback instant.
- Reliability: no data loss on tab close or network drop; idempotent writes; email delivery failures never lose the underlying record.
- Security: row-level security on every table; stewards authorised by the existing active-steward predicate; no service-role key in the browser; origin checks on write endpoints; rate limits on sign-in and intake; content security policy on the app shell.
- Accessibility: WCAG 2.2 AA for the intake, matches, recipes and places pages; reduced-motion honoured by all animation including canvases; text survives 200 percent zoom and the largest browser text size.
- Design system: tests fail on stale tokens, contrast below AA in either theme, raw values in CSS, undocumented patterns and copy that breaks the voice rules.
- Internationalisation: UI strings externalised from the start; transcription multilingual; Portuguese and Spanish UI by Phase 2 (Brazil and Latin America are active regions in the network).
- Openness: source code under an open licence agreed with the council (AGPL-3.0 keeps the option of reusing Coop code; see the technical spec); public data under an open data licence with attribution; schemas published.

## 9. Scope by phase

Phase names follow the Regen Commons stages of growth. Dates assume one lead builder with agentic tooling and steward time from the council; they are targets, not promises.

Phase 0, Seed (now to 14 November 2026): agent scaffolding first ([plan](07-agent-scaffolding.md)); the design system, in React on top of the CSS already defined; rebrand under Regen Commons on the chosen subdomain; three-step intake with typed input and light local extraction; needs and offers with forms of capital; public initiative directory; partner suggestions next to each fund; saving with an email code, private by default; the first usability round; import of the hub doc rows; present at the Community Spotlight on 5 November; evidence of working local AI with real users for the Mozilla Human-Scale AI application due 20 November.

Phase 1, Sprout (mid November 2026 to February 2027): voice and file input; local AI tiering with consented cloud fallback; reciprocal partner matching with reasons; opportunity partnership scoring; weekly pulse; steward desk sections; place assignment (bioregion, watershed) and place pages; Murmurations publishing; open data export; Portuguese and Spanish UI.

Phase 2, Flowering (March to June 2027): recipes with join flows and introductions relay; challenge cohorts; regional pulses for funders and stewards; knowledge commons export and KOI partial node; member-first access tier; needs-of-the-place synthesis with sources; funder accounts for publishing calls; matching feedback loop.

Phase 3, Tree (second half of 2027): offerings and commitments ledger; optional anchoring to Cosmo-Local Credit pools for a pilot bioregion; cross-pool coordination with partner networks; federation (other networks run the open-source app and exchange via KOI and Murmurations); governance of shared data under council policy.

## 10. Success measures

Measured monthly from Phase 1; targets for end of Phase 2.

- Shared initiatives: 150, across at least 12 bioregions and all five lenses.
- Saving: time from tapping save to saved on a phone under 90 seconds; people return after choosing Not now. Report the share of finished conversations that save, without a target until usability rounds give a baseline.
- Needs and offers per initiative: median 3 needs and 2 offers, at least 60 percent carrying a non-financial form of capital.
- Introductions accepted: 40 percent of requests; at least 50 accepted introductions.
- Recipes: 20 opened, 8 submitted, 3 funded or otherwise resourced.
- Pulse: 35 percent weekly open rate; 70 percent of records confirmed within 90 days.
- Local AI share: at least 80 percent of extractions and transcriptions run locally.
- Membership: count how many accounts choose to apply. No target, because a target invites pressure on people who came for something else.
- Stewardship: median time from sharing to steward review under 7 days; no record older than 180 days without a confirmation prompt.

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Builder bandwidth is thin and the plan is wide | Phase 0 is two weeks of narrow scope; every later feature ships behind a flag; the funder catalog pipeline is already automated |
| Local models are too heavy for phones | Tiering with a 570 MB mobile model, keyword fallback, and consented cloud; download size shown before fetching; home-screen install encouraged on iOS |
| Stale records | Confirmation prompts in the pulse, visible confirmed dates, exclusion from suggestions after 180 days |
| Matching feels arbitrary | Every suggestion explains itself; dismiss reasons feed weights; stewards can inspect weights and feedback |
| A new silo | Open schemas, Murmurations publishing, KOI events, export anytime, link out to existing offers-and-needs activity |
| Taxonomy flattens diverse work | Free text first, tags as index, multiple lenses, no primary category |
| Cloud AI undermines the sovereignty story | Default off, per-use consent, named provider and retention, hashes not prompts, self-hosted community inference option in Phase 2 |
| Organisational ambiguity between Regen Commons and Regen Coordination | Housed under Regen Commons as a resource open to all networks; branded as such; partner networks are member organisations |
| Shared Supabase project migration drift | One migration owner (decided in the technical spec); schema namespaced; CI applies all migrations from a clean database |

## 12. Open decisions for the council

The current list, with owners and recommendations, is in [open decisions](open-decisions.md). The original questions were:

1. Name and subdomain (recommendation and alternatives in the proposal brief).
2. Access tier at launch: open, with members-first considered for Phase 2.
3. Source licence: AGPL-3.0 (recommended if Coop code is reused) or Apache-2.0 (maximum reuse by partner networks).
4. Data licence for public records: CC BY 4.0 recommended; CC BY-SA considered.
5. Which networks are first sharing targets: Murmurations index (yes), Regen KOI node run by Gaia AI (confirm), Hylo (link only), Bloom's offers-and-needs sessions (import with consent).
6. The pilot bioregions for Phase 2 place synthesis and the Phase 3 pool pilot: candidates from existing nodes include the San Francisco Bay and Central Valley watersheds (Bloom, Regen Commons roots), Nigeria's Lagos lagoon and Niger delta regions (Tech and Sun), southern Brazil (Regen Coordination stewards), and a Central American watershed (Bloom Costa Rica ties).
