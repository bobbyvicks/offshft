# Printful setup for the four existing OFF SHFT listings

Official public guidance checked **29 October 2026**. This is setup guidance, not evidence that the account is connected, billing is configured, variants are synced, or orders are ready. Root owns the authenticated UI work. No UI, authenticated network, product, inventory or Git changes were made for this research.

## Existing records to connect

The completed Shopify snapshot contains these four ACTIVE coming-soon products. Its 76 variants have tracked zero stock and overselling disabled; that explains the saved Sold out display independently of supplier blank stock. Preserve their product/variant identities and the approved media, prices and colour options while adding fulfilment mapping.

| Existing Shopify product | Product ID | Printful blank / catalogue ID | Variants |
|---|---|---|---:|
| Time Well Earned. T-Shirt | 15478491971906 | Comfort Colors 1717 / 586 | 24 |
| The Rest Is Ours. Hoodie | 15478492004674 | Comfort Colors 1467 / 969 | 24 |
| Ours to Spend. Trucker Hat | 15478492037442 | Yupoong 6606 / 252 | 4 |
| 5:00 Crewneck | 15478492070210 | Comfort Colors 1466 / 971 | 24 |

The [latest public availability check](../next-round-launch/availability-recheck/2026-10-29T20-29-40-927Z/findings.md), at 20:29 UTC, found all 76 exact launch rows in stock/fulfillable and none discontinued or disabled. Keep Comfort Colors first; this evidence gives no stock-based reason to replace them. Account selling-region availability still needs checking. Source baseline: [launch completion](../next-round-launch/launch-progress.md), [listing plan](../next-round-launch/listing-plan.json).

## Connect and sync without duplicate listings

1. Install/open the official Printful Shopify app and sign in to the intended Printful account through the embedded app. Printful says the connection is complete when the embedded dashboard replaces the sign-in screen. [Official connection guide](https://help.printful.com/hc/en-us/articles/50262260641297-How-do-I-connect-my-Shopify-store-to-Printful).
2. Enable **Import existing products** under Printful **Settings → Store settings → Orders → Sync as you go**, or **Import not synced products from Shopify** on the store page; labels vary by dashboard. Use **Stores → the existing Shopify store → Refresh data**. Locate these existing four products under Imported/Not synced. [Shopify existing-product workflow](https://help.printful.com/hc/en-us/articles/50262333466897-How-do-I-add-and-sync-products-with-my-Shopify-store).
3. Use **Sync product**, or **Edit → Choose product**, on an existing variant. Choose the exact blank, size, colour and technique; add the approved transparent artwork to the required placement. Complete with **Continue**. A reusable template can speed this process without creating a new Shopify listing. The **Add/Create product → Submit to store** path creates a listing and is not the route for these four existing records. [Manual sync instructions](https://help.printful.com/hc/en-us/articles/50263352901905-How-do-I-manually-sync-products-to-my-store).
4. The Size/Colour structure may trigger Printful's bulk-sync wizard. Review its proposed matches before applying them. Use the approved colourway manifest for light/dark/one-colour artwork; applying one file across every colour can give the wrong palette. Recheck all **24 + 24 + 4 + 24** existing variants, not just the first colour. Import can expose other store products; leave the original 17 outside this setup scope.
5. Record **Synced** counts and confirm fulfilment is enabled. **Not synced** means the supplier lacks required production mapping; Shopify's **Fulfillment disabled** status prevents import even when a mapping exists. [Sync status definitions](https://help.printful.com/hc/en-us/articles/50263331819281-What-do-the-sync-statuses-of-my-products-mean).

Use production artwork from [the approved colour manifest](../../designs/next-round-colourways/colourways.json), with the unchanged canonical logo separately for the hoodie front. The 16 garment mockups are listing media, not print/embroidery files. Check geometry at the intended millimetre width and preserve the existing Shopify images when the sync UI offers mockup updates.

## Exact decoration configuration

| Blank | Configuration to verify in Design Maker |
|---|---|
| CC1717 | **Embroidery → Centered**, 95 × 45.434 mm. Template area is 101.6 × 101.6 mm, all sizes. Blue Spruce has DTG-only exclusions; use the selected embroidery. |
| CC1466 | **Embroidery → Large Front**, centre the 115 × 27.468 mm numeral artwork. The 254 × 152.4 mm area fits; ordinary Centered is only 101.6 mm wide. |
| Yupoong 6606 | **Embroidery → Front**, 85 × 25.884 mm, inside 149.9 × 50.8 mm. Check the centre seam. |
| CC1467 | Required: rear **DTG**, 240 × 65.761 mm, plus separate **Left chest embroidery**, canonical logo about 62.64 mm wide. Joint support remains unverified publicly; inspect it as one complete product configuration. |

Exact template responses are saved in [placement evidence](../next-round-launch/availability-recheck/2026-10-29T20-29-40-927Z/placement-evidence.json). Official product pages: [1717](https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717), [1466](https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466), [6606](https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606), [1467](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467).

**CC1467 unresolved details:** public data lists back DTG and left-chest embroidery separately and explicitly permits DTG with wrist embroidery. It does not prove chest embroidery can coexist with the back print. The [official embroidered-hoodie page](https://www.printful.com/custom-embroidered-hoodies) points to **Product Catalog → All filters → Technique** for compatible combinations. In the authenticated designer, inspect the actual technique/placement options and verify both required areas survive together in the same saved configuration; a technique switch that replaces one decoration does not meet the specification. Record the saved result and combined cost.

Large Back DTG is explicitly **M–3XL**, 381 × 457.2 mm. Size S needs the regular Back placement confirmed directly: public templates expose an S **Front** entry linked to a front-and-back ZIP, which is insufficient proof of S back support. A generic mixed-technique marketing claim is also insufficient. If the required route is unavailable, report that exact limitation before changing the approved blank, method or front-logo application.

## Inventory and order routing

Printful stock sync affects **synced variants only**, checks stock several times daily and uses the store's selling region. Confirm **Settings → Store settings → General → Store default selling preferences** matches the intended markets. POD stock is treated as available until unavailable, rather than as merchant-owned units. Let supplier stock sync establish the Printful-location availability instead of entering invented stock. [Stock sync behaviour](https://help.printful.com/hc/en-us/articles/50263482677009-What-is-product-stock-sync-and-how-does-it-affect-my-store).

In each Shopify variant, confirm **Printful is an enabled inventory location**; where shown, use Multiple locations. A reported **9999** is Printful's in-stock marker, while zero can represent unavailable regional stock. If the supplier should be available but Shopify remains zero, inspect region, fulfilment status and **Refresh data**, then the inventory history. [Shopify inventory troubleshooting](https://help.printful.com/hc/en-us/articles/50262358206353-What-are-the-most-common-Shopify-integration-errors-and-how-do-I-fix-them).

Keep these two controls distinct:

- **Routing/import:** Shopify **Settings → General → Order processing → Automatically fulfill the order's line items** sends paid orders onward. Alternatively, Printful's **Automatically import orders with synced products** can import despite Shopify's manual setting, but may conflict with post-purchase apps. Choose the route consistent with this store's existing apps. Manual Shopify **Request fulfillment** is another route. Changes do not automatically submit already pending orders. [Order routing guide](https://help.printful.com/hc/en-us/articles/50262336933137-How-do-I-manage-order-processing-and-fulfillment-in-Shopify).
- **Production confirmation:** Printful **Settings → Store settings → Orders → Order import settings** chooses automatic confirmation or manual review. Manual confirmation keeps imported orders as drafts. Automatic confirmation sends eligible orders to fulfilment and charges the configured billing method. [Confirmation settings](https://help.printful.com/hc/en-us/articles/50262167491217-How-do-the-import-order-settings-for-my-integration-work).

Orders generally need captured payment, Unfulfilled status, synced products, enabled fulfilment and the Printful location. Draft/local-pickup orders are not a reliable standard-order test. Confirm existing pending orders separately from future-order settings. [Shopify import requirements](https://help.printful.com/hc/en-us/articles/50262342626193-Why-are-my-Shopify-orders-not-being-imported-to-Printful).

## Payment, digitization and shipping

The buyer pays OFF SHFT through Shopify; Printful charges OFF SHFT separately for production/shipping. In **Billing → Billing methods**, verify a valid method and its **Store billing settings** assignment for this Shopify store. Confirm billing currency, costs and available funding before automatic production. [Shopify billing setup](https://help.printful.com/hc/en-us/articles/50262313219985-How-does-Printful-charge-for-Shopify-orders). Printful Wallet processes charges; failed payment prevents fulfilment and needs manual resubmission after correction. [Billing behaviour](https://help.printful.com/hc/en-us/articles/50264607936785-How-does-the-Printful-billing-system-work).

Current CAD fee table: **C$9.60** normal new-design digitization, **C$5.85** Design Maker text, **C$4.40** side/back embroidery and **C$4.40** adjustment. The uploaded outlined OFF SHFT artwork is not editable Design Maker text, so do not budget it at the discounted text rate. Reuse eligible saved digitized files rather than uploading identical copies. The exact number of billed designs across palettes/types is not established until Printful quotes it. [Digitization fees](https://help.printful.com/hc/en-us/articles/50263327450257-What-are-digitization-and-adjustment-fees-for-embroidery).

First-time embroidery is digitized after an order is submitted. Changes may require approval under **Orders → order → Holds and order history**. In Design Maker, **Color & details** maps artwork colours to available threads; mockup colours are not exact thread commitments. Saving a template or syncing a variant is not digitization approval. [Digitization process](https://help.printful.com/hc/en-us/articles/50264003645073-What-is-embroidery-digitization).

The crewneck's Large Front custom upload also uses stitch-count pricing: the lowest tier, below 15,000 stitches, has no extra placement charge; higher tiers add a charge, converted at checkout. Check the actual calculator rather than assuming a standard chest price. [Large embroidery pricing](https://help.printful.com/hc/en-us/articles/50263324676881-What-s-the-large-embroidery-pricing).

After sync, inspect the four products' Printful shipping profiles and actual checkout rates for intended destinations. Printful can assign its flat-rate profiles during sync; **Edit product → Switch to a Printful profile** restores its profile where appropriate. Its profiles may overwrite direct edits at later syncs. Live rates depend on Shopify plan eligibility and are not required just to connect the app. [Shopify shipping setup](https://help.printful.com/hc/en-us/articles/50262284973841-How-do-I-set-up-shipping-for-my-Shopify-store).

## Completion evidence to retain

Record the connected account/store, all 76 existing variant mappings, exact garment/technique/placement files, regional availability, Printful inventory location, routing and confirmation settings, billing assignment, production/shipping quotes and any unresolved digitization holds. Verify that the four original Shopify product IDs and 76 variant IDs remain, and the original 17 products remain outside the changes. A supplier-stock result, a visible mockup or an installed app alone does not establish order readiness.
