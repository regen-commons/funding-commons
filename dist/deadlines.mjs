import { effectiveAccess, localDate, safeFundUrl } from "./domain.mjs";
import { programFund } from "./matching.mjs";

const dayNumber = (date) => Date.parse(`${date}T00:00:00Z`) / 86400000;

// Calendar dates are source dates, not invented midnight cutoffs. Exact instants
// expire at the stated moment and are presented in the viewer's timezone.
export function upcomingWindows(funds, now = new Date(), horizon = 21) {
  const today = dayNumber(localDate(now));
  const windows = [];
  for (const fund of funds) {
    for (const program of fund.enrichment?.programs || []) {
      const view = programFund(fund, program);
      if (!["open", "rolling", "inquiry", "restricted"].includes(effectiveAccess(view, now))) continue;
      if (!safeFundUrl(fund, program.application.url)) continue;
      const evidence = program.evidence.filter((e) =>
        e.fields.some((field) => /(^|\.)application($|\.)/.test(field)) && safeFundUrl(fund, e.url));
      if (!evidence.length) continue;
      const instant = view.deadlineInstant ? Date.parse(view.deadlineInstant) : null;
      if (instant !== null && (!Number.isFinite(instant) || instant <= now.getTime())) continue;
      const date = instant !== null ? localDate(new Date(instant)) : view.deadlineDate;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) continue;
      const days = dayNumber(date) - today;
      if (!Number.isFinite(days) || days < 0 || days > horizon) continue;
      windows.push({ fund: view, program, date, days, instant,
        checkedOn: evidence.map((e) => e.checkedOn).sort().at(-1) });
    }
  }
  return windows.sort((a, b) => a.days - b.days ||
    (a.instant ?? Infinity) - (b.instant ?? Infinity) ||
    a.fund.displayName.localeCompare(b.fund.displayName) || a.program.id.localeCompare(b.program.id));
}

export function deadlineLabel(window) {
  if (window.instant !== null) return new Intl.DateTimeFormat(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(new Date(window.instant));
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })
    .format(new Date(`${window.date}T12:00:00`));
}
