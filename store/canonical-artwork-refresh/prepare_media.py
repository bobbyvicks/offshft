import json,urllib.parse,collections
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
products={p['handle']:p for p in load(H/'public-before.json')['products']};plan=[]
filename=lambda i:urllib.parse.unquote(urllib.parse.urlsplit(i['src']).path.rsplit('/',1)[-1])
for j in load(H/'mockups/plan.json'):
 p=products[j['handle']];ids={v['featured_image']['id'] for v in p['variants'] if str(v['id']) in j['variantIds']};assert len(ids)==1
 image=next(i for i in p['images'] if i['id'] in ids)
 view='back' if j['handle']=='the-rest-is-ours-hoodie' else 'front'
 images=[(view,image)]
 if j['handle'].endswith('-golf-shirt'):
  prefix=filename(image).split('-front')[0]
  matches=[i for i in p['images'] if filename(i).startswith(prefix+'-back')];assert len(matches)==1,(j['key'],prefix,matches)
  images.append(('back',matches[0]))
 for view,image in images:
  source=H/'mockups'/(j['key']+'-'+view+'.png')
  plan.append({'handle':j['handle'],'key':j['key'],'view':view,'imageId':image['id'],'beforeUrl':image['src'],'filename':filename(image),'newSource':source.relative_to(R).as_posix(),'variants':j['variantIds'] if image['id'] in ids else []})
assert len(plan)==279 and len({p['imageId'] for p in plan})==279
(H/'media-replacement-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
prefixes=collections.Counter(p['filename'].split('-')[0] for p in plan)
print(json.dumps({'existingMediaIdentities':len(plan),'topFilenamePrefixes':prefixes}))
