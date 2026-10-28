// Round 4: parameter study for I1 and I3, joint treatment, wordmark weight
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const { P, ray, arc, disc, handsOutline, markSvg, emit, bbox } = G;
const W = '/home/user/offshft/designs/mark/explore/I/_work/r4';
const INK = kit.T.ink;
const w = 2.4, HW = w * 1.08, RW = w * 1.04, OUT = 12.5;
const C = {};

function I1({ hub = 2, lh = 0.64, tick = 1.6, tail = 0 }) {
  const Lm = OUT - w / 2, Lh = lh * OUT;
  const p = [...[90, 180, 270].map((d) => ray(d, OUT - tick * w + w / 2, OUT - w / 2, w, { role: 'face' }))];
  if (hub) p.push(ray(0, 0, Lm, w), ray(150, 0, Lh - HW / 2, HW), disc([0, 0], (hub * w) / 2));
  else p.push(handsOutline({ Lm, wm: w, Lh: Lh - HW / 2, wh: HW, heel: 1.2 }));
  if (tail) p.push(ray(180, 0, tail, w));
  return p;
}
C['I1 hub2 lh.64 t1.6'] = I1({});
C['I1 hub1.7 lh.68 t1.6'] = I1({ hub: 1.7, lh: 0.68 });
C['I1 hub1.7 lh.68 t2.0'] = I1({ hub: 1.7, lh: 0.68, tick: 2.0 });
C['I1 nohub lh.68 t1.8'] = I1({ hub: 0, lh: 0.68, tick: 1.8 });

function I3({ hub = 0, hw = 1, lhr = 0.66, gap = w }) {
  const R = OUT - RW / 2;
  const wm = w * hw, wh = HW * hw;
  const Lm = R - RW / 2 - gap; // tip extent
  const Lh = lhr * Lm;
  const p = [arc(R, 150, 360, RW, { role: 'face' })];
  if (hub) p.push(ray(0, 0, Lm - wm / 2, wm), ray(150, 0, Lh - wh / 2, wh), disc([0, 0], (hub * wm) / 2));
  else p.push(handsOutline({ Lm: Lm - wm / 2, wm, Lh: Lh - wh / 2, wh, heel: 1.2 }));
  return p;
}
C['I3 plain'] = I3({});
C['I3 hub1.8'] = I3({ hub: 1.8 });
C['I3 heavy hands 1.15'] = I3({ hw: 1.15, lhr: 0.68 });
C['I3 heavy+hub'] = I3({ hw: 1.15, hub: 1.7, lhr: 0.7 });

(async () => {
  const files = [];
  let i = 0;
  for (const [id, prims] of Object.entries(C)) {
    const f = `${W}/c${i++}`;
    const m = markSvg(`${f}.svg`, prims, INK);
    const L = Math.max(m.W, m.H);
    await kit.render(`${f}.svg`, `${f}.png`, { bg: kit.F.bone, width: (44 * m.W) / L, tile: '56x56', px: 5 });
    await kit.render(`${f}.svg`, `${f}-13.png`, { bg: kit.F.bone, width: (13 * m.W) / L, tile: '20x20', px: 6 });
    execSync(`convert ${f}.png ( ${f}-13.png -resize 50% ) -gravity southeast -geometry +10+10 -composite -set label '${id}' ${f}-c.png`.replace(/[()]/g, (m) => '\\' + m));
    files.push(`${f}-c.png`);
  }
  // wordmark weights
  for (const [font, cap] of [['xbold', 8.5], ['sxbold', 7.5], ['xbold', 6.5]]) {
    const t = kit.text('OFF SHFT', { font, cap, track: 0.16, fill: INK });
    kit.writeSvg(`${W}/wm-${font}-${cap}.svg`, { w: t.width, h: cap, body: t.svg });
    await kit.render(`${W}/wm-${font}-${cap}.svg`, `${W}/wm-${font}-${cap}.png`, { bg: kit.F.bone, width: t.width * 0.9, tile: '120x24', px: 4 });
    console.log(font, cap, 'width', t.width.toFixed(1), 'stem', kit.stem(font, cap).toFixed(2));
  }
  await kit.close();
  execSync(`montage ${files.join(' ')} -tile 4x -geometry 440x440+6+6 -pointsize 18 -background '#888888' -label '%l' ${W}/sheet.png`);
  execSync(`montage -label '%t' ${W}/wm-xbold-8.5.png ${W}/wm-sxbold-7.5.png ${W}/wm-xbold-6.5.png -tile 1x -geometry +6+6 -pointsize 18 -background '#888888' ${W}/wm.png`);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
