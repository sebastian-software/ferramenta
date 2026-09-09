# Contributing

Thanks for helping improve Ferramenta. This repository contains the
`ferramenta.dev` family site and the shared `ferramenta-family` package.

## Start here

- Read [AGENTS.md](AGENTS.md) for the repository map, commands, and local
  constraints.
- Read [docs/readme-standard.md](docs/readme-standard.md) for the README
  contract shared by Ferramenta tools.
- Read [docs/adr/](docs/adr/README.md) before changing an established
  direction; ADRs record the decisions and their rationale.
- For security reports, follow [SECURITY.md](SECURITY.md). General support is
  covered in [SUPPORT.md](SUPPORT.md).

## Setup and checks

Use the package manager and version declared in `package.json`:

```sh
pnpm install
node -p "require('./package.json').packageManager"
```

Before pushing, run the same repository checks used by CI:

```sh
pnpm agent:check
pnpm verify:package
pnpm exec standards check
```

`pnpm agent:check` covers lint, formatting, typechecking, the site build and
tests. `pnpm verify:package` checks both the packed npm package and the files a
Git consumer receives. `standards check` guards the repository's standards
stamp and managed files.

## Changes and generated files

Use conventional commit messages. Tool facts come from
[`packages/family/src/family.ts`](packages/family/src/family.ts); do not
hardcode them in components or README tables.

The family README block is generated. Run `pnpm readme:write` when registry
facts change and keep the generated block between its markers. The shared
package output in `packages/family/dist/` is committed for Git consumers; run
`pnpm build:package` after changing its sources and include the resulting
output in the same change. Do not hand-edit generated output.

Open a pull request using the repository template. Explain what changed and
why, link the relevant issue, and include the validation commands you ran.
