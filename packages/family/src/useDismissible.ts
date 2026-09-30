import { type RefObject, useEffect } from "react";

/** A `<details>` flyout is not modal: it closes on an outside click and on Escape. */
export function useDismissible(ref: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const switcher = ref.current;
      const target = event.target;
      if (switcher?.open && target instanceof Node && !switcher.contains(target)) {
        switcher.removeAttribute("open");
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      const switcher = ref.current;
      if (event.key === "Escape" && switcher?.open) {
        switcher.removeAttribute("open");
        switcher.querySelector<HTMLElement>("summary")?.focus();
      }
    }
    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [ref]);
}
