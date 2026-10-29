# Theme setup: Horizon

The exact theme setup for OFF SHFT. Follow it top to bottom and you won't need to make a design call.

- **Written for:** Horizon 4.3.0. Every setting, section and block name below was read from Horizon's own code (github.com/Shopify/horizon, cloned 29 October 2026), then checked against this store's installed files (store/theme-files/installed/). Where the two differ, this file follows the store.
- **Names:** setting names in **bold** are the labels the theme editor shows. Names in `code` are the same settings in the theme files, for applying them by API.
- **Anything not listed** stays as Horizon ships it.
- **Status:** nothing here is applied yet. The orchestrator applies it to an unpublished copy of the theme. The owner previews it and publishes it (AGENTS.md).

## Before you start

### The plan

1. Online Store → Themes. On the live theme (Horizon), open **⋯** → **Duplicate**. Rename the copy **OFF SHFT**.
2. Check the copy's version. [CONFIRM: the copy is Horizon 4.0.0 or later; store/theme-files/base-settings.cjs records 4.3.0] A quick tell: version 4 has **Theme settings → Color palette**. Older versions use colour schemes instead, and this file doesn't fit them. If it's older, add the latest Horizon from the Theme Store (free) and use that instead of the copy.
3. Apply everything below to the copy only, never to the live theme. Writing theme files through Shopify's API needs the write_themes permission, and apps also need an exemption from Shopify (shopify.dev, themeFilesUpsert). [CONFIRM: the orchestrator's store connection can write files on the copy] The theme editor works on the copy too: open it with **Customize**. One step can only be done there, by a person: the Custom CSS (section 3).
4. The owner previews the copy (**⋯** → **Preview**) on a phone and a computer, runs the checks in section 10, and publishes it. Publishing the theme doesn't open the store. The password page stays until the owner launches (store/research/shopify-setup.md, section 9).

### What must exist first

- **Images:** upload these from store/assets/ to Content → Files: logo-ink.png, logo-bone.png, favicon.png, social-share.png. The theme doesn't use logo.svg. In this store the first three are already there as offshft-logo-ink.png, offshft-logo-bone.png and offshft-favicon.png (store/theme-files/build.cjs), and the appendix uses those names. [CONFIRM: the names Content → Files shows, including social-share.png's]
- **Pages** the menus link to: About, FAQ, Size & fit, Shipping & returns (store/pages/), plus the Contact page the store already has. [CONFIRM: the existing Contact page's handle is contact]
- **Collections** from store/collections.md: all-hats, fishing, golf, cottage, cornhole, text-hats.
- **Store name:** OFF SHFT (owner's call, Settings → General). The footer copyright prints it.

### Sample text

New Horizon sections come with sample words, and some make claims OFF SHFT can't back. Every step below replaces or deletes them. If one of these shows up in preview, delete it:

- "Get exclusive deals and early access to new products."
- "Made with care and unconditionally loved by our customers."
- "We make things that work better and last longer."
- "Our products are manufactured both locally and globally."
- "Free 30-day returns", "Free shipping over $50"
- "★★★★★ 368 Reviews"

## 1. Theme: keep Horizon

- It's already the live theme. It's free, and it's Shopify's current default theme. 4.3.0 is the latest version in Shopify's public code.
- It has everything OFF SHFT needs without code: both brand fonts in its font pickers, a colour palette, uppercase heading presets, square buttons, an Accordion block for the product page, colour swatches and a Custom CSS box.
- The other free Horizon-family themes (Pitch, Tinker and others) are built from the same blocks. A switch would only change the starting look (store/research/shopify-setup.md, section 2).
- No reason to switch.

## 2. Colours

### How Horizon 4.3.0 does colour

Horizon 4.x has no colour schemes. Colour comes from three places:

1. **Theme settings → Color palette:** Background, Foreground and extra colours (2 to 20 colours in all). This store's copy has two extra colours. Many colour settings point at a palette colour, so changing the palette changes them too.
2. **Theme settings** groups: Page, Typography, Buttons, Input fields, Variant pickers, Drawers, Popovers and modals, Badges and Swatches.
3. **Each section's own Background color.** When text fails 4.5:1 on that background, Horizon switches it to the palette's lightest colour (Bone). **It doesn't in the Hero section, or in any section with a background image or video.** That's why the top band's text colour is set by hand in section 6.

Horizon has no separate link colour. A link takes the text colour, is underlined in body text, and drops to 70% on hover.

### Palette (Theme settings → Color palette, `color_palette`)

| Swatch | Starts as in this store | Change to | Name | Used for |
|---|---|---|---|---|
| Background (`background`) | #FFFFFF | **#ECE5D3** | Bone | Page, button text on Ink, drawers, pop-ups |
| Foreground (`foreground`) | #000000 | **#1F2733** | Ink | Text, primary buttons, input and variant borders |
| Extra colour (`color1`) | #333333 | **#27303D** | Slate | Dark bands: announcement bar, top band, footer |
| Extra colour (`color2`) | #DFDFDF | **#C7B48E** | Oat | Thin lines and dividers only. Drawer and pop-up borders and the product page divider already point at it. |

- Find each extra colour by the hex it starts as. Horizon's public code ships a third extra colour (#EEF1EA); this store's copy doesn't have it, and none is added.
- The Bone fabric colour, #E4DDCB, stays out of the palette. Type it as a hex in the two places that use it: the fabric band on the home page (section 6) and the sold-out badge (below).
- Leave **Theme settings → Page → Background** and **Typography → Text** pointing at Background and Foreground, as they ship.

Rust #B4552D and Sun #D29B3C stay out of the palette. They appear only inside the logo files: Rust hands on the light logo, Sun hands on the dark one. Rust can't carry small text on Bone (3.91:1). Sun could on Slate (5.39:1), but the quiet look keeps it in the logo.

### Why the page is #ECE5D3, not the fabric's #E4DDCB

- #ECE5D3 is already a brand colour, the Bone thread. Nothing new is added.
- It's one step lighter than the Bone fabric. That frees the fabric colour for the one band where it has to match exactly: section 2 of the home page shows the clock symbol from favicon.png, which sits on an #E4DDCB square. On an #E4DDCB band the square disappears. The page gets a quiet two-tone rhythm from brand colours only.
- Every ratio goes up a little: body text 11.97:1 instead of 11.10:1, grey text 5.04:1 instead of 4.83:1.
- If the partner's mockup tool lets you choose the background colour, choose #ECE5D3 so product images sit flush with the page. [CONFIRM: the mockup tool has that option]

### The three looks (Horizon's stand-in for colour schemes)

| | Light: most of the site | Dark: announcement bar, top band, footer | Fabric band: home section 2 only |
|---|---|---|---|
| Background | Bone #ECE5D3 (Page → **Background**) | Slate #27303D (each section's **Background color**) | Bone fabric #E4DDCB (that section's **Background color**) |
| Text | Ink #1F2733 (Typography → **Text**) | Bone #ECE5D3. Automatic, but the top band's Text blocks also get **Text color** #ECE5D3, so they stay Bone once it has a photo | Ink #1F2733 (automatic) |
| Buttons | Primary: Ink #1F2733. Secondary: Bone #ECE5D3 with a 1 px Ink border | Top band button: Slate #27303D with a 1 px Bone border. Footer sign-up button: Bone #ECE5D3 | Secondary: Bone #ECE5D3 with a 1 px Ink border |
| Button text | Primary: Bone #ECE5D3. Secondary: Ink #1F2733 | Top band: Bone #ECE5D3. Sign-up: Ink #1F2733 | Ink #1F2733 |
| Links | Ink, underlined in body text, 70% on hover | Bone, underlined in body text, 70% on hover | Ink, 70% on hover |
| Borders | Inputs, variant buttons: Ink #1F2733. Dividers and lines: Oat #C7B48E | Footer divider: #4E545B (Bone at 20% on Slate, as a solid colour) | None |
| Accent | Deep rust #8E4426 for one label (below). Rust #B4552D in the header logo only | Sun #D29B3C in the footer logo only | None |

### Accent rules

- **Rust #B4552D:** the logo's hands only. On Bone it's 3.91:1, under the 4.5:1 small text needs. The site has one small accent line, "Quitting time, on a hat." on the home page. It uses deep rust #8E4426 (the Rust fabric colour): 5.56:1.
- **Sun #D29B3C:** dark backgrounds only. On Slate it passes (5.39:1), but on the site it stays inside the footer logo. Never on Bone (1.97:1).
- **Oat #C7B48E:** lines only (1.62:1 on Bone). Never text, never input borders.

### Colour settings in Theme settings

| Group | Setting | Value | ID |
|---|---|---|---|
| Buttons → Primary button | **Background** / **Text** / **Borders** | Leave as they ship: Foreground (Ink) / Background (Bone) / Foreground. The border is 0 px, so its colour doesn't show. | `palette_primary_button_*` |
| | **Border thickness** | 0 px (as it ships) | `primary_button_border_width` |
| | **Corner radius** | 0 px | `button_border_radius_primary` |
| | **Font** / **Text case** | Body / Default (as they ship) | `type_font_button_primary`, `button_text_case_primary` |
| Buttons → Secondary button | **Background** | Background (Bone). It ships transparent in this store, which would turn it the fabric colour on the fabric band and grey on hover. | `palette_secondary_button_background` |
| | **Text** / **Borders** | Leave as they ship: Foreground (Ink) / Foreground (Ink) | `palette_secondary_button_text`, `palette_secondary_button_border` |
| | **Border thickness** | 1 px (as it ships) | `secondary_button_border_width` |
| | **Corner radius** | 0 px | `button_border_radius_secondary` |
| | **Font** / **Text case** | Body / Default (as they ship) | `type_font_button_secondary`, `button_text_case_secondary` |
| Buttons → Pills | **Corner radius** | 0 px | `pills_border_radius` |
| Input fields | **Background** | Leave: Background (Bone) | `palette_input_background` |
| | **Text** | Foreground (Ink #1F2733). It ships pointing at `color1`, which becomes Slate. | `palette_input_text` |
| | **Borders** | Foreground (Ink #1F2733). It ships pointing at the palette's #DFDFDF slot. | `palette_input_border` |
| | **Border thickness** / **Corner radius** | 1 px / 0 px | `input_border_width`, `inputs_border_radius` |
| Variant pickers → Variant settings | **Background** / **Text** | Leave: Background / Foreground | `palette_variant_background`, `palette_variant_text` |
| | **Borders** | Foreground (Ink #1F2733) | `palette_variant_border` |
| Variant pickers → Selected variants | **Background** / **Text** / **Borders** | Leave: Foreground / Background / Foreground | `palette_selected_variant_*` |
| Variant pickers → Buttons | **Border thickness** / **Corner radius** / **Width** | 1 px / 0 px / Fill | `variant_button_border_width`, `variant_button_radius`, `variant_button_width` |
| Drawers | **Background color** / **Text color** | Leave: Background / Foreground | `drawer_background_color`, `drawer_text_color` |
| | **Border color** | Oat (`color2`), as it ships in this store | `drawer_border_color` |
| Popovers and modals | **Background color** / **Text color** | Leave: Background / Foreground | `popover_background_color`, `popover_text_color` |
| | **Corner radius** / **Border color** / **Border thickness** | 0 px / Oat (`color2`) / 1 px. The colour and thickness already ship that way here. | `popover_border_radius`, `popover_border_color`, `popover_border_width` |
| | **Drop shadow** | Off | `popover_drop_shadow` |
| Badges | **Corner radius** | 0 px, to match the square corners. Badges only show on sale or sold-out items. | `badge_corner_radius` |
| | **Sold out badge background** | #E4DDCB (Bone fabric). It ships as a fixed #EEF1EA here, so the palette doesn't reach it. Leave the other badge colours. | `badge_sold_out_background_color` |
| Swatches | **Variant images** | Off (as it ships) | `show_variant_image` |
| | **Width** / **Height** / **Corner radius** | 32 px / 32 px / 0 px (square chips, like fabric samples) | `variant_swatch_width`, `variant_swatch_height`, `variant_swatch_radius` |
| | **Borders** / **Border thickness** / **Border opacity** | Solid / 1 px / 60% (an Ink edge at 3.80:1, so a Bone swatch still shows on the Bone page) | `variant_swatch_border_style`, `variant_swatch_border_width`, `variant_swatch_border_opacity` |

Hover colours are worked out by Horizon from the colours above. Their ratios are in the table below.

### Contrast (WCAG AA: 4.5:1 for body text, 3:1 for large text, borders and icons)

Worked out with the WCAG 2.x formula. Hover colours use Horizon's own hover rules, reproduced exactly.

| Pair | Ratio | Result |
|---|---|---|
| Body text: Ink #1F2733 on Bone #ECE5D3 | 11.97:1 | Pass |
| Primary button: Bone on Ink | 11.97:1 | Pass |
| Primary button hover: Bone on #3C4B63 | 7.03:1 | Pass |
| Secondary button, variant buttons, sign-up button on hover: Ink on #E4DAC1 | 10.81:1 | Pass |
| Grey text, Horizon's default (Ink at 60%) on Bone | 3.80:1 | **Fail**. Fixed by the Custom CSS in section 3 |
| Grey text after the Custom CSS (Ink at 70%) on Bone | 5.04:1 | Pass |
| Link hover (Ink at 70%) on Bone | 5.04:1 | Pass |
| Label: deep rust #8E4426 on Bone | 5.56:1 | Pass |
| Swatch edge (Ink at 60%) on Bone | 3.80:1 | Pass (3:1 for edges) |
| Fabric band: Ink on Bone fabric #E4DDCB | 11.10:1 | Pass |
| Fabric band: grey text after the Custom CSS (Ink at 70%) | 4.83:1 | Pass |
| Dark band: Bone on Slate #27303D | 10.60:1 | Pass |
| Dark band: grey text, Horizon's default (Bone at 60%) | 4.89:1 | Pass |
| Dark band: grey text after the Custom CSS, and the sign-up placeholder (Bone at 70%) | 6.06:1 | Pass |
| Top band button hover: Bone on #313C4D | 8.87:1 | Pass |
| Sun #D29B3C on Slate (footer logo) | 5.39:1 | Pass |
| Rust #B4552D on Bone (header logo) | 3.91:1 | Logo only. Too low for text |
| Rust #B4552D on Slate | 2.71:1 | Never use |
| Sun #D29B3C on Bone | 1.97:1 | Never use |
| Ink on Slate | 1.13:1 | Why the top band's text colour is set by hand |
| Oat #C7B48E on Bone | 1.62:1 | Lines only |

## 3. Typography

### Fonts (Theme settings → Typography → Fonts)

Both fonts are in Shopify's font library. Shopify's font list (shopify.dev) has Unbounded at weights 200–900 (`unbounded_n2` to `unbounded_n9`, no italics) and Archivo at 100–900 with italics (`archivo_n1` to `archivo_i9`). No custom font files or code are needed.

| Picker | Font | Weight | Handle |
|---|---|---|---|
| **Heading** | Unbounded | Bold (700) | `unbounded_n7` |
| **Accent** | Unbounded | Bold (700) | `unbounded_n7` |
| **Subheading** | Archivo | Semibold (600) | `archivo_n6` |
| **Body** | Archivo | Regular (400) | `archivo_n4` |

- Unbounded Bold is the logo's typeface (BRAND.md). It's used only for headings.
- Archivo is plain and reads well at small sizes. The logo was set in Archivo before the owner picked Unbounded (designs/mark/BRIEF.md), so it already belongs to the brand.
- Accent matches Heading. Horizon loads each font once, so this adds no download, and anything set to Accent stays on brand.

### Text presets (Theme settings → Typography)

**Paragraph:** **Size** 16px (`type_size_paragraph`: "16"), **Line height** Loose, 1.6 (`type_line_height_paragraph`: "body-loose").

| Preset | **Font** | **Size** | **Line height** | **Letter spacing** | **Case** | Where it shows |
|---|---|---|---|---|---|---|
| Heading 1 | Heading | 48px (28px on phones) | Normal (1.1) | Loose (0.12 em, see Custom CSS) | Uppercase | The home page's top band line only |
| Heading 2 | Heading | 24px | Normal (1.1) | Loose (0.12 em) | Uppercase | Section headings; page, collection and product titles |
| Heading 3 | Heading | 18px | Loose (1.2) | Loose (0.12 em) | Uppercase | Sub-headings in page text (the FAQ questions), footer sign-up heading, password page |
| Heading 4 | Heading | 14px | Normal (1.1) | Loose (0.12 em) | Uppercase | Small headings: collection tile names, "More hats", the cart title |
| Heading 5 | Subheading | 14px | Normal (1.1) | Loose (0.12 em) | Uppercase | Labels: product page accordion rows, the "Quitting time" line |
| Heading 6 | Body | 14px | Normal (1.1) | Normal | Default | Prices on product cards (Horizon uses H6 for them) |

IDs: `type_font_h1` … `type_font_h6` (heading, heading, heading, heading, subheading, body), `type_size_h1` … (48, 24, 18, 14, 14, 14), `type_line_height_h1` … (display-normal, display-normal, display-loose, display-normal, display-normal, display-normal), `type_letter_spacing_h1` … (heading-loose ×5, heading-normal), `type_case_h1` … (uppercase ×5, none).

**Why these sizes.** Unbounded is very wide. Measured with the repo's own font files (tools/fonts/), at 0.12 em, without kerning:

- Horizon scales only sizes of 48px and up. A 48px H1 drops to the next preset size down plus 4px on phones: 24 + 4 = 28px. Horizon's own code, run through the Liquid library, gives `clamp(1.75rem, 4.8vw, 3rem)`. At 28px, "HATS FOR THE HOURS YOU EARNED." takes 3 lines on a phone. A fixed 40px H1 would take 4 or 5, with "YOU" alone on a line.
- **Keep Heading 2 at 24px.** If it goes to 32px, the phone H1 becomes 36px and breaks into 4 lines.
- Headings set through a preset get balanced line breaks. A 24px product title breaks as "OFF SHFT / LOGO HAT", not with "HAT" alone.
- Heading 3 at 18px keeps the longest FAQ question ("What if it arrives damaged or wrong, or doesn't arrive?") to 3 lines on a phone.

### Letter-spacing: the Custom CSS

Horizon's **Letter spacing** setting stops at Loose, which is 0.03 em. The brand's 0.12 em needs one line in **Theme settings → Custom CSS**. Paste exactly this:

```css
html:root{--letter-spacing--heading-loose:.12em;--opacity-muted-text:.7}
```

- The first part makes every heading preset set to Loose use 0.12 em.
- The second part raises Horizon's grey text from 60% to 70% of the text colour. At 60% it fails AA on Bone (3.80:1). At 70% it passes (5.04:1). That grey is used for the copyright line, input placeholders, the search box and the sort label.
- `html:root` outranks Horizon's own `:root` rules wherever Shopify places this CSS.
- 72 characters. The box takes 1,500 (store/research/shopify-setup.md, section 2). It isn't a theme code edit.
- **A person pastes it, in the editor.** Shopify stores theme-wide Custom CSS with the theme settings, and its developer docs say themes and apps shouldn't write that value (shopify.dev, settings_data.json, "Platform-controlled settings"). So the orchestrator can't apply it. The owner pastes it while previewing the copy; section 10 checks that it took. Don't move it into the theme's code instead: that ends automatic Horizon updates (section 8).

### If a font ever leaves the library

Both fonts are in the library today, so this is only a fallback.

- **First choice, no code:** pick the closest library font in the same picker: Krona One for Unbounded (one weight, `krona_one_n4`) and Work Sans for Archivo (`work_sans_n4`, `work_sans_n6`).
- **Self-hosting the real files is a code edit** (store/research/shopify-setup.md, section 3): WOFF2 files in the theme's assets, `@font-face` rules in `assets/fonts.css.liquid` loaded from `layout/theme.liquid`, and `font-display: swap`. Declaring the fonts alone changes nothing on the page. Horizon's text follows its font pickers, so the CSS also has to point `--font-heading--family` and `--font-accent--family` (Unbounded) and `--font-body--family` and `--font-subheading--family` (Archivo) at the new fonts. Like any code edit, it ends automatic Horizon updates (section 8), so it's the owner's call.
- Both fonts are under the SIL Open Font License 1.1. Keep its text with the files (tools/fonts/OFL-unbounded.txt, tools/fonts/OFL-Archivo.txt).

## 4. Logo, favicon and sharing image

Theme settings → Logo and favicon:

| Setting | Value | ID |
|---|---|---|
| **Default logo** | logo-ink.png (Ink letters, Rust hands, transparent, 1200 × 315 px) | `logo` |
| **Inverse logo** | logo-bone.png (Bone letters, Sun hands, transparent, 1200 × 315 px) | `logo_inverse` |
| **Desktop height** | 32 px, so the logo shows about 122 px wide | `logo_height` |
| **Mobile height** | 24 px, so about 91 px wide | `logo_height_mobile` |
| **Favicon** | favicon.png (the clock symbol on a Bone fabric square, 512 × 512 px). Shopify shrinks it to 32 × 32 px. | `favicon` |

- 32 px tall puts the letters about 13.6 px high, so the logo reads clearly and still stays small.
- The 1200 px files are sharp at three times these sizes, so they stay crisp on high-density screens.
- **Social sharing image:** social-share.png (1200 × 628 px). It isn't a theme setting. It goes in Online Store → Preferences → Social sharing image. That's a store setting, so the owner approves it.
- Never redraw or retype the logo. All four files come from store/assets/build.cjs.

## 5. Header, menus, announcement bar and footer

All of this lives in the header group and footer group, so it shows on every page.

### Announcement bar (header group → Announcement bar, `header-announcements`)

| Setting | Value | ID |
|---|---|---|
| **Section width** | Page | `section_width` |
| **Background color** | Slate (`color1`) | `background_color` |
| **Divider thickness** | 0 px | `divider_width` |
| **Padding → Top / Bottom** | 10 px / 10 px | `padding-block-start`, `padding-block-end` |

Keep one Announcement block (`_announcement`). Delete any others.

| Setting | Value | ID |
|---|---|---|
| **Text** | Made to order. Ships to Canada and the US. [CONFIRM: shipping zones are set to Canada and the US] | `text` |
| **Link** | /pages/faq | `link` |
| **Font** | Subheading | `font` |
| **Size** | 12px | `font_size` |
| **Weight** | Default | `weight` |
| **Letter spacing** | Normal | `letter_spacing` |
| **Case** | Default | `case` |
| **Text color** | Bone #ECE5D3 | `text_color` |

Not all caps, although store/pages/home.md asks for caps. Horizon keeps room for two arrows beside the text even with one announcement. That leaves 240–270 px for text on phones. In caps the line measures 294–309 px and wraps onto two lines on every phone. In this setting it measures 238 px and fits on one line on phones 360 px wide and up.

If the owner sets a free-shipping threshold later, the text becomes: Free shipping on orders over [CONFIRM: free-shipping threshold] CAD.

### Header (header group → Header, `header`)

| Setting | Value | ID |
|---|---|---|
| Logo → **Position** | Center | `logo_position` |
| Menu → **Position** / **Row** | Left / Top | `menu_position`, `menu_row` |
| Search → **Search icon** / **Position** / **Row** | On / Right / Top | `show_search`, `search_position`, `search_row` |
| Localization → **Country/Region** | On (for Canada and the US once the US market exists) | `show_country` |
| Localization → **Flag** | Off | `country_selector_style` |
| Localization → **Language selector** | Off (English only) | `show_language` |
| Localization → **Font** / **Size** / **Position** / **Row** | Body / 14px / Right / Top | `localization_font`, `localization_font_size`, `localization_position`, `localization_row` |
| Appearance → **Width** / **Height** | Page / Standard | `section_width`, `section_height` |
| Appearance → **Sticky header** | On scroll up | `enable_sticky_header` |
| Appearance → **Border thickness** / **Bottom border color** | 1 px / Oat #C7B48E | `border_width`, `bottom_border_color` |
| Utilities → **Menu style** | Icons | `actions_display_style` |
| Colors → **Top row background** / **Top row text** | Bone #ECE5D3 / Ink #1F2733 | `background_color_top`, `text_color_top` |
| Cart bubble → **Bubble style** | Default (it becomes Ink with Bone numbers) | `bubble_style` |
| Home page, Product page, Collection page → **Transparent background** | Off | `enable_transparent_header_*` |

Logo block inside the header (`_header-logo`): **Hide logo on home page** off. Nothing else to change.

Menu block inside the header (`_header-menu`):

| Setting | Value | ID |
|---|---|---|
| **Menu** | Main menu | `menu` |
| **Background color** / **Text color** | Bone #ECE5D3 / Ink #1F2733 | `background_color`, `text_color` |
| **Top level size** | 14px | `type_font_primary_size` |
| **Submenu size** | Medium | `menu_font_style` |
| **Font** / **Case** | Subheading / Default | `type_font_primary_link`, `type_case_primary_link` |
| **Media type** | None | `menu_style` |
| Mobile layout → **Navigation bar** | Off | `navigation_bar` |
| Mobile layout → **Accordion** / **Expand first group** / **Dividers** | On / On / Off | `drawer_accordion`, `drawer_accordion_expand_first`, `drawer_dividers` |

Menus use sentence case because Horizon has no letter-spacing setting for them. All caps appear only where the spacing can be set.

### Menus (Content → Menus)

Menus are store content, not theme files. Delete every item already in each menu, then add these.

**Main menu** (handle `main-menu`):

| Item | Links to |
|---|---|
| Hats | /collections/all-hats |
| — All hats | /collections/all-hats |
| — Fishing | /collections/fishing |
| — Golf | /collections/golf |
| — Cottage | /collections/cottage |
| — Cornhole | /collections/cornhole |
| — Text hats | /collections/text-hats |
| About | /pages/about |
| FAQ | /pages/faq |

- The items with a dash sit under Hats.
- Add a collection under Hats only once it has at least one published hat. All hats comes first because on phones, tapping Hats opens the list instead of a page.
- If only All hats has a hat at launch, Hats gets no dropdown and links straight to /collections/all-hats.
- [CONFIRM: owner's call from store/collections.md: wait until each hobby collection has its own hat, or tag the logo hat with all four hobbies so they fill at launch]

**Footer menu** (handle `footer`):

| Item | Links to |
|---|---|
| Size & fit | /pages/size-fit |
| Shipping & returns | /pages/shipping-returns |
| FAQ | /pages/faq |
| About | /pages/about |
| Contact | /pages/contact |

Don't add the store policies to this menu. The Policy links block in Policies and links lists them, behind its "Terms and Policies" link (below).

### Footer (footer group → Footer, `footer`)

| Setting | Value | ID |
|---|---|---|
| **Width** | Page | `section_width` |
| **Gap** | 40 px | `gap` |
| **Background color** | Slate (`color1`). It ships pointing at Background in this store. | `background_color` |
| **Padding → Top / Bottom** | 48 px / 48 px | `padding-block-start`, `padding-block-end` |

The footer arranges its top-level blocks in equal columns: three across on a computer, stacked on a phone. Leave exactly three, in this order. This store's footer starts with two: a group (a heading and a line) and an Email signup block beside it. It has no Menu block.

**1. Sign-up group.** Use the group that starts with "Join our email list". Its Email signup block sits outside it, as a column of its own. Inside the group, add an Email signup block under the two Text blocks and set it as below, then delete the old one. Don't add a second sign-up anywhere. Group **Gap** 12 px (`gap`; it ships at 6 px).

| Block | Setting | Value |
|---|---|---|
| Text, the heading (`text`) | **Text** (`text`) | New hats, now and then. (keep it formatted as Heading 2) |
| | **Preset** (`type_preset`) | Heading 3. It ships as Heading 4 here. |
| Text (`text`) | **Text** (`text`) | We'll email you when there's a new hat. That's about it. Unsubscribe any time. |
| Email signup (`email-signup`) | **Border** (`border_style`) | All |
| | Input **Style** (`input_style`) | Custom |
| | **Border thickness** / **Corner radius** (`border_width`, `border_radius`) | 1 px / 0 px |
| | Input **Background** / **Text** / **Borders** (`input_background_color`, `input_text_color`, `input_border_color`) | Slate #27303D / Bone #ECE5D3 / Bone #ECE5D3 |
| | Input **Text preset** (`input_type_preset`) | Paragraph |
| | Submit button **Style** (`style_class`) | Custom |
| | Button colors **Background** / **Text** / **Borders** (`custom_button_background`, `custom_button_text`, `custom_button_border`) | Bone #ECE5D3 / Ink #1F2733 / Bone #ECE5D3 |
| | **Display** / **Label** / **Integrated button** (`display_type`, `label`, `integrated_button`) | Text / Sign up / Off |

- "Unsubscribe any time." is added to home.md's line. Canada's anti-spam law wants the sign-up to say people can unsubscribe (store/research/shopify-setup.md, section 8).
- The same section says it must also name the sender, with contact details. [CONFIRM: the contact details to show beside the sign-up, a mailing address plus an email or the site address. Owner's call which address to publish. They go in the brand group's text below.]
- [CONFIRM: who sends these emails (for example Shopify Messaging), and that new-hat emails are all the owner plans to send]

**2. Menu** (`menu`). This store's footer has none, so add one (Add block → Menu). **Menu** Footer menu (`menu`), **Heading** empty (`heading`), **Vertical gap** 12 px (`menu_spacing`), **Show as accordion on mobile** off (`show_as_accordion`), **Heading preset** and **Link preset** Paragraph (`heading_preset`, `link_preset`). A new Menu block starts with Heading preset at Heading 3, so change it.

**3. Brand group.** Add block → Group (`group`): **Direction** Vertical (`content_direction`), **Alignment** Left (`horizontal_alignment_flex_direction_column`), **Gap** 16 px (`gap`). Inside it:

| Block | Setting | Value |
|---|---|---|
| Logo (`logo`) | **Use inverse logo** (`inverse`) | On (shows logo-bone.png) |
| | **Unit** / **Height** (`unit`, `pixel_height`) | Pixel / 32 px |
| | **Custom mobile size** (`custom_mobile_size`) | Off |
| Text (`text`) | **Text** (`text`) | OFF SHFT makes hats for your time off. Every hat is made to order and shipped to you. |
| | | Second paragraph: [CONFIRM: sender contact details, see the sign-up group above] |

The logo closes the page like the small OFF SHFT sign-off in BRAND.md's layout rules.

### Policies and links (footer group → Policies and links, `footer-utilities`)

| Setting | Value | ID |
|---|---|---|
| **Width** / **Gap** | Page / 24 px | `section_width`, `gap` |
| **Background color** | Slate (`color1`). It ships pointing at Background in this store. | `background_color` |
| **Divider thickness** / **Divider color** | 1 px / #4E545B. That's Bone at 20% on Slate, typed as a solid colour: this colour field takes no transparency. | `divider_thickness`, `divider_color` |
| **Padding → Top / Bottom** | 16 px / 24 px | `padding-block-start`, `padding-block-end` |

| Block | Settings |
|---|---|
| Copyright (`footer-copyright`) | **Show "Powered by Shopify"** off (`show_powered_by`). **Size** 12px (`font_size`). **Case** Default (`case`). It prints the year and the store name. |
| Policy links (`footer-policy-list`) | **Size** 12px (`font_size`). **Case** Default (`case`). It shows one link, "Terms and Policies", which opens a pop-up list of the policies in Settings → Policies. It shows nothing until at least one policy exists. The refund and shipping text is drafted in store/pages/shipping-returns.md. [CONFIRM: the owner approves that draft, and the privacy and terms policies are written] |
| Social media links (`social-links`) | Delete the block now. Horizon fills it with links to facebook.com, instagram.com and others, not to OFF SHFT. Add it back with only the real accounts and **Color** left empty. [CONFIRM: Instagram, TikTok and Facebook handles, once claimed] |

## 6. Home page (Default home page template)

Sections in order, top to bottom. The page starts with two sections, Hero and Featured collection. Delete both, then add these. Leave text colours empty unless a row says otherwise.

### 1. Top band (Add section → Rich text, `section`)

Not the Hero section. With no image, Horizon's Hero fills itself with Shopify's colour placeholder drawing of clothes (`hero-apparel-1`), on the live store too. This store's home page shows it now. A plain section shows only its colour.

| Setting | Value | ID |
|---|---|---|
| Layout → **Direction** / **Alignment** / **Position** | Vertical / Left / Center | `content_direction`, `horizontal_alignment_flex_direction_column`, `vertical_alignment_flex_direction_column` |
| **Gap** | 16 px | `gap` |
| **Width** / **Height** | Page / Medium | `section_width`, `section_height` |
| **Background media** / **Background color** | None / Slate #27303D (`color1`) | `background_media`, `background_color` |
| **Padding → Top / Bottom** | 40 px / 40 px | `padding-block-start`, `padding-block-end` |

It comes with a heading, a text and a button. **Set both text colours to Bone by hand.** The section switches them by itself today, but stops once it has a photo (Ink on Slate is 1.13:1).

| Block | Setting | Value |
|---|---|---|
| Text (`text`) | **Text** (`text`) | Hats for the hours you earned. (format it as Heading 1) |
| | **Preset** / **Max width** (`type_preset`, `max_width`) | Heading 1 / Narrow |
| | **Text color** (`text_color`) | Bone #ECE5D3 |
| Text (`text`) | **Text** (`text`) | You put in the hours. This time is yours. |
| | **Preset** / **Max width** (`type_preset`, `max_width`) | Paragraph / Normal |
| | **Text color** (`text_color`) | Bone #ECE5D3 |
| | **Padding → Bottom** (`padding-block-end`) | 16 px |
| Button (`button`) | **Label** / **Link** (`label`, `link`) | Shop hats / /collections/all-hats |
| | **Style** (`style_class`) | Custom |
| | Button colors **Background** / **Text** / **Borders** (`custom_button_background`, `custom_button_text`, `custom_button_border`) | Slate #27303D / Bone #ECE5D3 / Bone #ECE5D3 |

- On a computer the heading breaks into two balanced lines. On a phone it's 28 px over three lines.
- Once samples arrive: [CONFIRM: a real photo of a sample hat worn outdoors, landscape]. In this section, set **Background media** to Image and pick the photo. Turn on **Background overlay** with **Overlay color** #27303D at 50% (#27303D80), so the text stays readable. No stock photos, no AI images.
- Photo size: Horizon stretches it edge to edge and asks for versions up to 3840 px wide. Use one at least 2880 px wide, so it stays sharp on a 1440 px laptop screen at double density. On phones the band is at least 400 px tall and the photo is cropped to fill it, so keep the hat in the middle third.

### 2. The idea (Add section → Rich text, `section`)

| Setting | Value | ID |
|---|---|---|
| **Direction** / **Alignment** / **Position** | Vertical / Center / Center | `content_direction`, `horizontal_alignment_flex_direction_column`, `vertical_alignment_flex_direction_column` |
| **Gap** | 24 px | `gap` |
| **Width** / **Height** | Page / Auto | `section_width`, `section_height` |
| **Background media** / **Background color** | None / #E4DDCB (Bone fabric, typed as a hex) | `background_media`, `background_color` |
| **Padding → Top / Bottom** | 80 px / 80 px | `padding-block-start`, `padding-block-end` |

Blocks, in this order. The section comes with a heading, a text and a button. Add the Icon block and drag it to the top.

| Block | Setting | Value |
|---|---|---|
| Icon (`icon`) | **Icon** (`icon`) | None |
| | **Image icon** (`image_upload`) | favicon.png. Its #E4DDCB square matches this band, so only the clock shows. Leave the file's alt text empty: the clock is decoration here, and the heading says the words. |
| | **Width** (`width`) | 64 px |
| Text (`text`) | **Text** (`text`) | Everybody has a shift. (Heading 2 format) |
| | **Preset** / **Width** / **Alignment** (`type_preset`, `width`, `alignment`) | Heading 2 / Fill / Center |
| Text (`text`) | **Text** (`text`) | The good part is what happens after it. |
| | **Preset** / **Width** / **Alignment** (`type_preset`, `width`, `alignment`) | Paragraph / Fill / Center |
| Button (`button`) | **Label** / **Link** / **Style** (`label`, `link`, `style_class`) | About OFF SHFT / /pages/about / Secondary |

### 3. Collection tiles (Add section → Collection list: Grid, `collection-list`)

| Setting | Value | ID |
|---|---|---|
| **Collections** | Fishing, Golf, Cottage, Cornhole, in that order | `collection_list` |
| **Type** / **Columns** / **Mobile columns** | Grid / 4 / 2 | `layout_type`, `columns`, `mobile_columns` |
| **Carousel on mobile** | Off | `carousel_on_mobile` |
| **Horizontal gap** / **Vertical gap** | 16 px / 24 px | `columns_gap`, `rows_gap` |
| **Width** / **Gap** | Page / 24 px | `section_width`, `gap` |
| **Background color** | Empty (the page's Bone) | `background_color` |
| **Padding → Top / Bottom** | 64 px / 64 px | `padding-block-start`, `padding-block-end` |

| Block | Setting | Value |
|---|---|---|
| Header → Text (`text`) | **Text** / **Preset** (`text`, `type_preset`) | Pick your time off. (Heading 2 format) / Heading 2 |
| Collection card (`_collection-card`) | **Placement** / **Alignment** / **Vertical gap** (`placement`, `horizontal_alignment`, `collection_card_gap`) | Below image / Left / 12 px |
| Collection card → Image (`_collection-card-image`) | **Aspect ratio** (`image_ratio`) | Square |
| Collection card → Collection title (`collection-title`) | **Preset** / **Background** (`type_preset`, `background`) | Heading 4 / Off |

- Tile images are each collection's own image. A collection with no image shows its first hat's main image instead. [CONFIRM: one image per collection once it has an approved hat]
- Image size: square, at least 1200 × 1200 px. The tiles crop to a square, and phones ask for tile images up to 1200 px wide. The 880 × 640 previews in designs/ would lose their sides and look soft.
- **Hide this section** (the eye icon, `"disabled": true`) until all four collections have at least one published hat. At launch none does, and there's no cornhole design yet.

### 4. Featured hat (Add section → Featured product, `featured-product-information`)

Add it after the owner publishes the logo hat. Until then the section shows Shopify's placeholder drawing and the words "Product title", on the live store too.

| Setting | Value | ID |
|---|---|---|
| **Product** | OFF SHFT Logo Hat (store/products/off-shft-logo-hat.md) | `product` |
| **Width** / **Media position** | Page / Left | `content_width`, `desktop_media_position` |
| **Equal columns** / **Gap** | On / 48 px | `equal_columns`, `gap` |
| **Background color** | Empty | `background_color` |
| **Padding → Top / Bottom** | 64 px / 64 px | `padding-block-start`, `padding-block-end` |

Inside Details:

| Block | Setting | Value |
|---|---|---|
| Header group → add a Text block (`text`), drag it above the title | **Text** / **Preset** (`text`, `type_preset`) | Quitting time, on a hat. / Heading 5 |
| | **Text color** (`text_color`) | Deep rust #8E4426 |
| Title (`product-title`) | **Preset** (`type_preset`) | Heading 2 |
| Price (`price`) | **Installments** / **Tax information** (`show_installments`, `show_tax_info`) | Off / On |
| Review stars (`review`) | Delete | No reviews exist, and there will never be made-up ones |
| Variant picker (`variant-picker`) | **Style** / **Swatches** (`variant_style`, `show_swatches`) | Buttons / On |
| Buy buttons (`buy-buttons`) | Leave as they come | The button keeps Horizon's own label, Add to cart |

The Product media block stays as it comes. The title links to the product page.

### 5. Email sign-up and footer

These come from the footer group (section 5). Don't add a separate Email signup section.

## 7. Product page (Default product template)

### Product information (`product-information`)

| Setting | Value | ID |
|---|---|---|
| **Width** / **Media position** | Page / Left | `content_width`, `desktop_media_position` |
| **Equal columns** | Off | `equal_columns` |
| **Gap** | 48 px | `gap` |
| **Sticky add to cart bar** | Off | `enable_sticky_add_to_cart` |
| **Background color** | Empty | `background_color` |

**Product media** (`_product-media-gallery`): **Type** Grid (`media_presentation`), **Columns** 2 (`media_columns`), **Gap** 8 px (`image_gap`), **Full width first image** on (`large_first_image`), **Aspect ratio** Auto (`aspect_ratio`), **Constrain to screen height** on (`constrain_to_viewport`), **Media fit** Contain (`media_fit`), **Corner radius** 0 px (`media_radius`), **Extend media to screen edge** off (`extend_media`), **Enable zoom** on (`zoom`), **Hide unselected variant media** on (`hide_variants`), **Mobile pagination** Dots (`slideshow_mobile_controls_style`). Phones always get a carousel.

### Details blocks, in order (`_product-details`, **Sticky on desktop** on, `sticky_details_desktop`)

| # | Block | Settings |
|---|---|---|
| 1 | Header group → the title Text block (`text`; this store names it "Product title") | **Preset** Heading 2 (`type_preset`). Leave its text, the product title. |
| | Header group → Price (`price`) | **Installments** off (`show_installments`), **Tax information** on (`show_tax_info`), **Preset** Paragraph (`type_preset`) |
| 2 | Divider (`_divider`) | As it comes. It uses Oat. |
| 3 | Variant picker (`variant-picker`) | **Style** Buttons (`variant_style`), **Swatches** on (`show_swatches`), **Alignment** Left (`alignment`). Style shows as two equal buttons, Colour as square swatches. |
| 4 | Buy buttons (`buy-buttons`) | **Always stack buttons** on (`stacking`), **Show pickup availability** off (`show_pickup_availability`), **Gift card form** as it comes. Inside: Quantity, then Add to cart (**Style** Primary, `style_class`), then Accelerated checkout. The payment buttons keep their own brand colours. |
| 5 | Accordion (Add block → Accordion, `accordion`) | **Icon** Plus (`icon`), **Dividers** on (`dividers`), **Divider color** Oat #C7B48E (`divider_color`), **Heading preset** Heading 5 (`type_preset`) |
| — | Text "Product description" | Delete it. The description moves into the Details row below. |

**Disclosures** isn't inside Details. It's a block of the Product information section and sits below the product. Leave it: it shows only when a product has safety or regulatory disclosures.

**Swatches** need product setup, not theme setup. The Colour option has to be linked to the category's Color metafield, with a colour for each value. Until it is, colours show as plain buttons (store/products/_template.md, Variants). [CONFIRM: the link survives a sync from the partner app]

### Accordion rows (`_accordion-row`)

The Accordion block arrives with three sample rows. One of them, "Manufacturing", says the products are "manufactured both locally and globally". Rename and refill the rows as below, delete every sample Text block, and add a fourth row. Every row: **Icon** None (`icon`).

| Row | **Heading** (`heading`) | **Open row by default** (`open_by_default`) | Content |
|---|---|---|---|
| 1 | Details | On | Add block → Description (`product-description`). It shows the product's own description, which holds the details list (store/products/_template.md). |
| 2 | Shipping | Off | Text: Made to order, then shipped to you in Canada or the US. You'll see the shipping cost at checkout before you pay. Times and costs: [Shipping & returns](/pages/shipping-returns). [CONFIRM: shipping zones are Canada and the US only] |
| 3 | Returns | Off | Text: Each hat is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. If it arrives stitched wrong, damaged or not what you ordered, email us within [CONFIRM: number of days, under 30] days of delivery with your order number and a photo. We'll send a new one or refund you. Full policy: [Shipping & returns](/pages/shipping-returns). [CONFIRM: the owner approves the draft policy in store/pages/shipping-returns.md] |
| 4 | Size & fit | Off | Text: [CONFIRM: every style we sell is one size with an adjustable back] Measure around your head where a hat sits, then check the range for your style on the [Size & fit](/pages/size-fit) page. |

These rows are the same on every hat. Keep them in step with store/pages/shipping-returns.md, store/pages/faq.md and store/pages/size-fit.md. Row texts use **Preset** Default.

The product descriptions start their list with a bold "Details" line, so the word shows twice in that row. It reads fine. Whoever edits the listing template can drop the bold line.

### Recommended products (`product-recommendations`)

- Header Text: **Text** More hats (Heading 2 format), **Preset** Heading 4 (`text`, `type_preset`).
- Leave the other settings as they come.
- **Hide this section** while the store has one published hat. With nothing to recommend it would show the heading over an empty row. Show it once a second hat is live.

## 8. Theme code edits

**None are needed, and none should be made.** The fonts come from the library, and everything else is a theme setting. The two CSS values in section 3 go in **Theme settings → Custom CSS**. Shopify keeps that with the theme settings (`settings_data.json`), not in the code files.

Why it matters: Shopify updates a theme automatically only while "all theme files, except settings_data.json and any JSON files in the /templates directory, are in their original state" (shopify.dev, Updating your theme). After one code edit, each new Horizon version arrives instead as an unpublished copy to check and publish by hand, and the edit may not carry over. Changes made in the theme editor do carry over.

If the Custom CSS box won't save the CSS, ask the owner before editing code. The code route, on the copy: in `snippets/theme-styles-variables.liquid` (Horizon 4.3.0, inside the `:root` block), change two lines:

```diff
-    --letter-spacing--heading-loose: 0.03em;
+    --letter-spacing--heading-loose: 0.12em;
```

```diff
-    --opacity-muted-text: 0.6;
+    --opacity-muted-text: 0.7;
```

From then on Horizon updates come by hand, as above. Check both lines in every update. Use the Custom CSS box when you can.

## 9. Other theme settings

| Group | Setting | Value | ID |
|---|---|---|---|
| Page | **Page width** | Narrow (as it ships) | `page_width` |
| Animations | **Page transition** / **Product card to product page transition** | Off / Off (as they ship) | `page_transition_enabled`, `transition_to_main_product` |
| | **Add to cart** | Off | `add_to_cart_animation` |
| | **Card hover effect** | None (as it ships) | `card_hover_effect` |
| Cart | **Type** | Drawer (as it ships) | `cart_type` |
| | **"Add to cart" auto-opens drawer** | On (with the animation off, this is the sign the hat went in) | `auto_open_cart_drawer` |
| | **Allow note to seller** | Off (as it ships) | `show_cart_note` |
| | **Allow discounts in cart** | Off. There are no codes, and checkout still has its own discount field. | `show_add_discount_code` |
| | **Installments** | Off | `show_installments` |
| | **Accelerated checkout buttons** | On (as it ships) | `show_accelerated_checkout_buttons` |
| | **Empty cart button link** | /collections/all-hats | `empty_cart_button_link` |
| Icons | **Stroke** | Thin | `icon_stroke` |
| Prices | Currency code: **Product pages**, **Product cards**, **Cart items**, **Cart total** | All on. Horizon ships the first three off. Both currencies use "$", so the code matters. | `currency_code_enabled_*` |
| Product cards | **Quick add** | Off | `quick_add` |
| | **Show second image on hover** | On (as it ships) | `show_second_image_on_hover` |
| | **Show carousel** | Off | `product_card_carousel` |
| Search | **Empty state collection** | All hats | `empty_state_collection` |
| | **Product corner radius** / **Card corner radius** | 0 px / 0 px | `product_corner_radius`, `card_corner_radius` |

### Collection pages (Default collection template)

The Filtering and sorting block (`filters`): **Filters** off (`enable_filtering`), **Sorting** off (`enable_sorting`), **Grid layout control** off (`enable_grid_density`). With a handful of hats they're clutter. The title already uses Heading 2.

### 404 page (404 template)

Horizon ships this page sending shoppers to /collections/all, Shopify's built-in list of every product. store/collections.md says to link to All hats instead.

- Button "Continue shopping": **Link** /collections/all-hats (`link`).
- Featured collection section ("Discover something new"), if the page has one: **Collection** All hats (`collection`).

### Cart page (Cart template)

The cart opens as a drawer, but the cart page still exists at /cart.

- Featured collection section ("You may also like"), if the page has one: **Collection** All hats (`collection`). **Hide this section** while one hat is live, like Recommended products: it would only show the hat that's already in the cart.

### Password page (Password template)

The store sits behind this page until launch.

| Block | Setting | Value |
|---|---|---|
| Logo (`logo`) | **Unit** / **Height** (`unit`, `pixel_height`) | Pixel / 40 px (about 152 px wide) |
| Text (`text`) | **Text** (`text`) | Opening soon (as it ships, Heading 3) |
| Text (`text`) | **Text** (`text`) | Hats for the hours you earned. Leave your email and we'll let you know when we open. Unsubscribe any time. |
| Email signup (`email-signup`) | **Label** / Submit button **Style** (`label`, `style_class`) | Sign up / Primary |
| | Input **Text** / **Borders** / **Corner radius** (`input_text_color`, `input_border_color`, `border_radius`) | Foreground (Ink) / Foreground (Ink) / 0 px. In this store they ship pointing at `color1` and `color2`, which become Slate and Oat, and Oat is too faint for an input border (1.62:1). The corners ship at 14 px. |

- [CONFIRM: the owner will send one email when the store opens. The text promises it.]
- [CONFIRM: sender contact details, the same as in the footer, for Canada's anti-spam law]

### Outside the theme (owner approves; store settings, AGENTS.md)

- Settings → General → Store name: OFF SHFT.
- Online Store → Preferences: home page title and meta description (store/pages/home.md) and the social sharing image (section 4).
- Content → Menus: the two menus in section 5.
- Content → Files: the four images.

## 10. Checks before the owner publishes

On a phone (about 375 px wide) and on a computer, in the preview of the copy:

- [ ] Headings are all caps with wide spacing. If they look tight, the Custom CSS didn't take.
- [ ] Top band heading: three lines on the phone, about 28 px. Two lines on the computer.
- [ ] Top band text is Bone, not dark.
- [ ] No drawing of clothes anywhere. That's Horizon's placeholder: the top band must be a Rich text section, and the Featured hat waits for a published hat.
- [ ] The announcement is one line on the phone.
- [ ] The clock in home section 2 shows no square around it.
- [ ] None of the sample text listed under "Before you start" appears anywhere, including inside the Accordion.
- [ ] No review stars. No "Powered by Shopify". No social links that point to Facebook's or Instagram's home page.
- [ ] Prices show "CAD".
- [ ] Footer copyright says OFF SHFT, not My Store 2.
- [ ] Every menu and footer link opens a real page. The footer's "Terms and Policies" link opens the list of policies.
- [ ] A made-up address such as /pages/nothing shows the 404 page, and its button goes to All hats.
- [ ] Tab through the header and the product page with the keyboard: every link and button shows a focus outline.
- [ ] Collection tiles and Recommended products stay hidden until they have hats to show.
- [ ] The favicon shows in the browser tab (browsers can take a while to refresh it).

## Notes for the orchestrator

What this file changes or settles from store/research/shopify-setup.md:

- **Currency codes:** Horizon's shipped settings (`config/settings_data.json`) turn them off on product pages, product cards and cart items. Only the cart total has one. All four go on (section 9).
- **Custom CSS box:** settled. Shopify's developer docs say the theme editor shows a Custom CSS setting for every theme, at theme and section level. The theme-level one is stored in `settings_data.json` under `platform_customizations` (`custom_css`), and the same docs say theme developers shouldn't add or edit that value. So a person pastes it in the editor; it isn't written by API, and it doesn't go into theme code (sections 3 and 8).
- **Fonts:** settled by handle in Shopify's font list: `unbounded_n7`, `archivo_n4`, `archivo_n6`.
- **Top band:** a Rich text section, not the Hero. `sections/hero.liquid` prints `{{ 'hero-apparel-1' | placeholder_svg_tag }}` whenever the Hero has no media, with no editor-only check. The generic section shows a placeholder only when Background media is Image or Video with nothing picked. Both turn Horizon's contrast switch off once they have media (`skip_contrast`), so the top band's text colours are set by hand.
- **This store's installed copy differs from Horizon's public code** (store/theme-files/installed/): two extra palette colours (`color1` #333333, `color2` #DFDFDF), a transparent secondary button, input text on `color1`, the sold-out badge typed as #EEF1EA, the footer and Policies and links on Background instead of Slate, a footer with its Email signup outside the group and no Menu block, and a password sign-up whose input points at `color1` and `color2`. Sections 2, 5 and 9 follow the store.
- **Automatic updates:** [CONFIRM: whether Shopify also counts theme-editor changes to sections/header-group.json and sections/footer-group.json against automatic updates. shopify.dev only names settings_data.json and the JSON templates as exempt.]
- **Policies and links → Divider color** has no transparency option, so the 20% Bone is the solid #4E545B (section 5).
- **Grey text:** Horizon's 60% grey fails AA on light backgrounds. The Custom CSS fixes it.
- **Section names:** "Rich text" and "Email signup" are presets of the generic Section (`section`). "Featured product" is `featured-product-information`. "Product highlight" is a different section (`featured-product`).
- **Image settings:** in `settings_data.json`, images are written as `shopify://shop_images/<file name>` once the file is in Content → Files.
- **store/pages/home.md is now out of date on colour.** Its Colours list puts the page on #E4DDCB and gives Rust on Bone as 3.6:1. This file puts the page on #ECE5D3 (reason in section 2), where Rust is 3.91:1. Its section 4 note still holds: that band is #E4DDCB here, so the favicon's square doesn't show. The announcement bar is no longer all caps (section 5). Its section 3 still says Hero with no image, which shows Shopify's placeholder drawing, so this file uses a Rich text section that takes the photo later as its background image (section 6). Its [CONFIRM] on Unbounded is answered: the font is in Shopify's library (section 3). The page copy in home.md is unchanged and used as written, apart from "Unsubscribe any time." in the footer.

## Appendix: theme settings as settings_data.json values

These go in `config/settings_data.json` → `current` on the copy, on top of what's there. Section and block settings are in the tables above, with their IDs. The image values use this store's file names in Content → Files ("What must exist first").

```json
{
  "logo": "shopify://shop_images/offshft-logo-ink.png",
  "logo_inverse": "shopify://shop_images/offshft-logo-bone.png",
  "logo_height": 32,
  "logo_height_mobile": 24,
  "favicon": "shopify://shop_images/offshft-favicon.png",
  "color_palette": {
    "background": "#ECE5D3",
    "foreground": "#1F2733",
    "color1": "#27303D",
    "color2": "#C7B48E"
  },
  "type_body_font": "archivo_n4",
  "type_subheading_font": "archivo_n6",
  "type_heading_font": "unbounded_n7",
  "type_accent_font": "unbounded_n7",
  "type_size_paragraph": "16",
  "type_line_height_paragraph": "body-loose",
  "type_font_h1": "heading",
  "type_size_h1": "48",
  "type_line_height_h1": "display-normal",
  "type_letter_spacing_h1": "heading-loose",
  "type_case_h1": "uppercase",
  "type_font_h2": "heading",
  "type_size_h2": "24",
  "type_line_height_h2": "display-normal",
  "type_letter_spacing_h2": "heading-loose",
  "type_case_h2": "uppercase",
  "type_font_h3": "heading",
  "type_size_h3": "18",
  "type_line_height_h3": "display-loose",
  "type_letter_spacing_h3": "heading-loose",
  "type_case_h3": "uppercase",
  "type_font_h4": "heading",
  "type_size_h4": "14",
  "type_line_height_h4": "display-normal",
  "type_letter_spacing_h4": "heading-loose",
  "type_case_h4": "uppercase",
  "type_font_h5": "subheading",
  "type_size_h5": "14",
  "type_line_height_h5": "display-normal",
  "type_letter_spacing_h5": "heading-loose",
  "type_case_h5": "uppercase",
  "type_font_h6": "body",
  "type_size_h6": "14",
  "type_line_height_h6": "display-normal",
  "type_letter_spacing_h6": "heading-normal",
  "type_case_h6": "none",
  "page_width": "narrow",
  "page_transition_enabled": false,
  "transition_to_main_product": false,
  "add_to_cart_animation": false,
  "card_hover_effect": "none",
  "badge_corner_radius": 0,
  "badge_sold_out_background_color": "#E4DDCB",
  "primary_button_border_width": 0,
  "button_border_radius_primary": 0,
  "type_font_button_primary": "body",
  "button_text_case_primary": "default",
  "palette_secondary_button_background": "{{ settings.color_palette.background }}",
  "secondary_button_border_width": 1,
  "button_border_radius_secondary": 0,
  "type_font_button_secondary": "body",
  "button_text_case_secondary": "default",
  "pills_border_radius": 0,
  "cart_type": "drawer",
  "auto_open_cart_drawer": true,
  "show_cart_note": false,
  "show_add_discount_code": false,
  "show_installments": false,
  "show_accelerated_checkout_buttons": true,
  "empty_cart_button_link": "/collections/all-hats",
  "drawer_border_color": "{{ settings.color_palette.color2 }}",
  "icon_stroke": "thin",
  "palette_input_text": "{{ settings.color_palette.foreground }}",
  "palette_input_border": "{{ settings.color_palette.foreground }}",
  "input_border_width": 1,
  "inputs_border_radius": 0,
  "popover_border_radius": 0,
  "popover_border_color": "{{ settings.color_palette.color2 }}",
  "popover_border_width": 1,
  "popover_drop_shadow": false,
  "currency_code_enabled_product_pages": true,
  "currency_code_enabled_product_cards": true,
  "currency_code_enabled_cart_items": true,
  "currency_code_enabled_cart_total": true,
  "quick_add": false,
  "show_second_image_on_hover": true,
  "product_card_carousel": false,
  "empty_state_collection": "all-hats",
  "product_corner_radius": 0,
  "card_corner_radius": 0,
  "show_variant_image": false,
  "variant_swatch_width": 32,
  "variant_swatch_height": 32,
  "variant_swatch_radius": 0,
  "variant_swatch_border_style": "solid",
  "variant_swatch_border_width": 1,
  "variant_swatch_border_opacity": 60,
  "palette_variant_border": "{{ settings.color_palette.foreground }}",
  "variant_button_border_width": 1,
  "variant_button_radius": 0,
  "variant_button_width": "equal-width-buttons"
}
```

Custom CSS isn't in this block. Paste it in the editor (section 3).
