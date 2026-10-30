# NOT PICKING UP. (Not Picking Up. Hoodie)

NOT PICKING UP. in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, drawn for the big centre front at cap 14.5 mm, so the line is 229.85 mm wide: the largest cap (in 0.1 mm steps) that fits the 230 mm box the store uses for the tops’ big front, as Punched Out.’s one-line-large (229.75 mm at cap 16.5). On one line. The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the Not Picking Up. Hoodie (C$89.99): Hoodies, big centre front: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567), S to 3XL.

**This file is written by `designs/phrases/build.cjs`** (one build for all six phrase designs). Every number below is measured from the generated artwork. Change the build and rebuild (`cd tools && node ../designs/phrases/build.cjs`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
| `design-light.svg`, `design-dark.svg` | NOT PICKING UP. on one line, drawn for the big centre front, 229.85 x 15.12 mm |
| `proof-light.png`, `proof-dark.png` | True-size proofs: the light file on Bone, the dark file on Slate |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where it goes

| Placement | Position |
|---|---|
| Hoodies, big centre front: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567) | Centred on Printful’s large front: 0.1 mm spare each side of the store’s 230 mm box (Printful’s large-front limit is 10 x 6 in, 254 x 152 mm) |

- The owner’s call for the tops (store/picks.md): big on the centre front, as Punched Out. goes there.
- At 230 mm this line gets cap 14.5, not 15-16.5: it is 15 characters long. At cap 15 it would be 237.8 mm wide, past the box (it would still fit Printful’s 254 mm, at cap 16.0 at most).

## Construction (measured)

| | |
|---|---|
| Size | 229.85 x 15.12 mm |
| Cap height | 14.50 mm |
| Stems (N T P I K U) | 3.89-4.02 mm |
| Thinnest stroke | 2.45 mm, in the G |
| Thinnest stroke in each letter | N 3.54, O 3.58, T 3.56, P 3.21, I 4.00, C 3.46, K 3.10, G 2.45, U 3.58 |
| Narrowest opening in each letter that has one | O 7.96, P 3.57, C 2.36, G 2.36, U 6.63 (crotch tips aside) |
| C mouth | 2.36 mm |
| G mouth | 2.36 mm |
| Crotches (sharp inside corners) | G 47.1 deg, G 54.2 deg, K 38.1 deg, N 35.1 deg (two in each N) |
| Tightest letter gaps | O-T 3.13, K-I 3.58, P-I 4.06 mm |
| Word spaces | T-P 10.56 mm at the closest, a 10.56 mm clear channel from top to bottom; G-U 11.64 mm at the closest, a 11.64 mm clear channel from top to bottom |
| Full stop | 4.45 mm round, 4.18 mm from the P |
| Ink | 1509.9 mm² |

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom). Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): G 47.1 deg 1.1-1.3 mm, G 54.2 deg 1.0-1.1 mm, K 38.1 deg 1.4-1.7 mm, N 35.1 deg 1.6-1.8 mm.

Changes from the font (each passed to the logo’s `glyphMM` as a per-letter table, so the logo itself is unchanged):

- C: no trim at this size: the mouth is 2.36 mm as the font draws it.
- **G, its mouth opened to the C’s.** Its upper terminal’s underside is cut flat 0.75 mm higher (font units 471 to 510.0), so the mouth between it and the bar is 2.36 mm, as the C’s (2.36 mm). As the font draws it, the mouth is a 1.60 mm parallel slit, which standard compensation would take to about 1.24 mm and fleece could close, while the C stayed open.
- Kerning on top of the font’s spacing (in cap heights): O-T -0.061 (the font’s own -31 units and this set’s -0.020), T-space -0.041 (the font’s own: -31 units) and P-. -0.133 (the font’s own: -100 units). kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and `build.cjs` gives the reason for each (`EXTRA_KERN`). Nothing else is kerned.

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
| cap height | 14.50 mm | >= 6.6 | pass |
| thinnest stroke (in the G) | 2.45 mm | >= 1.27 | pass |
| smallest opening inside a letter (in the C) | 2.36 mm | >= 1.27 | pass |
| C mouth | 2.36 mm | >= 1.27 | pass |
| G mouth | 2.36 mm | >= 1.27 | pass |
| full stop across | 4.45 mm | >= 1.5 | pass |
| fabric round the full stop | 4.18 mm | >= 1.3 | pass |
| tightest gap between letters (O-T) | 3.13 mm | >= 1.47 | pass |
| fits the 230 x 90 mm big-front box (spare on the tighter side) | 0.07 mm | >= 0 spare each side | pass |

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

- Digitize each size on its own and never scale a stitch file. This is its own drawing at cap 14.5, not a cap-7 file scaled up (the cap-7 trims shrink with size and are none here; the G’s opened mouth is part of the letters’ drawing and stays).
- Satin throughout, 3.89-4.02 mm stems. One colour change: the letters, then the full stop.
- Stitch order, centre out, then the colour change and the full stop: K, I, N, G, U, P, then C, I, P, T, O, N.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Standard compensation everywhere: the narrowest opening is 2.36 mm (the C).
- Crotches: the N’s two 35.1-degree crotches, where the diagonal meets each stem (thread fills about 1.6-1.8 mm of each) and the K’s 38.1-degree crotch, between the stem and the arm (thread fills about 1.4-1.7 mm of it). Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.
- G: its mouth is 2.36 mm, opened in the artwork, so standard compensation suits it. The pocket under its bar narrows to a 54.2-degree point and the slit between the bowl and the spur at the bottom right to a 47.1-degree one: stop the bar’s underside 0.3 mm short of the bowl at the pocket’s point, no compensation on either point’s faces.
- Full stop: 4.45 mm across: satin, or a fill if it looks loose; straight after the colour change. It has 4.18 mm of fabric to the P.
- Fleece: water-soluble topping, so the loft doesn’t swallow the openings and the crotches.
- Big front: stems 3.89-4.02 mm, under the 4.4 mm columns the logo sews in plain satin (its 45 mm symbol), so plain satin should hold; split the stems if the sew-out shows long, loose stitches. A rough stitch count from the ink area (1509.9 mm², 2.34 sq in at 1,200-2,400 stitches per square inch of satin): about 3,000-5,500, under the 15,000 at which Printful’s large-embroidery stitch charge starts (store/research/caps-and-hoodie.md).
- Approve only after a sew-out on the actual blank shows the crotches of the N and K open, the C’s mouth open and the G’s mouth open.

## Review

- Not cold-read and not sewn out yet. Cold-read the proofs before ordering samples, for the letters changed from the font: the G with its mouth opened. And for the K: it is Unbounded’s own drawing, which the brand has never shown. Its arm starts at the foot of its stem, so its lower left is a solid wedge: the same kind of quirk as the bent E that all four of Punched Out.’s cold readers flagged. If readers flag it, redraw it as the E was.
- Trademark (a quick web screen, designs/phrases/notes.md, not a legal search): looks clear: the nearest filing is an abandoned DONT PICK UP NO MATTER WHAT! (US serial 86227812). Check USPTO and CIPO before ordering samples.
