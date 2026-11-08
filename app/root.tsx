import type { ReactNode } from "ardo/react";

import { type ArdoMetaFunction as MetaFunction, useArdoPath } from "ardo/runtime";
import { ArdoRoot } from "ardo/ui";
import { MonoArdoErrorBoundary, MonoArdoLayout } from "ferramenta-family/ardo";
import touchIcon from "ferramenta-family/ferra-assets/ferramenta/apple-touch-icon.png?url";
import favicon from "ferramenta-family/ferra-assets/ferramenta/favicon.ico?url";
import { MarkDefs, MonoFooter, MonoHeader, MonoPage } from "ferramenta-family/monografie";
import { WORKSHOP } from "ferramenta-family/registry";

import { KIT, KIT_DOCS, MonoDocsShell } from "./kit/MonoDocsShell";
import { SITE_DESCRIPTION } from "./site-metadata";
import "ferramenta-family/monografie.css";
import "ferramenta-family/monografie-docs.css";
import "ferramenta-family/monografie-ardo.css";

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native engines" },
  {
    name: "description",
    content: SITE_DESCRIPTION,
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <MonoArdoLayout icon={favicon} appleTouchIcon={touchIcon}>
      {children}
    </MonoArdoLayout>
  );
}

export const ErrorBoundary = MonoArdoErrorBoundary;

/** The family homepage's bar: the page's sections and the workshop's code. */
const HOME_LINKS = [
  <a key="engines" href="/#engines">
    Engines
  </a>,
  <a key="applications" href="/#applications">
    Applications
  </a>,
  <a key="workshop" href="/#workshop">
    Workshop
  </a>,
  <a key="github" href={WORKSHOP.source}>
    GitHub
  </a>,
];

/** The kit's bar: its two pages, as an engine site links its homepage and its guide. */
const KIT_LINKS = [
  <a key="parts" href={KIT}>
    Homepage parts
  </a>,
  <a key="docs" href={KIT_DOCS}>
    Documentation
  </a>,
];

/**
 * One Ardo 6 shell on Monografie for every page. The kit's documentation
 * sample has an engine site's documentation shell instead.
 */
export default function Root() {
  const pathname = useArdoPath();
  if (pathname.startsWith(KIT_DOCS.slice(0, -1))) return <MonoDocsShell />;
  const kit = pathname.startsWith(KIT.slice(0, -1));
  return (
    <MonoPage>
      <MarkDefs />
      {/* The kit is public but not for search: it shows an invented tool. */}
      {kit && <meta name="robots" content="noindex" />}
      <ArdoRoot
        className="mono-ardo-shell"
        scrollMode="document"
        sidebar={false}
        header={
          kit ? (
            <MonoHeader product="ferramenta" home={KIT} release="0.0.0" links={KIT_LINKS} />
          ) : (
            <MonoHeader product="ferramenta" home="/" familyHref={null} links={HOME_LINKS} />
          )
        }
        footer={false}
      />
      <MonoFooter product="ferramenta" home={kit ? KIT : "/"}>
        <a href={WORKSHOP.source}>GitHub</a>
      </MonoFooter>
    </MonoPage>
  );
}
