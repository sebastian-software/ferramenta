# Shared Ardo Config Package Rename

## Context

Ferramenta currently contains an unpublished workspace package named
`@ferramenta/ardo-family`. The package owns the shared Ardo site theme, the
family-site registry, and the `FamilyLinks` navigation component used by the
Ferramenta documentation shell.

The `ardo-family` name describes one visible feature, but not the package
responsibility. The package is the shared Ardo configuration layer for the
`ferro*` project sites.

## Decision

Rename the package to `@ferramenta/ardo-config` before its first npm release.
Rename the workspace directory from `packages/ardo-family` to
`packages/ardo-config` and update every workspace import, script, lockfile
entry, package repository path, README example, and package heading.

Keep the existing public exports unchanged:

- `FamilyLinks` and `FamilyLinksProps`
- `family` and `FAMILY_SITE`
- the `theme.css` subpath export

The rename changes package identity, not runtime behavior or visual output.

## Compatibility

Do not publish an `@ferramenta/ardo-family` compatibility package or alias. The
old name has never been published, and the organization code search has no
external consumers. Carrying an alias would create a migration surface without
helping an existing user.

## Validation

- Install the workspace with the frozen lockfile.
- Build `@ferramenta/ardo-config` directly.
- Build the Ferramenta site against the renamed workspace package.
- Pack the package and verify that the archive contains the compiled module,
  declarations, README, and `theme.css` under the new package identity.
- Search runtime, package, and workspace files for stale `ardo-family` package
  or directory references. This design record and descriptive uses of
  “Ferramenta family” in UI copy may remain.

## Follow-up

Update ferromark Epic #55 and issue #38 to reference
`@ferramenta/ardo-config`. Publishing the package is a separate external state
change and must use the approved npm/OIDC release path; this rename must land
before that first release.
