# NOWHERE TO BE. (Nowhere To Be. Hoodie)

NOWHERE TO BE. in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, at the logo’s cap height of 7 mm, so its strokes are the logo’s strokes. Stacked NOWHERE over TO BE., both lines centred on their letters, with the full stop hanging past the line, at Punched Out.’s line gap, so the block is the logo’s 18 mm tall. The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the Nowhere To Be. Hoodie (C$89.99): Hoodies, left chest: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567), S to 3XL.

**This file is written by `designs/phrases/build.cjs`** (one build for all six phrase designs). Every number below is measured from the generated artwork. Change the build and rebuild (`cd tools && node ../designs/phrases/build.cjs`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
| `design-light.svg`, `design-dark.svg` | NOWHERE TO BE. as NOWHERE over TO BE., centred, 67.66 x 18.00 mm |
| `proof-light.png`, `proof-dark.png` | True-size proofs: the light file on Bone, the dark file on Slate |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where it goes

| Placement | Position |
|---|---|
| Hoodies, left chest: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567) | Centred in Printful’s 4 x 4 in (101.6 mm) left-chest square: 17.0 mm spare each side, 41.8 mm above and below |

- The block is the logo’s height (18.0 mm) and close to its width (62.6 mm), as Punched Out.’s chest stack (63.59 x 18.00 mm).

## Construction (measured)

| | |
|---|---|
| Size | 67.66 x 18.00 mm |
| Cap height | 7.00 mm |
| Stems (N H E R T B) | 1.88-1.94 mm |
| Thinnest stroke | 1.33 mm, in the B |
| Thinnest stroke in each letter | N 1.71, O 1.73, W 1.62, H 1.72, E 1.40, R 1.42, T 1.72, B 1.33 |
| Narrowest opening in each letter that has one | O 3.84, H 3.57, E 1.36, R 1.62, B 1.39 (crotch tips aside) |
| E slots | 1.36 / 1.36 mm |
| B counters (upper / lower) | 1.39 / 1.58 mm |
| R, under the bowl | the notch between the stem and the leg is 1.02 mm wide where it meets the bowl, opening out below (a 36.7-degree crotch with its point cut off) |
| Crotches (sharp inside corners) | N 35.1 deg (two in the N), W 34.0 deg (two in the W), W 37.5 deg |
| Tightest letter gaps | T-O 1.51, W-H 1.87, R-E 1.99 mm |
| Word space | O-B 5.55 mm at the closest, a 5.55 mm clear channel from top to bottom |
| Line gap | 3.55 mm |
| Full stop | 2.15 mm round, 1.91 mm from the E |
| Ink | 383.1 mm² |

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom). Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): N 35.1 deg 1.6-1.8 mm, W 34.0 deg 1.6-1.9 mm, W 37.5 deg 1.5-1.7 mm.

Changes from the font (each passed to the logo’s `glyphMM` as a per-letter table, so the logo itself is unchanged):

- **E, straight stem** (Punched Out.’s): the F’s and H’s stem with the E’s own arms and bar, so its stem matches the other letters’. Unbounded bends it; Punched Out.’s cold readers all flagged the bent one. Slots: the top arm’s underside raised and the bottom arm’s top lowered 0.13 mm, so each slot is 1.36 mm (Punched Out.’s cap-7 trim).
- **B, straight stem**, for the same reason: Unbounded bends the B’s stem as it does the E’s (left edge 47 -> 105 -> 47 font units). Rebuilt with the F/H stem (x 70-277) and the counters’ left edges straight. The notch between the bowls is filled 0.26 mm at its tip, so the lower bowl’s neck beside it is as thick as the B’s middle bar (1.21 mm as the font draws it, under the 1.27 mm floor).
- Kerning on top of the font’s spacing (in cap heights): O-W -0.032 (the font’s own: -24 units) and T-O -0.061 (the font’s own -31 units and this set’s -0.020). kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and `build.cjs` gives the reason for each (`EXTRA_KERN`). Nothing else is kerned.

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
| cap height | 7.00 mm | >= 6.6 | pass |
| thinnest stroke (in the B) | 1.33 mm | >= 1.27 | pass |
| smallest opening inside a letter (in the E) | 1.36 mm | >= 1.27 | pass |
| E slots | 1.36 mm | >= 1.27 | pass |
| B counters (upper / lower) | 1.39 mm | >= 1.27 | pass |
| full stop across | 2.15 mm | >= 1.5 | pass |
| fabric round the full stop | 1.91 mm | >= 1.3 | pass |
| tightest gap between letters (T-O) | 1.51 mm | >= 1.47 | pass |
| gap between the lines | 3.55 mm | >= 1.47 | pass |
| fits the 101.6 x 101.6 mm left-chest square (spare on the tighter side) | 16.97 mm | >= 0 spare each side | pass |

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

- Digitize each size on its own and never scale a stitch file.
- Satin throughout, 1.88-1.94 mm stems. One colour change: the letters, then the full stop.
- Stitch order, centre out (bottom line first, as caps sew centre out and bottom up), then the colour change and the full stop: TO BE.: O, B, E, then T; NOWHERE: H, E, R, E, then W, O, N.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Only 0.05 mm per edge on the faces of the E’s slots and the B’s upper counter, so they finish at about 1.26 and 1.29 mm (with full compensation they’d close to about 1.00 and 1.03 mm).
- E: the artwork already includes the slot trims.
- B: the stem is straight (as the E’s); sew it as one column. The notch between the bowls is blunted in the artwork; keep it that way rather than re-pointing it, so the lower bowl’s neck keeps its 1.33 mm.
- Crotches: the N’s two 35.1-degree crotches, where the diagonal meets each stem (thread fills about 1.6-1.8 mm of each) and the W’s two 34.0-degree crotches, at the foot of the two notches that open from the top (thread fills about 1.6-1.9 mm of each) and the W’s 37.5-degree crotch, under the middle peak (thread fills about 1.5-1.7 mm of it). Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.
- R: the notch between its stem and leg is 1.02 mm wide where it meets the bowl and opens out below; 0.05 mm compensation on its faces, so only its top fills.
- T: its bar’s end faces the O (1.51 mm), as the logo’s F-T faces 1.47 mm. Pull that end back 0.15 mm with no end compensation.
- Full stop: satin dot with 0.10 mm compensation, straight after the colour change. It has 1.91 mm of fabric to the E.
- Fleece: water-soluble topping, so the loft doesn’t swallow the openings and the crotches.
- Approve only after a sew-out on the actual blank shows both E slots at least 1.0 mm open, both B counters open and the crotches of the N and W open.

## Review

- Not cold-read and not sewn out yet. Cold-read the proofs before ordering samples, for the letters changed from the font: Punched Out.’s straight E (not cold-read yet either) and the straight-stem B.
- Trademark (a quick web screen, designs/phrases/notes.md, not a legal search): small risk: one 2012 US record for the phrase (serial 85784193) that looks like a dead clerical entry. A NOWHERE mark covers hats, so never shorten it to NOWHERE. Check USPTO and CIPO before ordering samples.
