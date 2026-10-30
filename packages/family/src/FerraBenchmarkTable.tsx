import type { FerraTableProps } from "./FerraTypes.js";

import { FerraTable } from "./FerraComponents.js";

/** Measurement presentation; callers retain units, platform groups, sources and missing values. */
export function FerraBenchmarkTable({ className, ...props }: FerraTableProps) {
  return (
    <FerraTable
      {...props}
      className={["ferra-benchmark-table", className].filter(Boolean).join(" ")}
    />
  );
}
