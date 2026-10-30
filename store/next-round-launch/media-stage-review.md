# Media-stage verification

**PASS for the actual exported draft catalogue.** Checked `shopify-after-media-export.json` against the original morning `shopify-before-export.json`, the approved listing plan and media upload map. The raw exports were preserved unchanged.

- 21 products / 329 unique variants total: original 17 / 253 plus exactly 4 new / 76.
- All 4 new products are DRAFT and unpublished. Options, combinations and CAD prices match the plan.
- All 16 new media have the exact approved filenames and alt text, follow the planned colourway order, and explicitly report `READY`.
- All 76 variant-image assignments match their colours. Tracking is enabled, inventory policy is DENY, and every exported location explicitly reports available=0 and on_hand=0.
- Original product/variant IDs, titles, handles, statuses, options, prices, stock values, publication states, media IDs/order/alts and collection IDs/titles are preserved.

## Exact normalization evidence

The initial 14 comparison differences comprised three collection lists enriched with a newly exported `handle` field, plus eleven product media lists containing 19 changed URL version tokens. Collection memberships and titles were unchanged; comparisons now use the original snapshot's common collection fields, ID and title.

Both exact public CDN URLs for each of the 19 changed media were fetched independently. **All 19 pairs returned HTTP 200 with identical byte counts and SHA-256 hashes.** Exact source URLs, timestamps, hashes, lengths and responses are saved in `original-media-url-equivalence.json`. The verifier accepts only those explicitly evidenced product/media/old-URL/new-URL pairs; it does not generally discard query parameters. Media order, IDs and alt text remain strict comparisons.

**Historical limitation:** these fetches prove that both URL endpoints serve identical bytes at the time of this check. The morning export contains metadata and URLs, not captured image bytes. It cannot prove that the file bytes were identical at the historical export time, or attribute when/why a version token changed. Sidekick's earlier preservation comparison against an immediately pre-media snapshot does not replace this morning-baseline comparison.

## Processing state

The downloaded snapshot still reports `BATCH_PROCESSING` and four pending reorder jobs. Its actual media order and all 16 READY statuses already match the plan. The root agent subsequently reported a fresh UI job query with all four jobs `done=true` and no errors; that later job evidence is being saved separately by root. This report does not rewrite the stale snapshot or equate its batch status with completion. Publication remains a separate operation requiring the published-stage check.

## Reproduction

```text
python -B verify-launch.py --after shopify-after-media-export.json --stage media --url-equivalence original-media-url-equivalence.json
```

Output is saved as `media-stage-verification.json`: passed=true, zero original field changes after the specific evidence-based normalization, and 19 URL equivalences applied.

Before export SHA-256: `59f5ef9f4efa431c93dec31a8f8be78b69213220470135abecd06523d50e8853`.

After-media export SHA-256: `25a48e91ca8f481509e16a45fc42d71199b258357bc794eb740eba2ce4dbc070`.

Focused negative checks reject new-media reordering, original-media reordering, non-READY status, missing locations, missing on_hand evidence, changed collection titles, unverified URL changes and extra published channels. Published mode requires exactly Online Store active; other exported channels must be explicitly unpublished.
