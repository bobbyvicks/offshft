// Builds page.html: the square options side by side at real sizes, with how each one read in the blind tests
// (RESULTS.md), for the owner to choose from. Run after build.cjs:
//   cd /home/user/offshft/tools && node ../designs/mark/square/page.cjs
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const svg = (id, c) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(DIR, `${id}-${c}.svg`)).toString('base64');

const OPTIONS = [
  { id: '0-as-is', name: 'As it is now', what: 'The clock you have, fitted into the square. The hands set the size, so the ring ends up about a third of it.',
    score: 6.3, scoreLabel: 'Read as a clock', also: 'a magnifying glass, a Q, a target, a fried egg in a pan', verdict: 'Keep it for hats, patches and tags, where it has room to be tall.', tone: 'keep' },
  { id: '1-bleed', name: 'Hands off the edge', what: 'The same clock, bigger, with the frame cutting off the ends of the hands.',
    score: 4.7, scoreLabel: 'Read as a clock', also: 'a bullseye, a donut, a record', verdict: 'No. Without the pointed tips the hands stop looking like hands.', tone: 'no' },
  { id: '2-square-master', name: 'Shorter hands', what: 'Its own drawing for squares, with the hands about a third shorter.',
    score: 5.7, scoreLabel: 'Read as a clock', also: 'a magnifying glass, a Q', verdict: 'No. Barely bigger, and it reads worse than the clock you have.', tone: 'no' },
  { id: '3-clock-face', name: 'Clock face', what: 'The ring becomes the dial and the hands sit inside it, standing out of the centre dot.',
    score: 9.0, scoreLabel: 'Read as a clock', also: 'a generic clock app icon; a faint "!" at the smallest size', verdict: 'Yes, for tiny spots like the browser tab. Clearest at any size, but plain.', tone: 'yes' },
  { id: '4-stacked', name: 'Stacked name', what: 'OFF over SHFT, with the clock as the O. Fills the square and says the name.',
    score: null, scoreLabel: 'Read as OFF SHFT', readText: '3 of 3 people, and all 3 saw the clock in the O', also: 'the same Q-shaped tail as on the hats', verdict: 'Yes, for profile pictures, the app icon and Shopify.', tone: 'yes' },
];

const img = (id, c, px, shape, extra = '') => `<span class="frame ${shape}" style="--s:${px}px"${extra}><img src="${svg(id, c)}" alt="" width="${px}" height="${px}"></span>`;
const tab = (id, c) => `<span class="tab"><img src="${svg(id, c)}" alt="" width="16" height="16"><span>OFF SHFT</span></span>`;

function card(o) {
  const score = o.score == null
    ? `<p class="score"><span class="label">${o.scoreLabel}</span> <strong>${o.readText}</strong></p>`
    : `<p class="score"><span class="label">${o.scoreLabel}</span> <strong class="num">${o.score.toFixed(1)}</strong><span class="outof">/10</span><span class="bar" aria-hidden="true"><span style="width:${o.score * 10}%"></span></span></p>`;
  return `<article class="card ${o.tone}">
  <div class="text">
    <h3>${o.name}</h3>
    <p class="what">${o.what}</p>
    ${score}
    <p class="also"><span class="label">Also seen as</span> ${o.also}</p>
    <p class="verdict">${o.verdict}</p>
  </div>
  <div class="renders" role="img" aria-label="${o.name} as profile pictures, an app icon and a browser tab icon">
    ${img(o.id, 'light', 120, 'circle')}${img(o.id, 'dark', 120, 'circle')}
    <span class="small">${img(o.id, 'light', 44, 'circle')}${img(o.id, 'light', 88, 'icon')}${tab(o.id, 'light')}</span>
  </div>
</article>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Clock in a Square</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Unbounded:wght@700&display=swap" rel="stylesheet">
<style>
/* OFF SHFT's own palette and type (BRAND.md). Layout: one column of option cards, words left, real-size renders right. */
:root {
  --bg: #F3EFE6; --surface: #FBF9F4; --ink: #1F2733; --muted: #5C6371; --line: #DDD5C3; --accent: #B4552D;
  --yes: #3E6B4F; --no: #9A4A2C; --keep: #5C6371;
  --display: "Unbounded", "Arial Black", system-ui, sans-serif; --body: "Archivo", "Helvetica Neue", Arial, sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1A2029; --surface: #222A35; --ink: #ECE5D3; --muted: #A9AAA4; --line: #343E4B; --accent: #D29B3C;
  --yes: #8DB59A; --no: #D98A6B; --keep: #A9AAA4; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #1A2029; --surface: #222A35; --ink: #ECE5D3; --muted: #A9AAA4; --line: #343E4B; --accent: #D29B3C;
  --yes: #8DB59A; --no: #D98A6B; --keep: #A9AAA4; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 400 16px/1.55 var(--body); }
main { max-width: 1000px; margin: 0 auto; padding: 40px max(16px, env(safe-area-inset-right, 0px)) 56px max(16px, env(safe-area-inset-left, 0px)); display: grid; gap: 40px; }
h1, h2, h3 { text-wrap: balance; margin: 0; }
h1 { font: 700 clamp(26px, 4.4vw, 40px)/1.15 var(--display); letter-spacing: .02em; text-transform: uppercase; }
h2 { font: 700 15px/1.3 var(--display); letter-spacing: .12em; text-transform: uppercase; }
h3 { font: 700 20px/1.25 var(--body); }
p { margin: 0; max-width: 65ch; }
.lede { display: grid; gap: 12px; }
.lede p { color: var(--muted); font-size: 17px; }
.label { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-right: 6px; }
section { display: grid; gap: 16px; }
.cards { display: grid; gap: 14px; }
.card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: center; background: var(--surface); border: 1px solid var(--line); border-left: 4px solid var(--keep); padding: 20px; }
.card.yes { border-left-color: var(--yes); } .card.no { border-left-color: var(--no); }
.text { display: grid; gap: 8px; min-width: 0; }
.what { color: var(--muted); }
.score { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.num { font: 700 22px/1 var(--display); font-variant-numeric: tabular-nums; }
.outof { color: var(--muted); font-size: 14px; }
.bar { flex: 0 0 120px; height: 6px; background: var(--line); margin-left: 10px; align-self: center; }
.bar span { display: block; height: 100%; background: var(--accent); }
.verdict { font-weight: 600; }
.card.yes .verdict { color: var(--yes); } .card.no .verdict { color: var(--no); }
.renders { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: flex-end; }
.small { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.frame { width: var(--s); height: var(--s); display: block; overflow: hidden; flex: none; box-shadow: 0 0 0 1px rgba(0,0,0,.08); }
.frame img { display: block; width: 100%; height: 100%; }
.circle { border-radius: 50%; } .icon { border-radius: 22%; }
.tab { display: inline-flex; align-items: center; gap: 7px; background: #E6E3DD; color: #2A2F38; border-radius: 8px 8px 0 0; padding: 7px 12px 7px 9px; font: 13px/1 Arial, sans-serif; }
.tab img { display: block; }
.plan { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.plan > div { background: var(--surface); border: 1px solid var(--line); padding: 18px; display: grid; gap: 10px; align-content: start; }
.plan h3 { font-size: 17px; }
.plan .demo { display: flex; align-items: center; gap: 12px; min-height: 96px; }
.kit { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 28px; padding: 0; margin: 0; list-style: none; }
.kit li { border-top: 1px solid var(--line); padding: 10px 0; display: grid; gap: 2px; }
.kit b { font-weight: 600; }
.kit span { color: var(--muted); font-size: 15px; }
.foot { color: var(--muted); font-size: 14px; }
@media (max-width: 760px) {
  .card { grid-template-columns: minmax(0, 1fr); }
  .renders { justify-content: flex-start; }
  .plan, .kit { grid-template-columns: minmax(0, 1fr); }
}
</style>
</head>
<body>
<main>
  <header class="lede">
    <h1>The clock in a square</h1>
    <p>The clock is twice as tall as it is wide, because the hands stand outside the ring. Fit that into a square and the ring ends up about a third of the space. Here are five ways around it, at the sizes they'll really show up: profile pictures, an app icon and the browser tab.</p>
    <p>Each one went to three people who'd never seen the logo. They saw one picture each and said what it was.</p>
  </header>

  <section aria-labelledby="opts">
    <h2 id="opts">The five options</h2>
    <div class="cards">
${OPTIONS.map(card).join('\n')}
    </div>
  </section>

  <section aria-labelledby="plan">
    <h2 id="plan">What I'd use where</h2>
    <p>Making the clock bigger by cutting or shortening the hands makes it read worse: the hands are what make it a clock, and also what make it tall. So the clock stays as it is on the hats, and squares get their own versions.</p>
    <div class="plan">
      <div><h3>Profile pictures, app icon, Shopify</h3><div class="demo">${img('4-stacked', 'light', 88, 'circle')}${img('4-stacked', 'dark', 72, 'icon')}</div><p class="what">The stacked name. People learn the name and see the clock at the same time.</p></div>
      <div><h3>Browser tab and anything tiny</h3><div class="demo">${tab('3-clock-face', 'light')}${img('3-clock-face', 'dark', 32, 'icon')}</div><p class="what">The clock face. The only one that still reads at 16 pixels.</p></div>
      <div><h3>Hats, patches, tags</h3><div class="demo">${img('0-as-is', 'light', 88, 'icon')}</div><p class="what">The clock as it is. It was drawn for these, where it can be as tall as it wants.</p></div>
    </div>
  </section>

  <section aria-labelledby="kit">
    <h2 id="kit">Then the brand kit</h2>
    <p>Once you pick, I'll make every file you'll need, from the same drawings, in light, dark and one-colour versions.</p>
    <ul class="kit">
      <li><b>Main logo, one line</b><span>SVG and PDF for print, PNG for everything else</span></li>
      <li><b>Stacked logo</b><span>The square version, same files</span></li>
      <li><b>Clock symbol</b><span>For hats, patches and tags, same files</span></li>
      <li><b>Browser tab and phone icons</b><span>16, 32 and 48 px, plus 180, 192 and 512 px home-screen icons</span></li>
      <li><b>Profile pictures</b><span>1080 x 1080 for Instagram, TikTok and Facebook, light and dark</span></li>
      <li><b>Shopify</b><span>Header logo, checkout logo and the share image</span></li>
      <li><b>One-page brand sheet</b><span>Colours with hex, RGB and thread, fonts, spacing and smallest sizes</span></li>
      <li><b>Rules for the logo</b><span>Clear space and what not to do, so anyone can use it</span></li>
    </ul>
  </section>

  <p class="foot">Light versions are Ink and Rust on Bone; dark versions are Bone and Sun on Slate.</p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(DIR, 'page.html'), html);
console.log('wrote page.html', (html.length / 1024).toFixed(0) + ' KB');
