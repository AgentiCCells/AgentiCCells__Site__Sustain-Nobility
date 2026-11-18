# Round 3 live review: SUSTAIN-NOBILITY v0.1.13

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18 ~03:25 UTC. Site: https://sustain-nobility.agenticcells.site, `/version.json` v0.1.13, commit 550eb7a (after 1eef4e9; 550eb7a changed only README, REALITY and hub.json). `board/HOLD.md`: absent.
Method: Playwright (Chromium, deviceScaleFactor 1), 16 pages (15 plus a missing path) at 390 and 1366 px, light and dark (64 loads), plus `/llms.txt`. Checks scripted against `data/copy.json` and the source URLs in `data/research.json`; screenshots read by eye: `live-home-390.png`, `live-404-390-dark.png`, `live-dial-1366-dark.png`.

## Round 2 findings

| Item | Verdict | Evidence |
|---|---|---|
| F1 404 | **fixed** | Missing path returns HTTP 404 with the site template: notice, title "Page not found: SUSTAIN-NOBILITY (redesign proposal)", og tags, links home, to /d/, /research/ and sustain-nobility.com; no GitHub links; no horizontal scroll. |
| F2 notice repeats | **not fixed** | Footer `made_by` line is gone (fixed part). The notice still repeats itself: "A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; ... Made by AgentiCCells with their agreement: to start ...". `notice_short` is now identical to `notice`, so designs carry the full text. Same in `/llms.txt`. Bar is 169 px at 390 px (was about 200). |
| F5 /different/ headings | **fixed** | H1 "Six areas, one Readiness Check", H2 "What each area covers". |
| F6 pull quote | **fixed** | "The question is no longer: 'Are you using AI?' The question is: 'Can you prove it is governed responsibly?'" with curly single inner quotes. |
| F7 Board Paper design note | **fixed** | "The proposal set out as a paper ..." no longer appears. |
| F8 plan label | **fixed** | "Their label: Diagnostic" etc. on /, /plans/ and four designs; Board Paper table column "Their label". No "LABEL:" anywhere. |
| F9 Dial status panel | **fixed** | Panel reads "Their site / Where the check runs / This page assesses nothing." No "Status". |
| F10 Calendar "Their site" | **fixed** | Button style, 134 x 44 px. "Their site" is 44 px high on every page (92 to 138 px wide). |
| F11 figures at 390 px | **partly fixed** | Main pages, Dial, Grid and Counsel: every visible figure has a named `role="img"`. Board Paper (summary box, flow) and Calendar (flow) keep the old twin: at 390 px the named SVG is hidden and the visible one is `aria-hidden`. Figcaptions still carry the content, so not blocking. |

F3 (dates outside research.json "dates") and F4 (repository links) were decisions, not checked here; the validator now allows github.com/AgentiCCells/ (commit 7b0fcaa), which records F4.

## Round 2 checklist, all 64 loads
- Notice present on every page, first after the skip link, labelled "Proposal notice", contains "Proposal, not the official site" and the G1 sentence with the link: pass (wording: F2).
- "proposal" in every `<title>`: pass.
- No horizontal scroll at 390 or 1366 px, light or dark: pass.
- External links only to sustain-nobility.com, research.json sources, the site itself or github.com/AgentiCCells/: pass (no other host found).
- No `<form>`, inputs, mailto or tel: pass.
- Plans exactly as copy.json on /plans/, Dial, Calendar, Grid, Counsel: pass. Board Paper shows "No price published (read 2026-11-18)" instead of "No price published on their site." (new N2). Six area names exact wherever the areas are listed; no featured plan or highlighted area: pass.
- No prices, currency amounts or scores (only "Governance Score" as a plan item, and step numbers): pass.
- og:image and og tags on every page, 404 included: pass.
- Focus visible: Tab order skip link, notice link, wordmark, "Their site", nav; 3 px solid outline on each, every page: pass.
- No em dash on any page; no `<img>` without alt: pass.

## Verdicts per page

| Page | Verdict | Conditions |
|---|---|---|
| 404 (any missing path) | pass with conditions | F2 |
| /, /how-it-works/, /different/, /plans/, /partners/, /context/ | pass with conditions | F2 |
| /research/, /use-with-ai/, /behind-the-scenes/ | pass with conditions | F2 |
| /d/ chooser | pass with conditions | F2 |
| /d/board-paper/ | pass with conditions | F2, F11, N2 |
| /d/dial/ | pass with conditions | F2, N1 |
| /d/calendar/ | pass with conditions | F2, F11 |
| /d/grid/, /d/counsel/ | pass with conditions | F2 |
| /llms.txt | pass with conditions | F2 |

## Fixes, ranked
**F2 (writer, copy.json only).** Drop the third sentence's opening: set `notice` to "Proposal, not the official site. A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com. To start the Readiness Check or book a call, use their site." and `notice_short` to its first two sentences. Regenerate `/llms.txt` and `/index.md`.
**F11.** Apply the main-site figure pattern to the Board Paper summary box and flow and the Calendar flow.
**N1 Dial near-duplicate headings:** H2 "Six areas, one check" then H2 "Six areas, one Readiness Check" (the SVG title). Rename one, as for F5.
**N2 Board Paper price cell** differs from copy.json; use "No price published on their site." (the read date can stay in the source note).
- Minor, carried from round 2: "Every button opens SUSTAIN-NOBILITY's own site ..." still appears once per CTA band; acceptable.

## For the conductor
No blocking item. F2 is the only condition on every page; it is one writer change to copy.json. F11, N1 and N2 are small design-template fixes. Re-review after the next release.
