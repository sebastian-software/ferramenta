import { type PipelineEnd } from "./family.js";
export type PipelineAssemblyProps = {
    /**
     * The pipeline member this site belongs to. Its stage is marked as the one
     * you are on and is not a link; the others link to their sites. Leave it out
     * on the family site.
     */
    current?: string;
    /** What enters the chain. Defaults to the registry's `PIPELINE.input`. */
    input?: PipelineEnd;
    /** What leaves it. Defaults to the registry's `PIPELINE.output`. */
    output?: PipelineEnd;
    /**
     * The sentence a screen reader hears for the whole figure. Defaults to the
     * registry's `PIPELINE.description`; nearby prose stays the full text
     * alternative.
     */
    label?: string;
};
/**
 * The content pipeline as one assembled machine: a chamfered steel chassis on
 * four fasteners, the pipeline members in chain order between an input and an
 * output terminal. Horizontal on wide screens, vertical below 46rem.
 */
export declare function PipelineAssembly({ current, input, label, output, }?: PipelineAssemblyProps): import("react").JSX.Element;
