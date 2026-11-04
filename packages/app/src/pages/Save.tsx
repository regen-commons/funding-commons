import { pathTo } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { EmptyState } from "../ui/EmptyState.tsx";
import { Heading } from "../ui/Heading.tsx";
import { NarrowLayout } from "../ui/layouts.tsx";

/** Saving with an email code (08-accounts-and-saving). Not built yet. */
export function Save({ title }: { title: string }) {
  return (
    <NarrowLayout>
      <Heading level={1} size="page">
        {title}
      </Heading>
      <EmptyState
        title="Saving is not built yet"
        action={
          <ButtonLink href={pathTo("home")} variant="primary">
            Go to the home page
          </ButtonLink>
        }
      >
        Soon you will email yourself a code to save your initiative and open it on any device. Until then, nothing you do here leaves this device.
      </EmptyState>
    </NarrowLayout>
  );
}
