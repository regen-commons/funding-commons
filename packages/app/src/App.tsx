import { useEffect, useRef } from "react";
import { Directory } from "./pages/Directory.tsx";
import { Home } from "./pages/Home.tsx";
import { IntakeStep } from "./pages/IntakeStep.tsx";
import { Matches } from "./pages/Matches.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { Save } from "./pages/Save.tsx";
import { usePathname } from "./router.tsx";
import { documentTitle, matchRoute, type Route } from "./routes.ts";
import { Page } from "./ui/Page.tsx";

function content(route: Route) {
  switch (route.name) {
    case "home":
      return <Home title={route.title} />;
    case "initiative":
    case "needs":
    case "offers":
      return <IntakeStep step={route.name} title={route.title} />;
    case "matches":
      return <Matches title={route.title} />;
    case "directory":
      return <Directory title={route.title} />;
    case "save":
      return <Save title={route.title} />;
  }
}

export function App() {
  const pathname = usePathname();
  const route = matchRoute(pathname);
  const shownPath = useRef(pathname);

  // Each page names itself in the tab. After a navigation, the new page starts at the
  // top with focus on its content, so keyboard and screen-reader users land there too.
  // Comparing paths, not counting renders, keeps the first load untouched even when
  // development mode runs effects twice.
  useEffect(() => {
    document.title = documentTitle(route);
    if (shownPath.current === pathname) return;
    shownPath.current = pathname;
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, route]);

  return (
    <Page pathname={pathname} form={route?.form ?? true}>
      {route ? content(route) : <NotFound />}
    </Page>
  );
}
