// Exports the drawings and the artwork as JSON for the bases picker, which composes the previews in the browser.
//
//   cd /home/user/offshft/tools && node ../store/previews/export.cjs
//
// Writes out/items.json (every drawing, plus which product uses which) and out/designs.json (every design the owner
// can put on a product, recoloured for Bone fabric: Ink for lettering and outlines, Rust for accents).
'use strict';
const fs = require('fs');
const path = require('path');
const kit = require('./kit.cjs');
const { PRODUCTS, SEAM_SHIFT } = require('./build.cjs');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, 'out');

// Where artwork can go on each kind of spot, in mm (Printful's general limits; hat fronts vary by hat).
const AREAS = { front: { w: 140, h: 50 }, chest: { w: 101.6, h: 101.6 }, centre: { w: 101.6, h: 101.6 }, largeFront: { w: 254, h: 152.4 }, leftLeg: { w: 101.6, h: 101.6 }, leftSleeve: { w: 50.8, h: 76.2 } };
// Spots where the artwork is drawn bigger than its master size: it's scaled to fit this box (mm). The digitizer works
// from the artwork at that size; a stitch file is never scaled.
const BIG = { largeFront: { w: 230, h: 90 } };

// Thread colours that read on dark fabric, mapped to their light-fabric partners (BRAND.md colourways).
const ON_BONE = { '#ECE5D3': '#1F2733', '#D29B3C': '#B4552D', '#9AA383': '#B4552D' };
function svgParts(file, recolour) {
  let src = fs.readFileSync(file, 'utf8');
  if (recolour) for (const [from, to] of Object.entries(ON_BONE)) src = src.split(from).join(to).split(from.toLowerCase()).join(to);
  const vb = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  return { w: +vb[2].toFixed(2), h: +vb[3].toFixed(2), vb: vb.join(' '), inner: src.slice(src.indexOf('>') + 1, src.lastIndexOf('</svg>')) };
}

const D = (slug, file) => path.join(ROOT, 'designs', slug, file);
const FINAL = (file) => path.join(ROOT, 'designs/mark/final/the-o', file);
const DESIGNS = [
  { id: 'logo', name: 'OFF SHFT logo', idea: 'The final logo: the clock O at 5:00.', file: FINAL('logo-light.svg') },
  { id: 'clock', name: 'The clock', idea: 'The clock on its own, 25 mm tall.', file: FINAL('symbol-light-25mm.svg') },
  { id: 'clock-40', name: 'The clock', idea: 'The clock at 40 mm, for hat fronts.', file: FINAL('symbol-light-40mm.svg'), artOnly: true },
  { id: 'punched-out', name: 'Punched Out.', idea: 'PUNCHED OUT. in the logo\'s letters, with a Rust full stop. One line on caps and bucket hats, big on the front of the hoodies and crewneck, two lines on the chest and leg spots and the beanies.', file: D('09-punched-out', 'v3/one-line-light.svg') },
  // The same words drawn for other spots (designs/09-punched-out/v3/notes.md): big for the tops' centre front, stacked for square spots.
  { id: 'punched-out-large', name: 'Punched Out.', idea: 'The one line drawn at cap 16.5 for the big centre front.', file: D('09-punched-out', 'v3/one-line-large-light.svg'), artOnly: true },
  { id: 'punched-out-stack', name: 'Punched Out.', idea: 'PUNCHED over OUT., centred, for the anorak chest and the sweatpants leg.', file: D('09-punched-out', 'v3/stacked-centred-light.svg'), artOnly: true },
];

fs.mkdirSync(OUT, { recursive: true });
// A piece with something on its back (a golf shirt's back-neck clock) has a second drawing, the back view.
const names = [...new Set(PRODUCTS.flatMap((p) => [p.item, p.back && p.back.item]).filter(Boolean))];
const items = {};
for (const n of names) {
  if (!fs.existsSync(path.join(__dirname, 'items', `${n}.cjs`))) { console.warn(`no drawing yet: ${n}`); continue; }   // the page skips its preview
  const it = require(`./items/${n}.cjs`)(kit);
  const anchors = { ...it.anchors };
  // Large front: centred, at the height of the left-chest logo.
  // Not on a piece with a placket or zip down the centre front (noBigFront: the polos, the quarter-zip).
  if (anchors.chest && !anchors.largeFront && !it.noBigFront) anchors.largeFront = { x: 0, y: anchors.chest.y };
  items[n] = { category: it.category, w: it.w, h: it.h, body: it.body, over: it.over || '', anchors };   // over: drawn on top of the artwork (drawcords)
}
fs.writeFileSync(path.join(OUT, 'items.json'), JSON.stringify({
  canvas: kit.CANVAS, hatPx: kit.HAT_PX, wearPx: kit.WEAR_PX, fabric: kit.STYLE.fabric, line: kit.STYLE.line, seamShift: SEAM_SHIFT, areas: AREAS, big: BIG,
  products: PRODUCTS.filter((p) => items[p.item]), items,
}));
fs.writeFileSync(path.join(OUT, 'designs.json'), JSON.stringify(DESIGNS.map(({ file, recolour, ...d }) => ({ ...d, ...svgParts(file, recolour) }))));
console.log('items:', names.length, 'designs:', DESIGNS.length, 'sizes:', fs.statSync(path.join(OUT, 'items.json')).size, fs.statSync(path.join(OUT, 'designs.json')).size);
