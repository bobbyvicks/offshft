# Hat design selector fix — 2 November 2026

Live theme 195237347650, `assets/offshft-design-browser.js`.

The native picker renders a single-valued Size option as text, omitting it from `getAllSelectedOptions()`. The design navigator expected every native option to be returned, so all sibling links were disabled on For a Reason. Hats. Recover an omitted option only when every source variant has the same value for that option. Never infer a missing multi-valued selection or replace an explicitly invalid selection.

`before.js` is the fresh native editor backup; `after.js` is the exact saved and reloaded server copy. This supersedes the navigation script in `../golf-club-expansion/theme-after/`; retain that release's other assets and navigation data. `patch.py` reproduces the minimal change. No products, artwork, prices, supplier mappings, or order settings changed.

Verification: five focused runtime tests pass; the five existing golf catalogue tests also pass. Native theme editor has no error in the changed JavaScript (an unrelated existing Liquid unused-assignment warning remains). Live browser checks confirmed seven enabled designs on Charcoal and Evergreen, actual navigation to OFF SHFT and back with Retro Trucker/Evergreen preserved, and colour updates in place. Ivory remains the distinct supplier cap 1678 with only For a Reason configured; do not link its designs to trucker cap 252. Sun's Still Up is not configured on the trucker and remains disabled.

The first public reload preceded Shopify's asset update. A later reload loaded new asset hash `17121006590791383142`, after which links passed. `live-selector.png` records the final public selector. No cart or checkout operation was performed.

Run `node --test store/hat-design-selector-fix/selector.test.cjs`.
