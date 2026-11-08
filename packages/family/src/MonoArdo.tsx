import { ArdoActiveLink as NavLink, useArdoPageData, useArdoPath } from "ardo/runtime";
import {
  ArdoErrorBoundary,
  ArdoHeaderSearch,
  ArdoMobileNavigation,
  ArdoRoot,
  ArdoRootLayout,
  ArdoTOC,
} from "ardo/ui";
import {
  createContext,
  type ElementType,
  Fragment,
  type ReactElement,
  type ReactNode,
  use,
  useState,
} from "react";

import type { Identity } from "./identity.js";

import { Mark, MarkDefs } from "./Mark.js";
import { MonoFooter, MonoHeader, MonoPage } from "./MonoChrome.js";
import {
  MonoGuideNavigation,
  MonoReadingLayout,
  MonoReadingTable,
  MonoSectionRail,
} from "./MonoReading.js";

/*
 * The Ardo 6 shell of every Monografie site, once: the steel header in Ardo's
 * header slot, the documentation menu and search on documentation pages, the
 * reading layout as the MDX wrapper, MDX tables in the reading table, and the
 * footer outside Ardo's main landmark. A site passes its names, links and
 * documentation sections; its root shrinks to a few lines.
 */

/** One page in a documentation section's list. */
export type MonoDocsPage = { label: string; to: string };

/** One documentation section: a tab on the rail, with its own page list. */
export type MonoDocsSection = {
  id: string;
  label: string;
  to: string;
  /** A line icon from the sprite, shown on the rail. */
  icon?: string;
  pages: MonoDocsPage[];
};

/** Pages listed under every section's own, such as shared concepts. */
export type MonoDocsGroup = {
  title: string;
  pages: MonoDocsPage[];
  /** Section ids that leave the group out. */
  hiddenIn?: string[];
};

export type MonoArdoLayoutProps = {
  /** The member's favicon, as a URL the site's bundler resolved. */
  icon: string;
  appleTouchIcon: string;
  children: ReactNode;
};

/** The document around every page: Monografie's one light scheme and the member's icons. */
export function MonoArdoLayout({ icon, appleTouchIcon, children }: MonoArdoLayoutProps) {
  return (
    <ArdoRootLayout
      colorScheme="light"
      className="mono-ardo"
      icon={icon}
      appleTouchIcon={appleTouchIcon}
      iconBasePath={false}
    >
      {children}
    </ArdoRootLayout>
  );
}

export const MonoArdoErrorBoundary = ArdoErrorBoundary;

function currentSection(sections: MonoDocsSection[], path: string) {
  return sections.find(
    (section) => path === `/${section.id}` || path.startsWith(`/${section.id}/`),
  );
}

type NavigationProps = {
  sections: MonoDocsSection[];
  groups: MonoDocsGroup[];
  onNavigate?: () => void;
};

function DocsNavigation({ sections, groups, onNavigate }: NavigationProps) {
  const path = useArdoPath();
  const current = currentSection(sections, path) ?? sections.at(0);
  if (current === undefined) return null;
  return (
    <>
      {sections.length > 1 && (
        <MonoSectionRail aria-label="Documentation sections">
          {sections.map((section) => (
            <NavLink
              key={section.id}
              to={section.to}
              data-active={current.id === section.id}
              onClick={onNavigate}
            >
              {section.icon !== undefined && <Mark name={section.icon} />}
              {section.label}
            </NavLink>
          ))}
        </MonoSectionRail>
      )}
      <MonoGuideNavigation aria-label="Documentation pages">
        <NavLink to="/" end onClick={onNavigate}>
          Overview
        </NavLink>
        <p>{current.label}</p>
        {current.pages.map(({ label, to }) => (
          <NavLink key={to} to={to} end onClick={onNavigate}>
            {label}
          </NavLink>
        ))}
        {groups
          .filter((group) => !(group.hiddenIn ?? []).includes(current.id))
          .map((group) => (
            <Fragment key={group.title}>
              <p>{group.title}</p>
              {group.pages.map(({ label, to }) => (
                <NavLink key={to} to={to} end onClick={onNavigate}>
                  {label}
                </NavLink>
              ))}
            </Fragment>
          ))}
      </MonoGuideNavigation>
    </>
  );
}

function DocsActions({ name, ...navigation }: { name: string } & NavigationProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ArdoMobileNavigation title={`${name} documentation`} open={open} onOpenChange={setOpen}>
        <DocsNavigation
          {...navigation}
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

type SiteValue = { name: string; articleId: string } & Omit<NavigationProps, "onNavigate">;
const SiteContext = createContext<SiteValue>({ name: "", articleId: "", sections: [], groups: [] });

/** The MDX wrapper: the reading layout with the navigation, the outline and the page title, its code marks dropped. */
function Article({ children }: { children: ReactNode }) {
  const { name, articleId, sections, groups } = use(SiteContext);
  const page = useArdoPageData();
  const current = currentSection(sections, useArdoPath());
  return (
    <MonoReadingLayout
      id={articleId}
      navigation={<DocsNavigation sections={sections} groups={groups} />}
      outline={<ArdoTOC source="dom" scope={`#${articleId}`} />}
    >
      <header>
        <p>
          {name} / {current?.label ?? "Documentation"}
        </p>
        <h1>{page?.title.replaceAll("`", "") ?? "Documentation"}</h1>
      </header>
      {children}
    </MonoReadingLayout>
  );
}

export type MonoArdoSiteProps = {
  product: Identity;
  /** The member's name in prose, e.g. "Ferromark". */
  name: string;
  /** The release shown in the header. */
  release?: string;
  /** The header's links. */
  links: ReactElement[];
  /** The footer's links. */
  footer?: ReactNode;
  /** The documentation sections; without them every page is a homepage. */
  sections?: MonoDocsSection[];
  groups?: MonoDocsGroup[];
  /** MDX components beside the reading table and the reading layout, e.g. `h2`. */
  components?: Record<string, ElementType>;
  /** Extra classes on the page: the homepage's and the documentation's. */
  homeClassName?: string;
  docsClassName?: string;
};

/** An engine site's whole shell on Monografie: homepage and documentation. */
export function MonoArdoSite({
  product,
  name,
  release,
  links,
  footer,
  sections = [],
  groups = [],
  components,
  homeClassName,
  docsClassName,
}: MonoArdoSiteProps) {
  const path = useArdoPath();
  const home = path === "/" || path === "" || sections.length === 0;
  const classes = (base: string, extra?: string) =>
    extra === undefined ? base : `${base} ${extra}`.trim();
  const site = { name, articleId: `${product}-article`, sections, groups };
  return (
    <SiteContext value={site}>
      <MonoPage className={home ? homeClassName : classes("mono-docs", docsClassName)}>
        <MarkDefs />
        <ArdoRoot
          className="mono-ardo-shell"
          scrollMode="document"
          header={
            <MonoHeader
              product={product}
              home="/"
              release={release}
              links={links}
              actions={
                home ? undefined : <DocsActions name={name} sections={sections} groups={groups} />
              }
            />
          }
          sidebar={false}
          footer={false}
          components={{ table: MonoReadingTable, wrapper: Article, ...components }}
        />
        <MonoFooter product={product} home="/">
          {footer}
        </MonoFooter>
      </MonoPage>
    </SiteContext>
  );
}
