// Only builds the four next-round drafts. Run: node designs/build-next-round.cjs
// Requires the repo's opentype/clipper dependencies and already-installed Sharp
// (resolve Sharp through the current Node environment or NODE_PATH).
'use strict';
const fs = require('fs');
const path = require('path');
const kit = require('../tools/kit/kit.cjs');
const ClipperLib = require('../tools/node_modules/clipper-lib');
const sharp = require('sharp');

const FONT = kit.font('unbounded');
const TRACK = 0.12;
const PHOTO_NOTE = 'Selected review photo: `mockup-v2.png`, generated with artwork-only references. The initial `mockup.png` is preserved as a historical iteration and is not the selected review image. SVG geometry and millimetre dimensions govern the exact artwork; mockup scale, placement and fabric appearance are approximate. Decimal measurements describe vector geometry, not manufacturing tolerances.';
const n = v => String(Math.round(v * 1000) / 1000);
const SC = 64;

// Canonical contour union and S-terminal treatment, reused from
// designs/mark/final/the-o/build.cjs. Kept local because that older module has
// machine-specific imports; the master and its geometry are never modified.
function contoursOf(glyph, upm) {
  const out = []; let cur = null, x0 = 0, y0 = 0;
  const STEPS = 24;
  for (const c of glyph.getPath(0, 0, upm).commands) {
    if (c.type === 'M') { cur = [[c.x, c.y]]; out.push(cur); x0 = c.x; y0 = c.y; }
    else if (c.type === 'L') { cur.push([c.x, c.y]); x0 = c.x; y0 = c.y; }
    else if (c.type === 'Q') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * x0 + 2 * u * t * c.x1 + t * t * c.x, u * u * y0 + 2 * u * t * c.y1 + t * t * c.y]); } x0 = c.x; y0 = c.y; }
    else if (c.type === 'C') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * u * x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x, u * u * u * y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y]); } x0 = c.x; y0 = c.y; }
  }
  return out.filter(c => c.length > 2);
}
const toClip = cs => cs.map(c => c.map(([x, y]) => ({ X: Math.round(x * SC), Y: Math.round(y * SC) })));
function clip(op, subj, clips = []) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  if (clips.length) c.AddPaths(clips, ClipperLib.PolyType.ptClip, true);
  const sol = new ClipperLib.Paths();
  c.Execute(op, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return sol;
}
const rect = (x0, y0, x1, y1) => [{ X: x0 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y1 * SC }, { X: x0 * SC, Y: y1 * SC }];
const sTrimMM = cap => ({ upper: Math.max(0, 0.36 - 0.1 * (cap - 7)), lower: Math.max(0, 0.41 - 0.1 * (cap - 7)) });
function glyphMM(ch, x, baseY, cap) {
  const k = cap / FONT.tables.os2.sCapHeight;
  let paths = clip(ClipperLib.ClipType.ctUnion, toClip(contoursOf(FONT.charToGlyph(ch), FONT.unitsPerEm)));
  if (ch === 'S') {
    const t = sTrimMM(cap), up = t.upper / k, lo = t.lower / k;
    paths = clip(ClipperLib.ClipType.ctDifference, paths, [rect(560, -(519 + up), 4000, -519), rect(-4000, -246, 260, -(246 - lo))]);
  }
  const pts = [];
  const d = paths.map(p => 'M' + p.map(({ X, Y }) => {
    const xx = x + X / SC * k, yy = baseY + Y / SC * k;
    pts.push([xx, yy]); return `${n(xx)} ${n(yy)}`;
  }).join(' L') + ' Z').join(' ');
  return { ch, d, pts };
}
const bounds = pts => ({ x0: Math.min(...pts.map(p => p[0])), y0: Math.min(...pts.map(p => p[1])), x1: Math.max(...pts.map(p => p[0])), y1: Math.max(...pts.map(p => p[1])) });

const DRAFTS = [
  { folder: '11-time-well-earned', title: 'TIME WELL EARNED.', lines: ['TIME', 'WELL', 'EARNED.'], width: 95, gap: 0.48, placement: 'Three left-aligned lines, approximately 95 mm wide on the chest of a Blue Spruce Comfort Colors 1717 tee. Use the dark-garment Bone/Sun artwork.', technique: 'Chest embroidery concept; digitizer must choose suitable fill for the wider strokes.', clearance: 'Exact phrase appears on a retirement ornament SVG; no exact apparel result surfaced in the preliminary indexed search.' },
  { folder: '12-the-rest-is-ours', title: 'THE REST IS OURS.', lines: ['THE REST', 'IS OURS.'], width: 240, gap: 0.48, placement: 'Two left-aligned lines, approximately 240 mm wide on the upper back of a Blue Jean Comfort Colors 1467 hoodie. Use the light-garment Ink/Rust artwork. Separate front application specification: use the unchanged canonical logo-light.svg at its native 62.64 mm width on the left chest. The selected mockup-v2.png photo shows the back only; the front application is not visible in that image. A cream/Bone flat preview is also included.', technique: 'Upper-back print concept, not a small embroidery placement.', clearance: 'Exact title appears in commercial art and music; no exact apparel result surfaced in the preliminary indexed search.' },
  { folder: '13-ours-to-spend', title: 'OURS TO SPEND.', lines: ['OURS TO', 'SPEND.'], width: 85, gap: 0.48, placement: 'Two left-aligned lines, approximately 85 mm wide on the front of an Evergreen Yupoong 6606 trucker. Use the dark-garment Bone/Sun artwork. Check the centre seam against the actual letters; the logo-specific seam shift does not automatically apply to this phrase.', technique: 'Hat embroidery concept. Minimum 7 mm cap height is enforced by this build.', clearance: 'No exact apparel result surfaced in the preliminary indexed search. This is not evidence of availability.' },
  { folder: '14-five-oclock', title: '5:00', lines: ['5:00'], width: 115, gap: 0, placement: 'One line, approximately 115 mm wide, centred on the chest of an Ivory Comfort Colors 1466 crewneck. Use the light-garment Ink digits/Rust colon artwork.', technique: 'Centre-chest low-profile embroidery concept; ordinary numerals with an accent colon, no frame or icon. The digitizer must choose a suitable fill for the larger strokes; production readiness requires a sew-out on the actual blank.', clearance: 'Related five-o’clock apparel exists; CIPO record 2309805 / TMA1279674 covers 5 O’CLOCK PICKLEBALL including hats and clothing. Plain 5:00 is not legally cleared.' },
];

function compose(spec, cap) {
  const glyphs = [], lineMetrics = [];
  for (let line = 0; line < spec.lines.length; line++) {
    const str = spec.lines[line];
    const t = kit.text(str, { font: 'unbounded', cap, track: TRACK, x: 0, y: 0 });
    const gs = [...str].flatMap((ch, i) => ch === ' ' ? [] : [glyphMM(ch, t.letters[i].x, 0, cap)]);
    const b = bounds(gs.flatMap(g => g.pts));
    const dx = -b.x0, dy = line * cap * (1 + spec.gap);
    gs.forEach(g => { g.transform = `translate(${n(dx)} ${n(dy)})`; g.pts = g.pts.map(([x, y]) => [x + dx, y + dy]); });
    glyphs.push(...gs);
    lineMetrics.push({ text: str, inkWidthMm: +(b.x1 - b.x0).toFixed(3) });
  }
  const box = bounds(glyphs.flatMap(g => g.pts));
  return { glyphs, box, w: box.x1 - box.x0, h: box.y1 - box.y0, lineMetrics };
}
function makeSvg(spec, art, palette) {
  const body = art.glyphs.map((g, i) => `<path id="glyph-${i + 1}" data-character="${g.ch}" transform="${g.transform}" fill="${g.ch === '.' || g.ch === ':' ? palette.accent : palette.letters}" fill-rule="evenodd" d="${g.d}"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n(art.w)}mm" height="${n(art.h)}mm" viewBox="0 0 ${n(art.w)} ${n(art.h)}">\n<title>${spec.title} — OFF SHFT draft</title>\n<desc>Outlined Unbounded Bold, 0.12em tracking. Intended artwork width ${n(art.w)} mm. Draft, not a production stitch file.</desc>\n<g transform="translate(${n(-art.box.x0)} ${n(-art.box.y0)})">\n${body}\n</g>\n</svg>\n`;
}
async function render(svg, out, bg) {
  const art = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const [, , w, h] = art;
  const pad = bg ? Math.max(w * 0.25, 18) : 3;
  const tileW = w + 2 * pad, tileH = bg ? Math.max(h + 2 * pad, tileW * 0.625) : h + 2 * pad;
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="${Math.round(1800 * tileH / tileW)}" viewBox="0 0 ${n(tileW)} ${n(tileH)}">${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}<g transform="translate(${n(pad)} ${n((tileH - h) / 2)})">${inner}</g></svg>`;
  let raster = sharp(Buffer.from(doc));
  if (bg) raster = raster.flatten({ background: bg });
  await raster.png().toFile(out);
}

(async () => {
  for (const spec of DRAFTS) {
    const dir = path.join(__dirname, spec.folder);
    let cap = 7;
    for (let i = 0; i < 4; i++) cap *= spec.width / compose(spec, cap).w;
    const art = compose(spec, cap);
    if (cap < 7 || Math.abs(art.w - spec.width) > 0.01) throw new Error(`Invalid size for ${spec.folder}`);
    const dark = makeSvg(spec, art, { letters: kit.T.bone, accent: kit.T.sun });
    const light = makeSvg(spec, art, { letters: kit.T.ink, accent: kit.T.rust });
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'design.svg'), dark);
    fs.writeFileSync(path.join(dir, 'design-light.svg'), light);
    await render(dark, path.join(dir, 'design-dark.png'));
    await render(light, path.join(dir, 'design-light.png'));
    await render(dark, path.join(dir, 'preview-spruce.png'), kit.F.spruce);
    await render(light, path.join(dir, 'preview-bone.png'), kit.F.bone);
    const metrics = { draft: true, title: spec.title, font: 'tools/fonts/Unbounded-Bold.ttf', trackingEm: TRACK, artworkWidthMm: +art.w.toFixed(3), artworkHeightMm: +art.h.toFixed(3), capHeightMm: +cap.toFixed(3), baselineStepMm: +(cap * (1 + spec.gap)).toFixed(3), sTerminalTrimMm: sTrimMM(cap), glyphCount: art.glyphs.length, lines: art.lineMetrics };
    fs.writeFileSync(path.join(dir, 'measurements.json'), JSON.stringify(metrics, null, 2) + '\n');
    const notes = `# ${spec.title}\n\nDraft concept for owner review; not approved for production or sale.\n\n${spec.placement}\n\n- Artwork: **${n(art.w)} × ${n(art.h)} mm**, cap height **${n(cap)} mm**.\n- ${spec.technique}\n- Unbounded Bold from \`tools/fonts/Unbounded-Bold.ttf\`, tracking 0.12em. Every glyph is an editable outlined path with overlapping contours unioned. The canonical S-terminal rule is applied at this actual size (upper/lower trims ${n(metrics.sTerminalTrimMm.upper)}/${n(metrics.sTerminalTrimMm.lower)} mm).\n- Dark garment: Bone #ECE5D3 letters/digits, Sun #D29B3C punctuation. Light garment: Ink #1F2733 letters/digits, Rust #B4552D punctuation.\n- Flat previews use brand Bone #E4DDCB and Spruce #2E3D35 backgrounds; these are colour references, not fabric-stock or stitch simulations.\n\nFiles: \`design.svg\` is the dark-garment main; \`design-light.svg\` is the light-garment version. \`design-dark.png\` and \`design-light.png\` are transparent reference renders with 3 mm equivalent padding. \`preview-bone.png\` and \`preview-spruce.png\` are flat previews. \`measurements.json\` records the generated dimensions.\n\n${PHOTO_NOTE}\n\nNo logo signoff is embedded. Any accompanying brand mark must use the exact separate [final master SVG](../mark/final/the-o/) unchanged. Do not replace letters or zeros with the clock.\n\n${spec.clearance} See [research and sources](../next-round-research.md). Searches were preliminary and indexed, not a legal clearance. A production proof/sample and appropriate clearance review are still required. Embroidery requires digitization for this size and a sew-out on the actual blank; printing requires a physical colour/placement proof.\n\nRebuild only these drafts from the repo root: \`node designs/build-next-round.cjs\`. Before running, Sharp must already resolve in the selected Node environment or through NODE_PATH pointing to its installed node_modules directory. This is a required runtime prerequisite; the script installs nothing. Canonical logo files are not changed.\n`;
    fs.writeFileSync(path.join(dir, 'notes.md'), notes);
    console.log(JSON.stringify(metrics));
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
