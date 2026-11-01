import type { ComponentPropsWithoutRef } from "react";
type SelectProps = {
    label: string;
    options: ReadonlyArray<{
        value: string;
        label: string;
    }>;
} & Omit<ComponentPropsWithoutRef<"select">, "children">;
/** A labeled native select; callers own its value and the content it controls. */
export declare function FerraSelect({ label, options, ...props }: SelectProps): import("react").JSX.Element;
export {};
