// Shared drawing kit for the product previews on the bases picker.
//
// A preview is a flat technical drawing of the blank, front view, with the OFF SHFT artwork placed at true size.
// Drawings are in millimetres: x = 0 is the centre front, y = 0 is the top of the item, y grows downwards.
// Hats are drawn at HAT_PX pixels per mm and clothes at WEAR_PX, so pieces in the same category compare at real size.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LOGO_DIR = path.join(ROOT, 'designs/mark/final/the-o');

const CANVAS = 800;     // px, square
const HAT_PX = 3.2;     // px per mm: a 200 mm hat front is 640 px
const WEAR_PX = 0.72;   // px per mm: a 1000 mm hoodie flat is 720 px

// Drawing style. Every item uses these and nothing else, so the set reads as one family.
const STYLE = {
  fabric: '#E4DDCB',    // Bone, for every preview: colours are chosen later
  shade: '#D5CCB5',     // folds, insides, under the brim
  rib: '#DCD3BD',       // ribbing, mesh, bands
  line: '#2B3340',      // outlines
  stitch: '#2B3340',    // topstitching, drawn dashed at half opacity
  lineW: 2,             // outline width in screen px
  stitchW: 1.1,         // stitch width in screen px
  dash: [5, 4],         // stitch dash in screen px
};

// Screen px to drawing mm, at a category's scale.
const mm = (px, scale) => px / scale;

// Ready-made attribute strings, so every drawing uses the same weights.
function strokes(scale) {
  return {
    outline: `fill="none" stroke="${STYLE.line}" stroke-width="${mm(STYLE.lineW, scale)}" stroke-linejoin="round" stroke-linecap="round"`,
    stitch: `fill="none" stroke="${STYLE.stitch}" stroke-opacity=".5" stroke-width="${mm(STYLE.stitchW, scale)}" stroke-dasharray="${STYLE.dash.map((d) => mm(d, scale)).join(' ')}" stroke-linecap="round"`,
    fill: (c = STYLE.fabric) => `fill="${c}" stroke="${STYLE.line}" stroke-width="${mm(STYLE.lineW, scale)}" stroke-linejoin="round"`,
  };
}

// The real artwork, read from the final logo build. kind: 'lockup' (62.6 x 18.0 mm) or 'symbol' (11.8 x 25.0 mm).
const LOGO_FILES = { lockup: 'logo-light.svg', symbol: 'symbol-light-25mm.svg' };
function logo(kind) {
  const src = fs.readFileSync(path.join(LOGO_DIR, LOGO_FILES[kind]), 'utf8');
  const vb = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const inner = src.slice(src.indexOf('>') + 1, src.lastIndexOf('</svg>'));
  return { w: vb[2], h: vb[3], vb: vb.join(' '), inner };
}

// The artwork centred on (x, y) in drawing mm, optionally rotated (degrees) to follow a sleeve.
function place(kind, x, y, rotate = 0) {
  const L = logo(kind);
  return `<g transform="translate(${x} ${y}) rotate(${rotate})"><svg x="${-L.w / 2}" y="${-L.h / 2}" width="${L.w}" height="${L.h}" viewBox="${L.vb}" overflow="visible">${L.inner}</svg></g>`;
}

// Whole preview: the drawing scaled onto the canvas, the artwork on top. Hats sit in the middle at HAT_PX, where the
// logo is big enough to read. Clothes sit at the bottom at WEAR_PX, with a round close-up of the mark in the top-right
// corner, magnified ZOOM times, joined to the mark by a leader line.
const ZOOM = { lockup: 3.6, symbol: 6 };
function compose(item, marks) {
  const hat = item.category === 'hat';
  const scale = hat ? HAT_PX : WEAR_PX;
  const w = item.w * scale, h = item.h * scale;
  if (w > CANVAS - 40 || h > CANVAS - 40) throw new Error(`${item.name}: ${Math.round(w)} x ${Math.round(h)} px does not fit the ${CANVAS} px canvas`);
  const ty = hat ? (CANVAS - h) / 2 : CANVAS - h - 20;
  const r = 118, cx = CANVAS - r - 14, cy = r + 14;   // the close-up on clothes
  // A garment tall enough to reach up beside the close-up would be partly hidden by it. When it is narrow enough to
  // (the sweatpants), it moves left until it clears the circle by 12 px. The wide garments that reach that high are
  // the hooded tops, and only their hood does, which is narrow and stays clear of the circle where it is.
  const clear = cx - r - 12;
  let tx = CANVAS / 2;
  if (!hat && marks.length && ty < cy + r + 12 && tx + w / 2 > clear && clear - w >= 20) tx = clear - w / 2;
  const drawing = item.body + marks.map((m) => place(m.kind, m.x, m.y, m.rotate || 0)).join('');
  let zoom = '';
  if (!hat && marks.length) {
    const m = marks[0];
    const mx = tx + m.x * scale, my = ty + m.y * scale;
    const ring = m.kind === 'symbol' ? 16 : 30; // px around the mark on the drawing
    const d = Math.hypot(cx - mx, cy - my), ux = (cx - mx) / d, uy = (cy - my) / d;
    const line = `stroke="${STYLE.line}" stroke-width="1.5"`;
    zoom = `<style>.zoom *{vector-effect:non-scaling-stroke}</style>`
      + `<defs><clipPath id="zoom-clip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`
      + `<circle cx="${mx}" cy="${my}" r="${ring}" fill="none" ${line}/>`
      + `<line x1="${mx + ux * ring}" y1="${my + uy * ring}" x2="${cx - ux * r}" y2="${cy - uy * r}" ${line} stroke-dasharray="3 3"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${STYLE.fabric}"/>`
      + `<g clip-path="url(#zoom-clip)"><g class="zoom" transform="translate(${cx} ${cy}) scale(${scale * ZOOM[m.kind]}) translate(${-m.x} ${-m.y})">${drawing}</g></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STYLE.line}" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">`
    + `<g transform="translate(${tx} ${ty}) scale(${scale})">${drawing}</g>${zoom}</svg>`;
}

async function render(jobs) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: CANVAS, height: CANVAS }, deviceScaleFactor: 1.5 });
  for (const { svg, out } of jobs) {
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await (await page.$('svg')).screenshot({ path: out, omitBackground: true });
  }
  await browser.close();
}

module.exports = { CANVAS, HAT_PX, WEAR_PX, ZOOM, STYLE, mm, strokes, logo, place, compose, render };
