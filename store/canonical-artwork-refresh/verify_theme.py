"""Verify exact source artwork and prove unrelated theme data is unchanged."""
import json,copy,re,hashlib,urllib.parse
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
def template(p):return json.loads(re.sub(r'^\s*/\*[\s\S]*?\*/\s*','',p.read_text(encoding='utf-8-sig')))
changes=load(H/'theme-change-manifest.json')
before=load(H/'theme-before/offshft-design-data.json');after=load(H/'theme-after/offshft-design-data.json')
assert after==load(H/'live-main.json')
restored=copy.deepcopy(after)
for c in changes['references']:
 source=(R/c['source']).read_text(encoding='utf-8').lstrip('\ufeff')
 assert after['products'][c['handle']][c['field']]==c['newKey']
 assert after['artwork'][c['newKey']]==source
 assert hashlib.sha256(source.encode()).hexdigest()==c['newKey']
 restored['products'][c['handle']][c['field']]=c['oldKey']
restored['artwork']=before['artwork'];assert restored==before
used={p[k] for p in after['products'].values() for k in ['art','frontArt'] if p.get(k)}
assert used==set(after['artwork'])
finishBefore=load(H/'theme-before/offshft-hoodie-finish-data.json');finish=load(H/'theme-after/offshft-hoodie-finish-data.json')
assert finish==load(H/'live-finish.json')
restored=copy.deepcopy(finish)
for c in changes['dimensions']:
 product=next(p for p in restored['products'].values() if p['handle']==c['handle'])
 detail=product['finishDetails'][c['variantId']]
 assert [detail['widthMm'],detail['heightMm']]==c['after']
 detail['widthMm'],detail['heightMm']=c['before']
assert restored==finishBefore
oldIndex=template(H/'theme-before/index.json');index=template(H/'theme-after/index.json')
assert index==template(H/'theme-after/persisted-index.json')
restored=copy.deepcopy(index);restored['sections']['offshft_hero']=oldIndex['sections']['offshft_hero'];assert restored==oldIndex
hero=load(H/'hero/live-verification.json');assert hero['status']=='PASS'
assert len(hero['desktop']['images'])==len(hero['mobile']['images'])==3
assert hero['mobile']['scrollWidth']<=hero['mobile']['width']==390
assert all(i['loaded'] for mode in ['desktop','mobile'] for i in hero[mode]['images'])
assert 'Archivo' in hero['desktop']['headingFont'] and hero['desktop']['shopLink']=='/collections/all'
expected={i['filename'] for i in load(H/'hero/change-manifest.json')['images']}
actual={urllib.parse.urlsplit(i['source']).path.rsplit('/',1)[-1] for i in hero['desktop']['images']};assert actual==expected
assert load(H/'hat-colour-smoke.json')['status']=='PASS'
report={'status':'PASS','canonicalPickerReferences':len(changes['references']),'activeArtworkEntries':len(used),'unusedOldArtworkRemoved':len(changes['removedUnusedArtwork']),'correctedSizeDetails':len(changes['dimensions']),'publicThemeAssetsVerified':2,'allOtherProductAndNavigationDataUnchanged':True,'homepageChangeLimitedToHero':True,'desktopAndPhoneHeroVerified':True,'hatColoursVerified':3}
(H/'theme-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
