import type { LinksFunction, MetaFunction } from "react-router";

import { ArdoErrorBoundary, ArdoRoot, ArdoRootLayout, ArdoThemeToggle } from "ardo/ui";
import { MarkDefs, SiteFooter, SiteHeader } from "ferramenta-family";
import bigShouldersFont from "ferramenta-family/fonts/big-shoulders.woff2?url";
import config from "virtual:ardo/config";
import "ardo/ui/styles.css";
import "ferramenta-family/tokens.css";
import "ferramenta-family/fonts.css";
import "ferramenta-family/theme.css";
// The landing kit before the site's own stylesheet, so site.css adjusts it on ties.
import "ferramenta-family/landing.css";

import "./styles/site.css";

// Last on purpose: the shared chrome has to win the ties the scoped reset in
// site.css would otherwise take, exactly as it did when both lived in one file.
import "ferramenta-family/chrome.css";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: bigShouldersFont,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native tools" },
  {
    name: "description",
    content:
      "Ferramenta is a family of Rust-native tools and focused applications, from standards-led engines to team agent skills and local-first speech transcription.",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return <ArdoRootLayout>{children}</ArdoRootLayout>;
}

export const ErrorBoundary = ArdoErrorBoundary;

/*
THESIS: A hardware store's family site: the tools hang on one pegboard, read like a
well-set catalog. Refuses the SaaS hero-plus-feature-cards arrangement.
OWN-WORLD: Light brushed-steel shop floor between two dark iron bands; rust as
structural color; duotone project marks on chamfered octagon metal plates hanging
from real hooks; uppercase condensed display (Big Shoulders); zero radius.
STORY: A developer lands, gets the poster claim, sees the tool wall with each
tool's maturity stamp, learns what earns a stamp, reads the chain and the other
groups with proof, ends at the job index (every job A to Z, the tool that does
it, its stamp: each tool stands alone), then meets the wider OSS workshop as
provenance on the way out.
FIRST VIEWPORT: Iron header; huge uppercase headline left, pegboard with every
member's mark right; chamfered rust primary action.
FORM: Approved comp design/comp/entwurf-c.html (direction C of 3, brief-pinned).
ADDITIONS (user-approved after comp): "Why this store exists" section (personal
story + goals) between the iron band and the partner band; version display
normalized to v-prefix; job wording from the family registry.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, and DESIGN.md
*/
export default function Root() {
  // The family chrome sits outside ArdoRoot, so the header and footer are the
  // page's banner and contentinfo landmarks rather than parts of Ardo's <main>.
  // `.fam-page` paints the shop floor under all of it.
  return (
    <div className="fam-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <MarkDefs />
      <SiteHeader themeToggle={<ArdoThemeToggle />} />
      <ArdoRoot config={config} className="ferramenta-site" />
      {/* The page is the family's index: the footer points at the company, not the roster again. */}
      <SiteFooter members="none" />
    </div>
  );
}
