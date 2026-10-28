// Round 0: candidate containers side by side, same hand system, Ink on Bone.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/p0';
require('fs').mkdirSync(W, { recursive: true });

const u = 2.2, wh = u * 1.06;
const ink = kit.T.ink;
function knock(container, handsPath, extra = '') {
  return `<path fill="${ink}" fill-rule="evenodd" d="${container.d}${handsPath.d}${extra}"/>`;
}
function hands(H, Lm, Lh, hr = 0) { return G.hands({ H, Lm, wm: u, Lh, wh, hr }); }
const C = {};
// 1 disc
C.disc = () => { const H = [12.5, 12.5]; return { w: 25, h: 25, c: G.circle(H, 12.5), k: hands(H, 9.0, 5.6) }; };
C.discHub = () => { const H = [12.5, 12.5]; return { w: 25, h: 25, c: G.circle(H, 12.5), k: hands(H, 9.0, 5.6, u * 1.05) }; };
C.sundown = () => { const H = [12.5, 12.5]; return { w: 25, h: 12.5 + 9.6, c: G.flatDisc(H, 12.5, 9.6, 0.8), k: hands(H, 9.0, 5.4) }; };
C.card = () => {
  const Wd = 19.6, Ht = 25, c = 5.2;
  const verts = [[c, 0], [Wd, 0], [Wd, Ht], [0, Ht], [0, c]];
  const H = [Wd / 2, 14.2];
  return { w: Wd, h: Ht, c: G.roundedPoly(verts, [0.8, 1.6, 1.6, 1.6, 0.8]), k: hands(H, 9.4, 5.6) };
};
C.hexPointy = () => {
  const R = 12.5, H = [R * Math.cos(30 * G.DEG), 12.5];
  const verts = [0, 60, 120, 180, 240, 300].map((d) => G.polar(H, d, R));
  return { w: 2 * R * Math.cos(30 * G.DEG), h: 25, c: G.roundedPoly(verts, 1.4), k: hands(H, 8.6, 5.3) };
};
C.hexFlatBore = () => {
  const R = 12.5, H = [12.5, R * Math.cos(30 * G.DEG)];
  const verts = [30, 90, 150, 210, 270, 330].map((d) => G.polar(H, d, R));
  return { w: 25, h: 2 * R * Math.cos(30 * G.DEG), c: G.roundedPoly(verts, 1.4), k: hands(H, 7.6, 5.6, 2.3) };
};
C.pocket = () => {
  const Wd = 21.5, Ht = 25, side = 18.6;
  const verts = [[0, 0], [Wd, 0], [Wd, side], [Wd / 2, Ht], [0, side]];
  const H = [Wd / 2, 12.2];
  return { w: Wd, h: Ht, c: G.roundedPoly(verts, [1.6, 1.6, 2.0, 2.4, 2.0]), k: hands(H, 8.8, 5.5) };
};
C.tile = () => {
  const S = 23, H = [S / 2, S / 2];
  return { w: S, h: S, c: G.roundedPoly([[0, 0], [S, 0], [S, S], [0, S]], 5.0), k: hands(H, 8.3, 5.2) };
};
C.shield = () => {
  // flat top, straight sides, arcs to a point
  const Wd = 21, Ht = 25, side = 12;
  const p = new G.PathB();
  const r = 1.6;
  p.M([r, 0]).L([Wd - r, 0]).A([Wd, r], [Wd - r, r], true).L([Wd, side]);
  // right arc from (Wd, side) to bottom point (Wd/2, Ht): circle centre on y=side line
  const R1 = ((Wd / 2) ** 2 + (Ht - side) ** 2) / (Wd); // centre at (Wd - R1, side)? approximate gothic arc
  const cR = [Wd - R1, side];
  p.A([Wd / 2, Ht], cR, true);
  const cL = [R1, side];
  p.A([0, side], cL, true).L([0, r]).A([r, 0], [r, r], true).Z();
  const H = [Wd / 2, 11.6];
  return { w: Wd, h: Ht, c: p, k: hands(H, 8.4, 5.2) };
};

(async () => {
  const names = Object.keys(C);
  const files = [];
  for (const n of names) {
    const s = C[n]();
    const svg = `${W}/${n}.svg`;
    kit.writeSvg(svg, { w: s.w, h: s.h, body: knock(s.c, s.k) });
    await kit.render(svg, `${W}/${n}.png`, { bg: kit.F.bone, tile: '40x32', px: 6 });
    await kit.sizes(svg, `${W}/${n}-sizes.png`, { bg: kit.F.bone });
    // measure: thread bridge between container boundary and the knockout
    const m = G.minDist(s.c.pts, s.k.pts);
    console.log(n.padEnd(12), 'size', s.w.toFixed(2), 'x', s.h.toFixed(2), 'min bridge', m.d.toFixed(2));
    files.push(n);
  }
  await kit.close();
  execSync(`cd ${W} && montage ${files.map((f) => `-label ${f} ${f}.png`).join(' ')} -tile 5x -geometry 240x192+6+6 -pointsize 14 -background '#888888' ../p0-sheet.png`);
  execSync(`cd ${W} && montage ${files.map((f) => `-label ${f} ${f}-sizes.png`).join(' ')} -tile 3x -geometry 420x+6+6 -pointsize 14 -background '#888888' ../p0-sizes.png`);
})();
