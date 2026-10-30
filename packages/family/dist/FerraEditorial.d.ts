import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type FamilyEditorialNote, type FamilyTool } from "./family.js";
export type FerraSoftCardProps = {
    /** Choose the landmark that fits the content; the surface has no implicit role. */
    as?: "article" | "aside" | "div" | "section";
} & ComponentPropsWithoutRef<"div">;
/** A light reading surface. The host can set --ferra-card-padding for a margin note. */
export declare function FerraSoftCard({ as: Element, className, ...props }: FerraSoftCardProps): import("react").JSX.Element;
export type FerraEditorialProps = {
    navigation: ReactNode;
} & ComponentPropsWithoutRef<"div">;
/** A contents column and a reading flow, within the host's existing main landmark. */
export declare function FerraEditorial({ navigation, children, className, ...props }: FerraEditorialProps): import("react").JSX.Element;
export type FerraEditorialRowProps = {
    notes?: ReactNode;
} & ComponentPropsWithoutRef<"div">;
/** Source order keeps the article followed by the notes that explain it. */
export declare function FerraEditorialRow({ notes, children, className, ...props }: FerraEditorialRowProps): import("react").JSX.Element;
export type FerraNoteProps = {
    title: ReactNode;
    source?: {
        href: string;
        label: string;
    };
} & Omit<ComponentPropsWithoutRef<"aside">, "title">;
export declare function FerraNote({ title, source, children, className, ...props }: FerraNoteProps): import("react").JSX.Element;
export type FerraNotesProps = {
    label: string;
    notes: readonly FamilyEditorialNote[];
} & Omit<ComponentPropsWithoutRef<"aside">, "children">;
/** Several related aspects share one complementary surface beside their article. */
export declare function FerraNotes({ label, notes, className, ...props }: FerraNotesProps): import("react").JSX.Element;
export declare function FerraReleaseFacts({ tool }: {
    tool: FamilyTool;
}): import("react").JSX.Element;
export type FerraEngineArticleProps = {
    tool: FamilyTool;
    href?: string;
    /** A host-owned worked example can replace the family instrument. */
    art?: ReactNode;
};
/** Image, name, role and prose stay together; all tool facts belong to the registry. */
export declare function FerraEngineArticle({ tool, href, art }: FerraEngineArticleProps): import("react").JSX.Element;
