import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, use, useMemo } from "react";
import { toolFacts, useFamilyFacts, } from "./LiveRegistry.js";
const NO_SNAPSHOT = {};
const FactsContext = createContext({ snapshot: NO_SNAPSHOT, live: {} });
/**
 * Provides registry figures to everything below it that shows a release: the
 * snapshot during prerender, live values after hydration.
 */
export function RegistryFacts({ children, endpoints, metrics, snapshot = NO_SNAPSHOT, snapshotGeneratedAt, }) {
    const live = useFamilyFacts(snapshot, { endpoints, metrics, snapshotGeneratedAt });
    const value = useMemo(() => ({ snapshot, live }), [snapshot, live]);
    return _jsx(FactsContext, { value: value, children: children });
}
/** A member's facts inside `RegistryFacts`; the fallback version outside it. */
export function useToolFacts(tool) {
    const { live, snapshot } = use(FactsContext);
    return toolFacts(tool, snapshot[tool.name], live[tool.name]);
}
