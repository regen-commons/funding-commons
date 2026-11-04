import type { Capital } from "../capitals.ts";

/** Tag atom (`rc-tag`) for a form of capital: the tile glyph and the plain word together. */
export function CapitalTag({ capital }: { capital: Capital }) {
  return (
    <span className="rc-tag" data-capital={capital.key}>
      <span className="rc-tile" aria-hidden="true">
        {capital.glyph}
      </span>
      {capital.label}
    </span>
  );
}
