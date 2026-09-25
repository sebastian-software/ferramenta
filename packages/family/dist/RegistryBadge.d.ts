export type RegistryBadgeProps = {
    /** The registry the package lives on. */
    registry: "crates" | "npm";
    /** The package name on that registry. */
    name: string;
    /** Total downloads (crates.io) or downloads per month (npm), or the latest version. */
    metric?: "downloads" | "version";
};
/**
 * A live registry figure as a shields.io badge — current on every page view,
 * with nothing baked into the build that could go stale. It renders a light
 * and a dark image and `landing.css` shows the one for the active theme.
 */
export declare function RegistryBadge({ metric, name, registry }: RegistryBadgeProps): import("react").JSX.Element;
