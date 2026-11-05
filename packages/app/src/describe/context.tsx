import { useEffect, useMemo, type ReactNode } from "react";
import type { FixtureContext } from "../fixtures.ts";
import { describeFixture } from "../fixtures.ts";
import { DraftController } from "./controller.ts";
import { MemoryDraftRepository } from "./repository.ts";
import { IndexedDraftRepository } from "./indexed-repository.ts";
const device = new DraftController(new IndexedDraftRepository());
import { DraftContext } from "./draft-context.ts";
export function DraftProvider({ fixture, children }: { fixture?: FixtureContext; children: ReactNode }) {
  const controller = useMemo(() => {
    if (import.meta.env.DEV && fixture) {
      const memory = new MemoryDraftRepository(describeFixture(fixture.describe));
      return new DraftController(
        fixture.describe === "storage-error"
          ? {
              load: () => memory.load(),
              save: async () => {
                throw new Error("Example storage failure");
              },
            }
          : memory,
      );
    }
    return device;
  }, [fixture?.describe, !!fixture]);
  useEffect(() => {
    void controller.initialize();
  }, [controller]);
  useEffect(() => {
    if (!!fixture) return;
    const warn = (event: BeforeUnloadEvent) => {
      const current = controller.getSnapshot();
      if (["saving", "memory", "conflict"].includes(current.storage) && current.draft.revision > 0)
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [controller, !!fixture]);
  return <DraftContext.Provider value={{ controller, fixture: !!fixture }}>{children}</DraftContext.Provider>;
}
