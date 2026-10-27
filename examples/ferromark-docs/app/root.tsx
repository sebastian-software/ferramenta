import { type ReactNode, useState } from "ardo/react";
import { useArdoPageData, useArdoPath } from "ardo/runtime";
import { ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoRootLayout, ArdoTOC } from "ardo/ui";
import {
  FerraDocsLayout,
  FerraFooter,
  FerraHeader,
  FerraHero,
  FerraPage,
  FerraSection,
  FerraSpecimen,
  FerraTable,
} from "ferramenta-family/ferra";
import favicon from "ferramenta-family/ferra-assets/ferromark/favicon.ico?url";
import { family, toolHref } from "ferramenta-family/registry";
import "ferramenta-family/ferra.css";

import "./style.css";

const product = family.find((tool) => tool.name === "ferromark");
if (product === undefined) throw new Error("Ferromark is missing from the family registry.");
const home = `${toolHref(product).replace(/\/$/u, "")}/`;
const start = "/rust/getting-started/";

function ProductLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = useArdoPath();
  return (
    <>
      <a href={home} onClick={onNavigate}>
        Overview
      </a>
      <a
        href={start}
        aria-current={path.replace(/\/$/u, "") === start.replace(/\/$/u, "") ? "page" : undefined}
        onClick={onNavigate}
      >
        Start with Rust
      </a>
      <a href={`${home}guide/rendering/`} onClick={onNavigate}>
        Rendering and metadata
      </a>
      <a href={`${home}benchmarks/`} onClick={onNavigate}>
        Benchmarks
      </a>
    </>
  );
}

function ProductNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="ferromark-navigation" aria-label="Product pages">
      <p>Ferromark</p>
      <ProductLinks onNavigate={onNavigate} />
    </nav>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <FerraHeader
      product="ferromark"
      home={home}
      nav={
        <>
          <a href={home}>Overview</a>
          <a href={start} aria-current="page">
            Documentation
          </a>
        </>
      }
      actions={
        <>
          <ArdoMobileNavigation title="Ferromark documentation" open={open} onOpenChange={setOpen}>
            <ProductNavigation
              onNavigate={() => {
                setOpen(false);
              }}
            />
          </ArdoMobileNavigation>
          <ArdoHeaderSearch
            className="ferromark-search"
            variant="icon"
            onActivate={() => {
              setOpen(false);
            }}
          />
        </>
      }
    />
  );
}

function Article({ children }: { children: ReactNode }) {
  const page = useArdoPageData();
  return (
    <FerraDocsLayout
      id="ferromark-article"
      navigation={<ProductNavigation />}
      outline={<ArdoTOC source="dom" scope="#ferromark-article" />}
      hero={
        <FerraHero product="ferromark" title={page?.title} what={page?.frontmatter.description} />
      }
    >
      {children}
    </FerraDocsLayout>
  );
}

// Add to Ardo's standard Markdown set: code highlighting, copy buttons and links stay available.
const components = { wrapper: Article, FerraSection, FerraSpecimen, FerraTable };

export function Layout({ children }: { children: ReactNode }) {
  return (
    <ArdoRootLayout
      colorScheme="light"
      className="ferra-tokens ferromark-theme"
      icon={favicon}
      iconBasePath={false}
    >
      <meta name="robots" content="noindex, nofollow" />
      {children}
    </ArdoRootLayout>
  );
}

export default function Root() {
  return (
    <FerraPage className="ferromark-docs">
      <a className="ferromark-skip" href="#main-content">
        Skip to content
      </a>
      <Header />
      <ArdoRoot
        header={false}
        sidebar={false}
        footer={false}
        className="ferromark-shell"
        scrollMode="document"
        components={components}
      />
      <FerraFooter product="ferromark" home={home} />
    </FerraPage>
  );
}
