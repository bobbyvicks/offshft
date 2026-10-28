// Lockup study: alignments, weights and spacing for one variant. usage: node locktest.cjs G1
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const B = require('./build.cjs');
const { kit } = require('./lib.cjs');
const id = process.argv[2] || 'G1';
const OUT = path.join(__dirname, 'sketch', 'lock-' + id);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const mk = B.MARKS[id]();
const centre = (bb, capU) => (bb.y0 + bb.y1) / 2 + capU / 2;
const pivotBase = () => 0;
const pivotMid = (bb, capU) => capU / 2;
const pivotCap = (bb, capU) => capU;
const bottomBase = (bb) => bb.y1;
const opts = JSON.parse(process.argv[3] || 'null') || [
  { name: 'centre-xbold', markH: 22, cap: 6.4, font: 'xbold', track: 0.16, gap: 'word', baseU: 'centre' },
  { name: 'pivotBase-xbold', markH: 22, cap: 6.4, font: 'xbold', track: 0.16, gap: 'word', baseU: 'pivotBase' },
  { name: 'pivotMid-xbold', markH: 22, cap: 6.4, font: 'xbold', track: 0.16, gap: 'word', baseU: 'pivotMid' },
  { name: 'centre-xsemi', markH: 22, cap: 6.4, font: 'xsemi', track: 0.18, gap: 'word', baseU: 'centre' },
  { name: 'centre-xblack', markH: 22, cap: 6.0, font: 'xblack', track: 0.14, gap: 'word', baseU: 'centre' },
  { name: 'pivotCap-xbold-big', markH: 22, cap: 7.4, font: 'xbold', track: 0.14, gap: 'word', baseU: 'pivotCap' },
];
const nutBand = (bb, capU, m) => (m.o.Rh || m.o.R || 0) ; // baseline at the bottom vertex of the nut / hub
const fnMap = { centre, pivotBase, pivotMid, pivotCap, bottomBase, nutBand };
(async () => {
  const files = [];
  for (const o of opts) {
    const f = path.join(OUT, o.name + '.svg');
    const oo = { ...o, baseU: typeof o.baseU === 'string' ? fnMap[o.baseU] : o.baseU };
    const r = B.writeLockup(f, mk, B.SCHEME[id].lockup, oo);
    const png = f.replace('.svg', '.png');
    await kit.render(f, png, { bg: kit.F.bone });
    files.push(png);
    console.log(o.name, 'W', r.W.toFixed(1), 'H', r.H.toFixed(1), 'markH', r.markH.toFixed(1), 'gap', r.gapMM.toFixed(2), 'clear', r.clearance.toFixed(2), 'stem', r.stem.toFixed(2), 'unit', r.k.toFixed(3));
  }
  await kit.close();
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '2x', '-geometry', '660x384+6+6', '-pointsize', '16', '-background', '#888', path.join(OUT, '_sheet.png')]);
})();
