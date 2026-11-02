# OFF SHFT logo: the block version

The O in OFF is a clock at 5:00 (quitting time): a heavy ring with a pivot dot, and two bar hands standing off it. The letters are blocks: F, H and T drawn from rectangles, the S Unbounded Bold's S thickened with its terminals cut flat. It is the lettering from the hat mockups (Codex's "puff adaptation", 29 Oct 2026), which the owner picked over the rounded Unbounded version on 2 Nov 2026 ("the hard edged one"). The rounded version stays in `../the-o/` for the record.

**This file is written by `build.cjs`.** Every number is measured from the generated artwork. Change `build.cjs` and rebuild; never edit the files by hand.

## Files

| File | What it is |
|---|---|
| `logo-light.svg` | Main lockup for light fabric: Ink letters and ring, Rust hands and dot. 68.6 mm wide (the hat-front and chest file), letters 10.7 mm |
| `logo-dark.svg` | Main lockup for dark fabric: Bone letters and ring, Sun hands and dot |
| `logo-one-colour-ink.svg`, `logo-one-colour-bone.svg` | One thread only: no dot, 1.5 mm channel |
| `symbol-*.svg` | The clock alone, 25 mm tall (patches, hat back, avatar); `symbol-light-19/25/40mm.svg`, `symbol-dark-40mm.svg`, `symbol-one-colour-ink-40mm.svg` as before |
| `side-*.svg` | Side-of-hat master, its own small drawing (7.4 mm ring) |
| `stacked-light.svg` | OFF over SHFT, for squares (the brand kit draws the colourways) |
| `logo-light-cap10.7/12/14.svg` | Size proofs (the first is the floor, the main file) |

## Construction (fractions of the letter height; at the 68.6 mm lockup, letters 10.69 mm)

| Part | Rule | Here |
|---|---|---|
| F, H, T | Blocks. Stem 0.271 cap; F top arm 0.299 cap, crossbar 0.300 cap starting 0.383 cap down (or 1.0 mm below the arm where that is more: the bar moves whole); H bar 0.330 cap starting 0.328 down; T bar 0.330 cap. Widths F 0.623, H 0.726, T 0.712 cap | stem 2.90 mm, arm 3.20 mm, F slot 1.00 mm, H counter 1.97 mm |
| S | Measured outline (`s-outline.json`), 1.016 cap wide. Its mouths (terminal face to spine face) are opened in the drawing from 0.077 to 0.100 cap; their narrowest point is 1.0 mm at the floor | mouths 1.07 / 1.07 mm flat to flat; enclosed counters 1.07 / 1.18 mm |
| Ring | Outer 0.944 cap across, wall 0.257 cap, centred 0.469 cap below the cap line (top of the ring on the cap line) | 10.09 mm across, wall 2.75 mm, counter 4.60 mm |
| Hands | Bars 0.248 cap wide with square ends. Minute: 0.594 cap long at 12. Hour: 0.374 cap at 150 degrees. Both start 0.075 cap off the ring (floor: 1.0 mm two colours, 1.2 one colour, 1.5 from 7 mm caps) | 2.65 wide; minute 6.35, hour 4.00 mm; channel 1.00 mm |
| Pivot dot | Hand colour, 0.271 cap, no more than leaves 1.3 mm of fabric to the ring; left out under 1.5 mm and in one colour | 2.00 mm, 1.30 mm of fabric |
| Spacing | Ring to F 0.166 cap; between letters 0.070 cap; word space 0.7057 cap, the original logo's (the hat drawing had 0.140) | seam (word-space centre) -4.61 mm from the centre |
| Overall | | 68.6 x 21.8 mm (one colour 22.7 mm tall) |

## Sizes

| Drawing | Numbers |
|---|---|
| Lockup at cap 12 (69.6 mm wide) | 77.0 x 24.2 mm, dot 2.56 mm, F slot 1.01 mm, H counter 2.21 mm, S mouths 1.20 / 1.20 mm, S counters 1.20 / 1.32 mm |
| 25 mm clock | ring 11.6 mm, channel 1.20 mm, dot 2.66 mm with 1.30 mm of fabric |
| 40 mm clock | ring 18.9 mm, wall 5.14 mm, hands 4.95 mm wide, dot 5.42 mm with 1.59 mm of fabric |
| 19 mm clock | ring 8.7 mm, channel 1.00 mm, no dot |
| Side-of-hat master | 8.2 x 16.1 mm |

Floors: the 68.6 mm lockup is the smallest (letters 10.7 mm): there every gap in the S is at least 1.0 mm at its narrowest (the mouths 1.07 mm flat to flat, 1.01 mm where the faces end; the counters 1.06 and 1.17 mm at their middles); smaller, the S's enclosed counters close up whatever the mouths. The pivot dot needs letters of about 9.5 mm (1.5 mm dot with 1.3 mm of fabric inside a 0.215 cap counter), so the 68.6 mm lockup has it. Satin: nothing here is wider than 12 mm below a 45 mm clock (the ring wall is 0.257 cap, the hands 0.248 cap).

## Colourways

Bone fabric: Ink + Rust (`logo-light`). Slate, Spruce: Bone + Sun (`logo-dark`). Oat: Ink one colour unless a sew-out of Ink + Rust passes. Moss, Rust: Bone one colour. Hex values are targets: match them on a thread card and approve from a sew-out.
