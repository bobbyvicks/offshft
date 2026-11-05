"""Independent public read-back of every product, option and media slot."""
import json,urllib.request,hashlib,concurrent.futures,collections
from pathlib import Path
from PIL import Image
H=Path(__file__).parent;R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
before={p['handle']:p for p in load(H/'public-before.json')['products']};after={p['handle']:p for p in load(H/'public-after.json')['products']}
assert set(before)==set(after)
plan={p['imageId']:p for p in load(H/'media-replacement-plan.json')};copyPlan={p['handle']:p for p in load(H/'copy-corrections.json')};changed=[]
for handle,b in before.items():
 a=after[handle]
 for key in ['id','title','handle','vendor','product_type','tags','options']:assert a[key]==b[key],(handle,key)
 assert [x['id'] for x in a['images']]==[x['id'] for x in b['images']],handle
 assert len(a['variants'])==len(b['variants'])
 for v,w in zip(a['variants'],b['variants'],strict=True):
  for key in set(v)|set(w):
   if key in ['updated_at','created_at']:continue
   if key=='featured_image':assert v[key]['id']==w[key]['id'],(handle,v['id']);continue
   assert v[key]==w[key],(handle,v['id'],key)
 if handle in copyPlan:assert copyPlan[handle]['newDetail'] in a['body_html'] and 'puff' not in a['body_html'].lower(),handle
 else:assert a['body_html']==b['body_html'],handle
 changed.extend(x['id'] for x,y in zip(a['images'],b['images'],strict=True) if x['src']!=y['src'])
assert set(changed)==set(plan),(len(changed),len(plan),'missing',set(plan)-set(changed),'unplanned',set(changed)-set(plan))
dest=H/'public-images-after';dest.mkdir(exist_ok=True)
jobs=[{'handle':p['handle'],**i} for p in after.values() for i in p['images']]
def check(j):
 assert j['src'].startswith('https://cdn.shopify.com/')
 raw=urllib.request.urlopen(j['src'],timeout=45).read();target=dest/(str(j['id'])+'.png');target.write_bytes(raw)
 im=Image.open(target).convert('RGBA');im.load();assert im.size==(j['width'],j['height'])
 assert all(im.getpixel(p)[3]==0 for p in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]),(j['handle'],j['id'],'Opaque corner')
 p=plan.get(j['id'])
 if p:
  source=Image.open(R/p['newSource']).convert('RGBA');source.load()
  assert im.size==source.size==(1000,1000),(p['filename'],'Wrong dimensions')
  assert im.tobytes()==source.tobytes(),(p['filename'],'Supplier pixels differ')
 return {'handle':j['handle'],'imageId':j['id'],'url':j['src'],'pixels':list(im.size),'transparentCorners':True,'supplierPixelsMatch':True if p else None,'sha256':hashlib.sha256(raw).hexdigest()}
images=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for result in pool.map(check,jobs):
  images.append(result)
  if len(images)%40==0:print(f'Verified public images {len(images)}/{len(jobs)}',flush=True)
report={'status':'PASS','products':len(after),'variants':sum(len(p['variants']) for p in after.values()),'images':len(images),'supplierExactReplacements':len(plan),'transparentImages':len(images),'protectedProductAndVariantDataUnchanged':True,'allMediaIdentitiesAndOrderUnchanged':True,'correctedHeadwearDescriptions':len(copyPlan),'dimensions':dict(collections.Counter(str(i['pixels']) for i in images)),'imagesVerified':images}
(H/'public-verification.json').write_text(json.dumps(report,indent=2)+'\n')
receipts=load(H/'media-replacement-receipts.json')
for i in images:
 if i['imageId'] not in plan:continue
 receipt=receipts[str(i['imageId'])];receipt.update(status='VERIFIED_PUBLIC',afterUrl=i['url'],supplierPixelsMatch=True,transparentCorners=True)
(H/'media-replacement-receipts.json').write_text(json.dumps(receipts,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='imagesVerified'}),flush=True)
