# Round 2 build: the five designs and the chooser

Builder: developer.sustain-nobility@AgentiCCells.dinis (designs build), 2026-11-18, a sub-agent of conductor.sustain-nobility@AgentiCCells.dinis. Not committed. `board/HOLD.md`: absent.

Files written: `scripts/designs.mjs` (Node built-ins only; runs on import from `scripts/build.mjs` after `generate.mjs`), this file, and the screenshots `team/rounds/2/build/d-*.png`. Nothing else was changed.

Read before building: `CLAUDE.md`, `team/WORKFLOW.md`, `team/developer/ROLE.md`, `team/rounds/2/design/PROPOSAL.md` (section 3), `team/rounds/2/review/DESIGN.md` (G1 to G8, changes 19 to 25), `data/copy.json`, `team/rounds/2/copy/NOTES.md`, `data/research.json`, the build, generate and validate scripts. As material only: https://marc-noah.agenticcells.site/d/ (chooser layout), read 2026-11-18.

## What the generator writes

| Path | What it is |
|---|---|
| `_site/d/index.html` | Chooser: five cards (inline SVG thumbnail, `aria-hidden`; name as a text link; line and signature from `copy.json` `designs`; palette strip), a sixth card for the main design (`/`), and a comparison table. |
| `_site/d/board-paper/` | Board Paper |
| `_site/d/dial/` | Readiness Dial |
| `_site/d/calendar/` | Deadline Calendar |
| `_site/d/grid/` | Grid Poster |
| `_site/d/counsel/` | Quiet Counsel |

Every page: `lang="en-GB"`; `<title>` with "proposal"; meta description; canonical `https://sustain-nobility.agenticcells.site/d/<slug>/`; og:title, og:description, og:url, og:type, og:site_name, og:image `/og.png` (absolute); `twitter:card` summary_large_image; favicon `/favicon.svg`; skip link; then `<div class="notice" role="region" aria-label="Proposal notice">` with `copy.json` `notice_short` (both required sentences, word for word) and the link to https://www.sustain-nobility.com; one h1; header with the text wordmark, a visible "Proposal" tag and "Their site ↗"; footer with company name, jurisdiction, registered office and its source line, the G1 sentence, licences, version and the "Other designs" row (the other designs, the chooser, the main design). Inline `<style>` only: no scripts, no third-party fonts or stylesheets, no forms, inputs, mailto or booking links. Every action goes to https://www.sustain-nobility.com with visually hidden "(opens their site)". All data is HTML-escaped (`&`, `<`, `>`, `"`; apostrophes are left as text so the G1 sentence matches byte for byte).

Each design shows the same facts from `copy.json`: eyebrow and headline question (quote, c1), lede (quote c2 and our labelled summary), three things you can show, the five-step flow with the published wording per step, the six areas with the "only one of these dimensions" quote (c5), the four plans exactly as `copy.json` (no prices, no featured plan, Advisory Services with no label), the partner case (quotes c4, c8, partner types, "Illustration" figure), the regulatory timeline, the founder block as `copy.json` gives it (name, title, the "Founded by" quote, two About Us quotes, "Named with their agreement."), a closing CTA, a Sources list of every fact the page cites, and the footer. Every `ours` item carries its label.

## Timelines (G6)

Rows come only from the `dates` arrays of the facts listed in `copy.json` `context.timeline_fact_ids` (f1, f2, f4, f5, f6, f7, f14): 14 rows, sorted by date, each with the source publisher, title, link and read date. No date is typed in the generator. A row whose `what` says it is an "original staged date" (f2, Article 6(1), 2 August 2027) is shown with "(original date, replaced by Regulation (EU) 2026/1744)" and is never drawn in a figure; the current dates for those rules are the f6 rows. "This is not legal advice." sits under every timeline. If no dated fact exists, the section is omitted.

## The five designs

| Design | Palette (light / dark) | Type | Layout | Signature SVG | Review conditions met |
|---|---|---|---|---|---|
| Board Paper | paper #fbfaf6, ink #1b1b1b, oxblood #7a2430 / #161514, #e9e5dc, rose #e8a0a8 | Charter serif; mono paragraph numbers and margin notes | A4-like sheet on a desk colour; numbered sections 1 to 8, Annex A (dates), B (sources); source notes in a 12rem right margin from 1100 px, under the paragraph below that | Ruled summary box (Question, Options, Evidence, Next step), labelled "AgentiCCells's summary"; fold mark; swimlane flow with plan brackets | No crest, marking or government style. Options table and "Recommended next step" carry "(our proposal, not their advice)". Cost: "No price published (read 2026-11-18)" or "To be discussed". Notes are in their own grid column, so they cannot overlap text. |
| Readiness Dial | #f3f5f7 / panel #fff, teal #0b6e69, amber #8a5200 / #0b1218, #121c24, #4fd1c5, #f0b45a | system-ui, mono uppercase panel labels | 12-column panel grid; one column at 390 px | Six empty outlined segments, centre "Their check produces a Governance Score. This page shows none.", caption "Illustration of the output's shape. No score is shown or implied." | One stroke colour, no fill, number, needle or colour scale. All five step panels always visible (no JS, no `<details>`). Status panel says the page assesses nothing; no input-like panels. |
| Deadline Calendar | newsprint #f6f3ec, blue #1d3f73, green #2f6b3a / #121417, #8fb3ec, #8fd19a | Palatino-style serif headlines to 4rem; system-ui body; mono dates | Two columns from 1000 px with a sticky date spine; at 390 px the spine is a horizontal scroller inside its own box (page never scrolls sideways) | Date spine drawn only from current sourced dates, with [n] numbers that match the list, and a "Read 2026-11-18" marker | Scroller: `role="region"`, `tabindex="0"`, `aria-label="Dates from the sources, scrollable"`, 3px focus ring (checked in Playwright). "The same dates as a list" sits in the story. CTA is "Start on sustain-nobility.com ↗" with `calendar_cta.text`; no deadline wording. |
| Grid Poster | #fff, #111, red #c42d1a / #111, #f2f2f2, red #ff6b55, band #b3261e | Helvetica Neue stack, h1 clamp(2.6rem, 9vw, 7.5rem), weight 800 | Decorative 12-column grid lines from 1000 px; numbered panels 02 to 09; full-bleed red CTA band | Question mark from six squares and one red dot | No text inside the SVG (area names are in its desc and in the blocks). Headline break after "tomorrow," by CSS below 600 px only, no `<br>`. The c5 point is quoted verbatim with its link. All text pairs pass AA (table below). |
| Quiet Counsel | stone #f4f1ea, sage #46634f, clay #94532f / #1a1c19, #a7c4b1, #e0a483 | Iowan/Palatino serif only, 19px, small caps labels, h1 regular weight | 36rem centred column, sage rule separators; pull quotes hung in the left margin from 1200 px | One continuous loop through five numbered circles; hexagon outline for the six areas | Loop is fully drawn by default; the draw runs only under `prefers-reduced-motion: no-preference`. Pull quotes are verbatim with link and read date. |

Figures: every meaningful SVG has `role="img"` with `<title>` and `<desc>` and a text twin in the DOM. Wide flow figures (and the Board Paper summary box) have a narrow twin shown under 600 px so SVG text stays at about 14px or more; the narrow twin is `aria-hidden` and the hidden one is `display:none`, so no name is announced twice. Focus: `:focus-visible` 3px ring in each design's accent, 2px offset. Tap targets: buttons, header links and the designs row are at least 44px tall. Motion: only the Counsel loop; a global `prefers-reduced-motion: reduce` rule also stops animations.

## Contrast pairs measured (WCAG 2.x formula, script in the session scratchpad)

| Design and theme | Pair | Ratio | Needs | Result |
|---|---|---|---|---|
| board-paper light | ink #1b1b1b on paper #fbfaf6 | 16.49 | 4.5 | pass |
| board-paper light | soft #55504a on paper #fbfaf6 | 7.64 | 4.5 | pass |
| board-paper light | accent/link #7a2430 on paper #fbfaf6 | 9.47 | 4.5 | pass |
| board-paper light | ink #1b1b1b on desk #ece9e1 | 14.20 | 4.5 | pass |
| board-paper light | accent (Their site) #7a2430 on desk #ece9e1 | 8.16 | 4.5 | pass |
| board-paper light | rule (h2 rule, non-text) #8f877a on paper #fbfaf6 | 3.40 | 3 | pass |
| board-paper light | notice ink #1b1b1b on paper #fbfaf6 | 16.49 | 4.5 | pass |
| board-paper dark | ink #e9e5dc on paper #161514 | 14.51 | 4.5 | pass |
| board-paper dark | soft #b0a99d on paper #161514 | 7.82 | 4.5 | pass |
| board-paper dark | accent/link #e8a0a8 on paper #161514 | 8.71 | 4.5 | pass |
| board-paper dark | accent #e8a0a8 on desk #0d0c0b | 9.33 | 4.5 | pass |
| board-paper dark | rule #7d766b on paper #161514 | 4.06 | 3 | pass |
| dial light | ink #0f1b24 on panel #ffffff | 17.46 | 4.5 | pass |
| dial light | ink #0f1b24 on bg #f3f5f7 | 15.98 | 4.5 | pass |
| dial light | soft #4a5966 on panel #ffffff | 7.21 | 4.5 | pass |
| dial light | soft #4a5966 on bg #f3f5f7 | 6.60 | 4.5 | pass |
| dial light | teal #0b6e69 on panel #ffffff | 6.09 | 4.5 | pass |
| dial light | amber #8a5200 on panel #ffffff | 6.39 | 4.5 | pass |
| dial light | button text #ffffff on teal #0b6e69 | 6.09 | 4.5 | pass |
| dial light | dial/rail stroke #5f6f7c on panel #ffffff | 5.18 | 3 | pass |
| dial dark | ink #e6edf2 on panel #121c24 | 14.59 | 4.5 | pass |
| dial dark | soft #a9b7c2 on panel #121c24 | 8.41 | 4.5 | pass |
| dial dark | soft #a9b7c2 on bg #0b1218 | 9.19 | 4.5 | pass |
| dial dark | teal #4fd1c5 on panel #121c24 | 9.25 | 4.5 | pass |
| dial dark | amber #f0b45a on panel #121c24 | 9.35 | 4.5 | pass |
| dial dark | button text #121c24 on teal #4fd1c5 | 9.25 | 4.5 | pass |
| dial dark | dial/rail stroke #7d8e9b on panel #121c24 | 5.11 | 3 | pass |
| calendar light | ink #1d1d1f on bg #f6f3ec | 15.19 | 4.5 | pass |
| calendar light | soft #55524b on bg #f6f3ec | 7.03 | 4.5 | pass |
| calendar light | blue #1d3f73 on bg #f6f3ec | 9.42 | 4.5 | pass |
| calendar light | green #2f6b3a on bg #f6f3ec | 5.77 | 4.5 | pass |
| calendar light | blue #1d3f73 on card #fffdf8 | 10.27 | 4.5 | pass |
| calendar light | button text #f6f3ec on blue #1d3f73 | 9.42 | 4.5 | pass |
| calendar light | flow line #7a7466 on bg #f6f3ec | 4.19 | 3 | pass |
| calendar dark | ink #ebe7df on bg #121417 | 14.96 | 4.5 | pass |
| calendar dark | soft #b4afa5 on bg #121417 | 8.45 | 4.5 | pass |
| calendar dark | blue #8fb3ec on bg #121417 | 8.63 | 4.5 | pass |
| calendar dark | green #8fd19a on bg #121417 | 10.33 | 4.5 | pass |
| calendar dark | blue #8fb3ec on card #1a1d21 | 7.91 | 4.5 | pass |
| calendar dark | flow line #8a8f97 on bg #121417 | 5.67 | 3 | pass |
| grid light | ink #111111 on bg #ffffff | 18.88 | 4.5 | pass |
| grid light | soft #4d4d4d on bg #ffffff | 8.45 | 4.5 | pass |
| grid light | red text #c42d1a on bg #ffffff | 5.62 | 4.5 | pass |
| grid light | white on red (tag, band) #ffffff on red #c42d1a | 5.62 | 4.5 | pass |
| grid light | notice (white on black) #ffffff on ink #111111 | 18.88 | 4.5 | pass |
| grid light | button (white on black) #ffffff on ink #111111 | 18.88 | 4.5 | pass |
| grid dark | ink #f2f2f2 on bg #111111 | 16.87 | 4.5 | pass |
| grid dark | soft #bdbdbd on bg #111111 | 10.05 | 4.5 | pass |
| grid dark | red text #ff6b55 on bg #111111 | 6.73 | 4.5 | pass |
| grid dark | white on band #ffffff on band #b3261e | 6.54 | 4.5 | pass |
| grid dark | notice (black on light) #111111 on ink #f2f2f2 | 16.87 | 4.5 | pass |
| counsel light | ink #2a2a26 on bg #f4f1ea | 12.77 | 4.5 | pass |
| counsel light | soft #5a5850 on bg #f4f1ea | 6.32 | 4.5 | pass |
| counsel light | sage #46634f on bg #f4f1ea | 5.90 | 4.5 | pass |
| counsel light | clay #94532f on bg #f4f1ea | 5.26 | 4.5 | pass |
| counsel light | loop stroke #46634f on bg #f4f1ea | 5.90 | 3 | pass |
| counsel dark | ink #e8e4d9 on bg #1a1c19 | 13.50 | 4.5 | pass |
| counsel dark | soft #b9b4a8 on bg #1a1c19 | 8.30 | 4.5 | pass |
| counsel dark | sage #a7c4b1 on bg #1a1c19 | 9.13 | 4.5 | pass |
| counsel dark | clay #e0a483 on bg #1a1c19 | 8.01 | 4.5 | pass |
| chooser light | ink #15211c on bg #f8f6f0 | 15.35 | 4.5 | pass |
| chooser light | soft #4a5a53 on surface #ffffff | 7.30 | 4.5 | pass |
| chooser light | green link #1f5c46 on surface #ffffff | 7.84 | 4.5 | pass |
| chooser light | gold tag #85601c on surface #ffffff | 5.70 | 4.5 | pass |
| chooser light | ink on notice #15211c on notice #fff3d1 | 15.00 | 4.5 | pass |
| chooser dark | ink #ece8dd on bg #0e1814 | 14.79 | 4.5 | pass |
| chooser dark | soft #b3aea0 on surface #16231e | 7.33 | 4.5 | pass |
| chooser dark | green link #74c7a5 on surface #16231e | 8.08 | 4.5 | pass |
| chooser dark | gold tag #dcb563 on surface #16231e | 8.38 | 4.5 | pass |
| chooser dark | ink on notice #ece8dd on notice #2a2416 | 12.59 | 4.5 | pass |

Decorative lines (grid lines, hairlines, the dial's outer ring) are not counted. All 70 pairs pass.

## Checks

- `node scripts/build.mjs`: `designs: wrote /d/ and 5 designs (14 timeline rows, 1 marked as replaced)`, `built _site/ (dev)`.
- `node scripts/validate.mjs`: `OK` (final run). An earlier run failed only on `broken link /behind-the-scenes/` in eight src pages, which the other developer has since fixed.
- `node scripts/leak-scan.mjs`: `OK (71 files, 12 binary skipped)`.
- Own checks on `_site/d/`: no U+2014; no hype words; no `<form`, `<input` or `mailto:`; one h1 per page; the notice element on every page; "This is not legal advice." under every timeline; external links only to sustain-nobility.com (home, /home, /disclaimer) and the research sources (EUR-Lex, European Commission).
- Playwright (chromium, deviceScaleFactor 1, local static server over `_site/`): `document.documentElement.scrollWidth` equals the viewport at 390 and 1366 px for the chooser and all five designs, light and dark. Each design was looked at in full at both widths, and in dark mode; fixes made after looking: margin-note alignment, the dial rail pills too short for their labels, the Counsel loop captured mid-draw (screenshots now wait for it), SVG text too small at 390 px (narrow twins added, partner figure redrawn smaller), the calendar flow labels overlapping, and a tabular-number setting that spaced out hyphens.

Screenshots (1.9 MB in all): `d-chooser.png`, `d-board-paper.png`, `d-dial.png`, `d-calendar.png`, `d-grid.png`, `d-counsel.png` (top 1500px at 1366 px wide) and `d-calendar-390.png` (top 1700px at 390 px, showing the date scroller).

## Open points for the conductor

- `og:image` points at `https://sustain-nobility.agenticcells.site/og.png`, which the other developer is making; until it exists the share preview has no image.
- The flow step 2 ("Score") lists c24 (their Disclaimer) among its source facts in `copy.json`, so the Disclaimer appears in each design's Sources list.
- `copy.json` keeps quoting c3, c5, c6, c8, c9, p3 and p5 verbatim while research.json records them as paraphrased (the writer's request to the researcher stands).
