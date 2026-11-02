# TIME WELL EARNED. (Time Well Earned. T-Shirt)

TIME WELL EARNED. in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, drawn for the centre chest at cap 10.8 mm: the largest cap (in 0.1 mm steps) at which the file fits 95 mm, so the block is 88.64 mm wide (the file 94.27 mm) and at least 3 mm is spare each side of Printful’s 4 x 4 in square. Stacked TIME over WELL over EARNED., all three lines centred on their letters, with the full stop hanging past the line, at Punched Out.’s line gap, so the block is 43.96 mm tall. The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the Time Well Earned. T-Shirt (C$44.99): T-shirt, centre chest: Heavyweight (Comfort Colors 1717), S to 3XL.

**This file is written by `designs/phrases/build.cjs`** (one build for the phrase designs: the six of 30 Oct 2026 and the five added 2 Nov 2026 for the listings made outside this repo). Every number below is measured from the generated artwork. Change the build and rebuild (`cd tools && node ../designs/phrases/build.cjs`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
| `design-light.svg`, `design-dark.svg` | TIME WELL EARNED. as TIME over WELL over EARNED., centred, 88.64 x 43.96 mm (the file 94.27 mm wide, centred on the letters) |
| `proof-light.png`, `proof-dark.png` | True-size proofs: the light file on Bone, the dark file on Slate |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where it goes

| Placement | Position |
|---|---|
| T-shirt, centre chest: Heavyweight (Comfort Colors 1717) | Centred in Printful’s 4 x 4 in (101.6 mm) centre-chest square: 3.7 mm spare each side, 28.8 mm above and below |

- Sized to the square: cap 10.80 mm is the largest, in 0.1 mm steps, at which the file fits 95 mm (the listing says about 95 mm wide, and 95 leaves 3.3 mm each side, over the 3 mm floor); at cap 10.9 it would be 95.14 mm.
- Centre the file. It is 94.27 mm wide: 5.63 mm of it is empty margin on the left, the width the full stop hangs past EARNED, so the file’s centre is the letters’ centre. Centring the ink instead would put the letters 2.82 mm to the wearer’s right of centre.

## Construction (measured)

| | |
|---|---|
| Size | 88.64 x 43.96 mm of ink; the file is 94.27 x 43.96 mm, with 5.63 mm of empty margin on the left so its centre is the letters’ centre (see “Where it goes”) |
| Cap height | 10.80 mm |
| Stems (T I M E L R N D) | 2.84-2.99 mm |
| Thinnest stroke | 2.16 mm, in the E |
| Thinnest stroke in each letter | T 2.65, I 2.98, M 2.53, E 2.16, W 2.50, L 2.65, A 2.40, R 2.19, N 2.64, D 2.64 |
| Narrowest opening in each letter that has one | E 1.90, R 2.50, D 5.50, A 2.30 (crotch tips aside) |
| Widest satin stroke | 3.71 mm, in the N (the largest circle that fits inside the ink; Printful’s satin limit is 12 mm) |
| E slots | 1.90 / 1.90 mm |
| A counter | a triangle 3.51 mm wide and 4.06 mm tall; a 2.30 mm circle fits inside it |
| R, under the bowl | the notch between the stem and the leg is 1.57 mm wide where it meets the bowl, opening out below (a 36.7-degree crotch with its point cut off) |
| Crotches (sharp inside corners) | A 46.8 deg, M 23.4 deg (two in the M), M 45.2 deg, N 35.1 deg (two in the N), W 34.0 deg (two in the W), W 37.5 deg |
| Tightest letter gaps | E-A 2.37, A-R 2.75, L-L 2.79 mm |
| Line gap | 5.71 mm |
| Full stop | 3.31 mm round, 3.06 mm from the D |
| Ink | 1069.4 mm² |

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom). Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): A 46.8 deg 1.2-1.3 mm, M 23.4 deg 2.4-2.8 mm, M 45.2 deg 1.2-1.4 mm, N 35.1 deg 1.6-1.8 mm, W 34.0 deg 1.6-1.9 mm, W 37.5 deg 1.5-1.7 mm.

Changes from the font (each passed to the logo’s `glyphMM` as a per-letter table, so the logo itself is unchanged):

- **E, straight stem** (Punched Out.’s): the F’s and H’s stem with the E’s own arms and bar, so its stem matches the other letters’. Unbounded bends it; Punched Out.’s cold readers all flagged the bent one. No slot trim at this size: the slots are 1.90 mm as the font draws them.
- Kerning on top of the font’s spacing (in cap heights): T-I -0.020 (this set’s), L-L -0.020 (this set’s), E-A -0.009 (the font’s own -14 units and this set’s +0.010), E-D -0.020 (Punched Out.’s) and D-. -0.041 (the font’s own: -31 units). kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and `build.cjs` gives the reason for each (`EXTRA_KERN`). Nothing else is kerned.

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
| cap height | 10.80 mm | >= 6.6 | pass |
| thinnest stroke (in the E) | 2.16 mm | >= 1.27 | pass |
| widest satin stroke (in the N) | 3.71 mm | <= 12 | pass |
| smallest opening inside a letter (in the E) | 1.90 mm | >= 1.27 | pass |
| E slots | 1.90 mm | >= 1.27 | pass |
| A counter (widest circle inside it) | 2.30 mm | >= 1.27 | pass |
| full stop across | 3.31 mm | >= 1.5 | pass |
| fabric round the full stop | 3.06 mm | >= 1.3 | pass |
| tightest gap between letters (E-A) | 2.37 mm | >= 1.47 | pass |
| gap between the lines | 5.71 mm | >= 1.47 | pass |
| fits the 101.6 x 101.6 mm centre-chest square (spare on the tighter side) | 3.67 mm | >= 3 spare each side | pass |

Floors: cap 6.6 mm (any embroidered Unbounded Bold, the logo’s rule); every opening inside a letter and every stroke at least 1.27 mm as drawn (0.05 in: Printful’s minimum gap and line); the full stop at least 1.5 mm across with 1.3 mm of fabric round the stop (the logo’s pivot-dot rule); letters at least 1.47 mm apart (the logo’s F-T); no satin stroke wider than 12 mm (Printful’s satin limit, measured as the largest circle inside the ink); at least 3 mm spare each side of the 101.6 mm square. Crotches (where two strokes meet in a point, as the N’s) are listed above, not counted as openings, as for Punched Out.

## Colourways

| Fabric | Threads |
|---|---|
| Bone and other light colours | Ink letters, Rust stop (`design-light.svg`) |
| Slate, Spruce | Bone letters, Sun stop (`design-dark.svg`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink in one colour |
| Moss, Rust | Bone in one colour |

One colour is the same artwork with the full stop in the letter thread; nothing else changes. The hex values are targets: match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank. The fabric colours come later (the owner adds them).

## Notes for the digitizer

- Digitize each size on its own and never scale a stitch file.
- Satin throughout, 2.84-2.99 mm stems. One colour change: the letters, then the full stop.
- Stitch order, centre out (bottom line first, as caps sew centre out and bottom up), then the colour change and the full stop: EARNED.: N, E, D, then R, A, E; WELL: E, L, L, then W; TIME: M, E, then I, T.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Standard compensation everywhere: the narrowest opening is 1.90 mm (the E).
- Crotches: the N’s two 35.1-degree crotches, where the diagonal meets each stem (thread fills about 1.6-1.8 mm of each), the W’s two 34.0-degree crotches, at the foot of the two notches that open from the top (thread fills about 1.6-1.9 mm of each) and the W’s 37.5-degree crotch, under the middle peak (thread fills about 1.5-1.7 mm of it) and the M’s two 23.4-degree crotches between its stems and diagonals (8.15 mm tall; thread fills about 2.4-2.8 mm of each) and its 45.2-degree crotch at the top of its V (about 1.2-1.4 mm). Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.
- M: its inner crotches are the sharpest in this set. Approve only if the sew-out shows both lower counters open over at least half their height (4.08 mm). If they close further, open the crotches in the artwork (in `build.cjs`) rather than counting on the note above: Printful digitizes the file itself, so a digitizing note may not reach its digitizer.
- A: its counter is a triangle (3.51 x 4.06 mm; a 2.30 mm circle fits) whose top is a 46.8-degree point; thread fills about 1.2-1.3 mm of it. Keep compensation off the counter’s faces.
- R: the notch between its stem and leg is 1.57 mm wide where it meets the bowl and opens out below; 0.05 mm compensation on its faces, so only its top fills.
- Full stop: satin dot with 0.10 mm compensation, straight after the colour change. It has 3.06 mm of fabric to the D.
- Approve only after a sew-out on the actual blank shows both E slots at least 1.0 mm open, the crotches of the N, W and M open and the A’s counter open as a triangle.

## Review

- Not cold-read and not sewn out yet. Cold-read the proofs before ordering samples, for the letters changed from the font: Punched Out.’s straight E (not cold-read yet either).
- Trademark (a quick web screen, store/research/trademarks-new-phrases.md, not a legal search): looks clear: no filing or seller found; the nearest live registration, TIME WELL SPENT (US Reg. 3252699), has unknown goods, so open that record first. Check USPTO and CIPO before ordering samples.
