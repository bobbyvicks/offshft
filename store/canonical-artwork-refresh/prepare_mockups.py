"""Supplier-rendered photographs from the exact canonical production canvases."""
import json,sys,copy
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1]
sys.path.insert(0,str(R/'store/printful-setup'));import printful_client as pf
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
save=lambda p,d:p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
META=R/'store/launch-brand-audit/private/mockup-metadata'
out=H/'mockups';out.mkdir(exist_ok=True)
records=load(H/'artwork-manifest.json')['records'];affected={v for r in records for v in r['variants']}
nav=load(H/'theme-before/offshft-design-contexts.json')['products']
commit=(H/'artwork-commit.txt').read_text().strip();contexts={}
common=load(R/'store/golf-club-expansion/common-files.json')
commonCommit=(R/'store/golf-club-expansion/common-commit.txt').read_text().strip()
for product in load(H/'private/fresh-before/manifest.json')['products']:
 for v in load(H/f'private/fresh-before/product-{product["printfulId"]}.json')['result']['sync_variants']:
  if v['id'] not in affected:continue
  c=nav[product['handle']]['variants'][str(v['external_id'])];key=(product['handle'],*c[:3])
  if key not in contexts or c[3]=='M':contexts[key]=(product,v,c)
jobs=[]
for key,(product,v,c) in contexts.items():
 pid=c[0]
 variants={x['id']:x for file in META.glob(f'{pid}-variants*.json') for x in load(file)['data']}
 variant=variants[v['variant_id']]
 stylesPath=META/f'{pid}-styles.json'
 if not stylesPath.exists():save(stylesPath,pf.get(f'/v2/catalog-products/{pid}/mockup-styles'))
 aliases={}
 if any(f['type']=='default' for f in v['files']):
  ap=R/f'store/launch-brand-audit/private/catalog-{pid}.json'
  if not ap.exists():save(ap,pf.get(f'/products/{pid}'))
  aliases={f['id']:f['type'] for f in load(ap)['result']['product']['files']}
 placements=[]
 for f in v['files']:
  if f['type']=='preview':continue
  name=aliases.get(f['type'],f['type'])
  tech='embroidery' if name.startswith('embroidery') else 'dtfilm' if name.endswith('_dtf') else 'dtg'
  dim=next(x for x in variant['placement_dimensions'] if x['placement']==name)
  width,height=f['width']/f['dpi'],f['height']/f['dpi']
  assert width<=dim['width']+.02 and height<=dim['height']+.02,(key,name,dim,width,height)
  matches=[r for r in records if r['oldFileId']==f['id'] and v['id'] in r['variants']]
  if matches:
   assert len(matches)==1;url=f'https://raw.githubusercontent.com/bobbyvicks/offshft/{commit}/{matches[0]["publishedPath"]}'
  elif f['url']:url=f['url']
  else:
   info=common[str(f['id'])];assert info['md5']==f['hash'];url=f'https://raw.githubusercontent.com/bobbyvicks/offshft/{commonCommit}/{info["path"]}'
  layer={'type':'file','url':url,'position':{'width':width,'height':height,'left':0,'top':0}}
  if tech=='embroidery':
   # Headwear changes from puff to flat, retaining the original thread palette.
   suffix=name.removeprefix('embroidery_')
   option='thread_colors_'+suffix
   value=next((o['value'] for o in v['options'] if o['id']==option and o['value']),None)
   if not value:
    values=[o['value'] for o in v['options'] if o['id'].startswith('thread_colors') and isinstance(o['value'],list) and o['value']]
    assert len(values)==1,(key,values);value=values[0]
   layer['layer_options']=[{'name':'thread_colors','value':value}]
  placements.append({'placement':name,'technique':tech,'print_area_type':'simple','layers':[layer]})
 styles=load(stylesPath)['data'];views={};styleIds=[]
 wanted=['Front','Back'] if product['handle'].endswith('-golf-shirt') or product['handle']=='the-rest-is-ours-hoodie' else ['Front']
 for view in wanted:
  permitted=[s for p in styles for s in p['mockup_styles'] if s['view_name']==view and (s.get('restricted_to_variants') is None or v['variant_id'] in s['restricted_to_variants'])]
  chosen=None
  for category in ['Ghost','Default','Flat','Flat 2']:
   ids={s['id'] for s in permitted if s['category_name']==category}
   if not ids:continue
   assert len(ids)==1,(pid,category,view,ids);chosen=next(iter(ids));break
  assert chosen,(pid,view);styleIds.append(chosen);views[str(chosen)]=view.lower()
 jkey='-'.join(map(str,key)).lower().replace(' ','-').replace('/','-')
 same=[str(vid) for vid,x in nav[product['handle']]['variants'].items() if tuple(x[:3])==tuple(c[:3])]
 jobs.append({'key':jkey,'handle':product['handle'],'productId':product['shopifyId'],'pid':pid,'finish':c[1],'colour':c[2],'views':views,'variantIds':same,'payload':{'source':'catalog','catalog_product_id':pid,'catalog_variant_ids':[v['variant_id']],'mockup_style_ids':styleIds,'placements':placements}})
assert len(jobs)==209
save(out/'plan.json',jobs)
print(json.dumps({'supplierContexts':len(jobs),'views':sum(len(j['views']) for j in jobs)}))
