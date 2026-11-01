# Printful

What each Shopify listing should be linked to in Printful, and the files to upload. The sheet is a page:
https://claude.ai/artifact/PENDING

| File | What it is |
|---|---|
| `sheet-data.json` | The cards: for every listing and style, the Printful product, placement, file, size, position, threads and the colour of each variant. Built from the live store (read-only) on 1 Nov 2026 and checked against the drawings and copies of Printful's catalogue; Printful's own pages couldn't be reached, so `[UNVERIFIED]` marks what needs a look in Printful |
| `live.json` | A read-only snapshot of which variants Printful has stocked (its sign that a variant is linked) and which shipping profile each sits in |
| `files.json` | The designs to export: name, source drawing, and a print width where a print is bigger than the drawing |
| `export.cjs` | Makes `files/` and the zip from `files.json` |
| `files/embroidery/` | True size, 600 dpi, transparent, coloured in Printful's own threads (1800 Black, 1987 Orange, 1801 White, 1672 Old Gold) so its colour match picks the right ones |
| `files/print/` | Brand colours, 300 dpi, transparent |
| `files/svg/` | The drawings |
| `offshft-printful-files.zip` | All of `files/` in one download |
| `sheet.cjs` | Makes `sheet.html` (published as the page's `index.html`, beside `files/` and the zip) |

Rebuild, from the repo root:

```
cd tools && node ../store/printful/export.cjs && node ../store/printful/sheet.cjs
```

Rules the files follow (from `BRAND.md` and the drawing notes): never resize an embroidery file, since each size is
its own drawing; regenerate drawings with their `build.cjs`, never by hand. The dark 40 mm clock for the clock hat
(`designs/mark/final/the-o/symbol-dark-40mm.svg`) was added to the logo build on 1 Nov for this sheet.
