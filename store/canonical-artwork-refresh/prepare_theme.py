"""Update only affected artwork references and their factual size descriptions."""
import json,hashlib,re,copy
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1];M=H/'masters';OUT=H/'theme-after';OUT.mkdir(exist_ok=True)
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
save=lambda p,d:p.write_text(json.dumps(d,separators=(',',':'),ensure_ascii=False),encoding='utf-8')
art=load(H/'theme-before/offshft-design-data.json');before=copy.deepcopy(art)
records=load(H/'artwork-manifest.json')['records'];changes=[]
def source(handle,dark=False):
 tone='dark' if dark else 'light'
 if handle.startswith('off-shft-logo-'):return M/f'brand/logo/offshft-logo-{tone}.svg'
 if handle.startswith('the-clock-'):
  return M/f'designs/mark/final/the-o/symbol-{tone}-40mm.svg' if handle.endswith(('-hat','-beanie')) else M/f'brand/clock/offshft-clock-{tone}.svg'
 if handle.startswith('punched-out-') and handle.endswith(('-hat','-beanie')):return M/f'designs/09-punched-out/v3/stacked-centred-{tone}.svg'
 for slug,folder in [('banked-time','18-banked-time'),('parked','20-parked'),('suns-still-up','16-suns-still-up'),('ours-to-spend','13-ours-to-spend')]:
  if handle.startswith(slug+'-'):return M/f'designs/{folder}/design-{tone}.svg'
 if handle=='for-a-reason-hat':return R/f'designs/21-for-a-reason/design-{tone}.svg'
 return None
for handle,p in art['products'].items():
 for field,path in [('art',source(handle,p['dark'])),('frontArt',M/'brand/logo/offshft-logo-light.svg' if handle=='the-rest-is-ours-hoodie' else None)]:
  if not path:continue
  svg=path.read_text(encoding='utf-8').lstrip('\ufeff');key=hashlib.sha256(svg.encode()).hexdigest()
  old=p[field];p[field]=key;art['artwork'][key]=svg
  changes.append({'handle':handle,'field':field,'oldKey':old,'newKey':key,'source':path.relative_to(R).as_posix()})
assert len(changes)==27
used={p[k] for p in art['products'].values() for k in ['art','frontArt'] if p.get(k)}
removed=sorted(set(art['artwork'])-used)
art['artwork']={k:v for k,v in art['artwork'].items() if k in used}
assert all(k in art['artwork'] for k in used)
# Prove every other field and family remains unchanged.
reversed=copy.deepcopy(art)
for c in changes:reversed['products'][c['handle']][c['field']]=c['oldKey']
for key,value in before['artwork'].items():
 if key not in reversed['artwork']:reversed['artwork'][key]=value
for key in list(reversed['artwork']):
 if key not in before['artwork']:del reversed['artwork'][key]
assert reversed==before
save(OUT/'offshft-design-data.json',art)
finish=load(H/'theme-before/offshft-hoodie-finish-data.json');oldFinish=copy.deepcopy(finish);dimensionChanges=[]
mapping={p['handle']:p for p in load(H/'private/fresh-before/manifest.json')['products']}
for p in finish['products'].values():
 h=p['handle']
 if not h.startswith(('off-shft-logo-','the-clock-')):continue
 variants=load(H/f'private/fresh-before/product-{mapping[h]["printfulId"]}.json')['result']['sync_variants']
 for v in variants:
  detail=p['finishDetails'].get(str(v['external_id']))
  if not detail:continue
  choices=[r for r in records if v['id'] in r['variants']]
  assert len(choices)==1
  w,height=choices[0]['physicalArtMm'];old=[detail['widthMm'],detail['heightMm']]
  detail.update(widthMm=round(w,3),heightMm=round(height,3))
  dimensionChanges.append({'handle':h,'variantId':str(v['external_id']),'before':old,'after':[detail['widthMm'],detail['heightMm']]})
save(OUT/'offshft-hoodie-finish-data.json',finish)
save(H/'theme-change-manifest.json',{'references':changes,'dimensions':dimensionChanges,'removedUnusedArtwork':removed})
labels={'off-shft-logo':'the OFF SHFT logo','the-clock':'the Clock mark','punched-out':'PUNCHED / OUT.','banked-time':'BANKED TIME.','parked':'PARKED.','suns-still-up':"SUN’S / STILL UP.",'ours-to-spend':'OURS TO SPEND.','for-a-reason':'FOR A / REASON.'}
copyPlan=[]
for p in load(H/'public-before.json')['products']:
 rr=[r for r in records if r['headwear'] and p['handle'] in r['handles']]
 if not rr:continue
 r=rr[0];label=next(label for slug,label in labels.items() if p['handle'].startswith(slug+'-'))
 placement='Cuff' if p['handle'].endswith('-beanie') else 'Front'
 clock=p['handle'].startswith('the-clock-');mm=r['physicalArtMm'][1 if clock else 0]
 new=f'{placement}: {label} in flat embroidery, about {mm:.0f} mm ({mm/25.4:.1f} in) '+('tall' if clock else 'wide')
 body,n=re.subn(r'<li>(?:Front|Cuff):.*?</li>','<li>'+new+'</li>',p['body_html'],count=1,flags=re.S)
 if n==0 and p['handle']=='ours-to-spend-trucker-hat':body,n=re.subn(r'<li>Front embroidery,.*?</li>','<li>'+new+'</li>',p['body_html'],count=1,flags=re.S)
 assert n==1,p['handle']
 body=body.replace('Coming soon. Product images are mockups.','Product images are mockups.')
 assert 'puff' not in body.lower()
 copyPlan.append({'handle':p['handle'],'id':p['id'],'title':p['title'],'before':p['body_html'],'after':body,'newDetail':new})
assert len(copyPlan)==14
(H/'copy-corrections.json').write_text(json.dumps(copyPlan,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'canonicalPickerReferences':len(changes),'sizeDetails':len(dimensionChanges),'headwearDescriptions':len(copyPlan)}))
