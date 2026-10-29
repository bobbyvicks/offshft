# OURS TO SPEND.

Draft concept for owner review; not approved for production or sale.

Two left-aligned lines, approximately 85 mm wide on the front of an Evergreen Yupoong 6606 trucker. Use the dark-garment Bone/Sun artwork. Check the centre seam against the actual letters; the logo-specific seam shift does not automatically apply to this phrase.

- Artwork: **85 × 25.884 mm**, cap height **10.261 mm**.
- Hat embroidery concept. Minimum 7 mm cap height is enforced by this build.
- Unbounded Bold from `tools/fonts/Unbounded-Bold.ttf`, tracking 0.12em. Every glyph is an editable outlined path with overlapping contours unioned. The canonical S-terminal rule is applied at this actual size (upper/lower trims 0.034/0.084 mm).
- Dark garment: Bone #ECE5D3 letters/digits, Sun #D29B3C punctuation. Light garment: Ink #1F2733 letters/digits, Rust #B4552D punctuation.
- Flat previews use brand Bone #E4DDCB and Spruce #2E3D35 backgrounds; these are colour references, not fabric-stock or stitch simulations.

Files: `design.svg` is the dark-garment main; `design-light.svg` is the light-garment version. `design-dark.png` and `design-light.png` are transparent reference renders with 3 mm equivalent padding. `preview-bone.png` and `preview-spruce.png` are flat previews. `measurements.json` records the generated dimensions.

Selected review photo: `mockup-v2.png`, generated with artwork-only references. The initial `mockup.png` is preserved as a historical iteration and is not the selected review image. SVG geometry and millimetre dimensions govern the exact artwork; mockup scale, placement and fabric appearance are approximate. Decimal measurements describe vector geometry, not manufacturing tolerances.

No logo signoff is embedded. Any accompanying brand mark must use the exact separate [final master SVG](../mark/final/the-o/) unchanged. Do not replace letters or zeros with the clock.

No exact apparel result surfaced in the preliminary indexed search. This is not evidence of availability. See [research and sources](../next-round-research.md). Searches were preliminary and indexed, not a legal clearance. A production proof/sample and appropriate clearance review are still required. Embroidery requires digitization for this size and a sew-out on the actual blank; printing requires a physical colour/placement proof.

Rebuild only these drafts from the repo root: `node designs/build-next-round.cjs`. Before running, Sharp must already resolve in the selected Node environment or through NODE_PATH pointing to its installed node_modules directory. This is a required runtime prerequisite; the script installs nothing. Canonical logo files are not changed.
