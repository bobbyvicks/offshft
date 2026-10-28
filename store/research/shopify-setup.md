# Shopify setup for OFF SHFT

Research for OFF SHFT, 28 October 2026. The owner decides; nothing here changes the store. Every fact has a source number. Anything not checked is marked [CONFIRM: ...].

How this was checked: this session couldn't open shopify.com or help.shopify.com directly (network block). Their facts come from search results that quote the pages under Sources, and where two pages disagree it says so. Horizon's settings were read from Shopify's own copy of the theme code, version 4.3.0 of 13 October 2026 [9]. The font list is from Shopify's developer docs [17]. The domain check used Shopify's domain search, read-only [56]. Prices change; check them on the day.

**In short:** Basic plan. Keep Horizon. Unbounded and Archivo are both in Shopify's font library. Shopify Payments, paid out in CAD, with Shop Pay. A US market priced in USD. No GST/HST registration until sales pass C$30,000 (ask an accountant). Shipping and returns in Shopify's own policies. Horizon's built-in email sign-up. offshft.com is available through Shopify for US$16.00 for the first year.

## 1. Plan and cost

Shopify's Canada page, in CAD [1]:

| Plan | Billed monthly | Billed yearly, per month | Online card rate | Fee if you use another payment provider |
|---|---|---|---|---|
| Basic | $49 | $37 | 2.8% + 30¢ | 2% |
| Grow | $132 | $99 | 2.6% + 30¢ | 1% |
| Advanced | $517 | $389 | 2.4% + 30¢ | 0.6% |

- On Basic, Amex and cards issued outside Canada cost 3.5% + 30¢ [1]. Most US buyers pay with those.
- In USD, the US page shows Basic at US$39 monthly or US$29 a month billed yearly [2]. Its table shows Grow at US$105 or US$79 and Advanced at US$399 or US$299, but other copies of the page differ [2]. [CONFIRM: Grow and Advanced in USD.]
- A Canadian store is billed in CAD. Plan prices are set in CAD, not converted [7]. Apps, themes and domains priced in USD are converted with a 1.5% fee [7].
- Intro offer: a free 3-day trial with no card, then $1 a month for the first 3 months on most plans, then the normal price [1]. Trial length varies; stores set up with an AI tool get 4 months [3]. [CONFIRM: the offer and the trial end date in this store's admin, Settings → Plan.]
- Choosing a plan during the trial doesn't end it. Billing starts when the trial ends [3]. A switch to yearly billing during a promotion starts after the promotion [3].
- Starter only makes product links, with no collections or new templates [5]. It can't run this store.

**Basic is enough.** It runs the online store, Shopify Payments, a US market in USD and duties at checkout [1][29][33]. It has no staff accounts, so only the owner logs in [4]. It can't show live carrier rates at checkout [6]; flat rates by zone work (see store/research/pod-partner.md). Grow billed yearly costs C$62 a month more and saves 0.2 points on Canadian cards, so it pays for itself at about C$31,000 a month in Canadian card sales (arithmetic on [1]). It also adds live carrier rates [6].

Card fees on one C$34.99 hat (arithmetic on [1]): about C$1.28 on a Canadian card and C$1.52 on a US card. PRODUCTS.md assumed C$1.05.

## 2. Theme: Horizon

Horizon is Shopify's flagship free theme, now version 4.3.0 (9 October 2026) [8][9]. It is built from theme blocks that nest inside each other, up to eight levels [9][15]. Nine other free themes, such as Pitch and Tinker, share the same base [16]. [CONFIRM: the version this store runs, under Online Store → Themes. Anything older than 4.0.0 has colour schemes, not a palette.]

**Colours.** From 4.0.0, Horizon uses one colour palette instead of colour schemes [10]. The palette holds Background, Foreground and extra brand colours used across the theme [9][10]. Any section or block with a colour field can override it [10]. Theme settings also colour buttons, inputs, drawers, pop-ups, badges and variant pickers [9].

**Typography** (Theme settings → Typography) [9]:
- Four font pickers: Body, Subheading, Heading, Accent [9].
- Heading 1 to 6 presets each set font, size (10 to 184 px), line height, letter spacing and case (Default or Uppercase). Paragraph sets size and line height [9].
- Letter spacing has three steps: Tight −0.03 em, Normal 0, Loose 0.03 em [9]. The brand's 0.12 em needs a rule in the Custom CSS box in Theme settings (1,500 characters at most) [11][12]. [CONFIRM: the box shows in Horizon.]

**Logo and favicon** (Theme settings → Logo and favicon) [9]: Default logo, Inverse logo (for dark or see-through headers), desktop height 12–100 px (default 36), mobile height 12–100 px (default 28), Favicon, and a link to rename the store. Shopify shrinks a large favicon to 32 × 32 px [13], so the 512 px store/assets/favicon.png works.

**Sections** (Add section) include Hero, Slideshow, Rich text, Image with text, Multicolumn, FAQ, Email signup, Large logo, Featured collection, Featured product, Product highlight, Collection list, Marquee, Divider and Custom Liquid [9].

**Product page** [9]:
- Product information section: Product media, then Details. Details holds the title and price, a divider, Variant picker, Buy buttons (Quantity, Add to cart, Accelerated checkout), the description, then Disclosures [9].
- Collapsible content is the **Accordion** block, added inside Details. Each Accordion row has a heading, "Open row by default" and an optional icon (Ruler, Truck, Return and more). Rows hold text or other blocks [9]. Good for Fit and Shipping & returns.
- **Swatches:** the Variant picker shows Buttons or Dropdowns, with a Swatches switch. Theme settings → Swatches sets size, corner radius and borders [9]. Colour swatches come from linking the Color option to the product category's Color metafield [14]. [CONFIRM: the link survives a Printful sync.]
- The Featured product section comes with a Review stars block [9]. Delete it until there are real reviews.

**Fit for OFF SHFT: yes.** Product highlight and Featured product suit a shop with a few hats [9]. The quiet look is in the settings: page width Narrow (the default), Uppercase headings, square buttons (corner radius 0–100 px; the default 100 is a pill), animations and hover effects off, thin icons [9]. Watch the sample text in new sections; some of it makes claims we can't back (store/pages/home.md). **No reason to switch.** The other Horizon-family themes use the same blocks [16], so a switch would only change the starting look.

## 3. Fonts

- **Unbounded is in Shopify's font library**, weights 200–900, no italics [17]. Unbounded Bold is weight 700.
- **Archivo is too**, weights 100–900 with italics, plus Archivo Black and Archivo Narrow [17]. No expanded width is listed, so the kit's Archivo Expanded isn't available from the library.
- All free Shopify themes take their fonts from this library [11]. So both should be in Horizon's pickers, which answers the open question in store/pages/home.md. [CONFIRM: search the picker once.]
- Library fonts are free on every store. Shopify doesn't give out the font files [17].

If one ever leaves the library (Shopify has retired fonts before [17]):
- Custom font through theme code: upload WOFF2 files to the theme's assets, declare them with @font-face in an assets/fonts.css.liquid file loaded from theme.liquid, and use font-display: swap [18]. Custom CSS may only load files from cdn.shopify.com [12]. Shopify suggests hiring a Partner for this [11].
- Licence: both fonts are under the SIL Open Font License 1.1 [19][20]. It allows self-hosting web fonts with @font-face [21][22]. The FAQ asks that the copyright and licence travel with the font files [22]. Converted or subset files count as modified versions, which only limits the name when a Reserved Font Name is declared; neither font declares one [19][20][22].
- Closest library fonts (a judgement by eye): for Unbounded, Krona One or Michroma, both wide, one weight each [17]. For Archivo, Archivo Narrow or Work Sans [17].

## 4. Shopify Payments in Canada

- Open to businesses based in Canada [23]. CAD payouts need a CAD chequing account at a Canadian bank that takes ACH transfers, in a name matching the Shopify Payments account. Sign-up checks photo ID and proof of address [23].
- Payouts are in CAD on every plan [24]. Daily, weekly or monthly; at least 3 business days to settle; new bank details bring a 3–5 business day hold [24].
- USD payouts: one Shopify page says Basic and Grow stores in Canada can choose USD with a 1.5% fee; another says those plans can't [25]. [CONFIRM: in Settings → Payments, if it matters.]
- When a buyer pays in USD and you're paid in CAD, Shopify keeps 2% for the conversion [26].
- Shop Pay, Apple Pay and Google Pay come on with Shopify Payments; there's no separate switch [27]. [CONFIRM: one line of that page lists only Apple Pay; check Settings → Payments.] Horizon shows them on the product page and, through a theme setting, in the cart [9].
- Another payment provider adds 2% per order on Basic [1].

## 5. Selling to the US

Setup, under Markets in the admin:
1. Shopify Payments must be on to sell in USD [29].
2. Add a United States market. A one-country market uses that country's currency, USD [28].
3. Exchange rate: automatic, with the 2% fee built into the USD price buyers see, or a manual rate, with the fee taken from your payout [26][28].
4. Shopify rounds converted prices to common price points for each currency; the rules can't be changed [30].
5. Fixed USD prices, or a percentage up or down, can be set in the market's catalog [31]. [CONFIRM: available on Basic.]
6. Horizon's header has a country/region picker, on by default. Theme settings → Prices shows the currency code next to prices, also on by default [9]. Keep it: both currencies use "$".

Duties and import taxes:
- Shopify can charge them at checkout on every plan since 2 February 2025 [33]. It needs HS codes on products and duty-paid (DDP) shipping labels [32]. The fee is 0.5% of the order for now, normally 0.85% with Shopify Payments [32]. [CONFIRM: current fee.]
- The US gives no duty-free entry to low-value parcels from any country; an order of February 2026 kept that in place [35][36].
- For OFF SHFT it rarely applies. Printful makes US orders in its US shops, so they don't cross a border (store/research/pod-partner.md). Turn on duties only if a hat must ship from Canada to the US. [CONFIRM: where each chosen hat is made.]
- Managed Markets (Global-e as seller of record) is open to Canadian stores on Basic, but it needs DHL Express or FedEx labels bought through it, not Canada Post [34]. That doesn't suit a partner that ships its own parcels.

## 6. Sales tax (facts only)

Canada:
- A business with C$30,000 or less in worldwide taxable sales, in a single calendar quarter and over the last four, is a small supplier. It doesn't have to register for GST/HST [37].
- Go over and you must register; the CRA guide sets the dates and a 29-day deadline [37]. A small supplier may also register by choice [37].
- Registrants claim back GST/HST paid on business costs (input tax credits) [37]. Printful charges HST on hats made in Canada (pod-partner.md).
- Ontario HST is 13% [38]. Goods are taxed where they're delivered: 5% GST in provinces without HST, 13–15% HST in the others [38].
- BC, Manitoba, Saskatchewan and Quebec add their own provincial tax, with their own rules for registering [40].
- Goods shipped to buyers outside Canada are generally zero-rated: no GST/HST [39].
- In Shopify: Settings → Taxes and duties → Canada, then enter each tax number [41]. A store that wasn't collecting Canadian tax before 13 May 2026 can't use Basic Tax; the choice is Shopify Tax or manual rates [40]. Shopify Tax is free until C$100,000 in total sales (lifetime, for stores created from that date), then 0.25% per Canadian order, at most C$0.99 [42][43]. [CONFIRM: another help page says 0.15%.]

US:
- Economic nexus covers sellers outside the US too [44][45]. Each state sets its own threshold; many are US$100,000 a year in sales into the state, some also count orders, and Texas and New York are US$500,000 [44].
- Register with the state first, then add the number in Shopify [45]. Shopify's tax liability page flags a state at 80% of its threshold [45]. [CONFIRM: the page shows for a Canadian store.]

**Confirm all of this with an accountant who knows Canada–US online sales before registering or charging tax.**

## 7. Store policies

- Settings → Policies holds the return and refund policy, privacy policy, terms of service, shipping policy and contact information [46].
- Return and refund, terms, shipping and contact can be automated: Shopify writes them from store settings and keeps them current [46]. Or switch automation off and write your own; "Insert template" appears only on policies without automation [46]. Shopify's text isn't legal advice [46].
- Shopify's terms require public contact information, a refund policy and order fulfillment times [46].
- Return rules (Settings → Policies → Return and cancellation rules) set the return window that the refund policy shows [47].
- Each policy gets its own page, such as /policies/refund-policy and /policies/shipping-policy [46]. Checkout links them on its own; add them to the footer menu too (Content → Menus) [46]. Horizon's footer already has a Policy links block [9].

What OFF SHFT needs:
- Refund policy: made to order; a replacement or refund for a misprint, damage or a lost parcel reported with a photo; no change-of-mind returns (pod-partner.md). [CONFIRM: the window in days (owner).]
- Shipping policy: production and transit times and rates from the partner. [CONFIRM: once the partner and rates are set.]
- Privacy, terms and contact: Shopify's versions, filled from the address and email in Settings → General [46]. [CONFIRM: which address to publish.]
- Keep shipping and returns in these policies, not a separate page, so checkout shows the same text. The FAQ links to them.

## 8. Email capture

- Free and built in: Horizon's Email signup block, in the footer and on the password page. Sign-ups become customer profiles [9]. The footer's sample line, "Get exclusive deals and early access to new products.", promises things we don't offer; replace it [9].
- Shopify Messaging, the new name for Shopify Email: the first 10,000 emails a month are free, then US$1 per 1,000 [48]. The free tier comes with Basic and up [49]. [CONFIRM: how it shows on a CAD bill.]
- Shopify Forms: a free app for pop-up and inline forms [50]. It can subscribe people on submit or with a tick box, and pop-ups need its theme embed [51]. A quiet site may skip pop-ups.
- Canada's anti-spam law: get consent first; a pre-ticked box doesn't count [52]. The sign-up must say why you're asking, who you are with contact details, and that people can unsubscribe [53]. Each email needs your name, a mailing address and an unsubscribe link, honoured within 10 business days [52].

## 9. Password page

- A new store stays behind a password page until launch [54]. Set the password and message in Online Store → Preferences [54].
- Horizon's password page shows the logo, "Opening soon", "Sign up for our newsletter to be the first to know when we launch." and a sign-up form [9]. Those sign-ups wait in Customers for a launch email.
- Removing it needs a paid plan and a business address [54]. Picking a plan doesn't end the trial; billing starts when the trial ends [3].
- To launch: Online Store → click Private → Public. The first time, the button reads Launch store [54].
- That opens the store and checkout to everyone [54]. It's the owner's call, once products, payments, shipping, tax and policies are set (AGENTS.md).

## 10. Domains

Checked today with Shopify's domain search: **offshft.com and offshifthats.com are both available through Shopify, US$16.00 each for the first year** [56]. That's a snapshot, not a hold. Renewal is priced separately [56].

Buying through Shopify (Settings → Domains → Buy new domain):
- Shopify manages the domain and creates its security certificate [55][57]. WHOIS privacy is included on most endings [57].
- It goes on the Shopify bill, charged in USD and converted with a 1.5% fee [7]. It renews yearly and can't be refunded [55].

Connecting a domain bought elsewhere:
- At the registrar, point the A record (@) to 23.227.38.65 and the www CNAME to shops.myshopify.com, and delete other A records [58].
- Renewal, payment and DNS stay with the registrar [58]. Shopify's free certificate can take up to 48 hours [59].

Either way:
- Add offshifthats.com as a second domain. Shopify sends it to the main domain on its own [59].
- New merchants may get a bill credit for buying, connecting or transferring one domain within 180 days of choosing a plan [60]. [CONFIRM: the amount, and whether this store qualifies.]
- A domain costs money, so the owner approves it (AGENTS.md).

## Cost summary

CAD unless marked.

| Item | Cost | Source |
|---|---|---|
| Basic plan | $37 a month billed yearly ($444 a year), or $49 a month | [1] |
| Intro offer | 3-day trial, then $1 a month for 3 months [CONFIRM: in admin] | [1][3] |
| First 15 months on Basic | $447 with yearly billing after the offer (3 × $1 + $444); $591 staying monthly (3 × $1 + 12 × $49) [CONFIRM: the offer applies to this store] | [1][3] |
| Card fee, Canadian card | 2.8% + 30¢ (about $1.28 on a $34.99 hat) | [1] |
| Card fee, US or Amex card | 3.5% + 30¢ (about $1.52 on a $34.99 hat) | [1] |
| Buyer pays in USD | 2% conversion | [26] |
| Another payment provider | +2% per order | [1] |
| Horizon theme | Free | [8] |
| Unbounded and Archivo | Free (font library) | [17] |
| offshft.com through Shopify | US$16.00 first year; renewal separate | [56] |
| offshifthats.com (optional) | US$16.00 first year | [56] |
| USD charges on a CAD bill (domains, apps) | +1.5% | [7] |
| Shopify Messaging | Free to 10,000 emails a month, then US$1 per 1,000 | [48] |
| Shopify Forms | Free | [50] |
| Shopify Tax | Free to $100,000 in sales, then 0.25% per Canadian order (max $0.99) [CONFIRM: 0.25% or 0.15%] | [43] |
| Duties at checkout (optional) | 0.5% of the order for now | [32] |
| Live carrier rates | Not on Basic; included with Grow billed yearly | [6] |

## Sources

1. Shopify pricing, Canada: https://www.shopify.com/ca/pricing
2. Shopify pricing, US: https://www.shopify.com/pricing?country=US
3. Free trial: https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/free-trial
4. Basic plan: https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/plans-features/basic-shopify-plan
5. Starter plan: https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/plans-features/shopify-starter-plan
6. Carrier-calculated shipping: https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/third-party-carrier-calculated-shipping
7. Billing in local currency: https://help.shopify.com/en/manual/your-account/manage-billing/paying-your-bills/managing-payments/local-currency
8. Horizon in the Theme Store: https://themes.shopify.com/themes/horizon/presets/horizon
9. Horizon theme code, v4.3.0 (config/settings_schema.json, sections/, blocks/, templates/product.json, templates/password.json, sections/footer-group.json, snippets/theme-styles-variables.liquid): https://github.com/Shopify/horizon
10. Colour palettes and schemes: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/color-settings
11. Theme settings, fonts, Custom CSS: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/theme-settings
12. Adding custom CSS: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/edit-code/add-css
13. Favicon: https://help.shopify.com/en/manual/online-store/images/add-favicon
14. Swatches from category metafields: https://help.shopify.com/en/manual/custom-data/metafields/category-metafields/using-category-metafields
15. Sections and blocks: https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections-and-blocks
16. Horizon, 10 free themes: https://changelog.shopify.com/posts/horizon-10-new-free-themes-by-shopify and https://themes.shopify.com/collections/horizon-themes
17. Shopify font library: https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts
18. Self-hosting web fonts: https://shopify.dev/docs/storefronts/themes/best-practices/performance/self-host-web-fonts
19. Unbounded licence: https://github.com/googlefonts/unbounded/blob/main/OFL.txt
20. Archivo licence: https://github.com/Omnibus-Type/Archivo/blob/main/OFL.txt
21. Using OFL fonts: https://openfontlicense.org/how-to-use-ofl-fonts/
22. OFL FAQ: https://scripts.sil.org/cms/scripts/render_download.php?format=file&media_id=OFL-FAQ_plaintext&filename=OFL-FAQ.txt
23. Shopify Payments requirements, Canada: https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/canada/requirements
24. Payouts, Canada: https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/canada/payouts
25. Payout currencies: https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/supported-payout-currencies and https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/payouts-in-multiple-currencies
26. Currency conversion fees: https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/currency-conversion-calculation
27. Payment methods, Canada: https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/canada/payment-methods
28. Local currencies in Markets: https://help.shopify.com/en/manual/markets/customizations/local-currencies
29. Setting up local currencies: https://help.shopify.com/en/manual/markets/pricing/set-up-local-currencies
30. Price rounding: https://help.shopify.com/en/manual/international/pricing/rounding
31. Price adjustments: https://help.shopify.com/en/manual/markets/pricing/price-adjustments
32. Charging duties and import taxes: https://help.shopify.com/en/manual/international/duties-and-import-taxes/charging-duties
33. Duties on all plans: https://changelog.shopify.com/posts/shopify-duty-calculator-now-available-for-all-shopify-plans
34. Managed Markets, Canada: https://help.shopify.com/en/manual/international/managed-markets/managed-markets-canada
35. US de minimis suspension, February 2026: https://www.whitehouse.gov/presidential-actions/2026/02/continuing-the-suspension-of-duty-free-de-minimis-treatment-for-all-countries/
36. US CBP e-commerce FAQ: https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs
37. CRA, GST/HST registrants (RC4022): https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html
38. CRA, rates and place of supply: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html
39. CRA, imports and exports: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-imports-exports.html
40. Canadian tax reference: https://help.shopify.com/en/manual/taxes/canada/canada-tax-reference
41. Canadian tax setup: https://help.shopify.com/en/manual/taxes/canada/canada-tax-setup
42. Shopify Tax in Canada: https://help.shopify.com/en/manual/taxes/shopify-tax/shopify-tax-canada
43. Shopify Tax pricing: https://help.shopify.com/en/manual/taxes/shopify-tax/pricing
44. US tax reference: https://help.shopify.com/en/manual/taxes/us/us-tax-reference
45. US tax liability: https://help.shopify.com/en/manual/taxes/us/us-tax-liability
46. Store policies: https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos
47. Return rules: https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/return-rules
48. Shopify Messaging pricing: https://www.shopify.com/email-marketing
49. Shopify Email FAQ: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-email/faq
50. Shopify Forms: https://apps.shopify.com/shopify-forms
51. Creating a form: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/forms-app/create
52. CRTC, anti-spam FAQ: https://crtc.gc.ca/eng/com500/faq500.htm
53. CRTC, what a consent request must include: https://crtc.gc.ca/eng/internet/wifi.htm
54. Password page: https://help.shopify.com/en/manual/online-store/themes/password-page
55. Buying a domain: https://help.shopify.com/en/manual/domains/add-a-domain/buying-domains
56. Shopify domain search, 28 October 2026 (opens the purchase page in this store's admin): https://admin.shopify.com/store/k6gvbe-02/settings/domains/confirm?host=offshft.com and https://admin.shopify.com/store/k6gvbe-02/settings/domains/confirm?host=offshifthats.com
57. Shopify domains: https://www.shopify.com/domains
58. Connecting a domain by hand: https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-domain-manual
59. Secure connections and redirects: https://help.shopify.com/en/manual/domains/managing-domains/secure-connections
60. Offers and credits: https://help.shopify.com/en/manual/your-account/manage-billing/offers
