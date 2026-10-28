// Round 3: arc and tick options, judged next to the wordmark
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const { P, line, ray, arc, disc, shape, emit, bbox } = G;
const W = '/home/user/offshft/designs/mark/explore/I/_work/r3';
const INK = kit.T.ink;
const deg = (r) => (r * 180) / Math.PI;
const C = {};

// ---- arc options ----
{
  const w = 2.3, R = 11.3;
  // free time: arc from 5 round to 12; hands point at its two ends
  C.a4a = [ray(0, 0, R - w - 2.2, w), ray(150, 0, 6.0, w), arc(R, 150, 360, w)];
  // same, arc ends pulled back a little so ends sit clear of the hands' lines
  C.a4b = [ray(0, 0, R - w - 1.6, w), ray(150, 0, 6.0, w), disc([0, 0], w), arc(R, 162, 348, w)];
  // angle arc between the hands (protractor) - hands long
  const Lm = 12.4, Lh = 8.4, ra = 5.6, wa = 2.0, cl = 1.5;
  const t0 = deg(Math.asin((w / 2 + cl + wa / 2) / ra));
  C.a4c = [ray(0, 0, Lm - w / 2, w), ray(150, 0, Lh - w / 2, w), arc(ra, t0, 150 - t0, wa)];
  // hours-in arc 12->5 outside, hands with short counter-tails to break the D stem
  C.a4d = [ray(0, -2.2, R - w - 2.2, w), ray(150, -2.0, 6.0, w), arc(R, 0, 150, w)];
  // hours-in arc 12->5 outside, starting AFTER 12 (1 o'clock) so it never touches the minute hand axis
  C.a4e = [ray(0, 0, R + w / 2 - w / 2, w), ray(150, 0, 6.2, w), arc(R, 30, 150, w)];
}
// ---- tick options ----
{
  const w = 2.3, Ro = 12.5;
  const t = (d, L, cap = 'butt') => ray(d, Ro - L + (cap === 'round' ? w / 2 : 0), Ro - (cap === 'round' ? w / 2 : 0), w, { role: 'face', cap });
  C.t3a = [ray(0, 0, Ro - w / 2, w), ray(150, 0, 7.2, w * 1.08), disc([0, 0], w * 1.05), t(90, 3.6, 'round'), t(180, 3.6, 'round'), t(270, 3.6, 'round')];
  C.t3b = [ray(0, 0, Ro, w, { cap: 'butt' }), ray(150, 0, 7.4, w * 1.08, { cap: 'butt' }), disc([0, 0], w * 1.05), t(90, 4.2), t(180, 4.2), t(270, 4.2)];
  C.t3c = [ray(0, 0, Ro - w / 2, w), ray(150, 0, 7.6, w * 1.08), t(90, 4.6, 'round'), t(180, 4.6, 'round'), t(270, 4.6, 'round')];
}

(async () => {
  const files = [];
  const word = kit.text('OFF SHFT', { font: 'xbold', cap: 7, track: 0.16, fill: INK });
  for (const [id, prims] of Object.entries(C)) {
    const b = bbox(prims);
    // mark height = 2.4 cap, hub on cap midline
    const k = (2.4 * 7) / Math.max(b.h, 1);
    const capMid = 3.5; // baseline at 7
    const markX0 = 0;
    const dx = markX0 - b.x0 * k, dy = capMid; // hub at y = capMid
    const markW = b.w * k;
    const gap = 7;
    const tx = markW + gap;
    const top = Math.min(-0, dy + b.y0 * k), bot = Math.max(7, dy + b.y1 * k);
    const body = emit(prims, { k, dx, dy: dy - top, col: INK }) + `<g transform="translate(${tx} ${-top})">${word.svg}</g>`;
    const svg = `${W}/${id}.svg`;
    kit.writeSvg(svg, { w: tx + word.width, h: bot - top, body });
    // mark alone too
    const ms = `${W}/${id}-m.svg`;
    G.markSvg(ms, prims, INK);
    await kit.render(svg, `${W}/${id}.png`, { bg: kit.F.bone });
    await kit.sizes(ms, `${W}/${id}-m.png`, { bg: kit.F.bone });
    files.push(`${W}/${id}.png`, `${W}/${id}-m.png`);
  }
  await kit.close();
  execSync(`montage -label '%t' ${files.join(' ')} -tile 2x -geometry 640x300+8+8 -pointsize 20 -background '#888888' ${W}/sheet.png`);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
