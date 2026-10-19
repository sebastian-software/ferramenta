import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { EditorialProduct } from "./EditorialIdentity.js";
import type { family } from "./family.js";

export type EditorialMarkProps = {
  product: EditorialProduct;
  /** The icon is decorative beside its name; supply a label when it stands alone. */
  label?: string;
  size?: 128 | 32 | 48 | 64;
  className?: string;
};

export type EditorialLogoProps = {
  product?: EditorialProduct;
} & Omit<ComponentPropsWithoutRef<"a">, "children">;

export type EditorialInstrumentProps = {
  product: EditorialProduct;
  label?: string;
  className?: string;
};

export type EditorialHeaderProps = {
  product?: EditorialProduct;
  home: string;
  nav?: ReactNode;
  navLabel?: string;
};

export type EditorialFooterProps = {
  product?: EditorialProduct;
  home: string;
  children?: ReactNode;
};

export type EditorialHeroProps = {
  product: EditorialProduct;
  title?: ReactNode;
  what?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  /** Use a worked example or another meaningful composition in place of the instrument. */
  art?: ReactNode;
};

export type EditorialSectionProps = {
  title: ReactNode;
  label: string;
  intro: ReactNode;
  surface?: "paper" | "pewter" | "plain";
} & Omit<ComponentPropsWithoutRef<"section">, "title">;

export type EditorialActionProps = {
  href: string;
  variant?: "primary" | "secondary";
} & ComponentPropsWithoutRef<"a">;

export type EditorialEngineCatalogProps = {
  /** Override only navigation, for example to local previews; registry facts remain authoritative. */
  hrefFor?: (tool: (typeof family)[number]) => string;
};

export type EditorialTableProps = {
  caption: string;
  children: ReactNode;
};

export type EditorialCodeProps = {
  caption: string;
  file?: string;
  children: ReactNode;
};

export type EditorialBar = {
  id: string;
  label: ReactNode;
  value: number;
  displayValue: string;
  highlight?: boolean;
};

export type EditorialBarsProps = {
  caption: string;
  items: readonly EditorialBar[];
  children?: ReactNode;
};
