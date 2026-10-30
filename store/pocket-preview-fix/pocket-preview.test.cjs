const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveStyle } = require('./pocket-preview.js');
const vm = require('node:vm');
const fs = require('node:fs');

// Hand-checked variant matrix: availability is deliberately false on one
// existing Pocket variant so missing combinations cannot be confused with stock.
const variants = [
  { id: 'h-s-ivory', options: ['Heavyweight', 'S', 'Ivory'], available: true },
  { id: 'h-s-blue', options: ['Heavyweight', 'S', 'Blue Spruce'], available: true },
  { id: 'h-3xl-ivory', options: ['Heavyweight', '3XL', 'Ivory'], available: true },
  { id: 'h-3xl-blue', options: ['Heavyweight', '3XL', 'Blue Spruce'], available: true },
  { id: 'p-s-white', options: ['Pocket', 'S', 'White'], available: false },
  { id: 'p-2xl-white', options: ['Pocket', '2XL', 'White'], available: true },
];
const indices = { style: 0, size: 1, colour: 2 };
const resolve = (selected, rememberedColour) => resolveStyle(variants, indices, selected, rememberedColour);

test('Pocket/S/Ivory resolves to the actual White Pocket variant without changing S', () => {
  assert.deepEqual(resolve(['Pocket', 'S', 'Ivory']), {
    colour: 'White', size: 'S', variantId: 'p-s-white', supportedSize: true,
  });
});
test('an existing sold-out variant is kept distinct from a nonexistent combination', () => {
  const result = resolve(['Pocket', 'S', 'Ivory']);
  assert.equal(result.variantId, 'p-s-white');
  assert.equal(result.supportedSize, true);
});
test('switching back restores the remembered Blue Spruce Heavyweight colour', () => {
  assert.equal(resolve(['Heavyweight', 'S', 'White'], 'Blue Spruce').variantId, 'h-s-blue');
});
test('a currently compatible colour wins over a remembered colour', () => {
  assert.equal(resolve(['Heavyweight', 'S', 'Ivory'], 'Blue Spruce').variantId, 'h-s-ivory');
});
test('Pocket/3XL keeps 3XL, chooses only the style colour, and yields no purchasable variant', () => {
  assert.deepEqual(resolve(['Pocket', '3XL', 'Blue Spruce']), {
    colour: 'White', size: '3XL', variantId: '', supportedSize: false,
  });
});
test('switching back from unsupported Pocket/3XL restores compatible 3XL Heavyweight', () => {
  assert.deepEqual(resolve(['Heavyweight', '3XL', 'White'], 'Blue Spruce'), {
    colour: 'Blue Spruce', size: '3XL', variantId: 'h-3xl-blue', supportedSize: true,
  });
});
test('unknown style is not guessed or replaced', () => {
  assert.equal(resolve(['Unknown', 'S', 'Ivory']), null);
});
test('resolver never changes requested size across every actual tee variant and target style', () => {
  const snapshot = require('../next-round-launch/shopify-after-export.json');
  for (const product of snapshot.products.filter(p => ['off-shft-logo-t-shirt', 'the-clock-t-shirt'].includes(p.handle))) {
    const rows = product.variants.map(v => ({ id: v.id, options: v.selectedOptions.map(o => o.value) }));
    for (const variant of rows) {
      for (const style of ['Heavyweight', 'Pocket']) {
        const selected = [style, variant.options[1], variant.options[2]];
        const result = resolveStyle(rows, indices, selected);
        assert.equal(result.size, variant.options[1]);
        const actual = rows.find(v => v.id === result.variantId);
        if (style === 'Pocket' && variant.options[1] === '3XL') {
          assert.equal(actual, undefined);
          assert.equal(result.supportedSize, false);
        } else {
          assert.ok(actual, `${product.handle}: ${selected.join('/')}`);
          assert.equal(actual.options[0], style);
          assert.equal(actual.options[1], variant.options[1]);
          assert.equal(actual.options[2], result.colour);
        }
      }
    }
  }
});

// A small native-picker boundary fixture is used because this repository has
// no DOM test runtime. It preserves the checked/data-current-checked distinction
// that exists during browser capture, before Horizon handles the change.
function captureFixture(productId = '15476778631490') {
  class Input {
    constructor(name, value, checked) {
      this.type = 'radio'; this.value = value; this.checked = checked;
      this.dataset = { optionName: name, currentChecked: String(checked), variantId: '' };
    }
    closest() { return picker; }
  }
  const inputs = [new Input('Style', 'Heavyweight', true), new Input('Style', 'Pocket', false),
    new Input('Size', 'S', true), new Input('Colour', 'Ivory', true), new Input('Colour', 'White', false)];
  const picker = {
    dataset: { productId }, closest: () => null,
    parentElement: { querySelector: () => null },
    querySelectorAll: selector => selector.includes(':checked') ? inputs.filter(i => i.checked)
      : inputs.filter(i => i.dataset.optionName === 'Colour'),
    querySelector: () => inputs.find(i => i.dataset.optionName === 'Style' && i.dataset.currentChecked === 'true'),
    updateSelectedOption: input => {
      for (const other of inputs.filter(i => i.dataset.optionName === input.dataset.optionName)) {
        other.checked = other === input;
        other.dataset.currentChecked = String(other === input);
      }
    },
  };
  let listener; let listenerOptions;
  const document = {
    getElementById: () => ({ textContent: JSON.stringify({ productId: '15476778631490', options: ['Style', 'Size', 'Colour'], variants }) }),
    addEventListener: (name, callback, options) => { assert.equal(name, 'change'); listener = callback; listenerOptions = options; },
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('./pocket-preview.js'), 'utf8'), {
    document, window: {}, HTMLInputElement: Input, AbortController,
  });
  inputs[0].checked = false; inputs[1].checked = true;
  return { inputs, listener, listenerOptions };
}

test('capture integration corrects Colour and URL variant metadata before native processing', () => {
  const { inputs, listener, listenerOptions } = captureFixture();
  assert.equal(listenerOptions.capture, true);
  listener({ target: inputs[1] });
  assert.equal(inputs[4].checked, true);
  assert.equal(inputs[3].checked, false);
  assert.equal(inputs[2].value, 'S');
  assert.equal(inputs[2].checked, true);
  assert.equal(inputs[1].dataset.variantId, 'p-s-white');
});

test('capture integration leaves an unrelated product unchanged', () => {
  const { inputs, listener } = captureFixture('999');
  listener({ target: inputs[1] });
  assert.equal(inputs[3].checked, true);
  assert.equal(inputs[4].checked, false);
  assert.equal(inputs[1].dataset.variantId, '');
});

test('capture integration does not override a manual Colour choice', () => {
  const { inputs, listener } = captureFixture();
  inputs[1].checked = false; inputs[0].checked = true;
  inputs[3].checked = false; inputs[4].checked = true;
  listener({ target: inputs[4] });
  assert.equal(inputs[4].checked, true);
  assert.equal(inputs[3].checked, false);
  assert.equal(inputs[4].dataset.variantId, '');
});
