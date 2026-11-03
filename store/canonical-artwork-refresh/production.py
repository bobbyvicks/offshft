"""Guarded canonical artwork replacement. No orders, prices or variant creation."""
import json,sys,copy,re,hashlib,urllib.request,argparse
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1]
sys.path.insert(0,str(R/'store/printful-setup'));import printful_client as pf
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,d):p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
OUT=H/'private/production';OUT.mkdir(parents=True,exist_ok=True)
records=load(H/'artwork-manifest.json')['records']
def signature(v,options=True):
 d={k:v.get(k) for k in ['id','external_id','sync_product_id','name','synced','variant_id','retail_price','sku','currency','is_ignored','size','color']}
 if options:d['options']=normalize(v['options'])
 return d
def normalize(options):
 result=copy.deepcopy(options)
 for o in result:
  if o['id'].startswith('thread_colors') and isinstance(o['value'],list):o['value']=[x.upper() if isinstance(x,str) and re.fullmatch(r'#[a-fA-F0-9]{6}',x) else x for x in o['value']]
 return sorted(result,key=lambda o:o['id'])
def flat_options(options):
 result=copy.deepcopy(options);byid={o['id']:o for o in result}
 assert byid['embroidery_type']['value']=='3d'
 byid['embroidery_type']['value']='flat'
 for oid,o in list(byid.items()):
  if oid.startswith('thread_colors_3d') and o['value']:
   target=oid.replace('thread_colors_3d','thread_colors',1)
   assert not byid.get(target,{}).get('value'),'Conflicting flat palette'
   if target not in byid:byid[target]={'id':target,'value':[]};result.append(byid[target])
   byid[target]['value']=o['value'];o['value']=[]
 assert any(o['id'].startswith('thread_colors') and '3d' not in o['id'] and o['value'] for o in result)
 return result
def upload():
 commit=(H/'artwork-commit.txt').read_text().strip();assert len(commit)==40
 for r in sorted(records,key=lambda r:not r['headwear']):
  receipt=OUT/f'upload-{r["key"]}.json'
  if receipt.exists():assert load(receipt).get('result',{}).get('id'),'Reconcile upload';continue
  url=f'https://raw.githubusercontent.com/bobbyvicks/offshft/{commit}/{r["publishedPath"]}'
  raw=urllib.request.urlopen(url,timeout=45).read();assert hashlib.sha256(raw).hexdigest()==r['pngSha256']
  save(receipt,{'state':'INFLIGHT','source':r['publishedPath']})
  response=pf.mutate('POST','/files',{'url':url,'filename':r['filename'],'visible':True});save(receipt,response)
  print('Uploaded',r['key'],response['result']['id'],flush=True)
def prepare(headwear_only=False):
 selected=[r for r in records if r['headwear']] if headwear_only else records
 ids={}
 for r in selected:
  receipt=OUT/f'upload-{r["key"]}.json';fid=load(receipt)['result']['id'];f=pf.get('/files/'+str(fid))['result']
  assert f['status']=='ok' and f['hash']==hashlib.md5((R/r['publishedPath']).read_bytes()).hexdigest()
  assert [f['width'],f['height'],f['dpi']]==[r['width'],r['height'],r['dpi']]
  ids[r['key']]=fid
 jobs=[]
 for p in load(H/'private/fresh-before/manifest.json')['products']:
  for v in load(H/f'private/fresh-before/product-{p["printfulId"]}.json')['result']['sync_variants']:
   relevant=[r for r in selected if v['id'] in r['variants']]
   if not relevant:continue
   replacements={r['oldFileId']:ids[r['key']] for r in relevant}
   assert len(replacements)==len(relevant)
   ff=[{'id':replacements.get(f['id'],f['id']),'type':f['type']} for f in v['files'] if f['type']!='preview']
   headwear=any(r['headwear'] for r in relevant)
   options=flat_options(v['options']) if headwear else v['options']
   jobs.append({'handle':p['handle'],'productId':p['printfulId'],'id':v['id'],'externalId':v['external_id'],'before':v,'headwear':headwear,'payload':{'files':ff,'options':options}})
 assert len(jobs)==(81 if headwear_only else 823)
 jobs.sort(key=lambda j:(not j['headwear'],j['handle'],j['id']))
 save(OUT/'plan.json',jobs);save(OUT/'file-map.json',ids);print(f'Prepared {len(jobs)} updates; 81 approved flat embroidery conversions.',flush=True)
def check(v,j):
 assert signature(v,False)==signature(j['before'],False),'Protected variant metadata drift'
 assert normalize(v['options'])==normalize(j['payload']['options']),'Finish/thread options drift'
 assert {(f['id'],f['type']) for f in v['files'] if f['type']!='preview'}=={(f['id'],f['type']) for f in j['payload']['files']},'File assignment drift'
def apply(limit=None):
 jobs=load(OUT/'plan.json');done=0
 for i,j in enumerate(jobs,1):
  receipt=OUT/f'variant-{j["id"]}.json'
  if receipt.exists():assert load(receipt).get('state')=='VERIFIED','Reconcile variant';continue
  current=pf.get('/sync/variant/'+str(j['id']))['result']['sync_variant']
  assert signature(current)==signature(j['before']),'Protected metadata changed since baseline'
  assert {(f['id'],f['type']) for f in current['files'] if f['type']!='preview'}=={(f['id'],f['type']) for f in j['before']['files'] if f['type']!='preview'},'Baseline production file drift'
  save(receipt,{'state':'INFLIGHT','jobId':j['id']})
  payload=copy.deepcopy(j['payload'])
  if j['before']['product']['product_id']==969:
   for f in payload['files']:
    if f['type']=='default':f['type']='front'
  response=pf.mutate('PUT','/sync/variant/'+str(j['id']),payload)
  v=response['result'].get('sync_variant',response['result']);check(v,j)
  save(receipt,{'state':'VERIFIED','jobId':j['id'],'response':response})
  print(f'Updated {i}/{len(jobs)}: {j["handle"]} / {j["externalId"]}',flush=True);done+=1
  if limit and done>=limit:break
def verify():
 jobs={j['id']:j for j in load(OUT/'plan.json')};issues=[];summary=[]
 dest=H/'private/fresh-after';dest.mkdir(exist_ok=True)
 for p in load(H/'private/fresh-before/manifest.json')['products']:
  baseline=load(H/f'private/fresh-before/product-{p["printfulId"]}.json')['result'];response=pf.get('/sync/products/'+str(p['printfulId']));save(dest/f'product-{p["printfulId"]}.json',response);after=response['result']
  assert {v['id'] for v in baseline['sync_variants']}=={v['id'] for v in after['sync_variants']}
  for old in baseline['sync_variants']:
   v=next(v for v in after['sync_variants'] if v['id']==old['id'])
   try:
    if old['id'] in jobs:check(v,jobs[old['id']])
    else:
     assert signature(v)==signature(old)
     assert {(f['id'],f['type']) for f in v['files'] if f['type']!='preview'}=={(f['id'],f['type']) for f in old['files'] if f['type']!='preview'}
   except AssertionError as e:issues.append({'handle':p['handle'],'id':old['id'],'issue':str(e)})
  summary.append({'handle':p['handle'],'variants':len(after['sync_variants'])})
 report={'status':'FAIL' if issues else 'PASS','products':len(summary),'variants':sum(p['variants'] for p in summary),'changedVariants':len(jobs),'flatHeadwearVariants':sum(j['headwear'] for j in jobs.values()),'issues':issues}
 save(H/'production-verification.json',report);assert not issues,issues;print(json.dumps(report),flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('action',choices=['upload','prepare','apply','verify']);parser.add_argument('--limit',type=int);parser.add_argument('--headwear-only',action='store_true');a=parser.parse_args()
 if a.action=='apply':apply(a.limit)
 elif a.action=='prepare':prepare(a.headwear_only)
 else:globals()[a.action]()
