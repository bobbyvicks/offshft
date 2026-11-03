"""Read-only scope: current supplier bindings and preserved canvas geometry."""
import json
from pathlib import Path
H=Path(__file__).parent; R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
old={r['id']:r for r in load(R/'store/launch-brand-audit/production-file-audit.json')}
reverse={int(v):int(k) for k,v in load(R/'store/launch-brand-audit/private/production-updates/file-map.json').items()}
files={}
for p in load(H/'private/fresh-before/manifest.json')['products']:
 for v in load(H/f'private/fresh-before/product-{p["printfulId"]}.json')['result']['sync_variants']:
  for f in v['files']:
   if f['type']=='preview':continue
   q=files.setdefault(f['id'],dict(file=f,handles=[],pids=[],roles=[],variants=[],bindings=[]))
   q['bindings'].append({'handle':p['handle'],'pid':v['product']['product_id'],'role':f['type'],'variantId':v['id']})
   for key,value in [('handles',p['handle']),('pids',v['product']['product_id']),('roles',f['type']),('variants',v['id'])]:
    if value not in q[key]:q[key].append(value)
rows=[]
for fid,q in files.items():
 name=q['file']['filename']; headwear=all(h.endswith(('-hat','-beanie')) for h in q['handles'])
 if 'five-oclock' in name:continue  # 5:00 is a phrase, not the clock symbol.
 is_brand='logo' in name or 'clock' in name or 'off-shft-back' in name or name in ['front-ink-rust-12x16-300dpi.png','front-bone-sun-12x16-300dpi.png']
 if not headwear and not is_brand:continue
 # Golf Club is a distinct phrase, not a logo file.
 if name.startswith('golf-club-'):continue
 basis=old[reverse.get(fid,fid)]
 q.update(oldFileId=fid,oldAudit=basis,headwear=headwear)
 # A shared canvas must not shift the logo on seamless bucket hats.
 if headwear and 'logo' in name and 206 in q['pids'] and len(q['pids'])>1:
  for six in [True,False]:
   bindings=[b for b in q['bindings'] if (b['pid']==206)==six]
   s={**q,'key':str(fid)+('-seam' if six else '-centre'),'bindings':bindings}
   for key,bkey in [('handles','handle'),('pids','pid'),('roles','role'),('variants','variantId')]:s[key]=list(dict.fromkeys(b[bkey] for b in bindings))
   rows.append(s)
 else:q['key']=str(fid);rows.append(q)
(H/'inventory.json').write_text(json.dumps(rows,indent=2)+'\n')
public=[]
for row in rows:
 public.append({**{k:row[k] for k in ['key','headwear','pids','roles','handles','variants']},'file':{k:row['file'][k] for k in ['id','filename','width','height','dpi']},'oldAudit':{k:row['oldAudit'][k] for k in ['alphaBounds','visibleMm']}})
(H/'build-inputs.json').write_text(json.dumps(public,indent=2)+'\n')
print(json.dumps({'files':len(rows),'variants':len({v for r in rows for v in r['variants']}),'products':len({h for r in rows for h in r['handles']}),'headwearVariants':len({v for r in rows if r['headwear'] for v in r['variants']})}))
