/** Asset identities; application brands remain on their own visual systems. */
export declare const EDITORIAL_PRODUCTS: readonly ["ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo"];
export type EditorialProduct = (typeof EDITORIAL_PRODUCTS)[number];
export declare function isEditorialProduct(value: string): value is EditorialProduct;
