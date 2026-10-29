# More pieces: beanies, bucket hats and quarter-zips

Researched 29 Oct 2026, when the owner asked what else to add. Search results only (printful.com is blocked from these sessions). The entries are on the picker page.

PICKER ENTRIES

Put these in OPTIONS in /tmp/claude-0/-home-user/baaa626f-827d-5693-ad14-ed0dd81cc068/scratchpad/bases/index.html. GROUPS (line 144) needs the three groups too: `render()` only draws cards whose group is in GROUPS. All six literals parse in node and have exactly the template's keys.

GROUPS additions (suggested order: after hats, beanies and bucket-hats; after hoodies, quarter-zips):
  { id: 'beanies', title: 'Beanies', blurb: 'Embroidered on the cuff, logo 63 mm wide.' },
  { id: 'bucket-hats', title: 'Bucket hats', blurb: 'Embroidered front logo, 63 mm wide.' },
  { id: 'quarter-zips', title: 'Quarter-zips', blurb: '' },

  {
    id: 'beanie-1501kc', group: 'beanies', name: "Cuffed beanie", model: "Cuffed Beanie · Yupoong 1501KC",
    desc: "A classic cuffed toque in 100% acrylic knit, 12 in long: plain, snug and warm, though reviewers say it's a bit scratchy until it's broken in.",
    facts: [['Price', 'US$13.05 with the cuff logo'], ['Logo', "Centred on the cuff, 63 mm wide (Printful's knit-hat area: 5 × 1.75 in)"], ['Made in', 'Being checked: US, Canada or both'], ['Colours', "12 (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/embroidered/beanies/cuffed-beanie-yupoong-1501kc?technique=EMBROIDERY',
  },
  {
    id: 'beanie-rio', group: 'beanies', name: "Ribbed beanie", model: "Ribbed Knit Beanie · Atlantis RIO",
    desc: "A snug, double-layer cuffed beanie in a fine rib knit, half recycled polyester and half acrylic (to confirm): sportier than the plain toque.",
    facts: [['Price', 'US$16.75 with the cuff logo (to confirm)'], ['Logo', "Centred on the cuff, 63 mm wide (Printful's knit-hat area: 5 × 1.75 in)"], ['Made in', "Being checked: a copy of Printful's data from March listed both (5 colours in Canada)"], ['Colours', "8, to confirm (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/embroidered/beanies/ribbed-knit-beanie-atlantis?technique=EMBROIDERY',
  },
  {
    id: 'quarter-zip-ls14014', group: 'quarter-zips', name: "Premium quarter-zip", model: "Unisex Premium Quarter Zip Sweatshirt · Lane Seven LS14014",
    desc: "A premium midweight fleece quarter-zip with a cotton face, a mock neck and a relaxed fit: soft for the couch, warm enough for an early round.",
    facts: [['Price', 'US$25.24 (C$35.95) listed (price with embroidery to confirm)'], ['Logo', 'Left chest, 63 mm wide (embroidery there to confirm)'], ['Made in', 'Being checked: US, Canada or both'], ['Colours', "5, to confirm (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-premium-quarter-zip-sweatshirt-lane-seven-ls14014?technique=EMBROIDERY',
  },
  {
    id: 'quarter-zip-m2475', group: 'quarter-zips', name: "Fleece quarter-zip", model: "Unisex Fleece Pullover · Cotton Heritage M2475",
    desc: "A basic cotton-blend fleece quarter-zip with a stand collar and a relaxed fit: soft, but lighter and plainer than the Lane Seven.",
    facts: [['Price', 'US$22.85 (C$32.50) listed (price with embroidery to confirm)'], ['Logo', "Left chest, 63 mm wide (Printful's left-chest area: 4 × 4 in)"], ['Made in', 'Being checked: US, Canada or both'], ['Colours', "2 or 3: Black, Carbon Grey, maybe Navy (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/mens/sweatshirts/unisex-fleece-pullover-cotton-heritage-m2475?technique=EMBROIDERY',
  },
  {
    id: 'bucket-hat-organic', group: 'bucket-hats', name: "Organic bucket hat", model: "Organic Bucket Hat · Capstone",
    desc: "An organic cotton twill bucket hat with a classic brim and a high crown, in earth tones: the relaxed dock-and-cottage hat.",
    facts: [['Price', 'US$20.70 with the front logo (C$29.50 listed)'], ['Logo', 'Front of the crown, centred, 63 mm wide (area size and any centre seam to confirm)'], ['Made in', 'Being checked: US, Canada or both'], ['Colours', "Earth tones, how many to confirm (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/embroidered/bucket-hats/organic-bucket-hat?technique=EMBROIDERY',
  },
  {
    id: 'bucket-hat-bx003', group: 'bucket-hats', name: "Classic bucket hat", model: "Bucket Hat · Big Accessories BX003",
    desc: "A plain, light cotton-twill bucket hat with sewn eyelets: soft, unstructured and the cheapest option.",
    facts: [['Price', 'US$15.86 listed (price with the front logo to confirm)'], ['Logo', 'Front of the crown, centred, 63 mm wide (area 5.5 × 2 in, to confirm)'], ['Made in', 'Being checked: US, Canada or both'], ['Colours', "3: Black, Navy, White (chosen later)"]],
    colours: [],
    colourNote: "",
    link: 'https://www.printful.com/custom/embroidered/bucket-hats/bucket-hat-big-accessories-bx003?technique=EMBROIDERY',
  },

- I couldn't test whether Printful's pages read `?technique=EMBROIDERY`, because printful.com is blocked here. The page already uses it on every link, and a page that doesn't support it just ignores it.
- `colourNote` is left empty, as the template has it. If a note is wanted there: the RIO's rib blurs fine detail; the LS14014 may turn out print-only; the BX003 comes only in black, navy and white.

DRAWINGS, ANCHORS AND DESIGNS (the sizes are measured from the SVGs; the arithmetic was rechecked)

beanie-1501kc and beanie-rio
- Drawing: beanie (/home/user/offshft/store/previews/items/beanie.cjs).
- Anchor: front, the middle of the 75 mm cuff. Centred, no seam shift (no centre-front seam is expected on a knit cuff [UNVERIFIED]).
- Logo: logo-light.svg at 62.64 × 18.04 mm. In Printful's 127 × 44.45 mm knit-hat area that leaves 32.2 mm each side and 13.2 mm above and below.
- Clock: the 25 mm (symbol-light-25mm.svg, 11.80 × 25.00 mm), with 9.7 mm above and below. Not the 40 mm: it leaves only 2.2 mm above and below on a stretchy cuff. So the beanies must not use the caps' HAT_ART mapping (clock to clock-40).
- Punched Out.: the centred stack (stacked-centred-light.svg, 63.59 × 18.00 mm), with 31.7 mm each side and 13.2 mm above and below.
  - The one line (97.47 × 7.30 mm) also fits, with 14.8 mm each side. But it's long for a stretchy cuff, and on the RIO the vertical ribs cross its horizontal strokes.
- build.cjs PRODUCTS: { id: 'beanie-1501kc', item: 'beanie', mark: 'lockup', at: 'front', art: STACK_ART }, and the same with id 'beanie-rio'.
- The drawing shows a fine rib, which matches the RIO. The 1501KC's knit (rib or plain) wasn't found.

quarter-zip-ls14014 and quarter-zip-m2475
- Drawing: quarter-zip (/home/user/offshft/store/previews/items/quarter-zip.cjs).
- Anchor: chest, the wearer's left chest, clear of the zip. There is no big centre-front spot, because the zip is there.
- Logo: 62.64 × 18.04 mm, with 19.5 mm each side in the 101.6 mm square.
- Clock: 25 mm (11.80 × 25.00), as on the other tops. The 40 mm (19.05 × 40.00) also fits the square.
- Punched Out.: the centred stack (63.59 × 18.00 mm), with 19.0 mm each side, as on the anorak. Not the one line: it leaves 2.1 mm each side.
- build.cjs PRODUCTS: { id: 'quarter-zip-ls14014', item: 'quarter-zip', mark: 'lockup', at: 'chest', art: STACK_ART }, and the same with id 'quarter-zip-m2475'.
- M2475 only, not drawn (the drawing is front only): Printify's cached copy of Printful's listing shows two more spots [UNVERIFIED].
  - A 10 × 6 in large back: one-line-large (229.75 × 17.20 mm) fits there with 12.1 mm each side.
  - 2 × 3 in wrists: the 25 mm clock fits.

bucket-hat-organic and bucket-hat-bx003
- Drawing: bucket-hat (/home/user/offshft/store/previews/items/bucket-hat.cjs). It was drawn from the BX003; the Organic's "high profile" crown and brim measurements weren't found.
- Anchor: front, the middle of the crown front. Centred, since the drawing has no centre seam.
- Logo: 62.64 × 18.04 mm.
  - In Printful's general bucket-hat area (about 5 × 1.75 in): 32.2 mm each side, 13.2 mm above and below.
  - In the BX003's 5.5 × 2 in (139.7 × 50.8 mm, from Printify's copy): 38.5 mm each side.
- Clock: 25 mm, with 9.7 mm (1.75 in tall area) to 12.9 mm (2 in) above and below. Not the 40 mm: 2.2 to 5.4 mm is too tight on a soft crown, so no HAT_ART here either.
- Punched Out.: the one line (97.47 × 7.30 mm), as on the caps. It leaves 14.8 mm each side at 5 in and 21.1 mm at 5.5 in.
  - If the File guidelines tab shows a narrower area, switch to the stack (63.59 × 18.00). It fits every size seen, including the 3 in the BX003's blank distributor suggests (6.3 mm each side).
- If Printful's photos show a centre-front seam on the Organic hat (one search read says "2-panel build"), use the seam rules:
  - logo 5.2 mm right
  - one line 2.4 mm right
  - stack centred
  - 25 mm clock 7.4 mm onto the wearer's left panel (half its 11.80 mm width plus 1.5 mm, the rule build.cjs uses for the 40 mm clock)
- build.cjs PRODUCTS: { id: 'bucket-hat-organic', item: 'bucket-hat', mark: 'lockup', at: 'front' }, and the same with id 'bucket-hat-bx003'.

Two texts on the page say where each Punched Out. version goes, and both will be out of date once these are added. They should also say "stacked on the beanies and quarter-zips, one line on the bucket hats":
- the Designs-tab line in index.html ("one line on hats and on the big fronts, two lines on the anorak and the sweatpants")
- the 'punched-out' idea text in /home/user/offshft/store/previews/export.cjs

IN SHORT
All six are on Printful in 2026 and offered to buyers in Canada and the US, and all but the Lane Seven quarter-zip are confirmed for embroidery; where Printful makes each one is still being checked. In beanies, the Yupoong 1501KC is the safe pick: the cheapest at US$13.05 with the logo, a Printful bestseller and the best documented. The Atlantis ribbed beanie costs about 28% more, but its colours are the nearest to Slate, Moss and Bone, and a March copy of Printful's data showed it stocked in Canada. In quarter-zips, the Lane Seven is the nicer garment and its Sandshell and Navy nearly match Bone and Slate; if Printful won't embroider it, the plainer Cotton Heritage M2475, whose chest embroidery is confirmed, is the one to take. In bucket hats, the organic cotton hat has the earth tones that suit the palette but costs C$29.50 from Printful, close to the C$34.99 the caps sell for, while the Big Accessories BX003 is about US$5 cheaper but comes only in black, navy and white.

UNCONFIRMED, AND HOW THE OWNER CAN CHECK IT ON PRINTFUL (open each card's "See photos on Printful" link with Embroidery selected)
- **Where each piece is made (all six).** This decides duty and delivery times (store/research/fulfilment.md). Check the product page's Availability tab, with the region set to Canada, then United States.
  - RIO: the March copy listed both countries, but Beige wasn't stocked in Canada then.
  - BX003: there are hints it's made in the US, and none that it's made in Canada.
- **Colours [UNVERIFIED].** Check the colour picker with Embroidery selected.
  - 1501KC: 12, from copies of Printful's catalogue data, the newest dated 17 Oct 2026.
  - RIO: 8, from copies dated March and May 2026.
  - LS14014: 5 is a catalogue mirror's count; only Sandshell, Heather Grey and Black have been seen at Printful.
  - M2475: Navy is unconfirmed.
  - Organic: no list at all. Shops show Stone, Dill, Slate Blue, Black and White.
  - BX003: Black, Navy and White, from three copies.
- **Price with embroidery, in US$ and C$.** Check the product page with Embroidery selected, then Printful's Canadian site for the C$ price.
  - Confirmed on Printful's pages: the 1501KC at US$13.05 and the Organic at US$20.70, each with one embroidery placement included.
  - To confirm:
    - RIO US$16.75 (from the March copy)
    - LS14014 US$25.24 and M2475 US$22.85 (the technique behind these prices isn't shown)
    - BX003 US$15.86 (whether the placement is included)
    - the C$ price for the 1501KC, RIO and BX003
  - Shipping and digitizing are extra. The US$6.50 one-time fee per design is from Printful's embroidered-sweatshirts page; the fee for hats wasn't confirmed.
- **Embroidery on the LS14014.** Open it in Printful's design maker, choose Embroidery and check the left chest is offered. If it's DTFlex only, drop it and keep the M2475.
- **Embroidery area sizes.** Check the File guidelines tab.
  - Beanies: 5 × 1.75 in, from Printful's knit-hat guide and copies of both templates.
  - BX003: 5.5 × 2 in, from Printify's copy.
  - Organic: not found.
  - Quarter-zip left chest: 4 × 4 in, Printful's general limit (and a copy for the M2475).
- **Other details to check on the product pages:**
  - Organic: whether it has a centre-front seam, whether it's structured, and its crown and brim sizes (photos and size guide).
  - RIO: its material and double layer (product details).
  - Both quarter-zips: sizes S–3XL, from copies (size guide).
- **The logo's fine parts.** Its clock-hand tips end in 0.58–0.59 mm flats and its channel is 1.0 mm, all under Printful's 1.27 mm (0.05 in) line minimum (/home/user/offshft/store/research/caps-and-hoodie.md). Ask Printful support whether they'll stitch them, and approve a sew-out on each new blank before selling. Samples cost money, so that's the owner's call.

CORRECTIONS TO THE SKEPTIC
- **One line on beanies.** The one line is 97.47 mm (3.84 in), which is inside Printful's "typically 3.5-4 inches wide" for beanies, not past it. The stack is still the better beanie choice, for the reasons above.
- **Rust on the 1501KC.** By Printful's colour codes, Red is the nearest Rust (CIEDE2000 11.2). But it's a much stronger, redder colour (chroma 75 against 43), so in practice there is still no Rust beanie.
- **"Smoothest knit" on the 1501KC** isn't established: its knit pattern wasn't found.

SOURCES (key ones; the rest are in the skeptic's list)
- https://www.printful.com/custom/embroidered/beanies/cuffed-beanie-yupoong-1501kc
- https://www.printful.com/ca/blog/custom-embroidered-hats-guide-to-creating-a-design-and-embroidery-file ("Knit hats typically have a 5″ × 1.75″ design area")
- https://github.com/mblyman89/GREENWAY-WEBSITE/blob/17eb01462652f27dce445ed1488dc8aec3bcf33f/src/lib/merch-studio/garment-colors-data.ts (1501KC colours and US$13.05, 17 Oct 2026)
- https://www.printful.com/custom/embroidered/beanies/ribbed-knit-beanie-atlantis
- https://github.com/lroy-stack/ai-pod-store/blob/bd56e0b5cb8158502421de273f8f0453b559f9d1/project/frontend/docs/printful-research/embroidered-hats-2.md (RIO price, colours and regions, March 2026)
- https://www.printful.com/custom/mens/hoodies-sweatshirts/unisex-premium-quarter-zip-sweatshirt-lane-seven-ls14014
- https://www.printful.com/ca/custom/mens/hoodies-sweatshirts/unisex-premium-quarter-zip-sweatshirt-lane-seven-ls14014
- https://www.printful.com/custom/mens/sweatshirts/unisex-fleece-pullover-cotton-heritage-m2475
- https://github.com/RandomlyFuzzy/Printify_product_generator/blob/c540fc19b69553336efb83a4f4e121d714e2cf8e/src/data/Cached/blueprint_details/1754.json (M2475 placements)
- https://github.com/eliglancy-ui/rentcoat.co/blob/98a498f979e2dcba05a6d49a5396bc5dc04b5ad6/scripts/printful/catalog.mjs (M2475 left-chest embroidery set up through Printful's API, 28 Oct 2026)
- https://www.printful.com/custom/embroidered/bucket-hats/organic-bucket-hat
- https://www.printful.com/blog/hat-logo-size-and-placement-guide
- https://www.printful.com/custom/embroidered/bucket-hats/bucket-hat-big-accessories-bx003
- https://github.com/RandomlyFuzzy/Printify_product_generator/blob/c540fc19b69553336efb83a4f4e121d714e2cf8e/src/data/Cached/blueprint_details/1910.json (BX003 5.5 × 2 in front and 3 colours)
- https://help.printful.com/hc/en-us/articles/28727397325340-How-should-I-prepare-my-design-for-embroidery (minimums: 0.25 in text, 0.05 in lines)
