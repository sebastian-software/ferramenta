import { jsx as _jsx } from "react/jsx-runtime";
import { FerraTable } from "./FerraComponents.js";
/** Measurement presentation; callers retain units, platform groups, sources and missing values. */
export function FerraBenchmarkTable({ className, ...props }) {
    return (_jsx(FerraTable, { ...props, className: ["ferra-benchmark-table", className].filter(Boolean).join(" ") }));
}
