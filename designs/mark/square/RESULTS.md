# The clock in a square: blind reads

The owner, 31 Oct 2026: "the clock logo looks bad when in a square because the arms force it to be super zoomed out.
What are our options/alternatives?" The stand-alone symbol is 11.8 x 25 mm, so in a square the hands set the scale
and the ring ends up about a third of the tile. `build.cjs` draws the alternatives from the final logo's own geometry
(its clock matches `../final/the-o/symbol-light.svg` exactly); this file records how each one reads.

## Method

The same protocol as `../clean-reads/RESULTS.md`, adapted to a square: each reader was a separate fresh agent (Agent
tool, not the Workflow tool, so no chat message was passed on) given one image and the prompt below, nothing else.
Images: `blind/<id>.png`, copied to neutral file names (`/tmp/br/k2.png` and so on) so the file name gave nothing
away. The images as tested are in git: round 1 at commit b2ba948, round 2 (the redrawn clock face) at 04d0ed7;
`blind/` now holds the current drawings, which have the critics' fixes. Each shows the light version as a 160 px and a 56 px profile circle and a 120 px app icon.

Symbol prompt, word for word:

> Quick first-impression check, about a minute of work. Open this one image with the Read tool: [path]
> Don't open, list or search any other files. It's one small emblem, shown as a profile picture and an app icon.
> Reply with only these four answers:
> 1. What is it a picture of? One short phrase.
> 2. How sure are you, 1 to 10?
> 3. What else could it be mistaken for, if anything?
> 4. Does it suggest any letter or number? If so, which?

The stacked name used the lockup prompt from `../clean-reads/RESULTS.md` ("What does it say? ... Describe the first
character ..."), with "the way you'd glance at a profile picture".

One leak, the same for every image in round 1: the readers' working folder was
`/home/user/offshft/designs/mark/square/blind`, and 4 of the 15 said they'd noticed "offshft" in it, which may have
nudged them toward a clock. Round 2 ran from `/home/user`.

## Round 1 (31 Oct 2026)

| Option | Seen as (their words, shortened) | Sure | Also mistaken for |
|---|---|---|---|
| 0 As it is | clock hands around a big hub, no face, 5:00 | 6 | magnifying glass, target, eye, vinyl record, stopwatch crown; Q |
| 0 As it is | clock hands around a centre hub, 5:00 | 7 | magnifying glass, power button, target, frying pan with an egg; Q |
| 0 As it is | two clock hands around a hub, 5:00 | 6 | magnifying glass ("especially small"), fried egg in a skillet, target; Q |
| 1 Hands off the edge | a clock or timer dial, marks at 12 and 5 | 4 | magnifying glass, target, vinyl, power button; "small: a plain ring or target"; Q |
| 1 Hands off the edge | a clock or timer dial | 5 | Q, vinyl with tonearm, bullseye, lens; "small: a bullseye with a bar on top" |
| 1 Hands off the edge | a clock or dial face | 5 | "a ring with two sticks"; bullseye, vinyl, magnifier, power button; "small: a donut"; Q |
| 2 Shorter hands | a stylized clock, about 5 o'clock | 6 | magnifying glass ("the standard search symbol"), Q, stopwatch, power button |
| 2 Shorter hands | a stylized clock, about 5:00 | 6 | Q, magnifying glass ("stronger small"), stopwatch, donut, fried egg; "!" |
| 2 Shorter hands | a stylized clock or timer face | 5 | magnifying glass, Q, stopwatch, power icon, Mars symbol; 5:00 or 12:25 |
| 3 Clock face | a clock face showing 5:00 | 9 | timer, gauge; "!" in a circle, like an alert icon, "most at the small size" |
| 3 Clock face | an analog clock face, about 5:00 | 9 | a generic "time", "recent" or "history" icon, gauge, power button; "!" |
| 3 Clock face | an analog clock face, about 5:00 | 9 | "most likely a circled exclamation mark, the usual alert icon"; power button |

| Option | Read as | Sure | First character | Anything odd |
|---|---|---|---|---|
| 4 Stacked name | OFF SHFT | 9 | navy ring, orange dot, hands at 12 and about 5 ("looks like clock hands") | the Q-tail ("QFF"); SHFT reads as a misspelling of SHIFT; tiny details in the small circle |
| 4 Stacked name | OFF SHFT | 8 | "a clock face with its hands poking out" | SHFT without the I; Q or magnifying glass at the small size |
| 4 Stacked name | OFF SHFT | 9 | a clock face, hands at 12 and about 5 | the Q-tail ("QFF"), more in the small circle; the missing I |

Averages (how sure each reader was that it's a clock): as it is 6.3 (the same as the 25 mm symbol on fabric in
`../clean-reads/RESULTS.md`), hands off the edge 4.7, shorter hands 5.7, clock face 9.0. Stacked name: OFF SHFT
3 out of 3 at 8.7, and all three saw the clock in the O without being asked.

What it means:
- **Making the symbol bigger costs the clock.** Cropping the hands or shortening them both read worse than the symbol
  as it is (4.7 and 5.7 against 6.3), and the magnifying glass, the Q and the target get stronger as it gets smaller.
  The hands standing out of the ring are what make it a clock; they're also what make it tall.
- **The clock face reads best (9 out of 10, 3 of 3)** but all three readers also saw a "!": the long hand floats over
  a big dot. One called it a generic time icon.
- **The stacked name fills the square and says the name**, with the clock still seen in the O. It has the same Q-tail
  and SHIFT remarks as every lockup test.

## Round 2: the clock face redrawn (31 Oct 2026)

Smaller pivot dot (0.09 of the ring, was 0.13), bolder hands (0.058, was 0.05), and a broader, longer hour hand
(1.4 x the minute hand's width, 0.6 of the dial, was 1.03 x and 0.56), as on a real watch. Same prompt, three new
readers, working folder `/home/user` this time. Image: `blind/3-clock-face.png` as `/tmp/br/w6.png`.

| Seen as | Sure | Also mistaken for |
|---|---|---|
| an analog clock showing 5:00 | 9 | small: a gauge, speedometer or timer; a power button; "!" from the upright hand over the dot; a tilted V |
| an analog clock face showing five o'clock | 9 | "mostly a generic time, history or recent icon"; small: "!" in a circle; "it reads first as a clock" |
| an analog clock face showing 5 o'clock | 9 | "a generic clock / time / recent-history UI icon or a default Clock app, so it may not read as a distinct brand"; small: "!" |

Still 9 out of 10, 3 of 3. The "!" went from the main mix-up (round 1) to a faint one at the smallest size. What
stays is the trade-off: two of these three (and one in round 1, so 3 of 6) called it a generic clock icon or a
phone's clock app, which `../BRIEF.md` warned against.

## What the critics said (31 Oct 2026)

Three reviewers with different briefs went through every option, measured them and rendered them at real pixel sizes
(workflow run wf_6d5fa0f1-8af; their scratch work stayed in /tmp). Where they agreed:
- **The ceiling.** With the hands outside at the symbol's lengths, the minute tip is 2.79 ring radii from the centre, so
  the ring can never be more than about 36% of a circle (the old favicon placement was 32%). Every way past that
  turns it into another object: cropped hands give a target, scope or tyre swing; short hands a stopwatch or magnifier.
- **The browser tab needs its own drawing.** Nothing scaled down survives 16 px. The store's current favicon (the
  25 mm symbol on fabric Bone, which Shopify serves at 32 px) is a grey smudge on a 1x screen.
- **Screens use thread Bone #ECE5D3, not fabric Bone #E4DDCB**: Rust on it is 3.91:1 against 3.62:1.
- **Drop options 1 and 2.**

Where they split: the brand reviewer ranked the stacked name first and rejected the clock face for every job (it
reads as a clock in general, not as OFF SHFT, and matches the standard UI clock icons); the small-size reviewer would
keep a refitted hands-outside clock (ring about 41%) for avatars; the adversarial reviewer ranked the clock face first
as the only option that really fixes the size, at the cost of looking stock. Their framing, which the owner's page
uses: hands outside with a small O (the hat logo), or hands inside with a big O (a clock face), and the stacked name
for squares if the hands stay outside.

Applied from the reviews: option 0 now centres the ring and lets the minute tip reach the rim (ring 34%, concentric
with circle crops); the stacked name is centred on its letters, fitted by its outline to a circle of radius 45, and
uses a 1.5 mm channel in its O with SHFT a hand's width below the hour tip; the clock face has bolder hands (0.07 of
the dial, hour 1.25 x) and a dial of 80; and `tab/` holds pixel-grid tab icons for both directions (hands outside at
16, 32 and 48 px; the clock face's 16 px cut with the hands joined at the pivot).
