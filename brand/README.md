# OFF SHFT brand kit

Every logo file, made from the same drawings as the hats. Rules and colours: `../BRAND.md`. One-page sheet:
`offshft-brand-sheet.pdf`.

## Which file goes where

| Where | File |
|---|---|
| Website header, packaging, anything wide | `logo/offshft-logo-light-1200.png` (dark backgrounds: `-dark-`) |
| Instagram, TikTok, Facebook profile picture | `social/offshft-profile-light.png` (or `-dark`), 1080 x 1080. Upload the square; the app crops it to a circle |
| Shopify square logo (Settings, Brand) | `social/offshft-profile-light.png` |
| Shopify tab icon (Online Store, Themes, Customize, Theme settings, Favicon) | `icons/favicon-32.png` |
| Website tab icon, if you set one up yourself | `icons/favicon.ico` (16, 32 and 48 px in one file) |
| Phone home screen | `icons/apple-touch-icon.png` (iPhone), `icons/icon-192.png` and `icon-512.png` (Android) |
| Back or side of a hat, patches, die-cut stickers | `clock/offshft-clock-light.svg` (embroidery masters stay in `../designs/mark/final/the-o/`) |
| Printers, sign makers, embroiderers | the `.pdf` or `.svg` of the logo you need: vector, any size |

## What's in each folder

- `logo/`: the one-line logo. `stacked/`: OFF over SHFT, for squares. `clock/`: the clock on its own.
  - Each in four versions: `light` (Ink with Rust hands, for light backgrounds), `dark` (Bone with Sun hands, for dark
    backgrounds), `ink` and `bone` (one colour).
  - Each as SVG and PDF (vector, true size) and as transparent PNG (the number is the width; for the clock, the height).
- `social/`: the stacked logo on its square, 1080 x 1080, light (Bone) and dark (Slate).
- `icons/`: the tab icon drawn pixel by pixel at 16, 32 and 48 px, `favicon.ico`, and the phone icons.

The embroidery masters, with stitch notes and size floors, are in `../designs/mark/final/the-o/`. Don't send these
PNGs to an embroiderer; send the SVG or PDF and the notes.

To rebuild: `cd tools && node ../brand/build.cjs`. `files.txt` lists every file it makes.
