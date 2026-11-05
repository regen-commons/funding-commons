import { createContext, useContext, useState, type ReactNode } from "react";
import { TaskDialog } from "../ui/TaskDialog.tsx";
import { SocialAction } from "../social/Action.tsx";
import { useSocialFixture } from "../social/context.tsx";
import { AccountSection } from "./AccountSection.tsx";
const DoorContext = createContext<(() => void) | null>(null);
export function AccountDoorProvider({ children }: { children: ReactNode }) {
  const social = useSocialFixture();
  const [open, setOpen] = useState(false);
  return (
    <DoorContext.Provider value={() => setOpen(true)}>
      {children}
      <TaskDialog title="Save or load your card" open={open} onClose={() => setOpen(false)}>
        {import.meta.env.DEV && social ? (
          <SocialAction intent={{ kind: "save" }} inline />
        ) : (
          <AccountSection autoFocus />
        )}
      </TaskDialog>
    </DoorContext.Provider>
  );
}
export function useAccountDoor() {
  const open = useContext(DoorContext);
  if (!open) throw new Error("AccountDoorProvider is required");
  return open;
}
export function SaveAction({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const open = useAccountDoor();
  return (
    <button className="rc-button" data-variant={variant} type="button" onClick={open}>
      {children}
    </button>
  );
}
