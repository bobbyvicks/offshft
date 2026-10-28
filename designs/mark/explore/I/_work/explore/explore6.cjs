// Round 6: I2 hand weight A/B, I3 after hand fix
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const B = require('/home/user/offshft/designs/mark/explore/I/build.cjs');
const W = '/home/user/offshft/designs/mark/explore/I/_work/r6';
const INK = kit.T.ink, RUST = kit.T.rust;
const C = {
  'I2 hands 1.0': B.V.I2.prims({}),
  'I2 hands 1.15': B.V.I2.prims({ hw: 1.15 }),
  'I2 hands 1.15 lh.66': B.V.I2.prims({ hw: 1.15, lh: 0.66 }),
  'I3 fixed': B.V.I3.prims(),
};
(async () => {
  const rows = [];
  let i = 0;
  for (const [id, prims] of Object.entries(C)) {
    const f = `${W}/c${i++}`;
    const m = G.markSvg(`${f}.svg`, prims, INK);
    const L = Math.max(m.W, m.H);
    await kit.render(`${f}.svg`, `${f}-z.png`, { bg: kit.F.bone, width: (40 * m.W) / L, tile: '50x50', px: 5 });
    await kit.render(`${f}.svg`, `${f}-13.png`, { bg: kit.F.bone, width: (13 * m.W) / L, tile: '20x20', px: 8 });
    B.lockupSvg(`${f}-l.svg`, prims, { hand: RUST, face: RUST, word: INK });
    await kit.render(`${f}-l.svg`, `${f}-l.png`, { bg: kit.F.bone, width: 99, tile: '110x30', px: 5 });
    execSync(`convert ${f}-z.png -resize x500 ${f}-13.png -resize x500 ${f}-l.png -resize x500 +append -resize x300 -background '#888' -gravity north -splice 0x28 -pointsize 22 -annotate +0+2 '${id}' ${f}-row.png`);
    rows.push(`${f}-row.png`);
  }
  await kit.close();
  execSync(`convert ${rows.join(' ')} -background '#888' -splice 0x6 -append ${W}/sheet.png`);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
