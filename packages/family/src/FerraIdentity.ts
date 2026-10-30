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
] as const;
export type FerraProduct = (typeof FERRA_PRODUCTS)[number];

export function isFerraProduct(value: string): value is FerraProduct {
  return FERRA_PRODUCTS.some((product) => product === value);
}
