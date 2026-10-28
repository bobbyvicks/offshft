// hour-hand width study on C1 (minute fixed at U = 2.4)
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/cmp4';
require('fs').mkdirSync(W, { recursive: true });
(async () => {
  const out = [];
  for (const wh of [2.4, 2.8, 3.1, 3.4]) {
    const H = [12.5, 12.5], Lm = 8.9, Lh = Lm / 1.618034;
    const cut = Lh * Math.cos(30 * G.DEG) + wh / 2 + 3.6;
    const c = G.flatDisc(H, 12.5, cut, 1.2);
    const k = G.hands({ H, Lm, wm: 2.4, Lh, wh, elbow: 'tangent' });
    kit.writeSvg(`${W}/wh${wh}.svg`, { w: 25, h: 12.5 + cut, body: `<path fill="${kit.T.rust}" fill-rule="evenodd" d="${c.d}${k.d}"/>` });
    await kit.render(`${W}/wh${wh}.svg`, `${W}/wh${wh}.png`, { bg: kit.F.bone, px: 8, tile: '30x28' });
    await kit.render(`${W}/wh${wh}.svg`, `${W}/wh${wh}-13.png`, { bg: kit.F.bone, px: 8, width: 13, tile: '30x28' });
    out.push(`wh${wh}.png`);
  }
  for (const wh of [2.4, 2.8, 3.1, 3.4]) out.push(`wh${wh}-13.png`);
  await kit.close();
  execSync(`cd ${W} && montage ${out.map((f) => `-label ${f} ${f}`).join(' ')} -tile 4x -geometry 240x224+4+4 -pointsize 14 -background '#888888' ../cmp4.png`);
})();
