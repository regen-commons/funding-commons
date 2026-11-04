/** Icons from the design system's sprite, served by the app at /brand/icons.svg. */
export type IconName = "mark" | "home" | "people" | "funding" | "device" | "check" | "globe";

/** Icon atom (`rc-icon`). Decorative: the visible word beside it names the action. */
export function Icon({ name, size }: { name: IconName; size?: "sm" | "lg" }) {
  return (
    <svg className="rc-icon" data-size={size} aria-hidden="true">
      <use href={`/brand/icons.svg#${name}`} />
    </svg>
  );
}
