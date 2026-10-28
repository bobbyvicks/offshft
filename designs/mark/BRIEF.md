# Brief: make "Hands Only" into a real logo

You are a senior brand identity designer working on OFF SHFT, a small embroidered-hat brand about earned free time: you put in the hours, the time after your shift is yours. Audience: working people who fish, golf and hang out at the cottage or in the backyard on their time off.

Style the owner chose: minimal and modern, in the spirit of Duck Camp and Huk. Quiet, small, confident, lots of empty fabric. The owner rejected an earlier round as "super AI and ugly" (heavy condensed block fonts, clip-art icons, everything big and centred, fake hat mockups). Do NOT draw hats or mockups. Show artwork flat on fabric colour only.

From 12 logo directions the owner picked "Hands Only": two clock hands showing 5:00 (quitting time) with no clock circle, beside the OFF SHFT wordmark. Baseline files (look at them with the Read tool): `/home/user/offshft/designs/mark/baseline/L12-lockup.png` and `/home/user/offshft/designs/mark/baseline/L12-mark-sizes.png`. The owner asked: "how could we make that more of a logo". Problems with the baseline: it reads as a random bent stick or hockey stick, the hub is a blob, the proportions feel arbitrary, and it has no presence or silhouette as a symbol.

## Hard rules

- The hands must read as exactly 5:00: minute hand straight up (0 degrees), hour hand at 150 degrees clockwise from 12. `kit.polar(cx, cy, deg, r)` and `kit.FIVE` help.
- Embroidery: flat colours only. No gradients, shadows, opacity or hairlines. At 25 mm (typical front-of-hat size) no line or gap thinner than 1.2 mm, and enclosed holes must stay open (at least 1.2 mm). It should still read at 13 mm (side of a hat); a simplified small version is allowed if needed.
- It must work in one colour. At most 3 thread colours in any version.
- Thread colours: Bone #ECE5D3, Ink #1F2733, Rust #B4552D, Sun #D29B3C, Sage #9AA383. Fabric colours: Bone #E4DDCB, Oat #C7B48E, Moss #5A5F40, Spruce #2E3D35, Slate #27303D, Rust #8E4426.
- Wordmark text is exactly OFF SHFT, uppercase, set with the kit's outlined Archivo fonts (names: xblack, xbold, xsemi, xmed, sxbold, bold, semi; the x ones are expanded width). Choose weight and tracking deliberately.
- Original work. It must not resemble existing brand logos (watch or clock brands, phone clock app icons, etc.).

## Tools

Node 22; Chromium via Playwright and ImageMagick are installed.

- Kit: `/home/user/offshft/tools/kit/kit.cjs`. Read its header comment first. `kit.text(str, {font, cap, track, fill, x, y, anchor})` returns `{svg, width, letters}`; `kit.stem(font, cap)`; `kit.polar`; `kit.writeSvg(file, {w, h, body})` in mm; `await kit.render(svgFile, pngFile, {bg})`; `await kit.sizes(svgFile, pngFile, {bg})`; `await kit.close()` at the end.
- Write your own build script in your folder (for example `build.cjs`) that requires the kit by absolute path and generates all your files. Rerun it as you iterate.
- Contact sheets: `montage -label '%t' a.png b.png ... -tile 4x -geometry 440x256+8+8 -pointsize 18 -background '#888888' sheet.png`

## Process

Draw, render, LOOK at the PNGs with the Read tool, fix, repeat. Do at least two rounds of visual critique per variant. Judge your own work hard: would a skilled human identity designer sign off on it? Check balance, optical weight (diagonals look thinner than verticals at the same width; round shapes need slight overshoot), consistent terminals, a deliberate spacing unit between mark and wordmark (for example the stem width or hub diameter), and alignment of the mark to the wordmark's cap height and baseline.

Only write inside your own folder. Do not edit anything in `/home/user/offshft/tools` and do not run git.
