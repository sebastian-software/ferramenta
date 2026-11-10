import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { Identity } from "./identity.js";

import { displayName, WORKSHOP } from "./family.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

/** A member's compact mark, decorative beside its name; `ferra-assets.css` places the picture. */
function IdentityMark({ product }: { product: Identity }) {
  return <span className="ferra-mark" data-product={product} aria-hidden="true" />;
}

/** The page ground: one authored light scheme, scoped to its wrapper. */
export function MonoPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("mono", className)} />;
}

export type MonoHeaderProps = {
  product: Identity;
  /** Where the product name leads, usually the homepage. */
  home: string;
  /** The page's main links, each a keyed element; they fold into a menu on narrow screens. */
  links: ReactElement[];
  navLabel?: string;
  /** The current release, shown as an inset tag. */
  release?: string;
  /** Controls that stay visible at every width, such as search. */
  actions?: ReactNode;
  /** The source repository, shown as GitHub's mark at the end of the row at every width. */
  repository?: string;
  /** Where the family link leads; ferramenta.dev by default, `null` on the family site itself. */
  familyHref?: null | string;
};

/** Menu state that closes on Escape, on a click outside or on a link, and when the screen widens. */
function useMenu() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = () => {
      setOpen(false);
    };
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      buttonRef.current?.focus();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (headerRef.current?.contains(target) !== true || target.closest(".mono-menu a")) close();
    };
    const wide = matchMedia("(min-width: 961px)");
    const onWide = () => {
      if (wide.matches) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);
  return { open, setOpen, headerRef, buttonRef };
}

type MenuProps = {
  id: string;
} & Pick<MonoHeaderProps, "familyHref" | "links" | "navLabel" | "release">;

function MonoMenu({ id, links, navLabel, release, familyHref }: MenuProps) {
  return (
    <div className="mono-menu" id={id}>
      <nav aria-label={navLabel}>
        <ul>
          {links.map((link) => (
            <li key={link.key}>{link}</li>
          ))}
        </ul>
      </nav>
      <div className="mono-header-end">
        {release !== undefined && (
          <span className="mono-release" title="Current release">
            v{release}
          </span>
        )}
        {familyHref !== null && familyHref !== undefined && (
          <a className="mono-family" href={familyHref}>
            <IdentityMark product="ferramenta" />
            Ferramenta
          </a>
        )}
      </div>
    </div>
  );
}

/** Controls at the end of the row, visible at every width: search, a menu, GitHub's mark. */
function HeaderActions({ actions, repository }: Pick<MonoHeaderProps, "actions" | "repository">) {
  if ((actions === undefined || actions === null) && repository === undefined) return null;
  return (
    <div className="mono-header-actions">
      {actions}
      {repository !== undefined && (
        <a className="mono-repository" href={repository} aria-label="Source code on GitHub">
          <svg className="icon" width="20" height="20" aria-hidden="true">
            <use href="#i-github" />
          </svg>
        </a>
      )}
    </div>
  );
}

/** The steel navigation bar. Its links fold into a menu below 961px. */
export function MonoHeader({
  product,
  home,
  links,
  navLabel = "Main",
  release,
  actions,
  repository,
  familyHref = "https://ferramenta.dev",
}: MonoHeaderProps) {
  const { open, setOpen, headerRef, buttonRef } = useMenu();
  const menuId = useId();
  return (
    <header className="mono-header" ref={headerRef} data-open={open}>
      <div className="mono-header-in">
        <a className="mono-brand" href={home}>
          <IdentityMark product={product} />
          {displayName(product)}
        </a>
        <button
          ref={buttonRef}
          className="mono-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <i aria-hidden="true" />
          <span className="mono-menu-label">Menu</span>
        </button>
        <MonoMenu
          id={menuId}
          links={links}
          navLabel={navLabel}
          release={release}
          familyHref={familyHref}
        />
        <HeaderActions actions={actions} repository={repository} />
      </div>
    </header>
  );
}

export type MonoFooterProps = {
  product: Identity;
  home: string;
  /** Further links after GitHub, such as crates.io or npm. */
  children?: ReactNode;
};

export function MonoFooter({ product, home, children }: MonoFooterProps) {
  return (
    <footer className="mono-footer">
      <div className="mono-footer-in">
        <IdentityMark product={product} />
        {product === "ferramenta" ? (
          <p>
            <a href={home}>Ferramenta</a>, Rust engines from one workshop
          </p>
        ) : (
          <p>
            <a href={home}>{displayName(product)}</a>, part of{" "}
            <a href="https://ferramenta.dev">Ferramenta</a>
          </p>
        )}
        {children}
        <a href={WORKSHOP.imprint}>Imprint</a>
        <a href={WORKSHOP.privacy}>Privacy</a>
        <p className="mono-footer-copy">
          © {new Date().getFullYear()} {WORKSHOP.company}
        </p>
      </div>
    </footer>
  );
}
