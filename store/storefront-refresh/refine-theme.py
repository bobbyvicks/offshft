"""Refine prepared native Horizon templates without changing theme code or config."""
from pathlib import Path
import copy
import json

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
THEME = ROOT / "theme"
BASE = REPO / "store/theme-files/out"


def read(path):
    source = path.read_text(encoding="utf-8-sig")
    return json.loads(source[source.index("{"):])


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


index = read(THEME / "templates/index.json")
hero = index["sections"]["offshft_hero"]
hero["settings"].update({
    "image_1": "shopify://shop_images/offshft-home-hero-evergreen.png",
    "custom_mobile_media": True,
    "media_type_1_mobile": "image",
    "image_1_mobile": "shopify://shop_images/offshft-home-hero-evergreen-mobile.png",
    "stack_media_on_mobile": False,
    "content_direction": "column",
    "horizontal_alignment_flex_direction_column": "flex-start",
    "vertical_alignment_flex_direction_column": "center",
    "align_baseline": False,
    "gap": 20,
    "background_color": "#ECE5D3",
    "toggle_overlay": False,
    "blurred_reflection": False,
    "padding-block-start": 32,
    "padding-block-end": 32,
})
for key in ("text_YLPk4p", "text_brand_line"):
    hero["blocks"][key]["settings"].update({"text_color": "#1F2733", "alignment": "left"})
hero["blocks"]["button_H9gpTf"]["settings"].update({
    "custom_button_background": "#1F2733",
    "custom_button_text": "#ECE5D3",
    "custom_button_border": "#1F2733",
})
write(THEME / "templates/index.json", index)

footer = read(THEME / "sections/footer-group.json")
footer_main = footer["sections"]["footer_m9NzUG"]
group = copy.deepcopy(footer_main["blocks"]["group_brand"])
group["settings"]["gap"] = 12
group["name"] = "Explore OFF SHFT"
group["blocks"] = {
    "heading_explore": {"type": "text", "settings": {
        "text": "<h2>Explore</h2>", "type_preset": "h3", "text_color": "#ECE5D3", "alignment": "left"
    }, "blocks": {}},
}
for key, label, href in (("shop", "Shop the collection", "/collections/all"), ("about", "About OFF SHFT", "/pages/about"), ("contact", "Contact", "/pages/contact")):
    group["blocks"]["link_" + key] = {"type": "text", "settings": {
        "text": f'<p><a href="{href}">{label}</a></p>',
        "type_preset": "paragraph", "text_color": "#ECE5D3", "alignment": "left"
    }, "blocks": {}}
group["block_order"] = ["heading_explore", "link_shop", "link_about", "link_contact"]
footer_main["blocks"]["menu_footer"] = group
write(THEME / "sections/footer-group.json", footer)

password = read(BASE / "templates/password.json")
password_main = password["sections"]["main"]
password_main["blocks"]["text"]["settings"].update({
    "text": "<h1>Opening soon</h1>", "alignment": "center", "width": "100%", "text_color": "#1F2733"
})
password_main["blocks"]["text-2"]["settings"].update({
    "text": "<p>For the hours you earned.</p><p>Hats, hoodies and sweats for your time off. Leave your email and we'll let you know when we open. Unsubscribe any time.</p>",
    "alignment": "center", "width": "100%", "text_color": "#1F2733"
})
password_main["blocks"]["logo"]["settings"].update({"inverse": False, "pixel_height": 40})
write(THEME / "templates/password.json", password)

header = read(BASE / "sections/header-group.json")
announcement = header["sections"]["header_announcements_9jGBFp"]["blocks"]["announcement_BxgCk9"]["settings"]
announcement.update({"text": "You put in the hours. This time is yours.", "link": "/collections/all"})
hero_css = """.hero[id$=\"__offshft_hero\"]{min-height:50vw}.hero[id$=\"__offshft_hero\"] .hero__content-wrapper>.text-block{max-width:min(40vw,28rem)}.hero[id$=\"__offshft_hero\"] h1{font-size:clamp(1.5rem,3.2vw,3rem);line-height:1.15}.hero[id$=\"__offshft_hero\"] .hero__content-wrapper{justify-content:center;align-items:flex-start}@media(max-width:749px){.hero[id$=\"__offshft_hero\"]{min-height:150vw}.hero[id$=\"__offshft_hero\"] .hero__container{padding-block-start:24px;padding-block-end:24px}.hero[id$=\"__offshft_hero\"] .hero__content-wrapper{justify-content:flex-start;gap:14px}.hero[id$=\"__offshft_hero\"] .hero__content-wrapper>.text-block{max-width:100%}.hero[id$=\"__offshft_hero\"] h1{font-size:clamp(1.5rem,7.2vw,2rem);line-height:1.15}.hero[id$=\"__offshft_hero\"] .hero__content-wrapper p{font-size:1rem;line-height:1.35}}"""
header["sections"]["custom_liquid_brand_css"]["settings"]["custom_liquid"] = (
    "<style>html:root{--letter-spacing--heading-loose:.12em;--opacity-muted-text:.7}" + hero_css + "</style>\n\n"
    + (REPO / "store/pocket-preview-fix/pocket-preview-snippet.liquid").read_text(encoding="utf-8").strip()
)
write(THEME / "sections/header-group.json", header)

print("Prepared index, footer-group, password and header-group as minified JSON.")
