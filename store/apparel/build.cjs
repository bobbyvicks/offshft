// Placement renders for the first apparel drop (store/apparel-plan.md, section 5).
//
// Each decoration is drawn at true size, centred on a flat 110 x 80 mm swatch of the garment colour, at 8 px per mm
// (the same scale as the hat previews in designs/). Swatches only: no garment drawings, no mockups.
// The artwork comes from the final logo build (designs/mark/final/the-o/build.cjs), so it can't drift from the logo
// files, and each size is checked against the floors in designs/mark/final/the-o/notes.md before anything is drawn.
//
// Run it from the tools folder, so the node modules load:
//   cd /home/user/offshft/tools && node ../store/apparel/build.cjs
//
// Writes store/apparel/<placement>-<colour>.png and store/apparel/sheet.png, nothing else. The SVGs it renders from
// go to a temporary folder and are deleted; the files to upload to Printful are the ones in designs/mark/final/the-o/.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const FINAL = '/home/user/offshft/designs/mark/final/the-o';
const A = B.FONTS.unbounded;
const SWATCH = { w: 110, h: 80 }; // mm of fabric
const PX = 4;                     // kit.render shoots at 2x, so the PNGs are 8 px per mm

// Garment colours. Printful's real swatches couldn't be opened, so each blank colour is shown on the brand fabric it
// stands in for (store/research/apparel.md, Colours). The real Navy is bluer than Slate.
const COLOURS = {
  bone:   { label: 'Bone (Printful Dust)',     fabric: kit.F.bone,   thread: B.LIGHT }, // Ink letters and ring, Rust hands
  spruce: { label: 'Spruce (Printful Forest)', fabric: kit.F.spruce, thread: B.DARK },  // Bone letters and ring, Sun hands
  navy:   { label: 'Navy (shown on Slate)',    fabric: kit.F.slate,  thread: B.DARK },
};

// The artwork. Symbol channel as in the logo build: 1.0 mm under 25 mm, 1.2 mm from 25 mm, 1.5 mm from 35 mm.
const symbolChannel = (h) => (h >= 35 ? 1.5 : h >= 25 ? 1.2 : undefined);
const ART = {
  lockup:   { what: 'lockup, cap 7 mm', cap: 7, make: (t) => B.lockup(A, 7, t),
              final: { light: 'logo-light.svg', dark: 'logo-dark.svg' } },
  symbol25: { what: 'symbol, 25 mm tall', height: 25, make: (t) => B.symbol(A, 25, t, { channel: symbolChannel(25) }),
              final: { light: 'symbol-light.svg', dark: 'symbol-dark.svg' } },
  symbol40: { what: 'symbol, 40 mm tall', height: 40, make: (t) => B.symbol(A, 40, t, { channel: symbolChannel(40) }),
              final: { light: 'symbol-light-40mm.svg' } },
};

// Where each one goes (store/apparel-plan.md, section 1). Rows of the contact sheet; null leaves a gap in the grid.
const RENDERS = [
  { name: 'chest',    art: 'lockup',   where: 'hoodie and crewneck, left chest',   colours: ['bone', 'spruce', 'navy'] },
  { name: 'wrist',    art: 'symbol25', where: 'hoodie and crewneck, left wrist',   colours: ['bone', 'spruce', 'navy'] },
  { name: 'leg',      art: 'symbol25', where: 'sweatpants, front left leg',        colours: ['bone', null, 'navy'] },
  { name: 'leg-40mm', art: 'symbol40', where: 'sweatpants, larger leg option',     colours: ['bone', null, 'navy'] },
];

// Floors from designs/mark/final/the-o/notes.md (two-colour versions).
function checkFloors(key, a, d) {
  if (a.cap !== undefined) {
    if (a.cap < 6.6) throw new Error(`${key}: lockup cap ${a.cap} mm is under the 6.6 mm floor`);
    if (a.cap >= 7 && !d.dot) throw new Error(`${key}: a two-colour lockup from cap 7 should keep its pivot dot`);
  }
  if (a.height !== undefined && a.height < 19) {
    throw new Error(`${key}: symbol ${a.height} mm is under the 19 mm floor. Below 19 mm use the side master (side-*.svg), never a scaled symbol`);
  }
}

// kit.render shrinks anything wider than 80% or taller than 70% of the swatch. Refuse instead, so every PNG is true size.
function checkTrueSize(key, d) {
  if (d.w > 0.8 * SWATCH.w || d.h > 0.7 * SWATCH.h) throw new Error(`${key}: ${d.w.toFixed(1)} x ${d.h.toFixed(1)} mm won't show at true size on a ${SWATCH.w} x ${SWATCH.h} mm swatch`);
}

// Is the generated artwork byte-for-byte the final file the owner approved?
function compareFinal(a, tone, d) {
  const f = a.final[tone];
  if (!f) return `no ${tone} file at this size in the-o/ yet; generate it with the logo build before uploading`;
  return fs.readFileSync(path.join(FINAL, f), 'utf8') === kit.svgDoc(d) ? `same as the-o/${f}` : `DIFFERS from the-o/${f}: rebuild the logo first`;
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'offshft-apparel-'));
  const grid = [];
  try {
    for (const r of RENDERS) {
      const a = ART[r.art];
      for (const c of r.colours) {
        if (!c) { grid.push(null); continue; }
        const col = COLOURS[c], key = `${r.name}-${c}`;
        const d = a.make(col.thread);
        checkFloors(key, a, d);
        checkTrueSize(key, d);
        const svg = kit.writeSvg(path.join(tmp, `${key}.svg`), d);
        const png = path.join(OUT, `${key}.png`);
        await kit.render(svg, png, { bg: col.fabric, tile: `${SWATCH.w}x${SWATCH.h}`, px: PX, twill: false });
        const size = `${d.w.toFixed(1)} x ${d.h.toFixed(1)} mm`;
        grid.push({ png, label: `${r.name}: ${r.where}\n${col.label}\n${a.what}, ${size}` });
        console.log(`${path.basename(png).padEnd(22)} ${size.padEnd(16)} ${compareFinal(a, col.thread.name, d)}`);
      }
    }
  } finally {
    await kit.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // Contact sheet: one row per placement, one column per colour, every swatch at the same 8 px per mm. The tile size
  // must be given, or montage squeezes the null: gaps to nothing; '>' means a swatch is never resized.
  const tile = `${SWATCH.w * PX * 2}x${SWATCH.h * PX * 2}>+12+12`;
  const args = grid.flatMap((g) => (g ? ['-label', g.label, g.png] : ['-label', '', 'null:']));
  execFileSync('montage', [...args, '-tile', '3x', '-geometry', tile, '-pointsize', '18', '-background', '#d9d4c8', '-depth', '8', path.join(OUT, 'sheet.png')]);
  console.log(`sheet.png              ${grid.filter(Boolean).length} swatches, ${SWATCH.w} x ${SWATCH.h} mm each`);
})().catch((e) => { console.error(e); process.exit(1); });
