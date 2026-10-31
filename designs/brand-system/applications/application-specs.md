# OFF SHFT — apparel and packaging applications

This coordinated application set uses the chosen **The O** logo from `designs/mark/final/the-o/`. Its paths and colours are embedded unchanged. The only additional consumer-facing copy is **Your time.** in outlined Archivo SemiBold. These are production-layout proposals for supplier review; no orders or production approvals are implied.

## Artwork

All measurements are in millimetres. SVG root sizes and viewBoxes match the stated canvas sizes; artwork has no external links, raster images or live font dependencies.

| Artwork | Finished size | Supplied canvas | Details |
|---|---|---|---|
| `hangtag-front.svg` | 55 × 90 | 61 × 96 | Bone ground, Ink/Rust logo, minimal line of copy and Rust foot. 3 mm bleed on every side. |
| `hangtag-back.svg` | 55 × 90 | 61 × 96 | Ink ground, Bone/Sun symbol. 3 mm bleed on every side. |
| `woven-neck-label.svg` | 90 × 35 visible face | 104 × 35 | Ink ground, Bone/Sun logo at the canonical 62.641 mm width. Includes 7 mm end folds at each side. Brand-only label. |
| `box-top-panel.svg` | 300 × 220 indicative | 300 × 220 | Top-panel composition only. Does not include box construction, flaps, side panels, bleed or a manufacturing dieline. |
| `package-insert.svg` | 148 × 105 | 154 × 111 | Bone ground, official lockup, outlined **Your time.** and a Rust rule. 3 mm bleed. Front only. |
| `seal-sticker.svg` | 45 mm circle | 51 × 51 | Ink ground with Bone/Sun symbol. 3 mm bleed around the circular cut. The square canvas is intentional. |

The hangtag uses the main logo at 40 mm wide for **print**. This does not establish a new embroidery minimum. The large box logo is also for print. Existing logo notes continue to govern embroidery; do not turn these print layouts into stitch files by scaling them.

## Guides: separate from printable artwork

The four `*-guide.svg` files match their artwork canvases and can be overlaid at 100% scale. **Do not print the guide colours.** Magenta indicates cut/punch geometry. Cyan indicates folds or safe areas as described in each file's SVG description. These ordinary RGB strokes are not certified spot-colour cutter layers; the supplier should map them to its own production workflow.

- `hangtag-cut-guide.svg`: 55 × 90 mm trim at x=3, y=3. Proposed 3.5 mm hole at x=30.5, y=10, equivalent to 7 mm below the finished top edge. The live-area guide is 4 mm inside trim. Hole diameter, position, stock and cord need supplier confirmation. The hole is absent from the printable front/back files.
- `woven-neck-label-fold-guide.svg`: overall 104 × 35 mm extent. Fold lines at x=7 and x=97 leave a 90 mm visible face. Suggested live-art area is x=12–92 and y=4–31. Only the ground extends into the end folds. Fold allowance is a proposal, not a selected supplier's construction specification.
- `insert-cut-guide.svg`: trim at x=3, y=3, with a 5 mm safe inset.
- `seal-cut-guide.svg`: 45 mm circular cut centered on x=25.5, y=25.5, with a 3 mm safe inset. Its centered 20 mm-tall symbol fits inside the safe circle and preserves one O-ring diameter of clearspace around the complete outer hand bounds.

The woven label carries the brand only. It does not contain or replace any required garment care, fiber, origin, size or other product information. Final product information must come from the actual garment and supplier; none is invented here.

## Colour targets and physical proofs

| Name | RGB / hex target | Intended role |
|---|---|---|
| Bone | 236, 229, 211 / `#ECE5D3` | Light ground and reverse logo |
| Ink | 31, 39, 51 / `#1F2733` | Dark ground and main letterforms |
| Rust | 180, 85, 45 / `#B4552D` | Light-ground hands and restrained print accent |
| Sun | 210, 155, 60 / `#D29B3C` | Dark-ground hands and pivot |

These screen values are visual targets, **not certified CMYK, Pantone, ink, yarn or thread matches**. No colour profile, separation or ink limit is specified. Ask the supplier for a physical stock/ink or yarn match and a proof on the intended substrate. Bone may be a matched stock or a printed ground; decide that with the supplier before separation. Dark labels need a woven sample to confirm the clock's channels, small pivot and letter apertures remain open. Keep the supplied geometry intact; request approval before any required manufacturing adjustment.

Approve paper stock, finish, box construction, label weave, stitch attachment, fold direction and seal adhesive using physical samples. Those material and construction choices are intentionally not represented as settled product specifications.

## Handoff and regeneration

`application-contact-board.svg` is a presentation board only. It crops the bleed/folds, simulates the hangtag punch and displays items at different scales. It is not a supplier dieline or a dimensional proof.

`source-manifest.json` records SHA-256 hashes of the official logo inputs. `build-packaging.cjs` embeds those sources verbatim and outlines support text with `tools/kit/kit.cjs`. Regenerate from this repository with:

```powershell
node designs/brand-system/applications/build-packaging.cjs
```

The repository's `tools` dependencies must be installed first. The generation script writes only into this applications folder and does not edit the official logo masters.
