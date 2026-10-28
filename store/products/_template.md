# Product listing template

- **SEO title (pattern, 40 characters):** <Design name> Embroidered Hat | OFF SHFT
- **Meta description (pattern, 84 characters):** <Hook line>. <Design name>, embroidered on a hat made to order. <When it gets worn>.

Every hat listing follows this. One listing per design; style and colour are variants. Fill it in from DESIGNS.md, the design's notes.md and PRODUCTS.md. Production time now comes from the partner research (store/research/pod-partner.md). It's Printful's, the partner the research recommends, and it keeps a CONFIRM tag until the owner picks. Material, closure, size range and care stay CONFIRM placeholders until the owner picks the blanks and their spec sheets fill them.

## Fields

| Shopify field | What goes in |
|---|---|
| Title | <Design name> Hat, spelled as in DESIGNS.md: OFF SHFT Logo Hat, Lines In Hat. If the design name ends in a full stop, the title is the line alone: Punched Out. No style or colour in the title. |
| URL handle | The title in lower case, words joined by hyphens: off-shft-logo-hat, punched-out |
| Description | See Description below |
| Category | Apparel & Accessories > Clothing Accessories > Hats > Baseball Caps. A listing takes one category, and every cap style here is a baseball cap, truckers included. |
| Category attributes | Age group: Adults. Target gender: Unisex. Color: per variant. Fabric, Crown profile, Cap fit type: [CONFIRM: fabric, crown profile and cap fit type, from the partner's spec sheet] |
| Product type | Hat |
| Vendor | OFF SHFT. Type it in; until the store is renamed, Shopify may fill in My Store 2. |
| Collections | Leave empty. Collections fill themselves from tags and product type (store/collections.md). |
| Tags | See Tags below |
| Status | Draft. The owner publishes after the sample passes. |
| Price | By style, from PRODUCTS.md (see Variants) |
| Compare-at price | Empty. No made-up "was" prices. |
| Inventory, SKU, weight, fulfilment | Set by the partner app when the product syncs: Printful's app pushes products to Shopify, and Printify's publishes them. [CONFIRM: check the SKU, weight and inventory settings after the first sync] |
| Search engine listing | SEO title and meta description from the patterns above. If the design name already contains OFF SHFT, drop the " \| OFF SHFT" ending. |
| Theme template | Default product |

## Description

In this order. Short lines, plain words.

1. **Hook:** one or two short lines on the idea.
2. **Time off:** one line on when or where it gets worn.
3. **Made to order:** "Made to order and shipped to you."
4. **Details**, a bulleted list under a bold "Details":
   - Front: <what's stitched>, embroidered, about <width> mm (<inches> in) wide. The width comes from the design's notes.md.
   - Thread: <thread colours on each fabric, in plain words>, from the design's notes.md, plus [CONFIRM: final thread colours, after the owner's thread choice and the sew-out]. Keep the words loose ("light", "orange") until then. Both partners use the same standard threads. The nearest to the brand colours are Black for Ink, Orange for Rust, White for Bone, Old Gold for Sun and Kiwi Green for Sage; only Black is a fair match (store/research/pod-partner.md, Colour matching).
   - Styles: <the styles, with the plain descriptions from PRODUCTS.md>
   - Material: [CONFIRM: material of each style]
   - Size: [CONFIRM: one size with an adjustable back; head-size range for each style]
   - Care: [CONFIRM: care instructions for each style]
   - Ships: made to order, usually ships in 2–5 business days [CONFIRM: Printful's time; Printify's is 2–7]
5. **Last line:** Fit questions? See [Size & fit](/pages/size-fit).

Never write: materials or origin that aren't confirmed (no "made in Canada"), "premium", "quality", "perfect gift", "must-have", stock counts, countdowns, reviews or ratings, discounts that aren't real, exclamation marks, "Off Shift" or "Offshift". Say "embroidered" only when the design is embroidered.

## Tags

Lower case, hyphens between words.

| Tag | Use when | Fills |
|---|---|---|
| fishing | the design is about fishing | Fishing |
| golf | the design is about golf | Golf |
| cottage | the design is about the cottage, the dock or the lake | Cottage |
| cornhole | the design is about cornhole | Cornhole |
| text-hat | the design is a line of text | Text hats |
| logo | the design is the OFF SHFT logo or the clock symbol | Nothing; for filters and reports |
| drop-1 | the hat launched in drop 1 | Nothing; internal |

Only add a hobby tag when the design is clearly about that hobby. All hats needs no tag; it goes by product type.

## Variants

Option 1: Style. Option 2: Colour.

| Style | Price (CAD) |
|---|---|
| Dad hat | 34.99 |
| Trucker | 34.99 |
| Structured snapback | 36.99 |
| Rope / performance cap | 39.99 |

- Prices are the typical retail in PRODUCTS.md. [CONFIRM: each style's partner base cost leaves at least $10 CAD profit after fees at this price] With PRODUCTS.md's ~3% fees, a $10 profit allows a base cost (hat plus embroidery, in CAD) of at most C$23.94 for the dad hat or trucker, C$25.88 for the snapback and C$28.79 for the rope cap. Printful lists, in USD: dad hat US$14.02 (price with embroidery not confirmed), snapback US$17.23 and trucker US$18.25 with front embroidery, rope cap US$13.45–13.72 (embroidery price not confirmed). Check the trucker first: US$18.25 is more than C$23.94 at any exchange rate above about 1.31.
- Colour values use the brand's fabric names (Bone, Oat, Moss, Spruce, Slate, Rust), and only the ones approved for that design. [CONFIRM: the partner's blank colour closest to each fabric, per style] The research has a first map for the dad hat, by colour name only (store/research/pod-partner.md, Colour matching). Name each variant for the colour the customer gets: if the nearest blank is clearly something else (navy, say), call it that.
- The first variant is the default. Make it a two-colour version: one-colour logos are never the default front logo (BRAND.md).
- [CONFIRM: the partner app can sync one Shopify product that mixes blanks, one per style. If it can't, make one listing per style, drop the Style option and put the style in the title: OFF SHFT Logo Dad Hat.]
- If Colour is linked to Shopify's Color category metafield to get swatches, Shopify may name the option "Color". That's fine. Match swatch colours to the real blanks, not to the brand's target hex values.

## Images and alt text

- One front image per colour, plus side and back if the partner provides them. Each variant shows its colour's front image.
- The partner's mockups for now [CONFIRM: mockups from the partner after sync]; photos of the samples once they arrive. No AI-made lifestyle images.
- Alt text pattern: <Colour> <style> with <what's stitched> embroidered on the front, <view>
- Example: Slate dad hat with the OFF SHFT logo embroidered on the front, front view
- Keep it under 125 characters. Don't start with "Image of" or "Photo of".

## Before a hat goes live (owner)

- [ ] The design is approved in DESIGNS.md and has passed the checks under "Before any design goes live", including the trademark search.
- [ ] A sample was ordered and the embroidery passed (LAUNCH_PLAN.md, phase 2).
- [ ] Every CONFIRM placeholder in the listing is filled.
- [ ] The price clears $10 CAD profit after fees.
- [ ] The owner publishes it.
