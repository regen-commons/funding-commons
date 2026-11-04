import type { RouteName } from "../routes.ts";
import type { IconName } from "./icons.ts";

/** The app's top-level sections, shared by the header and the bottom navigation. */
export const SECTIONS: readonly { label: string; route: RouteName; icon: IconName }[] = [
  { label: "Home", route: "home", icon: "home" },
  { label: "Partners", route: "matches", icon: "people" },
  { label: "Funding", route: "directory", icon: "funding" },
];
