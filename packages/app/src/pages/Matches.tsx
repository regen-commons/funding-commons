import { pathTo } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { EmptyState } from "../ui/EmptyState.tsx";
import { Heading } from "../ui/Heading.tsx";
import { ListLayout } from "../ui/layouts.tsx";

export function Matches({ title }: { title: string }) {
  return (
    <ListLayout>
      <Heading level={1} size="page">
        {title}
      </Heading>
      <EmptyState
        title="No matches yet"
        action={
          <ButtonLink href={pathTo("initiative")} variant="primary">
            Describe your initiative
          </ButtonLink>
        }
      >
        Once you describe your initiative, partners and funding that fit appear here.
      </EmptyState>
    </ListLayout>
  );
}
