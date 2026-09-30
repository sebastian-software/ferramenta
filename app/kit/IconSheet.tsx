import { displayName, familyTiers, Icon, Mark } from "ferramenta-family";

import { Caption, Chapter } from "./Specimen";

/** The line icons of the sprite, by symbol name. */
const MARKS = [
  "arrow",
  "chev",
  "external",
  "github",
  "crate",
  "package",
  "adapter",
  "check",
  "half",
  "cross",
];

/** The sizes the small icon is shown at in the chrome and in lists. */
const SIZES = [48, 32, 24];

const members = [
  { name: "ferramenta", title: "Ferramenta", what: "The family" },
  ...familyTiers().engines.map((tool) => ({
    name: tool.name,
    title: displayName(tool),
    what: tool.what,
  })),
];

/** The small icon at each size, as the chrome shows it: on a steel tile. */
function Tiles({ name }: { name: string }) {
  return (
    <div className="kit-icon-sizes" data-ground="iron">
      {SIZES.map((size) => (
        <span key={size} className="fam-tile">
          <Icon name={name} size={size} />
        </span>
      ))}
    </div>
  );
}

/** The small icon at each size on a light ground, without a tile. */
function Bare({ name }: { name: string }) {
  return (
    <div className="kit-icon-sizes" data-ground="light">
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
        <Icon name={name} form="rendered" label={title} />
      </div>
      <Tiles name={name} />
      <Bare name={name} />
    </li>
  );
}

/** Every icon at every size it has to work at, and the line icons of the sprite. */
export function IconSheet() {
  return (
    <Chapter
      id="icons"
      title="Icons"
      intro="Each member has one object: forged steel with a single glowing or rust-orange element. It is a rendered picture at three sizes, for a hero plate, a catalog plate, and every small place."
    >
      <Caption name="<Icon name form />">
        The small form holds from 24 pixels up. Below that every one of these objects is a smudge,
        so nothing in the family shows an icon smaller. On a dark ground it sits on a steel tile.
      </Caption>
      <div className="wrap">
        <ul className="kit-icons">
          <li className="kit-icon-row kit-icon-head" aria-hidden="true">
            <div />
            <div>On a plate</div>
            <div>{SIZES.join(" · ")} on tiles, dark ground</div>
            <div>{SIZES.join(" · ")} on the light ground</div>
          </li>
          {members.map((member) => (
            <IconRow key={member.name} {...member} />
          ))}
        </ul>
      </div>

      <Caption name="<Mark name />">
        The line icons of the sprite, for actions, links and the marks of a comparison. They take
        the text color.
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
