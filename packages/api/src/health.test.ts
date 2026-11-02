import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "./health.ts";

test("health answers ok as uncached JSON", async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { status: "ok", service: "weave-api", commit: "local" });
});

test("health names the deployed commit without exposing anything else", async () => {
  process.env.VERCEL_GIT_COMMIT_SHA = "0123456789abcdef";
  try {
    assert.deepEqual(await GET().json(), { status: "ok", service: "weave-api", commit: "0123456" });
  } finally {
    delete process.env.VERCEL_GIT_COMMIT_SHA;
  }
});
