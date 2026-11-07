import { type ReactNode, useState } from "ardo/react";
import { ArdoActiveLink as NavLink, useArdoPageData } from "ardo/runtime";
import { ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoTOC } from "ardo/ui";
import {
  Mark,
  MarkDefs,
  MonoFooter,
  MonoGuideNavigation,
  MonoHeader,
  MonoPage,
  MonoReadingLayout,
  MonoReadingTable,
  MonoSectionRail,
} from "ferramenta-family/monografie";
import { WORKSHOP } from "ferramenta-family/registry";

import { SAMPLE } from "./sample";

/*
 * The Monografie documentation shell exactly as an engine site builds it in
 * its root: the steel header with the documentation menu and search, the
 * reading layout as the MDX wrapper, MDX tables in the reading table and the
 * footer outside Ardo's main. Only the invented tool and its page list are the
 * kit's own. The header carries six links, as the fullest engine sites do, so
 * the kit's review sees the bar at its most crowded.
 */

/** The kit's homepage parts, and its documentation sample. */
export const KIT = "/kit/";
export const KIT_DOCS = "/kit/docs/";

/** The sample's sections; only the guide has pages, the others lead into this one. */
const SECTIONS = [
  { id: "guide", label: "Guide", icon: "document", href: KIT_DOCS },
  { id: "reference", label: "Reference", icon: "crate", href: `${KIT_DOCS}#configuration` },
  { id: "performance", label: "Performance", icon: "pen", href: `${KIT_DOCS}#performance` },
] as const;

const PAGES = [
  { title: "Getting started", href: KIT_DOCS },
  { title: "Units and dimensions", href: `${KIT_DOCS}#units-and-dimensions` },
  { title: "Configuration", href: `${KIT_DOCS}#configuration` },
  { title: "Performance", href: `${KIT_DOCS}#performance` },
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
        <a href={KIT} onClick={onNavigate}>
          Overview
        </a>
        <p>Guide</p>
        {PAGES.map(({ title, href }) => (
          <a
            key={href}
            href={href}
            aria-current={href === KIT_DOCS ? "page" : undefined}
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

/** The kit's sample documentation page on Monografie, in an engine site's shell. */
export function MonoDocsShell() {
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
            home={KIT}
            release="0.0.0"
            links={[
              <NavLink key="homepage" to={KIT} end>
                Homepage parts
              </NavLink>,
              <NavLink key="docs" to={KIT_DOCS}>
                Guide
              </NavLink>,
              <a key="reference" href={`${KIT_DOCS}#configuration`}>
                Reference
              </a>,
              <a key="performance" href={`${KIT_DOCS}#performance`}>
                Performance
              </a>,
              <a key="changes" href={`${KIT_DOCS}#units-and-dimensions`}>
                Units
              </a>,
              <a key="github" href={WORKSHOP.source}>
                GitHub
              </a>,
            ]}
            actions={<DocsActions />}
          />
        }
        sidebar={false}
        footer={false}
        components={components}
      />
      <MonoFooter product="ferramenta" home={KIT} />
    </MonoPage>
  );
}
