/** Asset identities; application brands remain on their own visual systems. */
export const FERRA_PRODUCTS = [
    "ferramenta",
    "ferroni",
    "ferriki",
    "ferromark",
    "ferrolex",
    "ferrocat",
    "ferralk",
    "ferrugo",
    "ferrolink",
    "ferrigura",
];
export function isFerraProduct(value) {
    return FERRA_PRODUCTS.some((product) => product === value);
}
