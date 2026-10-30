# Funding evidence and eligibility screening

Thematic fit measures documented topic alignment. Research priority determines
which next steps appear first. Missing eligibility facts, funding preferences,
application access and offer verification affect research priority and readiness;
they do not change the thematic grade.

## Unverified funding offers

An official organization overview is not evidence of an applicable funding
program. Records without researched program terms appear under **Unverified
funding offers**, with research priority capped at 9. They remain searchable,
saveable, comparable and exportable, and keep any supported thematic grade.

A documented program with a closed intake stays a known program with a closed
cycle. A funding resource or service stays distinct from a grantmaking offer.
Neither category is converted into an open call.

## Applicant and beneficiary requirements

Source-backed prerequisites live in
[`research/program-conditions.json`](../research/program-conditions.json).
Answers belong to the selected project and source date. Blank answers remain
unknown; a self-reported yes does not approve eligibility. A current no on a
mandatory requirement moves the program to conflicts with research priority 0.
Expired or superseded answers cannot establish a current conflict or approval.

Verizon's [official guidance](https://www.verizon.com/about/responsibility/grant-requirements),
rechecked October 29, 2026, supplies two checks:

- The actual applicant qualifies through the stated IRS public-charity route
  **or** the nonprofit, NCES-registered K–12 school route. General NGO status
  does not answer this requirement. Fiscal-sponsor acceptance remains unknown.
- The activities fit a published funding priority. Education requests serve
  digital skills for K–12 students or teachers. That age restriction does not
  apply to every other Verizon funding priority.

Pending applicant or beneficiary conditions are named in the readiness badge
and keep the program out of research leads. Answering both does not remove the
separate invitation restriction or satisfy any other unpublished requirement.
Work in Nigeria alone is not an invented applicant-country exclusion.

## Score wording

A failed prerequisite states **research priority is 0; thematic fit is
unchanged**. Cards, details, comparison and CSV continue to distinguish the
thematic grade from readiness and research priority. The research-priority cap
for an unverified offer is not a claim that its mission is irrelevant.

Regression checks in
[`tests/qa-findings.test.mjs`](../tests/qa-findings.test.mjs) cover offer demotion,
closed-program handling, retained source identities and exports, unknown
applicant facts, and the effect of prerequisite answers on readiness and fit.
