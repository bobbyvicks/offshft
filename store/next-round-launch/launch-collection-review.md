# Collection discovery review

Read-only local review, 29 October 2026. No collection, product, theme, menu or publication changes were made.

**The saved export does not establish whether the current category collections are automated or whether Home page is manual.** It contains collection memberships and IDs, but no collection handles, rule sets, collection types, publication records or sort order. Saved setup files supply historical rule intentions; they are not a fresh collection audit.

## Exported collection evidence

From [shopify-before-export.json](shopify-before-export.json), covering the original 17 products / 253 variants:

| Collection title | Exact collection ID | Recorded membership |
|---|---|---|
| Home page | `gid://shopify/Collection/527434613058` | OFF SHFT Logo Hat |
| All hats | `gid://shopify/Collection/527680078146` | OFF SHFT Logo Hat; The Clock Hat; Punched Out. Hat |
| Text hats | `gid://shopify/Collection/527680241986` | Punched Out. Hat |

The other 14 apparel products have empty collection arrays. The export has no complete collection list, so an empty membership does not prove that a category collection does not exist. It also omits productType and tags.

[Saved collection IDs](../apply/ids.json) identify the handles as `frontpage`, `all-hats` and `text-hats`. [Saved setup content](../apply/content.json) specifies automated rules:

- **All hats:** product type equals `Hat`; all conditions (one condition).
- **Text hats:** product tag equals `text-hat`; all conditions (one condition).
- The four historical hobby collections use their matching fishing/golf/cottage/cornhole tags. None is relevant to these four general brand designs.

No Home page rule or manual-type assertion appears in those files. Older [apparel copy](../apparel-copy.md) proposes product-type collections called Lounge, Hoodies and crews, Sweats and Everything, but records no created IDs. Its proposed Everything rule excludes T-Shirt and Jacket, so it must not be assumed to cover the new tee. No upcoming/coming-soon collection is evidenced locally.

## Theme evidence and limits

The [theme README](../theme-files/README.md) distinguishes original installed snapshots from generated files uploaded to a draft theme. These do not establish the current live theme configuration:

- [Installed homepage snapshot](../theme-files/installed/templates/index.json): hero links to `shopify://collections/all`; product-list section uses collection `all`, with a maximum of eight products. Inclusion in that collection would not guarantee a card among the first eight.
- [Generated draft homepage](../theme-files/out/templates/index.json): hero links to `/collections/all-hats`, followed by the About section. It contains no product-list section.
- Neither homepage references the `frontpage` collection. Adding the four products to Home page therefore has no demonstrated homepage benefit.
- [Generated collection template](../theme-files/out/templates/collection.json) disables filtering and sorting. This JSON does not contain the underlying Liquid product-selection logic, so it cannot prove that the current storefront displays zero-stock products.
- Both saved headers reference `main-menu`; the current menu items are not exported here.

## Minimal placement recommendation

1. Complete the existing read-only [publication readiness prompt](publication-readiness-sidekick-prompt.txt): obtain current collection IDs, manual/automated types, actual rules, collection publication, current menu destinations and any stock filter. Do not change the original 17 products, collection rules or theme.
2. For **Ours to Spend. Trucker Hat**, retain product type `Hat`. If the saved All hats rule is still current, allow automatic inclusion. Text hats is also relevant; only if its actual rule is `tag=text-hat`, add that tag to this new cap if desired. Its current launch tags do not include it. This would affect only the new product.
3. For the **tee, hoodie and crewneck**, reuse relevant existing category collections only when discovery confirms them. For automated collections, retain the existing launch product types `T-Shirt`, `Hoodie` and `Crewneck`; for manual collections, add only the new matching product. Do not create categories or broaden rules to fill an evidence gap.
4. The smallest shared destination to check is the existing all-products catalogue route, `/collections/all`, after activation on Online Store. Confirm all four zero-stock products appear and that an existing navigation link reaches that route. Do not assume either saved theme snapshot is live. Direct product URLs also need checking, but alone do not establish browse discovery.
5. Leave Home page membership unchanged unless a fresh read proves it is manual and actually feeds a visible section. Do not create an Upcoming collection for this rollout. If current navigation exposes only hats, report that specific discovery gap; it cannot be solved for all four products from the local evidence without an additional placement decision.

## Coming-soon release note draft

Use after the four pages are visibly published and verified; this text has not been posted:

> Coming soon: four new OFF SHFT designs. Time Well Earned. T-Shirt, The Rest Is Ours. Hoodie, Ours to Spend. Trucker Hat and the 5:00 Crewneck. Four colours each. Preview the designs now; ordering is not open yet. Product images are mockups.

Keep all 76 variants tracked with zero available inventory and overselling denied. The note makes no launch-date, delivery, supplier-sync or physical-sample claim.
