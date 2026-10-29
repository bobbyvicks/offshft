"""Compare a fresh Shopify product export to the authorized colour matrix."""
import json
from pathlib import Path
from urllib.parse import urlparse,unquote
ROOT=Path(__file__).resolve().parent
plan=json.loads((ROOT/'colour-plan.json').read_text())
baseline=json.loads((ROOT/'verification/variant-baseline.json').read_text())
current=json.loads((ROOT/'verification/shopify-final-export.json').read_text())

def product_nodes(obj):
    found={}
    def walk(x):
        if isinstance(x,dict):
            if str(x.get('id','')).startswith('gid://shopify/Product/') and 'variants' in x:
                found[x['id'].split('/')[-1]]=x
            for v in x.values():walk(v)
        elif isinstance(x,list):
            for v in x:walk(v)
    walk(obj)
    return found

def nodes(connection):
    if isinstance(connection,list):return connection
    if 'nodes' in connection:return connection['nodes']
    return [e['node'] for e in connection.get('edges',[])]

def options(v):return tuple(sorted((o['name'],o['value']) for o in v['selectedOptions']))
def filename(url):return unquote(urlparse(url or '').path.split('/')[-1])
def locations(v):
    return sorted((n['location']['id'],json.dumps(n['location'].get('fulfillmentService'),sort_keys=True)) for n in nodes(v['inventoryItem']['inventoryLevels']))

old=product_nodes(baseline);new=product_nodes(current)
errors=[];results=[];retained=0;added=0;assigned=0
def check(condition,message):
    if not condition:errors.append(message)
for p in plan['products']:
    key=p['key'];pid=p['productId']
    if pid not in new:
        errors.append(f'{key}: product missing');continue
    live=new[pid];variants=nodes(live['variants']);by_id={v['id']:v for v in variants};by_options={options(v):v for v in variants}
    check(len(variants)==p['finalVariantCount'],f'{key}: expected {p["finalVariantCount"]} variants, got {len(variants)}')
    check(len(by_options)==len(variants),f'{key}: duplicate option combinations')
    check(live.get('status')=='ACTIVE',f'{key}: status is not ACTIVE')
    old_by_id={v['id']:v for v in nodes(old[pid]['variants'])}
    for oid,ov in old_by_id.items():
        if oid not in by_id:
            errors.append(f'{key}: original ID missing {oid}');continue
        retained+=1;nv=by_id[oid]
        check(nv['price']==ov['price'],f'{key}: price changed for {oid}')
        check((nv.get('sku') or '')==(ov.get('sku') or ''),f'{key}: SKU changed for {oid}')
        check(nv['inventoryItem']['tracked']==ov['inventoryItem']['tracked'],f'{key}: inventory tracking changed for {oid}')
        check(locations(nv)==locations(ov),f'{key}: inventory location/fulfilment changed for {oid}')
    expected=set()
    for pair in p['pairs']:
        for target in pair['variants']:
            option_key=tuple(sorted(target['options'].items()));expected.add(option_key)
            if option_key not in by_options:
                errors.append(f'{key}: missing combination {dict(option_key)}');continue
            v=by_options[option_key]
            if target['existingVariantId']:
                check(v['id']==target['existingVariantId'],f'{key}: reassigned original combination {dict(option_key)}')
            else:
                added+=1
                check(v['id'] not in old_by_id,f'{key}: new colour reuses existing ID')
                source=old_by_id[target['copyConfigurationFrom']]
                check(locations(v)==locations(source),f'{key}: new variant location/fulfilment differs from original style-size')
            check(v['price']==target['price'],f'{key}: wrong price for {dict(option_key)}')
            check(not v['inventoryItem']['tracked'],f'{key}: new inventory tracking enabled')
            check(not v.get('sku'),f'{key}: unexpected SKU for {dict(option_key)}')
            url=(v.get('image') or {}).get('url','')
            actual=filename(url);wanted=Path(target['image']).name
            check(actual==wanted,f'{key}: image {actual!r} expected {wanted!r} for {dict(option_key)}')
            if actual==wanted:assigned+=1
    check(set(by_options)==expected,f'{key}: unexpected option combination(s)')
    media=nodes(live.get('media',{}));filenames=[filename((m.get('image') or {}).get('url','')) for m in media]
    required={Path(pair['image']).name for pair in p['pairs']}
    check(required.issubset(filenames),f'{key}: missing product media {required-set(filenames)}')
    primary=Path(p['pairs'][0]['image']).name
    check(bool(filenames) and filenames[0]==primary,f'{key}: incorrect primary image')
    results.append({'key':key,'productId':pid,'variantCount':len(variants),'originalIdsRetained':len(set(old_by_id)&set(by_id)),'primaryImage':filenames[0] if filenames else None,'mediaCount':len(media),'status':live.get('status')})
report={'productCount':len(results),'originalIdsRetained':retained,'newVariants':added,'matchedVariantImages':assigned,'expectedVariants':plan['finalVariants'],'errors':errors,'products':results}
(ROOT/'verification/shopify-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='products'},indent=2))
raise SystemExit(1 if errors else 0)
