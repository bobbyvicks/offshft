// Round 3: container grown from the hands (offset hull), plus label tile in two threads.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/p3';
require('fs').mkdirSync(W, { recursive: true });
const { T, F } = kit;
const C = {};
const um = 2.4, uh = 2.8;

// rounded triangle = offset of triangle (A,B,C) by D (round corners). Vertices clockwise on screen.
function offsetTri(P, D) {
  // P: array of 3 points clockwise. Each corner: arc of radius D around the vertex.
  const n = P.length, p = new G.PathB();
  const segs = P.map((A, i) => {
    const B = P[(i + 1) % n];
    const d = G.norm(G.sub(B, A));
    const nrm = [-d[1], d[0]]; // for clockwise polygon on screen, outward normal is rot90ccw? test
    return { A, B, nrm };
  });
  // determine outward normal sign using centroid
  const cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
  segs.forEach((s) => { const mid = G.mul(G.add(s.A, s.B), 0.5); if ((mid[0] - cx) * s.nrm[0] + (mid[1] - cy) * s.nrm[1] < 0) s.nrm = G.mul(s.nrm, -1); });
  segs.forEach((s, i) => {
    const a = G.add(s.A, G.mul(s.nrm, D)), b = G.add(s.B, G.mul(s.nrm, D));
    if (i === 0) p.M(a); else p.A(a, s.A, true);
    p.L(b);
  });
  p.A(G.add(segs[0].A, G.mul(segs[0].nrm, D)), segs[0].A, true);
  return p.Z();
}

C.sail = () => {
  const Lm = 14, Lh = 8.4, H = [0, 0];
  const M = G.polar(H, 0, Lm), Tt = G.polar(H, 150, Lh);
  const D = 1.4 + 2.5;
  const c = offsetTri([M, Tt, H], D);
  return { c, k: G.hands({ H, Lm, wm: um, Lh, wh: uh }) };
};
C.sailHub = () => {
  // hull including a hub circle on the outside (left/back) so the corner at the hub is rounder
  const Lm = 13, Lh = 8.0, H = [0, 0];
  const M = G.polar(H, 0, Lm), Tt = G.polar(H, 150, Lh);
  const D = 1.4 + 3.0;
  const c = offsetTri([M, Tt, H], D);
  return { c, k: G.hands({ H, Lm, wm: um, Lh, wh: uh }) };
};
C.tile2 = () => {
  const S = 23, H = [S / 2, S / 2 + 0.6];
  return { c: G.roundedPoly([[0, 0], [S, 0], [S, S], [0, S]], 1.8), k: G.hands({ H, Lm: 8.4, wm: um, Lh: 5.3, wh: uh }), two: true };
};

(async () => {
  const names = Object.keys(C); const shots = [...names];
  for (const n of names) {
    const s = C[n]();
    const bb = G.bboxOf(s.c.pts);
    const sc = 25 / Math.max(bb.w, bb.h);
    const g = (body) => `<g transform="scale(${sc}) translate(${-bb.x0} ${-bb.y0})">${body}</g>`;
    const svg = `${W}/${n}.svg`;
    kit.writeSvg(svg, { w: bb.w * sc, h: bb.h * sc, body: g(`<path fill="${T.ink}" fill-rule="evenodd" d="${s.c.d}${s.k.d}"/>`) });
    await kit.render(svg, `${W}/${n}.png`, { bg: F.bone, tile: '36x32', px: 7 });
    if (s.two) {
      const svg2 = `${W}/${n}-2c.svg`;
      kit.writeSvg(svg2, { w: bb.w * sc, h: bb.h * sc, body: g(`<path fill="${T.rust}" fill-rule="evenodd" d="${s.c.d}${s.k.d}"/><path fill="${T.bone}" d="${s.k.d}"/>`) });
      await kit.render(svg2, `${W}/${n}-2c.png`, { bg: F.oat, tile: '36x32', px: 7 });
      shots.push(`${n}-2c`);
    }
    console.log(n.padEnd(10), (bb.w * sc).toFixed(2), 'x', (bb.h * sc).toFixed(2), 'bridge@25', (G.minDist(s.c.pts, s.k.pts).d * sc).toFixed(2), 'um@25', (um * sc).toFixed(2));
  }
  await kit.close();
  execSync(`cd ${W} && montage ${shots.map((f) => `-label ${f} ${f}.png`).join(' ')} -tile 4x -geometry 252x224+6+6 -pointsize 14 -background '#888888' ../p3-sheet.png`);
})();
