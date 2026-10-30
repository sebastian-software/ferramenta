import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { family } from "./family.js";
import type { FerraProduct } from "./FerraIdentity.js";

export type FerraMarkProps = {
  product: FerraProduct;
  /** The icon is decorative beside its name; supply a label when it stands alone. */
  label?: string;
  size?: 128 | 32 | 48 | 64;
  className?: string;
};

export type FerraLogoProps = {
  product?: FerraProduct;
  /** Wordmark-only chrome for an editorial page. */
  mark?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "children">;

export type FerraInstrumentProps = {
  product: FerraProduct;
  label?: string;
  className?: string;
};

export type FerraHeaderProps = {
  product?: FerraProduct;
  mark?: boolean;
  home: string;
  nav?: ReactNode;
  navLabel?: string;
  /** Host-owned search and mobile navigation controls. */
  actions?: ReactNode;
};

export type FerraFooterProps = {
  product?: FerraProduct;
  home: string;
  children?: ReactNode;
};

export type FerraHeroProps = {
  product: FerraProduct;
  title?: ReactNode;
  what?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  /** Use a worked example or another meaningful composition in place of the instrument. */
  art?: ReactNode;
};

export type FerraSectionProps = {
  title: ReactNode;
  label: string;
  intro: ReactNode;
  surface?: "paper" | "pewter" | "plain";
} & Omit<ComponentPropsWithoutRef<"section">, "title">;

export type FerraActionProps = {
  href: string;
  variant?: "primary" | "secondary";
} & ComponentPropsWithoutRef<"a">;

export type FerraEngineCatalogProps = {
  /** Override only navigation, for example to local previews; registry facts remain authoritative. */
  hrefFor?: (tool: (typeof family)[number]) => string;
};

export type FerraTableProps = {
  caption: string;
  children: ReactNode;
};

export type FerraCodeProps = {
  caption: string;
  file?: string;
  children: ReactNode;
};

export type FerraBar = {
  id: string;
  label: ReactNode;
  value: number;
  displayValue: string;
  highlight?: boolean;
};

export type FerraBarsProps = {
  caption: string;
  items: readonly FerraBar[];
  children?: ReactNode;
};
