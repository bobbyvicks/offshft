# Truly blind reads: short hands (C) against the earlier long hands

## Why this round exists

Every earlier "cold read" ran through a workflow tool that also showed each reader the owner's latest chat
message (table at the end). Some of those messages gave the answer away ("the arms feel too big for the clock",
"lets make the letters uniform in size", which one reader then repeated back as a finding). This round was run
differently: each reader was a separate fresh agent that saw only the prompt below and one image. Their
transcripts were checked afterwards, and none contained a chat message.

## Method

Twelve readers, three per image, one image each.

| Image | What it is |
|---|---|
| Lockup, short hands | `../final/the-o/logo-light-cap7.png` at commit fc3fce1: 7 mm letters, true size, minute 4.6 mm, hour 3.5 mm |
| Lockup, long hands | the same file at commit ce8576a: minute 6.6 mm, hour 4.7 mm |
| Symbol, short hands | `symbol-light-25mm.png` at commit fc3fce1: hands at the same proportion to the ring as the short-hand lockup |
| Symbol, long hands | `symbol-light-25mm.png` at commit ce8576a (and again now) |

Lockup prompt, word for word:

> Quick legibility check, about a minute of work. Open this one image with the Read tool: [path]
> Don't open, list or search any other files. Look at it the way you'd glance at a logo on the front of a cap,
> then reply with only these four answers:
> 1. What does it say? Write the exact letters you read.
> 2. How sure are you, 1 to 10?
> 3. Describe the first character in one sentence.
> 4. Is anything hard to read or odd-looking? One sentence; "nothing" is fine.

Symbol prompt, word for word:

> Quick first-impression check, about a minute of work. Open this one image with the Read tool: [path]
> Don't open, list or search any other files. It's a small emblem that would be stitched on a clothing item.
> Reply with only these four answers:
> 1. What is it a picture of? One short phrase.
> 2. How sure are you, 1 to 10?
> 3. What else could it be mistaken for, if anything?
> 4. Does it suggest any letter or number? If so, which?

## Results

### Lockup

| Hands | Reader | Read as | Sure | Saw a clock? (unprompted) | Anything odd (their words, shortened) |
|---|---|---|---|---|---|
| Short | 1 | OFF SHFT | 9 | "like clock hands", 12 and about 5 | lower stroke "sits exactly where a Q's tail goes", "QFF"; SHFT looks like a typo of SHIFT |
| Short | 2 | OFF SHFT | 9 | "like clock hands", about 5 o'clock | lower hand "sits where a Q's tail would be", "QFF"; SHFT a misspelling of SHIFT |
| Short | 3 | OFF SHFT | 9 | "like clock hands at 12 and 5" | lower bar "right where a Q's tail would be"; SHFT a typo for SHIFT |
| Long | 1 | OFF SHFT | 9 | "drawn as a clock face", "roughly 5:00" | lower hand "right where a Q's tail goes", "QFF"; hands stop outside the ring; SHFT a typo |
| Long | 2 | OFF SHFT | 9 | "clock hands", "about 5:00" | lower hand "a bit like a Q's tail at a glance"; SHFT a misspelling |
| Long | 3 | OFF SHFT | 9 | "drawn as a clock face", 12 and about 5 | lower hand "where a Q's tail would be"; SHFT a misspelling |

### Symbol (25 mm)

| Hands | Reader | Seen as | Sure | Also mistaken for |
|---|---|---|---|---|
| Short | 1 | an abstract clock, about 5:00 | 5 | magnifying glass, bullseye, stopwatch; Q strongest letter |
| Short | 2 | a stylized clock face, 12 and about 5 | 5 | magnifying glass, Q, target with darts; "top hand only a little longer", could read 12:25 |
| Short | 3 | a stylized clock face, 5:00 | 5 | magnifying glass, Q, bullseye; "the clock reading is weaker than the Q and magnifying-glass readings at a quick glance" |
| Long | 1 | clock hands on a centre hub, about 5:00 | 6 | Q, magnifying glass, target, gauge |
| Long | 2 | a simple clock, 5:00 | 6 | magnifying glass, Q, target; "the clock only shows once you notice that both orange bars point outward from the center" |
| Long | 3 | clock hands around a centre hub, about 5:00 | 7 | magnifying glass, bullseye, compass; Q strongest letter |

## What it means

- **Lockup: the short hands cost nothing.** Both versions read "OFF SHFT" 3 out of 3 at 9/10, and every reader saw
  a clock showing about 5:00 without being asked about clocks. The owner's pick (C) is the lockup default.
- **The "Q's tail" look is there with either hand length.** It comes from a hand at 5 o'clock just outside an O.
  All six readers still read OFF SHFT correctly. Worth knowing; not a reason to change the mark.
- **Symbol: the long hands read better on their own** (6.3/10 against 5/10, and the short pair can look like
  12:25). The symbol keeps the long hands.
- **SHFT:** all six lockup readers noticed the missing I and read it as SHIFT, which is the intended meaning.

## Earlier rounds: what each reader was also shown

| Round | Readers shown a chat message | The message |
|---|---|---|
| offshft-hands-logo (exploration) | 4 of 5 | "i like the hands only, how could we make that more of a logo" |
| offshft-o-blind-read | 12 of 13 | "make the o a bit bigger" |
| offshft-o-blind-read-2 | none | |
| offshft-o-final-review | none | |
| offshft-o-verify-read | 3 of 4 | "make it 15% bigger and i like that ngl. Are there different fonts we can work with using this blocky style" |
| offshft-side-verify | 2 of 3 | the same message |
| offshft-unbounded-review | 5 of 6 | "Im a bigger fan of unnbounnded ngl" |
| offshft-symbol-confidence | 15 of 16 | "what can we do to raise confidence?" |
| offshft-hands-option-read | none | |
| offshft-ticks-read | 12 of 13 | "what if we did inside ticks like how a clock actually works" |
| offshft-thin-read | 12 of 13 | "make the o less think to accomidate?" |
| offshft-uniform-read | 12 of 13 | "it looks like a scope yea, lets make the letters uniform in size" |
| offshft-arms-read | 9 of 10 | "the arms feel too big for the clock" |

Future reading tests should start each reader separately, as in this round, so they see nothing but the prompt.

## Round 2: the symbol's clock in the wordmark (owner's pick "1"), 29 October

Same method and lockup prompt as above, three new readers, image `../final/the-o/logo-light-cap7.png` after the change
(letter-sized O with the pivot dot, ring walls 0.82 x the stem, hands at the symbol's proportion).

| Reader | Read as | Sure | Saw a clock? (unprompted) | Anything odd (their words, shortened) |
|---|---|---|---|---|
| 1 | OFF SHFT | 9 | "an O drawn as a clock face", dot in the middle, about 5 o'clock | missing I reads as SHIFT or a misprint; lower hand "where a Q's tail would be" |
| 2 | OFF SHFT | 9 | "a thick dark-navy ring", orange dot, hands at 12 and about 5, "reads as a clock face" | SHFT looks like a typo of SHIFT; the O looks "a little like a Q" |
| 3 | OFF SHFT | 8 | "looks like a clock face showing about 5 o'clock" | lower hand where a Q's tail goes ("QFF"); SHFT a misspelling of SHIFT |

The dot costs nothing: 3 out of 3 read OFF SHFT (average 8.7, against 9 without the dot), all three saw the clock at
5:00, and nobody read it as a scope or target. The Q-tail and SHIFT remarks are the same as every earlier version.

