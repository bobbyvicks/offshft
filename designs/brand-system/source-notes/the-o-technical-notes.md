# OFF SHFT logo: The O

The O in OFF is a clock face. Two hands stand out of it showing 5:00, quitting time, so the name and the idea are one mark: the shift is over and the time is yours. The hands and pivot dot are stitched in the accent thread so they read as clock hands laid on a dial.

Owner's picks: hands-only clock, W3 watch hands, "The O" placement, Unbounded Bold, the O the same size as the other letters, and the stand-alone symbol's clock, pivot dot included, inside the wordmark (option "1" in `designs/mark/symbol-clock/`). The symbol on its own draws the same clock with a slightly bigger O.

**This file is written by `build.cjs`.** Every number below is measured from the generated artwork. Do not edit it by hand; change `build.cjs` and rebuild.

## Files

| File | What it is |
|---|---|
| `logo-light.svg` | Main lockup for light fabric: Ink letters and O, Rust hands and dot |
| `logo-dark.svg` | Main lockup for dark fabric: Bone letters and O, Sun hands and dot |
| `logo-one-colour-ink.svg`, `logo-one-colour-bone.svg` | One thread only (wider channel, no dot, full-weight ring) |
| `symbol-*.svg` | The clock O alone, 25 mm tall (patches, hat back, avatar) |
| `side-*.svg` | Side-of-hat master, its own drawing (two colour and one colour) |
| `logo-light-cap6.6/7/7.5.svg`, `symbol-light-19/25/40mm.svg` | True-size proofs |
| `fonts/` | The same logo in other wide faces (comparison only) |
| `hands-centre/` | Tested and not adopted: hands running from the pivot over the O (cold reads: logo 8/10 with "QFF" mentions, against 9/10 with none for the main version) |

## Construction (at cap height 7 mm)

| Part | Rule | At cap 7 |
|---|---|---|
| Wordmark | Unbounded Bold, letter-spacing 0.12 em. Extra kerning: F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline. | 62.6 x 18.0 mm overall (one colour 19.0 mm tall) |
| Letter strokes | Measured from Unbounded | stem 1.93 mm, arm 1.63 mm |
| Clock O | Ring the same height as the font's own O, centred on it (symbol: 1.15 x) | 7.30 mm across |
| Ring walls | Sides 0.82 x stem so the dot fits (1.0 x stem where the dot is left out, 0.98 one colour), top and bottom 0.9 x the sides | 1.58 mm sides, 1.43 mm top/bottom; counter 4.13 x 4.45 mm |
| Channel | Even gap between ring and hands, hand bases concave. Two colours max(1.0, 0.143 cap); one colour 1.2, 1.5 from cap 7 | 1.00 mm (one colour 1.50 mm) |
| Minute hand | 1.0 stem wide, visible 0.814 cap from the channel (the symbol's 0.936 cap / 1.15, so it keeps the symbol's proportion to the ring), exactly 12 o'clock | 1.93 x 5.70 mm |
| Hour hand | 1.02 stems wide, visible 0.58 cap from the channel (the symbol's 0.667 cap / 1.15), exactly 150 degrees | 1.97 x 4.06 mm |
| Points | 90 degree taper ending in a flat 0.3 x the hand width (this is what stitches) | |
| Pivot dot | Hand colour, at most 0.286 cap, at least 1.3 mm of fabric to the counter (1.5 one colour), at least 1.5 mm across or it's left out. In the lockup from cap 7, two colours only. | Lockup at cap 7: 1.53 mm with 1.30 mm of fabric; 25 mm symbol: 2.45 mm |
| S | Terminals trimmed so both apertures are 1.0 mm (upper / lower trim) | 0.36 / 0.41 mm (cap 6.6: 0.40 / 0.45 mm) |
| F-T | Gap between the F arm and the T bar | 1.47 mm |

## Colourways

| Fabric | Version |
|---|---|
| Bone | Ink + Rust (`logo-light`) |
| Slate, Spruce | Bone + Sun (`logo-dark`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink one colour |
| Moss, Rust | Bone one colour |

The hex values are targets. Match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank. One-colour versions are for tonal or single-thread jobs, never the default front logo.

## Size floors

- Lockup: cap 7 for hat fronts (62.6 mm wide), the smallest size that keeps the pivot dot. Cap 6.6 mm is the absolute minimum (59.1 x 17.1 mm, set by the S apertures); below cap 7 the lockup is drawn without the dot, with a full-weight ring. One colour: cap 7 minimum (wider channel), no dot.
- Symbol: 19 mm tall minimum in two colours (dot 1.58 mm), 20.5 mm in one colour (dot 1.53 mm). Plain satin up to 45 mm; above that, split satin or tatami. From 35 mm, use a 1.5 mm channel.
- Under 19 mm: use the side master only (8.4 x 16.6 mm; one colour 8.6 x 16.9 mm). Never scale the main files down.
- Any embroidered Unbounded Bold text: cap 6.6 mm minimum, letter-spacing 0.12 em, with the S trims. Smaller text needs a separately approved lighter face (owner's decision).

## Notes for the digitizer

- Digitize each size on its own. Never scale a stitch file.
- Stitch order: Ink letters from the centre out (S, H, F, T, then F, F), the ring last, then the accent: pivot dot first, then from the bottom up: hour hand, minute hand. One colour change.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (stems, and the ring at 3 and 9 o'clock). Only 0.05-0.10 mm per edge on edges facing the channel, the S necks, the pivot dot, the F slot and the ring's inner edge at 3 and 9 o'clock.
- Ring: satin with edge-run underlay, short stitches on the inner edge. Digitize it 0.3 mm wider than tall (about 7.60 x 7.30 mm at cap 7), adding the extra on the outer edge only.
- Hand roots: pull back 0.2 mm, no end compensation, so the channel stays open. Tips: keep the drawn flat; pull back 0.2 mm.
- S: the artwork already includes the terminal trims. Pull both terminal ends back 0.2 mm with no end compensation and hold spine-edge comp to 0.10 mm at the two necks, so the apertures finish at about 0.9-1.0 mm.
- F slot (between the arms): 0.05 mm comp on the two slot-facing edges, the rest on the outer edges, so the slot finishes at 1.1 mm or more. If a sew-out still shows less than 1.0 mm, lower the F's middle arm by 0.20 mm in build.cjs.
- F-T: pull both facing bar ends back 0.15 mm with no end compensation.
- Pivot dot: satin with 0.10 mm comp, straight after the colour change. In the lockup it has 1.3 mm of fabric to the ring; approve only if the sew-out keeps at least 1.0 mm open all round.
- 6-panel caps (dad hats, structured snapbacks): the centre seam would cross the S. Always shift the lockup **5.2 mm right** so the seam falls in the middle of the word space. 5-panel and seamless fronts stay centred.
- Approve only after a sew-out on the actual blank shows both channels at least 0.8 mm open, the O's counter open and both S apertures open (symbols: pivot centred within 0.2 mm).

## How it was tested

- **Truly blind reads.** Each reader was a fresh agent given one image and four neutral questions, nothing else; their transcripts were checked to confirm they saw no chat messages. Final lockup: "OFF SHFT" 3 out of 3, all at 9/10, and all 3 described the O as a clock showing about 5:00 without being asked about clocks. The earlier, longer hands scored exactly the same. Every reader of both versions said the lower hand can pass for a Q's tail at a glance (it comes from a hand at 5 o'clock outside an O, not from the hand length) and that SHFT reads as SHIFT. The symbol reads as a clock at 5:00 3 out of 3, at 6.3/10 with its longer hands (5/10 with the short ones), with "magnifying glass" and "Q" as the usual second readings. Full answers: `designs/mark/clean-reads/RESULTS.md`.
- **Earlier rounds were not fully blind.** The tool that ran them also showed every reader the owner's latest chat message (for example "make the o a bit bigger", "it looks like a scope", "the arms feel too big for the clock"), so treat those numbers as informed opinions. The two choices they supported, no dot in the lockup and no tick marks, were also the owner's own calls.
- The symbol is abstract on its own; it gains recognition when used alongside the full logo (for example front logo plus side symbol).
- Two brand reviews and two embroidery reviews (Archivo, then Unbounded) set every rule above.
