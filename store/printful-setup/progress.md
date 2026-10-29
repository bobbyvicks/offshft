# Printful setup progress

29 October 2026. The owner requested connecting Printful and completing the four new listings so customers can order, including verification of the hoodie's back DTG print plus left-chest embroidery.

## Connection

- Opened the official Printful app listing and reviewed the Shopify permission request.
- The owner explicitly approved the free Printful connection, the listed customer/store data permissions and Printful Terms of Service at the final installation step.
- Clicked Install. Shopify now displays Printful in the Apps navigation and opens `https://admin.shopify.com/store/offshft/apps/printful`.
- The embedded app currently shows **Welcome to Printful**, with **Create account** and **I already have a Printful account – sign in**. Installation is confirmed; a Printful account connection is not yet confirmed.
- The owner chose **Connect my existing Printful account**. Clicked the existing-account sign-in button. A separate **Authorize access | Printful** window opened with Email/Password and Google/Apple sign-in options. The existing account has no active session; asked the owner to complete authentication in that window. No new account was created.
- No paid plan, digitization purchase, sample order, billing method, order-confirmation setting, inventory quantity or Shopify product mapping has been changed.

## Prepared work

- `official-workflow.md` records current official instructions for importing and syncing the existing Shopify products without duplicate listings, stock sync, fulfilment routing, billing and shipping.
- `production-artwork-manifest.json` maps twelve exact-art transparent PNG uploads to sixteen colourways and twenty decorated placements, including the separate hoodie front logos. These preserve the approved SVG geometry and colours at the intended physical sizes.
- Production-file validation is separate from Printful digitization acceptance. No production file has been uploaded to Printful yet.
- Root independently ran `verify-production-uploads.py`: PASS for twelve transparent sRGB PNGs at 600 DPI, sixteen colourways, twenty placement mappings, unchanged source artwork and byte-identical SVG copies. Root also visually inspected the hoodie front logo and back-print PNGs. No thread substitution or stitch files were created.

## Continue after sign-in

1. Verify the owner's existing Printful account sign-in and complete the connection. Observe any additional terms, data grants or charges before their final action.
2. Inspect the connected store, billing currency/method, selling region, stock sync, order-confirmation behaviour and shipping profile. Do not treat installed as synced.
3. Confirm the exact CC1467 back DTG + left-chest embroidery combination in one saved Design Maker configuration, including regular Back placement for size S. Large Back starts at M. The crewneck requires Large Front embroidery.
4. Sync the four existing product IDs and all seventy-six existing variant IDs from the launch audit. Preserve the approved Shopify images, options, prices and the original seventeen products.
5. Review actual digitization/production/shipping costs and thread mapping, then verify supplier-managed availability and fulfilment routing before enabling orders. The storefront password gate and Shopify subscription/payment readiness remain separate checks.

Current browser: Brave window 67790, same active Shopify tab; authentication popup is Brave window 1444706. Use fresh CUA state and avoid switching browser tabs. A Shopify ChatGPT plugin was suggested but is not confirmed installed or connected; it is optional to the current browser workflow.
