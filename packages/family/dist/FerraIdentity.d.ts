/** Asset identities; application brands remain on their own visual systems. */
export declare const FERRA_PRODUCTS: readonly ["ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo", "ferrolink", "ferrigura"];
export type FerraProduct = (typeof FERRA_PRODUCTS)[number];
export declare function isFerraProduct(value: string): value is FerraProduct;
