import { useArdoPageData, useArdoPath } from "ardo/runtime";
import {
  ArdoDocContent,
  ArdoErrorBoundary,
  ArdoHeaderSearch,
  ArdoMobileNavigation,
  ArdoRoot,
  ArdoRootLayout,
  ArdoSidebar,
  ArdoSidebarGroup,
  ArdoSidebarLink,
  ArdoSidebarSection,
} from "ardo/ui";
import { type ElementType, type ReactElement, type ReactNode, useState } from "react";

import type { Identity } from "./identity.js";

import { Mark, MarkDefs } from "./Mark.js";
import { MonoFooter, MonoHeader, MonoPage } from "./MonoChrome.js";
import { MonoReadingTable } from "./MonoReading.js";

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

type NavigationProps = {
  sections: MonoDocsSection[];
  groups: MonoDocsGroup[];
};

function inSection(id: string) {
  return (path: string) => path === `/${id}` || path.startsWith(`/${id}/`);
}

function SidebarLinks({ pages }: { pages: MonoDocsPage[] }) {
  return pages.map(({ label, to }) => (
    <ArdoSidebarLink key={to} to={to}>
      {label}
    </ArdoSidebarLink>
  ));
}

/**
 * Ardo's own documentation sidebar: one tab per section on its outer edge, the
 * section's pages beside it, and the groups that section shows. In the mobile
 * menu the same tabs lie flat above the pages.
 */
function DocsSidebar({ sections, groups }: NavigationProps) {
  return (
    <ArdoSidebar>
      {sections.map((section) => (
        <ArdoSidebarSection
          key={section.id}
          id={section.id}
          label={section.label}
          to={section.to}
          match={inSection(section.id)}
          icon={section.icon === undefined ? null : <Mark name={section.icon} size={16} />}
        >
          <SidebarLinks pages={section.pages} />
          {groups
            .filter((group) => !(group.hiddenIn ?? []).includes(section.id))
            .map((group) => (
              <ArdoSidebarGroup key={group.title} title={group.title} collapsible={false}>
                <SidebarLinks pages={group.pages} />
              </ArdoSidebarGroup>
            ))}
        </ArdoSidebarSection>
      ))}
    </ArdoSidebar>
  );
}

type ActionsProps = { name: string; links: ReactElement[] } & NavigationProps;

/**
 * The documentation menu and search. Where Ardo's sidebar folds away, its menu
 * carries the header's links above the sections and pages.
 */
function DocsActions({ name, links, ...navigation }: ActionsProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ArdoMobileNavigation
        title={`${name} documentation`}
        open={open}
        onOpenChange={setOpen}
        nav={
          <nav className="mono-docs-links" aria-label={`${name} site`}>
            <ul>
              {links.map((link) => (
                <li key={link.key}>{link}</li>
              ))}
            </ul>
          </nav>
        }
      >
        <DocsSidebar {...navigation} />
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

/**
 * The MDX wrapper: Ardo's article and outline around Monografie's prose. The
 * outline reads the rendered page, so headings from components count, and the
 * title drops its code marks.
 */
function Article({ children }: { children: ReactNode }) {
  const page = useArdoPageData();
  return (
    <ArdoDocContent
      tocSource="dom"
      header={
        <header className="mono-prose">
          <h1>{page?.title.replaceAll("`", "") ?? "Documentation"}</h1>
        </header>
      }
    >
      <div className="mono-prose">{children}</div>
    </ArdoDocContent>
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
  /** The homepage's address, for a site served below a base path; "/" by default. */
  home?: string;
  /** Extra classes on the page: the homepage's and the documentation's. */
  homeClassName?: string;
  docsClassName?: string;
};

/**
 * An engine site's whole shell on Monografie: homepage and documentation.
 * Search stays in the header on every page; documentation adds its menu.
 */
export function MonoArdoSite({
  product,
  name,
  release,
  links,
  footer,
  sections = [],
  groups = [],
  components,
  home: homeHref = "/",
  homeClassName,
  docsClassName,
}: MonoArdoSiteProps) {
  const path = useArdoPath();
  const home = path === "/" || path === "" || sections.length === 0;
  const classes = (base: string, extra?: string) =>
    extra === undefined ? base : `${base} ${extra}`.trim();
  const navigation = { sections, groups };
  return (
    <MonoPage className={home ? homeClassName : classes("mono-docs", docsClassName)}>
      <MarkDefs />
      <ArdoRoot
        className="mono-ardo-shell"
        scrollMode="document"
        header={
          <MonoHeader
            product={product}
            home={homeHref}
            release={release}
            links={links}
            actions={
              home ? (
                <ArdoHeaderSearch variant="icon" />
              ) : (
                <DocsActions name={name} links={links} {...navigation} />
              )
            }
          />
        }
        sidebar={home ? false : <DocsSidebar {...navigation} />}
        footer={false}
        components={{ table: MonoReadingTable, wrapper: Article, ...components }}
      />
      <MonoFooter product={product} home={homeHref}>
        {footer}
      </MonoFooter>
    </MonoPage>
  );
}
