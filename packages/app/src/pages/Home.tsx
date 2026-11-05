import { CAPITALS } from "../capitals.ts";
import { pathTo } from "../routes.ts";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import { Heading } from "../ui/Heading.tsx";
import { HomeHero, Stack } from "../ui/layouts.tsx";
import { Tag } from "../ui/Tag.tsx";

export function Home({ title }: { title: string }) {
  return (
    <Stack wide>
      <HomeHero
        actions={
          <>
            <ButtonLink href={pathTo("initiative")} variant="primary" size="lg">
              Describe your initiative
            </ButtonLink>
            <ButtonLink href={pathTo("funding")} variant="secondary" size="lg">
              Search funding
            </ButtonLink>
          </>
        }
      >
        <Heading level={1} size="hero">
          {title}
        </Heading>
        <p className="rc-prose">
          Say what your initiative needs and what it can offer. See who could work with you and which funds
          fit.
        </p>
      </HomeHero>
      <section className="rc-stack" aria-labelledby="kinds">
        <Heading level={2} size="section" id="kinds">
          Money is one of eight kinds of support
        </Heading>
        <ul className="rc-tag-list">
          {CAPITALS.map((capital) => (
            <li key={capital.key}>
              <Tag capital={capital} />
            </li>
          ))}
        </ul>
      </section>
    </Stack>
  );
}
