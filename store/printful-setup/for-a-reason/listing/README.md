# For a Reason. Hat — listing package

**Draft only. `DRAFT-not-import-ready.csv` contains image placeholders. Do not import it yet.** This package creates one new product with three variants. No live operation has been performed.

| Setting | Prepared value |
|---|---|
| Title / handle | For a Reason. Hat / `for-a-reason-hat` |
| Price | CAD 34.99 each |
| Options | Size: One size; Colour: Charcoal, Ivory, Evergreen |
| Status / Online Store publication | Active / true |
| Initial inventory | Shopify tracking, quantity 0, deny overselling |
| Shipping / taxable | Requires shipping / true |
| Initial fulfillment field | `manual`, a documented import placeholder; does not establish Printful routing |

The fresh 31-product Shopify export uses Size first and Colour second on the existing Ours to Spend cap. This package follows that option order and price. It contains no existing handles and supplies no invented SKUs, costs, weights, barcodes or supplier location IDs.

`copy.json` holds initial and post-verification descriptions. **The initial CSV does not claim 3D puff.** After all three saved Printful mappings are verified with the approved puff artwork, apply `descriptionHtmlAfterVerifiedPuff` and `seoDescriptionAfterVerifiedPuff`. Both descriptions disclose that images are mockups and accurately distinguish the softer Ivory construction. Neither uses coming-soon wording.

Charcoal and Evergreen use the structured six-panel Yupoong 6606. Ivory uses the unstructured Comfort Colors CCST0: cotton pigment-dyed twill with a heavy brushed finish, soft mesh and a curved bill. The 6606 supplier composition can vary by colour/stock, so the copy does not invent one universal fabric ratio. These facts come from the read-only official catalogue snapshot recorded in `copy.json`.

## Import and verification checklist

- Replace the three placeholder strings in **both** image columns with the approved public mockup URLs. Confirm each URL returns the intended colour image; preserve image order Charcoal, Ivory, Evergreen.
- Recheck that `for-a-reason-hat` is absent in the live catalogue. Keep **Overwrite products with matching handles** disabled. If a partial import occurs, inspect the resulting handle before retrying.
- Keep the importer's **Publish new products to all sales channels** option disabled. The CSV requests Online Store publication only.
- Preview exactly one new product and three variants at CAD 34.99, with Size / Colour and no existing-product updates.
- After import, confirm zero available inventory at every active stocking location, tracking enabled and overselling denied. Verify the images/variant assignments and disabled purchase controls while supplier setup remains incomplete.
- Have the root operator connect the exact supplier variants, artwork, placement and 3D puff technique. Verify Printful inventory-location assignment and routing separately. Do not invent stock quantities or infer the location from the CSV fulfillment field.
- Only after successful mapping verification, apply the gated puff description and SEO copy. Root retains the billing, shipping and checkout-readiness checks.

Shopify's [CSV documentation](https://help.shopify.com/en/manual/products/import-export/using-csv) was checked on 29 October 2026. The file uses current headers. `manual` is the documented fulfillment default, not evidence of a Printful assignment. Product-CSV quantities apply to single-location stores; location stock requires separate verification. Image columns require working public image URLs.

Run `python store/printful-setup/for-a-reason/listing/build.py` to regenerate the package from the recorded local snapshots. It writes only this listing folder. Generated `validation.json` reports the draft state; it is not a live-import or order-readiness result.
