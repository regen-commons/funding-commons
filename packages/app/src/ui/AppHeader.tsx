import { Link } from "../router.tsx";
import { Logo } from "./Logo.tsx";
import { SECTIONS } from "./sections.ts";

/** App header organism (`rc-app-header`). Form pages drop the sections. */
export function AppHeader({ pathname, sections }: { pathname: string; sections: boolean }) {
  return (
    <header className="rc-app-header">
      <Logo />
      {sections && (
        <nav className="rc-app-nav" aria-label="Main">
          {SECTIONS.filter((section) => section.href !== "/").map((section) => (
            <Link key={section.href} href={section.href} aria-current={section.href === pathname ? "page" : undefined}>
              {section.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
