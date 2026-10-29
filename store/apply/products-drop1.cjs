// Builds the Shopify productSet batches for the 17 first-drop listings, as DRAFT products.
//
//   node store/apply/products-drop1.cjs   (from /home/user/offshft)
//
// Inputs: store/products/drop1.json (the checked listing copy), store/previews/out/shop/uploaded.json (staged image
// URLs from Shopify), and the line-up below. Writes store/apply/out/drop1-batch-<n>.json, each { query, variables },
// to send with the Admin API's graphql_mutation. Prices are placeholders until the owner sets them: hats from
// PRODUCTS.md (C$34.99), hoodie, crewneck and sweatpants from store/apparel-plan.md (C$89.99 / 79.99 / 79.99), tees
// and the jacket proposed here (C$44.99 / 99.99).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const COPY = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/products/drop1.json'), 'utf8'));
const UP = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/previews/out/shop/uploaded.json'), 'utf8'));
const OUT = path.join(__dirname, 'out');

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const PIECES = {
  hat: { price: '34.99', styles: [['Retro Trucker', 'trucker-6606', null], ['5-Panel', 'five-panel', null], ['Dad Hat', 'dad-hat', null], ['Rope Cap', 'rope-cap', null]] },
  hoodie: { price: '89.99', styles: [['Oversized', 'hoodie-5161', SIZES], ['Garment-Dyed', 'hoodie-1567', SIZES], ['Lightweight', 'hoodie-1567', SIZES]] },   // the 1467 shares the 1567's drawing
  crew: { price: '79.99', styles: [[null, 'crew-1466', SIZES]] },
  sweats: { price: '79.99', styles: [[null, 'pants-1469', SIZES]] },
  tee: { price: '44.99', styles: [['Heavyweight', 'tee-1717', SIZES], ['Pocket', 'tee-6030', ['S', 'M', 'L', 'XL', '2XL']]] },
  jacket: { price: '99.99', styles: [[null, 'jacket-co200', SIZES]] },
};
const DESIGN_ALT = { logo: 'the OFF SHFT logo', clock: 'the clock', 'punched-out': 'Punched Out.' };

function productInput(c) {
  const [kind, ...rest] = c.key.split('-');
  const design = rest.join('-');
  const piece = PIECES[kind];
  if (!piece) throw new Error(`unknown kind in ${c.key}`);
  const styled = piece.styles.length > 1;
  const files = [], seen = new Set();
  const fileFor = (pid, style) => {
    const url = UP[`${pid}--${design}.png`];
    if (!url) return null;
    if (!seen.has(url)) {
      seen.add(url);
      files.push({ originalSource: url, contentType: 'IMAGE', alt: `Drawing of ${c.title}${style ? `, ${style}` : ''}: ${DESIGN_ALT[design]} embroidered, at its real size` });
    }
    return { originalSource: url };
  };
  const options = [], variants = [];
  if (styled) options.push({ name: 'Style', values: piece.styles.map(([s]) => ({ name: s })) });
  const sizes = [...new Set(piece.styles.flatMap(([, , z]) => z || []))];
  if (sizes.length) options.push({ name: 'Size', values: SIZES.filter((z) => sizes.includes(z)).map((z) => ({ name: z })) });
  if (!options.length) options.push({ name: 'Title', values: [{ name: 'Default Title' }] });
  for (const [style, pid, zs] of piece.styles) {
    const file = fileFor(pid, style);
    for (const size of zs || [null]) {
      const optionValues = [];
      if (styled) optionValues.push({ optionName: 'Style', name: style });
      if (size) optionValues.push({ optionName: 'Size', name: size });
      if (!optionValues.length) optionValues.push({ optionName: 'Title', name: 'Default Title' });
      variants.push({ optionValues, price: piece.price, inventoryItem: { tracked: false }, ...(file ? { file } : {}) });
    }
  }
  return {
    title: c.title, handle: c.handle, descriptionHtml: c.descriptionHtml, productType: c.productType, vendor: 'OFF SHFT',
    tags: c.tags, status: 'DRAFT', seo: { title: c.seoTitle, description: c.seoDescription },
    productOptions: options, variants, files,
  };
}

fs.mkdirSync(OUT, { recursive: true });
const inputs = COPY.map(productInput);
const SIZE = 6;
for (let b = 0; b * SIZE < inputs.length; b++) {
  const chunk = inputs.slice(b * SIZE, b * SIZE + SIZE);
  const vars = {}, defs = [], fields = [];
  chunk.forEach((inp, i) => {
    vars[`p${i}`] = inp;
    defs.push(`$p${i}: ProductSetInput!`);
    fields.push(`p${i}: productSet(synchronous: true, input: $p${i}) { product { id handle title status variantsCount { count } media(first: 5) { nodes { id } } } userErrors { field message code } }`);
  });
  const query = `mutation Drop1Batch${b + 1}(${defs.join(', ')}) {\n  ${fields.join('\n  ')}\n}`;
  fs.writeFileSync(path.join(OUT, `drop1-batch-${b + 1}.json`), JSON.stringify({ query, variables: vars }, null, 1));
  console.log(`batch ${b + 1}: ${chunk.map((x) => x.handle).join(', ')} (${chunk.reduce((n, x) => n + x.variants.length, 0)} variants)`);
}
