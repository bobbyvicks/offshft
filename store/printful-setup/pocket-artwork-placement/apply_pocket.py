"""Offline by default. Explicit --apply uses only the existing scoped Printful client."""
from __future__ import annotations
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import time
import urllib.request

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
PRIVATE = HERE.parent / 'private' / 'pocket-artwork-placement'
SIZES = ('S', 'M', 'L', 'XL', '2XL')
SPECS = {
    'logo': {'product':487246205, 'external':'15476778631490', 'title':'OFF SHFT Logo T-Shirt', 'start':5605512017,
             'externalVariants':('67946096296258','67946096329026','67946096361794','67946096394562','67946096427330'), 'png':'logo-pocket-2in.png'},
    'clock': {'product':487246206, 'external':'15476778729794', 'title':'The Clock T-Shirt', 'start':5605512034,
              'externalVariants':('67946096689474','67946096722242','67946096755010','67946096787778','67946096820546'), 'png':'clock-pocket-1in.png'},
}
CONFIG_KEYS = ('id','external_id','sync_product_id','name','variant_id','synced','is_ignored','retail_price','sku','currency','files','options','warehouse_product_id','warehouse_product_variant_id')
IDENTITY_KEYS = ('id','external_id','sync_product_id','name','retail_price','currency','warehouse_product_id','warehouse_product_variant_id')
# Exact non-operative defaults observed after the Logo S DTG pocket canary.
# The supplier exposes these on a DTG mapping without any embroidery file.
SUPPLIER_DEFAULT_OPTIONS = {
    'embroidery_type':'flat', 'lifelike':False,
    'thread_colors':[], 'text_thread_colors':[], 'thread_colors_3d':[],
    'thread_colors_large_center':[], 'text_thread_colors_large_center':[],
    'thread_colors_sleeve_left_top':[], 'text_thread_colors_sleeve_left_top':[],
    'thread_colors_sleeve_right_top':[], 'text_thread_colors_sleeve_right_top':[],
    'license_type':[],
}

def require(condition, message):
    if not condition:
        raise ValueError(message)

def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))

def write(path, data):
    Path(path).write_text(json.dumps(data, indent=2)+'\n', encoding='utf-8')

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def result(data):
    require(data.get('code') == 200, 'Unexpected API response code')
    return data['result']

def load_baselines():
    return {k:read(PRIVATE/(k+'-before.json')) for k in SPECS}

def rows_for(design):
    s=SPECS[design]
    return [{'design':design,'syncProductId':s['product'],'shopifyProductId':s['external'],
             'syncVariantId':s['start']+i,'shopifyVariantId':external,'catalogueVariantId':15150+i,
             'style':'Pocket','colour':'White','size':SIZES[i], 'name':f"{s['title']} / Pocket / {SIZES[i]} / White"}
            for i,external in enumerate(s['externalVariants'])]

def make_plan(snapshots):
    rows=[]
    for design,s in SPECS.items():
        r=result(snapshots[design]); p=r['sync_product']; vs=r['sync_variants']
        require(p['id']==s['product'] and p['external_id']==s['external'] and p['name']==s['title'], 'Product identity mismatch')
        require(len(vs)==17 and len({v['id'] for v in vs})==17, 'Expected exactly17 distinct variants')
        byid={v['id']:v for v in vs}
        targets=rows_for(design)
        require(sum(' / Pocket / ' in v['name'] for v in vs)==5, 'Expected exactly5 Pocket variants')
        for row in targets:
            v=byid.get(row['syncVariantId'],{})
            require(v.get('external_id')==row['shopifyVariantId'] and v.get('sync_product_id')==s['product'] and v.get('name')==row['name'], 'Pocket identity mismatch')
        rows.extend(targets)
    return {'storeId':18982909,'scope':'Only ten existing Pocket / White / S-2XL variants; preserve24 Heavyweight configurations, retail prices, populated SKUs and Shopify IDs. Record supplier-generated SKUs for completed targets whose original SKU was null/empty.',
            'technique':'DTG','placement':'pocket','catalogueProductId':593,'printfileId':191,'fieldPixels':[450,300],'fieldDpi':150,
            'physicalFieldInches':[3,2],'canvasPixels':[1800,1200],'canvasDpi':600,
            'supplierPlacementVerified':False,'variants':rows}

def payload_for(row, file_id):
    require(row in [r for d in SPECS for r in rows_for(d)], 'Unapproved target row')
    require(type(file_id) is int and file_id>0, 'Invalid supplier file ID')
    return {'variant_id':row['catalogueVariantId'],'files':[{'id':file_id,'type':'pocket'}],'options':[],'is_ignored':False}

def artwork_url(commit, filename):
    require(bool(re.fullmatch('[0-9a-f]{40}',commit)), 'Use full immutable40-character lowercase commit SHA')
    require(filename in {x['png'] for x in SPECS.values()}, 'Unapproved artwork file')
    return f'https://raw.githubusercontent.com/bobbyvicks/offshft/{commit}/store/printful-setup/pocket-artwork-placement/{filename}'

def render_canvas(design):
    """Read exact SVG-rendered output for independent pixel/geometry verification."""
    from PIL import Image
    item=next(x for x in read(HERE/'canvas-manifest.json')['files'] if x['design']==design)
    require(sha(HERE/item['png'])==item['pngSha256'], 'Canvas hash mismatch')
    return Image.open(HERE/item['png']), item

def has_only_empty_supplier_defaults(options):
    if not isinstance(options,list):
        return False
    if options==[]:
        return True
    if len(options)!=len(SUPPLIER_DEFAULT_OPTIONS):
        return False
    seen=set()
    for option in options:
        if not isinstance(option,dict) or set(option)!={'id','value'}:
            return False
        id=option['id']
        if not isinstance(id,str) or id in seen or id not in SUPPLIER_DEFAULT_OPTIONS:
            return False
        seen.add(id)
        expected=SUPPLIER_DEFAULT_OPTIONS[id]
        if type(option['value']) is not type(expected) or option['value']!=expected:
            return False
    return seen==set(SUPPLIER_DEFAULT_OPTIONS)

def verify_state(before, current, completed):
    make_plan(before); make_plan(current)
    require(set(completed).issubset({str(r['syncVariantId']) for d in SPECS for r in rows_for(d)}), 'Completed ledger contains unknown variant')
    generated_skus=[]
    for design in SPECS:
        a={v['id']:v for v in result(before[design])['sync_variants']}
        b={v['id']:v for v in result(current[design])['sync_variants']}
        require(set(a)==set(b), 'Variant membership changed')
        targets={r['syncVariantId']:r for r in rows_for(design)}
        for id,v in a.items():
            now=b[id]
            if str(id) not in completed:
                require({k:v.get(k) for k in CONFIG_KEYS}=={k:now.get(k) for k in CONFIG_KEYS}, f'Unchanged variant {id} drifted; stop')
                continue
            require(id in targets,'Completed ledger contains unrelated variant')
            require({k:v.get(k) for k in IDENTITY_KEYS}=={k:now.get(k) for k in IDENTITY_KEYS},f'Identity/price changed for {id}')
            old_sku,new_sku=v.get('sku'),now.get('sku')
            if old_sku!=new_sku:
                require(old_sku in (None,'') and isinstance(new_sku,str) and bool(new_sku.strip()), f'Existing or invalid supplier SKU changed for {id}')
                generated_skus.append({'syncVariantId':id,'shopifyVariantId':v['external_id'],'sku':new_sku})
            require(now.get('variant_id')==targets[id]['catalogueVariantId'] and now.get('synced') is True and now.get('is_ignored') is False, f'Variant {id} not synced as intended')
            require(now.get('size')==targets[id]['size'] and now.get('color')=='White', f'Supplier size/colour mismatch for {id}')
            art=[f for f in now.get('files',[]) if f.get('type') not in ('preview','mockup')]
            require(len(art)==1 and art[0].get('type')=='pocket' and art[0].get('id')==completed[str(id)] and art[0].get('status')=='ok', f'Pocket file mismatch for {id}')
            require(has_only_empty_supplier_defaults(now.get('options')), f'Unexpected populated/non-default options for {id}')
    return {'generatedSupplierSkus':generated_skus}

def validate_catalogue(catalogue, fields):
    c=result(catalogue); f=result(fields)
    require(c['product']['id']==593 and f['product_id']==593, 'Wrong catalogue product')
    variants={v['id']:v for v in c['variants']}
    placements={v['variant_id']:v['placements'] for v in f['variant_printfiles']}
    area=next(x for x in f['printfiles'] if x['printfile_id']==191)
    require(all(area[k]==v for k,v in {'width':450,'height':300,'dpi':150,'fill_mode':'fit','can_rotate':False}.items()), 'Pocket field changed')
    for i,size in enumerate(SIZES):
        v=variants[15150+i]
        require(v['size']==size and v['color']=='White' and v['in_stock'] is True, 'Supplier variant unavailable/mismatched')
        require(placements[15150+i].get('pocket')==191, 'Pocket field not supported')

def load_client():
    spec=importlib.util.spec_from_file_location('scoped_printful_client',HERE.parent/'printful_client.py')
    client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
    require(client.STORE_ID==18982909,'Wrong client store')
    return client

def live_products(client):
    return {d:client.get('/sync/products/'+str(s['product'])) for d,s in SPECS.items()}

def apply(args, plan, baseline):
    require(args.commit is not None, '--commit required')
    require(args.phase=='canary' or args.placement_verified, 'Verify both canary pocket sizes/positions in native Designer before remaining variants')
    manifest=read(HERE/'canvas-manifest.json')['files']
    for item in manifest:
        require(sha(HERE/item['png'])==item['pngSha256'],'Local canvas changed')
        url=artwork_url(args.commit,item['png'])
        # Public immutable artwork fetch; no credentials or signed URLs.
        with urllib.request.urlopen(url,timeout=30) as response:
            require(hashlib.sha256(response.read()).hexdigest()==item['pngSha256'],'Published canvas differs from reviewed output')
    ledger_path=PRIVATE/'apply-ledger.json'
    ledger=read(ledger_path) if ledger_path.exists() else {'commit':args.commit,'files':{},'completed':{},'inflight':None}
    require(ledger['commit']==args.commit,'Ledger commit mismatch')
    require(not ledger.get('inflight'),'Previous mutation outcome needs manual reconciliation; no retry')
    client=load_client()
    stores=result(client.get('/stores'))
    require(len(stores)==1 and stores[0]['id']==18982909,'Token/store scope mismatch')
    validate_catalogue(client.get('/products/593'),client.get('/mockup-generator/printfiles/593?technique=DTG'))
    verify_state(baseline,live_products(client),ledger['completed'])
    for item in manifest:
        design=item['design']
        if design not in ledger['files']:
            ledger['inflight']={'operation':'upload','design':design};write(ledger_path,ledger)
            response=client.mutate('POST','/files',{'url':artwork_url(args.commit,item['png']),'filename':item['png'],'visible':True})
            file=response['result'];require(type(file.get('id')) is int,'Upload did not return file ID')
            ledger['files'][design]=file['id'];ledger['inflight']=None;write(ledger_path,ledger)
        fid=ledger['files'][design]
        for attempt in range(6):
            file=result(client.get('/files/'+str(fid)))
            if file.get('status')=='ok':break
            require(file.get('status')=='waiting','Supplier file processing failed')
            if attempt<5:time.sleep(2)
        require(file.get('status')=='ok' and file.get('width')==1800 and file.get('height')==1200,'Uploaded canvas not ready/full size')
    canaries={5605512017,5605512034}
    targets=[r for r in plan['variants'] if (r['syncVariantId'] in canaries)==(args.phase=='canary')]
    if args.phase=='remaining':require(canaries.issubset({int(x) for x in ledger['completed']}),'Both canaries must be verified first')
    for row in targets:
        id=row['syncVariantId']
        if str(id) in ledger['completed']:continue
        verify_state(baseline,live_products(client),ledger['completed'])
        fid=ledger['files'][row['design']]
        ledger['inflight']={'operation':'sync','syncVariantId':id,'fileId':fid};write(ledger_path,ledger)
        client.mutate('PUT','/sync/variant/'+str(id),payload_for(row,fid),existing_ids={r['syncVariantId'] for r in plan['variants']})
        candidate={**ledger['completed'],str(id):fid}
        verify_state(baseline,live_products(client),candidate)
        ledger['completed']=candidate;ledger['inflight']=None;write(ledger_path,ledger)
        print(json.dumps({'verifiedPocketSyncVariantId':id,'size':row['size'],'design':row['design']}),flush=True)
    final=live_products(client);evidence=verify_state(baseline,final,ledger['completed'])
    for design,data in final.items():write(PRIVATE/(design+'-after.json'),data)
    write(HERE/'apply-verification.json',{'completed':ledger['completed'],'unchangedHeavyweightCount':24,'phase':args.phase,'nativePlacementVerifiedByOperator':args.placement_verified,'commit':args.commit,**evidence})

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply',action='store_true');parser.add_argument('--commit')
    parser.add_argument('--phase',choices=('canary','remaining'),default='canary')
    parser.add_argument('--placement-verified',action='store_true')
    args=parser.parse_args()
    baseline=load_baselines();plan=make_plan(baseline)
    validate_catalogue(read(PRIVATE/'catalogue-before.json'),read(PRIVATE/'printfiles-before.json'))
    write(HERE/'plan.json',plan)
    if args.apply:apply(args,plan,baseline)
    else:print(json.dumps({'mode':'OFFLINE','targetCount':len(plan['variants']),'preservedHeavyweightCount':24,'credentialsRead':False,'apiRequests':0}))

if __name__=='__main__':
    main()
