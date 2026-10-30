# Next-round supplier check

Checked 29 October 2026 against the 16 approved entries in [colourways.json](../../designs/next-round-colourways/colourways.json). Public, read-only Printful research; no product, account, UI or Git changes.

**Launch-critical result:** the tee and hat fit their listed embroidery areas. The 115 mm crewneck artwork needs **Large Front embroidery**, centred on the chest, because the ordinary Centered area is only 101.6 mm wide. The hoodie's **back DTG print plus left-chest embroidery on the same garment remains unverified**: both applications exist separately, but their joint availability must be confirmed in the authenticated Design Maker before promising that specification.

## Applications and dimensions

The dimensions below come from fresh product-specific `getGuidelinesAndTemplates` responses, saved in [supplier-placement-evidence.json](supplier-placement-evidence.json). They are template bounds, not digitization acceptance.

| Concept / blank | Approved artwork | Current supplier placement | Result |
|---|---|---|---|
| TIME WELL EARNED. / CC1717, product 586 | 95 × 45.434 mm | Embroidery **Centered**, 101.6 × 101.6 mm; all sizes | Fits the field. Keep the 95 mm artwork width. |
| THE REST IS OURS. / CC1467, product 969 | Rear print 240 × 65.761 mm; separate canonical front logo about 62.64 mm wide | DTG **Large Back**, 381 × 457.2 mm, **M–3XL only**. Embroidery **Left chest**, 101.6 × 101.6 mm, all sizes | Each artwork fits its separate area. Combined techniques and the regular back-print route for size S need authenticated confirmation. |
| OURS TO SPEND. / Yupoong 6606, product 252 | 85 × 25.884 mm | Embroidery **Front**, 149.9 × 50.8 mm | Fits. Check the centre seam and actual positioning in the supplier preview. |
| 5:00 / CC1466, product 971 | 115 × 27.468 mm | Embroidery **Large Front**, 254 × 152.4 mm; all sizes | Fits Large Front. **Does not fit** ordinary Centered, 101.6 × 101.6 mm. Preserve artwork scale and centre it within Large Front. |

Official product pages: [CC1717](https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717), [CC1467](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467), [6606](https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606), [CC1466](https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466). Printful's [apparel placement guide](https://www.printful.com/custom-embroidered-shirts) confirms the 101.6 mm / 254 mm area distinction; the [hat-area update](https://help.printful.com/hc/en-us/articles/50263202274705-Does-the-new-larger-embroidery-area-of-the-hat-front-panel-change-anything-for-me) independently identifies the expanded 6606 front area, rounded there to 150 × 50.8 mm.

### Hoodie mixed-technique limitation

The CC1467 page lists Back print and Large back print under DTG, and Left chest among embroidery options. Printful's [Canadian embroidery page](https://www.printful.com/ca/custom-embroidery) generally advertises print plus embroidery on one item; its [shirt guidance](https://www.printful.com/custom-embroidered-shirts) also mentions adding back DTG to embroidered apparel. These general claims do **not** establish the exact CC1467 chest/back combination.

The exact product response exposes `canHaveDtgWithEmbroideryWrists: true` and `canHaveDtgWithEmbroiderySleeves: false`. A wrist permission is not a chest permission. The response has no chest-combination confirmation. Do not infer that two independently listed techniques can be ordered together.

For size S, the response provides a standard `Front and back.zip` template with 292.1 × 393.7 mm dimensions, but labels that entry **Front**; the product page separately lists regular Back print. This inconsistency prevents a definitive product-specific S back-print bound from this public evidence. The approved 240 mm width is below the standard template width, but the actual S back placement must be checked in Design Maker. Do not use the Large Back route for S, since that template explicitly starts at M.

## Exact selected colour / size availability

Fresh `getProductPickerData` requests for all four products returned HTTP 200. Every combination below reports `hasStock=true`, `isFulfillable=true`, `isDiscontinued=false` and `isDisabledInPush=false`. See [selected records](supplier-selected-availability.json) and the [full raw picker evidence](supplier-picker-evidence.json).

| Blank | Exact approved colours | Positive catalogue sizes per colour | Count |
|---|---|---|---:|
| CC1717 | Blue Spruce, Ivory, Pepper, Blue Jean | S, M, L, XL, 2XL, 3XL, 4XL | 28 |
| CC1467 | Blue Jean, Ivory, Pepper, Butter | S, M, L, XL, 2XL, 3XL | 24 |
| Yupoong 6606 | Evergreen, Navy, Khaki, Caramel | One size | 4 |
| CC1466 | Ivory, Blue Jean, Pepper, Espresso | S, M, L, XL, 2XL, 3XL | 24 |

There are **80 supplier-supported colour/size combinations**, or **76 if the launch keeps all apparel at S–3XL**. The approved colourway manifest specifies colours but not a size expansion; these counts are evidence, not an instruction to add 4XL.

CC1717 has DTG-specific (`T-SHIRT: notFulfilled`) exclusions on Blue Spruce S–4XL, Ivory/Pepper 3XL–4XL and Blue Jean 4XL. These do not exclude the requested embroidery: the same rows retain positive fulfilment/stock flags and unlimited-embroidery availability. Do not silently switch this tee concept to DTG.

These are public catalogue flags, not reserved stock, a destination-specific delivery quote or an authenticated store fulfilment result. The selected evidence preserves exact swatches as well as size flags. No unsupported colour name was substituted.

## Embroidery production limits

Printful's [current embroidery requirements](https://help.printful.com/hc/en-us/articles/50263985175953-How-should-I-prepare-my-design-for-embroidery) specify 6.35 mm minimum text height, 1.27 mm minimum line thickness and 6.35 mm minimum negative space for flat/unlimited embroidery. The three new embroidered concepts have cap heights of 11.435, 10.261 and 26.344 mm, so they pass the text-height check only. Stroke/counter clearance, the hoodie's canonical front logo, fill choice for larger numeral strokes and actual stitch quality still require supplier digitization review. The outlined SVGs and mockups are not production-approved stitch files.

Standard embroidery offers 15 thread colours; none exactly equals the brand's Bone, Sun, Ink or Rust hex values. Confirm deliberate thread substitutions in Design Maker. The picker offers Standard/Unlimited colour for CC1717, CC1467 and 6606; CC1466 lists embroidery without an Unlimited sub-option or availability flag, so do not promise that technique for the crewneck. Even supported Unlimited colour is not an exact physical colour-match guarantee. Mockup thread appearance must not override the accepted supplier configuration.

## Evidence method

Requests used the public endpoints `https://www.printful.com/graphql?getProductPickerData` and `https://www.printful.com/graphql?getGuidelinesAndTemplates`, `Content-Type: application/json`, `X-PF-Language: en_CA`, and no login, cookies, credentials or store ID. The exact queries and timestamps are retained in the evidence JSON files. Query fields were read from the public catalogue's own JavaScript. The authenticated launch owner must resolve the CC1467 joint application, S back placement, final thread mapping and supplier approval; this check does not claim those steps are complete.
