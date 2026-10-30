// Builds the Shopify productSet input for the six phrase listings added on 30 Oct 2026 (store/products/drop1c.json),
// as ACTIVE products like the rest (the store is still behind its password). No images: the owner makes the product
// photos with their own tool (store/picks.md). Prices match the other hats, hoodies and crewnecks.
//
//   node store/apply/products-drop1c.cjs   (from /home/user/offshft)
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const COPY = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/products/drop1c.json'), 'utf8'));
const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const LISTINGS = {
  'nowhere-to-be-hoodie': { price: '89.99', styles: ['Oversized', 'Garment-Dyed'], sizes: SIZES },
  'suns-still-up-hat': { price: '34.99', styles: ['5-Panel', 'Rope Cap'] },
  'no-alarm-set-crewneck': { price: '79.99', sizes: SIZES },
  'banked-time-hat': { price: '34.99', styles: ['Dad Hat', 'Retro Trucker'] },
  'not-picking-up-hoodie': { price: '89.99', styles: ['Oversized', 'Garment-Dyed'], sizes: SIZES },
  'parked-trucker-hat': { price: '34.99' },
};

function productInput(c) {
  const L = LISTINGS[c.key];
  if (!L) throw new Error(`no spec for ${c.key}`);
  const options = [];
  if (L.styles) options.push({ name: 'Style', values: L.styles.map((s) => ({ name: s })) });
  if (L.sizes) options.push({ name: 'Size', values: L.sizes.map((z) => ({ name: z })) });
  if (!options.length) options.push({ name: 'Title', values: [{ name: 'Default Title' }] });
  const variants = [];
  for (const style of L.styles || [null]) {
    for (const size of L.sizes || [null]) {
      const optionValues = [];
      if (style) optionValues.push({ optionName: 'Style', name: style });
      if (size) optionValues.push({ optionName: 'Size', name: size });
      if (!optionValues.length) optionValues.push({ optionName: 'Title', name: 'Default Title' });
      variants.push({ optionValues, price: L.price, inventoryItem: { tracked: false } });
    }
  }
  return {
    title: c.title, handle: c.handle, descriptionHtml: c.descriptionHtml, productType: c.productType, vendor: 'OFF SHFT',
    tags: c.tags, status: 'ACTIVE', seo: { title: c.seoTitle, description: c.seoDescription }, productOptions: options, variants,
  };
}

const inputs = COPY.map(productInput);
const vars = {}, defs = [], fields = [];
inputs.forEach((inp, i) => {
  vars[`p${i}`] = inp;
  defs.push(`$p${i}: ProductSetInput!`);
  fields.push(`p${i}: productSet(synchronous: true, input: $p${i}) { product { id handle status variantsCount { count } } userErrors { field message code } }`);
});
const query = `mutation Drop1c(${defs.join(', ')}) {\n  ${fields.join('\n  ')}\n}`;
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out/drop1c-batch.json'), JSON.stringify({ query, variables: vars }, null, 1));
console.log(inputs.map((p) => `${p.handle}: ${p.variants.length} variants`).join('\n'));
