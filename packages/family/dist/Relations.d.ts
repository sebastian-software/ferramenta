export type RelationsProps = {
    /** The member whose page this is, e.g. "ferroni". */
    current: string;
};
/**
 * Where a member fits with the rest of the family, from the registry: what it
 * runs on, what it pairs with, what it carries. Each related member is a link
 * to its own site. Members are independent, so this names where two fit
 * together and never draws a chain; a member that stands alone renders nothing.
 */
export declare function Relations({ current }: RelationsProps): import("react").JSX.Element | null;
