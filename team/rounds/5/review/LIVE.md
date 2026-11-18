# Round 5 live review: SUSTAIN-NOBILITY v0.1.22

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18, for conductor.sustain-nobility@AgentiCCells.dinis. Site: https://sustain-nobility.agenticcells.site (version.json v0.1.22, commit 89e2cb7, built 10:27 UTC). `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "a couple more rounds of design work on this site".

Method: Playwright Chromium, deviceScaleFactor 1, 390x844 and 1366x800, light and dark, each page scrolled to the end (64 loads); picker by keyboard on all 16 pages at both widths (32 runs); JavaScript off on /, /plans/, /d/, /d/grid/, /d/counsel/. Pages: the nine main pages, a missing path (HTTP 404), /d/ and the five designs. Model: https://gabriel-dacruz.agenticcells.site/ at 1366. All numbers are my measurements on 2026-11-18.

## Part A: compliance (all 16 pages pass)

| Check | Result |
|---|---|
| C1 ring | pass. Only on / and /different/, caption visible on both; six equal outlined segments, none filled. No "seal", "stamp", "badge", "verified" or "approved" in rendered text except the verbatim commit history on /behind-the-scenes/ (recorded exception). |
| C2 quotes | pass. Every H1 and blockquote is one colour and one style across the whole quote; only source superscripts and attribution lines differ. Quotation marks and Source 1 kept. |
| C3 picker | pass, 32 of 32. Chip `href="/d/"`, `aria-haspopup="dialog"` added by script; Enter opens a modal dialog, focus on Close, six images all loaded, `aria-current` plus "Showing" on the right card (none on /d/); 16 Tab and 3 Shift+Tab stay inside; Esc and backdrop click close and return focus to the chip. Dialog scrolls inside (760 px at 390, 720 px at 1366). JavaScript off: no ARIA on the chip, strip hidden at 390, chip goes to /d/. |
| Strip | pass. After the notice on every page; 37 px tall at 1366; `display: none` at 390 on all 16 pages, light and dark (including /d/calendar/ dark), with the chip still opening the dialog. |
| C4 fonts | pass. Every request on all 64 loads to sustain-nobility.agenticcells.site; fonts only from /assets/fonts/. Bytes per page (cold, from resource timing): main pages 62,208, or 85,060 on /, /plans/, /partners/; Board Paper 76,784; Dial 54,192; Calendar 85,584; Grid 29,016; Counsel 89,188 (highest); /d/ 62,208. At most 3 families. |
| C5 notice | pass. Exact copy.json sentence (plus a visually hidden "(opens their official site)" on the link), first after the skip link, `role="region"`, scrollHeight equals clientHeight everywhere: 66 to 85 px at 390, 39 to 64 px at 1366. |
| Links | pass. External hosts only sustain-nobility.com and research.json sources, plus github.com on /behind-the-scenes/ (recorded exception). |
| Forms, data | pass. No `<form>`. Plans (name, label, for, includes, price) exact on /, /plans/ and all five designs; six areas and texts exact on / and /different/ and in the designs (Counsel shows names only, as before); no currency figure. |
| Layout | pass. scrollWidth equals viewport on all 64 loads. No em dash in any page. |

## Part B: the ten brief items

| # | Item | Verdict | Measured |
|---|---|---|---|
| 1 | Phone header | pass | H1 top 231 on /, 233 on inner pages and 404; designs 177 to 229, /d/ 185 (target 240). Nav is its own scrolling row with a fade; "Their site" is its last item. |
| 2 | Calendar numerals | pass | Solid tint, no stray contours (live-calendar-1366.png). |
| 3 | Quiet Counsel | pass | One eyebrow; 7,752 px at 1366 (was 12,711), body type unchanged; hexagon and partner figure fill the measure. |
| 4 | Main CTA in first screen | pass | Button bottom 779 px of 800 at 1366 (was about 960); H1 68 px. |
| 5 | Main lower page | pass | Each band has its own layout; ruler ends at 2028, no orphan; Sources on the left gutter; footer in two rows. 8,322 px. |
| 6 | Strip alignment | pass, one note | Strip label edge equals wordmark edge on main (65), Board Paper (139), Dial, Calendar, Grid (16) and /d/ (75). Counsel is centred: label at 381, wordmark at 347. |
| 7 | Dial | pass | Six solid neutral segments, none marked; each panel has one large element. |
| 8 | Calendar first screen | pass | H1 at 489 px, whole headline inside 800 px; 7, 8, 9 share one bracket and label. |
| 9 | Grid and Board Paper | pass | Grid: black flow band, large 04 spread, compact sections, dates as a year table. Board Paper: annex as ruled tables by year, display paragraph 1.3, "End of paper". |
| 10 | Picker thumbnails | pass | 0 of 6 loaded before opening, 6 of 6 (1280 wide) on open, all 32 runs. All six retaken at 10:27 and show the round 5 pages. |

## Ratings against gabriel-dacruz.agenticcells.site

- **Main: 4 (was 3).** The first screen now holds headline, ring and button, and the lower page has rhythm; the model is still calmer at the top (88 px of chrome against our 162 at 1366: notice, strip and header).
- **Board Paper: 4 (was 4).** The most finished object, now with a proper annex and close; the "Covered by one check" column of ticked boxes is the one jarring detail.
- **Readiness Dial: 4 (was 3).** Solid empty segments read as an instrument, not a placeholder, and the panels finally have one large element each.
- **Deadline Calendar: 4 (was 3).** Clean numerals and the headline in view make the idea work; labels 1/2 and 4/5 still stagger a little.
- **Grid Poster: 4 (was 4).** Now the strongest design at 1366, a 5 there; held at 4 by the phone opening, where the question mark runs into the headline.
- **Quiet Counsel: 3 (was 2).** Length fixed and the figures read; at 1366 it is still one 42rem column with two empty margins and no visible line.
- **/d/: 3 (was 3).** Fresh thumbnails help; the comparison table and footer below are plain and the signatures are not shown in each design's face.

## Remaining improvements, ranked

1. Grid at 390: the six-square question mark (top 172 to 243) overlaps the H1 box (top 229) by 14 px and touches "AI", from 360 to 600 px wide (live-grid-390.png). **Small, fix now:** reserve right padding on the H1 or move the mark up beside the eyebrow.
2. Board Paper: replace the ticked boxes in "Covered by one check" with the word "Yes". Ticks beside their areas sit close to C1 (no tick or check mark) and can read as compliance boxes. **Small, fix now.**
3. Notice link breaks as "sustain-/nobility.com" at 390 on Grid and Calendar. **Small, fix now:** `white-space: nowrap` on the link.
4. Counsel strip: start the label at the 42rem box's left edge, as the header does. **Small, fix now.**
5. Grid wordmark breaks after its hyphen at 390; set it on one line at a smaller size. **Small, fix now.**
6. Main chrome at 1366: 162 px before the hero against the model's 88. Fold the strip into the header row from 1100 px, keeping the notice whole and first (C5). Medium.
7. Quiet Counsel at 1366: give the margin a job (the continuous line and step numerals in the left margin). Medium.
8. /d/: show each signature under its card and set the six names in their own faces in the table. Medium.
9. Designs at 390 run 10,700 to 13,100 px; cut repeated summaries on Board Paper and Dial as done on Counsel. Larger.

Screenshots (deviceScaleFactor 1, 636 KB): live-home-390.png, live-home-1366.png, live-calendar-1366.png, live-grid-390.png.
