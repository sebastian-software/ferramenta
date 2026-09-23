import type { ReactNode } from "react";

import { type FamilyStatus, STATUS_MEANING, STATUS_ORDER } from "./family.js";

export type StampProps = {
  /** Solid rust for the settled state (stable, covered); a tinted fill otherwise. */
  solid?: boolean;
  children: ReactNode;
};

/** A status stamp: mono, uppercase, zero radius. */
export function Stamp({ children, solid = false }: StampProps) {
  return (
    <span className="fam-stamp" data-tone={solid ? "solid" : undefined}>
      {children}
    </span>
  );
}

export type LedgerEntry = {
  /** Who or what the row is about. Also the row's key, so keep it unique. */
  name: string;
  /** The stamp text: "Covered", "UTF-8 only", "Not a target". */
  status: string;
  /** Stamp the status solid: the settled state. */
  settled?: boolean;
  /** The sentence that says what the status means for this row. */
  detail?: ReactNode;
};

/**
 * A coverage or compatibility ledger: hairline rows of name, status stamp and
 * the sentence behind it. Say what is not covered as plainly as what is.
 */
export function Ledger({ entries }: { entries: LedgerEntry[] }) {
  return (
    <ul className="fam-ledger">
      {entries.map((entry) => (
        <li key={entry.name} className="fam-ledger-row">
          <b className="fam-ledger-name">{entry.name}</b>
          <Stamp solid={entry.settled}>{entry.status}</Stamp>
          {entry.detail !== undefined && <p>{entry.detail}</p>}
        </li>
      ))}
    </ul>
  );
}

/**
 * The stamp legend: every maturity status with the one line it promises, from
 * the registry. Put it where the stamps first need reading; on iron it takes
 * the iron stamp set.
 */
export function StampKey({ statuses = STATUS_ORDER }: { statuses?: FamilyStatus[] }) {
  return (
    <dl className="fam-stamp-key">
      {statuses.map((status) => (
        <div key={status}>
          <dt>
            <Stamp solid={status === "stable"}>{status}</Stamp>
          </dt>
          <dd>{STATUS_MEANING[status]}</dd>
        </div>
      ))}
    </dl>
  );
}
