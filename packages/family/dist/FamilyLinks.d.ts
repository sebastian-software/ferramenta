export type FamilyLinksProps = {
    /** Omit this project from related links. Leave unset on the family overview. */
    current?: string;
    label?: string;
    className?: string;
};
/** Compact family navigation. Mount MarkDefs once in the host page. */
export declare function FamilyLinks({ current, label, className, }: FamilyLinksProps): import("react").JSX.Element;
