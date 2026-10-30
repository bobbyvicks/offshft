# FOR A / REASON. production artwork

Prepared from the owner-approved three-colour concept. The two outlined SVGs and transparent PNGs share identical geometry: **117.0501 × 47.6944 mm**, with a 6 mm accent period. PNGs are **2765 × 1127 px, RGBA sRGB, 600 DPI**.

| Colour | Blank / catalogue variant | Artwork | Placement | Puff thread option |
|---|---|---|---|---|
| Charcoal | Yupoong 6606 / 20390 | `for-a-reason-bone-sun` | `embroidery_front_large` | `thread_colors_3d_front_large` |
| Ivory/Ivory | Comfort Colors CCST0 / 52941 | `for-a-reason-ink-rust` | `embroidery_front` | `thread_colors_3d` |
| Evergreen | Yupoong 6606 / 20393 | `for-a-reason-bone-sun` | `embroidery_front_large` | `thread_colors_3d_front_large` |

Bone/Sun uses letters `#ECE5D3`, period `#D29B3C`. Ink/Rust uses letters `#1F2733`, period `#B4552D`. These are brand artwork targets; supplier thread selection is a separate mapping. Set `embroidery_type` to `3d` for the chosen placement.

Both blanks have a verified **149.86 × 50.8 mm** front field. The PNG is cropped to the artwork, not a full-field positioning canvas. Set the physical artwork size explicitly and verify the configured supplier placement. Centering this size within the field gives offsets of **16.40495 mm horizontally / 1.5528 mm vertically**. DPI metadata alone does not demonstrate placement.

The controlled Archivo Bold outlines retain the approved text, left alignment, compact two-line proportions, rounded weight and accent period. This is a production adaptation of an AI visual, not an exact font trace: the A counters are deliberately opened and rounded; the R counters are enlarged with flatter bowls. See `comparison-proof.png` beside the original reference and `colourways-proof.png` for the three palettes. The original reference is copied byte-for-byte as `approved-mockup.png`.

Independent source-geometry checks pass: connected 5.3 mm rolling-disc letter cores; all expected counters; 1.8 mm minimum inter-letter gap; A/R/O counter calipers 2.1997/3.0127/5.957 mm; selected F/E/S open-mouth corridors at least 1.3337 mm; maximum inscribed-disc upper bound 9.5982 mm. See `independent-review.md` and the hash-keyed JSON evidence for exact methods and limitations. This verifies source geometry, not supplier digitization or a sewn sample.

`build.cjs` reproduces the artwork from the existing licensed Archivo font without modifying it. `measurements.json` records the final/core polygon coordinates. `manifest.json` identifies files, checksums, palette and supplier mapping. The builder intentionally starts regenerated files at review-pending status; run the independent checks after a rebuild.

No existing approved design, live product, API state or Git state was changed by this artwork preparation.
