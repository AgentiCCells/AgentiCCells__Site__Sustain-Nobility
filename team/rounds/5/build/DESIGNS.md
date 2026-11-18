# Round 5 build: the five designs, second pass

Developer: developer.sustain-nobility@AgentiCCells.dinis (designs build), 2026-11-18, for conductor.sustain-nobility@AgentiCCells.dinis. Not committed. `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC (as round 4): "a couple more rounds of design work on this site".

Read: `CLAUDE.md`, `team/developer/ROLE.md`, `team/rounds/5.md`, `team/rounds/4/review/LIVE.md` with its screenshots, `team/rounds/4/review/DESIGN.md` (C1 to C5 and the fails still bind), `team/rounds/4/build/DESIGNS.md`, `data/copy.json`, `data/research.json`. Finish compared again with gabriel-dacruz.agenticcells.site /d/, /d/score/ and /d/sleeve/ (Playwright, 1366 px; screenshots in the session scratchpad only).

Changed: `scripts/designs.mjs` only. Brief items done: 2, 3, 6 (design side), 7, 8, 9, plus quick critique fixes listed below.

## Page heights (Playwright Chromium, light, reduced motion, fonts loaded)

| Design | 1366 px, round 4 | 1366 px, now | 390 px, now | H1 top at 1366 | H1 top at 390 (before, now) |
|---|---|---|---|---|---|
| Board Paper | 7,470 | 7,443 | 13,087 | 257 | 315, 209 |
| Readiness Dial | 5,503 | 5,820 | 13,028 | 206 | 276, 177 |
| Deadline Calendar | 6,366 | 6,253 | 10,731 | 489 (was 597) | 578, 183 |
| Grid Poster | 7,319 | 7,413 | 12,407 | 216 | 326, 229 |
| Quiet Counsel | 12,711 | 7,752 | 9,334 | 246 | 324, 220 |
| /d/ | | 3,176 | 5,286 | 238 | 293, 185 |

H1 at 390 measured in light and dark (same values).

`scrollWidth` equals the viewport at 390 and 1366 on all five and /d/. Fonts per page unchanged from round 4 (bytes measured from the network: Board Paper 76,784; Dial 54,192; Calendar 85,584; Grid 29,016; Counsel 89,188; /d/ 62,208), at most 3 families. No new font is needed.

## What changed, by brief item

**2. Calendar year numerals.** The outlined Newsreader numerals are now a solid tint (`fill`, no stroke), 60 px, so the font's overlapping inner contours no longer show. Tint `#8a7f68` on `#f5f1e8` is 3.5:1 (large text), dark `#6b717a` on `#121417` is 3.75:1.

**3. Quiet Counsel.** One eyebrow line (the `counsel.opening` line, which carries the word "proposal"); the second eyebrow is gone. The page is 7,752 px at 1366 (was 12,711), with the same 22 px body and the same heading sizes. Words cut, not type: the 80vh minimum per section is gone (sections now take their content plus padding, with a hairline between them); the second lede paragraph, the flow intro, the per-step summaries, the flow footnote, the Assess/Identify/Generate intro, the area summary lines, the partner method quote and types intro are dropped (all are said elsewhere on the page or on the main site). The partner types stay as one line with a source note. The dates are a ruled two-column table with a numbered source note per row instead of a full source line under each. Plans are a 2 by 2 grid with every field kept (name, label, who it is for, what you get, price, how to start). Figures enlarged: the areas hexagon now fills the measure with each area's number and name at its corner (under 600 px the names show as a list beside a plain hexagon, since SVG text would be too small); the partner figure fills the measure. Step rings on the continuous line are 64 px from 761 px up (44 px below, so they no longer touch the text).

**6. Strip alignment (design side).** Each page sets `--pk-max` (content width of the header's inner box), `--pk-pad: 16px` and `--pk-align`, following the contract written at the top of `src/assets/picker.css`. Measured at 1366 and 1600 px, the strip label's left edge equals the wordmark's left edge and the strip's right edge equals the header's right edge on Board Paper (139 px at 1366), Dial, Calendar and Grid (16 px at 1366) and /d/ (75 px). Quiet Counsel is `center`, inside the same 42rem box as its header. Under 600 px the strip is the other developer's (hidden into the dialog).

**7. Dial.** Segments are solid: all six filled with the same neutral tint `#1f2c36`, solid `#7d93a3` outline (5.5:1 on the panel), a fine inner rim circle, rim numerals 24 px in the ink colour. Still empty: no score, needle, scale, highlight or status colour; the description now says "all the same neutral tint and none marked". Below the hero each panel has one large element: area numerals at 3.4rem, the flow rail at full panel width, Assess/Identify/Generate as 2.2 to 3.4rem words, plan names at up to 2.1rem, the partner figure at up to 34rem, the dates grouped under large year numerals (a year is `aria-hidden`; every date keeps its full `<time>`), the founder's name at up to 2.6rem, the closing quote at up to 2.8rem. Panels have more padding from 960 px.

**8. Calendar.** The year ruler band is lower (viewBox 1300 by 200, was 290; three label rows, was four; the read marker label sits at the top), so the kicker starts at 470 px and the H1 at 489 px at 1366, with the whole headline in the first 800 px. Dates closer than 32 units share one bracket and one label holding their numbers ("7, 8, 9"); their dates are in the list below with their sources. The caption says so ("Close dates share one bracket.").

**9. Grid Poster and Board Paper.**
- Grid: sections vary in scale. 02, 06, 08 and 09 are compact (ordinal and heading on one line, smaller); 03 (flow) is a full-bleed black band with 10.5rem step numerals (red and grey re-chosen for the band: `#ff6b55` 6.7:1, `#bdbdbd` 10:1; dark theme inverts the band to light with `#b3261e` 5.8:1); 04 (areas) is the large numeral spread, a solid red ordinal up to 19rem beside the quote and larger area blocks (the blocks overflowed in round 4 at some widths; they no longer have a fixed square ratio there); 05 standard; 07 (dates) is a wide ruled table with one row group per year and the year in Archivo 800 at up to 4.4rem (`th scope="rowgroup"`), stacking under 700 px.
- Grid at 390: the six-square question mark sits right of the eyebrow at 2.9rem instead of above the grid.
- Board Paper: the annex is a two-column set of ruled tables, one per year with the year as caption, date as row header, the source on a small line under each entry. Paragraph 1.3 (their c7 quote) is set as a display paragraph and the next-step box leads with a large line, so the scale is no longer even. Margin notes lifted to about 14 px at 1366 and aligned closer to the paragraph top. The sheet ends with a double rule and "End of paper"; the footer now sits inside the sheet's margins with a top rule.

## Phones (conductor's notes from the main-site developer, received during the build)
- **Headline at or above about 240 px at 390 px**: done on all five and /d/ (table above). A shared phone rule in `designs.mjs` (under 600 px) sets the notice to 12 px with tighter padding (same sentence, not clipped) and puts the header on one row: wordmark over the visible Proposal tag, then the Designs chip and Their site, all still 44 px tall. Calendar puts its headline and lede before the year ruler under 600 px (the ruler-first opening stays from 600 px up); Grid, Counsel and /d/ have less top padding there. On Grid the wide uppercase wordmark breaks after its hyphen onto two lines at 390.
- **Strip shown on /d/calendar/ in dark mode at 390 px**: not reproduced. `designs.mjs` has no rule that touches `.dz-strip` (or any `dz-` class except the chip size above). Measured with Playwright at 390 x 844, light and dark: `.dz-strip` computes to `display: none` on all five designs and /d/. If it was the Calendar's "Dates from the sources" ruler heading, that is the design's own figure, which now sits under the headline on phones.
- **Strip variables**: as described under item 6 (`--pk-max` is the content width, no padding).

## Rules kept
Notice exact and first after the skip link; `<!--designs-chip-->` inside every header (writePage still throws otherwise); "proposal" in every title; Open Graph previews; no forms; every action to https://www.sustain-nobility.com; external links only to their site and research.json sources; timelines only from research.json dates, replaced date labelled and not drawn; plans and areas exactly as copy.json (Counsel shows area names, not the summary lines); no prices or scores; their quotes one colour and one style; reduced motion (no animation added); forced colours (new SVG fills are paths, which the existing forced-colours rule empties). Contrast of every new pair measured above; existing pairs unchanged.

## Gates (2026-11-18, in the repository)
- `node scripts/build.mjs`: built; picker on 16 pages.
- `node scripts/validate.mjs`: OK.
- `node scripts/leak-scan.mjs`: OK (112 files).

## Screenshots (Chromium, deviceScaleFactor 1, light, reduced motion, 128 or 64 colours; 1.57 MB in all)
- First screens at 1366: `d-board-paper-1366.png`, `d-dial-1366.png`, `d-calendar-1366.png`, `d-grid-1366.png`, `d-counsel-1366.png`.
- At 390: `d-calendar-390.png`, `d-grid-390.png`.
- Whole pages at 1366, half scale, to show the lower sections: `d-<design>-1366-full-half.png` for all five.

## For others
- **Writer (page furniture not in copy.json, added this round):** "End of paper" (Board Paper), "Close dates share one bracket." (Calendar ruler caption), "Year" and "What the source says, and the source" (table headers on Grid and Board Paper). Move into copy.json if preferred.
- **Picker (other developer):** /d/ thumbnails in `src/assets/designs/` show the round 4 designs; retake them after this build (brief item 10).
