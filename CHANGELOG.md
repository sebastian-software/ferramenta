# Changelog

## [1.0.2](https://github.com/sebastian-software/ferramenta/compare/ferramenta-v1.0.1...ferramenta-v1.0.2) (2026-09-09)


### Bug Fixes

* **stats:** refresh through protected pull requests ([#41](https://github.com/sebastian-software/ferramenta/issues/41)) ([35a8a06](https://github.com/sebastian-software/ferramenta/commit/35a8a06565c2c3b6acdf38393fcdcba5ec7a5e7b))
* **stats:** use reviewed pull request CI ([#47](https://github.com/sebastian-software/ferramenta/issues/47)) ([f2bf606](https://github.com/sebastian-software/ferramenta/commit/f2bf606e70d00dba3cffa819d6a4e9565dfe02ae))

## [1.0.1](https://github.com/sebastian-software/ferramenta/compare/ferramenta-v1.0.0...ferramenta-v1.0.1) (2026-09-07)


### Bug Fixes

* **family:** align ferromark registry tagline ([6cd0e90](https://github.com/sebastian-software/ferramenta/commit/6cd0e90d81a41cfc5f693473a648a7f22e084ed4))
* **family:** keep registry evidence release-stable ([#37](https://github.com/sebastian-software/ferramenta/issues/37)) ([e587388](https://github.com/sebastian-software/ferramenta/commit/e587388c4e61a11fe3c71180a91a55662370358d))

## [1.0.0](https://github.com/sebastian-software/ferramenta/compare/ferramenta-v0.1.0...ferramenta-v1.0.0) (2026-09-07)


### ⚠ BREAKING CHANGES

* **family:** the package is published as `ferramenta-family`, not `@ferramenta/family`. Consumers rename the dependency key and every import specifier: `@ferramenta/family` becomes `ferramenta-family`, `@ferramenta/family/registry` becomes `ferramenta-family/registry`, and `@ferramenta/family/chrome.css`, `/tokens.css`, `/fonts.css`, `/theme.css` and `/fonts/*` follow the same pattern. The Git specifier
* **family:** make @ferramenta/family installable straight from Git ([#29](https://github.com/sebastian-software/ferramenta/issues/29))
* **family:** ship @ferramenta/family with the chrome, marks, tokens and release path ([#28](https://github.com/sebastian-software/ferramenta/issues/28))

### Features

* **family:** export the tool switcher and the slots Ardo docs sites need ([#32](https://github.com/sebastian-software/ferramenta/issues/32)) ([3225743](https://github.com/sebastian-software/ferramenta/commit/3225743e20818805a27e3e1a77cf1726bfb6f939))
* **family:** publish the package as ferramenta-family ([#33](https://github.com/sebastian-software/ferramenta/issues/33)) ([f6de99c](https://github.com/sebastian-software/ferramenta/commit/f6de99cd094d0fabbf0be23a9c0b5c074ff89976))
* **family:** ship @ferramenta/family with the chrome, marks, tokens and release path ([#28](https://github.com/sebastian-software/ferramenta/issues/28)) ([a23b9b2](https://github.com/sebastian-software/ferramenta/commit/a23b9b2207849e06fd962bec47a311a242f84b83))


### Bug Fixes

* **family:** load the registry when the generator runs from node_modules ([#27](https://github.com/sebastian-software/ferramenta/issues/27)) ([d63a0b1](https://github.com/sebastian-software/ferramenta/commit/d63a0b163ef3e5e68cd1c77e5c8871ac72c36b60))
* **family:** make @ferramenta/family installable straight from Git ([#29](https://github.com/sebastian-software/ferramenta/issues/29)) ([5b84af1](https://github.com/sebastian-software/ferramenta/commit/5b84af1676b12b4b45661d5be4a42b11275a72da))
