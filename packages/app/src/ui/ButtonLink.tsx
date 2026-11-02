import type { ReactNode } from "react";
import { Link } from "../router.tsx";

type ButtonLinkProps = {
  href: string;
  variant: "primary" | "secondary" | "quiet";
  size?: "sm" | "lg";
  /** A link to another site, which opens as an ordinary page load. */
  external?: boolean;
  children: ReactNode;
};

/** Button atom (`rc-button`) for navigation. One primary per region. */
export function ButtonLink({ href, variant, size, external, children }: ButtonLinkProps) {
  if (external) {
    return (
      <a className="rc-button" data-variant={variant} data-size={size} href={href} rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link className="rc-button" data-variant={variant} data-size={size} href={href}>
      {children}
    </Link>
  );
}
