# Pre-publication QA

Reviewed 29 October 2026. Read-only comparison of `listing-plan.json`, the approved colourways manifest, local artwork/media, the saved Shopify export and the fresh supplier evidence in this folder. No Shopify, supplier, UI or Git changes were made.

Reviewed plan SHA-256: `829de7e6a064b998da389d48bc53d9a2db3459dc030bb808c6c25a90e4966618`.

**Result: plan/media/price mapping passes for the proposed coming-soon publication. This is not fulfilment or ready-to-sell clearance.** The plan itself does not set inventory controls or coming-soon messaging; those must be applied and verified by the publishing operation.

## Verified counts and prices

| Product | Colours | Unique variants | Sizes | Price (CAD) | Existing price evidence |
| --- | ---: | ---: | --- | ---: | --- |
| Time Well Earned. T-Shirt | 4 | 24 | S-3XL | 44.99 | 24 saved Heavyweight tee variants across 2 products |
| The Rest Is Ours. Hoodie | 4 | 24 | S-3XL | 89.99 | 36 saved Lightweight hoodie variants across 3 products |
| Ours to Spend. Trucker Hat | 4 | 4 | One size | 34.99 | 6 saved Retro Trucker variants across 3 products |
| 5:00 Crewneck | 4 | 24 | S-3XL | 79.99 | 36 saved crewneck variants across 3 products |
| **Total** | **16** | **76** | | | |

- Every intended Size/Colour combination exists exactly once within its product. Four handles are distinct; there is no Style option.
- Every variant price equals its product proposal. All 11 price-reference product IDs, example variant IDs, style filters, counts and prices agree with `shopify-final-export.json`, exported at `2026-10-29T05:21:45.307Z`.
- CAD is the repository's pricing convention. The saved export does not independently carry shop currency. Matching retail prices does not verify production cost or margin, particularly for the hoodie's two decoration applications.
- All seven source hashes recorded in the listing plan still match the saved source files.

## Artwork and media

- All 16 image paths exist and resolve to the approved manifest's exact original-v2 or colourway PNG. All 76 variant-image assignments point to the correct product colour. No wrong filename, colour substitution or missing source was found.
- All main SVG paths exist and match the manifest's exact artwork variant. All 16 alt descriptions name the correct product and colour. Hoodie alt descriptions correctly state **back view**; their em dash is valid punctuation, not an encoding defect.
- Hoodie specification retains the **240 mm upper-back print plus approximately 63 mm canonical left-chest embroidered logo**. Blue Jean, Ivory and Butter select `logo-light.svg` with Ink/Rust; Pepper selects `logo-dark.svg` with Bone/Sun. Both logo files exist and contain the expected fills. The selected mockups show only the back, so they do not visually prove the front application.
- Caramel cap and Espresso crewneck select the dedicated one-colour SVGs. Each contains only `#ECE5D3` (Bone), including punctuation. The previously reviewed images agree.
- The prior visual review remains applicable: wording and garment views pass, while synthetic grain is most visible in 12 Pepper, then 14 Pepper, 14 Blue Jean and 11 Blue Jean. These are AI concept images, not photographs of manufactured samples. `designs/next-round-colourways/qa-review.md` records the detail.

## Supplier evidence and publication boundary

All 76 planned combinations have exactly matching rows in `supplier-selected-availability.json` with positive stock/fulfilment flags and no discontinued/disabled flag, checked at `2026-10-29T11:45:38.653Z`. Supplier tee 4XL rows are correctly excluded from this S-3XL launch. Public catalogue stock does not establish a store sync or destination-specific orderability.

The raw `supplier-placement-evidence.json` supports these unresolved application details from `supplier-check.md`:

- The 95 mm tee artwork fits the 101.6 mm Centered embroidery field; the 85 mm cap artwork fits its 149.9 mm front field.
- The 115 mm crewneck artwork requires **Large Front embroidery** (254 x 152.4 mm). It does not fit the ordinary 101.6 mm Centered field. Preserve the approved width.
- Hoodie back DTG and left-chest embroidery exist separately, but the exact joint configuration is unverified. Large Back explicitly starts at **M**, and the public regular-back template evidence is ambiguous for **S**. Those are unresolved supplier setup checks, not a reason to silently change the approved design.
- Thread mapping, digitization acceptance and combined hoodie cost remain unverified.

For the stated coming-soon release, the publishing operation should apply clear unavailable/coming-soon wording and identify the images as design mockups. It must verify tracked inventory at zero, deny overselling and confirm the public page cannot add a purchasable variant to cart. Zero quantity alone is insufficient evidence: the saved existing export contains untracked items. Do not treat creation/publication as Printful fulfilment sync. No live storefront or inventory state was inspected in this review.
