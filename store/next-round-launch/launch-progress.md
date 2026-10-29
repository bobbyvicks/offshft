# Shopify launch completion

29 October 2026. The four owner-approved designs and sixteen colourways are now **ACTIVE and published only to Online Store** (`gid://shopify/Publication/335132361026`) as coming-soon listings. All 76 new variants remain tracked, with zero available/on-hand inventory and overselling denied. Printful is not installed; this is not a fulfilment-ready release.

## Completed

- Imported four new products with overwrite and all-channel publication disabled. The original 17 products were outside the mutation scope. Current totals are **21 products / 329 variants**: 253 original variants plus 76 new variants.
- Product IDs and counts: Time Well Earned. T-Shirt `15478491971906` (24); The Rest Is Ours. Hoodie `15478492004674` (24); Ours to Spend. Trucker Hat `15478492037442` (4); 5:00 Crewneck `15478492070210` (24).
- Imported the sixteen exact approved images through Sidekick from byte-verified immutable Git sources after the Windows file picker did not complete. [Source mapping](public-media-source-map.json) records that provenance. No duplicate local-picker upload was assumed successful.
- Attached four images per product in approved colour order, with exact alt text, and mapped all 76 variants by Colour. All sixteen images are READY. The four reorder jobs subsequently returned `done=true`, without errors; [job completion evidence](media-job-completion.json) supersedes the batch UI's stale processing display. No jobs or products were recreated.
- The [media-stage verification](media-stage-verification.json), [published verification](published-verification.json) and [final copy verification](published-copy-verification.json) pass. Final descriptions include **Coming soon. Product images are mockups.** Prices, Size/Colour options and SEO match the approved plan and import.
- Published only the four new products to Online Store. Added `text-hat` only to the new cap, preserving its original tags and `Hat` product type. A later read confirms membership in both All hats (`527680078146`) and Text hats (`527680241986`). No original-product membership, collection rule, theme, menu, password or subscription setting was changed.

## Customer-page verification

[Storefront verification](storefront-verification.json) records actual native-browser checks in the owner's existing authenticated storefront session:

- All four product pages opened. All **16 actual colour clicks** displayed the matching images; CAD prices were 44.99 / 89.99 / 34.99 / 79.99.
- Every checked colour displayed a disabled **Sold out** purchase button and the coming-soon/mockup notice. Hoodie images show the back. Caramel cap punctuation and Espresso crewneck colon are Bone, as approved.
- The visible **Catalog** header link opened `/collections/all`, displaying **21 products** and links to all four new listings.
- `/collections/all-hats` and `/collections/text-hats` returned **Page not found**, despite the cap's confirmed memberships. No collection publication or navigation settings were changed; the verified main Catalog route provides discovery for all four products.
- Anonymous requests still redirect to the password page, as recorded in [public-access evidence](storefront-public-access.json). Password protection remains unchanged. These are verified authenticated storefront observations, not a claim of unrestricted public access.

The final export's earlier null `onlineStoreUrl` values and missing Text hats membership are preserved in the raw snapshot. Later browser/admin observations resolve those specific readiness questions; the two collection-route failures remain recorded.

## Preservation evidence and limits

The final verifier reports zero original catalogue changes after narrow schema/evidence handling: collection ID/title comparison, ProductImage-to-MediaImage resolution only through an exact unique URL on the same product, and **19 explicitly evidenced old/new URL pairs**. Original media IDs, order and alt text remain strict comparisons. See [published review](published-review.md) and [URL equivalence evidence](original-media-url-equivalence.json).

Both exact endpoints in each URL pair served identical bytes at the check time. The baseline contains URLs and metadata, not a historical image-byte capture; it cannot prove unchanged bytes at the earlier export time or explain when a version token changed. The raw exports have not been rewritten.

## Separate work before orders can open

The coming-soon publication and its verification are complete. Supplier connection, exact application mapping, production costs and physical samples are not confirmed. In particular, the hoodie back-print/front-embroidery combination and size-S back placement remain unresolved, and the 115 mm crewneck embroidery requires Large Front. Keep purchasing disabled until the separate supplier setup is completed. See [supplier check](supplier-check.md).
