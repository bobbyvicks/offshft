# OFF SHFT coming-soon listings

Completed 29 October 2026: four approved designs, sixteen colourways and **76 new variants**, ACTIVE on **Online Store only**. The store now contains **21 products / 329 variants**. All new variants have tracked zero stock and overselling disabled; these listings are not ready to fulfil orders.

| Listing | Colours | Variants | Price (CAD) |
|---|---:|---:|---:|
| Time Well Earned. T-Shirt | 4 | 24 | 44.99 |
| The Rest Is Ours. Hoodie | 4 | 24 | 89.99 |
| Ours to Spend. Trucker Hat | 4 | 4 | 34.99 |
| 5:00 Crewneck | 4 | 24 | 79.99 |

The original 17 products / 253 variants were preserved in the audited fields, subject to the precise URL/schema normalization below. No theme, collection-rule, navigation or password-setting changes were made.

## Verified result

[Published catalogue verification](published-verification.json) and [listing-copy verification](published-copy-verification.json) pass. Sixteen approved images are READY, ordered correctly and assigned to all 76 variants by Colour. [All four media jobs completed](media-job-completion.json).

[Browser evidence](storefront-verification.json) records all four customer pages and **16 actual colour selections**, with matching images, correct CAD prices, the coming-soon/mockup notice and disabled Sold out controls. The header's **Catalog** route shows all 21 products, including the four additions.

The new cap belongs to **All hats** and **Text hats** after adding only its `text-hat` tag. Both collection URLs currently return Page not found; membership does not prove storefront visibility. Main Catalog discovery works. Anonymous visitors still reach the password page; the checks used the owner's existing authenticated storefront session. Password protection remains in place.

## Files

- [Completion record](launch-progress.md): applied changes, product IDs and remaining supplier limits.
- [Listing plan](listing-plan.json) and [copy](listing-copy.md): approved options, prices, artwork and descriptions.
- [Import CSV](import-products.csv) and [instructions](import-readme.md): historical draft-creation inputs; do not reimport or recreate the completed products.
- [Media upload map](media-upload-map.json) and [immutable source map](public-media-source-map.json): sixteen filenames, alt text and source hashes. `upload-media/` contains unchanged PNG copies.
- [Before export](shopify-before-export.json), [after-media export](shopify-after-media-export.json) and [final export](shopify-after-export.json): preserved raw evidence.
- [Published review](published-review.md), [URL evidence](original-media-url-equivalence.json), [storefront checks](storefront-verification.json) and [anonymous-access checks](storefront-public-access.json): audit details and limitations.
- [Supplier check](supplier-check.md): unresolved fulfilment and application work.

Reproduce the saved catalogue checks from this directory:

```text
python -B verify-launch.py --after shopify-after-media-export.json --stage media --url-equivalence original-media-url-equivalence.json
python -B verify-launch.py --after shopify-after-export.json --stage published --url-equivalence original-media-url-equivalence.json
```

The after-media snapshot precedes publication; its draft status and stale batch processing message are historical. Later job, published-export and browser evidence establish the completed state.

The verifier accepts only 19 exact URL-pair equivalences supported by present-time byte hashes, and resolves legacy ProductImage associations only through a unique exact URL on the same product. It does not discard URL tokens generally. No historical image-byte snapshot accompanied the baseline, so historical byte identity is not proven.

Printful sync, physical samples, production cost and final supplier application mapping remain unconfirmed. Keep all new variants unavailable for purchase. Product images are AI mockups.
