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
- Owner approved the new two-line For a Reason master in Unbounded Bold.

## Tasks

- [x] Capture exact current canonical branch assets and rules; confirm supplier puff requirements and obtain finish decision.
- [x] Capture fresh 47-product public and Printful baselines; back up both live theme artwork JSON assets.
- [x] Build complete per-context source map, including nine newer golf designs and printed back logos. Inspect source/proof geometry and preserve all untouched artwork.
- [x] Verify unchanged source paths, physical size, placement, palette, true field bounds and canonical provenance; generate comparison proofs.
- [ ] Publish immutable production sources and process supplier files. Apply guarded, resumable variant changes, resending original thread options explicitly.
- [x] Generate exact supplier previews, verify transparency, then replace existing Shopify files without breaking gallery bindings.
- [x] Patch picker artwork and contextual overrides to use the exact canonical masters. Correct description sizes/finish where required.
- [x] Replace the old homepage hero with corrected supplier photos; owner chose this composition. Verify desktop and phone layouts and the regular E in the headline.
- [ ] Fresh independent readback of all variants and public pictures; verify live product option changes, canonical artwork and unchanged prices/navigation.
- [ ] Save scoped evidence and draft PR; clearly distinguish digital setup from physical sample/digitizer approval.

Prepared: 65 production canvases / 823 affected variants / 37 listings.
Public verification passed: all 335 images transparent, 279 supplier-exact
replacements, all 1,153 variants and all media identities/order preserved.
Independent headwear read-back passed for all 81 variants across 14 listings.
Full clothing production rollout remains in progress.
