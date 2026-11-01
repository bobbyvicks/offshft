// Builds the Printful sheet page (sheet.html, published as index.html beside files/ and the zip).
//   node /home/user/offshft/store/printful/sheet.cjs
// Reads sheet-data.json (the cards), files/sizes.json (from export.cjs) and live.json (a read-only snapshot of which
// variants Printful has stocked, optional). Everything is rendered here; the page's script only runs the tabs,
// filters, ticks, copy buttons and downloads.
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const ROOT = path.resolve(DIR, '../..');
const S = JSON.parse(fs.readFileSync(path.join(DIR, 'sheet-data.json'), 'utf8'));
const SIZES = JSON.parse(fs.readFileSync(path.join(DIR, 'files/sizes.json'), 'utf8'));
const LIVE = fs.existsSync(path.join(DIR, 'live.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'live.json'), 'utf8')) : null;
const ZIP_BYTES = fs.statSync(path.join(DIR, 'offshft-printful-files.zip')).size;
const FILE = Object.fromEntries(SIZES.map((f) => [f.name, f]));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FILE_RE = /\b([a-z][a-z-]*-\d+(?:\.\d+)?mm(?:-print)?)(\.png|\.svg)?\b/g;
// prose from the data: markers become small tags, file names become code
function rich(s) {
  return esc(s)
    .replace(/\[(UNVERIFIED|CONFIRM)[^\]]*\]/g, '<span class="tag">unconfirmed</span>')
    .replace(/\[(inferred|inference)\]/g, '<span class="tag">likely</span>')
    .replace(/\[owner sets\]/g, '<span class="tag">your call</span>')
    .replace(/\[estimate\]/g, '<span class="tag">estimate</span>')
    .replace(FILE_RE, (m, n, ext) => (FILE[n] ? `<code>${n}${ext || ''}</code>` : m));
}
const filesIn = (s) => [...new Set([...String(s).matchAll(FILE_RE)].map((m) => m[1]).filter((n) => FILE[n]))];
const inches = (mmText) => mmText.split(' x ').map((v) => (+v / 25.4).toFixed(2));
const kb = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

// ---- categories, in page order
const CATS = [
  ['hats', 'Hats', /hat$/], ['knits', 'Beanies and bucket hats', /(beanie|bucket-hat)$/], ['hoodies', 'Hoodies', /hoodie$/],
  ['crews', 'Crewnecks', /crewneck$/], ['tees', 'T-shirts', /t-shirt$/], ['pants', 'Sweatpants', /sweatpants$/],
  ['zips', 'Quarter-zips', /quarter-zip$/], ['jackets', 'Jackets', /jacket$/], ['golf', 'Golf', /golf-shirt$/],
];
const catOf = (h) => (CATS.find(([, , re]) => re.test(h)) || die(`no category for ${h}`))[0];
function die(m) { throw new Error(m); }
// knits before hats: "bucket-hat" also ends in "hat"
const catOfOrdered = (h) => (/(beanie|bucket-hat)$/.test(h) ? 'knits' : catOf(h));

// ---- technique per group
const techOf = (g) => (/^Embroidery/.test(g.placement) ? 'embroidery' : /^Print/.test(g.placement) ? 'print' : 'both');
const TECH_LABEL = { embroidery: 'Embroidery', print: 'Print', both: 'Not settled' };

// ---- variant flags
const FLAGS = {
  'OK': ['ok', 'Colour found', "This colour name was seen in a copy of Printful's catalogue."],
  'Colour?': ['warn', 'Colour unconfirmed', "Printful's name for this colour wasn't confirmed. Check its colour picker."],
  'Check link': ['info', 'Check link', 'Printful has already linked this variant to something. Check what.'],
  'Swatch?': ['info', 'Check swatch', 'Check a swatch: the card, or Your calls > Swatches, says which file to use if this colour reads lighter or darker than assumed.'],
  'New': ['info', 'New', 'Added on 1 Nov, after this sheet was first made: check its link with extra care.'],
  'Not linked': ['bad', 'Not linked', 'Some sizes in this row have no Printful link yet: an order for them would not reach Printful.'],
  'Embroidery?': ['warn', 'Embroidery unconfirmed', "Embroidery on this product wasn't confirmed."],
  'Puff?': ['warn', 'Puff promised', 'The listing promises 3D puff; the ready art is flat.'],
  'No art': ['bad', 'No art', 'There is no file for this yet.'],
  'CA stock?': ['warn', 'Canada stock?', 'May be out of stock in Canada.'],
};
function flagChips(check) {
  return check.split('; ').filter(Boolean).map((c) => {
    const m = c.match(/^(.*?)\s*\((.*)\)$/);
    const code = m ? m[1] : c, detail = m ? m[2] : '';
    const f = FLAGS[code] || die(`unknown flag ${c}`);
    const label = code === 'No art' && detail === 'back' ? 'No back art' : f[1];
    return `<span class="flag ${f[0]}" title="${esc(f[2] + (detail ? ` (${detail})` : ''))}">${esc(label)}</span>`;
  }).join(' ');
}

// ---- live: which variants Printful has stocked
const rowColour = (v) => v.shopifyVariant.split(' / ').pop();
const live = new Map();          // key handle|gi|ri -> { n, linked, profiles:Set, sizes:Set }
const liveListing = new Map();   // handle -> { n, linked }
const unmatched = [], newProducts = [];
if (LIVE) {
  const opt = (v, ...names) => { for (const n of names) if (v.options && v.options[n] != null) return v.options[n]; return null; };
  for (const p of LIVE.products) {
    const l = S.listings.find((x) => x.handle === p.handle);
    if (!l) { newProducts.push(p); continue; }
    const tot = liveListing.get(p.handle) || { n: 0, linked: 0 };
    for (const v of p.variants) {
      const style = opt(v, 'Style'), colour = opt(v, 'Colour', 'Color');
      const cands = [];
      l.groups.forEach((g, gi) => g.variants.forEach((r, ri) => {
        if (style != null && g.style !== style) return;
        if (colour != null && rowColour(r) !== colour) return;
        cands.push([gi, ri]);
      }));
      const all = l.groups.flatMap((g, gi) => g.variants.map((r, ri) => [gi, ri]));
      const hit = cands.length === 1 ? cands[0] : (style == null && colour == null && all.length === 1 ? all[0] : null);
      const linked = (v.printfulAvailable ?? 0) > 0;
      tot.n++; if (linked) tot.linked++;
      if (!hit) { unmatched.push(`${p.handle}: ${v.title}`); continue; }
      const k = `${p.handle}|${hit[0]}|${hit[1]}`;
      const e = live.get(k) || { n: 0, linked: 0, profiles: new Set(), sizes: new Set(), unlinked: [] };
      e.n++; if (linked) e.linked++; else e.unlinked.push(opt(v, 'Size') || 'one size');
      if (v.profile) e.profiles.add(v.profile);
      const size = opt(v, 'Size'); if (size) e.sizes.add(size);
      live.set(k, e);
    }
    liveListing.set(p.handle, tot);
  }
}
const gaps = [];
if (LIVE) for (const l of S.listings) l.groups.forEach((g, gi) => g.variants.forEach((r, ri) => {
  const e = live.get(`${l.handle}|${gi}|${ri}`);
  if (e && e.linked < e.n) gaps.push({ title: l.title, style: g.style.replace(/^\(no Style option\)\s*/, ''), colour: rowColour(r), sizes: e.unlinked, n: e.n });
}));
const noArt = S.listings.filter((l) => l.groups.some((g) => /^(Back: )?[Aa]lready linked[:;] check which file the link uses/.test(g.artFile))).map((l) => l.title + (l.groups.every((g) => !/^Already linked/.test(g.artFile)) ? ' (back)' : ''));
function liveCell(h, gi, ri) {
  if (!LIVE) return '<td class="live">-</td>';
  const e = live.get(`${h}|${gi}|${ri}`);
  if (!e) return '<td class="live"><span class="dot none"></span>no variant</td>';
  const cls = e.linked === e.n ? 'all' : e.linked ? 'part' : 'none';
  const tip = `Stocked at the Printful location: ${e.linked} of ${e.n}. Shipping profile: ${[...e.profiles].join(', ') || 'none'}`;
  return `<td class="live" title="${esc(tip)}"><span class="dot ${cls}"></span>${e.linked}/${e.n}</td>`;
}

// ---- pieces
function thumbBg(name) { return /-light-/.test(name) ? 'fab-light' : /-ink-/.test(name) ? 'fab-oat' : 'fab-dark'; }
function fileCard(name, tech, big) {
  const f = FILE[name];
  const print = f.print, emb = f.embroidery;
  const showEmb = emb && tech !== 'print', showPrint = tech !== 'embroidery' || !emb;
  const sizeMM = tech === 'print' || !emb ? print.mm : f.mm;
  const sizeIn = inches(sizeMM);
  const btn = (kind, label) => `<button class="dl" data-path="files/${kind}/${name}.${kind === 'svg' ? 'svg' : 'png'}" data-name="${name}.${kind === 'svg' ? 'svg' : 'png'}">${label}</button>`;
  return `<div class="file${big ? ' big' : ''}">
  <div class="thumb ${thumbBg(name)}"><img src="files/svg/${name}.svg" alt="${esc(name)}" loading="lazy"></div>
  <div class="file-body">
    <code class="fname">${name}.png</code>
    <span class="fsize">${sizeMM.replace(' x ', ' × ')} mm · ${sizeIn[0]} × ${sizeIn[1]} in</span>
    <span class="fbtns">${showEmb ? btn('embroidery', tech === 'both' || big ? 'Embroidery PNG' : 'Download PNG') : ''}${showPrint ? btn('print', tech === 'both' || big || emb ? 'Print PNG' : 'Download PNG') : ''}${big ? btn('svg', 'SVG') : ''}<button class="copy" data-copy="${sizeIn[0]}" title="Copy the width in inches for Printful's editor">Copy width ${sizeIn[0]} in</button></span>
  </div>
</div>`;
}

const threadSwatches = (s) => rich(s).replace(/\b(1801 White|1800 Black|1987 Orange|1672 Old Gold|1966 Navy|1839 Red)\b/g, (m) => {
  const hex = S.threads.standard.find(([n, nm]) => `${n} ${nm}` === m)[2];
  return `<span class="sw" style="--c:${hex}"></span>${m}`;
});

function groupHTML(l, g, gi) {
  const tech = techOf(g);
  const id = `${l.handle}#${gi}`;
  const files = filesIn(g.artFile);
  const product = g.printfulProduct.split(/ \| | I (?=[A-Z])/);
  const code = (product[1] || product[0] || '').match(/\b(\d{2}-\d{3}|[A-Z]*\d{3,}[A-Z]*|RIO)\b/);
  const rows = g.variants.map((v, ri) => {
    const sh = rowColour(v);
    const shopify = sh === g.style || sh === 'Default Title' ? 'one variant' : sh;
    const e = live.get(`${l.handle}|${gi}|${ri}`);
    const check = e && e.linked < e.n ? `${v.check ? v.check + '; ' : ''}Not linked` : v.check;
    return `<tr><td>${esc(shopify)}</td><td data-label="Printful">${esc(v.printfulColour)}</td><td class="sizes" data-label="Sizes">${esc(v.printfulSize)}</td><td class="flags">${flagChips(check)}</td>${liveCell(l.handle, gi, ri)}</tr>`;
  }).join('');
  return `<section class="group" data-id="${esc(id)}">
  <div class="g-head">
    <h3>${esc(g.style.replace(/^\(no Style option\)\s*/, '') || 'All variants').replace(/^Colour: /, '')}</h3>
    <span class="tech ${tech}">${TECH_LABEL[tech]}</span>
    <label class="tick"><input type="checkbox" id="tick-${esc(l.handle)}-${gi}" data-id="${esc(id)}"><span>Checked in Printful</span></label>
  </div>
  <dl class="spec">
    <dt>Printful product</dt><dd><span class="prod">${rich(g.printfulProduct)}</span>${code ? ` <button class="copy small" data-copy="${esc(code[1])}" title="Copy the model number to search Printful">Copy ${esc(code[1])}</button>` : ''}${g.catalogId && g.catalogId !== '?' ? ` <span class="cat">catalogue ${rich(g.catalogId)}</span>` : ''}</dd>
    <dt>Placement</dt><dd>${rich(g.placement)}</dd>
    <dt>File</dt><dd><p class="art">${rich(g.artFile)}</p>${files.length ? `<div class="files">${files.map((n) => fileCard(n, tech, false)).join('')}</div>` : ''}${g.artVersion && !/^Not built$/.test(g.artVersion) ? `<p class="ver">${rich(g.artVersion)}</p>` : ''}</dd>
    <dt>Size</dt><dd>${rich(g.size)}</dd>
    <dt>Position</dt><dd>${rich(g.position)}</dd>
    <dt>Threads</dt><dd>${threadSwatches(g.threads)}</dd>
    ${g.puff && !/^No\b/.test(g.puff) ? `<dt>Puff</dt><dd>${rich(g.puff)}</dd>` : ''}
  </dl>
  <div class="tablewrap"><table class="variants">
    <thead><tr><th>Shopify colour</th><th>Printful colour</th><th>Sizes</th><th>Flags</th><th title="Stocked at the Printful location, which Printful does when it links a variant">Linked</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  ${g.checks ? `<p class="checks"><strong>Check:</strong> ${rich(g.checks)}</p>` : ''}
</section>`;
}

function listingHTML(l) {
  const lv = liveListing.get(l.handle);
  const liveTxt = lv ? `<span class="lv ${lv.linked === lv.n ? 'all' : lv.linked ? 'part' : 'none'}" title="Variants stocked at the Printful location">${lv.linked} of ${lv.n} variants linked</span>` : '';
  return `<article class="listing" data-cat="${catOfOrdered(l.handle)}" data-q="${esc((l.title + ' ' + l.handle).toLowerCase())}">
  <header class="l-head">
    <h2>${esc(l.title)}</h2>
    <span class="l-meta"><code>${esc(l.handle)}</code>${liveTxt}<span class="l-prog" data-handle="${esc(l.handle)}"></span></span>
  </header>
  ${l.extra ? `<p class="extra">${rich(l.extra)}</p>` : ''}
  ${l.groups.map((g, gi) => groupHTML(l, g, gi)).join('\n')}
</article>`;
}

// ---- views
const order = CATS.map(([c]) => c);
const listings = [...S.listings].sort((a, b) => order.indexOf(catOfOrdered(a.handle)) - order.indexOf(catOfOrdered(b.handle)));
const nGroups = S.listings.reduce((a, l) => a + l.groups.length, 0);
const liveTotals = LIVE ? [...liveListing.values()].reduce((a, x) => ({ n: a.n + x.n, linked: a.linked + x.linked }), { n: 0, linked: 0 }) : null;
const when = (iso) => {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
};
const liveAt = LIVE ? when(LIVE.readEndUTC || LIVE.readStartUTC) : null;
const LINKED = !liveTotals ? 'most variants look linked' : liveTotals.linked === liveTotals.n ? `all ${liveTotals.n} variants look linked` : `${liveTotals.linked} of ${liveTotals.n} variants look linked`;

const catChips = `<button class="chip on" data-cat="all">All</button>${CATS.map(([c, label]) => `<button class="chip" data-cat="${c}">${label}</button>`).join('')}`;

const viewListings = `<section class="view" id="v-listings">
  <div class="toolbar">
    <div class="chips" role="group" aria-label="Show">${catChips}</div>
    <div class="tools">
      <input type="search" id="q" placeholder="Find a listing" aria-label="Find a listing">
      <label class="toggle"><input type="checkbox" id="hide-done"> Hide what I've ticked</label>
    </div>
  </div>
  <details class="legend"><summary>What the flags mean</summary>
    <ul>${Object.entries(FLAGS).map(([, f]) => `<li><span class="flag ${f[0]}">${f[1]}</span> ${esc(f[2])}</li>`).join('')}
    <li><span class="dot all"></span><strong>Linked</strong>: how many of the row's variants are stocked at the Printful location. Printful does that when it links a variant; it doesn't say which product, file or placement the link uses. Read ${liveAt || '-'}.</li></ul>
  </details>
  ${gaps.length ? `<p class="notice"><strong>Not linked yet:</strong> ${gaps.map((x) => `${esc(x.title)}${x.style ? `, ${esc(x.style)}` : ''}, ${esc(x.colour)} ${esc(x.sizes.join(', '))}`).join('; ')}. An order for these won't reach Printful until they're linked: link them (How to check, step 5); hiding them until then is your call. Read ${liveAt}.</p>` : ''}
  ${noArt.length ? `<p class="notice"><strong>On sale with no art in this repo:</strong> ${noArt.map(esc).join(', ')}. Printful has linked them, so an order would be made with whatever file those links hold: check that file first. Hiding them until the art exists is your call.</p>` : ''}
  ${newProducts.length ? `<p class="notice">New in the store since this sheet was made, so not here yet: ${newProducts.map((p) => esc(p.title)).join(', ')}.</p>` : ''}
  <div class="list">${listings.map(listingHTML).join('\n')}</div>
  <p class="empty" hidden>Nothing matches.</p>
</section>`;

const viewFiles = `<section class="view" id="v-files" hidden>
  <div class="intro">
    <h2>Print files</h2>
    <p>Every file the cards use, made from the same drawings as the hats. Embroidery PNGs are 600 dpi and coloured in Printful's own threads (black, orange, white, old gold), so its colour match should pick the right ones; check them every time (How to check, step 6). Print PNGs are 300 dpi in the brand colours. All are true size on a transparent background: set the width in Printful's editor to the inches shown.</p>
    <p class="zipline"><button class="dl primary" id="zipall">Download everything (about ${kb(ZIP_BYTES)} ZIP)</button> <span class="muted" id="zipnote">${SIZES.length} designs: embroidery, print and SVG.</span></p>
    <p class="nodl" hidden>Downloads don't work in this view. Open the page on claude.ai, or take the files from the repo: <code>store/printful/files/</code>.</p>
  </div>
  <div class="filegrid">${SIZES.map((f) => `<div class="fileitem">${fileCard(f.name, f.embroidery ? 'both' : 'print', true)}<p class="used"><span class="label">Used by</span> ${esc(S.printFiles.find((p) => p.name === f.name).usedBy.join(', '))}</p></div>`).join('')}</div>
</section>`;

const viewHow = `<section class="view prose" id="v-how" hidden>
  <h2>How to check the links</h2>
  <ol class="steps">${S.steps.map((s) => `<li>${rich(s.replace('{LINKED}', LINKED))}</li>`).join('')}</ol>
  <p class="muted">${esc(S.stepsNote)}</p>
  <h2>File rules</h2>
  <ul>${S.fileRules.map((s) => `<li>${rich(s)}</li>`).join('')}</ul>
</section>`;

const viewCalls = `<section class="view prose" id="v-calls" hidden>
  <h2>Your calls</h2>
  <p class="muted">Things this sheet can't settle for you. The store is open (its password is off), so the first five affect what customers pay and get right now.</p>
  <ol class="calls">${S.decisions.map(([t, s]) => `<li><strong>${esc(t)}.</strong> ${rich(s)}</li>`).join('')}</ol>
</section>`;

const T = S.threads;
const viewThreads = `<section class="view prose" id="v-threads" hidden>
  <h2>Threads</h2>
  <p>Printful has 15 standard threads, up to 6 per placement. The nearest to each brand colour:</p>
  <div class="tablewrap"><table class="map"><thead><tr><th>Brand</th><th>Printful thread</th><th>Distance</th></tr></thead><tbody>
  ${T.map.map(([b, bh, t, th, d]) => `<tr><td><span class="sw" style="--c:${bh}"></span>${esc(b)} <code>${bh}</code></td><td><span class="sw" style="--c:${th}"></span>${esc(t)} <code>${th}</code></td><td>${d}</td></tr>`).join('')}
  </tbody></table></div>
  <h3>Which threads for which file</h3>
  <dl class="pairs">${T.pairs.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${threadSwatches(b)}</dd>`).join('')}</dl>
  <h3>Which file for which fabric</h3>
  <dl class="pairs">${T.fabrics.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
  <ul>${T.notes.map((s) => `<li>${rich(s)}</li>`).join('')}</ul>
  <h3>All 15 standard threads</h3>
  <div class="threadgrid">${T.standard.map(([n, nm, hex]) => `<span class="thread"><span class="sw lg" style="--c:${hex}"></span><span>${n} ${esc(nm)}</span><code>${hex}</code></span>`).join('')}</div>
</section>`;

const C = S.costs;
function profileContents(name) {
  if (!LIVE) return '';
  const by = new Map();
  for (const p of LIVE.products) for (const v of p.variants) if (v.profile === name) {
    const type = p.productType || 'Other', style = v.options && v.options.Style;
    if (!by.has(type)) by.set(type, new Set());
    const NICE = { Classic: 'Classic bucket', Organic: 'Organic bucket', Cuffed: 'Cuffed beanie', Ribbed: 'Ribbed beanie' };
    if (style) by.get(type).add(NICE[style] || style.replace(/ — .*$/, ''));
  }
  if (!by.size) return 'nothing now';
  return [...by].map(([t, st]) => `${t}${st.size ? ` (${[...st].join(', ')})` : ''}`).join('; ');
}
const viewCosts = `<section class="view prose" id="v-costs" hidden>
  <h2>Costs</h2>
  <p class="muted">${esc(C.note)}</p>
  <dl class="pairs">${C.items.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${rich(b)}</dd>`).join('')}</dl>
  <h3>Base prices (US$, one placement)</h3>
  <div class="tablewrap"><table class="map"><tbody>${C.blanks.map(([a, b]) => `<tr><td>${esc(a)}</td><td class="num">${rich(b)}</td></tr>`).join('')}</tbody></table></div>
  <h3>Shipping customers pay now</h3>
  <p class="muted">${esc(C.profilesNote)}</p>
  <div class="tablewrap"><table class="map profiles"><thead><tr><th>Printful profile</th><th>What's in it</th><th class="num">Canada</th><th class="num">US</th><th class="num">US express</th></tr></thead><tbody>${C.profiles.map(([name, ca, us, ex]) => `<tr><td>${esc(name.replace(/^Printful: /, '').replace(/Hats, Bags, Pillowcases, All over prints, Socks, Aprons, Flip Flops, Camper mug/, 'Hats, bags and more'))}</td><td>${esc(profileContents(name))}</td><td class="num" data-label="Canada">${ca}</td><td class="num" data-label="US">${us}</td><td class="num" data-label="US express">${ex || '-'}</td></tr>`).join('')}</tbody></table></div>
  <p>${esc(C.shipping)}</p>
</section>`;

// ---- logo, recoloured through tokens
const logo = fs.readFileSync(path.join(ROOT, 'brand/logo/offshft-logo-light.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '').replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/width="[^"]*mm" height="[^"]*mm"/, 'class="logo" role="img" aria-label="OFF SHFT"')
  .replace(/fill="#1F2733"/g, 'fill="var(--logo-a)"').replace(/fill="#B4552D"/g, 'fill="var(--logo-b)"');
if (/#[0-9A-Fa-f]{6}/.test(logo)) die('logo still has a literal colour');

const statusLive = LIVE
  ? `<div class="stat"><span class="label">Linked so far</span><strong>${liveTotals.linked} of ${liveTotals.n}</strong><span class="muted">variants stocked at the Printful location, ${liveAt}</span></div>`
  : '';

const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>OFF SHFT Printful Sheet</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root {
  --bg: #F3EFE6; --surface: #FCFAF6; --surface-2: #F6F2E9; --ink: #1F2733; --muted: #5D6672; --line: #E2DACB; --line-2: #CEC4B0;
  --accent: #B4552D; --accent-ink: #FFFFFF; --accent-soft: #F3DED3;
  --ok: #35603E; --ok-bg: #DFEBDD; --warn: #845510; --warn-bg: #F5E6C8; --bad: #993623; --bad-bg: #F4DBD2; --info: #3C4F6B; --info-bg: #E2E7EE;
  --chip: #EAE4D7; --chip-on: #1F2733; --chip-on-ink: #F3EFE6; --tag: #6B6455; --tag-bg: #ECE5D3;
  --logo-a: #1F2733; --logo-b: #B4552D; --dot-none: #B9B2A2;
  --fab-light: #ECE5D3; --fab-dark: #27303D; --fab-oat: #D8CDB2; --sw-ring: rgba(31, 39, 51, .28);
  --shadow: 0 1px 2px rgba(31, 39, 51, .06), 0 2px 10px rgba(31, 39, 51, .04);
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1A2029; --surface: #232B36; --surface-2: #28313D; --ink: #ECE5D3; --muted: #ADA898; --line: #344050; --line-2: #45526A;
  --accent: #E07D52; --accent-ink: #1A2029; --accent-soft: #4A2E23;
  --ok: #9BCBA3; --ok-bg: #213A2A; --warn: #E9BE6E; --warn-bg: #3E321C; --bad: #F0A088; --bad-bg: #462A22; --info: #B3C6E2; --info-bg: #2B3646;
  --chip: #2D3643; --chip-on: #ECE5D3; --chip-on-ink: #1A2029; --tag: #CFC7B2; --tag-bg: #36404D;
  --logo-a: #ECE5D3; --logo-b: #D29B3C; --dot-none: #5A6474; --sw-ring: rgba(236, 229, 211, .35);
  --shadow: none; color-scheme: dark;
} }
:root[data-theme="dark"] {
  --bg: #1A2029; --surface: #232B36; --surface-2: #28313D; --ink: #ECE5D3; --muted: #ADA898; --line: #344050; --line-2: #45526A;
  --accent: #E07D52; --accent-ink: #1A2029; --accent-soft: #4A2E23;
  --ok: #9BCBA3; --ok-bg: #213A2A; --warn: #E9BE6E; --warn-bg: #3E321C; --bad: #F0A088; --bad-bg: #462A22; --info: #B3C6E2; --info-bg: #2B3646;
  --chip: #2D3643; --chip-on: #ECE5D3; --chip-on-ink: #1A2029; --tag: #CFC7B2; --tag-bg: #36404D;
  --logo-a: #ECE5D3; --logo-b: #D29B3C; --dot-none: #5A6474; --sw-ring: rgba(236, 229, 211, .35);
  --shadow: none; color-scheme: dark;
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
img { max-width: 100%; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 400 15px/1.5 Archivo, system-ui, -apple-system, "Segoe UI", sans-serif; font-variant-numeric: tabular-nums; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); background: var(--bg); z-index: 10; }
code, .mono { font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .86em; }
h1, h2, h3 { text-wrap: balance; margin: 0; }
p { margin: 0; }
button { font: inherit; color: inherit; }
.wrap { max-width: 1120px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.muted { color: var(--muted); }
.label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }

/* header */
.top { padding-block: 28px 18px; display: grid; gap: 18px; }
.brandrow { display: flex; align-items: center; gap: 12px; }
.logo { width: 132px; height: auto; display: block; }
.brandrow .sep { width: 1px; height: 22px; background: var(--line-2); }
.brandrow .kicker { font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
h1 { font-size: clamp(28px, 4.6vw, 40px); line-height: 1.08; font-weight: 760; font-stretch: 112%; letter-spacing: -.01em; }
.lede { font-size: 17px; max-width: 64ch; color: var(--muted); }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
.stat { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; display: grid; gap: 2px; box-shadow: var(--shadow); min-width: 0; }
.stat strong { font-size: 22px; font-weight: 720; font-stretch: 108%; }
.stat .muted { font-size: 13px; }
.bar { height: 6px; border-radius: 3px; background: var(--chip); overflow: hidden; margin-top: 6px; }
.bar i { display: block; height: 100%; width: 0; background: var(--accent); transition: width .2s; }

/* tabs */
nav.tabs { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line); }
nav.tabs .wrap { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
nav.tabs a { flex: none; padding: 12px 12px 10px; color: var(--muted); text-decoration: none; font-weight: 600; font-size: 14px; border-bottom: 2px solid transparent; }
nav.tabs a[aria-current="page"] { color: var(--ink); border-bottom-color: var(--accent); }
nav.tabs a:hover { color: var(--ink); }
main { padding-block: 20px 56px; }

/* listings toolbar */
.toolbar { display: grid; gap: 10px; margin-bottom: 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border: 0; background: var(--chip); padding: 6px 11px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; }
.chip.on { background: var(--chip-on); color: var(--chip-on-ink); }
.tools { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; }
.tools input[type="search"] { flex: 1 1 220px; max-width: 360px; min-width: 0; padding: 8px 11px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--surface); color: var(--ink); font: inherit; }
.toggle { display: inline-flex; gap: 7px; align-items: center; font-size: 14px; cursor: pointer; }
.legend { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; font-size: 14px; }
.legend summary { cursor: pointer; font-weight: 600; }
.legend ul { margin: 10px 0 2px; padding: 0; list-style: none; display: grid; gap: 7px; }
.notice { background: var(--warn-bg); color: var(--warn); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
.list { display: grid; gap: 18px; }
.empty { color: var(--muted); padding: 24px 0; }

/* listing card */
.listing { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.l-head { padding: 16px 18px 10px; display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline; justify-content: space-between; }
.l-head h2 { font-size: 21px; font-weight: 720; font-stretch: 106%; }
.l-meta { display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; font-size: 13px; color: var(--muted); }
.lv { font-weight: 600; }
.lv.all { color: var(--ok); } .lv.part { color: var(--warn); } .lv.none { color: var(--bad); }
.l-prog:empty { display: none; }
.l-prog { font-weight: 600; color: var(--ink); }
.extra { margin: 0 18px 12px; padding: 10px 12px; background: var(--surface-2); border-radius: 8px; font-size: 14px; color: var(--muted); max-width: 100ch; }
.group { border-top: 1px solid var(--line); padding: 14px 18px 16px; display: grid; gap: 12px; }
.group.done { background: var(--surface-2); }
.group.done .g-head h3::after { content: " ✓"; color: var(--ok); }
.g-head { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; }
.g-head h3 { font-size: 16px; font-weight: 680; }
.tech { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; padding: 3px 8px; border-radius: 5px; }
.tech.embroidery { background: var(--accent-soft); color: var(--bad); }
.tech.print { background: var(--info-bg); color: var(--info); }
.tech.both { background: var(--warn-bg); color: var(--warn); }
.tick { margin-left: auto; display: inline-flex; gap: 7px; align-items: center; font-size: 14px; font-weight: 600; cursor: pointer; padding: 5px 10px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--surface); }
.tick input { width: 16px; height: 16px; accent-color: var(--accent); margin: 0; }
.spec { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr); gap: 7px 16px; margin: 0; font-size: 14.5px; }
.spec dt { color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding-top: 3px; }
.spec dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
.prod { font-weight: 600; }
.cat { color: var(--muted); font-size: 13px; white-space: nowrap; }
.art { max-width: 90ch; }
.ver { font-size: 12.5px; color: var(--muted); margin-top: 6px; }
.files { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 8px; margin-top: 8px; }
.file { display: flex; gap: 10px; align-items: center; border: 1px solid var(--line); border-radius: 9px; padding: 8px; background: var(--surface); min-width: 0; }
.thumb { flex: none; width: 132px; height: 54px; border-radius: 6px; padding: 7px 9px; }
.thumb img { width: 100%; height: 100%; object-fit: contain; display: block; }
.fab-light { background: var(--fab-light); } .fab-dark { background: var(--fab-dark); } .fab-oat { background: var(--fab-oat); }
.file-body { display: grid; gap: 4px; min-width: 0; }
.fname { font-weight: 500; overflow-wrap: anywhere; }
.fsize { font-size: 12.5px; color: var(--muted); }
.fbtns { display: flex; flex-wrap: wrap; gap: 5px; }
.dl, .copy { border: 1px solid var(--line-2); background: var(--surface); border-radius: 7px; padding: 4px 9px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.dl { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.dl:hover { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.copy:hover { border-color: var(--ink); }
.copy.small { padding: 2px 7px; font-size: 12px; }
.dl.primary { padding: 9px 14px; font-size: 14px; }
.nodl-mode .dl { opacity: .45; cursor: not-allowed; }
.tablewrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 9px; }
table { border-collapse: collapse; width: 100%; font-size: 14px; }
th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); background: var(--surface-2); white-space: nowrap; }
tbody tr:last-child td { border-bottom: 0; }
.variants td:first-child { font-weight: 600; white-space: nowrap; }
.sizes { color: var(--muted); }
.live { white-space: nowrap; font-weight: 600; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; vertical-align: 1px; background: var(--dot-none); }
.dot.all { background: var(--ok); } .dot.part { background: var(--warn); } .dot.none { background: var(--dot-none); }
.flag { display: inline-block; font-size: 12px; font-weight: 600; padding: 1px 7px; border-radius: 5px; margin: 1px 0; white-space: nowrap; }
.flag.ok { background: var(--ok-bg); color: var(--ok); } .flag.warn { background: var(--warn-bg); color: var(--warn); }
.flag.bad { background: var(--bad-bg); color: var(--bad); } .flag.info { background: var(--info-bg); color: var(--info); }
.checks { font-size: 14px; max-width: 100ch; }
.tag { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .02em; padding: 0 6px; border-radius: 4px; background: var(--tag-bg); color: var(--tag); vertical-align: 1px; }
.sw { display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: var(--c); box-shadow: inset 0 0 0 1px var(--sw-ring); margin-right: 5px; vertical-align: -1px; }
.sw.lg { width: 22px; height: 22px; margin: 0; }

/* files view */
.intro { display: grid; gap: 10px; margin-bottom: 18px; max-width: 76ch; }
.intro h2, .prose h2 { font-size: 24px; font-weight: 740; font-stretch: 108%; }
.zipline { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; }
.nodl { background: var(--warn-bg); color: var(--warn); padding: 9px 12px; border-radius: 8px; }
.filegrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 12px; }
.fileitem { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 10px; display: grid; gap: 8px; align-content: start; box-shadow: var(--shadow); min-width: 0; }
.file.big { border: 0; padding: 0; flex-direction: column; align-items: stretch; }
.file.big .thumb { width: 100%; height: 110px; padding: 16px 20px; }
.used { font-size: 13px; color: var(--muted); }

/* prose views */
.prose { max-width: 80ch; display: grid; gap: 14px; }
.prose h3 { font-size: 17px; font-weight: 700; margin-top: 8px; }
.prose ul, .prose ol { margin: 0; padding-left: 22px; display: grid; gap: 8px; }
.steps li::marker, .calls li::marker { font-weight: 700; color: var(--accent); }
.pairs { display: grid; grid-template-columns: minmax(0, 15rem) minmax(0, 1fr); gap: 7px 16px; margin: 0; }
.pairs dt { font-weight: 600; }
.pairs dd { margin: 0; }
.map td code { color: var(--muted); }
.num { white-space: nowrap; }
.threadgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.thread { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 9px; align-items: center; background: var(--surface); border: 1px solid var(--line); border-radius: 9px; padding: 8px 10px; font-size: 14px; }
.thread .sw { grid-row: span 2; }
.thread code { color: var(--muted); font-size: 12px; }
footer { border-top: 1px solid var(--line); padding-block: 18px 32px; font-size: 13px; color: var(--muted); }
.toast { position: fixed; left: 50%; bottom: calc(18px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 9px 14px; border-radius: 9px; font-size: 14px; font-weight: 600; z-index: 20; max-width: calc(100% - 32px); }

@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
@media (max-width: 640px) {
  .spec { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .spec dd { margin-bottom: 8px; }
  .pairs { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .pairs dd { margin-bottom: 8px; }
  .l-head, .group { padding-left: 14px; padding-right: 14px; }
  .extra { margin-left: 14px; margin-right: 14px; }
  .tick { margin-left: 0; }
  nav.tabs .wrap { flex-wrap: wrap; overflow-x: visible; }
  nav.tabs a { padding: 9px 9px 7px; }
  .variants thead { display: none; }
  .variants, .variants tbody { display: block; width: 100%; }
  .variants tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 10px; padding: 8px 10px; border-bottom: 1px solid var(--line); }
  .variants tbody tr:last-child { border-bottom: 0; }
  .variants td { display: block; border: 0; padding: 1px 0; white-space: normal; }
  .variants td:nth-child(1) { grid-column: 1; grid-row: 1; }
  .variants td:nth-child(5) { grid-column: 2; grid-row: 1; text-align: right; }
  .variants td:nth-child(2), .variants td:nth-child(3), .variants td:nth-child(4) { grid-column: 1 / -1; }
  .variants td[data-label]::before { content: attr(data-label) ": "; color: var(--muted); font-size: 12px; font-weight: 600; }
  .variants td.live::after { content: " linked"; color: var(--muted); font-weight: 400; }
  .tablewrap:has(.variants) { overflow-x: visible; }
  .cat { white-space: normal; }
  .num { white-space: normal; }
  .profiles thead { display: none; }
  .profiles, .profiles tbody { display: block; width: 100%; }
  .profiles tr { display: flex; flex-wrap: wrap; gap: 2px 14px; padding: 8px 10px; border-bottom: 1px solid var(--line); }
  .profiles tbody tr:last-child { border-bottom: 0; }
  .profiles td { display: block; border: 0; padding: 0; }
  .profiles td:nth-child(1), .profiles td:nth-child(2) { flex: 1 1 100%; }
  .profiles td:nth-child(1) { font-weight: 600; }
  .profiles td:nth-child(2) { color: var(--muted); }
  .profiles td[data-label]::before { content: attr(data-label) " "; color: var(--muted); font-size: 12px; font-weight: 600; }
  .tablewrap:has(.profiles) { overflow-x: visible; }
}
</style>
</head>
<body>
<header class="wrap top">
  <div class="brandrow">${logo}<span class="sep"></span><span class="kicker">Printful sheet</span></div>
  <h1>What every listing should be linked to</h1>
  <p class="lede">Printful is already connected, and ${LINKED}. Shopify can't show what each link points to, so check each card against Printful, fix what differs, and tick it off.</p>
  <div class="stats">
    <div class="stat"><span class="label">Listings</span><strong>${S.listings.length}</strong><span class="muted">${nGroups} cards, one per product and technique</span></div>
    ${statusLive}
    <div class="stat"><span class="label">Your progress</span><strong id="prog-n">0 of ${nGroups}</strong><span class="muted">cards ticked, kept in this browser</span><div class="bar"><i id="prog-bar"></i></div></div>
  </div>
</header>
<nav class="tabs" aria-label="Sections"><div class="wrap">
  <a href="#listings" data-view="listings">Listings</a>
  <a href="#files" data-view="files">Files</a>
  <a href="#how" data-view="how">How to check</a>
  <a href="#calls" data-view="calls">Your calls</a>
  <a href="#threads" data-view="threads">Threads</a>
  <a href="#costs" data-view="costs">Costs</a>
</div></nav>
<main class="wrap">
${viewListings}
${viewFiles}
${viewHow}
${viewCalls}
${viewThreads}
${viewCosts}
</main>
<footer class="wrap">Cards built from the live store (read-only) on 1 Nov 2026, checked against the repo's drawings and Printful's catalogue copies${LIVE ? `; links read ${liveAt}` : ''}. Printful's own pages couldn't be reached, so anything marked <span class="tag">unconfirmed</span> needs a look in Printful. Source: <code>store/printful/</code> in the repo.</footer>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<script type="application/json" id="zipdata">${JSON.stringify({
  readme: fs.readFileSync(path.join(DIR, 'files/README.txt'), 'utf8'),
  sizes: fs.readFileSync(path.join(DIR, 'files/sizes.json'), 'utf8'),
  files: SIZES.flatMap((f) => [...(f.embroidery ? [`embroidery/${f.name}.png`] : []), `print/${f.name}.png`, `svg/${f.name}.svg`]),
}).replace(/</g, '\\u003c')}</script>
<script>
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'offshft-printful-ticks-v1';
  let ticks = new Set();
  try { ticks = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...ticks])); } catch (e) {} };
  const toastEl = $('#toast'); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.hidden = false; clearTimeout(tt); tt = setTimeout(() => { toastEl.hidden = true; }, 2600); };

  // views
  const VIEWS = ['listings', 'files', 'how', 'calls', 'threads', 'costs'];
  function show() {
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'listings';
    VIEWS.forEach((x) => { $('#v-' + x).hidden = x !== v; });
    $$('nav.tabs a').forEach((a) => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }
  // switching tabs lands on the tab's content, not back at the page header
  addEventListener('hashchange', () => {
    show();
    const top = $('main').offsetTop - $('nav.tabs').offsetHeight;   // where the sticky tab bar sits in the page
    if (scrollY > top) scrollTo(0, top);
  });
  show();

  // ticks and filters
  let cat = 'all', q = '', hideDone = false;
  function apply() {
    let shown = 0;
    $$('.listing').forEach((l) => {
      const groups = $$('.group', l);
      let vis = 0, done = 0;
      groups.forEach((g) => {
        const d = ticks.has(g.dataset.id); if (d) done++;
        g.classList.toggle('done', d);
        const hide = hideDone && d; g.hidden = hide; if (!hide) vis++;
      });
      $('.l-prog', l).textContent = done ? done + ' of ' + groups.length + ' ticked' : '';
      const ok = (cat === 'all' || l.dataset.cat === cat) && (!q || l.dataset.q.includes(q)) && vis > 0;
      l.hidden = !ok; if (ok) shown++;
    });
    $('.empty').hidden = shown > 0;
    const all = $$('.group').length, n = $$('.group').filter((g) => ticks.has(g.dataset.id)).length;
    $('#prog-n').textContent = n + ' of ' + all;
    $('#prog-bar').style.width = (100 * n / all) + '%';
  }
  $$('.tick input').forEach((c) => {
    c.checked = ticks.has(c.dataset.id);
    c.addEventListener('change', () => { c.checked ? ticks.add(c.dataset.id) : ticks.delete(c.dataset.id); save(); apply(); });
  });
  $$('.chip').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; $$('.chip').forEach((x) => x.classList.toggle('on', x === b)); apply(); }));
  $('#q').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); apply(); });
  $('#hide-done').addEventListener('change', (e) => { hideDone = e.target.checked; apply(); });
  apply();

  // copy
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('.copy'); if (!b) return;
    const text = b.dataset.copy;
    try { await navigator.clipboard.writeText(text); toast('Copied ' + text); }
    catch (err) { toast('Copy: ' + text); }
  });

  // downloads, through the page's downloads capability
  const dlP = (window.claude && window.claude.use ? window.claude.use('downloads') : Promise.resolve(null)).catch(() => null);
  dlP.then((d) => { if (!d) { document.documentElement.classList.add('nodl-mode'); $$('.nodl').forEach((x) => { x.hidden = false; }); } });
  // everything in one zip, built here from the published files (JSZip from cdnjs, loaded on first use)
  const JSZIP_URLS = ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'];
  const loadScript = (src) => new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = src;
    sc.onload = () => (window.JSZip ? res(window.JSZip) : rej(new Error('no JSZip')));
    sc.onerror = () => { sc.remove(); rej(new Error('JSZip did not load')); };
    document.head.appendChild(sc);
  });
  const loadZip = async () => {
    for (const u of JSZIP_URLS) { if (window.JSZip) break; try { await loadScript(u); } catch (e) {} }
    if (!window.JSZip) throw new Error('JSZip did not load');
    return window.JSZip;
  };
  let zipping = false;
  $('#zipall').addEventListener('click', async () => {
    if (zipping) return;
    const d = await dlP;
    if (!d) { toast("Downloads don't work in this view"); return; }
    zipping = true;
    const note = $('#zipnote'), was = note.textContent;
    try {
      const meta = JSON.parse($('#zipdata').textContent);
      const JSZip = await loadZip();
      const zip = new JSZip();
      zip.file('README.txt', meta.readme);
      zip.file('sizes.json', meta.sizes);
      let n = 0;
      await Promise.all(meta.files.map(async (f) => {
        const r = await fetch('files/' + f);
        if (!r.ok) throw { code: 'fetch' };
        zip.file(f, await r.blob());
        note.textContent = 'Gathering files: ' + (++n) + ' of ' + meta.files.length;
      }));
      note.textContent = 'Zipping...';
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      note.textContent = was;
      await d.save({ filename: 'offshft-printful-files.zip', data: blob });
    } catch (err) {
      note.textContent = was;
      const c = err && err.code;
      if (c !== 'declined') toast(c === 'rate_limited' ? 'Another save is still open' : c === 'fetch' ? "Couldn't load the files" : "Couldn't make the zip");
    } finally { zipping = false; }
  });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('.dl'); if (!b || b.id === 'zipall') return;
    const d = await dlP;
    if (!d) { toast("Downloads don't work in this view"); return; }
    try {
      const r = await fetch(b.dataset.path);
      if (!r.ok) throw { code: 'fetch' };
      await d.save({ filename: b.dataset.name, data: await r.blob() });
    } catch (err) {
      const c = err && err.code;
      if (c === 'declined') return;
      toast(c === 'rate_limited' ? 'Another save is still open' : c === 'fetch' ? "Couldn't load that file" : "Couldn't save that file");
    }
  });
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(DIR, 'sheet.html'), html);
// the same page without its outer document, for hosts that wrap pages in their own (the Artifact publisher does)
const cut = (h, part) => { if (h.split(part).length !== 2) die(`page shell: ${part.slice(0, 30)}`); return h.replace(part, ''); };
let fragment = cut(html, '<!DOCTYPE html>\n<html lang="en-CA">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n');
fragment = cut(cut(fragment, '</head>\n<body>\n'), '</body>\n</html>\n');
fs.writeFileSync(path.join(DIR, 'sheet-artifact.html'), fragment);
console.log(`sheet.html: ${(html.length / 1024).toFixed(0)} KB, ${S.listings.length} listings, ${nGroups} cards${LIVE ? `, live ${liveTotals.linked}/${liveTotals.n} linked, ${unmatched.length} unmatched` : ', no live.json'}`);
if (unmatched.length) console.log('unmatched live variants:\n  ' + unmatched.slice(0, 40).join('\n  '));
if (newProducts.length) console.log('products not in the sheet:', newProducts.map((p) => p.handle).join(', '));
// rows with no live variant at all
if (LIVE) for (const l of S.listings) l.groups.forEach((g, gi) => g.variants.forEach((r, ri) => { if (!live.has(`${l.handle}|${gi}|${ri}`)) console.log('no live variants for', l.handle, '/', g.style, '/', r.shopifyVariant); }));
