/** The design system's sprite icons the app uses, served at /brand/icons.svg. */
export const ICON_NAMES = ["mark", "home", "people", "funding", "device", "check", "globe"] as const;

export type IconName = (typeof ICON_NAMES)[number];
