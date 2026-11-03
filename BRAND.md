# Brand brief

## The idea

Everybody has a shift. The good part is what happens after it.

OFF SHFT is for people whose free time is earned: trades, plant workers, nurses, drivers, office folks who count down to Friday. When they clock out, they go fishing, hit the golf course, set up the cornhole boards, or head to the cottage. OFF SHFT makes the hat they wear when they get there.

It's not tied to weekends on purpose. Plenty of people's days off are a Tuesday and a Wednesday.

## Name and spelling

- Written **OFF SHFT** (two words, all caps, no "I") in the logo and headlines.
- In running text, "OFF SHFT" is fine. Never "Off Shift", "Offshift" or "OFFSHFT Co."
- Domain: offshft.com. Backup domain offshifthats.com forwards to it (catches people who spell it out).

## Core message: earned free time

Every design, listing and post comes back to one idea: **you put in the hours, this time is yours.** The hat is the reward and the badge of it. Not tied to any town or region, so the brand sells anywhere in Canada and the US.

## Audience

- Adults roughly 25–60 who work full-time and have one or more outdoor hobbies
- Gift buyers: partners, kids buying for dad, coworkers buying retirement and birthday gifts
- Groups: fishing buddies, golf foursomes, cornhole leagues, work crews

## Voice

- Plain-spoken, a bit funny, never try-hard
- Respect for work; celebration of time off
- Short lines. Hat text has to read from across a parking lot.
- Good: "Punched out." / "Lines in." / "Shift's over. Tee's up." / "Off the clock, on the water."
- Avoid: corporate words, hustle-culture talk, anything mocking people's jobs, politics, profanity

## Look (v3: The O)

Reference brands: Duck Camp, Huk. Quiet, small, well-spaced. One strong symbol instead of big slogans.

- **Logo:** "The O". OFF SHFT typed in Unbounded Bold, capitals, letter-spacing 0.12 em, with three small kerns (in notes.md); the O in OFF is the clock: a ring the same height as the font's O, a pivot dot and two bar hands with square ends at 5:00 (quitting time) standing off it. The owner's call, 2 Nov 2026: the letters are the real font, not a hand-drawn version; the clock keeps the bar hands from the hat mockups. The symbol on its own is the same clock. Sizes: the main file has 7 mm letters and is 62.6 mm wide, the smallest size with the dot. Below that, and in one colour, the lockup leaves the dot out. Full rules, sizes and digitizer notes: `designs/mark/final/the-o/notes.md`. Never redraw, trace, thicken or re-type it by hand. Regenerate it with `designs/mark/final/the-o/build.cjs`.
- **Logo colours:** the O and letters in one thread, the hands and pivot dot in the accent. Bone fabric: Ink + Rust. Slate or Spruce fabric: Bone + Sun. Oat: Ink + Rust only after a sew-out passes, otherwise Ink in one colour. Moss or Rust fabric: Bone in one colour. One-colour versions only for tonal or single-thread jobs, never as the default front logo.
- **Type:** Unbounded Bold, all caps, letter-spacing 0.12 em, for the logo's letters (above) and the phrase designs (Punched Out. and the rest): the same font, set the same way. Archivo for website text and labels (the store's body and subheading face). Embroidered Unbounded text needs a cap height of at least 6.6 mm and the S terminal trims from `designs/mark/final/the-o/notes.md`; anything smaller needs a separately approved lighter face.
- **Symbol on its own:** the clock O without the letters, for patches, the back or side of a hat and die-cut stickers (cut to its outline). The side-of-hat version is its own small drawing (`side-*.svg`), not a scaled-down copy. Not for squares (below).
- **Squares and circles** (owner's pick, 31 Oct 2026): profile pictures, app icons, the Shopify square logo, round or square patches and round stickers carry the **stacked logo**, OFF over SHFT with the clock as the O. With the hands outside, the clock alone can't be more than about a third of a square, and every way of making it bigger read worse in blind tests (`designs/mark/square/RESULTS.md`). The stacked logo is drawn for 40 px and up; where an app shows it smaller, the name sits beside it anyway. The clock alone in a circle (`brand/social/offshft-clock-tile-*`) is only for secondary spots like a story highlight, never the main profile picture or app icon.
- **The hands always stand outside the ring, at full length.** Never inside the ring, cropped by a frame or shortened. The only exceptions are the drawings made for tiny sizes, the side master and the tab icons, which shorten them on purpose.
- **Browser tab:** the clock redrawn on the pixel grid at 16, 32 and 48 px, used only in the tab and only at those sizes. Never a scaled-down copy of the symbol.
- **Screens:** light backgrounds are the thread Bone #ECE5D3 (Rust reads better on it than on the fabric Bone), dark ones Slate #27303D. Smallest sizes: the one-line logo 80 px wide, the stacked logo 40 px, the clock 48 px tall.
- **Clear space:** at least the height of the letters all round the one-line logo (and the stacked logo on a square), measured from the hand tips. In circles the stacked logo is fitted to 90% of the radius on purpose.
- **Files:** `brand/` has every logo in SVG, PDF and PNG, and its README says which file goes where. They're generated from the same drawings as the hats (`cd tools && node ../brand/build.cjs`), never edited by hand.
- **Icons (hobby hats):** single-weight line drawings, 1.6 mm line. They are a separate illustration style and never sit right next to the logo; when they do share a hat, the logo goes on the back or side.
- **Layout:** icon on top, one short label underneath, optional small "OFF SHFT" sign-off. Lots of empty fabric around it.
- **Thread colours:** Bone #ECE5D3, Ink #1F2733, Rust #B4552D, Sun #D29B3C, Sage #9AA383. Two or three per design.
- **Fabric colours:** Bone, Oat, Moss, Spruce, Slate, Rust.

## Design rules (for embroidery)

- Maximum 6 thread colours per design, 3–4 is better
- No text smaller than 4.5 mm cap height, and only in a bold weight (Unbounded Bold: 6.6 mm minimum)
- No gradients, no photos, no very thin lines
- Front panel design area roughly 4 in wide × 1.75 in tall; side and back designs smaller
- Deliver vector files (SVG or AI) plus a flat PNG preview on the fabric colour
