import { Link } from "../router.tsx";
import { Icon } from "./Icon.tsx";
import { SECTIONS } from "./sections.ts";

/** Bottom navigation organism (`rc-bottom-nav`): the sections on phones, icon and word. */
export function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="rc-bottom-nav" aria-label="Main">
      {SECTIONS.map((section) => (
        <Link key={section.href} href={section.href} aria-current={section.href === pathname ? "page" : undefined}>
          <Icon name={section.icon} />
          {section.label}
        </Link>
      ))}
    </nav>
  );
}
