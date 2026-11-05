// Development-only invented content. App's import.meta.env.DEV boundary removes it from production.
import type { ListingRecord } from "./listing.ts";
export type Scenario = "visitor" | "draft" | "private" | "shared";
export type ListState = "ready" | "empty" | "loading" | "offline" | "error" | "long";
export interface FixtureContext {
  scenario: Scenario;
  state: ListState;
  initiatives: readonly ListingRecord[];
  funding: readonly ListingRecord[];
}
const initiatives: readonly ListingRecord[] = [
  {
    id: "orchard-circle",
    kind: "initiative",
    title: "Orchard learning circle",
    description:
      "Families restore an old orchard and share what they learn about soil, water and seed saving.",
    country: "Brazil",
    place: "Upper valley, Brazil",
    work: ["Place-based community", "Research"],
    stage: "sprout",
    needs: ["material", "financial"],
    offers: ["living", "experiential"],
    fit: "strong",
    reasons: [
      "Offers seedlings and growing skills in this example.",
      "Needs tools that your example initiative offers.",
    ],
    confirmed: "2026-11-02",
  },
  {
    id: "willow-tools",
    kind: "initiative",
    title: "Willow tools cooperative",
    description: "A shared workshop repairs growing tools and lends equipment to community gardens.",
    country: "Kenya",
    place: "Hill district, Kenya",
    work: ["Technology", "Place-based community"],
    stage: "flowering",
    needs: ["social", "living"],
    offers: ["material", "intellectual"],
    fit: "good",
    reasons: ["Offers shared tools in this example."],
    confirmed: "2026-10-25",
  },
  {
    id: "seed-stories",
    kind: "initiative",
    title: "Seed stories studio",
    description:
      "Artists and seed keepers collect stories, hold listening circles and make a seasonal community journal.",
    country: "Portugal",
    place: "Coastal valley, Portugal",
    work: ["Art and culture"],
    stage: "seed",
    needs: ["material"],
    offers: ["cultural", "spiritual", "social"],
    fit: "possible",
    reasons: ["Brings a different kind of work to this example."],
    confirmed: "2026-10-20",
  },
  {
    id: "river-maps",
    kind: "initiative",
    title: "River maps collective",
    description: "Researchers and residents map springs and publish practical notes about caring for water.",
    country: "Brazil",
    place: "Upper valley, Brazil",
    work: ["Research", "Technology"],
    stage: "tree",
    needs: ["living"],
    offers: ["intellectual", "experiential"],
    fit: "good",
    reasons: ["Offers mapping knowledge in this example."],
    confirmed: "2026-10-18",
  },
  {
    id: "commons-fund",
    kind: "initiative",
    title: "Community commons circle",
    description: "A fictional funder circle supports shared learning and community-led restoration.",
    country: "Kenya",
    place: "Hill district, Kenya",
    work: ["Funders"],
    stage: "flowering",
    needs: ["intellectual"],
    offers: ["financial", "social"],
    fit: "possible",
    reasons: ["Offers financial support in this example."],
    confirmed: "2026-10-12",
  },
  {
    id: "field-school",
    kind: "initiative",
    title: "Field learning school",
    description: "A community learning space shares growing skills and seasonal care practices.",
    country: "Portugal",
    place: "Coastal valley, Portugal",
    work: ["Place-based community", "Art and culture"],
    stage: "sprout",
    needs: ["financial"],
    offers: ["experiential", "spiritual", "living"],
    fit: "strong",
    reasons: ["Shares growing skills in this example."],
    confirmed: "2026-11-01",
  },
];
const funding: readonly ListingRecord[] = [
  {
    id: "headwater-learning",
    kind: "funding",
    title: "Headwater learning grant",
    description: "A fictional grant for community learning around springs and rivers.",
    country: "Brazil",
    place: "Brazil",
    work: ["Research", "Place-based community"],
    stage: "sprout",
    needs: [],
    offers: ["financial"],
    fit: "good",
    reasons: ["Supports community water learning in this example."],
    amount: "US$ 15,000",
    closes: "2026-11-30",
    confirmed: "2026-11-01",
  },
  {
    id: "shared-tools",
    kind: "funding",
    title: "Shared tools fund",
    description: "A fictional fund for practical tools that communities maintain together.",
    country: "Kenya",
    place: "Kenya",
    work: ["Technology"],
    stage: "flowering",
    needs: [],
    offers: ["financial", "material"],
    fit: "strong",
    reasons: ["Supports shared equipment in this example."],
    amount: "US$ 20,000",
    closes: "2027-01-15",
    confirmed: "2026-10-25",
  },
  {
    id: "culture-and-care",
    kind: "funding",
    title: "Culture and care award",
    description: "A fictional award for stories, art and care rooted in place.",
    country: "Portugal",
    place: "Portugal",
    work: ["Art and culture"],
    stage: "seed",
    needs: [],
    offers: ["financial"],
    fit: "possible",
    reasons: ["Supports community arts in this example."],
    amount: "€ 10,000",
    closes: "2027-02-28",
    confirmed: "2026-10-29",
  },
];
export function readFixtures(search: string): FixtureContext {
  const params = new URLSearchParams(search);
  const requested = params.get("fixture");
  const scenario: Scenario =
    requested === "draft" || requested === "private" || requested === "shared" ? requested : "visitor";
  const stateValue = params.get("state");
  const state: ListState =
    stateValue === "empty" ||
    stateValue === "loading" ||
    stateValue === "offline" ||
    stateValue === "error" ||
    stateValue === "long"
      ? stateValue
      : "ready";
  const records =
    state === "empty"
      ? []
      : state === "long"
        ? initiatives.map((record, i) =>
            i === 0
              ? {
                  ...record,
                  title:
                    "Associação Comunitária de Aprendizagem, Arte e Cuidado das Nascentes e dos Pomares do Vale das Sementes",
                  description: record.description.repeat(12),
                }
              : record,
          )
        : initiatives;
  return { scenario, state, initiatives: records, funding: state === "empty" ? [] : funding };
}
export const EXAMPLE_SUBJECT = {
  needs: ["living", "intellectual"],
  offers: ["material", "cultural"],
} as const;
