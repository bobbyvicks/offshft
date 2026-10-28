// Round 2 exploration
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('./geom.cjs');
const { P, line, ray, arc, disc, shape, markSvg } = G;
const W = '/home/user/offshft/designs/mark/explore/I/_work/r2';
const INK = kit.T.ink;
const C = {};
const deg = (r) => (r * 180) / Math.PI;

// hands as one polyline (tip - hub - tip) so the joint is a real join, not two overlapping caps
function hands(Lm, Lh, w, o = {}) {
  const a = P(0, Lm), b = P(150, Lh);
  return { t: 'poly', pts: [a, [0, 0], b], w, cap: o.cap || 'round', join: o.join || 'round', role: 'hand' };
}

// ---------- I1 ticks: minute hand is the 12 mark; ticks at 3, 6, 9 ----------
{
  const w = 2.3, Ro = 12.5;
  C.t2a = [ray(0, 0, Ro, w, { cap: 'butt' }), ray(150, 0, 7.0, w, { cap: 'butt' }), disc([0, 0], w / 2), ...[90, 180, 270].map((d) => ray(d, Ro - 3.6, Ro, w, { role: 'face', cap: 'butt' }))];
  C.t2b = [ray(0, 0, Ro - w / 2, w), ray(150, 0, 7.0, w), ...[90, 180, 270].map((d) => ray(d, Ro - 3.4 + w / 2, Ro - w / 2, w, { role: 'face' }))];
  C.t2c = [ray(0, 0, Ro - w / 2, w), ray(150, 0, 6.6, w * 1.12), disc([0, 0], w * 1.05), ...[90, 180, 270].map((d) => ray(d, Ro - 3.4 + w / 2, Ro - w / 2, w, { role: 'face' }))];
  // ticks shorter, closer: smaller face so hands dominate
  C.t2d = [ray(0, 0, Ro, w, { cap: 'butt' }), ray(150, 0, 7.4, w, { cap: 'butt' }), disc([0, 0], w / 2), ...[90, 180, 270].map((d) => ray(d, Ro - 2.6, Ro, w, { role: 'face', cap: 'butt' }))];
}
// ---------- I2 dots ----------
{
  const d = 2.6, R = 12.5 - d / 2, w = 2.4;
  const dots = (skip = [], big = {}) => [...Array(12).keys()].filter((i) => !skip.includes(i)).map((i) => disc(P(i * 30, R), (big[i] || d) / 2, { role: 'face' }));
  C.d3a = [ray(0, 0, R, w), ray(150, 0, 6.6, w), ...dots([0])];
  C.d3b = [ray(0, 0, R, w), ray(150, 0, 6.6, w * 1.1), disc([0, 0], w * 0.95), ...dots([0])];
  C.d3c = [ray(0, 0, R, w), ray(150, 0, 6.6, w), ...dots([0], { 3: 3.2, 6: 3.2, 9: 3.2 })];
}
// ---------- I3 hours put in ----------
{
  const w = 2.3;
  // trail arc inside the minute hand's reach
  const Lm = 12.4, Lh = 5.6, Ra = Lh + w / 2 + 1.7 + w / 2;
  const a0 = deg(Math.asin((w / 2 + 1.7 + w / 2) / Ra));
  C.a3d = [ray(0, 0, Lm - w / 2, w), ray(150, 0, Lh, w), arc(Ra, a0, 150, w)];
  // five hour marks (1..5) as dots on the dial
  const R = 11.2, dd = 2.6;
  C.a3e = [ray(0, 0, R, w), ray(150, 0, 6.2, w), ...[1, 2, 3, 4, 5].map((h) => disc(P(h * 30, R), dd / 2, { role: 'face' }))];
  // five hour ticks (1..5)
  C.a3f = [ray(0, 0, R + 0.2, w), ray(150, 0, 6.2, w), ...[1, 2, 3, 4, 5].map((h) => ray(h * 30, R - 1.6, R + 0.2, w, { role: 'face' }))];
  // thin outer arc starting clear of the minute hand
  const R2 = 11.4, wa = 1.6, s0 = deg(Math.asin((w / 2 + 1.8 + wa / 2) / R2));
  C.a3g = [ray(0, 0, R2 + wa / 2 - w / 2, w), ray(150, 0, 6.2, w), arc(R2, s0, 150, wa)];
}
// ---------- I4 power off: ring with a gap at 12, minute hand passes through ----------
{
  const w = 2.3, R = 11.3;
  const g = 1.8; // clearance each side of the minute hand
  const half = deg(Math.asin((w / 2 + g + w / 2) / R));
  C.p4a = [ray(0, 0, R + w / 2 - w / 2, w), ray(150, 0, 6.4, w), arc(R, half, 360 - half, w)];
  C.p4b = [ray(0, 0, R + 1.6, w), ray(150, 0, 6.4, w), arc(R, half, 360 - half, w)];
  const half2 = deg(Math.asin((w / 2 + 2.4 + w / 2) / R));
  C.p4c = [ray(0, 0, R - 0.6, w), ray(150, 0, 6.2, w), arc(R, half2, 360 - half2, w)];
  // minute hand starts at hub but is the only thing crossing the ring line; ring heavier
  C.p4d = [ray(0, 0, R + w / 2 - w / 2, w), ray(150, 0, 6.4, w), arc(R, half, 360 - half, w * 1.15)];
}

// add 'poly' support by converting to lines (hands() unused for now)
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
