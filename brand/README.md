# OFF SHFT brand kit

Every logo file, made from the same drawings as the hats. Rules and colours: `../BRAND.md`. One-page sheet:
`offshft-brand-sheet.pdf` (also online: https://claude.ai/artifact/MhC159oJHjjhLRyGEvMGaA).

## Which file goes where

| Where | File |
|---|---|
| Website header, packaging, anything wide | `logo/offshft-logo-light-1200.png` (dark backgrounds: `-dark-`) |
| Instagram, TikTok, Facebook profile picture | `social/offshft-profile-light.png` (or `-dark`), 1080 x 1080. Upload the square; the app crops it to a circle |
| Shopify square logo (Settings > Brand) | `social/offshft-profile-light.png` |
| Link previews (Shopify: Online Store > Preferences > Social sharing image) | `social/offshft-share.png`, 1200 x 628 |
| Shopify tab icon | Already on the store (31 Oct): `shopify/offshft-favicon-512.png` replaced the file `offshft-favicon.png` in Shopify's Files. That one file is both the Favicon setting and the home page's 64 px clock, which is why it's 512 px on a square of the home band's colour. To give the home page its own clock, set its icon block to `clock/offshft-clock-light-600.png` and the Favicon to `icons/favicon-32.png` in the theme editor |
| Any other website's tab icon | `icons/favicon.ico` (the 16, 32 and 48 px drawings in one file) |
| Phone home screen | `icons/apple-touch-icon.png` (iPhone), `icons/icon-192.png` and `icon-512.png` (Android). Shopify has no setting for these; adding them is a theme code edit |
| Round or square patches, round stickers | the stacked logo: `stacked/offshft-stacked-*.svg`, or the tile in `social/` |
| Patches and stickers cut to the clock's outline | `clock/offshft-clock-*.svg` (light on Bone, dark on Slate or Spruce, bone on Moss or Rust) |
| The clock alone in a circle (a story highlight, a sticker sheet) | `social/offshft-clock-tile-light.png` (or `-dark`). Never the main profile picture or app icon: in a square the clock is always small |
| Side or back of a hat | not in this kit: the side-of-hat master, `../designs/mark/final/the-o/side-*.svg` (8.4 x 16.6 mm) |
| Printers and sign makers | the `.pdf` or `.svg` of the logo you need: vector, scales to any size on paper or signs |
| Embroiderers | `logo/` and `clock/` SVG or PDF at their true size only: the logo with 7 mm letters (62.6 mm wide), the clock 25 mm tall. Other sizes have their own drawings in `../designs/mark/final/the-o/` (logo at cap 6.6 and 7.5, clock at 19 and 40 mm, the side master), with the stitch notes there. Never scale an embroidery file; never send a PNG |

## What's in each folder

- `logo/`: the one-line logo. `stacked/`: OFF over SHFT, for squares and circles. `clock/`: the clock on its own.
  - Each in four versions: `light` (Ink with Rust hands, for light backgrounds), `dark` (Bone with Sun hands, for dark
    backgrounds), `ink` and `bone` (one colour).
  - Each as SVG and PDF (vector, true size) and as transparent PNG (the number is the width; for the clock, the height).
  - The `logo/` and `clock/` files are the hat drawings (the embroidery masters at their true size). The stacked logo
    is a screen and print drawing: its clock has the one-colour logo's wider 1.5 mm gap so it stays open at avatar sizes.
- `social/`: the stacked logo on its square (1080 x 1080, light on Bone and dark on Slate), the clock-alone tiles, and
  the link-preview image.
- `icons/`: the tab icon, redrawn on the pixel grid at 16, 32 and 48 px; `favicon.ico`; the phone icons.
- `shopify/`: the store's tab icon file (see the table).

To rebuild, from the repo root: `cd tools && node ../brand/build.cjs && node ../brand/sheet.cjs`. `files.txt` lists
every file `build.cjs` makes; `sheet.cjs` makes `sheet.html` and the PDF.

Known: the S's lower terminal trim leaves a 0.09 mm step where it meets the curve (sTrim lowerX in
`../designs/mark/final/the-o/build.cjs`). It can't be seen at real sizes; fix it at the next logo rebuild, which also
redraws every S in the phrase art.
