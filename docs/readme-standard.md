# README standard for Ferramenta tools

This is the README contract for Ferramenta tool repositories. It
keeps each project free to explain its own implementation while giving readers
the same route through the project: identify the tool, understand why it
exists, install it, verify its claims, and find the deeper documentation.

## Names and copy

Use the tool's capitalized name in prose: Ferroni, Ferrocat, and Palamedes.
Keep the canonical lowercase name in code, data, URLs, package names, and
crate names. This applies at the start of a sentence too; casing a wordmark
with CSS does not change the spelling in source text.

Describe an engine with the successor register in
[ADR-0004](adr/0004-successor-copy-register.md): honor the established
original, state what the Ferramenta tool succeeds, then explain why the
successor exists. Keep the overview readable and put API details in the
project documentation. Every claim needs evidence that a reader can inspect;
do not use stars, testimonials, or invented social proof.

## Canonical tagline

The line immediately below the README H1 is the tool's one sentence tagline.
Copy the `job` value for that tool from the family registry
([`packages/family/src/family.ts`](../packages/family/src/family.ts)) exactly,
including punctuation. That registry sentence is the canonical wording: use
the same sentence in the README, the Cargo or npm description, and the
registry's `job` field. Do not add a speed, compatibility, test, or other claim
to the tagline. For example, Ferroni's tagline is the registry job
`Oniguruma-compatible regex engine`.

The tagline is the job description, not the successor explanation. Put the
original, succession, and reason in the `What and why` section below.

## Badge row

Put one compact badge row directly below the tagline. Each badge links to the
page that proves what it reports. Use only badges that apply to the repository:

- registry version for crates.io and/or npm;
- documentation on docs.rs when the crate publishes there;
- the repository's CI workflow;
- the project license;
- the supported MSRV, linked to the repository's MSRV policy; and
- coverage only when a maintained coverage measurement exists, linked to its
  report or workflow artifact.

Do not publish static badges for test totals, compatibility percentages, or
the share of unsafe code. Put those facts in `Evidence` with a direct link to
the test suite, compatibility oracle, audit, or measurement that produced
them. A badge is a pointer to current evidence, not a second source of truth.

## Suggested README order

Repositories may keep their own depth and examples. Use this sequence for the
shared sections; only the generated family block and standards footer are
required shared sections, and they stay at the end in this order:

1. H1 with the capitalized tool name.
2. The exact canonical registry `job` tagline.
3. The evidence badge row.
4. A `What and why` explanation using the successor register.
5. Installation instructions with supported package managers and prerequisites.
6. A quick start with the smallest useful working example.
7. Evidence covering status, compatibility, and benchmarks where they
   exist, with links to the underlying evidence.
8. Documentation links for API references, guides, examples, and hosted docs.
9. Contributing, security, and license information (combine or split these
   sections according to the repository's needs).
10. The generated Ferramenta family block.
11. The standards-owned company footer.

Keep the family block and company footer at the end of a tool README so project
content remains easy to scan. The Ferramenta overview README is a family hub
with its own approved layout and may keep its generated block in that layout;
this skeleton applies to the tool READMEs that siblings adopt.

## Native mdtheme consumers

Native consumers use the [Git theme](../packages/family/README.md#native-markdown-theme)
instead of the marker updater below. The generated footer has the same catalog
ownership, visible descriptions, and current-project exclusion. The compact
family affiliation precedes the project content; the icon and related links
remain in the footer. Do not retain a second family block in `README.md.src`.

## Generated family block

Every family README includes the block between these markers:

```md
<!-- ferramenta-family:start -->
<!-- ferramenta-family:end -->
```

Generate it with the `ferramenta-readme` binary and the current tool name:

```sh
ferramenta-readme --current ferrocat --write README.md
ferramenta-readme --current ferrocat --check README.md
```

The package README describes the [generator and its Git-based installation](../packages/family/README.md#the-readme-family-block).
This repository also exposes `pnpm readme:write` and `pnpm readme:check`
wrappers for its own root README. The generator supplies the family tagline,
member jobs, groups, and links. Never hand-edit content inside the markers,
copy a table from another repository, or change a tool's job in a README.
Change [`family.ts`](../packages/family/src/family.ts) when the fact itself
changes, then regenerate the block in every affected repository.

For tool READMEs, the generated block must be immediately before the standards
footer. If the footer has the standards separator, the family block comes
before that separator as well:

```md
<!-- ferramenta-family:start -->

…generated content…
<!-- ferramenta-family:end -->

---

<!-- sebastian-software-branding:start -->

…standards-owned footer…
<!-- sebastian-software-branding:end -->
```

The company badge wording, badge color, logo host, and footer link set are
owned by the organization standards repository under
[standards#63](https://github.com/sebastian-software/standards/issues/63).
This document defines the family block and its position; it does not duplicate
or override those company-wide decisions. Let the standards tooling maintain
the `sebastian-software-branding` markers.

## Review checklist

Before opening a README change, check that:

- the name and tagline follow the casing and registry rules;
- every badge points to live evidence and no static claim badge remains;
- the successor explanation is present;
- status, compatibility, and benchmark statements have evidence links;
- install and quick start work for the supported runtime;
- `ferramenta-readme --current <name> --check README.md` passes; and
- the family block is above the standards-owned footer.
