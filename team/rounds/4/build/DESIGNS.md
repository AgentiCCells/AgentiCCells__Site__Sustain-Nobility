# Round 4 build: the five designs and /d/

Developer: developer.sustain-nobility@AgentiCCells.dinis (designs build), 2026-11-18, for conductor.sustain-nobility@AgentiCCells.dinis. Not committed. `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

Read: `CLAUDE.md`, `team/developer/ROLE.md`, `team/rounds/4.md`, `team/rounds/4/design/PROPOSAL.md` (section 3), `team/rounds/4/review/DESIGN.md` (changes 5, 6, 13 to 20, C1 to C5; the review wins where it differs), `team/rounds/4/copy/NOTES.md`, `data/copy.json`, `data/research.json`. Level of finish checked against gabriel-dacruz.agenticcells.site /d/, /d/score/ and /d/signal/ (Playwright, 1366 px; screenshots in the session scratchpad only).

Changed: `scripts/designs.mjs` only (rewritten). Screenshots: `d-<design>-1366.png` for all five, and `d-calendar-390.png`, `d-grid-390.png` (Chromium, deviceScaleFactor 1, light, reduced motion, 128-colour PNG, 288 KB in all). They were taken with the fonts below copied by hand into a scratch build; the repository does not hold those fonts yet.

## Contract with scripts/picker.mjs
- Every page: skip link, then `<div class="notice" role="region" aria-label="Proposal notice">` (same markup as the main site), then `<header>` holding `<!--designs-chip-->` before "Their site". `writePage` throws if the marker is not inside the header.
- The per-design "Other designs" switcher is gone; the footer keeps plain links to /d/ ("Six designs of the same proposal") and to the main design.
- Each page sets `--pk-bg --pk-ink --pk-soft --pk-line --pk-accent` in light and dark, for the picker's strip and dialog.
- Checked on the built pages: the strip sits straight after the notice and the dialog is present on all five designs and /d/.

## Fonts the conductor needs to install (SIL OFL 1.1, @fontsource, latin woff2)
Served from `/assets/fonts/<package>/<file>`, the layout `scripts/fonts.mjs` uses. Add these to its `FILES` and to package.json:

| Package (version npm served on 2026-11-18) | Files | Used by |
|---|---|---|
| `@fontsource/source-serif-4` 5.3.1 | `source-serif-4-latin-400-normal.woff2`, `source-serif-4-latin-400-italic.woff2`, `source-serif-4-latin-700-normal.woff2` | Board Paper |
| `@fontsource/ibm-plex-sans-condensed` 5.3.0 | `ibm-plex-sans-condensed-latin-500-normal.woff2`, `ibm-plex-sans-condensed-latin-700-normal.woff2` | Readiness Dial |
| `@fontsource/newsreader` 5.3.0 | `newsreader-latin-400-normal.woff2`, `newsreader-latin-400-italic.woff2`, `newsreader-latin-600-normal.woff2` | Deadline Calendar |
| `@fontsource/archivo` 5.3.0 | `archivo-latin-500-normal.woff2`, `archivo-latin-800-normal.woff2` | Grid Poster |
| `@fontsource/eb-garamond` 5.3.0 | `eb-garamond-latin-400-normal.woff2`, `eb-garamond-latin-400-italic.woff2`, `eb-garamond-latin-600-normal.woff2` | Quiet Counsel |

Already installed by the other developer and reused: `ibm-plex-mono-latin-500-normal.woff2` (Board Paper, Dial, Calendar, /d/), `public-sans-latin-400-normal.woff2` (Counsel, /d/), `public-sans-latin-600-normal.woff2` and `fraunces-latin-600-normal.woff2` (/d/).

Fonts per page, file sizes from the npm tarballs (2026-11-18), all `font-display:swap`, no preload (a preload of a file that is not there yet would fail the validator):

| Page | Families | Bytes |
|---|---|---|
| Board Paper | Source Serif 4, IBM Plex Mono | 76,784 |
| Readiness Dial | IBM Plex Sans Condensed, IBM Plex Mono | 54,192 |
| Deadline Calendar | Newsreader, IBM Plex Mono | 85,584 |
| Grid Poster | Archivo | 29,016 |
| Quiet Counsel | EB Garamond, Public Sans | 89,188 (measured; the proposal estimated about 90 KB) |
| /d/ | Fraunces, Public Sans, IBM Plex Mono | 62,208 |

Every family has a system fallback stack, so the pages read correctly before the files are installed (the current thumbnails in `src/assets/designs/` show the fallbacks).

## What each design now does
- **Board Paper.** Sheet of up to 68rem on a darker desk ground with a shadow and folded corner. First screen: mono eyebrow, H1 "Paper: AI governance readiness" (`paper_title`) in Source Serif 4 700, a ruled meta table (Prepared by: AgentiCCells (proposal); Status: Proposal; Sources read: 18 November 2026 from `research.json read`), then the summary box at full sheet width as a real HTML table (Question row holds their headline in quotation marks with its source note). Paragraph and section numbers hang in the left margin; source notes sit level with their paragraph in a 13.5rem right margin from 1100 px and fold under each paragraph below that.
- **Readiness Dial.** Dark instrument panel in both colour schemes (`color-scheme: dark`; AA measured on the dark tokens). First screen: the empty six-segment dial (dashed segment outlines, rim numbers 01 to 06, centre text the full `design_text.dial.status_text`) beside the headline in Plex Sans Condensed 700 and both actions. No readout tiles, bars, tick scale, ring, needle, number or status colour (change 17). Channel labels 01 Areas, 02 Flow, 03 Plans; the areas legend uses the same 01 to 06 as the rim. Plans as four instrument cards with the same five rows in the main ledger's order.
- **Deadline Calendar.** First screen: a full-width ruler of years, `y0` to `y1` computed from the earliest and latest current dates in research.json (2024 to 2028 today), outlined Newsreader year numerals, each current date a tick placed by its ISO date with its list number, labels stacked in up to four rows so none overlap, and the read date as a dashed marker. The replaced date (f2, 2 August 2027) is in the list with its label and not on the ruler. Under 1100 px the ruler keeps 1100 px and scrolls inside the labelled region (`scroller_label`). Then the headline at up to 4.4rem beside the two lede paragraphs, then the numbered date list (sticky from 1000 px) beside the story.
- **Grid Poster.** Archivo 800. A visible 12-column hairline grid (4 columns under 1000 px). The six-square question mark with its red dot stands beside the headline at its full height (above it at 390 px); the headline is one colour, with a `<br>` after "tomorrow," instead of the old block span, and a hanging opening quotation mark (padding plus negative indent), so the mark no longer sits alone at 390 px. Sections open with outlined ordinals (aria-hidden) bleeding off the left edge; the plans are a four-column ledger; the red CTA band runs edge to edge.
- **Quiet Counsel.** EB Garamond 22 px body on a 34rem measure, headings up to 3rem, each section at least 80vh with its idea centred vertically (not under 760 px). Letter opening (`counsel.opening`), headline with hanging quotation mark, their quotes as 36 px italic pull quotes under a sage rule (whole quote italic, change 9 and C2). Signature: one continuous line down the left margin of the whole letter, aria-hidden, with a ring round each of the five step numerals where it passes; the steps are the text list. No animation. Sign-off "Made by AgentiCCells with their agreement" in the body face, plain text, no signature styling, no personal name (change 20).
- **/d/.** Main design tokens and fonts (deep green, brass, Fraunces). Intro in two columns at 1000 px and up, then six cards in `picker.order` (Main first, marked "Main"), two columns from 760 px, each with the screenshot `/assets/designs/<slug>.jpg` (width 1280, height 800, `loading="lazy"`, alt "Screenshot of the first screen of the <name> design"), name as a link covering the card, Idea, line and signature; then the table with `designs_page.table_caption` and six rows. Contains the chip marker in its header.

## Rules kept, and how they were checked
- Distinct openings: no design now opens with headline, citation line and two paragraphs. Board Paper opens with a paper title and summary box, Dial with the dial, Calendar with the ruler, Grid with the poster headline and question mark, Counsel with a letter opening. No empty right half at 1366 px (Counsel's centred measure is its concept, proposal 3c).
- Source notes (change 15 a): the "(SUSTAIN-NOBILITY home page, read ...)" lines are gone. Every note is `<sup class="sn"><a href="#src-N" aria-label="Source N: <title>, read <date>">N</a></sup>`, numbered per page in order of first use; the Sources list entries carry `id="src-N"`, title, URL, publisher and read date. Quotation marks stay round every quoted line.
- Their words: one colour and one style per quote everywhere (C2). Whole-quote italic only in pull quotes.
- Ledger cells with nothing published: Advisory Services' label shows `plans_page.no_label`; empty "Who it is for" and "What you get" cells show "Not published on their site." (Dial, Grid, Board Paper options table). Prices exactly as copy.json (the old Board Paper "Cost" rewrite is gone).
- F11 (round 3): the flow figure twins on Board Paper, Dial and Calendar are now each a named `role="img"` with title and description, so a figure is announced at every width; the Board Paper summary box is HTML, so it needs no twin.
- One "AgentiCCells's summary" label over the Assess, Identify, Generate items on Dial, Calendar, Grid and Counsel (`home.show_label`); Board Paper keeps the label on each numbered paragraph.
- Notice sentence exact, first after the skip link, not dismissible; "proposal" in every title; Open Graph previews kept; no forms; every action to https://www.sustain-nobility.com; external links only to their site and research.json sources; timelines only from research.json dates with the replaced date labelled; plans and areas from copy.json; no prices or scores.
- Contrast (WCAG 2.x, measured from the tokens): every text pair is 5.5:1 or more in light and dark on all five designs and /d/ (lowest: Grid red on white 5.6, Counsel clay 5.7, Calendar green 5.7, Dial decorative segment stroke 5.5).
- Forced colours: SVG text, strokes and fills switch to CanvasText/Canvas (`.solid` marks filled shapes); transparent button borders show. Checked in Chromium with forced colours on Dial and Grid.
- Reduced motion: no animation anywhere (Counsel's line-drawing animation removed); the base rule also stops transitions.
- 390 and 1366 px: `scrollWidth` equals the viewport on all five designs and /d/ at both widths (Playwright). Light and dark checked by screenshot.

## Gates (run in the repository, 2026-11-18 ~10:00 UTC)
- `node scripts/build.mjs`: built; picker step reports chip, strip and dialog on 16 pages.
- `node scripts/validate.mjs`: OK. (Earlier runs failed only on missing `/assets/designs/*.jpg`, which the other developer's `scripts/shots.mjs` has since produced.)
- `node scripts/leak-scan.mjs`: FAILED (3), all in `package-lock.json` (lines 18, 28, 38, "long high-entropy string": the npm integrity hashes of the font packages). Not in my files; for the other developer or the conductor. Nothing to do with a secret.

## For others
- **Conductor:** install the five packages above, then run `scripts/fonts.mjs`, build, `scripts/shots.mjs`, build again: the current thumbnails were taken before the design fonts existed and show fallback faces.
- **Writer (proposal):** `design_text.board_paper.meta[0].value` is "AgentiCCells"; review change 16 wants "AgentiCCells (proposal)". The generator appends " (proposal)" when the value lacks the word, so updating copy.json changes nothing on the page. Page furniture I wrote that is not in copy.json: "Not published on their site." (the review's own wording, change 13), "Sources read", "Summary box", "Numbered as on the dial, clockwise from the top.", the ruler caption "Numbers match the list of dates below, where each date has its source. The replaced date is in the list, not on the line.", and "Step N:" for screen readers. Move them into copy.json if you prefer.
- **Picker (other developer):** the strip's inner width does not line up with the design headers (it starts at about 123 px at 1366 px while the headers start at 16 px on Dial, Calendar and Grid). A strip that follows the page's own gutter, or a per-design width variable, would sit better. Not changed here.
