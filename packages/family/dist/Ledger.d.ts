import type { ReactNode } from "react";
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
