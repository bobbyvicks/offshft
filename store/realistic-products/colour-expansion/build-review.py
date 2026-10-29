"""Build a portable colour gallery, PDF contact sheet and image archive."""
from pathlib import Path
from io import BytesIO
import hashlib
import html
import json
import zipfile
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT/'colour-plan.json').read_text(encoding='utf-8'))
GROUPS = [('hoodie','Hoodies'),('hat','Hats'),('crewneck','Crewnecks'),('sweatpants','Sweatpants'),('tee','T-shirts'),('jacket','Jackets')]
DESIGNS = {'logo':'OFF SHFT Logo','clock':'The Clock','punched-out':'Punched Out.'}
PDF = 'OFF-SHFT-Colour-Review.pdf'
ZIP = 'OFF-SHFT-Colour-Images.zip'
rows=[]
for p in DATA['products']:
    family,design=p['key'].split('-',1)
    for pair in p['pairs']:
        rows.append({**pair,'key':p['key'],'title':p['title'],'family':family,'design':design,'adminUrl':p['adminUrl']})
order={k:i for i,(k,_) in enumerate(GROUPS)}
rows.sort(key=lambda r:(order[r['family']],r['blank'],r['colour'],list(DESIGNS).index(r['design'])))
missing=[r['image'] for r in rows if not (ROOT/r['image']).is_file()]
if missing:
    raise SystemExit('Waiting for '+str(len(missing))+' images: '+', '.join(missing))
verification=[]
for row in rows:
    path=ROOT/row['image']
    with Image.open(path) as im:
        im.verify()
    with Image.open(path) as im:
        im.load(); width,height=im.size
    assert width==height and width>=1000,path
    verification.append({'key':row['key'],'style':row['style'],'colour':row['colour'],'image':row['image'],'width':width,'height':height,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(ROOT/'image-verification.json').write_text(json.dumps(verification,indent=2)+'\n',encoding='utf-8')

e=html.escape
cards=[]
for r in rows:
    style=f"{r['style']} / " if r['style'] else ''
    cards.append(f'''<article data-family="{r['family']}" data-design="{r['design']}" data-colour="{e(r['colour'])}"><a class="photo" href="{e(r['image'])}"><img src="{e(r['image'])}" width="1254" height="1254" loading="lazy" alt="{e(r['title']+' — '+style+r['colour'])}"></a><div class="caption"><h2>{e(DESIGNS[r['design']])}</h2><p>{e(style+r['colour'])}</p><small>{e(r['blank'])}</small><a class="download" download href="{e(r['image'])}" aria-label="Download {e(r['title']+' '+r['colour'])}">Download image ↗</a></div></article>''')
families=''.join(f'<option value="{k}">{v}</option>' for k,v in GROUPS)
designs=''.join(f'<option value="{k}">{v}</option>' for k,v in DESIGNS.items())
colours=''.join(f'<option>{e(c)}</option>' for c in sorted({r['colour'] for r in rows}))
page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OFF SHFT — Colour collection</title><style>
:root{--ink:#1f2733;--paper:#f5f1e8;--rust:#b4552d;--line:#d8d0c3;--muted:#64655f}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif}main{max-width:1440px;padding:44px 40px 70px;margin:auto}header{border-bottom:1px solid var(--line);padding-bottom:30px}.topline{display:flex;justify-content:space-between;gap:20px;letter-spacing:.14em;font-size:12px;font-weight:700}.brand{font-size:21px}h1{font-size:clamp(32px,4.5vw,58px);font-weight:500;letter-spacing:-.045em;margin:40px 0 16px}.intro{max-width:720px;color:var(--muted);font-size:16px;line-height:1.65}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.actions a{padding:12px 18px;border:1px solid var(--line);color:var(--ink);text-decoration:none;font-size:13px;font-weight:bold}.actions a:first-child{background:var(--ink);color:var(--paper);border-color:var(--ink)}.construction{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:25px 0;border-bottom:1px solid var(--line);font-size:13px;line-height:1.6}.construction b{display:block;font-size:14px;margin-bottom:4px}.filters{display:flex;gap:14px;flex-wrap:wrap;align-items:end;padding:27px 0}.filters label{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.filters select{display:block;margin-top:7px;padding:10px 28px 10px 10px;background:transparent;border:1px solid var(--line);color:var(--ink);font:14px Arial;min-width:165px}.count{margin-left:auto;font-size:13px;color:var(--muted);padding-bottom:12px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px 24px}article[hidden]{display:none}.photo{display:block;background:#e4ddcb;overflow:hidden}.photo img{display:block;width:100%;height:auto}.caption{padding-top:14px}h2{font-size:17px;line-height:1.4;margin:0 0 6px}.caption p{margin:0 0 5px;font-size:14px}.caption small{font-size:12px;color:var(--muted)}.download{display:block;margin-top:11px;font-size:12px;color:var(--rust);text-decoration:none}a:focus-visible,select:focus-visible{outline:3px solid var(--rust);outline-offset:3px}footer{border-top:1px solid var(--line);margin-top:50px;padding-top:22px;color:var(--muted);font-size:12px;line-height:1.6}footer a{color:inherit}@media(max-width:760px){main{padding:28px 20px 44px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.construction{grid-template-columns:1fr;gap:14px}.count{margin-left:0}.filters{gap:12px}}@media(max-width:460px){.grid{grid-template-columns:1fr}.topline{display:block}.topline span:last-child{display:block;margin-top:10px}.filters label{width:100%}.filters select{width:100%}}@media print{.filters,.actions,.download{display:none}.grid{grid-template-columns:repeat(3,1fr)}article{break-inside:avoid}main{padding:0}}
</style></head><body><main><header><div class="topline"><span class="brand">OFF SHFT</span><span>DROP 01 / COLOUR COLLECTION</span></div><h1>Clock out. Find your colour.</h1><p class="intro">57 garment and colour combinations across the three OFF SHFT designs. Every style has its own silhouette, with supplier-listed colours and the right hoodie drawcord construction.</p><div class="actions"><a href="OFF-SHFT-Colour-Review.pdf">Open colour review PDF</a><a href="colour-plan.json">View colour and size matrix</a></div></header><aside class="construction" aria-label="Hoodie construction"><div><b>Oversized · AS Colour 5161</b>Lined hood without drawcords.<br>Bone / Pine Green</div><div><b>Garment-Dyed · Comfort Colors 1567</b>Flat drawcords matching the garment.<br>White / Blue Spruce</div><div><b>Lightweight · Comfort Colors 1467</b>Natural cream flat drawcords.<br>Ivory / Blue Jean</div></aside><div class="filters"><label>Garment<select id="family"><option value="">All garments</option>FAMILIES</select></label><label>Design<select id="design"><option value="">All designs</option>DESIGNS</select></label><label>Colour<select id="colour"><option value="">All colours</option>COLOURS</select></label><span class="count" id="count" aria-live="polite">57 images</span></div><section class="grid" aria-label="Product images">CARDS</section><footer>AI-generated product mockups. Supplier colour names and garment construction were researched on 29 October 2026; screen colours and embroidery are visual approximations. Confirm production with a physical sample.<br><a href="hoodie-research.md">Hoodie sources</a> · <a href="collection-colour-research.md">Collection sources</a> · <a href="image-verification.json">Image checksums</a></footer></main><script>const filters=['family','design','colour'];const controls=filters.map(id=>document.getElementById(id));const cards=[...document.querySelectorAll('article')];function filter(){let shown=0;for(const card of cards){const visible=controls.every((control,i)=>!control.value||card.dataset[filters[i]]===control.value);card.hidden=!visible;if(visible)shown++;}document.getElementById('count').textContent=shown+' image'+(shown===1?'':'s');}controls.forEach(control=>control.addEventListener('change',filter));</script></body></html>'''
page=page.replace('FAMILIES',families).replace('DESIGNS',designs).replace('COLOURS',colours).replace('CARDS','\n'.join(cards))
(ROOT/'index.html').write_text(page,encoding='utf-8')

W,H=792,612
c=canvas.Canvas(str(ROOT/PDF),pagesize=(W,H))
c.setTitle('OFF SHFT — Colour collection')
c.setAuthor('OFF SHFT')
ink=HexColor('#1f2733');muted=HexColor('#64655f');paper=HexColor('#f5f1e8')
page_no=0
for family,label in GROUPS:
    family_rows=[r for r in rows if r['family']==family]
    for start in range(0,len(family_rows),6):
        page_no+=1
        c.setFillColor(paper);c.rect(0,0,W,H,fill=1,stroke=0)
        c.setFillColor(ink);c.setFont('Helvetica-Bold',17);c.drawString(32,H-35,'OFF SHFT')
        c.setFont('Helvetica',12);c.drawString(32,H-56,label+' / Colour collection')
        c.setFont('Helvetica',9);c.drawRightString(W-32,H-35,f'DROP 01 / {page_no:02d}')
        for n,r in enumerate(family_rows[start:start+6]):
            x=32+(n%3)*246;y=H-79-(n//3)*249
            with Image.open(ROOT/r['image']) as im:
                b=BytesIO();im.convert('RGB').save(b,format='JPEG',quality=88,optimize=True);b.seek(0)
                c.drawImage(ImageReader(b),x,y-195,width=195,height=195,preserveAspectRatio=True,mask='auto')
            c.setFillColor(ink);c.setFont('Helvetica-Bold',10);c.drawString(x,y-210,DESIGNS[r['design']])
            c.setFont('Helvetica',9);c.drawString(x,y-223,(r['style']+' / ' if r['style'] else '')+r['colour'])
            c.setFillColor(muted);c.setFont('Helvetica',8);c.drawString(x,y-235,r['blank'])
        c.setFillColor(muted);c.setFont('Helvetica',7)
        c.drawString(32,16,'AI product mockups / Supplier-listed colours / Physical samples determine final colour and embroidery.')
        c.drawRightString(W-32,16,'29 OCT 2026')
        c.showPage()
c.save()

with zipfile.ZipFile(ROOT/ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for r in rows:
        path=(ROOT/r['image']).resolve()
        z.write(path,'OFF-SHFT-Colours/'+str(path.relative_to(ROOT.parent)).replace('\\','/'))
    for name in ['index.html',PDF,'colour-plan.json','image-verification.json','README.md','hoodie-research.md','collection-colour-research.md']:
        z.write(ROOT/name,'OFF-SHFT-Colours/colour-expansion/'+name)
    z.writestr('OFF-SHFT-Colours/START-HERE.txt','Open colour-expansion/index.html to browse the full collection. The PDF is in the same folder. Keep the images and colour-expansion folders together.\n')
print(json.dumps({'images':len(rows),'pdfPages':page_no,'pdfBytes':(ROOT/PDF).stat().st_size,'zipBytes':(ROOT/ZIP).stat().st_size}))
