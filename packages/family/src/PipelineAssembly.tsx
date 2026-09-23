import { Fragment } from "react";

import { family, familyGroups, type FamilyTool, PIPELINE, type PipelineEnd } from "./family.js";
import { Fasteners } from "./Fasteners.js";
import { Mark } from "./Mark.js";

export type PipelineAssemblyProps = {
  /**
   * The pipeline member this site belongs to. Its stage is marked as the one
   * you are on and is not a link; the others link to their sites. Leave it out
   * on the family site and on a site that is not a stage — naming any other
   * member is a configuration error, not a silently unmarked chain.
   */
  current?: string;
  /** What enters the chain. Defaults to the registry's `PIPELINE.input`. */
  input?: PipelineEnd;
  /** What leaves it. Defaults to the registry's `PIPELINE.output`. */
  output?: PipelineEnd;
  /**
   * The sentence a screen reader hears for the whole figure. Defaults to the
   * registry's `PIPELINE.description`; nearby prose stays the full text
   * alternative.
   */
  label?: string;
};

/** One member of the chain: its step, its plate, its name. A link unless it is this site. */
function Stage({ current, step, tool }: { current: boolean; step: number; tool: FamilyTool }) {
  const content = (
    <>
      <span className="fam-assembly-step">{String(step).padStart(2, "0")}</span>
      <span className="markplate">
        <Mark name={tool.name} />
      </span>
      <span className="fam-assembly-copy">
        <b>{tool.name}</b>
        <small>{tool.shortJob}</small>
      </span>
    </>
  );
  return current ? (
    <span className="fam-assembly-stage" aria-current="true">
      {content}
    </span>
  ) : (
    <a className="fam-assembly-stage" href={tool.docs ?? tool.repo}>
      {content}
    </a>
  );
}

/**
 * The content pipeline as one assembled machine: a chamfered steel chassis on
 * four fasteners, the pipeline members in chain order between an input and an
 * output terminal. Horizontal on wide screens, vertical below 46rem.
 */
export function PipelineAssembly({
  current,
  input = PIPELINE.input,
  label = PIPELINE.description,
  output = PIPELINE.output,
}: PipelineAssemblyProps = {}) {
  const { pipeline } = familyGroups();
  if (current !== undefined && !pipeline.some((tool) => tool.name === current)) {
    const known = family.some((tool) => tool.name === current);
    throw new Error(
      known
        ? `${current} is not a pipeline stage; leave \`current\` out on its site`
        : `Unknown Ferramenta project: ${current}`,
    );
  }

  return (
    <figure className="fam-assembly" aria-label={label}>
      <Fasteners />
      <div className="fam-assembly-flow">
        <span className="fam-assembly-end">
          <small>{input.label}</small>
          <b>{input.text}</b>
        </span>
        <Mark name="arrow" className="fam-assembly-connector icon" />
        {pipeline.map((tool, index) => (
          <Fragment key={tool.name}>
            <Stage current={tool.name === current} step={index + 1} tool={tool} />
            <Mark name="arrow" className="fam-assembly-connector icon" />
          </Fragment>
        ))}
        <span className="fam-assembly-end fam-assembly-output">
          <small>{output.label}</small>
          <b>{output.text}</b>
        </span>
      </div>
    </figure>
  );
}
