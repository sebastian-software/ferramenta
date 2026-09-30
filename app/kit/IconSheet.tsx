import { displayName, familyTiers, Icon, Mark } from "ferramenta-family";
import ferralkFlat from "ferramenta-family/icons/ferralk-flat.svg";
import ferramentaFlat from "ferramenta-family/icons/ferramenta-flat.svg";
import ferrikiFlat from "ferramenta-family/icons/ferriki-flat.svg";
import ferrocatFlat from "ferramenta-family/icons/ferrocat-flat.svg";
import ferrolexFlat from "ferramenta-family/icons/ferrolex-flat.svg";
import ferromarkFlat from "ferramenta-family/icons/ferromark-flat.svg";
import ferroniFlat from "ferramenta-family/icons/ferroni-flat.svg";
import ferrugoFlat from "ferramenta-family/icons/ferrugo-flat.svg";
import palette from "ferramenta-family/icons/palette.json";

import { Caption, Chapter } from "./Specimen";

/** The vector twin of each icon: the file a favicon or a README uses. */
const FLAT_SVG: Record<string, string> = {
  ferralk: ferralkFlat,
  ferramenta: ferramentaFlat,
  ferriki: ferrikiFlat,
  ferrocat: ferrocatFlat,
  ferrolex: ferrolexFlat,
  ferromark: ferromarkFlat,
  ferroni: ferroniFlat,
  ferrugo: ferrugoFlat,
};

/** The line icons of the sprite, by symbol name. */
const MARKS = ["arrow", "chev", "external", "github", "crate", "package", "adapter"];

/** The sizes the flat icon is shown at in the chrome and in lists. */
const SIZES = [48, 32, 24];

const members = [
  { name: "ferramenta", title: "Ferramenta", what: "The family" },
  ...familyTiers().engines.map((tool) => ({
    name: tool.name,
    title: displayName(tool),
    what: tool.what,
  })),
];

function Sizes({ ground, name }: { ground: "iron" | "white"; name: string }) {
  return (
    <div className="kit-icon-sizes" data-ground={ground}>
      {SIZES.map((size) => (
        <Icon key={size} name={name} size={size} />
      ))}
    </div>
  );
}

function IconRow({ name, title, what }: { name: string; title: string; what: string }) {
  return (
    <li className="kit-icon-row">
      <div className="kit-icon-who">
        <b>{title}</b>
        <span>{what}</span>
      </div>
      <div className="fam-plate kit-icon-cell">
        <Icon name={name} form="rendered" label={`${title}, rendered`} />
      </div>
      <div className="fam-plate kit-icon-cell">
        <img src={FLAT_SVG[name]} alt={`${title}, flat`} width={144} height={144} />
      </div>
      <Sizes ground="iron" name={name} />
      <Sizes ground="white" name={name} />
    </li>
  );
}

/** Every icon in both forms, at every size it has to work at, and the palette they share. */
export function IconSheet() {
  return (
    <Chapter
      id="icons"
      title="Icons"
      intro="Each member has one object in two forms. The rendered object goes on a plate. Its flat twin, the same object in the same view in a few solid colors, takes every small place: the header, a list, a favicon, a README."
    >
      <Caption name="<Icon name form />">
        The flat form holds from 24 pixels up. Below that every one of these objects is a smudge, so
        nothing in the family shows an icon smaller.
      </Caption>
      <div className="wrap">
        <ul className="kit-icons">
          <li className="kit-icon-row kit-icon-head" aria-hidden="true">
            <div />
            <div>Rendered</div>
            <div>Flat, SVG</div>
            <div>{SIZES.join(" · ")} on black steel</div>
            <div>{SIZES.join(" · ")} on white</div>
          </li>
          {members.map((member) => (
            <IconRow key={member.name} {...member} />
          ))}
        </ul>
      </div>

      <Caption name="icons/palette.json">
        Every flat icon is drawn from these {palette.length} colors. The greys take their hue from
        the rendered steel, so the flat icons keep its warmth.
      </Caption>
      <div className="wrap">
        <ul className="kit-palette">
          {palette.map((color) => (
            <li key={color} style={{ background: color }}>
              <code>{color}</code>
            </li>
          ))}
        </ul>
      </div>

      <Caption name="<Mark name />">
        The line icons of the sprite, for actions and links. They take the text color.
      </Caption>
      <div className="wrap">
        <ul className="kit-marks">
          {MARKS.map((name) => (
            <li key={name}>
              <Mark name={name} size={20} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
