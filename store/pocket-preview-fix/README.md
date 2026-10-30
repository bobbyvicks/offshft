# Pocket style preview switching

The Clock T-Shirt reproduced the reported bug in the active OFF SHFT theme (195077472578): Heavyweight / S / Ivory showed the normal tee. Clicking Pocket kept Ivory selected, resulting in a nonexistent Pocket / S / Ivory combination, an Unavailable purchase button and the old image. Choosing White then showed the correct pocket tee with sleeve embroidery and restored Add to cart.

Both the Logo T-Shirt (15476778631490) and Clock T-Shirt (15476778729794) have this split: Heavyweight uses Ivory or Blue Spruce; Pocket uses White. Existing Pocket image associations are present, so replacing or reassigning media would not address the cause.

The saved correction is limited to these two products: a Style change selects a compatible colour before Horizon handles the original change event. It preserves the shopper's size and leaves unsupported size combinations unavailable. Returning to Heavyweight restores the previous compatible colour. It does not change products, prices, variant IDs, inventory, media associations or fulfilment.

`header-custom-liquid-before.liquid` is the exact existing header customization captured from the live theme editor before this fix. `header-custom-liquid-proposed.liquid` is the complete deployed value; all original CSS is preserved. The native editor readback matches after accessibility whitespace normalization, Save became disabled, and a fresh reload ran the correction successfully.

Eleven local tests pass with `node --test store/pocket-preview-fix/pocket-preview.test.cjs`. Root also verified Clock tee switching on desktop from Ivory and Blue Spruce, retained size M, restoration of Blue Spruce, and unavailable Pocket/3XL without a size change. The Logo tee switched correctly on mobile. Screenshots and precise scope are in `verification/` and `deployment-and-qa.json`.

The script uses Horizon 4.3.0's public `updateSelectedOption` method before the original bubbling change handler. It corrects both the checked colour and the native URL variant metadata; Horizon retains responsibility for image, price, stock and purchase-button updates. Official pinned references and the earlier variant-image evidence are in `research-and-test-evidence.json`. Main-page radio pickers are covered; quick-add and featured-product widgets are intentionally excluded.

`store/storefront-refresh/theme/sections/header-group.json` now contains the deployed customization. The generator `refine-theme.py` appends `pocket-preview-snippet.liquid` so rebuilding the prepared theme does not discard the correction. To roll back the live change, restore the backed-up Liquid field through the theme editor and save.
