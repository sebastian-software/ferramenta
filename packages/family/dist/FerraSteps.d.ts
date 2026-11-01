import type { ReactNode } from "react";
/** A short ordered explanation; content and processing logic belong to the host. */
export declare function FerraSteps({ caption, items, }: {
    caption: ReactNode;
    items: ReadonlyArray<{
        heading: string;
        text: ReactNode;
    }>;
}): import("react").JSX.Element;
