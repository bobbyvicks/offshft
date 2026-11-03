# OFF SHFT brand audit — 2 November 2026

The owner-approved lettering cleanup is live in Printful and on the public store. Banked Time's indented B/E came from the angular puff vector source. Those features and other affected E contours were straightened with words, layouts, palettes, outer bounds and production canvases retained.

## Applied changes

- 19 production SVG/PNG revisions with 25 reversible B/E edits, covering 169 variants across nine products: Banked Time Hat, Parked Trucker Hat, Punched Out Hat/Beanie/Bucket Hat/Hoodie/Quarter-Zip/Golf Shirt, and The Rest Is Ours Hoodie.
- 51 supplier-generated pictures replaced using Shopify Files > Replace. Existing media identities, gallery order and option associations are retained. Unchanged golf backs stay unchanged; The Rest retains a back-facing lead picture.
- Seven main and two smaller-hoodie finish artwork entries updated in the live theme.
- 13 outdated headwear description detail rows corrected to actual puff finishes, line counts and dimensions.

Canonical logos and approved rounded For a Reason/Ours to Spend artwork are unchanged. Website fonts remain Unbounded for headings/accent and Archivo for body/subheadings.

## Verification

The current catalogue has 47 products, 1,153 variants, 335 pictures and 265 style/colour/finish contexts. Every variant has an associated image and a matching navigation tuple. All 107 distinct production PNGs matched local source MD5 hashes, pixel dimensions, DPI and transparency. Source artwork and all 335 picture contact sheets were visually reviewed. Five tightly cropped For a Reason/Ours to Spend sources intentionally touch their canvas edges.

Current official metadata for all 21 supplier bases covers 1,795 non-preview bindings. Every canvas fits its declared placement, using only documented supplier aliases. Native Banked Time reopening confirms the corrected file, 5.50 × 2.00 inch canvas, 0° rotation, 3D puff, 1801 White and 1672 Old Gold. This does not claim 1,153 individual native Transform-panel inspections.

The fresh final API reread passes for all 1,153 mappings: exactly 169 intended artwork substitutions; original blanks, prices, SKUs, sizes, colours, options and ignored flags retained. All 81 headwear variants retain 3D puff. Eight existing Stone Small golf stock holds remain.

The public check compares every decoded RGBA pixel of all 51 replacements with its supplier PNG: every pixel matches and all corners are transparent. Shopify re-encodes PNG containers, so byte hashes can differ. The other 284 already-transparent pictures are retained. All 335 media identities/order and all variant associations are unchanged. All 13 description changes are public.

Both published artwork JSON assets match their saved revisions. Reversing the approved artwork references reproduces the original metadata exactly. A live colour/design switch retained Dad Hat / Black from Banked Time to Punched Out. Oversized / Embroidered / Bone displays the corrected hoodie picture and 9.7 cm chest closeup.

## Supplier behaviours handled

Early file-only saves cleared thread arrays on six white embroidered golf variants. Their exact original palettes were restored; subsequent saves explicitly included original options. The final full-catalogue readback passes. Hex letter-case normalization is accepted as the same RGB colour; cleared or changed palettes are rejected.

Catalogue 969 declares front print as id `default`, type `front`. Its update endpoint rejected the saved alias; sending documented `front` succeeded and read back as original `default`. The rejected request was independently confirmed unchanged before the corrected save. Production verification retains exact saved roles.

## Evidence and maintenance

`production-cleanup-verification.json`, `public-rollout-verification.json` and `supplier-field-audit.json` record the checks. `banked-live.png` is live proof. `lettering-review/before-after.png` is the approved historical comparison. `theme-after/` contains the current two artwork overlays; preserve the latest design-availability/navigation controller in future theme packages. `../printful-setup/clean-type-v1/production/` contains current production sources. Older generators and theme snapshots alone can restore superseded artwork.

Raw account snapshots, mutation receipts and credential operations remain local. No credentials or account contact details belong in the PR.

No physical sew-out, digitizer acceptance, paid sample or checkout transaction was performed. A physical sample remains the final check for actual stitching, fabric, colour and placement tolerances. Billing, shipping, tax, payments and order settings were outside this pass.
