"""Prepare one new product only. Does not contact Shopify or Printful."""
from pathlib import Path
import csv
import hashlib
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent.parent.parent
EXPORT = ROOT / 'store/printful-setup/private/shopify-31-before-extracted.csv'
CATALOGUE = ROOT / 'store/printful-setup/private/catalogue-all-products.json'

HANDLE = 'for-a-reason-hat'
TITLE = 'For a Reason. Hat'
COLOURS = ['Charcoal', 'Ivory', 'Evergreen']

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    rows = list(csv.DictReader(EXPORT.open(encoding='utf-8-sig', newline='')))
    assert HANDLE not in {r['Handle'] for r in rows}, 'New handle already present in source export'
    template = [r for r in rows if r['Handle'] == 'ours-to-spend-trucker-hat']
    assert len(template) == 4
    assert template[0]['Option1 Name'] == 'Size' and template[0]['Option2 Name'] == 'Colour'
    assert {r['Option1 Value'] for r in template} == {'One size'}
    assert {r['Variant Price'] for r in template} == {'34.99'}
    catalogue = json.loads(CATALOGUE.read_text(encoding='utf-8'))['result']
    selected = {p['model']:p for p in catalogue if p.get('model') in ['6606','CCST0']}
    assert set(selected) == {'6606','CCST0'}
    assert '100% cotton pigment-dyed twill' in selected['CCST0']['description']
    intro = '<p>For whatever makes it worth it.</p><p>FOR A REASON. Made for the hours that are yours.</p><p>Made to order and shipped to you.</p>'
    shared_details = (
        '<li>Charcoal and Evergreen: Yupoong 6606 structured six-panel trucker, with a firm front, mesh back and curved visor</li>'
        '<li>Ivory: Comfort Colors CCST0 unstructured six-panel trucker, with a softer crown, soft mesh back and curved bill</li>'
        '<li>Ivory front: 100% cotton pigment-dyed twill with a heavy brushed finish</li>'
        '<li>One size, with an adjustable plastic snap closure</li>')
    initial = intro + '<ul><li>Front: FOR A REASON. lettering</li>' + shared_details + '</ul><p>Product images are mockups. The crown shape and finish vary by colour as described above.</p>'
    after_puff = intro + '<ul><li>Front: FOR A REASON. in raised 3D puff embroidery</li>' + shared_details + '</ul><p>Product images are mockups. The crown shape and finish vary by colour as described above.</p>'
    media = {c: {'productImageUrl': f'REPLACE_WITH_APPROVED_PUBLIC_{c.upper()}_MOCKUP_URL',
                 'variantImageUrl': f'REPLACE_WITH_APPROVED_PUBLIC_{c.upper()}_MOCKUP_URL',
                 'altText': f'Mockup of For a Reason. Hat in {c}.',
                 'imagePosition': i+1} for i,c in enumerate(COLOURS)}
    package = {
        'version':1, 'status':'Draft package; image placeholders must be replaced before import.',
        'title':TITLE, 'handle':HANDLE, 'vendor':'OFF SHFT', 'type':'Hat',
        'tags':['off-shft','for-a-reason','hat','text-hat'], 'currency':'CAD', 'price':'34.99',
        'publication':{'status':'active','publishedOnOnlineStore':True,'otherChannels':'Not selected by this CSV; verify importer does not publish to all channels.'},
        'options':[{'name':'Size','values':['One size']},{'name':'Colour','values':COLOURS}],
        'descriptionHtmlInitial':initial,
        'descriptionHtmlAfterVerifiedPuff':after_puff,
        'puffCopyGate':'Only apply the after-puff description and SEO description after all three saved supplier mappings are verified as 3D puff with the approved artwork.',
        'seoTitle':f'{TITLE} | OFF SHFT',
        'seoDescriptionInitial':'FOR A REASON. on an adjustable trucker hat in Charcoal, Ivory or Evergreen. A softer unstructured crown in Ivory. Made to order. OFF SHFT.',
        'seoDescriptionAfterVerifiedPuff':'FOR A REASON. in raised 3D puff embroidery on an adjustable trucker hat. Charcoal, Ivory or Evergreen. Made to order. OFF SHFT.',
        'variants':[{'size':'One size','colour':c,'price':'34.99','catalogueProductId':1678 if c=='Ivory' else 252,
                     'blank':'Comfort Colors CCST0' if c=='Ivory' else 'Yupoong 6606',
                     'inventoryTracker':'shopify','initialInventoryQuantity':0,'inventoryPolicy':'deny',
                     'initialFulfillmentService':'manual','requiresShipping':True,'taxable':True,
                     'supplierVariantId':None,'inventoryLocationId':None,'media':media[c]} for c in COLOURS],
        'fulfillmentCaveat':'manual is the documented new-import placeholder, not a Printful location assignment. Verify supplier variant, Printful location and inventory routing after sync. Product CSV quantity is single-location only.',
        'sources':[
            {'path':str(EXPORT.relative_to(ROOT)).replace('\\','/'),'sha256':sha(EXPORT),'role':'Existing cap option order, price and description structure; private source remains ignored.'},
            {'path':str(CATALOGUE.relative_to(ROOT)).replace('\\','/'),'sha256':sha(CATALOGUE),'role':'Official read-only catalogue snapshot: exact CCST0 and6606 construction/fabric.'},
            {'url':'https://help.shopify.com/en/manual/products/import-export/using-csv','checked':'2026-10-29','role':'Current CSV headers, defaults, image columns and quantity/location limitations.'}],
        'unresolvedBeforeImport':['Replace all three image placeholders with approved working public image URLs.',
                                  'Verify this handle remains absent in the live store and keep overwrite disabled.',
                                  'Review import preview: exactly one new product, three variants and no existing updates.'],
        'unresolvedBeforeOrders':['Verify all three supplier variant IDs, colour/size, files, physical placement and 3D puff technique.',
                                 'Verify actual Printful inventory location/routing and availability; never replace stock with invented quantities.',
                                 'Apply the gated puff description/SEO only after mapping verification.',
                                 'Complete root operator billing/shipping/checkout readiness review.'],
    }
    HERE.mkdir(parents=True, exist_ok=True)
    (HERE / 'copy.json').write_text(json.dumps(package,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    fields = ['URL handle','Title','Description','Vendor','Type','Tags','Published on online store','Status',
              'Option1 name','Option1 value','Option2 name','Option2 value','Price','Inventory tracker','Inventory quantity',
              'Continue selling when out of stock','Requires shipping','Fulfillment service','Charge tax',
              'Product image URL','Image position','Image alt text','Variant image URL','SEO title','SEO description']
    output = []
    for i,c in enumerate(COLOURS):
        output.append({'URL handle':HANDLE,'Title':TITLE if i==0 else '', 'Description':initial if i==0 else '',
                       'Vendor':'OFF SHFT' if i==0 else '', 'Type':'Hat' if i==0 else '',
                       'Tags':', '.join(package['tags']) if i==0 else '',
                       'Published on online store':'true','Status':'active',
                       'Option1 name':'Size' if i==0 else '', 'Option1 value':'One size',
                       'Option2 name':'Colour' if i==0 else '', 'Option2 value':c,
                       'Price':'34.99','Inventory tracker':'shopify','Inventory quantity':'0',
                       'Continue selling when out of stock':'deny','Requires shipping':'true','Fulfillment service':'manual',
                       'Charge tax':'true','Product image URL':media[c]['productImageUrl'],'Image position':str(i+1),
                       'Image alt text':media[c]['altText'],'Variant image URL':media[c]['variantImageUrl'],
                       'SEO title':package['seoTitle'] if i==0 else '',
                       'SEO description':package['seoDescriptionInitial'] if i==0 else ''})
    with (HERE / 'DRAFT-not-import-ready.csv').open('w',encoding='utf-8',newline='') as f:
        writer = csv.DictWriter(f,fieldnames=fields,lineterminator='\n')
        writer.writeheader()
        writer.writerows(output)
    report = {'passed':True,'newProducts':1,'variants':3,'colours':COLOURS,'optionOrder':['Size','Colour'],
              'priceCad':'34.99','trackedQuantity':0,'overselling':'deny','taxable':True,
              'csvStatus':'NOT IMPORT READY: media URLs pending','puffClaimInInitialCsv':False,
              'existingSourceExportModified':sha(EXPORT)!=package['sources'][0]['sha256']}
    assert report['existingSourceExportModified'] is False
    (HERE / 'validation.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))

if __name__ == '__main__':
    main()
