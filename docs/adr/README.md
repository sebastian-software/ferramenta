# Decision Records

Durable decisions with their rationale. ADRs are living documents: update the
relevant record and its Updated date when an agreed contract changes. Git
history preserves previous decisions; historical superseded records remain
available for context.
Read these as constraints before changing direction; implementation values live
in [DESIGN.md](../../DESIGN.md), [PRODUCT.md](../../PRODUCT.md), and the code.

| ADR                                                                | Decision                                                               | Status                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------- |
| [0001](0001-decentralized-homepages-with-shared-family-package.md) | Decentralized project homepages, one shared family package             | accepted, amended 2026-09-06 |
| [0002](0002-streamline-derived-project-marks.md)                   | Project marks derived from Streamline icons, under license constraints | accepted                     |
| [0003](0003-design-direction-schmiede.md)                          | Design direction "Schmiede" with a bounded material layer              | superseded by 0005           |
| [0004](0004-successor-copy-register.md)                            | The successor register for family copy                                 | accepted                     |
| [0005](0005-functional-hardware-material-boundary.md)              | Extend "Schmiede" with functional chassis and fasteners                | accepted                     |
| [0006](0006-registry-facts-at-build-time.md)                       | Registry facts fetched at build time, not badges                       | accepted                     |
| [0007](0007-committed-package-build-output-for-git-consumers.md)   | The family package ships its build output in Git                       | accepted                     |

**Who is in the family.** A member is a family engine, or a product built on
family engines. Tools from the same workshop that share neither belong to the
company line, not to this registry — see the
[ADR-0001 amendment of 2026-09-06](0001-decentralized-homepages-with-shared-family-package.md#amendment-2026-09-06).

Earlier implementation specs (a different artifact: task-scoped designs, not
durable decisions) live in [docs/superpowers/specs/](../superpowers/specs/).
