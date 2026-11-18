# Round 4 design proposal: SUSTAIN-NOBILITY

Author: designer.sustain-nobility@AgentiCCells.dinis, 2026-11-18 (~10:00 UTC). Status: proposal, for the reviewer's verdict in `team/rounds/4/review/DESIGN.md`.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

Read before writing: `CLAUDE.md`, `team/WORKFLOW.md`, `team/designer/ROLE.md` and `POLICY.md`, `team/rounds/4.md`, `team/rounds/2/design/PROPOSAL.md`, `team/rounds/3/review/LIVE.md`, `data/copy.json`, `src/style.css`, `scripts/designs.mjs`, `scripts/validate.mjs`.
Material (studied, nothing copied): https://gabriel-dacruz.agenticcells.site (/, /d/, /d/score/, /d/signal/, the Designs dialog) and https://marc-noah.agenticcells.site (/, /d/poster/, the Designs dialog), read 2026-11-18 with Playwright, Chromium, deviceScaleFactor 1. Ours: https://sustain-nobility.agenticcells.site live v0.1.16 (/, /plans/, /d/ and the five designs) at 1366 and 390 px. Screenshots are in the session scratchpad only.
Mock-up: `team/rounds/4/design/hero-main.svg` (main hero at 1366 px; system fonts stand in for the proposed ones).

This proposal adds no fact. Wording it suggests is marked **(proposal for the writer)**. Every number below is measured on the live pages on 2026-11-18 unless marked otherwise.

## 0. Critique: why ours looks weaker than the model

What the model does (measured):
- **One loud idea per first screen.** Gabriel's home H1 is 134 px Didot at weight 400 on a near-black ground; Marc's is 109 px at weight 800. Ours is 61 px. The model's hero takes the whole first screen; ours shares it with a pull quote, two body paragraphs, a label and a note.
- **Imagery carries the page.** Gabriel has 34 images, Marc 32. Ours has 0 images and 4 SVGs. We may not use their photos, so our "image" has to be drawn, and today nothing is drawn in the hero at all.
- **Each design is a different object.** The Score is a cream page with stave lines through the title; The Signal Chain is a dark rack with patch-point buttons; Tour Poster is a screen print. Each is recognisable from a 300 px thumbnail.
- **The picker.** A "Designs" chip in the header opens `<dialog id="designs" class="picker">` (992 px wide, 14 px radius, 3x2 grid of 16:10 screenshots, bold name plus a 2 to 3 word idea, Esc closes and focus returns to the chip). Gabriel also has a 36 px top strip "Same facts, six designs: Premiere The Studio ..." with the current one marked. Marc's dialog lists cards as rows at 390 px with a "Showing" tag on the current one.

What is wrong with ours, specifically:
1. **Document, not a site.** The home page is 9,321 px of one centred column of headings, labels and paragraphs. Sections are separated by a 1 px rule and identical white space; nothing changes scale, colour or width between sections, so there is no rhythm.
2. **Timid hero.** 61 px serif headline, then a 21 px quote, a 13 px "AgentiCCells's summary" label, a paragraph, two buttons and a note. Six things compete. The right half is a small pull quote in 18 px.
3. **Small type contrast.** H2s are 31 px against 17 px body: a ratio under 2. The model's section heads are 48 to 64 px.
4. **Repetitive cards.** Assess/Identify/Generate, Who it is for, Plans and the flow's text twin are all the same white box with a 1 px border and 12 px radius. The label "AgentiCCells's summary" appears on every card in a row (three times in one band).
5. **The two good figures are small and plain.** The flow is five 40 px circles and arrows with the same steps repeated below as five more boxes. The six-area figure is six rounded rectangles round a green disc, drawn with the default UI font.
6. **Notice bar dominance.** A pale yellow (#fff3d1) 72 px band at 1366 and about 95 px at 390, the loudest colour on every page, above a header that wraps to three rows at 390 px (wordmark, button, then six nav links over two lines). The hero starts about 240 px down at 390 px.
7. **Generic fonts.** Iowan/Palatino/Georgia for headings and system-ui for text. Gabriel also uses system stacks, but sets them at a scale and weight that makes them look chosen; ours at 31 px weight 600 look like a default.
8. **"Designs" is missing from the header.** `copy.json` lists it in `nav.primary`, but the live header shows six links and no Designs; the five designs are reachable only from the footer and the About section.
9. **Plans page.** Four equal boxes with uneven heights (Advisory Services is mostly empty space), five small caps labels per card, and four outline buttons with wrapped text ("Start on sustain-\nnobility.com").
10. **The five designs look like one design re-skinned.** All five open with the same headline, then the same "(SUSTAIN-NOBILITY home page, read 2026-11-18)" citation line under it, then the same two lede paragraphs. Board Paper, Calendar and Counsel sit in a narrow left column at 1366 px with the right 40 to 50 percent empty. Dial is dense 13 to 15 px text in many small panels. Only Grid Poster (120 px Helvetica, square question mark) reads as intentional; at 390 px its opening quotation mark sits alone on its own line.
11. **The /d/ chooser** is three-column cards with abstract line drawings, not screenshots; a reader cannot see what a design looks like before choosing.

The fix is not more content: it is fewer, larger elements per screen, one drawn motif per design, real fonts, and calmer chrome.

## 1. Round 4, part 1: the Designs picker (every page, every design)

### 1.1 Header control
- In the header of every main page and every design: `<a class="chip" href="/d/" data-designs aria-haspopup="dialog">` with a 16 px four-square icon (inline SVG, `aria-hidden`) and the text "Designs". Without JavaScript it is an ordinary link to /d/.
- Main header order at 1366: wordmark, Proposal tag, nav, then right-aligned "Designs" chip and "Their site ↗". The chip replaces the "Designs" nav link in the header (fixes item 8); the footer link to /d/ stays.
- At 390 px the header is two rows: row 1 wordmark + Proposal tag + Designs chip (icon plus word) + "Their site ↗"; row 2 the nav as one horizontally scrollable line (`overflow-x:auto`, `scroll-snap`, fade mask at the right edge, links 44 px high). No JS menu.

### 1.2 Top strip "Same facts, six designs"
- A `<nav class="designs" aria-label="Designs of this proposal">` directly after the notice bar on every page: "Same facts, six designs:" (links to /d/) then six links: Main, Board Paper, Readiness Dial, Deadline Calendar, Grid Poster, Quiet Counsel. The current one has `aria-current="page"`, an underline and the design's accent colour.
- Height 32 px, 13 px text, one line; at 390 px it scrolls horizontally like the nav. Each design styles it in its own tokens.
- The same strip, as text, heads the dialog (1.3) so the dialog also says which design is showing.

### 1.3 The dialog
Markup, one copy at the end of `<body>` on every page, built by one shared function (proposal to the developer: `scripts/picker.mjs`, imported by `generate.mjs` and `designs.mjs`):
```html
<dialog id="designs" class="picker" aria-labelledby="designs-t">
  <div class="phead"><h2 id="designs-t">Same facts, six designs</h2>
    <button type="button" class="pclose" aria-label="Close designs">Close</button></div>
  <ul class="pick">
    <li><a href="/" aria-current="page"><img src="/assets/designs/main.jpg" width="1280" height="800" alt="" loading="lazy" decoding="async">
      <b>Main</b> <span class="now">Showing</span><span class="idea">green and gold, the default</span></a></li>
    ... five more, in copy.json order ...
  </ul>
  <p class="pfoot"><a href="/d/">All six designs on one page, with their concepts</a></p>
</dialog>
```
- No `<form method="dialog">` (the validator rejects any `<form>`); the close button is a plain button.
- Card text: `name` from `copy.json designs[]`, then a short `idea`. `copy.json` has only the long `line` today, so the writer adds `idea` to each design and to `designs_page.main_card` **(proposal for the writer)**: Main "green and gold, the default"; Board Paper "a paper for the board"; Readiness Dial "an empty dashboard"; Deadline Calendar "led by the sourced dates"; Grid Poster "a poster on a strict grid"; Quiet Counsel "a calm letter". The long `line` stays on /d/.
- `alt=""` on thumbnails: the link text names the design; the picture is decoration.
- Layout: width `min(94vw, 64rem)`, max-height 88vh with internal scroll, radius 14 px, 1 px border, `::backdrop` rgba(0,0,0,.72). Grid of three columns at 48rem and up, two from 30rem, and below 30rem one column of rows (thumbnail 42 percent left, text right), as Marc's dialog does at 390 px. Card: 1 px border, 10 px radius, thumbnail `aspect-ratio:16/10; object-fit:cover; object-position:top`, name 16 px bold, idea 13 px soft. Hover and focus: border in the design's accent, 3 px focus outline. The current card has the accent border and a "Showing" tag.
- `html:has(dialog[open]) { overflow:hidden }` stops the page scrolling behind it.
- Each design sets five custom properties the shared picker CSS reads (`--pk-bg --pk-ink --pk-soft --pk-line --pk-accent`), so the dialog matches the page it opens on, light and dark.

Script `/assets/picker.js` (first party, `defer`, about 1 KB, no dependencies):
- On click of `[data-designs]`: `preventDefault()`, remember the opener, `dialog.showModal()`. Focus goes to the close button (first focusable).
- Close button and a click on the backdrop (`event.target === dialog`) call `dialog.close()`. Esc is native.
- On the dialog's `close` event: `opener.focus()`.
- If `HTMLDialogElement` is missing, do nothing: the chip stays a link to /d/.
- Under `prefers-reduced-motion: no-preference` only, a 160 ms opacity and 8 px rise on open; none otherwise.

### 1.4 Thumbnails: `scripts/shots.mjs`
- Runs locally after `node scripts/build.mjs` (not in CI): starts a `node:http` static server on 127.0.0.1 over `_site/`, opens each of the six paths with Playwright Chromium, viewport 1280x800, deviceScaleFactor 1, `colorScheme:'light'`, `reducedMotion:'reduce'`, waits for `document.fonts.ready`, takes a viewport JPEG at quality 72 and writes `src/assets/designs/<slug>.jpg` (`main` for /). Served at `/assets/designs/<slug>.jpg`.
- Prints each file's size and exits non-zero if one is over 150 KB or a page has a horizontal scrollbar.
- Order in the round: build, shots, build again, commit the six JPGs with the change. Thumbnails show the notice bar; that is correct.
- Images in a closed dialog are not fetched (`loading="lazy"` inside `display:none`), so they cost nothing until the dialog opens.
- Proposal for the developer: a validator check that the six files exist and every `<img>` has width, height and alt. This adds a check; it weakens none.

### 1.5 /d/ chooser
Replace the line drawings with the same six screenshots, larger (two columns at 1366), each with name, idea, the long `line` and the `signature` from `copy.json`. Title "Six designs of the same proposal" and lede "Same facts, six designs. Pick one to see the whole page." **(proposal for the writer: Main now counts as one of the six)**.

## 2. Round 4, part 2: new art direction for the Main design, "Evidence Seal"

Idea: the company's question is about proof. The page is drawn as a seal: one ring of six equal segments (the six areas) around "One Readiness Check", set large in the hero and reused as the page's single motif. Deep green and brass, set in a contemporary serif at poster scale.

### 2.1 Fonts (self-hosted, SIL OFL 1.1, Latin subset, woff2, `font-display:swap`)
| Role | Package (pin 5.3.0) | Files copied to `/assets/fonts/` | Size |
|---|---|---|---|
| Display and headings | `@fontsource/fraunces` | `fraunces-latin-600-normal.woff2`, `fraunces-latin-400-italic.woff2` | 18.1 + 22.9 KB |
| Text and UI | `@fontsource/public-sans` | `public-sans-latin-400-normal.woff2`, `public-sans-latin-600-normal.woff2` | 14.6 + 14.6 KB |
| Labels, step numbers, dates | `@fontsource/ibm-plex-mono` | `ibm-plex-mono-latin-500-normal.woff2` | 14.9 KB |
Total 85 KB (sizes measured from the npm tarballs, 2026-11-18). Preload only Fraunces 600. Licence: copy each package's `LICENSE` to `/assets/fonts/LICENSES/<package>.txt` and record package, version and file list in README "Third-party material" **(proposal for the developer: `scripts/fonts.mjs` copies files from `node_modules`, so the source is reproducible)**. Fallbacks stay the current stacks, with a `size-adjust` fallback face on Georgia to limit layout shift.

### 2.2 Palette (contrast measured, WCAG 2.x)
| Token | Light | Dark | Use and contrast |
|---|---|---|---|
| `--paper` | #f4f1e8 | #0b1612 | page ground |
| `--surface` | #ffffff | #12211b | rare panels |
| `--ink` | #0f1f19 | #ede8dc | text: 15.1 and 15.1 |
| `--soft` | #4a5a52 | #b5b0a2 | secondary text: 6.5 and 8.5 |
| `--green` | #1f5c46 | #7fcfae | links: 6.9 and 10.1 |
| `--brass-text` | #7a5814 | #e0b860 | eyebrows on paper: 5.8 and 9.8 |
| `--deep` | #0e3b2e | #10241d | hero, flow, CTA bands |
| `--on-deep` | #f4f1e8 | #f4f1e8 | 11.0 and 14.4 |
| `--on-deep-soft` | #b9d3c6 | #b9d3c6 | 7.8 on #0e3b2e |
| `--brass` | #e0b860 | #e0b860 | seal strokes, primary button fill; #0e3b2e on it 6.7; as text on --deep 6.7 |
| `--notice-bg` | #0b1612 | #050a08 | notice bar; --on-deep text on it above 15 |

### 2.3 Chrome
- **Notice bar, calmer, still first and permanent:** full width, ground `--notice-bg`, 13 px Public Sans in `--on-deep`, first sentence in 600 weight, link underlined in `--brass`. Exact sentence from `copy.json notice` and `notice_link`, unchanged, no close control. Height: 44 px at 1366 (one line at 1366 is tight; two lines allowed up to 60 px), about 76 px at 390 (four lines). Calmer because it is dark chrome, not the brightest colour on the page; it stays visible, labelled "Proposal notice", first after the skip link.
- Then the designs strip (1.2), then the header (1.1) on `--deep` on the home page and on `--paper` with a 1 px rule on inner pages.

### 2.4 Home, section by section (see `hero-main.svg`)
1. **Hero, `--deep`, at least 100vh minus chrome at 1366.** 12-column grid. Columns 1 to 7: eyebrow "AI GOVERNANCE READINESS CHECK" (Plex Mono 14 px, 0.2em tracking, brass); the headline in Fraunces 600 at `clamp(2.75rem, 6.4vw, 5.5rem)`, line-height 1.02, max 13ch, the last word "accountable?" in Fraunces italic brass (the words are theirs and unchanged; only colour and style change: see check list); the first lede quote at 20 px; one primary button (brass fill) "Start the Readiness Check on sustain-nobility.com ↗" and one secondary text link "Book a strategy call on sustain-nobility.com ↗". The second lede paragraph and `buttons_note` move to the band below. Columns 8 to 12: **the seal**, inline SVG 480 px: six annular segments of 56 degrees with 4 degree gaps, brass 2 px strokes, no fill, numbered 01 to 06 in Plex Mono; inner disc `--deep` darker with "One Readiness Check" in Fraunces and "Six areas" in Plex Mono; a dotted outer ring. Under it a two-column numbered legend of the six area names in HTML (real text, exact names). `role="img"` with title "Six areas, one Readiness Check" and a desc listing the six names; no segment highlighted. At 390 px the seal (280 px) follows the buttons and the legend becomes one column.
2. **The question has changed, `--paper`.** The c7 quote alone, Fraunces 400 italic at `clamp(1.75rem, 3.6vw, 3rem)`, full width, max 24ch per line, with its citation as a superscript note. "Are you using AI?" in `--soft`, "Can you prove it is governed responsibly?" in `--ink` (colour only, words unchanged). Then the second lede paragraph ("AgentiCCells's summary") and `buttons_note` at 17 px.
3. **Assess, Identify, Generate.** No boxes. Three columns, each topped by a 2 px brass rule and a Plex Mono number; the tag set as a word in Fraunces 600 at 56 px ("Assess"), the title at 20 px, the text at 17 px. One "AgentiCCells's summary" label for the band, not one per column **(proposal for the writer: a group label; each item keeps its fact ids)**. At 390 px the three stack with 48 px between.
4. **How the check runs, `--deep` band, full bleed.** The flow redrawn as an HTML grid with an SVG track behind it: five step numerals in Fraunces at 72 px on one horizontal brass line, step name (20 px) and published words (quoted, 15 px) beneath; the return arc above the track from 5 back to 1, labelled "When strategy changes, run again"; below the track two brackets, "Essentials: steps 1 to 3" and "Professional: adds step 4", drawn as thin brass brackets. Real text, so the separate list of five boxes is dropped from the home page (it stays on /how-it-works/). At 390 px the track turns vertical on the left with the numerals at 48 px.
5. **Who it is for.** Two halves, edge to edge on `--paper`, divided by a 1 px rule: a 96 px brass opening quotation mark (decorative, `aria-hidden`), the audience name as a Plex Mono label, their quote at 24 px Fraunces, the link below.
6. **Six areas.** A 3x2 grid of area tiles without borders: each tile has a 64 px copy of the seal with its own segment filled brass and the rest outlined, its number, the name in Fraunces 24 px and the text at 16 px. Every tile fills exactly one segment, so no area is favoured. The c5 quote sits above as the section's lead at 22 px.
7. **Plans: "a ledger".** One table-like block, not four cards: four columns using CSS subgrid so the rows align across plans: Their label, Who it is for (quote), What you get (list, `includes` exactly), Price (exact `price` text), How to start (one text link per plan with the arrow, no wrapped boxed buttons). Column heads are plan names in Fraunces 28 px; empty cells show a 1 px dash rule, not blank space. No plan highlighted. At 390 px each plan becomes a block with the same row labels. The Professional note keeps its "AgentiCCells's note" label.
8. **Why now.** At 1366 a horizontal ruler from the earliest to the latest date in `research.json` (years as 48 px Fraunces numerals along the bottom, each sourced date a brass tick with its label above, a "Read 2026-11-18" marker in `--soft`); positions computed from the ISO dates. At 390 the existing vertical list, larger. "This is not legal advice." stays under it.
9. **Who is behind it, About this proposal, Proposals box:** two columns at 1366 (founder left, about right), Proposals in its dashed box full width below. Unchanged words.
10. **CTA band, `--deep`.** The headline repeated at 40 px Fraunces, the primary brass button, `actions.note` in `--on-deep-soft`.
11. **Footer** on `--notice-bg` with three columns as now.

Rhythm: section padding 96 px at 1366 and 56 px at 390; the page alternates paper, deep, paper, deep, paper so each band reads as a new scene. Type scale 1.333: 17 / 22 / 30 / 40 / 56 / 88 px.

### 2.5 Inner pages
Page hero on `--paper`: eyebrow, H1 in Fraunces 600 at `clamp(2.5rem, 5vw, 4.5rem)`, a 120 px seal glyph at the right (the segment for /different/ none, flow glyph on /how-it-works/). /plans/ uses the ledger (2.4.7) at full width; /how-it-works/ uses the redrawn flow plus the step list; /different/ uses the area tiles at 2 columns with longer text.

## 3. Round 4, part 3: the five designs, each finished in its own way

Shared fixes for all five: (a) remove the "(SUSTAIN-NOBILITY home page, read 2026-11-18)" line under every headline and use a superscript note linking to the Sources list, which keeps title and read date (as the main site already does); (b) every design gets the chip, strip and dialog in its own tokens; (c) at 1366 px no design leaves half the screen empty unless that emptiness is the concept (Counsel); (d) the opening quotation mark hangs outside the text block (`text-indent:-.45em`) so it never sits alone on a line; (e) each design's signature visual moves into its first screen.

| Design | Fonts (@fontsource, Latin, files) | Weight |
|---|---|---|
| Board Paper | `source-serif-4` 400, 400 italic, 700; `ibm-plex-mono` 400 | 82 KB |
| Readiness Dial | `ibm-plex-sans-condensed` 500, 700; `ibm-plex-mono` 400, 600 | 70 KB |
| Deadline Calendar | `newsreader` 400, 600, 400 italic; `ibm-plex-mono` 500 | 85 KB |
| Grid Poster | `archivo` 800, 500; `ibm-plex-mono` 500 | 44 KB |
| Quiet Counsel | `eb-garamond` 400, 400 italic, 600; `public-sans` 400 | about 90 KB (est.) |

**Board Paper** (a paper for a board meeting). Now: a narrow sheet in the left half, system mono everywhere. Upgrade: the sheet becomes a true A4 proportion (max 820 px) centred on a darker "desk" ground with a soft shadow, and a 240 px right margin where the source notes sit level with their paragraph (CSS grid `grid-template-columns: 1fr 15rem`). Header block like a real board paper: "Paper: AI governance readiness" left, a ruled meta table right (Prepared by, Status "Proposal"). Signature: the ruled summary box enlarged to the full sheet width with Question / Options / Evidence / Next step in Plex Mono small caps and the answers in Source Serif 20 px. Paragraph numbers 1.1, 1.2 hang in the left margin. Fix N2 from round 3 (price cell text exactly as copy.json). At 390: margin notes fold under each paragraph in a 14 px soft block.

**Readiness Dial** (an empty dashboard). Now: light grey, many small panels, the dial lower down. Upgrade: dark instrument-panel default (light variant kept), a 12-column dashboard. First screen: the empty six-segment dial at 440 px left (dashed outline segments, tick marks every 10 degrees, area numbers on the rim, centre reading "This page assesses nothing." from `design_text.dial`), headline at right in Plex Sans Condensed 700 at 56 px, then three "readout" tiles for Assess / Identify / Generate with empty bars. Panels get one consistent 1 px border, 8 px radius, a Plex Mono channel label ("01 AREAS", "02 FLOW", "03 PLANS"). Plans as four instrument cards with the same row order as the main ledger. Fix N1 (two headings named alike).

**Deadline Calendar** (led by the sourced dates). Now: a left column with a small spine box. Upgrade: the first screen is the date spine as a full-width horizontal year ruler (2024 to 2028 from research.json, years in Newsreader 600 at 120 px, outlined in `--rule`), each sourced date a tick with its label; the headline sits under it at 64 px. Then a two-column editorial body: a sticky vertical spine (dates in Plex Mono) on the left, the story on the right. At 390 the ruler scrolls horizontally inside a labelled region (already has `scroller_label`) with the list twin below. Fix F11 (visible flow figure named, not `aria-hidden`).

**Grid Poster** (a poster on a strict grid). Already the strongest. Upgrade: Archivo 800 replaces Helvetica so the poster looks the same on every system; the 12-column grid lines become visible hairlines across the whole page; the six-square question mark grows to the full height of the headline block and gets its red dot; every section opens with a giant numeral (Archivo 800, 160 px, outlined) bleeding off the left edge; the red CTA band runs edge to edge. At 390: the headline at 52 px with the hanging quotation mark (fixes the lone mark) and the question mark above it at 120 px.

**Quiet Counsel** (a calm letter, one idea per screen). Now: small centred text, much blank space, reads unfinished rather than calm. Upgrade: EB Garamond at 22 px body and 48 px headings, a 34rem measure centred, each section at least 80vh with its idea in the vertical centre; their words as pull quotes at 36 px italic with a sage rule. Signature: the one continuous line, now a single SVG path drawn down the left margin of the whole page (absolutely positioned, `aria-hidden`, the figure's text kept in the steps list), looping once around each of the five steps' numerals as it passes. A letter opening ("AI governance readiness, a proposal") and a sign-off block "Made by AgentiCCells with their agreement" set like a signature line. No animation.

## 4. Budgets and rules for the build
- Fonts per page at most 3 families and under 100 KB in every case above (limit 250 KB). Thumbnails at most 150 KB each, loaded only when the dialog opens. picker.js about 1 KB. No third-party request.
- Notice bar first on every page and in every design, exact sentence, not dismissible.
- Plans and areas exactly as copy.json; no prices, scores or invented numbers; no plan or area highlighted.
- AA contrast in light and dark for every pair used (table 2.2 for main; each design keeps or re-checks its own tokens).
- 390 and 1366 px without horizontal page scroll (the strip, nav and Calendar ruler scroll inside their own regions).
- `prefers-reduced-motion: reduce` removes the dialog transition and any smooth scrolling.

## 5. Round 5 (next): what to refine after the round 4 live review
Likely weak spots to recheck and polish:
1. Hero balance at 1280 to 1440 px: does the 88 px headline crowd the seal, and does the hero still fit the first screen with the notice and strip above it? Tune the clamp.
2. Chrome height at 390 px (notice plus strip plus two header rows): if the hero starts below about 230 px, merge the strip into the dialog only at small widths.
3. Notice bar at 1366: one or two lines; check it does not look like an error banner in either theme.
4. Thumbnails: legible at 300 px wide? Retake at a crop that shows the signature visual if not; check they are current after every design change.
5. Dialog at 390 px: card rows, scroll inside the dialog, focus order, VoiceOver and NVDA reading of names and "Showing".
6. Font loading: layout shift on slow 3G, fallback metrics, total bytes per page.
7. Seal and flow in dark mode and in forced-colours mode (Windows high contrast): strokes must stay visible (`currentColor`).
8. Ledger subgrid in Safari and Firefox; the 390 px fallback.
9. Each design's first screen against its thumbnail: does each read as a different object at a glance? If two look alike, push the weaker one further.
10. Copy density: with larger type, any section that now needs scrolling to see one idea should lose words (writer), not shrink type.

## 6. What the reviewer should check
- Notice: first after the skip link on every page and design, exact `copy.json` sentence, not dismissible, AA contrast in both themes.
- Designs chip in every header (the nine main pages, /d/, the five designs and the 404); with JS off it goes to /d/; with JS on it opens the dialog; Esc and the close button close it; focus returns to the chip; Tab stays inside while open.
- Dialog shows six cards (Main plus five) with screenshot, name and idea; the current one marked "Showing" and `aria-current`; names match `copy.json`.
- Strip "Same facts, six designs:" on every page with the current design marked.
- Six thumbnails exist at /assets/designs/, 1280x800, each under 150 KB, and match the live designs.
- Fonts only from the listed @fontsource packages, served from /assets/fonts/, licences recorded; at most 3 families per page; no external font or script request.
- Headline: their words unchanged; decide whether colouring and italicising "accountable?" is acceptable emphasis of a quote (if not, set it in one colour).
- Plans and areas exactly as copy.json; "No price published on their site." where it applies; no highlighted plan or area; no numbers without a source.
- The seal and area tiles: six equal segments, none favoured; figures have names and descriptions; text twins present where the figure carries content.
- 390 and 1366 px, light and dark: no horizontal page scroll, hero visible in the first screen, tap targets at least 44 px.
- Reduced motion: no transition. No em dash, no hype words, no `<form>`.
