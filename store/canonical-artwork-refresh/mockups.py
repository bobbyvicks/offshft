"""Resumable supplier mockup jobs; exact canonical files, transparent PNG output."""
import sys,json,copy,argparse,time,urllib.request,urllib.parse,urllib.error,hashlib
from pathlib import Path
HERE=Path(__file__).parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'store/printful-setup'));import printful_client as pf
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
save=lambda p,d:p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
OUT=HERE/'mockups';OUT.mkdir(exist_ok=True)
def submit():
 jobs=load(OUT/'plan.json')
 for start in range(0,len(jobs),5):
  rows=jobs[start:start+5];receipt=OUT/f'batch-{start//5:02}.json';payload={'format':'png','mockup_width_px':1000,'products':[j['payload'] for j in rows]}
  if receipt.exists():assert load(receipt).get('httpStatus')==200,'Reconcile submitted task';continue
  save(receipt,{'state':'INFLIGHT','keys':[j['key'] for j in rows],'payload':payload})
  req=urllib.request.Request(pf.BASE_URL+'/v2/mockup-tasks',data=json.dumps(payload).encode(),method='POST',headers={'Authorization':'Bearer '+pf.read_setup_credential(),'X-PF-Store-Id':str(pf.STORE_ID),'Content-Type':'application/json','Accept':'application/json'})
  try:
   with urllib.request.build_opener(pf.NoRedirect).open(req,timeout=45) as response:status,r=response.status,json.load(response)
  except urllib.error.HTTPError as e:status,r=e.code,json.load(e)
  save(receipt,{'httpStatus':status,'keys':[j['key'] for j in rows],'payload':payload,'response':r})
  assert status==200,(status,r)
  print('Submitted mockups',min(start+5,len(jobs)),'/',len(jobs),flush=True)
  if start+5<len(jobs):time.sleep(61)
def poll():
 jobs={j['key']:j for j in load(OUT/'plan.json')};pending=[];count=0
 for path in sorted(OUT.glob('batch-*.json')):
  receipt=load(path);assert receipt['httpStatus']==200
  for key,task in zip(receipt['keys'],receipt['response']['data'],strict=True):
   resultpath=OUT/(key+'-result.json')
   r=load(resultpath) if resultpath.exists() else None
   if not r or r['data'][0]['status']!='completed':r=pf.get('/v2/mockup-tasks?id='+str(task['id']));save(resultpath,r)
   d=r['data'][0]
   if d['status']!='completed':pending.append([key,d['status']]);continue
   group=d['catalog_variant_mockups'];assert len(group)==1
   for image in group[0]['mockups']:
    view=jobs[key]['views'][str(image['style_id'])];dest=OUT/(key+'-'+view+'.png')
    if not dest.exists():
     url=image['mockup_url'];host=urllib.parse.urlsplit(url).hostname;assert host.endswith(('.printful.com','.amazonaws.com'))
     dest.write_bytes(urllib.request.urlopen(url,timeout=45).read())
   count+=1
 print(json.dumps({'completedContexts':count,'pending':pending}),flush=True)
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('action',choices=['submit','poll']);globals()[a.parse_args().action]()

