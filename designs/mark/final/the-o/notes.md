# OFF SHFT logo: The O

The O in OFF is a clock face. Two hands stand out of it showing 5:00, quitting time, so the name and the idea are one mark: the shift is over and the time is yours. The hands and pivot dot are stitched in the accent thread so they read as clock hands laid on a dial.

Owner's picks: hands-only clock, W3 watch hands, "The O" placement, O 15% taller than the letters, Unbounded Bold.

**This file is written by `build.cjs`.** Every number below is measured from the generated artwork. Do not edit it by hand; change `build.cjs` and rebuild.

## Files

| File | What it is |
|---|---|
| `logo-light.svg` | Main lockup for light fabric: Ink letters and O, Rust hands and dot |
| `logo-dark.svg` | Main lockup for dark fabric: Bone letters and O, Sun hands and dot |
| `logo-one-colour-ink.svg`, `logo-one-colour-bone.svg` | One thread only (wider channel, smaller dot) |
| `symbol-*.svg` | The clock O alone, 25 mm tall (patches, hat back, avatar) |
| `side-*.svg` | Side-of-hat master, its own drawing (two colour and one colour) |
| `logo-light-cap6.6/7/7.5.svg`, `symbol-light-19/25/40mm.svg` | True-size proofs |
| `fonts/` | The same logo in other wide faces (comparison only) |
| `hands-centre/` | Alternative under consideration: hands running from the pivot over the O |

## Construction (at cap height 7 mm)

| Part | Rule | At cap 7 |
|---|---|---|
| Wordmark | Unbounded Bold, letter-spacing 0.12 em. Extra kerning: F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline. | 63.7 x 20.4 mm overall (one colour 21.4 mm tall) |
| Letter strokes | Measured from Unbounded | stem 1.93 mm, arm 1.63 mm |
| Clock O | Ring 1.15 x the font's own O height, centred on it | 8.39 mm across |
| Ring walls | Sides 1.0 x stem (0.98 one colour), top and bottom 0.9 x stem | 1.93 mm sides, 1.74 mm top/bottom; counter 4.53 x 4.92 mm |
| Channel | Even gap between ring and hands, hand bases concave. Two colours max(1.0, 0.143 cap); one colour 1.2, 1.5 from cap 7 | 1.00 mm (one colour 1.50 mm) |
| Minute hand | 1.0 stem wide, visible 0.936 cap from the channel, exactly 12 o'clock | 1.93 x 6.55 mm |
| Hour hand | 1.02 stems wide, visible 0.667 cap from the channel, exactly 150 degrees | 1.97 x 4.67 mm |
| Points | 90 degree taper ending in a flat 0.3 x the hand width (this is what stitches) | |
| Pivot dot | Hand colour, at most 0.286 cap, at least 1.3 mm fabric to the counter (1.5 one colour) | 1.93 mm with 1.30 mm fabric; one colour 1.61 mm with 1.50 mm |
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

- Lockup, two colours: cap 6.6 mm minimum (60.1 x 19.4 mm, dot 1.67 mm). Hat fronts: cap 7 (63.7 mm wide).
- Lockup, one colour: cap 7 minimum.
- Symbol: 19 mm tall minimum in two colours (dot 1.58 mm), 20.5 mm in one colour (dot 1.53 mm). Plain satin up to 45 mm; above that, split satin or tatami. From 35 mm, use a 1.5 mm channel.
- Under 19 mm: use the side master only (8.4 x 16.6 mm; one colour 8.6 x 16.9 mm). Never scale the main files down.
- Any embroidered Unbounded Bold text: cap 6.6 mm minimum, letter-spacing 0.12 em, with the S trims. Smaller text needs a separately approved lighter face (owner's decision).

## Notes for the digitizer

- Digitize each size on its own. Never scale a stitch file.
- Stitch order: Ink letters from the centre out (S, H, F, T, then F, F), the ring last, then the accent from the bottom up: pivot dot, hour hand, minute hand. One colour change.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (stems, and the ring at 3 and 9 o'clock). Only 0.05-0.10 mm per edge on edges facing the channel, the S necks, the pivot dot, the F slot and the ring's inner edge at 3 and 9 o'clock.
- Ring: satin with edge-run underlay, short stitches on the inner edge. Digitize it 0.3 mm wider than tall (about 8.69 x 8.39 mm at cap 7), adding the extra on the outer edge only.
- Hand roots: pull back 0.2 mm, no end compensation, so the channel stays open. Tips: keep the drawn flat; pull back 0.2 mm.
- S: the artwork already includes the terminal trims. Pull both terminal ends back 0.2 mm with no end compensation and hold spine-edge comp to 0.10 mm at the two necks, so the apertures finish at about 0.9-1.0 mm.
- F slot (between the arms): 0.05 mm comp on the two slot-facing edges, the rest on the outer edges, so the slot finishes at 1.1 mm or more. If a sew-out still shows less than 1.0 mm, lower the F's middle arm by 0.20 mm in build.cjs.
- F-T: pull both facing bar ends back 0.15 mm with no end compensation.
- Pivot dot: satin with 0.10 mm comp, straight after the colour change.
- 6-panel caps (dad hats, structured snapbacks): the centre seam would cross the S. Always shift the lockup **4.7 mm right** so the seam falls in the middle of the word space. 5-panel and seamless fronts stay centred.
- Approve only after a sew-out on the actual blank shows the pivot centred within 0.2 mm, both channels at least 0.8 mm open and both S apertures open.

## How it was tested

- Blind reading rounds with fresh readers who were given no context: the two-colour version with long, slim hands reads first as a clock face at about 5 o'clock, and the full lockup reads "OFF SHFT" (9/10 confidence). One-colour and short hands drift towards "Q" or "magnifying glass".
- Two brand reviews and two embroidery reviews (Archivo, then Unbounded) set every rule above.
