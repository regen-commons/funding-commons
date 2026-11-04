import { Link } from "../router.tsx";
import { matchRoute, pathTo } from "../routes.ts";
import { Logo } from "./Logo.tsx";
import { SECTIONS } from "./sections.ts";

/** App header organism (`rc-app-header`). Form pages drop the sections. */
export function AppHeader({ pathname, sections }: { pathname: string; sections: boolean }) {
  const current = matchRoute(pathname)?.name;
  return (
    <header className="rc-app-header">
      <Logo />
      {sections && (
        <nav className="rc-app-nav" aria-label="Main">
          {SECTIONS.filter((section) => section.route !== "home").map((section) => (
            <Link key={section.route} href={pathTo(section.route)} aria-current={section.route === current ? "page" : undefined}>
              {section.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
