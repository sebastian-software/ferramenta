import type { LinksFunction, MetaFunction } from "react-router";

import bigShouldersFont from "@ferramenta/family/fonts/big-shoulders.woff2?url";
import { ArdoErrorBoundary, ArdoRoot, ArdoRootLayout } from "ardo/ui";
import config from "virtual:ardo/config";
import "ardo/ui/styles.css";
import "@ferramenta/family/tokens.css";
import "@ferramenta/family/fonts.css";
import "@ferramenta/family/theme.css";

import "./styles/site.css";

// Last on purpose: the shared chrome has to win the ties the scoped reset in
// site.css would otherwise take, exactly as it did when both lived in one file.
import "@ferramenta/family/chrome.css";

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
  { title: "Ferramenta — Rust-native developer tools" },
  {
    name: "description",
    content:
      "Ferramenta is a family of Rust-native developer tools built around familiar standards and APIs, with compatibility measured against established predecessors where they exist.",
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
STORY: A developer lands, gets the poster claim, sees the tool wall, reads the
numbered chain with proof, returns to a clear tool-selection action, then meets
the wider OSS workshop as provenance on the way out.
FIRST VIEWPORT: Iron header; huge uppercase headline left, pegboard with all seven
marks right; chamfered rust primary action.
FORM: Approved comp design/comp/entwurf-c.html (direction C of 3, brief-pinned).
ADDITIONS (user-approved after comp): "Why this store exists" section (personal
story + goals) between the iron band and the partner band; version display
normalized to v-prefix; job wording from the family registry.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, and DESIGN.md
*/
export default function Root() {
  // Full custom shell: header and footer are rendered by the home route.
  return <ArdoRoot config={config} className="ferramenta-site" />;
}
