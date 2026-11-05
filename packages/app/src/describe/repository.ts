import { DeviceDraftSchema, type DeviceDraft } from "./contracts.ts";

export class DraftConflict extends Error {
  constructor() {
    super("Another tab changed this draft. Copy your words before reloading.");
  }
}
export interface DraftRepository {
  load(): Promise<DeviceDraft | null>;
  save(draft: DeviceDraft, expectedRevision: number | null): Promise<void>;
}
export class MemoryDraftRepository implements DraftRepository {
  value: DeviceDraft | null;
  constructor(seed: DeviceDraft | null = null) {
    this.value = seed;
  }
  async load() {
    return this.value;
  }
  async save(draft: DeviceDraft, expectedRevision: number | null) {
    if ((this.value?.revision ?? null) !== expectedRevision) throw new DraftConflict();
    this.value = DeviceDraftSchema.parse(draft);
  }
}
