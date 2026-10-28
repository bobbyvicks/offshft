// Geometry helpers for the "Built into the name" explorations (T1-T4).
// Units: mm. y grows downward (SVG). Uses paper.js for boolean path operations.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const paper = require(path.join(__dirname, '_deps/node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(2000, 2000));
paper.settings.insertItems = false;

const P = (x, y) => new paper.Point(x, y);

// Outlined text as a paper CompoundPath plus per-letter boxes from the kit.
function text(str, opts) {
  const t = kit.text(str, opts);
  const item = new paper.CompoundPath(t.d);
  return { item, letters: t.letters, width: t.width, x0: t.x0, cap: opts.cap };
}

// Per-glyph outlines (so single letters can be removed or edited).
function glyphs(str, opts) {
  const t = kit.text(str, opts);
  return t.letters.map((L, i) => {
    if (L.ch === ' ') return { ...L, item: null };
    const g = kit.text(L.ch, { ...opts, x: L.x, anchor: 'start', track: 0 });
    return { ...L, item: new paper.CompoundPath(g.d) };
  });
}

// A straight bar from p1 to p2, width w. caps: 'flat' | 'round'.
function bar(x1, y1, x2, y2, w, { cap1 = 'flat', cap2 = 'flat' } = {}) {
  const a = P(x1, y1), b = P(x2, y2);
  const d = b.subtract(a).normalize();
  const n = P(-d.y, d.x).multiply(w / 2);
  let r = new paper.Path({ segments: [a.add(n), b.add(n), b.subtract(n), a.subtract(n)], closed: true });
  if (cap1 === 'round') r = r.unite(new paper.Path.Circle(a, w / 2));
  if (cap2 === 'round') r = r.unite(new paper.Path.Circle(b, w / 2));
  return r;
}
// Bar along clock angle deg from (cx,cy): from distance r0 to r1.
function hand(cx, cy, deg, r0, r1, w, caps) {
  const [x1, y1] = kit.polar(cx, cy, deg, r0);
  const [x2, y2] = kit.polar(cx, cy, deg, r1);
  return bar(x1, y1, x2, y2, w, caps);
}
// Tapered hand: width w0 at r0, w1 at r1 (flat ends).
function taper(cx, cy, deg, r0, r1, w0, w1) {
  const a = P(...kit.polar(cx, cy, deg, r0)), b = P(...kit.polar(cx, cy, deg, r1));
  const d = b.subtract(a).normalize();
  const n = P(-d.y, d.x);
  return new paper.Path({ segments: [a.add(n.multiply(w0 / 2)), b.add(n.multiply(w1 / 2)), b.subtract(n.multiply(w1 / 2)), a.subtract(n.multiply(w0 / 2))], closed: true });
}
const circle = (x, y, r) => new paper.Path.Circle(P(x, y), r);
const rect = (x, y, w, h) => new paper.Path.Rectangle(P(x, y), new paper.Size(w, h));
const poly = (pts) => new paper.Path({ segments: pts.map(([x, y]) => P(x, y)), closed: true });
const ellipse = (cx, cy, rx, ry) => new paper.Path.Ellipse(new paper.Rectangle(P(cx - rx, cy - ry), new paper.Size(2 * rx, 2 * ry)));

function unite(...items) {
  items = items.flat().filter(Boolean);
  let u = items[0];
  for (let i = 1; i < items.length; i++) u = u.unite(items[i]);
  return u;
}
const subtract = (a, ...bs) => bs.flat().filter(Boolean).reduce((acc, b) => acc.subtract(b), a);
const intersect = (a, b) => a.intersect(b);

// Path data rounded to 3 decimals.
function pathData(item) {
  // paper's pathData honours precision via toString of segments; use exportSVG-free route
  return item.pathData.replace(/(\d+\.\d{3})\d+/g, '$1');
}
const svgPath = (item, fill) => `<path fill="${fill}" fill-rule="evenodd" d="${pathData(item)}"/>`;

// Translate / scale an item (returns a clone).
function moved(item, dx, dy) { const c = item.clone({ insert: false }); c.translate(P(dx, dy)); return c; }
function scaled(item, s, cx = 0, cy = 0) { const c = item.clone({ insert: false }); c.scale(s, P(cx, cy)); return c; }

// Bounds of an item: {x, y, w, h}
const bounds = (item) => { const b = item.bounds; return { x: b.x, y: b.y, w: b.width, h: b.height, x2: b.x + b.width, y2: b.y + b.height }; };

// Write an SVG with all items shifted so the art sits at (pad,pad).
function writeArt(file, parts, { pad = 0, box } = {}) {
  // parts: [{item, fill}]
  let bb = box;
  if (!bb) {
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const p of parts) { const b = p.item.bounds; x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height); }
    bb = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }
  const body = parts.map((p) => svgPath(moved(p.item, pad - bb.x, pad - bb.y), p.fill)).join('\n');
  kit.writeSvg(file, { w: bb.w + 2 * pad, h: bb.h + 2 * pad, body });
  return { w: bb.w + 2 * pad, h: bb.h + 2 * pad };
}

// Embroidery check: render the art in one colour at `targetMm` on its longest side,
// then morphologically open/close with a disc of `minMm` diameter. Red = strokes thinner
// than minMm, blue = gaps narrower than minMm. Returns pixel counts and writes a PNG.
async function check(svgFile, outPng, { targetMm = 25, minMm = 1.2, pxPerMm = 24 } = {}) {
  const src = fs.readFileSync(svgFile, 'utf8');
  const vb = src.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
  const s = targetMm / Math.max(vb[2], vb[3]);
  const W = Math.round(vb[2] * s * pxPerMm) + 40, H = Math.round(vb[3] * s * pxPerMm) + 40;
  const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#000"');
  const tmpSvg = outPng.replace(/\.png$/, '.mono.svg');
  fs.writeFileSync(tmpSvg, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${-20 / (s * pxPerMm)} ${-20 / (s * pxPerMm)} ${W / (s * pxPerMm)} ${H / (s * pxPerMm)}"><rect x="-1000" y="-1000" width="3000" height="3000" fill="#fff"/>${inner}</svg>`);
  const base = outPng.replace(/\.png$/, '');
  await kitShoot(tmpSvg, base + '.mono.png', W, H);
  const r = Math.max(1, Math.round((minMm * pxPerMm) / 2) - 1);
  // black = ink. Opening of ink == closing of white background in IM terms on a negated image.
  execFileSync('convert', [base + '.mono.png', '-colorspace', 'gray', '-threshold', '50%', '-negate', '-morphology', 'Open', `Disk:${r}`, base + '.open.png']);
  execFileSync('convert', [base + '.mono.png', '-colorspace', 'gray', '-threshold', '50%', '-negate', '-morphology', 'Close', `Disk:${r}`, base + '.close.png']);
  // thin = ink & !open ; narrow gap = close & !ink
  execFileSync('convert', [base + '.mono.png', '-colorspace', 'gray', '-threshold', '50%', '-negate', base + '.ink.png']);
  execFileSync('convert', [base + '.ink.png', base + '.open.png', '-compose', 'minus_src', '-composite', base + '.thin.png']);
  execFileSync('convert', [base + '.close.png', base + '.ink.png', '-compose', 'minus_src', '-composite', base + '.gap.png']);
  const count = (f) => +execFileSync('convert', [f, '-format', '%[fx:mean*w*h]', 'info:']).toString();
  const thin = count(base + '.thin.png'), gap = count(base + '.gap.png');
  // visual: ink grey, thin red, gap blue
  execFileSync('convert', [base + '.ink.png', '-negate', '(', base + '.thin.png', '-fill', 'red', '-opaque', 'white', '-transparent', 'black', ')', '-composite', '(', base + '.gap.png', '-fill', 'blue', '-opaque', 'white', '-transparent', 'black', ')', '-composite', outPng]);
  for (const f of ['.mono.png', '.open.png', '.close.png', '.ink.png', '.thin.png', '.gap.png']) fs.unlinkSync(base + f);
  fs.unlinkSync(tmpSvg);
  return { thinPx: Math.round(thin), gapPx: Math.round(gap), pxPerMm };
}
async function kitShoot(svgFile, out, W, H) {
  const { chromium } = require('playwright');
  if (!kitShoot.b) kitShoot.b = await chromium.launch();
  const page = await kitShoot.b.newPage({ deviceScaleFactor: 1, viewport: { width: W, height: H } });
  await page.setContent(`<html><body style="margin:0">${fs.readFileSync(svgFile, 'utf8')}</body></html>`);
  await (await page.$('svg')).screenshot({ path: out });
  await page.close();
}
async function closeAll() { await kit.close(); if (kitShoot.b) await kitShoot.b.close(); kitShoot.b = null; }

module.exports = { kit, paper, P, text, glyphs, bar, hand, taper, circle, rect, poly, ellipse, unite, subtract, intersect, pathData, svgPath, moved, scaled, bounds, writeArt, check, closeAll };
