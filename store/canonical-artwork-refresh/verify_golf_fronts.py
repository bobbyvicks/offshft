"""Trace the nine newer golf listings' unchanged chest art to their masters."""
import json,hashlib,xml.etree.ElementTree as ET
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
audit={r['id']:r for r in load(R/'store/launch-brand-audit/production-file-audit.json')}
specs={'golf-club':'15-off-shft-golf-club','out-of-office':'07-out-of-office/golf-shirt','time-well-spent':'16-time-well-spent'}
rows=[];seen=set();products=set();variants=set()
def paths(p):return [dict(e.attrib) for e in ET.parse(p).getroot().iter() if e.tag.endswith('}path')]
for p in load(H/'private/fresh-before/manifest.json')['products']:
 if not any(p['handle'].startswith(s+'-') for s in ['off-shft-golf-club','out-of-office','time-well-spent']):continue
 products.add(p['handle'])
 for v in load(H/f'private/fresh-before/product-{p["printfulId"]}.json')['result']['sync_variants']:
  variants.add(v['id'])
  for f in v['files']:
   if f['type'] not in ['embroidery_chest_left','chest_left_dtf'] or f['id'] in seen:continue
   seen.add(f['id']);q=audit[f['id']];png=R/q['matches'][0];canvas=png.with_suffix('.svg');assert canvas.exists()
   assert hashlib.md5(png.read_bytes()).hexdigest()==f['hash']
   name=f['filename'];prefix=next(s for s in specs if name.startswith(s+'-'));tone='dark' if '-dark-' in name else 'light'
   master=R/f'designs/{specs[prefix]}/design-{tone}.svg'
   assert paths(canvas)==paths(master),(name,'Vector glyph payload differs')
   rows.append({'fileId':f['id'],'filename':name,'master':master.relative_to(R).as_posix(),'masterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'productionPngMd5Matches':True,'glyphPayloadUnchanged':True})
assert len(rows)==12 and len(products)==9 and len(variants)==318
report={'status':'PASS','products':len(products),'variants':len(variants),'chestFiles':len(rows),'scope':'Newer golf chest artwork; sleeve clocks and printed back logos corrected separately','files':rows}
(H/'golf-front-source-verification.json').write_text(json.dumps(report,indent=2)+'\n');print({k:v for k,v in report.items() if k!='files'})
