# ADR-0011: Shared native npm tooling with independent engine distributions

- Status: accepted
- Date: 2026-10-27

## Context

Ferromark and Ferriki maintain overlapping native Node.js build, loader,
platform-package and publication logic. Ferrigura already has a reusable Rust
engine and N-API binding but needs an independently installable npm product.

## Decision

Ferramenta owns `packages/native` (`ferramenta-native`) as a separate development
package. It owns one target table, standalone runtime generation, napi-rs build
arguments, platform manifests, packed-consumer checks and npm release recovery.
It has no dependency on the family website package or any engine.

Each product keeps its public API, native binding, assets, licenses, functional
tests, release version and registry permissions. Product-specific preparation
runs around the same build driver. Generated runtime copies ship with each
facade; consumers need no tooling dependency. Engine instances are not shared
between independently compiled addons. Applications compose their Node APIs.

The tooling is versioned independently of `ferramenta-family`. The initial
reviewable rollout uses identical packed development dependencies in the three
repositories until the first registry version is published. The package README
owns the bootstrap removal procedure. No release is published as part of code
generation or installation.

## Consequences

Platform packaging has one maintained implementation while engines retain
independent installation and release schedules. Updates are adopted explicitly.
Native-to-JavaScript callback costs and JSX integration are separate from this
packaging decision; this change makes no performance claim.
