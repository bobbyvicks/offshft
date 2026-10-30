# For a Reason. Hat

Owner approved publishing the three-colour concept and configuring 3D puff on Printful on 2026-10-29. The separate colour choice selects a Comfort Colors Ivory cap to retain the light colour.

| Shopify colour | Supplier blank | Catalogue variant | Production palette |
|---|---|---:|---|
| Charcoal | Yupoong 6606, structured trucker | 20390 | Bone / Sun period |
| Ivory | Comfort Colors CCST0, unstructured trucker | 52941 | Ink / Rust period |
| Evergreen | Yupoong 6606, structured trucker | 20393 | Bone / Sun period |

One size; retail C$34.99, matching the existing Ours to Spend hat. The customer description must explain the Ivory cap's softer crown. Product images are mockups and should reflect the actual supplier colours and constructions.

## Published and verified

- Supplier identities, available stock, fields and puff options verified by official read-only API responses. Evidence: `../for-a-reason-supplier-check.json`.
- Approved concept saved as `references/approved-concept.png`.
- Final production artwork in `artwork/` is 117.0501 × 47.6944 mm, transparent sRGB/600 DPI, with independent geometry checks.
- Three supplier-specific mockups and generation prompts are in `media/`. The approved conceptual reference remains in `references/`.
- Shopify product **15478784098626**, handle `for-a-reason-hat`, is Active and published to the Online Store only. Its three variants have matching photos and C$34.99 prices. The saved description includes raised 3D puff and the Ivory construction difference.
- Printful product **487261276** has three synced, non-ignored, active variants. The store now has 32 products / 380 variants; this addition created one product and three variants.
- Each saved native designer was inspected: 4.61 × 1.88 inches displayed, centred artwork, 3D Puff selected. Charcoal/Evergreen use 1801 White + 1672 Old Gold; Ivory uses 1800 Black + 1987 Orange. CCST0's primary front is normalized to `default` in saved API records, matching catalogue id `default` / type `embroidery_front`.
- All three Shopify variant Inventory cards contain the actual **Printful App / Printful** location. Printful supplied availability; no positive inventory was entered manually. Overselling remains off.
- Fresh API readback after the UI checks confirmed all three identities, prices, puff technique, correct supplier variants and active availability. Details are in `sync-verification.json`.

## Remaining store launch requirements

- Printful still displays **Set up billing**. The owner billing screen is open in Brave at `https://admin.shopify.com/store/offshft/apps/printful/billingSetup`; no payment details were entered by the agent.
- An anonymous in-app-browser visit to the new product redirects to `https://offshft.myshopify.com/password` and shows **Opening soon**. Store-wide public access/checkout remains gated. The password was not changed or bypassed, and no paid Shopify plan was selected.
- Native designer prices were C$21.20 for each 6606 colour and C$25.00 for Ivory, before shipping, tax and any first-order digitization. CCST0's native puff surcharge was C$2.25, differing from the catalogue API's C$1.95. No order or paid digitization was submitted.

`listing/create-for-a-reason.csv` is the already-used creation file, **not a file to import again**. The draft CSV and legacy-header comparison preserve preparation history. The importer estimated three products, but its field mapper and preview grouped all three variants under the one handle; the resulting Shopify/Printful product totals confirmed exactly one new product.

The Ecommerce Platform Sync API supports per-variant `PUT /sync/variant/{id}`. A bulk `PUT /sync/products/{id}` attempt returned HTTP405 without a mutation; this unsupported route has been removed from the setup client's mutation allowlist. Do not confuse the Manual/API-store bulk-product API with Shopify Sync.

The original all-31 setup remains outstanding. This addition does not establish that those products, store billing or public checkout are ready. Printful manual order confirmation remains the last verified production setting; no paid order or digitization purchase is authorized by this setup task.
