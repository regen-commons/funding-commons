import { MODEL, unitVector } from "./semantic-config.mjs";
// A URL worker has its own policy context. Enforce the local-only download
// contract here as well as in the page CSP and model loader configuration.
const nativeFetch = self.fetch.bind(self);
self.fetch = (input, options) => {
  const url = new URL(
    input instanceof Request ? input.url : input,
    import.meta.url,
  );
  const method =
    options?.method || (input instanceof Request ? input.method : "GET");
  if (
    url.origin !== new URL(import.meta.url).origin ||
    !["GET", "HEAD"].includes(method.toUpperCase())
  )
    throw new Error(
      "The local matching worker only downloads same-origin public assets.",
    );
  return nativeFetch(input, options);
};
const sha = async (bytes) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
let embed, catalog, vectors;
let loading;
async function initialize() {
  if (loading) return loading;
  loading = (async () => {
    postMessage({
      type: "progress",
      message: "Loading the local model and public fund index…",
    });
    const { env, BertTokenizer, AutoModel, FeatureExtractionPipeline } =
      await import("./assets/embedding-runtime.js");
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = new URL(
      `./models/${MODEL.revision}/`,
      import.meta.url,
    ).href;
    env.useBrowserCache = false;
    const hashesResponse = await fetch(
      new URL("./data/model-assets.json", import.meta.url),
    );
    if (!hashesResponse.ok)
      throw new Error("Model asset inventory could not load.");
    const assetHashes = await hashesResponse.json();
    if (assetHashes["onnx/model_quantized.onnx"] !== MODEL.weightsSha256)
      throw new Error("Model asset inventory is incompatible.");
    // Only public, same-origin assets enter this optional cache. Verify weights
    // even after a cache hit; cache denial must not prevent inference.
    let cache;
    try {
      cache = await caches.open(`funding-commons-model-${MODEL.revision}`);
    } catch {}
    env.fetch = async (input, init) => {
      const url = new URL(input, self.location.href);
      if (
        url.origin !== self.location.origin ||
        !url.pathname.includes(`/models/${MODEL.revision}/`)
      )
        throw new Error("Remote model requests are disabled.");
      const assetName = url.pathname.split(`${MODEL.id}/`)[1];
      if (!assetHashes[assetName])
        return new Response("Not in pinned model inventory", { status: 404 });
      let response;
      try {
        response = await cache?.match(url.href);
      } catch {}
      if (!response) response = await fetch(url, init);
      if (!response.ok) return response;
      const bytes = await response.arrayBuffer();
      if ((await sha(bytes)) !== assetHashes[assetName]) {
        try {
          await cache?.delete(url.href);
        } catch {}
        throw new Error(
          "Model integrity check failed. Retry to download a fresh copy.",
        );
      }
      const verified = new Response(bytes, {
        status: 200,
        headers: response.headers,
      });
      try {
        await cache?.put(url.href, verified.clone());
      } catch {}
      return verified;
    };
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
    env.backends.onnx.wasm.wasmPaths = {
      mjs: new URL("./assets/ort/ort-wasm-simd-threaded.mjs", import.meta.url)
        .href,
      wasm: new URL("./assets/ort/ort-wasm-simd-threaded.wasm", import.meta.url)
        .href,
    };
    const read = async (path) => {
      const response = await fetch(new URL(path, import.meta.url));
      if (!response.ok)
        throw new Error("A local AI asset could not be loaded.");
      return response;
    };
    catalog = await (await read("./data/fund-vectors.json")).json();
    if (JSON.stringify(catalog.model) !== JSON.stringify(MODEL))
      throw new Error("The model and index versions differ.");
    const funds = (await (await read("./data/funders.json")).json()).funds;
    const indexedFunds = new Set(catalog.ids.map(id => id.split("::")[0]));
    if (indexedFunds.size !== funds.length || funds.some(fund => !indexedFunds.has(fund.id)))
      throw new Error("The local fund index does not cover the catalog.");
    const bytes = await (await read("./data/fund-vectors.f32")).arrayBuffer();
    if (
      (await sha(bytes)) !== catalog.binarySha256 ||
      bytes.byteLength !== catalog.ids.length * MODEL.dimensions * 4 ||
      new Set(catalog.ids).size !== catalog.ids.length
    )
      throw new Error("The local fund index failed validation.");
    vectors = new Float32Array(bytes);
    if (!vectors.every(Number.isFinite))
      throw new Error("The local fund index is invalid.");
    const options = {
      dtype: MODEL.dtype,
      device: "wasm",
      local_files_only: true,
      progress_callback: (p) => {
        if (p.status === "progress" && p.file?.endsWith(".onnx"))
          postMessage({
            type: "progress",
            message: `Downloading local model: ${Math.round(p.progress || 0)}%`,
          });
      },
    };
    // Explicit components avoid v4's remote file discovery, which cannot inspect
    // a same-origin local-model directory while remote models are disabled.
    const modelPath = env.localModelPath + MODEL.id + "/";
    const [tokenizerJson, tokenizerConfig, model] = await Promise.all([
      env.fetch(modelPath + "tokenizer.json").then((r) => r.json()),
      env.fetch(modelPath + "tokenizer_config.json").then((r) => r.json()),
      AutoModel.from_pretrained(MODEL.id, options),
    ]);
    if (tokenizerConfig.tokenizer_class !== "BertTokenizer")
      throw new Error("Unexpected tokenizer for pinned model.");
    const tokenizer = new BertTokenizer(tokenizerJson, tokenizerConfig);
    embed = new FeatureExtractionPipeline({
      task: "feature-extraction",
      tokenizer,
      model,
    });
  })().catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
// Serialized work and caller epochs prevent an old profile from replacing new results.
let queue = Promise.resolve();
self.onmessage = ({ data }) => {
  queue = queue.then(async () => {
    try {
      await initialize();
      if (data.corpusHash !== catalog.corpusHash)
        throw new Error(
          "Fund research changed. Reload the page to use AI matching.",
        );
      postMessage({
        type: "progress",
        message: "Matching your project on this device…",
      });
      const tensor = await embed(data.text, {
        pooling: "mean",
        normalize: true,
      });
      const query = unitVector(tensor.data);
      tensor.dispose();
      const scores = Object.fromEntries(
        catalog.ids.map((id, i) => {
          let cosine = 0;
          for (let j = 0; j < MODEL.dimensions; j++)
            cosine += query[j] * vectors[i * MODEL.dimensions + j];
          return [id, Math.max(-1, Math.min(1, cosine))];
        }),
      );
      query.fill(0);
      postMessage({ type: "result", requestId: data.requestId, scores });
    } catch {
      postMessage({
        type: "error",
        requestId: data.requestId,
        message:
          "Local AI could not run. Keyword matching is still available. You can retry the download.",
      });
    }
  });
};
