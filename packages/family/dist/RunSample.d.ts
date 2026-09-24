import type { ReactNode } from "react";
export type RunSampleProps = {
    /** The source that went in, shown as code. */
    input: string;
    /** The input's file name or command, kept in its own case. */
    inputCaption: ReactNode;
    /**
     * What the tool made of it: its real output as HTML, inserted unedited.
     * Pass only a committed build artifact of your own tool — the markup is
     * trusted, never user input.
     */
    output: string;
    /** Names the run: which tools, which versions. */
    outputCaption: ReactNode;
};
/**
 * A tool, run for real: the input on iron, an arrow, and the output as it came
 * out, rendered in the page's own type on a ruled sheet. Proof without a
 * figure. The rendered side repeats the input for the eye only, so it is
 * `inert`: assistive technology reads the input once and does not meet the
 * sample's headings as page headings. Stacks below 54rem.
 */
export declare function RunSample({ input, inputCaption, output, outputCaption }: RunSampleProps): import("react").JSX.Element;
