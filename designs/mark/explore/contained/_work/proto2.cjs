// Round 2: tag (punched hole as the 12 o'clock index), pill, refined hex and ticket.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/p2';
require('fs').mkdirSync(W, { recursive: true });
const ink = kit.T.ink;
const C = {};
const um = 2.4, uh = 2.8;

C.tag = () => {
  const Wd = 19, Ht = 25, ch = 5.0;
  const verts = [[ch, 0], [Wd - ch, 0], [Wd, ch], [Wd, Ht], [0, Ht], [0, ch]];
  const c = G.roundedPoly(verts, [1.0, 1.0, 1.0, 1.6, 1.6, 1.0]);
  const hole = G.circle([Wd / 2, 4.6], 1.45, false);
  const H = [Wd / 2, 15.6];
  const k = G.hands({ H, Lm: 15.6 - 4.6 - 1.45 - 2.4 - um / 2, wm: um, Lh: 5.0, wh: uh });
  return { w: Wd, h: Ht, c, k: { d: hole.d + k.d, pts: [...hole.pts, ...k.pts] } };
};
C.tagNoHole = () => {
  const Wd = 19, Ht = 25, ch = 5.0;
  const verts = [[ch, 0], [Wd - ch, 0], [Wd, ch], [Wd, Ht], [0, Ht], [0, ch]];
  const c = G.roundedPoly(verts, [1.0, 1.0, 1.0, 1.6, 1.6, 1.0]);
  const H = [Wd / 2, 14.4];
  const k = G.hands({ H, Lm: 9.4, wm: um, Lh: 5.6, wh: uh });
  return { w: Wd, h: Ht, c, k };
};
C.pillV = () => {
  const Wd = 17.5, Ht = 25, r = Wd / 2;
  const c = G.roundedPoly([[0, 0], [Wd, 0], [Wd, Ht], [0, Ht]], r - 0.001);
  const H = [Wd / 2, Ht - r - 1.0];
  const k = G.hands({ H, Lm: H[1] - 2.4 - um / 2 - 0.0, wm: um, Lh: 5.0, wh: uh });
  return { w: Wd, h: Ht, c, k };
};
C.pillVc = () => {
  const Wd = 19, Ht = 25, r = Wd / 2;
  const c = G.roundedPoly([[0, 0], [Wd, 0], [Wd, Ht], [0, Ht]], r - 0.001);
  const H = [Wd / 2, 13.6];
  const k = G.hands({ H, Lm: 9.6, wm: um, Lh: 5.8, wh: uh });
  return { w: Wd, h: Ht, c, k };
};
C.hexP = () => {
  const R = 12.5, H = [R * Math.cos(30 * G.DEG), 12.5];
  const verts = [0, 60, 120, 180, 240, 300].map((d) => G.polar(H, d, R));
  return { w: 2 * R * Math.cos(30 * G.DEG), h: 25, c: G.roundedPoly(verts, 1.8), k: G.hands({ H, Lm: 8.2, wm: um, Lh: 5.2, wh: uh }) };
};
C.hexF = () => {
  const R = 13.0, H = [13, R * Math.cos(30 * G.DEG)];
  const verts = [30, 90, 150, 210, 270, 330].map((d) => G.polar(H, d, R));
  const ap = R * Math.cos(30 * G.DEG);
  return { w: 26, h: 2 * ap, c: G.roundedPoly(verts, 1.8), k: G.hands({ H, Lm: ap - 2.5 - um / 2, wm: um, Lh: 5.6, wh: uh }) };
};
C.ticketT = () => {
  const Wd = 20, Ht = 25, r = 3.2;
  const p = new G.PathB();
  p.M([r, 0]).L([Wd - r, 0]).A([Wd, r], [Wd, 0], false).L([Wd, Ht - r]).A([Wd - r, Ht], [Wd, Ht], false).L([r, Ht]).A([0, Ht - r], [0, Ht], false).L([0, r]).A([r, 0], [0, 0], false).Z();
  const H = [Wd / 2, 13.8];
  return { w: Wd, h: Ht, c: p, k: G.hands({ H, Lm: 9.6, wm: um, Lh: 5.9, wh: uh }) };
};
C.ticketW = () => {
  const Wd = 25, Ht = 22, r = 3.2;
  const p = new G.PathB();
  p.M([r, 0]).L([Wd - r, 0]).A([Wd, r], [Wd, 0], false).L([Wd, Ht - r]).A([Wd - r, Ht], [Wd, Ht], false).L([r, Ht]).A([0, Ht - r], [0, Ht], false).L([0, r]).A([r, 0], [0, 0], false).Z();
  const H = [Wd / 2, 12.3];
  return { w: Wd, h: Ht, c: p, k: G.hands({ H, Lm: 8.6, wm: um, Lh: 5.4, wh: uh }) };
};

(async () => {
  const names = Object.keys(C);
  for (const n of names) {
    const s = C[n]();
    const bb = G.bboxOf(s.c.pts);
    const svg = `${W}/${n}.svg`;
    kit.writeSvg(svg, { w: bb.w, h: bb.h, body: `<g transform="translate(${-bb.x0} ${-bb.y0})"><path fill="${ink}" fill-rule="evenodd" d="${s.c.d}${s.k.d}"/></g>` });
    await kit.render(svg, `${W}/${n}.png`, { bg: kit.F.bone, tile: '36x32', px: 7 });
    console.log(n.padEnd(10), bb.w.toFixed(2), 'x', bb.h.toFixed(2), 'bridge', G.minDist(s.c.pts, s.k.pts).d.toFixed(2));
  }
  await kit.close();
  execSync(`cd ${W} && montage ${names.map((f) => `-label ${f} ${f}.png`).join(' ')} -tile 4x -geometry 252x224+6+6 -pointsize 14 -background '#888888' ../p2-sheet.png`);
})();
