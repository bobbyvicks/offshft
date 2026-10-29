# Hats plus lounge wear: what changes

The owner's ask, 29 October 2026: "more than just hats, im thinking oversized hoodies and sweats too, kinda like lounge active wear". Earned free time stays the idea.

This file lists every change to the store copy and structure, with the new words. Nothing here is applied. The owner approves each store change (AGENTS.md).

## Read first

- **Garment facts wait for the garment research.** Blanks, fabric, weight, sizes, fit, care, shrinkage, print or embroidery, and production and shipping times are all [CONFIRM].
- **Since this was written.** store/apparel-plan.md fills in those facts for a Bella + Canvas set, and store/research/comfort-colors.md has the first facts on the Comfort Colors bases the owner picked (store/picks.md). The owner wants everything embroidered where Printful allows it, so read "embroidered or printed" below as embroidered unless a blank can't take it. The picks also include two tees. No product type, collection rule or line here covers tees yet (owner decision 3).
- **Name only what's on sale.** A line that says hoodies, crewnecks or sweats goes live with the first of them, not before. If crewnecks or sweats aren't in the launch, cut them from every line here. The "When" column in part 2 says which lines can change now.
- **Check the name in clothing first** (owner decision 1). FIGS, Inc. has a US filing for OFF-SHIFT. LAUNCH_PLAN.md records the go-ahead on it as a scrubs filing. Search results, not yet confirmed, say it covers clothing too, loungewear included, and show FIGS selling "Off-Shift" hoodies. The go-ahead was given for hats. Hoodies and sweats may sit much closer to what FIGS sells under that name.
- **The About page is live.** Changing it, the draft theme, the menus or the collections is a store change, so the owner approves it.

How this was checked:

- Repo files as of today. Line numbers in store/theme-files/build.cjs are today's.
- Shopify's rules come from search results that quote help.shopify.com and shopify.dev. The earlier research found Shopify's sites blocked from these sessions, and they weren't opened here.
- The trademark facts come from search results only. trademarks.justia.com and trea.com aren't in this session's allowed network, so they couldn't be opened. Allow them in the session's network settings for a re-check from here.
- Horizon facts were read from a local copy of Horizon 4.3.0's code (https://github.com/Shopify/horizon), the version the draft theme runs.

## 1. Tagline

| Option | Lines on a phone | Note |
|---|---|---|
| **For the hours you earned.** | 2 | Today's line without "Hats". |
| Hats and sweats for the hours you earned. | 4 | Says what's sold, in the owner's own words. The longest. |
| Wear it on your own time. | 3 (2 on phones 390 px and wider) | New. Turns the boss's "do that on your own time" around. Loses "earned". |

**Pick: For the hours you earned.**

- It's the line the brand already uses, minus the one word that stopped being true.
- It fits whatever comes later: toques, tees, anything.
- It's short in a very wide font: 2 lines on a phone, one fewer than today. Option 2 runs to 4.
- It doesn't say what's sold, so the line under it does: "Hats, hoodies and sweats for your time off."

How it was measured: Unbounded Bold, all caps, 28 px with 0.12 em spacing, the phone heading size in store/theme.md (section 3). Lines wrap at 343 px, a 375 px phone minus Horizon's 16 px page margin on each side (Horizon 4.3.0, `assets/base.css`, https://github.com/Shopify/horizon). Widths come from the repo's tools/fonts/Unbounded-Bold.ttf, read with opentype.js. Today's line comes out at 3 lines, the same as theme.md says.

It goes in the home page heading, the About page's SEO title and README.md's first line. The password page gets a longer version (part 2).

[CONFIRM: search the chosen line in CIPO and USPTO for clothing and hats before it goes on the store, as DESIGNS.md asks for design phrases (AGENTS.md)]

## 2. Lines that only fit hats

"When": **Any time** means the new line is true with hats alone. **With garments** means it goes live with the first hoodie, crewneck or sweats, not before.

### Draft theme (store/theme-files/build.cjs)

store/theme.md repeats these strings in sections 5, 6, 7 and 9. Change both, so the plan and the build agree.

| File (place) | Current text | New text | When |
|---|---|---|---|
| build.cjs:184, top band heading (`text_hero_title`) | Hats for the hours you earned. | For the hours you earned. | Any time |
| build.cjs:185, top band line (`text_hero_line`) | You put in the hours. This time is yours. | Hats, hoodies and sweats for your time off. | With garments. Until then, keep today's line. |
| build.cjs:186, top band button (`button_hero`) | Shop hats → /collections/all-hats | Shop all → /collections/everything | Once the Everything collection exists (part 3) |
| build.cjs:200–202, the idea band | Everybody has a shift. / The good part is what happens after it. / About OFF SHFT | No change. It fits both. | — |
| build.cjs:109, announcement bar | Made to order. Ships to Canada and the US. | No change. [CONFIRM: hoodies, crewnecks and sweats ship to the same two countries] Optional for the first weeks of lounge wear: "New: hoodies and sweats." → /collections/lounge | — |
| build.cjs:137, footer sign-up heading | New hats, now and then. | New designs, now and then. | Any time |
| build.cjs:139, footer sign-up line | We'll email you when there's a new hat. That's about it. Unsubscribe any time. | We'll email you when there's something new. That's about it. Unsubscribe any time. | Any time |
| build.cjs:156, footer brand line | OFF SHFT makes hats for your time off. Every hat is made to order and shipped to you. | OFF SHFT makes hats, hoodies and sweats for people who put in the hours. Everything is made to order and shipped to you. | With garments |
| build.cjs:234, product page, Shipping row | Made to order, then shipped to you. You'll see the shipping cost at checkout before you pay. Times and costs: Shipping & returns. | No change. | — |
| build.cjs:235, product page, Returns row | Each hat is made for your order. How returns and replacements work: Shipping & returns. | Everything is made for your order. How returns and replacements work: Shipping & returns. | Any time |
| build.cjs:236, product page, Size & fit row | Measure around your head where a hat sits, then check the range for your style on the Size & fit page. | How to measure, and the sizes for every style: Size & fit. (Keep the link on "Size & fit".) | With garments |
| build.cjs:243, recommendations heading | More hats | More for your time off | Any time |
| build.cjs:261, password page | Hats for the hours you earned. Leave your email and we'll let you know when we open. Unsubscribe any time. | Hats, hoodies and sweats for the hours you earned. Leave your email and we'll let you know when we open. Unsubscribe any time. | Once garments are part of the launch |
| build.cjs:60, empty cart button link | /collections/all-hats | /collections/everything | Once Everything exists |
| build.cjs:75, search empty state (not set yet) | All hats, once it exists | Everything (`empty_state_collection: 'everything'`) | Once Everything exists |
| theme.md section 9, 404 page and cart page (not in build.cjs yet) | "Continue shopping" → /collections/all-hats. "Discover something new" and "You may also like": All hats | /collections/everything, and Everything in both sections | Once Everything exists |

The product page rows show on every product, hats and garments alike, because the store has one product template. That's why they're written to fit both.

### Pages (store/pages/)

| File (place) | Current text | New text | When |
|---|---|---|---|
| about.md, SEO title | About OFF SHFT \| Hats for the Hours You Earned | About OFF SHFT \| For the Hours You Earned (41 characters) | Any time |
| about.md, meta description | Everybody has a shift. The good part is what happens after it. OFF SHFT makes the hat you wear when you get there. | Everybody has a shift. The good part is what happens after it. OFF SHFT makes the hats, hoodies and sweats you wear when you get there. (135 characters) | With garments |
| about.md, body | A line in the water. The back nine on a Tuesday. Cornhole boards in the driveway. The cottage, finally. | A line in the water. The back nine on a Tuesday. Cornhole boards in the driveway. The cottage, finally. Or the couch, with nowhere to be. | With garments |
| about.md, body | OFF SHFT makes the hat you wear when you get there. | OFF SHFT makes the hats, hoodies and sweats you wear when you get there. | With garments |
| about.md, body | Days off don't always fall on a weekend. Plenty of people get a Tuesday and a Wednesday. These hats don't mind which. | Days off don't always fall on a weekend. Plenty of people get a Tuesday and a Wednesday. Nothing we make minds which. | Any time |
| about.md, body | We keep the designs small and quiet, with plenty of empty fabric. Every hat is made to order and shipped to you. | We keep the designs small and quiet, with plenty of empty fabric. Everything is made to order and shipped to you. | Any time |
| home.md, SEO title | OFF SHFT \| Hats for the Hours You Earned | OFF SHFT \| Hats, Hoodies and Sweats for Your Time Off (53 characters) | With garments |
| home.md, meta description | Embroidered hats for people who put in the hours. For fishing, golf, cornhole and the cottage. Made to order and shipped to you. | Hats, hoodies and sweats for people who put in the hours. For fishing, golf, the cottage and the couch. Made to order and shipped to you. (137 characters) | With garments |
| home.md, sections 3, 7 and 8 | The top band, sign-up and footer lines | The same new lines as the theme table above | As above |
| home.md, section 6, label over the featured hat | Quitting time, on a hat. | No change while it shows the logo hat. If it ever shows a hoodie: Quitting time, on a hoodie. | — |
| home.md, Menus | Hats, with a dropdown of all six hat collections | The menus in part 3 | Part 3 |
| contact.md, meta description | Questions about an order, a hat or a gift? Email OFF SHFT or send a message with the form. | Questions about an order, a size or a gift? Email OFF SHFT or send a message with the form. (91 characters) | Any time |
| contact.md, body | Questions about an order, a hat or a gift? Send us a note. | Questions about an order, a size or a gift? Send us a note. | Any time |
| faq.md, meta description | Answers on fit, sizing, care, shipping, tracking, returns and gifts for OFF SHFT hats. Every hat is made to order. | Answers on fit, sizing, care, shipping, returns and gifts for OFF SHFT hats, hoodies and sweats. Everything is made to order. (125 characters) | With garments |
| faq.md, What size do I need? | [CONFIRM: every style we sell is one size with an adjustable back] Measure around your head where a hat sits, then check the range on the Size & fit page. | The new answer in part 4 | With garments |
| faq.md, What are the hats made of? | The question and its answer | "What are they made of?", part 4 | With garments |
| faq.md, How do I clean my hat? | The question and its answer | "How do I wash it?", part 4 | With garments |
| faq.md, made to order, question | Are the hats made to order? | Is everything made to order? | Any time |
| faq.md, made to order, answer | Yes. There's no warehouse full of OFF SHFT hats waiting around. Yours is made after you order it, then shipped straight to you. Making it usually takes 2–5 business days. [CONFIRM: Printful's time; Printify's is 2–7] | Yes. There's no warehouse full of OFF SHFT hats and hoodies waiting around. Yours is made after you order it, then shipped straight to you. Hats usually take 2–5 business days to make. [CONFIRM: Printful's time; Printify's is 2–7] Hoodies, crewnecks and sweats take [CONFIRM: production time for each garment]. | With garments |
| faq.md, shipping answer | Once your hat is made, delivery usually takes: | Once your order is made, delivery usually takes: [CONFIRM: the same times hold for hoodies, crewnecks and sweats, or give theirs] | Any time (the CONFIRM with garments) |
| faq.md, shipping answer | All in, that's about 1 to 2 weeks. | [CONFIRM: still true with the garment times; redo it if not] | With garments |
| faq.md, shipping answer, new line | — | Ordering a hat and a hoodie? They may come in separate boxes. [CONFIRM: whether the partner splits an order whose items are made in different shops] | With garments |
| faq.md, tracking answer | Yes. When your hat ships, you'll get an email with the tracking link. | Yes. When your order ships, you'll get an email with the tracking link. | Any time |
| faq.md, duties, Canada | [CONFIRM: the Canada duties line from store/pages/shipping-returns.md, once you know where Printful makes your hats] | [CONFIRM: the Canada duties line from store/pages/shipping-returns.md, once you know where Printful makes your hats, hoodies, crewnecks and sweats] | With garments |
| faq.md, duties, US | [CONFIRM: each of your hats is made at Printful's US shops, …] | [CONFIRM: each hat and garment is made at Printful's US shops, …] (rest unchanged) | With garments |
| faq.md, returns question | Can I return or exchange a hat? | Can I return or exchange something? | Any time |
| faq.md, returns answer | Each hat is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. | Everything is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. [CONFIRM: the owner keeps this for clothing (owner decision 5)] | Any time (the CONFIRM with garments) |
| faq.md, damaged or wrong answer | If your hat arrives stitched wrong, damaged or not what you ordered, | If your order arrives printed or stitched wrong, damaged, in a different size from the one you ordered, or not what you ordered, | With garments |
| faq.md, gift question | Can I send a hat as a gift? | Can I send a gift? | Any time |
| faq.md, gift answer, new line | — | Buying a hoodie or sweats? Check their size first, because we can't swap sizes. [CONFIRM: owner decision 5] | With garments |
| shipping-returns.md, meta description | How long OFF SHFT hats take to make and ship to Canada and the US, what shipping costs, and what we do if something's wrong. | How long OFF SHFT orders take to make and ship to Canada and the US, what shipping costs, and what we do if something's wrong. (126 characters) | Any time |
| shipping-returns.md, intro | Every hat is made to order, then shipped to you. Here's how long that takes and what we do if something goes wrong. | Everything is made to order, then shipped to you. Here's how long that takes and what we do if something goes wrong. | Any time |
| shipping-returns.md, Made to order | Your hat is made after you order it. That usually takes 2–5 business days. [CONFIRM: Printful's time; Printify's is 2–7] | Your order is made after you place it. Hats usually take 2–5 business days. [CONFIRM: Printful's time; Printify's is 2–7] Hoodies, crewnecks and sweats take [CONFIRM: production time for each garment]. | With garments |
| shipping-returns.md, Shipping | Once your hat is made, delivery usually takes: | Once your order is made, delivery usually takes: [CONFIRM: garment delivery times] | Any time (the CONFIRM with garments) |
| shipping-returns.md, Shipping, new line | — | If you order a hat and a hoodie, they may come in separate boxes. [CONFIRM: whether the partner splits it] | With garments |
| shipping-returns.md, Returns | Each hat is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. Not sure about fit? Check Size & fit or email us before you order. | Everything is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. That includes ordering the wrong size. Not sure about fit? Check Size & fit or email us before you order. [CONFIRM: owner decision 5] | With garments |
| shipping-returns.md, If something's wrong | If your hat arrives stitched wrong, damaged or not what you ordered, | If your order arrives printed or stitched wrong, damaged, in a different size from the one you ordered, or not what you ordered, | With garments |
| shipping-returns.md, Duties, Canada | [CONFIRM: the Canada line from "Where Canadian orders ship from" below] | No change in words. Check each garment's Availability tab as well as each hat's. | With garments |
| size-fit.md, SEO title | Hat Size and Fit Guide \| OFF SHFT | Size and Fit: Hats, Hoodies and Sweats \| OFF SHFT (49 characters) | With garments |
| size-fit.md, meta description | How to measure your head and find the right fit in each OFF SHFT hat style. | How to measure for a hat, a hoodie or sweats, and how each OFF SHFT style fits. (79 characters) | With garments |
| size-fit.md, intro | [CONFIRM: every style we sell is one size …] So picking a hat is mostly about the style you like, plus a minute with a tape measure. | The new intro in part 4 | With garments |
| size-fit.md, headings | Sizes and closures / How each style sits / Adjusting the fit | Hat sizes and closures / How each hat sits / Adjusting a hat | With garments |
| size-fit.md, Still not sure? | Email your measurement to [CONFIRM: support email] and we'll tell you which style should fit best. | Email your measurements to [CONFIRM: support email] and we'll tell you which size or style should fit best. | With garments |

Notes:

- "In a different size from the one you ordered" is the partner's mistake. "Ordering the wrong size" is the customer's. The first is covered like a wrong item. The existing [CONFIRM: Printful covers a wrong item] in shipping-returns.md covers it too.
- The home meta drops "Embroidered", because the garments may be printed [CONFIRM: decoration method].
- On duties: a courier parcel from the US is tax-free in Canada only up to C$40 (https://www.cbsa-asfc.gc.ca/services/cusma-aceum/overview-survol-eng.html, https://www.cbsa-asfc.gc.ca/publications/dm-md/d8/d8-2-16-eng.html, as cited in store/research/pod-partner.md). One hoodie may cost more than that [CONFIRM: price]. So where the garments are made matters more than it did for one hat.

### Collections (store/collections.md)

| File (place) | Current text | New text | When |
|---|---|---|---|
| Fishing, description | Off the clock, on the water. Hats for early starts and last casts. | Off the clock, on the water. For early starts and last casts. | Any time |
| Golf, description | Shift's over. Tee's up. Hats for nine holes after work, or eighteen on your day off. | Shift's over. Tee's up. For nine holes after work, or eighteen on your day off. | Any time |
| Cottage, description | Cottage, cabin or camp. Whatever you call it, you earned it. Hats for the dock, the deck and the drive up. | Cottage, cabin or camp. Whatever you call it, you earned it. For the dock, the deck and the drive up. | Any time |
| Cornhole, description | Boards out, bags flying. Hats for backyard games and league nights. | Boards out, bags flying. For backyard games and league nights. | Any time |
| The four hobby SEO titles and meta descriptions | `<Hobby> Hats \| OFF SHFT` / `… <Hobby> hats from OFF SHFT, embroidered and made to order.` | No change while only hats carry the tag. When a garment joins one, name it. Example: Fishing Hats and Hoodies \| OFF SHFT (35 characters), and "… Fishing hats and hoodies from OFF SHFT, made to order." Drop "embroidered" once a printed piece joins. | When a garment joins |
| SEO and meta patterns at the top | `<Collection title> Hats \| OFF SHFT`, and `… hats from OFF SHFT, embroidered and made to order.` | For hat collections only. The garment collections have their own lines (part 3). | — |
| All hats and Text hats | Every line | No change. Both stay hats only. | — |

### Products (store/products/)

| File (place) | Current text | New text | When |
|---|---|---|---|
| off-shft-logo-hat.md and punched-out.md | Every customer-facing line | No change. They're hats. | — |
| _template.md | The hat patterns | The garment patterns below, in this file or in a garment template beside it | With garments |

Garment listing patterns:

| Field | Hat (today) | Hoodie, crewneck or sweats |
|---|---|---|
| Title | `<Design name> Hat` | `<Design name> Hoodie`, `Crewneck` or `Sweatpants`. Example: OFF SHFT Logo Hoodie |
| URL handle | off-shft-logo-hat | off-shft-logo-hoodie |
| SEO title | `<Design name> Embroidered Hat \| OFF SHFT` | `<Design name> Oversized Hoodie \| OFF SHFT` (or Crewneck, or Sweatpants). Drop " \| OFF SHFT" when the name already has it: OFF SHFT Logo Oversized Hoodie (30 characters). [CONFIRM: the blank is cut oversized] |
| Meta description | `<Hook line>. <Design name>, embroidered on a hat made to order. <When it gets worn>.` | `<Hook line>. <Design name>, <embroidered or printed> on an oversized hoodie made to order. <When it gets worn>.` |
| Category | Apparel & Accessories > Clothing Accessories > Hats > Baseball Caps | [CONFIRM: pick it in Shopify's category search ("hoodies", "sweatshirts", "sweatpants"); search results didn't confirm the names] |
| Category attributes | Age group, Target gender: Unisex, Color, Fabric, Crown profile, Cap fit type | Age group: Adults. Target gender: [CONFIRM: unisex, from the blank]. Color and Size: per variant. The rest: [CONFIRM: what the category asks for, from the spec sheet] |
| Product type | Hat | Hoodie, Crewneck or Sweatpants (part 3) |
| Tags | fishing, golf, cottage, cornhole, text-hat, logo, drop-1 | The same, without text-hat |
| Options | Style, then Colour | Colour, then Size |
| Details: front | `Front: <what's stitched>, embroidered, about <width> mm (<inches> in) wide` | `Chest: <what's on it>, <embroidered or printed>, about <width> mm (<inches> in) wide`. Then the second mark, if there is one: sleeve, back of the neck or leg. [CONFIRM: method and size, from the sample] |
| Details: size | Size: [CONFIRM: one size with an adjustable back; head-size range for each style] | Sizes: [CONFIRM: size range]. Fit: oversized. [CONFIRM: what that means for this blank] |
| Details: material and care | [CONFIRM] for each | Material: [CONFIRM: fabric, blend and weight]. Care: [CONFIRM: the care label] |
| Details: ships | made to order, usually ships in 2–5 business days [CONFIRM] | made to order, usually ships in [CONFIRM: production time for this garment] |
| Last line | Fit questions? See Size & fit. | Which size? See [Size & fit](/pages/size-fit). |
| Alt text | `<Colour> <style> with <what's stitched> embroidered on the front, <view>` | `<Colour> oversized hoodie with <what's on it> <embroidered or printed> on the left chest, <view>` |
| Never write | The template's list | The same list, plus: heavyweight, organic, pre-shrunk, true to size, or any other fabric or fit claim the spec sheet doesn't make |

### Internal lines that also say hats

Not customer-facing. Update them in the same pass so the next agent isn't misled:

- store/collections.md: "All six are automated: a hat joins by its tags or product type", the note on "embroidered", and Empty collections (it now covers the new collections too).
- store/products/_template.md: "Every hat listing follows this."
- The Notes under each page in store/pages/.
- store/theme.md: the same strings as build.cjs (sections 5, 6, 7 and 9).
- README.md (part 5, plus line 14: "The first 15 hat designs"), DESIGNS.md ("the first 6–8 hats"), and LAUNCH_PLAN.md's calendar hooks ("the biggest hat-gifting moment", "gifts and toques").

## 3. Navigation and collections

### Main menu (Content → Menus → main-menu)

At launch, once the first garment is on sale: **Hats · Lounge · About · FAQ**, with no dropdowns. A dropdown appears only when there's something under it, as store/collections.md already says.

| Item | Links to | Add it when |
|---|---|---|
| Hats | /collections/all-hats | Now |
| — All hats | /collections/all-hats | With the first item below it |
| — Text hats | /collections/text-hats | It has a published hat |
| Lounge | /collections/lounge | The first hoodie, crewneck or sweats is published |
| — All lounge | /collections/lounge | With the first item below it |
| — Hoodies and crews | /collections/hoodies-and-crews | Both it and Sweats have a product |
| — Sweats | /collections/sweats | Both it and Hoodies and crews have a product |
| Time off | /collections/time-off | The first hobby collection has a product |
| — Fishing, Golf, Cottage, Cornhole | /collections/fishing, and so on | Each one has a product |
| About | /pages/about | Now |
| FAQ | /pages/faq | Now |

- "All …" comes first in each dropdown for the same reason as today. On phones, tapping the parent opens the list, not the page (store/theme.md section 5).
- The hobby collections leave the Hats dropdown. They'll take garments too (below), and a fishing hoodie shouldn't sit under "Hats".
- **Keep it to two levels.** Horizon 4.3.0 shows the phone menu as an accordion only when a menu has fewer than three levels. A third level, like Shop → Hats → Fishing, switches it to sliding panels with a back button (`snippets/header-drawer.liquid`, `linklist.levels < 3`). Shopify allows a top item plus two nested levels (https://help.shopify.com/en/manual/online-store/menus-and-links/drop-down-menus, https://shopify.dev/docs/storefronts/themes/navigation-search/navigation).
- **Time off links to a real page.** A "#" link for a parent item only appears in third-party guides, not in Shopify's help (https://support.nextsky.co/general/shopify-basics/shopify-navigation-menu-setup/, https://qikify.com/blogs/all-articles/create-shopify-menu). On a computer, the top item in Horizon's menu is a real link, so "#" would go nowhere.
- Why not one "Shop" item: with this few products, one tap to Hats or Lounge is quicker, and the menu stays at two levels.

### Footer menu (Content → Menus → footer)

No change. Size & fit, Shipping & returns, FAQ, About and Contact fit both.

### Product types

The collection rules depend on these.

| Product | Product type (type it exactly) |
|---|---|
| Any hat, toques included | Hat (as now) |
| Hoodie, pullover or zip | Hoodie |
| Crewneck sweatshirt | Crewneck |
| Sweatpants or joggers | Sweatpants |

- The rules match the exact word, so type it the same way every time. [CONFIRM: the partner app keeps the product type after a sync]
- If sweat shorts come later, give them Shorts, and add Shorts to the Lounge, Sweats and Everything rules.
- Tags stay as they are. Hobby tags can now go on any product. text-hat stays hats only. No "lounge" tag is needed, because the rules use product type.

### Collections to add

Products → Collections → Create collection, automated. Create them now. Keep each out of menus and the home page until it has a published product (store/collections.md, Empty collections). A collection publishes its description as written, so the checks sit on their own line, outside it.

Shopify's automated collections match either all conditions or any of them, with up to 60 conditions (https://help.shopify.com/manual/products/collections/automated-collections/auto-sort).

**Lounge**

- **Handle:** lounge
- **Title:** Lounge
- **Description:** Oversized hoodies, crewnecks and sweats for after the shift. The couch, the dock, the drive home.
- **SEO title (50 characters):** Oversized Hoodies, Crewnecks and Sweats | OFF SHFT
- **Meta description (109 characters):** Oversized hoodies, crewnecks and sweats for after the shift. From OFF SHFT, made to order and shipped to you.
- **Rule:** Product type is equal to Hoodie, Crewneck or Sweatpants. Products must match: any condition.
- **Check:** [CONFIRM: every blank in it is cut oversized; if not, drop "Oversized"] Without crewnecks, the SEO title is "Oversized Hoodies and Sweats | OFF SHFT" (39 characters); drop "crewnecks" from the other lines.

**Hoodies and crews**

- **Handle:** hoodies-and-crews
- **Title:** Hoodies and crews
- **Description:** Shift's over. Hood up. Oversized hoodies and crewnecks for the hours that are yours.
- **SEO title (42 characters):** Oversized Hoodies and Crewnecks | OFF SHFT
- **Meta description (103 characters):** Shift's over. Hood up. Oversized hoodies and crewnecks from OFF SHFT, made to order and shipped to you.
- **Rule:** Product type is equal to Hoodie or Crewneck. Products must match: any condition.
- **Check:** [CONFIRM: cut, as for Lounge] Without crewnecks: title Hoodies, handle hoodies, and drop "and crewnecks".

**Sweats**

- **Handle:** sweats
- **Title:** Sweats
- **Description:** Nowhere to be and all day to get there. Sweats for your days off.
- **SEO title (39 characters):** Sweatpants for Your Time Off | OFF SHFT
- **Meta description (99 characters):** Nowhere to be and all day to get there. Sweatpants from OFF SHFT, made to order and shipped to you.
- **Rule:** Product type is equal to Sweatpants.

**Everything**

- **Handle:** everything
- **Title:** Everything
- **Description:** Everything OFF SHFT makes, in one place. Made to order and shipped to you.
- **SEO title (35 characters):** Hats, Hoodies and Sweats | OFF SHFT
- **Meta description (118 characters):** Everything OFF SHFT makes, in one place: hats, hoodies and sweats for your time off. Made to order and shipped to you.
- **Rule:** Product type is equal to Hat, Hoodie, Crewneck or Sweatpants. Products must match: any condition.
- **Use:** the home button, the empty cart button, the search empty state, the 404 page and the cart page's "You may also like". Not in the menu. It stands in for Shopify's built-in /collections/all for the same reason All hats did: a gift card stays out (store/collections.md).
- **Check:** the description is true with hats alone, so it can go in now. The SEO title and meta description go in with the first garment. Until then, use "Everything | OFF SHFT" (21 characters) and the description as the meta (74 characters).

**Time off (later)**

- **Handle:** time-off
- **Title:** Time off
- **Description:** The water, the course, the boards, the cottage. However you spend yours.
- **SEO title (46 characters):** Fishing, Golf, Cottage and Cornhole | OFF SHFT
- **Meta description (101 characters):** Designs for fishing, golf, cornhole and the cottage. From OFF SHFT, made to order and shipped to you.
- **Rule:** Product tag is equal to fishing, golf, cottage or cornhole. Products must match: any condition.
- **Why:** the Time off menu item needs a page of its own. Create it with the first hobby design.

### Hobby collections

Keep all four, with their handles and rules. Their rules already go by tag, so a hoodie tagged fishing joins Fishing on its own. Only the copy changes (part 2). In the menu they move to Time off. The home tiles ("Pick your time off.") stay as planned.

If the owner wants them to stay hats only (owner decision 6), add "Product type is equal to Hat" to each rule with "all conditions", and leave their copy as it is.

### All hats and the "Shop hats" button

- **All hats stays as it is:** handle, title, rule and copy. The Hats menu item opens it.
- **It stops being the store's default.** Every link that means "the shop" moves to Everything: the home button, the empty cart button (build.cjs line 60), the search empty state (build.cjs line 75; theme.md section 9), the 404 page and the cart page's "You may also like" (theme.md section 9).
- **"Shop hats" becomes "Shop all"** → /collections/everything. Hats keep their own way in, through the Hats menu item.
- Why one button, not "Shop hats" plus "Shop lounge": the top band stacks its blocks in a column (build.cjs, `content_direction: 'column'`), so two buttons would sit one above the other. Side by side needs an extra group block. One button keeps the band quiet.
- Optional, once both have photos: a two-tile collection list (Hats, Lounge) under the idea band, set up like the hobby tiles in theme.md section 6.

### Notes for whoever applies this

- **store/apply/build-content.cjs reads one value per rule** (`^Product (type|tag) is equal to (.+)$`). Given "Hoodie, Crewneck or Sweatpants", it would make a rule for one product type with that whole name, which matches nothing. Extend the parser to read a list and match any of it, or create Lounge, Hoodies and crews, Everything and Time off by hand.
- **The same script publishes any page with no [CONFIRM] left.** The About replacements have none, so applying them changes a live page. The owner approves that first.
- **Add the garment sections of the FAQ and Size & fit with the first garment.** Until then, those pages stay hats only, so their hat facts can publish without waiting for the garment research.
- Create Everything before the home button, the cart link or the search setting points at it.

## 4. FAQ and Size & fit for clothing

### FAQ

New order, 16 questions. The unmarked ones only get the line edits in part 2.

1. How do the hats fit?
2. **How do the hoodies, crewnecks and sweats fit?** (new)
3. **What size do I need?** (new answer)
4. **What are they made of?** (was "What are the hats made of?")
5. **How do I wash it?** (was "How do I clean my hat?")
6. **Will it shrink?** (new)
7. Is everything made to order? (was "Are the hats made to order?")
8. How long does shipping take?
9. Will I get a tracking number?
10. Do you ship outside Canada and the US?
11. Will I pay duties or import fees?
12. Can I return or exchange something?
13. **What if my hoodie or sweats don't fit?** (new)
14. What if it arrives damaged or wrong, or doesn't arrive?
15. Can I send a gift?
16. How do I reach you?

Text for the new and rewritten ones, each question as Heading 3:

```markdown
### How do the hoodies, crewnecks and sweats fit?

They're cut big on purpose, roomy through the body and arms. [CONFIRM: how the chosen blanks are cut, for example dropped shoulders or a longer body, from the spec sheet]

Order your usual size for the roomy fit they're made for. [CONFIRM: true for the chosen blanks] Want it closer to the body? [CONFIRM: go one size down, if the size chart supports it] The [Size & fit](/pages/size-fit) page has the measurements.

### What size do I need?

- **Hats:** one size, adjustable at the back. [CONFIRM: true for every hat we sell] Measure around your head where a hat sits, then check the range on the [Size & fit](/pages/size-fit) page.
- **Hoodies, crewnecks and sweats:** take one you own that fits the way you like. Lay it flat, measure it, and compare it with the chart on the [Size & fit](/pages/size-fit) page. [CONFIRM: the chart gives garment measurements, not body measurements]
- **Unisex?** [CONFIRM: the hoodies, crewnecks and sweats come in unisex sizes] If you usually buy women's sizes, [CONFIRM: the blank maker's advice, for example one size down].

### What are they made of?

- **Hats:** the designs are embroidered, not printed. The hats themselves: [CONFIRM: material of each style, from the partner's spec sheet].
- **Hoodies, crewnecks and sweats:** [CONFIRM: fabric, blend and weight of each blank]. The designs are [CONFIRM: embroidered or printed, per design].

### How do I wash it?

- **Hats:** follow the care label inside. [CONFIRM: each style has a care label inside; care instructions for each style, from the partner's spec sheet]
- **Hoodies, crewnecks and sweats:** follow the care label inside. [CONFIRM: the care label of each blank, and the partner's advice for the print or embroidery]

### Will it shrink?

[CONFIRM: whether each blank is pre-shrunk, and how much it may shrink, from the maker's spec] To keep it close to the size you ordered, wash it cold and dry it low or hang it. [CONFIRM: that matches each care label]

### What if my hoodie or sweats don't fit?

Each one is made for your order, so we can't take it back or swap the size. That's why the [Size & fit](/pages/size-fit) page has the measurements. Check them against one you own before you order, or email us and we'll help you pick.

If we send a different size from the one you ordered, that's on us. See the next question.

[CONFIRM: the owner keeps no size swaps for clothing (owner decision 5)]
```

If the owner takes size swaps instead (owner decision 5), that answer becomes:

```markdown
### What if my hoodie or sweats don't fit?

Email us within [CONFIRM: number of days] days of delivery with your order number. We'll send the other size [CONFIRM: free, or for the cost of shipping]. [CONFIRM: whether the first one comes back, and where to] [CONFIRM: one swap per order]
```

A swap at the store's cost means paying for a second garment. Neither partner takes back a change of mind or a wrong colour (https://help.printful.com/hc/en-us/articles/360014006840-What-is-Printful-s-return-and-refund-policy, https://help.printify.com/hc/en-us/articles/4483630299025-How-does-Printify-handle-refunds-and-returns, as cited in store/research/pod-partner.md). [CONFIRM: a wrong size the customer picked counts the same at the chosen partner]

### Size & fit

New intro, in place of the first paragraph:

```markdown
Hats are one size and adjust at the back. [CONFIRM: true for every hat we sell] Hoodies, crewnecks and sweats come in sizes and are cut big. [CONFIRM: the chosen blanks are cut oversized] Either way, a minute with a tape measure tells you what to order.
```

Keep the hat sections as they are, with the three renamed headings (part 2). Add these after them, before "Still not sure?":

```markdown
### How the hoodies, crewnecks and sweats fit

They're cut oversized. [CONFIRM: what that means for the chosen blanks, for example dropped shoulders, a roomy body, longer sleeves] Order your usual size for the roomy fit they're made for. [CONFIRM: true for the chosen blanks] For a closer fit, [CONFIRM: go one size down, if the chart supports it].

[CONFIRM: sizes are unisex] If you usually buy women's sizes, [CONFIRM: the blank maker's advice].

### How to measure a hoodie, crewneck or sweats

The easiest way: use one you already own that fits the way you like.

1. Lay it flat on a table and smooth it out. Don't stretch it.
2. **Chest:** straight across, armpit to armpit. [CONFIRM: the chart measures chest this way; if it gives body sizes, measure around your chest, under your arms, instead]
3. **Length:** from the top of the shoulder, beside the collar, straight down to the hem. [CONFIRM: the chart measures length this way]
4. **Sleeve:** [CONFIRM: how the chart measures it: from the shoulder seam, or from the centre back of the neck]
5. **Sweats:** the waist straight across the top, laid flat, and the inseam from the crotch seam to the bottom of the leg. [CONFIRM: the measurements the sweats chart gives]
6. Compare your numbers with the charts below. Between two sizes? [CONFIRM: the maker's advice]

### Hoodie and crewneck sizes

| Size | Chest | Length | Sleeve |
|---|---|---|---|
| [CONFIRM: each size, for example S to 3XL] | [CONFIRM: cm and in] | [CONFIRM: cm and in] | [CONFIRM: cm and in] |

### Sweats sizes

| Size | Waist | Inseam |
|---|---|---|
| [CONFIRM: each size] | [CONFIRM: cm and in] | [CONFIRM: cm and in] |

[CONFIRM: add a hip or thigh column if the chart gives one]

### Washing and shrinkage

Follow the care label inside. [CONFIRM: the care label of each blank, and the partner's advice for the print or embroidery]

[CONFIRM: whether each blank is pre-shrunk, and how much it may shrink, from the maker's spec] To keep it close to the size you ordered, wash it cold and dry it low or hang it. [CONFIRM: that matches each care label]
```

## 5. BRAND.md and PRODUCTS.md

### BRAND.md

**Line 7 (The idea)**

Old:
> OFF SHFT is for people whose free time is earned: trades, plant workers, nurses, drivers, office folks who count down to Friday. When they clock out, they go fishing, hit the golf course, set up the cornhole boards, or head to the cottage. OFF SHFT makes the hat they wear when they get there.

New:
> OFF SHFT is for people whose free time is earned: trades, plant workers, nurses, drivers, office folks who count down to Friday. When they clock out, they go fishing, hit the golf course, set up the cornhole boards, or head to the cottage. Or they do nothing at all, and that's earned too. OFF SHFT makes what they wear when they get there: the hat for the day out, the hoodie and sweats for the hours after.

**Line 19 (Core message)**

Old:
> The hat is the reward and the badge of it.

New:
> The hat or the hoodie is the reward and the badge of it.

**Line 23 (Audience)**

Old:
> - Adults roughly 25–60 who work full-time and have one or more outdoor hobbies

New:
> - Adults roughly 25–60 who work full-time and have one or more outdoor hobbies
> - The same people on the couch, and anyone coming off long or odd shifts who wants something comfortable on their own time

**Line 24 (Audience)**

Old:
> - Gift buyers: partners, kids buying for dad, coworkers buying retirement and birthday gifts

New:
> - Gift buyers: partners, kids buying for dad, coworkers buying retirement and birthday gifts. A hat is the easy gift. A hoodie needs the right size.

**Line 31 (Voice)**

Old:
> - Short lines. Hat text has to read from across a parking lot.

New:
> - Short lines. Hat text has to read from across a parking lot. On hoodies and sweats, words stay small: a chest line or a sleeve, never across the back.

**Line 32 (Voice)**

Old:
> - Good: "Punched out." / "Lines in." / "Shift's over. Tee's up." / "Off the clock, on the water."

New:
> - Good: "Punched out." / "Lines in." / "Shift's over. Tee's up." / "Off the clock, on the water." / "Shift's over. Hood up."

**Line 37 (Look)**

Old:
> Reference brands: Duck Camp, Huk. Quiet, small, well-spaced. One strong symbol instead of big slogans.

New:
> Reference brands: Duck Camp, Huk. Quiet, small, well-spaced. One strong symbol instead of big slogans. Lounge wear follows the same rule: an oversized cut in a brand fabric colour, one small mark, nothing loud.

**Line 42 (Symbol on its own)**

Old:
> - **Symbol on its own:** the clock O without the letters, for patches, the back or side of a hat and social avatars. The side-of-hat version is its own small drawing (`side-*.svg`), not a scaled-down copy.

New:
> - **Symbol on its own:** the clock O without the letters, for patches, the back or side of a hat, a garment's sleeve, the back of the neck or the leg of the sweats, and social avatars. The side-of-hat version is its own small drawing (`side-*.svg`), not a scaled-down copy. It's also the one for any garment mark under 19 mm.

**Line 43 (Icons)**

Old:
> - **Icons (hobby hats):** single-weight line drawings, 1.6 mm line. They are a separate illustration style and never sit right next to the logo; when they do share a hat, the logo goes on the back or side.

New:
> - **Icons (hobby designs):** single-weight line drawings, 1.6 mm line. They are a separate illustration style and never sit right next to the logo. When they share a hat, the logo goes on the back or side. On a garment, it goes on the sleeve or the back of the neck.

**Line 46 (Fabric colours)**

Old:
> - **Fabric colours:** Bone, Oat, Moss, Spruce, Slate, Rust.

New:
> - **Fabric colours:** Bone, Oat, Moss, Spruce, Slate, Rust, for hats and garments alike. [CONFIRM: the nearest blank colour for each garment, from the garment research]

**Line 48 (heading)**

Old:
> ## Design rules (for embroidery)

New:
> ## Design rules (embroidery, hats and garments)

**Line 53**

Old:
> - Front panel design area roughly 4 in wide × 1.75 in tall; side and back designs smaller

New:
> - Hats: front panel design area roughly 4 in wide × 1.75 in tall; side and back designs smaller. Garments: see the next section.

**New section, after line 54**

> ## Design rules for garments
>
> - **One mark on the front, small, on the left chest.** The lockup at hat-front size: cap 7 mm and 62.6 mm wide, the smallest size that keeps the pivot dot. Or the symbol, at least 19 mm tall in two colours (20.5 mm in one). Both from `designs/mark/final/the-o/notes.md`. [CONFIRM: the left-chest area the partner offers on each blank]
> - **At most one second mark:** the symbol, on the sleeve near the cuff, the back of the neck or the upper left leg of the sweats. Under 19 mm, use the side master (8.4 × 16.6 mm), never a scaled-down symbol (notes.md).
> - **No big prints.** Nothing across the chest or the back. Nothing on the hood, the pocket or the seat.
> - **Hobby designs:** icon and label at about hat-front size, on the left chest. The logo moves to the sleeve or the back of the neck.
> - **Words:** Unbounded Bold, cap 6.6 mm or more when embroidered (notes.md). Printed: [CONFIRM: the partner's smallest text and line for the print method].
> - **Embroidery by default** for the logo and the symbol. Their rules, size floors and digitizer notes are written for thread. Print only after a printed sample passes. [CONFIRM: the placements and methods each partner offers on the chosen blanks: left chest, sleeve, back of the neck, leg]
> - **Colours:** the same colourways by fabric as the hat logo (Logo colours, above). Two or three per design.
> - **Sew-out first.** Digitize each garment on its own and approve it from a sew-out on the real blank, as notes.md asks for hats.
> - **Deliver** vector files plus a flat PNG preview on the fabric colour, as for hats.

### PRODUCTS.md

**Line 3**

Old:
> All hats are made to order by a print-on-demand partner and shipped directly to the customer. We hold no stock.

New:
> Everything is made to order by a print-on-demand partner and shipped directly to the customer: hats, plus oversized hoodies, crewnecks and sweats. We hold no stock.

**New line, after line 10 (Partner)**

> - **Garments, at both partners:** [CONFIRM: oversized hoodie, crewneck and sweats blanks, embroidery and print options on each, and which shop makes each, from the garment research]

**Line 12**

Old:
> Check both for Canadian fulfillment or shipping times to Canada before choosing. Customs and duties on cross-border orders hurt Canadian customers.

New:
> Check both for Canadian fulfillment or shipping times to Canada before choosing. Customs and duties on cross-border orders hurt Canadian customers, and garments more than hats. A courier parcel from the US is tax-free in Canada only up to C$40 (https://www.cbsa-asfc.gc.ca/services/cusma-aceum/overview-survol-eng.html, https://www.cbsa-asfc.gc.ca/publications/dm-md/d8/d8-2-16-eng.html), and one hoodie may cost more than that. [CONFIRM: hoodie price, and where each garment is made]

**Line 23**

Old:
> Later: toques for winter (big in Canada, great Q4 gift), bucket hats for summer.

New:
> Later: toques for winter (big in Canada, great Q4 gift), bucket hats for summer, and sweat shorts for summer if the sweats sell.

**New section, after line 23**

> ## Hoodies and sweats to start
>
> | Style | Use for | Typical retail (CAD) |
> |---|---|---|
> | Oversized hoodie | The logo or the symbol, small. Small hobby designs | [CONFIRM: from the garment research and the margin math] |
> | Oversized crewneck | The same as the hoodie | [CONFIRM] |
> | Sweatpants or joggers | The symbol on the leg | [CONFIRM] |
>
> [CONFIRM: which of these launch (owner)] Call each style what its maker calls it, sweatpants or joggers, so the name matches the partner's page. [CONFIRM: the maker's name for the chosen blank]

**Lines 27–32 (Margin math)**

Old:
> | | Example |
> |---|---|
> | Retail price | $34.99 CAD |
> | Partner base cost (hat + embroidery) | ~$18–24 CAD (check current catalog) |
> | Payment fees (~3%) | ~$1.05 |
> | **Gross profit per hat, before ads** | **~$10–16 CAD** |

New:
> | | Hat (example) | Hoodie (fill in) |
> |---|---|---|
> | Retail price | $34.99 CAD | [CONFIRM] |
> | Partner base cost (item + decoration) | ~$18–24 CAD (check current catalog) | [CONFIRM: from the garment research] |
> | Payment fees (~3%) | ~$1.05 | 2.8% + 30¢, or 3.5% + 30¢ on US and Amex cards (store/research/shopify-setup.md) |
> | **Gross profit per item, before ads** | **~$10–16 CAD** | [CONFIRM] |

**Line 34**

Old:
> Shipping: charge it separately or offer free shipping over $75 (encourages 2+ hats).

New:
> Shipping: charge it separately or offer free shipping over $75 (encourages 2+ hats, or a hat with a hoodie). If one hoodie costs $75 or more, it ships free on its own, so check its margin still covers the shipping. [CONFIRM: hoodie price and shipping cost]

**Line 37**

Old:
> - Never price below a $10 CAD profit per hat after fees.

New:
> - Never price below a $10 CAD profit per hat after fees. Garments: [CONFIRM: the owner's floor for a hoodie, a crewneck and a pair of sweats]

**Line 38**

Old:
> - Bundles: "Pick any 2 for $64.99" raises order value.

New:
> - Bundles: "Pick any 2 hats for $64.99" raises order value. A hoodie-and-sweats set: [CONFIRM: owner's call, once prices are known]

**Line 39**

Old:
> - Embroidery has a one-time digitization fee at some partners (around $5–10 USD per design). Account for it before launching 15 designs.

New:
> - Embroidery has a one-time digitization fee at some partners (around $5–10 USD per design). Account for it before launching 15 designs. A design may be charged again when it moves onto a garment: Printful charges US$2.95 to use a design on another hat type (https://help.printful.com/hc/en-us/articles/360014009540). [CONFIRM: the fee for each garment placement]

### README.md (the tagline lives here too)

| Line | Old | New |
|---|---|---|
| 3 | Hats for the hours you earned. An outdoor-hobby headwear brand for people who work hard and play on their time off. | For the hours you earned. Hats, hoodies and sweats for people who work hard and play on their time off. |
| 6 | - **Products:** embroidered and printed hats, made and shipped by a print-on-demand partner (Printful or Printify) | - **Products:** hats, plus oversized hoodies, crewnecks and sweats, made and shipped by a print-on-demand partner (Printful or Printify) |
| 7 | - **Audience:** people who work hard and spend their time off fishing, golfing, playing cornhole, and at the cottage or backyard | - **Audience:** people who work hard and spend their time off fishing, golfing, playing cornhole, at the cottage, in the backyard or on the couch |
| 15 | \| [PRODUCTS.md](PRODUCTS.md) \| Hat styles, pricing, margins \| | \| [PRODUCTS.md](PRODUCTS.md) \| Hat and garment styles, pricing, margins \| |

## Owner decisions

1. **The name, in clothing.** LAUNCH_PLAN.md records the go-ahead after hearing about FIGS, Inc.'s US filing for OFF-SHIFT (serial 97169167) as surgical scrubs, class 10. Search results give more:
   - Two search summaries of the Justia record list class 25 clothing as well. Both name t-shirts and pajamas; one also names hats and loungewear. A third lists only the scrubs (https://trademarks.justia.com/971/69/off-97169167.html).
   - One listing gives a registration number, 7057032 (https://trea.com/organization/figs-inc/4de6942e-c988-41c5-9721-14c5d6a96c1c). An older snapshot shows a new application.
   - Search results show FIGS products named "Off-Shift Hoodie Sweatshirt" and "Off-Shift Logo Crewneck Sweatshirt" (https://thingtesting.com/brands/figs/products/6901861), and a finance site that describes FIGS's lounge wear as made for off-shift time (https://www.hl.co.uk/shares/shares-search-results/f/figs-inc-usd0.0001-bmxxbd9/company-information). Some of the product listings come from an unofficial copy of FIGS's store, and FIGS's own site wasn't checked. store/apparel-plan.md's "OFF SHFT Logo Crewneck" would sit very close to that second name.
   - Searched again in review: the results may tie the class 25 goods above to FIGS's ON-SHIFT filing of the same day (serial 97169159), not to OFF-SHIFT. They also show a FIGS ON-SHIFT INSIDE filing (serial 97169181) in class 25 (https://trademarks.justia.com/971/69/on-97169159.html, https://trademarks.justia.com/971/69/on-shift-97169181.html). So the OFF-SHIFT goods list is still open, and FIGS has filed other SHIFT names for clothing.

   None of these pages could be opened from here. [CONFIRM: classes, goods and status on the USPTO record (https://tsdr.uspto.gov/#caseNumber=97169167&caseType=SERIAL_NO&searchType=statusSearch), and a CIPO search for Canada] Hoodies and sweats for shift workers may sit much closer to that than hats did. If the record lists hats in class 25, the hat go-ahead needs the same check. Ask a trademark lawyer before any OFF SHFT garment goes on sale. This isn't legal advice.
2. **The headline:** "For the hours you earned." (the pick), or one of the other two. Then a trademark search on the line.
3. **The launch lineup:** hoodie, crewneck and sweats, and the two tees in store/picks.md. Which ones launch? The copy names only what's on sale. Tees would need a product type, a collection and their own lines.
4. **The name of the garment section:** Lounge (the pick), or Sweats.
5. **Size swaps for clothing:** keep "no returns or exchanges", or swap sizes at the store's cost, and on what terms.
6. **Hobby collections:** take garments too (the pick; the copy is ready), or stay hats only.
7. **The home page:** one "Shop all" button (the pick), or two buttons.
8. **The garment look:** an embroidered left-chest logo at hat-front size as the default, where the second mark goes, and whether tonal thread (close to the fabric colour) is allowed as a default on lounge wear. BRAND.md says a one-colour logo is never the default front logo.

Applying any of this also needs the owner's approval: the live About page, the draft theme copy, the menus and the new collections (AGENTS.md).
