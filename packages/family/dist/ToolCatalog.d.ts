import { type FamilyTool } from "./family.js";
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
export declare function Pegboard({ current, label }?: PegboardProps): import("react").JSX.Element;
export type ToolLedgerProps = {
    tools: FamilyTool[];
    /**
     * Number the rows 01, 02, 03 — only where the order is real, as in the
     * pipeline's chain. Unnumbered rows drop the column instead of leaving it empty.
     */
    steps?: boolean;
};
/** The registry ledger: one hairline row per member, with proof, facts and release. */
export declare function ToolLedger({ steps, tools }: ToolLedgerProps): import("react").JSX.Element;
export type JobIndexProps = {
    /** A member whose own site this is: it is left out of the index. */
    current?: string;
};
/**
 * The job index, like the aisle directory by a hardware store's door: every
 * job A to Z, and the tool that does it. Each member works on its own, so the
 * index recommends none; the stamp says how far each has come.
 */
export declare function JobIndex({ current }?: JobIndexProps): import("react").JSX.Element;
