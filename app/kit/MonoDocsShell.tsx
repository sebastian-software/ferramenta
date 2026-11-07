import { type ReactNode, useEffect, useState } from "ardo/react";
import { ArdoActiveLink as NavLink, useArdoPageData } from "ardo/runtime";
import { ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoTOC } from "ardo/ui";
import { Mark, MarkDefs } from "ferramenta-family";
import {
  MonoFooter,
  MonoGuideNavigation,
  MonoHeader,
  MonoPage,
  MonoReadingLayout,
  MonoReadingTable,
  MonoSectionRail,
} from "ferramenta-family/monografie";

import { SAMPLE } from "./sample";

/*
 * The Monografie documentation shell exactly as an engine site builds it in
 * its root: the steel header with the documentation menu and search, the
 * reading layout as the MDX wrapper, MDX tables in the reading table and the
 * footer outside Ardo's main. Only the invented tool and its page list are the
 * kit's own.
 */

export const MONO_DOCS = "/kit/monografie/docs/";

/** The sample's sections; only the guide has pages, the others lead into this one. */
const SECTIONS = [
  { id: "guide", label: "Guide", icon: "document", href: MONO_DOCS },
  { id: "reference", label: "Reference", icon: "crate", href: `${MONO_DOCS}#configuration` },
  { id: "performance", label: "Performance", icon: "pen", href: `${MONO_DOCS}#performance` },
] as const;

const PAGES = [
  { title: "Getting started", href: MONO_DOCS },
  { title: "Units and dimensions", href: `${MONO_DOCS}#units-and-dimensions` },
  { title: "Configuration", href: `${MONO_DOCS}#configuration` },
  { title: "Performance", href: `${MONO_DOCS}#performance` },
] as const;

function GuideNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <MonoSectionRail aria-label="Documentation sections">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={section.href}
            data-active={section.id === "guide"}
            onClick={onNavigate}
          >
            <Mark name={section.icon} />
            {section.label}
          </a>
        ))}
      </MonoSectionRail>
      <MonoGuideNavigation aria-label="Documentation pages">
        <a href="/kit/monografie/" onClick={onNavigate}>
          Overview
        </a>
        <p>Guide</p>
        {PAGES.map(({ title, href }) => (
          <a
            key={href}
            href={href}
            aria-current={href === MONO_DOCS ? "page" : undefined}
            onClick={onNavigate}
          >
            {title}
          </a>
        ))}
      </MonoGuideNavigation>
    </>
  );
}

/** The documentation menu and search, which stay in the header on documentation pages. */
function DocsActions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ArdoMobileNavigation
        title={`${SAMPLE.title} documentation`}
        open={open}
        onOpenChange={setOpen}
      >
        <GuideNavigation
          onNavigate={() => {
            setOpen(false);
          }}
        />
      </ArdoMobileNavigation>
      <ArdoHeaderSearch
        variant="icon"
        onActivate={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

function Article({ children }: { children: ReactNode }) {
  const page = useArdoPageData();
  return (
    <MonoReadingLayout
      id="mono-docs-article"
      navigation={<GuideNavigation />}
      outline={<ArdoTOC source="dom" scope="#mono-docs-article" />}
    >
      <header>
        <p>{SAMPLE.title} / Guide</p>
        <h1>{page?.title ?? "Documentation"}</h1>
      </header>
      {children}
    </MonoReadingLayout>
  );
}

const components = { table: MonoReadingTable, wrapper: Article };

/**
 * An engine site sets `className="mono-ardo"` and `colorScheme="light"` on its
 * `ArdoRootLayout`. The kit shares one root layout with pages in other looks,
 * and the layout renders before the page is known, so this page sets both on
 * the document itself while it is shown.
 */
function useMonoArdoRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const dark = root.classList.contains("dark");
    root.classList.add("mono-ardo", "light");
    root.classList.remove("dark");
    return () => {
      root.classList.remove("mono-ardo");
      root.classList.toggle("dark", dark);
      root.classList.toggle("light", !dark);
    };
  }, []);
}

/** The kit's sample documentation page on Monografie, in an engine site's shell. */
export function MonoDocsShell() {
  useMonoArdoRoot();
  return (
    <MonoPage className="mono-docs">
      <MarkDefs />
      <meta name="robots" content="noindex" />
      <ArdoRoot
        className="mono-ardo-shell"
        scrollMode="document"
        header={
          <MonoHeader
            product="ferramenta"
            home="/kit/monografie/"
            release="0.0.0"
            links={[
              <NavLink key="kit" to="/kit/" end>
                Kit
              </NavLink>,
              <NavLink key="homepage" to="/kit/monografie/" end>
                Homepage parts
              </NavLink>,
              <NavLink key="docs" to={MONO_DOCS}>
                Guide
              </NavLink>,
            ]}
            actions={<DocsActions />}
          />
        }
        sidebar={false}
        footer={false}
        components={components}
      />
      <MonoFooter product="ferramenta" home="/kit/monografie/" />
    </MonoPage>
  );
}
