import test from "node:test";
import assert from "node:assert/strict";
import { upcomingWindows } from "../dist/deadlines.mjs";

const program = (id, application = {}) => ({
  id, name: id, award: { basis: "not_stated" },
  application: { route: "open", url: "https://example.org/call", opensOn: null,
    closesOn: "2026-11-10", deadlineInstant: null, ...application },
  evidence: [{ fields: ["programs.0.application"], url: "https://example.org/call", checkedOn: "2026-10-29" }],
});
const fund = (programs) => ({ id: "f", displayName: "A fund", access: "closed", enrichment: { programs } });
const now = new Date(2026, 9, 29, 12);

test("pulse reads every named program independently of the fund's display route", () => {
  const f = fund([program("closed", { route: "closed" }), program("first"),
    program("second", { route: "inquiry", closesOn: "2026-11-01" })]);
  const out = upcomingWindows([f], now);
  assert.deepEqual(out.map(w => w.program.id), ["second", "first"]);
  assert.equal(out[0].fund.displayProgramId, "second");
  assert.equal(out[0].fund.access, "inquiry");
  assert.equal(f.access, "closed");
});
test("closed, conditional, unopened, undated and expired windows are excluded", () => {
  const programs = ["closed", "future", "unconfirmed", "relationship"].map(route => program(route, { route }));
  programs.push(program("unopened", { opensOn: "2026-11-01" }),
    program("undated", { closesOn: null }), program("past", { closesOn: "2026-10-28" }),
    program("later", { closesOn: "2026-11-20" }));
  assert.deepEqual(upcomingWindows([fund(programs)], now), []);
});
test("exact cutoff expires at equality; date-only stays visible on the source date", () => {
  const out = upcomingWindows([fund([
    program("exact", { deadlineInstant: now.toISOString() }),
    program("today", { closesOn: "2026-10-29" }),
    program("tomorrow", { deadlineInstant: new Date(now.getTime() + 86400000).toISOString() }),
  ])], now);
  assert.deepEqual(out.map(w => w.program.id), ["today", "tomorrow"]);
  assert.equal(out[0].instant, null);
  assert.equal(out[0].days, 0);
});
test("calendar horizon includes its boundary across DST without rounding hours", () => {
  const f = fund([program("two weeks", { closesOn: "2026-11-12" }), program("three weeks", { closesOn: "2026-11-19" })]);
  assert.deepEqual(upcomingWindows([f], now, 14).map(w => w.days), [14]);
  assert.deepEqual(upcomingWindows([f], now, 21).map(w => w.days), [14, 21]);
});
test("unbacked dates and disabled source hosts never enter the urgent list", () => {
  const missing = program("no evidence"); missing.evidence = [];
  const unrelated = program("award only"); unrelated.evidence[0].fields = ["award"];
  const blocked = fund([program("blocked")]); blocked.sourceWarnings = [{ url: "https://example.org/", reason: "Integrity concern" }];
  assert.deepEqual(upcomingWindows([fund([missing, unrelated]), blocked], now), []);
});
