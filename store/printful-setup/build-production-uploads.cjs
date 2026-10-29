/* Deterministic format conversion only. The approved SVG bytes remain unchanged. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, 'production-uploads');
const DPI = 600;
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const palette = { light: ['#1F2733', '#B4552D'], dark: ['#ECE5D3', '#D29B3C'], bone: ['#ECE5D3'] };
const suffix = { light: 'ink-rust', dark: 'bone-sun', bone: 'bone' };
const concepts = JSON.parse(fs.readFileSync(path.join(ROOT, 'designs/next-round-colourways/colourways.json'), 'utf8')).concepts;
const artSpecs = [];
for (const concept of concepts) {
  for (const [key, sources] of Object.entries(concept.artwork)) {
    const mm = concept.widthMm;
    artSpecs.push({
      id: `${concept.id}-${suffix[key]}-${mm}mm`, conceptId: concept.id, paletteKey: key,
      sourceSvg: path.resolve(ROOT, 'designs/next-round-colourways', sources.svg),
      referencePng: path.resolve(ROOT, 'designs/next-round-colourways', sources.png),
      intendedWidthMm: mm,
    });
  }
}
for (const key of ['light', 'dark']) {
  artSpecs.push({ id: `off-shft-front-logo-${suffix[key]}-62.64mm`, conceptId: '12-the-rest-is-ours-front', paletteKey: key,
    sourceSvg: path.join(ROOT, `designs/mark/final/the-o/logo-${key}.svg`),
    referencePng: path.join(ROOT, `designs/brand-system/assets/logo-${key}.png`), intendedWidthMm: 62.64 });
}

async function main() {
  fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'svg'), { recursive: true });
  const files = [];
  for (const spec of artSpecs) {
    const svgBytes = fs.readFileSync(spec.sourceSvg);
    const svg = svgBytes.toString('utf8');
    if (/<(?:text|image)\b|(?:href|xlink:href)=/i.test(svg)) throw new Error(`Unexpected font/image dependency: ${spec.id}`);
    const width = Number(svg.match(/<svg[^>]*\bwidth="([\d.]+)mm"/)[1]);
    const height = Number(svg.match(/<svg[^>]*\bheight="([\d.]+)mm"/)[1]);
    if (width !== spec.intendedWidthMm) throw new Error(`Width differs: ${spec.id}`);
    const png = path.join(OUT, 'png', spec.id + '.png');
    const vector = path.join(OUT, 'svg', spec.id + '.svg');
    fs.writeFileSync(vector, svgBytes);
    // Explicit raster canvas avoids this libvips build double-applying density to SVG mm units.
    // Only the in-memory outer width/height change; all paths, transforms and viewBox stay exact.
    const rasterWidth = Math.round(width / 25.4 * DPI);
    const rasterHeight = Math.round(height / 25.4 * DPI);
    const rasterSvg = svg.replace(/(<svg[^>]*\bwidth=")[\d.]+mm"/, `$1${rasterWidth}px"`)
      .replace(/(<svg[^>]*\bheight=")[\d.]+mm"/, `$1${rasterHeight}px"`);
    await sharp(Buffer.from(rasterSvg), { density: 72 }).ensureAlpha().withMetadata({ density: DPI })
      .png({ compressionLevel: 9 }).toFile(png);
    const meta = await sharp(png).metadata();
    const original = await sharp(spec.referencePng).metadata();
    if (!meta.hasAlpha || meta.space !== 'srgb') throw new Error(`Expected transparent sRGB: ${spec.id}`);
    if (meta.width !== rasterWidth || meta.height !== rasterHeight) throw new Error(`Unexpected raster dimensions: ${spec.id}`);
    if (sha(fs.readFileSync(spec.sourceSvg)) !== sha(svgBytes) || sha(fs.readFileSync(vector)) !== sha(svgBytes)) throw new Error(`Source/vector altered: ${spec.id}`);
    files.push({ id: spec.id, conceptId: spec.conceptId, paletteKey: spec.paletteKey,
      sourceSvg: relative(spec.sourceSvg), sourceSvgSha256: sha(svgBytes),
      sourceReferencePng: relative(spec.referencePng), sourceReferencePngSha256: sha(fs.readFileSync(spec.referencePng)),
      sourceReferencePixels: [original.width, original.height], sourceReferenceDpiMetadata: original.density || null,
      svg: relative(vector), svgSha256: sha(fs.readFileSync(vector)), png: relative(png), pngSha256: sha(fs.readFileSync(png)),
      pixels: [meta.width, meta.height], dpiMetadata: meta.density, colourSpace: meta.space, hasAlpha: meta.hasAlpha,
      physicalWidthMm: width, physicalHeightMm: height, physicalWidthInches: width / 25.4,
      physicalHeightInches: height / 25.4, effectiveDpiAtIntendedWidth: meta.width * 25.4 / width,
      colourHexes: palette[spec.paletteKey], conversion: 'Native SVG viewport rasterized at 600 DPI; no padding, crop, path edit or colour remap.',
      bytes: fs.statSync(png).size, status: 'Upload-format ready; embroidery still requires supplier digitization and thread confirmation.' });
  }
  const mappings = concepts.map(concept => ({ conceptId: concept.id, title: concept.title, garment: concept.garment,
    sizeRange: concept.id.startsWith('13-') ? ['One size'] : ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    placement: concept.placement,
    colourways: concept.colourways.map(cw => {
      const f = files.find(x => x.conceptId === concept.id && x.paletteKey === cw.artwork);
      const item = { colour: cw.name, artworkId: f.id, png: f.png, svg: f.svg,
        physicalWidthMm: f.physicalWidthMm, physicalHeightMm: f.physicalHeightMm, palette: f.colourHexes };
      if (concept.id.startsWith('12-')) {
        const front = files.find(x => x.conceptId === '12-the-rest-is-ours-front' && x.paletteKey === (cw.name === 'Pepper' ? 'dark' : 'light'));
        item.frontLogo = { artworkId: front.id, png: front.png, svg: front.svg, physicalWidthMm: front.physicalWidthMm,
          physicalHeightMm: front.physicalHeightMm, placement: "Wearer's left chest", palette: front.colourHexes };
      }
      return item;
    }) }));
  const manifest = { version: 1, purpose: 'Exact-art production upload handoff; no supplier upload or digitization performed.',
    sourceColourways: 'designs/next-round-colourways/colourways.json',
    sourceColourwaysSha256: sha(fs.readFileSync(path.join(ROOT, 'designs/next-round-colourways/colourways.json'))),
    renderer: { sharp: sharp.versions.sharp, vips: sharp.versions.vips, dpi: DPI },
    pathBase: 'Repository root', uniqueArtworkFiles: files.length, colourwayCount: 16, decoratedColourwayPlacements: 20,
    artworkColourRemappingApplied: false, files, mappings };
  fs.writeFileSync(path.join(__dirname, 'production-artwork-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ files: files.length, colourways: 16, placements: 20,
    pngBytes: files.reduce((sum, f) => sum + f.bytes, 0), filesAndPixels: files.map(f => [f.id, f.pixels]) }, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
