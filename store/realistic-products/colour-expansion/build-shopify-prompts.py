"""Prepare reviewable Shopify batches from the exact, verified colour matrix."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
data=json.loads((ROOT/'colour-plan.json').read_text())
out=ROOT/'verification'/'prepared-batches'
out.mkdir(exist_ok=True)
for family in ['hoodie','hat','crewneck','sweatpants','tee','jacket']:
    products=[p for p in data['products'] if p['key'].startswith(family+'-')]
    lines=['Prepare a reviewable batch for ONLY the following OFF SHFT products. Their existing variants have already been mapped to their correct base Colour. Retain every existing variant ID and all existing option selections and configuration. Add ONLY the listed new Style/Colour/Size combinations. Never create a Cartesian product. Preserve existing prices, SKUs, inventory tracking, fulfilment/location settings, product status and publication channels. New variants copy the configuration and price of their same Style/Size original, with blank SKU and inventory tracking off. Do not invent a Printful SKU or integration. All named PNGs are uploaded in the Shopify Files library. Attach the matching images to each product, retain ALL existing media, assign each image to every size in its exact style-colour pair, and put the listed primary image first. Show changes for review before applying.']
    for p in products:
        lines.append(f"\nPRODUCT {p['title']} / ID {p['productId']}; expected final count {p['finalVariantCount']}; preserve original {p['originalVariantCount']} IDs.")
        for pair in p['pairs']:
            sizes=[v['options'].get('Size','one-size') for v in pair['variants']]
            action='KEEP existing' if pair['existingColour'] else 'ADD new'
            lines.append(f"{action}: Style={pair['style'] or '(no Style option)'}; Colour={pair['colour']}; Sizes={','.join(sizes)}; Price CAD{pair['variants'][0]['price']}; image={Path(pair['image']).name}.")
        lines.append('Primary image: '+Path(p['pairs'][0]['image']).name+'. All generated photo combinations should precede old schematic media, but retain old media.')
    if family=='hoodie':
        lines.append('\nAlso make only these factual description corrections on the three hoodies, preserving the surrounding copy: Oversized AS Colour5161 has a lined hood WITHOUT drawcords; Garment-Dyed Comfort Colors1567 has matching flat drawcords; Lightweight Comfort Colors1467 has natural cream flat drawcords (White garments use white drawcords). All three styles support the selected embroidery placements. Remove any restriction saying embroidery is only on Oversized and Garment-Dyed, without changing artwork placement or size. Do not rewrite other copy.')
    if family=='sweatpants':
        lines.append('\nAlso correct the1469 fabric weight wherever currently listed as6.4 oz/217gsm to the current supplier value6.5 oz/220gsm, preserving surrounding description copy. Do not change other specifications.')
    (out/f'{family}.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Prepared six reviewable product-family batches.')
