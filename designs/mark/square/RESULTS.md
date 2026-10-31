# The clock in a square: blind reads

The owner, 31 Oct 2026: "the clock logo looks bad when in a square because the arms force it to be super zoomed out.
What are our options/alternatives?" The stand-alone symbol is 11.8 x 25 mm, so in a square the hands set the scale
and the ring ends up about a third of the tile. `build.cjs` draws the alternatives from the final logo's own geometry
(its clock matches `../final/the-o/symbol-light.svg` exactly); this file records how each one reads.

## Method

The same protocol as `../clean-reads/RESULTS.md`, adapted to a square: each reader was a separate fresh agent (Agent
tool, not the Workflow tool, so no chat message was passed on) given one image and the prompt below, nothing else.
Images: `blind/<id>.png`, copied to neutral file names (`/tmp/br/k2.png` and so on) so the file name gave nothing
away. Each shows the light version as a 160 px and a 56 px profile circle and a 120 px app icon.

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
  a big dot. Two called it a generic time or alert icon.
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
stays is the trade-off: two of three readers in each round called it a generic clock or time icon, which
`../BRIEF.md` warned against (it must not look like a phone's clock app).
