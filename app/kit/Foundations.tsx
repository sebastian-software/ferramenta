import { Caption, Chapter } from "./Specimen";

type Token = { name: string; role: string };

const GROUND: Token[] = [
  { name: "--bg", role: "The page ground" },
  { name: "--bg-dim", role: "A section set apart" },
  { name: "--ink", role: "Text" },
  { name: "--ink-soft", role: "Secondary text" },
  { name: "--line", role: "Hairlines" },
  { name: "--rust", role: "The one color: links, the settled stamp" },
];

const RUST: Token[] = [
  { name: "--rust-fill", role: "Rust as a surface: the closing band, a settled stamp on steel" },
  { name: "--rust-fill-edge", role: "The edge of a rust surface" },
  { name: "--rust-fill-ink", role: "Text on rust" },
  { name: "--rust-fill-soft", role: "Secondary text on rust" },
  { name: "--rust-deep", role: "Links in running text, the pull quote" },
  { name: "--rust-on-steel", role: "A word of the headline on a plate; never small text" },
];

const IRON: Token[] = [
  { name: "--iron", role: "Black steel: header, footer, dark bands" },
  { name: "--iron-2", role: "A raised surface on black steel" },
  { name: "--iron-ink", role: "Text on black steel" },
  { name: "--iron-soft", role: "Secondary text on black steel" },
  { name: "--iron-line", role: "Hairlines on black steel" },
  { name: "--ember", role: "Rust as it glows on black steel" },
];

const PLATE: Token[] = [
  { name: "--steel", role: "The plate, under its texture" },
  { name: "--steel-ink", role: "Text on a plate" },
  { name: "--rust-on-steel", role: "Rust on a plate" },
  { name: "--inlay", role: "The dark inlay small facts sit on" },
  { name: "--inlay-ink", role: "Text on an inlay" },
  { name: "--inlay-soft", role: "A label on an inlay" },
];

function Swatches({ tokens }: { tokens: Token[] }) {
  return (
    <ul className="kit-swatches">
      {tokens.map((token) => (
        <li key={token.name} className="kit-swatch">
          <i style={{ background: `var(${token.name})` }} />
          <code>{token.name}</code>
          <span>{token.role}</span>
        </li>
      ))}
    </ul>
  );
}

function Colors() {
  return (
    <>
      <Caption name="tokens.css · the ground">
        A light, cool ground. Rust is the only color, and it is oxidized: dark, never a bright
        orange field.
      </Caption>
      <div className="wrap">
        <Swatches tokens={GROUND} />
      </div>
      <Caption name="tokens.css · rust">
        Dark and oxidized on every surface. As a fill it appears once per page, at its close.
      </Caption>
      <div className="wrap">
        <Swatches tokens={RUST} />
      </div>
      <Caption name="tokens.css · black steel">
        The chrome and the deliberately dark passages of a page. The same in every scheme.
      </Caption>
      <div className="wrap">
        <Swatches tokens={IRON} />
      </div>
      <Caption name="tokens.css · the plate">
        Text on steel is solid and dark. Small facts never sit on the texture: they go on an inlay.
      </Caption>
      <div className="wrap">
        <Swatches tokens={PLATE} />
      </div>
    </>
  );
}

function Materials() {
  return (
    <>
      <Caption name="textures/">
        Three materials, each with one job. Everything else on a page is flat.
      </Caption>
      <div className="wrap">
        <ul className="kit-materials">
          <li className="kit-material">
            <i className="fam-plate" />
            <b>Brushed steel</b>
            <span>The plate: what a thing is, and the action. Riveted at its corners.</span>
          </li>
          <li className="kit-material">
            <i className="fam-band" />
            <b>Black steel</b>
            <span>The ground of the first viewport and of a page&rsquo;s dark bands.</span>
          </li>
          <li className="kit-material">
            <i className="fam-work" />
            <b>Rust</b>
            <span>
              Once per page, at its close: the band that offers the workshop&rsquo;s help.
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}

function Type() {
  return (
    <>
      <Caption name="fonts.css · type">
        Barlow Condensed letters everything a plate would carry: names, headings, labels. Reading
        text stays in the system face, code in the system mono.
      </Caption>
      <div className="wrap">
        <dl className="kit-type">
          <div>
            <dt>
              <code>fam-title</code>
              The headline on the hero plate
            </dt>
            <dd className="kit-type-title">Rebuilt in Rust</dd>
          </div>
          <div>
            <dt>
              <code>fam-what</code>
              What the thing is, under its name
            </dt>
            <dd className="kit-type-what">A regex engine in memory-safe Rust.</dd>
          </div>
          <div>
            <dt>
              <code>fam-heading</code>
              A section&rsquo;s heading
            </dt>
            <dd className="kit-type-h2">Seven engines, each for one job</dd>
          </div>
          <div>
            <dt>
              <code>h3</code>
              A principle, a name on a plate
            </dt>
            <dd className="kit-type-h3">Proven, not promised</dd>
          </div>
          <div>
            <dt>
              <code>label</code>
              A fact&rsquo;s label, a stamp, a column head
            </dt>
            <dd className="kit-type-label">Checked against</dd>
          </div>
          <div>
            <dt>
              <code>fam-lede</code>
              The paragraph on the plate
            </dt>
            <dd className="kit-type-lede">
              Each follows the standard its field already agreed on, and each works on its own.
            </dd>
          </div>
          <div>
            <dt>
              <code>body</code>
              Reading text, in the system face
            </dt>
            <dd className="kit-type-body">
              Where an engine succeeds an established implementation, differential suites measure it
              against that reference. Claims stay tied to current evidence.
            </dd>
          </div>
          <div>
            <dt>
              <code>mono</code>
              Code, commands, a release
            </dt>
            <dd className="kit-type-mono">cargo add ferroni</dd>
          </div>
        </dl>
      </div>
    </>
  );
}

/** The foundations: color, material, type. */
export function Foundations() {
  return (
    <Chapter
      id="foundations"
      title="Foundations"
      intro="One authored scheme: a light ground with deliberately dark passages. A landing page does not change with the visitor's theme; only documentation follows it."
    >
      <Colors />
      <Materials />
      <Type />
    </Chapter>
  );
}
