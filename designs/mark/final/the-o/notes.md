# OFF SHFT logo: The O

The O in OFF is a clock at 5:00, quitting time. Two bar hands stand out of the ring across an even gap, and a pivot dot sits in the middle. The hands and the dot are stitched in the accent thread, so they read as hands laid on a dial.

The letters are the real font, Unbounded Bold, typed: letter-spacing 0.12 em and three kerns (F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap). Anyone with the font can set the name. This is the owner's call of 2 Nov 2026. It replaces the hand-drawn block version of earlier that day, whose S was a traced outline. The clock keeps the bar hands with square ends from the hat mockups.

Pick the Bold weight (700). The repo's tools/fonts/Unbounded-Bold.ttf has the Bold outlines, though its internal name reads Regular.

**This file is written by `build.cjs`.** Every number below is measured from the generated artwork. Change `build.cjs` and rebuild; never edit the files by hand.

## Files

| File | What it is |
|---|---|
| `logo-light.svg` | Main lockup for light fabric: Ink letters and ring, Rust hands and dot. 62.6 x 16.3 mm, letters 7 mm (the hat-front and chest file) |
| `logo-dark.svg` | Main lockup for dark fabric: Bone letters and ring, Sun hands and dot |
| `logo-one-colour-ink.svg`, `logo-one-colour-bone.svg` | One thread only: no dot, full ring, 1.5 mm channel |
| `symbol-light/dark/one-colour-ink/one-colour-bone.svg` | The clock alone, 25 mm tall (patches, hat back, avatar) |
| `symbol-light-19mm/25mm/40mm.svg` | The clock at its sizes (40 mm: the clock hat's front on light caps) |
| `symbol-dark-40mm.svg`, `symbol-one-colour-ink-40mm.svg` | The 40 mm clock for dark caps, and in one colour Ink (no dot) for Oat-like caps |
| `side-light/dark/one-colour-ink/one-colour-bone.svg` | Side-of-hat master, its own small drawing |
| `stacked-light.svg` | OFF over SHFT, for squares (the brand kit draws the colourways and the tiles) |
| `logo-light-cap6.6/7/10.svg` | Size proofs: the S floor (no dot), the main file, a hat-size proof |
| `sheet.png`, `sizes-lockup.png`, `sizes-symbol.png` | Renders of the above on fabric |

## Construction (at cap height 7 mm)

| Part | Rule | At cap 7 |
|---|---|---|
| Wordmark | Unbounded Bold, letter-spacing 0.12 em, kerns F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline | 62.6 x 16.3 mm overall (one colour 17.2 mm tall) |
| Letter strokes | Measured from the font | stem 1.93 mm, arm 1.63 mm |
| Ring | The same height as the font's O, centred on it; the F follows at the font's own O-to-F spacing | 7.30 mm across |
| Ring walls | Sides 0.82 x the stem with the dot in (1.0 x without it, 0.98 x one colour); top and bottom 0.9 x the sides | 1.58 mm sides, 1.43 mm top and bottom; counter 4.13 x 4.45 mm; one colour 1.89 mm sides |
| Channel | Even gap between the ring and the hands. Two colours max(1.0, 0.143 cap); one colour 1.2, 1.5 from cap 7 | 1.00 mm (one colour 1.50 mm) |
| Hands | Plain bars, square ends, flat bases, the stem wide. Minute hand 1.26 R long past the channel at 12; hour hand 0.79 R at 150 degrees (R: the ring's outer radius) | 1.93 mm wide; minute 4.60 mm, hour 2.88 mm |
| Pivot dot | Hand colour, at most 0.286 cap, at least 1.3 mm of fabric to the counter, at least 1.5 mm across or left out. Two colours only, from cap 7 | 1.53 mm with 1.30 mm of fabric |
| S | Terminals trimmed by straight cuts so both apertures are 1.0 mm (upper / lower trim; none from cap 10.6 / 11.1). The logo's cut limits, in font units: the upper cut from x 540 at y 519, the lower cut to x 300 at y 246 (the phrase builds keep the font table's 560 / 260) | 0.36 / 0.41 mm |
| F-T | Gap between the F arm and the T bar (the main file's guard is 1.46 mm; the gap scales with the letters, 1.38 mm at cap 6.6) | 1.467 mm |
| Seam | Centre of the word space, from the lockup's centre | -5.22 mm |

## Sizes

| Drawing | Numbers |
|---|---|
| Lockup at cap 6.6 (the S floor) | 59.1 x 15.4 mm, no dot, ring sides 1.82 mm, channel 1.00 mm, S trims 0.40 / 0.45 mm |
| Lockup at cap 10 (hat-size proof) | 89.5 x 23.2 mm, dot 2.86 mm with 1.52 mm of fabric, channel 1.43 mm, S trims 0.06 / 0.11 mm |
| 19 mm clock | ring 8.5 mm, wall 1.85 mm, channel 1.17 mm, hands 2.26 mm wide, dot 2.23 mm with 1.30 mm of fabric |
| 19 mm clock, one colour | ring 8.2 mm, walls 2.13 / 1.92 mm, channel 1.50 mm, hands 2.18 mm wide, no dot |
| 25 mm clock | 12.9 x 25.0 mm: ring 11.5 mm, wall 2.51 mm, channel 1.20 mm, hands 3.06 mm wide, minute 7.27 mm, hour 4.56 mm, dot 3.17 mm with 1.68 mm of fabric |
| 40 mm clock | 20.8 x 40.0 mm: ring 18.9 mm, wall 4.10 mm, channel 1.50 mm, hands 5.00 mm wide, minute 11.89 mm, hour 7.45 mm, dot 5.18 mm with 2.75 mm of fabric |
| Side-of-hat master | 8.2 x 16.1 mm (one colour 8.3 x 16.7 mm): 7.4 mm ring, 1.6 mm wall, 1.5 mm dot, hands 1.5 mm wide and 4.2 / 2.8 mm long, 1.2 mm channel (one colour 1.5 mm, no dot) |
| Stacked logo | 48.7 x 36.3 mm at cap 10: the ring and FF on one line, SHFT under it on the ring's left edge, its cap line a hand's width below the hour hand |

Floors. Cap 7 is the main file and the smallest size with the pivot dot. Cap 6.6 is the absolute minimum, set by the S apertures; from there to cap 7 the lockup has no dot and a full ring. One colour: cap 7 minimum, no dot. The clock alone: 19 mm minimum, in two colours or one (one colour has no dot; at 19 mm its channel is 1.5 mm and nothing in it is thinner than 1.92 mm). From 35 mm the channel is 1.5 mm. Under 19 mm, use the side master only. Never scale a file down; rebuild at the size. On the 40 mm clock no stroke or dot is wider than 5.2 mm; the floor is 12, so plain satin stitches it.

## Colourways

| Fabric | Version |
|---|---|
| Bone | Ink + Rust (`logo-light`) |
| Slate, Spruce | Bone + Sun (`logo-dark`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink one colour |
| Moss, Rust | Bone one colour |

The hex values are targets. Match each to the nearest colour on a thread card and approve from a sew-out on the real blank. One-colour versions are for tonal or single-thread jobs, never the default front logo.

## For the digitizer

- Digitize each size on its own. Never scale a stitch file.
- Stitch order: letters from the centre out (S, H, F, T, then F, F), the ring last, then the accent: pivot dot first, then the hour hand, then the minute hand. One colour change.
- Pull compensation: 0.15-0.18 mm per edge, plus 0.05 mm where stitches run horizontally. Only 0.05-0.10 mm per edge on edges facing the channel, the S necks, the pivot dot and the ring's inner edge at 3 and 9 o'clock.
- Hands: square ends as drawn. Pull both ends back 0.2 mm with no end compensation, so the channel stays open.
- S: the trims are in the artwork. Pull both terminal ends back 0.2 mm and hold spine-edge compensation to 0.10 mm at the necks, so the apertures finish at 0.9-1.0 mm.
- F-T: pull both facing bar ends back 0.15 mm with no end compensation.
- 6-panel caps: the centre seam would cross the S. Shift the lockup **5.2 mm right** so the seam falls in the word space. 5-panel and seamless fronts stay centred.
- Approve only after a sew-out on the actual blank shows the channel at least 0.8 mm open, the O's counter open, both S apertures open and the dot with at least 1.0 mm of fabric all round.
