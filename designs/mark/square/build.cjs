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
    id: '0-as-is', title: 'Hands outside: the hat clock', note: 'The clock from the hats, unchanged, centred on its ring and as big as a circle allows: the minute hand reaches the rim, so the ring is about a third of the tile. With the hands outside at their length, it can never be bigger.',
    draw(c) {
      // Round 1 tested this drawing fitted by its box at 80% of the tile (ring 32%); the critics' fit centres the ring
      // and lets the minute tip reach 0.47 of the tile from the centre (ring 34%, concentric with circle crops).
      const G = symbolG(), k = (S * 0.47) / G.Lm;
      return place(G, k, S / 2, S / 2, c);
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

// OFF over SHFT, left-aligned, the lockup's clock O (letter size, pivot dot) and the logo's kerning. The owner's pick
// for every square and circle (31 Oct 2026). stackedParts() draws it around the ring centre in mm; stacked() places it
// in the 100-unit tile, stackedArt() trims it to its own outline for logo files.
function stackedParts(c, { oneColour = false } = {}) {
  const cap = 7, track = A.track;
  // Screen version: the one-colour lockup's 1.5 mm channel keeps the hands apart from the ring at avatar sizes.
  // One colour: no pivot dot and a full-weight ring, as on the one-colour lockup.
  const G = oneColour ? LOGO.geometry(A, cap, { oneColour: true, dot: false, channel: 1.5 })
    : LOGO.geometry(A, cap, { dot: true, wallFactor: 0.82, channel: 1.5 });
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
  const e0 = extent(G);
  const line2Base = e0.b + Math.max(1.9, G.stem) + cap;            // SHFT's caps clear the hour tip by a hand's width
  const sx = -G.R;                                              // SHFT starts under the ring's left edge
  const ff = word('FF', ffX, baseY), shft = word('SHFT', sx, line2Base);
  const ink = `<path fill="${c.text}" fill-rule="evenodd" d="${ff} ${shft}"/>`;
  const body = clock(G, 0, 0, c) + ink;
  const sh = kit.text('SHFT', { font: A.key, cap, track, x: 0, y: 0 });
  const right = Math.max(sx + sh.width, ffX + kit.text('FF', { font: A.key, cap, track, x: 0, y: 0 }).width);
  const pts = [...(ff + ' ' + shft).matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  pts.push([0, -e0.t], [e0.r, e0.b], [-G.R, 0], [0, -G.R], [0, G.R]);
  const bbox = { x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) };
  // centre of the letters: top of OFF's caps to SHFT's baseline, ring edge to the widest line
  return { body, pts, bbox, cxL: (-G.R + right) / 2, cyL: (baseY - cap + line2Base) / 2, G };
}
// In the tile: centred on the letters, scaled until the outermost point is 45 units from the centre, so it sits
// inside every circle crop.
function stacked(c, o = {}) {
  const { body, pts, cxL, cyL } = stackedParts(c, o);
  const k = 45 / Math.max(...pts.map(([x, y]) => Math.hypot(x - cxL, y - cyL)));
  return `<g transform="translate(${n(S / 2 - cxL * k)} ${n(S / 2 - cyL * k)}) scale(${n(k)})">${body}</g>`;
}
function stackedArt(c, o = {}) {
  const { body, bbox } = stackedParts(c, o);
  return { w: bbox.x1 - bbox.x0, h: bbox.y1 - bbox.y0, body: `<g transform="translate(${n(-bbox.x0)} ${n(-bbox.y0)})">${body}</g>` };
}

// The clock face: an Ink ring as the dial, and the symbol's hands standing out of the pivot dot across an even channel,
// with the same concave bases and pointed tips (the dot plays the part the O plays in the symbol).
// Round 1 (dot 0.13 D, hands 0.05 D, hour 0.56 of the dial) read as a clock 9/10, but all three readers also saw a
// "!" (the long hand floating over a big dot). Round 2: a smaller dot, bolder hands and a broader, longer hour hand,
// as on a real watch, so it reads as two hands. After the critics: bolder hands still (0.07 of the dial, hour 1.25 x),
// dot 0.1, dial 80 so a circle crop doesn't read as a second ring; the gap at the pivot stays (its one brand detail).
function clockFace(c, { D = 80, wall = 0.11, disc = 0.1, chan = 0.03, hw = 0.07, hourW = 1.25, m = 0.8, h = 0.62 } = {}) {
  const R = D / 2, rIn = R - D * wall, rd = (D * disc) / 2, g = D * chan, s = (D * hw) / 2, cx = S / 2, cy = S / 2;
  let svg = `<path fill="${c.ring}" fill-rule="evenodd" d="${ellipse(cx, cy, R, R)} ${ellipse(cx, cy, rIn, rIn)}"/>`;
  svg += `<path fill="${c.hands}" d="${ellipse(cx, cy, rd, rd)} ${hand(cx, cy, 0, rd + g, rIn * m, s)} ${hand(cx, cy, 150, rd + g, rIn * h, s * hourW)}"/>`;
  return svg;
}

// ---------------------------------------------------------------- browser tab icons
// Nothing survives being scaled down to 16 px, so each direction gets its own drawing on the pixel grid, the way the
// side-of-hat master is its own drawing (the critics' spec, 31 Oct 2026). On an opaque Bone tile with rounded corners
// so it shows on light and dark tab bars.
// Hands outside (the hat clock): ring, 1-2 px channel, flat-ended hands; the 16 px frame drops the pivot dot.
const TAB_OUT = {
  16: { rx: 2.5, cx: 7, cy: 9, ro: 4, ri: 2, minute: [6, 1, 8, 4], hour: [5, 7.9, 2], dot: 0 },
  32: { rx: 5, cx: 15.5, cy: 18.5, ro: 7.5, ri: 4.5, minute: [14, 2, 17, 9], hour: [9.5, 14.6, 3], dot: 3 },
  48: { rx: 7, cx: 23, cy: 28, ro: 11, ri: 6.5, minute: [21, 3, 25, 14], hour: [14, 22, 4], dot: 4 },
};
function tabOutside(px, c) {
  const t = TAB_OUT[px], a = (150 * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const [r0, r1, w] = t.hour, P = (r, k) => `${n(t.cx + ux * r + nx * k)} ${n(t.cy + uy * r + ny * k)}`;
  const [x0, y0, x1, y1] = t.minute;
  const hands = `M${x0} ${y1} L${x0} ${y0} L${x1} ${y0} L${x1} ${y1} Z M${P(r0, -w / 2)} L${P(r1, -w / 2)} L${P(r1, w / 2)} L${P(r0, w / 2)} Z` +
    (t.dot ? ` ${ellipse(t.cx, t.cy, t.dot / 2, t.dot / 2)}` : '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${px} ${px}" width="${px}" height="${px}"><rect width="${px}" height="${px}" rx="${t.rx}" fill="${c.bg}"/>` +
    `<path fill="${c.ring}" fill-rule="evenodd" d="${ellipse(t.cx, t.cy, t.ro, t.ro)} ${ellipse(t.cx, t.cy, t.ri, t.ri)}"/><path fill="${c.hands}" d="${hands}"/></svg>\n`;
}
// Clock face, 16 px cut: heavier ring and hands joined at the pivot (the gap is under a pixel at this size).
function tabFace(c) {
  const R = 47, rIn = R - 10.5, sM = 4.75, sH = 5.5;
  const inner = `<path fill="${c.ring}" fill-rule="evenodd" d="${ellipse(50, 50, R, R)} ${ellipse(50, 50, rIn, rIn)}"/>` +
    `<path fill="${c.hands}" d="${hand(50, 50, 0, 0, rIn * 0.86, sM, { fromCentre: true })}"/>` +
    `<path fill="${c.hands}" d="${hand(50, 50, 150, 0, rIn * 0.58, sH, { fromCentre: true })}"/>` +
    `<path fill="${c.hands}" d="${ellipse(50, 50, 6, 6)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="16" height="16"><rect width="100" height="100" rx="16" fill="${c.bg}"/>${inner}</svg>\n`;
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
  fs.mkdirSync(path.join(OUT, 'tab'), { recursive: true });
  for (const c of [LIGHT, DARK]) {
    for (const px of [16, 32, 48]) fs.writeFileSync(path.join(OUT, 'tab', `outside-${px}-${c.name}.svg`), tabOutside(px, c));
    fs.writeFileSync(path.join(OUT, 'tab', `face-16-${c.name}.svg`), tabFace(c));
  }
  execFileSync('montage', [...shots, '-tile', '2x', '-geometry', '+10+10', '-background', '#DDDAD2', path.join(OUT, 'sheet.png')]);
  fs.writeFileSync(path.join(OUT, 'options.json'), JSON.stringify(OPTIONS.map(({ id, title, note }) => ({ id, title, note })), null, 1) + '\n');
  console.log('wrote', OPTIONS.length, 'options');
})();

module.exports = { OPTIONS, clock, extent, symbolG, tile, stacked, stackedArt, tabOutside, tabFace, LIGHT, DARK };
