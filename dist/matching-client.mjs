// A worker is an opt-in resource. Stopping it cancels downloads, frees the model,
// and discards private query embeddings. Nothing private is cached or uploaded.
export class LocalMatcher {
  constructor(
    onChange,
    workerFactory = () =>
      new Worker(new URL("./match-worker.mjs", import.meta.url), {
        type: "module",
      }),
  ) {
    this.onChange = onChange;
    this.workerFactory = workerFactory;
    this.epoch = 0;
    this.state = {
      status: "off",
      message: "Keyword matching is ready. Local AI is optional.",
      scores: null,
    };
  }
  emit(patch) {
    this.state = { ...this.state, ...patch };
    this.onChange(this.state);
  }
  cancel(message = "Local AI stopped. Keyword matching is active.") {
    this.epoch++;
    clearTimeout(this.timer);
    this.worker?.terminate();
    this.worker = null;
    this.emit({ status: "off", message, scores: null });
  }
  match(text, corpusHash) {
    const requestId = ++this.epoch;
    clearTimeout(this.timer);
    this.emit({
      status: "loading",
      message: "Preparing private matching…",
      scores: null,
    });
    const fail = () => {
      if (requestId !== this.epoch) return;
      this.worker?.terminate();
      this.worker = null;
      clearTimeout(this.timer);
      this.emit({
        status: "error",
        message:
          "Local AI could not run. Keyword matching is active. Retry when your connection or device is ready.",
        scores: null,
      });
    };
    this.fail = fail;
    try {
      if (!this.worker) {
        this.worker = this.workerFactory();
        const worker = this.worker;
        this.worker.onmessage = ({ data }) => {
          if (this.worker !== worker) return;
          if (data.type === "progress") {
            this.emit({ message: data.message });
            return;
          }
          if (data.requestId !== this.epoch) return;
          if (data.type === "error") {
            this.fail();
            return;
          }
          if (data.type === "result") {
            clearTimeout(this.timer);
            this.emit({
              status: "ready",
              message:
                "Local AI is ready. Your project was matched on this device.",
              scores: data.scores,
            });
          }
        };
        this.worker.onerror = () => {
          if (this.worker === worker) this.fail();
        };
        this.worker.onmessageerror = () => {
          if (this.worker === worker) this.fail();
        };
      }
      // Includes cold model download; always offers a visible cancel button.
      this.timer = setTimeout(fail, 180000);
      this.worker.postMessage({ text, corpusHash, requestId });
    } catch {
      fail();
    }
  }
}
