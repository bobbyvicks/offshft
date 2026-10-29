# Apparel plan: the first drop

Plan for OFF SHFT's first clothes, 29 October 2026. The owner asked to go beyond hats: "oversized hoodies and sweats too, kinda like lounge active wear". The idea stays the same. This is what you change into after the shift.

This is a draft for the owner. Nothing here spends money, publishes anything or changes the store (AGENTS.md).

How to read it: numbers in square brackets are sources, listed at the end. "Arithmetic" means worked out here from cited numbers. "Measured" means measured from the logo build (designs/mark/final/the-o/build.cjs). Anything not checked is marked [CONFIRM: ...].

How it was checked: most facts come from store/research/apparel.md and its sources. printful.com and blankstyle.com were blocked from this session again. Five new facts come from search results that quote those pages: the sweatpants' leg placements [3], the hoodie's embroidery placements [1], Printful's sleeve embroidery area [11], its 2XL+ size markup [12] and the full hoodie size chart [29]. To open the pages directly, allow www.printful.com and www.blankstyle.com in the environment's network settings.

## Read first

- **The owner has since picked other bases.** This plan was asked for on the research's recommendation: Bella + Canvas 4719, 4737 and 4711. While it was being written, the owner picked the AS Colour 5161 hoodie ("for sure"), the Comfort Colors 1567 and 1467 hoodies, the Comfort Colors 1469 sweatpants and the Comfort Colors 1466 crewneck, and asked for everything to be embroidered. The 4711 was shown and not picked (store/picks.md).
  - Carries over to the owner's picks: the decoration (logo sizes, placements, thread colourways, the floor checks), the pricing method, the free-shipping flag, the listing structure and the render script.
  - Has to be redone for them: blank facts, colours, prices, placements and size charts. The research has none of these for the 1467, 1469 and 1466 yet. Whether Printful embroiders each Comfort Colors item, and where, is being checked (store/picks.md).
  - Known now: the Comfort Colors 1567 lists embroidery on the large front, centre chest and left chest, with no wrist [37]. On that hoodie the wrist symbol needs another spot. [CONFIRM: the 1567's placements] The AS Colour 5161 lists at US$38.97 [36] [CONFIRM: currency] and the 1567 at US$40.75 [37]. At C$89.99 they'd make about C$31.83 and C$29.30 on a Canadian card, before any second placement (arithmetic). So the hoodie price still works.
- **The name, in clothing, comes first.** FIGS, Inc.'s OFF-SHIFT filing may cover clothing, loungewear included. The go-ahead in LAUNCH_PLAN.md was given for hats. store/apparel-copy.md (owner decision 1) has the details and says to ask a trademark lawyer before any OFF SHFT garment goes on sale.
- **Copy and store structure for clothes** (collections, menus, FAQ, Size & fit text, the brand line) are proposed in store/apparel-copy.md. This plan follows its patterns and doesn't repeat them.

## In short

- **Three pieces from Printful, all in the same heavyweight Bella + Canvas fleece:** an oversized hoodie, sweatpants and an oversized crewneck. The hoodie and sweatpants are the lounge set. The crewneck can wait if the owner wants to start with two.
- **Quiet, like the hats.** The logo embroidered small on the left chest: 62.6 mm wide, the same size as the hat front. The clock symbol, 25 mm tall, on the left wrist (where a watch would sit) and on the left leg. No back prints.
- **Colours:** Bone, Spruce and Navy. The sweatpants come in Bone and Navy only.
- **Prices:** hoodie C$89.99, sweatpants C$79.99, crewneck C$79.99. Profit per item before shipping: C$24.02 to C$30.11 (arithmetic).
- **Flag:** a 4XL hoodie with free shipping to the US makes C$11.32, under the C$15 hoodie line. With free shipping in Canada it can't be checked yet: there's no Canada rate. Charging shipping on clothes fixes both.
- **To start (owner approves the spending):** digitizing, about US$21.85. One sample order of three pieces, about US$90.81 plus shipping.
- **Renders:** `store/apparel/sheet.png` shows every decoration at true size on its colour.

## 1. The products

Why these three: one fabric and one colour set, so tops and bottoms go together. Of the two partners, only Printful has this oversized set with embroidery; on Printify the 4737 sweatpants are print only and the 4719 and 4711 weren't found (apparel.md). The owner hasn't picked a partner yet; this plan assumes Printful.

Each piece carries one small embroidered mark. The chest gets the full logo, the wrist or leg the clock symbol. That's the "front logo plus side symbol" pairing in the logo notes, which say the symbol is abstract on its own and gains recognition next to the full logo (notes.md).

### Oversized hoodie: Bella + Canvas 4719

| | |
|---|---|
| Blank | Unisex Oversized Heavyweight Hoodie, Bella + Canvas 4719 [1] |
| Fabric and fit | Oversized. 10 oz (339 g/m²) fleece, 60/40 cotton/poly. Double hood, no drawcord, one front pocket [1]. The maker is moving it to 65/35 [34]. |
| Sizes | XS–4XL from the maker [29]. [CONFIRM: Printful's size range] |
| Colours | Bone (Printful's Dust), Spruce (Forest), Navy. See Colours below. |
| Left chest | The lockup, embroidered. Cap height 7 mm: 62.6 × 18.0 mm (2.46 × 0.71 in), measured |
| Left wrist | The symbol, embroidered. 25.0 mm tall: 11.8 × 25.0 mm (0.46 × 0.98 in), measured |
| Placements Printful offers | Embroidery: left chest, centre chest, left wrist, right wrist. The back takes a print only [1]. |

### Sweatpants: Bella + Canvas 4737

| | |
|---|---|
| Blank | Unisex Heavyweight Sweatpants, Bella + Canvas 4737 [3] |
| Fabric and fit | Relaxed. 10 oz (339 g/m²) fleece, 60/40. Side pockets, inside drawcord, elastic cuffs [3]. |
| Sizes | S–3XL [4] |
| Colours | Bone (Dust) and Navy. No Spruce: the maker doesn't make this one in Forest [31]. |
| Front left leg | The symbol, embroidered, 25.0 mm tall (11.8 × 25.0 mm), the same as the wrist. Option: 40 mm (19.1 × 40.0 mm). Both measured. |
| Placements Printful offers | Embroidery: front left leg, front right leg, back left leg, back right leg. One embroidery placement is included in the price [3]. |

25 mm is the default. It matches the wrist, it's the quietest choice, and the same design can serve both (Printful charges US$2.95 to reuse a design on another product [6]). The 40 mm option reads better from a distance but is taller than the chest logo, so it would be the loudest mark in the set. Compare them in `leg-bone.png` and `leg-40mm-bone.png`.

### Oversized crewneck: Bella + Canvas 4711

| | |
|---|---|
| Blank | Unisex Oversized Heavyweight Sweatshirt, Bella + Canvas 4711 [2] |
| Fabric and fit | Oversized. 10 oz fleece, 60/40 [2]. Reviewers call it very oversized; women size down [2]. |
| Sizes | XS–4XL from the maker [30]. [CONFIRM: Printful's size range] |
| Colours | Bone (Dust), Spruce (Forest), Navy |
| Left chest | The lockup, as on the hoodie |
| Left wrist | The symbol, as on the hoodie |
| Placements Printful offers | Embroidery: left chest, centre chest, left wrist, right wrist [2] |

### Colours

| Variant name | Printful colour | Stands in for | Thread, brand target | Nearest standard thread | Hoodie | Sweatpants | Crewneck |
|---|---|---|---|---|---|---|---|
| Bone | Dust | Bone #E4DDCB | Ink #1F2733 letters and ring, Rust #B4552D hands and dot | Black (1800) + Orange (1987) | Yes | Yes | Yes |
| Spruce | Forest | Spruce #2E3D35 | Bone #ECE5D3 letters and ring, Sun #D29B3C hands and dot | White (1801) + Old Gold (1672) | Yes | No | Yes |
| Navy | Navy | Slate #27303D | Bone + Sun | White + Old Gold | Yes | Yes | Yes |

- Matched by colour name only. Nobody has seen a swatch. [CONFIRM: Printful's colour list for each blank, and a swatch of Dust against Bone #E4DDCB and Forest against Spruce #2E3D35.] The research rates Dust and Forest likely fair, and Navy fair but bluer than Slate, so Navy keeps its own name (apparel.md). The listing template says to name a variant for the colour the customer gets.
- Thread colourways follow BRAND.md: Ink and Rust on Bone, Bone and Sun on Spruce and Slate. Printful's 15 standard threads [8] give Black and Orange, and White and Old Gold. Only Black is a fair match for its target (store/research/pod-partner.md, Colour matching). Printful's unlimited colour embroidery gets closer for +US$3.50 on sweatshirts [5]. [CONFIRM: per item or per placement; hats are +US$3.95]
- Tops and bottoms may not match exactly. Printful warns of this on another hoodie-and-pants pair [21]. [CONFIRM: shade match of the hoodie and sweatpants on the samples]
- Not in this drop: Oat, Moss and Rust. Nothing in this fleece is close by name (apparel.md).

### Sizes against the logo rules

| Use | Artwork (designs/mark/final/the-o/) | Size, measured | Floor (notes.md) | Printful's limit | OK |
|---|---|---|---|---|---|
| Chest, hoodie and crewneck | logo-light.svg on Bone, logo-dark.svg on Spruce and Navy | Cap 7: 62.6 × 18.0 mm, pivot dot 1.53 mm | Cap 6.6 mm minimum; cap 7 keeps the pivot dot | Left chest 4 × 4 in (101.6 mm) [10]. Text at least 0.25 in (6.35 mm) [7] | Yes |
| Wrist, hoodie and crewneck | symbol-light.svg, symbol-dark.svg | 11.8 × 25.0 mm, 1.2 mm channel | 19 mm tall minimum | Sleeve top 2 × 3 in (50.8 × 76.2 mm) [11]. [CONFIRM: the wrist area, in each product's File guidelines tab] | Yes |
| Leg, sweatpants | symbol-light.svg, symbol-dark.svg | 11.8 × 25.0 mm | 19 mm | [CONFIRM: the leg area's size, and where on the leg it sits] | Yes |
| Leg option | symbol-light-40mm.svg. The dark 40 mm file doesn't exist yet | 19.1 × 40.0 mm, 1.5 mm channel | From 35 mm, a 1.5 mm channel; plain satin up to 45 mm | [CONFIRM] | Yes |

- Thinnest strokes: the lockup ring's top and bottom are 1.43 mm and the F arms 1.63 mm (notes.md). Printful's thinnest line is 0.05 in (1.27 mm) [7]. The 25 mm symbol's thinnest stroke is 2.13 mm (measured).
- Gaps: the channel between ring and hands is 1.0 mm in the lockup and 1.2 mm in the symbol. The S openings are 1.0 mm (notes.md). Printful may join shapes closer than 3 mm with connecting stitches [9]. The sample decides. This is fleece, not hat twill, so check those gaps closely.
- The side-of-hat master isn't used. It's only for spaces under 19 mm (notes.md), and every placement here has room for the full symbol.
- The 5.2 mm shift in notes.md is for the centre seam on 6-panel caps. It doesn't apply here.
- If the 62.6 mm chest logo looks too small on the oversized cut, cap 7.5 is 67.1 × 19.3 mm (measured) and has a proof in the-o/ (logo-light-cap7.5.svg). It would be digitized as its own size.

### Not in this drop

- **Back print.** The hoodie's back takes a print only, not embroidery [1]. The hood would cover most of an upper-back print. It isn't confirmed that Printful mixes embroidery and a print on one item [CONFIRM]. And a big back print isn't small and quiet.
- **Fleece shorts** for spring, and a garment-dyed hoodie if the owner wants a washed look (apparel.md, Later).

## 2. Pricing

All in Canadian dollars unless marked. US$ to C$ at 1.42 [35]. [CONFIRM: the Bank of Canada rate on the day you price.] Profit is per item, after Printful's cost and Shopify's card fee, before shipping, ads and one-time costs. That's how PRODUCTS.md counts it.

### Cost and profit, sizes up to XL

| | Hoodie | Sweatpants | Crewneck |
|---|---|---|---|
| Retail price | **89.99** | **79.99** | **79.99** |
| Printful's listed price, US$ | 37.23 [1] | 37.23 [3] | 33.15 [2] |
| Wrist embroidery, a second placement, US$ | 2.95 [5] | none | 2.95 [5] |
| Cost with embroidery, US$ | 40.18 | 37.23 | 36.10 |
| Cost with embroidery, C$ | 57.06 | 52.87 | 51.26 |
| Card fee, Canadian card: 2.8% + 30¢ [23] | 2.82 | 2.54 | 2.54 |
| **Profit, Canadian card** | **30.11** | **24.58** | **26.19** |
| Card fee, US or Amex card: 3.5% + 30¢ [23] | 3.45 | 3.10 | 3.10 |
| **Profit, US or Amex card** | **29.48** | **24.02** | **25.63** |

- Printful's listed prices say "one print included" [1][2][3]. [CONFIRM: each price with Embroidery selected, for each size.] The sweatpants list at US$36.50–37.23 [3]; the table uses the higher figure. Their EU page includes one embroidery placement [3].
- The lowest price that keeps C$10 profit (PRODUCTS.md's floor) on a US card: hoodie C$69.80, sweatpants C$65.46, crewneck C$63.79 (arithmetic).
- One price for all sizes. The owner may prefer to charge more for 2XL and up (see below).
- If Printful bills in CAD, its prices run about 4% above this exchange rate (apparel.md). That takes C$2.05–2.28 off each profit (arithmetic).
- The set: hoodie and sweatpants together are C$169.98. No set discount is proposed; that's the owner's call.

### What takes the profit down

| Take off | Hoodie | Sweatpants | Crewneck |
|---|---|---|---|
| Biggest size. Printful adds US$2.00 per size step from 2XL up on its free plan, and says a 4XL carries it twice [12]: up to US$4.00 | 5.68 | 5.68 | 5.68 |
| 13% HST on Printful's bill, for an order made in Ontario and sent to Ontario, while the store isn't registered for GST/HST [19][27][28] | 7.42 (8.16 at 4XL) | 6.87 (7.61 at 3XL) | 6.66 (7.40 at 4XL) |
| Free shipping to the US. Printful charges from US$8.79 for the hoodie [1] and US$8.49–8.79 for the sweatpants, depending on the page [3]. The table uses US$8.79. | 12.48 | 12.48 | [CONFIRM: rate] |
| Free shipping in Canada | [CONFIRM: no rate found] | [CONFIRM] | [CONFIRM] |
| US buyer paying in USD, with a manual exchange rate: 2% [24][25]. With the automatic rate the 2% is built into the USD price instead. | 1.80 | 1.60 | 1.60 |
| Unlimited colour thread, if chosen: US$3.50 [5] | 4.97 | 4.97 | 4.97 |

[CONFIRM: how the 2XL+ markup stacks for each size, in Printful's product editor. If each size adds a step, a 4XL costs US$6.00 more, another C$2.84.] HST rates run from 5% to 15% depending on the province the order goes to [27]. Printful only charges it on orders made and shipped in Canada [19].

### Hoodies under C$15

| Hoodie | Profit | Under C$15? |
|---|---|---|
| XS–XL, buyer pays shipping | 29.48–30.11 | No |
| 4XL, buyer pays shipping | 23.80–24.43 | No |
| XS–XL, made in Ontario, 13% HST, Canadian card | 22.69 | No |
| 4XL, made in Ontario, 13% HST, Canadian card | 16.27 | No, but close |
| XS–XL, free shipping to the US | 17.00 | No, but close |
| **4XL, free shipping to the US** | **11.32** | **Yes. FLAG** |
| **Any size, free shipping in Canada** | **Unknown** | **FLAG: can't be checked without a Canada rate.** On an Ontario-made order, each C$1.00 of shipping costs C$1.13 with HST (arithmetic). |

What fixes both flags:

- **Charge shipping on clothes**, at about Printful's cost. Or set any free-shipping line high enough that one hoodie doesn't reach it. PRODUCTS.md floats free shipping over $75. Every hoodie, crewneck and pair of sweatpants clears $75 on its own, so each would ship free.
- Or price the 2XL–4XL hoodie at C$94.99. A 4XL with free US shipping needs C$93.80 to keep C$15 (arithmetic).

Free shipping would also hurt the other two. A 3XL pair of sweatpants shipped free to the US makes C$5.86, under PRODUCTS.md's C$10 floor (arithmetic).

### One-time costs (the owner approves each)

| Item | US$ | C$ | Notes |
|---|---|---|---|
| Digitizing two new designs: the chest lockup and the 25 mm symbol, US$6.50 each [6] | 13.00 | 19.20 at Printful's CAD price [6] | notes.md: digitize each size on its own |
| Using a design on another product: crewneck chest, crewneck wrist, sweatpants leg, US$2.95 each [6] | 8.85 | 13.20 | [CONFIRM: Printful's rule for reusing an embroidery file across products] |
| **Digitizing, total** | **21.85** | **32.40** | Up to US$32.50 if every placement counts as a new design (arithmetic) |
| The 40 mm leg option instead of 25 mm | +3.55 | | A new size is a new design: US$6.50 instead of the US$2.95 re-use |
| One sample order: Bone hoodie, Bone sweatpants, Spruce crewneck, at 20% off [18] | 90.81 | 128.95 at 1.42 | Before digitizing, shipping and tax. Up to 3 items per sample order [18]. [CONFIRM: the discount is active on this account] |

- The hats need the same cap-7 lockup. Whichever is digitized first pays US$6.50 and the other may pay the US$2.95 re-use fee [6]. [CONFIRM: a cap file can be reused on a flat garment]
- This sample order tests both thread colourways, the set's shade match and the fit.

### Shipping, duties and tax

- **Time:** made in 2–5 business days on average [13], then 3–4 business days in Canada or the US [14].
- **Where it's made:** Printful sends each order to its closest shop that has the item. Its 2020 announcement said the Ontario shop would start with printing and embroidered hats and apparel [22], and its Canadian pages say embroidered apparel is made in Canada [16], without naming models. [CONFIRM: set the region to Canada and open the Availability tab on each blank [15]]
- **If made in Ontario:** no duties for Canadian buyers. Printful adds GST/HST to the store's bill [19].
- **If made in the US:** by courier, a Canadian buyer pays GST/HST at the door on anything over C$40, and duty too over C$150 [26]. One hoodie (C$89.99) is in the tax-only band. The set (C$169.98) is over C$150. Printful's Canada DDP option collects these at checkout instead [17].
- **Never say "made in Canada".** The hoodie blank is made in Nicaragua [1], and Printful doesn't say which pieces its Ontario shop makes.
- **GST/HST registration:** not needed until sales pass C$30,000 [28]. A registered store could claim back the HST on Printful's bills, but would charge HST to customers. Ask an accountant.

## 3. Listing drafts

Built from store/products/_template.md, with the garment patterns in store/apparel-copy.md (part 2, Products): Colour and Size are the options, and the size charts live on the Size & fit page. Every listing is a Draft until the owner publishes it, after the samples pass.

What changes from the hat template:

- Titles and handles: `<Design name> Hoodie`, `Crewneck` or `Sweatpants`, so OFF SHFT Logo Hoodie, off-shft-logo-hoodie. SEO titles add "Oversized" where the blank is cut oversized.
- Product types: Hoodie, Crewneck, Sweatpants, typed exactly. They stay out of All hats, which is product type Hat, and fill Lounge and its two sub-collections by type (store/apparel-copy.md, part 3). No new tag is needed.
- Tags: `logo` (the design is the OFF SHFT logo or symbol). Hobby tags only if the owner wants clothes in the hobby collections (store/apparel-copy.md, owner decision 6).
- Options: Option 1 Color, Option 2 Size. [CONFIRM: the option names and order Printful's sync creates]
- Category: [CONFIRM: the category Shopify's picker offers for each, under Apparel & Accessories > Clothing]. Shopify's taxonomy couldn't be opened from this session.
- Last line: "Which size? See [Size & fit](/pages/size-fit)."
- Never write: "made in Canada", "premium", "quality", "perfect gift", "must-have", "Off Shift", stock counts, countdowns, ratings or exclamation marks (template). Nor "heavyweight", "pre-shrunk", "true to size" or any other fabric or fit claim the maker doesn't make (store/apparel-copy.md). "Heavyweight" is in each of these blanks' own names [1][2][3], so it can stay. Materials only as Printful states them on the day.

### 3.1 OFF SHFT Logo Hoodie

- **SEO title (30 characters):** OFF SHFT Logo Oversized Hoodie
- **Meta description (126 characters):** The O in OFF is a clock set to 5:00. The OFF SHFT logo, embroidered on an oversized hoodie made to order. For after the shift.

| Shopify field | Value |
|---|---|
| Title | OFF SHFT Logo Hoodie |
| URL handle | off-shft-logo-hoodie |
| Category | [CONFIRM: Shopify's category for a hoodie] |
| Category attributes | Age group: Adults. Target gender: Unisex. Color and Size: per variant. Fabric and any fit or neckline attributes: [CONFIRM: from Printful's page] |
| Product type | Hoodie |
| Vendor | OFF SHFT |
| Tags | logo |
| Collections | Leave empty. Lounge and Hoodies and crews fill themselves by product type. |
| Status | Draft |
| Price | 89.99, every size |
| Compare-at price | Empty |
| Inventory, SKU, weight, fulfilment | Set by Printful's app on sync. [CONFIRM: check after the first sync] |
| Search engine listing | The SEO title and meta description above |
| Theme template | Default product |

<!-- paste:start -->
Shift's over. Change into this.

A heavy, oversized hoodie for the hours that are yours: the couch, the dock, the drive up to the cottage.

The O in OFF is a clock set to 5:00. Quitting time. The same clock sits on the left wrist, where a watch would.

Made to order and shipped to you.

**Details**

- Chest: the OFF SHFT logo, embroidered on the left, about 63 mm (2.5 in) wide
- Wrist: the clock, embroidered above the left cuff, about 25 mm (1 in) tall
- Thread: on Bone, dark letters with orange clock hands. On Spruce and Navy, light letters with gold-coloured clock hands. [CONFIRM: final thread colours, after the owner's thread choice and the sew-out]
- Fit: oversized. Check the size chart before you pick. [CONFIRM: after the samples]
- Fabric: heavyweight fleece, 10 oz (339 g/m²) [CONFIRM: blend and weight from Printful's page on the day; the maker is moving it from 60/40 to 65/35 cotton/poly]
- Hood and pocket: double-layer hood with no drawcord, one front pocket [CONFIRM: from Printful's page on the day]
- Sizes: XS–4XL [CONFIRM: Printful's size range]
- Care: [CONFIRM: care instructions from Printful's page]
- Ships: made to order, usually ships in 2–5 business days [CONFIRM: Printful's time for embroidered apparel]

Pairs with the OFF SHFT Logo Sweatpants. Which size? See [Size & fit](/pages/size-fit).
<!-- paste:end -->

**Variants:** 3 colours × 8 sizes = 24.

| Color | Printful colour | Chest artwork | Wrist artwork | Thread | Sizes | Price |
|---|---|---|---|---|---|---|
| Bone | Dust | logo-light.svg | symbol-light.svg | Ink letters and ring, Rust hands | XS–4XL | 89.99 |
| Spruce | Forest | logo-dark.svg | symbol-dark.svg | Bone letters and ring, Sun hands | XS–4XL | 89.99 |
| Navy | Navy | logo-dark.svg | symbol-dark.svg | Bone letters and ring, Sun hands | XS–4XL | 89.99 |

- Default (first) colour: Bone.
- If a swatch shows Dust or Forest is clearly not Bone or Spruce, use Printful's name instead, in the variant, the Thread line and the alt text.

**Images and alt text**

- One front image per colour from Printful's mockups, plus a wrist close-up if Printful offers one. [CONFIRM: mockups after sync] Photos of the samples once they arrive. No AI-made lifestyle images.
- Bone oversized hoodie with the OFF SHFT logo embroidered on the left chest, front view
- Spruce oversized hoodie with the OFF SHFT logo embroidered on the left chest, front view
- Navy oversized hoodie with the OFF SHFT logo embroidered on the left chest, front view
- Bone oversized hoodie with the clock symbol embroidered above the left cuff, close-up (and the same for each colour)

**Setting it up at Printful**

- Product: Unisex Oversized Heavyweight Hoodie, Bella + Canvas 4719 [1]. Technique: embroidery.
- Left chest: logo-light.svg or logo-dark.svg at 100%, 62.6 × 18.0 mm. [CONFIRM: the editor keeps it at 62.6 mm and doesn't stretch it to fill the 4 in area]
- Left wrist: symbol-light.svg or symbol-dark.svg at 100%, 11.8 × 25.0 mm. The minute hand points up the arm, toward the shoulder. [CONFIRM: how the wrist placement is turned in the design maker]
- Threads: Black + Orange on Bone, White + Old Gold on Spruce and Navy, or unlimited colour (owner's call).
- Approve only after a sew-out on the real hoodie shows both channels at least 0.8 mm open, the O's counter open, both S openings open and the symbol's pivot centred within 0.2 mm (notes.md).

### 3.2 OFF SHFT Logo Sweatpants

- **SEO title (24 characters):** OFF SHFT Logo Sweatpants
- **Meta description (110 characters):** A small clock stopped at 5:00. The OFF SHFT clock, embroidered on sweatpants made to order. For your days off.

| Shopify field | Value |
|---|---|
| Title | OFF SHFT Logo Sweatpants |
| URL handle | off-shft-logo-sweatpants |
| Category | [CONFIRM: Shopify's category for sweatpants] |
| Category attributes | Age group: Adults. Target gender: Unisex. Color and Size: per variant. Fabric and any fit attributes: [CONFIRM: from Printful's page] |
| Product type | Sweatpants |
| Vendor | OFF SHFT |
| Tags | logo |
| Collections | Leave empty. Lounge and Sweats fill themselves by product type. |
| Status | Draft |
| Price | 79.99, every size |
| Compare-at price | Empty |
| Inventory, SKU, weight, fulfilment | Set by Printful's app on sync. [CONFIRM: check after the first sync] |
| Search engine listing | The SEO title and meta description above |
| Theme template | Default product |

<!-- paste:start -->
Off the clock. On the couch.

Heavy, relaxed sweatpants for your days off, whichever days those are.

A small clock on the left leg, stopped at 5:00. Quitting time.

Made to order and shipped to you.

**Details**

- Leg: the OFF SHFT clock, embroidered on the front of the left leg, about 25 mm (1 in) tall
- Thread: on Bone, a dark clock with orange hands. On Navy, a light clock with gold-coloured hands. [CONFIRM: final thread colours, after the owner's thread choice and the sew-out]
- Fit: relaxed, with elastic cuffs [CONFIRM: from Printful's page on the day]
- Waist: inside drawcord [CONFIRM: from Printful's page on the day]
- Pockets: side pockets [CONFIRM: from Printful's page on the day]
- Fabric: heavyweight fleece, 10 oz (339 g/m²) [CONFIRM: blend and weight from Printful's page on the day]
- Sizes: S–3XL
- Care: [CONFIRM: care instructions from Printful's page]
- Ships: made to order, usually ships in 2–5 business days [CONFIRM: Printful's time for embroidered apparel]

Pairs with the OFF SHFT Logo Hoodie. Which size? See [Size & fit](/pages/size-fit).
<!-- paste:end -->

**Variants:** 2 colours × 6 sizes = 12.

| Color | Printful colour | Leg artwork | Thread | Sizes | Price |
|---|---|---|---|---|---|
| Bone | Dust | symbol-light.svg | Ink ring, Rust hands | S–3XL | 79.99 |
| Navy | Navy | symbol-dark.svg | Bone ring, Sun hands | S–3XL | 79.99 |

- Default (first) colour: Bone.
- If the owner picks the 40 mm leg option, change "about 25 mm (1 in)" to "about 40 mm (1.6 in)". The dark 40 mm file has to be made with the logo build first; never scale a file up or down by hand (notes.md).

**Images and alt text**

- One front image per colour from Printful's mockups. [CONFIRM: mockups after sync] Photos of the samples once they arrive.
- Bone sweatpants with the clock symbol embroidered on the front of the left leg, front view
- Navy sweatpants with the clock symbol embroidered on the front of the left leg, front view

**Setting it up at Printful**

- Product: Unisex Heavyweight Sweatpants, Bella + Canvas 4737 [3]. Technique: embroidery. Placement: front left leg.
- symbol-light.svg or symbol-dark.svg at 100%, 11.8 × 25.0 mm, minute hand pointing up. [CONFIRM: the leg area's size, and that the design sits on the upper thigh]
- One reviewer's embroidered pair had a loose leg seam [3]. Check it on the sample.
- Same sew-out checks as the hoodie.

### 3.3 OFF SHFT Logo Crewneck

- **SEO title (32 characters):** OFF SHFT Logo Oversized Crewneck
- **Meta description (128 characters):** The O in OFF is a clock set to 5:00. The OFF SHFT logo, embroidered on an oversized crewneck made to order. For after the shift.

| Shopify field | Value |
|---|---|
| Title | OFF SHFT Logo Crewneck |
| URL handle | off-shft-logo-crewneck |
| Category | [CONFIRM: Shopify's category for a crewneck sweatshirt] |
| Category attributes | Age group: Adults. Target gender: Unisex. Color and Size: per variant. Fabric and any fit or neckline attributes: [CONFIRM: from Printful's page] |
| Product type | Crewneck |
| Vendor | OFF SHFT |
| Tags | logo |
| Collections | Leave empty. Lounge and Hoodies and crews fill themselves by product type. |
| Status | Draft |
| Price | 79.99, every size |
| Compare-at price | Empty |
| Inventory, SKU, weight, fulfilment | Set by Printful's app on sync. [CONFIRM: check after the first sync] |
| Search engine listing | The SEO title and meta description above |
| Theme template | Default product |

<!-- paste:start -->
Quitting time. Put this on.

A heavy, oversized crewneck for the hours after the shift: the back deck, the boards, the boat launch.

The O in OFF is a clock set to 5:00. The same clock sits on the left wrist, where a watch would.

Made to order and shipped to you.

**Details**

- Chest: the OFF SHFT logo, embroidered on the left, about 63 mm (2.5 in) wide
- Wrist: the clock, embroidered above the left cuff, about 25 mm (1 in) tall
- Thread: on Bone, dark letters with orange clock hands. On Spruce and Navy, light letters with gold-coloured clock hands. [CONFIRM: final thread colours, after the owner's thread choice and the sew-out]
- Fit: oversized, and it runs big. Check the size chart before you pick. [CONFIRM: after the samples]
- Fabric: heavyweight fleece, 10 oz [CONFIRM: blend and weight from Printful's page on the day]
- Sizes: XS–4XL [CONFIRM: Printful's size range]
- Care: [CONFIRM: care instructions from Printful's page]
- Ships: made to order, usually ships in 2–5 business days [CONFIRM: Printful's time for embroidered apparel]

Which size? See [Size & fit](/pages/size-fit).
<!-- paste:end -->

**Variants:** 3 colours × 8 sizes = 24, all 79.99. Same colours, artwork and thread as the hoodie. Default (first) colour: Bone.

**Images and alt text:** as the hoodie, with "oversized crewneck" in place of "oversized hoodie". Example: Spruce oversized crewneck with the OFF SHFT logo embroidered on the left chest, front view (90 characters).

**Setting it up at Printful:** Unisex Oversized Heavyweight Sweatshirt, Bella + Canvas 4711 [2]. Same placements, files, sizes and checks as the hoodie.

### Before a piece goes live (owner)

- [ ] Region set to Canada in Printful's catalog, and the Availability tab checked for each blank [15].
- [ ] The price with embroidery, for every size, checked in Printful's product editor and written into this plan.
- [ ] The wrist and leg areas checked in each product's File guidelines tab.
- [ ] The sample passed: stitching (notes.md sew-out rules), shade match and fit.
- [ ] Every CONFIRM placeholder in the listing filled.
- [ ] The price clears C$15 profit (hoodie) or C$10 (the others) after fees, with the shipping setting the owner picked.
- [ ] The owner publishes it.

## 4. Size & fit

The Size & fit text for clothes is in store/apparel-copy.md (part 4): how the clothes fit, how to measure one you own, and two empty charts. For these Bella + Canvas blanks, the charts fill in like this. Garment measurements, laid flat.

<!-- paste:start -->
### Hoodie and crewneck sizes

| Size | Chest | Length | Sleeve |
|---|---|---|---|
| XS | 53 cm (20¾ in) | 67 cm (26½ in) | [CONFIRM] |
| S | 55 cm (21½ in) | 71 cm (28 in) | [CONFIRM] |
| M | 60 cm (23½ in) | 72 cm (28½ in) | [CONFIRM] |
| L | 65 cm (25½ in) | 75 cm (29½ in) | [CONFIRM] |
| XL | 70 cm (27½ in) | 76 cm (30 in) | [CONFIRM] |
| 2XL | 75 cm (29½ in) | 77 cm (30½ in) | [CONFIRM] |
| 3XL | 80 cm (31½ in) | 79 cm (31 in) | [CONFIRM] |
| 4XL | 85 cm (33½ in) | 80 cm (31½ in) | [CONFIRM] |

### Sweats sizes

| Size | Waist | Inseam |
|---|---|---|
| S | 36 cm (14 in) | 75 cm (29½ in) |
| M | 38 cm (15 in) | 76 cm (30 in) |
| L | 42 cm (16½ in) | 77 cm (30½ in) |
| XL | 46 cm (18 in) | 79 cm (31 in) |
| 2XL | 50 cm (19½ in) | 80 cm (31½ in) |
| 3XL | 55 cm (21½ in) | 81 cm (32 in) |
<!-- paste:end -->

Notes

- Hoodie and crewneck: Bella + Canvas's spec sheet for the 4719 [29], quoted in search results. The 4711 sheet has the same numbers [30]. Sweatpants: waist from BlankStyle [32], inseam from the size guide on Printify's 4737 page [33]. The inches are the sources'; the cm are arithmetic, rounded to the nearest cm.
- Sleeve: not in the research. [CONFIRM: from the spec sheets [29][30], or drop the column]
- Printful's own size guide may differ. [CONFIRM: open the Size guide tab on each Printful product page [1][2][3] and use its numbers if they differ]
- Measuring points: the 4711 sheet measures length from the high point of the shoulder to the hem [30], as store/apparel-copy.md's steps do. [CONFIRM: the same on the 4719 sheet, and that chest is measured straight across]
- The sweatpants waist is listed as "waist, relaxed" [32]. These numbers are the waist laid flat, not all the way round: a 15 in waist couldn't fit an adult. [CONFIRM on the spec sheet]
- For the fit lines in store/apparel-copy.md: the 4719 and 4711 are cut oversized by name [1][2], and reviewers say the 4711 runs very large and women size down [2]. Fill its "size down" placeholder only after trying the samples.
- The charts are for these blanks only. The owner's picks (Read first) need their own.
- Spec sheets, for checking: [29] 4719, [30] 4711, [31] 4737, [32] 4737 measurements, [33] Printify's 4737 size guide.

## 5. Placement renders

`store/apparel/build.cjs` draws each decoration at true size on a flat swatch of its garment colour: 110 × 80 mm of fabric at 8 px per mm, the scale of the hat previews in designs/. No garment drawings or mockups. Start with `sheet.png`: one row per placement, one column per colour, all at the same scale.

| File in store/apparel/ | Shows | Size |
|---|---|---|
| chest-bone.png, chest-spruce.png, chest-navy.png | The lockup, left chest of the hoodie and crewneck | 62.6 × 18.0 mm |
| wrist-bone.png, wrist-spruce.png, wrist-navy.png | The symbol, left wrist of the hoodie and crewneck | 11.8 × 25.0 mm |
| leg-bone.png, leg-navy.png | The symbol, front left leg of the sweatpants | 11.8 × 25.0 mm |
| leg-40mm-bone.png, leg-40mm-navy.png | The larger leg option | 19.1 × 40.0 mm |
| sheet.png | All ten, labelled | |

- The swatches are the brand fabrics the blanks stand in for: Bone #E4DDCB, Spruce #2E3D35 and Slate #27303D. They aren't Printful's real colours, which nobody has seen. The real Navy is bluer.
- The threads are the brand targets: Ink, Rust, Bone and Sun. With standard threads, Rust becomes a brighter orange, Sun a darker, browner gold and Bone a colder white (pod-partner.md).
- The script builds the artwork from the logo build and checks it byte for byte against the approved files in designs/mark/final/the-o/. All match, except the dark 40 mm symbol, which has no file yet. It stops on any size under the floors in notes.md, and on any swatch too small to show the artwork at true size.
- Checked on the output: the chest logo is 502 px wide, 62.75 mm at 8 px per mm. The extra 0.15 mm is anti-aliasing.
- Rebuild: `cd /home/user/offshft/tools && node ../store/apparel/build.cjs`
- For the owner's picks, change the garment colours (`COLOURS`) and placements (`RENDERS`) at the top of build.cjs and run it again. The artwork, floor checks and true-size check stay as they are.

## Store changes (owner, when the clothes launch)

store/apparel-copy.md lists every copy and structure change clothes need, with the new words: the Lounge, Hoodies and crews, Sweats and Everything collections, the menus, the FAQ and Size & fit sections, the lines that say "hats", and the brand line. None of it is applied, and each one is a store change, so the owner makes it. This plan adds three things to it:

- **The charts** in section 4 fill its two empty Size & fit charts, if these blanks are used.
- **Size swaps** (its owner decision 5): Printful doesn't cover a change of mind [20], so any swap would be at the store's cost. [CONFIRM: how Printful treats a customer who picked the wrong size]
- **Shipping:** its FAQ and Shipping & returns lines carry over, but the free-shipping flag in section 2 needs settling first.

## Owner decisions

1. The name in clothing, with a trademark lawyer, before any garment goes on sale (store/apparel-copy.md, owner decision 1).
2. Which blanks: this plan's Bella + Canvas set, or the owner's picks in store/picks.md. If the picks, this plan's blank facts, prices, colours, charts and renders are redone for them once the Comfort Colors check finishes.
3. The look: the logo on the left chest at hat-front size, and the clock symbol on the left wrist and leg (proposed).
4. Leg symbol: 25 mm (proposed) or 40 mm.
5. Colours: Bone, Spruce and Navy (sweatpants: Bone and Navy), after a swatch check.
6. Prices: C$89.99, C$79.99, C$79.99. One price for every size, or more for 2XL and up.
7. Shipping on clothes: charge it (proposed), or a free-shipping line one piece can't reach. This settles the hoodie flags.
8. Threads: Printful's standard threads, or unlimited colour at +US$3.50 a piece.
9. Spending: digitizing (about US$21.85) and one sample order (about US$90.81 plus shipping).
10. GST/HST: register or not, with an accountant. It decides whether HST on Ontario-made orders is a cost.

Size swaps, the brand line, the collections and the menus are decisions in store/apparel-copy.md.

## Sources

Printful (pages blocked from this session; facts from search results that quote them)

1. Bella + Canvas 4719 hoodie: https://www.printful.com/custom/mens/hoodies/unisex-oversized-heavyweight-hoodie-bella-canvas-4719
2. Bella + Canvas 4711 crewneck: https://www.printful.com/custom/mens/sweatshirts/unisex-oversized-heavyweight-sweatshirt-bella-canvas-4711
3. Bella + Canvas 4737 sweatpants: https://www.printful.com/custom/mens/sweatpants-joggers/unisex-heavyweight-sweatpants-bella-canvas-4737
4. Bottoms category (4737 sizes): https://www.printful.com/custom/womens/bottoms
5. Embroidered sweatshirts (extra placement, unlimited colour, wrist areas above the cuffs): https://www.printful.com/custom-embroidered-sweatshirts
6. Digitization and adjustment fees: https://help.printful.com/hc/en-us/articles/360014009540
7. Embroidery prep, minimum sizes: https://help.printful.com/hc/en-us/articles/28727397325340-How-should-I-prepare-my-design-for-embroidery
8. Embroidery prep and thread colours: https://help.printful.com/hc/en-us/articles/50263985175953-How-should-I-prepare-my-design-for-embroidery
9. Disclaimers for printing techniques (connecting stitches): https://help.printful.com/hc/en-us/articles/50264395400337-Disclaimers-for-Printing-Techniques
10. Hoodie logo placement guide (left chest): https://www.printful.com/blog/hoodie-logo-placement-guide
11. Sleeve design guide (sleeve-top embroidery area): https://www.printful.com/blog/t-shirt-sleeve-design
12. The 2XL+ size markup: https://help.printful.com/hc/en-us/articles/14931863413148-What-is-the-2XL-size-markup
13. How long fulfillment takes: https://help.printful.com/hc/en-us/articles/360014007980
14. Shipping options: https://help.printful.com/hc/en-us/articles/20559768364188-What-shipping-options-are-available
15. Selling region preferences (Availability tab): https://help.printful.com/hc/en-us/articles/360018496919-What-are-the-selling-region-preferences
16. Embroidered clothing, Canada: https://www.printful.com/ca/embroidered-clothing
17. Delivered Duty Paid (DDP): https://help.printful.com/hc/en-us/articles/15941136562332-What-is-the-Delivered-Duty-Paid-DDP-shipping-option
18. Sample orders: https://help.printful.com/hc/en-us/articles/360014067959
19. Sales tax for Canadian orders: https://help.printful.com/hc/en-us/articles/360017039060-How-does-sales-tax-work-for-my-Canadian-orders
20. Return and refund policy: https://help.printful.com/hc/en-us/articles/360014006840-What-is-Printful-s-return-and-refund-policy
21. Independent Trading PRM50PTPD sweatpants (won't exactly match its hoodie): https://www.printful.com/custom/product/541
22. Canadian fulfillment centre announcement: https://www.printful.com/news/printful-to-open-a-canadian-fulfillment-center

Shopify (via store/research/shopify-setup.md)

23. Pricing, Canada (card rates on Basic): https://www.shopify.com/ca/pricing
24. Currency conversion fees: https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/currency-conversion-calculation
25. Local currencies in Markets: https://help.shopify.com/en/manual/markets/customizations/local-currencies

Government

26. CBSA, CUSMA low-value shipments: https://www.cbsa-asfc.gc.ca/services/cusma-aceum/lvs-efv-eng.html
27. CRA, GST/HST rates and place of supply: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html
28. CRA, GST/HST registrants and small suppliers (RC4022): https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html

Makers and others

29. BlankStyle, BC4719 spec sheet (full table quoted in search results): https://www.blankstyle.com/files/specs/24180/SpecSheetMeasurements_BC4719.pdf
30. BlankStyle, BC4711 spec sheet: https://www.blankstyle.com/files/specs/24178/SpecSheetMeasurements_BC4711.pdf
31. BlankStyle, BC4737 spec sheet (colours): https://www.blankstyle.com/files/specs/24181/SpecSheetMeasurements_BC4737.pdf
32. BlankStyle, BC4737 measurements (waist): https://www.blankstyle.com/bellacanvas-4737-unisex-10oz-sweatpant
33. Printify, Bella + Canvas 4737 (size guide, inseam): https://printify.com/app/products/2771/bella-canvas/unisex-heavyweight-sweatpants
34. ShirtSpace, BC4719 (blend change): https://www.shirtspace.com/bella-canvas/sweatshirts/24306-bella-canvas-4719-unisex-10-ounce-heavyweight-pullover-hoodie
35. exchange-rates.org, 1 October 2026: https://www.exchange-rates.org/exchange-rate-history/cad-usd-2026-10-01

The owner's picks (Printful, via store/research/apparel.md)

36. AS Colour 5161 hoodie: https://www.printful.com/custom/mens/hoodies/unisex-oversized-hoodie-as-colour-5161
37. Comfort Colors 1567 hoodie: https://www.printful.com/custom/product/970

In this repo: store/research/apparel.md, store/research/pod-partner.md, store/research/shopify-setup.md, designs/mark/final/the-o/notes.md, BRAND.md, PRODUCTS.md, store/products/_template.md.
