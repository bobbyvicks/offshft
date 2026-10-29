# Production artwork handoff

Prepared 29 October 2026. **12 transparent PNGs cover the 16 approved colourways and four separate hoodie-front placements.** These are exact-art upload files. No supplier upload, thread selection, digitization, stitch approval or fulfilment configuration was performed here. Printful is installed; the intended account and its configuration remain to be established in the authenticated workflow.

Open the [PNG upload folder](production-uploads/png/), [machine-readable manifest](production-artwork-manifest.json) or [20-row placement map](production-placement-map.csv). Paths in the manifest and CSV are relative to the repository root. The [validation report](production-artwork-verification.json) records source/output hashes and pixel checks. The [official workflow](official-workflow.md) covers connection and fulfilment separately.

## Upload files and physical sizes

All PNGs are RGBA, sRGB, transparent, approximately 600 DPI at the stated size, with no added review padding. Set the **artwork width** explicitly in Design Maker and preserve its aspect ratio; do not rely on automatic scaling. The copied SVGs in [production-uploads/svg/](production-uploads/svg/) are byte-identical to their approved sources. Integer pixel rounding accounts for very small differences from an exact 600 DPI calculation.

| Application | PNG files | Pixels | Intended artwork size |
|---|---|---:|---:|
| Time Well Earned tee | [Ink/Rust](production-uploads/png/11-time-well-earned-ink-rust-95mm.png), [Bone/Sun](production-uploads/png/11-time-well-earned-bone-sun-95mm.png) | 2244 × 1073 | 95 × 45.434 mm |
| The Rest Is Ours hoodie back | [Ink/Rust](production-uploads/png/12-the-rest-is-ours-ink-rust-240mm.png), [Bone/Sun](production-uploads/png/12-the-rest-is-ours-bone-sun-240mm.png) | 5669 × 1553 | 240 × 65.761 mm |
| Ours to Spend cap | [Ink/Rust](production-uploads/png/13-ours-to-spend-ink-rust-85mm.png), [Bone/Sun](production-uploads/png/13-ours-to-spend-bone-sun-85mm.png), [Bone only](production-uploads/png/13-ours-to-spend-bone-85mm.png) | 2008 × 611 | 85 × 25.884 mm |
| 5:00 crewneck | [Ink/Rust](production-uploads/png/14-five-oclock-ink-rust-115mm.png), [Bone/Sun](production-uploads/png/14-five-oclock-bone-sun-115mm.png), [Bone only](production-uploads/png/14-five-oclock-bone-115mm.png) | 2717 × 649 | 115 × 27.468 mm |
| Canonical hoodie front logo | [Ink/Rust](production-uploads/png/off-shft-front-logo-ink-rust-62.64mm.png), [Bone/Sun](production-uploads/png/off-shft-front-logo-bone-sun-62.64mm.png) | 1480 × 426 | 62.64 × 18.04 mm |

The artwork retains Ink `#1F2733`, Rust `#B4552D`, Bone `#ECE5D3` and Sun `#D29B3C`. Bone here is the approved **artwork/thread target**, distinct from the `#E4DDCB` flat-preview background. Transparent pixels must remain transparent; do not add a white or garment-coloured background. Product photographs and generated mockups are listing media, not production artwork.

## Exact colourway assignments

Each clothing row covers S, M, L, XL, 2XL and 3XL; each cap row covers One size. This is 76 Shopify variants, 16 colourways and 20 decorated colourway placements. Hoodie back and front are separate files on the same intended garment.

| Existing product / blank | Garment colour | Main artwork | Separate front logo |
|---|---|---|---|
| Time Well Earned / CC1717 / 15478491971906 | Blue Spruce | Bone/Sun | — |
| Same | Ivory | Ink/Rust | — |
| Same | Pepper | Bone/Sun | — |
| Same | Blue Jean | Bone/Sun | — |
| The Rest Is Ours / CC1467 / 15478492004674 | Blue Jean | Ink/Rust back | Ink/Rust |
| Same | Ivory | Ink/Rust back | Ink/Rust |
| Same | Pepper | Bone/Sun back | Bone/Sun |
| Same | Butter | Ink/Rust back | Ink/Rust |
| Ours to Spend / Yupoong 6606 / 15478492037442 | Evergreen | Bone/Sun | — |
| Same | Navy | Bone/Sun | — |
| Same | Khaki | Ink/Rust | — |
| Same | Caramel | Bone only, including period | — |
| 5:00 / CC1466 / 15478492070210 | Ivory | Ink/Rust | — |
| Same | Blue Jean | Ink/Rust | — |
| Same | Pepper | Bone/Sun | — |
| Same | Espresso | Bone only, including colon | — |

The light/dark names are artwork variants, not a general rule for every similarly named fabric. In particular, CC1717 Blue Jean uses Bone/Sun while CC1467 and CC1466 Blue Jean use Ink/Rust. The [approved colourway manifest](../../designs/next-round-colourways/colourways.json) governs these assignments.

## Placement and supplier acceptance

- **CC1717:** centered chest embroidery, 95 mm wide. The public Centered embroidery area is 101.6 × 101.6 mm. The text cap height is 11.435 mm. Retain the three-line, left-aligned composition inside that placement.
- **Yupoong 6606:** front embroidery, 85 mm wide. The public Front area is 149.9 × 50.8 mm. Cap height is 10.261 mm. Check the centre seam against the actual letters; the canonical logo's separate 5.2 mm hat offset is not an instruction for this phrase.
- **CC1466:** centered on the chest using **Large Front embroidery**, 115 mm wide. The 254 × 152.4 mm Large Front area fits; the ordinary Centered field is only 101.6 mm wide. Cap height is 26.344 mm. The digitizer must choose suitable fill for the larger strokes. The horizontal opening in the 5 is intentional source geometry.
- **CC1467:** upper-back **DTG**, 240 mm wide, plus canonical **wearer's left-chest embroidery**, 62.64 mm wide. Preserve both applications. The selected garment photo shows only the back. Public evidence lists both placements separately but does not establish that chest embroidery and back DTG can coexist in one saved product. Large Back DTG is listed for M–3XL; a regular Back placement for S remains unconfirmed. Verify both techniques and the S configuration in the authenticated designer before treating all 24 hoodie variants as ready. Do not substitute a front print, wrist embroidery, different blank or different size range without an explicit decision.

These template bounds are from the [fresh product-specific placement evidence](../next-round-launch/availability-recheck/2026-10-29T20-29-40-927Z/placement-evidence.json), not proof of digitization acceptance. Printful's [embroidery guide](https://help.printful.com/hc/en-us/articles/50263985175953-How-should-I-prepare-my-design-for-embroidery) currently specifies 6.35 mm minimum text height, 1.27 mm line thickness and 6.35 mm negative space. The three new embroidered phrases/numerals clear the height check only. The canonical front logo contains much smaller designed channels, so supplier review must resolve that spacing conflict without silently redrawing it.

The [canonical digitizer notes](../../designs/mark/final/the-o/notes.md) govern the clock, apertures, compensation and sew-out checks. Keep the clock at 12 and 5, preserve the pivot dot at this size, and keep the approved geometry. Digitize each physical size separately rather than scaling a stitch file. Actual-blank sew-outs and placement/colour proofs remain the production-quality checks; no DST/PES or other stitch file is supplied here.

## Thread mapping remains a decision

The [candidate thread list](thread-candidates.json) records the current standard Printful palette and a screen-colour comparison only. No candidate is a physical match, an approved substitution or an instruction to select it. No production PNG was recoloured. Review the actual account's **Color & details** mapping instead of accepting automatic nearest-colour selection unnoticed. Bone-only Caramel and Espresso must stay one colour, including their punctuation.

| Artwork target | Nearest two published screen swatches, ranked by ΔE76 |
|---|---|
| Bone `#ECE5D3` | White 1801 (13.16), Grey 1718 (29.39) |
| Ink `#1F2733` | Black 1800 (17.80), Navy 1966 (27.34) |
| Rust `#B4552D` | Orange 1987 (21.25), Red 1839 (23.53) |
| Sun `#D29B3C` | Old Gold 1672 (24.10), Gold 1951 (34.77) |

These are substantial screen differences. The ranking uses sRGB-to-CIELAB under D65 and does not account for thread sheen, fabric or lighting; the second-ranked entries are comparison points, not endorsed alternatives.

The public picker offers Standard/Unlimited colour for CC1717, CC1467 and 6606; CC1466 does not establish an Unlimited option. Do not promise that method for the crewneck. Even an Unlimited option does not guarantee an exact physical match. Confirm the final thread choices and retain the supplier's mapping with the production record.

## Existing files and conversion checks

The approved outlined SVGs already contain the exact production geometry. Existing review PNGs have sufficient pixels for many uses, but the four original concept sets include review padding and 72 DPI metadata. The hoodie back reference has about 186 effective DPI at its intended width; this meets Printful's stated 150 DPI DTG floor, though it is below 300 DPI. The new files standardize the native artwork canvas and resolution directly from vector sources; they are not enlarged raster previews. Existing canonical logo and Bone-only reference PNGs are also usable pixel sources, but the standardized versions make physical sizing consistent.

Printful recommends [transparent PNG at 300 DPI or higher for embroidery](https://help.printful.com/hc/en-us/articles/50263236672017-Can-I-use-my-own-digitized-file-for-embroidery), [at least 150 DPI for DTG](https://help.printful.com/hc/en-us/articles/50264138559377-Is-there-a-difference-in-quality-between-150-and-300-DPI), and [sRGB print files](https://help.printful.com/hc/en-us/articles/50264019148177-How-should-I-prepare-my-print-file-for-the-best-results). These 600 DPI exports exceed those pixel-density thresholds. Product-specific upload acceptance and stitch suitability still need the supplier checks above.

Validation confirms 12 transparent sRGB PNGs at the intended dimensions, unchanged source SVG/reference hashes, byte-identical SVG copies, exact opaque brand-colour pixels, and identical alpha geometry across palette versions. Representative PNGs for every design and all three palette types were visually inspected. The render uses the unchanged SVG viewBox/paths/colours and an explicit pixel canvas; no redraw, crop, new padding or colour substitution was made. Rebuild with [build-production-uploads.cjs](build-production-uploads.cjs) in the existing Node/Sharp environment; verify with [verify-production-uploads.py](verify-production-uploads.py) in Python with Pillow and NumPy.

Source production notes: [tee](../../designs/11-time-well-earned/notes.md), [hoodie](../../designs/12-the-rest-is-ours/notes.md), [cap](../../designs/13-ours-to-spend/notes.md), [crewneck](../../designs/14-five-oclock/notes.md). This handoff adds format conversions and an explicit mapping; it does not replace those approved sources.
