// Round 1: heavier hands with hour/minute hierarchy; more container ideas.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/p1';
require('fs').mkdirSync(W, { recursive: true });

const ink = kit.T.ink;
const knock = (c, k, fill = ink) => `<path fill="${fill}" fill-rule="evenodd" d="${c.d}${k.d}"/>`;
const C = {};

// common hand system: minute width um, hour width uh, bridge at minute tip = bm
function sys(R, um = 2.4, uh = 2.8, bm = 2.4, ratio = 0.62) {
  const Lm = R - bm - um / 2;
  return { um, uh, Lm, Lh: Lm * ratio };
}

C.discA = () => { const H = [12.5, 12.5], s = sys(12.5); return { w: 25, h: 25, c: G.circle(H, 12.5), k: G.hands({ H, Lm: s.Lm, wm: s.um, Lh: s.Lh, wh: s.uh }) }; };
C.discOpen = () => {
  // minute hand slot runs out through the rim: silhouette notch at 12
  const H = [12.5, 12.5], um = 2.6, uh = 3.0;
  const R = 12.5;
  // build disc with a slot: path = big arc from slot right edge around to slot left edge, then down to hub, etc.
  const a = um / 2, b = uh / 2;
  const yTop = H[1] - Math.sqrt(R * R - a * a);
  const k = G.hands({ H, Lm: 4, wm: um, Lh: 5.2, wh: uh });
  // simpler: use mask-free construction: disc minus (hands + rect slot) via evenodd needs union; approximate by drawing slot as part of hands path
  const p = new G.PathB();
  const Lh = 5.4;
  const T = G.polar(H, 150, Lh);
  const dh = G.dir(150);
  const hIn = [dh[1], -dh[0]], hOut = [-dh[1], dh[0]];
  // inner corner between slot right edge (x = H.x + a) and hour inner edge
  const q0 = G.add(H, G.mul(hIn, b));
  const t = (H[0] + a - q0[0]) / dh[0];
  const corner = G.add(q0, G.mul(dh, t));
  const rO = Math.max(a, b);
  p.M([H[0] + a, yTop]);
  p.A([H[0] - a, yTop], H, true); // long way round the rim, clockwise from right of slot... (cw goes right/down/left/up)
  p.L([H[0] - a, H[1] - Math.sqrt(rO * rO - a * a)]);
  p.A(G.add(G.add(H, G.mul(hOut, b)), G.mul(dh, Math.sqrt(rO * rO - b * b))), H, false);
  p.L(G.add(T, G.mul(hOut, b)));
  p.A(G.add(T, G.mul(hIn, b)), T, false);
  p.L(corner);
  p.Z();
  return { w: 25, h: 25, c: p, k: { d: '', pts: [] } };
};
C.sundown = () => {
  const H = [12.5, 12.5], s = sys(12.5);
  const tipLow = s.Lh * Math.cos(30 * G.DEG) + s.uh / 2;
  const cut = tipLow + 2.6;
  return { w: 25, h: 12.5 + cut, c: G.flatDisc(H, 12.5, cut, 0.9), k: G.hands({ H, Lm: s.Lm, wm: s.um, Lh: s.Lh, wh: s.uh }) };
};
C.hexPointy = () => {
  const R = 12.5, H = [R * Math.cos(30 * G.DEG), 12.5];
  const verts = [0, 60, 120, 180, 240, 300].map((d) => G.polar(H, d, R));
  const s = sys(R, 2.4, 2.8, 3.1, 0.6);
  return { w: 2 * R * Math.cos(30 * G.DEG), h: 25, c: G.roundedPoly(verts, 1.6), k: G.hands({ H, Lm: s.Lm, wm: s.um, Lh: s.Lh, wh: s.uh }) };
};
C.hexFlat = () => {
  const R = 12.5, H = [12.5, R * Math.cos(30 * G.DEG)];
  const verts = [30, 90, 150, 210, 270, 330].map((d) => G.polar(H, d, R));
  const ap = R * Math.cos(30 * G.DEG);
  const Lm = ap - 2.4 - 1.2;
  return { w: 25, h: 2 * ap, c: G.roundedPoly(verts, 1.6), k: G.hands({ H, Lm, wm: 2.4, Lh: Lm * 0.66, wh: 2.8 }) };
};
C.hexBoreBig = () => {
  const R = 12.5, H = [R * Math.cos(30 * G.DEG), 12.5];
  const verts = [0, 60, 120, 180, 240, 300].map((d) => G.polar(H, d, R));
  return { w: 2 * R * Math.cos(30 * G.DEG), h: 25, c: G.roundedPoly(verts, 1.6), k: G.hands({ H, Lm: 7.6, wm: 2.4, Lh: 5.0, wh: 2.8, hr: 3.0 }) };
};
C.ticket = () => {
  // rectangle with concave quarter-circle corners
  const Wd = 25, Ht = 21, r = 3.4;
  const p = new G.PathB();
  p.M([r, 0]).L([Wd - r, 0]).A([Wd, r], [Wd, 0], false).L([Wd, Ht - r]).A([Wd - r, Ht], [Wd, Ht], false).L([r, Ht]).A([0, Ht - r], [0, Ht], false).L([0, r]).A([r, 0], [0, 0], false).Z();
  const H = [Wd / 2, 11.4];
  return { w: Wd, h: Ht, c: p, k: G.hands({ H, Lm: 7.6, wm: 2.4, Lh: 4.8, wh: 2.8 }) };
};
C.ticketTall = () => {
  const Wd = 20, Ht = 25, r = 3.4;
  const p = new G.PathB();
  p.M([r, 0]).L([Wd - r, 0]).A([Wd, r], [Wd, 0], false).L([Wd, Ht - r]).A([Wd - r, Ht], [Wd, Ht], false).L([r, Ht]).A([0, Ht - r], [0, Ht], false).L([0, r]).A([r, 0], [0, 0], false).Z();
  const H = [Wd / 2, 13.6];
  return { w: Wd, h: Ht, c: p, k: G.hands({ H, Lm: 9.0, wm: 2.4, Lh: 5.6, wh: 2.8 }) };
};
C.label = () => {
  const Wd = 21, Ht = 25;
  const H = [Wd / 2, 13.3];
  return { w: Wd, h: Ht, c: G.roundedPoly([[0, 0], [Wd, 0], [Wd, Ht], [0, Ht]], 1.4), k: G.hands({ H, Lm: 9.2, wm: 2.4, Lh: 5.7, wh: 2.8 }) };
};
C.tileSq = () => {
  const S = 23, H = [S / 2, S / 2];
  return { w: S, h: S, c: G.roundedPoly([[0, 0], [S, 0], [S, S], [0, S]], 2.2), k: G.hands({ H, Lm: 8.0, wm: 2.4, Lh: 5.0, wh: 2.8 }) };
};
C.octagon = () => {
  const R = 12.5 / Math.cos(22.5 * G.DEG) * Math.cos(22.5 * G.DEG); // circumradius such that width = 25 across flats? keep simple
  const H = [12.5, 12.5];
  const verts = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((d) => G.polar(H, d, 12.5 / Math.cos(22.5 * G.DEG)));
  return { w: 25, h: 25, c: G.roundedPoly(verts, 1.4), k: G.hands({ H, Lm: 8.4, wm: 2.4, Lh: 5.2, wh: 2.8 }) };
};

(async () => {
  const names = Object.keys(C);
  for (const n of names) {
    const s = C[n]();
    const bb = G.bboxOf(s.c.pts);
    const svg = `${W}/${n}.svg`;
    const body = `<g transform="translate(${-bb.x0} ${-bb.y0})">${knock(s.c, s.k)}</g>`;
    kit.writeSvg(svg, { w: bb.w, h: bb.h, body });
    await kit.render(svg, `${W}/${n}.png`, { bg: kit.F.bone, tile: '40x32', px: 6 });
    await kit.sizes(svg, `${W}/${n}-sizes.png`, { bg: kit.F.bone });
    const m = s.k.pts.length ? G.minDist(s.c.pts, s.k.pts).d : NaN;
    console.log(n.padEnd(12), 'size', bb.w.toFixed(2), 'x', bb.h.toFixed(2), 'min bridge', m.toFixed(2));
  }
  await kit.close();
  execSync(`cd ${W} && montage ${names.map((f) => `-label ${f} ${f}.png`).join(' ')} -tile 6x -geometry 220x176+6+6 -pointsize 14 -background '#888888' ../p1-sheet.png`);
  execSync(`cd ${W} && montage ${names.map((f) => `-label ${f} ${f}-sizes.png`).join(' ')} -tile 4x -geometry 330x+6+6 -pointsize 14 -background '#888888' ../p1-sizes.png`);
})();
