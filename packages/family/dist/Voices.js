import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Outside voices, verbatim and attributed: what others say about the material
 * the family builds with. Each one names its source and links it, so it is
 * evidence a reader can check, not social proof. A family site never puts
 * words in anyone's mouth about the family itself.
 */
export function Voices({ title, voices }) {
    return (_jsxs("div", { className: "fam-voices", children: [title !== undefined && _jsx("h3", { className: "fam-voices-title", children: title }), _jsx("ul", { className: "fam-voices-list", children: voices.map((voice) => (_jsx("li", { children: _jsxs("blockquote", { cite: voice.href, children: [_jsxs("p", { children: ["\u201C", voice.quote, "\u201D"] }), _jsxs("footer", { children: [_jsx("cite", { children: voice.who }), voice.href === undefined ? (_jsx("span", { children: voice.where })) : (_jsx("a", { href: voice.href, children: voice.where }))] })] }) }, voice.who))) })] }));
}
