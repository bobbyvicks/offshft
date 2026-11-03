"""Production preflight: unchanged canonical payload, physical fields, transparency."""
import json,hashlib,subprocess,xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
H=Path(__file__).parent;R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
manifest=load(H/'artwork-manifest.json');records=manifest['records']
commit=(H/'source-ref.txt').read_text(encoding='utf-8-sig').strip()
assert manifest['canonicalCommit']==commit
canonical_sources=set()
for name in {r['source'] for r in records}:
 path=(R/name).resolve()
 if path.is_relative_to((H/'masters').resolve()):
  relative=path.relative_to((H/'masters').resolve()).as_posix()
  original=subprocess.check_output(['git','show',commit+':'+relative],cwd=R)
  assert path.read_bytes()==original,('Canonical source provenance drift',name)
  canonical_sources.add(name)
 else:
  assert name in {'designs/21-for-a-reason/design-light.svg','designs/21-for-a-reason/design-dark.svg'},('Unapproved source outside pinned masters',name)
for r in records:
 source=(R/r['source']).read_bytes();assert hashlib.sha256(source).hexdigest()==r['sourceSha256']
 s=source.decode().lstrip('\ufeff').strip()
 if r['colorVariant']:
  import re;s=re.sub(r'#[0-9A-Fa-f]{6}','#ECE5D3',s)
 import re
 body=re.sub(r'^<svg\b[^>]*>','',s);body=re.sub(r'</svg>$','',body)
 wrapper=(R/r['vectorPath']).read_text();assert body in wrapper
 tree=ET.fromstring(wrapper);assert len(tree)==1
 im=Image.open(R/r['publishedPath']);assert im.mode=='RGBA' and im.size==(r['width'],r['height'])
 assert abs(im.info['dpi'][0]-r['dpi'])<.01
 b=im.getchannel('A').getbbox();assert b and b[0]>0 and b[1]>0 and b[2]<im.width and b[3]<im.height,r['filename']
 visible=[(b[2]-b[0])/r['dpi']*25.4,(b[3]-b[1])/r['dpi']*25.4]
 assert all(abs(a-b)<.15 for a,b in zip(visible,r['expectedInkMm'])),(r['filename'],visible,r['expectedInkMm'])
 assert im.getpixel((0,0))[3]==0
 if r['headwear']:assert r['printScale']==1
 if not r['printed']:assert r['printScale']==1
report={'status':'PASS','productionCanvases':len(records),'canonicalSources':len({r['source'] for r in records}),'pinnedMastersCompared':len(canonical_sources),'approvedNewMasters':2,'variants':len({v for r in records for v in r['variants']}),'products':len({h for r in records for h in r['handles']}),'checks':['pinned Git source bytes','source SHA-256','unchanged embedded vector','full placement bounds','transparent corners','physical DPI and canvas dimensions','no embroidery scaling']}
(H/'artwork-verification.json').write_text(json.dumps(report,indent=2)+'\n')
selected=[]
for text in ['logo-bucket','clock-hat','punched-out-hat','banked-time','parked-trucker','suns-still','ours-to-spend','for-a-reason']:
 selected.append(next(r for r in records if any(text in h for h in r['handles'])))
W=1400;canvas=Image.new('RGB',(W,120+len(selected)*160),'#E8DFCD');draw=ImageDraw.Draw(canvas)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',21);small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',17)
draw.text((35,25),'OFF SHFT — canonical artwork / flat embroidery',fill='#1F2733',font=font)
draw.text((35,61),'Exact vector outlines, shown enlarged for inspection. No puff expansion or width compression.',fill='#1F2733',font=small)
for i,r in enumerate(selected):
 y=110+i*160;im=Image.open(R/r['publishedPath']);im=im.crop(im.getchannel('A').getbbox());im.thumbnail((780,115),Image.Resampling.LANCZOS)
 opaque=[p[:3] for p in im.getdata() if p[3]>200]
 bright=sum(sum(p) for p in opaque)/len(opaque)>420
 bg=Image.new('RGB',(820,130),'#27303D' if bright else '#ECE5D3')
 bg.paste(im,((820-im.width)//2,(130-im.height)//2),im);canvas.paste(bg,(545,y))
 draw.text((35,y+25),r['handles'][0].replace('-',' '),fill='#1F2733',font=font)
 draw.text((35,y+61),' × '.join(str(round(x,2)) for x in r['physicalArtMm'])+' mm — true-size master',fill='#1F2733',font=small)
canvas.save(H/'canonical-artwork-proof.png');print(json.dumps(report))

