/**
 * Four slotted steel screws, one per corner of the box they sit in (styled by
 * `.fastener` in `chrome.css`). Only on a surface that is already physically
 * modeled — the pegboard, a machine chassis (ADR-0005): a screw with nothing
 * to fasten is a defect. The host sets `position: relative` and, to move them
 * off the edge, `--fastener-inset`.
 */
export declare function Fasteners(): import("react").JSX.Element;
