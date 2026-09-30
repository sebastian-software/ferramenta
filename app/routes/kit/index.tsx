import type { MetaFunction } from "react-router";

import { RegistryFacts } from "ferramenta-family";
import { Link } from "react-router";

import registryStats from "../../data/registry-stats.json";
import { ChromeSpecimens } from "../../kit/ChromeSpecimens";
import { Foundations } from "../../kit/Foundations";
import { IconSheet } from "../../kit/IconSheet";
import { LandingSpecimens } from "../../kit/LandingSpecimens";
import { SAMPLE } from "../../kit/sample";

/** A landing page: Ardo lays it out bare, without the docs sidebar. */
export const handle = { layout: "bare" };

export const meta: MetaFunction = () => [
  { title: "The kit — Ferramenta" },
  {
    name: "description",
    content:
      "The design library of the Ferramenta family: tokens, materials, icons, the shared chrome, and the patterns a member's site is built from.",
  },
];

const chapters = [
  { id: "foundations", label: "Foundations" },
  { id: "icons", label: "Icons" },
  { id: "chrome", label: "Chrome" },
  { id: "landing", label: "Landing kit" },
];

export default function KitPage() {
  return (
    <RegistryFacts snapshot={registryStats.tools} snapshotGeneratedAt={registryStats.generatedAt}>
      <div className="fam-page kit">
        <div className="kit-head">
          <div className="wrap">
            <h1>The kit</h1>
            <p>
              Everything a family site is built from, rendered from the package every site installs:{" "}
              <code>ferramenta-family</code>. What you see here is the component itself, not a
              picture of it. Two sample pages show the pieces at work: a{" "}
              <Link to={SAMPLE.home}>tool&rsquo;s home page</Link> and its{" "}
              <Link to={SAMPLE.docs}>documentation</Link>.
            </p>
            <ul className="kit-toc">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`}>{chapter.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Foundations />
        <IconSheet />
        <ChromeSpecimens />
        <LandingSpecimens />
      </div>
    </RegistryFacts>
  );
}
