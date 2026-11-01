# Logical architecture: Regen Commons Tend (working name)

Status: draft for review · Date: 2026-10-31
Companion documents: [PRD](04-prd.md) · [technical spec](05-technical-spec.md) · [proposal brief](01-proposal-brief.md)

This document describes the shape of the system: the parts, what each owns, how data flows, and how the platform stays one node in a wider commons rather than a new centre. Technology choices and schemas are in the technical spec.

## 1. Five layers

| Layer | Purpose | Owns | Runs |
|---|---|---|---|
| Experience | The three-step conversation, matches, places, recipes, pulse | Drafts, UI state, local AI models | Browser (PWA) |
| Intelligence | Turn speech, text and documents into structured cards; score matches; explain them | Extraction contracts, matching rubric, tiering policy | Browser first; consented cloud; nightly batch |
| Records | The commons' operational truth: initiatives, needs, offers, places, programs, recipes, consents | Schema, row-level security, audit, revisions | Supabase (shared Regen Commons project) |
| Exchange | Everything that leaves or enters the platform: email, Murmurations, KOI events, knowledge commons exports, later commitment pools | Identifiers, hashes, consent scopes, retraction | Vercel functions, Edge Functions |
| Stewardship | Curation, verification, challenges, metrics, catalog research | Steward commands, pulse controls, research workflow | Steward desk on regencommons.com; repository automation |

The ordering is deliberate: a person can get value from the Experience and Intelligence layers with nothing stored anywhere but their device. Records begin only at publish. Exchange begins only with consent. Stewardship tidies; it never gates publishing in the open tier.

## 2. Context

```mermaid
flowchart TB
  P[People running initiatives<br/>place-based, tech, research, culture]
  F[Funders, allocators,<br/>bioregional financing facilities]
  S[Stewards and council]
  W((Tend<br/>tend.regencommons.com))
  RC[Regen Commons site<br/>members, join, steward desk]
  FC[Funder catalog research<br/>funding-commons repository]
  MU[Murmurations index]
  KOI[KOI network<br/>Regen KOI node, Metagov]
  KC[Regen Knowledge Commons]
  CLC[Cosmo-Local Credit pools<br/>Phase 3]
  NET[Partner networks<br/>Bloom, Greenpill, ReFi DAO,<br/>Regen Coordination, BioFi]
  P -->|describe, publish, respond| W
  W -->|matches, pulse, intros, recipes| P
  F -->|browse regions, publish calls| W
  S -->|verify, curate, challenges| W
  W <-->|shared Auth, members link,<br/>steward predicate| RC
  FC -->|released catalog| W
  W -->|consented profiles| MU
  W <-->|signed events| KOI
  W -->|review bundles| KC
  W -.->|offerings, commitments| CLC
  NET <-->|cross-posted offers and needs,<br/>regional calls, cohorts| W
```

## 3. Containers

```mermaid
flowchart LR
  subgraph Device["Person's device"]
    App[App shell<br/>React PWA]
    Guide[Conversation guide<br/>three steps]
    Workers[AI workers<br/>Whisper, extraction model,<br/>embeddings]
    Parsers[Parsers<br/>PDF, DOCX, XLSX, PPTX, OCR]
    Local[(Local store<br/>drafts, ledger, models)]
    App --> Guide --> Workers
    Guide --> Parsers --> Workers
    App <--> Local
  end
  subgraph Edge["Vercel"]
    Shell[Static assets, models, catalog snapshot]
    AIProxy[/api/ai<br/>consented cloud proxy/]
    Share[/api/share<br/>Murmurations, KOI publisher/]
    Intro[/api/intro, /api/handoff<br/>relay and membership handoff/]
    CronV[Cron: catalog import]
  end
  subgraph Data["Supabase: Regen Commons / Website"]
    Auth[Auth<br/>email code]
    DB[(Postgres<br/>schema tend + existing public/private)]
    Fn[Edge Functions<br/>send-email hook, pulse-compose, outbox-send, match-batch]
    Sched[pg_cron]
  end
  Mail[Resend]
  Desk[Steward desk<br/>/admin on regencommons.com]
  Cat[(Catalog release<br/>JSON + vectors)]

  App <--> Shell
  App <--> Auth
  App <--> DB
  App --> AIProxy
  App --> Intro
  AIProxy --> DB
  Share --> DB
  Sched --> Fn
  Fn --> Mail
  Fn --> DB
  Auth --> Fn
  CronV --> Cat
  CronV --> DB
  Desk --> DB
```

What each container owns:

- App shell: routing, theme (shared Regen Commons tokens), offline cache, capability detection, consent dialogs.
- Conversation guide: the state machine for the three steps, prompts, confirmation cards, nudges; works with any tier including "no model".
- AI workers: Whisper transcription, extraction with a small instruct model or the browser's built-in model, the embedding model already shipped by Funding Commons. Nothing in a worker touches the network except pinned model files from the app origin.
- Local store: drafts (IndexedDB), the local AI ledger, cached models (Cache API), cached public corpus for private matching.
- Vercel functions: the only places where provider keys and the KOI signing key exist. Each is a thin, auditable relay.
- Supabase: records, policies, Auth, scheduled jobs, outbox. One project shared with the Regen Commons site; platform objects in their own schema.
- Steward desk: unchanged location and login; gains sections for the platform's records.
- Catalog release: produced by the existing research workflow; the platform is a consumer.

## 4. Domain model

```mermaid
erDiagram
  PROFILE ||--o{ INITIATIVE_PERSON : "edits"
  PROFILE }o--o| MEMBER : "links to Regen Commons member"
  INITIATIVE ||--o{ INITIATIVE_PERSON : "has"
  INITIATIVE ||--o{ NEED : "states"
  INITIATIVE ||--o{ OFFER : "states"
  INITIATIVE }o--o{ PLACE : "based in / works in"
  PLACE ||--o{ PLACE : "contains"
  FUNDER ||--o{ PROGRAM : "runs"
  PROGRAM ||--o{ PROGRAM_CONDITION : "requires"
  PROGRAM ||--o{ ELIGIBILITY_RULE : "screens by"
  INITIATIVE ||--o{ MATCH : "subject of"
  MATCH }o--o| INITIATIVE : "partner"
  MATCH }o--o| PROGRAM : "opportunity"
  RECIPE }o--|| INITIATIVE : "led by"
  RECIPE }o--o| PROGRAM : "base"
  RECIPE }o--o| PLACE : "for"
  RECIPE ||--o{ RECIPE_MEMBER : "joined by"
  INITIATIVE ||--o{ INTRO : "sends / receives"
  PROFILE ||--o{ CONSENT : "grants"
  CONSENT ||--o{ AI_RUN : "covers"
  OFFER ||--o| OFFERING : "is a voucher-ready"
  OFFERING ||--o{ COMMITMENT : "fulfilled through"
  INITIATIVE ||--o{ SHARED_RECORD : "published to networks as"
```

Concepts and their owners:

- Initiative, Need, Offer: owned by the people who publish them; four public initiative fields; everything else derived and editable; dated and confirmable.
- Place: a reference, never typed free-hand into records; bioregion, subrealm, realm, basin, country, custom.
- Funder, Program, conditions, rules: owned by the research workflow; the platform reads, never edits.
- Match: computed, explained, versioned; a person's reactions (save, dismiss, contact) are owned by them.
- Recipe: a partnership forming around a base; owned by its lead; joiners bring ingredients.
- Consent and AI run: the audit spine for anything that leaves the device or the platform.
- Offering and Commitment: the bridge to commitment pooling; off-chain records with hashes until Phase 3.
- Shared record: the ledger of what was sent where, with the identifier and hash, so retraction is precise.

## 5. Flows

### 5.1 Three-step intake on a device

```mermaid
sequenceDiagram
  participant U as Person
  participant G as Guide (browser)
  participant W as AI worker (browser)
  participant C as Cloud proxy (only with consent)
  participant D as Supabase
  U->>G: talk / type / drop a deck / paste a link
  G->>W: transcribe audio (Whisper) · parse files · build text
  W-->>G: transcript + text
  G->>W: extract InitiativeDraft (schema-constrained)
  alt tier cannot run a model
    G->>G: heuristic draft from keywords
    opt person opts in
      G->>C: text only, hashed in ledger
      C-->>G: validated draft
    end
  end
  W-->>G: draft + confidence
  G-->>U: card with four fields and chips to confirm
  U->>G: edits, confirms, continues to needs and offers
  G->>W: embed initiative, needs, offers (local)
  G->>G: private matching against cached public corpus
  G-->>U: first matches before publishing
  U->>D: sign in with email code · publish (visibility, share scopes)
  D-->>U: published; nightly batch refreshes matches; pulse scheduled
```

### 5.2 Matching

```mermaid
flowchart LR
  A[Initiative A<br/>needs, offers, places, themes, lenses] --> PS[Partner score<br/>complementarity, reciprocity,<br/>place, theme, lens, freshness]
  B[(Public initiatives)] --> PS
  A --> SS[Solo opportunity score<br/>existing rubric: thematic fit,<br/>readiness, research priority]
  Pr[(Programs, conditions, rules)] --> SS
  SS -->|capped by a gap| G[Gap finder<br/>requirement, geography, lens, coverage]
  G --> PP["Partnership score<br/>combined profile re-scored,<br/>cap lifted only by the partner's attribute"]
  PS --> PP
  PS --> M[(Matches<br/>with reasons and engine version)]
  SS --> M
  PP --> M
  M --> UI[Matches view · Pulse · Recipes]
  UI -->|save, dismiss, contact| FB[Feedback]
  FB -.->|offline tuning, new engine version| PS
```

### 5.3 Consent and exchange

```mermaid
flowchart TB
  R[Record: initiative, need, offer, recipe] --> V{visibility}
  V -->|private draft| L[(Device only)]
  V -->|members| M[(Supabase, member-readable)]
  V -->|public| P[(Supabase, public API, JSON export)]
  P --> SC{share scopes}
  SC -->|murmurations| MU[Murmurations profile + index post]
  SC -->|koi| K[Signed NEW / UPDATE events to a full node]
  SC -->|knowledge_commons| KC[Review bundle for human review]
  W[withdraw or change scope] --> X[Retraction: index delete, KOI FORGET, bundle withdrawn]
  SR[(shared_records ledger: rid, hash, last event)] --- MU
  SR --- K
  SR --- KC
```

### 5.4 Weekly pulse

Composer selects eligible initiatives (published, pulse consent, confirmed within 180 days or due for a confirmation prompt), gathers new partner matches, closing opportunities in the initiative's themes and places, nearby needs its offers could meet, recipes needing its ingredient, applies exposure caps, writes one outbox row per recipient with an idempotency key, and the sender delivers through Resend in batches with retries. Every pulse carries the one-tap "still accurate" link that refreshes the record's confirmed date.

## 6. Decentralisation posture

The council's open question was how to avoid building a new centre. The answer is structural, not aspirational:

1. Local first. Drafts, transcription, extraction, embeddings and private matching run on the device. A person can use the conversation and see matches without an account.
2. Owned records. People publish their own records, see where they went, and can withdraw them; retraction propagates to every network they were shared with.
3. Open identifiers and schemas. Every public record has a stable reference identifier and a content hash; profiles are published in Murmurations schemas; exports are JSON and CSV; vocabularies are published.
4. One node among nodes. The platform is a KOI partial node (publisher) and a Murmurations publisher; it does not try to be the index. Knowledge enters the Regen Knowledge Commons only through that project's review, never by direct write.
5. Forkable. Open-source code, an open data licence and a documented deploy let another network run its own instance with its own Supabase project; instances exchange through the same open channels. The Regen Commons instance is the first, not the only.
6. Commons-held operations. The shared Supabase project, the steward predicate and the catalog research live under Regen Commons governance (council, members, stewards) with a published policy for data, consent and retraction.

Where KOI and Coop come in:

- KOI gives the reference-identifier discipline and the event protocol for exchanging records across organisations under consent (the Telescope model: labels travel, material stays home). The platform adopts the identifiers from Phase 0 and the protocol in Phase 2.
- Coop is a pattern library and, later, a capture tool: its provider-tier cascade, JSON repair loop, review-before-share gate and Whisper transcription module are the proven shapes reused here; a Coop receiver on a phone could feed voice and photo captures into the intake as candidate needs and offers. Importing Coop code means AGPL for the platform, which is the proposed licence anyway.

## 7. Deployment view

```mermaid
flowchart LR
  DNS[regencommons.com DNS<br/>CNAME tend to Vercel] --> V[Vercel project: tend<br/>static + Node functions + cron]
  V --> SB[Supabase project<br/>Regen Commons / Website<br/>schema tend + existing]
  SB --> RS[Resend<br/>auth.regencommons.com<br/>mail.regencommons.com]
  RC[Vercel project: regencommons.com<br/>site + /admin] --> SB
  GH[GitHub: regen-commons/funding-commons<br/>app, api, research, tests] --> V
  GH2[GitHub: regen-commons/website<br/>site, admin, supabase migrations owner] --> RC
  GH -. migration PRs .-> GH2
  CX[Codex routines<br/>Monday discovery, Thursday freshness] --> GH
```

One migration owner. Two Vercel projects. One Supabase project. One Resend account with two sending subdomains. The research routines keep producing reviewed pull requests; nothing recurring merges or deploys on its own.

## 8. Architecture decisions (summary)

| ID | Decision | Alternatives considered | Consequence |
|---|---|---|---|
| A1 | Local-first AI with consented cloud fallback | Cloud-only; local-only | Works on weak devices without betraying the sovereignty story; needs a consent ledger and tiering |
| A2 | Shared Supabase project, dedicated `tend` schema, single migration owner | Separate project with member sync | Reuses Auth, members and stewards directly; requires migration discipline and namespacing |
| A3 | Steward desk extended, not duplicated | Admin on the subdomain | One login and release for stewards; the website repo must accept a UI module and SQL by pull request |
| A4 | Reuse the Funding Commons rubric for solo scores; add partner and partnership layers | New model-based ranker | Keeps the audited, explainable rubric; partnership logic is additive |
| A5 | Murmurations and KOI as exchange channels; knowledge commons by review bundle | Custom federation API | Standards-first interoperability; no direct writes to shared knowledge |
| A6 | Offerings and off-chain commitments now, pools later | Wallets at launch | Phase 3 anchoring without data migration; no web3 friction in intake |
| A7 | Places as references (One Earth bioregions, HydroBASINS, countries) | Free-text regions only | Enables watershed curation and regional pulses; requires licence confirmation and a geocoder |
| A8 | React PWA on shared tokens | Vanilla HTML like the main site | Worker-heavy conversational UI needs a component model; tokens keep the brand consistent |
