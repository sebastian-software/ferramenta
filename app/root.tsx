import { ArdoErrorBoundary, ArdoRootLayout, ArdoRoot } from "ardo/ui"
import config from "virtual:ardo/config"
import type { MetaFunction } from "react-router"
import "ardo/ui/styles.css"
import "@ferramenta/ardo-config/theme.css"
import "./styles/site.css"

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native developer tools" },
  {
    name: "description",
    content:
      "Ferramenta is a family of Rust-native developer tools that keep the APIs you already know — held to the originals by differential testing, and built to outrun them.",
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return <ArdoRootLayout>{children}</ArdoRootLayout>
}

export const ErrorBoundary = ArdoErrorBoundary

/*
THESIS: A hardware store's family site: the tools hang on one pegboard, read like a
well-set catalog. Refuses the SaaS hero-plus-feature-cards arrangement.
OWN-WORLD: Light brushed-steel shop floor between two dark iron bands; rust as
structural color; duotone project marks on chamfered octagon metal plates hanging
from real hooks; uppercase condensed display (Big Shoulders); zero radius.
STORY: A developer lands, gets the poster claim, sees the tool wall, reads the
numbered chain with proof, leaves for a repo — and notices OSS + consulting on the way out.
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
  return <ArdoRoot config={config} className="ferramenta-site" />
}
