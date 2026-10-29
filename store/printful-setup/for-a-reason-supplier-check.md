# FOR A REASON: approved supplier mapping

Official catalogue and duplicate check: 2026-10-29 at 22:22 UTC. Public colour-image HEAD verification: 22:24 UTC. This is a read-only setup record; no products, variants, files, prices or orders were changed.

The owner selected one Shopify product with one **Colour** option and three variants. All supplier variants are **One size**. The light cap deliberately uses a different blank and softer crown.

| Colour option | Exact supplier / product ID | Catalogue variant ID | Current base CAD | Puff extra | Stock evidence | Public supplier image |
|---|---|---:|---:|---:|---|---|
| Charcoal | Yupoong 6606 / 252 | 20390 | 19.25 | 1.95 | US in stock | [Charcoal](https://files.cdn.printful.com/products/252/20390_1725007489.jpg) |
| Ivory/Ivory | Comfort Colors CCST0 / 1678 | 52941 | 22.75 | 1.95 | US, EU, Latvia in stock | [Ivory/Ivory](https://files.cdn.printful.com/products/1678/52941_1790230933.jpg) |
| Evergreen | Yupoong 6606 / 252 | 20393 | 19.25 | 1.95 | US, EU, Latvia in stock | [Evergreen](https://files.cdn.printful.com/products/252/20393_1725007500.jpg) |

All three image URLs returned HTTP 200 and `image/jpeg` through unauthenticated HEAD requests. No image bytes were downloaded. Exact API evidence and hashes are recorded in `for-a-reason-supplier-check.json`; raw responses are in the ignored `private/for-a-reason-20261029T222249Z/` directory.

## Garment and listing disclosure

Suggested factual description:

> Charcoal and Evergreen use the structured Yupoong 6606 with a curved visor and matching mesh. Ivory/Ivory uses the softer, unstructured Comfort Colors CCST0 Sunwashed Trucker Cap with a curved bill and ivory mesh. Crown shape and fabric finish differ by colour. All colours have an adjustable plastic snapback and a six-panel construction.

The [6606](https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606) has hard buckram front panels and a mid-profile crown. Its fabric composition can vary with colour and stock: 60% cotton/40% polyester or 74% polyester/26% cotton. It does not have a documented washed finish; use **Charcoal**, not Washed Black.

The [CCST0](https://www.printful.com/custom/hats/all/sunwashed-trucker-cap-comfort-colors-ccst0) is explicitly unstructured, with pigment-dyed cotton twill, a heavy brushed finish and soft mesh. Printful calls this exact variant **Ivory/Ivory**. Do not call it Stone or Khaki, or describe all three colours as structured or as Comfort Colors.

## Exact 3D puff mapping

| Blank | Technique-specific file role | Puff type option | Thread option | Field |
|---|---|---|---|---|
| 6606, both selected variants | `embroidery_front_large` | `embroidery_type=3d` | `thread_colors_3d_front_large` | Printfile 522: 1770 x 600 px at 300 dpi, 149.86 x 50.8 mm |
| CCST0 Ivory/Ivory | `embroidery_front` | `embroidery_type=3d` | `thread_colors_3d` | Printfile 522: 1770 x 600 px at 300 dpi, 149.86 x 50.8 mm |

These are the fresh technique-specific placement mappings, not inferred from generic file labels. General 6606 metadata also retains a default front entry, but its current variant mapping uses `embroidery_front_large`. The 6606 large-front entry reports an additional C$3.95; CCST0 front has no additional-price entry. Confirm the actual configured quote. Base plus puff alone is C$21.20 for each 6606 and C$24.70 for CCST0; these amounts exclude any additional placement charge, digitization, shipping and tax.

The option exposes 3D puff but does not approve the artwork geometry or establish final production readiness. Use the reviewed FOR A REASON production artwork, approved thread selections and supplier digitization. Current [Printful puff guidance](https://help.printful.com/hc/en-us/articles/50263211098769-What-is-3D-puff-embroidery-and-how-does-it-work) prohibits mixing flat and puff within one placement; do not rely on the legacy API `both` value to override it.

Official API evidence:

- [6606 product](https://api.printful.com/products/252) and [embroidery fields](https://api.printful.com/mockup-generator/printfiles/252?technique=EMBROIDERY)
- [CCST0 product](https://api.printful.com/products/1678) and [embroidery fields](https://api.printful.com/mockup-generator/printfiles/1678?technique=EMBROIDERY)

## Duplicate check and rejected alternatives

Fresh `GET /sync/products?limit=100&offset=0` returned all 31 products, with total=31. Case-insensitive name matching for `reason` found **zero** imported products. This does not rule out a Shopify-only listing that Printful has not imported yet.

Richardson 112 and Flexfit 6511 were checked as alternatives. Neither supplies the complete intended palette. CCST0 supplies actual Ivory/Ivory, but its Black/Tan and Bay/Tan alternatives change the matching mesh and green colour. The approved mixed-blank mapping above preserves exact Charcoal and Evergreen while providing genuine Ivory/Ivory.
