// Round 4: C2 corner treatment study; C4 container study (two threads).
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/p4';
require('fs').mkdirSync(W, { recursive: true });
const { T, F } = kit;
const U = 2.4, HW = 2.8, PHI = 1.618034;
const handsAt = (H, Lm) => G.hands({ H, Lm, wm: U, Lh: Lm / PHI, wh: HW, elbow: 'tangent' });
function fit(c, H) { let lo = 2, hi = 30; for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (G.minDist(c.pts, handsAt(H, m).pts).d > U) lo = m; else hi = m; } return lo; }
function hexChamfer(H, Rc, Rcut) {
  const ap = Rc * Math.cos(30 * G.DEG), half = Math.sqrt(Rcut * Rcut - ap * ap), p = new G.PathB();
  [30, 90, 150, 210, 270, 330].forEach((nd, i) => { const mid = G.polar(H, nd, ap), t = G.dir(nd + 90); const a = G.add(mid, G.mul(t, -half)), b = G.add(mid, G.mul(t, half)); if (i === 0) p.M(a); else p.A(a, H, true); p.L(b); });
  p.A(G.add(G.polar(H, 30, ap), G.mul(G.dir(120), -half)), H, true); return p.Z();
}
const C = {};
for (const k of [0.95, 0.965, 0.98]) C[`hexCh${k}`] = () => { const Rcut = 12.5, Rc = Rcut / k, ap = Rc * Math.cos(30 * G.DEG), H = [ap, Rcut]; const c = hexChamfer(H, Rc, Rcut); return { c, k: handsAt(H, fit(c, H)) }; };
for (const r of [1.2, 2.0, 3.0]) C[`hexR${r}`] = () => { const Rc = 12.5 + r * 0.1547, H = [Rc * Math.cos(30 * G.DEG), 12.5]; const c = G.roundedPoly([0, 60, 120, 180, 240, 300].map((d) => G.polar(H, d, Rc)), r); return { c, k: handsAt(H, fit(c, H)) }; };
const two = (c, H) => ({ c, k: handsAt(H, fit(c, H)), two: true });
C.sq12 = () => { const S = 24; return two(G.roundedPoly([[0, 0], [S, 0], [S, S], [0, S]], 1.2), [S / 2, S / 2 + 0.9]); };
C.port = () => { const w = 20, h = 25; return two(G.roundedPoly([[0, 0], [w, 0], [w, h], [0, h]], 1.2), [w / 2, 14.2]); };
C.pillH = () => { const w = 25, h = 19.5; return two(G.roundedPoly([[0, 0], [w, 0], [w, h], [0, h]], h / 2 - 0.001), [w / 2, 11.3]); };
C.shieldM = () => {
  // modern shield: flat top, straight sides, bottom formed by two arcs meeting at a softened point
  const w = 21, h = 25, side = 11.5, r = 1.6;
  const p = new G.PathB();
  const R1 = 19; // radius of the lower arcs
  // right arc centre on the horizontal line y=side, left of the right side by R1
  const cR = [w - R1, side], cL = [R1, side];
  // bottom point: intersection of the two circles
  const yb = side + Math.sqrt(R1 * R1 - (w / 2 - (w - R1)) ** 2);
  p.M([r, 0]).L([w - r, 0]).A([w, r], [w - r, r], true).L([w, side]).A([w / 2, yb], cR, true).A([0, side], cL, true).L([0, r]).A([r, 0], [r, r], true).Z();
  return two(p, [w / 2, 11.8]);
};
C.disc2 = () => two(G.circle([12.5, 12.5], 12.5), [12.5, 12.5]);

(async () => {
  const names = Object.keys(C), shots = [];
  for (const n of names) {
    const s = C[n]();
    const bb = G.bboxOf(s.c.pts);
    const body = s.two
      ? `<path fill="${T.ink}" d="${s.c.d}"/><path fill="${T.sun}" d="${s.k.d}"/>`
      : `<path fill="${T.ink}" fill-rule="evenodd" d="${s.c.d}${s.k.d}"/>`;
    kit.writeSvg(`${W}/${n}.svg`, { w: bb.w, h: bb.h, body: `<g transform="translate(${-bb.x0} ${-bb.y0})">${body}</g>` });
    await kit.render(`${W}/${n}.svg`, `${W}/${n}.png`, { bg: s.two ? F.oat : F.bone, tile: '34x30', px: 8 });
    shots.push(n);
    console.log(n, bb.w.toFixed(2), bb.h.toFixed(2));
  }
  await kit.close();
  execSync(`cd ${W} && montage ${shots.map((f) => `-label ${f} ${f}.png`).join(' ')} -tile 6x -geometry 272x240+4+4 -pointsize 14 -background '#888888' ../p4-sheet.png`);
})();
