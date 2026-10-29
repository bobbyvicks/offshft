"""Make the supplier-confirmed, non-Cartesian colour/variant manifest."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
products = json.loads((ROOT.parent / 'catalogue.json').read_text(encoding='utf-8-sig'))
baseline = json.loads((ROOT / 'verification/variant-baseline.json').read_text(encoding='utf-8-sig'))['result']['results']['products']['edges']
baseline = {p['node']['id'].split('/')[-1]: p['node'] for p in baseline}
SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
# style, blank, original colour, added colour, filename prefix
MATRIX = {
 'hat': [('Retro Trucker','Yupoong 6606','Black','Evergreen','hat-6606'),('5-Panel','Otto 31-069','Black',None,'hat-31-069'),('Dad Hat','Yupoong 6245CM','Black',None,'hat-6245cm'),('Rope Cap','Big Accessories BA671','Black/White',None,'hat-ba671')],
 'hoodie': [('Oversized','AS Colour 5161','Bone','Pine Green','hoodie-5161'),('Garment-Dyed','Comfort Colors 1567','White','Blue Spruce','hoodie-1567'),('Lightweight','Comfort Colors 1467','Ivory','Blue Jean','hoodie-1467')],
 'crewneck': [(None,'Comfort Colors 1466','Ivory','Blue Jean','crewneck-1466')],
 'sweatpants': [(None,'Comfort Colors 1469','Pepper','Espresso','sweatpants-1469')],
 'tee': [('Heavyweight','Comfort Colors 1717','Ivory','Blue Spruce','tee-1717'),('Pocket','Comfort Colors 6030','White',None,'tee-6030')],
 'jacket': [(None,'Champion CO200','Black','Light Blue','jacket-co200')],
}
out=[]
for p in products:
    family, design = p['key'].split('-',1)
    b=baseline[p['productId']]
    pairs=[]
    for style,blank,base,extra,prefix in MATRIX[family]:
        for colour in filter(None,[base,extra]):
            original = colour==base
            reuse = original and (family in ['crewneck','jacket'] or (family=='hat' and style=='Retro Trucker') or (family=='hoodie' and style=='Oversized') or (family=='tee' and style=='Heavyweight'))
            slug=colour.lower().replace('/','-').replace(' ','-')
            filename = f'../images/{p["key"]}.png' if reuse else f'images/{prefix}-{slug}-{design}.png'
            sizes=[None] if family=='hat' else (SIZES[:5] if style=='Pocket' or (family in ['sweatpants','jacket'] and not original) else SIZES)
            variants=[]
            for size in sizes:
                options={k:v for k,v in [('Style',style),('Size',size)] if v is not None}
                match=[v['node'] for v in b['variants']['edges'] if {o['name']:o['value'] for o in v['node']['selectedOptions']}==options]
                assert len(match)==1, (p['key'], options)
                old=match[0]
                supported=not (family in ['sweatpants','jacket'] and size=='3XL')
                variants.append({'options':{**options,'Colour':colour},'existingVariantId':old['id'] if original else None,'copyConfigurationFrom':old['id'],'price':old['price'],'image':filename,'supplierSupported':supported})
            pairs.append({'style':style,'blank':blank,'colour':colour,'existingColour':original,'image':filename,'variants':variants})
    out.append({'key':p['key'],'title':p['title'],'productId':p['productId'],'adminUrl':p['adminUrl'],'originalVariantCount':len(b['variants']['edges']),'finalVariantCount':sum(len(x['variants']) for x in pairs),'pairs':pairs})
manifest={'date':'2026-10-29','scope':'Colour options, valid new variants, matching AI mockup images and factual garment construction corrections','preserve':['existing variant IDs','existing prices','SKUs','inventory and fulfilment configuration except explicit user-approved corrections','product status','publication channels','existing media'],'existingUnsupportedSizes':{'count':6,'description':'Existing 3XL sweatpants and Champion jackets are outside the current Printful S–2XL range. Retain records; inventory treatment awaits user choice. New colours stop at2XL.','decision':'pending'},'originalVariants':sum(p['originalVariantCount'] for p in out),'finalVariants':sum(p['finalVariantCount'] for p in out),'imageCombinations':sum(len(p['pairs']) for p in out),'products':out}
assert (manifest['originalVariants'],manifest['finalVariants'],manifest['imageCombinations'])==(142,259,57)
(ROOT/'colour-plan.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print({k:manifest[k] for k in ['originalVariants','finalVariants','imageCombinations']})
