import { type ComponentPropsWithoutRef, useEffect, useId, useState } from "react";

import type { FerraProduct } from "./FerraIdentity.js";

import { FerraMark } from "./FerraComponents.js";
import { Mark } from "./Mark.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

export type FerraContentsItem = {
  href: string;
  label: string;
  description: string;
  product?: FerraProduct;
};

export type FerraContentsProps = {
  items: readonly FerraContentsItem[];
  label?: string;
} & Omit<ComponentPropsWithoutRef<"nav">, "children">;

function useCurrentSection(items: readonly FerraContentsItem[]) {
  const [current, setCurrent] = useState(items.find((item) => item.href.startsWith("#"))?.href);

  useEffect(() => {
    const targets = items.flatMap((item) => {
      if (!item.href.startsWith("#")) return [];
      const element = document.getElementById(item.href.slice(1));
      return element === null ? [] : [{ element, href: item.href }];
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const position = globalThis.innerHeight * 0.3;
      let active = targets.at(0);
      let nearest = -Infinity;
      for (const target of targets) {
        const top = target.element.getBoundingClientRect().top;
        if (top <= position && top > nearest) {
          active = target;
          nearest = top;
        }
      }
      if (active !== undefined) setCurrent(active.href);
    };
    const schedule = () => {
      if (frame === 0) frame = globalThis.requestAnimationFrame(update);
    };
    schedule();
    globalThis.addEventListener("scroll", schedule, { passive: true });
    globalThis.addEventListener("resize", schedule);
    globalThis.addEventListener("hashchange", schedule);
    return () => {
      globalThis.cancelAnimationFrame(frame);
      globalThis.removeEventListener("scroll", schedule);
      globalThis.removeEventListener("resize", schedule);
      globalThis.removeEventListener("hashchange", schedule);
    };
  }, [items]);
  return current;
}

/** One ungrouped contents list, disclosed on small screens and scroll-aware on desktop. */
export function FerraContents({
  items,
  label = "Engines",
  className,
  ...props
}: FerraContentsProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const current = useCurrentSection(items);

  return (
    <nav
      {...props}
      className={classes("ferra-contents", className)}
      aria-label={label}
      data-expanded={expanded}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.key === "Escape" && expanded) {
          setExpanded(false);
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        className="ferra-contents-toggle"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <span>Explore the {label.toLowerCase()}</span>
        <Mark name="chev" size={18} />
      </button>
      <ContentsEntries
        id={id}
        items={items}
        current={current}
        onChoose={() => {
          setExpanded(false);
        }}
      />
    </nav>
  );
}

function ContentsEntries({
  id,
  items,
  current,
  onChoose,
}: {
  id: string;
  items: readonly FerraContentsItem[];
  current?: string;
  onChoose: () => void;
}) {
  return (
    <ul className="ferra-contents-list" id={id}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            aria-current={current === item.href ? "location" : undefined}
            onClick={onChoose}
          >
            {item.product !== undefined && <FerraMark product={item.product} size={64} />}
            <span className="ferra-contents-copy">
              <span className="ferra-contents-name">{item.label}</span>
              <span className="ferra-contents-description">{item.description}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
