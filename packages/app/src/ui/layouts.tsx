import type { ReactNode } from "react";

/** Stack (`rc-stack`): vertical rhythm, with more space between groups when wide. */
export function Stack({ wide, children }: { wide?: boolean; children: ReactNode }) {
  return (
    <div className="rc-stack" data-gap={wide ? "wide" : undefined}>
      {children}
    </div>
  );
}

/** List layout template (`rc-list-layout`): the available page width. */
export function ListLayout({ children }: { children: ReactNode }) {
  return <div className="rc-list-layout">{children}</div>;
}

/** Narrow layout template (`rc-narrow`): a focused single task. */
export function NarrowLayout({ children }: { children: ReactNode }) {
  return <div className="rc-narrow">{children}</div>;
}

/** Home hero template (`rc-home-hero`): what this is and where to start. */
export function HomeHero({ actions, children }: { actions: ReactNode; children: ReactNode }) {
  return (
    <section className="rc-home-hero">
      {children}
      <div className="rc-home-actions">{actions}</div>
    </section>
  );
}
