# BANKED TIME. (Banked Time. Hat)

BANKED TIME. in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, at the logo’s cap height of 7 mm, so its strokes are the logo’s strokes. On one line. The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the Banked Time. Hat (C$34.99): Hat front, 6-panel with a centre seam: Dad Hat (Yupoong 6245CM) and Retro Trucker (Yupoong 6606).

**This file is written by `designs/phrases/build.cjs`** (one build for all six phrase designs). Every number below is measured from the generated artwork. Change the build and rebuild (`cd tools && node ../designs/phrases/build.cjs`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
| `design-light.svg`, `design-dark.svg` | BANKED TIME. on one line, 95.71 x 7.09 mm |
| `proof-light.png`, `proof-dark.png` | True-size proofs: the light file on Bone, the dark file on Slate |
| `seam-proof.png` | The light file on a 140 x 50 mm 6-panel front, moved for the centre seam, at true size |
| `seam-proof-word-space.png` | The same front with the seam in the word space instead (not used; for the owner to compare) |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where it goes

| Placement | Position |
|---|---|
| Hat front, 6-panel with a centre seam: Dad Hat (Yupoong 6245CM) and Retro Trucker (Yupoong 6606) | **1.94 mm to the wearer’s left (the viewer’s right)** of centre, so the seam runs down the middle of the 2.24 mm gap between the E and the D, 1.12 mm from the ends of the E’s arms and from the D’s stem (the gap is 2.24 mm at the baseline, 2.24 mm 1 mm up and 2.29 mm at the cap line). The ink’s centre then lands 0.53 mm from the seam, and 20.2 mm is still spare on that side of the 140 mm front |

- Gaps clear of the letters within 6 mm of centre (the limit Punched Out. uses: the logo moves 5.2 mm, and much more looks off-centre): this one only.
- The E-D pair is spaced 0.14 mm (0.02 cap) wider than the rest of the set would space it (Punched Out.’s kern for it left out), so the seam’s gap is 2.24 mm.
- Not the word space, though it is the widest gap (a 4.58 mm clear channel between the D and the T): putting the seam there means moving the line 9.1 mm the other way, to the wearer’s right, and the ink’s centre would sit 11.6 mm off the seam: visibly off-centre, with 13.0 mm spare on one side of the 140 mm front and 31.3 mm on the other. If the owner prefers the word break on the seam anyway, shift -9.11 mm instead: `seam-proof-word-space.png` shows it.
- Centred instead, the seam would run down the D. `seam-proof.png` shows the shift on a 140 x 50 mm front at true size.
- Set the shift when placing the design: Printful’s guide describes designs on 6-panel caps as centred across the two front panels, so whether it keeps an offset is unconfirmed (store/research/caps-and-hoodie.md); check the first sample. The logo (5.2 mm right) and Punched Out. (2.4 mm right) shift the same way.

## Construction (measured)

| | |
|---|---|
| Size | 95.71 x 7.09 mm |
| Cap height | 7.00 mm |
| Stems (B N K E D T I M) | 1.84-1.94 mm |
| Thinnest stroke | 1.33 mm, in the B |
| Thinnest stroke in each letter | B 1.33, A 1.56, N 1.71, K 1.50, E 1.40, D 1.71, T 1.72, I 1.93, M 1.64 |
| Narrowest opening in each letter that has one | B 1.39, E 1.36, D 3.56, A 1.49 (crotch tips aside) |
| E slots | 1.36 / 1.36 mm |
| B counters (upper / lower) | 1.39 / 1.58 mm |
| A counter | a triangle 2.28 mm wide and 2.63 mm tall; a 1.49 mm circle fits inside it |
| Crotches (sharp inside corners) | A 46.8 deg, K 38.1 deg, M 23.4 deg (two in the M), M 45.2 deg, N 35.1 deg (two in the N) |
| Tightest letter gaps | B-A 1.61, K-E 1.73, A-N 1.78 mm |
| Word space | D-T 4.76 mm at the closest, a 4.58 mm clear channel from top to bottom |
| Full stop | 2.15 mm round, 1.91 mm from the E |
| Ink | 326.5 mm² |

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom). Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): A 46.8 deg 1.2-1.3 mm, K 38.1 deg 1.4-1.7 mm, M 23.4 deg 2.4-2.8 mm, M 45.2 deg 1.2-1.4 mm, N 35.1 deg 1.6-1.8 mm.

Changes from the font (each passed to the logo’s `glyphMM` as a per-letter table, so the logo itself is unchanged):

- **E, straight stem** (Punched Out.’s): the F’s and H’s stem with the E’s own arms and bar, so its stem matches the other letters’. Unbounded bends it; Punched Out.’s cold readers all flagged the bent one. Slots: the top arm’s underside raised and the bottom arm’s top lowered 0.13 mm, so each slot is 1.36 mm (Punched Out.’s cap-7 trim).
- **B, straight stem**, for the same reason: Unbounded bends the B’s stem as it does the E’s (left edge 47 -> 105 -> 47 font units). Rebuilt with the F/H stem (x 70-277) and the counters’ left edges straight. The notch between the bowls is filled 0.26 mm at its tip, so the lower bowl’s neck beside it is as thick as the B’s middle bar (1.21 mm as the font draws it, under the 1.27 mm floor).
- Kerning on top of the font’s spacing (in cap heights): B-A -0.049 (the font’s own: -37 units), E-D 0.000 (Punched Out.’s -0.02 left out, to widen the 6-panel seam’s gap), D-space -0.030 (Punched Out.’s), space-T -0.041 (the font’s own: -31 units) and T-I -0.020 (this set’s). kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and `build.cjs` gives the reason for each (`EXTRA_KERN`). Nothing else is kerned.

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
| cap height | 7.00 mm | >= 6.6 | pass |
| thinnest stroke (in the B) | 1.33 mm | >= 1.27 | pass |
| smallest opening inside a letter (in the E) | 1.36 mm | >= 1.27 | pass |
| B counters (upper / lower) | 1.39 mm | >= 1.27 | pass |
| A counter (widest circle inside it) | 1.49 mm | >= 1.27 | pass |
| E slots | 1.36 mm | >= 1.27 | pass |
| full stop across | 2.15 mm | >= 1.5 | pass |
| fabric round the full stop | 1.91 mm | >= 1.3 | pass |
| tightest gap between letters (B-A) | 1.61 mm | >= 1.47 | pass |
| fits the 140 x 50 mm hat front (spare on the tighter side) | 20.20 mm | >= 0 spare each side | pass |
| 6-panel seam gap (between the E and the D) | 2.24 mm | >= 1.9 | pass |

Floors: cap 6.6 mm (any embroidered Unbounded Bold, the logo’s rule); every opening inside a letter and every stroke at least 1.27 mm as drawn (0.05 in: Printful’s minimum gap and line); the full stop at least 1.5 mm across with 1.3 mm of fabric round the stop (the logo’s pivot-dot rule); letters at least 1.47 mm apart (the logo’s F-T); a 6-panel seam’s gap at least 1.9 mm (about 0.95 mm of fabric each side of the seam’s line; Punched Out.’s is 2.43 mm, and its review called 1.58 mm too narrow). Crotches (where two strokes meet in a point, as the N’s) are listed above, not counted as openings, as for Punched Out.

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
- Satin throughout, 1.84-1.94 mm stems. One colour change: the letters, then the full stop.
- Stitch order, centre out from the seam, then the colour change and the full stop: E, D, T, I, M, E, then K, N, A, B.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Only 0.05 mm per edge on the faces of the E’s slots and the B’s upper counter, so they finish at about 1.26 and 1.29 mm (with full compensation they’d close to about 1.00 and 1.03 mm).
- E: the artwork already includes the slot trims.
- B: the stem is straight (as the E’s); sew it as one column. The notch between the bowls is blunted in the artwork; keep it that way rather than re-pointing it, so the lower bowl’s neck keeps its 1.33 mm.
- Crotches: the N’s two 35.1-degree crotches, where the diagonal meets each stem (thread fills about 1.6-1.8 mm of each), the K’s 38.1-degree crotch, between the stem and the arm (thread fills about 1.4-1.7 mm of it) and the M’s two 23.4-degree crotches between its stems and diagonals (5.28 mm tall; thread fills about 2.4-2.8 mm of each) and its 45.2-degree crotch at the top of its V (about 1.2-1.4 mm). Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.
- M: its inner crotches are the sharpest in this set. Approve only if the sew-out shows both lower counters open over at least half their height (2.64 mm). If they close further, open the crotches in the artwork (in `build.cjs`) rather than counting on the note above: Printful digitizes the file itself, so a digitizing note may not reach its digitizer.
- A: its counter is a triangle (2.28 x 2.63 mm; a 1.49 mm circle fits) whose top is a 46.8-degree point; thread fills about 1.2-1.3 mm of it. Keep compensation off the counter’s faces.
- Full stop: satin dot with 0.10 mm compensation, straight after the colour change. It has 1.91 mm of fabric to the E.
- 6-panel caps: 1.94 mm (to the wearer’s left); see “Where it goes”.
- Approve only after a sew-out on the actual blank shows both E slots at least 1.0 mm open, both B counters open, the crotches of the N, K and M open and the A’s counter open as a triangle.

## Review

- Not cold-read and not sewn out yet. Cold-read the proofs before ordering samples, for the letters changed from the font: Punched Out.’s straight E (not cold-read yet either) and the straight-stem B. And for the K: it is Unbounded’s own drawing, which the brand has never shown. Its arm starts at the foot of its stem, so its lower left is a solid wedge: the same kind of quirk as the bent E that all four of Punched Out.’s cold readers flagged. If readers flag it, redraw it as the E was.
- Trademark (a quick web screen, designs/phrases/notes.md, not a legal search): looks clear: the nearest filing is TIME BANK (US serial 87358423), for financial services. Check USPTO and CIPO before ordering samples.
