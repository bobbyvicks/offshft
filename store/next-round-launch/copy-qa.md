# Listing copy QA

**PASS against the saved after-media export.** Independently compared the four new listings with `listing-plan.json` and `import-products.csv`. This snapshot precedes the publication operation; final publication and the newly authorized cap tag must be checked in the final export.

| Listing | Description | SEO title / description | Tags | Options / prices / variants |
| --- | --- | --- | --- | --- |
| Time Well Earned. T-Shirt | Pass | Exact match | Exact plan/CSV set | 24; CAD 44.99; Size then Colour |
| The Rest Is Ours. Hoodie | Pass | Exact match | Exact plan/CSV set | 24; CAD 89.99; Size then Colour |
| Ours to Spend. Trucker Hat | Pass | Exact match | Exact plan/CSV set | 4; CAD 34.99; Size then Colour |
| 5:00 Crewneck | Pass | Exact match | Exact plan/CSV set | 24; CAD 79.99; Size then Colour |

Every description equals the planned description plus **“Coming soon. Product images are mockups.”** and matches the imported CSV. Comparison normalized HTML whitespace but retained element structure, attributes and text. Shopify's added line breaks do not change the copy. No replacement characters were found; squared-unit symbols and size-range en dashes are intact.

The hoodie copy preserves upper-back print plus left-chest embroidery; the tee, cap and crewneck retain their intended embroidery descriptions and widths. All three apparel products retain S-3XL, and the cap retains One size. Every one of the 76 size/colour/price rows matches both plan and CSV; option values and ordering also match.

The saved cap tags are `13-ours-to-spend`, `hat`, `off-shft`. Root has now authorized appending `text-hat` for publication. Expect that one additional tag in the final export, with existing tags retained. It is not present in the pre-publication snapshot and is not claimed verified here.

Source after-media export SHA-256: `25a48e91ca8f481509e16a45fc42d71199b258357bc794eb740eba2ce4dbc070`.

Imported CSV SHA-256: `6771dcb4c98930f0901680176d04c916b6e8c463309d39565e66b8d8e702cb25`.
