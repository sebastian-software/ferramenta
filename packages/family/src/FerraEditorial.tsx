import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import {
  displayName,
  type FamilyEditorialNote,
  type FamilyTool,
  relationsOf,
  toolHref,
} from "./family.js";
import { FerraAction, FerraInstrument } from "./FerraComponents.js";
import { isFerraProduct } from "./FerraIdentity.js";
import { Mark } from "./Mark.js";
import { useToolFacts } from "./RegistryFacts.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

export type FerraSoftCardProps = {
  /** Choose the landmark that fits the content; the surface has no implicit role. */
  as?: "article" | "aside" | "div" | "section";
} & ComponentPropsWithoutRef<"div">;

/** A light reading surface. The host can set --ferra-card-padding for a margin note. */
export function FerraSoftCard({ as: Element = "div", className, ...props }: FerraSoftCardProps) {
  return <Element {...props} className={classes("ferra-soft-card", className)} />;
}

export type FerraEditorialProps = { navigation: ReactNode } & ComponentPropsWithoutRef<"div">;

/** A contents column and a reading flow, within the host's existing main landmark. */
export function FerraEditorial({ navigation, children, className, ...props }: FerraEditorialProps) {
  return (
    <div {...props} className={classes("ferra-editorial ferra-wrap", className)}>
      <div className="ferra-editorial-navigation">{navigation}</div>
      <div className="ferra-editorial-body">{children}</div>
    </div>
  );
}

export type FerraEditorialRowProps = { notes?: ReactNode } & ComponentPropsWithoutRef<"div">;

/** Source order keeps the article followed by the notes that explain it. */
export function FerraEditorialRow({
  notes,
  children,
  className,
  ...props
}: FerraEditorialRowProps) {
  return (
    <div {...props} className={classes("ferra-editorial-row", className)}>
      {children}
      {notes !== undefined && notes !== null && (
        <div className="ferra-editorial-notes">{notes}</div>
      )}
    </div>
  );
}

export type FerraNoteProps = {
  title: ReactNode;
  source?: { href: string; label: string };
} & Omit<ComponentPropsWithoutRef<"aside">, "title">;

export function FerraNote({ title, source, children, className, ...props }: FerraNoteProps) {
  const id = useId();
  return (
    <FerraSoftCard
      {...props}
      as="aside"
      className={classes("ferra-note", className)}
      aria-labelledby={id}
    >
      <h3 id={id}>{title}</h3>
      <div className="ferra-note-copy">{children}</div>
      {source && (
        <a className="ferra-note-source" href={source.href}>
          {source.label} <Mark name="arrow" size={16} />
        </a>
      )}
    </FerraSoftCard>
  );
}

export type FerraNotesProps = {
  label: string;
  notes: readonly FamilyEditorialNote[];
} & Omit<ComponentPropsWithoutRef<"aside">, "children">;

/** Several related aspects share one complementary surface beside their article. */
export function FerraNotes({ label, notes, className, ...props }: FerraNotesProps) {
  const id = useId();
  return (
    <FerraSoftCard
      {...props}
      as="aside"
      className={classes("ferra-notes", className)}
      aria-label={label}
    >
      {notes.map((note, index) => (
        <section className="ferra-note-section" key={note.title} aria-labelledby={`${id}-${index}`}>
          <h3 id={`${id}-${index}`}>{note.title}</h3>
          <p className="ferra-note-copy">{note.body}</p>
          <a className="ferra-note-source" href={note.href}>
            Read the source <Mark name="arrow" size={16} />
          </a>
        </section>
      ))}
    </FerraSoftCard>
  );
}

export function FerraReleaseFacts({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  return (
    <dl className="ferra-release-facts" aria-label={`${displayName(tool)} registry facts`}>
      <div>
        <dt>
          <Mark name="package" size={20} />
          Version
        </dt>
        <dd>{facts.version}</dd>
      </div>
      {facts.onCrates && (
        <div>
          <dt>
            <Mark name="crate" size={20} />
            <span className="ferra-visually-hidden">Crates.io total downloads</span>
          </dt>
          <dd>
            <b>{new Intl.NumberFormat("en-US").format(facts.crateDownloads)}</b>{" "}
            <span aria-hidden="true">crates.io downloads</span>
          </dd>
        </div>
      )}
    </dl>
  );
}

export type FerraEngineArticleProps = {
  tool: FamilyTool;
  href?: string;
  /** A host-owned worked example can replace the family instrument. */
  art?: ReactNode;
};

/** Image, name, role and prose stay together; all tool facts belong to the registry. */
export function FerraEngineArticle({ tool, href = toolHref(tool), art }: FerraEngineArticleProps) {
  const name = displayName(tool);
  return (
    <FerraSoftCard
      as="article"
      className="ferra-engine-article"
      id={tool.name}
      aria-labelledby={`${tool.name}-title`}
      tabIndex={-1}
    >
      <div className="ferra-engine-content">
        <div className="ferra-engine-art">
          <EngineArtwork tool={tool} art={art} />
        </div>
        <h2 id={`${tool.name}-title`}>{name}</h2>
        <p className="ferra-article-subtitle">{tool.editorial?.subtitle ?? tool.what}</p>
        <p className="ferra-article-introduction">{tool.editorial?.introduction ?? tool.does}</p>
        <FerraAction href={href}>
          Explore {name}
          {tool.docs === undefined && <span className="ferra-visually-hidden"> on GitHub</span>}
          <Mark name="arrow" size={20} />
        </FerraAction>
      </div>
      <footer className="ferra-engine-meta">
        <FerraReleaseFacts tool={tool} />
        <EngineRelations tool={tool} />
      </footer>
    </FerraSoftCard>
  );
}

function EngineArtwork({ tool, art }: Pick<FerraEngineArticleProps, "art" | "tool">): ReactNode {
  if (art !== undefined) return art;
  if (!isFerraProduct(tool.name)) throw new Error(`Missing ferra identity: ${tool.name}`);
  return <FerraInstrument product={tool.name} />;
}

function EngineRelations({ tool }: { tool: FamilyTool }) {
  const relations = relationsOf(tool);
  return relations.length > 0 ? (
    <ul className="ferra-article-relations">
      {relations.map((relation) => (
        <li key={`${relation.kind}-${relation.tool.name}`}>
          {relation.kind === "pairs-with"
            ? "Pairs with "
            : relation.kind === "runs-on"
              ? "Runs on "
              : "Used by "}
          <a href={toolHref(relation.tool)}>{displayName(relation.tool)}</a>.
        </li>
      ))}
    </ul>
  ) : null;
}
