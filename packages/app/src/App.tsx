import { useEffect, useRef } from "react";
import { readFixtures, EXAMPLE_SUBJECT, type FixtureContext } from "./fixtures.ts";
import { DraftProvider } from "./describe/context.tsx";
import { useDraft } from "./describe/use-draft.ts";
import { hasDraft } from "./describe/view.ts";
import { Describe } from "./pages/Describe.tsx";
import { CheckCard } from "./pages/CheckCard.tsx";
import { Home } from "./pages/Home.tsx";
import { IntakeStep } from "./pages/IntakeStep.tsx";
import { ListPage } from "./pages/ListPage.tsx";
import { RecordDetail } from "./pages/RecordDetail.tsx";
import { Settings } from "./pages/Settings.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { usePathname } from "./router.tsx";
import { documentTitle, matchRoute, pathTo, type Route } from "./routes.ts";
import { Page } from "./ui/Page.tsx";
import { Heading } from "./ui/Heading.tsx";
import { NarrowLayout } from "./ui/layouts.tsx";
import { ButtonLink } from "./ui/ButtonLink.tsx";
import { FixtureControls } from "./ui/FixtureControls.tsx";

function content(route: Route, fixture?: FixtureContext) {
  switch (route.name) {
    case "home":
      return <Home fixture={fixture} />;
    case "initiative":
      return <Describe fixture={fixture} />;
    case "check-card":
      return <CheckCard />;
    case "needs":
    case "offers":
      return <IntakeStep step={route.name} title={route.title} />;
    case "partners":
    case "funding":
    case "initiatives":
      return (
        <ListPage
          key={route.name}
          title={route.title}
          kind={route.name}
          fixture={fixture}
          subject={import.meta.env.DEV && fixture?.scenario !== "visitor" ? EXAMPLE_SUBJECT : undefined}
        />
      );
    case "initiative-detail":
    case "opportunity":
      return (
        <RecordDetail
          funding={route.name === "opportunity"}
          record={(route.name === "opportunity" ? fixture?.funding : fixture?.initiatives)?.find(
            (record) => record.id === route.id,
          )}
        />
      );
    case "settings":
      return <Settings />;
    case "finish":
      return (
        <NarrowLayout>
          <Heading level={1} size="page">
            {route.title}
          </Heading>
          <p>The finish page will bring your card and first funding together.</p>
          <ButtonLink variant="primary" href={pathTo("funding")}>
            Browse funding
          </ButtonLink>
        </NarrowLayout>
      );
  }
}
export function App() {
  const location = usePathname();
  const fixture =
    import.meta.env.DEV && new URLSearchParams(window.location.search).has("fixture")
      ? readFixtures(window.location.search)
      : undefined;
  return (
    <DraftProvider fixture={fixture}>
      <AppFrame key="frame" location={location} fixture={fixture} />
    </DraftProvider>
  );
}
function AppFrame({ location, fixture }: { location: string; fixture?: FixtureContext }) {
  const device = useDraft();
  const pathname = new URL(location, window.location.origin).pathname;
  const route = matchRoute(pathname);
  const shownPath = useRef(location);
  const record = route?.id
    ? (route.name === "opportunity" ? fixture?.funding : fixture?.initiatives)?.find(
        (item) => item.id === route.id,
      )
    : undefined;
  useEffect(() => {
    document.title = record ? `${record.title} | Weave` : documentTitle(route);
    if (shownPath.current === location) return;
    shownPath.current = location;
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
  }, [location, route?.name, record?.title]);
  const status =
    fixture && route?.name !== "initiative" && route?.name !== "check-card"
      ? fixture?.scenario === "private" || fixture?.scenario === "shared"
        ? "account"
        : fixture?.scenario === "draft"
          ? "device"
          : "none"
      : device.storage === "saving"
        ? "saving"
        : device.storage === "memory"
          ? "memory"
          : device.storage === "conflict"
            ? "conflict"
            : device.storage === "saved" && hasDraft(device.draft)
              ? "device"
              : "none";
  return (
    <Page pathname={pathname} form={route?.form ?? true} status={status} runs={device.draft.runs}>
      {import.meta.env.DEV && fixture && <FixtureControls fixture={fixture} />}
      {route ? content(route, fixture) : <NotFound />}
    </Page>
  );
}
