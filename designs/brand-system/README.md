# OFF SHFT / Brand system 01.0

A complete visual identity presentation built around Robert's final **The O** logo, with a focus on clothing, labels and packaging.

Open `output/OFF-SHFT-Brand-Guide.pdf` for the presentation. `output/OFF-SHFT-Brand-Kit.zip` is the portable handoff package.

## What is here

- `assets/`: 12 exact canonical SVG masters plus transparent, high-resolution PNG exports. These are the chosen artwork, copied without alteration from `designs/mark/final/the-o/`.
- `applications/`: coordinated, editable label and packaging proposals, with dimensions and application notes.
- `garments/`: garment flats showing proposed logo placement on an oversized hoodie, baggy sweats and a hat.
- `mockups/`: AI-generated visual concepts, plus the prompt and reference record. These illustrate a proposed appearance, not manufactured or photographed products.
- `brand-guidelines.md`: identity hierarchy, colour, clear space, typography and usage.
- `production-handoff.md`: practical supplier review checklist and the distinction between artwork and production approval.
- `source-notes/`: unchanged source embroidery instructions.
- `fonts/`: Archivo and Unbounded fonts with their OFL licences.
- `scripts/`: reproducible presentation and export tooling.

## Direction

Use the full two-colour logo for recognition, the clock symbol for secondary placements, and the dedicated small side mark where the main embroidery mark cannot be used. Bone and Ink are the base. Rust and Sun stay focused on the clock detail. Supporting print copy uses Archivo; the wordmark remains the original outlined Unbounded construction.

The owner's current apparel scope is **hats, oversized hoodies and baggy sweats**. That scope supersedes older hat-only language elsewhere in this branch. No original brand or logo source file was replaced by this package.

## Status

The logo is the owner's selected final source artwork. New packaging, placements, supporting typography, clear-space rule and optional “Your time.” copy are proposed applications. This is an identity handoff, not a production approval. Physical samples and supplier proofs are still required. Branding labels do not replace separate verified care, composition, origin or required product information.

Source snapshot: `bobbyvicks/offshft`, branch `designs/drop-1`, commit `fee1e64830101e2dc1e7daa40c77d5d97aabab77` (28 October 2026 review).

## Rebuild

`scripts/build-guide.py` uses ReportLab, Pillow and pypdfium2. The included Archivo and Unbounded fonts retain their OFL licences. `scripts/export-assets.cjs` and the garment script require Sharp in the Node environment (or `NODE_PATH`). Application and garment source scripts are stored alongside their art; they also depend on the original repository's `tools/kit/kit.cjs` and `tools` dependencies. `scripts/package-kit.py` creates the portable handoff ZIP. The finished SVG artwork is self-contained and needs none of these build dependencies to open or use. Keep all canonical SVGs for scaling and supplier use; generated photographic concepts are visual references only.
