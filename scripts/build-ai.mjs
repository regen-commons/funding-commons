import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  stat,
  readdir,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { MODEL, unitVector } from "../dist/semantic-config.mjs";
import { corpusDocuments, validConditions } from "../dist/matching.mjs";
import { COUNTRIES, US_STATES } from "../dist/storage.mjs";
const root = new URL("../", import.meta.url);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const file = (path) => new URL(path, root);
const json = async (path) => JSON.parse(await readFile(file(path), "utf8"));
const modelBase = `dist/models/${MODEL.revision}/${MODEL.id}/`;
const assetHashes = await json("research/model-assets.json");
const modelFiles = [
  "config.json",
  "config_sentence_transformers.json",
  "modules.json",
  "special_tokens_map.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "vocab.txt",
  "1_Pooling/config.json",
  "onnx/model_quantized.onnx",
];
await mkdir(file("dist/assets/ort/"), { recursive: true });
for (const name of modelFiles) {
  const path = modelBase + name;
  let exists = false;
  try {
    exists = (await stat(file(path))).size > 0;
  } catch {}
  if (exists) exists = hash(await readFile(file(path))) === assetHashes[name];
  if (!exists) {
    console.log(`Fetching pinned public model asset: ${name}`);
    const response = await fetch(
      `https://huggingface.co/${MODEL.id}/resolve/${MODEL.revision}/${name}`,
      { signal: AbortSignal.timeout(120000) },
    );
    if (!response.ok)
      throw new Error(`Model download failed: ${name}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (hash(bytes) !== assetHashes[name])
      throw new Error(`Model asset failed integrity verification: ${name}`);
    await mkdir(new URL(".", file(path)), { recursive: true });
    await writeFile(file(path), bytes);
  }
}
// External WASM is always same-origin. One thread works without COOP/COEP.
await build({
  entryPoints: [file("src/embedding-runtime.js").pathname],
  outfile: file("dist/assets/embedding-runtime.js").pathname,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
  conditions: ["onnxruntime-web-use-extern-wasm"],
  legalComments: "linked",
});
for (const name of [
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
]) {
  await copyFile(
    file(`node_modules/onnxruntime-web/dist/${name}`),
    file(`dist/assets/ort/${name}`),
  );
}
await copyFile(
  file("node_modules/@huggingface/transformers/LICENSE"),
  file("dist/assets/TRANSFORMERS-LICENSE"),
);
await copyFile(
  file("node_modules/onnxruntime-web/README.md"),
  file("dist/assets/ONNX-README.md"),
);
await copyFile(file("research/ONNX-LICENSE"), file("dist/assets/ONNX-LICENSE"));
await copyFile(
  file("research/MODEL-README.md"),
  file("dist/assets/MODEL-README.md"),
);
await writeFile(
  file("dist/data/model-assets.json"),
  JSON.stringify(assetHashes),
);
const sourceRules = await json("research/eligibility-rules.json");
const expandedRules = (
  await Promise.all(
    (
      await readdir(file("research/"))
    )
      .filter((p) => /^expanded-eligibility-\d+\.json$/.test(p))
      .map((p) => json("research/" + p)),
  )
).flatMap((r) => r.rules);
const rules = {
  ...sourceRules,
  rules: [...sourceRules.rules, ...expandedRules].map((r) => ({
    ...r,
    field:
      r.field === "applicantCountry"
        ? r.programId === "calala-radix-call-2-2026"
          ? "registrationCountry"
          : "applicantBaseCountry"
        : r.field,
    checkedOn: r.checkedOn || "2026-10-15",
  })),
};
const data = await json("dist/data/funders.json");
const conditions = await json("research/program-conditions.json");
if (!validConditions(conditions, data.funds)) throw new Error("Program conditions lack retained source/program evidence or contain invalid assertions.");
await writeFile(file("dist/data/program-conditions.json"), JSON.stringify(conditions, null, 2) + "\n");
const keys = new Set();
for (const rule of rules.rules) {
  const fields = [
    "workCountries",
    "benefitCountries",
    "applicantBaseCountry",
    "registrationCountry",
    "applicantType",
    "usWorkStates", "usBenefitStates",
  ];
  const values =
    rule.field === "applicantType"
      ? [
          "nonprofit",
          "informal",
          "individual",
          "business",
          "university",
          "public-body",
        ]
      : ["usWorkStates", "usBenefitStates"].includes(rule.field) ? Object.keys(US_STATES) : COUNTRIES;
  if (
    !fields.includes(rule.field) ||
    (rule.kind != null && !["prerequisite", "priority"].includes(rule.kind)) ||
    (rule.alternativeField && (!fields.includes(rule.alternativeField) || rule.operator !== "only" || rule.alternativeField === rule.field)) ||
    (rule.localRequirement != null && (typeof rule.localRequirement !== "string" || !rule.localRequirement.trim())) ||
    !["only", "exclude"].includes(rule.operator) ||
    !Array.isArray(rule.values) ||
    !rule.values.length ||
    rule.values.some((v) => !values.includes(v)) ||
    !rule.reason?.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(rule.checkedOn) ||
    !Number.isFinite(Date.parse(rule.checkedOn))
  )
    throw new Error("Invalid eligibility assertion: " + rule.fundId);
  const fund = data.funds.find((f) => f.id === rule.fundId);
  if (
    !fund?.enrichment.programs.some((p) => p.id === rule.programId) ||
    !fund.enrichment.sources.some((s) => s.url === rule.sourceUrl)
  )
    throw new Error(
      "Eligibility rule lacks retained program/source: " +
        rule.fundId +
        " " +
        rule.programId,
    );
  const key = JSON.stringify([
    rule.fundId,
    rule.programId,
    rule.field,
    rule.alternativeField || "",
    rule.operator,
    [...rule.values].sort(),
  ]);
  if (keys.has(key)) throw new Error("Duplicate eligibility assertion");
  keys.add(key);
}
await writeFile(
  file("dist/data/eligibility-rules.json"),
  JSON.stringify(rules, null, 2) + "\n",
);
const texts = corpusDocuments(data.funds);
const corpusHash = hash(JSON.stringify({ model: MODEL, texts }));
let old;
try {
  old = await json("dist/data/fund-vectors.json");
} catch {}
if (
  old?.corpusHash !== corpusHash ||
  old?.binarySha256 !==
    hash(
      await readFile(file("dist/data/fund-vectors.f32")).catch(() =>
        Buffer.alloc(0),
      ),
    )
) {
  const { env, pipeline } = await import("@huggingface/transformers");
  env.allowRemoteModels = false;
  env.localModelPath = file(`dist/models/${MODEL.revision}/`).pathname;
  env.useFSCache = false;
  const embed = await pipeline("feature-extraction", MODEL.id, {
    dtype: MODEL.dtype,
    device: "cpu",
    local_files_only: true,
  });
  const vectors = new Float32Array(texts.length * MODEL.dimensions);
  for (let i = 0; i < texts.length; i++) {
    const tensor = await embed(texts[i].text, {
      pooling: "mean",
      normalize: true,
    });
    vectors.set(unitVector(tensor.data), i * MODEL.dimensions);
    tensor.dispose();
    if ((i + 1) % 100 === 0)
      console.log(`Embedded ${i + 1}/${texts.length} public program documents`);
  }
  await embed.dispose();
  const binary = Buffer.from(vectors.buffer);
  await writeFile(file("dist/data/fund-vectors.f32"), binary);
  await writeFile(
    file("dist/data/fund-vectors.json"),
    JSON.stringify(
      {
        model: MODEL,
        corpusHash,
        ids: texts.map((t) => t.id),
        textHashes: texts.map((t) => hash(t.text)),
        binarySha256: hash(binary),
        createdOn: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );
}
const assets = [
  ...modelFiles.map((f) => modelBase + f),
  "dist/assets/embedding-runtime.js",
  "dist/assets/ort/ort-wasm-simd-threaded.mjs",
  "dist/assets/ort/ort-wasm-simd-threaded.wasm",
  "dist/data/fund-vectors.f32",
];
let total = 0;
for (const path of assets) {
  const { size } = await stat(file(path));
  if (size > 25 * 1024 * 1024)
    throw new Error(`Asset exceeds hosting limit: ${path}`);
  total += size;
}
console.log(
  `AI assets ready: ${texts.length} program/overview documents across all ${data.funds.length} funds, ${(total / 1e6).toFixed(1)} MB cold download; pinned weights verified.`,
);
