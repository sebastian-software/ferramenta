import { useId } from "react";

import {
  byJob,
  displayName,
  family,
  type FamilyGroup,
  familyGroups,
  type FamilyTool,
  isEngine,
  leadsToRepo,
  runsOnTools,
  toolHref,
} from "./family.js";
import { Fasteners } from "./Fasteners.js";
import { Stamp } from "./Ledger.js";
import { Mark } from "./Mark.js";
import { Count, useToolFacts } from "./RegistryFacts.js";
import { RepoNote } from "./RepoNote.js";

/*
 * The family's members as a site shows them: hung on the pegboard, set in the
 * tool ledger, looked up in the job index. Everything comes from the registry,
 * and the release figures from `RegistryFacts`. Styled by `landing.css`.
 */

const GROUPS: Array<{ key: FamilyGroup; label: string }> = [
  { key: "pipeline", label: "Pipeline" },
  { key: "language", label: "Language" },
  { key: "workbench", label: "Workbench" },
];

function boardGroups(current?: string) {
  const groups = familyGroups(current);
  return GROUPS.map((group) => ({ ...group, tools: groups[group.key] })).filter(
    (group) => group.tools.length > 0,
  );
}

function BoardItem({ tool }: { tool: FamilyTool }) {
  return (
    <a className="fam-board-item" href={toolHref(tool)}>
      <svg className="hook" aria-hidden="true">
        <use href="#i-hook" />
      </svg>
      <span className="markplate">
        <Mark name={tool.mark ?? tool.name} />
      </span>
      <span className="fam-board-copy">
        <b>
          {tool.name}
          {leadsToRepo(tool) ? (
            <Mark name="github" className="icon fam-board-repo" size={11} />
          ) : null}
          <RepoNote tool={tool} />
        </b>
        <small>{tool.shortJob}</small>
      </span>
      {/* Riveted to the plate's lower edge: no extra row, so no hook moves. */}
      <span className="fam-board-stamp">
        <Stamp solid={tool.status === "stable"}>{tool.status}</Stamp>
      </span>
    </a>
  );
}

function BoardGroup({ label, tools }: { label: string; tools: FamilyTool[] }) {
  const labelId = useId();
  return (
    <div className="fam-board-group" role="group" aria-labelledby={labelId}>
      <small className="fam-board-label" id={labelId}>
        {label}
      </small>
      <div className="fam-board-row">
        {tools.map((tool) => (
          <BoardItem key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export type PegboardProps = {
  /** A member whose own site this is: it is left off the wall. */
  current?: string;
  /** The navigation landmark's name. */
  label?: string;
};

/**
 * The pegboard: every member on a hook, grouped the way the family is, each
 * plate stamped with its maturity so none outranks another. Its geometry is
 * the 28px wall grid (see DESIGN.md); it fits the hero's `aside`.
 */
export function Pegboard({ current, label = "The tool family" }: PegboardProps = {}) {
  return (
    <nav className="fam-board" aria-label={label}>
      <Fasteners />
      <div className="fam-board-grid">
        {boardGroups(current).map((group) => (
          <BoardGroup key={group.key} label={group.label} tools={group.tools} />
        ))}
      </div>
    </nav>
  );
}

/**
 * The facts under a row's proof, as a definition list a screen reader can
 * pace. A successor names what it succeeds, a new development the standards it
 * builds on, an application the engines it runs on; each names its evidence,
 * qualitatively, never with a figure.
 */
function ToolFactsList({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  const runsOn = runsOnTools(tool);
  return (
    <dl className="fam-tool-facts">
      {tool.succeeds === undefined ? null : (
        <div>
          <dt>Succeeds</dt>
          <dd>{tool.succeeds}</dd>
        </div>
      )}
      {tool.buildsOn === undefined ? null : (
        <div>
          <dt>Builds on</dt>
          <dd>{tool.buildsOn}</dd>
        </div>
      )}
      {runsOn.length === 0 ? null : (
        <div>
          <dt>Runs on</dt>
          <dd>{runsOn.map((member) => displayName(member)).join(" · ")}</dd>
        </div>
      )}
      <div>
        <dt>Evidence</dt>
        <dd>{tool.evidence}</dd>
      </div>
      {facts.onCrates ? (
        <div>
          <dt>Downloads</dt>
          <dd>
            <Count value={facts.crateDownloads} /> on crates.io
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

function ToolMeta({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  return (
    <div className="fam-tool-meta">
      <b className="fam-tool-version">v{facts.version}</b>
      {facts.onCrates || facts.adapter || isEngine(tool) ? (
        <span className="fam-tool-platforms">
          {facts.onCrates ? (
            <span className="fam-tool-platform">
              <Mark name="crate" className="icon" size={15} />
              crates.io
            </span>
          ) : null}
          {facts.adapter ? (
            <span className="fam-tool-platform">
              <Mark name="adapter" className="icon" size={15} />
              npm
            </span>
          ) : null}
          {isEngine(tool) && !facts.onCrates && !facts.adapter ? (
            <span className="fam-tool-platform">install from Git</span>
          ) : null}
        </span>
      ) : null}
      <Stamp solid={tool.status === "stable"}>{tool.status}</Stamp>
    </div>
  );
}

/**
 * One ledger row. The name is the link, stretched over the whole row, so the
 * target stays the row while a screen reader hears the name, not every fact
 * at once. A row that leads to a repository rather than a site says so.
 */
function ToolRow({ step, tool }: { step?: number; tool: FamilyTool }) {
  return (
    <article className="fam-tool">
      {step === undefined ? null : (
        <span className="fam-tool-num" aria-hidden="true">
          {String(step).padStart(2, "0")}
        </span>
      )}
      <span className="markplate fam-tool-plate" aria-hidden="true">
        <Mark name={tool.mark ?? tool.name} />
      </span>
      <div className="fam-tool-who">
        <h3 className="fam-tool-name">
          <a className="fam-tool-link" href={toolHref(tool)}>
            {tool.name}
            <RepoNote tool={tool} />
          </a>
        </h3>
        <p className="fam-tool-job">{tool.job}</p>
      </div>
      <div className="fam-tool-proof">
        <p className="fam-tool-story">{tool.proof}</p>
        <ToolFactsList tool={tool} />
      </div>
      <ToolMeta tool={tool} />
      <Mark name={leadsToRepo(tool) ? "github" : "arrow"} className="fam-tool-go icon" size={22} />
    </article>
  );
}

export type ToolLedgerProps = {
  tools: FamilyTool[];
  /**
   * Number the rows 01, 02, 03 — only where the order is real, as in the
   * pipeline's chain. Unnumbered rows drop the column instead of leaving it empty.
   */
  steps?: boolean;
};

/** The registry ledger: one hairline row per member, with proof, facts and release. */
export function ToolLedger({ steps = false, tools }: ToolLedgerProps) {
  return (
    <div className="fam-tools" data-steps={steps ? "" : undefined}>
      {tools.map((tool, index) => (
        <ToolRow key={tool.name} tool={tool} step={steps ? index + 1 : undefined} />
      ))}
    </div>
  );
}

export type JobIndexProps = {
  /** A member whose own site this is: it is left out of the index. */
  current?: string;
};

/**
 * The job index, like the aisle directory by a hardware store's door: every
 * job A to Z, and the tool that does it. Each member works on its own, so the
 * index recommends none; the stamp says how far each has come.
 */
export function JobIndex({ current }: JobIndexProps = {}) {
  const tools = byJob(family.filter((tool) => tool.name !== current));
  return (
    <ul className="fam-jobs">
      {tools.map((tool) => (
        <li key={tool.name}>
          {/* Read as one line, the cells would run together: the label says it with its pauses. */}
          <a
            className="fam-job"
            href={toolHref(tool)}
            aria-label={`${tool.shortJob}: ${displayName(tool)}, ${tool.status}${leadsToRepo(tool) ? " (GitHub repository)" : ""}`}
          >
            <span className="fam-job-name">{tool.shortJob}</span>
            <span className="fam-job-leader" aria-hidden="true" />
            <span className="fam-job-tool">
              <Mark name={tool.mark ?? tool.name} className="mark" size={22} />
              <b>{tool.name}</b>
            </span>
            <Stamp solid={tool.status === "stable"}>{tool.status}</Stamp>
          </a>
        </li>
      ))}
    </ul>
  );
}
