import type { ListingRecord } from "../listing.ts";
import { STAGE_LABELS } from "../listing.ts";
import { fullDate } from "../home.ts";
import { Link } from "../router.tsx";
import { recordPath } from "../routes.ts";
import { ButtonLink } from "./ButtonLink.tsx";
import { Card } from "./Card.tsx";
import { Fit } from "./Fit.tsx";
import { Media } from "./Media.tsx";
import { WorkTag } from "./WorkTag.tsx";

/** Shared listing Card composition. Home uses h3 under its section headings. */
export function ListingCard({
  record,
  personalized = false,
  level = 2,
  days,
}: {
  record: ListingRecord;
  personalized?: boolean;
  level?: 2 | 3;
  days?: number;
}) {
  const Title = level === 3 ? "h3" : "h2";
  return (
    <Card>
      {record.kind === "initiative" && <Media />}
      {(record.amount || record.closes || days !== undefined) && (
        <p className="rc-meta">
          {[
            record.amount,
            days !== undefined
              ? `${days} ${days === 1 ? "day" : "days"} left`
              : record.closes
                ? `Closes ${fullDate(record.closes)}`
                : undefined,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
      <Title className="rc-card-title">
        <Link href={recordPath(record.kind, record.id)}>{record.title}</Link>
      </Title>
      {personalized && record.fit && (
        <Fit
          level={record.fit}
          explanation={`${record.reasons.join(" ")} Fictional example fit; check eligibility with the funder.`}
        />
      )}
      <p className="rc-card-meta">
        {record.place}
        {record.kind === "initiative" ? `, ${STAGE_LABELS[record.stage]}` : ""}
      </p>
      {days !== undefined && record.closes && (
        <p className="rc-meta">
          Closes <time dateTime={record.closes}>{fullDate(record.closes)}</time>
        </p>
      )}
      <ul className="rc-tag-list" aria-label="Type of work">
        {record.work.map((work) => (
          <li key={work}>
            <WorkTag work={work} />
          </li>
        ))}
      </ul>
      <p className="rc-card-summary">{record.description}</p>
      <p className="rc-meta">
        {level === 3 && record.sharedOn ? (
          <>
            Example shared <time dateTime={record.sharedOn}>{fullDate(record.sharedOn)}</time>
          </>
        ) : (
          <>Example confirmed {fullDate(record.confirmed)}</>
        )}
      </p>
      <div className="rc-action-bar">
        <ButtonLink href={recordPath(record.kind, record.id)} variant="secondary">
          Read the example
        </ButtonLink>
      </div>
    </Card>
  );
}
