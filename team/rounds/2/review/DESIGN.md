# Round 2 design review: SUSTAIN-NOBILITY

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Reviewed: `team/rounds/2/design/PROPOSAL.md` against `CLAUDE.md`, `team/WORKFLOW.md`, `team/reviewer/POLICY.md` and the conductor's brief. `board/HOLD.md`: absent. `data/research.json`: not yet present, so no regulatory fact is checked here.

## Conditions for every page and every design (G1 to G8)

- **G1 Notice.** The notice bar must contain, word for word: "A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com", with the link to https://www.sustain-nobility.com. The proposed notice text (1.2 item 1) lacks "their official site is"; add it. Same markup on the main site, `/d/`, all five designs, `/research/`, `/behind-the-scenes/`, `/use-with-ai/` and 404. Never dismissable, first after the skip link, `role="region" aria-label="Proposal notice"`.
- **G2 Not mistakable.** Every `<title>` contains "proposal". The header brand reads as a proposal, for example "SUSTAIN-NOBILITY, a proposal" with a visible "Proposal" tag; never the bare company name alone as a masthead.
- **G3 Actions.** Every button and action link goes to https://www.sustain-nobility.com and says so in visible or visually hidden text. No `<form>`, `<input>`, mailto, booking or tracking. Internal navigation links are not actions.
- **G4 Their words.** Quoted only verbatim, in quotation marks, with the link and read date. Plan contents, plan labels, area names, the hero question and the lede are copied from the round 1 capture of their home page, not retyped from this proposal.
- **G5 Invent nothing.** No clients, testimonials, results, scores, prices, partners, counts or durations beyond the published "10-minute" and "30-minute". Our summaries are labelled "AgentiCCells's summary"; proposal wording is labelled "Proposal" where shown.
- **G6 Regulatory dates.** Only from `data/research.json`, read at build time by the generator. No date, article number or status may be typed into `data/copy.json`, a template or an SVG. Each date carries the source URL, publisher, read date and the source's own status wording ("applies from", "proposed"). Examples in the proposal (EU AI Act stages, ISO/IEC 42001, UK white paper, digital omnibus) are not facts until the researcher records them. If an entry is missing or unsourced the item is omitted with no placeholder; if none exist the whole timeline section is omitted. A "This is not legal advice" line sits under every timeline.
- **G7 Wording.** Plain British English, no em dash, no hype words, they/them. Run the wording check on `copy.json` and the built pages.
- **G8 Access.** WCAG 2.2 AA; the developer re-measures every colour pair in both themes, including SVG text and strokes, and records them in `team/rounds/2/build/`. Visible `:focus-visible` ring. 390 and 1366 px with no horizontal page scroll; 44 px targets. Motion only inside `prefers-reduced-motion: no-preference`. All content readable with JS off and CSS off. No web fonts, CDNs or images from their site.

## Verdicts: main site

| # | Change | Verdict | Conditions |
|---|---|---|---|
| 1 | Information architecture and nav (1.1) | pass with conditions | Seven nav items plus "Their site ↗" must wrap at 390 px without overflow; `/research/` and `/behind-the-scenes/` in `llms.txt` and `index.md`. |
| 2 | Notice bar (1.2.1, 2.4) | pass with conditions | G1 wording is mandatory. |
| 3 | Hero (1.2.2) | pass with conditions | H1 and lede verbatim per G4 with a source footnote; "Book a strategy call" only if their site offers that action, else "Get in touch on sustain-nobility.com ↗". |
| 4 | "Three things you can show" (1.2.3) | pass with conditions | Wording kept from round 1 and traced to their published verbs (assess, identify, produce). |
| 5 | Flow figure (1.2.4, 1.4) | pass with conditions | Step labels as published; "Monitoring" and "real-time diagnostics when strategy changes" only with the round 1 source line; caption that no plan is stated for step 5 stays. Two SVGs with `display:none` swap must not duplicate the accessible name: give the hidden one `aria-hidden="true"`. |
| 6 | Who it is for (1.2.5) | pass with conditions | One verbatim line each with source. |
| 7 | Six-area ring (1.2.6, 1.5) | pass with conditions | Area names exactly as published (G4). No area highlighted. The "only one of legal, technical or policy" point: quote verbatim with link, or drop it; a paraphrase of their words is not allowed. |
| 8 | Plan strip and plans page (1.2.7, 1.6, 2.4) | pass with conditions | Exactly: Essentials (Diagnostic): 10-minute assessment, Governance Score, Initial Executive Snapshot Summary. Professional (Initial Report): everything in Essentials, 30-minute review call, Initial Executive Board Report. Partner Licensing (Custom, Scale): for SMEs and SME-supporting firms that intend to monitor AI governance; to be discussed. Advisory Services: to be discussed. Remove the invented label "Advisory" for Advisory Services (no label is published). No featured card. "No prices are published" carries the read date. |
| 9 | Why now timeline (1.2.8) | pass with conditions | G6 in full. |
| 10 | Closing CTA band (1.2.9, 2.4) | pass with conditions | Both buttons to sustain-nobility.com (G3). "Find out where your AI governance stands" is proposal wording; the writer must not imply this site assesses anything. |
| 11 | Sources list (1.2.10, 2.4) | pass | |
| 12 | Footer with registered office (1.2.11) | pass with conditions | Company name, jurisdiction and office with the source line "their site footer, read 2026-11-18"; no personal name; include the G1 sentence again. |
| 13 | Partners page (1.3) | pass with conditions | Partner types (advisers, law firms, SME consultancies) only as published with source; figure captioned "Illustration", no counts, no named partner. |
| 14 | Research page (1.1) | pass with conditions | Renders only sourced entries with read dates. No person is named, and the "person" section is not published, until a sourced fact exists and Dinis confirms the person agreed to be named. No market numbers without source. |
| 15 | Behind the scenes, Use with AI (1.1) | pass with conditions | No secrets, keys or vault tokens shown; only the public repo and round files. |
| 16 | Visual system, tokens, type, spacing (2.1 to 2.3) | pass with conditions | G8 re-measure; `--on-deep` on `--green-deep` and gold buttons on the band in both themes. |
| 17 | Header monogram "SN" (2.4) | fail | A drawn "SN" mark in a rounded square reads as a company logo and makes the page easier to mistake for theirs. Drop it; use a plain text wordmark with the proposal tag (G2). |
| 18 | Proposal blocks (2.4) | pass | |

## Verdicts: five designs and chooser

| # | Design | Verdict | Conditions |
|---|---|---|---|
| 19 | Chooser `/d/` (3.0) | pass with conditions | Notice (G1); thumbnails `aria-hidden`; design names linked as text. |
| 20 | Board Paper (3.1) | pass with conditions | No crest, classification marking, departmental style or "official" wording. "Options for the board" and "Recommended next step" labelled as our proposal, not their advice. Cost column: "No price published" (read date) for Essentials and Professional, "To be discussed" for the other two. Margin notes must not overlap text at 1366 px. |
| 21 | Readiness Dial (3.2) | pass with conditions | Centre text changes to "Their check produces a Governance Score. This page shows none." (nothing "appears here"). No number, colour scale, needle or status colour. Pills must not "expand" with JS: all step panels visible, or `<details>` with content readable when closed for no-CSS readers. Must not look like a working tool: no input-like panels. |
| 22 | Deadline Calendar (3.3) | pass with conditions | G6 in full; the date spine draws only `research.json` entries. CTA "Before the next date" fails as worded (it implies a deadline for the reader); use a neutral line such as "Start on sustain-nobility.com ↗". The 390 px horizontal scroller needs `tabindex="0"`, `role="region"`, an `aria-label` and a visible focus ring; an equivalent list sits beneath. |
| 23 | Grid Poster (3.4) | pass with conditions | "Faintly" labelled area names must still meet 4.5:1 (or 3:1 at large size) or be removed from the SVG, with names in the alt text and text twin. Headline break at 390 px via CSS, not a forced `<br>` at 1366 px. Paraphrase rule as change 7. |
| 24 | Quiet Counsel (3.5) | pass with conditions | Line is fully drawn by default; the draw runs only under `no-preference`. Pull quotes verbatim with link and read date (G4). |
| 25 | Shared copy source (3, 6) | pass with conditions | All five designs read `data/copy.json` and `data/research.json` through the generator; no design holds its own fact text. |

## Accessibility and risk sections (4, 5)

Pass. Section 4 meets G8 if built as written. Spot checks of stated ratios (gold text on paper about 5.3, signal red with white about 5.6, dial teal on background about 5.6) agree; the developer still re-measures all pairs.

## For the writer

Write the G1 sentence, verbatim plan and area texts, the CTA lines for changes 10 and 22, and the dial caption for 21. Mark every summary and proposal line. No dates or regulatory claims in `copy.json`.

## For the developer

Drop change 17. Generate timelines from `data/research.json` only (G6), with an omit-if-missing rule and a build check that fails if a date in the output has no source URL. Extend the validator to assert the G1 sentence and "proposal" in `<title>` on every page, and that every external link goes to https://www.sustain-nobility.com or a source in `research.json`. Record contrast results and 390 and 1366 px checks in `team/rounds/2/build/`.
