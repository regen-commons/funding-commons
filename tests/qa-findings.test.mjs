import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rankFunds, createLexicalIndex, corpusDocuments, conditionKey, validConditions } from '../dist/matching.mjs';
import { normalizeProject, emptySaved, upsertProject } from '../dist/storage.mjs';
import { favoritesCsv } from '../dist/domain.mjs';

const json = path => JSON.parse(fs.readFileSync(new URL('../' + path, import.meta.url)));
const funds = json('dist/data/funders.json').funds;
const rules = json('dist/data/eligibility-rules.json').rules;
const conditionData = json('research/program-conditions.json');
const now = new Date('2026-10-29T12:00:00Z');
const project = normalizeProject({ id: 'solar-qa', name: 'Community hubs',
  description: 'Solar electricity, internet connectivity and digital skills for university students in Nigeria',
  tags: ['renewable energy', 'digital inclusion'], workCountries: ['NG'], benefitCountries: ['NG'],
  applicantType: 'nonprofit', fundingInstruments: ['grant', 'prize'] });
const fund = id => funds.find(f => f.id === id);
const volta = fund('recJhLCTQlCWJPOzF');
const verizon = fund('recUN8nEtimhdGZeE');
const acf = fund('recJ1RkPCopa1OU3p');
function rank(selected, profile = project, conditions = conditionData.conditions) {
  const semantic = Object.fromEntries(corpusDocuments(selected).map(d => [d.id, 0.75]));
  return rankFunds(selected, profile, createLexicalIndex(selected), rules, semantic, now, conditions);
}
const answer = (c, value) => [conditionKey(c), { answer: value, sourceCheckedOn: c.checkedOn }];

test('overview-only funding offers are separated and demoted without losing thematic fit or source identity', () => {
  const ranked = rank([volta, acf]);
  const overview = ranked.find(m => m.fund.id === volta.id);
  assert.equal(overview.group, 'unverified');
  assert.equal(overview.readiness.label, 'Funding offer unverified');
  assert.ok(overview.score <= 9);
  assert.ok(overview.thematicFit.score >= 60);
  assert.equal(ranked[0].fund.id, acf.id);
  assert.equal(overview.fund.enrichment.sourceRecordId, volta.id);
  assert.equal(overview.eligibility.status, 'needs_confirmation');
  const saved = upsertProject(emptySaved(), project);
  saved.lists[project.id] = [volta.id];
  const csv = favoritesCsv(funds, saved, project.id, now, new Map([[volta.id, overview]]));
  assert.ok(csv.includes(volta.id));
  assert.ok(csv.includes('Funding offer unverified'));
});

test('a closed documented program is not confused with an unverified offer', () => {
  const m = rank([fund('recOExYwWRXF9whgo')])[0];
  assert.ok(m.program);
  assert.notEqual(m.group, 'unverified');
  assert.equal(m.readiness.status, 'closed');
});

test('Verizon legal status and conditional education scope have retained official evidence', () => {
  const cs = conditionData.conditions.filter(c => c.fundId === verizon.id);
  assert.equal(cs.length, 2);
  assert.equal(validConditions(conditionData, funds), true);
  assert.ok(cs.some(c => c.category === 'applicant_model' && /501\(c\)\(3\).*OR.*NCES/.test(c.requirement)));
  assert.ok(cs.some(c => c.category === 'beneficiary' && /education request/.test(c.requirement) && /K–12/.test(c.requirement) && /other funding priorities/.test(c.requirement)));
});

test('NGO status and Nigeria work cannot answer applicant or beneficiary prerequisites', () => {
  const m = rank([verizon])[0];
  assert.equal(m.readiness.label, 'Confirm applicant and beneficiary requirements');
  assert.equal(m.eligibility.status, 'needs_confirmation');
  const pending = m.eligibility.programs.flatMap(p => p.checks).filter(c => c.field === 'condition');
  assert.equal(pending.filter(c => c.missing).length, 2);
  assert.notEqual(m.group, 'lead');
});

test('applicant and beneficiary answers change readiness without changing topical fit', () => {
  const cs = conditionData.conditions.filter(c => c.fundId === verizon.id);
  const applicant = cs.find(c => c.category === 'applicant_model');
  const beneficiary = cs.find(c => c.category === 'beneficiary');
  assert.ok(applicant && beneficiary);
  const before = rank([verizon])[0];
  const partial = rank([verizon], { ...project, programAnswers: Object.fromEntries([answer(applicant, 'yes')]) })[0];
  assert.equal(partial.readiness.label, 'Confirm beneficiary requirements');
  const rejected = rank([verizon], { ...project, programAnswers: Object.fromEntries([answer(beneficiary, 'no')]) })[0];
  assert.equal(rejected.eligibility.status, 'conflict');
  assert.equal(rejected.score, 0);
  assert.equal(rejected.group, 'outside');
  const confirmed = rank([verizon], { ...project, programAnswers: Object.fromEntries(cs.map(c => answer(c, 'yes'))) })[0];
  assert.equal(confirmed.readiness.status, 'relationship');
  assert.equal(confirmed.eligibility.status, 'needs_confirmation');
  for (const m of [partial, rejected, confirmed]) assert.deepEqual(m.thematicFit, before.thematicFit);
});
