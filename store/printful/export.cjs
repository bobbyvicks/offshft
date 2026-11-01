// Print files for Printful: each embroidery drawing exported at its true size as a transparent PNG (Printful's design
// maker reads PNG; the DPI is written into the file so the size comes through), plus the SVG it came from.
//   cd /home/user/offshft/tools && node ../store/printful/export.cjs
// Reads files.json ([{ name, source, widthMM, heightMM, ... }], source relative to the repo root) and writes files/.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = '/home/user/offshft';
const DIR = __dirname;
const DPI = +(process.env.DPI || 300);

(async () => {
  const list = JSON.parse(fs.readFileSync(path.join(DIR, 'files.json'), 'utf8'));
  const out = path.join(DIR, 'files');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const report = [];
  for (const f of list) {
    const svgPath = path.join(ROOT, f.source);
    const src = fs.readFileSync(svgPath, 'utf8');
    const vb = src.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);
    const w = vb[2], h = vb[3];                              // mm (every drawing here is in mm)
    const pxW = Math.round((w / 25.4) * DPI), pxH = Math.round((h / 25.4) * DPI);
    const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    await p.setContent(`<html><body style="margin:0;background:transparent"><svg id="a" xmlns="http://www.w3.org/2000/svg" width="${pxW}" height="${pxH}" viewBox="${vb.join(' ')}" style="display:block">${inner}</svg></body></html>`);
    const png = path.join(out, `${f.name}.png`);
    await (await p.$('#a')).screenshot({ path: png, omitBackground: true });
    // write the DPI into the PNG so programs that read it see the true size
    execFileSync('convert', [png, '-units', 'PixelsPerInch', '-density', String(DPI), png]);
    fs.copyFileSync(svgPath, path.join(out, `${f.name}.svg`));
    report.push({ name: f.name, source: f.source, mm: `${w.toFixed(2)} x ${h.toFixed(2)}`, inches: `${(w / 25.4).toFixed(2)} x ${(h / 25.4).toFixed(2)}`, px: `${pxW} x ${pxH}` });
  }
  await b.close();
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(report, null, 1) + '\n');
  execFileSync('zip', ['-q', '-j', '-r', path.join(DIR, 'offshft-printful-files.zip'), out], { stdio: 'inherit' });
  console.log(`exported ${report.length} designs at ${DPI} dpi`);
})();
