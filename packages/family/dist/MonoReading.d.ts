import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { ComparisonTableProps } from "./Comparison.js";
export type MonoReadingLayoutProps = {
    /** The host's navigation: a `MonoSectionRail` and a `MonoGuideNavigation`. */
    navigation?: ReactNode;
    /** The page outline, for example `<ArdoTOC source="dom" scope="#…" />`. */
    outline?: ReactNode;
} & ComponentPropsWithoutRef<"article">;
/**
 * One reading column between host-owned navigation and the page outline. Both
 * panels stay in view under the sticky header; the outline steps aside below
 * 1181px and the navigation below 961px, where the host's menu carries it.
 */
export declare function MonoReadingLayout({ navigation, outline, children, className, ...props }: MonoReadingLayoutProps): import("react").JSX.Element;
/**
 * The pages of the current section. The host supplies the links, marks the
 * current one with `aria-current="page"` or `data-active="true"`, groups them
 * under `<p>` labels and names the landmark.
 */
export declare function MonoGuideNavigation({ className, ...props }: ComponentPropsWithoutRef<"nav">): import("react").JSX.Element;
export type MonoSectionRailProps = ComponentPropsWithoutRef<"nav">;
/**
 * Documentation sections, placed directly before `MonoGuideNavigation`. In the
 * reading layout they stand as a short list above the pages, divided from them
 * by a hairline; anywhere else, such as the host's mobile panel, they lie flat
 * as a row of tabs. The host supplies one link per section, marks the current
 * one with `data-active="true"` or `aria-current`, and names the landmark. The
 * tabs are links, not an ARIA tablist: switching a section navigates.
 */
export declare function MonoSectionRail({ className, ...props }: MonoSectionRailProps): import("react").JSX.Element;
/** Keeps native table geometry and scrolls a wide table inside its own box, never the page. */
export declare function MonoTableViewport({ children, className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
/** The MDX `table` slot: prose may wrap, but comparison columns keep readable words. */
export declare function MonoReadingTable(props: ComponentPropsWithoutRef<"table">): import("react").JSX.Element;
export type MonoTableProps = {
    caption: ReactNode;
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"table">, "children">;
/** A captioned hairline table; native children keep the consumer's header relationships. */
export declare function MonoTable({ caption, children, className, ...props }: MonoTableProps): import("react").JSX.Element;
/**
 * Measurements in a table; callers keep units, platform groups, sources and
 * missing values. The cells may use `mono-benchmark-name`, `-detail`,
 * `-source`, `-conformance` and `-reference`.
 */
export declare function MonoBenchmarkTable({ className, ...props }: MonoTableProps): import("react").JSX.Element;
/** The shared comparison data contract as a hairline table; the own column is set apart. */
export declare function MonoComparisonTable({ caption, subject, contenders, rows, verdictLabel, align, }: ComparisonTableProps): import("react").JSX.Element;
