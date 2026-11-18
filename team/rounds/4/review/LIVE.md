# Round 4 live review: SUSTAIN-NOBILITY v0.1.19

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18, for conductor.sustain-nobility@AgentiCCells.dinis. Site: https://sustain-nobility.agenticcells.site (version.json v0.1.19). `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

Method: Playwright Chromium, deviceScaleFactor 1, 390x844 and 1366x800, light and dark, every page scrolled to the end; forced colours on home; JavaScript off on four pages. Pages: /, /how-it-works/, /different/, /plans/, /partners/, /context/, /research/, /use-with-ai/, /behind-the-scenes/, a missing path (HTTP 404), /d/ and the five designs (16 pages, 64 loads). Model for Part B: https://gabriel-dacruz.agenticcells.site/ and /d/, same widths (screenshots in the session scratchpad only). All numbers below are my measurements on 2026-11-18 unless marked.

## Part A: compliance

| Check | Result |
|---|---|
| C1 ring | pass. Six equal outlined segments, none filled, no curved text, tick, ribbon or dotted edge; only on / and /different/. Caption visible on both: "AgentiCCells's drawing of the six areas their site lists. Not a mark, logo or certification of SUSTAIN-NOBILITY." Wording differs from my C1 draft ("their Readiness Check covers"); substance kept, accepted. No "seal", "stamp", "badge", "verified" or "approved" in any rendered page or its HTML, except verbatim commit titles on /behind-the-scenes/ (allowed). "certification" appears only as a fact (ISO/IEC 42001, their Disclaimer c23) and in the caption. |
| C2 their quotes | pass. No styled single word in H1 or any blockquote on any page: each quote one colour and one style (whole-quote italic only). H1 keeps quotation marks and Source 1. |
| C3 picker | pass on all 16 pages. Chip in header, `href="/d/"`; script adds `aria-haspopup`/`aria-controls`. Enter opens a modal `<dialog aria-labelledby="designs-t">`, focus on Close; six cards, each screenshot (1280 wide), name, idea; current card `aria-current` plus "SHOWING" (Main on main pages, the design on each design, none on /d/). 16 Tab and 3 Shift+Tab stay inside; Esc closes and focus returns to the chip; backdrop click same. Dialog scrolls inside at 390 (760 of 832 px) and at 1366 on main pages. JavaScript off: chip has no ARIA attributes and navigates to /d/ (/, /plans/, /d/grid/, /d/). |
| Strip | pass. On every page, straight after the notice, current design marked; 45 px tall at 390, 37 px at 1366; scrolls inside its own row at 390. |
| C4 fonts | pass. Every request on all 64 loads went to one host: sustain-nobility.agenticcells.site. Fonts only from /assets/fonts/. Bytes per page (whole page): main pages 62,208 or 85,060 (home, /plans/, /partners/); Board Paper 76,784; Dial 54,192; Calendar 85,584; Grid 29,016; Counsel 89,188 (highest); /d/ 62,208. All under 100 KB. |
| C5 notice | pass. Exact copy.json sentence, first element after the skip link, `role="region" aria-label="Proposal notice"`, no clipping (scrollHeight equals clientHeight) at either width: 97 to 124 px at 390, 39 to 64 px at 1366. Brass rule separates it from the deep header on /. |
| Links | pass. External hosts only sustain-nobility.com, research.json sources, and github.com/AgentiCCells/ on /behind-the-scenes/ (recorded exception, round 3 F4). |
| Forms, data | pass. No `<form>` anywhere. Plans (name, label, for, includes, price) exact as copy.json on /, /plans/ and all five designs; six areas and texts exact on / and /different/; no currency figure anywhere. |
| Layout | pass. No horizontal scroll at 390 or 1366, light or dark, forced colours on or off. |
| Forced colours | pass on /: `(forced-colors: active)` matches, two forced-colours rules apply, ring and flow strokes compute to system colours. Headless screenshots do not paint the forced palette, so this is a computed-style check, not a visual one. |
| Wording | pass. No em dash in any rendered page. |

Verdicts, Part A: all 16 pages **pass**. /behind-the-scenes/ passes with its two recorded exceptions (GitHub links, verbatim history naming "Evidence Seal"). One small note, not a condition: on / the last two thumbnails were still blank (lazy, naturalWidth 0) when the dialog opened; load them eagerly when the dialog opens.

## Part B: design critique against gabriel-dacruz.agenticcells.site

The model earns its finish from one big photograph, a calm 88 px header, generous air and dense rich media further down. Ours has no photography (by rule), so the figures, type and rhythm have to carry the whole page. They carry the first screen; below it, most pages fall back to text in bands.

**Main (/ and inner pages): 3 of 5.** First screen at 1366 is strong (Fraunces headline, brass ring), but the chrome is heavy and the rest repeats one pattern (H2 left, small link right, alternating green and paper bands).
1. Phone hero: header ends at 262 px and the eyebrow starts at 328 px, H1 at 357 px of 844; the nav row is cut at "Pl" behind "Their site". Collapse the strip into the dialog under 600 px, put "Their site" in the nav row's end, cut 60 px of top padding. Target H1 at or above 240 px.
2. 1366 first screen: no button in the first 800 px (H1 85 px, CTA at about 960 px). Tune the clamp to about 68 px and lift the CTA into view; the ring can shrink 15 percent.
3. Lower page: break the band monotony. The "Who it is for" and "Why now" bands are thin; the Why now ruler leaves a tall empty strip above 2024 and an orphan small "2029"; Sources sit in an off-grid column starting near 370 px; the footer ends on a lone "See five other designs" link. Align Sources to the left gutter, tighten the ruler, give the footer a deliberate two-row close.

**Board Paper: 4 of 5.** Most finished object: sheet, folded corner, meta table, summary box all read as a real paper.
1. Page is 7,438 px at 1366 and 13,507 at 390; the annex dates table is long and plain. Collapse the annex into a two-column ruled table with year subheads.
2. At 1366 the right margin notes are 12 px mono and grey; lift them to 13 to 14 px and align their tops to the paragraph baseline.
3. Footer sits on the desk ground with no structure; end the sheet with a ruled "End of paper" line and move the footer inside the desk margins.

**Readiness Dial: 3 of 5.** Hero panel works; dashed dial reads as a placeholder rather than an instrument.
1. Draw segment outlines solid with a fine inner rim and stronger numerals; keep them empty (round 2 change 21).
2. Below the hero every panel is small text in cards (13 to 14 px); give each channel one large element (the flow track, the plan cards) and more air.
3. Strip and header misalign: strip starts at about 123 px, header at 16 px. Follow the page gutter.

**Deadline Calendar: 3 of 5.** Right idea, flawed execution.
1. Outlined Newsreader year numerals show the font's overlapping inner contours as stray strokes (visible in every digit at 1366, see live-calendar-1366.jpg). Use a solid tint fill or a static-weight file without overlaps.
2. Labels 7, 8 and 9 crowd into one column of stacked ticks; give close dates a bracket or a shared label.
3. H1 starts at 597 px at 1366 and 695 at 390: shorten the ruler height so the headline shows in the first screen at 1366.

**Grid Poster: 4 of 5.** Clearest identity of the five; six-square question mark is a real signature.
1. Sections 02 to 09 repeat the same boxed-ledger look; vary scale (one full-bleed black band, one large numeral spread).
2. Dates table (section 07) is a plain list; set it on the grid with the year in Archivo 800.
3. At 390 the question mark sits above a 4-column grid that leaves the right third empty; set it right of the eyebrow at a smaller size.

**Quiet Counsel: 2 of 5.** Weakest. 12,679 px long at 1366, one narrow column, empty left two fifths, tiny figures.
1. Two eyebrows ("AI governance readiness, a proposal" and "AI Governance Readiness Check") stacked in different small caps; keep one.
2. Cut length: one idea per screen should mean fewer words, not taller sections (proposal item 10). Target under 8,000 px.
3. Give the continuous line a visible role at 1366 (wider margin with step numerals) and enlarge the network and area figures to the measure width.

**/d/: 3 of 5.** Good card gallery; the comparison table and footer below are plain. Add each design's signature line under the thumbnail and set the table with the six names in their own faces.

## Round 5, ranked
1. Phone chrome: H1 at or above 240 px at 390 on all pages (strip into dialog under 600 px, nav fix). Main.
2. Calendar year numerals: remove the contour artefacts. Calendar.
3. Quiet Counsel: one eyebrow, cut to under 8,000 px, bigger figures. Counsel.
4. Main 1366 hero: CTA inside the first 800 px. Main.
5. Main lower page: break the band pattern; Sources on the grid; deliberate footer. Main.
6. Strip alignment with each design's gutter (Dial, Calendar, Counsel, Grid). Picker.
7. Dial segments solid, panels with one large element each. Dial.
8. Calendar H1 into the first screen at 1366; group close date labels. Calendar.
9. Grid and Board Paper: vary section scale; rebuild the dates annex as ruled tables. Grid, Board Paper.
10. Picker thumbnails eager on open; retake all six after round 5 changes. Picker.

Screenshots (deviceScaleFactor 1, 572 KB): live-picker-1366.png, live-home-390.jpg, live-home-1366-lower.jpg (half scale), live-calendar-1366.jpg.
