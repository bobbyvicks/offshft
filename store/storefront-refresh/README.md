# OFF SHFT storefront refresh

Completed on 29 October 2026 to replace the default storefront presentation and rough product drawings with the established OFF SHFT identity. Theme **OFF SHFT** (`195077472578`) is published; the previous Horizon theme (`195010888002`) remains as a draft. Shopify still marks the storefront **Private**, with password protection enabled and "Select a plan to launch store" displayed. Publishing the theme has not opened the store to the public.

## Images

`media/` contains ten new studio product mockups: Logo, Clock and Punched Out versions of the beanie, bucket hat and quarter-zip, plus the Punched Out golf shirt with its sleeve clock. The applied and verified hero pair shows three products: folded Pepper Clock sweatpants, an ivory hoodie with its sleeves tucked in, and an Evergreen For a Reason. hat. `offshft-home-hero-evergreen.png` is the desktop image at 1774 × 887 (2:1); `offshft-home-hero-evergreen-mobile.png` is the mobile image at 1024 × 1536 (2:3). The previous three-product Charcoal hero was saved to the published theme as native code-editor Version 4 and seen on desktop and mobile. The Evergreen revision was saved to active theme `195077472578` as native code-editor Version 5, with "File Saved" and "No Problems" shown, and was visually verified on desktop and mobile. Proof is saved in `verification/homepage-evergreen-desktop.jpg` and `verification/homepage-evergreen-mobile.jpg`. The prior Charcoal and original two-product hero files are retained for recovery.

The studio mockups and hero images were made with the built-in image-generation tool. `headwear-generation-manifest.json`, `apparel-generation-manifest.json` and `hero-generation-manifest.json` record references, prompts, selected outputs and limitations. `hero-evergreen-manifest.json` records the prompts and outputs for the current Ivory, Pepper and Evergreen three-product hero. `product-image-replacements.json` maps the ten product replacements to Shopify records. Source drawings are preserved under `references/`.

These are mockups, not photographs of manufactured samples. The ten newer listings still require final supplier and colour decisions. The golf shirt image represents pique construction and must not be presented as exact Performance-style photography.

## Theme and copy

The five JSON files in `theme/` extend the existing OFF SHFT theme with a realistic homepage hero, responsive desktop/mobile layouts, a product grid, an apparel-wide brand message, and working Shop, About and Contact links. The announcement and password-page copy use the same voice. The product template replaces hat-only wording with apparel-wide guidance and preserves links to the existing visible Size & fit and Shipping & returns pages; its four text-only changes are documented in `product-template-diff.json`. Existing Bone, Ink and Slate colours, logo and typography are retained. `theme-refinements.md` documents the settings and source checks; `refine-theme.py` reproduces the homepage, header, footer and password changes.

`about.html` tells the earned-time-off story across hats, hoodies and sweats. Its page body and SEO were saved in Shopify, along with the homepage SEO and store display name **OFF SHFT**. The copy makes no shipping, production-time or material claims. Native Pages admin confirmed that Size & fit, FAQ, and Shipping & returns are Visible; the product template retains the relevant help-page links.

## Gallery cleanup and recovery

Completed on 29 October 2026: removed 31 concept drawings and three obsolete Slate sweatpant images from the original 17 galleries, retaining 57 finished images. Replaced all 11 drawings across the ten newer listings with ten finished studio mockups. The original artwork remains in Shopify's Files library for recovery. Every replacement has mockup alt text and the visible sentence “Product images are mockups. Appearance may vary by style.” Original description HTML was otherwise preserved exactly. `gallery-cleanup-log.json` and `new-product-media-log.json` record the saved edits.

`final-catalogue-verification.json` independently compares the saved public snapshots: 32 published products, 380 declared variants and 86 final images. All 45 removed image filenames are absent, each of the ten replacements appears exactly once, and the other 22 galleries are unchanged. Product IDs, options, price ranges, availability and all 32 supplied variant records are unchanged. The snapshots expose only one variant record per product, so they do not verify all 380 individual variant IDs. The user requested that all ten newer listings remain visible.

## Verification and remaining setup

- Desktop and mobile theme checks passed for hero image loading, clear text placement, navigation, the mobile footer and the empty-cart destination. All 32 products remain visible, with 86 images and no rough drawings in their galleries. See `theme-deployment-log.json` and `final-catalogue-verification.json` for the saved evidence and the variant-record limitation described above.
- Finish the supplier selections, production artwork checks and Printful configuration for the wider catalogue. Mockup replacement does not confirm fulfilment readiness.
- Check the current Printful billing state separately. Shopify still requires a plan before launch, and the store remains password gated. This work did not purchase a plan, remove password protection, place a production order or establish that every product can be ordered.
