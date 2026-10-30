# Published export verification

**PASS for the saved Shopify admin catalogue and listing copy.** The final snapshot has 21 products / 329 unique variants, with the original 17 products / 253 variants preserved and exactly four approved additions / 76 variants.

All four new products are ACTIVE and published solely to **Online Store**, publication `gid://shopify/Publication/335132361026`. All 16 approved images are READY, ordered by the planned colourways, and have the correct filenames and alt text. Every variant uses its colour's image, planned CAD price and Size/Colour options. All 76 retain tracked inventory, DENY policy, quantity zero, and explicit available=0 / on_hand=0 at every exported location.

Descriptions and SEO match the plan and imported CSV, including **“Coming soon. Product images are mockups.”** The cap now has the authorized `text-hat` tag in addition to all original planned tags; other tag sets remain exact.

## Precise image association handling

The final export represents variant associations using `ProductImage` records, whereas the morning snapshot used `MediaImage` records. The reported 253 original differences were this resource-type change: different ID type and null legacy alt, with the exact same URL.

The verifier now resolves a ProductImage only when its exact URL matches **one actual MediaImage on the same product**. Null legacy alt text then uses that actual media node's alt. Conflicting non-null alt, unknown ID kinds, ambiguous URLs and cross-product URLs are not normalized. Actual product media IDs, order, URLs and alt remain strict comparisons.

All 329 current variant associations resolve through this rule. After this schema handling, the previously evidenced 19 exact URL-pair equivalences and common collection ID/title comparison, **zero original catalogue changes remain**. The raw exports are unchanged. The URL-hash check still proves present endpoint equivalence only; no historical image-byte snapshot exists.

Negative checks reject wrong MediaImage IDs, cross-product URL associations, conflicting legacy alt, changed actual media alt and original-media reordering. The prior checks for image order/status, explicit inventory evidence and extra published channels remain active.

## Remaining storefront observations

The final export reports two unresolved observations: `onlineStoreUrl` is null for all four products, and the cap's **Text hats** collection membership is not returned despite its saved `text-hat` tag. **All hats membership is present.** These are retained in `published-verification.json`; this admin-data pass does not claim the public routes or Text hats membership have been independently verified. Root is checking those separately.

## Evidence

- `published-verification.json`: published stage passed, no errors, zero normalized original changes, 329 explicit legacy associations, 19 evidenced URL pairs.
- `published-copy-verification.json`: all four listing-copy checks passed.
- `original-media-url-equivalence.json`: exact URL fetch/hash evidence; no blanket removal of version tokens.
- Final raw export SHA-256: `896b027384ca880d4a58a9f0f56f1353589f971ed573fd17f0c6253990502001`.

```text
python -B verify-launch.py --after shopify-after-export.json --url-equivalence original-media-url-equivalence.json
```

## Later storefront and collection verification

[Later browser/admin evidence](storefront-verification.json), observed 29 October 2026, confirms that the four actual product pages open in the owner's authenticated storefront session despite the export's null `onlineStoreUrl` values. All sixteen colour clicks showed matching images, correct CAD prices, the coming-soon/mockup notice and disabled Sold out controls. The Catalog link displayed all 21 products and all four new listings.

A fresh read-only admin query also confirmed the cap's **Text hats** membership after indexing, alongside **All hats**. The earlier missing-membership observation remains unchanged in the exported snapshot and verification report. Both collection URLs still returned **Page not found** in the browser; no collection or navigation settings were changed, and main Catalog discovery works. Anonymous access remains password-gated. These later observations do not rewrite the snapshot's earlier errors or establish fulfilment readiness.
