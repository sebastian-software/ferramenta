# Monografie comps (2026-11)

The approved direction for engine homepages (ADR-0012), as static HTML at every
width from 320px to 1440px. `ferromark.html` came first; `ferroni.html` tested
whether the system carries a second engine. Open them through a static server
at the repository root, for example `python3 -m http.server`, then
`/design/comp/2026-11/monografie/ferroni.html`.

- `monografie.css` and `monografie.js` are the shared comp system. Their
  production form is the package entry `ferramenta-family/monografie`.
- `ferromark-data.js`, `ferromark-real.js` and `ferroni-real.js` hold real
  output of ferromark 4.0.0 and ferroni 2.8.0 and their published benchmark
  data, captured on 2026-11-07. The engine sites regenerate theirs with their
  own scripts.
- Fonts and surfaces load from `packages/family/ferra/`, the same files the
  package ships.

The rejected directions of both comp rounds are not kept.
