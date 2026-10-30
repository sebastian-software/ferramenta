import { type ReactNode, useState } from "ardo/react";
import { useArdoPageData, useArdoPath } from "ardo/runtime";
import { ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoRootLayout, ArdoTOC } from "ardo/ui";
import {
  FerraFooter,
  FerraGuideNavigation,
  FerraHeader,
  FerraPage,
  FerraReadingLayout,
  FerraSection,
  FerraSpecimen,
  FerraTable,
} from "ferramenta-family/ferra";
import favicon from "ferramenta-family/ferra-assets/ferromark/favicon.ico?url";
import { family, toolHref } from "ferramenta-family/registry";
import "ferramenta-family/ferra.css";
import "ferramenta-family/ferra-ardo.css";

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
    <FerraGuideNavigation aria-label="Product pages">
      <p>Ferromark</p>
      <ProductLinks onNavigate={onNavigate} />
    </FerraGuideNavigation>
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
    <FerraReadingLayout
      id="ferromark-article"
      navigation={<ProductNavigation />}
      outline={<ArdoTOC source="dom" scope="#ferromark-article" />}
    >
      <header>
        <p>Ferromark / Guide</p>
        <h1>{page?.title}</h1>
      </header>
      {children}
    </FerraReadingLayout>
  );
}

// Add to Ardo's standard Markdown set: code highlighting, copy buttons and links stay available.
const components = { wrapper: Article, FerraSection, FerraSpecimen, FerraTable };

export function Layout({ children }: { children: ReactNode }) {
  return (
    <ArdoRootLayout
      colorScheme="light"
      className="ferra-tokens ferra-ardo"
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
    <FerraPage className="ferra-site">
      <ArdoRoot
        header={<Header />}
        sidebar={false}
        footer={false}
        className="ferra-ardo-shell"
        scrollMode="document"
        components={components}
      />
      <FerraFooter product="ferromark" home={home} />
    </FerraPage>
  );
}
