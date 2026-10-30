# NO ALARM SET. (No Alarm Set. Crewneck)

NO ALARM SET. in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, drawn for the big centre front at cap 15.6 mm, so the line is 229.73 mm wide: the largest cap (in 0.1 mm steps) that fits the 230 mm box the store uses for the tops’ big front, as Punched Out.’s one-line-large (229.75 mm at cap 16.5). On one line. The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the No Alarm Set. Crewneck (C$79.99): Crewneck, big centre front: Comfort Colors 1466, S to 3XL.

**This file is written by `designs/phrases/build.cjs`** (one build for all six phrase designs). Every number below is measured from the generated artwork. Change the build and rebuild (`cd tools && node ../designs/phrases/build.cjs`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
| `design-light.svg`, `design-dark.svg` | NO ALARM SET. on one line, drawn for the big centre front, 229.73 x 16.27 mm |
| `proof-light.png`, `proof-dark.png` | True-size proofs: the light file on Bone, the dark file on Slate |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where it goes

| Placement | Position |
|---|---|
| Crewneck, big centre front: Comfort Colors 1466 | Centred on Printful’s large front: 0.1 mm spare each side of the store’s 230 mm box (Printful’s large-front limit is 10 x 6 in, 254 x 152 mm) |

- The owner’s call for the tops (store/picks.md): big on the centre front, as Punched Out. goes there.

## Construction (measured)

| | |
|---|---|
| Size | 229.73 x 16.27 mm |
| Cap height | 15.60 mm |
| Stems (N L R M E T) | 4.10-4.33 mm |
| Thinnest stroke | 2.81 mm, in the S |
| Thinnest stroke in each letter | N 3.81, O 3.85, A 3.47, L 3.83, R 3.16, M 3.66, S 2.81, E 3.12, T 3.83 |
| Narrowest opening in each letter that has one | O 8.57, R 3.61, S 2.51, E 2.75, A 3.32 (crotch tips aside) |
| E slots | 2.75 / 2.75 mm |
| S apertures (upper / lower) | 2.51 / 2.53 mm |
| S counters, where they narrow (upper / lower) | 2.60 / 2.72 mm |
| S strokes | top and bottom arcs 3.33 / 3.33 mm, spine 3.52 mm (3.52-3.58 along it) |
| A counter | a triangle 5.08 mm wide and 5.87 mm tall; a 3.32 mm circle fits inside it |
| R, under the bowl | the notch between the stem and the leg is 2.27 mm wide where it meets the bowl, opening out below (a 36.7-degree crotch with its point cut off) |
| Crotches (sharp inside corners) | A 46.8 deg, M 23.4 deg (two in the M), M 45.2 deg, N 35.1 deg (two in the N) |
| Tightest letter gaps | L-A 2.13, E-T 3.22, A-R 3.97 mm |
| Word spaces | O-A 11.76 mm at the closest, a 10.21 mm clear channel from top to bottom; M-S 12.52 mm at the closest, a 12.52 mm clear channel from top to bottom |
| Full stop | 4.78 mm round, 6.91 mm from the T |
| Ink | 1639.4 mm² |

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom). Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): A 46.8 deg 1.2-1.3 mm, M 23.4 deg 2.4-2.8 mm, M 45.2 deg 1.2-1.4 mm, N 35.1 deg 1.6-1.8 mm.

Changes from the font (each passed to the logo’s `glyphMM` as a per-letter table, so the logo itself is unchanged):

- **E, straight stem** (Punched Out.’s): the F’s and H’s stem with the E’s own arms and bar, so its stem matches the other letters’. Unbounded bends it; Punched Out.’s cold readers all flagged the bent one. No slot trim at this size: the slots are 2.75 mm as the font draws them.
- **S, this set’s S**: its terminals cut flat 1.10 mm (upper) and 1.25 mm (lower) higher than the font’s, the same cut as on the hats (faces at 572 and 186 font units), so its apertures are 2.51 / 2.53 mm. As the font draws it they’d be 1.50 / 1.42 mm here (0.09 cap, against the E’s 0.18 cap slots), about 1.06 mm after standard compensation, and the S would look closed beside the other letters. No other change at this size (the inside move of the hats’ S is none from cap 14): counters at least 2.60 mm where they narrow, arcs 3.33 / 3.33 mm, spine 3.52 mm; its thinnest stroke, 2.81 mm, is at the upper terminal’s end, where the flat cut meets the outer curve.
- Kerning on top of the font’s spacing (in cap heights): space-A -0.047 (the font’s own: -35 units), L-A -0.050 (this set’s), S-E -0.004 (the font’s own: -3 units), E-T -0.052 (the font’s own -9 units and this set’s -0.040) and T-. -0.171 (the font’s own, as Punched Out.). kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and `build.cjs` gives the reason for each (`EXTRA_KERN`). Nothing else is kerned.

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
| cap height | 15.60 mm | >= 6.6 | pass |
| thinnest stroke (in the S) | 2.81 mm | >= 1.27 | pass |
| smallest opening inside a letter (in the S) | 2.51 mm | >= 1.27 | pass |
| A counter (widest circle inside it) | 3.32 mm | >= 1.27 | pass |
| S apertures (upper / lower) | 2.51 mm | >= 1.27 | pass |
| S counters, at their narrow ends (upper / lower) | 2.60 mm | >= 1.27 | pass |
| E slots | 2.75 mm | >= 1.27 | pass |
| full stop across | 4.78 mm | >= 1.5 | pass |
| fabric round the full stop | 6.91 mm | >= 1.3 | pass |
| tightest gap between letters (L-A) | 2.13 mm | >= 1.47 | pass |
| fits the 230 x 90 mm big-front box (spare on the tighter side) | 0.14 mm | >= 0 spare each side | pass |

Floors: cap 6.6 mm (any embroidered Unbounded Bold, the logo’s rule); every opening inside a letter and every stroke at least 1.27 mm as drawn (0.05 in: Printful’s minimum gap and line); the full stop at least 1.5 mm across with 1.3 mm of fabric round the stop (the logo’s pivot-dot rule); letters at least 1.47 mm apart (the logo’s F-T). Crotches (where two strokes meet in a point, as the N’s) are listed above, not counted as openings, as for Punched Out.

## Colourways

| Fabric | Threads |
|---|---|
| Bone and other light colours | Ink letters, Rust stop (`design-light.svg`) |
| Slate, Spruce | Bone letters, Sun stop (`design-dark.svg`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink in one colour |
| Moss, Rust | Bone in one colour |

One colour is the same artwork with the full stop in the letter thread; nothing else changes. The hex values are targets: match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank. The fabric colours come later (the owner adds them).

## Notes for the digitizer

- Digitize each size on its own and never scale a stitch file. This is its own drawing at cap 15.6, not a cap-7 file scaled up (the cap-7 trims shrink with size and are none here; the S’s shorter terminals are part of the letters’ drawing and stay).
- Satin throughout, 4.10-4.33 mm stems. One colour change: the letters, then the full stop.
- Stitch order, centre out, then the colour change and the full stop: R, M, S, E, T, then A, L, A, O, N.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Standard compensation everywhere: the narrowest opening is 2.51 mm (the S).
- S: the artwork already includes the shorter terminals. Pull both terminal ends back 0.2 mm with no end compensation, as for the logo’s S.
- Crotches: the N’s two 35.1-degree crotches, where the diagonal meets each stem (thread fills about 1.6-1.8 mm of each) and the M’s two 23.4-degree crotches between its stems and diagonals (11.77 mm tall; thread fills about 2.4-2.8 mm of each) and its 45.2-degree crotch at the top of its V (about 1.2-1.4 mm). Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.
- M: its inner crotches are the sharpest in this set. Approve only if the sew-out shows both lower counters open over at least half their height (5.89 mm). If they close further, open the crotches in the artwork (in `build.cjs`) rather than counting on the note above: Printful digitizes the file itself, so a digitizing note may not reach its digitizer.
- A: its counter is a triangle (5.08 x 5.87 mm; a 3.32 mm circle fits) whose top is a 46.8-degree point; thread fills about 1.2-1.3 mm of it. Keep compensation off the counter’s faces.
- R: the notch between its stem and leg is 2.27 mm wide where it meets the bowl and opens out below; 0.05 mm compensation on its faces, so only its top fills.
- Full stop: 4.78 mm across: satin, or a fill if it looks loose; straight after the colour change. It has 6.91 mm of fabric to the T.
- Fleece: water-soluble topping, so the loft doesn’t swallow the openings and the crotches.
- Big front: stems 4.10-4.33 mm, under the 4.4 mm columns the logo sews in plain satin (its 45 mm symbol), so plain satin should hold; split the stems if the sew-out shows long, loose stitches. A rough stitch count from the ink area (1639.4 mm², 2.54 sq in at 1,200-2,400 stitches per square inch of satin): about 3,000-6,000, under the 15,000 at which Printful’s large-embroidery stitch charge starts (store/research/caps-and-hoodie.md).
- Approve only after a sew-out on the actual blank shows both E slots at least 1.0 mm open, both S apertures at least 1.0 mm open and its counters open, the crotches of the N and M open and the A’s counter open as a triangle.

## Review

- Not cold-read and not sewn out yet. Cold-read the proofs before ordering samples, for the letters changed from the font: Punched Out.’s straight E (not cold-read yet either) and this set’s S.
- Trademark (a quick web screen, designs/phrases/notes.md, not a legal search): looks clear: the nearest filing is NO ALARM (US serial 73382366), abandoned. Check USPTO and CIPO before ordering samples.
