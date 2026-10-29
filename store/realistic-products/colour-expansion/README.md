# OFF SHFT colour collection

Follow-up to the initial 17 product mockups. The owner asked us to check hoodie drawstrings and add more colour designs, then explicitly requested both images and selectable Colour options in Shopify.

## Hoodie construction

- AS Colour 5161 / Oversized: lined hood without drawcords.
- Comfort Colors 1567 / Garment-Dyed: matching flat drawcords.
- Comfort Colors 1467 / Lightweight: natural flat drawcords; the White garment uses white cords.

The existing Oversized main images intentionally have no drawcords. Separate garment images are required for the two Comfort Colors styles.

## Artwork and images

Keep the approved logo artwork, the current Punched Out. design, and the established warm studio image style. Use supplier-listed garment colours, with appropriate contrasting thread colours from the OFF SHFT brand palette. These are AI visual mockups; garment stock, exact fabric colour and embroidery require supplier/sample confirmation.

## Supplier colour matrix

| Garment / style | Colours in this collection |
|---|---|
| Oversized hoodie / AS Colour 5161 | Bone, Pine Green |
| Garment-Dyed hoodie / Comfort Colors 1567 | White, Blue Spruce |
| Lightweight hoodie / Comfort Colors 1467 | Ivory, Blue Jean |
| Retro Trucker / Yupoong 6606 | Black, Evergreen |
| 5-Panel / Otto 31-069 | Black |
| Dad Hat / Yupoong 6245CM | Black |
| Rope Cap / Big Accessories BA671 | Black/White |
| Crewneck / Comfort Colors 1466 | Ivory, Blue Jean |
| Sweatpants / Comfort Colors 1469 | Pepper, Espresso |
| Heavyweight T-shirt / Comfort Colors 1717 | Ivory, Blue Spruce |
| Pocket T-shirt / Comfort Colors 6030 | White |
| Jacket / Champion CO200 | Black, Light Blue |

Hoodies, crewnecks and the Heavyweight T-shirt use S–3XL. The Pocket T-shirt, sweatpants and Champion jacket use S–2XL. The owner explicitly approved removing the six original 3XL sweatpant and jacket variants outside that supplier range. `colour-plan.json` lists their exact IDs under `approvedVariantRemovals`; the final store audit confirms all six are absent and every other original ID is preserved. Both colours of each sweatpant and jacket product therefore have five sizes, for ten variants per product.

The untouched baseline remains 142 original records. The target is **253 variants across 17 products: 136 retained originals + 117 additions**, after six approved removals. Per product, hats have 5 variants, hoodies 36, crewnecks 12, sweatpants 10, T-shirts 17, and jackets 10. All 253 target combinations match the saved supplier colour/size data. The matrix avoids unsupported combinations such as a Blue Spruce Pocket T-shirt or a Bone 1567 hoodie. The before-media read prompt still expects the 142-record state captured before removal; it is not the final-state target.

`colour-plan.json` maps each of the 57 garment/colour/design images to its product and variant options, including original IDs and the source variant for copying configuration. Fourteen first-colour images are reused from `../images`; 43 new images are in `images/`. The three older Slate sweatpants concepts remain preserved outside this active colour matrix; Pepper replaces them as the accurate supplier colour.

The completed rollout retains all 48 original Shopify media attachments and adds the 43 new photos, for 91 attachments. Removing the six variants did not remove product media.

## Completed Shopify rollout

The final saved Shopify export passes with **17 products, 253 variants, 136 retained original IDs, 117 new IDs, and all six approved removals absent**. All 253 variant images, all 17 option-value sets, and all 17 publication/channel sets match the plan. All 48 original media IDs are retained among 91 attachments. Prices and retained inventory/fulfilment configuration are unchanged; the hoodie drawcord/embroidery wording and sweatpant 220 gsm correction are verified without unrelated changes to those six descriptions.

See the [independent final review](verification/independent-final-review.md) and [machine verification](verification/shopify-verification.json). The [storefront check](verification/storefront-check.json) confirms Garment-Dyed / S / Blue Spruce displays the matching drawcord hoodie photo, updates valid Colour choices with Style, and enables Add to cart. No cart or checkout action was performed.

## Review and provenance

- Open `index.html` for a local gallery with garment, design and colour filters.
- `OFF-SHFT-Colour-Review.pdf` provides a ten-page contact sheet.
- `OFF-SHFT-Colour-Images.zip` is the generated local download bundle. It is excluded from Git because it duplicates the tracked source images and exceeds the single-file limit.
- `image-verification.json` records decoded dimensions, byte sizes and SHA-256 checksums.
- The generation logs retain prompts, references and image review notes.
- `hoodie-research.md` and `collection-colour-research.md` document official supplier evidence checked on 29 October 2026.
- `verification/variant-baseline.json` is the read-only Shopify baseline before Colour edits. Live verification is recorded separately after changes are applied.

Run `build-plan.py` to regenerate the exact option matrix, `build-shopify-prompts.py` for reviewable product-family batches, and `build-review.py` after all image files are present to rebuild the review artifacts without editing the source PNGs.

The baseline had blank SKUs, inventory tracking disabled and inventory at Shop location, with no confirmed Printful fulfilment linkage. Adding a Shopify colour does not establish production sync. Existing prices, product status, publication channels and fulfilment configuration are to be preserved.
