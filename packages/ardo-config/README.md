# @ferramenta/ardo-config

Shared [Ardo](https://github.com/sebastian-software/ardo) configuration for the
[Ferramenta](https://ferramenta.dev) sites: one theme, one project registry,
and cross-site navigation.

> **Status:** consumed via `workspace:*` by ferramenta.dev. npm publishing
> under the `@ferramenta` scope is prepared but pending scope creation.

## Usage in an Ardo site

```sh
pnpm add @ferramenta/ardo-config
```

In `app/root.tsx`:

```tsx
import { FamilyLinks } from "@ferramenta/ardo-config"
import "@ferramenta/ardo-config/theme.css"

// inside the Ardo footer (or anywhere in the chrome):
<ArdoFooter
  copyright="..."
  // ...
>
  <FamilyLinks current="ferriki" />
</ArdoFooter>
```

- `theme.css` applies the family brand (amber/copper) to all Ardo chrome
  via the `--ardo-color-brand*` variables and styles the `FamilyLinks` nav.
- `FamilyLinks` renders links to every family member; pass `current` to
  de-emphasize the site's own entry.
- `family` / `FAMILY_SITE` export the raw data when you need custom layout.
