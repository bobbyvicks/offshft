"""Offline guards against accidental order access or catalogue deletion."""
import unittest
import printful_client as client


class MutationGuards(unittest.TestCase):
    def validator(self):
        self.assertTrue(hasattr(client, 'validate_mutation'), 'Mutation validation is not implemented')
        return client.validate_mutation

    def test_orders_and_absolute_destinations_are_rejected(self):
        validate = self.validator()
        for method, path in [('POST', '/orders'), ('DELETE', '/sync/products/1'),
                             ('PUT', 'https://other.example/sync/variant/1')]:
            with self.assertRaises(ValueError):
                validate(method, path, {})

    def test_prices_and_identity_changes_are_rejected(self):
        validate = self.validator()
        for field in ['retail_price', 'external_id', 'name', 'sku']:
            with self.assertRaises(ValueError):
                validate('PUT', '/sync/variant/1', {field: 'changed'})

    def test_all_bulk_product_updates_are_rejected(self):
        validate = self.validator()
        for ids in [[], [1], [1, 1], [1, 3], [1, 2]]:
            with self.assertRaises(ValueError):
                validate('PUT', '/sync/products/10',
                         {'sync_variants': [{'id': i, 'variant_id': 99} for i in ids]},
                         existing_ids={1, 2})
        with self.assertRaises(ValueError):
            validate('PUT', '/sync/products/10',
                     {'sync_variants': [{'id': 1, 'variant_id': 99}]})

    def test_source_upload_is_restricted_to_public_offshft_art(self):
        validate = self.validator()
        with self.assertRaises(ValueError):
            validate('POST', '/files', {'url': 'https://other.example/art.png'})
        validate('POST', '/files', {'url': 'https://raw.githubusercontent.com/bobbyvicks/offshft/abc123/store/printful-setup/puff-cap-candidate/candidate-bone.png', 'filename': 'puff-bone.png', 'visible': True})


if __name__ == '__main__':
    unittest.main()
