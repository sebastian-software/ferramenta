import type { ReactNode } from "react";
import { type FamilyStatus } from "./family.js";
export type StampProps = {
    /** Solid rust for the settled state (stable, covered); a tinted fill otherwise. */
    solid?: boolean;
    children: ReactNode;
};
/** A status stamp: mono, uppercase, zero radius. */
export declare function Stamp({ children, solid }: StampProps): import("react").JSX.Element;
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
export declare function Ledger({ entries }: {
    entries: LedgerEntry[];
}): import("react").JSX.Element;
/**
 * The stamp legend: every maturity status with the one line it promises, from
 * the registry. Put it where the stamps first need reading; on iron it takes
 * the iron stamp set.
 */
export declare function StampKey({ statuses }: {
    statuses?: FamilyStatus[];
}): import("react").JSX.Element;
