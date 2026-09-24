import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SHIELDS = "https://img.shields.io";
/*
 * A badge is an image, so it cannot read the CSS tokens. These are the tokens'
 * sRGB values — label on `--iron`, value on `--rust` in light; label on
 * `--line`, value on `--rust` in dark — and they change with tokens.css.
 */
const PALETTE = {
    light: { label: "241c19", value: "a04224" },
    dark: { label: "362f2b", value: "e17c4c" },
};
const METRIC = {
    crates: { downloads: "crates/d", version: "crates/v", label: "crates.io" },
    npm: { downloads: "npm/dm", version: "npm/v", label: "npm" },
};
/**
 * A live registry figure as a shields.io badge — current on every page view,
 * with nothing baked into the build that could go stale. It renders a light
 * and a dark image and `landing.css` shows the one for the active theme.
 */
export function RegistryBadge({ metric = "downloads", name, registry }) {
    const source = METRIC[registry];
    const url = (tone) => {
        const colors = PALETTE[tone];
        const query = new URLSearchParams({
            style: "flat-square",
            label: source.label,
            labelColor: colors.label,
            color: colors.value,
        });
        return `${SHIELDS}/${source[metric]}/${encodeURIComponent(name)}?${query.toString()}`;
    };
    const alt = `${name} ${metric === "downloads" ? "downloads" : "version"} on ${source.label}, live`;
    return (_jsxs("span", { className: "fam-badge", children: [_jsx("img", { className: "fam-badge-light", src: url("light"), alt: alt, height: 20, loading: "lazy" }), _jsx("img", { className: "fam-badge-dark", src: url("dark"), alt: "", "aria-hidden": "true", height: 20, loading: "lazy" })] }));
}
