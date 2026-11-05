import { Link } from "../router.tsx";
import { matchRoute, pathTo } from "../routes.ts";
import { Icon } from "./Icon.tsx";
import { Logo } from "./Logo.tsx";
import { SECTIONS } from "./sections.ts";
export function AppHeader({
  pathname,
  sections,
  status,
}: {
  pathname: string;
  sections: boolean;
  status: "none" | "device" | "account";
}) {
  const current = matchRoute(pathname)?.section;
  return (
    <header className="rc-app-header">
      <Logo />
      {sections && (
        <nav className="rc-app-nav" aria-label="Main">
          {SECTIONS.map((section) => (
            <Link
              key={section.route}
              href={pathTo(section.route)}
              aria-current={section.route === current ? "page" : undefined}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      )}
      <div className="rc-app-header-state">
        <p className="rc-save-status" data-state={status}>
          <Icon name={status === "account" ? "done" : "device"} size="sm" />
          {status === "account"
            ? "Saved"
            : status === "device"
              ? "Saved on this device only"
              : "Nothing saved yet"}
        </p>
        {status === "account" && (
          <Link className="rc-account" href={pathTo("settings")} aria-label="Your account and settings">
            A
          </Link>
        )}
      </div>
    </header>
  );
}
