# Round 2 build: main site

Developer: developer.sustain-nobility@AgentiCCells.dinis (main-site build), 2026-11-18, for conductor.sustain-nobility@AgentiCCells.dinis. Not committed; the conductor commits. `board/HOLD.md`: absent.

Built under `team/rounds/2/review/DESIGN.md` (G1 to G8 and the per-change conditions) from `team/rounds/2/design/PROPOSAL.md` sections 1, 2 and 4, with words from `data/copy.json` and dates from `data/research.json`.

## What changed

| File | What |
|---|---|
| `src/style.css` | Rewritten to the proposal's visual system: system font stacks, light and dark tokens (section 2.3), spacing scale, 3px `:focus-visible` ring, 44px targets, `prefers-reduced-motion` (transitions only under `no-preference`), no JS. SVG classes bound to tokens so figures follow dark mode. |
| `src/index.html` | Home in the proposal's order: notice, hero (headline question, c2 quote, our summary, two buttons, c7 quote beside), three things you can show, compact 5-step flow figure + text twin, who it is for, six-area ring figure, four-plan strip, "Why now" (`<!--TIMELINE:home-->`), CTA band, sources. |
| `src/how-it-works/index.html` | Full flow SVG (return arc, Essentials and Professional brackets, no bracket on step 5) and a vertical variant under 900px (`aria-hidden`, review change 5), text twin with published wording quoted and our summaries labelled. |
| `src/different/index.html` | Nav label "Six areas"; ring SVG (wide) and a 2 by 3 variant under 640px (`aria-hidden`); no area highlighted; c5 quoted verbatim; twin list labelled "AgentiCCells's plain-language summary". |
| `src/plans/index.html` | Four cards exactly as copy.json (labels "Diagnostic", "Initial report", "Custom (Scale)", none for Advisory Services); no prices, no featured card; "How to start" button to sustain-nobility.com on each. |
| `src/partners/index.html` | One-to-many SVG captioned "Illustration", no names, no counts; c4 and c8 quoted; partner types as published; Partner Licensing as published. |
| `src/context/index.html` | Summaries (labelled) with fact links and numbered sources; `<!--TIMELINE:context-->`; their Disclaimer quoted; "This is not legal advice." |
| `src/use-with-ai/index.html` | New shell; agent instructions updated (the old "not re-checked" line removed, since dates now come from research.json). |
| `src/index.md`, `src/llms.txt` | Rewritten from copy.json for the new pages; lists /research/, /d/, /behind-the-scenes/. |
| `src/og.png` | 1200 by 630 link preview: text wordmark, Proposal tag, headline question, "A redesign proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement". Rendered with Playwright, deviceScaleFactor 1. |
| `src/favicon.svg` | Shield-and-tick mark replaced by a plain lined square, so nothing reads as a company logo (follows review change 17). |
| `scripts/generate.mjs` | Timelines for the two markers; superseded-date rule; director redaction; preview tags on /research/. |

Every page: notice with `role="region" aria-label="Proposal notice"` first after the skip link, holding both "made by AgentiCCells with their agreement" and the G1 sentence; text wordmark "SUSTAIN-NOBILITY" with a visible "Proposal" tag (no monogram); "Their site ↗" header button; `<title>` contains "proposal"; og:title, og:description, og:url, og:type, og:site_name, og:image (https://sustain-nobility.agenticcells.site/og.png), twitter:card summary_large_image, twitter:image. Primary nav: How it works, Six areas, Plans, Partners, Context, Research. "Designs" and "Behind the scenes" are in the footer only. Footer: company, jurisdiction and registered office with source line, G1 sentence, licences, version. External links go only to https://www.sustain-nobility.com (and its /disclaimer and /our-services pages as sources) or to source URLs in research.json. No form, input, mailto or booking link.

The src HTML was written by a one-off script in the developer's scratchpad that copies the strings from `data/copy.json`. It checks that the SVG line splits of step and area names join back to the published text. The script is not in the repository; src/ is the source of truth.

## Timelines (G6)

- Dates come only from `dates` arrays in `data/research.json`, read by `scripts/generate.mjs` at build time. Fact ids come from `copy.json` (`home.why_now_fact_ids`, `context.timeline_fact_ids`). The build fails if a date is not written in its fact's text, a dated fact has no https source URL, a row has no "what", or a marker is missing.
- Each row: date, the fact's own wording, a link to `/research/#f-<id>`, the source link (publisher from copy.json sources) and read date. "This is not legal advice." sits beneath.
- Superseded: `f2 2027-08-02` (original Article 6(1) date) is marked "Replaced by Regulation (EU) 2026/1744: see fact f6" on /context/ and on the /research/ table, and dropped from home. The build fails if that rule names a date that research.json no longer holds.
- Home shows 5 rows: 1 August 2024 (f1), 27 July 2026 (f4), 2 August 2026 (f1), 2 December 2027 (f6), 2 August 2028 (f6). f24 is in `why_now_fact_ids` but has no `dates`, so it is omitted.

## Research page changes

- c33: the legal name is replaced; it now reads "...: the director, active, appointed on 25 July 2025...", consistent with p1.
- Open question 4: "Companies House shows the role Director under the name [legal name];" now reads "Companies House lists the director under a longer legal name;".
- Guards: the build fails if the legal name appears in any published fact, open question or the research page.

## Gate output (local build, version dev)

```
$ node scripts/build.mjs
generated _site/research/index.html (company, person, field, market)
designs: wrote /d/ and 5 designs (14 timeline rows, 1 marked as replaced)
built _site/ (dev)
$ node scripts/validate.mjs
_site/{index,context,different,how-it-works,partners,plans,research,use-with-ai}/index.html: broken link /behind-the-scenes/
FAILED: 8 problem(s)
$ node scripts/leak-scan.mjs
OK (68 files, 2 binary skipped)
```

The only validator failures are the footer link to /behind-the-scenes/. That page is not built yet, and as briefed I created nothing for it. When it exists the validator should print OK; nothing else is flagged on the main pages or /d/. No em dash in src/ or generate.mjs.

## Layout checks

Playwright, local static server over `_site`, deviceScaleFactor 1, light and dark. `document.documentElement.scrollWidth` equals the viewport at 390 and 1366 px on home, how-it-works, different, plans, partners, context, use-with-ai and research. No horizontal page scroll. The nav wraps to two rows under the brand at 390 px. Saved: `main-home-390.png`, `main-plans-1366.png`, `main-how-it-works-1366.png`.

SVG text: each figure has a narrow variant, so the smallest rendered SVG text is about 14px at 390 px (16px sublabels scaled about 0.93) and at least 14px at 900 px and up.

## Contrast (WCAG formula, measured from the tokens in src/style.css)

| Pair | Use | Light | Dark | Needs |
|---|---|---|---|---|
| ink on paper | body text | 15.35 | 14.79 | 4.5 |
| ink on surface | card text | 16.59 | 13.26 | 4.5 |
| inkSoft on paper | secondary text, captions | 6.75 | 8.18 | 4.5 |
| inkSoft on surface | secondary text on cards, SVG sublabels | 7.30 | 7.33 | 4.5 |
| green on paper | links | 7.26 | 9.02 | 4.5 |
| green on surface | links on cards, SVG strokes and arrows | 7.84 | 8.08 | 4.5 |
| goldText on paper | eyebrows, tags | 5.27 | 9.34 | 4.5 |
| goldText on surface | tags, SVG bracket labels | 5.70 | 8.38 | 4.5 |
| goldText on goldSoft | proposal box border | 4.67 | 7.95 | 3 |
| ink on notice | notice text and link | 15.00 | 12.59 | 4.5 |
| onDeep on greenDeep | hero and band headings | 13.58 | 15.40 | 4.5 |
| onDeepSoft on greenDeep | hero and band body text | 10.93 | 12.29 | 4.5 |
| goldFill on greenDeep | hero eyebrow, focus ring on deep | 7.73 | 9.73 | 4.5 |
| onGold on goldFill | primary button text | 9.45 | 8.56 | 4.5 |
| goldFill on greenDeep | primary button edge on band (non-text) | 7.73 | 9.73 | 3 |
| ink on paper | SVG box text (box fill = paper) | 15.35 | 14.79 | 4.5 |
| surface on green | SVG core disc text | 7.84 | 8.08 | 4.5 |
| lineStrong on surface | SVG wires (non-text) | 3.73 | 4.51 | 3 |
| green on surface | focus ring (light) / nodes | 7.84 | 8.08 | 3 |
| goldText on surface | focus ring (dark uses gold) | 5.70 | 8.38 | 3 |

all pairs pass

The SVG strokes use `--green`, and the wires use `--line-strong` (3.73 light, 4.51 dark). Brackets and dashed rules use `--gold-text`. SVG text uses `--ink`, `--ink-soft` and `--gold-text` on `--surface` or `--paper`, and `--surface` on the `--green` disc. All pairs are in the table.

## For the conductor

1. /behind-the-scenes/ must exist before release, or the validator fails on the footer link.
2. `copy.json` `proposals` (the Proposal box items), `about_proposal` and `founder` are not rendered on the main pages: none of them is in the passed home order. They may suit /behind-the-scenes/ or a later round.
3. The c7 quote contains straight inner quotation marks, so it shows as “... "Can you prove it is governed responsibly?"”. It is left verbatim.

## Additions at the conductor's second brief (2026-11-18)

- **Home:** "Who is behind it" (copy.json `founder`: name and title, the p2 About Us quote, the p5 and p3 quotes, each with a source footnote, and "Named with their agreement.") and "About this proposal" (`about_proposal`, plus the dashed Proposal box with every item starting with a bold "Proposal:"). Both come before the closing CTA band; the rest of the order is unchanged.
- **/behind-the-scenes/:** `scripts/behind.mjs` (Node built-ins and git), run by `scripts/build.mjs` after designs.mjs (one line added). The page has the same notice, header, footer and preview tags as the other pages, and these sections:
  - How this was made.
  - In Dinis's words, verbatim from team/WORKFLOW.md.
  - The team: from team/scopes.json and each ROLE.md, with GitHub links to ROLE.md and POLICY.md on `dev`.
  - The flow of a round: a 9-step SVG (wide 3 by 3 and narrow single column) and a text list.
  - Rounds: team/rounds/N.md rendered with minimal Markdown and anchors `#round-N`.
  - Every commit: from `git log HEAD`, newest first, with the UTC time, the Agent: trailer, the subject linked to its GitHub commit, and the short hash.
- **Safety:** everything read from git or team/ is HTML-escaped. Markdown links are kept only for https or site-relative URLs. When quoted text is shown, U+2014 becomes a colon and a validator hype word becomes "[word removed]". If git fails (tested with git off the PATH), a warning is printed, the page is written without the commit list, and the build continues.
- **index.md, llms.txt, /use-with-ai/:** Designs and Behind the scenes are listed, and an "Agent instructions" block says: this is a proposal; cite sources from /research/; send people to sustain-nobility.com; take no actions on anyone's behalf.
- **CSS fix:** long code paths no longer widen grid items. /behind-the-scenes/ had overflowed by 2 px at 390; now no page overflows at 390 or 1366.

Gates after these additions:
```
$ node scripts/build.mjs
generated _site/research/index.html (company, person, field, market)
designs: wrote /d/ and 5 designs (14 timeline rows, 1 marked as replaced)
behind: wrote _site/behind-the-scenes/index.html (6 roles, 9 steps, 2 rounds, 10 commits)
built _site/ (dev)
$ node scripts/validate.mjs
OK
$ node scripts/leak-scan.mjs
OK (71 files, 5 binary skipped)
```
