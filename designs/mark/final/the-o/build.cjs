// OFF SHFT logo: "The O". The O in OFF is a clock face; two hands at 5:00 (quitting time) stand out of it.
// Chosen by the owner; refined from two blind reading tests and a brand + embroidery review (see notes.md).
//
// Construction (everything derives from the cap height and the typeface's own strokes):
// - Wordmark: Unbounded Bold (owner's pick), letter-spacing 0.12 em; F-F kerned -0.043 cap, F-T -0.05 cap
//   (the F's open side leaves holes in those pairs). Set LOGO_FONT=archivo to rebuild the Archivo version.
// - The O is a ring 1.15 x the height of the type's own O (owner's pick), centred on the type's O.
//   Its counter is a slightly upright ellipse so the ring matches the letters' contrast:
//   side walls 1.03 x the vertical stem, top and bottom walls ~1.15 x the horizontal arm (0.85-1.0 stem).
// - Hands are drawn with the letters' pen: minute hand 1.0 stem wide, hour hand 1.02 stems, 90 degree points.
//   They stand outside the ring across an even channel (two colours: max(1.0 mm, 0.143 cap); one colour:
//   1.2 mm, 1.5 mm from cap 7), with bases cut concave so the channel is the same width all round.
//   Visible minute hand = 0.936 cap; hour hand reaches 0.75 cap past the ring, at exactly 150 degrees.
// - Pivot: a solid dot in the hand colour, 0.286 cap across, with at least 1.3 mm (two colours) or
//   1.5 mm (one colour) of fabric to the counter. Left out below cap 6 (6.5 in one colour).
// - Small master for the side of a hat (about 15.6 mm tall): its own drawing, not a scale-down;
//   7.0 mm ring, 1.4 mm wall, 1.5 mm pivot dot (1.35 mm fabric), 1.2 mm channel, pointed hands 1.5 and 1.6 mm wide.
//
// Run: node /home/user/offshft/designs/mark/final/the-o/build.cjs

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const OUT = __dirname;
const T = kit.T, F = kit.F;
const O_SCALE = 1.15;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

// ---------------------------------------------------------------- font measurement
function segmentsOf(glyph, size) {
  const segs = [];
  let x0 = 0, y0 = 0, sx = 0, sy = 0;
  const STEPS = 24;
  for (const c of glyph.getPath(0, 0, size).commands) {
    if (c.type === 'M') { x0 = sx = c.x; y0 = sy = c.y; }
    else if (c.type === 'L') { segs.push([x0, y0, c.x, c.y]); x0 = c.x; y0 = c.y; }
    else if (c.type === 'Q') {
      for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; const x = u * u * x0 + 2 * u * t * c.x1 + t * t * c.x, y = u * u * y0 + 2 * u * t * c.y1 + t * t * c.y; segs.push([i === 1 ? x0 : segs[segs.length - 1][2], i === 1 ? y0 : segs[segs.length - 1][3], x, y]); }
      x0 = c.x; y0 = c.y;
    } else if (c.type === 'C') {
      for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; const x = u * u * u * x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x, y = u * u * u * y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y; segs.push([i === 1 ? x0 : segs[segs.length - 1][2], i === 1 ? y0 : segs[segs.length - 1][3], x, y]); }
      x0 = c.x; y0 = c.y;
    } else if (c.type === 'Z') { if (x0 !== sx || y0 !== sy) segs.push([x0, y0, sx, sy]); x0 = sx; y0 = sy; }
  }
  return segs;
}
function crossings(segs, { x, y }) {
  const out = [];
  for (const [ax, ay, bx, by] of segs) {
    if (y !== undefined && (ay - y) * (by - y) < 0) out.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
    if (x !== undefined && (ax - x) * (bx - x) < 0) out.push(ay + ((x - ax) / (bx - ax)) * (by - ay));
  }
  return out.sort((a, b) => a - b);
}
// Vertical stem (from H, below the crossbar) and horizontal arm (top arm of F), in mm at this cap height.
function strokes(fontKey, cap) {
  const f = kit.font(fontKey);
  const size = (cap * f.unitsPerEm) / f.tables.os2.sCapHeight;
  const H = crossings(segmentsOf(f.charToGlyph('H'), size), { y: -cap * 0.22 });
  const Fg = f.charToGlyph('F'), bb = Fg.getBoundingBox(), k = size / f.unitsPerEm;
  const Fy = crossings(segmentsOf(Fg, size), { x: (bb.x1 + (bb.x2 - bb.x1) * 0.72) * k });
  const stem = H.length >= 2 ? H[1] - H[0] : kit.stem(fontKey, cap);
  const arm = Fy.length >= 2 ? Fy[1] - Fy[0] : stem * 0.85;
  return { stem, arm };
}

// ---------------------------------------------------------------- geometry
const FONTS = {
  archivo: { key: 'xbold', name: 'Archivo Expanded Bold', track: 0.14, kern: { FF: -0.0286, FT: -0.0571 } },
  anybody: { key: 'anybody', name: 'Anybody Extra Wide ExtraBold', track: 0.06 },
  unbounded: { key: 'unbounded', name: 'Unbounded Bold', track: 0.12, kern: { FF: -0.043, FT: -0.05 } },
  lexendexa: { key: 'lexendexa', name: 'Lexend Exa Bold', track: 0.02 },
  syne: { key: 'syne', name: 'Syne ExtraBold', track: 0.04 },
  saira: { key: 'saira', name: 'Saira Expanded Bold', track: 0.12 },
  krona: { key: 'krona', name: 'Krona One', track: 0.1 },
  michroma: { key: 'michroma', name: 'Michroma', track: 0.12 },
  rubikmono: { key: 'rubikmono', name: 'Rubik Mono One', track: 0.0 },
  encodex: { key: 'encodex', name: 'Encode Sans Expanded Bold', track: 0.14 },
  dela: { key: 'dela', name: 'Dela Gothic One', track: 0.06 },
};

function geometry(font, cap, { oneColour = false, channel } = {}) {
  const ref = kit.text('OFF SHFT', { font: font.key, cap, track: font.track, x: 0, y: 0 });
  const O = ref.letters[0];
  const { stem, arm } = strokes(font.key, cap);
  const R = ((O.bottom - O.top) / 2) * O_SCALE;
  const wallSide = stem * 1.03;
  const wallTop = Math.min(stem, Math.max(stem * 0.85, arm * 1.15));
  const g = channel !== undefined ? channel : oneColour ? (cap >= 7 ? 1.5 : 1.2) : Math.max(1.0, 0.143 * cap);
  const rx = R - wallSide, ry = R - wallTop;
  const fabricMin = oneColour ? 1.5 : 1.3;
  let dot = 0.286 * cap;
  if (rx - dot / 2 < fabricMin) dot = 2 * (rx - fabricMin);
  if (dot < 1.5 || cap < (oneColour ? 6.5 : 6)) dot = 0;
  return {
    font, cap, ref, O, stem, arm, R, rx, ry, g, dot,
    sM: stem * 0.5, sH: stem * 0.51,
    Lm: R + g + 0.936 * cap, Lh: R + 0.75 * cap,
    points: true,
  };
}

// A hand from the channel edge (concave base on radius rho) to its tip. square = flat tip instead of a point.
function hand(cx, cy, deg, rho, L, s, square = false) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const t0 = Math.sqrt(rho * rho - s * s);
  const pts = square ? [P(t0, -s), P(L, -s), P(L, s), P(t0, s)] : [P(t0, -s), P(L - s, -s), P(L, 0), P(L - s, s), P(t0, s)];
  const d = `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} A${n(rho)} ${n(rho)} 0 0 0 ${n(pts[0][0])} ${n(pts[0][1])} Z`;
  return { d, pts };
}
const ellipse = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)} a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;

// Clock O centred at (cx, cy). Returns svg + bounding box.
function clockO(G, cx, cy, { ring, hands }) {
  const hm = hand(cx, cy, 0, G.R + G.g, G.Lm, G.sM, !G.points);
  const hh = hand(cx, cy, 150, G.R + G.g, G.Lh, G.sH, !G.points);
  let svg = `<path fill="${ring}" fill-rule="evenodd" d="${ellipse(cx, cy, G.R, G.R)} ${ellipse(cx, cy, G.rx, G.ry)}"/>` +
    `<path fill="${hands}" d="${hm.d} ${hh.d}"/>`;
  if (G.dot) svg += `<path fill="${hands}" d="${ellipse(cx, cy, G.dot / 2, G.dot / 2)}"/>`;
  const pts = [...hm.pts, ...hh.pts, [cx - G.R, cy - G.R], [cx + G.R, cy + G.R]];
  return { svg, box: box(pts) };
}
const box = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });

// Wordmark after the O, letter by letter so extra kerning can be applied.
function restOfWord(G, x, baseY, fill) {
  const { font, cap } = G;
  const t = kit.text('FF SHFT', { font: font.key, cap, track: font.track, x: 0, y: 0 });
  const kern = font.kern || {};
  let shift = 0, svg = '';
  const str = 'FF SHFT';
  const pts = [];
  for (let i = 0; i < str.length; i++) {
    const L = t.letters[i];
    if (i > 0) {
      const pair = str[i - 1] + str[i];
      if (kern[pair]) shift += kern[pair] * cap;
    }
    if (str[i] === ' ') continue;
    const g = kit.text(str[i], { font: font.key, cap, track: 0, fill, x: x + L.x + shift, y: baseY });
    svg += g.svg;
    pts.push([x + L.x1 + shift, baseY + L.top], [x + L.x2 + shift, baseY + L.bottom]);
  }
  return { svg, box: box(pts) };
}

function lockup(font, cap, colours, opts = {}) {
  const G = geometry(font, cap, opts);
  const cx = 0, cy = 0;
  const baseY = cy - (G.O.top + G.O.bottom) / 2;                // ring centred on the type's O
  const L = G.ref.letters;
  const gapAfterO = L[1].x1 - G.O.x2;                            // keep the font's own O-to-F spacing
  const restX = cx + G.R + gapAfterO - (L[1].x1 - L[1].x);
  const c = clockO(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  const w = restOfWord(G, restX, baseY, colours.letters);
  const b = union(c.box, w.box);
  return { w: b.x1 - b.x0, h: b.y1 - b.y0, body: `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})">${c.svg}${w.svg}</g>`, G, baseline: baseY - b.y0 };
}

// Front / patch symbol: the clock O alone, scaled so its total height is `height` mm.
function symbol(font, height, colours, opts = {}) {
  let lo = 2, hi = 40;
  const hOf = (cap) => { const G = geometry(font, cap, { ...opts, channel: opts.channel }); const c = clockO(G, 0, 0, colours); return c.box.y1 - c.box.y0; };
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (hOf(mid) < height) lo = mid; else hi = mid; }
  const G = geometry(font, lo, opts);
  const c = clockO(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G };
}

// Side-of-hat master, drawn for its size: no pivot, square-ended hands, wider channel.
function smallMaster(colours) {
  // 7.0 mm ring so a 1.5 mm pivot dot fits with 1.5 mm of fabric around it: the dot is what makes it read as a clock
  // hands 1.5 / 1.6 mm wide: the narrowest a pointed tip still stitches, and the points are what say "clock hand"
  const G = { R: 3.5, rx: 3.5 - 1.4, ry: 3.5 - 1.4, g: 1.2, dot: 1.5, sM: 0.75, sH: 0.8, points: true };
  G.Lm = G.R + G.g + 4.2;
  G.Lh = G.R + G.g + 3.0;
  const c = clockO(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G };
}

const LIGHT = { letters: T.ink, hands: T.rust, bg: F.bone, name: 'light' };
const DARK = { letters: T.bone, hands: T.sun, bg: F.slate, name: 'dark' };
const ONE_INK = { letters: T.ink, hands: T.ink, bg: F.oat, name: 'one-colour-ink', one: true };
const ONE_BONE = { letters: T.bone, hands: T.bone, bg: F.spruce, name: 'one-colour-bone', one: true };

module.exports = { FONTS, geometry, lockup, symbol, smallMaster, strokes, LIGHT, DARK, ONE_INK, ONE_BONE };

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  const write = (name, d) => { const f = path.join(OUT, name); kit.writeSvg(f, d); return f; };
  const sheet = [];
  const A = FONTS[process.env.LOGO_FONT || 'unbounded'];
  for (const c of [LIGHT, DARK, ONE_INK, ONE_BONE]) {
    const lk = write(`logo-${c.name}.svg`, lockup(A, 7, c, { oneColour: !!c.one }));
    await kit.render(lk, lk.replace('.svg', '.png'), { bg: c.bg, tile: '100x40', px: 6 });
    const sy = write(`symbol-${c.name}.svg`, symbol(A, 25, c, { oneColour: !!c.one, channel: c.one ? 1.5 : 1.2 }));
    await kit.render(sy, sy.replace('.svg', '.png'), { bg: c.bg, tile: '60x40', px: 6 });
    sheet.push(lk.replace('.svg', '.png'), sy.replace('.svg', '.png'));
  }
  for (const c of [LIGHT, DARK]) {
    const sm = write(`side-${c.name}.svg`, smallMaster(c));
    await kit.render(sm, sm.replace('.svg', '.png'), { bg: c.bg, tile: '40x30', px: 10 });
    sheet.push(sm.replace('.svg', '.png'));
  }
  // true-size lockup tests (each tile is wider than the art, so nothing is shrunk)
  const caps = [6, 7, 7.5];
  for (const cap of caps) {
    const f = write(`logo-light-cap${cap}.svg`, lockup(A, cap, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '120x32', px: 8 });
  }
  // symbol proofs at 18, 25 and 40 mm plus the side master, all at 8 px/mm
  const proofs = [];
  for (const h of [18, 25, 40]) {
    const f = write(`symbol-light-${h}mm.svg`, symbol(A, h, LIGHT, { channel: h >= 25 ? 1.2 : 1.0 }));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: `${Math.ceil(h * 0.75) + 12}x${h + 12}`, px: 8, width: undefined });
    proofs.push(f.replace('.svg', '.png'));
  }
  await kit.render(path.join(OUT, 'side-light.svg'), path.join(OUT, 'side-light-proof.png'), { bg: F.bone, tile: '22x26', px: 8 });
  proofs.unshift(path.join(OUT, 'side-light-proof.png'));

  // font comparison: the same construction in each wide, blocky face
  const fontPngs = [];
  for (const [id, font] of Object.entries(FONTS)) {
    const f = write(`fonts/${id}.svg`, lockup(font, 7, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '120x36', px: 6 });
    fontPngs.push([f.replace('.svg', '.png'), font.name]);
  }
  await kit.close();

  const lbl = (f) => path.basename(f, '.png');
  const m = (files, out, geom, tile = '2x', labeler = lbl) => {
    const args = [];
    for (const f of files) args.push('-label', Array.isArray(f) ? f[1] : labeler(f), Array.isArray(f) ? f[0] : f);
    execFileSync('montage', [...args, '-tile', tile, '-geometry', geom, '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, out)]);
  };
  m(sheet, 'sheet.png', '600x240+10+10');
  m(caps.map((c) => path.join(OUT, `logo-light-cap${c}.png`)), 'sizes-lockup.png', '+6+6', '1x');
  execFileSync('montage', [...proofs.flatMap((f) => ['-label', lbl(f), f]), '-tile', `${proofs.length}x1`, '-geometry', '+12+12', '-pointsize', '18', '-background', '#d9d4c8', path.join(OUT, 'sizes-symbol.png')]);
  m(fontPngs, 'fonts/sheet.png', '720x216+10+10');

  const L7 = lockup(A, 7, LIGHT), G = L7.G, S25 = symbol(A, 25, LIGHT, { channel: 1.2 }), SM = smallMaster(LIGHT);
  console.log(`font: ${A.name}, letter-spacing ${A.track} em`);
  console.log(`lockup cap 7: ${n(L7.w)} x ${n(L7.h)} mm`);
  console.log(`stem ${n(G.stem)} arm ${n(G.arm)} ring R ${n(G.R)} counter ${n(G.rx)} x ${n(G.ry)} walls side ${n(G.R - G.rx)} top ${n(G.R - G.ry)}`);
  console.log(`channel ${n(G.g)} minute ${n(2 * G.sM)} wide, visible ${n(G.Lm - G.R - G.g)}; hour ${n(2 * G.sH)} wide, visible ${n(G.Lh - G.R - G.g)}; dot ${n(G.dot)} (fabric to counter ${n(G.rx - G.dot / 2)})`);
  console.log(`symbol 25: ${n(S25.w)} x ${n(S25.h)} (cap ${n(S25.G.cap)}, dot ${n(S25.G.dot)}); side master: ${n(SM.w)} x ${n(SM.h)} mm`);
})().catch((e) => { console.error(e); process.exit(1); });
