import { useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader.tsx";
import { BottomNav } from "./BottomNav.tsx";
import { Footer } from "./Footer.tsx";
import { InformationDialog, type Information } from "./InformationDialog.tsx";
export function Page({
  pathname,
  form,
  status,
  children,
}: {
  pathname: string;
  form: boolean;
  status: "none" | "device" | "account";
  children: ReactNode;
}) {
  const [information, setInformation] = useState<Information | null>(null);
  return (
    <div className="rc-page">
      <a className="rc-skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader pathname={pathname} sections={!form} status={status} />
      <main key={pathname} className="rc-main" id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer slim={form} onInformation={setInformation} />
      {!form && <BottomNav pathname={pathname} />}
      <InformationDialog information={information} onClose={() => setInformation(null)} />
    </div>
  );
}
