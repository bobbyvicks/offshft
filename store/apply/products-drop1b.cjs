// Builds the Shopify productSet input for the 10 listings added on 29 Oct 2026 (beanies, bucket hats, quarter-zips,
// golf shirt), as ACTIVE products like the first 17 (the store is still behind its password).
//
//   node store/apply/products-drop1b.cjs   (from /home/user/offshft)
//
// Inputs: store/products/drop1b.json (the checked listing copy) and store/apply/out/drop1b-uploaded.json (staged image
// URLs). Prices are placeholders from the listing spec (scratchpad drop1b/spec.json): the owner can change them.
// Quarter-zips list the Cotton Heritage fleece only until Printful confirms it embroiders the Lane Seven; the golf
// shirt's clock is on the left sleeve of all three styles until the SOL'S back placement is confirmed.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const COPY = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/products/drop1b.json'), 'utf8'));
const UP = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/drop1b-uploaded.json'), 'utf8'));
const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const PIECES = {
  beanie: { styles: [['Cuffed', '34.99', null], ['Ribbed', '39.99', null]], image: (d) => [[`offshft-beanie-${d}.png`, null]] },
  bucket: { styles: [['Organic', '44.99', null], ['Classic', '39.99', null]], image: (d) => [[`offshft-bucket-hat-${d}.png`, null]] },
  quarterzip: { styles: [[null, '79.99', SIZES]], image: (d) => [[`offshft-quarter-zip-${d}.png`, null]] },
  golf: {
    styles: [['Cotton Pique', '59.99', SIZES], ['Classic', '59.99', SIZES], ['Performance', '89.99', SIZES]],
    image: () => [['offshft-golf-shirt-punched-out.png', 'Punched Out. on the left chest'], ['offshft-golf-shirt-sleeve.png', 'the clock on the left sleeve']],
  },
};
const DESIGN_ALT = { logo: 'the OFF SHFT logo', clock: 'the clock', 'punched-out': 'Punched Out.' };

function productInput(c) {
  const [kind, ...rest] = c.key.split('-');
  const design = rest.join('-');
  const piece = PIECES[kind];
  if (!piece) throw new Error(`unknown kind in ${c.key}`);
  const styled = piece.styles.length > 1;
  const sized = piece.styles.some(([, , z]) => z);
  const files = piece.image(design).map(([name, what]) => {
    if (!UP[name]) throw new Error(`no staged image ${name}`);
    return { originalSource: UP[name], contentType: 'IMAGE', alt: `${c.title}: drawing with ${what || DESIGN_ALT[design]} at real size` };
  });
  const options = [];
  if (styled) options.push({ name: 'Style', values: piece.styles.map(([s]) => ({ name: s })) });
  if (sized) options.push({ name: 'Size', values: SIZES.map((z) => ({ name: z })) });
  if (!options.length) options.push({ name: 'Title', values: [{ name: 'Default Title' }] });
  const variants = [];
  for (const [style, price, zs] of piece.styles) {
    for (const size of zs || [null]) {
      const optionValues = [];
      if (styled) optionValues.push({ optionName: 'Style', name: style });
      if (size) optionValues.push({ optionName: 'Size', name: size });
      variants.push({ optionValues, price, inventoryItem: { tracked: false } });
    }
  }
  return {
    title: c.title, handle: c.handle, descriptionHtml: c.descriptionHtml, productType: c.productType, vendor: 'OFF SHFT',
    tags: c.tags, status: 'ACTIVE', seo: { title: c.seoTitle, description: c.seoDescription },
    productOptions: options, variants, files,
  };
}

const inputs = COPY.map(productInput);
const vars = {}, defs = [], fields = [];
inputs.forEach((inp, i) => {
  vars[`p${i}`] = inp;
  defs.push(`$p${i}: ProductSetInput!`);
  fields.push(`p${i}: productSet(synchronous: true, input: $p${i}) { product { id handle status variantsCount { count } mediaCount { count } } userErrors { field message code } }`);
});
const query = `mutation Drop1b(${defs.join(', ')}) {\n  ${fields.join('\n  ')}\n}`;
fs.writeFileSync(path.join(__dirname, 'out/drop1b-batch.json'), JSON.stringify({ query, variables: vars }, null, 1));
console.log(inputs.map((p) => `${p.handle}: ${p.variants.length} variants, ${p.files.length} images`).join('\n'));
