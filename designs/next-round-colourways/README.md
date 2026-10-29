# OFF SHFT - next round colour options

Supplemental review of four design concepts in four supplier colourways each: sixteen concept mockups. These are draft design and colour proposals, not released products. The original `designs/next-round/` package remains unchanged.

The final colour matrix and selected image paths are supplied in `colourways.json`. Source images and generation records are owned separately from this review builder. Build only after all sixteen selected images and their provenance are final.

| Concept | Four colour options | Artwork treatment |
|---|---|---|
| TIME WELL EARNED. / CC1717 tee | Blue Spruce, Ivory, Pepper, Blue Jean | Ink/Rust on Ivory; Bone/Sun on the other three |
| THE REST IS OURS. / CC1467 hoodie | Blue Jean, Ivory, Pepper, Butter | Bone/Sun on Pepper; Ink/Rust on the other three |
| OURS TO SPEND. / Yupoong 6606 | Evergreen, Navy, Khaki, Caramel | Bone/Sun on Evergreen/Navy; Ink/Rust on Khaki; all Bone on Caramel |
| 5:00 / CC1466 crewneck | Ivory, Blue Jean, Pepper, Espresso | Ink/Rust on Ivory/Blue Jean; Bone/Sun on Pepper; all Bone on Espresso |

The hoodie images remain rear-only. The separate approved front logo uses canonical `logo-dark.svg` (Bone/Sun) for Pepper and `logo-light.svg` (Ink/Rust) for Blue Jean, Ivory, and Butter. The source notes describe the original Blue Jean pairing; this is the colour-specific supplement. Canonical masters are unchanged. Caramel and Espresso use Bone for every artwork element, including the period or colon.

## Build

```text
python build-review.py --check
python build-review.py
```

Python requires `reportlab` and `pypdfium2`. The builder checks the four-by-four matrix and all selected sources before writing outputs. An extracted ZIP can rebuild using its included `review-assets/` copies; the original input manifest remains byte-identical and its paths are resolved through those portable copies. Input `colourways.json`, research, and generation files are never rewritten.

## Review outputs

- `index.html`: an offline four-concept gallery with a colour selector on each card, selected photo/artwork views, and relative image paths. No duplicated base64 photo payloads.
- `OFF-SHFT-Colourways-Review.pdf`: five landscape pages, with a sixteen-image overview arranged as four concept rows, followed by one page per concept showing its four colours.
- `contact-sheet.png`: a complete render of the PDF overview page.
- `OFF-SHFT-Colourways.zip`: the gallery, PDF, contact sheet, input colour manifest, research, current notes and SVGs, generation provenance, and required fonts with the Archivo OFL license. Package-only research copies omit historical repository-only links with an explanation; the root-owned source research stays unchanged. Original phrase research and canonical references are included at the paths expected by the concept notes. Input JSON manifests and selected photos retain their original bytes.
- `build-manifest.json`: selected sources, dimensions, hashes, and verification counts.
- `review-assets/`: portable copies of gallery dependencies. Selected image bytes are preserved exactly.

The builder will use paths relative to its own location and keep all outputs inside this folder. Gallery and archive links will resolve offline. Every image is fitted intact, without cropping, stretching, recolouring, or other raster edits. PDF rendering is used only for page previews and the contact sheet.

SVGs and measurements govern exact glyphs and placement. Garment colour, print/embroidery appearance, placement, and scale require physical samples. Phrase screening remains preliminary; no clearance or production readiness is implied by these colour options.
