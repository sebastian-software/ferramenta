import type { ComponentPropsWithoutRef, ReactNode } from "react";
export type FerraReadingLayoutProps = {
    navigation?: ReactNode;
    outline?: ReactNode;
} & ComponentPropsWithoutRef<"article">;
/** A bounded reading surface between host-owned navigation and the page outline. */
export declare function FerraReadingLayout({ navigation, outline, children, className, ...props }: FerraReadingLayoutProps): import("react").JSX.Element;
