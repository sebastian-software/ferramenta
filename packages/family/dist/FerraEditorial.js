import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { displayName, relationsOf, toolHref, } from "./family.js";
import { FerraAction, FerraInstrument } from "./FerraComponents.js";
import { isFerraProduct } from "./FerraIdentity.js";
import { Mark } from "./Mark.js";
import { useToolFacts } from "./RegistryFacts.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** A light reading surface. The host can set --ferra-card-padding for a margin note. */
export function FerraSoftCard({ as: Element = "div", className, ...props }) {
    return _jsx(Element, { ...props, className: classes("ferra-soft-card", className) });
}
/** A contents column and a reading flow, within the host's existing main landmark. */
export function FerraEditorial({ navigation, children, className, ...props }) {
    return (_jsxs("div", { ...props, className: classes("ferra-editorial ferra-wrap", className), children: [_jsx("div", { className: "ferra-editorial-navigation", children: navigation }), _jsx("div", { className: "ferra-editorial-body", children: children })] }));
}
/** Source order keeps the article followed by the notes that explain it. */
export function FerraEditorialRow({ notes, children, className, ...props }) {
    return (_jsxs("div", { ...props, className: classes("ferra-editorial-row", className), children: [children, notes !== undefined && notes !== null && (_jsx("div", { className: "ferra-editorial-notes", children: notes }))] }));
}
export function FerraNote({ title, source, children, className, ...props }) {
    const id = useId();
    return (_jsxs(FerraSoftCard, { ...props, as: "aside", className: classes("ferra-note", className), "aria-labelledby": id, children: [_jsx("h3", { id: id, children: title }), _jsx("div", { className: "ferra-note-copy", children: children }), source && (_jsxs("a", { className: "ferra-note-source", href: source.href, children: [source.label, " ", _jsx(Mark, { name: "arrow", size: 16 })] }))] }));
}
/** Several related aspects share one complementary surface beside their article. */
export function FerraNotes({ label, notes, className, ...props }) {
    const id = useId();
    return (_jsx(FerraSoftCard, { ...props, as: "aside", className: classes("ferra-notes", className), "aria-label": label, children: notes.map((note, index) => (_jsxs("section", { className: "ferra-note-section", "aria-labelledby": `${id}-${index}`, children: [_jsx("h3", { id: `${id}-${index}`, children: note.title }), _jsx("p", { className: "ferra-note-copy", children: note.body }), _jsxs("a", { className: "ferra-note-source", href: note.href, children: ["Read the source ", _jsx(Mark, { name: "arrow", size: 16 })] })] }, note.title))) }));
}
export function FerraReleaseFacts({ tool }) {
    const facts = useToolFacts(tool);
    return (_jsxs("dl", { className: "ferra-release-facts", "aria-label": `${displayName(tool)} registry facts`, children: [_jsxs("div", { children: [_jsxs("dt", { children: [_jsx(Mark, { name: "package", size: 20 }), "Version"] }), _jsx("dd", { children: facts.version })] }), facts.onCrates && (_jsxs("div", { children: [_jsxs("dt", { children: [_jsx(Mark, { name: "crate", size: 20 }), _jsx("span", { className: "ferra-visually-hidden", children: "Crates.io total downloads" })] }), _jsxs("dd", { children: [_jsx("b", { children: new Intl.NumberFormat("en-US").format(facts.crateDownloads) }), " ", _jsx("span", { "aria-hidden": "true", children: "crates.io downloads" })] })] }))] }));
}
/** Image, name, role and prose stay together; all tool facts belong to the registry. */
export function FerraEngineArticle({ tool, href = toolHref(tool), art }) {
    const name = displayName(tool);
    return (_jsxs(FerraSoftCard, { as: "article", className: "ferra-engine-article", id: tool.name, "aria-labelledby": `${tool.name}-title`, tabIndex: -1, children: [_jsxs("div", { className: "ferra-engine-content", children: [_jsx("div", { className: "ferra-engine-art", children: _jsx(EngineArtwork, { tool: tool, art: art }) }), _jsx("h2", { id: `${tool.name}-title`, children: name }), _jsx("p", { className: "ferra-article-subtitle", children: tool.editorial?.subtitle ?? tool.what }), _jsx("p", { className: "ferra-article-introduction", children: tool.editorial?.introduction ?? tool.does }), _jsxs(FerraAction, { href: href, children: ["Explore ", name, tool.docs === undefined && _jsx("span", { className: "ferra-visually-hidden", children: " on GitHub" }), _jsx(Mark, { name: "arrow", size: 20 })] })] }), _jsxs("footer", { className: "ferra-engine-meta", children: [_jsx(FerraReleaseFacts, { tool: tool }), _jsx(EngineRelations, { tool: tool })] })] }));
}
function EngineArtwork({ tool, art }) {
    if (art !== undefined)
        return art;
    if (!isFerraProduct(tool.name))
        throw new Error(`Missing ferra identity: ${tool.name}`);
    return _jsx(FerraInstrument, { product: tool.name });
}
function EngineRelations({ tool }) {
    const relations = relationsOf(tool);
    return relations.length > 0 ? (_jsx("ul", { className: "ferra-article-relations", children: relations.map((relation) => (_jsxs("li", { children: [relation.kind === "pairs-with"
                    ? "Pairs with "
                    : relation.kind === "runs-on"
                        ? "Runs on "
                        : "Used by ", _jsx("a", { href: toolHref(relation.tool), children: displayName(relation.tool) }), "."] }, `${relation.kind}-${relation.tool.name}`))) })) : null;
}
