// Round 1 exploration: many quick options per idea, rendered with kit.sizes into a contact sheet.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('./geom.cjs');
const { P, line, ray, arc, disc, shape, markSvg } = G;
const W = '/home/user/offshft/designs/mark/explore/I/_work/r1';
const INK = kit.T.ink;

function wedge(o, rw, d0 = 0, d1 = 150) {
  // filled sector between the hands at d0 and d1, inset by o from each hand axis
  const u0 = P(d0, 1), u1 = P(d1, 1);
  // inward normals (pointing into the sector)
  const n0 = [-u0[1], u0[0]].map((v) => -v); // rotate u0 by +90 (clockwise in screen) -> into sector
  const n0b = [u0[1] * -1, u0[0]];
  const nA = P(d0 + 90, 1), nB = P(d1 - 90, 1);
  // apex: intersection of lines p.nA = o and p.nB = o
  const det = nA[0] * nB[1] - nA[1] * nB[0];
  const apex = [(o * nB[1] - nA[1] * o) / det, (nA[0] * o - o * nB[0]) / det];
  const t = Math.sqrt(rw * rw - o * o);
  const pA = [o * nA[0] + t * u0[0], o * nA[1] + t * u0[1]];
  const pB = [o * nB[0] + t * u1[0], o * nB[1] + t * u1[1]];
  return shape([['M', apex], ['L', pA], ['A', rw, 0, 1, pB], ['Z']], { role: 'face' });
}

const C = {};
// ---------- I1 ticks ----------
{
  const w = 2.4, Ro = 12.5, Rc = Ro - w / 2, tl = 1.0; // round tick: centreline length tl
  C.t1a = [ray(0, 0, Rc, w), ray(150, 0, 6.8, w), ...[90, 180, 270].map((d) => ray(d, Rc - tl, Rc, w, { role: 'face' }))];
  C.t1b = [ray(0, 0, Rc - tl - w - 2.4, w), ray(150, 0, 5.6, w), ...[0, 90, 180, 270].map((d) => ray(d, Rc - tl, Rc, w, { role: 'face' }))];
  C.t1c = [ray(0, 0, Ro - 3.2 - 2.4, w, { cap: 'butt' }), ray(150, 0, 5.8, w, { cap: 'butt' }), disc([0, 0], w / 2), ...[0, 90, 180, 270].map((d) => ray(d, Ro - 3.2, Ro, w, { role: 'face', cap: 'butt' }))];
  C.t1d = [ray(0, 2.6, Rc - tl - w - 2.2, w), ray(150, 2.6, 6.4, w), ...[0, 90, 180, 270].map((d) => ray(d, Rc - tl, Rc, w, { role: 'face' }))];
  C.t1e = [ray(0, 0, Rc - tl - w - 2.4, w), ray(150, 0, 5.6, w), disc([0, 0], w), ...[0, 90, 180, 270].map((d) => ray(d, Rc - tl, Rc, w, { role: 'face' }))];
}
// ---------- I2 dots ----------
{
  const d = 2.6, R = 12.5 - d / 2, w = 2.4;
  const dots = (skip = []) => [...Array(12).keys()].filter((i) => !skip.includes(i)).map((i) => disc(P(i * 30, R), d / 2, { role: 'face' }));
  C.d2a = [ray(0, 0, R, w), ray(150, 0, 6.6, w), ...dots([0])];
  C.d2b = [ray(0, 0, R - d / 2 - 2.4 - w / 2, w), ray(150, 0, 5.4, w), ...dots()];
  C.d2c = [ray(0, 2.6, R - d / 2 - 2.4 - w / 2, w), ray(150, 2.6, 6.0, w), ...dots()];
}
// ---------- I3 arc ----------
{
  const w = 2.4, R = 11.6;
  C.a3a = [ray(0, 0, R - w - 2.4, w), ray(150, 0, 5.4, w), arc(R, 0, 150, w)];
  C.a3b = [shape([]), ray(150, 0, 6.2, w)];
  C.a3b = [line([0, 0], [0, -R], w), arc(R, 0, 150, w, { role: 'hand' }), ray(150, 0, R - w - 2.4, w)];
  C.a3c = [ray(0, 0, R - w - 2.4, w), ray(150, 0, 5.4, w), arc(R, 150, 360, w)];
}
// ---------- I4 wedge ----------
{
  const w = 2.4;
  C.w4a = [ray(0, 0, 11, w), ray(150, 0, 8, w), wedge(w / 2 + 1.6, 7)];
  C.w4b = [ray(0, 0, 11, w), ray(150, 0, 7.2, w), wedge(0, 7.2 + w / 2)];
  C.w4c = [ray(0, 0, 11, w), ray(150, 0, 8.6, w), wedge(w / 2 + 1.6, 9.8)];
}
// ---------- I5 broken ring ----------
{
  const w = 2.2, R = 10.6, wh = 2.4;
  const half = (Math.asin((wh / 2 + 1.6 + w / 2) / R) * 180) / Math.PI;
  C.b5a = [ray(0, 0, R - w / 2 - 2.4 - w / 2, wh), ray(150, 0, R + 3.2, wh), arc(R, 150 + half, 510 - half, w)];
  const half2 = (Math.asin((1.2 + w / 2) / R) * 180) / Math.PI;
  C.b5b = [ray(0, 0, R - w / 2 - 2.4 - w / 2, wh), ray(150, 0, 6.2, wh), arc(R, 150 + half2 + 4, 510 - half2 - 4, w)];
}

(async () => {
  const files = [];
  for (const [id, prims] of Object.entries(C)) {
    const svg = `${W}/${id}.svg`;
    const info = markSvg(svg, prims, INK);
    await kit.sizes(svg, `${W}/${id}.png`, { bg: kit.F.bone });
    files.push(`${W}/${id}.png`);
    console.log(id, 'bbox', info.W.toFixed(2), 'x', info.H.toFixed(2));
  }
  await kit.close();
  execSync(`montage -label '%t' ${files.join(' ')} -tile 3x -geometry 600x260+8+8 -pointsize 20 -background '#888888' ${W}/sheet.png`);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
