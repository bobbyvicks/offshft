// Quick previews for new phrase ideas: each phrase set in the logo's type (Unbounded Bold caps, 0.12 em, cap 7 mm,
// Ink letters with a Rust full stop, the same machinery as Punched Out. v3), on a 5-panel cap front and on a tee's
// left chest (stacked on two lines when one line is too wide for the chest). For choosing, not for production:
// production art for a picked phrase gets its own folder, build and sew-out checks like designs/09-punched-out/v3.
//
//   cd /home/user/offshft/tools && node ../designs/phrases/preview.cjs phrases.json out-dir
//
// phrases.json: [{ "text": "TOOLS DOWN." }, ...]
'use strict';
const fs = require('fs');
const path = require('path');
const PO = require('../09-punched-out/v3/build.cjs');
const LOGO = require('../mark/final/the-o/build.cjs');
const kit = require('../../store/previews/kit.cjs');

const [, , listFile, outDir] = process.argv;
const PHRASES = JSON.parse(fs.readFileSync(listFile, 'utf8'));
const CAP = 7, CHEST = 101.6;
const INK = LOGO.LIGHT.letters, ACCENT = LOGO.LIGHT.hands;
const box = (gs) => ({ x0: Math.min(...gs.map((g) => g.box.x0)), y0: Math.min(...gs.map((g) => g.box.y0)), x1: Math.max(...gs.map((g) => g.box.x1)), y1: Math.max(...gs.map((g) => g.box.y1)) });

// One line, or two centred lines split at the word break that makes them most even.
function art(text, stacked) {
  const { edits } = PO.letterEdits(CAP);
  let lines;
  if (!stacked) lines = [PO.setLine(text, 0, 0, CAP, edits)];
  else {
    const words = text.split(' ');
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      const d = Math.abs(a.length - b.length);
      if (!best || d < best.d) best = { a, b, d };
    }
    if (!best) return art(text, false);
    const top = PO.setLine(best.a, 0, 0, CAP, edits);
    const bot0 = PO.setLine(best.b, 0, 0, CAP, edits);
    const A = box(top), B = box(bot0.filter((g) => g.ch !== '.'));
    lines = [top, PO.setLine(best.b, (A.x0 + A.x1) / 2 - (B.x0 + B.x1) / 2, PO.LINE_GAP * CAP + CAP, CAP, edits)];
  }
  const all = lines.flat(), b = box(all);
  const ink = all.filter((g) => g.ch !== '.').map((g) => g.d).join(' ');
  const stop = all.filter((g) => g.ch === '.').map((g) => g.d).join(' ');
  return { w: b.x1 - b.x0, h: b.y1 - b.y0, svg: `<g transform="translate(${-b.x0} ${-b.y0})"><path fill="${INK}" fill-rule="evenodd" d="${ink}"/><path fill="${ACCENT}" d="${stop}"/></g>` };
}

// The picker's composition: the drawing at its scale, the artwork at true size on the anchor, a round close-up for clothes.
function shot(item, anchor, a) {
  const C = kit.CANVAS, hat = item.category === 'hat', scale = hat ? kit.HAT_PX : kit.WEAR_PX;
  const tx = C / 2, ty = hat ? (C - item.h * scale) / 2 : C - item.h * scale - 20;
  const p = item.anchors[anchor];
  const placed = `<g transform="translate(${p.x - a.w / 2} ${p.y - a.h / 2})">${a.svg}</g>`;
  const drawing = item.body + placed + (item.over || '');
  let zoom = '';
  if (!hat) {
    const r = 118, cx = C - r - 14, cy = r + 14, Z = 165 / (Math.max(a.w, a.h) * scale);
    const mx = tx + p.x * scale, my = ty + p.y * scale, ring = Math.max(14, Math.max(a.w, a.h) * scale * 0.75);
    const dist = Math.hypot(cx - mx, cy - my), ux = (cx - mx) / dist, uy = (cy - my) / dist, line = 'stroke="#2B3340" stroke-width="1.5"';
    zoom = `<style>.zoom *{vector-effect:non-scaling-stroke}</style><defs><clipPath id="zc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`
      + `<circle cx="${mx}" cy="${my}" r="${ring}" fill="none" ${line}/><line x1="${mx + ux * ring}" y1="${my + uy * ring}" x2="${cx - ux * r}" y2="${cy - uy * r}" ${line} stroke-dasharray="3 3"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${kit.STYLE.fabric}"/><g clip-path="url(#zc)"><g class="zoom" transform="translate(${cx} ${cy}) scale(${scale * Z}) translate(${-p.x} ${-p.y})">${drawing}</g></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2B3340" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${C}" height="${C}" viewBox="0 0 ${C} ${C}"><rect width="${C}" height="${C}" fill="#F4F1EA"/><g transform="translate(${tx} ${ty}) scale(${scale})">${drawing}</g>${zoom}</svg>`;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const cap5 = require('../../store/previews/items/five-panel.cjs')(kit);
  const tee = require('../../store/previews/items/tee.cjs')(kit);
  const jobs = [], sizes = [];
  PHRASES.forEach((ph, i) => {
    const line = art(ph.text, false);
    const chest = line.w <= CHEST - 12 ? line : art(ph.text, true);
    const slug = `${String(i + 1).padStart(2, '0')}`;
    jobs.push({ out: path.join(outDir, `${slug}-hat.png`), svg: shot(cap5, 'front', line) });
    jobs.push({ out: path.join(outDir, `${slug}-tee.png`), svg: shot(tee, 'chest', chest) });
    sizes.push({ text: ph.text, hat: `${line.w.toFixed(1)} x ${line.h.toFixed(1)} mm`, chest: `${chest.w.toFixed(1)} x ${chest.h.toFixed(1)} mm` });
  });
  await kit.render(jobs);
  fs.writeFileSync(path.join(outDir, 'sizes.json'), JSON.stringify(sizes, null, 1));
  console.log(sizes.map((s) => `${s.text}: hat ${s.hat}, chest ${s.chest}`).join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
