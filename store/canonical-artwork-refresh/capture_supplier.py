"""Fresh read-only product/file snapshot for the exact publicly listed Shopify products."""
import sys,json,time
from pathlib import Path
from datetime import datetime,timezone
HERE=Path(__file__).parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'store/printful-setup'));import printful_client as pf
catalogue=json.loads((HERE/'public-before.json').read_text())['products']
index=pf.get('/sync/products?limit=100&offset=0')
assert index['paging']['total']==len(index['result'])
out=HERE/'private/fresh-before';out.mkdir(parents=True,exist_ok=True)
manifest={'capturedAt':datetime.now(timezone.utc).isoformat(),'storeId':pf.STORE_ID,'readOnly':True,'products':[]}
for p in catalogue:
 matches=[s for s in index['result'] if str(s['external_id'])==str(p['id'])];assert len(matches)==1,p['handle']
 s=matches[0];r=pf.get('/sync/products/'+str(s['id']));d=r['result']
 assert str(d['sync_product']['external_id'])==str(p['id'])
 assert {str(v['id']) for v in p['variants']}=={str(v['external_id']) for v in d['sync_variants']},p['handle']
 (out/f'product-{s["id"]}.json').write_text(json.dumps(r,indent=2)+'\n')
 manifest['products'].append({'handle':p['handle'],'shopifyId':p['id'],'printfulId':s['id'],'variants':len(d['sync_variants']),'synced':sum(v['synced'] for v in d['sync_variants']),'ignored':sum(v['is_ignored'] for v in d['sync_variants'])})
 print(f'Read {len(manifest["products"])}/{len(catalogue)}: {p["handle"]}',flush=True)
 time.sleep(.3)
assert sum(p['variants'] for p in manifest['products'])==1153
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'products':len(manifest['products']),'variants':sum(p['variants'] for p in manifest['products']),'synced':sum(p['synced'] for p in manifest['products']),'heldIgnored':sum(p['ignored'] for p in manifest['products']),'remoteMutations':0}),flush=True)

