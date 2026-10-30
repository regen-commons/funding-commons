# Historical lead verification — October 29, 2026

All 94 queued leads received an official-source check. The pass imports 87 program entries from 81 leads, adding 64 funders and appending programs to five existing funders. The resulting catalog has 694 funders and 762 searchable program/overview documents. All 630 previous identities and their existing program/source revisions are preserved.

Verification is limited to the terms recorded. A program's existence does not establish an open call or complete applicant eligibility. Unknown deadlines, fiscal sponsorship, award currency and source conflicts remain explicit. The complete findings, attempted sources and original discovery questions are in [the intake ledger](history-intake.json); field-specific review dates are in [the review log](maintenance-review-log.json).

## Availability and urgent windows

The 87 added entries comprise 48 closed, 2 directory, 5 future, 6 inquiry, 14 open, 4 restricted, 2 rolling, 6 unconfirmed.

At the review date, the near-term windows include [LA NEAR/CO-UP](https://culture.lacity.gov/grants/near-co-op) (October 30), [CEA-LAT round 3](https://www.cpuc.ca.gov/capacitygrants) (October 30, headquarters in ZIP 91326 and no previous CEA-LAT funding), [Youth Community Access](https://raptr.resources.ca.gov/GrantDefinitions/PublicIndex) (November 4 concepts), and [Rocket Pool GMC round 42](https://dao.rocketpool.net/t/round-42-gmc-call-for-grant-applications-deadline-is-november-7/4070) (November 7 at 23:59 UTC). Date-only cutoffs retain their uncertainty. Darwin Extra and Halcyon have invited-stage deadlines; they are not open to new applicants.

Closed rounds remain discoverable. Future calls are excluded from available-deadline results until their application windows open. Ma Earth's fundraising date does not become an application date, and DOE's expected broader Phase I call has no invented opening or deadline. DARES and LA Public-Space Activation retain conflicting official intake statements. ROGEAP's named CTF call is retained with unconfirmed intake after partial retrieval, not silently treated as open.

## Leads held outside the catalog

The 13 held leads remain in the ledger: four lack sufficient official corroboration (CoDevelop/DPGA climate intake, Vrbs, IFC SME Growth Accelerator and Green Finance Investment Facility); four describe broad program/project resources (Arbitrum's umbrella, California RCDs, EPA and UNDP Nigeria off-grid projects); four provide non-cash fellowship/advisory support (Google's AI lab, Acumen Green RISE, GET.invest and Segal African Visionary Fellowship); and GoodDollar House of Alignment is a governance allocation. These dispositions do not imply that the organizations have ceased operating.

## Preservation and validation

The baseline is commit `0eaa5e73bef68d2fbcce7a6da51ac447c5374bd2`. The [preservation baseline](history-verification-baseline.json) and tests compare every previous field, program and source. Only appended terms and the derived additional-source list are permitted for Shell Foundation, NLnet, ACTA, Interledger and Lido. The original 94 discovery records are also checked by hash. The baseline includes the Verizon eligibility correction already merged in PR #4; integration updates only that record hash, preserving the corrected terms.

Validation: `python3 scripts/import-data.py`, `bun run build`, `bun run test` (114 passing), and `git diff --check`. The search index was regenerated for all 694 funders. No new dependencies or application logic were needed. UI changes update catalog totals only; the existing deadline pulse consumes the new records. Local Modern Web Guidance tooling was unavailable; no online package refresh was requested.

## Disposition by lead

| Lead | Decision | Programs / official source |
| --- | --- | --- |
| 001 | not-a-grant | GoodDollar House of Alignment — [source](https://discourse.gooddollar.org/t/gip-26-begin-distributions-to-house-of-alignment/8890) |
| 002 | imported | Gitcoin Grants 24 — ended (closed) — [source](https://gitcoin.co/campaigns) |
| 003 | imported | Quadratic funding — intake unconfirmed (unconfirmed) — [source](https://docs.giveth.io/quadraticfunding) |
| 004 | imported | Epoch 13 — privacy, closed (closed) — [source](https://octant.substack.com/p/epoch-13-meet-the-13-teams-advancing) |
| 005 | imported | Anchor Pool — 2026 (open); Boost Pool (restricted); Frontier Pool — 2026 (open) — [source](https://www.prezenti.xyz/) |
| 006 | imported | Proof of Ship (open) — [source](https://celo.org/builders) |
| 007 | imported | Celo Builders Fund — investment (inquiry) — [source](https://celo.org/builders) |
| 008 | program-directory | Arbitrum Foundation grants — [source](https://arbitrum.foundation/grants) |
| 009 | imported | Arbitrum Security Program (open) — [source](https://blog.arbitrum.foundation/introducing-the-arbitrum-security-program-apply-to-secure-your-smart-contracts/) |
| 010 | imported | ArbiFuel — gas sponsorship (open) — [source](https://blog.arbitrum.foundation/arbifuel-is-live-arbitrum-builders-claim-your-gas-fee-sponsorship/) |
| 011 | imported | Open House Singapore — 2026, closed (closed) — [source](https://blog.arbitrum.foundation/open-house-singapore-applications-are-now-open/) |
| 012 | imported | DAO domain allocator grants — completed (closed) — [source](https://arbitrum.foundation/grants) |
| 013 | imported | Safe Requests for Proposals (directory) — [source](https://safefoundation.org/grants) |
| 014 | imported | Artizen seasons — operations paused (closed) — [source](https://artizen.fund/) |
| 015 | imported | Tech Nonprofit Accelerator — 2027 cohort, closed (closed) — [source](https://www.ffwd.org/accelerator) |
| 016 | imported | AI x Nature Accelerator (inquiry) — [source](https://climatecollective.org/accelerator) |
| 017 | imported | Green Accountability Cohort — 2024, closed (closed) — [source](https://climatecollective.org/green-accountability-cohort) |
| 018 | imported | Digital Commons funding (open) — [source](https://www.gccofficial.org/en) |
| 019 | imported | Gnosis World community event support — conditional (future) — [source](https://world.gnosis.io/) |
| 020 | unresolved | Co-Develop / DPGA climate funding — [source](https://www.codevelop.fund/dpi-for-people-and-planet) |
| 021 | imported | Community Staking Grants (inquiry) — [source](https://operatorportal.lido.fi/community-lifeguards-initiative) |
| 022 | imported | O'Shaughnessy Fellowships — 2026, closed (closed) — [source](https://www.osv.llc/fellowships) |
| 023 | unresolved | Vrbs DAO grants — [source](https://vrbs.wtf/) |
| 024 | imported | Climate Change theme round — 2026, closed (closed) — [source](https://survivalandflourishing.fund/2026/application) |
| 025 | imported | ENS Small Grants — discontinued (closed) — [source](https://ensgrants.xyz/) |
| 026 | imported | Interledger on Campus — 2026, closed (closed) — [source](https://community.interledger.org/interledger/interledger-foundation-launches-interledger-on-campus-grant-program-to-support-student-led-2dkk) |
| 027 | imported | ProPGF Batch 3 — closed (closed) — [source](https://app.filpgf.io/programs/1479) |
| 028 | imported | Filecoin Open Grants (rolling) — [source](https://fil.org/grants) |
| 029 | imported | NGI Fediversity — final call closed (closed) — [source](https://nlnet.nl/fediversity/) |
| 030 | imported | NGI TALER — final call closed (closed) — [source](https://nlnet.nl/taler/) |
| 031 | imported | NGI Zero Commons Fund — final call closed (closed) — [source](https://nlnet.nl/commonsfund/) |
| 032 | imported | Ecosystem Support Program — Wishlist and RFPs (directory) — [source](https://esp.ethereum.foundation/applicants) |
| 033 | imported | Conservation Innovation Grants — Classic (unconfirmed) — [source](https://www.nrcs.usda.gov/programs-initiatives/conservation-innovation-grants) |
| 034 | imported | Darwin Main Round 32 — invited stage 2 (restricted); Darwin Extra Round 32 — invited stage 2 (restricted) — [source](https://www.darwininitiative.org.uk/how-to-apply/main-applications/) |
| 035 | imported | CSO Challenge — Africa, LAC and Asia-Pacific 2026, closed (closed) — [source](https://csochallenge.org/) |
| 036 | program-directory | California RCD funding — [source](https://www.conservation.ca.gov/dlrp/RCD/Pages/Index.aspx) |
| 037 | imported | Urban Streams Restoration Program — 2026 solicitation (rolling) — [source](https://water.ca.gov/Work-With-Us/Grants-And-Loans/Urban-Streams) |
| 038 | program-directory | EPA grants — [source](https://www.epa.gov/grants) |
| 039 | imported | LyondellBasell Greening STEM — 2026–27, closed (closed) — [source](https://www.neefusa.org/2026-2027-environmental-education-initiative-lyondellbasell-greening-stem-grants) |
| 040 | imported | Professional + Producer — closed (closed) — [source](https://western.sare.org/grants/professional-producer/) |
| 041 | imported | Biodiversity funding inquiries (inquiry) — [source](https://jrsbiodiversity.org/how-to-apply/) |
| 042 | imported | Africa Agriculture and Food Security Accelerator — invited stage (restricted) — [source](https://halcyonaccelerator.org/africa-innovation-in-ag-2027/) |
| 043 | imported | Keeling Curve Prize — between rounds (closed) — [source](https://www.climatecurve.org/applications-closed) |
| 044 | imported | Global Food System Challenge — 2027 (future) — [source](https://www.welthungerhilfe.org/global-food-system-challenge/f/) |
| 045 | imported | Core Fund — 2026, closed (closed) — [source](https://www.honnoldfoundation.org/become-a-partner) |
| 046 | imported | Zayed Sustainability Prize — 2027 cycle, closed (closed) — [source](https://zayedsustainabilityprize.com/en) |
| 047 | imported | Milken-Motsepe Circular Economy Prize — 2026, closed (closed) — [source](https://milkeninstitute.org/content-hub/news-releases/10-companies-named-semifinalists-2-million-milken-motsepe-prize-circular-economy) |
| 048 | imported | Innovating Education in Africa — 2026, closed (closed) — [source](https://au.int/sites/default/files/announcements/46204-annc-Revised_Call_for_Submissions_IEA_2026_EN_rev.pdf) |
| 049 | non-cash-program | Google Africa Applied AI Lab — [source](https://blog.google/intl/en-africa/company-news/outreach-and-initiatives/accelerating-africas-digital-renaissance-by-investing-in-infrastructure-and-agentic-ai/) |
| 050 | imported | Call for Solutions — 2026, closed (closed) — [source](https://community.youth4climate.info/dashboard/call-solutions-2026-0) |
| 051 | imported | YouthADAPT Challenge — current intake unconfirmed (unconfirmed) — [source](https://gca.org/gca-project/africa-youth-adaptation-solutions-challenge/) |
| 052 | imported | Africa Prize for Engineering Innovation — 2027, closed (closed) — [source](https://africaprize.raeng.org.uk/about-the-prize/how-to-apply) |
| 053 | imported | STEM & AI Education Grants — 2026, closed (closed) — [source](https://www.f5.com/company/global-good) |
| 054 | unresolved | IFC SME Growth Accelerator — [source](https://www.ifc.org/en/what-we-do/products-and-services/how-to-apply-for-financing) |
| 055 | imported | Ma Earth Round 4 — future (future) — [source](https://maearth.com/fundraise) |
| 056 | imported | DARES grants — intake conflict (unconfirmed) — [source](https://nep.rea.gov.ng/dares.html) |
| 057 | imported | Solar Power Naija — credit facility, closed (closed) — [source](https://spn.rea.gov.ng/) |
| 058 | imported | Off-Grid Energy Challenge — 2026, closed (closed) — [source](https://www.all-on.com/offgrid-challenge.html) |
| 059 | unresolved | Green Finance Investment Facility — [source](https://rea.gov.ng/) |
| 060 | imported | Entrepreneurship Programme — 2026, closed (closed) — [source](https://www.tonyelumelufoundation.org/press-releases/apply-tef-entrepreneurship-programme-2026) |
| 061 | program-directory | UNDP Nigeria off-grid initiatives — [source](https://www.undp.org/nigeria/projects/national-child-project-under-gef-africa-minigrids-program) |
| 062 | non-cash-program | Acumen Green RISE West Africa Fellowship — [source](https://fellowship.acumenacademy.org/green-rise-west-africa-fellowship-2026) |
| 063 | imported | ClimaFii Africa — cohort 2, closed (closed) — [source](https://shellfoundation.org/press-release/shell-foundation-and-accion-open-applications-for-climafii-alliance-second-cohort/) |
| 064 | non-cash-program | GET.invest Finance Catalyst — [source](https://www.get-invest.eu/finance-access-advisory/) |
| 065 | imported | EEP Africa Call for Proposals — 2026, closed (closed) — [source](https://eepafrica.org/call-for-proposals/) |
| 066 | non-cash-program | Segal African Visionary Fellowship — [source](https://www.segalfamilyfoundation.org/our-partners/african-visionary-fellowship/) |
| 067 | imported | General Operating Support — 2026, closed (closed) — [source](https://arts.ca.gov/wp-content/uploads/2026/03/2026_genops_guidelines.pdf) |
| 068 | imported | Arts and Youth — 2026, closed (closed) — [source](https://arts.ca.gov/grant_program/arts-youth/) |
| 069 | imported | Impact Projects — 2026, closed (closed) — [source](https://arts.ca.gov/grant_program/impact-projects/) |
| 070 | imported | Apprenticeship Program — 2026 cohort (closed) — [source](https://actaonline.org/program/apprenticeships/) |
| 071 | imported | NEAR artist residency — 2027–28 (open); CO-UP social justice residency — 2027–28 (open) — [source](https://culture.lacity.gov/grants/near-co-op) |
| 072 | imported | Outdoor Festivals and Parades — 2027–28, closed (closed) — [source](https://culture.lacity.gov/grants/cultural-grant-program-org) |
| 073 | imported | Public-Space Activation Fund — intake unconfirmed (unconfirmed) — [source](https://dcaredesign.org/artsactivate/) |
| 074 | imported | Youth Community Access — round 4 (open) — [source](https://water.ca.gov/CNRAHome/grants/youth) |
| 075 | imported | Spark Good Local Grants — cycle 3, 2026 (open) — [source](https://www.walmart.org/sg/Join-Spark-Good/program/local-grants) |
| 076 | imported | Neighborhood Purposes Grants (inquiry) — [source](https://clerk.lacity.gov/neighborhood-council-elections-and-funding/neighborhood-council-funding/documents-and-forms-page) |
| 077 | imported | Community Possible — letter of interest (inquiry) — [source](https://www.usbank.com/about-us-bank/community/community-possible-grant-program.html) |
| 078 | imported | STEM Action Grants — 2026, closed (closed); STEM Action Grants — 2027, future (future) — [source](https://www.societyforscience.org/stem-outreach-programs/stem-action-grants/) |
| 079 | imported | LA2050 Grants Challenge — 2026, closed (closed) — [source](https://la2050.org/grants-challenge/welcome) |
| 080 | imported | Grants for Arts Projects — July 2026, closed (closed) — [source](https://www.arts.gov/grants/grants-for-arts-projects) |
| 081 | imported | Public Humanities Projects — December 2026 (open) — [source](https://www.neh.gov/grants/public/public-humanities-projects) |
| 082 | imported | Humanities for All Project Grants — suspended (closed) — [source](https://calhum.org/humanities-for-all/) |
| 083 | imported | CEA-LAT — round 3, ZIP 91326 only (open) — [source](https://www.cpuc.ca.gov/capacitygrants) |
| 084 | imported | Economic Opportunity Grant — program closed (closed) — [source](https://opportunity.lacounty.gov/eog/) |
| 085 | imported | SHIFT Grants — round 001, closed (closed) — [source](https://www.shiftgrants.org/_files/ugd/213a1a_789ee644a7d9479a98b3992620f9fc5a.pdf) |
| 086 | imported | BGAwards / 17 SDGs Challenge — 2024, closed (closed) — [source](https://www.chainforgood.org/oscar) |
| 087 | imported | Climate Lab Colombia — 2026, closed (closed) — [source](https://www.prosperglobalventures.com/blog/call-for-proposals-tech-solutions-for-climate-resilience-in-colombia) |
| 088 | imported | GMC grants — round 42 (open) — [source](https://dao.rocketpool.net/t/round-42-gmc-call-for-grant-applications-deadline-is-november-7/4070) |
| 089 | imported | ROGEAP CTF grants — round 4, intake unconfirmed (unconfirmed) — [source](https://rogeappfm.com/Publicity/ROGEAP-4th-call-CTF-en.pdf) |
| 090 | imported | Shutter Champions — Melee 2, closed (closed) — [source](https://blog.shutter.network/shutter-champions-melee-2/) |
| 091 | imported | Growth Grants — season 9, closed (closed) — [source](https://atlas.optimism.io/missions/growth-grants) |
| 092 | imported | SBIR/STTR Phase I Genesis — FY26, closed (closed); SBIR/STTR broader Phase I — expected future call (future) — [source](https://www.energy.gov/technologycommercialization/doe-small-business-innovation-research-sbir-and-small-business) |
| 093 | imported | Africa Climate Change Fund — call 4, closed (closed) — [source](https://afdb.smapply.org/prog/africa_climate_change_fund_fourth_call_for_proposals/) |
| 094 | imported | Sovereign Tech Fund (open) — [source](https://www.sovereign.tech/programs/fund) |
