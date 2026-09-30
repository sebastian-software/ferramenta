import type { ReactNode } from "react";

import { Rivets } from "./Plate.js";

export type EvidenceFigure = {
  /** What was measured. Also the row's key, so keep it unique. */
  label: string;
  /** The figure itself, large: a factor, a count, a percentage. */
  value: ReactNode;
  /** One line on the input it was measured on. */
  detail?: ReactNode;
  /** The raw measurement behind the figure, in mono — e.g. "~93 µs vs ~3.04 ms". */
  measure?: ReactNode;
};

/**
 * Measured figures, each stamped on a small steel plate: the figure large, its
 * label and input beneath. Only numbers someone can reproduce — put where and
 * when they were measured in the section's `note`. A project's own site shows
 * them; the family site never repeats a figure.
 */
export function EvidenceFigures({ figures }: { figures: EvidenceFigure[] }) {
  return (
    <dl className="fam-figures">
      {figures.map((figure) => (
        <div key={figure.label} className="fam-plate fam-figure">
          <Rivets />
          <dt>{figure.label}</dt>
          <dd className="fam-figure-value">{figure.value}</dd>
          {(figure.detail !== undefined || figure.measure !== undefined) && (
            <dd className="fam-figure-detail">
              {figure.detail}
              {figure.measure !== undefined && <span>{figure.measure}</span>}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
