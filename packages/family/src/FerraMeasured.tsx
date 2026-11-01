import type { MeasuredProps, MeasuredRow } from "./Comparison.js";

/** Keep measurement conditions, source revision and reproduction links beside the result. */
export function FerraMeasured({ on, machine, revision, more, children }: MeasuredProps) {
  const rows: MeasuredRow[] = [
    { label: "Measured", value: on },
    { label: "Machine", value: machine },
    ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
    ...(more ?? []),
    ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
  ];
  return (
    <dl className="ferra-measured">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
