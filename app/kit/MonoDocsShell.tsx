import { ArdoActiveLink as NavLink } from "ardo/runtime";
import { MonoArdoSite, type MonoDocsSection } from "ferramenta-family/ardo";
import { WORKSHOP } from "ferramenta-family/registry";

import { SAMPLE } from "./sample";

/*
 * The Monografie documentation shell exactly as an engine site gets it:
 * `MonoArdoSite` with Ardo's sidebar, its section tabs on the outer edge, the
 * article and the outline across the window. Only the invented tool and its
 * page list are the kit's own. The header carries six links, as the fullest
 * engine sites do, so the kit's review sees the bar at its most crowded.
 */

/** The kit's homepage parts, and its documentation sample. */
export const KIT = "/kit/";
export const KIT_DOCS = "/kit/docs/";

/** The sample's sections; only the guide has pages, the others lead into this one. */
const SECTIONS: MonoDocsSection[] = [
  {
    id: "guide",
    label: "Guide",
    icon: "document",
    to: KIT_DOCS,
    pages: [
      { label: "Getting started", to: KIT_DOCS },
      { label: "Units and dimensions", to: `${KIT_DOCS}#units-and-dimensions` },
      { label: "Configuration", to: `${KIT_DOCS}#configuration` },
      { label: "Performance", to: `${KIT_DOCS}#performance` },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    icon: "crate",
    to: `${KIT_DOCS}#configuration`,
    pages: [],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "pen",
    to: `${KIT_DOCS}#performance`,
    pages: [],
  },
];

const LINKS = [
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
];

/** The kit's sample documentation page on Monografie, in an engine site's shell. */
export function MonoDocsShell() {
  return (
    <>
      <meta name="robots" content="noindex" />
      <MonoArdoSite
        product="ferramenta"
        name={SAMPLE.title}
        release="0.0.0"
        home={KIT}
        links={LINKS}
        sections={SECTIONS}
      />
    </>
  );
}
