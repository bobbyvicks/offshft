# Punched Out. (v3)

PUNCHED OUT. in the logo's type: Unbounded Bold, all caps, letter-spacing 0.12 em, at the logo's cap height of 7 mm, so its strokes are the logo's strokes. The only accent is the full stop, in the logo's accent thread: Rust on light fabric, Sun on dark. It replaces the Archivo draft in `../` (4.8 mm cap: off-brand and under the 6.6 mm floor).

**This file is written by `build.cjs`.** Every number below is measured from the generated artwork. Change `build.cjs` and rebuild (`cd tools && node ../designs/09-punched-out/v3/build.cjs`); don't edit this file by hand.

## Files

| File | What it is |
|---|---|
| `one-line-light.svg`, `one-line-dark.svg` | PUNCHED OUT. on one line, 97.47 x 7.30 mm |
| `stacked-centred-light.svg`, `stacked-centred-dark.svg` | PUNCHED over OUT., centred, 63.59 x 18.00 mm (the logo: 62.64 x 18.04 mm) |
| `one-line-large-light.svg`, `one-line-large-dark.svg` | The one line drawn for the big centre front of the tops, 229.75 x 17.20 mm (cap 16.5) |
| `*-proof.png`, `*-proof-dark.png` | True-size proofs: the light files on Bone, the dark files on Slate |
| `e-compare.png` | PUNCHED as the font draws it, over PUNCHED as drawn here (straight E), at true size |
| `variants.json` | The two cap-7 masters, in the order to show them |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, `letters` and `full-stop`.

## Where each one goes

| Placement | File | Position |
|---|---|---|
| Hat front, seamless: 5-panel (Otto 31-069), rope cap (BA671) | one-line, or stacked-centred if the owner wants the block | Centred. One line: 21.3 mm spare each side of the 140 mm area; stack: 38.2 mm |
| Hat front, 6-panel with a centre seam: trucker (Yupoong 6606), dad hat (6245CM) | one-line | **2.4 mm right** of centre, so the seam runs down the middle of the 2.43 mm gap between the H and the E (two straight stems), and the ink's centre lands 0.2 mm from the seam. 18.9 mm still spare on that side |
| Anorak (CO200) left chest | stacked-centred | Centred in the 101.6 mm square: 19.0 mm spare each side |
| Sweatpants (1469) front left leg | stacked-centred | As the chest |
| Hoodies (5161, 1567, 1467), crewneck (1466): big centre front | one-line-large | Centred. The owner's call of 29 Oct 2026 (store/picks.md, and the Shopify drafts say "big on the centre front"); the design brief lists the left chest instead, so confirm before digitizing. On the left chest they take stacked-centred, like the anorak |

- **Not the one line on a chest or leg.** It leaves 2.06 mm each side of 101.6 mm, and shrinking it by more than 5.7% takes the cap under the 6.6 mm floor (at the floor it is still 91.9 mm wide).
- **The stack on a 6-panel cap**, if the owner wants the block on every hat: keep it centred, no shift. The seam then crosses the C at its middle, through its 1.67 mm top and bottom strokes, 2.0 mm short of where its mouth begins, and runs down the U's counter 0.86 mm from its left stem, across its 1.80 mm bowl. No opening sits on the seam, and the ink stays centred (0.11 mm off). Shifting it to clear the letters doesn't work: the widest gap through both lines near the centre is 1.58 mm, 5.07 mm right of centre (between the C and the H, and between the U and the T), too narrow to aim a seam at, and it would put the C's terminals and the T's bar end beside the seam. Approve on a sew-out on the 6-panel blank; if the U's stem wavers, use the one line on that hat.
- **Don't scale the stack up to the big front.** At 230 mm wide it would be 65.1 mm tall with 25.3 mm caps. If the owner wants a block there, build it at cap 16.5 like the one line (about 149.9 x 42.4 mm).

## Construction (measured)

| | one-line | stacked-centred | one-line-large |
|---|---|---|---|
| Size (mm) | 97.47 x 7.30 | 63.59 x 18.00 | 229.75 x 17.20 |
| Cap height (mm) | 7.00 | 7.00 | 16.50 |
| Stems (P U N H E D T) | 1.88-1.94 | 1.88-1.94 | 4.42-4.58 |
| H bar, T bar | 1.72, 1.72 | 1.72, 1.72 | 4.05, 4.05 |
| E arms / bar / arm | 1.44 / 1.40 / 1.44 | 1.44 / 1.40 / 1.44 | 3.70 / 3.30 / 3.70 |
| C top / bottom, U bowl | 1.67 / 1.67, 1.73 | 1.67 / 1.67, 1.73 | 3.94 / 3.94, 4.07 |
| P bowl, D bowl (top / bottom) | 1.55 / 1.55, 1.72 / 1.72 | 1.55 / 1.55, 1.72 / 1.72 | 3.65 / 3.65, 4.05 / 4.05 |
| Thinnest stroke | 1.40 (E bar) | 1.40 (E bar) | 3.30 (E bar) |
| C mouth | 1.40 | 1.40 | 2.68 |
| E slots | 1.36 / 1.36 | 1.36 / 1.36 | 2.90 / 2.90 |
| N crotches | 35.1 degrees | 35.1 degrees | 35.1 degrees |
| Tightest letter gaps | U-T 1.58, P-U 1.69 | U-T 1.58, P-U 1.69 | U-T 3.72, P-U 3.99 |
| Word space or line gap | word space 5.03 | line gap 3.56 | word space 11.87 |
| Full stop | 2.15 round, 3.10 from the T | 2.15 round, 3.10 from the T | 5.06 round, 7.30 from the T |
| C / E trims per face | 0.13 / 0.13 | 0.13 / 0.13 | none |

All in mm. Thinnest stroke in each letter (cap 7): P 1.55, U 1.73, N 1.71, C 1.67, H 1.72, E 1.40, D 1.71, O 1.73, T 1.72. The logo's own: stem 1.93, arm 1.63, thinnest 1.43 (the ring's top and bottom).

Changes from the font (built in `build.cjs` as a per-letter table passed to the logo's `glyphMM`, so the logo itself is unchanged):

- **E, straight stem.** Unbounded draws its E with a bent, pointed stem (its left edge goes in 0.53 mm at mid-height). The logo has no E, so the brand had never shown it, and all four cold readers of the first proofs flagged it (a glitch, a misprint, a sigma or a backwards 3). It's rebuilt from the font's own numbers: the F's and H's stem with the E's own arms and bar, same advance, so its stem now matches the P, H and D. `e-compare.png` shows both.
- **E slots, cap 7 only:** the top arm's underside raised and the bottom arm's top lowered 0.13 mm, so each slot is 1.36 mm (was 1.23) and the arms 1.44 mm. The bar keeps 1.40 mm.
- **C mouth, cap 7 only:** each terminal's slot face trimmed 0.13 mm, so the mouth is 1.40 mm (was 1.14) and doesn't close up into an O.
- The C's mouth and the E's slots, the only narrow openings, are now at least 1.27 mm as drawn (0.05 in, the minimum gap in Printful's embroidery guide). The large file needs no trims: its C mouth is 2.68 mm and its E slots 2.90 mm as the font draws them.
- Kerning on top of the font's: P-U -0.025, C-H -0.03, E-D -0.02, U-T -0.04 and D-space -0.03 cap, plus the font's own T-period kern. The full stop sits 0.43 mm past the end of the T's bar.

## Colourways

| Fabric | Threads |
|---|---|
| Bone and other light colours | Ink letters, Rust stop (`*-light.svg`) |
| Slate, Spruce | Bone letters, Sun stop (`*-dark.svg`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink in one colour |
| Moss, Rust | Bone in one colour |

One colour is the same artwork with the full stop in the letter thread; nothing else changes. As for the logo, the hex values are targets: match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank.

## Notes for the digitizer

- Digitize each size on its own and never scale a stitch file. The large file is its own drawing (no trims), not the cap-7 file scaled up.
- Satin throughout, 1.88-1.94 mm stems at cap 7. One colour change.
- Stitch order, centre out (bottom line first on the stack, as caps sew centre out and bottom up), then the colour change and the full stop:
  - one line: E, D, O, U, T, then H, C, N, U, P
  - stack: OUT: U, T, then O; PUNCHED: C, H, E, D, then N, U, P
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Only 0.05 mm per edge on the C's mouth faces and the E's slot faces, so the mouth finishes at about 1.30 mm and the slots at about 1.26 mm (with full compensation on those faces they'd close to about 1.04 and 1.00 mm).
- C: the artwork already includes the trims. Square each pointed terminal tip off 0.3 mm in, with no end compensation.
- N: the two crotches are 35.1-degree wedges, and thread fills about 1.6-1.8 mm of each. Stop the diagonal 0.3 mm short of each stem at the crotches, with no compensation on the crotch faces.
- T: its bar's left end faces the U (1.58 mm, as the logo's F-T faces 1.47 mm). Pull that end back 0.15 mm with no end compensation.
- Full stop: satin dot with 0.10 mm compensation, straight after the colour change. It has 3.10 mm of fabric to the T.
- Fleece (hoodies, crewneck, sweatpants): water-soluble topping, so the loft doesn't swallow the mouth, the slots and the crotches.
- 6-panel caps: see the placement table (one line 2.4 mm right; the stack centred). 5-panel and seamless fronts stay centred.
- Big centre front (`one-line-large`, cap 16.5): stems 4.42-4.58 mm, just over the 4.4 mm columns the logo sews in plain satin (its 45 mm symbol). Plain satin should hold; split the stems if the sew-out shows long, loose stitches. Full stop 5.06 mm: satin, or a fill if it looks loose. Standard compensation everywhere (C mouth 2.68, E slots 2.90, tightest letter gap 3.72 mm).
- Approve only after a sew-out on the actual blank shows the C's mouth at least 0.9 mm open, both E slots at least 1.0 mm open and both N crotches open.

## Review

- Cold reads of the first proofs (each reader saw one image, nothing else): PUNCHED OUT. read correctly by all four, at 9/10. Every one of them flagged Unbounded's bent E, which is why the E is now straight. The straight E has not been cold-read yet.
- Two critics (brand and embroidery) measured every proof. Their fixes are in: the straight E, the C and E trims, the 6-panel positions and these digitizer notes. Where they disagreed (the stack on a 6-panel cap: centred, or 5.1 mm left), this follows the seam measurements above: centred. Not applied, the owner's call: kerning the full stop 0.6 mm left so it sits 2.5 mm from the T.
- Dropped, with their files left in git (commit f221242): the left-aligned stack (it repeats Mulligan Monday's layout, two lines left-aligned with one small Rust mark, a design the owner turned down; and its ink sits 5.1 mm left of its centre, so it looks lopsided wherever it's centred) and the clock O version (the logo's own clock inside the phrase: it repeats the logo, its 5 o'clock hand reads as a Q's tail, "QUT.", and it's 27.2 mm tall).
