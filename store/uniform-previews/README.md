# OFF SHFT uniform product previews

All 32 existing product leads are covered by one preview standard: square framing, warm Bone studio backgrounds, centered full silhouettes, soft contact shadows and consistent breathing room. Twenty-six lead images were regenerated with the built-in image tool; six previously normalized beanie and bucket-hat leads are retained. The other two For a Reason colours were also normalized, giving 28 replacement files.

All 28 replacements are saved in Shopify and verified by filename, preserved file ID and changed file size. `deployment-progress.json` is the completed application log; `media-deployment-plan.json` is the immutable preparation plan and intentionally keeps its original pending statuses. `deployment-verification.json` reconciles the completed uploads with the plan.

## Storefront presentation

The active OFF SHFT theme is 195077472578. The Collection Product image ratio was changed from Auto to Square. Theme-wide Custom CSS in `uniform-previews.css` gives card galleries a square ratio, Bone background, centered contain fit and 4% image padding. This prevents wide photos from being cropped. Second-image hover is off so the standardized main image stays visible; detailed and colour photos remain accessible in the product gallery.

The rules are scoped to `.card-gallery`. They do not alter the homepage hero or main product-page gallery. No prices, product options, inventory, fulfilment or publication settings are changed by this work. All existing file IDs, filenames and product associations are preserved through Shopify Files Replace.

## Assets and recovery

- `catalogue-inventory.json`: original 32-product, 86-image inventory with exact filename, product and local-source joins. It includes the six prior Bone replacements.
- `media-deployment-plan.json`: 28 exact in-place replacements, their sources, hashes, dimensions and product mappings; six retained leads; exact coverage of all 32 products.
- `media/`: 28 generated 1254 x 1254 opaque RGB PNGs.
- The four generation manifests contain full prompts, built-in tool provenance, source/output hashes and visual QA.
- Original source PNGs remain intact at the paths in the plan, allowing in-place restoration.
- `theme-changes.json`: exact saved theme settings and their readback evidence.

The background edits preserve source artwork, garment colour, construction, full silhouette and camera view, including the back view of The Rest Is Ours hoodie. They are visual mockups, not manufactured sample photography, and do not validate inherited supplier or production details. Generative editing does not guarantee pixel identity.

## Verification

`verify-artifacts.py` validates all 28 source/output hashes, unique mappings, 26 lead replacements plus six retained leads, square RGB images, JSON and scoped CSS. It uses Pillow only to read images. Run with the bundled Python runtime that includes Pillow.

All 28 outputs were individually inspected by their generating agent and by root. Local visual QA passed and is recorded in `local-qa.json`. Final native Shopify theme-preview checks cover all 32 desktop catalogue products, representative mobile rows including the final blue hoodie and green tee, and the homepage featured collection on desktop and mobile. See `storefront-qa.json` and the saved screenshots in `verification/`. The store remains password protected.

The integrity command `python store/uniform-previews/verify-artifacts.py --require-deployed` also verifies the 28 completed deployment entries and their size readbacks. This is an artifact and visual-preview check, not a new full variant or fulfilment audit.

## Selector provenance

Official Shopify Horizon at pinned commit `dfad90d87be2408de52636315069fc998da28c9e`: [card gallery](https://raw.githubusercontent.com/Shopify/horizon/dfad90d87be2408de52636315069fc998da28c9e/snippets/card-gallery.liquid), [media styles](https://raw.githubusercontent.com/Shopify/horizon/dfad90d87be2408de52636315069fc998da28c9e/snippets/product-media-container-styles.liquid), and [slideshow slide](https://raw.githubusercontent.com/Shopify/horizon/dfad90d87be2408de52636315069fc998da28c9e/snippets/slideshow-slide.liquid). The gallery sets its ratio inline, so the single important variable override is needed; the scoped image selector overrides the default cover fit.
