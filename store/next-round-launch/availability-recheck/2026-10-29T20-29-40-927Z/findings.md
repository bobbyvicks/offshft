# Launch availability recheck

Checked **29 October 2026, 20:29:41 UTC / 16:29:41 Toronto**. Exact scope: the 76 colour/size rows in `store/next-round-launch/listing-plan.json`, excluding the unselected CC1717 4XL sizes.

**All 76 selected blank variants currently report stock and fulfilment support in Printful's public catalogue. No selected row is missing, discontinued, disabled for push or flagged out of stock. Keep the selected Comfort Colors blanks on this evidence; a substitute is not needed because of blank availability.** This does not establish the cause of Shopify's “sold out” status or prove that any variant is synced to Printful.

| Product / official source | Exact colours | Sizes checked | Positive stock rows |
|---|---|---|---:|
| [CC1717 tee](https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717) | Blue Spruce, Ivory, Pepper, Blue Jean | S–3XL | 24 / 24 |
| [CC1467 hoodie](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467) | Blue Jean, Ivory, Pepper, Butter | S–3XL | 24 / 24 |
| [Yupoong 6606 trucker](https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606) | Evergreen, Navy, Khaki, Caramel | One size | 4 / 4 |
| [CC1466 crewneck](https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466) | Ivory, Blue Jean, Pepper, Espresso | S–3XL | 24 / 24 |

For each matched row: `hasStock=true`, `isFulfillable=true`, `isDiscontinued=false`, `isDisabledInPush=false`. The eight CC1717 `T-SHIRT: notFulfilled` exceptions affect **DTG**, not the selected embroidery: Blue Spruce S–3XL, Ivory 3XL and Pepper 3XL. Their stock flags and embroidery availability remain positive. Do not interpret those DTG exceptions as embroidered tee shortages.

## Decoration support is a separate check

Fresh product-specific placement/template responses are unchanged from the earlier audit. The official product pages were also reopened. “Fits” below means a supported placement and geometric bounds, not completed digitization or a synced production order.

| Approved application | Current result |
|---|---|
| CC1717: 95 × 45.434 mm centre embroidery | Fits the **Centered** 101.6 × 101.6 mm area, all sizes. |
| CC1466: 115 × 27.468 mm chest embroidery | Fits **Large Front**, 254 × 152.4 mm, all sizes. It is too wide for ordinary Centered, 101.6 × 101.6 mm; retain the Large Front route. |
| 6606: 85 × 25.884 mm front embroidery | Fits **Front**, 149.9 × 50.8 mm. |
| CC1467: 240 × 65.761 mm back DTG plus separate 62.64 mm left-chest embroidered logo | Each application exists separately. The specific **joint chest embroidery + back DTG configuration remains unverified**. Public data confirms DTG + wrist embroidery, not chest. **Large Back** is 381 × 457.2 mm but explicitly **M–3XL only**. Standard Back for S remains unverified: the page lists Back print, but its standard template is ambiguously labelled Front. Do not claim the four S hoodie variants can use Large Back, or claim the full combination is confirmed. |

No selected blank is actually unsupported by this stock check. The known unsupported configurations are 115 mm artwork in the crewneck's ordinary Centered field and size S in the hoodie's Large Back field. The remaining hoodie question is production configuration, not a demonstrated Comfort Colors stock shortage. Supplier digitization acceptance, thread mapping, destination-specific fulfilment and Shopify sync were not established here.

## Evidence and limits

- [picker-evidence.json](picker-evidence.json): fresh full official responses for product IDs 586, 969, 252 and 971, with query, request variables, HTTP status and timestamps.
- [selected-availability.json](selected-availability.json): exact 76 launch rows, source-plan SHA256, per-row flags, technique exclusions and matched counts.
- [placement-evidence.json](placement-evidence.json): fresh product-specific application bounds and combined-technique flags.

All eight requests returned HTTP 200. Requests used the existing public `getProductPickerData` and `getGuidelinesAndTemplates` GraphQL schemas at `www.printful.com/graphql`, with language `en_CA`, and **no login, cookies, credentials, store ID, browser profile or authenticated endpoint**. Public flags are a point-in-time catalogue report, not a reservation, destination quote or guarantee of a future order. Earlier audits were preserved. No UI, inventory, product or Git changes were made.
