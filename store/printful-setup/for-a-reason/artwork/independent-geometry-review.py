"""Independent read-only polygon review. Outputs are keyed by input hash."""
import hashlib, importlib.util, itertools, json, re, xml.etree.ElementTree as ET
from pathlib import Path
import numpy as np
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
helper=ROOT/'store/printful-setup/puff-cap-candidate/independent-geometry-review.py'
spec=importlib.util.spec_from_file_location('geom',helper)
geom=importlib.util.module_from_spec(spec);spec.loader.exec_module(geom)
raw=(HERE/'measurements.json').read_bytes();m=json.loads(raw)
digest=hashlib.sha256(raw).hexdigest()
out={'status':'Independent geometric review; not supplier acceptance','measurementsSha256':digest,'artworkMm':[m['widthMm'],m['heightMm']], 'fieldFits':m['widthMm']<=149.86 and m['heightMm']<=50.8,'glyphs':[], 'svgChecks':[], 'glyphGaps':[]}
for palette in ['bone-sun','ink-rust']:
 p=HERE/f'for-a-reason-{palette}.svg';r=p.read_bytes();tree=ET.fromstring(r)
 nodes=[x for x in tree.iter() if x.tag.endswith('path')]
 assert len(nodes)==len(m['glyphs'])
 for node,g in zip(nodes,m['glyphs']):
  assert node.attrib['id']==g['id'] and node.attrib['data-character']==g['char']
  rings=[]
  for part in re.findall(r'M([^M]+)',node.attrib['d']):
   nums=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?',part)]
   rings.append(np.array(list(zip(nums[::2],nums[1::2]))))
  assert len(rings)==len(g['finalContoursMm'])
  assert all(np.max(np.abs(a-np.asarray(b)))<.000051 for a,b in zip(rings,g['finalContoursMm']))
 out['svgChecks'].append({'file':p.name,'sha256':hashlib.sha256(r).hexdigest(),'matchesMeasurements':True})
for g in m['glyphs']:
 holes=[r for r in g['finalContoursMm'] if geom.area(r)<0]
 row={'id':g['id'],'char':g['char'],'coreOuterComponents':sum(geom.area(r)>0 for r in g['coreContoursMm']), 'coreCounters':sum(geom.area(r)<0 for r in g['coreContoursMm']), 'finalOuterComponents':sum(geom.area(r)>0 for r in g['finalContoursMm']), 'finalCounters':len(holes), 'expectedCounters':g['expectedCounters'], 'maxInscribedDisc':geom.largest_disc(g['finalContoursMm']), 'counterMinimumCalipersMm':[round(geom.minimum_caliper(r),4) for r in holes], 'counterInscribedDiscs':[geom.largest_disc([r]) for r in holes]}
 out['glyphs'].append(row);print(g['id'],g['char'],row['maxInscribedDisc'],row['counterMinimumCalipersMm'],flush=True)
for a,b in itertools.combinations(m['glyphs'],2):
 aa=np.concatenate(a['finalContoursMm']);bb=np.concatenate(b['finalContoursMm'])
 separation=np.maximum(0,np.maximum(aa.min(axis=0)-bb.max(axis=0),bb.min(axis=0)-aa.max(axis=0)))
 if np.linalg.norm(separation)>=6:continue
 dist=geom.polygon_distance(a['finalContoursMm'],b['finalContoursMm'])
 if dist<6:out['glyphGaps'].append({'from':a['id'],'to':b['id'],'differentRows':a['row']!=b['row'],'mm':round(dist,4)})
out['minimumGlyphGapMm']=min(g['mm'] for g in out['glyphGaps'])
out['minimumDifferentRowGapMm']=min(g['mm'] for g in out['glyphGaps'] if g['differentRows'])
out['maximumInscribedDiscUpperBoundMm']=max(g['maxInscribedDisc']['upperBoundDiameterMm'] for g in out['glyphs'])
out['allTopologyExpected']=all(g['coreOuterComponents']==1 and g['finalOuterComponents']==1 and g['coreCounters']==g['expectedCounters'] and g['finalCounters']==g['expectedCounters'] for g in out['glyphs'])
out['allClosedCounterCalipersAbove1_27mm']=all(v>=1.27 for g in out['glyphs'] for v in g['counterMinimumCalipersMm'])
out['allClosedCountersAdmit1_27mmDisc']=all(v['foundDiameterMm']>=1.27 for g in out['glyphs'] for v in g['counterInscribedDiscs'])
out['maximumDiscBelow12_5mm']=out['maximumInscribedDiscUpperBoundMm']<=12.5
out['sourceFontUnchanged']=hashlib.sha256((ROOT/m['fontSource']).read_bytes()).hexdigest()==m['fontSha256']
out['referenceUnchanged']=hashlib.sha256(Path(m['referenceSource']).read_bytes()).hexdigest()==m['referenceSha256']
out['limitations']=['Rolling-disc construction certifies a connected structural clearance route; arbitrary chords near rounded tips are smaller.', 'Counter calipers and inscribed discs describe usable negative spaces, not infinitesimal tapered ends.', 'Supplier digitization and actual stitching are separate from polygon verification.']
(HERE/f'independent-geometry-review-{digest[:12]}.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in out.items() if k not in ['glyphs','glyphGaps']},indent=2),flush=True)
