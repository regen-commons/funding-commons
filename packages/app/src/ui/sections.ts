import type { IconName } from "./Icon.tsx";

/** The app's top-level sections, shared by the header and the bottom navigation. */
export const SECTIONS: readonly { label: string; href: string; icon: IconName }[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Partners", href: "/matches", icon: "people" },
  { label: "Funding", href: "/directory", icon: "funding" },
];
