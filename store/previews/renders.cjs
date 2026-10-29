// Renders the product images for the Shopify listings: one PNG per style and design, on a light panel, square.
// The same composition as the picker page (drawing + artwork at true size, big spots scaled to fit, close-up for
// small marks on clothes), so what the owner picked is what the store shows.
//
//   cd /home/user/offshft/tools && node ../store/previews/export.cjs && node ../store/previews/renders.cjs
//
// Reads out/items.json and out/designs.json; writes out/shop/<product id>--<design id>.png for every pairing in
// selection.json ({ [product id]: [design ids] }, the owner's choices from the picker's database).
'use strict';
const fs = require('fs');
const path = require('path');
const kit = require('./kit.cjs');

const OUT = path.join(__dirname, 'out', 'shop');
const PANEL = '#F4F1EA';
const A = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'items.json'), 'utf8'));
const DESIGNS = new Map(JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'designs.json'), 'utf8')).map((d) => [d.id, d]));
const SELECTION = JSON.parse(fs.readFileSync(path.join(__dirname, 'selection.json'), 'utf8'));

function svgFor(p, chosen) {
  const d = DESIGNS.get((p.art && p.art[chosen.id]) || chosen.id);
  const it = A.items[p.item];
  if (!it) throw new Error(`no drawing for ${p.item}`);
  const C = A.canvas;
  const hat = it.category === 'hat', scale = hat ? A.hatPx : A.wearPx;
  const tx = C / 2, ty = hat ? (C - it.h * scale) / 2 : C - it.h * scale - 20;
  const at = (p.designAt && p.designAt[chosen.id]) || p.at;
  const a = it.anchors[at] || it.anchors[p.at];
  const big = A.big && A.big[at];
  const k = big ? Math.min(big.w / d.w, big.h / d.h) : 1;
  const x = a.x + ((p.shift && p.shift[chosen.id]) || 0);
  const art = `<g transform="translate(${x} ${a.y}) rotate(${a.rotate || 0})"><svg x="${(-d.w * k) / 2}" y="${(-d.h * k) / 2}" width="${d.w * k}" height="${d.h * k}" viewBox="${d.vb}" overflow="visible">${d.inner}</svg></g>`;
  const drawing = it.body + art + (it.over || '');   // drawcords hang over the embroidery
  let zoom = '';
  if (!hat && Math.max(d.w, d.h) * k <= 120) {
    const r = 118, cx = C - r - 14, cy = r + 14, Z = 165 / (Math.max(d.w, d.h) * scale);
    const mx = tx + x * scale, my = ty + a.y * scale, ring = Math.max(14, Math.max(d.w, d.h) * scale * 0.75);
    const dist = Math.hypot(cx - mx, cy - my), ux = (cx - mx) / dist, uy = (cy - my) / dist;
    const line = `stroke="${A.line}" stroke-width="1.5"`;
    zoom = `<style>.zoom *{vector-effect:non-scaling-stroke}</style><defs><clipPath id="zc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`
      + `<circle cx="${mx}" cy="${my}" r="${ring}" fill="none" ${line}/>`
      + `<line x1="${mx + ux * ring}" y1="${my + uy * ring}" x2="${cx - ux * r}" y2="${cy - uy * r}" ${line} stroke-dasharray="3 3"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.fabric}"/>`
      + `<g clip-path="url(#zc)"><g class="zoom" transform="translate(${cx} ${cy}) rotate(${-(a.rotate || 0)}) scale(${scale * Z}) translate(${-x} ${-a.y})">${drawing}</g></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${A.line}" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${C}" height="${C}" viewBox="0 0 ${C} ${C}"><rect width="${C}" height="${C}" fill="${PANEL}"/>`
    + `<g transform="translate(${tx} ${ty}) scale(${scale})">${drawing}</g>${zoom}</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [], missing = [];
  for (const [pid, designIds] of Object.entries(SELECTION)) {
    const p = A.products.find((x) => x.id === pid);
    if (!p) { missing.push(pid); continue; }
    for (const did of designIds) jobs.push({ out: path.join(OUT, `${pid}--${did}.png`), svg: svgFor(p, DESIGNS.get(did)) });
    // The back view, once per piece: its mark is the same whatever design is on the front.
    if (p.back && A.items[p.back.item]) jobs.push({ out: path.join(OUT, `${pid}--back.png`), svg: svgFor({ item: p.back.item, at: p.back.at }, DESIGNS.get(p.back.design)) });
  }
  await kit.render(jobs);
  console.log(`wrote ${jobs.length} images to ${OUT}${missing.length ? `; no drawing yet for ${missing.join(', ')}` : ''}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
