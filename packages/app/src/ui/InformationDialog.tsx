import { useEffect, useRef } from "react";
export type Information = "storage" | "assistant" | "policy";
const CONTENT: Record<Information, { title: string; body: string }> = {
  storage: {
    title: "What we store",
    body: "Nothing you describe is sent or saved in this version. An Appearance choice stays in this browser. Saving and sharing will ask you first when they become available.",
  },
  assistant: {
    title: "What the assistant did",
    body: "The assistant has not run. Nothing has been sent to a cloud model.",
  },
  policy: {
    title: "Data policy",
    body: "Weave's full data policy will be available before saving or sharing opens. This version sends no initiative data. An Appearance choice is kept on this device only.",
  },
};
/** Minimal information destinations for the frame. Full data records arrive in Step 8. */
export function InformationDialog({
  information,
  onClose,
}: {
  information: Information | null;
  onClose: () => void;
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
        <button className="rc-button" data-variant="secondary" type="submit">
          Close
        </button>
      </form>
    </dialog>
  );
}
