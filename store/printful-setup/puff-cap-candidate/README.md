# Ours to Spend — puff candidate

**Owner approved this puff artwork on October 29, 2026**, after viewing the comparison proof at 148.12 × 48.19 mm in all three existing palettes. It is selected for the Ours to Spend. Trucker Hat only. This is outlined artwork, not supplier-accepted digitization or a stitch file. Supplier digitization and a physical sample remain separate checks.

Open [comparison-proof.png](comparison-proof.png) first. Its two identical 149.9 × 50.8 mm frames show the original and candidate at the same physical scale. The [SVG proof](comparison-proof.svg) is 190 × 244 mm for actual-size output when printed at 100%; the palette thumbnails are reduced. Background swatches are flat colour references, not garment or thread simulations.

## Proposed change

The candidate is **148.12 × 48.19 mm** (exact SVG bounds 148.1189 × 48.186 mm), compared with the approved **85 × 25.884 mm** design. It retains `OURS TO` / `SPEND.`, left alignment, the same Unbounded letter origins and all three palettes. It is substantially larger, heavier and rounder at the terminals. The period grows from 3.147 mm to **5.8 mm**. It uses nearly the full cap embroidery field; this footprint and softer lettering are part of the owner's decision.

This is a controlled adaptation of the existing outlined Unbounded Bold artwork, not a claim to use a different font weight. The installed Unbounded source is weight 700. A simple proportional enlargement was rejected because its thin E bar would require about 210 mm overall width to reach the puff minimum.

## Candidate assets

| Garment colours | Palette | Outlined source | Transparent 600 DPI render |
|---|---|---|---|
| Evergreen, Navy | Bone / Sun | [candidate-bone-sun.svg](candidate-bone-sun.svg) | [candidate-bone-sun.png](candidate-bone-sun.png) |
| Khaki | Ink / Rust | [candidate-ink-rust.svg](candidate-ink-rust.svg) | [candidate-ink-rust.png](candidate-ink-rust.png) |
| Caramel | Bone only, including period | [candidate-bone.svg](candidate-bone.svg) | [candidate-bone.png](candidate-bone.png) |

All three PNGs are **3499 × 1138 px**, RGBA with transparent backgrounds and embedded sRGB/600 DPI metadata. All three SVGs share identical geometry. Brand targets remain Bone `#ECE5D3`, Sun `#D29B3C`, Ink `#1F2733` and Rust `#B4552D`. No supplier thread substitution is encoded. The [manifest](manifest.json) records dimensions and hashes; [measurements.json](measurements.json) contains the complete per-glyph final and construction contours.

Set the selected artwork width to **148.12 mm** with its aspect ratio preserved. Do not reduce it to the old 85 mm footprint or rely on an automatic fit that shrinks it; the measurements apply at the stated size only.

## Construction and measurement limits

[build.cjs](build.cjs) reads the existing [approved 85 mm SVG](../../../designs/13-ours-to-spend/design.svg), enlarges its letter geometry to a 19.75 mm source cap height, expands it by 0.80 mm, and explicitly opens the S mouths. It then constructs each letter from a connected inset core with a **2.65 mm round offset**, giving a nominal **5.30 mm rolling-disc envelope**. This is a documented geometric thickness model, not Printful's own measurement or an embroidery guarantee. It rounds corners and terminals visibly. The period is a separate 5.8 mm disc. No final whole-design scaling is applied after construction.

The builder rejects disconnected glyph cores, lost/extra counters and dimensions outside the cap field. Each O, R, P and D retains its intended counter. Ink-bound letter spacing is 1.8 mm, the word gap is 4.5 mm, and the row gap is 3.8 mm. Curve offsets use 0.0005 mm arc tolerance on a 0.0001 mm integer coordinate grid; those values describe vector computation, not manufacturing tolerances.

The independently written [geometry review script](independent-geometry-review.py) and its [results](independent-geometry-review.json), plus the [opening-clearance script](independent-opening-review.cjs) and [opening report](independent-opening-review.json), check the candidate rather than relying on the builder's summary. They distinguish structural thickness, open channels and counter calipers from meaningless zero distances at rounded or terminating contours.

| Independent geometric check | Final candidate result |
|---|---:|
| Connected positive rolling-disc construction | 5.30 mm nominal diameter, all 12 glyphs |
| Maximum inscribed-disc diameter, conservative upper bound | 9.934 mm, in N |
| Minimum adjacent-letter separation | 1.800 mm |
| Tested S opening clearance, limiting lower corridor | 1.628 mm |
| Tested E opening clearance | 1.876 mm |
| Smallest closed-counter caliper | 2.983 mm, in R |
| Period diameter | 5.800 mm |
| Original source hash and three-palette geometry | Preserved / matching |

The S/E tests independently verify that a 1.27 mm disc can reach each opening from the exterior. The limiting S gap is slightly smaller than the builder's nominal 1.64 mm slot at its join; the measured 1.628 mm value above governs. Together with the connected cores and counter checks, these support geometric suitability **for proof review**. They are not a supplier acceptance claim. The [format/source verification](format-verification.json) also confirms transparent sRGB/600 DPI PNGs, equal alpha geometry across all palettes and 48 unchanged hashes across existing approved sources and upload assets.

Printful currently asks for puff lines between **0.2 and 0.5 inches**, and at least **1.27 mm separation** between raised elements. Its dedicated article rounds the width range to 5–12.5 mm, while the general guide gives 5.08–12.7 mm. This candidate is assessed against the conservative **5.08–12.5 mm** range. No independent numeric puff text-height minimum is published. Flat embroidery and puff cannot be combined in the same front area. [Puff requirements](https://help.printful.com/hc/en-us/articles/50263211098769-What-is-3D-puff-embroidery-and-how-does-it-work), [general embroidery guide](https://help.printful.com/hc/en-us/articles/50263985175953-How-should-I-prepare-my-design-for-embroidery).

Supplier digitization review must confirm foam coverage, counters/openings, stitch treatment at joins and ends, the cap centre seam, placement and the actual thread mapping. A sew-out on the actual Yupoong 6606 remains necessary to assess the stitched result. A field-fit calculation and a flat proof do not establish production acceptance. Do not apply the canonical logo's separate 5.2 mm seam offset to this phrase.

## Rebuild and preservation

From the repository root, run `node store/printful-setup/puff-cap-candidate/build.cjs` with the existing repository `clipper-lib` dependency and Sharp available through the selected Node environment or `NODE_PATH`. No package installation is performed. Run `python store/printful-setup/puff-cap-candidate/independent-geometry-review.py` with NumPy available, then `node store/printful-setup/puff-cap-candidate/independent-opening-review.cjs`. These scripts write only inside this candidate folder. Re-run both reviews after any candidate geometry change.

The original [concept notes](../../../designs/13-ours-to-spend/notes.md), [approved colourways](../../../designs/next-round-colourways/colourways.json), canonical brand logo and previous PNG uploads are preserved. This selected puff adaptation replaces only this phrase's hat production artwork; it does not replace approved Shopify photos or any other logo. The source font's [OFL licence](../../../tools/fonts/OFL-unbounded.txt) remains in the repository. The wording and existing phrase-review limits are unchanged by this adaptation.
