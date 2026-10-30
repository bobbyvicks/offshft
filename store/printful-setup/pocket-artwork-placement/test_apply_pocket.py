import copy
import importlib.util
import pathlib
import unittest

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('apply_pocket', HERE / 'apply_pocket.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class PocketGuardTests(unittest.TestCase):
    def setUp(self):
        self.baseline = m.load_baselines()

    def test_exact_ten_targets_and_no_heavyweight(self):
        rows = m.make_plan(self.baseline)['variants']
        self.assertEqual(len(rows), 10)
        self.assertEqual(len({r['syncVariantId'] for r in rows}), 10)
        self.assertTrue(all(r['style'] == 'Pocket' and r['colour'] == 'White' for r in rows))
        self.assertEqual([r['catalogueVariantId'] for r in rows[:5]], list(range(15150, 15155)))
        self.assertNotIn('3XL', [r['size'] for r in rows])

    def test_wrong_external_identity_fails(self):
        bad = copy.deepcopy(self.baseline)
        bad['logo']['result']['sync_variants'][6]['external_id'] = '1234'
        with self.assertRaises(ValueError):
            m.make_plan(bad)

    def test_wrong_colour_or_product_fails(self):
        for key, value in [('name', 'OFF SHFT Logo T-Shirt / Pocket / S / Ivory'), ('sync_product_id', 999)]:
            bad = copy.deepcopy(self.baseline)
            bad['logo']['result']['sync_variants'][6][key] = value
            with self.assertRaises(ValueError):
                m.make_plan(bad)

    def test_extra_or_missing_variants_fail(self):
        bad = copy.deepcopy(self.baseline)
        bad['logo']['result']['sync_variants'].pop()
        with self.assertRaises(ValueError):
            m.make_plan(bad)

    def test_payload_is_pocket_only_without_price_or_position(self):
        row = m.make_plan(self.baseline)['variants'][0]
        payload = m.payload_for(row, 123)
        self.assertEqual(payload, {'variant_id': 15150, 'files': [{'id': 123, 'type': 'pocket'}], 'options': [], 'is_ignored': False})
        with self.assertRaises(ValueError):
            m.payload_for({**row, 'syncVariantId': 5605512011}, 123)

    def test_heavyweight_change_fails_readback(self):
        after = copy.deepcopy(self.baseline)
        after['logo']['result']['sync_variants'][0]['is_ignored'] = False
        with self.assertRaises(ValueError):
            m.verify_state(self.baseline, after, {})

    def test_target_price_change_fails_readback(self):
        after = copy.deepcopy(self.baseline)
        after['logo']['result']['sync_variants'][6]['retail_price'] = '1.00'
        with self.assertRaises(ValueError):
            m.verify_state(self.baseline, after, {})

    def test_correct_completed_target_and_unrelated_state_pass(self):
        after = copy.deepcopy(self.baseline)
        v = after['logo']['result']['sync_variants'][6]
        v.update(variant_id=15150, is_ignored=False, synced=True, options=[], size='S', color='White', files=[{'id': 123, 'type': 'pocket', 'status': 'ok'}])
        m.verify_state(self.baseline, after, {'5605512017': 123})
        v['files'][0]['type'] = 'back'
        with self.assertRaises(ValueError):
            m.verify_state(self.baseline, after, {'5605512017': 123})

    def test_committed_sha_only_and_upload_path_allowlist(self):
        with self.assertRaises(ValueError):
            m.artwork_url('main', 'logo-pocket-2in.png')
        with self.assertRaises(ValueError):
            m.artwork_url('a' * 40, '../other.png')
        self.assertIn('/' + 'a' * 40 + '/', m.artwork_url('a' * 40, 'logo-pocket-2in.png'))

    def test_exact_canvas_geometry_and_alpha(self):
        from PIL import Image
        for design, expected in [('logo', (1200, 346)), ('clock', (283, 600))]:
            canvas, info = m.render_canvas(design)
            self.assertEqual(canvas.size, (1800, 1200))
            self.assertEqual(canvas.mode, 'RGBA')
            self.assertEqual(tuple(info['artworkPixels']), expected)
            self.assertEqual(canvas.getpixel((0, 0))[3], 0)
            self.assertAlmostEqual(info['left'], (1800 - info['artworkPixelsExact'][0]) / 2)
            self.assertAlmostEqual(info['top'], (1200 - info['artworkPixelsExact'][1]) / 2)
            self.assertEqual(info['artworkInches'][0 if design=='logo' else 1], 2 if design=='logo' else 1)

    def test_unknown_completed_id_fails(self):
        with self.assertRaises(ValueError):
            m.verify_state(self.baseline, self.baseline, {'999':123})

    def test_source_artwork_inner_markup_is_exact(self):
        import re
        for item in m.read(HERE/'canvas-manifest.json')['files']:
            source=(m.ROOT/item['sourceSvg']).read_text()
            inner=re.search(r'<svg\b[^>]*>([\s\S]*)</svg>\s*$',source)[1]
            self.assertIn(inner,(HERE/item['svg']).read_text())
            self.assertEqual(m.sha(m.ROOT/item['sourceSvg']),item['sourceSvgSha256'])

    def test_changed_supplier_field_fails(self):
        catalogue=m.read(m.PRIVATE/'catalogue-before.json')
        fields=m.read(m.PRIVATE/'printfiles-before.json')
        next(x for x in fields['result']['printfiles'] if x['printfile_id']==191)['width']=451
        with self.assertRaises(ValueError):
            m.validate_catalogue(catalogue,fields)

    def default_option_fixture(self):
        snapshot=m.read(m.PRIVATE/'logo-canary-readback.json')
        return copy.deepcopy(next(v for v in snapshot['result']['sync_variants'] if v['id']==5605512017)['options'])

    def completed_with_options(self, options):
        after=copy.deepcopy(self.baseline)
        v=after['logo']['result']['sync_variants'][6]
        v.update(variant_id=15150,is_ignored=False,synced=True,options=options,size='S',color='White',files=[{'id':123,'type':'pocket','status':'ok'}])
        return after

    def test_exact_observed_empty_supplier_defaults_pass(self):
        options=self.default_option_fixture()
        m.verify_state(self.baseline,self.completed_with_options(options),{'5605512017':123})
        # Option order is not meaningful.
        m.verify_state(self.baseline,self.completed_with_options(list(reversed(options))),{'5605512017':123})

    def test_populated_or_changed_defaults_fail(self):
        for option_id,value in [('thread_colors',['#FFFFFF']),('license_type',['CLC']),('embroidery_type','3d'),('lifelike',True),('lifelike',0)]:
            options=self.default_option_fixture()
            next(o for o in options if o['id']==option_id)['value']=value
            with self.subTest(option_id=option_id,value=value),self.assertRaises(ValueError):
                m.verify_state(self.baseline,self.completed_with_options(options),{'5605512017':123})

    def test_unknown_duplicate_or_incomplete_defaults_fail(self):
        defaults=self.default_option_fixture()
        cases=[defaults+[{'id':'unexpected','value':[]}],defaults+[defaults[0]],defaults[:-1],None]
        for options in cases:
            with self.subTest(options=options),self.assertRaises(ValueError):
                m.verify_state(self.baseline,self.completed_with_options(options),{'5605512017':123})

    def test_target_automatic_sku_is_recorded_when_previously_empty(self):
        for original in (None,''):
            before=copy.deepcopy(self.baseline)
            before['logo']['result']['sync_variants'][6]['sku']=original
            after=self.completed_with_options([])
            after['logo']['result']['sync_variants'][6]['sku']='6974850'
            evidence=m.verify_state(before,after,{'5605512017':123})
            self.assertEqual(evidence['generatedSupplierSkus'],[{'syncVariantId':5605512017,'shopifyVariantId':'67946096296258','sku':'6974850'}])

    def test_populated_target_sku_cannot_change(self):
        before=copy.deepcopy(self.baseline)
        before['logo']['result']['sync_variants'][6]['sku']='EXISTING-SKU'
        after=self.completed_with_options([])
        after['logo']['result']['sync_variants'][6]['sku']='6974850'
        with self.assertRaises(ValueError):
            m.verify_state(before,after,{'5605512017':123})
        after['logo']['result']['sync_variants'][6]['sku']='EXISTING-SKU'
        self.assertEqual(m.verify_state(before,after,{'5605512017':123})['generatedSupplierSkus'],[])

    def test_untouched_sku_and_invalid_generated_sku_fail(self):
        after=copy.deepcopy(self.baseline)
        after['logo']['result']['sync_variants'][0]['sku']='6974850'
        with self.assertRaises(ValueError):
            m.verify_state(self.baseline,after,{})
        for invalid in (' ',123,[],False):
            after=self.completed_with_options([])
            after['logo']['result']['sync_variants'][6]['sku']=invalid
            with self.subTest(sku=invalid),self.assertRaises(ValueError):
                m.verify_state(self.baseline,after,{'5605512017':123})


if __name__ == '__main__':
    unittest.main()
