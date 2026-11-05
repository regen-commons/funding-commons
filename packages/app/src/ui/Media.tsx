import { Icon } from "./Icon.tsx";

/** Synthetic media until D30 settles uploads, previews and rights. No remote image request. */
export function Media({ thumb }: { thumb?: boolean }) {
  return (
    <div className="rc-media" data-size={thumb ? "thumb" : undefined}>
      <Icon name="sprout" size="lg" />
      <span>Example image</span>
    </div>
  );
}
