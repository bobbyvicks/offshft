// OFF SHFT - direction I (implied clock). Builds I1..I4: marks, lockups, renders, checks, sheet.
//   node build.cjs            build everything
//   node build.cjs I2 I3      build only some variants (sheet is rebuilt from what exists)
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const G = require('./geom.cjs');
const { P, ray, arc, disc, emit, bbox } = G;

const ROOT = '/home/user/offshft/designs/mark/explore/I';
const WORK = `${ROOT}/_work`;
const { T, F } = kit;
const deg = (r) => (r * 180) / Math.PI;
const asinD = (x) => deg(Math.asin(x));

// ---------------------------------------------------------------------------
// Shared system. Mark is drawn at its real front-of-hat size: 25 mm on the longest side.
// Module w = 2.4 mm. Every stroke and every gap is >= w, so at 13 mm (x0.52) all features are >= 1.25 mm.
// ---------------------------------------------------------------------------
const w = 2.4;              // stroke module
const HOUR_W = w * 1.08;    // hour hand: heavier (diagonal reads thinner + classic hand hierarchy)
const RING_W = w * 1.04;    // curves read lighter than straights at equal width
const DOT_D = w * 1.1;      // dots read lighter than strokes at equal width
const OUT = 12.5;           // outer radius of the face elements (25 mm across)

const V = {};

// I1 - Quarter marks. Square-cut hands and three square markers at 3, 6, 9, like a time clock on a plant wall.
// The minute hand IS the 12 o'clock marker (reaches the rim). Markers are exact squares of the module w;
// hands are 1.2w (hero vs hint); hub = 1.7x the hand width; hour hand = 0.68 of the minute hand.
V.I1 = {
  name: 'Quarter Marks',
  concept: 'Square-cut hands and three small square markers at 3, 6 and 9, like the time clock on the shop wall; the minute hand itself is the 12 o\'clock marker, so the hands are the hero and the face is only hinted.',
  prims(o = {}) {
    const hw = o.hw || 1.2;
    const wm = w * hw, wh = HOUR_W * hw;
    const m = o.marker || w;       // marker: a w x w square at the rim
    const Lh = (o.lh || 0.68) * OUT;
    return [
      ...[90, 180, 270].map((d) => ray(d, OUT - m, OUT, w, { role: 'face', cap: 'butt' })),
      ray(0, 0, OUT, wm, { role: 'hand', cap: 'butt' }),
      ray(150, 0, Lh, wh, { role: 'hand', cap: 'butt' }),
      disc([0, 0], (1.7 * wm) / 2, { role: 'hand' }),
    ];
  },
};

// I2 - Twelve. Twelve dots; the minute hand reaches the ring and becomes the 12 o'clock dot.
V.I2 = {
  name: 'Twelve',
  concept: 'Twelve stitched dots make the dial; the minute hand runs out to the ring and takes the place of the 12 o\'clock dot, so the hands and the face are one figure.',
  prims(o = {}) {
    const Rd = OUT - DOT_D / 2;
    const Lh = (o.lh || 0.64) * Rd;  // to the hour tip extent
    const hw = o.hw || 1.15;         // hands heavier than the dots: hands are the hero
    const wm = w * hw, wh = HOUR_W * hw;
    const dots = [...Array(12).keys()].filter((i) => i !== 0).map((i) => disc(P(i * 30, Rd), DOT_D / 2, { role: 'face' }));
    const hands = o.hub
      ? [ray(0, 0, Rd, wm, { role: 'hand' }), ray(150, 0, Lh - wh / 2, wh, { role: 'hand' }), disc([0, 0], (o.hub * wm) / 2, { role: 'hand' })]
      : [G.handsOutline({ Lm: OUT - wm / 2, wm, Lh: Lh - wh / 2, wh, heel: 1.2 })];
    return [...dots, ...hands];
  },
};

// I3 - Your Time. One arc from 5 round to 12: quitting time to midnight. The open part (12 to 5) is the shift.
// The arc is cut radially at exactly 150 and 360 degrees, so the hands point precisely at its two ends.
V.I3 = {
  name: 'Your Time',
  gap: 0.85, // its upper-right quadrant is open, so the optical gap reads wider than the geometric one
  concept: 'A single arc runs from 5 round to 12, quitting time to midnight; the open part of the dial is the shift you put in. The arc is cut square at exactly 5 and 12, right where the two hands point.',
  prims() {
    const R = OUT - RING_W / 2;
    const hw = 1.15;                 // hands a touch heavier than the arc: hands are the hero
    const wm = w * hw, wh = HOUR_W * hw;
    const Lm = R - RING_W / 2 - 2.6; // minute tip: 2.6 mm below the arc's inner edge (corner clears it by >= 2.4 mm)
    const Lh = 0.76 * Lm;
    return [
      arc(R, 150, 360, RING_W, { role: 'face', cap: 'butt' }),
      ray(0, 0, Lm, wm, { role: 'hand', cap: 'butt' }),
      ray(150, 0, Lh, wh, { role: 'hand', cap: 'butt' }),
      disc([0, 0], (1.5 * wm) / 2, { role: 'hand' }),
    ];
  },
};

// I4 - Power Off. A ring broken at 12; the minute hand passes through the break: a clock at 5:00 that is also the standby symbol.
V.I4 = {
  name: 'Power Off',
  concept: 'The ring opens at 12 and the minute hand passes through the break, so the clock at 5:00 is also the power-off symbol: quitting time and OFF in one shape.',
  prims() {
    const R = OUT - RING_W / 2;
    const clear = w; // clearance each side of the minute hand
    const half = asinD((w / 2 + clear + RING_W / 2) / R);
    const Lh = 0.6 * R;
    return [
      arc(R, half, 360 - half, RING_W, { role: 'face' }),
      G.handsOutline({ Lm: OUT - w / 2, wm: w, Lh: Lh - HOUR_W / 2, wh: HOUR_W, heel: 1.2 }),
    ];
  },
};

// ---------------------------------------------------------------------------
// Lockup: OFF SHFT in Archivo Expanded Bold.
// Archivo SemiExpanded Bold at 8.0 mm cap: the smallest bold Archivo setting whose S apertures stay >= 1.2 mm
// (Expanded Bold needs ~9 mm and the lockup would be ~127 mm). The lockup comes out ~106 mm: roughly the 4 in front panel.
// Mark scaled so its face elements = the letter stem (hands are a step heavier).
// Hub sits on the cap-height midline. Gap mark->wordmark = 1 cap height.
// ---------------------------------------------------------------------------
const WM = { font: 'sxbold', cap: 8, track: 0.16 };

function wordmark(x, baseline, fill) {
  return kit.text('OFF SHFT', { font: WM.font, cap: WM.cap, track: WM.track, fill, x, y: baseline });
}

function lockupSvg(file, prims, cols, opt = {}) {
  const cap = WM.cap;
  const stem = kit.stem(WM.font, cap);
  const b = bbox(prims);
  const k = opt.k || stem / w; // mark stroke == letter stem
  const gap = opt.gap === undefined ? cap : opt.gap;
  const pad = 0;
  const markLeft = pad;
  const hubX = markLeft - b.x0 * k;
  // vertical: hub on cap midline; compute extents
  const capMid = cap / 2; // relative to cap top = 0
  const markTop = capMid + b.y0 * k, markBot = capMid + b.y1 * k;
  const top = Math.min(0, markTop), bot = Math.max(cap, markBot);
  const H = bot - top + 2 * pad;
  const oy = pad - top; // shift so everything is >= 0
  const textX = markLeft + b.w * k + gap;
  const t = wordmark(textX, oy + cap, cols.word);
  const body = G.emitFill(prims, { k, dx: hubX, dy: oy + capMid, col: cols }) + '\n' + t.svg;
  const W = textX + t.width + pad;
  kit.writeSvg(file, { w: W, h: H, body });
  return { W, H, k, markW: b.w * k, markH: b.h * k, gap, stem };
}

// ---------------------------------------------------------------------------
// Embroidery check: rasterise in black at a physical size and look for parts thinner than 1.2 mm
// (morphological opening) and gaps narrower than 1.2 mm (closing). Writes a diagnostic PNG.
// ---------------------------------------------------------------------------
async function check(svgFile, outPng, { width }) {
  const d = kit.readSvg(svgFile);
  const blk = `${WORK}/chk-${path.basename(svgFile, '.svg')}-${width.toFixed(0)}.svg`;
  const inner = d.inner.replace(/#[0-9A-Fa-f]{6}/g, '#000000');
  fs.writeFileSync(blk, `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}mm" height="${d.h}mm" viewBox="${d.viewBox}">${inner}</svg>`);
  const pxmm = 20; // px per mm in the PNG (render px=10, device scale 2)
  const s = width / d.w;
  const tw = Math.ceil(width + 6), th = Math.ceil(d.h * s + 6);
  const raw = `${WORK}/chk-raw.png`;
  await kit.render(blk, raw, { bg: '#FFFFFF', width, px: pxmm / 2, tile: `${tw}x${th}`, twill: false });
  const r = (1.2 * pxmm) / 2 - 0.5; // disk radius in px for a 1.2 mm diameter
  const sh = `${WORK}/chk-shape.png`, op = `${WORK}/chk-open.png`, cl = `${WORK}/chk-close.png`, th1 = `${WORK}/chk-thin.png`, gp = `${WORK}/chk-gap.png`;
  execSync(`convert ${raw} -colorspace Gray -threshold 60% -negate ${sh}`);
  execSync(`convert ${sh} -morphology Open Disk:${r} ${op}`);
  execSync(`convert ${sh} -morphology Close Disk:${r} ${cl}`);
  // thin = shape - open, gaps = close - shape; drop corner specks with a small opening
  execSync(`convert ${sh} ${op} -compose Difference -composite -morphology Open Disk:3 ${th1}`);
  execSync(`convert ${cl} ${sh} -compose Difference -composite -morphology Open Disk:3 ${gp}`);
  const count = (f) => +execSync(`convert ${f} -format "%[fx:round(mean*w*h)]" info:`).toString();
  const thin = count(th1), gaps = count(gp);
  execSync(`convert ${sh} -fill '#bbbbbb' -opaque white -fill white -opaque black ( ${th1} -transparent black -fill red -opaque white ) -composite ( ${gp} -transparent black -fill blue -opaque white ) -composite ${outPng}`.replace(/[()]/g, (m) => '\\' + m));
  return { thin, gaps };
}

// Exact-ish minimum gap between separate shapes (40 px/mm raster, see gaps.py).
async function minGap(svgFile, width) {
  const d = kit.readSvg(svgFile);
  const blk = `${WORK}/gap-${path.basename(path.dirname(svgFile))}-${path.basename(svgFile, '.svg')}.svg`;
  fs.writeFileSync(blk, `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}mm" height="${d.h}mm" viewBox="${d.viewBox}">${d.inner.replace(/#[0-9A-Fa-f]{6}/g, '#000000')}</svg>`);
  const hh = (d.h * width) / d.w;
  const png = blk.replace('.svg', `-${width.toFixed(1)}.png`);
  await kit.render(blk, png, { bg: '#FFFFFF', width, px: 20, tile: `${Math.ceil(width + 4)}x${Math.ceil(hh + 4)}`, twill: false });
  return JSON.parse(execSync(`python3 ${ROOT}/gaps.py ${png} 40`).toString()).min_gap_mm;
}
const minStroke = (prims) => Math.min(...prims.map((p) => (p.t === 'disc' ? 2 * p.r : p.t === 'path' ? p.minw : p.w)));

// ---------------------------------------------------------------------------
async function buildVariant(id) {
  const v = V[id];
  const dir = `${ROOT}/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  const prims = v.prims();
  const light = v.light || T.ink;
  const dark = v.dark || T.bone;
  const m = G.markSvg(`${dir}/mark.svg`, prims, light, { fill: true });
  G.markSvg(`${dir}/mark-dark.svg`, prims, dark, { fill: true });
  const lk = lockupSvg(`${dir}/lockup.svg`, prims, { hand: v.lockHand || T.rust, face: v.lockFace || T.rust, word: T.ink }, { gap: (v.gap || 1) * WM.cap });
  await kit.render(`${dir}/mark.svg`, `${dir}/mark.png`, { bg: F.bone });
  await kit.render(`${dir}/mark-dark.svg`, `${dir}/mark-dark.png`, { bg: F.slate });
  await kit.render(`${dir}/lockup.svg`, `${dir}/lockup.png`, { bg: F.bone });
  await kit.sizes(`${dir}/mark.svg`, `${dir}/sizes.png`, { bg: F.bone });
  // checks: mark at 25 mm and 13 mm (longest side), lockup at true size
  const L = Math.max(m.W, m.H);
  const c25 = await check(`${dir}/mark.svg`, `${WORK}/${id}-check25.png`, { width: (25 * m.W) / L });
  const c13 = await check(`${dir}/mark.svg`, `${WORK}/${id}-check13.png`, { width: (13 * m.W) / L });
  const cL = await check(`${dir}/lockup.svg`, `${WORK}/${id}-checkLockup.png`, { width: lk.W });
  // zoomed previews for critique
  await kit.render(`${dir}/mark.svg`, `${WORK}/${id}-zoom.png`, { bg: F.bone, width: (50 * m.W) / L, tile: '64x64', px: 6 });
  await kit.render(`${dir}/lockup.svg`, `${WORK}/${id}-lockzoom.png`, { bg: F.bone, width: 150, tile: '160x40', px: 6 });
  const s25 = 25 / L;
  const gap25 = await minGap(`${dir}/mark.svg`, (25 * m.W) / L);
  const gap13 = await minGap(`${dir}/mark.svg`, (13 * m.W) / L);
  const stroke25 = minStroke(prims) * s25;
  const info = {
    id, mark: [m.W.toFixed(2), m.H.toFixed(2)], lockup: [lk.W.toFixed(1), lk.H.toFixed(1)], lockupScale: lk.k.toFixed(3),
    markInLockup: [lk.markW.toFixed(2), lk.markH.toFixed(2)], c25, c13, cL,
    minStroke25: +stroke25.toFixed(2), minGap25: gap25, minStroke13: +(stroke25 * 0.52).toFixed(2), minGap13: gap13,
    thinnest25: +Math.min(stroke25, gap25).toFixed(2),
  };
  fs.writeFileSync(`${WORK}/${id}-info.json`, JSON.stringify(info, null, 1));
  console.log(JSON.stringify(info));
  return info;
}

async function sheet() {
  const ids = Object.keys(V).filter((id) => fs.existsSync(`${ROOT}/${id}/sizes.png`));
  const tmp = `${WORK}/sheet`;
  fs.mkdirSync(tmp, { recursive: true });
  const files = [];
  for (const id of ids) {
    for (const f of ['mark', 'mark-dark', 'lockup', 'sizes']) {
      const dst = `${tmp}/${id}-${f}.png`;
      fs.copyFileSync(`${ROOT}/${id}/${f}.png`, dst);
      files.push(dst);
    }
  }
  execSync(`montage -label '%t' ${files.join(' ')} -tile 4x -geometry 440x256+8+8 -pointsize 18 -background '#888888' ${ROOT}/sheet.png`);
}

if (require.main === module) (async () => {
  const want = process.argv.slice(2).filter((a) => V[a]);
  const ids = want.length ? want : Object.keys(V);
  for (const id of ids) await buildVariant(id);
  await kit.close();
  await sheet();
  // critique sheets
  const z = ids.map((id) => `${WORK}/${id}-zoom.png`).join(' ');
  execSync(`montage -label '%t' ${z} -tile 4x -geometry 384x384+6+6 -pointsize 16 -background '#888888' ${WORK}/zoom.png`);
  const lz = ids.map((id) => `${WORK}/${id}-lockzoom.png`).join(' ');
  execSync(`montage -label '%t' ${lz} -tile 1x -geometry 960x240+6+6 -pointsize 16 -background '#888888' ${WORK}/lockzoom.png`);
  const ck = ids.flatMap((id) => [`${WORK}/${id}-check25.png`, `${WORK}/${id}-check13.png`]).join(' ');
  execSync(`montage -label '%t' ${ck} -tile 4x -geometry 300x300+6+6 -pointsize 14 -background '#888888' ${WORK}/checks.png`);
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { V, lockupSvg, check, wordmark, WM, w, HOUR_W, RING_W, DOT_D, OUT };
