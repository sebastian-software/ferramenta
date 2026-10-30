import { type ComponentPropsWithoutRef, type ReactNode } from "react";
type ExampleProps = {
    title: ReactNode;
    introduction?: ReactNode;
    source: string;
    controls: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
};
/** A controlled example; callers own the state and rendered result. */
export declare function FerraExample({ title, introduction, source, controls, footer, children, }: ExampleProps): import("react").JSX.Element;
type ToggleProps = {
    pressed: boolean;
    label: string;
    description: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;
export declare function FerraToggle({ pressed, label, description, ...props }: ToggleProps): import("react").JSX.Element;
export {};
