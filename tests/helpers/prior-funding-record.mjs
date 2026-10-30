import assert from 'node:assert/strict';
import fs from 'node:fs';
export const verificationBaseline = JSON.parse(fs.readFileSync(new URL('../../research/history-verification-baseline.json', import.meta.url)));

// Reconstruct the prior revision solely by removing this pass's appended terms.
// No descriptive field, old program, source or verification date may be reset.
export function priorFundingRecord(fund) {
  const prefix = verificationBaseline.appendedTo[fund.id];
  if (!prefix) return fund;
  assert.ok(fund.enrichment.programs.length > prefix.programCount, fund.id);
  assert.ok(fund.enrichment.sources.length >= prefix.sourceCount, fund.id);
  assert.deepEqual(fund.additionalSources, fund.enrichment.sources.slice(1).map(s => s.url));
  const prior = structuredClone(fund);
  prior.enrichment.programs = prior.enrichment.programs.slice(0, prefix.programCount);
  prior.enrichment.sources = prior.enrichment.sources.slice(0, prefix.sourceCount);
  prior.additionalSources = prefix.additionalSources;
  return prior;
}
