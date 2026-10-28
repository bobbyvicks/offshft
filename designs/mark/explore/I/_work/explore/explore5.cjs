// Round 5: hero/hint weights and terminal style for I1 and I3, judged as mark + lockup
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execSync } = require('child_process');
const G = require('/home/user/offshft/designs/mark/explore/I/geom.cjs');
const B = require('/home/user/offshft/designs/mark/explore/I/build.cjs');
const { P, ray, arc, disc, handsOutline, markSvg } = G;
const { w, HOUR_W, RING_W, OUT } = B;
const W = '/home/user/offshft/designs/mark/explore/I/_work/r5';
const INK = kit.T.ink, RUST = kit.T.rust;
const C = {};

function I1({ hw = 1, cap = 'round', hub = 1.7 }) {
  const wm = w * hw, wh = HOUR_W * hw;
  const unit = 1.7 * w, inner = OUT - unit;
  const tk = (d) => cap === 'round' ? ray(d, inner + w / 2, OUT - w / 2, w, { role: 'face' }) : ray(d, inner, OUT, w, { role: 'face', cap: 'butt' });
  const hands = cap === 'round'
    ? [ray(0, 0, OUT - wm / 2, wm), ray(150, 0, inner - wh / 2, wh)]
    : [ray(0, 0, OUT, wm, { cap: 'butt' }), ray(150, 0, inner, wh, { cap: 'butt' })];
  return [tk(90), tk(180), tk(270), ...hands, ...(hub ? [disc([0, 0], (hub * wm) / 2)] : [])];
}
C['I1 now'] = I1({});
C['I1 heavy hands'] = I1({ hw: 1.2 });
C['I1 square heavy'] = I1({ hw: 1.2, cap: 'butt' });
C['I1 square'] = I1({ cap: 'butt' });

function I3({ cap = 'round', hub = 1.7, hw = 1.15 }) {
  const R = OUT - RING_W / 2, wm = w * hw, wh = HOUR_W * hw;
  const Lm = R - RING_W / 2 - w, Lh = 0.7 * Lm;
  const p = [arc(R, 150, 360, RING_W, { role: 'face', cap })];
  if (hub) {
    if (cap === 'round') p.push(ray(0, 0, Lm - wm / 2, wm), ray(150, 0, Lh - wh / 2, wh));
    else p.push(ray(0, 0, Lm, wm, { cap: 'butt' }), ray(150, 0, Lh, wh, { cap: 'butt' }));
    p.push(disc([0, 0], (hub * wm) / 2));
  } else {
    p.push(cap === 'round' ? handsOutline({ Lm: Lm - wm / 2, wm, Lh: Lh - wh / 2, wh, heel: 1.2 }) : handsOutline({ Lm, wm, Lh, wh, cap: 'butt' }));
  }
  return p;
}
C['I3 now'] = I3({});
C['I3 square hub'] = I3({ cap: 'butt' });
C['I3 square nohub'] = I3({ cap: 'butt', hub: 0 });
C['I3 round nohub'] = I3({ hub: 0 });

(async () => {
  const rows = [];
  let i = 0;
  for (const [id, prims] of Object.entries(C)) {
    const f = `${W}/c${i++}`;
    const m = markSvg(`${f}.svg`, prims, INK);
    const L = Math.max(m.W, m.H);
    await kit.render(`${f}.svg`, `${f}-z.png`, { bg: kit.F.bone, width: (40 * m.W) / L, tile: '50x50', px: 5 });
    await kit.render(`${f}.svg`, `${f}-25.png`, { bg: kit.F.bone, width: (25 * m.W) / L, tile: '30x30', px: 5 });
    B.lockupSvg(`${f}-l.svg`, prims, { hand: RUST, face: RUST, word: INK });
    await kit.render(`${f}-l.svg`, `${f}-l.png`, { bg: kit.F.bone, width: 99, tile: '110x30', px: 5 });
    execSync(`convert ${f}-z.png ${f}-25.png -resize x500 ${f}-l.png -resize x500 +append -resize x300 -background '#888' -gravity north -splice 0x28 -pointsize 22 -annotate +0+2 '${id}' ${f}-row.png`);
    rows.push(`${f}-row.png`);
  }
  await kit.close();
  execSync(`convert ${rows.join(' ')} -background '#888' -splice 0x6 -append ${W}/sheet.png`);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
