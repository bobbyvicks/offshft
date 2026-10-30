# Pocket artwork placement

Completed for the owner's request to put the actual Logo/Clock artwork **on** the pocket. Only the ten existing Comfort Colors6030 Pocket/White/S–2XL variants are targeted. The24 Heavyweight configurations, Shopify IDs, retail prices and originally populated SKUs are protected. Printful can generate a nonempty supplier SKU when an activated Pocket variant previously had no SKU; these automatic fulfillment identifiers are recorded in sanitized verification. No API or credential call was made by this preparation agent; root performs any live execution and verification separately.

## Supplier evidence and size limitation

[Printful6030](https://www.printful.com/custom/mens/t-shirts/unisex-garment-dyed-pocket-t-shirt-comfort-colors-6030) explicitly lists DTG Pocket. Its product-specific embroidery list does not include pocket embroidery. The fresh root-captured `../private/pocket-artwork-placement/printfiles-before.json` identifies product593, pocket printfile191,450×300 at150DPI, fit mode: **3×2 inches**. White S–2XL uses catalogue variants15150–15154 respectively.

The [official v1 Modify a Sync Variant schema](https://developers.printful.com/docs/#operation/updateStoreSyncVariant) uses `EcommerceSyncVariantUpdate.files[]` → `File`. This schema has no `position`; width/height/DPI are read-only. `SyncVariantFile` adds only read-only stitch-count metadata. The [Orders API](https://developers.printful.com/docs/#tag/Orders-API) adds `position` specifically to order item files. No order endpoint is used here.

**No public API documentation found guarantees that transparent margins survive sync-file processing or that this canvas remains at exactly3×2in.** No guessed file option or `position` is sent. After saving the two S canaries, inspect their persisted Printful Designer: actual artwork must be centered on the physical pocket, Logo2in wide and Clock1in high. Correct native placement if needed and re-read supplier state before the other eight variants. Do not interpret `synced:true` or a1800×1200 uploaded-file dimension as proof of physical placement. The script's `--placement-verified` is an operator assertion, not an API test.

## Exact artwork files

`build-canvases.cjs` reads canonical `designs/mark/final/the-o/logo-light.svg` and `symbol-light.svg` with pinned source hashes. It preserves the full inner SVG, transforms, paths, palette and viewBox byte-for-byte, in an editable centered nested SVG. Only uniform scale and canvas position change; original files remain untouched.

| File | Whole transparent canvas | Artwork viewport |
|---|---|---|
| `logo-pocket-2in.svg` / `.png` |3×2in;1800×1200px at600DPI|2×0.57594866in; centered|
| `clock-pocket-1in.svg` / `.png` |3×2in;1800×1200px at600DPI|0.47192×1in; centered|

Both PNGs are transparent RGBA/sRGB. `canvas-manifest.json` preserves hashes and exact floating-point geometry. Both rendered files were visually inspected. Empty canvas is transparent, not black ink. Source scaling follows the SVG viewBox, avoiding raster rounding drift from the earlier PNG exports.

## Guarded execution for root review

Default is offline and does not import the credential client. The private snapshots are local inputs; do not commit them.

```powershell
python -B store/printful-setup/pocket-artwork-placement/apply_pocket.py
python -B -m unittest discover -s store/printful-setup/pocket-artwork-placement -p 'test_*.py'
```

Rebuild artwork using the existing Sharp renderer (set NODE_PATH to the bundled node_modules if required):

```powershell
node store/printful-setup/pocket-artwork-placement/build-canvases.cjs
```

After root reviews and publishes these exact PNGs at an immutable40-character Git commit, the optional apply path uses only the existing scoped `printful_client.py`:

```powershell
python -B store/printful-setup/pocket-artwork-placement/apply_pocket.py --apply --commit COMMIT_SHA --phase canary
# Root checks saved native Designer for both actual on-pocket sizes/centering.
python -B store/printful-setup/pocket-artwork-placement/apply_pocket.py --apply --commit COMMIT_SHA --phase remaining --placement-verified
```

The canary stage uploads the two exact immutable-URL canvases, checks their ready status/dimensions, then configures only Logo S and Clock S. The remaining stage requires both canaries and the explicit placement assertion. A private ledger prevents silent mutation retries; ambiguous outcomes retain `inflight` and require manual readback/reconciliation. Do not delete the ledger to bypass an uncertainty. Every mutation is followed by product readback; untouched variants are compared against baseline, target identities/prices/originally populated SKUs remain fixed, and exactly one ready `pocket` production file is required. The scoped client supplies7-second mutation pacing.

Live Logo S readback showed Printful automatically adding supplier SKU `6974850` where the original was null, although no SKU was sent. The target-only guard accepts a newly generated nonempty string only when the baseline SKU was null or empty, then records `{syncVariantId,shopifyVariantId,sku}` in `apply-verification.json.generatedSupplierSkus`. A changed previously populated SKU, an invalid generated value, or any SKU change on an untouched variant still fails. This is necessary supplier-generated fulfillment metadata; it does not establish whether Shopify subsequently displays that SKU. Root checks Shopify separately. The script also accepts only an empty options list or the exact observed12 empty/default Printful options: flat embroidery type, false lifelike and empty arrays for the observed thread/license IDs. It rejects active thread selections, puff, unknown/duplicate/incomplete defaults and type coercion.

Practical Logo S payload (replace the file ID with its verified upload ID):

```json
{
  "variant_id":15150,
  "files":[{"id":123,"type":"pocket"}],
  "options":[],
  "is_ignored":false
}
```

PUT target: `/sync/variant/5605512017`. Clock S uses `/sync/variant/5605512034`, same catalogue variant, its own artwork ID. `plan.json` contains all10 exact identity tuples. No retail price, inventory quantity, order, payment, Shopify media or product-wide update is sent. Clearing ignored for these ten is necessary to enable their requested fulfillment mapping; all Heavyweight states remain as captured.

## Validation

19 offline tests pass: exact ten targets; no Heavyweight/3XL targeting; external product/variant/colour identity guards; membership; payload allowlist; protected state and price drift; exact ready-file readback; unknown ledger IDs; immutable URL restriction; exact SVG inner markup/source hashes; transparent centered canvas geometry; supplier field drift; exact supplier defaults; and generated-SKU acceptance/reporting with populated/untouched/invalid-SKU rejection. Python syntax and offline CLI also pass. Tests first failed before implementation, including the supplier-default and generated-SKU cases before their guarded acceptance was added.

Completed: exact artwork published at commit `83b6f7ed5d6142d0083b25e0b65854bbc2cd971e`; both saved Small designs inspected in native Printful Designer; all ten Pocket/White/S–2XL variants applied and verified with fresh API readback. Transform retained the full 3-by-2-inch transparent canvas and centered both marks on the actual pocket, yielding the intended 2-inch Logo width and 1-inch Clock height. No UI design edits were needed. All 24 Heavyweight configurations and all 34 variant identities/retail prices remain unchanged. The final readback includes all ten supplier-generated SKUs. No order or checkout was submitted; this scoped product setup does not certify store-wide billing or launch readiness.

Shopify fulfillment activation is now separately complete. Root found Printful App unchecked in each Pocket variant's Edit inventory locations despite existing app stock, then selected only Printful and saved all ten. Existing Shop location selection, quantities, inventory tracking and oversell settings were preserved. Refreshed Canada/CAD active-theme previews showed S-2XL available for both designs, unsupported3XL unavailable, correct White pocket previews and Add to cart enabled. Both2XL items entered the cart successfully for an estimated C$89.98 total before shipping/taxes, and both test items were removed afterward. The existing C$8.59 Canada Printful rate was inspected but not changed or tested at checkout. Exact IDs and evidence are in [Shopify fulfillment verification](../../pocket-artwork-placement/shopify-fulfillment-verification.json). This confirms scoped product availability and cart addition; checkout, billing, payment and order fulfillment remain untested.
