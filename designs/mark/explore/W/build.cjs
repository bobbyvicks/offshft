// OFF SHFT, direction W: watchmaker hands. Builds W1..W4 marks, dark marks, lockups, previews, checks and the sheet.
// Run: node /home/user/offshft/designs/mark/explore/W/build.cjs [W1 W2 ...]
'use strict';
const fs = require('fs');
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, closedShape, circle, frame, place, svgPaths, sh, f3 } = G;

const ROOT = '/home/user/offshft/designs/mark/explore/W';
const C = [0, 0];
const MIN = kit.FIVE.minute, HR = kit.FIVE.hour;   // 0 and 150 degrees: 5:00
const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);
const roof = (s, T, ang = 90) => poly([0, s], [T - tipLen(s, ang), s], [T, 0]);

// Stadium (rounded slot) along a hand: from t0 to t1, half-width r, in frame F
function stadium(pb, F, t0, t1, r) {
  const a = F([t0 + r, -r]), b = F([t1 - r, -r]), c = F([t1 - r, r]), d = F([t0 + r, r]);
  pb.M(a).L(b).A(F([t1 - r, 0]), r, c, true).L(d).A(F([t0 + r, 0]), r, a, true).Z();
  return pb;
}

// ---------------------------------------------------------------- variants
// Marks are drawn at working size: about 25 mm tall, the front-of-hat size the 1.2 mm rule refers to.
const V = {};

// W1 PIN. Parallel batons with square (90 deg) points on a collet with a punched pin hole.
// Grid u = 0.6 mm (half the 1.2 mm minimum): minute 4u wide, hour 6u, collet 9u across, pin 3u,
// minute reach 27u, hour reach 17u (about 5:8).
V.W1 = {
  name: 'Pin',
  colours: { light: kit.T.rust, dark: kit.T.bone, word: kit.T.ink },
  word: { font: 'xbold', track: 0.16 },
  mark({ fill, small = false }) {
    const u = 0.6, k = small ? 1.12 : 1;
    const wm = 4 * u * k, wh = 6 * u * k, R = 4.5 * u, pin = 1.5 * u;
    const pb = handsOutline(new PathB(), C, R, [{ deg: MIN, profile: roof(wm / 2, 27 * u) }, { deg: HR, profile: roof(wh / 2, 17 * u) }]);
    if (!small) circle(pb, C, pin);
    return { parts: [{ d: pb.str(), pts: pb.pts, fill }], R };
  },
};

// W2 LEAF. Feuille hands drawn as pure geometry: each leaf is a vesica (two circular arcs) whose rear point
// hides inside a pinned collet. A symmetric lens on the 5 o'clock diagonal reads as drooping, so the hour
// leaf is optically corrected: its upper flank carries a little more curve than its lower flank.
function vesica(a, T, h) {
  const c = (T - a) / 2, rho = (c * c + h * h) / (2 * h), mid = (a + T) / 2, centre = [mid, h - rho];
  const sAt = (t) => centre[1] + Math.sqrt(rho * rho - (t - mid) ** 2);
  const t0 = a + 0.3;
  return { start: [t0, sAt(t0)], segs: [['L', [t0 + 0.01, sAt(t0 + 0.01)]], ['A', centre, rho, [T, 0], false]] };
}
V.W2 = {
  name: 'Leaf',
  colours: { light: kit.T.ink, dark: kit.T.bone, word: kit.T.ink },
  word: { font: 'xsemi', track: 0.22 },
  mark({ fill, small = false }) {
    const R = 2.25, pin = 0.75, k = small ? 1.2 : 1, opt = 0.18;
    const hm = 1.45 * k, hh = 1.9 * k;
    const pb = handsOutline(new PathB(), C, R, [
      { deg: MIN, profile: vesica(-1.0, 16.3, hm) },
      { deg: HR, profile: vesica(-1.0, 10.3, hh * (1 - opt)), left: vesica(-1.0, 10.3, hh * (1 + opt)) },
    ]);
    if (!small) circle(pb, C, pin);
    return { parts: [{ d: pb.str(), pts: pb.pts, fill }], R };
  },
};

// W3 LUME. Outlined batons with rounded lume channels, a ring hub, one wall weight throughout.
// The two-colour version fills the channels with Sun thread, the after-dark glow.
V.W3 = {
  name: 'Lume',
  colours: { light: kit.T.ink, dark: kit.T.bone, lume: kit.T.sun, word: kit.T.ink },
  word: { font: 'xbold', track: 0.14 },
  mark({ fill, lume = null, small = false }) {
    const wall = 1.3, slotM = 1.4, slotH = 2.0, Lm = 16.2, Lh = 10.2;
    // small version (13 mm): channels and ring hole cannot hold 1.2 mm, so it becomes slimmer solid batons
    const mS = small ? 1.45 : wall + slotM / 2, hS = small ? 2.05 : wall + slotH / 2, Rhole = 1.5, R = small ? 2.85 : Rhole + wall;
    const pb = handsOutline(new PathB(), C, R, [{ deg: MIN, profile: roof(mS, Lm) }, { deg: HR, profile: roof(hS, Lh) }]);
    const glow = new PathB();
    if (!small) {
      circle(pb, C, Rhole);
      // channel: from one wall outside the ring to one wall short of where the point starts
      for (const [deg, s, L, slot] of [[MIN, mS, Lm, slotM], [HR, hS, Lh, slotH]]) {
        const t0 = R + wall * 0.0 + 0.0, t1 = L - tipLen(s, 90) - wall * 0.15;
        stadium(pb, frame(C, deg), t0, t1, slot / 2);
        if (lume) stadium(glow, frame(C, deg), t0, t1, slot / 2);
      }
    }
    const parts = [{ d: pb.str(), pts: pb.pts, fill }];
    if (lume && !small) parts.push({ d: glow.str(), pts: glow.pts, fill: lume });
    return { parts, R };
  },
};

// W4 DAUPHINE. Faceted blades on a solid collet. Light comes from the left, so the minute hand's left facet
// and the hour hand's lower-left facet are lit. Facets stay 1.2 mm or wider until the point. 40 degree points.
// One-colour version is the plain silhouette.
V.W4 = {
  name: 'Dauphine',
  colours: { light: kit.T.rust, lit: kit.T.rust, shade: kit.T.ink, dark: kit.T.bone, darkLit: kit.T.bone, darkShade: kit.T.sun, word: kit.T.ink },
  word: { font: 'xbold', track: 0.18 },
  mark({ fill, lit = null, shade = null, small = false }) {
    // collet 6.0 across; blade roots narrower than the collet so it stays a distinct disc; 40 degree points
    const R = 3.0, half = 20, k = small ? 1.08 : 1;
    const edge = (s0, s1, T) => poly([0, s0 * k], [T - (s1 * k) / Math.tan(half * G.D2R), s1 * k], [T, 0]);
    const hands = [{ deg: MIN, profile: edge(1.55, 1.3, 16.4), litSign: -1 }, { deg: HR, profile: edge(2.0, 1.5, 10.4), litSign: 1 }];
    const sil = handsOutline(new PathB(), C, R, hands);
    if (!lit) return { parts: [{ d: sil.str(), pts: sil.pts, fill }], R };
    // stacked two-tone: full silhouette in the shade thread, lit facets on top from the collet edge to the point
    const parts = [{ d: sil.str(), pts: sil.pts, fill: shade }];
    for (const h of hands) {
      const F = frame(C, h.deg), cut = G.cutProfile(h.profile, R), sg = h.litSign;
      const pb = new PathB();
      pb.M(F([R, 0]));
      pb.A(C, R, F([cut.start[0], sg * cut.start[1]]), sg > 0);
      G.emitProfile(pb, F, cut, { mirror: sg < 0, skipStart: true });
      pb.Z();
      parts.push({ d: pb.str(), pts: pb.pts, fill: lit });
    }
    return { parts, R };
  },
};

// ---------------------------------------------------------------- outputs
function writeMark(file, parts, margin = 0.6) {
  const pl = place(parts, { margin });
  kit.writeSvg(file, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
  return pl;
}

// Horizontal lockup. The hub centre sits on the baseline, and the mark is scaled so its box is centred
// on the cap height (both rules hold at once). Gap from the collet's right edge to the O = the word space
// between OFF and SHFT, times gapK.
function lockup(file, v, { cap = 7.0, markFill, wordFill, lume = null, lit = null, shade = null, gapK = 0.8, small = false } = {}) {
  const m = v.mark({ fill: markFill, lume, lit, shade, small });
  const bb = G.bbox(m.parts.flatMap((p) => p.pts));
  const up = -bb.y0, down = bb.y1;
  const k = cap / (up - down);
  const t0 = kit.text('OFF SHFT', { font: v.word.font, cap, track: v.word.track, x: 0, y: 0 });
  const L = t0.letters;
  const wordSpace = L[4].x1 - L[2].x2;
  const gap = wordSpace * gapK;
  const pad = 1.5;
  const top = up * k, bottom = -down * k;               // relative to the baseline (y up)
  const H = top - bottom + 2 * pad;
  const baseY = pad + top;
  const hubX = pad - bb.x0 * k;
  const textX = hubX + m.R * k + gap - L[0].x1;
  const tt = kit.text('OFF SHFT', { font: v.word.font, cap, track: v.word.track, fill: wordFill, x: textX, y: baseY });
  const W = Math.max(textX + t0.width, hubX + bb.x1 * k) + pad;
  const body = m.parts.map((p) => `<path fill="${p.fill}" fill-rule="evenodd" transform="translate(${f3(hubX)} ${f3(baseY)}) scale(${f3(k)})" d="${p.d}"/>`).join('\n') + '\n' + tt.svg;
  kit.writeSvg(file, { w: W, h: H, body });
  return { W, H, k, markH: bb.h * k, gap, wordSpace, stem: kit.stem(v.word.font, cap) };
}

// Check every thread colour on its own as well as the combined silhouette.
async function checkColours(id, parts, tag) {
  const fills = [...new Set(parts.map((p) => p.fill))];
  const out = {};
  const pl = place(parts, { margin: 0.6 });
  for (const f of fills) {
    const file = `${ROOT}/check/${id}-${tag}-${f.slice(1)}.svg`;
    kit.writeSvg(file, { w: pl.w, h: pl.h, body: svgPaths(parts.filter((p) => p.fill === f).map((p) => ({ ...p, fill: '#000000' })), pl.dx, pl.dy) });
    // keep the art at the same scale as the full mark: pad the file to the full mark size via viewBox (place uses full bbox)
    out[f] = await G.check(file, file.replace(/\.svg$/, '.png'), { size: 25 * Math.max(pl.w, pl.h) / Math.max(pl.w, pl.h) });
  }
  return out;
}

// Check an SVG file at its true size, one thread colour at a time (other colours removed).
async function checkFileColours(file, tag) {
  const src = fs.readFileSync(file, 'utf8');
  const d = kit.readSvg(file);
  const fills = [...new Set([...src.matchAll(/<path fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]))];
  const out = {};
  for (const f of fills) {
    const only = src.replace(/<path fill="(#[0-9A-Fa-f]{6})"[^>]*\/>/g, (m, c) => (c === f ? m.replace(`fill="${f}"`, 'fill="#000000"') : ''));
    const tmp = `${ROOT}/check/${tag}-${f.slice(1)}.svg`;
    fs.writeFileSync(tmp, only);
    out[f] = await G.check(tmp, tmp.replace(/\.svg$/, '.png'), { size: Math.max(d.w, d.h) });
  }
  return out;
}

async function buildVariant(id) {
  const v = V[id], c = v.colours;
  const dir = `${ROOT}/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  const two = { lume: c.lume || null, lit: c.darkLit || null, shade: c.darkShade || null };
  writeMark(`${dir}/mark.svg`, v.mark({ fill: c.light }).parts);
  const darkParts = v.mark({ fill: c.dark, ...two }).parts;
  writeMark(`${dir}/mark-dark.svg`, darkParts);
  writeMark(`${dir}/mark-small.svg`, v.mark({ fill: c.light, small: true }).parts);
  const lk = lockup(`${dir}/lockup.svg`, v, { markFill: c.light, wordFill: c.word, lume: c.lume || null, lit: c.lit || null, shade: c.shade || null });
  lockup(`${dir}/lockup-dark.svg`, v, { markFill: c.dark, wordFill: kit.T.bone, ...two });
  if (darkParts.length > 1) console.log(id, 'per-colour check (dark version, 25 mm):', JSON.stringify(await checkColours(id, darkParts, 'dark')));
  console.log(id, 'lockup per-colour check at true size:', JSON.stringify(await checkFileColours(`${dir}/lockup.svg`, `${id}-lockup`)));
  await kit.render(`${dir}/mark.svg`, `${dir}/mark.png`, { bg: kit.F.bone });
  await kit.render(`${dir}/mark-dark.svg`, `${dir}/mark-dark.png`, { bg: kit.F.slate });
  await kit.render(`${dir}/lockup.svg`, `${dir}/lockup.png`, { bg: kit.F.bone });
  await kit.render(`${dir}/lockup-dark.svg`, `${dir}/lockup-dark.png`, { bg: kit.F.spruce });
  await kit.sizes(`${dir}/mark.svg`, `${dir}/sizes.png`, { bg: kit.F.bone });
  await kit.sizes(`${dir}/mark-small.svg`, `${dir}/sizes-small.png`, { bg: kit.F.bone });
  const d = kit.readSvg(`${dir}/mark.svg`);
  await kit.render(`${dir}/mark.svg`, `${ROOT}/check/${id}-big.png`, { bg: kit.F.bone, width: d.w * (60 / d.h), tile: '34x66', px: 6 });
  const c25 = await G.check(`${dir}/mark.svg`, `${ROOT}/check/${id}-25.png`, { size: 25 });
  const c13 = await G.check(`${dir}/mark-small.svg`, `${ROOT}/check/${id}-small-13.png`, { size: 13 });
  const pl = place(v.mark({ fill: '#000' }).parts, { margin: 0 });
  console.log(id, v.name, `mark ${f3(pl.w)}x${f3(pl.h)}mm`, 'check25', JSON.stringify(c25), 'small@13', JSON.stringify(c13),
    `lockup ${f3(lk.W)}x${f3(lk.H)} k=${f3(lk.k)} markH=${f3(lk.markH)} gap=${f3(lk.gap)} stem=${f3(lk.stem)}`);
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

module.exports = { V, lockup, writeMark };

if (require.main === module) (async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(V);
  for (const id of ids) await buildVariant(id);
  await kit.close();
  await sheet(Object.keys(V).filter((id) => fs.existsSync(`${ROOT}/${id}/sizes.png`)));
  sh('montage', [...['W1', 'W2', 'W3', 'W4'].map((id) => `${ROOT}/check/${id}-big.png`), '-tile', '4x', '-geometry', '+4+4', '-background', '#888', `${ROOT}/check/big.png`]);
  sh('montage', [...['W1', 'W2', 'W3', 'W4'].map((id) => `${ROOT}/check/${id}-25.png`), '-tile', '4x', '-geometry', '+4+4', '-background', '#888', `${ROOT}/check/chk.png`]);
  console.log('sheet written');
})().catch((e) => { console.error(e); process.exit(1); });
