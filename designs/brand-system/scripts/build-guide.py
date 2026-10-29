"""Build the OFF SHFT brand guide from canonical exports and application artwork.
Requires reportlab, Pillow and pypdfium2 (available in the Codex bundled runtime).
Run from any directory. Artwork stays editable in the accompanying SVG files.
"""
from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
ASSETS = ROOT / 'assets'
W,H = 1200,800
BONE='#ECE5D3'; INK='#1F2733'; RUST='#B4552D'; SUN='#D29B3C'; SAGE='#9AA383'; WHITE='#F7F4EC'; MUTED='#59616B'
for n,f in [('Body','Archivo-SemiBold.ttf'),('Bold','Archivo-Bold.ttf'),('Display','Unbounded-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(n,str(ROOT/'fonts'/f)))
c=canvas.Canvas(str(OUT/'OFF-SHFT-Brand-Guide.pdf'),pagesize=(W,H),pageCompression=1)
c.setTitle('OFF SHFT - Clothing, Labels & Packaging')
c.setAuthor('OFF SHFT')
c.setSubject('Visual identity and application proposals built from the final The O artwork')

def box(x,y,w,h,col):
    c.setFillColor(HexColor(col)); c.rect(x,H-y-h,w,h,stroke=0,fill=1)
def line(x,y,x2,y2,col=INK,width=.5):
    c.setStrokeColor(HexColor(col));c.setLineWidth(width);c.line(x,H-y,x2,H-y2)
def txt(t,x,y,size=16,font='Body',color=INK):
    c.setFillColor(HexColor(color));c.setFont(font,size);c.drawString(x,H-y-size*.82,t)
def label(t,x,y,color=INK):
    txt(t.upper(),x,y,10,'Bold',color)
def paragraph(t,x,y,width=380,size=17,leading=25,color=INK,font='Body'):
    yy=y
    for para in t.split('\n'):
        words=para.split(); row=''
        for word in words:
            test=f'{row} {word}'.strip()
            if pdfmetrics.stringWidth(test,font,size)>width and row:
                txt(row,x,yy,size,font,color); yy+=leading;row=word
            else:row=test
        if row:txt(row,x,yy,size,font,color);yy+=leading
        yy+=9
    return yy
def pic(path,x,y,w=None,h=None,cover=False):
    im=Image.open(path); iw,ih=im.size
    if w is None:w=h*iw/ih
    if h is None:h=w*ih/iw
    if cover:
        c.saveState();p=c.beginPath();p.rect(x,H-y-h,w,h);c.clipPath(p,stroke=0,fill=0)
        scale=max(w/iw,h/ih);dw=iw*scale;dh=ih*scale
        c.drawImage(ImageReader(im),x+(w-dw)/2,H-y-h+(h-dh)/2,dw,dh,mask='auto');c.restoreState()
    else:
        scale=min(w/iw,h/ih);dw=iw*scale;dh=ih*scale
        c.drawImage(ImageReader(im),x+(w-dw)/2,H-y-h+(h-dh)/2,dw,dh,mask='auto')
def mark(name,x,y,w=None,h=None):pic(ASSETS/(name+'.png'),x,y,w,h)
def trimmed_art(path,x,y,w,cw,ch,tx,ty,tw,th):
    """Compose the finished face from a full-bleed artwork canvas."""
    k=w/tw;h=th*k
    c.saveState();p=c.beginPath();p.rect(x,H-y-h,w,h);c.clipPath(p,stroke=0,fill=0)
    pic(path,x-tx*k,y-ty*k,cw*k,ch*k)
    c.restoreState()
def page(num,kicker,bg=BONE):
    box(0,0,W,H,bg);label('OFF SHFT / BRAND SYSTEM',56,34,BONE if bg==INK else INK)
    label(kicker,760,34,BONE if bg==INK else INK)
    col=BONE if bg==INK else INK
    line(56,745,1144,745,col,.4);label('CLOTHING / LABELS / PACKAGING',56,760,col)
    label(f'01.0   /   {num:02}',1045,760,col)
def finish():c.showPage()

# 01 - A concise, exact-art cover.
page(1,'VISUAL IDENTITY / OCTOBER 2026')
mark('logo-light',72,150,970)
label('THE O / A SINGLE, RECOGNIZABLE SIGNATURE',76,500)
txt('Your time.',72,546,70,'Display')
paragraph('A considered identity for the hours after.',78,653,700,22,29)
label('APPLICATION PROPOSALS',916,670)
finish()

# 02 - Material expression.
page(2,'01 / THE FEEL')
txt('Made to be worn.',56,95,40,'Display')
paragraph('Comfortable silhouettes.\nQuiet branding.\nDetails that belong together.',56,184,335,25,34)
paragraph('The clock mark is the signature. Give it room, repeat it consistently, and let the clothing carry the rest.',56,346,313,17,25)
label('THE CAPSULE',56,523)
paragraph('Oversized hoodies\nBaggy sweats\nHats',56,548,300,18,25)
hero=ROOT/'mockups'/'brand-world.png'
if hero.exists():pic(hero,405,176,739,490,True)
else:
    box(405,176,739,490,INK);mark('logo-dark',475,355,600)
txt('AI concept. Supplied vectors govern exact logo geometry and colour; physical samples still required.',407,687,9,'Body',MUTED)
finish()

# 03 - Hierarchy is more useful than many invented logos.
page(3,'02 / THE LOGO SYSTEM')
txt('One mark. Clear roles.',56,92,39,'Display')
box(56,178,707,240,WHITE);mark('logo-light',98,242,620)
box(781,178,363,240,INK);mark('symbol-dark',911,217,h=158)
label('01 / PRIMARY WORDMARK',56,439)
paragraph('Use the full logo for first recognition: garment fronts, packaging lids, hangtags and neck branding.',56,464,640,17,25)
label('02 / SECONDARY SYMBOL',781,439)
paragraph('Use the clock on the thigh, on a seal, or alongside an established wordmark.',781,464,345,17,25)
line(56,568,1144,568,'#BDBAAE')
mark('logo-dark',56,600,270)
box(44,585,295,113,INK);mark('logo-dark',60,608,260)
paragraph('Light ground: Ink + Rust.\nDark ground: Bone + Sun.',377,596,315,16,24)
paragraph('One-colour files serve tonal or single-thread applications. Use the supplied small side master for compact embroidery.',769,596,375,16,24)
finish()

# 04 - Inherited colours, clear typographic role.
page(4,'03 / COLOUR & TYPE')
txt('A quiet base. A warm signal.',56,94,34,'Display')
palette=[('Bone',BONE),('Ink',INK),('Rust',RUST),('Sun',SUN),('Sage',SAGE)]
for i,(name,hx) in enumerate(palette):
    x=56+i*220
    box(x,185,208,190,hx)
    if i==0:
        line(x,185,x+208,185,'#BDBAAE');line(x,375,x+208,375,'#BDBAAE')
    txt(name,x,394,21,'Bold');label(hx,x,428)
paragraph('Bone and Ink do most of the work. Rust belongs to the clock on light grounds; Sun belongs to the clock on dark grounds. Sage is a secondary supporting colour.',56,477,1020,18,27)
line(56,565,1144,565,'#BDBAAE')
txt('Your time.',56,599,35,'Display')
label('UNBOUNDED BOLD / DISPLAY',58,661)
txt('Clothing for the hours after.',602,601,28,'Body')
label('ARCHIVO / SUPPORTING COPY',604,661)
txt('Screen targets shown. Approve physical paper, ink, fabric and thread samples before production.',56,707,11,'Body',MUTED)
finish()

# 05 - Exact logo placement concepts.
page(5,'04 / CLOTHING')
txt('Small mark. Strong presence.',56,91,36,'Display')
g=ROOT/'garments'/'garments-art.png'
if not g.exists():g=ROOT/'garments'/'placements.png'
if g.exists():pic(g,56,167,1088,430)
for x,head,detail in [(56,'01 / OVERSIZED HOODIE','80 mm wide / wearer\'s left chest'),(430,'02 / BAGGY SWEATS','25 mm tall / upper thigh'),(819,'03 / HAT','62.64 x 18.04 mm / front')]:
    label(head,x,616);txt(detail,x,643,15)
txt('Not to a common scale. Fit on the selected blanks and approve a sew-out at each artwork size.',56,703,11,'Body',MUTED)
finish()

# 06 - The physical label system.
page(6,'05 / LABELS')
txt('The details make it yours.',56,91,36,'Display')
app=ROOT/'applications'
box(70,207,166,272,'#D0CABB')
trimmed_art(app/'hangtag-front.png',67,204,166,61,96,3,3,55,90)
line(67,204,233,204,'#D0CABB');line(67,204,67,476,'#D0CABB')
trimmed_art(app/'hangtag-back.png',260,204,166,61,96,3,3,55,90)
c.setFillColor(HexColor('#D0CABB'));c.circle(150,H-225.13,5.28,fill=1,stroke=0)
c.setFillColor(HexColor(BONE));c.circle(343,H-225.13,5.28,fill=1,stroke=0)
label('01 / TWO-SIDED HANGTAG',67,499)
paragraph('55 x 90 mm finished.\nBone front. Ink reverse.\n3 mm bleed supplied.',67,532,355,18,27)
trimmed_art(app/'woven-neck-label.png',562,230,566,104,35,7,0,90,35)
label('02 / WOVEN BRAND LABEL',562,499)
paragraph('90 x 35 mm visible face, plus 7 mm end folds. A spacious home for the full wordmark; keep verified care and product details on a separate label.',562,532,566,18,27)
txt('Design proposals. Sample the weave, fold, hole position and attachment method with the selected supplier.',56,703,11,'Body',MUTED)
finish()

# 07 - An intentionally quiet unboxing.
page(7,'06 / PACKAGING')
txt('A complete arrival.',56,91,39,'Display')
box(61,189,610,447,'#D0CABB');pic(app/'box-top-panel.png',56,184,610,447)
line(56,184,666,184,'#D0CABB');line(56,184,56,631,'#D0CABB')
box(750,188,398,282.36,'#D0CABB');trimmed_art(app/'package-insert.png',746,184,398,154,111,3,3,148,105)
c.saveState();p=c.beginPath();p.circle(947,H-558,59);c.clipPath(p,stroke=0,fill=0)
pic(app/'seal-sticker.png',880,491,134,134);c.restoreState()
label('03 / BOX TOP',56,663)
txt('300 x 220 mm indicative panel.',56,688,16)
label('04 / INSERT + 05 / SEAL',746,663)
txt('148 x 105 mm card. 45 mm circular seal.',746,688,16)
finish()

# 08 - Practical controls.
page(8,'07 / USE IT CONSISTENTLY')
txt('A few rules. Every time.',56,94,39,'Display')
rules=[('01','Protect the artwork.','Use the supplied outlines. Keep the clock hands, pivot, proportions and letter spacing intact.'),('02','Leave clear space.','Recommended: one O-ring diameter beyond the entire mark, including the tips of both hands.'),('03','Choose the correct master.','Full logo for recognition. Symbol for secondary placements. Side master for embroidery below the main symbol size floor.'),('04','Respect the size floors.','Hat front: cap 7 mm. Symbol: 19 mm minimum in two colours; 20.5 mm in one colour. Digitize every size; never scale stitch files.'),('05','Keep colour intentional.','Bone: Ink + Rust. Slate / Spruce: Bone + Sun. Moss / Rust: Bone one colour. Oat: colour only after a successful sew-out.'),('06','Prove the physical result.','Review real fabric, stitch channels, print colour, label comfort and placement before production. Mockups do not prove quality.')]
for i,(n,head,body) in enumerate(rules):
    col=i%2;row=i//2;x=56+col*558;y=188+row*173
    label(n,x,y,RUST);txt(head,x+41,y-3,21,'Bold')
    paragraph(body,x+41,y+36,448,16,23)
finish()

# 09 - Honest handoff.
page(9,'08 / THE HANDOFF',INK)
txt('Ready to carry forward.',56,96,40,'Display',BONE)
paragraph('The chosen logo is the foundation. The new application files give it a consistent place across clothing and packaging.',56,181,1000,22,31,BONE)
cols=[('KEEP','assets/','12 canonical SVG masters\n12 transparent PNG exports\nLight, dark and one-colour sets'),('USE','applications/ + garments/','Editable packaging artwork\nDimensional application notes\nGarment placement concepts'),('REVIEW','production-handoff.md','Physical colour and material proofs\nSupplier dielines and label samples\nSew-outs and garment placement')]
for i,(k,p,b) in enumerate(cols):
    x=56+i*372
    line(x,324,x+340,324,SUN,2);label(k,x,349,SUN)
    txt(p,x,389,19,'Bold',BONE)
    paragraph(b,x,434,335,17,27,BONE)
paragraph('Status: final source logo; proposed brand applications. The physical product, care information, composition and country-of-origin details remain to be confirmed with the chosen supplier.',56,610,1065,15,22,BONE)
txt('Source: bobbyvicks/offshft / designs/drop-1 / fee1e64 / designs/mark/final/the-o',56,703,10,'Body',BONE)
finish();c.save()

# Render every page from the PDF, then make a review contact sheet.
import pypdfium2 as pdfium
doc=pdfium.PdfDocument(str(OUT/'OFF-SHFT-Brand-Guide.pdf'))
thumbs=[]
for i in range(len(doc)):
    im=doc[i].render(scale=1.25).to_pil().convert('RGB')
    im.save(OUT/f'page-{i+1:02}.png')
    im.thumbnail((600,400));thumbs.append(im)
sheet=Image.new('RGB',(1200,400*((len(thumbs)+1)//2)), '#D1CEC4')
for i,im in enumerate(thumbs):sheet.paste(im,((i%2)*600,(i//2)*400))
sheet.save(OUT/'guide-contact-sheet.png')
print(json.dumps({'pdf':str(OUT/'OFF-SHFT-Brand-Guide.pdf'),'pages':len(doc),'previews':len(thumbs)}))
