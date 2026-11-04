import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader.tsx";
import { BottomNav } from "./BottomNav.tsx";

/**
 * Page shell template (`rc-page`): skip link, header, main and, outside form pages,
 * the bottom navigation. Main takes focus after each navigation.
 */
export function Page({ pathname, form, children }: { pathname: string; form: boolean; children: ReactNode }) {
  return (
    <div className="rc-page">
      <a className="rc-skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader pathname={pathname} sections={!form} />
      <main className="rc-main" id="main" tabIndex={-1}>
        {children}
      </main>
      {!form && <BottomNav pathname={pathname} />}
    </div>
  );
}
