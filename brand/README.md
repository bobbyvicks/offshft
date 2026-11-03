# OFF SHFT brand kit

Every logo file, made from the same drawings as the hats: OFF SHFT typed in Unbounded Bold (the font the owner chose;
letter-spacing 0.12 em and three small kerns) with the O as the clock, bar hands with square ends, drawn by
`../designs/mark/final/the-o/build.cjs`. The owner's call of 2 Nov 2026: the real font, not a hand-drawn version.
Rules and colours: `../BRAND.md`. One-page sheet: `offshft-brand-sheet.pdf` (also online:
https://claude.ai/artifact/MhC159oJHjjhLRyGEvMGaA).

## Which file goes where

| Where | File |
|---|---|
| Website header, packaging, anything wide | `logo/offshft-logo-light-1200.png` (dark backgrounds: `-dark-`) |
| Instagram, TikTok, Facebook profile picture | `social/offshft-profile-light.png` (or `-dark`), 1080 x 1080. Upload the square; the app crops it to a circle |
| Shopify square logo (Settings > Brand) | `social/offshft-profile-light.png`, already in the store's Files under that name (1 Nov; replaced with this version on 3 Nov 2026): pick it there |
| Link previews (Shopify: Online Store > Preferences > Social sharing image) | `social/offshft-share.png`, 1200 x 628, also already in the store's Files (replaced with this version on 3 Nov 2026) |
| Shopify tab icon | Already on the store (31 Oct): `shopify/offshft-favicon-512.png` replaced the file `offshft-favicon.png` in Shopify's Files. That one file is both the Favicon setting and the home page's 64 px clock, which is why it's 512 px on a square of the home band's colour. To give the home page its own clock, set its icon block to `clock/offshft-clock-light-600.png` and the Favicon to `icons/favicon-32.png` in the theme editor |
| Any other website's tab icon | `icons/favicon.ico` (the 16, 32 and 48 px drawings in one file) |
| Phone home screen | `icons/apple-touch-icon.png` (iPhone), `icons/icon-192.png` and `icon-512.png` (Android). Shopify has no setting for these; adding them is a theme code edit |
| Round or square patches, round stickers | the stacked logo: `stacked/offshft-stacked-*.svg`, or the tile in `social/` |
| Patches and stickers cut to the clock's outline | `clock/offshft-clock-*.svg` (light on Bone, dark on Slate or Spruce, bone on Moss or Rust) |
| The clock alone in a circle (a story highlight, a sticker sheet) | `social/offshft-clock-tile-light.png` (or `-dark`). Never the main profile picture or app icon: in a square the clock is always small |
| Side or back of a hat | not in this kit: the side-of-hat master, `../designs/mark/final/the-o/side-*.svg` (8.2 x 16.1 mm) |
| Printers and sign makers | the `.pdf` or `.svg` of the logo you need: vector, scales to any size on paper or signs |
| Embroiderers | `logo/` and `clock/` SVG or PDF at their true size only: the logo 62.6 mm wide (letters 7 mm, the smallest size with the pivot dot), the clock 25 mm tall. Other sizes have their own drawings in `../designs/mark/final/the-o/` (logo at cap 6.6 and 10, clock at 19 and 40 mm, the side master), with the stitch notes there. Never scale an embroidery file; never send a PNG |

## What's in each folder

- `logo/`: the one-line logo. `stacked/`: OFF over SHFT, for squares and circles. `clock/`: the clock on its own.
  - Each in four versions: `light` (Ink with Rust hands, for light backgrounds), `dark` (Bone with Sun hands, for dark
    backgrounds), `ink` and `bone` (one colour).
  - Each as SVG and PDF (vector, true size) and as transparent PNG (the number is the width; for the clock, the height).
  - The `logo/` and `clock/` files are the hat drawings (the embroidery masters at their true size). The stacked logo
    is a screen and print drawing: its clock keeps a 1.5 mm gap so it stays open at avatar sizes.
- `social/`: the stacked logo on its square (1080 x 1080, light on Bone and dark on Slate), the clock-alone tiles, and
  the link-preview image.
- `icons/`: the tab icon, redrawn on the pixel grid at 16, 32 and 48 px; `favicon.ico`; the phone icons.
- `shopify/`: the store's tab icon file (see the table).

To rebuild, from the repo root: `cd tools && node ../brand/build.cjs && node ../brand/sheet.cjs`. `files.txt` lists
every file `build.cjs` makes; `sheet.cjs` makes `sheet.html` and the PDF.

These files are the only logo files. Everything else (mockups, theme assets, Printful files, social images) is made
from them or from the same build; an older logo found anywhere else is a stale variant and gets replaced.
