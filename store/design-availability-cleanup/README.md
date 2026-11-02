# Hide unsupported design choices — 2 November 2026

The owner requested hiding designs that are not offered for the selected garment style and size, rather than showing disabled tiles with a warning. This is the latest live `assets/offshft-design-browser.js` for theme 195237347650, superseding `../hat-design-selector-fix/after.js`. Retain the golf release's other assets and navigation data.

`before.js` is the fresh native editor backup. `after.js` extends the existing supplier-base and size resolver's confirmed result to control visibility for every product family. The old golf-only base filter is replaced by this general rule. Unsupported tiles receive `hidden` and `display:none`, so they take no space and are absent from keyboard and accessibility navigation. Supported choices are restored when the selected configuration changes. An unconfirmed selection preserves the prior visibility until the native selection completes. Stock alone does not hide an otherwise supported design.

No products, prices, media, production artwork, fulfillment mappings, or order settings changed. The preceding singleton Size fix is retained.

Five runtime regressions pass, including all hoodie source variants against their sibling styles/sizes, the four compatible golf designs, hat changes from seven trucker designs to the single Ivory-cap design and back, pending selections, and configured sold-out designs. Live browser checks confirmed seven visible enabled choices on Charcoal/Evergreen with Sun's Still Up completely hidden, Ivory showing only For a Reason, and the seven choices returning after selecting Evergreen. `live-clean-selector.png` shows the final state. The native editor's pasted source was checked byte-equivalent before saving.

Run `node --check store/design-availability-cleanup/after.js` and `node --test store/design-availability-cleanup/visibility.test.cjs`.
