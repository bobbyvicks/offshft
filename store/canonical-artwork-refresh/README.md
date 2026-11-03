# Canonical artwork refresh

Owner-authorized correction of the old pointed clock hands and adapted hat
lettering. Canonical source: `designs/drop-1` at
`9318d12727e27c604ad6a7979219467b30688664`.

The owner approved flat embroidery wherever unchanged canonical artwork cannot
meet puff requirements, and a two-line Unbounded Bold master for For a Reason.
The original thread palettes, product identities, options, prices and fulfilment
holds are protected. No orders, digitization purchases or financial settings are
part of this operation.

## Prepared scope

- 65 production canvases, used by 823 variants across 37 listings, including the
  golf-shirt sleeve clocks and printed back logos.
- 81 headwear variants change from puff to flat embroidery.
- 279 existing Shopify image slots retain their identities and associations.
- 27 picker artwork references and 72 displayed size details use canonical data.
- 14 headwear descriptions state the correct flat finish and physical size.
- The header, social and square logos are unchanged.
- The homepage hero uses three corrected supplier photos on desktop and phone.
  Its headline uses the existing Archivo web face, including its regular E.
- Unused old picker artwork is removed; its download drops from 1.94 MB to
  0.67 MB while product and navigation definitions remain unchanged.

`artwork-manifest.json` records each source hash, canvas, physical size and
placement. The SVG paths are copied unchanged; the containing canvas sets
placement. Embroidery masters retain their supplied size. Uniform print scaling
retains the existing printed footprint. Existing single-thread palettes change
colour values only. PNGs are exact platform exports from those vectors.

## Verification and rollout

`verify_artwork.py` checks source hashes, unchanged vector payloads, physical
canvas/DPI, independent raster bounds, transparency and no embroidery scaling.
`test_guards.py` checks protected metadata and thread palettes. Supplier writes
are paced, resumable, and stop on drift. Private receipts remain local.

Some legacy puff configurations clear flat thread colours during the finish
transition. The guard detects only that specific empty-array result, preserves
the production files, and resends the original palette with an options-only
save. Different RGB values or unrelated metadata changes stop the process.

Public-media and live-theme reports pass. All 335 public images have transparent
corners; the 279 replacements match supplier pixels exactly. All 1,153 Shopify
variants retain their options, prices and image associations. The 81 headwear
variants independently pass their supplier read-back. Clothing production
rollout remains in progress, followed by a complete 1,153-variant supplier check.
Mockups do not constitute a sew-out.

To reproduce the artwork in a fresh checkout, run
`python store/canonical-artwork-refresh/restore_build_dependencies.py`, then
`node store/canonical-artwork-refresh/build_artwork.cjs` and
`python store/canonical-artwork-refresh/verify_artwork.py`.
