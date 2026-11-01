# Open decisions

The single list of what is unresolved. Each entry has a recommendation, so a decision can be a quick yes. Nothing in this plan is a council decision until it is recorded here as decided.

| Status | Meaning |
|---|---|
| Open | Needs a decision from the owner named |
| Test | Waiting on usability testing or a technical check |
| Decided | Recorded, with the date and who decided |

## For the council

| ID | Question | Recommendation | Needed by | Status |
|---|---|---|---|---|
| D1 | What is the product called, and at which subdomain? | Tend at tend.regencommons.com, with Connect as the fallback. Test with outsiders first, because a verb cannot say what the product is. Keep it beside a plain tagline. | Before the first public demo, 5 November | Open |
| D2 | Which access tier at launch? | Open: anyone can browse and save. Consider members-first in Phase 2. | Phase 0 | Open |
| D3 | Which code licence? | AGPL-3.0, which keeps Coop reuse possible. Apache-2.0 if maximum reuse by partners matters more. | Phase 0 | Open |
| D4 | Which data licence for public records? | CC BY 4.0. | Phase 0 | Open |
| D5 | Should stewards be able to read private saved initiatives? | No. Nothing there has been shared. Stewards see network and public records and aggregate counts. | Phase 0 | Open |
| D6 | Is one database shared with the website acceptable for private initiatives? | Yes, with the limit stated on the privacy page: people who administer the database can technically read stored records, under the data policy. | Phase 0 | Open |
| D7 | Which networks are the first sharing targets? | Murmurations index, yes. Regen KOI, confirm with its operators. Hylo, link only. Bloom's offers and needs sessions, import with consent. | Phase 1 | Open |
| D8 | Which places pilot the Phase 2 place synthesis and Phase 3 pool? | Pick two or three from existing nodes: San Francisco Bay and Central Valley, Lagos lagoon and Niger delta, southern Brazil, a Central American watershed. | Phase 1 | Open |
| D9 | Which entity receives funds for the Mozilla application? | Open Source Collective at 10 percent, unless Regen Commons has its own entity by then. | 20 November | Open |
| D10 | Do the brand changes stand? This covers capital hue changes, square tiles, madder for errors, and plain stage labels. | Yes, for products. The website keeps its current look until it chooses to adopt them. See the [decision log](../../design-system/decision-log.md). | Phase 0 | Open |
| D11 | Who owns the design system and represents its users? | The lead builder as maker, one steward as user representative. | Phase 0 | Open |

## For the builders

| ID | Question | Recommendation | Needed by | Status |
|---|---|---|---|---|
| D12 | Who owns Supabase migrations? | The website repository for Phase 0, and a shared `regen-commons/supabase` repository from Phase 1. | Phase 0 | Open |
| D13 | Who administers DNS for regencommons.com, and which Vercel team holds the project? | Confirm with whoever runs the website project. It is not visible from the accounts used so far. | Phase 0 | Open |
| D14 | Six or eight digits for sign-in codes? | Six, with attempt limits. It is a project-wide setting, so agree it with the steward desk. | Phase 0 | Open |
| D15 | Does the steward desk move to the Send Email hook at the same time? | Yes. One template pipeline, branching by app. | Phase 0 | Open |
| D16 | Where does the design system live long term? | Here until the website or desk adopts more than tokens, then a shared `regen-commons` repository. | When a second app needs it | Open |
| D17 | Should we add Latin Extended font subsets? | Yes, before launch in places that need Yoruba or Vietnamese. Measure the added weight. | Phase 1 | Open |
| D18 | Which cloud fallback is the default? | Anthropic Haiku 5.5 if the Zero Data Retention arrangement is confirmed, otherwise Cloudflare Workers AI. | Phase 1 | Open |
| D19 | Which bioregion layer? | One Earth if its non-commercial clause fits, otherwise RESOLVE ecoregions. | Phase 1 | Open |
| D20 | Which basin layer? | BasinATLAS under CC BY 4.0, unless HydroBASINS's licence is confirmed for this use. | Phase 1 | Open |
| D21 | Which KOI node is first contact? | Ask the Regen KOI coordinator and Metagov. Take whichever responds with a test path. | Phase 2 | Open |
| D22 | Will the Knowledge Commons add Opportunity, Need and Offer classes? | Propose them, with this platform as the fixture source. | Phase 2 | Open |
| D23 | How long do inactive saved initiatives stay? | Until deleted, with a yearly "still want this?" email after 24 months of no sign-in. Delete only after notice. | Phase 1 | Open |

## Waiting on people

| ID | Question | How it gets answered | Status |
|---|---|---|---|
| T1 | Does "initiative" read clearly, or is "project or group" better? | Name test in the [usability rounds](../../design-system/principles/usability-testing.md) | Test |
| T2 | Partnership or recipe? | Name test | Test |
| T3 | Do plain capital labels work, such as "Care and spirit", and are eight too many for a card? | Name test, plus watching the offers step | Test |
| T4 | Does the assistant need a persona, such as the Gardener? | Compare "Assistant" with a named guide. "Assistant" is the default until then. | Test |
| T5 | Do people understand pencil against ink? | Watch the review step | Test |
| T6 | Does the save moment work: when do people save, and do they return after Not now? | Task 4 of the testing plan, plus step counts | Test |
| T7 | Does a seven-word tagline explain the product to outsiders? | Home tour task. Candidate: Find partners and funding for regenerative work | Test |

## Decided

Nothing yet.
