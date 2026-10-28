// Compare: C1 lockup baseline vs centre; C4 hub centred vs figure centred.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/explore/contained/build.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/cmp1';
require('fs').mkdirSync(W, { recursive: true });
(async () => {
  const out = [];
  for (const align of ['baseline', 'center']) {
    const lk = B.lockup(B.V.C1, { align });
    kit.writeSvg(`${W}/C1-${align}.svg`, { w: lk.w, h: lk.h, body: lk.body });
    await kit.render(`${W}/C1-${align}.svg`, `${W}/C1-${align}.png`, { bg: kit.F.bone, px: 6, tile: '96x30' });
    out.push(`C1-${align}.png`);
  }
  for (const drop of [0, 0.9, 2.0]) {
    const g = B.V.C4.geom({ drop });
    kit.writeSvg(`${W}/C4-drop${drop}.svg`, { w: g.w, h: g.h, body: B.markBody(g, kit.T.ink) });
    await kit.render(`${W}/C4-drop${drop}.svg`, `${W}/C4-drop${drop}.png`, { bg: kit.F.bone, px: 8, tile: '34x30' });
    out.push(`C4-drop${drop}.png`);
  }
  await kit.close();
  execSync(`cd ${W} && montage ${out.slice(0, 2).map((f) => `-label ${f} ${f}`).join(' ')} -tile 1x -geometry +4+4 -pointsize 14 -background '#888888' ../cmp1a.png`);
  execSync(`cd ${W} && montage ${out.slice(2).map((f) => `-label ${f} ${f}`).join(' ')} -tile 3x -geometry 272x240+4+4 -pointsize 14 -background '#888888' ../cmp1b.png`);
})();
