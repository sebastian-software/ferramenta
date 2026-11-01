import type { ReactNode } from "react";

import type { ComparisonMark, ComparisonTableProps } from "./Comparison.js";

import { FerraTable } from "./FerraComponents.js";

function isMark(value: unknown): value is ComparisonMark {
  return typeof value === "object" && value !== null && "mark" in value;
}
function Cell({ value }: { value: ComparisonMark | ReactNode }) {
  if (value === true) return <>Yes</>;
  if (value === false) return <>No</>;
  if (isMark(value)) {
    const labels = { yes: "Yes", partial: "Partial", no: "No" };
    return (
      <>
        {labels[value.mark]}
        {value.note !== undefined && <>: {value.note}</>}
      </>
    );
  }
  return <>{value ?? "—"}</>;
}

function Row({
  row,
  contenders,
  verdict,
}: {
  row: ComparisonTableProps["rows"][number];
  contenders: ComparisonTableProps["contenders"];
  verdict: boolean;
}) {
  return (
    <tr data-behind={row.behind ?? undefined}>
      <th scope="row">
        {row.label}
        {row.detail !== undefined && <span className="ferra-comparison-detail">{row.detail}</span>}
      </th>
      {contenders.map((entry) => (
        <td key={entry.id} data-own={entry.own ?? undefined}>
          <Cell value={row.values[entry.id]} />
        </td>
      ))}
      {verdict && (
        <td>
          <Cell value={row.verdict} />
        </td>
      )}
    </tr>
  );
}

/** The existing comparison data contract on Ferra's native, scrollable table. */
export function FerraComparisonTable({
  caption,
  subject,
  contenders,
  rows,
  verdictLabel,
  align = "start",
}: ComparisonTableProps) {
  return (
    <FerraTable caption={caption} className="ferra-comparison-table" data-align={align}>
      <thead>
        <tr>
          <th scope="col">{subject}</th>
          {contenders.map((entry) => (
            <th key={entry.id} scope="col" data-own={entry.own ?? undefined}>
              {entry.label}
            </th>
          ))}
          {verdictLabel !== undefined && <th scope="col">{verdictLabel}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row
            key={row.label}
            row={row}
            contenders={contenders}
            verdict={verdictLabel !== undefined}
          />
        ))}
      </tbody>
    </FerraTable>
  );
}
