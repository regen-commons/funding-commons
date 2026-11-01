# Proposal brief: from Funding Commons to Regen Commons Tend

Status: proposal for the Regen Commons council and partner networks · Date: 2026-10-31 · Contact: Afolabi Aiyeloja
Deeper documents: [business model canvas](02-business-model-canvas.md) · [logical architecture](03-logical-architecture.md) · [product requirements](04-prd.md) · [technical specification](05-technical-spec.md) · [research digest](06-research-digest.md)

## The proposal in one paragraph

Funding Commons (funding-commons.vercel.app) is a public, browser-local directory of 699 funders and 768 programs with local-AI ranking, maintained weekly. We propose to grow it, under the Regen Commons banner on a regencommons.com subdomain, into a place where regenerative initiatives say who they are, what they need and what they can offer across eight forms of capital, and are matched to partners and to funding opportunities, alone and in partnership. Curation is organised by bioregion and watershed and across five lenses: art and culture, research, technology, place-based community, and funders. Intake is a three-step conversation (your initiative, your needs, your offers) by voice, text or upload, with local AI doing the structuring on the person's own device. The result feeds a weekly pulse, partnership "recipes" around opportunities, the Regen Commons membership funnel, and, through open identifiers and schemas, the wider knowledge commons.

## Why now

- The council asked for it. The 30 October Regen Coordination council sync and the follow-on planning call agreed on a self-submitted initiatives database with needs and offers, partner suggestions next to funds, bioregional and watershed curation, and interoperability with commitment pooling later rather than integration now.
- The manual version already exists and strains. The September 2026 Regen Partnerships and Funding Hub doc holds initiatives, forty funders, eight partnership calls and event ideas. It proved the loop (add yourself, find an opportunity, open a call, draft together) and showed that a doc and a sheet cannot carry it.
- Funders are moving toward cross-discipline, place-based teams. Calls we track ask for a place-based pilot plus a research partner plus tooling plus a cultural component. Nobody can see at a glance who would complete whom.
- The timing lines up with funding for exactly this kind of tool. Mozilla's Human-Scale AI incubator (USD 300k for 12 months from April 2027, proposals due 20 November 2026) funds small, intentional, tailored AI that is already working with its community. Funding Commons has run local AI in public since 16 October 2026; the revamp makes the community side real.
- The substrate is ready. Regen Commons now has a Supabase-backed membership system, a steward desk with email-code sign-in, a design system, and member organisations. The platform becomes the first member-facing utility built on it.

## What people will experience

1. Your initiative. Say it like you would to a friend outside the movement, drop a deck or a link, or type. The guide drafts four public fields (name, locations, description, links) and a few chips to confirm (stage, lenses, themes, place). Locations attach a bioregion and a watershed automatically.
2. Your needs. "What would unlock the next chapter?" Each need becomes a card with forms of capital, amount if financial, timeframe, where, and the exchange terms you would accept (gift, exchange, paid, commitment).
3. Your offers. "What do you have in surplus?" The same structure, with capacity: a track record with a funder, a methodology, land or a venue, a workshop, a story practice, a tool, a dataset.

Then: partners ranked with reasons; opportunities ranked with a solo score and a "stronger with" partner suggestion; recipes to open or join around an opportunity; a weekly pulse for your work and your region; a one-tap "still accurate" that keeps the commons trustworthy. Nothing leaves the device until you publish; nothing is shared onward without consent; everything can be withdrawn.

## What is different

- Needs and offers carry forms of capital. No comparable directory in the regenerative space tags by the eight capitals; most funder tools see only money.
- Partnership scoring, not just fit. For each gated opportunity the platform finds who closes the gap (a required geography, a research component, a place-based pilot) and scores the pair.
- Place is first class. Bioregion and watershed pages, regional pulses, and over time a synthesised picture of what a place needs, built from consented records with sources.
- Local AI by default. Transcription and structuring run in the browser; cloud is a logged, per-use choice with the provider and retention named.
- One node, not a silo. Open identifiers and content hashes on every public record, Murmurations profiles, KOI events for consented records, exports in open formats, and a documented way for any network to run its own instance.
- Built on an evidence-graded catalog with a weekly research cadence, so "opportunity" never silently becomes "eligibility".

## Name

Recommendation: Tend, at tend.regencommons.com. It continues the site's own language ("What do you already tend?", "A living network, tended together"), it is a verb that fits each step (tend your initiative, your needs, your offers; stewards tend the commons; the pulse tends freshness), and the collision check found no notable use in the regenerative, web3 or commons space. Fallback: Connect (clear, also collision-free). Expressive alternates: Hearth, Reciprocity (one of the seven Regen Commons values and the heart of commitment pooling), Compass, Mycorrhiza (the precise metaphor for exchange between different kinds of beings, but hard to say). Ruled out by collisions: Network (Regen Network, Bloom Network, Greenpill Network), Weave (WeaveDB, Bioregional Weaving Labs, The Weaving Lab), Guild (Guild.xyz, Greenpill Dev Guild), Confluence (Atlassian, Confluence Philanthropy), Mycelium (MycoFi and many others), Hub (Regen Hub, Regen Impact Hub, the Regen Coordination hub), Atlas (Optimism Atlas, Regen Atlas), Watershed (Watershed Technology), Loom, Kin, Bloom. Feature names inside the product stay plain: Initiatives, Needs and Offers, Opportunities, Recipes, Places, Pulse, and later Pools.

## How it serves the wider work

Knowledge commons. The platform produces structured, consented, provenance-carrying records: initiatives (organisations), places, funding mechanisms and open calls, and recipes with outcomes (case studies). They are exported as candidate knowledge objects in the Regen Knowledge Commons base shape for human review, never written directly. The regional synthesis of needs is itself a knowledge product with sources. The Knowledge Commons ontology currently lacks Opportunity, Need and Offer classes; this platform is the natural fixture source to propose them.

KOI and Coop. Every public record gets a stable reference identifier and a hash from day one. In Phase 2 the platform runs as a KOI partial node that publishes new, update and forget events for consented records and pulls funding knowledge from the Regen KOI network, following the Telescope principle that labels travel while material stays home. Coop contributes proven patterns (local model tiering, schema repair, review-before-share) and later a field capture tool for voice and photos.

Commitment pooling and Cosmo-Local Credit. Offers can be marked as offerings with the fields a voucher needs (unit, capacity, place, timing, restrictions, terms). Accepted exchanges are recorded as commitments off-chain with hashes. When a pilot bioregion is ready, those records anchor to a pool without migration; wallets are not needed to start, and custodial or passkey options exist when they are.

Recipes across scales. Global recipe templates (for example: place-based pilot plus research partner plus tooling toward a regional climate grant) are instantiated per opportunity; bioregion and watershed pages carry their own recipe boards; each initiative sees which ingredient it brings and which it lacks. Challenge cohorts give the recipes a deadline.

Not too centralised. Local-first by design, owned and retractable records, open schemas and identifiers, standards-based exchange, forkable code and data under an open licence, and operations held under Regen Commons governance with a published data and consent policy.

Regen Commons. The platform is the first tangible member utility: a reason to join, a funnel into membership (the initiative pre-fills the application), a steward workflow that uses the existing desk, and a coherent story for funders. Access tiers (open, members-first, members-only) are a council setting, not a rebuild.

## Phases

| Phase | Window | What ships | Gate |
|---|---|---|---|
| Seed | now to 14 November 2026 | Rebrand on the subdomain; typed three-step intake with light local extraction; needs and offers with forms of capital; public directory; partner suggestions next to funds; email-code sign-in; hub doc import; demo at Community Spotlight on 5 November | Working AI with real users documented for the Mozilla proposal by 20 November |
| Sprout | mid November 2026 to February 2027 | Voice and file input; local AI tiering with consented cloud fallback; reciprocal partner matching with reasons; partnership scoring; weekly pulse; steward desk sections; bioregion and watershed places and pages; Murmurations publishing; open data export; Portuguese and Spanish | 100 published initiatives across 8 bioregions; pulse open rate above 30 percent |
| Flowering | March to June 2027 | Recipes with join flows and introduction relay; challenge cohorts; regional pulses for funders; knowledge commons export and KOI partial node; members-first tier; needs-of-the-place synthesis; funder accounts; matching feedback loop | 20 recipes opened, 8 submitted; first funder subscribers |
| Tree | second half of 2027 | Offerings and commitments ledger; Cosmo-Local Credit anchoring for one pilot bioregion; cross-pool coordination with partner networks; federation and shared schema repository | Council policy on shared data; a second network running an instance |

Web3 elements are not needed at the start. The first three phases are email, browser and Postgres. Phase 3 anchors existing records; it does not change how people use the product.

## What it costs and how it is sustained

Infrastructure is about USD 65 per month (Supabase Pro, Vercel Pro, Resend) plus under USD 10 per month of consented cloud AI at expected rates; an optional community inference server would add about EUR 214 per month in Phase 2. The real cost is a lead builder (half to one full-time equivalent) and steward time. Sustainability comes from grants for public-interest and local-AI infrastructure (Mozilla, NLnet's next window, Climate Collective, Humanity AI's next call, regen rounds), Regen Commons membership as the platform becomes the member utility, funder and network subscriptions for regional pulses and curated pipelines in Phase 2, and facilitation of challenge cohorts. Fiscal rails: Open Source Collective (10 percent) unless Regen Commons has its own entity by then. Details in the business model canvas.

## Decisions requested from the council

1. House the platform under Regen Commons on tend.regencommons.com (or Connect), open to all networks.
2. Approve the open tier at launch and the AGPL-3.0 code licence with CC BY 4.0 for public data.
3. Agree the shared Supabase project with a single migration owner and a dedicated schema, and the extension of the steward desk.
4. Name two or three pilot bioregions or watersheds from existing nodes for Phase 2 place synthesis.
5. Back the Mozilla Human-Scale AI application with Metagov and KOI as partners, and confirm the receiving entity.

## Open questions we propose to keep open

Which KOI node is the first contact (Regen KOI run by Gaia AI or Metagov's); whether the Knowledge Commons will add Opportunity, Need and Offer classes; how Bloom's offers-and-needs sessions and Flow currency cross-pool with Tend's records; when the members-first tier starts; and how regional curators are recognised and resourced.

## Links

- Live site: https://funding-commons.vercel.app
- Repository: https://github.com/regen-commons/funding-commons (this plan lives in `docs/platform/`)
- Regen Commons: https://regencommons.com and https://github.com/regen-commons/website
- Coop: https://github.com/greenpill-dev-guild/coop
- Regen Partnerships and Funding Hub (manual version): the September 2026 Google Doc
- Metagov KOI: https://metagov.org/projects/koi-pond/project-details
- Cosmo-Local Credit: https://docs.cosmolocal.credit
- Murmurations: https://murmurations.network
- Mozilla Human-Scale AI call: https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/call-for-proposals/
