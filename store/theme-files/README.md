# Theme files applied to the store

What's applied to the unpublished theme **OFF SHFT (draft)** (a copy of Horizon 4.3.0) in the Shopify store, and how.

- `build.cjs` turns store/theme.md into theme files: `node store/theme-files/build.cjs <Horizon 4.3.0 source>` writes `out/`.
- `installed/` holds the page files exactly as this store installed them (checksums matched Shopify's). `build.cjs` edits these copies, so nothing else in them changes.
- `base-settings.cjs` is the installed `config/settings_data.json` "current" values.
- The files in `out/` were uploaded to the draft theme on 29 October 2026, and every value was read back from Shopify and matched.

Differences from theme.md, made to fit this store:

- Image settings use the names the files have in Content -> Files (`offshft-logo-ink.png` and so on).
- The palette has two extra colours here: color1 is Slate, color2 is Oat. Bone fabric (#E4DDCB) is written as a plain hex.
- The heading letter-spacing (0.12 em) and the muted-text opacity (70%) sit in an empty Custom Liquid section at the end
  of the header group (and on the password page): `<style>html:root{...}</style>`. Shopify's docs say apps shouldn't
  write the editor's Custom CSS box, and a code edit would stop Horizon's automatic updates; section groups and JSON
  templates are merchant files, so updates keep working. Don't delete the "Custom liquid" section in the header.
- Setting values use Horizon's stored values, not the editor labels (for example `button-custom`, `icon`, `text`).
- The footer was light as installed; it is set to Slate here, and the sign-up form sits inside the sign-up group so the
  footer has three columns.
- Product-page rows link to the policy pages instead of stating return terms the owner hasn't approved.
- Not yet added: the collection tiles and the featured hat on the home page (they need published hats), and
  `empty_state_collection` (needs the All hats collection).
