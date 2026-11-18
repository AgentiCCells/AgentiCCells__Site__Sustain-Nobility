# Round 2 live review: SUSTAIN-NOBILITY v0.1.9

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18 ~03:15 UTC. Site: https://sustain-nobility.agenticcells.site. `board/HOLD.md`: absent.
Method: Playwright (Chromium), every page at 390 and 1366 px, light and dark (64 loads), plus `/llms.txt`, `/index.md` and a missing path for the 404. Checks scripted against `data/copy.json` and `data/research.json`; screenshots read by eye. Screenshots: `live-home-390.png`, `live-home-1366-focus.png`, `live-board-paper-1366.png`, `live-different-390-dark.png`, `live-calendar-390-dark.png`, `live-dial-390-dark.png`.

## What passed everywhere (15 HTML pages, 4 views each)
- Notice present, `role="region"`, `aria-label="Proposal notice"`, first after the skip link, no dismiss button; contains "Proposal, not the official site" and the G1 sentence word for word, with the link.
- "proposal" in every `<title>`; header shows "SUSTAIN-NOBILITY" with a "Proposal" tag; no monogram (change 17 dropped).
- No horizontal page scroll; no element past the viewport except the off-screen skip link and the visually hidden table head on Grid Poster (both intended).
- No `<form>`, `<input>`, mailto, tel or booking links. Every action goes to https://www.sustain-nobility.com with "(opens their site)" hidden text.
- Plans match `copy.json` exactly (names, labels, "for" lines, contents, "No price published on their site.", "To be discussed"); Advisory Services has no label; no featured card. Six area names exact; none highlighted.
- No prices, currency signs, clients, testimonials, results or scores. Dial centre reads "Their check produces a Governance Score. This page shows none."
- Superseded 2 August 2027 (Article 6(1)) is labelled "Replaced by Regulation (EU) 2026/1744" on `/context/` and `/research/`, and "(original date, replaced ...)" in all five designs. The other 2 August 2027 entry (sandboxes, moved from 2026) is current and correctly unlabelled.
- Founder's legal name (as on Companies House) absent on every page; the published name "Monica Maghami" appears, which Dinis reported the founder agreed to (WORKFLOW.md, 02:27 UTC).
- og:image (`/og.png`, 200, 81 KB), og:title, og:description, twitter:card on every HTML page.
- Focus: Tab from home reaches skip link, notice link, wordmark, "Their site", nav; each shows a 3 px solid green outline (screenshot).
- No `<img>` without alt; every visible SVG has `role="img"` with `aria-labelledby`, or `aria-hidden`.
- `/behind-the-scenes/` commit timeline renders: 12 commits, time, agent, quoted subject, link. No "[word removed]" substitution appears anywhere, so nothing to discuss on that point.
- `/llms.txt` and `/index.md` list `/research/` and `/behind-the-scenes/`, carry the G1 sentence and the version.

## Verdicts

| Page | Verdict | Conditions (see fixes) |
|---|---|---|
| 404 (any missing path) | **fail** | F1 |
| / | pass with conditions | F2, F6, F11 |
| /how-it-works/ | pass with conditions | F2, F11 |
| /different/ | pass with conditions | F2, F5, F11 |
| /plans/ | pass with conditions | F2, F8 |
| /partners/ | pass with conditions | F2 |
| /context/ | pass with conditions | F2 |
| /research/ | pass with conditions | F2, F3 |
| /use-with-ai/ | pass with conditions | F2 |
| /behind-the-scenes/ | pass with conditions | F2, F4 |
| /d/ chooser | pass with conditions | F2 |
| /d/board-paper/ | pass with conditions | F2, F7 |
| /d/dial/ | pass with conditions | F2, F9 |
| /d/calendar/ | pass with conditions | F2, F10 |
| /d/grid/ | pass with conditions | F2 |
| /d/counsel/ | pass with conditions | F2 |
| /llms.txt, /index.md | pass with conditions | F2 (same repeated lede) |

## Fixes, ranked

**F1 (blocking) 404 is the GitHub Pages default.** A missing path returns "Page not found · GitHub Pages": no notice, no "proposal" in the title, no og tags, links to githubstatus.com, help.github.com and twitter.com, and horizontal scroll at 390 px (700 px wide). G1 lists 404 explicitly. Fix: generate `404.html` at the site root from the same template (notice, header, link home, link to sustain-nobility.com) and add it to the validator's page list.

**F2 The notice repeats itself.** Main-site text: "Proposal, not the official site. A redesign proposal for SUSTAIN-NOBILITY Advisory Ltd, made by AgentiCCells with their agreement. A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com. To start the Readiness Check, book a call or get in touch, use their own site." The middle two sentences say the same thing; at 390 px the bar fills about 200 px, a quarter of the first screen (`live-home-390.png`). Designs use `notice_short`, which repeats too ("..., made by AgentiCCells with their agreement. A proposal by AgentiCCells, made with ..."). Writer: set `notice` to "Proposal, not the official site. A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com. To start the Readiness Check or book a call, use their site." and `notice_short` to the first two sentences only. Footer has the same issue: `proposal_line` then `made_by` ("Made by AgentiCCells with their agreement. Not the official site."); keep the G1 line and drop `made_by`. Same change in the `llms.txt` lede and `index.md`.

**F3 Dates outside research.json "dates" on /research/.** 22 dates appear that are in fact text but not in any "dates" array, for example 26 January 2023 (NIST AI RMF), 28 January 2026 (DSIT/DBT letter), 19 October 2026 (Commission page update), 25 April 2027 (accounts due), plus Companies House filing dates. Each sits inside a sourced fact with URL and read date, so this is not an invented date, but it breaks the rule as briefed. Decide one: the researcher adds them to "dates" (preferred, then the validator can check every date on every page), or the conductor narrows the rule to timelines. No other page shows an unlisted date.

**F4 GitHub links on /behind-the-scenes/.** 30 links to github.com/AgentiCCells/AgentiCCells__Site__Sustain-Nobility (repo home, round and role files, commits). The repo answers 200, so it is public, and design change 15 allows the public repo; but these are neither sustain-nobility.com nor a research source. Add that one repo prefix to the validator's allowlist explicitly so it is a recorded exception, not a gap.

**F5 /different/ has two near-identical headings:** H1 "Six areas, one Readiness Check" then H2 "Six areas around one Readiness Check" (the SVG title reused). Rename the H2, for example "What each area covers".

**F6 Home pull quote ends with mixed quotation marks:** `...governed responsibly?""` (straight inner, curly outer, two closing marks together). Use single inner quotes: "The question is no longer: 'Are you using AI?' The question is: 'Can you prove it is governed responsibly?'" Check `index.md` too.

**F7 Board Paper intro line reads like a design note:** "Board Paper: The proposal set out as a paper for a board meeting, with numbered paragraphs and source notes in the margin." That describes the design to us, not the subject to a reader. Move it to the chooser card or label it "About this design". Margin notes did not overlap text at 1366 px.

**F8 Plans "LABEL:" heading.** Rendered in capitals as "LABEL: DIAGNOSTIC", which is awkward and does not say whose label. Use "Their label: Diagnostic" (sentence case, no `text-transform`), here and in the designs.

**F9 Dial "READINESS Status" panel.** The heading "Status" over "This page assesses nothing." still suggests a result panel (DESIGN change 21: must not look like a working tool). Rename to "Where the check runs".

**F10 Calendar "Their site" is a plain underlined text link** in the header (`live-calendar-390-dark.png`); confirm it meets the 44 px target (G8) or give it the button style the other designs use.

**F11 Twin figures at 390 px.** The named wide SVG is `display:none` and the visible narrow SVG is `aria-hidden`, so at phone width no figure is announced. The text twins below carry the content, so this passes, but better: put `role="img"` and the name on the `<figure>` wrapper (or move `aria-hidden` to whichever SVG is hidden by the media query).

## Text quality notes (minor)
- British English throughout ("organisation", "licensing"); no em dash on any page; no hype words found.
- "(opens their site)" hidden text appears after every action, which is right; the visible line "Every button opens SUSTAIN-NOBILITY's own site ..." then repeats it after each CTA band. Once per page is enough.
- Professional plan "for" line keeps their apostrophe ("organisation's"); correct as a verbatim quote, do not fix.

## For the conductor
F1 blocks sign-off of round 2's live review; F2 is a writer change to `copy.json` only. F3 and F4 need a decision on the rule, not a code change. Re-review after the next release.
