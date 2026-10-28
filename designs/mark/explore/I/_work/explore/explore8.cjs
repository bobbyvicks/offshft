const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const B = require('/home/user/offshft/designs/mark/explore/I/build.cjs');
const W = '/home/user/offshft/designs/mark/explore/I/_work/r8';
const C = {
  'S1 square markers, hour .68': B.V.I1.prims({}),
  'S2 square markers, hour .64': B.V.I1.prims({ lh: 0.64 }),
  'S3 markers 1.25w, hour .68': B.V.I1.prims({ marker: 3.0 }),
};
(async () => {
  const files = [];
  let i = 0;
  for (const [id, prims] of Object.entries(C)) {
    const f = `${W}/c${i++}`;
    G.markSvg(`${f}.svg`, prims, kit.T.ink);
    await kit.render(`${f}.svg`, `${f}-z.png`, { bg: kit.F.bone, width: 40, tile: '48x48', px: 5 });
    B.lockupSvg(`${f}-l.svg`, prims, { hand: kit.T.rust, face: kit.T.rust, word: kit.T.ink });
    await kit.render(`${f}-l.svg`, `${f}-l.png`, { bg: kit.F.bone, width: 105.8, tile: '112x28', px: 5 });
    execSync(`convert ${f}-z.png -resize x420 ${f}-l.png -resize x420 +append -background '#888' -gravity north -splice 0x30 -pointsize 22 -annotate +0+3 '${id}' ${f}-row.png`);
    files.push(`${f}-row.png`);
  }
  await kit.close();
  execSync(`convert ${files.join(' ')} -background '#888' -splice 0x6 -append -resize 1600x ${W}/sheet.png`);
})();
