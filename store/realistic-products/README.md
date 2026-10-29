# OFF SHFT product image concepts

Photorealistic draft product imagery based on the owner's warm studio reference, the current Shopify catalogue, and the approved OFF SHFT artwork.

Each image shows the first style in its listing. The other style drawings remain available in Shopify. These are AI-generated visual mockups, not photographs of manufactured samples. Bone and Slate are concept colours; supplier colour availability and the final stitch samples still need to be selected before launch.

- Light products: Bone fabric, Ink lettering, Rust accents.
- Dark products: Slate fabric, Bone lettering, Sun accents.
- Warm ivory background, soft directional light, natural textile texture.
- Logo at approximately 63 mm; standalone clock at approximately 25 mm.
- Punched Out. follows the existing listing artwork, not an unselected redesign.

The images are intended for the existing catalogue listings. This batch changes media only; it does not approve product specifications or change publication settings.

`catalogue.json` maps each file to its product and primary style. `shopify-updates.json` records verified media changes. Prompts and generation notes are stored alongside the image work.

## Review files

- Open `index.html` for the local gallery. It works directly from the extracted folder with no server or external assets.
- `OFF-SHFT-Product-Review.pdf` is a three-page contact sheet using uncropped previews of the original PNG images.
- `OFF-SHFT-Product-Images.zip` contains the 17 original images, gallery, contact sheet, catalogue, README, verification manifest, and generation prompt metadata.
- `image-verification.json` records decoded image dimensions, byte counts and SHA-256 checksums.

The catalogue's `title`, `firstStyle`, `blank` and `styleCount` fields describe the existing listing and the first selected blank. Existing keys, Shopify IDs, admin URLs and filenames are preserved. The separate `shopify-updates.json` is maintained by the upload workflow and is not included in the review archive.
