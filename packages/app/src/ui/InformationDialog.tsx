import { useEffect, useRef } from "react";
import { INTAKE_STEPS } from "../routes.ts";
export type Information = "storage" | "assistant" | "policy";
const CONTENT: Record<Information, { title: string; body: string }> = {
  storage: {
    title: "What we store",
    body: "Your conversation, files, links, card and preferences stay in this browser. No initiative data is shared by Weave. You can edit your words here or clear this site’s browser storage. Account saving and sharing will ask you first when they become available.",
  },
  assistant: {
    title: "What the assistant did",
    body: "Card builds and attempts are listed below without your text. Nothing has been sent to a cloud model.",
  },
  policy: {
    title: "Data policy",
    body: "Weave's full data policy will be available before saving or sharing opens. This version sends no initiative data. Drafts and preferences stay on this device only.",
  },
};
/** Minimal information destinations for the frame. Full data records arrive in Step 8. */
export function InformationDialog({
  information,
  onClose,
  runs,
}: {
  information: Information | null;
  onClose: () => void;
  runs: readonly import("../describe/contracts.ts").AiRun[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (information && !dialog.open) dialog.showModal();
    if (!information && dialog.open) dialog.close();
  }, [information]);
  const content = information ? CONTENT[information] : CONTENT.storage;
  return (
    <dialog
      className="rc-dialog"
      data-presentation="information"
      ref={ref}
      aria-labelledby="frame-information-title"
      onClose={onClose}
    >
      <form method="dialog" className="rc-dialog-body">
        <h2 className="rc-dialog-title" id="frame-information-title">
          {content.title}
        </h2>
        <p>{content.body}</p>
        {information === "assistant" && (
          <>
            <p className="rc-meta">
              {runs.length} local or example builds and attempts. Zero words sent to the cloud.
            </p>
            <dl className="rc-facts">
              {runs.map((run) => (
                <div key={run.id}>
                  <dt>
                    {INTAKE_STEPS.find((step) => step.route === run.step)!.label}:{" "}
                    {run.engine === "fixture" ? "Example" : "On this device"}, {run.model}
                  </dt>
                  <dd>
                    {run.words} words, {run.status}. No text is kept in this record.
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <button className="rc-button" data-variant="secondary" type="submit">
          Close
        </button>
      </form>
    </dialog>
  );
}
