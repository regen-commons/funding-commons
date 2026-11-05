import type { Fit as FitLevel } from "../listing.ts";
import { Tooltip } from "./Tooltip.tsx";
const LABELS: Record<FitLevel, string> = { strong: "Strong fit", good: "Good fit", possible: "Possible fit" };
export function Fit({ level, explanation }: { level: FitLevel; explanation: string }) {
  return (
    <Tooltip text={explanation}>
      <span className="rc-fit" data-level={level}>
        <span className="rc-fit-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {LABELS[level]}
      </span>
    </Tooltip>
  );
}
