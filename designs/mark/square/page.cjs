// Builds page.html: the two directions for square spots side by side at real sizes, with how each read in the blind
// tests (RESULTS.md) and what the critics found, for the owner to choose. Run after build.cjs:
//   cd /home/user/offshft/tools && node ../designs/mark/square/page.cjs
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const uri = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(DIR, f)).toString('base64');
const sq = (id, c) => uri(`${id}-${c}.svg`);
const img = (src, px, shape) => `<span class="frame ${shape}" style="--s:${px}px"><img src="${src}" alt="" width="${px}" height="${px}"></span>`;
const tab = (src, px = 16) => `<span class="tab"><img src="${src}" alt="" width="${px}" height="${px}"><span>OFF SHFT</span></span>`;

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
/* OFF SHFT's own palette and type (BRAND.md). Layout: the two directions side by side, then what was dropped, then the kit. */
:root {
  --bg: #F3EFE6; --surface: #FBF9F4; --ink: #1F2733; --muted: #5C6371; --line: #DDD5C3; --accent: #B4552D;
  --pick: #3E6B4F; --drop: #9A4A2C;
  --display: "Unbounded", "Arial Black", system-ui, sans-serif; --body: "Archivo", "Helvetica Neue", Arial, sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1A2029; --surface: #222A35; --ink: #ECE5D3; --muted: #A9AAA4; --line: #343E4B; --accent: #D29B3C;
  --pick: #8DB59A; --drop: #D98A6B; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #1A2029; --surface: #222A35; --ink: #ECE5D3; --muted: #A9AAA4; --line: #343E4B; --accent: #D29B3C;
  --pick: #8DB59A; --drop: #D98A6B; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 400 16px/1.55 var(--body); }
main { max-width: 1040px; margin: 0 auto; padding: 40px max(16px, env(safe-area-inset-right, 0px)) 56px max(16px, env(safe-area-inset-left, 0px)); display: grid; gap: 40px; }
h1, h2, h3 { text-wrap: balance; margin: 0; }
h1 { font: 700 clamp(26px, 4.4vw, 40px)/1.15 var(--display); letter-spacing: .02em; text-transform: uppercase; }
h2 { font: 700 15px/1.3 var(--display); letter-spacing: .12em; text-transform: uppercase; }
h3 { font: 700 21px/1.25 var(--body); }
p { margin: 0; max-width: 65ch; }
.lede { display: grid; gap: 12px; }
.lede p { color: var(--muted); font-size: 17px; }
.lede strong { color: var(--ink); }
section { display: grid; gap: 16px; }
.label { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.ways { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.way { background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--line); padding: 22px; display: grid; gap: 14px; align-content: start; }
.way.pick { border-top-color: var(--pick); }
.badge { justify-self: start; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--pick); }
.way .what { color: var(--muted); }
.shots { display: grid; gap: 12px; }
.shot { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.shot .label { width: 100%; }
.frame { width: var(--s); height: var(--s); display: block; overflow: hidden; flex: none; box-shadow: 0 0 0 1px rgba(0,0,0,.08); }
.frame img { display: block; width: 100%; height: 100%; }
.circle { border-radius: 50%; } .icon { border-radius: 22%; } .square { border-radius: 0; }
.tab { display: inline-flex; align-items: center; gap: 7px; background: #E6E3DD; color: #2A2F38; border-radius: 8px 8px 0 0; padding: 7px 12px 7px 9px; font: 13px/1 Arial, sans-serif; }
.tab img { display: block; }
.facts { display: grid; gap: 6px; padding: 0; margin: 0; list-style: none; }
.facts li { padding-left: 18px; position: relative; }
.facts li::before { content: ""; position: absolute; left: 0; top: .62em; width: 8px; height: 2px; background: var(--muted); }
.facts .good::before { background: var(--pick); } .facts .bad::before { background: var(--drop); }
.dropped { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.dropped > div { background: var(--surface); border: 1px solid var(--line); padding: 16px; display: grid; gap: 10px; align-content: start; }
.dropped .row { display: flex; align-items: center; gap: 10px; }
.dropped h3 { font-size: 16px; }
.dropped p { color: var(--muted); font-size: 15px; }
.num { font: 700 18px/1 var(--display); font-variant-numeric: tabular-nums; color: var(--ink); }
.kit { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 28px; padding: 0; margin: 0; list-style: none; }
.kit li { border-top: 1px solid var(--line); padding: 10px 0; display: grid; gap: 2px; }
.kit b { font-weight: 600; }
.kit span { color: var(--muted); font-size: 15px; }
.foot { color: var(--muted); font-size: 14px; }
@media (max-width: 760px) { .ways, .dropped, .kit { grid-template-columns: minmax(0, 1fr); } }
</style>
</head>
<body>
<main>
  <header class="lede">
    <h1>The clock in a square</h1>
    <p>The clock is twice as tall as it is wide because the hands stand outside the ring. <strong>With the hands outside, the ring can never be more than about a third of a square</strong>, however it's placed. Making it bigger means cropping or shortening the hands, and both made it read worse in testing.</p>
    <p>So there are really two ways to go. Eighteen people who'd never seen the logo each looked at one picture and said what it was, and three design reviewers went through every option.</p>
  </header>

  <section aria-labelledby="ways">
    <h2 id="ways">Two ways to go</h2>
    <div class="ways">
      <article class="way pick">
        <span class="badge">My pick</span>
        <h3>Keep the hands outside, and put the name in squares</h3>
        <p class="what">Profile pictures, the app icon and Shopify get OFF over SHFT, with the clock as the O. The browser tab gets the hat clock redrawn pixel by pixel. Same clock as the hats everywhere.</p>
        <div class="shots">
          <div class="shot"><span class="label">Profile picture and app icon</span>${img(sq('4-stacked', 'light'), 112, 'circle')}${img(sq('4-stacked', 'dark'), 112, 'circle')}${img(sq('4-stacked', 'light'), 44, 'circle')}${img(sq('4-stacked', 'dark'), 84, 'icon')}</div>
          <div class="shot"><span class="label">Browser tab</span>${tab(uri('tab/outside-16-light.svg'))}${img(uri('tab/outside-32-light.svg'), 32, 'square')}${img(uri('tab/outside-32-dark.svg'), 32, 'square')}</div>
          <div class="shot"><span class="label">The clock alone, when you want it</span>${img(sq('0-as-is', 'light'), 84, 'circle')}${img(sq('0-as-is', 'dark'), 84, 'circle')}</div>
        </div>
        <ul class="facts">
          <li class="good">3 of 3 read it as OFF SHFT, and all 3 saw the clock in the O without being asked.</li>
          <li class="good">It's the hat logo restacked: nothing new to learn or keep in step.</li>
          <li class="bad">The clock is letter-sized here. Under about 40 px it's a word shape, but the app always prints the name beside it.</li>
          <li class="bad">The tab icon at 16 px is still a ring with two bars. It's crisp, but it's small.</li>
        </ul>
      </article>
      <article class="way">
        <h3>Put the hands inside, on screens only</h3>
        <p class="what">On screens the ring becomes the dial and the hands sit inside it, so the clock fills the square. Hats keep the hands outside.</p>
        <div class="shots">
          <div class="shot"><span class="label">Profile picture and app icon</span>${img(sq('3-clock-face', 'light'), 112, 'circle')}${img(sq('3-clock-face', 'dark'), 112, 'circle')}${img(sq('3-clock-face', 'light'), 44, 'circle')}${img(sq('3-clock-face', 'dark'), 84, 'icon')}</div>
          <div class="shot"><span class="label">Browser tab</span>${tab(uri('tab/face-16-light.svg'))}${img(uri('tab/face-16-light.svg'), 32, 'square')}${img(uri('tab/face-16-dark.svg'), 32, 'square')}</div>
        </div>
        <ul class="facts">
          <li class="good">The clearest of all: 6 of 6 people saw a clock at 5:00, 9 out of 10 sure, at every size.</li>
          <li class="bad">3 of 6 called it a generic clock icon or a phone's clock app, which the logo brief ruled out.</li>
          <li class="bad">It's a second clock to learn: hands inside on screens, outside on the hats.</li>
        </ul>
      </article>
    </div>
  </section>

  <section aria-labelledby="dropped">
    <h2 id="dropped">Tried and dropped</h2>
    <div class="dropped">
      <div><div class="row">${img(sq('0-as-is', 'light'), 56, 'circle')}<span class="num">6.3</span><span class="label">/10 a clock</span></div><h3>The hat clock alone</h3><p>Centred and as big as it gets, the ring is still a third of the square. Also seen as a magnifying glass, a Q or a target.</p></div>
      <div><div class="row">${img(sq('1-bleed', 'light'), 56, 'circle')}<span class="num">4.7</span><span class="label">/10 a clock</span></div><h3>Hands off the edge</h3><p>Bigger, but with the tips cut off the hands stop looking like hands: a bullseye, a donut, a scope.</p></div>
      <div><div class="row">${img(sq('2-square-master', 'light'), 56, 'circle')}<span class="num">5.7</span><span class="label">/10 a clock</span></div><h3>Shorter hands</h3><p>Barely bigger, and it reads as the search icon. Every way of keeping the hands whole tops out at about a third.</p></div>
    </div>
  </section>

  <section aria-labelledby="kit">
    <h2 id="kit">Then the brand kit</h2>
    <p>Once you pick, I'll make every file from the same drawings, in light, dark and one-colour versions.</p>
    <ul class="kit">
      <li><b>Main logo, one line</b><span>SVG and PDF for print, PNG for everything else</span></li>
      <li><b>Square logo</b><span>Whichever way you pick, same files</span></li>
      <li><b>Clock symbol</b><span>For hats, patches and die-cut stickers, same files</span></li>
      <li><b>Browser tab and phone icons</b><span>Drawn for 16, 32 and 48 px, plus 180, 192 and 512 px home-screen icons</span></li>
      <li><b>Profile pictures</b><span>1080 x 1080, one file that works on Instagram, TikTok and Facebook</span></li>
      <li><b>Shopify</b><span>Header logo, square logo, tab icon and the share image</span></li>
      <li><b>One-page brand sheet</b><span>Colours with hex, RGB and thread, fonts and smallest sizes</span></li>
      <li><b>Rules for the logo</b><span>Clear space, which version goes where, and what not to do</span></li>
    </ul>
  </section>

  <p class="foot">Your store's tab icon today is the hat clock shrunk to 32 pixels, which is why it looks like a smudge. Either way, it gets its own drawing. Light versions are Ink and Rust on Bone; dark versions are Bone and Sun on Slate.</p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(DIR, 'page.html'), html);
console.log('wrote page.html', (html.length / 1024).toFixed(0) + ' KB');
