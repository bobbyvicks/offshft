# Fulfilment: where each order is made, and the border

Research for OFF SHFT, 29 October 2026. Canada and the US only, as the owner asked. It answers the owner's question: if someone in the States orders, does each product need to be available in both countries? Nothing here spends money or changes the store (AGENTS.md).

**How to read it**

- Numbers in square brackets are sources, listed in section 7.
- A fact with a source and no flag is **confirmed**: it was seen for this exact product or rule.
- **[CONFIRM]** marks a fact still **to confirm**. It was seen only in a search snippet, an old snapshot or a third-party copy, or nobody could re-check it.
- "Arithmetic" means worked out here from cited numbers.
- "Made in" means where Printful embroiders and ships a piece. It is not where the blank was sewn: the 6030 tee's blank, for one, comes from Honduras [27][109]. Never say "made in Canada" or "made in the USA" about a product (AGENTS.md).

**How it was checked**

- Printful's sites and API, and the US and Canadian government sites, couldn't be opened from this session. Researchers read them through search results that quote them, until this run's shared search allowance ran out.
- Independent checkers then re-checked what they could: Shopify's developer docs, a read-only look at the store, this repo and public code on GitHub. Most Printful and border facts couldn't be re-checked, so they carry [CONFIRM].
- Prices are snapshots, and most show no date.
- To settle the rest, you can check in Printful's dashboard (section 6). Or printful.com, help.printful.com and api.printful.com can be allowed in the session's network settings for another research pass.
- This builds on store/research/pod-partner.md, store/research/apparel.md, store/apparel-plan.md and store/picks.md. Section 5 lists what changes in them.
- The Champion anorak joined your picks after the product research ran, so its facts come only from store/picks.md and weren't re-checked.

## 1. The answer

**How an order flows.** A buyer orders on your Shopify store. The order goes to Printful, and Printful makes and ships it [CONFIRM] [1].

**Do you need each product made in both countries? Not strictly, but you want it.**

- Printful picks the shop for each order: the closest one that has the blank in stock, does the embroidery and has room. You can't choose [CONFIRM] [2].
- If only one country can make a piece, an order from the other country isn't refused. Printful's pages describe two outcomes: a shop in the other country makes it and ships it across the border, or the order waits on hold for local stock [CONFIRM] [2][3][4].
- A parcel that crosses the border costs someone money (below), and Printful publishes no delivery time for it.

**Your 12 picks: not known yet.** No source shows where Printful embroiders any of them, in either country. So all 12 are "unknown" for now (section 4). Nothing found says any of them is made only outside Canada and the US. That includes the Otto 5-panel, despite the note on the picker page (section 5). One flag: a Printful page said the Champion anorak is unavailable in some regions, and whether that means Canada or the US isn't known yet [CONFIRM] [110].

**If a piece is made in only one country:**

| Made only in | Sold to | Who pays what at the border |
|---|---|---|
| The US | A buyer in Canada | The buyer, at the door. By courier: GST/HST (Canada's sales tax) when the parcel is worth over C$40, and duty (import tax) too over C$150, plus the courier's fee. By post: both over C$20. A single C$34.99 hat by courier owes nothing. If you turn on Printful's Canada DDP ("delivered duty paid"), the buyer pays nothing at the door: the duty and tax are added to the shipping price at checkout [CONFIRM] [69][5] |
| Canada (Ontario) | A buyer in the US | Duty from the first dollar: the US has no duty-free limit for any country now. On a Honduras-sewn tee it's about 26.5% of the declared value (arithmetic, section 3). Who pays is unclear. One Printful page says these parcels go duties paid, with "No extra costs for you or your customers". Another says they "may" get "an additional customs charge" [CONFIRM] [82][4][6] |

**How much longer it takes.**

- Printful's pages say 2–5 business days to make an order, then 3–4 business days of standard shipping to US and Canadian addresses [CONFIRM] [7][8].
- No published time was found for an Ontario-made parcel going to the US [CONFIRM].
- For a US-made parcel going to Canada, its pages disagree: 3–4 business days on the current page, 6–10 in an older FAQ [CONFIRM] [8][9]. Canada DDP parcels take 3–5 business days, and up to 12 to Atlantic Canada [CONFIRM] [8].
- Neither page says how long customs adds [CONFIRM]. Only a test order would show it. A test order costs money, so it's your call.

**Your options for a piece made in only one country** (section 5):

1. Swap the blank for one Printful makes in both countries.
2. Sell it only in the country that makes it. Shopify can hide a product from one market (a country you sell to, with its own settings) [57].
3. Sell it in both and handle the border cost: pay it, price it in, or tell buyers they may owe it.

**First, though:** the store ships only to Canada today. US buyers can't check out until a US market is added [58].

## 2. How Printful decides where an order is made

### How Printful picks the shop

- **The shops.** Printful lists shops in the Dallas area (Texas) and Charlotte (North Carolina) in the US, and in Mississauga, Ontario, near Toronto. A shop in Tijuana, Mexico, also makes some US orders, which then ship from inside the US [CONFIRM] [10].
- **The rule.** For each order, Printful weighs the delivery address, where the blank is in stock, where the embroidery is offered and how busy each shop is. Most orders go to the closest shop [CONFIRM] [2].
- **Backup shops.** Printful sends every US order it can to its US shops. If an item isn't available there, or demand surges, a backup shop may make it [CONFIRM] [2][4]. A setting turns backup shops off (table below). Printful doesn't say exactly what then happens. Its tariff article says US orders with no US stock that can't go anywhere else wait on hold until stock arrives, and you can switch the product, wait or cancel [CONFIRM] [4].
- **Stock is kept per colour and size.** Printful's API (the data feed it offers apps) lists a stock status for each colour and size in each region, with Canada and the US as separate regions [11]. So even a piece made in both countries may cross the border now and then, when one colour or size runs out locally [CONFIRM].
- **Printful makes only some products in Canada.** Its Canadian pages say so [12]. Its 2020 announcement said the Ontario shop would start with printing and embroidered hats and apparel [CONFIRM] [13]. Its Canadian hat page says hats ship from Toronto, "as fast as 2–4 days across Canada", without naming models [CONFIRM] [14].

### Printful settings that matter

| Setting | Where | What it does |
|---|---|---|
| Availability tab | Each product page, under the product specs | Shows each colour and size at each location, as "In stock", "Stocked on demand" (ordered from the supplier when needed) or another status. This is where you read "made in" [CONFIRM] [15][16] |
| Account selling region | Dashboard → Preferences, top right | Filters the catalog you browse [CONFIRM] [16] |
| Store selling region | Settings → Store settings → General → Store default selling preferences | Printful's setting for where the store sells. Decides what you can add to the store, and which shops stock sync counts. It doesn't decide where an order is made: Printful makes orders locally where it can, even outside the region [CONFIRM] [16][3]. Choose one that covers Canada and the US; the full list of choices wasn't found [CONFIRM] [17] |
| Stock sync | Store settings | Marks a colour and size as out of stock in Shopify when it's out at every shop in the store's region, and emails you [CONFIRM] [17] |
| Backup fulfilment centres | Settings → Store settings → Orders → Order fulfillment centers | On: an order can be made in the other country. Off: it may wait for local stock instead [CONFIRM] [2][4] |
| Manual confirm | Settings → Store settings → Orders → "Manually confirm all imported orders" | Holds each Shopify order until you confirm it [CONFIRM] [18] |
| Canada DDP | Settings → Store settings → Shipping → International shipping, USA and Canada tab | Adds the duty and tax to the shipping price at checkout for Canadian buyers. Needs Printful's live rates and a phone number on the address. May not show for some order sizes or shops [CONFIRM] [5] |
| Orders page | Printful dashboard | After an order ships, a flag next to the Shipment ID shows the country it was made in, says a third-party help page [CONFIRM] [101] |

How orders reach Printful: paid orders go on their own if Shopify fulfils them automatically; otherwise you click "Request fulfillment" on each order [CONFIRM] [1]. On Shopify's side, the request goes to the service that runs the item's location [59].

### Shopify: the store today

A read-only check on 29 October 2026 found [58]:

- **Plan:** trial. A plan has to be picked before selling.
- **Markets:** one, Canada. The store ships only to Canada. There's no US market yet.
- **Printful:** not set up. The only location is "Shop location", and the only fulfilment service is "Manual".
- **Shipping in the Canada market:** Standard C$12.00, free on orders of C$75.00 or more, and Express C$20.00. Both apply only to parcels from "Shop location".
- **Market-driven shipping is on.** This is Shopify's new way of setting shipping inside each market, instead of in shipping profiles. A rate covers all products or chosen collections, and can be limited to chosen locations. It can't be set for a single product [58][60][61].

### Shopify: what to watch once Printful is connected

- **The free-over-C$75 rate may not cover Printful items.** A rate limited to certain locations applies only to parcels from those locations [60]. Printful's items will sit at Printful's own location. So the store's rates need Printful's location added, or buyers may see only Printful's rates [CONFIRM: after connecting].
- **Printful's rates.**
  - An app's own shipping rates keep working on market-driven stores, and show next to the store's rates in each market. You can switch an app's rates on or off per market, but not change them [62].
  - When an app writes to the store's own shipping settings, the write "may succeed without errors but will not update" them [63]. So Printful's flat rates should work, but a live-rate setup that moves products into the store's own shipping may quietly do nothing [CONFIRM].
  - Printful's setup guide is written for the older shipping profiles [CONFIRM] [19]. Whether its app is ready for market-driven shipping wasn't found [CONFIRM]. Since 1 October 2026, Shopify warns you when you install an app that isn't marked ready [62].
  - Every store moves to market-driven shipping by 1 July 2027; Shopify calls its dates targets [64].
- **Live rates** are shipping prices Printful works out at checkout. Canada DDP needs them.
  - Shopify allows them on Advanced and up, or on Grow billed yearly or with a paid add-on, but not on Basic [65]. Printful's DDP page lists only Advanced and Plus [CONFIRM] [5].
  - For a live-rate service set up through Shopify's latest app interface (version 2026-10), Shopify no longer adds the rates to the store's shipping on its own. The store or the app has to add them, or checkout shows none [66]. On this store, that means adding them in each market [CONFIRM].
- **Shipping on mixed orders.** Printful packs structured hats, such as truckers, apart from other items, and bills each parcel [CONFIRM] [20][21]. Shopify's market-driven shipping can charge only the highest matching rate, instead of adding rates up [61]. So an order of a hat and a hoodie may collect less shipping than Printful bills [CONFIRM: after connecting].

### Selling a product in one country only

- **The market's catalog: the reliable way.** A catalog is the list of products a market can buy. A product left out of it is hidden in that market, missing from search, and can't be added to the cart. If a buyer changes to an address in that market at checkout, it's taken out of the cart [57].
  - In the admin, you tick the product in the market's catalog and exclude it [CONFIRM: the button's exact name] [67].
  - It works per product, not per colour or size; Shopify's developer guide points that way [CONFIRM] [68].
  - Whether a product can be left out of the Canada (home) market wasn't confirmed [CONFIRM]. The Canada market has no catalog yet [58].
- **Shipping rates: not reliable.** Leaving a product's collection out of a market's rates won't block it, because Printful's own rates would still cover it. You can only switch Printful's rates on or off for a whole market [62].

## 3. What a buyer pays at the border, as of today

| Made in | Buyer in | At the border |
|---|---|---|
| Ontario | Canada | Nothing. Printful says no customs or duty fees [CONFIRM] [22] |
| The US | The US | Nothing. Printful says no tariffs [CONFIRM] [6] |
| The US | Canada | By courier, GST/HST over C$40 and duty over C$150, paid at the door, unless Canada DDP is on. See below |
| Ontario | The US | Duty from the first dollar; who pays is unclear. See below |

### Made in the US, sent to a buyer in Canada

Without Canada DDP, the buyer pays at the door. The lines depend on how the parcel comes [CONFIRM] [69][70][71]:

| Value of the parcel | By courier | By post |
|---|---|---|
| Up to C$20 | Nothing | Nothing |
| C$20.01 to C$40 | Nothing | Duty and GST/HST |
| C$40.01 to C$150 | GST/HST, no duty | Duty and GST/HST |
| Over C$150 | Duty and GST/HST | Duty and GST/HST |

- **GST/HST** is charged at the buyer's provincial rate: 13% in Ontario [CONFIRM] [72].
- **Duty** goes by where the blank was sewn. Canada's normal rate on knit tops is 18%. The rate for caps wasn't found [CONFIRM] [73].
- **Fees.** When anything is owed, the courier adds a brokerage fee, its charge for clearing customs. One broker's table lists UPS at C$17.25 to C$32.25, by value from C$40 to C$200; the file's name says 2024 [CONFIRM] [74]. Canada Post adds C$9.95 to each item that owes duty or tax [CONFIRM] [75].
- **Which carrier.** Printful picks it and names it in the shipping email. Its usual Canadian carriers are Canpar and UPS. The carrier for US-to-Canada parcels wasn't found [CONFIRM] [23].
- **Canada's 2026 surtax**, an extra tax on listed US goods, started on 8 September 2026. It's 15%, 25% or 50%, and clothing is in the 50% group. It's owed even under the C$20, C$40 and C$150 lines, and GST/HST is charged on top [CONFIRM] [76][77][78][79].
  - It applies only to goods of US origin. Embroidery counts as a finishing step, so a blank sewn in Honduras or Vietnam and embroidered in the US should keep Honduras or Vietnam as its origin [CONFIRM] [80].
  - But the buyer may have to show the goods aren't US-made, and whether caps are on the list wasn't found [CONFIRM] [78].
  - Canada's 2025 counter-tariffs ended on 1 September 2025, except on steel, aluminum and autos [CONFIRM] [81].
- **Canada DDP.** Printful's "Standard DDP" builds the duty and tax into one shipping price at checkout, so the buyer pays nothing at the door. There's no set fee; it's worked out for each order [CONFIRM] [5]. It needs live rates (section 2).

Examples: a buyer in Ontario, by courier, no DDP, at the store's prices. This assumes Printful declares the store's price as the value [CONFIRM] [24]. Arithmetic; the rates and fees are [CONFIRM].

| Order | Value | Owed at the door | UPS fee, if UPS brings it |
|---|---|---|---|
| One hat | C$34.99 [111] | Nothing | None |
| Two hats in one parcel | C$69.98 | About C$9.10 HST | C$21.25 |
| One hoodie | C$89.99 [112] | About C$11.70 HST | C$21.25 |
| Hoodie and sweatpants in one parcel | C$169.98 [112] | About C$30.60 duty and C$26.08 HST | C$32.25 |

Two things could change these. Whether the lines count per parcel or per order wasn't found, so a set sent in two parcels might stay under C$150 each [CONFIRM]. And whether the C$150 duty line needs goods made in North America is still to read in memo D8-2-16 from Canada's border agency (CBSA) [CONFIRM] [70]. If it does, the C$89.99 hoodie owes duty too.

### Made in Ontario, sent to a buyer in the US

- **No duty-free limit.** The US gives no duty-free entry to low-value parcels from any country. Its US$800 limit has been suspended since 29 August 2025. Rules from US Customs (CBP) on 24 June 2026 made that indefinite, and a 2025 law ends the limit for good on 1 July 2027 [CONFIRM] [82][83][84]. A US trade court upheld the suspension on 13 August 2026 [CONFIRM] [85].
- **Duty goes by where the blank was sewn, not by Canada.** Embroidery doesn't change a garment's origin for US customs [CONFIRM] [86]. The Canada–US–Mexico trade deal (CUSMA) doesn't help: clothing qualifies only if the yarn, the fabric and the sewing are all North American [CONFIRM] [87].
- **How much.**
  - Normal US duty is about 16.5% on cotton knit tees, and on cotton sweatshirts and hoodies [CONFIRM] [88][89]. Caps pay less; one source gives 7.5–10% for cotton caps [CONFIRM] [90].
  - Since 24 July 2026 the US adds an extra tariff by the goods' country: 10% for Honduras and Bangladesh, 12.5% for Vietnam [CONFIRM] [91][92].
  - Example (arithmetic): a Honduras-sewn tee declared at US$40 owes about 16.5% + 10% = 26.5%, or US$10.60, before fees [CONFIRM].
  - The US also charges 50% on listed Canadian products, since 22 August 2026. It goes by where goods were made, so it shouldn't touch blanks sewn outside Canada [CONFIRM] [93].
- **Who pays: unclear. This is the open question for US buyers.**
  - Printful's tariff article says every international order it ships to the US goes duties paid by default, with "No extra costs for you or your customers" [CONFIRM] [4].
  - Another Printful article says orders "coming from outside the US" may get "an additional customs charge", and that Printful absorbs costs "where possible" [CONFIRM] [6].
  - If the first article is right, the US buyer pays nothing at the door, and the open question is whether the duty lands on the store's Printful bill. Ask Printful, or check the invoice of a real Ontario-to-US order.
- **If a parcel isn't duties paid,** the US buyer pays the duty through the carrier, plus fees [CONFIRM] [24]:
  - UPS: US$10 on parcels worth up to US$200, when its fee started in August 2025 [CONFIRM] [94][95].
  - FedEx: US$15 or more to pay the duty for the buyer; one report says US$17.50 since 20 July 2026 [CONFIRM] [96][97].
  - DHL: US$17.50 or more [CONFIRM] [98].
  - US Customs: US$2.77 per parcel entry, from 1 October 2026 [CONFIRM] [99].
- **Coming up.** US Customs proposed new rules for low-value parcels on 8 October 2026. Comments close on 7 December 2026, and no start date is set [CONFIRM] [100].

### Orders with pieces from both countries

- Pieces made in different places ship in separate parcels. Each parcel crosses the border, or doesn't, on its own [CONFIRM] [25].
- Printful packs structured hats apart from other items [CONFIRM] [20]. The 6606 trucker is one. Printful files the Otto 31-069 under dad hats, so whether it ships alone is to confirm [CONFIRM] [28].
- Each extra parcel adds shipping cost [CONFIRM] [25].

## 4. Every product

No source shows where Printful embroiders any of these 18 pieces, so every "made in" answer is unknown until someone reads the Availability tab [CONFIRM]. Nothing found says any of them is made only outside Canada and the US.

- **Verdicts.** "both": every buyer gets it from their own country. "us-only" or "canada-only": made in one country only. "neither": made only outside Canada and the US, so you can't use it. "unknown": not settled yet.
- **Picks.** The owner's 12 picks are marked **Yes**, from the 29 October selection in store/picks.md [110]. The anorak was added to it last.
- **Prices** are Printful's listed prices in snapshots. "One print included" may mean a printing price, not embroidery. Only the two hats marked "one embroidery placement included" show an embroidered price. C$ prices are Printful's own, where seen; none is an exchange-rate estimate.

| # | Product | Pick | Made in the US (embroidered)? | Made in Canada? | Verdict | US$ | C$ | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Retro Trucker Hat, Yupoong 6606 | **Yes** | Unknown | Unknown | unknown | 13.56 with one embroidery placement included; US shipping from 4.69 [29] | 17.95 (embroidered listing) or 19.25 (two other listings) [CONFIRM] [30][31][32] | Canadian listings are a hint, not proof it's made in Ontario. Blank reported as sewn in Vietnam or Bangladesh [CONFIRM] [29] |
| 2 | 5 Panel Mid-Profile Baseball Cap, Otto Cap 31-069 | **Yes** | Unknown | Unknown | unknown | 12.56 with one embroidery placement included; US shipping from 4.69. Snapshots from about mid-September to early October 2026 [33][28] | Not found | The picker's "only in Europe" note isn't backed (section 5). Printful's Canadian hat page doesn't name Otto among its brands: a hint only [CONFIRM] [14] |
| 3 | Classic Dad Hat, Yupoong 6245CM | **Yes** | Unknown | Unknown | unknown | Not found with embroidery. The US$14.02 listing is a printing price [CONFIRM] [34] | Not found | Printful embroiders it [26]. No Printful page found saying Printful makes it in Canada [CONFIRM] |
| 4 | Golf Rope Cap, Big Accessories BA671 | **Yes** | Unknown | Unknown | unknown | 13.45–13.72 listed "with print included"; may be a printing price [CONFIRM] [35] | Not found | Printful offers embroidery on it (28 October snapshot) [36]. Big Accessories isn't among the brands on Printful's Canadian hat page: a hint only [CONFIRM] [14] |
| 5 | Unisex Oversized Hoodie, AS Colour 5161 | **Yes** | Unknown | Unknown | unknown | 38.97 listed, one print included; US shipping from 8.79 [37][38] | 55.50 listed [39] | Embroidery on centre chest, left chest, large front and both wrists; none on the back [38]. A Canadian listing doesn't show where it's made. Blank reported as sewn in Vietnam [CONFIRM] [37][102] |
| 6 | Garment-Dyed Hooded Sweatshirt, Comfort Colors 1567 | **Yes** | Unknown | Unknown | unknown | 40.75 or 39.95 listed, one print included; 40.75 is likely current [CONFIRM] [40][113][103] | Not found | Embroidery on large front, centre chest and left chest; no wrist or hood [40] |
| 7 | Lightweight Fleece Hooded Sweatshirt, Comfort Colors 1467 | **Yes** | Unknown | Unknown | unknown | 30.55 or 29.95 listed, one print included; 30.55 is likely current [CONFIRM] [41] | Not found | Whether Printful embroiders it at all isn't confirmed [CONFIRM] [41] |
| 8 | Lightweight Fleece Crewneck Sweatshirt, Comfort Colors 1466 | **Yes** | Unknown | Unknown | unknown | 28.51 listed, one print included [42] | Not found | Embroidery on left chest, centre chest and large front [42] |
| 9 | Garment-Dyed Fleece Sweatpants, Comfort Colors 1469 | **Yes** | Unknown | Unknown | unknown | Not found | Not found | Whether Printful embroiders it isn't confirmed. Your link opens with Embroidery selected, a hint only [CONFIRM] [43] |
| 10 | Garment-Dyed Heavyweight T-Shirt, Comfort Colors 1717 | **Yes** | Unknown | Unknown | unknown | Not found with embroidery. The US$15.60 listing is a printing (DTFlex) price [CONFIRM] [44] | Not found | Embroidery on left chest, centre chest and large centre [CONFIRM] [45]. Blank reported as sewn in Honduras [CONFIRM] [46] |
| 11 | Garment-Dyed Pocket T-Shirt, Comfort Colors 6030 | **Yes** | Unknown | Unknown | unknown | 19.94 listed, one print included; US shipping from 4.95 (a September snapshot) [CONFIRM] [47] | Not found | Embroidery on the large centre and sleeve tops, not the chest [CONFIRM] [27]. The pocket takes a print [104]. Blank sewn in Honduras [27] |
| 12 | Unisex Champion Packable Anorak, CO200 | **Yes** | Unknown | Unknown | unknown | 43.42 listed [CONFIRM] [48][110] | Not found | Left-chest embroidery. A Printful page said it's unavailable in some regions: check Canada and the US first [CONFIRM] [110]. Catalog ID 399 |
| 13 | Unisex Oversized Heavyweight Sweatshirt, Bella + Canvas 4711 | No | Unknown | Unknown | unknown | 33.15 listed, one print included [49] | Not found | Embroidery on left chest, centre chest and both wrists [49] |
| 14 | Unisex Garment-Dyed Sweatshirt, Comfort Colors 1566 | No | Unknown | Unknown | unknown | 30.59 (S–XL), 32.59 (2XL), 34.59 (3XL), from a copy of Printful's catalog data dated 17 October 2026 [CONFIRM] [103] | Not found | Embroidery on left chest, centre chest and both wrists, by the same copy [CONFIRM] [103] |
| 15 | Unisex Heavyweight Sweatpants, Bella + Canvas 4737 | No | Unknown | Unknown | unknown | 36.50–37.23 listed, both printing (DTFlex) prices [CONFIRM] [50] | Not found | The US$ listings seen show printing only. Embroidery for Canadian or US orders isn't shown [CONFIRM] [50] |
| 16 | Unisex Fleece Sweatpants, Cotton Heritage M7580 | No | Unknown | Unknown | unknown | Not found | Not found | No US$ or C$ listing was seen. Embroidery for Canadian or US orders isn't shown [CONFIRM] [51] |
| 17 | Unisex Joggers, Jerzees 975MPR | No | Unknown | Unknown | unknown | 23.00 listed, one print included; US shipping from 8.79 [CONFIRM] [52] | Not found | Printful lists embroidery on the front, printing on the legs [CONFIRM] [52] |
| 18 | Men's Fleece Shorts, Independent Trading IND20SRT | No | Unknown | Unknown | unknown | 26.47 listed, one print included; US shipping from 8.29 [CONFIRM] [53] | Not found | Printful says these shorts take printing and embroidery [CONFIRM] [53] |

## 5. What to do

### Which picks are fine as they are

None yet. No pick is confirmed as made in both countries. That's a gap in what could be checked, not a problem found with the picks.

### Which picks need a decision

Any of the 12 may, depending on what its Availability tab shows. Four need attention first:

- **The 1469 sweatpants and the 1467 hoodie:** whether Printful embroiders them at all isn't confirmed.
- **The Otto 31-069:** its tab clears or confirms the picker's "only in Europe" note (notes below).
- **The Champion anorak:** a Printful page said it's unavailable in some regions [CONFIRM] [110].

### Step 1: check, free, in Printful

1. **The 1469 sweatpants and the 1467 hoodie first.** Does Printful embroider them at all? If not, they can't be sold embroidered in either country.
   - The closest embroidered Comfort Colors pieces are the 1466 crewneck, in the same fabric as the 1467, and the 1567 hoodie [109].
   - No embroidered sweatpants are confirmed for Canada or the US. The 4737's US$ listings show printing only, no US$ listing was seen for the M7580, and the 975MPR's front embroidery is unconfirmed [CONFIRM].
2. **The Champion anorak next.** Check that Printful offers it, embroidered, with the region set to Canada and to the US.
3. **Then all 12.** Read each Availability tab with Embroidery selected, for the colours you plan to sell: once with the region set to Canada, once with it set to the United States (section 6).
4. **Ask Printful** who pays the US duty when an Ontario-made order goes to a US buyer.

### Step 2: decide, piece by piece

| The Availability tab shows | What to do |
|---|---|
| Made in both | Sell it in both countries. The odd order may still cross the border when a colour or size runs out locally [CONFIRM] |
| US only | Choose one: swap the blank; sell it in the US only, by leaving it out of the Canada market's catalog; or sell it in both and cover the Canadian border cost (below) |
| Canada only | Choose one: swap the blank; sell it in Canada only, by leaving it out of the US market's catalog once there is one; or sell it in both once Printful says who pays the US duty (below) |
| Neither: made only outside Canada and the US | Swap it. Every order would cross a border |

### The options for each pick

If a pick turns out to be made in one country only, these are the swaps on the picker page and the border cost to weigh. Selling it in one country only works the same way for every pick (above).

| Pick | Swap to | Border cost if you sell it in both |
|---|---|---|
| 6606 trucker, Otto 31-069 5-panel, 6245CM dad hat, BA671 rope cap | Another of the four hats that's made in both | To Canada: a single hat (C$34.99) by courier owes nothing at the door; two hats owe GST/HST. To the US: duty from the first dollar, lower on caps than on clothing [CONFIRM] |
| 5161, 1567 and 1467 hoodies | Another of the three that's made in both (the 1467 only if Printful embroiders it) | To Canada: a C$89.99 hoodie owes about C$11.70 HST at the door, plus the courier's fee. To the US: about 16.5% duty, plus 10% or 12.5% more if the blank's country is on the US list; Vietnam, reported for the 5161, is at 12.5% [CONFIRM] |
| 1466 crewneck | The 4711 or 1566 crewnecks, on the picker but not picked | Like the hoodies |
| 1469 sweatpants | None confirmed: see Step 1 | To Canada: with a hoodie in one parcel (C$169.98), the buyer passes C$150 and owes duty too. To the US: the duty rate for sweatpants wasn't found [CONFIRM] |
| 1717 tee, 6030 pocket tee | No other tee is on the picker, so a swap means a new blank | To Canada: GST/HST once the parcel is over C$40. To the US: about 26.5% on a Honduras-sewn tee [CONFIRM] |
| Champion CO200 anorak | No other jacket is on the picker, so a swap means a new blank | To Canada: GST/HST once the parcel is over C$40. To the US: the duty rate for this jacket wasn't found [CONFIRM] |

### Covering the border cost

- **Made in the US, sold in Canada.**
  - A single hat (C$34.99) by courier owes nothing at the door [CONFIRM]. So a US-only hat is little trouble for a Canadian who buys just one. Two hats, or one hoodie, go over C$40.
  - Canada DDP keeps the bill off the doorstep. It needs live rates. On Shopify that means Grow billed yearly or with the add-on, or Advanced and up [65]. Printful's DDP page names Advanced and Plus [CONFIRM] [5]. store/research/shopify-setup.md recommends Basic, which can't do it [114].
  - Or tell Canadian buyers, at checkout and in the FAQ, that they may owe GST/HST and duty on delivery. Printful suggests telling buyers about possible customs charges [CONFIRM] [24][3].
- **Made in Ontario, sold in the US.** Ask Printful first. If the duty lands on the store's bill, price it in: about a quarter of the declared value on a Honduras-sewn tee [CONFIRM].
- **Turning off backup shops** may stop parcels crossing the border, but orders may then wait for local stock [CONFIRM] [2][4]. Only worth weighing once you know where each pick is made.

### Notes on the picks

- **Otto 31-069 (5-panel).** The picker page still says "One unconfirmed note says Printful makes Otto hats only in Europe" [115]. store/picks.md dropped that note: it was added in commit 077ea9f and removed in eb617a0 [110]. It probably comes from a third-party file written for a store that sells in Europe, and that file only says Printful ships Otto caps to European buyers from its European shops [105]. Nothing found says the 31-069 is made only outside Canada and the US. It becomes "neither", and needs a swap, only if its Availability tab shows no Canadian or US shop.
- **6606 trucker and 5161 hoodie.** Both have Printful Canada listings with C$ prices [31][39]. So Printful sells them to Canadians. That doesn't show they're made in Ontario.
- **A structured hat with clothing**, such as the 6606 with a hoodie, ships as at least two parcels [CONFIRM] [20]. If the hat is made in one country and the hoodie in the other, one of them crosses the border.
- **Prices.** Most US$ prices seen say "one print included", and some are printing prices: the 1717 and the dad hat, maybe the rope cap. Read each price with Embroidery selected, and the C$ price with the region set to Canada. Printful's catalog prices follow the region you choose, and the final cost depends on the delivery address and the shop used [CONFIRM] [16].
- **The 1717's "about US$17.95 with embroidery"** on the picker comes from a third-party site whose own pages disagree, so don't rely on it [106][115].

### What changes in the earlier notes

- **store/research/pod-partner.md** says Printful "makes hats on both sides of the border". That's true of its shops, but it isn't shown for any of the four hats [12][116]. It also took Shopify Grow with the add-on as enough for live rates. Shopify agrees [65], but Printful's DDP page names only Advanced and Plus [CONFIRM] [5].
- **store/apparel-plan.md, "Shipping, duties and tax"** covers only US-made parcels sent to Canada [112]. It's missing Ontario-made parcels sent to the US, Canada's 2026 surtax and the Shopify plan Canada DDP needs. Its C$40 and C$150 lines and its times still match what was found, but couldn't be re-checked today [CONFIRM].
- **store/research/shopify-setup.md** says Printful makes US orders in its US shops, so they don't cross a border [114]. That holds only for pieces Printful makes in the US, which isn't confirmed for any pick.
- **store/picks.md**: its "Still open" lines say the dad hat and rope cap weren't picked, but its 29 October selection lists them among the 12 [110]. This note follows the selection.

## 6. Open questions to check in Printful

**In Printful's catalog (free; no order needed)**

1. For each of the 12 picks, open the product with Embroidery selected. Set the region switch to Canada and open the Availability tab; then set it to the United States. Note the result for each colour and size you plan to sell; your Otto link had Royal/Natural [16][15][110]. A greyed-out "Start new order" or "Create product template" button means the product isn't available in that region [CONFIRM] [16]. Start with the 1469, the 1467, the Otto 31-069 and the anorak.
2. Does Printful embroider the 1469 sweatpants and the 1467 hoodie?
3. Does "available" with the region set to Canada mean made in Ontario? How does the tab name the US and Tijuana shops?
4. Printful's Canadian clothing page links to a collection of every product Printful makes in Canada. Opening it may settle several picks at once [CONFIRM] [12].
5. Each pick's price with Embroidery selected: in US$ with the region set to the US, and in C$ with it set to Canada.
6. The store selling region: is there one choice that covers Canada and the US?
7. Does Printful ship the Otto 31-069 apart from other items, like the 6606?
8. Under Settings → Store settings → Orders: is there an "Order fulfillment centers" setting, and what happens to an order when backup shops are off?
9. Or, once api.printful.com can be reached, read Printful's catalog API. It lists stock for each colour and size by region, with Canada and the US separate [11]. Catalog IDs found: 6606 = 252 [54], 31-069 = 952 [107], 5161 = 734 [38], 1567 = 970 [40], 1717 = 586 [109], 6030 = 593 [27], 1566 = 839 [55], 1466 = 971 [CONFIRM] [108], 6245CM = 206 [CONFIRM] [56], CO200 anorak = 399 [110]. Not found: the 1467, the 1469 and the BA671.

**Ask Printful support**

10. When an Ontario-made order goes to a US buyer, is the parcel duties paid by default? Is the duty billed to the store?
11. Is Canada DDP offered on Shopify Grow, billed yearly or with the add-on? What does it add to a typical order, in C$?
12. Which carrier takes US-made parcels to Canada: a courier, or the post?

**After connecting Printful to Shopify**

13. Do Printful's rates show in the Canada market, and in the US market once it exists? Does Shopify warn that the app isn't ready for market-driven shipping?
14. Does the free-over-C$75 rate cover Printful items, given it's limited to "Shop location"?
15. What does a Canadian cart with a hat and a hoodie charge for shipping, against what Printful bills?

**For a customs broker or accountant**

16. Do Canada's C$40 and C$150 lines count per parcel or per order? Does the C$150 duty line need goods made in North America (CBSA memo D8-2-16)?
17. Are caps on Canada's 2026 surtax list? What origin does Printful declare on its customs papers?
18. What's the US duty rate for the 1469 sweatpants? Trousers come under a different tariff heading from tops.
19. If the store registers for GST/HST, does a Canadian buyer of a US-made piece pay HST twice: at checkout, and again at the door?

## 7. Sources

**Printful: help centre, site and API docs. Except for the API docs, none of these could be opened from this session; their facts come from search results that quote them.**

1. How do I manage order processing and fulfillment in Shopify?: https://help.printful.com/hc/en-us/articles/6148086204316-How-do-I-manage-order-processing-and-fulfillment-in-Shopify
2. Can I choose where my products are fulfilled?: https://help.printful.com/hc/en-us/articles/360014068659-Can-I-choose-where-my-products-are-fulfilled
3. Default selling preferences: https://www.printful.com/default-selling-preferences
4. What should I know about the new import tariffs?: https://help.printful.com/hc/en-us/articles/50264786981521-What-should-I-know-about-the-new-import-tariffs
5. What is the Delivered Duty Paid (DDP) shipping option?: https://help.printful.com/hc/en-us/articles/50265097613329-What-is-the-Delivered-Duty-Paid-DDP-shipping-option
6. How will the tariffs affect Printful prices?: https://help.printful.com/hc/en-us/articles/18964831121180-How-will-the-tariffs-affect-Printful-prices
7. How long does it take for my order to be processed?: https://help.printful.com/hc/en-us/articles/50261094545041-How-long-does-it-take-for-my-order-to-be-processed
8. What shipping options are available?: https://help.printful.com/hc/en-us/articles/20559768364188-What-shipping-options-are-available
9. Older FAQ: how quickly are packages delivered?: https://www.printful.com/faq/shipping-packaging-fulfillment/339-how-quickly-are-packages-delivered-
10. Where are the Printful fulfillment centers located?: https://help.printful.com/hc/en-us/articles/360014067239-Where-are-the-Printful-fulfillment-centers-located
11. Printful API documentation (read by a checker through Context7): https://developers.printful.com/docs
12. Printful Canada, custom clothing (Printful makes only some products in Canada; link to that collection): https://www.printful.com/ca/custom-clothing
13. Printful to open a Canadian fulfillment center (2020): https://www.printful.com/news/printful-to-open-a-canadian-fulfillment-center
14. Printful Canada, custom hats (hats ship from Toronto; brands named): https://www.printful.com/ca/custom-hats
15. What do the product availability statuses mean?: https://help.printful.com/hc/en-us/articles/360014068019-What-do-the-product-availability-statuses-mean
16. What are the selling region preferences?: https://help.printful.com/hc/en-us/articles/360018496919-What-are-the-selling-region-preferences
17. What is product stock sync and how does it affect my store?: https://help.printful.com/hc/en-us/articles/4402498011282-What-is-product-stock-sync-and-how-does-it-affect-my-store
18. Can I review my automatically synced orders before they are confirmed?: https://help.printful.com/hc/en-us/articles/50262235051153-Can-I-review-my-automatically-synced-orders-in-Printful-before-they-are-confirmed
19. How do I set up shipping for my Shopify store?: https://help.printful.com/hc/en-us/articles/360014007440-How-do-I-set-up-shipping-for-my-Shopify-store
20. Shipping (rates; items that ship separately): https://www.printful.com/shipping
21. How do I calculate shipping costs for different types of orders?: https://help.printful.com/hc/en-us/articles/20583931065372-How-do-I-calculate-shipping-costs-for-different-types-of-orders
22. Printful Canada, print on demand (no customs or duty on Ontario-made orders to Canada): https://www.printful.com/ca/print-on-demand-canada
23. Glossary: carrier: https://www.printful.com/glossary/carrier
24. Who pays the customs duties and taxes?: https://help.printful.com/hc/en-us/articles/360014066159-Who-pays-the-customs-duties-taxes
25. Are all products in an order shipped together?: https://help.printful.com/hc/en-us/articles/50265136897169-Are-all-products-in-an-order-shipped-together
26. Does the new larger embroidery area of the hat front panel change anything for me? (lists the 6245CM): https://help.printful.com/hc/en-us/articles/50263202274705-Does-the-new-larger-embroidery-area-of-the-hat-front-panel-change-anything-for-me

**Printful: product pages (read the same way)**

27. Comfort Colors 6030 pocket tee, catalog product 593 (placements; blank from Honduras): https://www.printful.com/custom/product/593
28. Otto Cap 31-069, filed under dad hats (US): https://www.printful.com/custom/hats/dad-hats/5-panel-mid-profile-baseball-cap-otto-cap-31-069
29. Retro Trucker Hat, Yupoong 6606, embroidered (US): https://www.printful.com/custom/embroidered/trucker-hats/retro-trucker-cap-yupoong-6606
30. Yupoong 6606, Printful Canada, embroidered listing (C$17.95): https://www.printful.com/ca/custom/embroidered/trucker-hats/retro-trucker-cap-yupoong-6606
31. Yupoong 6606, Printful Canada, mesh hats (C$19.25): https://www.printful.com/ca/custom/hats/mesh-hats/retro-trucker-cap-yupoong-6606
32. Yupoong 6606, Printful Canada, back-to-school collection (C$19.25, in stock): https://printful.com/ca/custom/collections/back-to-school/retro-trucker-cap-yupoong-6606
33. 5 Panel Mid-Profile Baseball Cap, Otto Cap 31-069, embroidered (US): https://www.printful.com/custom/embroidered/dad-hats/5-panel-mid-profile-baseball-cap-otto-cap-31-069
34. Classic Dad Hat, Yupoong 6245CM, DTFlex collection (US$14.02): https://www.printful.com/custom/collections/dtflex/classic-dad-cap-yupoong-6245cm
35. Golf Rope Cap, Big Accessories BA671 (US): https://www.printful.com/custom/hats/all/golf-rope-cap-big-accessories-ba671
36. Golf Rope Cap BA671, embroidery collection: https://www.printful.com/custom/collections/embroidery/golf-rope-cap-big-accessories-ba671
37. Unisex Oversized Hoodie, AS Colour 5161 (US): https://www.printful.com/custom/mens/hoodies/unisex-oversized-hoodie-as-colour-5161
38. AS Colour 5161, catalog product 734 (placements): https://www.printful.com/custom/product/734
39. AS Colour 5161, Printful Canada (C$55.50): https://www.printful.com/ca/custom/mens/hoodies-sweatshirts/unisex-oversized-hoodie-as-colour-5161
40. Comfort Colors 1567 hoodie, catalog product 970: https://www.printful.com/custom/product/970
41. Comfort Colors 1467 lightweight fleece hoodie (US): https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467
42. Comfort Colors 1466 lightweight fleece crewneck (US): https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466/a/podbenchmark
43. Comfort Colors 1469 sweatpants (the owner's link, Embroidery selected): https://www.printful.com/custom/mens/sweatpants-joggers/unisex-garment-dyed-fleece-sweatpants-comfort-colors-1469?technique=EMBROIDERY&color=Ivory&size=L
44. Comfort Colors 1717 tee, DTFlex collection (US$15.60): https://www.printful.com/custom/collections/dtflex/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717
45. Comfort Colors 1717 tee, embroidery collection: https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717
46. Comfort Colors 1717 tee, holiday collection (blank sourced from Honduras): https://www.printful.com/custom/collections/holiday-season/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717
47. Comfort Colors 6030 pocket tee (US price): https://www.printful.com/custom/mens/t-shirts/unisex-garment-dyed-pocket-t-shirt-comfort-colors-6030/a/podbenchmark
48. Unisex Champion Packable Anorak, CO200, catalog product 399 (via store/picks.md): https://www.printful.com/custom/product/399
49. Bella + Canvas 4711 crewneck: https://www.printful.com/custom/mens/sweatshirts/unisex-oversized-heavyweight-sweatshirt-bella-canvas-4711
50. Bella + Canvas 4737 sweatpants: https://www.printful.com/custom/mens/sweatpants-joggers/unisex-heavyweight-sweatpants-bella-canvas-4737
51. Cotton Heritage M7580 sweatpants: https://www.printful.com/custom/mens/sweatpants-joggers/unisex-fleece-sweatpants-cotton-heritage-m7580
52. Jerzees 975MPR joggers: https://www.printful.com/custom/mens/sweatpants-joggers/unisex-joggers-jerzees-975mpr
53. Independent Trading IND20SRT fleece shorts: https://www.printful.com/custom/mens/shorts/mens-fleece-shorts-independent-trading-co-ind20srt
54. Yupoong 6606, catalog product 252: https://www.printful.com/custom/hats-embroidery/252/yupoong-6606-retro-trucker-cap
55. Comfort Colors 1566 crewneck, catalog product 839: https://www.printful.com/custom/product/839
56. Catalog product 206 (probably the 6245CM; title not seen): https://www.printful.com/custom/product/206

**Shopify (a checker read the shopify.dev pages through Shopify's docs tool; help.shopify.com couldn't be opened)**

57. Markets (products left out of a market's catalog): https://shopify.dev/docs/apps/build/markets
58. Read-only check of offshft.myshopify.com through the Shopify Admin API, 29 October 2026: plan, markets, ships-to countries, locations, fulfilment services, shipping options and the market-driven shipping flag
59. Admin API: fulfilment requests to a fulfilment service: https://shopify.dev/docs/api/admin-graphql/2026-10/enums/FulfillmentOrderMerchantRequestKind
60. Admin API: rate conditions by collection or origin location: https://shopify.dev/docs/api/admin-graphql/2026-10/connections/LocationConnection
61. Market-driven shipping, feature preview: https://shopify.dev/docs/apps/build/orders-fulfillment/market-driven-shipping/feature-preview
62. Upgrade your app for market-driven shipping (app rates per market; install warning): https://shopify.dev/docs/apps/build/orders-fulfillment/market-driven-shipping/upgrade-your-app
63. Merchant-owned delivery profile APIs are deprecated for market-driven shipping: https://shopify.dev/changelog/posts/merchant-owned-delivery-profile-apis-are-deprecated-for-market-driven-shipping
64. Market-driven shipping now available in feature preview (timeline): https://shopify.dev/changelog/posts/market-driven-shipping-now-available-in-feature-preview
65. Admin API: CarrierService (which plans can use live rates): https://shopify.dev/docs/api/admin-rest/2026-10/resources/carrierservice
66. Carrier services will no longer be added automatically to the default shipping profile: https://shopify.dev/changelog/posts/carrier-services-will-no-longer-be-automatically-added-to-the-default-shipping-profile
67. Shopify help: catalogs: https://help.shopify.com/en/manual/markets-new/catalogs
68. Build a catalog for a market: https://shopify.dev/docs/apps/build/markets/build-catalog

**Canada (not opened from this session; read through search snippets)**

69. CBSA: CUSMA low-value shipments: https://www.cbsa-asfc.gc.ca/services/cusma-aceum/lvs-efv-eng.html
70. CBSA Memorandum D8-2-16, Courier Imports Remission Order: https://www.cbsa-asfc.gc.ca/publications/dm-md/d8/d8-2-16-eng.html
71. CBSA Memorandum D8-2-2, postal imports: https://www.cbsa-asfc.gc.ca/publications/dm-md/d8/d8-2-2-eng.html
72. CRA: GST/HST rates and place of supply: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html
73. WTO tariff profile: Canada: https://www.wto.org/english/res_e/statis_e/daily_update_e/tariff_profiles/ca_e.pdf
74. A broker's table of UPS and FedEx entry fees into Canada (file named 2024): https://213869.fs1.hubspotusercontent-na1.net/hubfs/213869/fedex%20UPS%20ground%20entry%20preparation%20costs%20Canada%202024.pdf
75. Canada Post: customs duty, taxes and exemptions (C$9.95 fee): https://www.canadapost-postescanada.ca/cpc/en/support/articles/customs-requirements/customs-duty-taxes-and-exemptions.page
76. Finance Canada: Canada announces targeted countermeasures (August 2026): https://www.canada.ca/en/department-finance/news/2026/08/canada-announces-targeted-countermeasures-and-substantive-support-for-workers-and-businesses-in-response-to-us-tariffs.html
77. Finance Canada: US products subject to counter-tariffs from 8 September 2026: https://www.canada.ca/en/department-finance/news/2026/08/list-of-products-from-the-united-states-subject-to-counter-tariffs-effective-september-8-2026.html
78. CBSA Customs Notice 26-23: https://www.cbsa-asfc.gc.ca/publications/cn-ad/cn26-23-eng.html
79. Canada Gazette: United States Surtax Order (2026): https://gazette.gc.ca/rp-pr/p2/2026/2026-09-23/html/sor-dors186-eng.html
80. CUSMA marking rules (SOR/94-23): https://laws-lois.justice.gc.ca/eng/regulations/SOR-94-23/FullText.html
81. Blakes: Canada removes tariffs on US goods (2025): https://www.blakes.com/insights/canada-removes-tariffs-on-u-s-goods/

**United States (not opened from this session; read through search snippets)**

82. Federal Register, 24 June 2026: indefinite suspension of the de minimis (duty-free) exemption: https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other
83. Thompson Hine: CBP rules indefinitely suspending de minimis (June 2026): https://www.thompsonhinesmartrade.com/2026/06/cbp-issues-interim-final-rules-indefinitely-suspending-the-de-minimis-exemption-for-imports/
84. Benesch: de minimis, the executive order and the 2025 budget law: https://www.beneschlaw.com/publication/duty-free-customs-de-minimis-erosion-executive-order-and-big-beautiful-bill-impacts/
85. US Court of International Trade, Slip Op. 26-94 (13 August 2026): https://www.cit.uscourts.gov/sites/cit/files/26-94.pdf
86. CBP: textile rules of origin (embroidery doesn't change origin): https://www.cbp.gov/sites/default/files/assets/documents/2016-Apr/icp006r3_3.pdf
87. trade.gov: USMCA textiles summary: https://trade.gov/summary-usmca-fta-textiles
88. US tariff 6109.10.00, cotton knit T-shirts: https://www.unisco.com/hts/61091000
89. US tariff 6110.20.20, cotton sweatshirts and hoodies: https://www.unisco.com/hts/61102020
90. US tariff 6505.00.15, caps: https://www.unisco.com/hts/65050015
91. EY: Section 301 forced-labour tariffs of 10% or 12.5% from 24 July 2026: https://taxnews.ey.com/news/2026-1607-ustr-finalizes-section-301-forced-labor-tariffs-on-60-economies-additional-tariffs-of-10-percent-or-125-percent-take-effect-24-july-2026
92. Holland & Knight: rates by country (July 2026): https://www.hklaw.com/en/insights/publications/2026/07/and-the-tariff-beat-goes-on
93. Thompson Hine: 50% US tariffs on listed Canadian products (August 2026): https://www.thompsonhinesmartrade.com/2026/08/united-states-implements-50-tariffs-on-canada-canada-responds-with-matching-retaliatory-tariffs/
94. UPS: import fees: https://www.ups.com/us/en/shipping/international-shipping/import-fees
95. WWD Sourcing Journal: UPS international processing fees (August 2025): https://wwd.com/sourcing-journal/logistics/ups-international-processing-fees-de-minimis-ban-customs-us-bound-imports-dhl-royal-mail-japan-canada-post-1238856085/
96. FedEx: 2026 surcharge and fee changes: https://www.fedex.com/content/dam/fedex/us-united-states/services/surcharge_and_fee_changes_2026.pdf
97. Spaceship: FedEx disbursement fee change, 20 July 2026: https://support.spaceshipapp.com/en/upcoming-change-to-fedex-disbursement-fees-effective-july-20-2026
98. DHL Express: customs services (US): https://www.dhl.com/us-en/home/express/products-and-solutions/products-and-services-overview/customs-services.html
99. Tradlinx: CBP customs fees rise on 1 October 2026: https://blogs.tradlinx.com/cbp-customs-fees-rise-on-october-1-heres-what-actually-changes/
100. Federal Register, 8 October 2026: Low-Value Shipments (proposed rule): https://www.federalregister.gov/documents/2026/10/08/2026-20650/low-value-shipments

**Third-party copies and other**

101. Hostinger help: Printful orders (made-in flag): https://www.hostinger.com/support/?p=5706
102. Pinterest copy of Printful's 5161 listing: https://ca.pinterest.com/pin/unisex-oversized-hoodie-as-colour-5161--223561568996809963/
103. A copy of Printful's catalog API data, 17 October 2026 (GitHub): https://github.com/mblyman89/GREENWAY-WEBSITE/blob/02b47fac1168cd6b5fbc762a947ec377ba523586/src/lib/merch-studio/garment-colors-data.ts
104. A US store's Printful setup for the 6030, October 2026 (GitHub): https://github.com/blakeparkinson/farfox-landing/blob/74f2d2729026bf33be365a073fc4b02caac42049/scripts/printful-apparel-2026-10.mjs
105. Printful notes for a store selling in Europe, on Otto caps (GitHub, dated 4 March 2026): https://raw.githubusercontent.com/lroy-stack/ai-pod-store/bd56e0b5cb8158502421de273f8f0453b559f9d1/project/frontend/docs/printful-research/brands-otto-sols-beechfield.md
106. PODVector: embroidered T-shirt cost estimate: https://podvector.ai/articles/printful/costs-and-charges/printful-embroidered-t-shirt-base-cost-full-breakdown-for-pod-sellers
107. A store's Printful code naming the Otto 31-069 as catalog product 952 (GitHub): https://raw.githubusercontent.com/mulhernmarketingsolutions-ux/Dudela/480a0d6892f929228d44947eb4f1adff04de87d1/src/pages/api/admin/printful-debug.ts
108. A copy of Printful catalog matches: 1466 = 971 (GitHub): https://raw.githubusercontent.com/lroy-stack/ai-pod-store/HEAD/project/frontend/scripts/printful-catalog-map.json

**This repo and the picker page**

109. store/research/comfort-colors.md
110. store/picks.md: the owner's 12 picks (29 October selection, with the Champion anorak added last) and the owner's links; git commits 077ea9f and eb617a0 for the Otto note
111. PRODUCTS.md: hat price C$34.99
112. store/apparel-plan.md: proposed prices, and the section "Shipping, duties and tax"
113. store/research/apparel.md (the 1567 at US$40.75)
114. store/research/shopify-setup.md
115. The picker page, read by a checker on 29 October 2026: https://claude.ai/artifact/FMZhNQB1ZEiHrvY2ebMkCa
116. store/research/pod-partner.md
