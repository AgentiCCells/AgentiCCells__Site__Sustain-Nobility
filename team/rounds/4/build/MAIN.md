# Round 4 build: main design and the designs picker

Developer: developer.sustain-nobility@AgentiCCells.dinis (main build), 2026-11-18, sub-agent of conductor.sustain-nobility@AgentiCCells.dinis. Built to `team/rounds/4/design/PROPOSAL.md` sections 1 and 2 under `team/rounds/4/review/DESIGN.md` (conditions C1 to C5 bind; where they differ from the proposal, the review was followed). Not committed. `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

## What was built

### Designs picker (every page, every design)
- `scripts/picker.mjs`, imported last by `scripts/build.mjs`. On every `_site/**/*.html` it replaces `<!--designs-chip-->` with `<a class="dz-chip" href="/d/" data-designs>Designs</a>` (a page without the marker fails the build unless it carries `<!--no-designs-chip-->`), inserts the "Same facts, six designs:" strip right after the element with `class="notice"` (matching close found by counting nested tags), inserts the dialog and `/assets/picker.js` before `</body>`, and links `/assets/picker.css` before `</head>`. All names, ideas and labels come from `copy.json` `picker` and `designs[]`. Current design: `/d/<slug>/` marks that design, `/d/` marks none, every other page marks Main. Build output: "picker: chip, strip and dialog on 16 page(s)".
- `src/assets/picker.js` (1.5 KB, first party): plain click without modifier keys opens the dialog with `showModal()`, focus goes to Close; `aria-haspopup="dialog"` and `aria-controls="designs"` are set from the script only (C3); Close button, backdrop click and Esc close it; focus returns to the opener on every `close`; Tab and Shift+Tab wrap inside the dialog. Without JS or without `HTMLDialogElement` the chip is a link to /d/.
- `src/assets/picker.css`: neutral, reads `--pk-bg --pk-ink --pk-soft --pk-line --pk-accent --pk-focus` and, for the strip, `--pk-strip-bg --pk-strip-ink --pk-strip-soft --pk-strip-line --pk-strip-accent`, plus `--pk-max`, each with a fallback. Dialog `min(94vw, 64rem)`, max-height 90vh, scrolls inside, backdrop rgba(6,12,10,.74). Grid: 3 columns from 1000 px, 2 from 600 px, one column of rows (thumbnail left) below. Current card: `aria-current="page"`, 2 px accent border and a visible "Showing" tag. Strip links 28 px tall on wide screens, 44 px at 600 px and below. Animation only under `prefers-reduced-motion: no-preference`; forced-colours outlines on the current card and link.
- `scripts/shots.mjs` (by hand, not build or CI): static server on 127.0.0.1 over `_site/`, Chromium 1280x800, deviceScaleFactor 1, light, reduced motion, top of page; JPEG quality 72 to `src/assets/designs/<slug>.jpg`; fails over 150 KB or on a sideways scroll. Run at 10:00 UTC after the designs build wrote all five designs: main 106.0 KB, board-paper 76.2 KB, dial 110.2 KB, calendar 97.9 KB, grid 87.4 KB, counsel 67.5 KB. Re-run before release if a design changes. Playwright is not a site dependency: the script uses `playwright` or `playwright-core` if installed, or `PLAYWRIGHT_MODULE`, and `CHROME_PATH`.

### Fonts (C4)
- `package.json` (private, devDependencies only) pins `@fontsource/fraunces` 5.3.0, `@fontsource/public-sans` 5.3.0, `@fontsource/ibm-plex-mono` 5.3.0, exact; `package-lock.json` as installed. `node_modules/` added to `.gitignore`.
- `scripts/fonts.mjs` copies the files unmodified to `src/assets/fonts/<family>/<file>.woff2` and each `LICENSE` to `src/assets/fonts/LICENSES/<package>.txt`. Files: Fraunces 600 normal (18.1 KB), Fraunces 400 italic (22.9 KB), Public Sans 400 and 600 (14.6 KB each), IBM Plex Mono 500 (14.9 KB). `@font-face` in `src/style.css` with `font-display: swap`; Fraunces 600 is preloaded on the home page.
- Measured on the built pages with Playwright (whole page scrolled, dialog opened): home and /plans/ 83.1 KB in 5 files; /different/, /research/, /404.html 60.8 KB in 4 files (no italic). Three families on every main page. README has a "Third-party material" section.
- For the designs developer: the same layout works for any family, `src/assets/fonts/<package-name>/<file>.woff2` and `src/assets/fonts/LICENSES/<package-name>.txt`; add the files to `FILES` in `scripts/fonts.mjs`.

### Main design: "six-area ring" (proposal "Evidence Seal", renamed under C1)
- `src/style.css` rebuilt: paper #f4f1e8 and deep green #0e3b2e bands with brass #e0b860, Fraunces for headings, Public Sans for text, Plex Mono for labels and numbers; type scale 17 / 22 / 30 / 40 / 56 / 88 px.
- Home (`src/index.html`): hero on deep green with the headline in quotation marks with its source note (C2), the c2 quote, one brass button and one text link, and the six-area ring beside it (inline SVG, six equal outlined segments numbered 01 to 06, no segment filled, no curved text, tick, ribbon, crest or dotted edge; `role="img"` with `home.ring.svg_title` and `svg_desc`; an HTML legend of the six names; visible caption `home.ring.caption`). Then: the c7 question alone, whole quote in one colour and one italic (C2); Assess / Identify / Generate as 56 px words under one visible "AgentiCCells's summary" label with a brass rule covering all three (G5); the flow redrawn full width in HTML on deep green (real text, five Fraunces numerals on a brass track, the return arc labelled `flow.return_label`, brackets from `flow.brackets`, the caption that no plan is named for step 5); who it is for in two halves; six areas as numbered tiles on deep green, all treated alike, with the summary label; plans as one ledger; why now; founder and about in two columns with the Proposals box; closing CTA band; dark footer.
- Plans ledger (home and /plans/): CSS grid with subgrid, a row-label column and four plan columns aligned row by row at 1000 px and up (Their label, Who it is for, What you get, Price, How to start), stacked per plan with visible row labels below. Empty cells read "Not published on their site." (Advisory Services label: `plans_page.no_label`). Prices and contents exactly as `copy.json`; text links, no boxed buttons; no plan highlighted.
- Why now: `scripts/generate.mjs` now writes, for `<!--TIMELINE:home-->`, a horizontal ruler of years before the existing list. The range runs from 1 January of the earliest home row to 1 January after the latest; every position, the year ticks and the "Read 2026-11-18" marker come from `research.json`. A small search places the labels on the fewest levels so that no label overlaps another or covers a leader line. CSS shows the ruler from 1000 px and the list below, so one is read. "This is not legal advice." stays under it.
- Notice (C5): calm dark bar (#0b1612), exact `copy.json` sentence and link, first after the skip link, `role="region" aria-label="Proposal notice"`, no fixed height, wraps to four lines at 390 px (106 px tall) and two at 1366 px (64 px). A 2 px brass rule under it keeps it apart from the deep green header on the home page.
- Header: wordmark with the visible "Proposal" tag at every width, nav, Designs chip, "Their site". At 390 px two rows: wordmark, tag and chip; then the nav, scrolling inside its own region (links 44 px), and "Their site". Inner pages use a paper header; the home page a deep one.
- Inner pages: `<!--designs-chip-->` in every `src` header including `404.html`; `/research/` and `/behind-the-scenes/` get it from the home header they copy. /plans/ uses the ledger; /how-it-works/ the HTML flow plus the step list; /different/ the ring (paper variant, caption from `home.ring.caption`) beside the six areas in two columns. The ring appears nowhere else (not in header, wordmark, favicon, og image, notice, footer or by a CTA).
- `og.png` was not changed: it shows the wordmark, tag and headline, not the ring.

## Font sizes measured (Chromium, computed)
| Element | 1366 px | 390 px |
|---|---|---|
| Body (Public Sans 400) | 17 px / 27.2 | 17 px / 27.2 |
| Hero H1 (Fraunces 600) | 84.7 px / 86.4 | 44.2 px / 45.1 |
| Hero lede | 21.9 px | 19.6 px |
| Question quote (Fraunces 400 italic) | 49.2 px | 29.8 px |
| H2 | 40.0 px | 32.3 px |
| Assess / Identify / Generate words | 56.0 px | 44.2 px |
| Flow numerals | 72.0 px | 40.8 px |
| Plan names in the ledger | 30.0 px | 24.7 px |
| Ruler years | 47.9 px | (list shown) |
| CTA heading | 56.0 px | 39.1 px |
| Notice | 14.0 px | 14.0 px |
| Strip links | 13 px | 13 px |
| Small print | 14.0 px | 14.0 px |

## Contrast (WCAG 2.x ratios, computed from the tokens)
| Pair | Colours | Ratio |
|---|---|---|
| Light: ink on paper | #0f1f19 on #f4f1e8 | 15.1 |
| Light: ink-soft on paper / on tint | #4a5a52 on #f4f1e8 / #ebe6d6 | 6.5 / 5.9 |
| Light: green link on paper / on tint | #1f5c46 on #f4f1e8 / #ebe6d6 | 6.9 / 6.3 |
| Light: brass-text (labels, ring strokes on /different/) on paper / tint | #7a5814 on #f4f1e8 / #ebe6d6 | 5.8 / 5.2 |
| On-deep text on deep | #f4f1e8 on #0e3b2e | 11.0 |
| On-deep-soft on deep | #b9d3c6 on #0e3b2e | 7.8 |
| Brass text and ring strokes on deep | #e0b860 on #0e3b2e | 6.6 |
| Primary button text on brass | #0e3b2e on #e0b860 | 6.6 |
| Ring centre text / numbers on ring core | #f4f1e8 / #e0b860 on #0a2e23 | 13.0 / 7.8 |
| Notice text on notice ground | #f4f1e8 on #0b1612 | 16.3 |
| Brass rule under the notice (non-text) | #e0b860 on #0b1612 | 9.8 |
| Strip label / current strip link on notice ground | #b9c4bd / #e0b860 on #0b1612 | 10.3 / 9.8 |
| Footer text | #d9d4c7 on #0b1612 | 12.5 |
| Dark: ink on paper | #ede8dc on #0b1612 | 15.1 |
| Dark: ink-soft on paper / tint | #b5b0a2 on #0b1612 / #10201a | 8.5 / 7.8 |
| Dark: green link on paper | #7fcfae on #0b1612 | 10.1 |
| Dark: brass on paper / tint | #e0b860 on #0b1612 / #10201a | 9.8 / 9.0 |
| Dark: on-deep / on-deep-soft / brass on deep | on #10241d | 14.4 / 10.2 / 8.7 |
| Dark: notice text / strip label | on #050a08 | 17.7 / 11.1 |
| Rule lines (non-text, line-strong) | #7c7766 on #f4f1e8 | 4.0 |

Forced colours (Playwright `forcedColors: 'active'`): ring strokes, numbers and centre text, flow track and brackets, ledger rules, ruler axis and dots use CanvasText; checked by screenshot at 1366 px, all visible.

## Checks run (2026-11-18, ~10:00 UTC)
- No horizontal scroll: /, /plans/, /different/, /how-it-works/, /partners/, /context/, /research/, /use-with-ai/, /behind-the-scenes/, /404.html, /d/ and the five designs, at 390 and 1366 px, light and dark, forced colours off and on: none found.
- Picker, Playwright at 1366 and 390 px on /: chip `href="/d/"`, `aria-haspopup="dialog"` and `aria-controls="designs"` present after the script; Enter on the chip opens the dialog with focus on Close; 12 presses of Tab stay inside the dialog (cards, foot link, Close, wrapping); Esc closes and focus returns to the chip; click opens; a backdrop click closes and returns focus; Close closes.
- Screenshots (deviceScaleFactor 1): `main-home-1366.jpg` (full page), `main-home-390.jpg` (full page), `main-picker-1366.png` (dialog open).

## Gate output
- `node scripts/build.mjs`: "picker: chip, strip and dialog on 16 page(s)", "built _site/ (dev)".
- `node scripts/validate.mjs`: `OK`.
- `node scripts/leak-scan.mjs`: `FAILED (3)`: `package-lock.json` lines 18, 28 and 38, "long high-entropy string". These are the npm `integrity` sha512 hashes of the three public font packages, not secrets. I did not change the scanner or its allowlist (not in my scope, and a gate is never weakened by the developer). For the conductor: either a narrow allowlist entry `['package-lock.json', 'long high-entropy string', 'npm sha512 integrity hashes of public @fontsource packages']`, as the scanner's own rule allows (one path, one kind, with a reason), or drop the lockfile and rely on the exact pins in `package.json` (which C4 asks against).

## Open for round 5
- At 390 px the hero starts 262 px down (notice 106 px, strip 44 px, header two rows). Proposal section 5 item 2 applies.
- The ruler reserves 9.2rem per label level; with only five rows there is spare space above the 2024 label.
- Thumbnails must be retaken (`node scripts/shots.mjs`, then build) whenever a design changes.
