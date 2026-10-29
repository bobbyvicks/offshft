# Hoodie construction and Printful colours

Checked 29 October 2026 against live official Printful pages and their public product-picker, availability and file-guideline data. This record supersedes older uncertainty in `store/research/comfort-colors.md` and the four-colour 5161 list in `store/research/caps-and-hoodie.md`. Owner choices remain those in `store/picks.md`; no products or artwork were changed for this research.

## Drawstrings and silhouette

| Shopify style / blank | Drawcord construction | Details that distinguish the mockup |
|---|---|---|
| Oversized / AS Colour 5161, Printful 734 | **No drawcord.** | Broad relaxed shape, dropped shoulder, self-fabric lined hood, kangaroo pocket, ribbed cuffs/hem. 319 gsm fleece, 80% cotton / 20% recycled polyester. |
| Garment-Dyed / Comfort Colors 1567, Printful 970 | **Flat cords matching the garment colour.** | More substantial 322 gsm three-end fleece; 80% ring-spun cotton / 20% polyester, cotton face. Relaxed fit, side seams, forward shoulder, jersey hood lining, pouch pocket, rib cuffs/hem. |
| Lightweight / Comfort Colors 1467, Printful 969 | **Natural cream flat cords on every colour except White, which has white cords.** | Lighter 217 gsm, 100% ring-spun cotton, relaxed seamless body, forward shoulder, jersey hood lining, rib cuffs/hem. A softer, less bulky drape than 1567. |

Sources: [Printful 5161](https://www.printful.com/custom/collections/embroidery/unisex-oversized-hoodie-as-colour-5161), [AS Colour 5161 manufacturer](https://ascolour.com/mens-relax-hood-5161/), [Printful 1567](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1567), [Printful 1467](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467).

## Exact currently selectable Printful palette

These are the **actual product-picker colours**, not the manufacturer's wider palette or historical review filters. Codes are Printful's screen swatches, useful for image direction; they are not physical colour tolerances. Preserve supplier names in selectable options.

| AS Colour 5161 — 12 colours | Printful swatch |
|---|---|
| Black | `#060606` |
| Pine Green | `#113433` |
| Cobalt | `#30478A` |
| Chestnut | `#814733` |
| Clay | `#A14821` |
| Cypress | `#6B6D4F` |
| Sand | `#B3A078` |
| Carolina Blue | `#A1C2D9` |
| Athletic Heather | `#DDDDE7` |
| White Heather | `#F0F0F0` |
| Bone | `#FCF0E1` |
| White | `#FFFFFF` |

**Bone is confirmed available.** The current Bone concept does not need replacing for availability, but supplier Bone is paler than OFF SHFT's brand colour `#E4DDCB`. Seafoam appears in this product's review filter but is absent from its current product picker; do not add it as a 5161 variant. Source: [Printful 5161](https://www.printful.com/custom/collections/embroidery/unisex-oversized-hoodie-as-colour-5161), public picker product 734.

| Comfort Colors 1567 — 11 colours | Printful swatch |
|---|---|
| True Navy | `#2C334E` |
| Pepper | `#5C574F` |
| Blue Spruce | `#5A7260` |
| Denim | `#6C6E7A` |
| Crimson | `#C75B5B` |
| Light Green | `#709875` |
| Flo Blue | `#8695D4` |
| Grey | `#9E9A96` |
| Blue Jean | `#939DAB` |
| Seafoam | `#79B59F` |
| White | `#FFFFFF` |

**1567 has no Ivory, Bone or Black option at Printful.** White is its light neutral; Pepper or True Navy is its dark option. Source: [Printful 1567](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1567), public picker product 970.

| Comfort Colors 1467 — 9 colours | Printful swatch |
|---|---|
| Black | `#272727` |
| Pepper | `#69635A` |
| Grey | `#9E9A96` |
| Blue Jean | `#9AA5B3` |
| Peachy | `#FFC7AD` |
| Butter | `#FFDC8F` |
| Hydrangea | `#EBF6FD` |
| Ivory | `#FEF5DF` |
| White | `#FFFFFF` |

**1467 has Ivory and Blue Jean; it has no Espresso option at Printful.** Its cream should be called Ivory. Source: [Printful 1467](https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467), public picker product 969.

White is the only exact colour name common to all three palettes. There is no shared dark colour name across all three. A coherent dark selection can use 5161 Black / 1567 Pepper / 1467 Pepper, retaining those distinct supplier names. Pepper and Blue Jean have different swatch codes between the two Comfort Colors products; do not promise an exact tonal match.

## Embroidery and size limits

All three currently offer embroidery. Both Comfort Colors pickers explicitly show Standard and Unlimited color options; the 5161 picker shows Embroidery without those sub-options.

| Blank | Live embroidery placements / template bounds |
|---|---|
| 5161 | Large Front 254 × 152.4 mm; centred and left chest 101.6 × 101.6 mm; each wrist 50.8 × 76.2 mm. |
| 1567 | Large Front 254 × 152.4 mm; centred 101.6 × 101.6 mm; top left chest 76.2 × 76.2 mm. No wrist placement listed. |
| 1467 | Large Front 254 × 152.4 mm; centred and left chest 101.6 × 101.6 mm; each wrist 50.8 × 76.2 mm. The page calls the large area “Front”; its file-template data explicitly calls it “Large Front”. |

The selected 63 mm logo and 25 mm clock fit every left-chest area. The owner's 230 mm-wide Punched Out. design fits each Large Front template's width; final height and stitch suitability still depend on the uploaded design. Sources: each Printful product's File guidelines tab and its public `getGuidelinesAndTemplates` data, product IDs 734 / 970 / 969. Apparel uses flat embroidery.

## Availability snapshot and scope

- Each picker lists S, M, L, XL, 2XL, 3XL. At this check, all 72 selectable 5161 colour/size combinations, all 66 for 1567, and all 54 for 1467 reported `isFulfillable=true`, `hasStock=true`, `isDiscontinued=false`, `isDisabledInPush=false`. No embroidery-specific exclusions appeared in these responses. 5161 White had a DTF-printing exclusion only.
- All three products reported `isTemporaryOutOfStock=false`.
- Availability tabs list production in United States / United Kingdom / Latvia for 5161, and United States only for 1567 and 1467. No Canadian production location is listed. For 5161 and 1567, Printful flags that the US grouping can include Mexican branches.
- This was an unauthenticated public/default-region catalogue check, not a store-linked Canada delivery quotation or a reservation of stock. Production locations and delivery destinations are different facts. Recheck target-market availability when mapping live fulfilment variants.

Reproducible source method: the public Printful catalogue bundle exposes read-only queries `getProductPickerData`, `getProductAvailabilityData`, and `getGuidelinesAndTemplates` against `https://www.printful.com/graphql`, with `productId` 734, 970 or 969. Queried without login, cookies, credentials or store ID. Exact colours came from `productPickerData.colors`; stock flags from `variantAvailability`; locations from `availabilityTabRegions`; embroidery bounds from `guidelinesAndTemplates.templates`. Only official Printful and AS Colour sources were used.

## Image direction after mapping is agreed

Keep 5161 cord-free. Show matching flat drawcords on 1567, and contrasting natural cream flat drawcords on non-White 1467. Use exact blank/style and colour names for each file and variant. Do not label 1567 White as Ivory or Bone; do not invent Espresso for 1467. The existing brand colour Slate describes branding, not a supplier garment colour.
