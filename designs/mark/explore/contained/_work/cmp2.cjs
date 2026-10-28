const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/explore/contained/build.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/cmp2';
require('fs').mkdirSync(W, { recursive: true });
(async () => {
  const out = [];
  for (const [n, o] of [['b1-1', {}], ['b1.25', { bridge: 3.0 }], ['b1-1.5', { bottom: 3.6 }], ['b1.5', { bridge: 3.6 }]]) {
    const g = B.V.C4.geom(o);
    kit.writeSvg(`${W}/C4-${n}.svg`, { w: g.w, h: g.h, body: B.markBody(g, kit.T.ink) });
    await kit.render(`${W}/C4-${n}.svg`, `${W}/C4-${n}.png`, { bg: kit.F.bone, px: 8, tile: '34x30' });
    out.push(`C4-${n}.png`);
    console.log(n, g.note, 'Lm', g.Lm.toFixed(2));
  }
  await kit.close();
  execSync(`cd ${W} && montage ${out.map((f) => `-label ${f} ${f}`).join(' ')} -tile 4x -geometry 272x240+4+4 -pointsize 14 -background '#888888' ../cmp2.png`);
})();
