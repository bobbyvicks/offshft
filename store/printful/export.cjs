// Print files for Printful, from the same drawings as everything else. For each design in files.json:
//   embroidery/<name>.png  true size, 600 dpi, transparent, recoloured to Printful's own thread colours, so its
//                          colour match lands on the right threads (brand Ink -> 1800 Black, Rust -> 1987 Orange,
//                          Bone -> 1801 White, Sun -> 1672 Old Gold). Never scaled: each size is its own drawing.
//   print/<name>.png       brand colours, 300 dpi, transparent, at widthMM if given (print can scale).
//   svg/<name>.svg         the drawing itself, brand colours.
// Run: cd /home/user/offshft/tools && node ../store/printful/export.cjs
// files.json: [{ name, source (repo-relative SVG in mm), widthMM? (print size, print only), printOnly?, recolour? }]
//   recolour: { "#from": "#to" } in brand colours, only where a drawing's one-colour version is the same artwork
//   (Punched Out.: "one colour is the same artwork with the full stop in the letter thread", v3 notes). Never for the
//   logo or the clock: their one-colour versions are their own drawings.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const DIR = __dirname;
const DPI = { embroidery: 600, print: 300 };
const BRAND = ['#1F2733', '#B4552D', '#ECE5D3', '#D29B3C'];                 // Ink, Rust, Bone, Sun
const THREAD = { '#1F2733': '#000000', '#B4552D': '#E25C27', '#ECE5D3': '#FFFFFF', '#D29B3C': '#A67843' };
const THREAD_NAME = { '#000000': '1800 Black', '#E25C27': '1987 Orange', '#FFFFFF': '1801 White', '#A67843': '1672 Old Gold' };

const README = `OFF SHFT print files for Printful

embroidery/  Upload these for embroidered products. True size, 600 dpi, transparent.
             Coloured in Printful's own thread colours, so its colour match should pick the right threads
             (check them every time):
             black = 1800 Black, orange = 1987 Orange, white = 1801 White, gold = 1672 Old Gold.
             Set the width in Printful's editor to the size in sizes.json. Never resize: each size is its own drawing.
print/       Upload these for printed products. Brand colours, 300 dpi, transparent.
svg/         The drawings (vector, brand colours), for anyone who needs the source.
sizes.json   Every file's size in mm, inches and pixels.
`;

// ImageMagick writes date:create/modify/timestamp text chunks; drop them (and tIME) so exports are byte-stable
function stripDates(file) {
  const d = fs.readFileSync(file), out = [d.subarray(0, 8)];
  for (let i = 8; i < d.length;) {
    const n = d.readUInt32BE(i), type = d.toString('latin1', i + 4, i + 8), end = i + 12 + n;
    const key = type === 'tEXt' ? d.toString('latin1', i + 8, i + 8 + Math.min(n, 15)) : '';
    if (!(type === 'tIME' || (type === 'tEXt' && key.startsWith('date:')))) out.push(d.subarray(i, end));
    i = end;
  }
  fs.writeFileSync(file, Buffer.concat(out));
}

(async () => {
  const list = JSON.parse(fs.readFileSync(path.join(DIR, 'files.json'), 'utf8'));
  const out = path.join(DIR, 'files');
  fs.rmSync(out, { recursive: true, force: true });
  for (const d of ['embroidery', 'print', 'svg']) fs.mkdirSync(path.join(out, d), { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const render = async (vb, inner, pxW, pxH, png, dpi) => {
    await p.setContent(`<html><body style="margin:0;background:transparent"><svg id="a" xmlns="http://www.w3.org/2000/svg" width="${pxW}" height="${pxH}" viewBox="${vb.join(' ')}" style="display:block">${inner}</svg></body></html>`);
    await (await p.$('#a')).screenshot({ path: png, omitBackground: true });
    // true size in the file; no date chunks, so the same drawing always exports the same bytes
    execFileSync('convert', [png, '-units', 'PixelsPerInch', '-density', String(dpi), png]);
    stripDates(png);
  };
  const report = [];
  const seen = new Set();
  for (const f of list) {
    if (seen.has(f.name)) throw new Error(`duplicate name ${f.name}`);
    seen.add(f.name);
    const svgPath = path.join(ROOT, f.source);
    let src = fs.readFileSync(svgPath, 'utf8');
    if (f.recolour) {
      if (/designs\/mark\//.test(f.source)) throw new Error(`${f.name}: the logo and clock have their own one-colour drawings; don't recolour them`);
      for (const [from, to] of Object.entries(f.recolour)) {
        if (!BRAND.includes(from) || !BRAND.includes(to)) throw new Error(`${f.name}: recolour must map brand colours`);
        const re = new RegExp(from, 'gi');
        if (!re.test(src)) throw new Error(`${f.name}: ${from} not in ${f.source}`);
        src = src.replace(new RegExp(from, 'gi'), to);
      }
    }
    const hexes = [...new Set((src.match(/#[0-9A-Fa-f]{6}\b/g) || []).map((h) => h.toUpperCase()))];
    const odd = hexes.filter((h) => !BRAND.includes(h));
    if (odd.length) throw new Error(`${f.source}: colours outside the brand set: ${odd.join(', ')}`);
    if (/<(image|text)\b|stroke=|opacity/.test(src)) throw new Error(`${f.source}: has strokes, opacity, text or images`);
    const vb = src.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);
    const w = vb[2], h = vb[3];                                                    // mm (every drawing here is in mm)
    const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const row = { name: f.name, source: f.source, ...(f.recolour ? { recolour: f.recolour } : {}), sha256: crypto.createHash('sha256').update(src).digest('hex').slice(0, 8),
      mm: `${w.toFixed(2)} x ${h.toFixed(2)}`, inches: `${(w / 25.4).toFixed(2)} x ${(h / 25.4).toFixed(2)}` };
    if (!f.printOnly) {
      const threadInner = inner.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => THREAD[m.toUpperCase()]);
      const pxW = Math.round((w / 25.4) * DPI.embroidery), pxH = Math.round((h / 25.4) * DPI.embroidery);
      await render(vb, threadInner, pxW, pxH, path.join(out, 'embroidery', `${f.name}.png`), DPI.embroidery);
      row.embroidery = { px: `${pxW} x ${pxH}`, dpi: DPI.embroidery, threads: hexes.map((x) => THREAD_NAME[THREAD[x]]) };
    }
    const pw = f.widthMM || w, ph = (h * pw) / w;
    const pxW = Math.round((pw / 25.4) * DPI.print), pxH = Math.round((ph / 25.4) * DPI.print);
    await render(vb, inner, pxW, pxH, path.join(out, 'print', `${f.name}.png`), DPI.print);
    row.print = { mm: `${pw.toFixed(2)} x ${ph.toFixed(2)}`, inches: `${(pw / 25.4).toFixed(2)} x ${(ph / 25.4).toFixed(2)}`, px: `${pxW} x ${pxH}`, dpi: DPI.print };
    fs.writeFileSync(path.join(out, 'svg', `${f.name}.svg`), src);
    report.push(row);
  }
  await b.close();
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(report, null, 1) + '\n');
  fs.writeFileSync(path.join(out, 'README.txt'), README);
  const zip = path.join(DIR, 'offshft-printful-files.zip');
  fs.rmSync(zip, { force: true });
  execFileSync('zip', ['-q', '-X', '-r', zip, 'README.txt', 'sizes.json', 'embroidery', 'print', 'svg'], { cwd: out, stdio: 'inherit' });
  console.log(`exported ${report.length} designs (${report.filter((r) => r.embroidery).length} embroidery, ${report.length} print)`);
})().catch((e) => { console.error(e); process.exit(1); });
