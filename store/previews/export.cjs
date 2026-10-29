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
const AREAS = { front: { w: 140, h: 50 }, chest: { w: 101.6, h: 101.6 }, leftLeg: { w: 101.6, h: 101.6 }, leftSleeve: { w: 50.8, h: 76.2 } };

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
  { id: 'punched-out', name: 'Punched Out.', idea: 'Just the line, with a full stop. You liked this one.', file: D('09-punched-out', 'design-bone.svg'), draft: true },
  { id: 'after-hours', name: 'After Hours', idea: 'Sun going down over the water.', file: D('04-after-hours', 'design-bone.svg'), draft: true },
  { id: 'lines-in', name: 'Lines In', idea: 'One clean fish. Fishing.', file: D('05-lines-in', 'design-oat.svg'), draft: true },
  { id: 'back-nine', name: 'Back Nine', idea: 'Pin flag on the green. Golf.', file: D('06-back-nine', 'design.svg'), draft: true },
  { id: 'out-of-office', name: 'Out of Office', idea: 'Canoe and paddle. The auto-reply is on.', file: D('07-out-of-office', 'design.svg'), recolour: true, draft: true },
  { id: 'dock-hours', name: 'Dock Hours', idea: 'Muskoka chair at sunset. Open after 5.', file: D('08-dock-hours', 'design.svg'), draft: true },
  { id: 'mulligan-monday', name: 'Mulligan Monday', idea: 'Two lines, golf. Needs a trademark check before selling.', file: D('10-mulligan-monday', 'design.svg'), draft: true },
];

fs.mkdirSync(OUT, { recursive: true });
const names = [...new Set(PRODUCTS.map((p) => p.item))];
const items = {};
for (const n of names) {
  const it = require(`./items/${n}.cjs`)(kit);
  items[n] = { category: it.category, w: it.w, h: it.h, body: it.body, anchors: it.anchors };
}
fs.writeFileSync(path.join(OUT, 'items.json'), JSON.stringify({
  canvas: kit.CANVAS, hatPx: kit.HAT_PX, wearPx: kit.WEAR_PX, fabric: kit.STYLE.fabric, line: kit.STYLE.line, seamShift: SEAM_SHIFT, areas: AREAS,
  products: PRODUCTS, items,
}));
fs.writeFileSync(path.join(OUT, 'designs.json'), JSON.stringify(DESIGNS.map(({ file, recolour, ...d }) => ({ ...d, ...svgParts(file, recolour) }))));
console.log('items:', names.length, 'designs:', DESIGNS.length, 'sizes:', fs.statSync(path.join(OUT, 'items.json')).size, fs.statSync(path.join(OUT, 'designs.json')).size);
