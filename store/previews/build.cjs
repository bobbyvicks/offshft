// Builds the product previews for the bases picker: one PNG per product in out/, plus out/sheet.png to check them together.
//
//   cd /home/user/offshft/tools && node ../store/previews/build.cjs
//
// Each item drawing lives in items/<name>.cjs and returns { name, category: 'hat' | 'wear', w, h, body, anchors },
// all in drawing mm (see kit.cjs). anchors name where the artwork goes: front (hats), chest, leftSleeve, leftLeg.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('./kit.cjs');

const OUT = path.join(__dirname, 'out');
const item = (name) => require(`./items/${name}.cjs`)(kit);

// Which drawing each product uses, and its one embroidered mark. 'Left' is the wearer's left.
const SEAM_SHIFT = 5.2; // 6-panel fronts: move the lockup right so the centre seam falls in the word space (notes.md)
const PRODUCTS = [
  { id: 'trucker-6606', item: 'trucker', mark: 'lockup', at: 'front', shift: SEAM_SHIFT },
  { id: 'five-panel', item: 'five-panel', mark: 'lockup', at: 'front' },
  { id: 'dad-hat', item: 'dad-hat', mark: 'lockup', at: 'front', shift: SEAM_SHIFT },
  { id: 'rope-cap', item: 'rope-cap', mark: 'lockup', at: 'front', shift: SEAM_SHIFT },
  { id: 'hoodie-5161', item: 'hoodie-oversized', mark: 'lockup', at: 'chest' },
  { id: 'hoodie-1567', item: 'hoodie', mark: 'lockup', at: 'chest' },
  { id: 'hoodie-1467', item: 'hoodie', mark: 'lockup', at: 'chest' },
  { id: 'crew-1466', item: 'crewneck', mark: 'lockup', at: 'chest' },
  { id: 'crew-1566', item: 'crewneck', mark: 'lockup', at: 'chest' },
  { id: 'crew-4711', item: 'crewneck-oversized', mark: 'lockup', at: 'chest' },
  { id: 'pants-1469', item: 'sweatpants', mark: 'symbol', at: 'leftLeg' },
  { id: 'pants-4737', item: 'sweatpants', mark: 'symbol', at: 'leftLeg' },
  { id: 'pants-m7580', item: 'sweatpants', mark: 'symbol', at: 'leftLeg' },
  { id: 'joggers-975', item: 'sweatpants', mark: 'symbol', at: 'leftLeg' },
  { id: 'shorts-ind20', item: 'shorts', mark: 'symbol', at: 'leftLeg' },
  { id: 'tee-1717', item: 'tee', mark: 'lockup', at: 'chest' },
  // The 6030 takes no chest embroidery; the logo is too wide for its sleeve, so it goes on the large-centre front spot.
  { id: 'tee-6030', item: 'pocket-tee', mark: 'symbol', at: 'leftSleeve', designAt: { logo: 'centre' } },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const jobs = [];
  for (const p of PRODUCTS) {
    if (only.length && !only.includes(p.id) && !only.includes(p.item)) continue;
    const it = item(p.item);
    const a = it.anchors[p.at];
    if (!a) throw new Error(`${p.item} has no ${p.at} anchor`);
    jobs.push({ out: path.join(OUT, `${p.id}.png`), svg: kit.compose(it, [{ kind: p.mark, x: a.x + (p.shift || 0), y: a.y, rotate: a.rotate }]) });
  }
  await kit.render(jobs);
  if (!only.length) {
    const files = PRODUCTS.map((p) => path.join(OUT, `${p.id}.png`));
    execFileSync('montage', [...files, '-tile', '6x', '-geometry', '300x300+8+8', '-background', '#F7F5F0', path.join(OUT, 'sheet.png')]);
  }
  console.log(`wrote ${jobs.length} previews to ${OUT}`);
}
module.exports = { PRODUCTS, SEAM_SHIFT };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
