import type { ListingRecord } from "../listing.ts";
import { pathTo } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { Heading } from "../ui/Heading.tsx";
import { NarrowLayout } from "../ui/layouts.tsx";
import { LinkPreview } from "../ui/LinkPreview.tsx";
import { Media } from "../ui/Media.tsx";

/** Readable fixture destination for listing cards; full detail compositions follow in Steps 5 and 6. */
export function RecordDetail({ record, funding }: { record?: ListingRecord; funding: boolean }) {
  return (
    <NarrowLayout>
      <Heading level={1} size="page">
        {record?.title ?? "Record not available"}
      </Heading>
      {record ? (
        <>
          {record.kind === "initiative" && <Media />}
          <p className="rc-prose">{record.description}</p>
          <p>{record.place}</p>
          <p className="rc-meta">Fictional example content.</p>
          <LinkPreview
            url="https://example.org"
            title="Example website"
            description="A supplied preview for this fictional initiative."
          />
          {funding && <p>Fit is not eligibility. These example terms describe no real funding call.</p>}
        </>
      ) : (
        <p>This record is not available in this version.</p>
      )}
      <ButtonLink href={pathTo(funding ? "funding" : "initiatives")} variant="secondary">
        Back to {funding ? "Funding" : "Initiatives"}
      </ButtonLink>
    </NarrowLayout>
  );
}
