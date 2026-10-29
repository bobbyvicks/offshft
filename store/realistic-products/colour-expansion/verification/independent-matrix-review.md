# Independent matrix review

Reviewed 29 October 2026 against `../colour-plan.json` and `supplier-size-colour-availability.json`, updated after the owner's explicit instruction to remove 3XL from sweatpants and jackets. Comparison covers every planned Style / Colour / Size across all 17 products and 12 supplier blanks. Colour and size matching ignored whitespace and case, including hat `Black/White`; one-size hats were matched to the supplier's sole size.

- **253 / 253 planned variants pass** supplier colour, size, stock, and general availability checks, including all 117 additions.
- **253 planned variants = 136 retained originals + 117 new.** The untouched baseline remains 142 original IDs; six removals are explicitly approved. Product-level totals agree; no duplicate Style / Colour / Size combinations or option/pair mismatches were found.
- Every planned row has `supplierSupported: true` and supplier flags `hasStock: true`, `isFulfillable: true`, `isDiscontinued: false`, and `isDisabledInPush: false` in the saved snapshot.
- The six **original Black / 3XL Champion CO200 jacket** and **original Pepper / 3XL Comfort Colors 1469 sweatpant** IDs, one each for Logo, Clock, and Punched Out, are listed under `approvedVariantRemovals` in `colour-plan.json` and excluded from the target. Both colours now stop at 2XL, giving ten variants per sweatpant/jacket product. Final Shopify validation requires those exact six IDs absent and every other original ID preserved; removal is not inferred from size alone.
- Other per-product targets remain hats 5, hoodies 36, crewnecks 12, and T-shirts 17. Image combinations remain 57; the target retains all 48 original Shopify media attachments and adds 43 new photos, for 91 attachments if there are no independent user additions. The 142-record baseline and before-media read prompt remain unchanged.

## Technique flags

No selected combination has an `EMBROIDERY` or `DTFILM` exclusion. Comfort Colors 1717 has the literal supplier flag `T-SHIRT: "notFulfilled"` for **Blue Spruce S–3XL** and **Ivory 3XL**: seven distinct blank/colour/size combinations, repeated across the two tee designs (14 planned rows). This is a technique-specific restriction, not a general stock failure or an embroidery exclusion. These selected rows also report `isUnlimitedEmbroideryAvailable: true`. This review does not establish the actual fulfilment technique configured in Shopify or Printful.

## Removal validation

Regenerated the plan and all six family prompts. An independent comparison confirmed that the final target omits exactly the six approved IDs and preserves all other baseline IDs. The actual `verify-shopify.py` code was exercised against simulated exports held in memory: a complete 253-variant export passed; retaining an approved removal ID, deleting an unrelated original, and changing a retained original's price were each rejected. These checks did not create or overwrite a live Shopify verification report.

SHA-256 checks confirmed these audit inputs stayed unchanged:

- `variant-baseline.json`: `1094f47bcab5a2722c2158d5f96797177e0ef64e18dccdc863f98ecd594ca2c1`
- `prepared-batches/read-before-media.txt`: `0ed855e6f9641a543656cac5f1cf1c6b7ec0446797000aada79284a7aff7e39b`

## Saved before-media export

The saved export captured at `2026-10-29T05:05:22.286Z` preserves all 142 original IDs on their original 17 products. Exact base Colour assignments were checked while permitting the authorized Colour option addition; original Style/Size, prices, SKUs, tracking, and location/fulfilment configuration match the initial baseline. All 48 media IDs are unique. All 193 variant, media, inventory-level, and publication connections explicitly report `hasNextPage: false`. All 17 products are ACTIVE and published only to Online Store, with matching publication IDs in both publication fields. See `before-media-baseline-verification.json` for the saved comparison and source hashes.

The final validator now requires the same complete export schema, unchanged channel IDs/publication state, all 48 original media IDs on their original products, and the existing 136 retained / 6 removed / 117 new variant checks. It also compares inventory policy with the before-media export. An in-memory final-shaped export passed with 253 matched variant images, 91 media attachments, 48 retained media IDs, and 17 unchanged publication sets. Separate cases deleting a publication, deleting original media, truncating a connection, changing inventory policy, or omitting publication fields each failed. These are validator checks, not a claim that the live final Shopify update is complete.

## PDF spot check

Inspected the rendered `review-previews/page-1.png`, `page-3.png`, `page-6.png`, and `page-10.png` supplied after the final gallery/PDF build. No clipped cards, overlapping text, or image/colour-label mismatches were found on these four pages. AS Colour 5161 images have no drawcords; Comfort Colors 1567 images have matching drawcords. Evergreen hat and Black/Light Blue jacket images match their captions. The AI mockup / physical sample disclaimer is visible. Page 6 intentionally has three cards and unused lower-page space.

This is a review of the saved supplier snapshot and four rendered PDF pages, not a live-store verification or a manufacturing proof. The owner has resolved the six original 3XL exceptions by approving their removal. Actual Shopify changes are handled and verified separately.
