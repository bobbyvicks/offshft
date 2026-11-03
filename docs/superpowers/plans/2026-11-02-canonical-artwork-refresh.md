# Canonical Artwork Refresh Implementation Plan

**Goal:** Replace stale/adapted catalogue art with the owner's canonical logo, clock and phrase masters in actual production, supplier pictures and design pickers.

**Architecture:** Retain product, variant, media and navigation identities. Capture fresh store/supplier baselines; map every production role to an exact immutable master; wrap unchanged SVG contents in the existing supplier field at true size; rasterize only for supplier-required PNG upload. Replace existing Shopify media in place and patch current theme artwork references.

**Tech Stack:** Python official Printful API client, SVG/Sharp rasterization, native Shopify controls via CUA, GitHub immutable artwork publication.

**Spec:** Owner's product-by-product correction and `designs/drop-1` AGENTS.md / BRAND.md / brand README at 9318d12727e27c604ad6a7979219467b30688664.

## Global constraints

- Only brand/logo, brand/clock, same-build size masters and designs/NN-name phrase SVGs. No path redraws, thickening, condensation or retyping existing artwork.
- Owner approved flat embroidery wherever unchanged masters do not support puff. Preserve supplier thread palettes and physical source dimensions; obey supplied seam offsets.
- Preserve design-only names, all bases/options, prices, IDs, image associations, transparent pictures and the tan site canvas.
- No orders, fees, billing/settings changes or new account access. Existing scoped setup credential only.
- For a Reason canonical master is absent; owner choice pending while other work continues.

## Tasks

- [x] Capture exact current canonical branch assets and rules; confirm supplier puff requirements and obtain finish decision.
- [ ] Capture fresh 47-product public and Printful baselines; back up both live theme artwork JSON assets.
- [ ] Build complete per-context source map, including nine newer golf designs and printed back logos. Inspect source/proof geometry and preserve all untouched artwork.
- [ ] Verify unchanged source paths, physical size, placement, palette, true field bounds and canonical provenance; generate comparison proofs.
- [ ] Publish immutable production sources and process supplier files. Apply guarded, resumable variant changes, resending original thread options explicitly.
- [ ] Generate exact supplier previews, verify transparency, then replace existing Shopify files without breaking gallery bindings.
- [ ] Patch picker artwork and contextual overrides to use the exact canonical masters. Correct description sizes/finish where required.
- [ ] Fresh independent readback of all variants and public pictures; verify live product option changes, canonical artwork and unchanged prices/navigation.
- [ ] Save scoped evidence and draft PR; clearly distinguish digital setup from physical sample/digitizer approval.
