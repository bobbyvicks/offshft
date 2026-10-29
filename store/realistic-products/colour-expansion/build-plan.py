"""Make the supplier-confirmed, non-Cartesian colour/variant manifest."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
products = json.loads((ROOT.parent / 'catalogue.json').read_text(encoding='utf-8-sig'))
baseline = json.loads((ROOT / 'verification/variant-baseline.json').read_text(encoding='utf-8-sig'))['result']['results']['products']['edges']
baseline = {p['node']['id'].split('/')[-1]: p['node'] for p in baseline}
supplier = json.loads((ROOT / 'verification/supplier-size-colour-availability.json').read_text(encoding='utf-8-sig'))
SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
# Exact IDs approved by the owner. Do not infer other removals from size alone.
APPROVED_3XL_REMOVALS = {
    'jacket-clock': 'gid://shopify/ProductVariant/67946097312066',
    'jacket-logo': 'gid://shopify/ProductVariant/67946097115458',
    'jacket-punched-out': 'gid://shopify/ProductVariant/67946097508674',
    'sweatpants-clock': 'gid://shopify/ProductVariant/67946091086146',
    'sweatpants-logo': 'gid://shopify/ProductVariant/67946090889538',
    'sweatpants-punched-out': 'gid://shopify/ProductVariant/67946091348290',
}


def normalize(value):
    return re.sub(r'\s+', '', str(value or '')).casefold()

# style, blank, original colour, added colour, filename prefix
MATRIX = {
 'hat': [('Retro Trucker','Yupoong 6606','Black','Evergreen','hat-6606'),('5-Panel','Otto 31-069','Black',None,'hat-31-069'),('Dad Hat','Yupoong 6245CM','Black',None,'hat-6245cm'),('Rope Cap','Big Accessories BA671','Black/White',None,'hat-ba671')],
 'hoodie': [('Oversized','AS Colour 5161','Bone','Pine Green','hoodie-5161'),('Garment-Dyed','Comfort Colors 1567','White','Blue Spruce','hoodie-1567'),('Lightweight','Comfort Colors 1467','Ivory','Blue Jean','hoodie-1467')],
 'crewneck': [(None,'Comfort Colors 1466','Ivory','Blue Jean','crewneck-1466')],
 'sweatpants': [(None,'Comfort Colors 1469','Pepper','Espresso','sweatpants-1469')],
 'tee': [('Heavyweight','Comfort Colors 1717','Ivory','Blue Spruce','tee-1717'),('Pocket','Comfort Colors 6030','White',None,'tee-6030')],
 'jacket': [(None,'Champion CO200','Black','Light Blue','jacket-co200')],
}
out = []
approved_removals = []
for p in products:
    family, design = p['key'].split('-',1)
    b=baseline[p['productId']]
    removal_id = APPROVED_3XL_REMOVALS.get(p['key'])
    if removal_id:
        removed = [v['node'] for v in b['variants']['edges'] if v['node']['id'] == removal_id]
        assert len(removed) == 1, (p['key'], removal_id)
        removed_options = {o['name']: o['value'] for o in removed[0]['selectedOptions']}
        assert removed_options == {'Size': '3XL'}, (p['key'], removed_options)
        approved_removals.append({
            'productKey': p['key'], 'productId': p['productId'], 'variantId': removal_id,
            'options': {**removed_options, 'Colour': MATRIX[family][0][2]},
            'reason': 'Existing 3XL is outside the supplier S–2XL range; owner approved removal.',
        })
    pairs=[]
    for style,blank,base,extra,prefix in MATRIX[family]:
        supplier_rows = {
            (normalize(row['color']), normalize(row['size'])): row
            for row in supplier[blank.split()[-1]]['variantAvailability']
        }
        for colour in filter(None,[base,extra]):
            original = colour==base
            reuse = original and (family in ['crewneck','jacket'] or (family=='hat' and style=='Retro Trucker') or (family=='hoodie' and style=='Oversized') or (family=='tee' and style=='Heavyweight'))
            slug=colour.lower().replace('/','-').replace(' ','-')
            filename = f'../images/{p["key"]}.png' if reuse else f'images/{prefix}-{slug}-{design}.png'
            sizes = [None] if family == 'hat' else (
                SIZES[:5] if style == 'Pocket' or family in ['sweatpants', 'jacket'] else SIZES
            )
            variants=[]
            for size in sizes:
                options={k:v for k,v in [('Style',style),('Size',size)] if v is not None}
                match=[v['node'] for v in b['variants']['edges'] if {o['name']:o['value'] for o in v['node']['selectedOptions']}==options]
                assert len(match)==1, (p['key'], options)
                old=match[0]
                assert old['id'] != removal_id, (p['key'], old['id'])
                row = supplier_rows.get((normalize(colour), normalize(size or 'One size')))
                assert row is not None, (p['key'], colour, size, 'unsupported supplier combination')
                assert (row['hasStock'] and row['isFulfillable']
                        and not row['isDiscontinued'] and not row['isDisabledInPush']), (p['key'], colour, size)
                assert row.get('EMBROIDERY') != 'notFulfilled', (p['key'], colour, size)
                variants.append({'options':{**options,'Colour':colour},'existingVariantId':old['id'] if original else None,'copyConfigurationFrom':old['id'],'price':old['price'],'image':filename,'supplierSupported':True})
            pairs.append({'style':style,'blank':blank,'colour':colour,'existingColour':original,'image':filename,'variants':variants})
    retained_ids = {v['existingVariantId'] for pair in pairs for v in pair['variants'] if v['existingVariantId']}
    original_ids = {v['node']['id'] for v in b['variants']['edges']}
    assert retained_ids == original_ids - ({removal_id} if removal_id else set()), p['key']
    out.append({
        'key': p['key'], 'title': p['title'], 'productId': p['productId'], 'adminUrl': p['adminUrl'],
        'originalVariantCount': len(original_ids),
        'retainedOriginalVariantCount': len(retained_ids),
        'approvedVariantRemovalIds': [removal_id] if removal_id else [],
        'newVariantCount': sum(not v['existingVariantId'] for pair in pairs for v in pair['variants']),
        'finalVariantCount': sum(len(pair['variants']) for pair in pairs),
        'pairs': pairs,
    })
manifest = {
    'date': '2026-10-29',
    'scope': 'Colour options, valid variants, matching AI mockup images, factual garment construction corrections, and six approved 3XL removals',
    'preserve': [
        'all original variant IDs except the six explicitly approved removals',
        'existing prices', 'SKUs', 'inventory and fulfilment configuration of retained variants',
        'product status', 'publication channels', 'existing media',
    ],
    'removalDecision': 'Owner explicitly instructed: remove the 3XL options from sweatpants and jackets.',
    'approvedVariantRemovals': approved_removals,
    'approvedRemovalCount': len(approved_removals),
    'originalVariants': sum(p['originalVariantCount'] for p in out),
    'retainedOriginalVariants': sum(p['retainedOriginalVariantCount'] for p in out),
    'newVariants': sum(p['newVariantCount'] for p in out),
    'finalVariants': sum(p['finalVariantCount'] for p in out),
    'imageCombinations': sum(len(p['pairs']) for p in out),
    'products': out,
}
assert (
    manifest['originalVariants'], manifest['approvedRemovalCount'],
    manifest['retainedOriginalVariants'], manifest['newVariants'],
    manifest['finalVariants'], manifest['imageCombinations'],
) == (142, 6, 136, 117, 253, 57)
(ROOT/'colour-plan.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print({k: manifest[k] for k in [
    'originalVariants', 'approvedRemovalCount', 'retainedOriginalVariants',
    'newVariants', 'finalVariants', 'imageCombinations',
]})
