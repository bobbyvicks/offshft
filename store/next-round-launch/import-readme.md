# Four new products: Shopify CSV import

Prepared 29 October 2026 from [listing-plan.json](listing-plan.json). Import [import-products.csv](import-products.csv) to create **four drafts and 76 variants**, with no images. The existing listings are outside this file.

| Product / handle | Variants | Price (CAD) |
|---|---:|---:|
| Time Well Earned. T-Shirt / `time-well-earned-t-shirt` | 24 | 44.99 |
| The Rest Is Ours. Hoodie / `the-rest-is-ours-hoodie` | 24 | 89.99 |
| Ours to Spend. Trucker Hat / `ours-to-spend-trucker-hat` | 4 | 34.99 |
| 5:00 Crewneck / `five-oclock-crewneck` | 24 | 79.99 |

Clothing has S, M, L, XL, 2XL and 3XL in each approved colour. The cap has One size in four colours. Only Size and Colour are options. Prices match the listing plan; the CSV has decimal amounts, so verify the store currency is CAD.

## Import choices

1. Open **Products > Import**, then **Add file** and select this CSV.
2. Keep **Overwrite products with matching handles** unchecked. This prevents matching existing handles from being updated; any match is skipped. Confirm all four new handles are absent before import.
3. Deselect **Publish new products to all sales channels**. The file also specifies `draft` and online-store publication `false`.
4. Select **Upload and continue**. Check the preview shows four new products, the expected titles/options/prices, and no existing-product updates. Then select **Import products**.

These controls and labels follow Shopify's current [import instructions](https://help.shopify.com/en/manual/products/import-export/import-products). If a partial import needs recovery, inspect which handles were created first; do not enable overwrite just to retry.

## File settings

- `Inventory tracker`: `shopify`; `Inventory quantity`: `0`; `Continue selling when out of stock`: `deny` on every variant.
- `Fulfillment service`: `manual`, a standard placeholder. It does not create Printful sync. The root operator found no installed Printful app.
- `Status`: `draft`; `Published on online store`: `false` on every row.
- `Requires shipping`: `true`. No invented SKU, barcode, weight, supplier identifier, cost or image URL is supplied. Standard tax defaults are left to Shopify; no tax settings are changed by this preparation.
- Descriptions retain the plan's HTML and append: **Coming soon. Product images are mockups.**

Current header names and values were checked against Shopify's [CSV schema](https://help.shopify.com/en/manual/products/import-export/using-csv). In particular, the current headings are `URL handle` and `Description`. Quantity in a product CSV applies only to a single-location store; multiple-location quantities require the [inventory workflow](https://help.shopify.com/en/manual/inventory-and-locations/setup/inventory-csv).

## Validate before making visible

After import, verify four drafts, counts **24 / 24 / 4 / 24**, exact Size/Colour choices, all prices, and all 76 variants tracked with zero available inventory and overselling disabled. Check every active stocking location; do not rely on the CSV quantity field in a multiple-location store. Confirm manual is only a placeholder and no Printful connection is claimed.

Upload the sixteen approved mockups separately and assign each colour's image to every corresponding size, using the mapping in [listing-plan.json](listing-plan.json). Confirm the coming-soon notice and mockup wording display correctly. Hoodie media show the back; preserve the separate front-logo specification.

Drafts are not public. For the requested visible-but-unpurchasable presentation, activate only these four products and publish only to Online Store after the inventory/media checks. Keep tracking on, all quantities zero and overselling denied. Check the storefront selectors and disabled purchase controls; ensure any collection filtering does not hide the zero-stock products. Supplier setup, final application mapping and accurate shipping weights remain necessary before accepting orders.

## Local validation

Parsed the completed UTF-8, LF-line-ending CSV: **76 unique handle/Size/Colour rows, four product headers, four notices, 20 columns, no image columns**. All option pairs and prices match the listing plan. The four handles are unique and share none of the 17 handles in `store/products/drop1.json`; live uniqueness is still checked in the import UI. Original product files were not modified.

- CSV bytes: 10,511
- CSV SHA-256: `6771dcb4c98930f0901680176d04c916b6e8c463309d39565e66b8d8e702cb25`
- No Shopify operation or Git mutation was performed to prepare these files.
