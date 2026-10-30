# OFF SHFT storefront refinements

Applied on 29 October 2026 through Shopify's native code editor. Theme **OFF SHFT** (`195077472578`) is now published, and the previous Horizon theme (`195010888002`) remains as a draft. The store display name is **OFF SHFT**; the About body, About SEO and homepage SEO are saved. Publication evidence is recorded in `theme-deployment-log.json`.

Shopify still shows the storefront as **Private**, with password protection enabled and "Select a plan to launch store" displayed. The published theme does not by itself make the store publicly accessible or establish checkout and fulfilment readiness.

## Applied files

All five files below are one-line, minified JSON using native Horizon sections and blocks:

- `theme/templates/index.json`
- `theme/sections/footer-group.json`
- `theme/templates/password.json`
- `theme/sections/header-group.json`
- `theme/templates/product.json`

`refine-theme.py` records the homepage, footer, header and password changes and can reproduce them from the prepared homepage/footer and original brand header/password templates. The four text-only product template changes are recorded in `product-template-diff.json`. The script does not change `settings_data.json` or theme Liquid/assets.

## Hero

The applied and verified composition shows folded Pepper Clock sweatpants, an ivory hoodie with its sleeves tucked in, and an Evergreen For a Reason. hat. The preceding three-product Charcoal composition was saved to the published theme as native code-editor Version 4 and seen on desktop and mobile. The Evergreen revision was saved to active theme `195077472578` as native code-editor Version 5, with "File Saved" and "No Problems" shown, and was visually verified on desktop and mobile. The local template and generator point to the verified files. `hero-evergreen-manifest.json` records the prompts and outputs; screenshots are saved in `verification/homepage-evergreen-desktop.jpg` and `verification/homepage-evergreen-mobile.jpg`. The prior Charcoal and original two-product hero files are retained for recovery.

- Desktop: `shopify://shop_images/offshft-home-hero-evergreen.png` (1774 x 887, 2:1).
- Mobile: `shopify://shop_images/offshft-home-hero-evergreen-mobile.png` (1024 x 1536, 2:3).
- Native settings: `custom_mobile_media: true`, `image_1_mobile`, `media_type_1_mobile: image`; no stacked media, overlay, reflection or animation.
- Ink text on the image's Bone negative space. Ink button with Bone text.
- The existing brand Custom Liquid section in the header contains the small additional CSS. It is scoped to `.hero[id$="__offshft_hero"]`; it does not alter other hero sections or product pages.
- Desktop minimum height is 50vw, matching the source image ratio. Heading/body blocks are limited to the lesser of 40vw or 28rem. Heading scales from 24 to 48px; content is left aligned and vertically centred.
- Below 750px, minimum height is 150vw, matching the 2:3 mobile image. Content aligns to the top with 24px padding and 14px gaps. Heading scales from 24 to 32px at 1.15 line height. The mobile image reserves its upper half for this text and lower half for the products.
- These aspect-ratio heights avoid the native medium-height cropping. No viewport-height minimum is imposed. Native natural content sizing can still grow if needed.
- Keep `header-group.json` together with `index.json`: the header's Custom Liquid carries this responsive styling.

## Footer, announcement and password page

- Replaced Search-only footer menu with a native, editable group of text blocks: Explore, Shop the collection, About OFF SHFT and Contact. All links use observed existing routes.
- Retained logo, newsletter and utility groups, including their existing colour treatment.
- Announcement now reads: "You put in the hours. This time is yours." It links to `/collections/all` instead of the old FAQ destination. No shipping promise remains in that announcement.
- Password page keeps its native "Opening soon" heading and logo; copy now covers hats, hoodies and sweats. Password access controls and store password are untouched.
- The current Shopify config received one additional narrow edit: `current.empty_cart_button_link` now points to `/collections/all`. The historical local config was not uploaded wholesale.
- Product template wording now covers all apparel styles and retains the existing Size & fit and Shipping & returns links. Native Pages admin confirmed those pages and FAQ are Visible. Product details remain dynamic; variant, cart and other UI settings are unchanged.

## Source and validation

Primary source: Shopify Horizon `main` at commit `dfad90d87be2408de52636315069fc998da28c9e`; its `config/settings_schema.json` identifies version 4.3.0. Source copies used for inspection are under the ignored `store/printful-setup/private/horizon-source-refinements/` folder.

- [Hero source](https://github.com/Shopify/horizon/blob/dfad90d87be2408de52636315069fc998da28c9e/sections/hero.liquid)
- [Footer source](https://github.com/Shopify/horizon/blob/dfad90d87be2408de52636315069fc998da28c9e/sections/footer.liquid)
- [Text block](https://github.com/Shopify/horizon/blob/dfad90d87be2408de52636315069fc998da28c9e/blocks/text.liquid)
- [Group block](https://github.com/Shopify/horizon/blob/dfad90d87be2408de52636315069fc998da28c9e/blocks/group.liquid)

Validated all five JSON documents parse and are one line. Changed hero settings, new footer group/text settings, and password section settings conform to the official schema's IDs, enumerations and numeric ranges. The product template changes are exactly four native rich-text values; all other values and ordering are preserved. Shopify's editor saved the applied files without problems. Browser checks passed for desktop and mobile hero image loading, clear text placement, the mobile footer and the empty-cart destination. The collection link opens `/collections/all`, and the new golf-shirt mockup renders correctly on the product page.

Final catalogue verification records 32 visible products, 380 declared variants and 86 images, with no rough drawings remaining in customer-facing galleries. The snapshots supplied only one individual variant record per product: the 32 supplied records are unchanged, but the check does not independently verify every one of the 380 declared variant IDs. See `final-catalogue-verification.json` and `theme-deployment-log.json` for the catalogue and publication evidence.
