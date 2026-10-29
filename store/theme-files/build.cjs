// Theme files for the unpublished "OFF SHFT (draft)" copy of Horizon 4.3.0, generated from store/theme.md.
// Run: node store/theme-files/build.cjs <path to Horizon 4.3.0 source>   (writes store/theme-files/out/)
//
// Differences from theme.md, to fit this store:
// - Image settings use the names the files got in Content -> Files: offshft-logo-ink.png and so on.
// - This store's palette has two extra colours, not three: color1 (#333333 as installed) becomes Slate and color2
//   (#DFDFDF as installed) becomes Oat, matching theme.md's "find each extra colour by the hex it starts as". The
//   Bone fabric colour (#E4DDCB) is used as a plain hex where theme.md uses it.
// - Letter-spacing (0.12 em) and muted-text opacity (70%) go in Theme settings -> Custom CSS, pasted by the owner
//   (theme.md section 3). Apps shouldn't write that box, and editing theme code instead would end Horizon's automatic
//   updates, so out/snippets/theme-styles-variables.liquid is Horizon's original file, written back to undo the
//   edit an earlier run made.
'use strict';
const fs = require('fs');
const path = require('path');
const base = require('./base-settings.cjs');

const SRC = process.argv[2];
if (!SRC) { console.error('usage: node build.cjs <horizon-src>'); process.exit(1); }
const OUT = path.join(__dirname, 'out');
const P = (k) => `{{ settings.color_palette.${k} }}`;
const IMG = (f) => `shopify://shop_images/${f}`;

const heading = (font, size, lh, ls, kase) => ({ font, size, lh, ls, kase });
const H = {
  h1: heading('heading', '48', 'display-normal', 'heading-loose', 'uppercase'),
  h2: heading('heading', '24', 'display-normal', 'heading-loose', 'uppercase'),
  h3: heading('heading', '18', 'display-loose', 'heading-loose', 'uppercase'),
  h4: heading('heading', '14', 'display-normal', 'heading-loose', 'uppercase'),
  h5: heading('subheading', '14', 'display-normal', 'heading-loose', 'uppercase'),
  h6: heading('body', '14', 'display-normal', 'heading-normal', 'none'),
};
const type = {};
for (const [h, v] of Object.entries(H)) Object.assign(type, {
  [`type_font_${h}`]: v.font, [`type_size_${h}`]: v.size, [`type_line_height_${h}`]: v.lh,
  [`type_letter_spacing_${h}`]: v.ls, [`type_case_${h}`]: v.kase,
});

const changes = {
  // 4. Logo and favicon
  logo: IMG('offshft-logo-ink.png'), logo_inverse: IMG('offshft-logo-bone.png'),
  logo_height: 32, logo_height_mobile: 24, favicon: IMG('offshft-favicon.png'),
  // 2. Colours
  color_palette: { background: '#ECE5D3', foreground: '#1F2733', color1: '#27303D', color2: '#C7B48E' },
  // 3. Typography
  type_body_font: 'archivo_n4', type_subheading_font: 'archivo_n6', type_heading_font: 'unbounded_n7', type_accent_font: 'unbounded_n7',
  type_size_paragraph: '16', type_line_height_paragraph: 'body-loose',
  ...type,
  // 9. Other settings
  page_width: 'narrow', page_transition_enabled: false, transition_to_main_product: false, add_to_cart_animation: false, card_hover_effect: 'none',
  // Badges (sold-out badge on Bone fabric, as theme.md's palette table intends)
  badge_corner_radius: 0, badge_sold_out_background_color: '#E4DDCB',
  // Buttons
  primary_button_border_width: 0, button_border_radius_primary: 0, type_font_button_primary: 'body', button_text_case_primary: 'default',
  secondary_button_border_width: 1, button_border_radius_secondary: 0, type_font_button_secondary: 'body', button_text_case_secondary: 'default',
  pills_border_radius: 0,
  palette_secondary_button_background: P('background'),     // ships transparent here: fabric-coloured on the fabric band
  // Cart
  cart_type: 'drawer', auto_open_cart_drawer: true, show_cart_note: false, show_add_discount_code: false, show_installments: false,
  show_accelerated_checkout_buttons: true, empty_cart_button_link: '/collections/all-hats',
  // Drawers, icons, inputs, popovers (Oat lines = color2 in this store)
  drawer_border_color: P('color2'), icon_stroke: 'thin',
  palette_input_text: P('foreground'), palette_input_border: P('foreground'), input_border_width: 1, inputs_border_radius: 0,
  popover_border_radius: 0, popover_border_color: P('color2'), popover_border_width: 1, popover_drop_shadow: false,
  // Prices
  currency_code_enabled_product_pages: true, currency_code_enabled_product_cards: true,
  currency_code_enabled_cart_items: true, currency_code_enabled_cart_total: true,
  // Product cards, search
  quick_add: false, show_second_image_on_hover: true, product_card_carousel: false,
  product_corner_radius: 0, card_corner_radius: 0,
  // Swatches and variant pickers
  show_variant_image: false, variant_swatch_width: 32, variant_swatch_height: 32, variant_swatch_radius: 0,
  variant_swatch_border_style: 'solid', variant_swatch_border_width: 1, variant_swatch_border_opacity: 60,
  palette_variant_border: P('foreground'), variant_button_border_width: 1, variant_button_radius: 0, variant_button_width: 'equal-width-buttons',
  // empty_state_collection (All hats) is set once that collection exists.
};

fs.mkdirSync(path.join(OUT, 'config'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'snippets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'config/settings_data.json'), base.render({ current: { ...base.current, ...changes }, presets: base.presets }));

// Horizon's original styles file (see the note at the top): no code edits, so the theme keeps updating itself
fs.copyFileSync(path.join(SRC, 'snippets/theme-styles-variables.liquid'), path.join(OUT, 'snippets/theme-styles-variables.liquid'));

// ---------------------------------------------------------------- page files (theme.md sections 5-9)
// Edits the files as this store installed them (store/theme-files/installed/, checksums verified against Shopify),
// using the setting values from Horizon 4.3.0's schemas.
const INSTALLED = path.join(__dirname, 'installed');
const SHOP_HEADER = base.HEADER;
const load = (f) => { const s = fs.readFileSync(path.join(INSTALLED, f), 'utf8'); return JSON.parse(s.slice(s.indexOf('{'))); };
const save = (f, data) => { fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true }); fs.writeFileSync(path.join(OUT, f), SHOP_HEADER + JSON.stringify(data, null, 2) + '\n'); };
const BONE = '#ECE5D3', INK = '#1F2733', SLATE = '#27303D', FABRIC = '#E4DDCB', OAT = '#C7B48E';
const text = (html, settings = {}) => ({ type: 'text', settings: { text: html, ...settings }, blocks: {} });

// Header group: Slate announcement bar, centred logo, plain-text menu
{
  const hg = load('sections/header-group.json');
  const ann = hg.sections.header_announcements_9jGBFp;
  Object.assign(ann.settings, { section_width: 'page-width', background_color: P('color1'), divider_width: 0, 'padding-block-start': 10, 'padding-block-end': 10 });
  ann.blocks.announcement_BxgCk9.settings = {
    text: 'Made to order. Ships to Canada and the US.', link: '/pages/faq',
    font: 'var(--font-subheading--family)', font_size: '0.75rem', letter_spacing: 'normal', case: 'none', text_color: BONE,
  };
  const hdr = hg.sections.header_section;
  Object.assign(hdr.settings, {
    logo_position: 'center', menu_position: 'left', menu_row: 'top', show_search: true, search_position: 'right', search_row: 'top',
    show_country: true, country_selector_style: false, show_language: false, localization_font: 'body', localization_font_size: '0.875rem',
    localization_position: 'right', localization_row: 'top', section_width: 'page-width', section_height: 'standard',
    enable_sticky_header: 'scroll-up', border_width: 1, bottom_border_color: OAT, actions_display_style: 'icon',
    background_color_top: P('background'), text_color_top: P('foreground'), bubble_style: 'default',
    enable_transparent_header_home: false, enable_transparent_header_product: false, enable_transparent_header_collection: false,
  });
  Object.assign(hdr.blocks['header-menu'].settings, {
    menu: 'main-menu', type_font_primary_size: '0.875rem', type_font_primary_link: 'subheading', type_case_primary_link: 'none',
    menu_style: 'text', navigation_bar: false, drawer_accordion: true, drawer_accordion_expand_first: true, drawer_dividers: false,
  });
  save('sections/header-group.json', hg);
}

// Footer group: Slate, three columns (sign-up, footer menu, logo and a line), no sample social links
{
  const fg = load('sections/footer-group.json');
  const ft = fg.sections.footer_m9NzUG;
  Object.assign(ft.settings, { section_width: 'page-width', gap: 40, background_color: P('color1'), 'padding-block-start': 48, 'padding-block-end': 48 });
  const grp = ft.blocks.group_H6VpwJ;
  grp.settings.gap = 12;
  grp.blocks.text_LWt8Pz.settings.text = '<h2>New hats, now and then.</h2>';
  grp.blocks.text_LWt8Pz.settings.type_preset = 'h3';
  grp.blocks.text_f9CFLH.settings.text = "<p>We'll email you when there's a new hat. That's about it. Unsubscribe any time.</p>";
  const signup = ft.blocks.email_signup_crihX7;
  Object.assign(signup.settings, {
    border_style: 'all', input_style: 'custom', border_width: 1, border_radius: 0,
    input_background_color: SLATE, input_text_color: BONE, input_border_color: BONE, input_type_preset: 'paragraph',
    style_class: 'button-custom', custom_button_background: BONE, custom_button_text: INK, custom_button_border: BONE,
    display_type: 'text', label: 'Sign up', integrated_button: false,
  });
  grp.blocks.email_signup_crihX7 = signup;                    // the form joins its heading in one column
  grp.block_order = [...grp.block_order, 'email_signup_crihX7'];
  delete ft.blocks.email_signup_crihX7;
  ft.blocks.menu_footer = { type: 'menu', settings: { menu: 'footer', heading: '', menu_spacing: 12, show_as_accordion: false, heading_preset: 'paragraph', link_preset: 'paragraph' }, blocks: {} };
  ft.blocks.group_brand = {
    type: 'group',
    settings: { content_direction: 'column', horizontal_alignment_flex_direction_column: 'flex-start', vertical_alignment_flex_direction_column: 'flex-start', gap: 16, width: 'fill' },
    blocks: {
      logo_brand: { type: 'logo', settings: { inverse: true, unit: 'pixel', pixel_height: 32, custom_mobile_size: false }, blocks: {} },
      text_brand: text('<p>OFF SHFT makes hats for your time off. Every hat is made to order and shipped to you.</p>'),
    },
    block_order: ['logo_brand', 'text_brand'],
  };
  ft.block_order = ['group_H6VpwJ', 'menu_footer', 'group_brand'];
  const fu = fg.sections.footer_utilities_jLGE8U;
  // divider: Bone at 20% on Slate as a solid colour (the field takes no transparency)
  Object.assign(fu.settings, { section_width: 'page-width', gap: 24, background_color: P('color1'), divider_thickness: 1, divider_color: '#4E545B', 'padding-block-start': 16, 'padding-block-end': 24 });
  Object.assign(fu.blocks.footer_copyright_jweRK8.settings, { show_powered_by: false, font_size: '0.75rem', case: 'none' });
  Object.assign(fu.blocks.footer_policy_list_VCdnpa.settings, { font_size: '0.75rem', case: 'none' });
  delete fu.blocks.social_links_Ew63Kq;                        // sample links to facebook.com etc.; add back with real handles
  fu.block_order = fu.block_order.filter((id) => id !== 'social_links_Ew63Kq');
  save('sections/footer-group.json', fg);
}

// Home page: a Slate top band, then the idea on Bone fabric with the clock. The top band is a plain section, not
// Horizon's Hero: with no photo the Hero draws Shopify's placeholder clothes. Collection tiles and the featured hat
// are added once there are published hats to show (theme.md section 6).
{
  const idx = load('templates/index.json');
  idx.sections.section_top = {
    type: 'section',
    settings: {
      content_direction: 'column', horizontal_alignment_flex_direction_column: 'flex-start', vertical_alignment_flex_direction_column: 'center',
      gap: 16, section_width: 'page-width', section_height: 'medium', background_media: 'none', background_color: P('color1'),
      'padding-block-start': 40, 'padding-block-end': 40,
    },
    blocks: {
      text_hero_title: text('<h1>Hats for the hours you earned.</h1>', { type_preset: 'h1', max_width: 'narrow', text_color: BONE }),
      text_hero_line: text('<p>You put in the hours. This time is yours.</p>', { type_preset: 'paragraph', max_width: 'normal', text_color: BONE, 'padding-block-end': 16 }),
      button_hero: { type: 'button', settings: { label: 'Shop hats', link: '/collections/all-hats', style_class: 'button-custom', custom_button_background: SLATE, custom_button_text: BONE, custom_button_border: BONE }, blocks: {} },
    },
    block_order: ['text_hero_title', 'text_hero_line', 'button_hero'],
  };
  delete idx.sections.hero_jVaWmY;
  idx.sections.section_idea = {
    type: 'section',
    settings: {
      content_direction: 'column', horizontal_alignment_flex_direction_column: 'center', vertical_alignment_flex_direction_column: 'center',
      gap: 24, section_width: 'page-width', section_height: '', background_media: 'none', background_color: FABRIC,
      'padding-block-start': 80, 'padding-block-end': 80,
    },
    blocks: {
      icon_clock: { type: 'icon', settings: { icon: 'none', image_upload: IMG('offshft-favicon.png'), width: 64 }, blocks: {} },
      text_idea_title: text('<h2>Everybody has a shift.</h2>', { type_preset: 'h2', width: '100%', alignment: 'center' }),
      text_idea_line: text('<p>The good part is what happens after it.</p>', { type_preset: 'paragraph', width: '100%', alignment: 'center' }),
      button_about: { type: 'button', settings: { label: 'About OFF SHFT', link: '/pages/about', style_class: 'button-secondary' }, blocks: {} },
    },
    block_order: ['icon_clock', 'text_idea_title', 'text_idea_line', 'button_about'],
  };
  delete idx.sections.product_list_fa6P9H;                     // sample "latest products" grid; nothing to show yet
  idx.order = ['section_top', 'section_idea'];
  save('templates/index.json', idx);
}

// Product page: details in an accordion with Shipping, Returns and Size & fit rows that point to the policy
// pages (no unapproved policy terms on the product page); recommendations hidden until there are two hats.
{
  const pr = load('templates/product.json');
  const main = pr.sections.main;
  Object.assign(main.settings, { desktop_media_position: 'left', equal_columns: false, gap: 48, enable_sticky_add_to_cart: false });
  Object.assign(main.blocks['media-gallery'].settings, {
    media_presentation: 'grid', media_columns: 'two', image_gap: 8, large_first_image: true, aspect_ratio: 'adapt',
    constrain_to_viewport: true, media_fit: 'contain', media_radius: 0, extend_media: false, zoom: true, hide_variants: true,
    slideshow_mobile_controls_style: 'dots',
  });
  const pd = main.blocks['product-details'];
  pd.settings.sticky_details_desktop = true;
  pd.blocks.group_icgrde.blocks.text_xrnftG.settings.type_preset = 'h2';
  Object.assign(pd.blocks.group_icgrde.blocks.price_tVjtKg.settings, { show_installments: false, show_tax_info: true, type_preset: 'paragraph' });
  Object.assign(pd.blocks.variant_picker_R3rGDr.settings, { variant_style: 'buttons', show_swatches: true, alignment: 'left' });
  Object.assign(pd.blocks.buy_buttons_eYQEYi.settings, { stacking: true, show_pickup_availability: false });
  const row = (heading, open, blocks, order) => ({ type: '_accordion-row', settings: { heading, open_by_default: open, icon: 'none' }, blocks, block_order: order });
  pd.blocks.accordion_info = {
    type: 'accordion',
    settings: { icon: 'plus', dividers: true, divider_color: OAT, type_preset: 'h5' },
    blocks: {
      row_details: row('Details', true, { product_description: { type: 'product-description', settings: {}, blocks: {} } }, ['product_description']),
      row_shipping: row('Shipping', false, { text_row_shipping: text("<p>Made to order, then shipped to you. You'll see the shipping cost at checkout before you pay. Times and costs: <a href=\"/pages/shipping-returns\">Shipping &amp; returns</a>.</p>") }, ['text_row_shipping']),
      row_returns: row('Returns', false, { text_row_returns: text('<p>Each hat is made for your order. How returns and replacements work: <a href="/pages/shipping-returns">Shipping &amp; returns</a>.</p>') }, ['text_row_returns']),
      row_size: row('Size & fit', false, { text_row_size: text('<p>Measure around your head where a hat sits, then check the range for your style on the <a href="/pages/size-fit">Size &amp; fit</a> page.</p>') }, ['text_row_size']),
    },
    block_order: ['row_details', 'row_shipping', 'row_returns', 'row_size'],
  };
  delete pd.blocks.text_aEtTtq;                                // the description now sits in the Details row
  pd.block_order = pd.block_order.filter((id) => id !== 'text_aEtTtq').concat('accordion_info');
  const rec = pr.sections.product_recommendations_qggXJq;
  rec.blocks.text_cbcgyb.settings.text = '<h2>More hats</h2>';
  rec.blocks.text_cbcgyb.settings.type_preset = 'h4';
  rec.disabled = true;
  save('templates/product.json', pr);
}

// Collection pages: no filters or sorting for a handful of hats
{
  const col = load('templates/collection.json');
  Object.assign(col.sections.main.blocks.filters.settings, { enable_filtering: false, enable_sorting: false, enable_grid_density: false });
  save('templates/collection.json', col);
}

// Password page (until launch)
{
  const pw = load('templates/password.json');
  const b = pw.sections.main.blocks;
  Object.assign(b.logo.settings, { unit: 'pixel', pixel_height: 40 });
  b['text-2'].settings.text = "<p>Hats for the hours you earned. Leave your email and we'll let you know when we open. Unsubscribe any time.</p>";
  Object.assign(b['email-signup'].settings, { label: 'Sign up', style_class: 'button', border_radius: 0, input_text_color: P('foreground'), input_border_color: P('foreground') });
  save('templates/password.json', pw);
}

for (const f of ['config/settings_data.json', 'snippets/theme-styles-variables.liquid', 'sections/header-group.json', 'sections/footer-group.json', 'templates/index.json', 'templates/product.json', 'templates/collection.json', 'templates/password.json']) {
  const buf = fs.readFileSync(path.join(OUT, f));
  console.log(f, buf.length, require('crypto').createHash('md5').update(buf).digest('hex'));
}
