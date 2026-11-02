# Bases the owner picked

The blank products OFF SHFT is made on, as the owner chose them. Details (price, colours, logo areas) are checked
against Printful and added as each check finishes; the picker page is https://claude.ai/artifact/FMZhNQB1ZEiHrvY2ebMkCa

## The owner's selection (29 Oct 2026)

The owner chose these 11 on the picker page (its database, picks/owner, version 14). Colours are chosen later.

| Kind | Selected |
|---|---|
| Hats | Retro trucker (Yupoong 6606), 5-panel (Otto 31-069), dad hat (Yupoong 6245CM), rope cap (Big Accessories BA671) |
| Hoodies | AS Colour 5161, Comfort Colors 1567, Comfort Colors 1467 |
| Crewneck | Comfort Colors 1466 |
| Sweatpants | Comfort Colors 1469 |
| Tees | Comfort Colors 1717, Comfort Colors 6030 (pocket tee) |
| Jacket | Champion CO200 packable anorak, added from the owner's link: https://www.printful.com/custom/collections/embroidery/embroidered-champion-packable-jacket |

Designs on each piece, chosen on the picker's Designs tab (database: designs/owner, version 20). Each design on each piece becomes its own product:
- The OFF SHFT logo, the clock and Punched Out. go on all four hats, all three hoodies, the 1466 crewneck and the 1469 sweatpants.
- The logo and the clock go on the 1717 tee and the 6030 pocket tee.
- The Champion anorak gets all three: the logo, the clock and Punched Out., each on the left chest at normal size, since the fabric is thin (designs/owner, version 30).
- On the hoodies and crewnecks, Punched Out. goes big on the centre front, Printful's large-front spot, about 230 mm wide. The owner asked for it bigger and in the middle.
- In all, 34 products: 12 pieces, each with its chosen designs.
- The 6030 has no chest or pocket embroidery, so its clock goes on the left sleeve. The logo is too wide for the sleeve, so it goes on Printful's large-centre front spot instead.

Not selected: Bella + Canvas 4711 and Comfort Colors 1566 crewnecks; Bella + Canvas 4737, Cotton Heritage M7580 and Jerzees 975MPR bottoms; Independent Trading IND20SRT shorts.

The anorak (added 29 Oct 2026), as Printful lists it: "Unisex Champion Packable Anorak | CO200", catalog product 399.
- A half-zip pullover with an adjustable bungee hood, 2.8 oz polyester micro poplin, wind and rain resistant. It packs into its front pouch pocket.
- US$43.42 listed. Left-chest embroidery, with small, simple designs suggested on this light fabric.
- Champion's own C logo is on the left sleeve.
- One Printful page said it's unavailable in some regions [CONFIRM: Canada and the US]. Colours on the maker's sheet: Black and Dark Green [CONFIRM: Printful's list].
- Sources: https://www.printful.com/custom/product/399, https://sellfy.com/pod-catalogue/mens-clothing/embroidered-champion-packable-jacket-6b870/, https://www.blankstyle.com/files/specs/16115/SpecSheetMeasurements_CO200.pdf

Still to confirm for the 12, before samples:
- Where Printful makes each one with embroidery: US, Canada (Ontario) or both. Search hasn't turned this up for any of them. It shows in each product's Availability tab on Printful.
- Whether Printful embroiders the 1467 hoodie and the 1469 sweatpants.
- Each price with embroidery, in US$ and C$.

Facts so far: store/research/comfort-colors.md, the cap and AS Colour hoodie checks, and store/research/fulfilment.md (being written).

## In Shopify (29 Oct 2026)

**Update, 1 Nov 2026 (read from the store):** the store's password is off, so all 38 listings can be bought. Printful
has been connected since 29 Oct and has linked all 788 variants: it stocks each at its own location and files it in its
own shipping profiles, which now set what customers pay for shipping (flat US$ rates, no free shipping). The Printful
sheet (https://claude.ai/artifact/DGDrj5W4UfxVqYEjp1u4fY; source in store/printful/) says what each variant should be
linked to, for the owner to check in Printful; its "Your calls" tab lists the decisions this raised. The notes below
are as of 29-30 Oct.

**Update, 2 Nov 2026 (the owner asked for these):** shipping is back on the store's rates (C$12, free from C$75, Canada
and the US; Printful's eight profiles were removed and every product is in the General profile, which now includes the
Printful location). Ten listings were made true to what can be made: flat embroidery at the real sizes instead of 3D
puff (Logo Hat, three beanies, three bucket hats, For a Reason.), the Punched Out. Hoodie's Oversized embroidery as the
two-line stack at the chest, Not Picking Up.'s as the one line on the big front, and the beanies' and bucket hats'
colours listed. Every clothing listing has a size chart in its `custom.size_chart` metafield (store/theme/size-charts.cjs)
and the Size & fit page has charts for the quarter-zips and golf shirts. The Footer menu lists the help pages. Still the
owner's: the three product-page rows, the two policies and the footer block (store/theme/product-page-rows.md). Art for
the five listings made outside this repo is being drawn with the phrases generator (designs/phrases/).

**Update, 2 Nov 2026, later: the hard-edged logo.** The owner compared the site with the merch photos and picked the
hard-edged lettering Codex drew for the hat mockups (the live theme's artwork, titled "puff adaptation") over the
rounded Unbounded logo. Rebuilt from that drawing as `designs/mark/final/block/build.cjs` (block F, H, T; the thickened
S; heavy ring; bar hands; same proportions at every size, with the embroidery floors kept). Everything downstream was
regenerated from it: the brand kit and brand sheet, the store's header logo files, share images and square logo
(replaced in Shopify's Files with the same ids, so the theme picked them up), the Printful logo and clock files and the Printful sheet. The word space is the original logo's (the owner's
call that evening: the hat drawing ran OFF and SHFT together), so the lockup is 68.6 mm wide with the same 10.7 mm
letters; the clocks are 25 and 40 mm as before. The tab icon didn't change
(it was already drawn with square hands). Not changed: the phrase designs (Punched Out. and the rest) are still in
Unbounded, pending the owner's word; Codex's hat mockups for those phrases also use a hard-edged face. Also today:
every variant checked available in the admin (813 of 813, 9999 at Printful) while the storefront showed "Sold out";
all 38 products were re-saved (seo title) at 04:46 UTC to refresh the storefront, to be confirmed by the owner. Still drawing the rounded logo, on purpose: the picker previews (store/previews) and the apparel
placement renders (store/apparel), both 29 Oct records that the store no longer uses.

**Update, 2 Nov 2026, night: the "sold out" cause and fix.** The storefront counts a variant's stock only at locations
that sit in the variant's own shipping profile. The General profile had lost the Printful location again (Printful's
app pulled it back into its own profiles when it linked the new Blue Jean and True Navy variants at 03:48 UTC), so
every variant in General saw only the store location's zero and read "Sold out", while the 25 new variants in Printful's
profiles read in stock. Seen directly: a diagnostic page on the unpublished "OFF SHFT" theme printed Liquid's own
`product.available` and `inventory_quantity` for all 47 live products. Fix, so it can't happen again: every Printful
variant now lives in Printful's two profiles ("Printful: Hoodies (#PF-FRG2)" for hoodies, crewnecks, sweatpants,
quarter-zips and jackets; "Printful: Tshirts (#PF-FRG1)" for tees, the golf shirt and all headwear) and those profiles'
Canada and US zones carry the store's rates (Standard C$12, free from C$75, Express C$20 in Canada; Printful's other
zones were left as they were and the store only sells to Canada and the US). Checked at checkout: hat to Toronto
Standard C$12 / Express C$20; hoodie to Buffalo free. The General profile keeps the store location and the same rates
for anything not made by Printful. If Printful ever rewrites its profiles' rates, put the store's rates back in them.
Codex has since added three combined golf-shirt listings (100 variants each, unpublished) and nine published ones
(Classic, Cotton Pique, Performance for OFF SHFT Golf Club, Out of Office and Time Well Spent); their variants were
left where Printful filed them.

**Product photos are the owner's** (30 Oct 2026): they make them with their own tool (Astra), as with the studio
mockups. Don't render or upload shop photos for new listings; create listings without images and leave the photos to
the owner. The drawings in store/previews stay for the picker page.

All 17 listings are active and on the Online Store, behind the store password (published 29 Oct 2026, on the owner's
yes). Nobody can buy yet (see below). Each design on each kind of piece is one listing,
with the styles as an option, so the 34 pairings fit in 17 listings. Admin: https://admin.shopify.com/store/offshft/products

| Listings | Styles and sizes | Price set |
|---|---|---|
| Hat: logo, clock, Punched Out. | Retro Trucker, 5-Panel, Dad Hat, Rope Cap | C$34.99 |
| Hoodie: all three designs | Oversized (5161), Garment-Dyed (1567), Lightweight (1467); S to 3XL | C$89.99 |
| Crewneck: all three | 1466; S to 3XL | C$79.99 |
| Sweatpants: all three | 1469; S to 3XL | C$79.99 |
| T-shirt: logo, clock | Heavyweight (1717) S to 3XL, Pocket (6030) S to 2XL | C$44.99 |
| Jacket: all three | CO200; S to 3XL | C$99.99 |

- Ids: store/apply/out/drop1-ids.json. Each style's photo: store/apply/out/drop1-variant-images.json. Text:
  store/products/drop1.json, claims-checked and applied.
- Selling to the US (owner's yes, 29 Oct 2026): a US market, gid://shopify/Market/105333752130 (handle us), priced in
  CAD like Canada. Shipping: Standard C$12, free from C$75, 3-5 days, from Shop location, the same as Canada's Standard.
  No Express for the US: nothing faster sits behind it at Printful. Canada's C$20 Express was dropped too, on the
  owner's yes (29 Oct), so both countries have Standard only (checked at checkout for Toronto and New York).
  Checked after: the store ships to CA and US; a New York hat gets C$12, a hoodie ships free; Canada unchanged; all 17
  listings show in the US. The plan, its checks and the fallback calls: scratchpad us-market/final-r3 (workflow run).
- Before anything sells:
  - The owner picks a Shopify plan (the trial had 1 day left on 29 Oct) and opens the store (the password).
  - US prices in US dollars need Shopify Payments, and the owner's yes.
  - Checkout delivery dates count 1 business day to make an order; Printful takes 2-5. The owner changes the
    processing time in Settings → Shipping and delivery.
  - Each listing has to be linked to its Printful product and embroidery file in Printful, or orders won't reach
    Printful. That needs the colours, which come later.
  - The prices were set before Printful's embroidered prices were confirmed; check them.
- Photos refreshed 29 Oct, on the owner's yes: 19 drawings swapped in place (fileUpdate, same media ids, so every link to
  them holds): Punched Out. in its v3 art on every piece, the rope cap without the seam it doesn't have, the 5-panel's
  front eyelets, and the sweatpants and tees as redrawn. Rendered from store/previews/out/shop.
- The owner is also working on the store with Codex (29 Oct): the "studio mockup" photos (now the first photo on most
  listings) and the Colour options are theirs. Since then sweatpants and jackets come in S to 2XL (Printful's range),
  and every listing has colours. store/apply/products-drop1.cjs and drop1-variant-images.json are behind the live
  store: don't re-run them as they are.
- Pages published 29 Oct, on the owner's yes ("not too wordy, sound like a person wrote it, I like 'your time'"):
  Size & fit, FAQ, Shipping & returns. Their paste sections in store/pages/*.md are the live text. Defaults in them the
  owner can change: damaged/wrong/not what you ordered, message within 14 days of delivery for a replacement or
  refund, no need to send it back; lost: 15 business days after it ships; no returns for a change of mind or fit;
  duties and import fees not included; changes only before it's made.
- 10 more listings, added 29 Oct on the owner's "I like them add them" (ACTIVE and on the Online Store, behind the
  password, no colours yet). Ids: store/apply/out/drop1b-ids.json. Copy: store/products/drop1b.json (claims-checked).
  Spec and price arithmetic: store/products/drop1b-spec.json. Builder: store/apply/products-drop1b.cjs.
  | Listings | Styles and sizes | Price set |
  |---|---|---|
  | Beanie: logo, clock, Punched Out. | Cuffed (Yupoong 1501KC) / Ribbed (Atlantis RIO); one size | C$34.99 / 39.99 |
  | Bucket hat: all three | Organic (Capstone) / Classic (Big Accessories BX003); one size | C$44.99 / 39.99 |
  | Quarter-zip: all three | Cotton Heritage M2475 fleece only; S to 3XL | C$79.99 |
  | Golf shirt: Punched Out. | Cotton Pique (SOL'S 11362) / Classic (K500) / Performance (adidas A430); S to 3XL | C$59.99 / 59.99 / 89.99 |
  - Golf shirt: the clock is on the left sleeve of all three for now. It moves to the Cotton Pique's upper back (what
    the owner asked for) once Printful shows 'Large back' embroidery for Canada and the US and how close to the collar.
  - Quarter-zip: the Lane Seven LS14014 comes back (as "Mock Neck") once Printful confirms it embroiders it.
  - The Cotton Pique may be made only in Latvia; the Performance polo's margin is thin on a 3XL that ships free.
  - Size & fit and the FAQ now say caps adjust and beanies and bucket hats don't; no quarter-zip or polo chart yet.
  - Every open question per listing is in its toConfirm notes in store/products/drop1b.json.
- 6 phrase listings, added 30 Oct on the owner's "add them all" (ACTIVE, on the Online Store behind the password, no
  photos: the owner adds them). Ids: store/apply/out/drop1c-ids.json. Copy: store/products/drop1c.json. Art:
  designs/15-20 (built by designs/phrases/build.cjs; checks pass; cold read of the K and sew-outs still to do).
  | Listing | Styles and sizes | Price set |
  |---|---|---|
  | Nowhere To Be. Hoodie (left chest, two lines) | Oversized, Garment-Dyed; S to 3XL | C$89.99 |
  | Sun’s Still Up. Hat (front, two lines) | 5-Panel, Rope Cap | C$34.99 |
  | No Alarm Set. Crewneck (big front) | 1466; S to 3XL | C$79.99 |
  | Banked Time. Hat (front, one line, +1.94 mm on 6-panel) | Dad Hat, Retro Trucker | C$34.99 |
  | Not Picking Up. Hoodie (big front) | Oversized, Garment-Dyed; S to 3XL | C$89.99 |
  | Parked. Trucker Hat (front, +1.95 mm) | Retro Trucker | C$34.99 |
- Codex also added four listings on 29 Oct (5:00 Crewneck, Ours to Spend. Trucker Hat, The Rest Is Ours. Hoodie,
  Time Well Earned. T-Shirt), and the owner a fifth that evening: For a Reason. Hat (3D puff front; Charcoal and
  Evergreen on the Yupoong 6606, Ivory on a Comfort Colors CCST0 trucker; C$34.99). Its knock-out screen (30 Oct):
  small risk, check HERE FOR A REASON (US SN 98183164) first (store/research/trademarks-round-2.md). No Printful page
  for the CCST0 turned up: check what the Ivory style is linked to.
  - Stock (checked 30 Oct): For a Reason., Time Well Earned., The Rest Is Ours. and 5:00 track stock with nothing on
    hand and don't sell when out, so they show sold out; so does Pocket / S / White on the logo and clock tees. Told the
    owner, not changed (their listings).
  - Trademark knock-out search for the first four, 29 Oct (search results only):
    store/research/trademarks-new-phrases.md. Time Well Earned., The Rest Is Ours. and Ours to Spend. look clear;
    5:00 is a small risk (Margaritaville's "It's Five O'Clock Somewhere" and Jaya's "5 a 7" in Canada): keep it "5:00",
    no "somewhere" or beach imagery. [CONFIRM: the official searches listed in the report]
- Tab icon replaced 31 Oct 2026, on the owner's yes to the square plan: the file offshft-favicon.png in Files was
  swapped in place (fileUpdate, same file and URL) for brand/shopify/offshft-favicon-512.png, the clock drawn on the
  32 px grid. The theme's Favicon setting and the home page's 64 px clock both use that file, so both changed and nothing
  else in the theme did (writes to the live theme are blocked for this connection anyway). Before: the 25 mm hat
  symbol on fabric Bone, which Shopify shrank to a smudge.
  - Swapped again the same evening after the kit check: the first version's hour hand touched the tile's edge, and its
    thread-Bone rounded tile showed as a lighter chip on the home page's fabric-Bone band. Now the hands sit inside
    and the tile is a square of the band's colour (#E4DDCB), so on the home page only the clock shows. Cleaner later
    (owner, theme editor): give the home page's icon block its own image and set the Favicon to brand/icons/favicon-32.png.
- Square logo (1 Nov 2026): the owner asked for the stacked logo as the store's profile picture. Shopify's Admin API
  can't set Settings > Brand (no mutation for it), so brand/social/offshft-profile-light.png and
  brand/social/offshft-share.png were uploaded to Files (offshft-profile-light.png, offshft-share.png) for the owner to
  pick: Settings > Brand > Square logo, and Online Store > Preferences > Social sharing image.
- Ideas for what to add next, researched 30 Oct when the owner asked (nothing added yet): a full-zip hoodie, a
  fisherman beanie, a corduroy cap, a long-sleeve tee, the side clock on the phrase hats, a gift card, the FAQ link and
  the empty policies: store/research/next-adds.md. Three new lines: designs/phrases/round-2.md.

## Everything the owner sent

| Kind | Base | Printful page | Notes |
|---|---|---|---|
| Trucker | Retro Trucker Cap, Yupoong 6606 | https://www.printful.com/custom/hats/trucker-hats/retro-trucker-cap-yupoong-6606 | Picked 29 Oct 2026, replaces the Richardson 112 |
| 5-panel cap | 5 Panel Mid Profile Baseball Cap, Otto Cap 31-069 | https://www.printful.com/custom/hats/dad-hats/5-panel-mid-profile-baseball-cap-otto-cap-31-069 | Picked 29 Oct 2026 instead of the structured snapback. The owner's link had Royal/Natural selected; colours not decided yet |
| Hoodie | Unisex Oversized Hoodie, AS Colour 5161, embroidered | https://www.printful.com/custom/collections/embroidery/unisex-oversized-hoodie-as-colour-5161 | Picked 29 Oct 2026, "for sure" |
| Hoodie | Garment-Dyed Hooded Sweatshirt, Comfort Colors 1567 | https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1567 | Picked 29 Oct 2026, next to the AS Colour 5161 |
| Hoodie | Hooded sweatshirt, Comfort Colors 1467 | https://www.printful.com/custom/mens/hoodies/garment-dyed-hooded-sweatshirt-comfort-colors-1467 | Picked 29 Oct 2026. How it differs from the 1567, and whether it matches the 1469 sweatpants, is being checked |
| Sweatpants | Unisex Garment-Dyed Fleece Sweatpants, Comfort Colors 1469 | https://www.printful.com/custom/mens/sweatpants-joggers/unisex-garment-dyed-fleece-sweatpants-comfort-colors-1469 | Picked 29 Oct 2026. The owner's link had Ivory selected; colours not decided yet |
| Crewneck | Unisex Garment-Dyed Lightweight Fleece Crewneck Sweatshirt, Comfort Colors 1466 | https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-garment-dyed-lightweight-fleece-crewneck-sweatshirt-comfort-colors-1466 | Picked 29 Oct 2026. The owner's link had Blue Jean selected. Whether the 1466, 1467 and 1469 make a matching set is being checked |
| Tee | Unisex Garment-Dyed Heavyweight T-Shirt, Comfort Colors 1717 | https://www.printful.com/custom/collections/embroidery/unisex-garment-dyed-heavyweight-shirt-comfort-colors-1717 | Picked 29 Oct 2026 |
| Pocket tee | Unisex Garment-Dyed Pocket T-Shirt, Comfort Colors 6030 | https://www.printful.com/custom/mens/t-shirts/unisex-garment-dyed-pocket-t-shirt-comfort-colors-6030 | Picked 29 Oct 2026. Whether a chest logo would land on the pocket is being checked |

**Everything embroidered.** The owner wants every product embroidered if Printful allows it (29 Oct 2026). One exception,
the owner's call (29 Oct 2026): the back of The Rest Is Ours. hoodie stays printed, because the back can't be
embroidered; its front logo is embroidered. Some of
their links had printing selected. The picker's links now open each product with embroidery selected, and whether
Printful embroiders each Comfort Colors item, and where, is being checked (store/research/comfort-colors.md).

Still open:
- Dad hat and rope cap: on the picker, not picked.
- Other crewnecks: Bella + Canvas 4711 and Comfort Colors 1566 are on the picker, not picked.
- The other sweats and shorts: on the picker, not picked.
