import { type ReactNode, useEffect, useRef } from "react";

import { Mark } from "./Mark.js";
import { useDismissible } from "./useDismissible.js";

export type SiteMenuProps = {
  /** The trigger's text: what the menu holds, e.g. "Docs". It is the accessible name too. */
  label?: ReactNode;
  /** The links, as the site's own elements (`<a>`, a router's `NavLink`). */
  children: ReactNode;
};

/**
 * A site's own sections as a menu in the bar, for the widths where there is no
 * room to show them: below 64rem, where an Ardo docs layout hides its sidebar
 * and would otherwise leave a phone with no way to the other pages. Put it in
 * `SiteHeader`'s `actions` slot. Above 64rem it is not shown. It needs
 * `MarkDefs` on the page.
 */
export function SiteMenu({ children, label = "Menu" }: SiteMenuProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  useDismissible(menuRef);

  // Client-side navigation keeps the page mounted, so the menu has to close
  // itself when one of its links is taken.
  useEffect(() => {
    const menu = menuRef.current;
    function closeOnLink(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest("a") !== null) {
        menu?.removeAttribute("open");
      }
    }
    menu?.addEventListener("click", closeOnLink);
    return () => {
      menu?.removeEventListener("click", closeOnLink);
    };
  }, []);

  return (
    <details className="site-menu" ref={menuRef}>
      {/* No aria-label: the visible word is the accessible name, so a voice command reaches it. */}
      <summary>
        {label} <Mark name="chev" className="chev icon" size={16} />
      </summary>
      <div className="site-menu-flyout">{children}</div>
    </details>
  );
}
