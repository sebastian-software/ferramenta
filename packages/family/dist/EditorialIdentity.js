/** Asset identities; application brands remain on their own visual systems. */
export const EDITORIAL_PRODUCTS = [
    "ferramenta",
    "ferroni",
    "ferriki",
    "ferromark",
    "ferrolex",
    "ferrocat",
    "ferralk",
    "ferrugo",
];
export function isEditorialProduct(value) {
    return EDITORIAL_PRODUCTS.some((product) => product === value);
}
