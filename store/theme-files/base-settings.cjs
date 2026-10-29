// Horizon 4.3.0's config/settings_data.json exactly as this store installed it (checksum 3eccf92f8fb8da3ec15c1a326570f822).
// build.cjs starts from this and applies store/theme.md on top.
const P = (k) => `{{ settings.color_palette.${k} }}`;
const current = {
  logo_height: 36, logo_height_mobile: 28,
  page_background_color: P('background'), page_width: 'narrow', page_text_color: P('foreground'),
  type_body_font: 'inter_n4', type_subheading_font: 'inter_n5', type_heading_font: 'inter_n7', type_accent_font: 'inter_n7',
  type_size_paragraph: '14', type_line_height_paragraph: 'body-loose',
  type_font_h1: 'heading', type_size_h1: '56', type_line_height_h1: 'display-tight', type_letter_spacing_h1: 'heading-normal', type_case_h1: 'none',
  type_font_h2: 'heading', type_size_h2: '48', type_line_height_h2: 'display-tight', type_letter_spacing_h2: 'heading-normal', type_case_h2: 'none',
  type_font_h3: 'heading', type_size_h3: '32', type_line_height_h3: 'display-normal', type_letter_spacing_h3: 'heading-normal', type_case_h3: 'none',
  type_font_h4: 'heading', type_size_h4: '24', type_line_height_h4: 'display-tight',
  type_font_h5: 'subheading', type_size_h5: '14', type_line_height_h5: 'display-loose',
  type_font_h6: 'subheading', type_size_h6: '12', type_line_height_h6: 'display-loose',
  page_transition_enabled: false, transition_to_main_product: false, card_hover_effect: 'none',
  badge_position: 'top-right', badge_corner_radius: 100,
  badge_sale_background_color: P('background'), badge_sale_text_color: P('foreground'),
  badge_sold_out_background_color: '#eef1ea', badge_sold_out_text_color: P('foreground'), badge_text_transform: 'none',
  palette_primary_button_background: P('foreground'), palette_primary_button_text: P('background'), palette_primary_button_border: P('foreground'),
  primary_button_border_width: 0, button_border_radius_primary: 14,
  palette_secondary_button_background: 'rgba(0,0,0,0)', palette_secondary_button_text: P('foreground'), palette_secondary_button_border: P('foreground'),
  secondary_button_border_width: 1, button_border_radius_secondary: 14,
  cart_type: 'drawer', cart_price_font: 'subheading', show_cart_note: false, show_add_discount_code: true,
  drawer_background_color: P('background'), drawer_text_color: P('foreground'), drawer_border_color: P('color2'),
  icon_stroke: 'default',
  palette_input_background: P('background'), palette_input_text: P('color1'), palette_input_border: P('color2'),
  input_border_width: 1, inputs_border_radius: 4,
  popover_background_color: P('background'), popover_text_color: P('foreground'), popover_border_radius: 14,
  popover_border_color: P('color2'), popover_border_width: 1,
  currency_code_enabled_product_pages: false, currency_code_enabled_product_cards: false, currency_code_enabled_cart_items: false,
  quick_add_background: P('background'), quick_add_text: P('foreground'),
  product_corner_radius: 0, card_corner_radius: 4,
  show_variant_image: false, variant_swatch_width: 34, variant_swatch_height: 34, variant_swatch_radius: 32,
  palette_variant_background: P('background'), palette_variant_text: P('foreground'), palette_variant_border: P('color2'),
  palette_selected_variant_background: P('foreground'), palette_selected_variant_text: P('background'), palette_selected_variant_border: P('foreground'),
  variant_button_border_width: 1, variant_button_radius: 14, variant_button_width: 'equal-width-buttons',
  color_palette: { background: '#ffffff', foreground: '#000000', color1: '#333333', color2: '#DFDFDF' },
};
const HEADER = `/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
`;
const render = (data) => HEADER + JSON.stringify(data, null, 2) + '\n';
module.exports = { current, presets: { Horizon: { ...current } }, render, HEADER };
if (require.main === module) process.stdout.write(render({ current, presets: { Horizon: current } }));
