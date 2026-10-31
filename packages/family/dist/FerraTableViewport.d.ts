import { type ComponentPropsWithoutRef } from "react";
/** Keep native table geometry and expose overflow without stretching the page. */
export declare function FerraTableViewport({ children, className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
/** MDX table slot: prose may wrap, but comparison columns must retain readable words. */
export declare function FerraReadingTable(props: ComponentPropsWithoutRef<"table">): import("react").JSX.Element;
