import { type ComponentPropsWithoutRef } from "react";
import type { EditorialActionProps, EditorialBarsProps, EditorialCodeProps, EditorialEngineCatalogProps, EditorialFooterProps, EditorialHeaderProps, EditorialHeroProps, EditorialInstrumentProps, EditorialLogoProps, EditorialMarkProps, EditorialSectionProps, EditorialTableProps } from "./EditorialTypes.js";
/** One authored light scheme; the stylesheet has no global reset. */
export declare function EditorialPage({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export declare function EditorialMark({ product, label, size, className }: EditorialMarkProps): import("react").JSX.Element;
export declare function EditorialLogo({ product, className, ...props }: EditorialLogoProps): import("react").JSX.Element;
export declare function EditorialInstrument({ product, label, className }: EditorialInstrumentProps): import("react").JSX.Element;
export declare function EditorialHeader({ product, home, nav, navLabel, }: EditorialHeaderProps): import("react").JSX.Element;
export declare function EditorialFooter({ product, home, children }: EditorialFooterProps): import("react").JSX.Element;
/** Place before the footer; original outside brands belong on a flat, light ground. */
export declare function EditorialWorkshop({ id, className, }?: Pick<ComponentPropsWithoutRef<"section">, "className" | "id">): import("react").JSX.Element;
export declare function EditorialHero({ product, title, what, children, actions, art, }: EditorialHeroProps): import("react").JSX.Element;
export declare function EditorialSection({ title, label, intro, surface, children, className, id, ...props }: EditorialSectionProps): import("react").JSX.Element;
export declare function EditorialColumns({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export declare function EditorialAction({ variant, className, children, ...props }: EditorialActionProps): import("react").JSX.Element;
/** Registry facts remain authoritative even when a preview overrides the destinations. */
export declare function EditorialEngineCatalog({ hrefFor }: EditorialEngineCatalogProps): import("react").JSX.Element;
/** Native children preserve the consumer's column and row header relationships. */
export declare function EditorialTable({ caption, children }: EditorialTableProps): import("react").JSX.Element;
export declare function EditorialCode({ caption, file, children }: EditorialCodeProps): import("react").JSX.Element;
/** A reading surface for the actual output of a worked example. */
export declare function EditorialSpecimen({ caption, children }: EditorialTableProps): import("react").JSX.Element;
export declare function EditorialBars({ caption, items, children }: EditorialBarsProps): import("react").JSX.Element;
