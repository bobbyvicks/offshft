// OFF SHFT: the clock symbol in a square (avatars, app icons, favicons, the Shopify logo, stickers).
// The owner's problem (31 Oct 2026): the stand-alone symbol is about twice as tall as its ring (11.8 x 25 mm), so in a
// square the hands set the scale and the clock ends up small. This script draws the alternatives side by side, from
// the final logo's own geometry (designs/mark/final/the-o/build.cjs), and renders each one where it will be used.
//
// Run: cd /home/user/offshft/tools && node ../designs/mark/square/build.cjs
// Writes, per option: <id>-light.svg and <id>-dark.svg (100 x 100 tiles), and contexts/<id>.png (circle avatar,
// app icon, favicon, at real pixel sizes). Plus sheet.png with every option.

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const LOGO = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const A = LOGO.FONTS.unbounded;
const T = kit.T, F = kit.F;
const n = (v) => (Math.round(v * 1000) / 1000).toString();
// Digital colourways: the thread colours on the brand's two main fabrics.
const LIGHT = { name: 'light', bg: T.bone, ring: T.ink, hands: T.rust, text: T.ink };
const DARK = { name: 'dark', bg: F.slate, ring: T.bone, hands: T.sun, text: T.bone };

// ---------------------------------------------------------------- the clock, drawn like the final symbol
// Same construction as clockO() in the final build: ring with thinner top and bottom walls, hands with concave bases
// across an even channel (outside) or from the pivot (inside), 90 degree points ending in a flat 0.3 x the hand width.
function hand(cx, cy, deg, rho, L, s, { fromCentre = false } = {}) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const f = 0.3 * s;
  const t0 = fromCentre ? 0 : Math.sqrt(rho * rho - s * s);
  const pts = [P(t0, -s), P(L + f - s, -s), P(L, -f), P(L, f), P(L + f - s, s), P(t0, s)];
  const body = `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')}`;
  return fromCentre ? `${body} Z` : `${body} A${n(rho)} ${n(rho)} 0 0 0 ${n(pts[0][0])} ${n(pts[0][1])} Z`;
}
const ellipse = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)} a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;

// G: { R, rx, ry, g, dot, sM, sH, Lm, Lh } in mm, as the final build's geometry() returns them.
function clock(G, cx, cy, c, { inside = false } = {}) {
  const o = { fromCentre: inside };
  let svg = `<path fill="${c.ring}" fill-rule="evenodd" d="${ellipse(cx, cy, G.R, G.R)} ${ellipse(cx, cy, G.rx, G.ry)}"/>`;
  svg += `<path fill="${c.hands}" d="${hand(cx, cy, 0, G.R + G.g, G.Lm, G.sM, o)} ${hand(cx, cy, 150, G.R + G.g, G.Lh, G.sH, o)}"/>`;
  if (G.dot) svg += `<path fill="${c.hands}" d="${ellipse(cx, cy, G.dot / 2, G.dot / 2)}"/>`;
  return svg;
}
// Extent of a clock around its centre (for fitting): left, top, right, bottom distances in mm.
function extent(G, { inside = false } = {}) {
  if (inside) return { l: G.R, t: G.R, r: G.R, b: G.R };
  const a = (150 * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a);
  const tipX = ux * G.Lh + Math.abs(uy) * G.sH, tipY = uy * G.Lh + Math.abs(ux) * G.sH;
  return { l: G.R, t: G.Lm, r: Math.max(G.R, tipX), b: Math.max(G.R, tipY) };
}

// The final symbol's geometry at a given height, with optional changes (hand lengths in cap heights, as in the build).
function symbolG(opts = {}) {
  return LOGO.symbol(A, 25, LOGO.LIGHT, { channel: 1.2, ...opts }).G;
}

// ---------------------------------------------------------------- the options
// Each returns the inner SVG for a 100 x 100 tile (background drawn separately), in the given colours.
const S = 100;
const place = (G, k, cx, cy, c, o) => `<g transform="translate(${n(cx)} ${n(cy)}) scale(${n(k)})">${clock(G, 0, 0, c, o)}</g>`;

const OPTIONS = [
  {
    id: '0-as-is', title: 'As it is now', note: 'The current symbol fitted into the square. The hands set the scale, so the clock is about a third of the tile.',
    draw(c) {
      const G = symbolG(), e = extent(G), h = e.t + e.b, k = (S * 0.8) / h;
      // centred on its box
      const w = e.l + e.r;
      return place(G, k, S / 2 - (w / 2 - e.l) * k, S / 2 - (h / 2 - e.t) * k, c);
    },
  },
  {
    id: '1-bleed', title: 'Hands run off the edge', note: 'Same drawing, bigger: the ring is half the tile and the hands run off the top and the bottom right, so the frame crops their tips. The clock itself never changes.',
    draw(c) {
      const G = symbolG(), D = S * 0.5, k = D / (2 * G.R);
      return place(G, k, S * 0.47, S * 0.55, c);
    },
  },
  {
    id: '2-square-master', title: 'Square version: shorter hands', note: 'Its own drawing for squares, like the side-of-hat master: the same clock with the hands about a third shorter, so the whole clock fits and the ring is bigger.',
    draw(c) {
      const G = symbolG({ minuteLen: 0.62, hourLen: 0.48 }), e = extent(G), h = e.t + e.b, w = e.l + e.r;
      const k = (S * 0.8) / Math.max(h, w);
      return place(G, k, S / 2 - (w / 2 - e.l) * k, S / 2 - (h / 2 - e.t) * k, c);
    },
  },
  {
    id: '3-clock-face', title: 'Clock face', note: 'The ring becomes the dial and the hands sit inside it, standing out of the pivot dot across the same gap they keep from the ring now. Fills the square and reads as a clock at 5:00 at any size.',
    draw(c) { return clockFace(c); },
  },
  {
    id: '4-stacked', title: 'Stacked name', note: 'OFF over SHFT with the clock O, the way the name fills a square. Says the name in avatars while nobody knows the symbol yet; the clock itself is small.',
    draw(c) { return stacked(c); },
  },
];

// OFF over SHFT, left-aligned, the lockup's clock O (letter size, pivot dot) and the logo's kerning.
function stacked(c) {
  const cap = 7, track = A.track;
  const G = LOGO.geometry(A, cap, { dot: true, wallFactor: 0.82 });
  const ref = kit.text('OFF', { font: A.key, cap, track, x: 0, y: 0 });
  const O = ref.letters[0];
  const baseY = -(O.top + O.bottom) / 2;                        // baseline relative to the ring centre (y down)
  const word = (str, x0, by) => {
    const t = kit.text(str, { font: A.key, cap, track, x: 0, y: 0 });
    let shift = 0, d = '';
    for (let i = 0; i < str.length; i++) {
      const kern = A.kern[str[i - 1] + str[i]];
      if (i > 0 && kern) shift += kern * cap;
      d += LOGO.glyphMM(A, str[i], x0 + t.letters[i].x + shift, by, cap).d + ' ';
    }
    return d;
  };
  const gapAfterO = ref.letters[1].x1 - O.x2;
  const ffX = G.R + gapAfterO - (ref.letters[1].x1 - ref.letters[1].x);
  const e = extent(G);
  const line2Base = baseY + cap + 6.2;                          // clears the hour hand by about 1.8 mm
  const sx = -G.R;                                              // SHFT starts under the ring's left edge
  const ink = `<path fill="${c.text}" fill-rule="evenodd" d="${word('FF', ffX, baseY)} ${word('SHFT', sx, line2Base)}"/>`;
  const body = clock(G, 0, 0, c) + ink;
  // fit: box from the minute tip to SHFT's baseline, ring left edge to the widest line's right edge
  const sh = kit.text('SHFT', { font: A.key, cap, track, x: 0, y: 0 });
  const right = Math.max(sx + sh.width, ffX + kit.text('FF', { font: A.key, cap, track, x: 0, y: 0 }).width);
  const box = { x0: -G.R, y0: -e.t, x1: right, y1: line2Base };
  // Scaled so the block's corners sit inside a circle crop with room to spare (avatars are cut to a circle).
  const w = box.x1 - box.x0, h = box.y1 - box.y0, k = (S * 0.43) / Math.hypot(w / 2, h / 2);
  return `<g transform="translate(${n(S / 2 - (box.x0 + w / 2) * k)} ${n(S / 2 - (box.y0 + h / 2) * k)}) scale(${n(k)})">${body}</g>`;
}

// The clock face: an Ink ring as the dial, and the symbol's hands standing out of the pivot dot across an even channel,
// with the same concave bases and pointed tips (the dot plays the part the O plays in the symbol).
// Round 1 (dot 0.13 D, hands 0.05 D, hour 0.56 of the dial) read as a clock 9/10, but all three readers also saw a
// "!" (the long hand floating over a big dot). Round 2: a smaller dot, bolder hands and a broader, longer hour hand,
// as on a real watch, so it reads as two hands.
function clockFace(c, { D = 82, wall = 0.105, disc = 0.09, chan = 0.03, hw = 0.058, hourW = 1.4, m = 0.78, h = 0.6 } = {}) {
  const R = D / 2, rIn = R - D * wall, rd = (D * disc) / 2, g = D * chan, s = (D * hw) / 2, cx = S / 2, cy = S / 2;
  let svg = `<path fill="${c.ring}" fill-rule="evenodd" d="${ellipse(cx, cy, R, R)} ${ellipse(cx, cy, rIn, rIn)}"/>`;
  svg += `<path fill="${c.hands}" d="${ellipse(cx, cy, rd, rd)} ${hand(cx, cy, 0, rd + g, rIn * m, s)} ${hand(cx, cy, 150, rd + g, rIn * h, s * hourW)}"/>`;
  return svg;
}

const tile = (o, c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}mm" height="${S}mm">
<defs><clipPath id="t"><rect width="${S}" height="${S}"/></clipPath></defs>
<rect width="${S}" height="${S}" fill="${c.bg}"/><g clip-path="url(#t)">${o.draw(c)}</g>
</svg>
`;

// ---------------------------------------------------------------- contexts: where a square mark actually shows up
// Rendered at real pixel sizes (device scale 2, like a phone): profile circle 160 / 56 / 24 px, app icon 120 px with
// rounded corners, browser tab 16 px, plus the tile itself.
async function contexts(o, files, out) {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 2 });
  const src = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(f).toString('base64');
  const cell = (f, px, shape) => `<div style="width:${px}px;height:${px}px;border-radius:${shape === 'circle' ? '50%' : shape === 'icon' ? '22%' : '0'};overflow:hidden;flex:none;box-shadow:0 0 0 1px rgba(0,0,0,.08)"><img src="${src(f)}" style="width:100%;height:100%;display:block"></div>`;
  const row = (f) => `<div style="display:flex;gap:18px;align-items:center">${cell(f, 160, 'circle')}${cell(f, 56, 'circle')}${cell(f, 24, 'circle')}${cell(f, 120, 'icon')}
    <div style="display:flex;align-items:center;gap:6px;background:#E9E9EC;border-radius:8px 8px 0 0;padding:7px 10px;font:12px Arial;color:#333">${cell(f, 16, 'square')}<span>OFF SHFT</span></div></div>`;
  const html = `<html><body style="margin:0;background:#F6F5F2;font-family:Arial">
<div id="c" style="display:inline-flex;flex-direction:column;gap:14px;padding:18px">
<div style="font:bold 15px Arial;color:#222">${o.title}</div>${row(files.light)}${row(files.dark)}</div></body></html>`;
  await page.setContent(html);
  await (await page.$('#c')).screenshot({ path: out });
  await b.close();
}

// For blind reading tests: the light version only, as a profile picture (160 and 56 px circles) and an app icon
// (120 px), with no title and no name anywhere on the image.
async function blind(file, out) {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 2 });
  const src = 'data:image/svg+xml;base64,' + fs.readFileSync(file).toString('base64');
  const cell = (px, r) => `<div style="width:${px}px;height:${px}px;border-radius:${r};overflow:hidden;flex:none;box-shadow:0 0 0 1px rgba(0,0,0,.08)"><img src="${src}" style="width:100%;height:100%;display:block"></div>`;
  await page.setContent(`<html><body style="margin:0;background:#F6F5F2"><div id="c" style="display:inline-flex;gap:22px;align-items:center;padding:22px">${cell(160, '50%')}${cell(56, '50%')}${cell(120, '22%')}</div></body></html>`);
  await (await page.$('#c')).screenshot({ path: out });
  await b.close();
}

if (require.main === module) (async () => {
  fs.mkdirSync(path.join(OUT, 'contexts'), { recursive: true });
  const shots = [];
  for (const o of OPTIONS) {
    const files = {};
    for (const c of [LIGHT, DARK]) {
      files[c.name] = path.join(OUT, `${o.id}-${c.name}.svg`);
      fs.writeFileSync(files[c.name], tile(o, c));
    }
    const out = path.join(OUT, 'contexts', `${o.id}.png`);
    await contexts(o, files, out);
    shots.push(out);
    fs.mkdirSync(path.join(OUT, 'blind'), { recursive: true });
    await blind(files.light, path.join(OUT, 'blind', `${o.id}.png`));
  }
  execFileSync('montage', [...shots, '-tile', '2x', '-geometry', '+10+10', '-background', '#DDDAD2', path.join(OUT, 'sheet.png')]);
  fs.writeFileSync(path.join(OUT, 'options.json'), JSON.stringify(OPTIONS.map(({ id, title, note }) => ({ id, title, note })), null, 1) + '\n');
  console.log('wrote', OPTIONS.length, 'options');
})();

module.exports = { OPTIONS, clock, extent, symbolG, tile, LIGHT, DARK };
