/**
 * The members with a rendered identity: a compact mark and a hero instrument,
 * shipped under `ferra/` and placed by `ferra-assets.css`. The applications
 * keep their own brands and are not listed.
 */
export const IDENTITIES = [
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
    "ferrixel",
];
export function hasIdentity(value) {
    return IDENTITIES.some((identity) => identity === value);
}
