import { type ComponentPropsWithoutRef, type ReactNode } from "react";
type ArticleProps = {
    title: ReactNode;
    introduction?: ReactNode;
    art?: ReactNode;
    /** A decorative line symbol beside the article's visible heading. */
    icon?: ReactNode;
    meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"article">, "title">;
/** An image-first story with an attached evidence footer; the host owns its content. */
export declare function FerraArticle({ title, introduction, art, icon, meta, children, className, ...props }: ArticleProps): import("react").JSX.Element;
export declare function FerraFeatureGrid({ items, }: {
    items: ReadonlyArray<{
        heading: string;
        text: ReactNode;
    }>;
}): import("react").JSX.Element;
export declare function FerraTabs({ className, ...props }: ComponentPropsWithoutRef<"nav">): import("react").JSX.Element;
/** Related destinations, with the title and action supplied by the host. */
export declare function FerraChoices({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function FerraMedia({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function FerraGuideNavigation({ className, ...props }: ComponentPropsWithoutRef<"nav">): import("react").JSX.Element;
export {};
