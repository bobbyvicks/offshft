# Next-round concept colourways

Verified 29 October 2026. Retain the four selected original concept mockups and add three colours per garment: **12 additional images, 16 total**. Phrase, outlined geometry, intended size and placement stay unchanged. These are draft image options; this research makes no Shopify changes.

The table records the agreed shortlist. Every colour name and screen swatch below was returned by Printful's current public product picker for the exact blank, rather than inferred from the manufacturer's wider range.

| Concept / blank | Colour | Status | Printful screen swatch | Artwork |
|---|---|---|---|---|
| 11 — TIME WELL EARNED. / CC1717 tee | Blue Spruce | Keep original | `#4C6151` | Bone / Sun |
| 11 — CC1717 | Ivory | Add | `#FFF4D9` | Ink / Rust |
| 11 — CC1717 | Pepper | Add | `#514F4C` | Bone / Sun |
| 11 — CC1717 | Blue Jean | Add | `#707E8D` | **Bone / Sun** |
| 12 — THE REST IS OURS. / CC1467 hoodie | Blue Jean | Keep original | `#9AA5B3` | Ink / Rust |
| 12 — CC1467 | Ivory | Add | `#FEF5DF` | Ink / Rust |
| 12 — CC1467 | Pepper | Add | `#69635A` | Bone / Sun |
| 12 — CC1467 | Butter | Add | `#FFDC8F` | Ink / Rust |
| 13 — OURS TO SPEND. / Yupoong 6606 trucker | Evergreen | Keep original | `#385E3D` | Bone / Sun |
| 13 — 6606 | Navy | Add | `#24303B` | Bone / Sun |
| 13 — 6606 | Khaki | Add | `#B3A58E` | Ink / Rust |
| 13 — 6606 | Caramel | Add | `#97622E` | **Bone, one colour** |
| 14 — 5:00 / CC1466 crewneck | Ivory | Keep original | `#FFF4D9` | Ink / Rust |
| 14 — CC1466 | Blue Jean | Add | `#9AA5B3` | Ink / Rust |
| 14 — CC1466 | Pepper | Add | `#69655E` | Bone / Sun |
| 14 — CC1466 | Espresso | Add | `#966F56` | **Bone, one colour** |

Ink is `#1F2733`, Rust `#B4552D`, Bone `#ECE5D3`, and Sun `#D29B3C`. For two-colour phrase artwork, letters use Ink/Bone and the period uses Rust/Sun. For 5:00, digits use Ink/Bone and the colon uses Rust/Sun. Caramel and Espresso use Bone for every element, including punctuation. This avoids a weak Sun accent against warm brown fabric without changing the paths.

The 1717's **Blue Jean is darker than the fleece Blue Jean**. Use its own `#707E8D` swatch and Bone/Sun artwork; do not reuse the pale `#9AA5B3` hoodie/crewneck colour. Pepper also differs by blank. Preserve these distinctions instead of applying one universal colour to all garments.

**Supplier evidence**

- [Printful Comfort Colors 1717](https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717), public product **586**: 50 offered colours, including all four selected here; printing and embroidery listed. Retain the relaxed heavyweight, pocket-free tee. The catalogue lists S–4XL; this draft research does not propose a size expansion.
- [Printful Comfort Colors 1467](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467), product **969**: nine offered colours — Black, Pepper, Grey, Blue Jean, Peachy, Butter, Hydrangea, Ivory and White. **Espresso is not offered on this hoodie.** S–3XL; back printing and front embroidery placements are listed. Keep the selected rear-only photo view and the unchanged canonical front logo as a separate application specification. Its natural flat drawcords apply to every selected colour; only White uses white cords.
- [Printful Yupoong 6606](https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606), product **252**: 20 offered colours, including Evergreen, Navy, Khaki and Caramel; One size and embroidery listed. These selections are the single-colour labels, not Navy/ White or Brown/ Khaki. Retain the structured six-panel crown, mesh back, curved visor and snap closure.
- [Printful Comfort Colors 1466](https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466), product **971**: ten offered colours — Black, Pepper, Crimson, Espresso, Yam, Blue Jean, Peachy, Butter, Ivory and White. S–3XL; embroidery listed. Retain the relaxed garment-dyed crewneck and the 115 mm centre-chest low-profile embroidery concept, subject to digitizer fill choice and a sew-out.

**Method and limits**

Cross-checked the existing [colour plan](../../store/realistic-products/colour-expansion/colour-plan.json), [collection research](../../store/realistic-products/colour-expansion/collection-colour-research.md) and [hoodie research](../../store/realistic-products/colour-expansion/hoodie-research.md), opened all four official product pages, and refreshed the exact picker labels and swatches from `https://www.printful.com/graphql?getProductPickerData`.

The successful read-only request used `Content-Type: application/json`, `X-PF-Language: en_CA`, no login, cookies, credentials or store ID, and this query with product IDs 586, 969, 252 and 971:

```graphql
query getProductPickerData($productId: Int!, $storeId: Int) {
  singleProducts {
    productPickerData(productId: $productId, storeId: $storeId) {
      productId
      colors { value title extra { codes tooltip } }
      sizes { value title }
      techniques { value title values { value title } }
    }
  }
}
```

All four reduced picker requests returned HTTP 200. Per-colour/size stock flags were not revalidated in this pass; this confirms catalogue choices, not a stock reservation or destination-specific delivery promise. Screen swatches guide the drafts and are not calibrated fabric or thread measurements. Physical samples govern final colour and embroidery appearance. Existing phrase research is unchanged.
