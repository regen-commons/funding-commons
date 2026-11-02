import { INTAKE_STEPS, pathTo, type RouteName } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { EmptyState } from "../ui/EmptyState.tsx";
import { Heading } from "../ui/Heading.tsx";
import { Stack } from "../ui/layouts.tsx";
import { Stepper } from "../ui/Stepper.tsx";

const STUBS: Record<string, { guidance: string; next: { route: RouteName; label: string } }> = {
  initiative: {
    guidance: "Here you will describe your work by typing, speaking or adding a file.",
    next: { route: "needs", label: "Go to the needs step" },
  },
  needs: {
    guidance: "Here you will list what would unlock the next chapter, from money to tools, knowledge and relationships.",
    next: { route: "offers", label: "Go to the offers step" },
  },
  offers: {
    guidance: "Here you will list what you have to share, such as land, skills, a method or a track record.",
    next: { route: "matches", label: "See partners and funding" },
  },
};

/** One step of the three-step intake. The conversation itself is not built yet. */
export function IntakeStep({ step, title }: { step: RouteName; title: string }) {
  const stub = STUBS[step];
  if (!stub) throw new Error(`${step} is not an intake step`);
  const current = INTAKE_STEPS.findIndex((candidate) => candidate.route === step);
  return (
    <Stack>
      <Stepper steps={INTAKE_STEPS.map((candidate) => candidate.label)} current={current} />
      <Heading level={1} size="page">
        {title}
      </Heading>
      <EmptyState
        title="This step is not built yet"
        action={
          <ButtonLink href={pathTo(stub.next.route)} variant="primary">
            {stub.next.label}
          </ButtonLink>
        }
      >
        {stub.guidance}
      </EmptyState>
    </Stack>
  );
}
