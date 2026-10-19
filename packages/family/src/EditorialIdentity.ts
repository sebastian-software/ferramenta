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
] as const;
export type EditorialProduct = (typeof EDITORIAL_PRODUCTS)[number];

export function isEditorialProduct(value: string): value is EditorialProduct {
  return EDITORIAL_PRODUCTS.some((product) => product === value);
}
