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
- Codex also added four listings on 29 Oct (5:00 Crewneck, Ours to Spend. Trucker Hat, The Rest Is Ours. Hoodie,
  Time Well Earned. T-Shirt). Trademark knock-out search, 29 Oct (search results only):
  store/research/trademarks-new-phrases.md. Time Well Earned., The Rest Is Ours. and Ours to Spend. look clear;
  5:00 is a small risk (Margaritaville's "It's Five O'Clock Somewhere" and Jaya's "5 a 7" in Canada): keep it "5:00",
  no "somewhere" or beach imagery. [CONFIRM: the official searches listed in the report]

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
