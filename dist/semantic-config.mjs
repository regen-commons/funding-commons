// One model contract for public corpus generation and private browser queries.
export const MODEL = Object.freeze({
  id: "mixedbread-ai/mxbai-embed-xsmall-v1",
  revision: "b0561d9a97e6b298da39f0ef3e7d3cf153b1b29a",
  dtype: "q8",
  dimensions: 256,
  corpusVersion: 3,
  weightsSha256:
    "952f996d8cf46c311ee8654a750fa942b71c8b94aabe69d043dbb2bcaff5528e",
});
export function unitVector(values) {
  const vector = Float32Array.from(values.slice(0, MODEL.dimensions));
  const norm = Math.hypot(...vector);
  if (vector.length !== MODEL.dimensions || !Number.isFinite(norm) || !norm)
    throw new Error("The embedding is invalid.");
  return vector.map((x) => x / norm);
}
