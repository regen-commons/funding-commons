import { useId, type ReactNode } from "react";
/** Share card organism. A missing match count stays unknown; service actions are supplied only when usable. */
export function ShareCard({ count, children }: { count: number | null; children?: ReactNode }) {
  const id = useId();
  return (
    <article className="rc-card rc-share-card" aria-labelledby={id}>
      <h2 className="rc-card-title" id={id}>
        {count === null
          ? "Partners come from sharing"
          : `${count} ${count === 1 ? "initiative matches" : "initiatives match"} what you need and offer`}
      </h2>
      <p>Share your initiative with the community to see who fits and let them find you.</p>
      <p className="rc-meta">
        A private initiative sees partner counts. Saving and sharing will ask you first.
      </p>
      {children}
    </article>
  );
}
