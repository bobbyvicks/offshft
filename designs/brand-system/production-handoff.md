# OFF SHFT — production handoff

Version 1.0 · 28 October 2026
**Status: source artwork selected; applications require supplier proofs, sew-outs and sample fitting.**

This handoff covers hats, oversized hoodies, baggy sweats, clothing labels and packaging. The artwork comes from the chosen “The O” identity. It is not a completed garment specification, a stitch file or an order to manufacture. A mockup is a visual placement study; it is not evidence that a material, finish or construction has been tested.

## Supply the source files

Use the vectors in `designs/mark/final/the-o/` from commit **`fee1e64830101e2dc1e7daa40c77d5d97aabab77`** (`fee1e64`). Supply the selected SVG, a flat colour preview, final artwork dimensions and a placement drawing for the actual product. Include the generated `notes.md` for embroidery; it contains the detailed compensation and stitch instructions.

| Job | Select |
|---|---|
| Two-colour logo on Bone | `logo-light.svg` — Ink + Rust |
| Two-colour logo on Slate or Spruce | `logo-dark.svg` — Bone + Sun |
| Hat front at cap height 7 mm | `logo-light-cap7.svg`, or corresponding approved dark artwork at the same dimensions |
| Single-thread logo | `logo-one-colour-ink.svg` or `logo-one-colour-bone.svg`, according to fabric |
| Secondary 25 mm symbol | Appropriate `symbol-*.svg` master |
| Small side placement | Appropriate `side-*.svg` master at its supplied dimensions |

The one-colour logo has different geometry and no pivot dot. Its supplied dimensions are 62.64 × 18.97 mm, compared with 62.64 × 18.04 mm for the cap-7 two-colour logo. Do not flatten a two-colour logo to one fill or force these versions to the same height. One-colour symbol and side artwork have their own pivot treatment; use the files rather than applying the lockup's no-dot rule to every mark.

Keep `hands-centre/`, comparison fonts and exploratory designs out of the supplier package. If artwork needs a new technical size, use `build.cjs` to regenerate it and review the output. Do not edit the generated `notes.md` or redraw paths by hand. Archive any approved application artwork separately with its exact size and revision.

## Existing requirements from the selected source

These are the existing design and digitizing instructions in `designs/mark/final/the-o/notes.md`; they are not evidence of a completed factory trial.

| Application | Existing floor or requirement |
|---|---|
| Two-colour hat-front logo | Cap height 7 mm; 62.64 × 18.04 mm overall; retains the pivot dot |
| Two-colour lockup absolute floor | Cap height 6.6 mm, approximately 59.1 × 17.1 mm; a separate no-dot construction below cap 7 |
| One-colour lockup | Cap height 7 mm minimum; wider channel and no pivot dot |
| Two-colour main symbol | 19 mm total height minimum |
| One-colour main symbol | 20.5 mm total height minimum |
| Under 19 mm | Dedicated side master only; two-colour 8.36 × 16.58 mm, one-colour 8.59 × 16.86 mm; do not reduce the main symbol |
| Unbounded Bold embroidered text | 6.6 mm cap height minimum, 0.12 em tracking and the source S trims; smaller text needs a separately approved lighter face |
| Larger main symbol | Plain satin up to 45 mm; above this use split satin or tatami. From 35 mm use a 1.5 mm channel |

The small master is a dedicated drawing, not permission to reduce it without limit. Its transfer to a woven or printed label remains a new application requiring proof. Supplier processes may require a larger size than the artwork's embroidery floor.

Digitize every size separately. **Never scale a stitch file.** For any size change, review the geometry and generate the correct artwork before digitizing. The original notes specify stitch order, underlay, pull compensation, ring adjustment, hand-root and tip pullback, S terminal handling, F-slot treatment and F–T separation; send those notes in full rather than relying on a mockup.

For six-panel caps, shift the full logo **5.2 mm right in the front view** so the centre seam falls within the word space. Five-panel and seamless fronts remain centred. Verify this on the actual cap and supplier placement drawing. The offset is specific to the source cap-7 placement; do not automatically reuse it after changing the logo size.

## Proposed first samples

| Product | Initial artwork proposal | Placement proof needed |
|---|---|---|
| Oversized hoodie | Full two-colour logo, 80 mm wide | Wearer's left chest; record distances from agreed garment reference points after checking the actual blank |
| Baggy sweats | Main two-colour symbol, 25 mm total height | Wearer's left upper thigh; confirm pocket, seam and seated-wear clearance |
| Hat | Full logo, cap height 7 mm; 62.64 × 18.04 mm in two colours | Front placement with the source seam rule for the chosen panel construction |

These are initial placement samples, not approved manufacturing measurements. For an 80 mm-wide hoodie logo, a proportional rendering is appropriate for a visual mockup; the final production drawing must be regenerated or technically reviewed at that size, then digitized separately. Do not infer stitch compensation or final sew-out dimensions from a scaled preview.

Fit the hoodie and sweats on body before freezing the position. Check the intended oversized and baggy proportions, drape, comfort, mark visibility and consistency across the planned size range. Final garment measurements, grading, material and fabric weight remain to be specified; this package makes no verified fibre, GSM, origin or performance claim.

## Colour approval

| Target | HEX |
|---|---|
| Bone | `#ECE5D3` |
| Ink | `#1F2733` |
| Rust | `#B4552D` |
| Sun | `#D29B3C` |
| Sage | `#9AA383` |

Use Ink + Rust on Bone and Bone + Sun on Slate or Spruce. Oat uses Ink + Rust only if a sew-out passes; otherwise use the Ink one-colour master. Moss and Rust use the Bone one-colour master. Two-colour remains the default front logo outside the listed exceptions and genuine tonal or single-thread jobs.

Match HEX targets to a physical thread card, then approve the real blank and sew-out together. The original notes give Isacord 40 and Madeira Polyneon 40 as examples, not selected suppliers or confirmed thread codes. Record the actual manufacturer, range, code and approved sample. Do not invent Pantone, CMYK or thread equivalents from the display values.

For print, ask the supplier to specify the production colour system for the chosen stock and process. Approve a physical proof. Bone printed on white stock, uncoated paper and a Bone-coloured textile will not necessarily reproduce identically.

## Sew-out acceptance

The following measurable gates come from the existing artwork notes:

- Both gaps between clock ring and hands remain at least **0.8 mm open** on the actual blank.
- The O counter and both S apertures remain open. The digitizer instructions target finished S apertures of approximately **0.9–1.0 mm**.
- In the two-colour cap-7 lockup, the pivot retains at least **1.0 mm of open fabric all around** after stitching.
- The main symbol's pivot is centred within **0.2 mm**.
- The F slot targets at least **1.1 mm** finished; if it remains below 1.0 mm, follow the controlled artwork-adjustment instruction in `build.cjs` and `notes.md`, then resample.

Also review readability, colour contrast, puckering, backing comfort, hand-tip definition and placement on the finished item. These visual and wear checks are new application-review recommendations. Record photographs and the physical sample reference. A passed screen proof does not replace a sew-out.

## Clothing-label proof

Choose the label process with the supplier: printed, woven or another agreed construction. Confirm the finished visible face, total cut dimensions, folds, seam allowance and attachment method before preparing production artwork. The source embroidery dimensions are not validated woven-label or print limits.

Use the full logo on a spacious neck or waistband label and the dedicated small clock master for a small secondary trim trial. Maintain the proposed one-ring-diameter clearspace measured outside all hand tips. If the fold or seam encroaches on this area, enlarge the usable face or change the label layout.

Keep size and other functional information separate and readable in Archivo. Proof at 100% physical size. Confirm that a folded label still shows the full mark, sits comfortably and survives the agreed care test on the actual garment.

Only add verified product information. Fibre content, country of origin, care instructions, business identification and any other required particulars must be supplied and checked for the actual item and intended sales markets. Blank placeholders are working fields, not approved label copy. This handoff provides design and production coordination notes, not legal advice or a compliance certification.

## Packaging proof

Use a supplier-provided dieline for each tag, sticker, mailer or carton. Confirm finished size, printable areas, folds, glue zones, hole position, trim and bleed before exporting final artwork. Measurements shown in concept layouts are proposals until mapped to that dieline.

Use the full name on the primary face, with the symbol as an optional secondary detail. Choose the approved two-colour artwork or the dedicated one-colour master for a single-ink job. Keep the brand clear of shipping labels and functional information. Do not add an environmental or certification badge without verified support.

Approve a physical proof for colour, registration, small gaps, trimming and substrate. Check any printed URL, QR destination, product identifier or barcode before release. Optional copy such as “Your time.” remains a separate proposal and is not part of the selected logo or a newly approved slogan.

## Release record

Complete one record for each product, artwork size, colourway and process:

| Field | To record after confirmation |
|---|---|
| Product | Supplier, blank or style reference, size range and fabric colour |
| Artwork | Exact source filename, revision, visible dimensions and colourway |
| Position | Reference points, distances and orientation on the actual item |
| Process | Embroidery, print or label method; supplier file specification |
| Colour | Physical thread or ink references and approved sample ID |
| Proofs | Actual-size artwork proof, sew-out where relevant, label or packaging proof |
| Fit and wear | Sample size, placement result, comfort and agreed care-test result |
| Product data | Confirmed information for labels, tags and any codes |
| Approval | Approver, date, sample revision and supplier confirmation |

Prepare proofs and sample specifications before commissioning work. `AGENTS.md` reserves spending, publishing, store changes and other listed external actions to the owner. This package does not place an order or authorize a supplier fee.

## Open items and evidence limits

No supplier, blank, final fabric composition, garment specification, digitized stitch file, physical thread match, sew-out, woven-label proof, packaging dieline or fitted sample is approved by these documents. The source notes describe agent image-read tests, not consumer research or physical manufacturing tests; do not present their scores as market validation.

Source provenance is `fee1e64`, chiefly `BRAND.md`, `README.md`, `AGENTS.md`, `designs/mark/final/the-o/notes.md`, `designs/mark/final/the-o/build.cjs` and the SVG masters in that directory. Exact SVG width and height attributes are used where this handoff is more precise than the rounded generated notes. New layout recommendations are documented in `brand-guidelines.md` and identified as proposals. The final source artwork remains unchanged.
