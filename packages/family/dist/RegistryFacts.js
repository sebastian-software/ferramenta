import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, use, useMemo } from "react";
import { family } from "./family.js";
import { liveRequestFor, toolFacts, useLiveRegistry, } from "./LiveRegistry.js";
const NO_SNAPSHOT = {};
const FactsContext = createContext({ snapshot: NO_SNAPSHOT, live: {} });
/**
 * Provides registry figures to the tool ledger, the board and the download
 * tally below it: the snapshot during prerender, live values after hydration.
 */
export function RegistryFacts({ children, endpoints, snapshot = NO_SNAPSHOT }) {
    const live = useLiveRegistry(liveRequestFor(snapshot), endpoints);
    const value = useMemo(() => ({ snapshot, live }), [snapshot, live]);
    return _jsx(FactsContext, { value: value, children: children });
}
/** A member's facts inside `RegistryFacts`; the fallback version outside it. */
export function useToolFacts(tool) {
    const { live, snapshot } = use(FactsContext);
    return toolFacts(tool, snapshot[tool.name], live[tool.name]);
}
const formatCount = (value) => value.toLocaleString("en-US");
/** A count in the page's tabular mono, formatted the same on server and client. */
export function Count({ value }) {
    return _jsx("b", { className: "fam-count", children: formatCount(value) });
}
/** All-time crates.io downloads across the family's published crates, live once they answer. */
export function FamilyDownloads() {
    const { live, snapshot } = use(FactsContext);
    const total = family.reduce((sum, tool) => sum + toolFacts(tool, snapshot[tool.name], live[tool.name]).crateDownloads, 0);
    return _jsx(Count, { value: total });
}
