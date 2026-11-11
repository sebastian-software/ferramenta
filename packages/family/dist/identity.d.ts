/**
 * The members with a rendered identity: a compact mark and a hero instrument,
 * shipped under `ferra/` and placed by `ferra-assets.css`. The applications
 * keep their own brands and are not listed.
 */
export declare const IDENTITIES: readonly ["ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo", "ferrolink", "ferrigura", "ferrixel"];
export type Identity = (typeof IDENTITIES)[number];
export declare function hasIdentity(value: string): value is Identity;
