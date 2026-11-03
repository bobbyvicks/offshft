import unittest,copy,json
from pathlib import Path
import production as p
class ProductionGuards(unittest.TestCase):
 def test_flat_moves_palette_without_mutating_baseline(self):
  before=[{'id':'embroidery_type','value':'3d'},{'id':'thread_colors_front_large','value':[]},{'id':'thread_colors_3d_front_large','value':['#FFFFFF','#a67843']},{'id':'license_type','value':[]}]
  saved=copy.deepcopy(before);after=p.flat_options(before);d={o['id']:o['value'] for o in after}
  self.assertEqual(before,saved);self.assertEqual(d['embroidery_type'],'flat');self.assertEqual(d['thread_colors_front_large'],['#FFFFFF','#a67843']);self.assertEqual(d['thread_colors_3d_front_large'],[])
 def test_conflicting_existing_flat_palette_is_rejected(self):
  with self.assertRaises(AssertionError):p.flat_options([{'id':'embroidery_type','value':'3d'},{'id':'thread_colors_front_large','value':['#000000']},{'id':'thread_colors_3d_front_large','value':['#FFFFFF']}])
 def test_guard_rejects_price_and_thread_drift(self):
  v={'id':1,'retail_price':'34.99','options':[{'id':'thread_colors_front','value':['#cc3333']}],'files':[{'id':2,'type':'default'}]}
  j={'before':copy.deepcopy(v),'payload':{'files':[{'id':2,'type':'default'}],'options':copy.deepcopy(v['options'])}}
  normalized=copy.deepcopy(v);normalized['options'][0]['value']=['#CC3333'];p.check(normalized,j)
  normalized['retail_price']='35.99'
  with self.assertRaises(AssertionError):p.check(normalized,j)
  normalized['retail_price']='34.99';normalized['options'][0]['value']=[]
  with self.assertRaises(AssertionError):p.check(normalized,j)
 def test_scope_excludes_five_oclock_and_seamless_logo_shift(self):
  rows=p.load(p.H/'inventory.json');self.assertFalse(any('five-oclock' in r['handles'] for r in rows))
  records=p.records
  self.assertFalse(any(any('five-oclock' in h for h in r['handles']) for r in records))
  for r in records:
   if 'bucket-hat' in ' '.join(r['handles']) and 'logo' in ' '.join(r['handles']):self.assertEqual(r['seamShiftMm'],0)
if __name__=='__main__':unittest.main()
