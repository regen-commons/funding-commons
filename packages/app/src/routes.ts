/** Every page in the app. Names are stable keys; titles are what people read. */
export type RouteName = "home" | "initiative" | "needs" | "offers" | "matches" | "directory" | "save";

export interface Route {
  readonly name: RouteName;
  readonly path: string;
  /** The page's one heading, echoed in the browser tab. */
  readonly title: string;
  /** Form pages keep only the product name in the header, as the app dialect says. */
  readonly form: boolean;
}

export const ROUTES: readonly Route[] = [
  { name: "home", path: "/", title: "Find partners and funding for regenerative work", form: false },
  { name: "initiative", path: "/start/initiative", title: "Tell us about your initiative", form: true },
  { name: "needs", path: "/start/needs", title: "What does your initiative need?", form: true },
  { name: "offers", path: "/start/offers", title: "What can your initiative offer?", form: true },
  { name: "matches", path: "/matches", title: "Partners for you", form: false },
  { name: "directory", path: "/directory", title: "Funding directory", form: false },
  { name: "save", path: "/save", title: "Keep your initiative", form: true },
];

/** The three steps of the intake conversation, in order (PRD 6.2). */
export const INTAKE_STEPS = [
  { route: "initiative", label: "Initiative" },
  { route: "needs", label: "Needs" },
  { route: "offers", label: "Offers" },
] as const satisfies readonly { route: RouteName; label: string }[];

/** The route for a pathname, ignoring a trailing slash, or undefined when none matches. */
export function matchRoute(pathname: string): Route | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ROUTES.find((route) => route.path === path);
}

export function pathTo(name: RouteName): string {
  const route = ROUTES.find((candidate) => candidate.name === name);
  if (!route) throw new Error(`No route named ${name}`);
  return route.path;
}

/** The browser tab title for a page; home carries the product name alone. */
export function documentTitle(route: Route | undefined): string {
  if (!route) return "Page not found | Weave";
  return route.name === "home" ? "Weave" : `${route.title} | Weave`;
}
