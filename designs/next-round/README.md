# OFF SHFT - next round concept review

Four draft concepts for review, not released products. The package preserves the supplied artwork and mockups; it does not establish physical production quality or phrase clearance.

| Concept | Garment pairing | Artwork shown |
|---|---|---|
| 11 - TIME WELL EARNED. | Blue Spruce Comfort Colors 1717 tee | Dark garment: Bone / Sun |
| 12 - THE REST IS OURS. | Blue Jean Comfort Colors 1467 hoodie, back view | Light garment: Ink / Rust; phrase on the back, separate approved front logo specified in notes |
| 13 - OURS TO SPEND. | Evergreen Yupoong 6606 trucker | Dark garment: Bone / Sun |
| 14 - 5:00 | Ivory Comfort Colors 1466 crewneck | Light garment: Ink / Rust |

## Build

Use Python with `reportlab` and `pypdfium2` installed. No absolute workstation paths, network access, browser, or image-editing tools are required.

```text
python build-review.py --check
python build-review.py
```

Run only after all four source folders contain the selected `mockup-v2.png`, both SVG colour versions, both transparent PNG artwork renders, `measurements.json`, and `notes.md`. Initial `mockup.png` photos stay in the repository but are excluded from the gallery, PDF, and ZIP; the builder requires all four selected v2 mockups. These are fresh generations using artwork-only references, not edits to the initial garment photographs. It fails before writing any output if a required source is missing. It reads sibling design folders and `../next-round-research.md` in the repository. From an extracted ZIP, it instead reads the included `concepts/` folders and research file.

## Outputs

- `index.html`: offline gallery with four concept cards, a mockup/artwork switch, embedded images, and embedded SVG/notes/research downloads. Keep the PDF beside it for the PDF download link.
- `OFF-SHFT-Next-Round-Review.pdf`: five landscape pages, with a four-concept overview followed by one page per concept.
- `contact-sheet.png`: the complete first PDF page rendered for inline viewing.
- `OFF-SHFT-Next-Round.zip`: self-contained gallery, PDF, contact sheet, this builder and README, fonts with their OFL license when available, the research report, and all four concept folders excluding superseded mockup PNGs. Exactly four selected v2 mockup photos are included. Canonical brand SVGs and notes are included at the relative path linked from the concept notes; a research copy sits beside the concept folders so their research links also work. Bundle-only research copies use context-correct canonical links and omit historical repository-only links with an explanation; the source research is unchanged.
- `build-manifest.json`: source and output sizes/hashes, draft status, and page count.
- `tmp/pdf-pages/`: five page renders for visual review; these are not included in the download bundle.

Source images are fitted intact with their aspect ratios preserved. They are never cropped, retouched, recoloured, or overwritten. ZIP entries are verified against their source bytes. PDF page count, four selected mockups, archive integrity, and the 100 MB per-output-file limit are checked automatically; all five rendered pages still need visual inspection before delivery.

## Review limits

Mockup artwork can approximate the source. The SVG and measurements govern exact glyphs and placement; source notes control production details. The hoodie mockup shows the back only; its proposed front retains the separate approved logo specified in the notes. Physical samples must confirm garment colour, application size, placement, and print or embroidery quality. Embroidery requires digitization and a sew-out on the intended blank; print concepts need a physical colour and placement proof.

The included research is the dated preliminary screening record, with earlier garment suggestions. The pairings in the table above are the current brief. No phrase is commercially cleared by this package, and no concept replaces an existing approved OFF SHFT mark.
