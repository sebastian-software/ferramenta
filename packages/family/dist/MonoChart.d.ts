import { type ReactNode } from "react";
export type MonoSegmentedOption = {
    value: string;
    label: ReactNode;
};
export type MonoSegmentedProps = {
    label: string;
    options: MonoSegmentedOption[];
    value: string;
    onChange: (value: string) => void;
};
/** A row of pressed/unpressed buttons; the caller owns the value. */
export declare function MonoSegmented({ label, options, value, onChange }: MonoSegmentedProps): import("react").JSX.Element;
export type MonoBarRow = {
    id: string;
    label: string;
    sub?: string;
    /** Time relative to the engine's own, which is 1. */
    value: number;
    /** The engine's own row wears the rust accent. */
    own?: boolean;
};
export type MonoBarChartProps = {
    title: ReactNode;
    description?: ReactNode;
    /** Segmented controls above the bars; the caller owns their state. */
    toggles?: ReactNode;
    rows: MonoBarRow[];
    /** The value at the right edge; longer bars show a clean break. */
    scale: number;
    ticks: number[];
    /** The tooltip for a row on hover and focus. */
    describe: (row: MonoBarRow, cut: boolean) => ReactNode;
    /** Text and links under the scale. */
    after?: ReactNode;
    /** The measuring conditions beside the chart. */
    conditions?: ReactNode;
    /** An accessible name for the list of bars. */
    label: string;
};
/**
 * Horizontal comparison bars: the engine's own row in rust, the others in
 * steel, a hairline at 1×, the value at the end of every row, a tooltip on
 * hover and focus, and one growth when the chart first comes into view.
 */
export declare function MonoBarChart({ title, description, toggles, rows, scale, ticks, describe, after, conditions, label, }: MonoBarChartProps): import("react").JSX.Element;
export type MonoTableViewProps = {
    summary?: ReactNode;
    children: ReactNode;
};
/** The same figures as a plain table, folded under the chart. */
export declare function MonoTableView({ summary, children, }: MonoTableViewProps): import("react").JSX.Element;
