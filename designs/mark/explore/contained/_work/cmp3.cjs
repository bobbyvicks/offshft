const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/explore/contained/build.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/cmp3';
require('fs').mkdirSync(W, { recursive: true });
(async () => {
  const out = [];
  for (const k of [1.0, 1.5, 2.0]) {
    const g = B.V.C1.geom({ cutBridge: k * B.U });
    kit.writeSvg(`${W}/C1-cut${k}.svg`, { w: g.w, h: g.h, body: B.markBody(g, kit.T.rust) });
    await kit.render(`${W}/C1-cut${k}.svg`, `${W}/C1-cut${k}.png`, { bg: kit.F.bone, px: 8, tile: '34x30' });
    const gd = B.V.C1.geom({ cutBridge: k * B.U, boost: 0.1 });
    kit.writeSvg(`${W}/C1-cut${k}-d.svg`, { w: gd.w, h: gd.h, body: B.markBody(gd, kit.T.sun) });
    await kit.render(`${W}/C1-cut${k}-d.svg`, `${W}/C1-cut${k}-d.png`, { bg: kit.F.spruce, px: 8, tile: '34x30' });
    out.push(`C1-cut${k}.png`, `C1-cut${k}-d.png`);
  }
  await kit.close();
  execSync(`cd ${W} && montage ${out.map((f) => `-label ${f} ${f}`).join(' ')} -tile 6x -geometry 272x240+4+4 -pointsize 14 -background '#888888' ../cmp3.png`);
})();
