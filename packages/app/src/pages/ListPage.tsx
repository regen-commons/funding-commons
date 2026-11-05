import { useState } from "react";
import type { FixtureContext } from "../fixtures.ts";
import {
  EMPTY_FILTERS,
  selectRecords,
  STAGE_LABELS,
  type ListingRecord,
  type CapitalKey,
} from "../listing.ts";
import { Link, navigate } from "../router.tsx";
import { pathTo, recordPath } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { Card, CardGrid } from "../ui/Card.tsx";
import { EmptyState } from "../ui/EmptyState.tsx";
import { FilterBar } from "../ui/FilterBar.tsx";
import { Fit } from "../ui/Fit.tsx";
import { Heading } from "../ui/Heading.tsx";
import { ListLayout } from "../ui/layouts.tsx";
import { Media } from "../ui/Media.tsx";
import { WorkTag } from "../ui/WorkTag.tsx";

const date = (iso: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
function RecordCard({ record, personalized }: { record: ListingRecord; personalized: boolean }) {
  return (
    <Card>
      {record.kind === "initiative" && <Media />}
      {record.amount && (
        <p className="rc-meta">
          {record.amount}
          {record.closes ? `, closes ${date(record.closes)}` : ""}
        </p>
      )}
      <h2 className="rc-card-title">
        <Link href={recordPath(record.kind, record.id)}>{record.title}</Link>
      </h2>
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
      <ul className="rc-tag-list" aria-label="Type of work">
        {record.work.map((work) => (
          <li key={work}>
            <WorkTag work={work} />
          </li>
        ))}
      </ul>
      <p className="rc-card-summary">{record.description}</p>
      <p className="rc-meta">Example confirmed {date(record.confirmed)}</p>
      <div className="rc-action-bar">
        <ButtonLink href={recordPath(record.kind, record.id)} variant="secondary">
          Read the example
        </ButtonLink>
      </div>
    </Card>
  );
}
export function ListPage({
  title,
  kind,
  fixture,
  subject,
}: {
  title: string;
  kind: "partners" | "funding" | "initiatives";
  fixture?: FixtureContext;
  subject?: { needs: readonly CapitalKey[]; offers: readonly CapitalKey[] };
}) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const records = fixture ? (kind === "funding" ? fixture.funding : fixture.initiatives) : [];
  const personalized = !!fixture && fixture.scenario !== "visitor";
  const visibleFilters = personalized
    ? filters
    : {
        ...filters,
        relation: "any" as const,
        sort: filters.sort === "fit" ? ("name" as const) : filters.sort,
      };
  const selected = selectRecords(records, visibleFilters, subject);
  const partners = kind === "partners";
  function retry() {
    const url = new URL(window.location.href);
    url.searchParams.set("state", "ready");
    navigate(`${url.pathname}${url.search}`);
  }
  return (
    <ListLayout>
      <Heading level={1} size="page">
        {title}
      </Heading>
      <p className="rc-prose">
        {kind === "funding"
          ? "Find support for your next chapter."
          : partners
            ? "Find people whose work complements yours."
            : "See the work people are sharing."}
      </p>
      {partners && fixture?.scenario !== "shared" ? (
        <section className="rc-card">
          <h2 className="rc-card-title">Partners open when you share</h2>
          <p>
            {fixture && fixture.scenario !== "visitor"
              ? `${records.length} example partners match. Share your initiative to see their cards.`
              : "Describe your initiative to find funding and see how many partners match."}
          </p>
          <div className="rc-action-bar">
            <ButtonLink variant="primary" href={pathTo("initiative")}>
              Describe your initiative
            </ButtonLink>
          </div>
        </section>
      ) : !records.length ? (
        <EmptyState
          title={kind === "funding" ? "Funding is in the current directory" : "No initiatives here yet"}
          action={
            <ButtonLink
              variant="primary"
              href={kind === "funding" ? "https://funding-commons.vercel.app/" : pathTo("initiative")}
            >
              {kind === "funding" ? "Browse current funding" : "Describe your initiative"}
            </ButtonLink>
          }
        >
          {kind === "funding"
            ? "Every funder and program remains available in Funding Commons."
            : "Shared initiatives will appear here."}
        </EmptyState>
      ) : fixture?.state === "error" ? (
        <section className="rc-notice" data-tone="warning">
          <div className="rc-notice-body">
            <h2 className="rc-notice-title">The example list did not load</h2>
            <p>Your search and filter choices are still here.</p>
            <button className="rc-button" data-variant="secondary" type="button" onClick={retry}>
              Try again
            </button>
          </div>
        </section>
      ) : fixture?.state === "loading" ? (
        <section className="rc-stack" aria-busy="true" aria-label="Loading example list">
          <p role="status">Loading examples</p>
          <div className="rc-skeleton" />
          <div className="rc-skeleton" />
        </section>
      ) : (
        <>
          {fixture?.state === "offline" && (
            <p className="rc-notice" data-tone="info">
              You are viewing offline examples. Search and filters still work on this device.
            </p>
          )}
          <FilterBar
            filters={visibleFilters}
            onChange={setFilters}
            countries={[...new Set(records.map((record) => record.country))].sort()}
            count={selected.length}
            total={records.length}
            noun={kind === "funding" ? "funds" : "initiatives"}
            partners={partners}
            personalized={personalized}
            funding={kind === "funding"}
          />
          {selected.length ? (
            <CardGrid>
              {selected.map((record) => (
                <li key={record.id}>
                  <RecordCard record={record} personalized={personalized && kind !== "initiatives"} />
                </li>
              ))}
            </CardGrid>
          ) : (
            <EmptyState
              title="Nothing matches these filters"
              action={
                <button
                  className="rc-button"
                  data-variant="secondary"
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                >
                  Clear filters
                </button>
              }
            >
              Try fewer filters or another search.
            </EmptyState>
          )}
        </>
      )}
    </ListLayout>
  );
}
