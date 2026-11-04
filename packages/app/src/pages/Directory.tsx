import { ButtonLink } from "../ui/ButtonLink.tsx";
import { EmptyState } from "../ui/EmptyState.tsx";
import { Heading } from "../ui/Heading.tsx";
import { ListLayout } from "../ui/layouts.tsx";

/** The funder directory, which moves here from the live Funding Commons site (spec 15). */
export function Directory({ title }: { title: string }) {
  return (
    <ListLayout>
      <Heading level={1} size="page">
        {title}
      </Heading>
      <EmptyState
        title="The directory moves here next"
        action={
          <ButtonLink href="https://funding-commons.vercel.app/" variant="primary">
            Open the current directory
          </ButtonLink>
        }
      >
        Until then, every funder and program is in the current Funding Commons directory.
      </EmptyState>
    </ListLayout>
  );
}
