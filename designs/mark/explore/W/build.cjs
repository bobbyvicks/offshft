// OFF SHFT, direction W: watchmaker hands. Builds W1..W4 marks, dark marks, lockups, previews, checks and the sheet.
// Run: node /home/user/offshft/designs/mark/explore/W/build.cjs [W1 W2 ...]
'use strict';
const fs = require('fs');
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, closedShape, circle, frame, place, svgPaths, insetEdge, clipFrom, sh, f3 } = G;

const ROOT = '/home/user/offshft/designs/mark/explore/W';
const C = [0, 0];
const MIN = kit.FIVE.minute, HR = kit.FIVE.hour;
const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);

// ---------------------------------------------------------------- variants
// Every mark is drawn with its longest side close to 25 mm, the front-of-hat size the 1.2 mm rule refers to.
const V = {};

// W1 PIN: tapered batons with 60 degree points, on a collet with a punched pin hole.
// System: minute length 16, hour length 10 (5:8). Minute width 2.2, hour 1.5x, hub diameter 2x minute width,
// pin hole one third of the hub. Both tips 60 degrees.
V.W1 = {
  name: 'Pin',
  mark({ fill, small = false }) {
    const wm = small ? 2.5 : 2.2, wh = wm * 1.5, R = wm, hole = small ? 0 : (2 * R) / 3 / 2, ang = 60;
    const Lm = 16, Lh = 10, taper = 0.82;
    const m = poly([-1, wm / 2], [Lm - tipLen((wm / 2) * taper, ang), (wm / 2) * taper], [Lm, 0]);
    const h = poly([-1, wh / 2], [Lh - tipLen((wh / 2) * taper, ang), (wh / 2) * taper], [Lh, 0]);
    const pb = handsOutline(new PathB(), C, R, [{ deg: MIN, profile: m }, { deg: HR, profile: h }]);
    if (hole) circle(pb, C, hole);
    return [{ d: pb.str(), pts: pb.pts, fill }];
  },
  word: { font: 'xbold', track: 0.16 },
};

// W2 LEAF: feuille hands, a classic dress-watch shape that is also a leaf. Solid round collet.
V.W2 = {
  name: 'Leaf',
  mark({ fill, small = false }) {
    const R = small ? 1.95 : 1.8;
    const leaf = (s0, smax, tm, T, tipA) => {
      const k = small ? 1.12 : 1;
      s0 *= k; smax *= k;
      const tt = Math.tan((tipA / 2) * G.D2R);
      return {
        start: [-0.6, s0],
        segs: [
          ['C', [tm * 0.35, s0], [tm * 0.62, smax], [tm, smax]],
          ['C', [tm + (T - tm) * 0.42, smax], [T - (smax * 0.45) / tt, smax * 0.45], [T, 0]],
        ],
      };
    };
    const pb = handsOutline(new PathB(), C, R, [
      { deg: MIN, profile: leaf(0.68, 1.42, 6.2, 16.4, 44) },
      { deg: HR, profile: leaf(0.86, 2.02, 4.3, 10.2, 62) },
    ]);
    return [{ d: pb.str(), pts: pb.pts, fill }];
  },
  word: { font: 'xsemi', track: 0.22 },
};

// W3 LUME: skeleton batons with open lume channels, one wall weight throughout (ring, hands).
// Two-colour version fills the channels with a glow thread.
V.W3 = {
  name: 'Lume',
  mark({ fill, lume = null, small = false }) {
    const wall = 1.35, slotM = 1.3, slotH = 1.9, ang = 70;
    const mS = wall + slotM / 2, hS = wall + slotH / 2;   // half widths
    const Lm = 16.2, Lh = 10.2;
    const Rin = 1.15, R = Rin + wall;
    const mE = [[0, mS], [Lm - tipLen(mS, ang), mS], [Lm, 0]];
    const hE = [[0, hS], [Lh - tipLen(hS, ang), hS], [Lh, 0]];
    const pb = handsOutline(new PathB(), C, R, [{ deg: MIN, profile: poly(...mE) }, { deg: HR, profile: poly(...hE) }]);
    const parts = [];
    const slots = new PathB();
    if (!small) {
      circle(pb, C, Rin);
      for (const [E, deg] of [[mE, MIN], [hE, HR]]) {
        // channel starts one wall beyond the pin hole
        const inner = poly(...clipFrom(insetEdge(E, wall), Rin + wall));
        closedShape(pb, frame(C, deg), inner);
        if (lume) closedShape(slots, frame(C, deg), inner);
      }
    }
    parts.push({ d: pb.str(), pts: pb.pts, fill });
    if (lume && !small) parts.push({ d: slots.str(), pts: slots.pts, fill: lume });
    return parts;
  },
  word: { font: 'xbold', track: 0.14 },
};

// W4 DAUPHINE: long straight-tapered blades on a solid disc, widest at the hub.
V.W4 = {
  name: 'Dauphine',
  mark({ fill, small = false }) {
    const R = small ? 2.5 : 2.35;
    const k = small ? 1.1 : 1;
    const m = poly([-0.5, 1.75 * k], [14.6, 0.68 * k], [16.4, 0]);
    const h = poly([-0.5, 2.45 * k], [8.4, 1.0 * k], [10.2, 0]);
    const pb = handsOutline(new PathB(), C, R, [{ deg: MIN, profile: m }, { deg: HR, profile: h }]);
    return [{ d: pb.str(), pts: pb.pts, fill }];
  },
  word: { font: 'xbold', track: 0.18 },
};

// ---------------------------------------------------------------- outputs
function writeMark(file, parts, margin = 0.6) {
  const pl = place(parts, { margin });
  kit.writeSvg(file, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
  return pl;
}

// Horizontal lockup. The mark is scaled so its height is `ratio` x cap height and its bounding box is
// centred on the cap band; the gap to the wordmark is `gapUnit` (in mark units at 25 mm, scaled).
function lockup(file, v, { cap = 6.5, ratio = 3.0, markFill = kit.T.rust, wordFill = kit.T.ink, gap = null, lume = null } = {}) {
  const parts = v.mark({ fill: markFill, lume });
  const bb = G.bbox(parts.flatMap((p) => p.pts));
  const k = (cap * ratio) / bb.h;
  const markW = bb.w * k;
  const gapMM = gap === null ? kit.stem(v.word.font, cap) * 2.5 : gap;
  const t = kit.text('OFF SHFT', { font: v.word.font, cap, track: v.word.track, fill: wordFill, x: 0, y: 0 });
  const O = t.letters[0];
  const pad = 1;
  const markH = bb.h * k;
  const top = Math.max(markH, cap) ;
  // vertical: centre mark box on the cap band
  const yBase = pad + (markH + cap) / 2;            // baseline y
  const markY = yBase - cap / 2 - markH / 2;        // mark top
  const textX = pad + markW + gapMM - O.x1;         // so the O's left edge sits gapMM right of the mark
  const W = textX + t.width + pad, H = pad * 2 + markH;
  const tt = kit.text('OFF SHFT', { font: v.word.font, cap, track: v.word.track, fill: wordFill, x: textX, y: yBase });
  const body = parts.map((p) => `<path fill="${p.fill}" fill-rule="evenodd" transform="translate(${f3(pad - bb.x0 * k)} ${f3(markY - bb.y0 * k)}) scale(${f3(k)})" d="${p.d}"/>`).join('\n') + '\n' + tt.svg;
  kit.writeSvg(file, { w: W, h: H, body });
  return { W, H, k, markH, gapMM };
}

async function buildVariant(id) {
  const v = V[id];
  const dir = `${ROOT}/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  const light = v.mark({ fill: kit.T.ink });
  const lightRust = v.mark({ fill: kit.T.rust });
  writeMark(`${dir}/mark.svg`, id === 'W1' || id === 'W4' ? lightRust : light);
  writeMark(`${dir}/mark-dark.svg`, v.mark({ fill: kit.T.bone, lume: id === 'W3' ? kit.T.sun : null }));
  writeMark(`${dir}/mark-small.svg`, v.mark({ fill: kit.T.ink, small: true }));
  const lk = lockup(`${dir}/lockup.svg`, v, { lume: id === 'W3' ? kit.T.sun : null, markFill: id === 'W3' ? kit.T.ink : kit.T.rust });
  await kit.render(`${dir}/mark.svg`, `${dir}/mark.png`, { bg: kit.F.bone });
  await kit.render(`${dir}/mark-dark.svg`, `${dir}/mark-dark.png`, { bg: kit.F.slate });
  await kit.render(`${dir}/lockup.svg`, `${dir}/lockup.png`, { bg: kit.F.bone });
  await kit.sizes(`${dir}/mark.svg`, `${dir}/sizes.png`, { bg: kit.F.bone });
  await kit.sizes(`${dir}/mark-small.svg`, `${dir}/sizes-small.png`, { bg: kit.F.bone });
  const c25 = await G.check(`${dir}/mark.svg`, `${ROOT}/check/${id}-25.png`, { size: 25 });
  const c13 = await G.check(`${dir}/mark-small.svg`, `${ROOT}/check/${id}-small-13.png`, { size: 13 });
  const pl = place(light, { margin: 0 });
  console.log(id, v.name, `mark ${f3(pl.w)}x${f3(pl.h)}mm`, 'check25', JSON.stringify(c25), 'small@13', JSON.stringify(c13), `lockup ${f3(lk.W)}x${f3(lk.H)} k=${f3(lk.k)} markH=${f3(lk.markH)} gap=${f3(lk.gapMM)}`);
}

async function sheet(ids) {
  const tmp = `${ROOT}/check/sheet-tmp`;
  fs.mkdirSync(tmp, { recursive: true });
  const files = [];
  for (const id of ids) for (const n of ['mark', 'mark-dark', 'lockup', 'sizes']) {
    const f = `${tmp}/${id}-${n}.png`;
    fs.copyFileSync(`${ROOT}/${id}/${n}.png`, f);
    files.push(f);
  }
  sh('montage', ['-label', '%t', ...files, '-tile', '4x', '-geometry', '440x256+8+8', '-pointsize', '18', '-background', '#888888', `${ROOT}/sheet.png`]);
  fs.rmSync(tmp, { recursive: true, force: true });
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(V);
  for (const id of ids) await buildVariant(id);
  await kit.close();
  await sheet(Object.keys(V).filter((id) => fs.existsSync(`${ROOT}/${id}/sizes.png`)));
  console.log('sheet written');
})().catch((e) => { console.error(e); process.exit(1); });
