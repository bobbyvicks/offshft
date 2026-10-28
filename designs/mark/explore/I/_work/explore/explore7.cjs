// Round 7: I1 marker ring / hand weight options that clear the 6 marker at 13 mm
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const B = require('/home/user/offshft/designs/mark/explore/I/build.cjs');
const W = '/home/user/offshft/designs/mark/explore/I/_work/r7';
const INK = kit.T.ink;
const C = {
  'was: inner 8.42 hw1.2 (fails 13mm)': B.V.I1.prims({ inner: 12.5 - 1.7 * 2.4 }),
  'A: inner 10.0 hw1.2': B.V.I1.prims({ inner: 10.0 }),
  'B: inner 9.7 hw1.12': B.V.I1.prims({ inner: 9.7, hw: 1.12 }),
  'C: inner 9.8 hw1.15': B.V.I1.prims({ inner: 9.8, hw: 1.15 }),
};
(async () => {
  const files = [];
  let i = 0;
  for (const [id, prims] of Object.entries(C)) {
    const f = `${W}/c${i++}`;
    const m = G.markSvg(`${f}.svg`, prims, INK);
    await kit.render(`${f}.svg`, `${f}-z.png`, { bg: kit.F.bone, width: 40, tile: '48x48', px: 5 });
    await kit.render(`${f}.svg`, `${f}-13.png`, { bg: kit.F.bone, width: 13, tile: '18x18', px: 8 });
    execSync(`convert ${f}-z.png -resize x420 ${f}-13.png -resize x420 +append -background '#888' -gravity north -splice 0x30 -pointsize 22 -annotate +0+3 '${id}' ${f}-row.png`);
    files.push(`${f}-row.png`);
  }
  await kit.close();
  execSync(`montage ${files.join(' ')} -tile 2x -geometry +6+6 -background '#888' ${W}/sheet.png`);
  console.log('ok');
})();
