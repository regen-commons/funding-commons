export const STORAGE_KEY = "funding-commons:saved:v2";
export const LEGACY_STORAGE_KEY = "funding-commons:saved:v1";
const LEGACY_NAMES = {
  "green-goods": "Green Goods",
  "tech-and-sun": "Tech and Sun",
  "omo-yoruba": "Omo Yoruba",
};
const validId = (value) =>
  typeof value === "string" &&
  /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value) &&
  !["all", "general", "__proto__", "constructor", "prototype"].includes(value);
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value);
export const FUNDING_INSTRUMENTS = {
  grant: "Grants", prize: "Prizes", investment: "Investment (debt or equity)",
  fellowship: "Fellowships", scholarship: "Scholarships",
};
export const US_STATES = Object.fromEntries([
  "AL:Alabama", "AK:Alaska", "AZ:Arizona", "AR:Arkansas", "CA:California", "CO:Colorado",
  "CT:Connecticut", "DE:Delaware", "DC:District of Columbia", "FL:Florida", "GA:Georgia",
  "HI:Hawaii", "ID:Idaho", "IL:Illinois", "IN:Indiana", "IA:Iowa", "KS:Kansas", "KY:Kentucky",
  "LA:Louisiana", "ME:Maine", "MD:Maryland", "MA:Massachusetts", "MI:Michigan", "MN:Minnesota",
  "MS:Mississippi", "MO:Missouri", "MT:Montana", "NE:Nebraska", "NV:Nevada", "NH:New Hampshire",
  "NJ:New Jersey", "NM:New Mexico", "NY:New York", "NC:North Carolina", "ND:North Dakota",
  "OH:Ohio", "OK:Oklahoma", "OR:Oregon", "PA:Pennsylvania", "RI:Rhode Island", "SC:South Carolina",
  "SD:South Dakota", "TN:Tennessee", "TX:Texas", "UT:Utah", "VT:Vermont", "VA:Virginia",
  "WA:Washington", "WV:West Virginia", "WI:Wisconsin", "WY:Wyoming",
].map((s) => s.split(":")));
function text(value, field, max) {
  if (typeof value !== "string" || value.length > max)
    throw new Error(`${field} is invalid.`);
  return value.trim();
}
export function normalizeProject(input) {
  if (!object(input) || !validId(input.id))
    throw new Error("Project ID is invalid.");
  const name = text(input.name, "Project name", 120);
  if (!name) throw new Error("Give your project a name.");
  const description = text(
    input.description ?? "",
    "Project description",
    5000,
  );
  const tags =
    typeof input.tags === "string"
      ? input.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : (input.tags ?? []);
  if (
    !Array.isArray(tags) ||
    tags.some((x) => typeof x !== "string" || !x.trim() || x.length > 100)
  )
    throw new Error("Use tags of up to 100 characters, separated by commas.");
  const amount = (value) => {
    if (value === "" || value == null) return null;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
      throw new Error("Funding goals must be non-negative numbers.");
    return value;
  };
  const goalMin = amount(input.goalMin),
    goalMax = amount(input.goalMax);
  if (goalMin != null && goalMax != null && goalMin > goalMax)
    throw new Error("The maximum funding goal must be at least the minimum.");
  const currency = text(input.currency ?? "USD", "Currency", 3).toUpperCase();
  const currencies =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("currency")
      : null;
  if (
    !/^[A-Z]{3}$/.test(currency) ||
    (currencies && !currencies.includes(currency))
  )
    throw new Error(
      "Choose a valid three-letter currency code, such as USD or NGN.",
    );
  const country = (value) => {
    const code = text(value ?? "", "Country code", 2).toUpperCase();
    if (code && !COUNTRIES.includes(code))
      throw new Error("Choose a country from the list.");
    return code;
  };
  if (input.workCountries != null && !Array.isArray(input.workCountries))
    throw new Error("Work countries must be a list.");
  const workCountries = [
    ...new Set((input.workCountries || []).map(country)),
  ].filter(Boolean);
  if (input.benefitCountries != null && !Array.isArray(input.benefitCountries))
    throw new Error("Benefit countries must be a list.");
  const benefitCountries = [...new Set((input.benefitCountries || []).map(country))].filter(Boolean);
  const choices = (value, allowed, label) => {
    if (!Array.isArray(value) || value.some((v) => typeof v !== "string" || !Object.hasOwn(allowed, v)))
      throw new Error(`${label} contains an invalid choice.`);
    return [...new Set(value)];
  };
  const fundingInstruments = choices(input.fundingInstruments ?? [], FUNDING_INSTRUMENTS, "Funding types");
  const usWorkStates = choices(input.usWorkStates ?? [], US_STATES, "US work states");
  const usBenefitStates = choices(input.usBenefitStates ?? [], US_STATES, "US benefit states");
  if (usWorkStates.length && !workCountries.includes("US"))
    throw new Error("Select United States as a work country before adding US states.");
  if (usBenefitStates.length && !benefitCountries.includes("US"))
    throw new Error("Select United States as a benefit country before adding US benefit states.");
  const applicantType = input.applicantType ?? "unknown";
  if (
    ![
      "unknown",
      "nonprofit",
      "informal",
      "individual",
      "business",
      "university",
      "public-body",
    ].includes(applicantType)
  )
    throw new Error("Applicant type is invalid.");
  const programAnswers = {};
  if (input.programAnswers != null) {
    if (!object(input.programAnswers) || Object.keys(input.programAnswers).length > 5000)
      throw new Error("Program answers are invalid.");
    for (const [key, value] of Object.entries(input.programAnswers)) {
      if (!/^[a-zA-Z0-9_-]+::[a-zA-Z0-9_-]+::[a-zA-Z0-9_-]+$/.test(key) ||
          !object(value) || !["yes", "no"].includes(value.answer) ||
          typeof value.sourceCheckedOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.sourceCheckedOn) ||
          !Number.isFinite(Date.parse(value.sourceCheckedOn))) throw new Error("Program answer is invalid.");
      programAnswers[key] = { answer: value.answer, sourceCheckedOn: value.sourceCheckedOn };
    }
  }
  return {
    id: input.id,
    name,
    description,
    tags: [...new Set(tags.map((x) => x.trim()))],
    goalMin,
    goalMax,
    currency,
    workCountries,
    benefitCountries,
    fundingInstruments,
    usWorkStates,
    usBenefitStates,
    applicantBaseCountry: country(input.applicantBaseCountry),
    registrationCountry: country(input.registrationCountry),
    applicantType,
    programAnswers,
  };
}
// ISO 3166-1 alpha-2, kept local so profile validation needs no network service.
export const COUNTRIES =
  "AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(
    " ",
  );
export function emptySaved() {
  return { version: 2, projects: [], lists: { general: [] }, notes: {} };
}
export function listOptions(saved) {
  return [
    { id: "general", name: "General" },
    ...saved.projects.map((p) => ({ id: p.id, name: p.name })),
  ];
}
export function readSaved(raw) {
  if (!raw) return emptySaved();
  const parsed = JSON.parse(raw);
  if (
    !object(parsed) ||
    ![1, 2].includes(parsed.version) ||
    !object(parsed.lists) ||
    !object(parsed.notes)
  )
    throw new Error("Saved data has an unsupported format.");
  const result = emptySaved();
  if (parsed.version === 1) {
    for (const id of Object.keys(parsed.lists)) {
      if (id === "general") continue;
      result.projects.push(
        normalizeProject({
          id,
          name: LEGACY_NAMES[id] || `Imported list ${id}`,
        }),
      );
    }
  } else {
    if (!Array.isArray(parsed.projects))
      throw new Error("Saved projects are invalid.");
    result.projects = parsed.projects.map(normalizeProject);
    if (
      new Set(result.projects.map((p) => p.id)).size !== result.projects.length
    )
      throw new Error("Project IDs must be unique.");
  }
  const allowed = new Set(listOptions(result).map((l) => l.id));
  if (!Object.hasOwn(parsed.lists, "general"))
    throw new Error("The General saved list is missing.");
  for (const id of Object.keys(parsed.lists))
    if (!allowed.has(id)) throw new Error("A saved list has no project.");
  for (const { id } of listOptions(result)) {
    const ids = parsed.lists[id];
    if (!Array.isArray(ids) || ids.some((x) => typeof x !== "string" || !x))
      throw new Error("A saved list is invalid.");
    result.lists[id] = [...new Set(ids)];
  }
  if (Object.values(parsed.notes).some((note) => typeof note !== "string"))
    throw new Error("A saved note is invalid.");
  result.notes = Object.fromEntries(Object.entries(parsed.notes));
  return result;
}
export function savedIds(saved, list = "all") {
  if (list === "all") return [...new Set(Object.values(saved.lists).flat())];
  if (!Object.hasOwn(saved.lists, list)) throw new Error("Unknown saved list.");
  return [...saved.lists[list]];
}
export function toggleSaved(saved, id, list = "general") {
  if (!Object.hasOwn(saved.lists, list)) throw new Error("Unknown saved list.");
  const next = structuredClone(saved),
    ids = new Set(next.lists[list]);
  ids.has(id) ? ids.delete(id) : ids.add(id);
  next.lists[list] = [...ids];
  return next;
}
export function upsertProject(saved, input) {
  const project = normalizeProject(input),
    next = structuredClone(saved),
    i = next.projects.findIndex((p) => p.id === project.id);
  if (i < 0) {
    next.projects.push(project);
    next.lists[project.id] = [];
  } else {
    const context = (p) => JSON.stringify(Object.fromEntries(Object.entries(p).filter(([key]) => !["id", "name", "programAnswers"].includes(key))));
    project.programAnswers = context(next.projects[i]) === context(project)
      ? (input.programAnswers != null ? project.programAnswers : next.projects[i].programAnswers ?? {}) : {};
    next.projects[i] = project;
  }
  return next;
}
export function removeProject(saved, id) {
  if (!saved.projects.some((p) => p.id === id))
    throw new Error("Unknown project.");
  const next = structuredClone(saved);
  next.lists.general = [...new Set([...next.lists.general, ...next.lists[id]])];
  delete next.lists[id];
  next.projects = next.projects.filter((p) => p.id !== id);
  return next;
}
export function mergeSaved(current, incoming) {
  const next = readSaved(JSON.stringify(current)),
    added = readSaved(JSON.stringify(incoming));
  for (const project of added.projects)
    if (!next.projects.some((p) => p.id === project.id)) {
      next.projects.push(project);
      next.lists[project.id] = [];
    }
  for (const { id } of listOptions(added))
    next.lists[id] = [...new Set([...next.lists[id], ...added.lists[id]])];
  next.notes = { ...next.notes, ...added.notes };
  return next;
}
