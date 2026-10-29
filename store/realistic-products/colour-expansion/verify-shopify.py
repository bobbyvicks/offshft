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
before_media_path=ROOT/'verification/shopify-before-media-export.json'
before_media_export = json.loads(before_media_path.read_text()) if before_media_path.is_file() else {}
before_media = product_nodes(before_media_export)
errors=[];results=[];retained=0;added=0;assigned=0
def check(condition,message):
    if not condition:errors.append(message)


def check_complete(connection, label):
    """A matching subset is not proof that an exported connection is complete."""
    check(isinstance(connection, dict), f'{label}: connection metadata missing')
    if isinstance(connection, dict):
        check(connection.get('pageInfo', {}).get('hasNextPage') is False,
              f'{label}: connection incomplete or pageInfo missing')
    return nodes(connection or {})


def publication_state(product, label):
    rows = check_complete(product.get('resourcePublicationsV2'), f'{label}: publications')
    states = []
    for row in rows:
        publication_id = row.get('publication', {}).get('id')
        check(bool(publication_id) and isinstance(row.get('isPublished'), bool),
              f'{label}: publication ID or isPublished missing')
        states.append((publication_id or '', row.get('isPublished')))
    check(len(states) == len({pid for pid, _ in states}), f'{label}: duplicate publication IDs')
    selected = product.get('selectedPublicationChannels')
    check(isinstance(selected, list), f'{label}: selected publication channels missing')
    selected_ids = {channel.get('id') for channel in selected or []}
    check(selected_ids == {pid for pid, published in states if published},
          f'{label}: selected channels disagree with publication state')
    return tuple(sorted(states)), selected_ids


def check_option_values(product, expected_combinations, label):
    """Validate displayed choices, including unused values with no variant row."""
    expected_values = {}
    for combination in expected_combinations:
        for name, value in combination:
            expected_values.setdefault(name, set()).add(value)
    declared_options = product.get('options')
    check(isinstance(declared_options, list), f'{label}: product options missing')
    actual_values = {}
    valid = isinstance(declared_options, list)
    for option in declared_options or []:
        name = option.get('name')
        values = option.get('values')
        has_values = isinstance(values, list) and all(isinstance(value, str) for value in values)
        check(has_values, f'{label}: {name} option values missing or invalid')
        check(name not in actual_values, f'{label}: duplicate product option {name}')
        valid = valid and has_values and name not in actual_values
        actual_values[name] = set(values) if has_values else set()
        if has_values:
            check(len(values) == len(set(values)), f'{label}: duplicate {name} option values')
            valid = valid and len(values) == len(set(values))
    check(set(actual_values) == set(expected_values), f'{label}: product option names differ from target')
    for name in set(actual_values) | set(expected_values):
        actual = actual_values.get(name, set())
        wanted = expected_values.get(name, set())
        check(actual == wanted,
              f'{label}: {name} option values differ from target; extra={sorted(actual - wanted)}, missing={sorted(wanted - actual)}')
    return valid and actual_values == expected_values


planned_product_ids = {p['productId'] for p in plan['products']}
baseline_ids = {v['id'] for pid in planned_product_ids for v in nodes(old[pid]['variants'])}
current_variant_ids = [v['id'] for pid in planned_product_ids if pid in new for v in nodes(new[pid]['variants'])]
current_ids = set(current_variant_ids)
all_exported_ids = {v['id'] for product in new.values() for v in nodes(product['variants'])}
approved_removals = plan['approvedVariantRemovals']
approved_removal_ids = {r['variantId'] for r in approved_removals}
original_media_ids_all = {
    media['id'] for product in before_media.values() for media in nodes(product.get('media', {}))
}
current_media_ids_all = {
    media['id'] for product in new.values() for media in nodes(product.get('media', {}))
}
before_publications = {}
publication_matches = 0
option_value_matches = 0

check(len(planned_product_ids) == 17, 'plan: expected 17 products')
check(set(new) == planned_product_ids, 'final export: expected exactly the 17 planned products')
check(set(before_media) == planned_product_ids, 'before-media export: expected exactly the 17 planned products')
check(not current.get('errors'), 'final export: source reported errors')
check(not before_media_export.get('errors'), 'before-media export: source reported errors')
check(len(baseline_ids) == plan['originalVariants'] == 142, 'baseline: expected 142 original variant IDs')
check(len(original_media_ids_all) == 48, 'before-media export: expected 48 unique original media IDs')

# Validate the second baseline against the original 142-ID snapshot. Colour is
# the sole authorized option addition at this point; the six removals come later.
before_variant_ids = []
before_media_ids = []
for product in plan['products']:
    pid = product['productId']
    key = product['key']
    if pid not in before_media:
        continue
    prior = before_media[pid]
    prior_variants = check_complete(prior.get('variants'), f'{key}: before-media variants')
    prior_by_id = {variant['id']: variant for variant in prior_variants}
    original_by_id = {variant['id']: variant for variant in nodes(old[pid]['variants'])}
    before_variant_ids.extend(prior_by_id)
    check(len(prior_by_id) == len(prior_variants), f'{key}: duplicate before-media variant IDs')
    check(set(prior_by_id) == set(original_by_id), f'{key}: before-media original IDs differ from baseline')
    expected_base_options = {
        variant['existingVariantId']: variant['options']
        for pair in product['pairs'] for variant in pair['variants'] if variant['existingVariantId']
    }
    expected_base_options.update({
        removal['variantId']: removal['options'] for removal in approved_removals if removal['productId'] == pid
    })
    for variant_id, original in original_by_id.items():
        if variant_id not in prior_by_id:
            continue
        prior_variant = prior_by_id[variant_id]
        check_complete(prior_variant['inventoryItem']['inventoryLevels'],
                       f'{key}: before-media inventory levels for {variant_id}')
        check(dict(options(prior_variant)) == expected_base_options[variant_id],
              f'{key}: incorrect base Colour/options for {variant_id}')
        check(set(options(original)).issubset(options(prior_variant)),
              f'{key}: before-media original options changed for {variant_id}')
        check(prior_variant['price'] == original['price'], f'{key}: before-media price changed for {variant_id}')
        check((prior_variant.get('sku') or '') == (original.get('sku') or ''),
              f'{key}: before-media SKU changed for {variant_id}')
        check(prior_variant['inventoryItem']['tracked'] == original['inventoryItem']['tracked'],
              f'{key}: before-media tracking changed for {variant_id}')
        check(locations(prior_variant) == locations(original),
              f'{key}: before-media location/fulfilment changed for {variant_id}')
    before_media_ids.extend(media['id'] for media in check_complete(prior.get('media'), f'{key}: before-media media'))
    before_publications[pid] = publication_state(prior, f'{key}: before-media')
check(len(before_variant_ids) == len(set(before_variant_ids)) == 142 and set(before_variant_ids) == baseline_ids,
      'before-media export: original 142-ID baseline not preserved')
check(len(before_media_ids) == len(set(before_media_ids)) == 48,
      'before-media export: expected 48 unique media attachments')

check(len(approved_removal_ids) == len(approved_removals) == plan['approvedRemovalCount'] == 6,
      'plan: expected six distinct approved removal IDs')
for removal in approved_removals:
    pid = removal['productId']
    originals = {v['id']: v for v in nodes(old[pid]['variants'])} if pid in old else {}
    variant = originals.get(removal['variantId'])
    check(variant is not None, f'approved removal is not in its baseline product: {removal["variantId"]}')
    if variant is not None:
        check(dict(options(variant)) == {'Size': '3XL'},
              f'approved removal is not a baseline 3XL variant: {removal["variantId"]}')
    check(removal['productKey'].split('-')[0] in ['sweatpants', 'jacket'],
          f'approved removal is outside sweatpants/jackets: {removal["variantId"]}')
    check(removal['variantId'] not in all_exported_ids,
          f'approved removal still present: {removal["variantId"]}')

check(len(current_variant_ids) == len(current_ids), 'final export: duplicate variant IDs')
check(baseline_ids - current_ids == approved_removal_ids,
      'final export: missing original IDs must equal exactly the six approved removals')
check(len(baseline_ids & current_ids) == plan['retainedOriginalVariants'] == 136,
      'final export: expected 136 retained original IDs')
check(len(current_ids - baseline_ids) == plan['newVariants'] == 117,
      'final export: expected 117 new variant IDs')
check(len(current_ids) == plan['finalVariants'] == 253, 'final export: expected 253 distinct variants')

for p in plan['products']:
    key=p['key'];pid=p['productId']
    if pid not in new:
        errors.append(f'{key}: product missing');continue
    live=new[pid];variants=nodes(live['variants']);by_id={v['id']:v for v in variants};by_options={options(v):v for v in variants}
    check_complete(live.get('variants'), f'{key}: final variants')
    for variant in variants:
        check_complete(variant['inventoryItem']['inventoryLevels'],
                       f'{key}: final inventory levels for {variant["id"]}')
    live_publications = publication_state(live, f'{key}: final')
    if pid in before_publications:
        same_publications = live_publications == before_publications[pid]
        check(same_publications, f'{key}: publication channels or publication state changed')
        publication_matches += same_publications
    check(len(variants)==p['finalVariantCount'],f'{key}: expected {p["finalVariantCount"]} variants, got {len(variants)}')
    check(len(by_options)==len(variants),f'{key}: duplicate option combinations')
    check(live.get('status')=='ACTIVE',f'{key}: status is not ACTIVE')
    old_by_id={v['id']:v for v in nodes(old[pid]['variants'])}
    product_removals = {r['variantId'] for r in approved_removals if r['productId'] == pid}
    check(product_removals == set(p['approvedVariantRemovalIds']), f'{key}: removal manifest mismatch')
    for oid,ov in old_by_id.items():
        if oid in product_removals:
            continue
        if oid not in by_id:
            errors.append(f'{key}: original ID missing {oid}');continue
        retained+=1;nv=by_id[oid]
        check(set(options(ov)).issubset(options(nv)), f'{key}: original option selection changed for {oid}')
        check(nv['price']==ov['price'],f'{key}: price changed for {oid}')
        check((nv.get('sku') or '')==(ov.get('sku') or ''),f'{key}: SKU changed for {oid}')
        check(nv['inventoryItem']['tracked']==ov['inventoryItem']['tracked'],f'{key}: inventory tracking changed for {oid}')
        check(locations(nv)==locations(ov),f'{key}: inventory location/fulfilment changed for {oid}')
        if pid in before_media:
            prior_variant = next((v for v in nodes(before_media[pid]['variants']) if v['id'] == oid), None)
            if prior_variant is not None:
                check(nv.get('inventoryPolicy') == prior_variant.get('inventoryPolicy'),
                      f'{key}: inventory policy changed for {oid}')
    expected=set()
    for pair in p['pairs']:
        for target in pair['variants']:
            option_key=tuple(sorted(target['options'].items()));expected.add(option_key)
            if option_key not in by_options:
                errors.append(f'{key}: missing combination {dict(option_key)}');continue
            v=by_options[option_key]
            if target['existingVariantId']:
                check(target['existingVariantId'] not in approved_removal_ids,
                      f'{key}: approved removal appears in the target matrix')
                check(v['id']==target['existingVariantId'],f'{key}: reassigned original combination {dict(option_key)}')
            else:
                added+=1
                check(v['id'] not in old_by_id,f'{key}: new colour reuses existing ID')
                source=old_by_id[target['copyConfigurationFrom']]
                check(locations(v)==locations(source),f'{key}: new variant location/fulfilment differs from original style-size')
                if pid in before_media:
                    source_before = next((item for item in nodes(before_media[pid]['variants'])
                                          if item['id'] == target['copyConfigurationFrom']), None)
                    if source_before is not None:
                        check(v.get('inventoryPolicy') == source_before.get('inventoryPolicy'),
                              f'{key}: new variant inventory policy differs from original style-size')
            check(v['price']==target['price'],f'{key}: wrong price for {dict(option_key)}')
            check(not v['inventoryItem']['tracked'],f'{key}: new inventory tracking enabled')
            check(not v.get('sku'),f'{key}: unexpected SKU for {dict(option_key)}')
            url=(v.get('image') or {}).get('url','')
            actual=filename(url);wanted=Path(target['image']).name
            check(actual==wanted,f'{key}: image {actual!r} expected {wanted!r} for {dict(option_key)}')
            if actual==wanted:assigned+=1
    check(set(by_options)==expected,f'{key}: unexpected option combination(s)')
    option_value_matches += check_option_values(live, expected, key)
    media = check_complete(live.get('media'), f'{key}: final media')
    filenames=[filename((m.get('image') or {}).get('url','')) for m in media]
    if pid in before_media:
        original_media_ids={m['id'] for m in nodes(before_media[pid].get('media',{}))}
        current_media_ids={m['id'] for m in media}
        check(original_media_ids.issubset(current_media_ids),f'{key}: original media ID removed')
        check(live.get('status')==before_media[pid].get('status'),f'{key}: product status changed')
    required={Path(pair['image']).name for pair in p['pairs']}
    check(required.issubset(filenames),f'{key}: missing product media {required-set(filenames)}')
    primary=Path(p['pairs'][0]['image']).name
    check(bool(filenames) and filenames[0]==primary,f'{key}: incorrect primary image')
    product_retained = len(set(old_by_id) & set(by_id))
    check(product_retained == p['retainedOriginalVariantCount'], f'{key}: wrong retained original ID count')
    results.append({'key':key,'productId':pid,'variantCount':len(variants),'originalIdsRetained':product_retained,'approvedRemovalsAbsent':len(product_removals-set(by_id)),'primaryImage':filenames[0] if filenames else None,'mediaCount':len(media),'status':live.get('status'),'selectedPublicationChannels':live.get('selectedPublicationChannels')})
check(len(results) == len(planned_product_ids), 'final export: not all 17 planned products were checked')
check(original_media_ids_all.issubset(current_media_ids_all), 'final export: original media IDs removed')
check(publication_matches == 17, 'final export: publication channels not preserved for all 17 products')
check(option_value_matches == 17, 'final export: product option values differ from target on one or more products')
check(assigned == plan['finalVariants'], 'final export: not all 253 variant images match their target')
media_attachment_count = sum(len(nodes(product.get('media', {}))) for product in new.values())
check(media_attachment_count == len(current_media_ids_all), 'final export: duplicate media attachment IDs')
report = {
    'productCount': len(results), 'baselineOriginalIds': len(baseline_ids),
    'originalIdsRetained': len(baseline_ids & current_ids),
    'approvedRemovalsAbsent': len(approved_removal_ids - all_exported_ids),
    'approvedRemovalIds': sorted(approved_removal_ids),
    'newVariants': len(current_ids - baseline_ids),
    'beforeMediaOriginalIds': len(set(before_variant_ids)),
    'baselineMediaIds': len(original_media_ids_all),
    'originalMediaIdsRetained': len(original_media_ids_all & current_media_ids_all),
    'mediaAttachments': media_attachment_count,
    'matchedPublicationProducts': publication_matches,
    'matchedOptionProducts': option_value_matches,
    'matchedVariantImages': assigned, 'actualVariants': len(current_ids),
    'expectedVariants': plan['finalVariants'], 'errors': errors, 'products': results,
}
(ROOT/'verification/shopify-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='products'},indent=2))
raise SystemExit(1 if errors else 0)
