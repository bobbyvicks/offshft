"""Build the local review gallery and optional PDF/ZIP without changing images."""
from pathlib import Path
import argparse
import hashlib
import html
import json
import zipfile

ROOT = Path(__file__).resolve().parent
GROUPS = [
    ("hat", "Hats", "Hat", "Retro Trucker", "Yupoong 6606", 4),
    ("hoodie", "Hoodies", "Hoodie", "Oversized", "AS Colour 5161", 3),
    ("crewneck", "Crewnecks", "Crewneck", "Lightweight", "Comfort Colors 1466", 1),
    ("sweatpants", "Sweatpants", "Sweatpants", "Lightweight", "Comfort Colors 1469", 1),
    ("tee", "T-shirts", "T-Shirt", "Heavyweight", "Comfort Colors 1717", 2),
    ("jacket", "Jackets", "Jacket", "Packable Anorak", "Champion CO200", 1),
]
DESIGNS = {"logo": "OFF SHFT Logo", "clock": "The Clock", "punched-out": "Punched Out."}
NOTE = "AI-generated mockups. Colours are provisional."
PDF_NAME = "OFF-SHFT-Product-Review.pdf"
ZIP_NAME = "OFF-SHFT-Product-Images.zip"


def enriched_catalogue():
    path = ROOT / "catalogue.json"
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    assert len(data) == 17, f"Expected 17 products, found {len(data)}"
    for row in data:
        kind, design = row["key"].split("-", 1)
        group = next(x for x in GROUPS if x[0] == kind)
        row["title"] = f"{DESIGNS[design]} {group[2]}"
        row["firstStyle"] = group[3]
        row["blank"] = group[4]
        row["styleCount"] = group[5]
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return ordered_catalogue(data)


def ordered_catalogue(data):
    rank = {group[0]: n for n, group in enumerate(GROUPS)}
    design_rank = {"logo": 0, "clock": 1, "punched-out": 2}
    return sorted(data, key=lambda r: (rank[r["key"].split("-", 1)[0]], design_rank[r["key"].split("-", 1)[1]]))


def gallery(data):
    e = html.escape
    sections = []
    for key, label, *_ in GROUPS:
        cards = []
        for row in data:
            if row["key"].split("-", 1)[0] != key:
                continue
            cards.append(f'''<article class="card">
  <a class="image" href="{e(row['image'])}" aria-label="View full image: {e(row['title'])}"><img src="{e(row['image'])}" alt="{e(row['title'])} on a warm ivory studio background" width="1254" height="1254" loading="lazy"></a>
  <div class="caption"><h3>{e(row['title'])}</h3><p>{e(row['firstStyle'])} <span aria-hidden="true">/</span> {e(row['blank'])}</p></div>
</article>''')
        sections.append(f'<section id="{key}" aria-labelledby="{key}-title"><div class="section-title"><h2 id="{key}-title">{label}</h2><span>{len(cards):02d}</span></div><div class="grid">' + "\n".join(cards) + '</div></section>')
    nav = "".join(f'<a href="#{key}">{label}</a>' for key, label, *_ in GROUPS)
    page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OFF SHFT - Product image review</title>
<style>
:root{{color-scheme:light;--ink:#1f2733;--paper:#f5f1e8;--bone:#e4ddcb;--rust:#b4552d;--muted:#64655f;--line:#d9d1c3}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth;scroll-padding-top:22px}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}}a{{color:inherit}}main{{max-width:1280px;margin:auto;padding:52px 36px 60px}}header{{border-bottom:1px solid var(--line);padding-bottom:28px}}.eyebrow{{display:flex;justify-content:space-between;gap:16px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}}.wordmark{{font-size:21px;letter-spacing:.12em}}.count{{color:var(--muted);padding-top:5px}}h1{{font-size:clamp(30px,4vw,48px);line-height:1.1;letter-spacing:-.03em;font-weight:500;margin:44px 0 14px}}.note{{font-size:15px;line-height:1.6;color:var(--muted);margin:0}}.actions{{display:flex;flex-wrap:wrap;gap:12px;margin-top:25px}}.actions a{{font-size:13px;font-weight:700;text-decoration:none;padding:12px 16px;border:1px solid var(--line);border-radius:3px}}.actions a:first-child{{background:var(--ink);border-color:var(--ink);color:var(--paper)}}.actions a:hover{{border-color:var(--rust)}}nav{{display:flex;flex-wrap:wrap;gap:10px 25px;padding:22px 0 5px}}nav a{{font-size:13px;text-decoration:none;color:var(--muted)}}nav a:hover{{color:var(--rust)}}section{{padding-top:32px}}.section-title{{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:15px;border-bottom:1px solid var(--line);padding-bottom:10px}}h2{{font-size:22px;letter-spacing:-.02em;font-weight:500;margin:0}}.section-title span{{font-size:12px;color:var(--muted)}}.grid{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}}.card{{min-width:0}}.image{{display:block;background:var(--bone);border-radius:3px;overflow:hidden}}.image img{{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}}.image:focus-visible{{outline:3px solid var(--rust);outline-offset:4px}}.caption{{padding:14px 0 5px}}h3{{font-size:16px;font-weight:600;line-height:1.35;margin:0 0 5px}}.caption p{{font-size:12px;color:var(--muted);line-height:1.5;margin:0}}.caption span{{margin:0 4px;color:#b4aa9a}}footer{{display:flex;justify-content:space-between;gap:20px;margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}}footer a{{text-decoration:none}}@media(max-width:760px){{main{{padding:30px 20px 40px}}.grid{{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}}h1{{margin-top:32px}}.wordmark{{font-size:18px}}.count{{font-size:10px}}}}@media(max-width:460px){{.grid{{grid-template-columns:1fr}}footer{{display:block}}footer a{{display:block;margin-top:10px}}}}@media print{{main{{padding:0}}nav,.actions,footer{{display:none}}.grid{{grid-template-columns:repeat(3,1fr)}}section{{break-inside:avoid}}.image img{{max-height:210px}}h1{{margin-top:20px}}}}
</style></head><body><main>
<header><div class="eyebrow"><span class="wordmark">OFF SHFT</span><span class="count">17 products / Draft review</span></div><h1>Product image review</h1><p class="note">{NOTE} Each image shows the first style in its listing.</p><div class="actions"><a href="{PDF_NAME}">Open contact sheet</a><a href="{ZIP_NAME}" download>Download image package</a></div></header>
<nav aria-label="Product categories">{nav}</nav>
{''.join(sections)}
<footer><span>OFF SHFT / First drop</span><a href="catalogue.json">View catalogue data</a></footer>
</main></body></html>'''
    (ROOT / "index.html").write_text(page, encoding="utf-8")


def update_readme():
    path = ROOT / "README.md"
    text = path.read_text(encoding="utf-8-sig")
    marker = "\n## Review files\n"
    if marker in text:
        text = text.split(marker)[0]
    text += marker + f'''\n- Open `index.html` for the local gallery. It works directly from the extracted folder with no server or external assets.
- `{PDF_NAME}` is a three-page contact sheet using the original PNG images without cropping.
- `{ZIP_NAME}` contains the 17 original images, gallery, contact sheet, catalogue, README, verification manifest, and generation prompt metadata.
- `image-verification.json` records decoded image dimensions, byte counts and SHA-256 checksums.

The catalogue's `title`, `firstStyle`, `blank` and `styleCount` fields describe the existing listing and the first selected blank. Existing keys, Shopify IDs, admin URLs and filenames are preserved. The separate `shopify-updates.json` is maintained by the upload workflow and is not included in the review archive.
'''
    path.write_text(text, encoding="utf-8")


def verify_images(data, write_manifest=True):
    from PIL import Image
    result = []
    for row in data:
        path = ROOT / row["image"]
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            image.load()
            width, height = image.size
        assert width == height and width > 0, f"Not square: {path}"
        result.append({"key": row["key"], "image": row["image"], "width": width, "height": height, "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    if write_manifest:
        (ROOT / "image-verification.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


def contact_sheet(data):
    from io import BytesIO
    from PIL import Image
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import HexColor
    from reportlab.lib.pagesizes import landscape, A4
    from reportlab.lib.utils import ImageReader
    from pypdf import PdfReader
    width, height = landscape(A4)
    pdf = canvas.Canvas(str(ROOT / PDF_NAME), pagesize=(width, height), pageCompression=1)
    pdf.setTitle("OFF SHFT - Product Image Review")
    pdf.setAuthor("OFF SHFT")
    pdf.setSubject("17 draft AI product mockups; colours provisional")
    ink, muted, paper = HexColor("#1f2733"), HexColor("#64655f"), HexColor("#f5f1e8")
    margin, gap = 34, 18
    cell = (width - 2 * margin - 2 * gap) / 3
    image_size = 181
    pages = (len(data) + 5) // 6
    for page in range(pages):
        pdf.setFillColor(paper)
        pdf.rect(0, 0, width, height, fill=1, stroke=0)
        pdf.setFillColor(ink)
        pdf.setFont("Helvetica-Bold", 19)
        pdf.drawString(margin, height - 36, "OFF SHFT")
        pdf.setFont("Helvetica", 10)
        pdf.drawRightString(width - margin, height - 34, f"Product image review  /  {page + 1:02d}")
        pdf.setFillColor(muted)
        pdf.setFont("Helvetica", 8)
        pdf.drawString(margin, height - 54, NOTE)
        for idx, row in enumerate(data[page * 6:(page + 1) * 6]):
            col, line = idx % 3, idx // 3
            x = margin + col * (cell + gap)
            top = height - 75 - line * 236
            # Compress only the PDF preview in memory; retain source PNG bytes and resolution.
            preview = BytesIO()
            with Image.open(ROOT / row["image"]) as source:
                source.convert("RGB").save(preview, format="JPEG", quality=88, optimize=True)
            preview.seek(0)
            pdf.drawImage(ImageReader(preview), x + (cell - image_size) / 2, top - image_size, image_size, image_size, preserveAspectRatio=True)
            pdf.setFillColor(ink)
            pdf.setFont("Helvetica-Bold", 10)
            pdf.drawCentredString(x + cell / 2, top - image_size - 17, row["title"])
            pdf.setFillColor(muted)
            pdf.setFont("Helvetica", 8)
            pdf.drawCentredString(x + cell / 2, top - image_size - 31, row["firstStyle"] + " / " + row["blank"])
        pdf.setStrokeColor(HexColor("#d9d1c3"))
        pdf.line(margin, 28, width - margin, 28)
        pdf.setFillColor(muted)
        pdf.setFont("Helvetica", 7)
        pdf.drawString(margin, 16, "First style per listing - uncropped previews")
        pdf.drawRightString(width - margin, 16, f"{page + 1} / {pages}")
        pdf.showPage()
    pdf.save()
    reader = PdfReader(str(ROOT / PDF_NAME))
    assert len(reader.pages) == 3
    text = "\n".join(page.extract_text() for page in reader.pages)
    assert all(row["title"] in text for row in data), "Missing product caption in contact sheet"


def package(data, before):
    fixed = [ROOT / name for name in ["catalogue.json", "README.md", "index.html", PDF_NAME, "image-verification.json"]]
    metadata = [path for path in ROOT.glob("*.json") if path.name not in {"catalogue.json", "shopify-updates.json", "image-verification.json"}]
    paths = fixed + metadata + [ROOT / row["image"] for row in data]
    with zipfile.ZipFile(ROOT / ZIP_NAME, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in paths:
            archive.write(path, "OFF-SHFT-Product-Images/" + path.relative_to(ROOT).as_posix())
    for item in before:
        assert hashlib.sha256((ROOT / item["image"]).read_bytes()).hexdigest() == item["sha256"], "Image was changed"
    with zipfile.ZipFile(ROOT / ZIP_NAME) as archive:
        assert archive.testzip() is None
        assert sum(name.endswith(".png") for name in archive.namelist()) == 17
    print(json.dumps({"images": len(before), "pdf_pages": 3, "pdf_bytes": (ROOT / PDF_NAME).stat().st_size, "archive_files": len(paths), "archive_bytes": (ROOT / ZIP_NAME).stat().st_size, "image_bytes_unchanged": True}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--finalize", action="store_true")
    parser.add_argument("--package-only", action="store_true", help="Rebuild PDF/ZIP without changing gallery, catalogue or metadata")
    args = parser.parse_args()
    if args.package_only:
        data = ordered_catalogue(json.loads((ROOT / "catalogue.json").read_text(encoding="utf-8-sig")))
        before = verify_images(data, write_manifest=False)
        recorded = {item["image"]: item["sha256"] for item in json.loads((ROOT / "image-verification.json").read_text(encoding="utf-8"))}
        assert all(item["sha256"] == recorded[item["image"]] for item in before), "Source PNG differs from recorded hash"
        contact_sheet(data)
        package(data, before)
    else:
        data = enriched_catalogue()
        gallery(data)
        update_readme()
        if args.finalize:
            before = verify_images(data)
            contact_sheet(data)
            package(data, before)
        else:
            print("Gallery and catalogue ready; PDF and ZIP await all 17 final images.")
