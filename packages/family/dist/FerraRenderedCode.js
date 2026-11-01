import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Trusted build-time highlighter output. Never pass visitor-supplied HTML. */
export function FerraRenderedCode({ caption, html, children, className, ...props }) {
    const output = html?.replaceAll(/<pre\b[^>]*>/g, (tag) => /\btabindex=/i.test(tag) ? tag : tag.replace("<pre", '<pre tabindex="0"'));
    return (_jsxs("figure", { ...props, className: ["ferra-rendered-code", className].filter(Boolean).join(" "), children: [_jsx("figcaption", { children: caption }), output === undefined ? (_jsx("div", { className: "ferra-rendered-code-content", children: children })) : (_jsx("div", { className: "ferra-rendered-code-content", dangerouslySetInnerHTML: { __html: output } }))] }));
}
export function FerraCodePair({ className, ...props }) {
    return _jsx("div", { ...props, className: ["ferra-code-pair", className].filter(Boolean).join(" ") });
}
