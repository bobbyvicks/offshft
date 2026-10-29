# Shopify routing after Printful API sync

Read-only research, 29 October 2026. No UI, API, inventory or store mutation was performed.

**Use the Printful API to save the three mappings, then verify the Shopify Printful location independently.** The official API documentation does not explicitly promise that setting `is_ignored=false` activates the Shopify fulfillment location. It also does not require repeating the UI “Sync product” designer after a successful API mapping. Do not infer either guarantee. This uncertainty is resolved by checking the saved state in both systems.

The [Ecommerce Platform Sync API](https://developers.printful.com/docs/#tag/Ecommerce-Platform-Sync-API) configures imported listings. Its single-variant PUT supports catalogue variant, files, options and ignore status. `is_ignored=true` excludes order imports and Shopify stock management; false removes that exclusion. This is a separate concern from proving Shopify inventory routing.

Printful's [order-import requirements](https://help.printful.com/hc/en-us/articles/50262342626193-Why-are-my-Shopify-orders-not-being-imported-to-Printful) explicitly require each product variant to include the Printful inventory location. Thus `synced=true` alone is insufficient evidence of the complete route.

## Steps for this three-variant mixed-blank product

1. Import only `for-a-reason-hat` after replacing approved image URLs. Record the resulting Shopify product ID and all three immutable variant IDs. Keep tracked zero / deny until supplier configuration and routing are verified.
2. In Printful, ensure existing-product import remains enabled and refresh the store's data. Resolve each imported row by its exact external Shopify variant ID.
3. Configure each imported variant using the official sync endpoint and approved files/options. Charcoal and Evergreen are Yupoong6606; Ivory is Comfort Colors CCST0. Do not apply a wizard's common-blank suggestion across all three colours. Preserve all existing media, prices and identity values.
4. Read back all three variants. Verify exact external IDs, correct blank/colour/size, complete artwork placements and dimensions, `embroidery_type=3d`, thread mapping, `synced=true` and `is_ignored=false`. Check the product and variant list in Printful for any “Fulfillment disabled” state. [Sync status meanings](https://help.printful.com/hc/en-us/articles/50263331819281-What-do-the-sync-statuses-of-my-products-mean).
5. In Shopify **Products → For a Reason. Hat → each variant → Inventory**, verify the real Printful app location is present and active. If the UI offers **Inventory will be stocked at**, use **Multiple locations** to inspect the actual location list. Do not rely on a generic “manual” field or an aggregate inventory count.
6. If the Printful location is absent/inactive, use the variant's observed **Edit locations** control and select the actual existing Printful app location, then save. Do not create an ordinary location named Printful or type a guessed fulfillment handle. Shopify documents that location activation, quantity and routing are separate. [Location management](https://help.shopify.com/en/manual/inventory-and-locations/setup/multi-managed-inventory).
7. Let Printful manage its reported availability; confirm the selected selling region. Do not manually set 9999 or a positive stock figure. If a correctly mapped, enabled, active Printful variant remains at zero despite regional availability, Printful recommends disabling/re-enabling fulfillment and refreshing store data. Recheck mapping and inventory after that recovery action. [Inventory sync troubleshooting](https://help.printful.com/hc/en-us/articles/50262358206353-What-are-the-most-common-Shopify-integration-errors-and-how-do-I-fix-them), [stock sync](https://help.printful.com/hc/en-us/articles/50263482677009-What-is-product-stock-sync-and-how-does-it-affect-my-store).
8. Verify that a non-Printful location has no positive inventory for these made-to-order variants, and that the Printful location's shipping profile/rates support intended destinations. Inspect online availability per colour. Retain manual order confirmation until the root operator completes the separate billing/checkout review. Do not create a paid order to prove routing without authorization.

If API readback is incomplete or the Printful UI still shows an unsynced row, use Printful's documented [manual sync flow](https://help.printful.com/hc/en-us/articles/50263352901905-How-do-I-manually-sync-products-to-my-store): Edit → Choose product, or Imported → Sync product; choose the exact blank/colour/size and review the approved design. Uncheck mockup publishing when required to preserve approved Shopify imagery. A successful UI attempt still requires steps4–8 above.

## What the Shopify CSV can and cannot prove

Shopify's current [product CSV schema](https://help.shopify.com/en/manual/products/import-export/using-csv) supports `Inventory tracker=shopify` and a fulfillment-service field. A known, existing service handle can activate that service location; it does not unstock other locations. The actual Printful handle has not been verified here, so do not put a guessed value into a CSV.

Third-party app variants now export fulfillment service as `manual`, even when assigned to that app. Our fresh export demonstrates this: all four existing Ours to Spend variants export `manual` / `shopify`, while the saved official Printful snapshot reports all four synced and not ignored. Therefore a CSV re-export cannot establish either presence or absence of the Printful location. Inspect Shopify's variant inventory locations directly.

Product-CSV quantity applies only to a single-location store. For this setup, zero is an initial safeguard; location-level verification remains necessary after import. The available Printful token does not grant Shopify inventory API access. Use the authorized Shopify UI for location assignment and inspection rather than inventing a handle or adding credentials.

## Evidence retained locally

- `private/shopify-31-before-extracted.csv`: existing cap Size/Colour options, `Variant Inventory Tracker=shopify`, `Variant Fulfillment Service=manual`, `Variant Inventory Policy=deny` on all four rows.
- `private/product-487246214.json`: corresponding external IDs, `synced=true`, `is_ignored=false` on all four variants. This is a historical routing-related example; it is not proof of the new product's final puff or inventory state.
- `private/catalogue-all-products.json`: CCST0 and6606 construction/capability metadata. Per-blank artwork roles/options require their own exact mapping; mixed colours must not be mapped as one common blank.

Private snapshots stay ignored. No credentials, order/customer records or signed file URLs were copied into this note.
