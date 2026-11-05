import { Link } from "../router.tsx";
import { matchRoute, pathTo } from "../routes.ts";
import { Icon } from "./Icon.tsx";
import { Logo } from "./Logo.tsx";
import { SECTIONS } from "./sections.ts";
export type SaveStatus = "none" | "device" | "account" | "saving" | "memory" | "conflict";
export function AppHeader({
  pathname,
  sections,
  status,
}: {
  pathname: string;
  sections: boolean;
  status: SaveStatus;
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
              : status === "saving"
                ? "Saving on this device"
                : status === "memory"
                  ? "Not saved on this device"
                  : status === "conflict"
                    ? "Draft changed in another tab"
                    : "Nothing saved yet"}
        </p>
        <Link
          className="rc-button"
          data-variant="quiet"
          href={pathTo("settings")}
          aria-label="Your account and settings"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
