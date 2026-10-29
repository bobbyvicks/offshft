#!/usr/bin/env python3
"""Build the 16-colour concept review after final images have been approved.

Requires reportlab and pypdfium2. Source PNGs are copied byte-for-byte, never
edited. Input colourways.json and generation records are read-only. All output
paths are relative to this file; extracted ZIPs can be rebuilt independently.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
import zipfile

import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'review-assets'
PDF_NAME = 'OFF-SHFT-Colourways-Review.pdf'
ZIP_NAME = 'OFF-SHFT-Colourways.zip'
MAX_BYTES = 100_000_000
BG, INK, MUTED, RUST, PAPER, RULE = '#F4F0E7', '#1F2733', '#62675F', '#B4552D', '#FFFEFA', '#DCD7CB'


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def resolve_input(value: str) -> Path:
    """Resolve original repository paths or their byte-identical portable copy."""
    direct = ROOT / value
    if direct.exists():
        return direct.resolve()
    parts = Path(value).parts
    if parts and parts[0] == '..':
        alternate = ASSETS / 'concepts' / Path(*parts[1:])
    else:
        alternate = ASSETS / value
    return alternate.resolve()


def external_reference(relative: str, portable: str) -> Path:
    source = ROOT.parent / relative
    return source if source.exists() else ASSETS / portable


def load_data(require_images: bool = True) -> dict:
    data = json.loads((ROOT / 'colourways.json').read_text(encoding='utf-8-sig'))
    assert data['version'] == 1 and len(data['concepts']) == 4, 'Expected four concepts in schema version 1'
    assert len({c['id'] for c in data['concepts']}) == 4, 'Duplicate concept IDs'
    missing = []
    existing = 0
    for concept in data['concepts']:
        assert len(concept['colourways']) == 4, concept['id']
        assert len({c['id'] for c in concept['colourways']}) == 4, concept['id']
        for key in ['notes', 'measurements']:
            if not resolve_input(concept[key]).is_file():
                missing.append(concept[key])
        for artwork in concept['artwork'].values():
            for path in artwork.values():
                if not resolve_input(path).is_file():
                    missing.append(path)
        for colour in concept['colourways']:
            assert colour['artwork'] in concept['artwork'] and colour['artwork'] in data['palette']
            assert re.fullmatch(r'#[0-9a-fA-F]{6}', colour['swatch']), colour['swatch']
            existing += bool(colour['existing'])
            if require_images and not resolve_input(colour['image']).is_file():
                missing.append(colour['image'])
    assert existing == 4, 'Expected four original and twelve added colourways'
    for name in ['research.md', 'generation-plan.json']:
        if not (ROOT / name).is_file():
            missing.append(name)
    for filename in ['Archivo-Bold.ttf', 'Archivo-SemiBold.ttf', 'OFL-Archivo.txt']:
        if not external_reference('brand-system/fonts/' + filename, 'fonts/' + filename).is_file():
            missing.append(filename)
    for filename in ['logo-light.svg', 'logo-dark.svg', 'notes.md']:
        reference = external_reference('mark/final/the-o/' + filename, 'concepts/mark/final/the-o/' + filename)
        if not reference.is_file():missing.append(str(reference))
    if not external_reference('next-round-research.md', 'concepts/next-round-research.md').is_file():
        missing.append('Original phrase research')
    if missing:
        raise SystemExit('Sources are not ready. No review outputs were written:\n' + '\n'.join(sorted(set(missing))))
    return data


def portable_research(text: str, canonical_target: str | None = None) -> str:
    """Keep citations, but remove repository-only links from bundled copies."""
    omitted = False
    def replace(match):
        nonlocal omitted
        label, target = match.groups()
        if target.startswith(('https://', 'http://', '#')):
            return match.group(0)
        if canonical_target and target.endswith('mark/final/the-o/notes.md'):
            return f'[{label}]({canonical_target})'
        omitted = True
        return label
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace, text)
    if omitted and 'Bundle reference note:' not in text:
        text = text.rstrip() + (
            '\n\nBundle reference note: historical repository-only links are omitted because '
            'the full repository is not included. External evidence links remain intact; '
            'the source research is unchanged.\n'
        )
    return text


def prepare_assets(data: dict) -> tuple[list[dict], dict[str, str]]:
    """Copy only package dependencies. Never mutate source manifests or photos."""
    records = []
    paths = {}
    seen = set()
    def copy(source: Path, target_relative: str) -> str:
        target = ROOT / target_relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.resolve() != target.resolve():
            shutil.copy2(source, target)
        assert sha(source) == sha(target), target_relative
        if target_relative not in seen:
            records.append({'path': target_relative, 'bytes': target.stat().st_size, 'sha256': sha(target)})
            seen.add(target_relative)
        return target_relative

    for concept in data['concepts']:
        concept_dir = resolve_input(concept['sourceDir'])
        prefix = f'review-assets/concepts/{concept["id"]}'
        # Current notes, geometry, reference renders and original provenance.
        for source in sorted(concept_dir.iterdir()):
            if source.is_file() and source.suffix.lower() in ['.svg', '.png', '.md', '.json']:
                if source.name.startswith('mockup') and source.name != 'mockup-v2.png':
                    continue
                copy(source, f'{prefix}/{source.name}')
        paths[concept['notes']] = f'{prefix}/notes.md'
        paths[concept['measurements']] = f'{prefix}/measurements.json'
        for variant in concept['artwork'].values():
            for source_name in variant.values():
                source = resolve_input(source_name)
                target = f'{prefix}/{source.name}' if source_name.startswith('../') else 'review-assets/' + source_name
                paths[source_name] = copy(source, target)
        for colour in concept['colourways']:
            source = resolve_input(colour['image'])
            target = f'{prefix}/mockup-v2.png' if colour['existing'] else 'review-assets/' + colour['image']
            paths[colour['image']] = copy(source, target)

    brand = external_reference('mark/final/the-o', 'concepts/mark/final/the-o')
    if not brand.is_dir():
        raise RuntimeError('Canonical brand references are missing')
    for source in sorted(brand.iterdir()):
        if source.is_file() and source.suffix in ['.svg', '.md']:
            copy(source, 'review-assets/concepts/mark/final/the-o/' + source.name)
    for name in ['Archivo-Bold.ttf', 'Archivo-SemiBold.ttf', 'OFL-Archivo.txt']:
        copy(external_reference('brand-system/fonts/' + name, 'fonts/' + name), 'review-assets/fonts/' + name)

    phrase_source = external_reference('next-round-research.md', 'concepts/next-round-research.md')
    phrase_text = portable_research(phrase_source.read_text(encoding='utf-8-sig'), 'mark/final/the-o/notes.md')
    phrase_target = ASSETS / 'concepts/next-round-research.md'
    phrase_target.write_text(phrase_text, encoding='utf-8')
    colour_target = ASSETS / 'research/colour-research.md'
    colour_target.parent.mkdir(parents=True, exist_ok=True)
    colour_target.write_text(portable_research((ROOT / 'research.md').read_text(encoding='utf-8-sig')), encoding='utf-8')
    for target in [phrase_target, colour_target]:
        records.append({'path': target.relative_to(ROOT).as_posix(), 'bytes': target.stat().st_size, 'sha256': sha(target),
                        'treatment': 'Bundle-only research link adjustment; source unchanged'})
    return records, paths


def gallery_model(data: dict, paths: dict[str, str]) -> list[dict]:
    concepts = []
    for concept in data['concepts']:
        c = {key: concept[key] for key in ['id', 'title', 'garment', 'widthMm', 'placement']}
        c['notes'] = paths[concept['notes']]
        c['measurements'] = paths[concept['measurements']]
        c['colours'] = []
        for colour in concept['colourways']:
            artwork = concept['artwork'][colour['artwork']]
            palette = data['palette'][colour['artwork']]
            c['colours'].append({
                **colour, 'image': paths[colour['image']], 'artPng': paths[artwork['png']],
                'svg': paths[artwork['svg']], 'palette': palette['title'],
                'artBackground': '#ECE5D3' if colour['artwork'] == 'light' else '#2E3D35',
                'frontLogo': palette['title'] if concept['id'].startswith('12-') else None,
                'frontSvg': ('review-assets/concepts/mark/final/the-o/logo-' + colour['artwork'] + '.svg')
                            if concept['id'].startswith('12-') else None,
            })
        concepts.append(c)
    return concepts


def build_gallery(model: list[dict]) -> None:
    cards = []
    for index, concept in enumerate(model):
        first = concept['colours'][0]
        options = ''.join(f'<option value="{i}">{html.escape(c["name"])}' + (' - original' if c['existing'] else '') + '</option>'
                          for i, c in enumerate(concept['colours']))
        front_note = f'<p class="front-note">Separate front logo: {html.escape(first["frontLogo"])}</p>' if first['frontLogo'] else ''
        front_download = f'<a class="front-download" href="{first["frontSvg"]}" download>Front logo SVG</a>' if first['frontSvg'] else ''
        cards.append(f'''<article class="card" data-concept="{index}">
<div class="visual"><img class="photo" src="{first['image']}" alt="{html.escape(concept['title'])}, {html.escape(first['name'])} concept mockup">
<div class="art" style="background:{first['artBackground']}" hidden><img src="{first['artPng']}" alt="Exact draft artwork"></div>
<span class="tag">{'BACK-VIEW CONCEPT' if concept['id'].startswith('12-') else 'CONCEPT MOCKUP'}</span></div>
<div class="copy"><p class="eyebrow">{html.escape(concept['garment'])}</p><h2>{html.escape(concept['title'])}</h2>
<label for="colour-{index}">Colour option</label><div class="picker"><span class="swatch" style="background:{first['swatch']}"></span><select id="colour-{index}">{options}</select></div>
<p class="palette">{html.escape(first['palette'])} artwork</p><p class="placement">{html.escape(concept['placement'])} / {concept['widthMm']} mm artwork width</p>{front_note}
<div class="downloads"><a class="photo-download" href="{first['image']}" download>Selected photo</a><a class="svg-download" href="{first['svg']}" download>Selected SVG</a>{front_download}<a href="{concept['notes']}" download>Notes</a><a href="{concept['measurements']}" download>Measurements</a></div></div></article>''')
    serialized = json.dumps(model, ensure_ascii=False).replace('</', '<\\/')
    document = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OFF SHFT - Colour options</title>
<style>
:root{--ink:#1f2733;--muted:#62675f;--warm:#f4f0e7;--rule:#dcd7cb;--rust:#b4552d;color-scheme:light}*{box-sizing:border-box}
body{margin:0;background:var(--warm);color:var(--ink);font:16px/1.5 Arial,Helvetica,sans-serif}main{max-width:1240px;margin:auto;padding:42px 30px}
.top{display:flex;justify-content:space-between;gap:16px;align-items:center}.brand{font-weight:800;font-size:22px;letter-spacing:.08em}.status{border:1px solid var(--rule);border-radius:99px;padding:7px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
header{padding-bottom:26px;border-bottom:1px solid var(--rule)}h1{font-size:clamp(36px,5vw,58px);line-height:1.07;letter-spacing:-.04em;margin:34px 0 16px}.intro{max-width:830px;margin:0;font-size:18px;color:var(--muted)}
.toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:23px 0}.modes{border:1px solid var(--rule);border-radius:99px;background:#fffefa;padding:4px;display:flex;gap:4px}
button{border:0;border-radius:99px;font:inherit;font-size:14px;padding:9px 17px;background:transparent;color:var(--ink);cursor:pointer}button[aria-pressed=true]{background:var(--ink);color:#fffefa}
a{color:inherit;text-underline-offset:3px}.toolbar a{font-size:14px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px}
.card{min-width:0;border:1px solid var(--rule);border-radius:16px;overflow:hidden;background:#fffefa}.visual{position:relative;aspect-ratio:1/1;padding:17px;background:#f1ece2}
.photo{display:block;width:100%;height:100%;object-fit:contain}.photo[hidden]{display:none}.art{height:100%;width:100%;padding:13%;align-items:center;justify-content:center;border-radius:5px}.art:not([hidden]){display:flex}.art img{width:100%;height:100%;object-fit:contain}
.tag{position:absolute;right:28px;top:28px;background:rgba(255,254,250,.95);font-size:10px;border-radius:99px;padding:7px 10px;letter-spacing:.07em}.copy{padding:24px}.eyebrow{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--rust);margin:0 0 9px}
h2{font-size:clamp(25px,2.6vw,32px);line-height:1.12;letter-spacing:-.025em;margin:0 0 23px}label{font-size:12px;font-weight:700;display:block;margin-bottom:7px}.picker{display:flex;gap:10px;align-items:center}.swatch{width:25px;height:25px;border-radius:50%;border:1px solid #0002;flex:none}
select{font:inherit;font-size:15px;color:var(--ink);background:#fffefa;border:1px solid var(--rule);border-radius:7px;padding:11px;min-width:0;width:100%}.palette{font-size:13px;font-weight:700;margin:12px 0 5px}.placement,.front-note{font-size:13px;color:var(--muted);margin:0 0 14px}.downloads{display:flex;flex-wrap:wrap;gap:8px 17px;font-size:12px;font-weight:700}
footer{border-top:1px solid var(--rule);padding-top:24px;margin-top:32px;font-size:13px;color:var(--muted);display:grid;grid-template-columns:1.6fr 1fr;gap:28px}footer p{margin:0 0 12px}a:focus-visible,button:focus-visible,select:focus-visible{outline:3px solid var(--rust);outline-offset:4px}
@media(max-width:700px){main{padding:24px 16px}.top{align-items:flex-start;flex-direction:column}.grid{grid-template-columns:1fr}footer{grid-template-columns:1fr;gap:8px}.copy{padding:22px}.visual{padding:14px}}
@media print{.toolbar,.downloads,.picker,label{display:none}.card{break-inside:avoid}.grid{gap:16px}main{padding:0}}
</style></head><body><main><header><div class="top"><div class="brand">OFF SHFT</div><div class="status">Draft colour concepts / not released products</div></div>
<h1>More ways to wear it.</h1><p class="intro">Four concepts, four colours each. Compare the original pairing with three additional supplier-listed colours, keeping the artwork and placement consistent.</p></header>
<div class="toolbar"><div class="modes" role="group" aria-label="View"><button data-mode="photo" aria-pressed="true">Concept mockups</button><button data-mode="art" aria-pressed="false">Exact draft artwork</button></div><a href="''' + PDF_NAME + '''" download>Download all 16 colour options as PDF</a></div>
<section class="grid" aria-label="Concept colour selectors">''' + '\n'.join(cards) + '''</section>
<footer><div><p><strong>Concept review only.</strong> Screen swatches are not calibrated fabric samples. SVGs and measurements govern exact glyphs and placement; physical samples govern final colour and application.</p><p>The hoodie is shown from the back. Its separate approved front-logo application remains specified in the notes. Caramel and Espresso use Bone for all artwork, including punctuation.</p></div>
<div><p><a href="review-assets/research/colour-research.md">Colour research and supplier evidence</a></p><p><a href="review-assets/concepts/next-round-research.md">Preliminary phrase research</a></p><p>These options do not publish products or establish commercial phrase clearance. The original four-concept package is preserved.</p></div></footer>
</main><script type="application/json" id="gallery-data">''' + serialized + '''</script><script>
const concepts=JSON.parse(document.querySelector('#gallery-data').textContent);let mode='photo';
function update(card){const c=concepts[Number(card.dataset.concept)];const v=c.colours[Number(card.querySelector('select').value)];
const photo=card.querySelector('.photo');photo.src=v.image;photo.alt=c.title+', '+v.name+' concept mockup';photo.hidden=mode==='art';
const art=card.querySelector('.art');art.hidden=mode!=='art';art.style.background=v.artBackground;art.querySelector('img').src=v.artPng;
card.querySelector('.swatch').style.background=v.swatch;card.querySelector('.palette').textContent=v.palette+' artwork';
card.querySelector('.photo-download').href=v.image;card.querySelector('.svg-download').href=v.svg;
if(v.frontLogo){card.querySelector('.front-note').textContent='Separate front logo: '+v.frontLogo;card.querySelector('.front-download').href=v.frontSvg;}
card.querySelector('.tag').textContent=mode==='art'?'EXACT DRAFT ARTWORK':(c.id.startsWith('12-')?'BACK-VIEW CONCEPT':'CONCEPT MOCKUP');}
document.querySelectorAll('.card').forEach(card=>card.querySelector('select').addEventListener('change',()=>update(card)));
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.card').forEach(update);}));
</script></body></html>'''
    (ROOT / 'index.html').write_text(document, encoding='utf-8')


def font_names() -> tuple[str, str]:
    pdfmetrics.registerFont(TTFont('Archivo-Bold', str(ASSETS / 'fonts/Archivo-Bold.ttf')))
    return 'Helvetica', 'Archivo-Bold'


def text(pdf, value, x, top, width, font, size=10, colour=MUTED, leading=None):
    value = value.replace('\u2014', '-').replace('\u2013', '-').replace('\u2011', '-')
    style = ParagraphStyle('copy', fontName=font, fontSize=size, leading=leading or size * 1.3,
                           textColor=colors.HexColor(colour))
    block = Paragraph(html.escape(value), style)
    _, height = block.wrap(width, 2000)
    block.drawOn(pdf, x, top - height)
    return top - height


def image_fit(pdf, path, x, y, width, height):
    image = ImageReader(str(path))
    w, h = image.getSize()
    scale = min(width / w, height / h)
    pdf.drawImage(image, x + (width - w * scale) / 2, y + (height - h * scale) / 2,
                  width=w * scale, height=h * scale, mask='auto')


def build_pdf(data: dict, model: list[dict]) -> None:
    regular, bold = font_names()
    width, height = landscape(A4)
    pdf = canvas.Canvas(str(ROOT / PDF_NAME), pagesize=(width, height), pageCompression=1)
    pdf.setTitle('OFF SHFT - Four concepts, sixteen colour options')
    pdf.setAuthor('OFF SHFT')
    pdf.setSubject('Draft colour concepts, not released products')
    def frame(page, label):
        pdf.setFillColor(colors.HexColor(BG));pdf.rect(0, 0, width, height, fill=1, stroke=0)
        pdf.setFillColor(colors.HexColor(INK));pdf.setFont(bold, 17);pdf.drawString(34, height - 34, 'OFF SHFT')
        pdf.setFont(regular, 8);pdf.drawRightString(width - 34, height - 31, f'COLOUR OPTIONS / {label} / {page:02d}')
        pdf.setStrokeColor(colors.HexColor(RULE));pdf.line(34, 31, width - 34, 31)
        pdf.setFillColor(colors.HexColor(MUTED));pdf.setFont(regular, 7.5)
        pdf.drawString(34, 18, 'DRAFT COLOUR CONCEPTS - NOT RELEASED PRODUCTS. SVGs, measurements and physical samples govern production.')
        pdf.drawRightString(width - 34, 18, f'{page} / 5')
    frame(1, 'OVERVIEW')
    text(pdf, 'Four concepts. Sixteen colour options.', 34, height - 51, width - 68, bold, 24, INK)
    text(pdf, 'Each row keeps one design and garment. Original pairing first, followed by three additional colours.',
         34, height - 85, width - 68, regular, 9)
    row_height, gap = 112, 12
    cell_width = (width - 68 - 3 * gap) / 4
    top = height - 108
    for row, concept in enumerate(model):
        row_top = top - row * row_height
        text(pdf, concept['id'][:2] + ' / ' + concept['title'] + ' / ' + concept['garment'],
             34, row_top, width - 68, bold, 8, INK)
        for column, colour in enumerate(concept['colours']):
            x = 34 + column * (cell_width + gap)
            bottom = row_top - 94
            pdf.setFillColor(colors.HexColor(PAPER));pdf.roundRect(x, bottom, cell_width, 79, 5, fill=1, stroke=0)
            image_fit(pdf, ROOT / colour['image'], x + 5, bottom + 5, cell_width - 10, 69)
            label = colour['name'] + (' / original' if colour['existing'] else '')
            text(pdf, label, x, bottom - 4, cell_width, bold, 7.5, INK)
    pdf.showPage()

    for page, concept in enumerate(model, start=2):
        frame(page, 'CONCEPT ' + concept['id'][:2])
        text(pdf, concept['title'], 34, height - 53, width - 68, bold, 27, INK)
        text(pdf, concept['garment'] + ' / ' + concept['placement'] + f" / {concept['widthMm']} mm artwork width",
             34, height - 91, width - 68, regular, 10)
        card_width, card_height = (width - 68 - 18) / 2, 199
        top = height - 119
        for index, colour in enumerate(concept['colours']):
            x = 34 + (index % 2) * (card_width + 18)
            y = top - (index // 2) * (card_height + 14) - card_height
            pdf.setFillColor(colors.HexColor(PAPER));pdf.roundRect(x, y, card_width, card_height, 8, fill=1, stroke=0)
            image_fit(pdf, ROOT / colour['image'], x + 10, y + 12, 185, card_height - 24)
            tx, tw, ty = x + 210, card_width - 226, y + card_height - 24
            ty = text(pdf, 'ORIGINAL PAIRING' if colour['existing'] else 'ADDITIONAL COLOUR', tx, ty, tw, bold, 7.5, RUST)
            ty = text(pdf, colour['name'], tx, ty - 12, tw, bold, 20, INK, 23)
            ty = text(pdf, colour['palette'], tx, ty - 12, tw, regular, 10, INK)
            if colour['frontLogo']:
                ty = text(pdf, 'Separate front logo: ' + colour['frontLogo'] + '.', tx, ty - 9, tw, regular, 8.5)
            if colour['artwork'] == 'bone':
                ty = text(pdf, 'All artwork, including punctuation, uses Bone.', tx, ty - 9, tw, regular, 8.5)
            pdf.setFillColor(colors.HexColor(colour['swatch']));pdf.circle(tx + 5, y + 31, 5, fill=1, stroke=0)
            text(pdf, colour['swatch'] + ' screen reference', tx + 17, y + 36, tw - 17, regular, 7.5)
        pdf.showPage()
    pdf.save()


def render_pages() -> None:
    document = pdfium.PdfDocument(str(ROOT / PDF_NAME))
    assert len(document) == 5, 'Expected five PDF pages'
    staging = ROOT / 'tmp/pdf-pages';staging.mkdir(parents=True, exist_ok=True)
    for index in range(5):
        page = document[index];bitmap = page.render(scale=1.75);image = bitmap.to_pil()
        image.save(staging / f'page-{index + 1}.png')
        if index == 0:image.save(ROOT / 'contact-sheet.png')
        image.close();bitmap.close();page.close()
    document.close()


def package(data: dict, records: list[dict], model: list[dict]) -> None:
    provenance = []
    # Preserve root-owned inputs verbatim; generated audit files are excluded.
    for source in sorted(ROOT.glob('*.json')):
        if source.name != 'build-manifest.json':
            provenance.append(source)
    for directory in ['generation', 'prompts', 'verification']:
        if (ROOT / directory).is_dir():
            provenance.extend(p for p in sorted((ROOT / directory).rglob('*')) if p.is_file())
    outputs = ['index.html', PDF_NAME, 'contact-sheet.png']
    manifest = {
        'builtAt': datetime.now(timezone.utc).isoformat(), 'status': data['status'],
        'concepts': 4, 'colourways': 16, 'existingMockups': 4, 'newMockups': 12, 'pdfPages': 5,
        'sourceImagesEdited': False, 'sourceManifestSha256': sha(ROOT / 'colourways.json'),
        'sourceResearchSha256': sha(ROOT / 'research.md'),
        'researchTreatment': 'Archive-only local-link adjustment; root-owned source research unchanged.',
        'assets': records,
        'selectedImages': [{'concept': c['id'], 'colour': v['name'], 'path': v['image'], 'artwork': v['artwork'],
                            'dimensions': list(ImageReader(str(ROOT / v['image'])).getSize()), 'sha256': sha(ROOT / v['image'])}
                           for c in model for v in c['colours']],
        'provenance': [{'path': p.relative_to(ROOT).as_posix(), 'sha256': sha(p)} for p in provenance],
        'reviewNotes': [{'path': name, 'sha256': sha(ROOT / name)} for name in ['qa-review.md', 'independent-review.md']
                        if (ROOT / name).is_file()],
        'outputs': {name: {'bytes': (ROOT / name).stat().st_size, 'sha256': sha(ROOT / name)} for name in outputs},
    }
    (ROOT / 'build-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    included = {ROOT / record['path'] for record in records}
    included.update(provenance)
    included.update(ROOT / name for name in outputs + ['build-manifest.json', 'colourways.json', 'generation-plan.json',
                                                      'README.md', 'build-review.py', '.gitignore'])
    for name in ['qa-review.md', 'independent-review.md']:
        if (ROOT / name).is_file():included.add(ROOT / name)
    with zipfile.ZipFile(ROOT / ZIP_NAME, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for source in sorted(included):archive.write(source, source.relative_to(ROOT).as_posix())
        archive.write(ASSETS / 'research/colour-research.md', 'research.md')
    with zipfile.ZipFile(ROOT / ZIP_NAME) as archive:
        assert archive.testzip() is None, 'ZIP integrity failure'
        for source in included:
            assert hashlib.sha256(archive.read(source.relative_to(ROOT).as_posix())).hexdigest() == sha(source), source
        assert archive.read('research.md') == (ASSETS / 'research/colour-research.md').read_bytes()
    for name in outputs + [ZIP_NAME, 'build-manifest.json']:
        assert (ROOT / name).stat().st_size < MAX_BYTES, f'{name} exceeds 100 MB'
    print(json.dumps({'concepts': 4, 'mockups': 16, 'pdfPages': 5, 'zipFiles': len(included) + 1,
                      'sourceHashesVerified': True, 'outputsMB': {name: round((ROOT / name).stat().st_size / 1_000_000, 2)
                                                               for name in outputs + [ZIP_NAME]}}, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check required input files without writing outputs.')
    args = parser.parse_args()
    data = load_data()
    if args.check:
        print('All four concepts and sixteen selected colourway sources are ready. No outputs written.')
        return
    source_hashes = {resolve_input(v['image']): sha(resolve_input(v['image']))
                     for c in data['concepts'] for v in c['colourways']}
    source_hashes[ROOT / 'colourways.json'] = sha(ROOT / 'colourways.json')
    records, paths = prepare_assets(data)
    model = gallery_model(data, paths)
    build_gallery(model)
    build_pdf(data, model)
    render_pages()
    package(data, records, model)
    assert all(sha(path) == expected for path, expected in source_hashes.items()), 'A selected source changed during the build'


if __name__ == '__main__':main()
