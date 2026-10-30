# Ferrolink

## A link checker for static builds.

Check page links, asset references and anchors against the HTML your site actually deploys. No server or network requests are needed.

## Check the finished site.

Run Ferrolink after rendering, when every page and asset has its final location. It resolves references across pages and checks fragments against the target document.

```sh
ferrolink check build/client
```

Deployment base paths, redirects and version destinations are part of the check. External URLs are counted but never fetched.

## Keep the boundary clear.

Ferrolink validates references inside a static build. It does not crawl the public web or decide whether an external service is available. A missing target fails the check; a problem running the check is reported separately.

## Use it in your build.

The repository documents the Rust command-line tool, Node.js API and Vite plugin. Read their options and release notes before adding the check to a deployment gate.
