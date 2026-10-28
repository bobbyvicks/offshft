// Shared drawing kit for OFF SHFT design work.
//
// As a module:
//   const kit = require('/home/user/offshft/tools/kit/kit.cjs');
//   const t = kit.text('OFF SHFT', { font: 'xbold', cap: 6, track: 0.14, fill: kit.T.ink });
//   // t.svg is a <path> with the text outlined; t.width is its width in mm
//   kit.writeSvg('/path/mark.svg', { w, h, body });          // mm-sized SVG file
//   await kit.render('/path/mark.svg', '/path/mark.png', { bg: kit.F.bone });
//
// From the shell:
//   node kit.cjs text "OFF SHFT" --font=xbold --cap=6 --track=0.14 --fill=#1F2733
//   node kit.cjs render in.svg out.png [--bg=#E4DDCB] [--width=25] [--px=8] [--tile=110x64]
//     --width=<mm>  scales the design to that physical width (use 13 and 25 for small-size tests)
//     no --width    true size, or shrunk to fit the tile if bigger
//   node kit.cjs sizes in.svg out.png [--bg=...]   one strip showing the design at 13, 25 and 50 mm (longest side)
//
// Units are millimetres everywhere. Text is converted to outlines so files are font-independent.

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const FONT_DIR = path.join(__dirname, '..', 'fonts');
const FONT_FILES = {
  xblack: 'Archivo-ExpandedBlack.ttf',
  xbold: 'Archivo-ExpandedBold.ttf',
  xsemi: 'Archivo-ExpandedSemiBold.ttf',
  xmed: 'Archivo-ExpandedMedium.ttf',
  sxbold: 'Archivo-SemiExpandedBold.ttf',
  bold: 'Archivo-Bold.ttf',
  semi: 'Archivo-SemiBold.ttf',
  // other wide, blocky open-licence faces (licences in ../fonts/OFL-*.txt)
  anybody: 'Anybody-ExtraWideExtraBold.ttf',
  unbounded: 'Unbounded-Bold.ttf',
  lexendexa: 'LexendExa-Bold.ttf',
  syne: 'Syne-ExtraBold.ttf',
  saira: 'Saira-ExpandedBold.ttf',
  krona: 'KronaOne-Regular.ttf',
  michroma: 'Michroma-Regular.ttf',
  rubikmono: 'RubikMonoOne-Regular.ttf',
  encodex: 'EncodeSansExpanded-Bold.ttf',
  dela: 'DelaGothicOne-Regular.ttf',
};
const cache = {};
function font(name) {
  if (!FONT_FILES[name]) throw new Error(`unknown font "${name}". Use one of: ${Object.keys(FONT_FILES).join(', ')}`);
  return (cache[name] ||= opentype.loadSync(path.join(FONT_DIR, FONT_FILES[name])));
}

// Brand palette. T = thread colours (stitched), F = fabric colours (the hat).
const T = { bone: '#ECE5D3', ink: '#1F2733', rust: '#B4552D', sun: '#D29B3C', sage: '#9AA383' };
const F = { bone: '#E4DDCB', oat: '#C7B48E', moss: '#5A5F40', spruce: '#2E3D35', slate: '#27303D', rust: '#8E4426' };

const sizeForCap = (f, cap) => (cap * f.unitsPerEm) / f.tables.os2.sCapHeight;

function layout(f, str, size, tracking) {
  const glyphs = f.stringToGlyphs(str);
  const pos = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    pos.push(x);
    x += (g.advanceWidth * size) / f.unitsPerEm;
    if (glyphs[i + 1]) x += (f.getKerningValue(g, glyphs[i + 1]) * size) / f.unitsPerEm;
    x += tracking;
  });
  return { glyphs, pos, width: x - tracking };
}

// Outlined text. cap = cap height in mm. track = letter spacing in em. y = baseline.
function text(str, { font: fname = 'xbold', x = 0, y, cap = 6, fill = T.ink, anchor = 'start', track = 0 } = {}) {
  const f = font(fname);
  const size = sizeForCap(f, cap);
  const L = layout(f, str, size, track * size);
  const yy = y === undefined ? cap : y;
  const x0 = anchor === 'middle' ? x - L.width / 2 : anchor === 'end' ? x - L.width : x;
  const d = L.glyphs.map((g, i) => g.getPath(x0 + L.pos[i], yy, size).toPathData(3)).join('');
  // per-letter boxes, handy for building marks into letters
  const letters = L.glyphs.map((g, i) => {
    const bb = g.getBoundingBox();
    const k = size / f.unitsPerEm;
    return { ch: str[i], x: x0 + L.pos[i], advance: g.advanceWidth * k, x1: x0 + L.pos[i] + bb.x1 * k, x2: x0 + L.pos[i] + bb.x2 * k, top: yy - bb.y2 * k, bottom: yy - bb.y1 * k };
  });
  return { svg: `<path fill="${fill}" d="${d}"/>`, d, width: L.width, x0, cap, letters };
}

// Stem (vertical stroke) thickness of a font at a cap height, measured from "I".
function stem(fname, cap) {
  const f = font(fname);
  const bb = f.charToGlyph('I').getBoundingBox();
  return ((bb.x2 - bb.x1) * sizeForCap(f, cap)) / f.unitsPerEm;
}

// Point at clock angle (degrees clockwise from 12 o'clock) and distance r from (cx, cy).
function polar(cx, cy, deg, r) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}
// 5:00 exactly: minute hand at 0 deg, hour hand at 150 deg.
const FIVE = { minute: 0, hour: 150 };

function svgDoc({ w, h, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${(+w).toFixed(2)}mm" height="${(+h).toFixed(2)}mm" viewBox="0 0 ${(+w).toFixed(3)} ${(+h).toFixed(3)}">\n${body}\n</svg>\n`;
}
function writeSvg(file, design) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svgDoc(design));
  return file;
}

function readSvg(file) {
  const src = fs.readFileSync(file, 'utf8');
  const vb = src.match(/viewBox="([^"]+)"/);
  if (!vb) throw new Error(`${file} has no viewBox`);
  const [, , w, h] = vb[1].trim().split(/[\s,]+/).map(Number);
  const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return { w, h, inner, viewBox: vb[1] };
}

let browserP = null;
async function browser() {
  if (!browserP) {
    const { chromium } = require('playwright');
    browserP = chromium.launch();
  }
  return browserP;
}
async function close() {
  if (browserP) (await browserP).close();
  browserP = null;
}

async function shoot(svgMarkup, out) {
  const b = await browser();
  const page = await b.newPage({ deviceScaleFactor: 2 });
  await page.setContent(`<html><body style="margin:0;display:inline-block">${svgMarkup}</body></html>`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await (await page.$('svg')).screenshot({ path: out });
  await page.close();
  return out;
}

// Render an SVG file (mm units) onto a fabric tile.
async function render(inFile, out, { bg = F.bone, width, px = 4, tile = '110x64', twill = true } = {}) {
  const d = readSvg(inFile);
  const [TW, TH] = tile.split('x').map(Number);
  let s = 1;
  if (width) s = width / d.w;
  else s = Math.min(1, (TW * 0.8) / d.w, (TH * 0.7) / d.h);
  const w = d.w * s, h = d.h * s;
  const pattern = twill
    ? `<defs><pattern id="tw" width="1.2" height="1.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.2" height="0.6" fill="#000" opacity=".045"/></pattern></defs><rect width="${TW}" height="${TH}" fill="url(#tw)"/>`
    : '';
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}" width="${TW * px}" height="${TH * px}">
<rect width="${TW}" height="${TH}" fill="${bg}"/>${pattern}
<svg x="${(TW - w) / 2}" y="${(TH - h) / 2}" width="${w}" height="${h}" viewBox="${d.viewBox}" overflow="visible">${d.inner}</svg>
</svg>`;
  return shoot(markup, out);
}

// One strip with the design at 13, 25 and 50 mm on its longest side, shown at 8 px per mm.
async function sizes(inFile, out, { bg = F.bone } = {}) {
  const d = readSvg(inFile);
  const longest = [13, 25, 50];
  const k = longest.map((L) => L / Math.max(d.w, d.h));
  const widths = k.map((s) => d.w * s);
  const px = 8, pad = 8, gap = 14;
  const hs = k.map((s) => d.h * s);
  const TW = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1) + pad * 2;
  const TH = Math.max(...hs) + pad * 2 + 6;
  let x = pad;
  const parts = widths.map((w, i) => {
    const h = hs[i];
    const s = `<svg x="${x}" y="${pad + (Math.max(...hs) - h) / 2}" width="${w}" height="${h}" viewBox="${d.viewBox}" overflow="visible">${d.inner}</svg>` +
      `<text x="${x}" y="${TH - 3}" font-family="Arial" font-size="3" fill="#000" opacity=".45">${longest[i]} mm</text>`;
    x += w + gap;
    return s;
  });
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}" width="${TW * px}" height="${TH * px}"><rect width="${TW}" height="${TH}" fill="${bg}"/>${parts.join('')}</svg>`;
  return shoot(markup, out);
}

module.exports = { T, F, FONT_FILES, font, text, stem, polar, FIVE, svgDoc, writeSvg, readSvg, render, sizes, close };

// ---------- CLI ----------
if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v === undefined ? true : v]; }));
  const pos = rest.filter((a) => !a.startsWith('--'));
  (async () => {
    if (cmd === 'text') {
      const t = text(pos[0], { font: flags.font, cap: +(flags.cap || 6), track: +(flags.track || 0), fill: flags.fill, x: +(flags.x || 0), y: flags.y === undefined ? undefined : +flags.y, anchor: flags.anchor });
      console.log(JSON.stringify({ svg: t.svg, width: +t.width.toFixed(3), cap: t.cap, letters: t.letters }));
    } else if (cmd === 'render') {
      await render(pos[0], pos[1], { bg: flags.bg, width: flags.width ? +flags.width : undefined, px: flags.px ? +flags.px : undefined, tile: flags.tile });
      console.log(pos[1]);
    } else if (cmd === 'sizes') {
      await sizes(pos[0], pos[1], { bg: flags.bg });
      console.log(pos[1]);
    } else {
      console.log('usage: node kit.cjs text|render|sizes ... (see top of file)');
    }
    await close();
  })().catch((e) => { console.error(e); process.exit(1); });
}
