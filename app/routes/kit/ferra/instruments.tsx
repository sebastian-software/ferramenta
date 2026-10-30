// cspell:words ferrigura Ferrolink Imagegen
import type { ArdoMetaFunction } from "ardo/runtime";

import { FerraFooter, FerraHeader, FerraPage } from "ferramenta-family/ferra";
import ferralkAfter from "ferramenta-family/ferra-assets/ferralk/instrument.webp?url";
import ferramentaAfter from "ferramenta-family/ferra-assets/ferramenta/instrument.webp?url";
import ferriguraAfter from "ferramenta-family/ferra-assets/ferrigura/instrument.webp?url";
import ferrikiAfter from "ferramenta-family/ferra-assets/ferriki/instrument.webp?url";
import ferrocatAfter from "ferramenta-family/ferra-assets/ferrocat/instrument.webp?url";
import ferrolexAfter from "ferramenta-family/ferra-assets/ferrolex/instrument.webp?url";
import ferromarkAfter from "ferramenta-family/ferra-assets/ferromark/instrument.webp?url";
import ferroniAfter from "ferramenta-family/ferra-assets/ferroni/instrument.webp?url";
import ferrugoAfter from "ferramenta-family/ferra-assets/ferrugo/instrument.webp?url";
import { displayName } from "ferramenta-family/registry";

import ferralkPrevious from "../../../../design/ferra/concepts/ferralk/first-blender-instrument.webp?url";
import ferralkBefore from "../../../../design/ferra/concepts/ferralk/pre-blender-instrument.webp?url";
import ferramentaPrevious from "../../../../design/ferra/concepts/ferramenta/first-blender-instrument.webp?url";
import ferramentaBefore from "../../../../design/ferra/concepts/ferramenta/pre-blender-instrument.webp?url";
import ferriguraPrevious from "../../../../design/ferra/concepts/ferrigura/first-blender-instrument.webp?url";
import ferriguraBefore from "../../../../design/ferra/concepts/ferrigura/pre-blender-instrument.webp?url";
import ferrikiPrevious from "../../../../design/ferra/concepts/ferriki/first-blender-instrument.webp?url";
import ferrikiBefore from "../../../../design/ferra/concepts/ferriki/pre-blender-instrument.webp?url";
import ferrocatPrevious from "../../../../design/ferra/concepts/ferrocat/first-blender-instrument.webp?url";
import ferrocatBefore from "../../../../design/ferra/concepts/ferrocat/pre-blender-instrument.webp?url";
import ferrolexPrevious from "../../../../design/ferra/concepts/ferrolex/first-blender-instrument.webp?url";
import ferrolexBefore from "../../../../design/ferra/concepts/ferrolex/pre-blender-instrument.webp?url";
import ferromarkPrevious from "../../../../design/ferra/concepts/ferromark/first-blender-instrument.webp?url";
import ferromarkBefore from "../../../../design/ferra/concepts/ferromark/pre-blender-instrument.webp?url";
import ferroniPrevious from "../../../../design/ferra/concepts/ferroni/first-blender-instrument.webp?url";
import ferroniBefore from "../../../../design/ferra/concepts/ferroni/pre-blender-instrument.webp?url";
import ferrugoPrevious from "../../../../design/ferra/concepts/ferrugo/first-blender-instrument.webp?url";
import ferrugoBefore from "../../../../design/ferra/concepts/ferrugo/pre-blender-instrument.webp?url";
import "../../../styles/ferra-instruments.css";

export const handle = { layout: "bare" };
export const meta: ArdoMetaFunction = () => [
  { title: "Instrument comparison — Ferramenta" },
  {
    name: "description",
    content:
      "Original concepts, first Blender reconstructions, and the refined Ferra homepage instruments.",
  },
];

const instruments = [
  {
    product: "ferramenta",
    before: ferramentaBefore,
    previous: ferramentaPrevious,
    after: ferramentaAfter,
  },
  { product: "ferroni", before: ferroniBefore, previous: ferroniPrevious, after: ferroniAfter },
  { product: "ferriki", before: ferrikiBefore, previous: ferrikiPrevious, after: ferrikiAfter },
  {
    product: "ferromark",
    before: ferromarkBefore,
    previous: ferromarkPrevious,
    after: ferromarkAfter,
  },
  { product: "ferrolex", before: ferrolexBefore, previous: ferrolexPrevious, after: ferrolexAfter },
  { product: "ferrocat", before: ferrocatBefore, previous: ferrocatPrevious, after: ferrocatAfter },
  { product: "ferralk", before: ferralkBefore, previous: ferralkPrevious, after: ferralkAfter },
  { product: "ferrugo", before: ferrugoBefore, previous: ferrugoPrevious, after: ferrugoAfter },
  {
    product: "ferrigura",
    before: ferriguraBefore,
    previous: ferriguraPrevious,
    after: ferriguraAfter,
  },
] as const;

export default function InstrumentComparison() {
  return (
    <FerraPage className="ferra-instrument-review">
      <FerraHeader
        home="/"
        nav={
          <>
            <a href="/kit/ferra/">Back to the kit</a>
            <a href="/">Family homepage</a>
          </>
        }
      />
      <div id="ferra-main" className="ferra-wrap">
        <header className="ferra-instrument-intro">
          <p className="ferra-instrument-eyebrow">Ferra · instrument study</p>
          <h1>The instruments, rebuilt.</h1>
          <p className="ferra-instrument-deck">
            Original concepts, the first Blender pass, and the refined constructions.
          </p>
          <p>
            Compare the original concepts with the first Blender pass and the revised models. The
            third column uses the current homepage assets. Every image opens at full size.
          </p>
          <nav aria-label="Choose an instrument" className="ferra-instrument-jump">
            {instruments.map(({ product }) => (
              <a key={product} href={`#${product}`}>
                {displayName(product)}
              </a>
            ))}
          </nav>
        </header>
        <div className="ferra-instrument-studies">
          {instruments.map(({ product, before, previous, after }, index) => (
            <section
              key={product}
              id={product}
              aria-labelledby={`${product}-title`}
              className="ferra-instrument-study"
            >
              <header className="ferra-instrument-study-heading">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h2 id={`${product}-title`}>{displayName(product)}</h2>
                <a href="#ferra-main">Back to top</a>
              </header>
              <div className="ferra-instrument-pair">
                {[
                  { key: "original", title: "Original", note: "Imagegen concept", src: before },
                  { key: "first", title: "Blender 1", note: "First reconstruction", src: previous },
                  {
                    key: "refined",
                    title: "Blender 2",
                    note: "More mass, depth and patina",
                    src: after,
                  },
                ].map((variant) => (
                  <figure key={variant.key}>
                    <figcaption>
                      <strong>{variant.title}</strong>
                      <span>{variant.note}</span>
                    </figcaption>
                    <a
                      href={variant.src}
                      aria-label={`Open ${displayName(product)} ${variant.title} instrument at full size`}
                    >
                      <img
                        src={variant.src}
                        alt={`${displayName(product)} ${variant.title} instrument`}
                        width="1600"
                        height="800"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </a>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <FerraFooter home="/">
        <a href="/kit/ferra/">Ferra kit</a>
      </FerraFooter>
    </FerraPage>
  );
}
