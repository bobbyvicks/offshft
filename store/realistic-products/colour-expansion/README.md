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

Hoodies, crewnecks and the Heavyweight T-shirt use S–3XL. The Pocket T-shirt, sweatpants and Champion jacket are offered by Printful in S–2XL. The existing Shopify sweatpants and jackets have six 3XL records outside that supplier range; those IDs are retained, with their inventory treatment awaiting the owner's choice. New colours on those garments stop at 2XL. The matrix deliberately avoids unsupported new combinations, such as a Blue Spruce Pocket T-shirt or a Bone 1567 hoodie. All 142 existing variant IDs must be retained. The target matrix has 259 records: 117 additions across 17 products, including the six preserved unsupported 3XL records.

`colour-plan.json` maps each of the 57 garment/colour/design images to its product and variant options, including original IDs and the source variant for copying configuration. Fourteen first-colour images are reused from `../images`; 43 new images are in `images/`. The three older Slate sweatpants concepts remain preserved outside this active colour matrix; Pepper replaces them as the accurate supplier colour.

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
