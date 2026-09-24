# ADR-0006: Registry facts are fetched at build time, not embedded as badges

- Status: accepted
- Date: 2026-08-20
- Amended: 2026-09-09 — protected-branch delivery and CI approval, see
  [Amendment 2026-09-09](#amendment-2026-09-09)
- Amended: 2026-09-24 — facts fetched at every deploy and updated live in the browser, see
  [Amendment 2026-09-24](#amendment-2026-09-24)

## Context

Versions were hand-maintained in the family registry and went stale immediately:
ferralk shipped 0.1.2 and was at 0.5.2 on crates.io a day later, while the site
still advertised the old number. Download counts were missing entirely, although
they are the most concrete adoption signal a young family has (11,002 crates.io
downloads across the published crates at the time of writing). The site is
statically prerendered on GitHub Pages, so there is no server to ask at runtime.

## Decision

Published versions and download counts are fetched from crates.io and npm **at
build time** by `scripts/refresh-registry-stats.mjs`, written to the committed
file `app/data/registry-stats.json`, and baked into the prerendered page. A
nightly GitHub Actions job (`refresh-stats.yml`) re-runs the fetch and commits
only when a number actually moved; that push triggers the normal Pages deploy.

- The registry keeps a `version` field as a **fallback only**, so an offline or
  rate-limited build still renders a plausible page.
- Registry availability is derived, not declared: a crate on crates.io means a
  Rust core, an npm package means a TypeScript/Node adapter. Both are shown as
  icon-plus-label pairs (crate, adapter) in the page's own icon language; a tool
  with neither reads "git only".
- A reserved npm name is not an adapter. The fetch treats a package whose
  description matches `/reserved/i` as a placeholder (ferrugo today).
- Per-tool downloads appear as one more verifiable fact next to the evidence;
  the family total appears once in the closing section.

## Considered options

### Chosen: build-time fetch plus nightly refresh

Keeps the page static and private (no third-party requests for visitors), keeps
the numbers inside the site's own typography, and bounds staleness to one day.

### Rejected: shields.io badges

Zero code, but every visitor would load images from a third party, the badge
look breaks the stamp language the whole page is built on, and an outage would
leave holes in the ledger.

### Rejected: client-side fetch

Always current, but adds layout shift and a loading state to the page's core
credibility signal, fails without JavaScript, and exposes visitors to registry
endpoints.

## Consequences

- Numbers are at most ~24h old; a release is visible the next morning without
  anyone editing the registry.
- The repository gains one bot commit per day _at most_, and only when a number
  changed.
- Evidence strings must not repeat a version — the version is live now, the
  evidence text is not (fixed for ferrocat when this landed).
- Sibling project sites should run the same script rather than importing a
  frozen JSON from the shared package.

## Validation and review triggers

Revisit if the nightly commits become noise, if crates.io rate limits the job,
or when the first sibling site consumes the shared package and needs its own
fetch step.

## Amendment 2026-09-09

The direct push described above stopped working after `main` gained a required
`check` status: the scheduled workflow could create its commit, but branch
protection rejected the push. A workflow-created push would also not start the
Pages deployment, because push events made with `GITHUB_TOKEN` do not start
other workflows.

The nightly job now writes a changed snapshot to the dedicated
`automation/refresh-registry-stats` branch and opens or updates one pull request.
It verifies that the pull request points at the exact pushed commit. GitHub puts
the pull request CI run in an approval-required state because the workflow uses
`GITHUB_TOKEN` to open or update the pull request. This applies to the
`opened`, `synchronize`, and `reopened` pull request events.

A maintainer reviews the generated change and confirms that it contains only
the expected registry stats snapshot, approves the held CI run, waits for the
required `check` to pass, and then reviews and merges the pull request. Merging
it into `main` starts the existing Pages deployment. The process does not
auto-approve or auto-merge the change and does not use a separate token to
bypass GitHub's approval requirement.

The original consequence that numbers are at most about 24 hours old is
superseded. Registry checks still run daily, but publication also waits for the
generated pull request to pass CI and be reviewed and merged.

## Amendment 2026-09-24

Since 2026-09-10 the nightly snapshot pull request waited unmerged, so the page
showed numbers that were weeks old — exactly the staleness this record set out
to remove. Two changes follow.

**Live in the browser.** The client-side fetch rejected above is now the top
layer, as progressive enhancement over the prerendered values: the page renders
the figures its deploy fetched, and after hydration `useLiveRegistry` (family
package) asks the registries for current versions and downloads and swaps them
in, in the page's own typography. The objections no longer hold: there is no
loading state and no layout shift, because the prerendered value is already
there (tabular numerals keep widths steady); without JavaScript the deploy's
value stays; a registry that does not answer changes nothing. All three
endpoints answer cross-origin requests. A page view costs a handful of
requests — one bulk crates.io call (`/crates?ids[]=…`), one bulk npm downloads
call, one npm `latest` per adapter — and only for packages the build verified
as the family's own. Visitors' browsers contact crates.io and npm directly;
that exposes no visitor data beyond an ordinary request and was accepted. The
endpoints are configurable (`RegistryEndpoints`), so a caching mirror can be put
in front later without touching a component. The family-wide total is back,
live-summed. (A shields.io badge variant was tried in between and dropped: the
numbers belong in the page's own layout.)

**No more snapshot pull requests.** A daily pull request that someone has to
review and merge is an invitation to go stale, and it did. The
`refresh-stats.yml` job and its `automation/refresh-registry-stats` branch are
retired. Instead the Pages deploy (`deploy.yml`) runs `pnpm stats:refresh`
right before `pnpm build` and deploys the result without committing it, and the
deploy also runs nightly on a schedule. Versions and registry availability are
therefore at most a day old again, with no bot commit and nothing to merge. A
failed fetch never blocks a deploy: unresolved lookups keep the committed
snapshot's value, and the step itself may fail without failing the job.

`app/data/registry-stats.json` stays committed as the fallback snapshot for
local and CI builds; refresh it by hand with `pnpm stats:refresh` when it
matters. The registry's `version` remains the last resort. This supersedes the
delivery described in the 2026-09-09 amendment.

## References

- [scripts/refresh-registry-stats.mjs](../../scripts/refresh-registry-stats.mjs)
- [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
- [GitHub Actions: `GITHUB_TOKEN` security](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs)
- [ADR-0004](0004-successor-copy-register.md) — only verifiable claims
