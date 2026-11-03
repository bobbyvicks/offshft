"""Prepare an exact-photo hero; all other homepage sections remain unchanged."""
import json,re,copy,hashlib
from pathlib import Path
H=Path(__file__).parent.parent
raw=(H/'theme-before/index.json').read_text(encoding='utf-8-sig')
prefix=re.match(r'^\s*/\*[\s\S]*?\*/\s*',raw).group(0)
before=json.loads(raw[len(prefix):]);after=copy.deepcopy(before)
css=(H/'hero/hero.css').read_text()
css=css.replace('font-family:Archivo,sans-serif','font-family:var(--font-body--family),Archivo,sans-serif')
css+='\n.offshft-canonical-hero{width:100%;max-width:100%}div:has(>.offshft-canonical-hero){width:100%;max-width:none}\n'
items=[
 ('hoodie','hoodie-1467-ivory-logo.png','OFF SHFT lightweight hoodie in Ivory','(min-width:750px) 43vw, 75vw'),
 ('sweats','the-clock-sweatpants-pepper-uniform.png','The Clock sweatpants in Pepper','(min-width:750px) 33vw, 58vw'),
 ('hat','for-a-reason-evergreen.png','For a Reason trucker hat in Evergreen','(min-width:750px) 24vw, 43vw'),
]
photos=[]
for role,filename,alt,sizes in items:
 extra=", fetchpriority: 'high'" if role=='hoodie' else ''
 photos.append("{{ images['"+filename+"'] | image_url: width: 1000 | image_tag: class: 'offshft-canonical-hero__item offshft-canonical-hero__"+role+"', widths: '400,700,1000', sizes: '"+sizes+"', loading: 'eager', alt: '"+alt+"'"+extra+" }}")
liquid='<style>'+css+'</style>\n<section class="offshft-canonical-hero"><div class="offshft-canonical-hero__copy"><h1><span>For the</span> <span>hours you</span> <span>earned.</span></h1><p>Hats, hoodies and sweats for your time off.</p><a class="offshft-canonical-hero__button" href="/collections/all">Shop the collection</a></div><div class="offshft-canonical-hero__stage">'+''.join(photos)+'</div></section>'
(H/'hero/hero.liquid').write_text(liquid,encoding='utf-8')
settings=copy.deepcopy(before['sections']['section_idea']['settings'])
settings.update(section_width='full-width',gap=0,background_color='#ece5d3')
settings['padding-block-start']=0;settings['padding-block-end']=0
after['sections']['offshft_hero']={'type':'section','name':'OFF SHFT — For the hours you earned','blocks':{'canonical_hero':{'type':'custom-liquid','name':'OFF SHFT canonical product photos','settings':{'custom_liquid':liquid},'blocks':{}}},'block_order':['canonical_hero'],'settings':settings}
restored=copy.deepcopy(after);restored['sections']['offshft_hero']=before['sections']['offshft_hero'];assert restored==before
assert 'offshft-home-hero-' not in json.dumps(after['sections']['offshft_hero'])
(H/'theme-after/index.json').write_text(prefix+json.dumps(after,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(H/'hero/change-manifest.json').write_text(json.dumps({'scope':'offshft_hero section only','source':'Exact supplier mockups already independently pixel-verified on Shopify','images':[{'role':r,'filename':f,'alt':a} for r,f,a,s in items],'allOtherHomepageSectionsUnchanged':True,'websiteHeadlineFont':'Existing Archivo web font; no altered font glyphs','copyAndDestinationUnchanged':True},indent=2)+'\n')
print('Prepared hero-only template patch with three existing verified Shopify images.')
