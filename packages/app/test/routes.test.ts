import assert from "node:assert/strict";
import { test } from "node:test";
import { documentTitle, INTAKE_STEPS, matchRoute, pathTo, ROUTES } from "../src/routes.ts";

test("every route has a unique path, name and title", () => {
  for (const key of ["path", "name", "title"] as const) {
    assert.equal(new Set(ROUTES.map((route) => route[key])).size, ROUTES.length, key);
  }
});

test("the shell has home, the three intake steps, matches, the directory and saving", () => {
  assert.deepEqual(ROUTES.map((route) => route.name), ["home", "initiative", "needs", "offers", "matches", "directory", "save"]);
  assert.deepEqual(INTAKE_STEPS.map((step) => step.route), ["initiative", "needs", "offers"]);
});

test("pathnames match with or without a trailing slash", () => {
  assert.equal(matchRoute("/")?.name, "home");
  assert.equal(matchRoute("/start/needs")?.name, "needs");
  assert.equal(matchRoute("/start/needs/")?.name, "needs");
  assert.equal(matchRoute("/start"), undefined);
  assert.equal(matchRoute("/funding-commons"), undefined);
});

test("intake steps and saving are form pages; browsing pages are not", () => {
  const forms = ROUTES.filter((route) => route.form).map((route) => route.name);
  assert.deepEqual(forms, ["initiative", "needs", "offers", "save"]);
});

test("each page names itself in the browser tab", () => {
  assert.equal(documentTitle(matchRoute("/")), "Weave");
  assert.equal(documentTitle(matchRoute("/matches")), "Partners for you | Weave");
  assert.equal(documentTitle(undefined), "Page not found | Weave");
  assert.equal(pathTo("directory"), "/directory");
  assert.throws(() => pathTo("places" as never));
});
