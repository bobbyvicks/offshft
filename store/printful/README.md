# Printful

What each Shopify listing should be linked to in Printful, and the files to upload. The sheet is a page:
https://claude.ai/artifact/DGDrj5W4UfxVqYEjp1u4fY (private to the owner until shared)

| File | What it is |
|---|---|
| `sheet-data.json` | The cards: for every listing and style, the Printful product, placement, file, size, position, threads and the colour of each variant. Built from the live store (read-only) on 1 Nov 2026 and checked against the drawings and copies of Printful's catalogue; Printful's own pages couldn't be reached, so `[UNVERIFIED]` marks what needs a look in Printful |
| `live.json` | A read-only snapshot of which variants Printful has stocked (its sign that a variant is linked) and which shipping profile each sits in. Re-read it before trusting the page's "linked" numbers |
| `files.json` | The designs to export: name, source drawing, and a print width where a print is bigger than the drawing |
| `export.cjs` | Makes `files/` and the zip from `files.json` |
| `files.json` recolours | Punched Out. in one colour (`-bone`, `-ink`) is its normal drawing with the full stop recoloured, which its notes allow. Never done for the logo or clock: their one-colour versions are their own drawings |
| `files/embroidery/` | True size, 600 dpi, transparent, coloured in Printful's own threads (1800 Black, 1987 Orange, 1801 White, 1672 Old Gold) so its colour match picks the right ones |
| `files/print/` | Brand colours, 300 dpi, transparent |
| `files/svg/` | The drawings |
| `offshft-printful-files.zip` | All of `files/` in one download |
| `sheet.cjs` | Makes `sheet.html` (the whole page, opens locally) and `sheet-artifact.html` (the same page without its outer document, which is what gets published, beside `files/`; the page builds its zip in the browser) |

Rebuild, from the repo root:

```
cd tools && node ../store/printful/export.cjs && node ../store/printful/sheet.cjs
```

Rules the files follow (from `BRAND.md` and the drawing notes): never resize an embroidery file, since each size is
its own drawing; regenerate drawings with their `build.cjs`, never by hand. The logo and clock files come from
`designs/mark/final/the-o/build.cjs` (the logo typed in Unbounded Bold, the owner's call of 2 Nov 2026): the logo files
are 62.6 mm wide (letters 7 mm), the clocks 25 and 40 mm. The dark and one-colour Ink 40 mm clocks for the clock hat
(`symbol-dark-40mm.svg`, `symbol-one-colour-ink-40mm.svg`) were added to the logo build on 1 Nov for this sheet.
