#!/usr/bin/env python3
"""Build the four-concept review package without altering any source image.

Dependencies: reportlab, pypdfium2. Paths are relative to this file; the builder
also works from the extracted ZIP, whose source folders live under concepts/.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import mimetypes
import re
from datetime import datetime, timezone
from pathlib import Path
import zipfile

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parent
PDF_NAME = 'OFF-SHFT-Next-Round-Review.pdf'
ZIP_NAME = 'OFF-SHFT-Next-Round.zip'
BACKGROUND = '#F4F0E7'
INK = '#1F2733'
MUTED = '#62675F'
RUST = '#B4552D'
PAPER = '#FFFEFA'
RULE = '#DCD7CB'
STATUS = 'Draft concepts / not released products'
GENERAL_NOTE = (
    'Concept mockups illustrate placement and garment character. Artwork, colour, '
    'scale and stitching require a physical production proof or sample. Phrase '
    'checks were preliminary and indexed; no commercial clearance is claimed.'
)
CONCEPTS = [
    {
        'folder': '11-time-well-earned', 'number': '11', 'title': 'TIME WELL EARNED.',
        'garment': 'Comfort Colors 1717 tee', 'colour': 'Blue Spruce',
        'variant': 'dark', 'thread': 'Bone / Sun', 'art_background': '#2E3D35',
        'placement': 'Three lines at the chest', 'method': 'Embroidery study',
        'production': 'Digitization at this size and a sew-out on the actual tee are required.',
        'phrase': 'Exact wording appeared on a retirement ornament. Preliminary screening is not clearance.',
    },
    {
        'folder': '12-the-rest-is-ours', 'number': '12', 'title': 'THE REST IS OURS.',
        'garment': 'Comfort Colors 1467 hoodie', 'colour': 'Blue Jean',
        'variant': 'light', 'thread': 'Ink / Rust', 'art_background': '#ECE5D3',
        'mockup_view': 'Back view',
        'placement': 'Upper-back print; approved logo separately on the front',
        'method': 'Back-print study',
        'production': 'Proof the back print and front logo placement separately. Natural cream drawcords.',
        'phrase': 'Exact wording appeared in art and music titles. Preliminary screening is not clearance.',
    },
    {
        'folder': '13-ours-to-spend', 'number': '13', 'title': 'OURS TO SPEND.',
        'garment': 'Yupoong 6606 trucker', 'colour': 'Evergreen',
        'variant': 'dark', 'thread': 'Bone / Sun', 'art_background': '#2E3D35',
        'placement': 'Two lines on the hat front', 'method': 'Embroidery study',
        'production': 'Check the centre seam against the phrase. Digitization and a hat sew-out are required.',
        'phrase': 'No exact apparel result surfaced in the limited search. This does not establish availability.',
    },
    {
        'folder': '14-five-oclock', 'number': '14', 'title': '5:00',
        'garment': 'Comfort Colors 1466 crewneck', 'colour': 'Ivory',
        'variant': 'light', 'thread': 'Ink / Rust', 'art_background': '#ECE5D3',
        'placement': 'Ordinary numerals at centre chest', 'method': 'Embroidery study',
        'production': 'Low-profile embroidery. The digitizer must choose fill for the larger strokes; a crewneck sew-out is required.',
        'phrase': 'Related five-o\'clock apparel and a Canadian record surfaced. Plain 5:00 is not cleared.',
    },
]


def source_directory() -> Path:
    bundled = ROOT / 'concepts'
    return bundled if bundled.is_dir() else ROOT.parent


def research_path() -> Path:
    if (ROOT / 'concepts').is_dir():
        return ROOT / 'next-round-research.md'
    return ROOT.parent / 'next-round-research.md'


def portable_research_text(context: str = 'root') -> str:
    """Adjust bundle-only local links without editing the original research."""
    text = research_path().read_text(encoding='utf-8-sig')
    text = re.sub(r'\[([^\]]+)\]\(\.\./(?:AGENTS|README|BRAND|DESIGNS)\.md\)', r'\1', text)
    target = 'concepts/mark/final/the-o/notes.md' if context == 'root' else 'mark/final/the-o/notes.md'
    text = re.sub(r'\]\((?:concepts/)?mark/final/the-o/notes\.md\)', '](' + target + ')', text)
    explanation = (
        'Bundle reference note: AGENTS, README, BRAND and DESIGNS above refer to the '
        'historical source repository. Their local links are omitted because the full '
        'repository is not part of this concept package. The canonical artwork notes '
        'and external research sources remain linked. The original research file is unchanged.'
    )
    if 'Bundle reference note:' not in text:
        text = text.rstrip() + '\n\n' + explanation + '\n'
    return text


def font_paths() -> list[Path]:
    base = ROOT / 'fonts'
    if not base.is_dir():
        base = ROOT.parent / 'brand-system' / 'fonts'
    return [base / 'Archivo-Bold.ttf', base / 'Archivo-SemiBold.ttf']


def font_license_path() -> Path:
    beside_fonts = font_paths()[0].parent / 'OFL-Archivo.txt'
    if beside_fonts.is_file():
        return beside_fonts
    return ROOT.parent.parent / 'tools' / 'fonts' / 'OFL-Archivo.txt'


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def text_uri(text: str) -> str:
    return 'data:text/plain;charset=utf-8;base64,' + base64.b64encode(text.encode('utf-8')).decode('ascii')


def read_sources(require_mockups: bool = True) -> list[dict]:
    concepts = []
    missing = []
    for item in CONCEPTS:
        concept = dict(item)
        directory = source_directory() / item['folder']
        required = ['design.svg', 'design-light.svg', 'design-dark.png',
                    'design-light.png', 'notes.md', 'measurements.json']
        if require_mockups:
            required.append('mockup-v2.png')
        missing.extend(str(directory / name) for name in required if not (directory / name).is_file())
        concept['directory'] = directory
        concept['mockup'] = directory / 'mockup-v2.png'
        concept['artwork'] = directory / f'design-{item["variant"]}.png'
        concept['svg'] = directory / ('design.svg' if item['variant'] == 'dark' else 'design-light.svg')
        if (directory / 'measurements.json').is_file():
            concept['measurements'] = json.loads((directory / 'measurements.json').read_text(encoding='utf-8-sig'))
        concepts.append(concept)
    if not research_path().is_file():
        missing.append(str(research_path()))
    if any(path.is_file() for path in font_paths()) and not font_license_path().is_file():
        missing.append(str(font_license_path()))
    for name in ['logo-light.svg', 'logo-dark.svg', 'notes.md']:
        reference = source_directory() / 'mark' / 'final' / 'the-o' / name
        if not reference.is_file():
            missing.append(str(reference))
    if missing:
        raise SystemExit('Required source files are not ready; no outputs were written:\n' + '\n'.join(missing))
    return concepts


def dimensions(concept: dict) -> str:
    measured = concept['measurements']
    return f"{measured['artworkWidthMm']:g} x {measured['artworkHeightMm']:.1f} mm"


def build_gallery(concepts: list[dict]) -> None:
    cards = []
    for concept in concepts:
        esc = html.escape
        notes = (concept['directory'] / 'notes.md').read_text(encoding='utf-8-sig')
        cards.append(f'''
        <article class="card" aria-labelledby="title-{concept['number']}">
          <div class="visual" style="--art-bg:{concept['art_background']}">
            <img class="photo" src="{data_uri(concept['mockup'])}" alt="Concept mockup{': ' + esc(concept['mockup_view']) if concept.get('mockup_view') else ''}: {esc(concept['title'])} on {esc(concept['colour'])} {esc(concept['garment'])}">
            <div class="artwork" hidden><img src="{data_uri(concept['artwork'])}" alt="Exact draft artwork, {esc(concept['thread'])}"></div>
            <span class="number">{concept['number']}</span>
            <span class="visual-label" data-photo-label="CONCEPT MOCKUP{' / BACK VIEW' if concept.get('mockup_view') else ''}">CONCEPT MOCKUP{' / BACK VIEW' if concept.get('mockup_view') else ''}</span>
          </div>
          <div class="card-copy">
            <p class="eyebrow">{esc(concept['colour'])} / {esc(concept['method'])}</p>
            <h2 id="title-{concept['number']}">{esc(concept['title'])}</h2>
            <p class="garment">{esc(concept['garment'])}</p>
            <p>{esc(concept['placement'])}. Draft artwork {dimensions(concept)}; {esc(concept['thread'])}.</p>
            <div class="downloads">
              <a href="{data_uri(concept['svg'])}" download="{concept['folder']}-{concept['variant']}.svg">Selected SVG <span aria-hidden="true">&#8595;</span></a>
              <a href="{data_uri(concept['directory'] / 'design.svg')}" download="{concept['folder']}-dark.svg">Dark SVG</a>
              <a href="{data_uri(concept['directory'] / 'design-light.svg')}" download="{concept['folder']}-light.svg">Light SVG</a>
              <a href="{text_uri(notes)}" download="{concept['folder']}-notes.md">Notes</a>
            </div>
            <details><summary>Production and phrase review</summary>
              <p>{esc(concept['production'])}</p><p>{esc(concept['phrase'])}</p>
            </details>
          </div>
        </article>''')
    research = portable_research_text()
    document = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OFF SHFT - Next round concepts</title>
<style>
:root{color-scheme:light;--ink:#1f2733;--muted:#62675f;--warm:#f4f0e7;--line:#dcd7cb;--rust:#b4552d}
*{box-sizing:border-box}body{margin:0;background:var(--warm);color:var(--ink);font:16px/1.55 Arial,Helvetica,sans-serif}
main{max-width:1240px;margin:auto;padding:44px 30px 48px}.brand{font-size:22px;font-weight:800;letter-spacing:.08em}
header{border-bottom:1px solid var(--line);padding-bottom:26px}.topline{display:flex;justify-content:space-between;gap:20px;align-items:center}
.status{font-size:12px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--line);border-radius:99px;padding:7px 12px}
h1{font-size:clamp(34px,5vw,58px);font-weight:700;line-height:1.08;letter-spacing:-.035em;margin:36px 0 16px}
.intro{max-width:780px;font-size:18px;color:var(--muted);margin:0}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:24px 0}
.modes{display:flex;gap:4px;border:1px solid var(--line);border-radius:99px;padding:4px;background:#fffefa}
button{font:inherit;font-size:14px;border:0;border-radius:99px;padding:9px 17px;background:transparent;color:var(--ink);cursor:pointer}
button[aria-pressed=true]{background:var(--ink);color:#fffefa}a{color:inherit;text-underline-offset:3px}.toolbar a{font-size:14px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px}.card{min-width:0;background:#fffefa;border:1px solid var(--line);border-radius:16px;overflow:hidden}
.visual{position:relative;aspect-ratio:1/1;background:#f1ece2;padding:18px}.photo{display:block;width:100%;height:100%;object-fit:contain}
.artwork{width:100%;height:100%;background:var(--art-bg);border-radius:5px;align-items:center;justify-content:center;padding:13%}
.artwork:not([hidden]){display:flex}.artwork img{width:100%;height:100%;object-fit:contain}.photo[hidden]{display:none}
.number,.visual-label{position:absolute;top:29px;background:rgba(255,254,250,.94);font-size:11px;line-height:1;padding:8px 10px;border-radius:99px;letter-spacing:.08em}
.number{left:29px}.visual-label{right:29px}.card-copy{padding:23px 25px 25px}.eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--rust);margin:0 0 9px}
h2{font-size:clamp(23px,2.6vw,31px);line-height:1.15;letter-spacing:-.025em;margin:0 0 11px}.garment{font-size:15px;font-weight:700;margin:0 0 10px}
.card-copy>p:not(.eyebrow):not(.garment){font-size:14px;color:var(--muted);margin:0 0 18px}.downloads{display:flex;flex-wrap:wrap;gap:9px 18px;font-size:12px;font-weight:700}
details{margin-top:20px;border-top:1px solid var(--line);padding-top:15px;font-size:13px;color:var(--muted)}summary{color:var(--ink);cursor:pointer}details p{margin:12px 0 0}
footer{margin-top:34px;padding-top:24px;border-top:1px solid var(--line);display:grid;grid-template-columns:1.6fr 1fr;gap:30px;font-size:13px;color:var(--muted)}footer p{margin:0 0 12px}
button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--rust);outline-offset:4px}
@media(max-width:700px){main{padding:24px 16px}.topline{align-items:flex-start;flex-direction:column;gap:12px}.grid{grid-template-columns:1fr;gap:22px}.card-copy{padding:22px}footer{grid-template-columns:1fr;gap:8px}.visual{padding:14px}.number,.visual-label{top:24px}.number{left:24px}.visual-label{right:24px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
@media print{.toolbar,.downloads,details{display:none}.grid{gap:16px}.card{break-inside:avoid}main{padding:0}header{margin-bottom:24px}}
</style></head><body><main>
<header><div class="topline"><div class="brand">OFF SHFT</div><div class="status">Draft concepts / not released products</div></div>
<h1>The next four.</h1><p class="intro">A quiet typographic collection for time after work. Four concepts, each paired with a specific garment for review.</p></header>
<div class="toolbar"><div class="modes" role="group" aria-label="Image view"><button type="button" data-mode="photo" aria-pressed="true">Concept mockups</button><button type="button" data-mode="art" aria-pressed="false">Exact draft artwork</button></div>
<a href="''' + PDF_NAME + '''" download>Download five-page review PDF</a></div>
<section class="grid" aria-label="Four design concepts">''' + '\n'.join(cards) + '''</section>
<footer><div><p><strong>Review stage only.</strong> ''' + html.escape(GENERAL_NOTE) + '''</p>
<p>The artwork view uses the source PNG intact. Mockup artwork may approximate the source; the supplied SVG and measurements govern exact glyphs and placement.</p></div>
<div><p><a href="''' + text_uri(research) + '''" download="next-round-research.md">Download preliminary research and sources</a></p>
<p>The research records earlier proposed pairings. The four cards above show the current concept brief. Existing OFF SHFT marks are unchanged.</p></div></footer>
</main><script>
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
 const art=button.dataset.mode==='art';
 document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelectorAll('.photo').forEach(item=>item.hidden=art);
 document.querySelectorAll('.artwork').forEach(item=>item.hidden=!art);
 document.querySelectorAll('.visual-label').forEach(item=>item.textContent=art?'EXACT DRAFT ARTWORK':item.dataset.photoLabel);
}));
</script></body></html>'''
    (ROOT / 'index.html').write_text(document, encoding='utf-8')


def register_fonts() -> tuple[str, str]:
    regular, bold = 'Helvetica', 'Helvetica-Bold'
    for path in font_paths():
        if path.is_file():
            name = path.stem
            pdfmetrics.registerFont(TTFont(name, str(path)))
            if 'Bold' in name and 'Semi' not in name:
                bold = name
    return regular, bold


def fit_image(pdf: canvas.Canvas, path: Path, x: float, y: float, width: float, height: float) -> None:
    image = ImageReader(str(path))
    source_width, source_height = image.getSize()
    scale = min(width / source_width, height / source_height)
    draw_width, draw_height = source_width * scale, source_height * scale
    pdf.drawImage(image, x + (width - draw_width) / 2, y + (height - draw_height) / 2,
                  width=draw_width, height=draw_height, mask='auto')


def paragraph(pdf: canvas.Canvas, text: str, x: float, top: float, width: float,
              font: str, size: float = 10, colour: str = MUTED, leading: float | None = None) -> float:
    style = ParagraphStyle('copy', fontName=font, fontSize=size, leading=leading or size * 1.35,
                           textColor=colors.HexColor(colour))
    block = Paragraph(html.escape(text), style)
    _, height = block.wrap(width, 2000)
    block.drawOn(pdf, x, top - height)
    return top - height


def build_pdf(concepts: list[dict]) -> None:
    regular, bold = register_fonts()
    width, height = landscape(A4)
    pdf = canvas.Canvas(str(ROOT / PDF_NAME), pagesize=(width, height), pageCompression=1)
    pdf.setTitle('OFF SHFT - Next round concept review')
    pdf.setAuthor('OFF SHFT')
    pdf.setSubject('Four draft design concepts; not released products')

    def frame(page: int, section: str) -> None:
        pdf.setFillColor(colors.HexColor(BACKGROUND))
        pdf.rect(0, 0, width, height, fill=1, stroke=0)
        pdf.setFont(bold, 17)
        pdf.setFillColor(colors.HexColor(INK))
        pdf.drawString(34, height - 34, 'OFF SHFT')
        pdf.setFont(regular, 8)
        pdf.drawRightString(width - 34, height - 31, f'NEXT ROUND / {section} / {page:02d}')
        pdf.setStrokeColor(colors.HexColor(RULE))
        pdf.line(34, 31, width - 34, 31)
        pdf.setFont(regular, 7.5)
        pdf.setFillColor(colors.HexColor(MUTED))
        pdf.drawString(34, 18, 'DRAFT CONCEPTS - NOT RELEASED PRODUCTS. Physical proofs and phrase review required.')
        pdf.drawRightString(width - 34, 18, f'{page} / 5')

    frame(1, 'OVERVIEW')
    paragraph(pdf, 'The next four.', 34, height - 53, 650, bold, 27, INK, 31)
    paragraph(pdf, 'Four garment pairings for review. Mockup views are illustrative; supplied SVGs control the draft artwork.',
              34, height - 91, width - 68, regular, 10)
    gap = 18
    card_width = (width - 68 - gap) / 2
    card_height = 199
    top = height - 119
    for index, concept in enumerate(concepts):
        x = 34 + (index % 2) * (card_width + gap)
        y = top - (index // 2) * (card_height + 14) - card_height
        pdf.setFillColor(colors.HexColor(PAPER))
        pdf.roundRect(x, y, card_width, card_height, 8, fill=1, stroke=0)
        fit_image(pdf, concept['mockup'], x + 12, y + 13, 174, card_height - 26)
        text_x = x + 201
        text_width = card_width - 217
        text_top = y + card_height - 18
        text_top = paragraph(pdf, f"{concept['number']} / {concept['method'].upper()}", text_x, text_top,
                             text_width, bold, 7.5, RUST)
        text_top = paragraph(pdf, concept['title'], text_x, text_top - 11, text_width, bold, 16, INK, 19)
        text_top = paragraph(pdf, concept['colour'], text_x, text_top - 12, text_width, bold, 10, INK)
        text_top = paragraph(pdf, concept['garment'], text_x, text_top - 4, text_width, regular, 9)
        paragraph(pdf, dimensions(concept) + ' draft artwork\n' + concept['thread'],
                  text_x, text_top - 12, text_width, regular, 8)
    pdf.showPage()

    for index, concept in enumerate(concepts, start=2):
        frame(index, f"CONCEPT {concept['number']}")
        paragraph(pdf, concept['title'], 34, height - 54, width - 68, bold, 27, INK, 31)
        paragraph(pdf, f"{concept['colour']} / {concept['garment']} / {concept['method']}",
                  34, height - 91, width - 68, regular, 10)
        panel_x, panel_y, panel_width, panel_height = 34, 78, 465, 385
        pdf.setFillColor(colors.HexColor(PAPER))
        pdf.roundRect(panel_x, panel_y, panel_width, panel_height, 10, fill=1, stroke=0)
        fit_image(pdf, concept['mockup'], panel_x + 13, panel_y + 13, panel_width - 26, panel_height - 26)
        side_x, side_width = 522, width - 556
        art_top, art_height = 463, 112
        pdf.setFillColor(colors.HexColor(concept['art_background']))
        pdf.roundRect(side_x, art_top - art_height, side_width, art_height, 7, fill=1, stroke=0)
        fit_image(pdf, concept['artwork'], side_x + 22, art_top - art_height + 18, side_width - 44, art_height - 36)
        text_top = paragraph(pdf, 'EXACT DRAFT ARTWORK / ' + concept['thread'].upper(),
                             side_x, 338, side_width, bold, 8, RUST)
        measured = concept['measurements']
        text_top = paragraph(pdf, f"{dimensions(concept)}. Cap height {measured['capHeightMm']:.1f} mm.",
                             side_x, text_top - 8, side_width, regular, 10, INK)
        text_top = paragraph(pdf, concept['placement'] + '.', side_x, text_top - 8, side_width, regular, 10, INK)
        text_top = paragraph(pdf, 'PRODUCTION SAMPLE', side_x, text_top - 18, side_width, bold, 8, RUST)
        text_top = paragraph(pdf, concept['production'], side_x, text_top - 6, side_width, regular, 9)
        text_top = paragraph(pdf, 'PHRASE CHECK LIMIT', side_x, text_top - 15, side_width, bold, 8, RUST)
        text_top = paragraph(pdf, concept['phrase'], side_x, text_top - 6, side_width, regular, 9)
        if text_top < 65:
            raise RuntimeError(f"Detail text overflow on concept {concept['number']}")
        caption = ('Back-view concept mockup. The proposed front logo remains specified in the notes. '
                   if concept.get('mockup_view') else 'Concept mockup. ')
        caption += 'SVGs and measurements govern exact glyphs and placement.'
        paragraph(pdf, caption,
                  34, 65, 465, regular, 8)
        pdf.showPage()
    pdf.save()


def render_pdf() -> None:
    document = pdfium.PdfDocument(str(ROOT / PDF_NAME))
    if len(document) != 5:
        raise RuntimeError(f'Expected five PDF pages, got {len(document)}')
    previews = ROOT / 'tmp' / 'pdf-pages'
    previews.mkdir(parents=True, exist_ok=True)
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=1.75)
        image = bitmap.to_pil()
        image.save(previews / f'page-{index + 1}.png')
        if index == 0:
            image.save(ROOT / 'contact-sheet.png')
        image.close()
        bitmap.close()
        page.close()
    document.close()


def package_sources(concepts: list[dict]) -> list[tuple[Path, str]]:
    files = []
    for concept in concepts:
        for path in sorted(concept['directory'].rglob('*')):
            if path.is_file():
                # Keep superseded source photos in the repo, but expose only
                # the four selected mockups in the review package.
                if path.name.startswith('mockup') and path.suffix.lower() == '.png' and path.name != 'mockup-v2.png':
                    continue
                files.append((path, 'concepts/' + concept['folder'] + '/' + path.relative_to(concept['directory']).as_posix()))
    brand = source_directory() / 'mark' / 'final' / 'the-o'
    files.extend((path, 'concepts/mark/final/the-o/' + path.name)
                 for path in sorted(brand.iterdir()) if path.is_file() and path.suffix in ['.svg', '.md'])
    files.extend((path, 'fonts/' + path.name) for path in font_paths() if path.is_file())
    if any(path.is_file() for path in font_paths()):
        files.append((font_license_path(), 'fonts/OFL-Archivo.txt'))
    return files


def build_package(concepts: list[dict]) -> None:
    sources = package_sources(concepts)
    root_research = ROOT / 'next-round-research.md'
    notes_research = ROOT / 'tmp' / 'bundle-references' / 'next-round-research.md'
    notes_research.parent.mkdir(parents=True, exist_ok=True)
    root_text = portable_research_text('root')
    notes_text = portable_research_text('concepts')
    research_source_hash = digest(research_path())
    root_research.write_text(root_text, encoding='utf-8')
    notes_research.write_text(notes_text, encoding='utf-8')
    references = [(root_research, 'next-round-research.md'), (notes_research, 'concepts/next-round-research.md')]
    manifest = {
        'builtAt': datetime.now(timezone.utc).isoformat(),
        'status': STATUS,
        'conceptCount': 4,
        'pdfPages': 5,
        'sourceImagesEdited': False,
        'chosenMockupFilename': 'mockup-v2.png',
        'chosenMockupCount': 4,
        'chosenMockupDimensions': {concept['folder']: list(ImageReader(str(concept['mockup'])).getSize())
                                  for concept in concepts},
        'supersededMockupsExcluded': True,
        'researchSourceSha256': research_source_hash,
        'bundleReferenceTreatment': 'Only local research links adjusted; historical repository links omitted with explanation. Source research unchanged.',
        'sourceFiles': [{'path': name, 'bytes': path.stat().st_size, 'sha256': digest(path)} for path, name in sources],
        'portableReferences': [{'path': name, 'bytes': path.stat().st_size, 'sha256': digest(path)} for path, name in references],
        'outputs': {name: {'bytes': (ROOT / name).stat().st_size, 'sha256': digest(ROOT / name)}
                    for name in ['index.html', PDF_NAME, 'contact-sheet.png']},
    }
    (ROOT / 'build-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    included = sources + references + [(ROOT / name, name) for name in [
        'index.html', PDF_NAME, 'contact-sheet.png', 'README.md', 'build-review.py', 'build-manifest.json',
    ]]
    for name in ['independent-review.md', '.gitignore']:
        if (ROOT / name).is_file():
            included.append((ROOT / name, name))
    with zipfile.ZipFile(ROOT / ZIP_NAME, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path, name in included:
            archive.write(path, name)
    with zipfile.ZipFile(ROOT / ZIP_NAME) as archive:
        if archive.testzip() is not None:
            raise RuntimeError('ZIP integrity check failed')
        for path, name in included:
            if hashlib.sha256(archive.read(name)).hexdigest() != digest(path):
                raise RuntimeError(f'Archive/source hash mismatch: {name}')
        mockups = [name for name in archive.namelist() if Path(name).name.startswith('mockup') and name.endswith('.png')]
        if len(mockups) != 4 or any(Path(name).name != 'mockup-v2.png' for name in mockups):
            raise RuntimeError('The bundle must contain exactly the four selected v2 mockups')
    for name in ['index.html', PDF_NAME, ZIP_NAME, 'contact-sheet.png', 'build-manifest.json']:
        if (ROOT / name).stat().st_size >= 100_000_000:
            raise RuntimeError(f'Output exceeds the 100 MB file limit: {name}')
    print(json.dumps({'concepts': 4, 'pdfPages': 5, 'archiveFiles': len(included),
                      'sourceHashesVerified': True, 'outputs': [name for name in [
                          'index.html', PDF_NAME, ZIP_NAME, 'contact-sheet.png', 'build-manifest.json']]}, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check required source files without writing outputs.')
    args = parser.parse_args()
    concepts = read_sources()
    if args.check:
        print('All four complete source folders and mockups are ready. No outputs written.')
        return
    # Missing sources were rejected before any output writes. Source paths are
    # read-only; all generated files stay within this next-round directory.
    original_hashes = {path: digest(path) for path, _ in package_sources(concepts)}
    if research_path() != ROOT / 'next-round-research.md':
        original_hashes[research_path()] = digest(research_path())
    build_gallery(concepts)
    build_pdf(concepts)
    render_pdf()
    build_package(concepts)
    if any(digest(path) != value for path, value in original_hashes.items()):
        raise RuntimeError('A source file changed during the build; review concurrent edits and rebuild.')


if __name__ == '__main__':
    main()
