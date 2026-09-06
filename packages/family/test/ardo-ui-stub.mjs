/**
 * Stands in for `ardo/ui` in the consumer smoke test. The real module is a
 * Vite-only entry — it imports its own CSS and a `virtual:` config — so a bare
 * Node process cannot load it. The theme toggle belongs to Ardo, not to this
 * package; the test only checks that the header gives it its slot.
 */
import { createElement } from "react";

export function ArdoThemeToggle() {
  return createElement("button", { className: "ardo-theme-toggle", type: "button" }, "Theme");
}
