# Round 2 design proposal: SUSTAIN-NOBILITY

Author: designer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Status: proposal, for the reviewer's verdict in `team/rounds/2/review/DESIGN.md`.

Read before writing: `CLAUDE.md`, `team/WORKFLOW.md`, `team/designer/ROLE.md`, `team/designer/POLICY.md`, `README.md`, every file in `src/` (the factory's first pass), and, as material only, https://marc-noah.agenticcells.site (/, /d/, /d/poster/), read 2026-11-18.

Facts used are those the conductor's brief records from https://www.sustain-nobility.com (home page, read 2026-11-18) and, for regulation, whatever `data/research.json` holds at build time. This proposal adds no fact of its own. Where it suggests wording, it is marked as a proposal for the writer.

## 0. What is wrong with the first pass, in one list

1. Nav names the page "What makes it different" but the content is the six areas; a reader cannot guess that.
2. The home page has no figure: the flow and the six areas, the two clearest things, sit on inner pages.
3. Plans read as four similar boxes; "what you get" is not separated from "how to start".
4. The Professional card is highlighted although the company has not recommended a plan (the page admits this). Drop it.
5. Partner Licensing omits the published words "Scale: for SMEs and SME-supporting firms that intend to monitor AI governance".
6. The footer has a founder placeholder and no registered office, though the office is published (128 City Road, London EC1V 2NX).
7. The context page carries a "not yet re-read" warning; the regulation is the strongest evidence and is hidden behind it.
8. One style only; no /d/, no research page, no behind the scenes.

## 1. Main site information architecture

### 1.1 Pages and nav

| Path | Nav label | Purpose | Key element |
|---|---|---|---|
| `/` | Home | The question, the answer in one screen, routes to the rest | hero, flow figure (compact), six-area figure (compact), plan strip, CTA band |
| `/how-it-works/` | How it works | The check as a 5-step flow | inline SVG flow + ordered-list text twin |
| `/different/` | Six areas | The six areas as one check | inline SVG ring + list twin (keep the URL; change the label and h1) |
| `/plans/` | Plans | Four plans exactly as published | plan cards with "What you get" and "How to start" |
| `/partners/` | Partners | The partner case | one-to-many SVG, three partner types, Partner Licensing as published |
| `/context/` | Context | Regulation and standards with sources | sourced timeline SVG + fact cards with footnotes |
| `/research/` | Research | Renders `data/research.json` (company, person, field, market) | fact cards grouped by section, each with url and read date |
| `/d/` | Designs | Chooser for five designs | five cards with inline SVG thumbnails |
| `/d/<slug>/` | (in chooser) | One full single-page design each | see section 3 |
| `/behind-the-scenes/` | (footer) | How the proposal is made: team, rounds, checks, versions | table of roles, link to round files and `/version.json` |
| `/use-with-ai/` | Use with AI (footer) | `llms.txt`, `index.md`, agent instructions | existing page, add /research/ and /d/ |

Primary nav (header, in this order): How it works, Six areas, Plans, Partners, Context, Research, Designs. The brand links home. At the right of the header, a small outline button "Their site ↗" to https://www.sustain-nobility.com.

Footer nav: Behind the scenes, Use with AI, llms.txt, index.md, Designs, Sources (the context page), version.

At 390 px the nav wraps to two rows under the brand (no hamburger, no JS); items keep a 44 px tap height.

### 1.2 Home page, section order

1. **Notice bar** (every page, first element after the skip link): "Proposal, not the official site. A redesign proposal for SUSTAIN-NOBILITY Advisory Ltd, made by AgentiCCells with their agreement. To start the readiness check or get in touch, use sustain-nobility.com ↗."
2. **Hero.** Eyebrow "AI Governance Readiness Check". H1, their words: "If your client's AI caused harm tomorrow, who would be accountable?" One lede sentence (their words): assesses governance maturity, identifies risks, produces practical, defensible outputs in days instead of months. Two buttons, both to their site: "Start the readiness check ↗", "Book a strategy call ↗". Under them, small: "Both open sustain-nobility.com. This proposal takes no assessments, bookings or contact details."
3. **"Three things you can show"**: assess, identify, produce, as three short cards (keep from first pass).
4. **How it works (compact).** The 5-step flow figure at reduced size, with the steps as a list beneath at 390 px. Link "The full flow".
5. **Who it is for.** Two equal cards, SMEs and ecosystem partners, each with one line from their site and one link (Plans; Partners).
6. **Six areas (compact).** The ring figure, plus their paraphrased point that most offerings cover only one of legal compliance, technical controls or policy (marked as a paraphrase, with link). Link "The six areas".
7. **Plan strip.** Four slim cards: plan name, label (Diagnostic, Initial Report, Custom/Scale, Advisory), one line of what you get. Link "Compare the plans".
8. **Why now (evidence).** Three to four dated items from `data/research.json` (for example EU AI Act stages) as a mini timeline, each with a footnote number linking to its source in the page's source list. If research has not confirmed a date, it is not shown.
9. **Closing CTA band.** Full-width deep green. Line (proposal for the writer): "Find out where your AI governance stands." Primary button "Start on sustain-nobility.com ↗", secondary "Talk to them about partner licensing ↗". Both to https://www.sustain-nobility.com.
10. **Sources** (numbered list for item 8 and any quoted line, each with read date).
11. **Footer**: SUSTAIN-NOBILITY Advisory Ltd, registered in England and Wales, registered office 128 City Road, London EC1V 2NX (source: their footer, read 2026-11-18). No personal name until the researcher's sourced fact and Dinis's confirmation; remove the placeholder text. Proposal line, licences, version, footer nav. A row "See five other designs of this proposal" linking /d/.

### 1.3 How the redesign is clearer and more credible, concretely

- **Hierarchy.** One h1 per page that is the question or the page's answer; every section starts with an h2 that names the thing (not a slogan). Body capped at 38rem measure. One primary action per screen, always to their site.
- **Figures do the explaining.** The flow and the six areas become figures on the home page, each with a text twin, so the offer is understood in under a minute without reading prose.
- **Evidence.** Regulation dates appear as a sourced timeline with footnote numbers and read dates, so "defensible" is backed by checkable dates, not adjectives. Their own words are quoted with the link and read date; our summaries are labelled as ours.
- **"What you get" per plan.** Each plan card has three fixed rows: Label, What you get (their list, verbatim), How to start (link to their site). Where they say contact, the card says "To be discussed" and nothing more.
- **The partner case.** A one-to-many figure (one partner, one check, many SMEs) plus three partner types (advisers, law firms, SME consultancies) and the published Partner Licensing words. No partner is named, no numbers shown.
- **Identity facts.** Registered company name, jurisdiction and office in every footer.
- **Honesty markers.** Proposal blocks are dashed and labelled "Proposal"; simulations do not exist on this site.

### 1.4 How it works: the flow figure

Inline SVG, `viewBox="0 0 960 260"`, `role="img"`, `aria-labelledby` title and desc. Five numbered nodes left to right: 1 Assessment ("10-minute diagnostic"), 2 Score ("Governance Score"), 3 Snapshot ("Initial Executive Snapshot Summary"), 4 Report ("30-minute review call, Initial Executive Board Report"), 5 Monitoring ("real-time diagnostics when strategy changes"). A return arc from 5 to 1, labelled "when strategy changes, run again". Two brackets under the nodes: "Essentials: steps 1 to 3", "Professional: adds step 4". Step 5 carries no plan bracket, with the caption: "Their site describes real-time diagnostics when strategy changes; it does not say which plan includes them." At under 600 px a second SVG (`viewBox="0 0 360 620"`, vertical) is shown via `<picture>`-free CSS: two `<svg>` elements, one hidden with `display:none` per media query, both with the same title and desc. The text twin is an `<ol class="steps">` immediately after the figure.

### 1.5 Six areas figure

Inline SVG ring, `viewBox="0 0 640 640"`: a centre disc "One readiness check" and six equal arc segments, each labelled with the area name as published: AI governance; regulatory and legal risk; AI assurance and audit readiness; human rights and ethical safeguards; public policy and emerging regulation; SME operational realities. No area is highlighted (drop the first pass's emphasis on one area, which was our opinion). Text twin: a six-item list; one-line explanations stay labelled "AgentiCCells's plain-language summary".

### 1.6 Plans, exactly as published

| Plan | Label | What you get (their words) | Price row |
|---|---|---|---|
| Essentials | Diagnostic | 10-minute assessment; Governance Score; Initial Executive Snapshot Summary | none (no row) |
| Professional | Initial Report | Everything in Essentials; 30-minute review call; Initial Executive Board Report | none |
| Partner Licensing | Custom, Scale | For SMEs and SME-supporting firms that intend to monitor AI governance | To be discussed |
| Advisory Services | Advisory | (no list published) | To be discussed |

No card is featured. Under the grid: "Plan names and contents as published on sustain-nobility.com, read 2026-11-18. No prices are published." The button row: "Start on their site ↗", "Discuss a plan on their site ↗".

## 2. Visual system for the main design

Refines the first pass's green and gold: gold becomes two tokens (a darker text gold that passes AA, a fill gold for buttons), the hero loses its three-stop gradient for a flat deep green with one subtle rule, and spacing becomes a fixed scale.

### 2.1 Type

- Stacks: serif `"Iowan Old Style", "Palatino Linotype", Palatino, Charter, "Bitstream Charter", Georgia, serif` for h1 to h3 and pull quotes; sans `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` for body and UI; mono `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` for footnote numbers and code.
- Scale (ratio about 1.25, base 18px desktop, 17px at 390 px): `--fs-0: .875rem` (small, captions, footnotes), `--fs-1: 1rem` (body), `--fs-2: 1.25rem` (lede, h3), `--fs-3: 1.563rem` (h2 mobile), `--fs-4: clamp(1.563rem, 2.6vw, 1.953rem)` (h2), `--fs-5: clamp(2rem, 5vw, 3.4rem)` (h1). Line height 1.6 body, 1.15 h1, 1.25 h2/h3. h1 max 20ch; body max 38rem.
- Numerals: `font-variant-numeric: tabular-nums` in timelines and footnotes.

### 2.2 Spacing and shape

`--s-1: .25rem; --s-2: .5rem; --s-3: .75rem; --s-4: 1rem; --s-5: 1.5rem; --s-6: 2rem; --s-7: 3rem; --s-8: 4.5rem; --s-9: 6rem`. Section padding `--s-8` desktop, `--s-7` at 390 px. Page gutter 16px at 390 px, 24px from 768px. Container 72rem. Radius `--r-1: 6px` (inputs, tags), `--r-2: 12px` (cards). Borders 1px `--line`; focus ring 3px.

### 2.3 Colour tokens (contrast against `--paper` measured with the WCAG formula)

| Token | Light | Dark | Use, ratio (light / dark) |
|---|---|---|---|
| `--paper` | #f8f6f0 | #0e1814 | page background |
| `--surface` | #ffffff | #16231e | cards, header, footer |
| `--ink` | #15211c | #ece8dd | text, 15.4 / 14.8 |
| `--ink-soft` | #4a5a53 | #b3aea0 | secondary text, 6.8 / 8.2 |
| `--line` | #d8d2c4 | #2c3c35 | borders, rules (non-text) |
| `--green` | #1f5c46 | #74c7a5 | links, nodes, 7.3 / 9.0 |
| `--green-deep` | #10342a | #0a1310 | hero and CTA band background |
| `--gold-text` | #85601c | #dcb563 | eyebrows, labels, 5.3 / 9.3 |
| `--gold-fill` | #e3bf72 | #dcb563 | primary button fill, ink on it 9.5 |
| `--gold-soft` | #f2e8d0 | #2a2416 | proposal blocks, bands |
| `--notice` | #fff3d1 | #2a2416 | notice bar, ink on it 15.0 |
| `--on-deep` | #ffffff | #ece8dd | text on green-deep, 13.6 |

Dark mode under `@media (prefers-color-scheme: dark)`. On green-deep, buttons use `--gold-fill` with `--ink` light-value text (7.7 against the band edge). Links are always underlined in body text.

### 2.4 Components

- **Notice bar.** `--notice` background, 1px bottom rule, `--fs-0`, a bold "Proposal, not the official site." then the sentence; the link to their site is underlined with ↗. Never dismissable. Same markup in every page and every design.
- **Header.** `--surface`, brand wordmark in the serif with .08em tracking and a small inline-SVG mark (a simple shield-free monogram "SN" in a rounded square, drawn by us; not their logo). Nav as 1.1 above; `aria-current="page"` underlined in `--gold-text`. "Their site ↗" outline button at the right.
- **Hero.** Flat `--green-deep`, a 1px gold rule 3rem long above the eyebrow; h1 white serif; lede `#dfe9e3`; buttons. Right column at 1366 px: the compact flow figure in light strokes. At 390 px the figure moves below the buttons.
- **Figure cards.** `--surface`, `--r-2`, padding `--s-5`; SVG then `figcaption` in `--ink-soft` `--fs-0`; a small "Text version" heading leads the twin list. SVG strokes and fills use classes bound to tokens, so dark mode follows.
- **Plan cards.** Grid `repeat(auto-fit, minmax(15rem, 1fr))`. Top: plan name (serif `--fs-3`), label as a tag in `--gold-text`. Middle: "What you get" with a ticked list (CSS check mark, `aria-hidden`). Bottom pinned: "How to start" with a full-width outline button to their site. "To be discussed" set in the serif italic, never as a price.
- **Source footnotes.** Inline `<sup><a href="#src-3" id="ref-3">3</a></sup>` in mono; a "Sources" `<ol>` at page end, each item: title, publisher, url, "read 2026-11-18", and a back link "↩". Fact cards on /context/ and /research/ carry their source line at the foot with a dashed top rule.
- **CTA band.** Full bleed `--green-deep`, `--s-8` padding, one serif line, two buttons, one small line "Opens sustain-nobility.com".
- **Footer.** Three columns at 1366 px (company facts; proposal and licences; footer nav and version), one column at 390 px.
- **Proposal block.** Dashed `--gold-text` border, `--gold-soft` fill, label "Proposal".

## 3. Five designs under /d/

Every design is one self-contained page at `/d/<slug>/index.html` with its own inline `<style>` (or `/d/<slug>/style.css`), no JS, no shared assets beyond the favicon. Each shows, in its own order: notice bar, headline question, check flow, six areas, four plans, partner case, regulatory timeline (from `data/research.json`, sourced), CTA to their site, sources, footer with company facts and a "Designs" switcher row linking the other four, the chooser and the main site. All words come from the same copy source (`data/copy.json`); only layout and style differ.

### 3.0 The chooser `/d/`

H1 "Five designs of the same proposal"; lede "Same facts, five layouts. Pick one to see the whole page." Five cards in a grid (one column at 390 px). Each card: an inline SVG thumbnail (`viewBox="0 0 160 100"`, `aria-hidden="true"`, drawn from rectangles and lines in that design's palette, showing its signature shape), the design name as the link, a one-line description, and a palette strip of three swatches. A sixth card "Main design" links `/`. Below the grid, a comparison table: design, concept, signature element. An "all on one page" view is left for a later round.

### 3.1 Board Paper (`/d/board-paper/`)

- **Concept.** The proposal written as a paper for a board meeting: the reader is a director asked "who is accountable?". Numbered paragraphs, a summary box, a decision line at the end.
- **Palette.** Light: paper #fbfaf6, ink #1b1b1b, rule #c9c3b6, accent oxblood #7a2430 (9.5). Dark: #161514, ink #e9e5dc, rule #3a3631, accent rose #e8a0a8 (8.7).
- **Type.** Serif throughout: `Charter, "Bitstream Charter", "Iowan Old Style", Cambria, Georgia, serif`; paragraph numbers and margin notes in `ui-monospace, Menlo, Consolas, monospace`. Body 18px, h1 2.2rem, no display sizes.
- **Layout.** A single A4-proportioned column (max 44rem) centred on a slightly darker desk colour, with a 12rem right margin at 1366 px for source notes (at 390 px the notes drop under their paragraph). Header block: "Paper: AI governance readiness. Prepared as a proposal by AgentiCCells." Sections numbered 1 to 7.
- **Signature SVG.** A "summary box" drawn as a ruled form: four rows (Question, Options, Evidence, Next step) with the headline question in the first row; plus a thin "paper edge" fold mark at the top right.
- **Flow.** Paragraph 3 with sub-paragraphs 3.1 to 3.5 and a small horizontal swimlane SVG (five boxes on a rule, plans as brackets underneath).
- **Six areas.** A two-column table "Areas covered by the check", six rows, each with an empty square tick column headed "Covered by one check" (all ticked, since the check covers all six as published).
- **Plans.** "Options for the board": Options A to D in a table, columns Label, What you get, Cost (Essentials and Professional: "not published"; Partner Licensing and Advisory: "to be discussed").
- **Timeline and CTA.** Timeline as an "Annex: dates" table with footnotes. Closing "Recommended next step (proposal)": a single link to their site.

### 3.2 Readiness Dial (`/d/dial/`)

- **Concept.** A dashboard look that shows the shape of the check's output without inventing any result: every gauge is drawn empty and labelled as a frame, not a reading.
- **Palette.** Light: background #f3f5f7, panel #ffffff, ink #0f1b24, teal #0b6e69 (5.6), amber #8a5200 (5.8). Dark: #0b1218, panel #121c24, ink #e6edf2, teal #4fd1c5 (10.1), amber #f0b45a (10.2).
- **Type.** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` with `tabular-nums`; panel labels in `ui-monospace` uppercase at .75rem with .1em tracking.
- **Layout.** A panel grid: 12 columns at 1366 px (header panel with the question spanning 8, a "status" panel spanning 4 that says "Readiness: not yet assessed. Start on sustain-nobility.com ↗"); single column of panels at 390 px.
- **Signature SVG.** A six-segment radial dial, one segment per area, all outlined with no fill and no needle, centre text "Your score appears here after their check". Caption: "Illustration of the output's shape; no score is shown or implied."
- **Flow.** A five-stage progress rail (pills 1 to 5 joined by a line), each pill expanding into a panel below with the step's published detail; monitoring loops back with a small circular arrow icon.
- **Six areas.** The dial itself, with a legend list to its right (below at 390 px).
- **Plans.** Four panels with a "Includes" checklist; Professional's panel shows "Essentials +" as a chip. The timeline is a horizontal "events" strip with date chips and footnote numbers.
- **Risk handled.** No number, percentage or colour scale appears on any gauge.

### 3.3 The Deadline Calendar (`/d/calendar/`)

- **Concept.** An editorial page led by the regulatory timeline: why the question matters now, then what the check does. Strongest use of the research.
- **Palette.** Light: newsprint #f6f3ec, ink #1d1d1f, deep blue #1d3f73 (9.4), marker green #2f6b3a (5.8), rule #cfc8b8. Dark: #121417, ink #ebe7df, blue #8fb3ec (8.6), green #8fd19a (10.3).
- **Type.** Headlines `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` bold at large sizes (h1 up to 4rem); body `system-ui` 18px; dates in `ui-monospace` with tabular numerals.
- **Layout.** At 1366 px a two-column editorial grid: left a sticky vertical date spine (CSS `position: sticky`, no JS), right the story column. At 390 px the spine becomes a horizontal scroller inside its own container (the page itself never scrolls sideways) and the story follows.
- **Signature SVG.** A vertical date spine with ticks for each sourced date in `data/research.json` (for example EU AI Act entry into force and staged application dates, ISO/IEC 42001 publication, UK white paper), each tick with a footnote number, plus a "read 2026-11-18" marker. Dates the researcher has not confirmed are not drawn.
- **Flow.** A second, short horizontal timeline headed "How the check runs", with durations only where published (10 minutes; 30-minute call) and "in days instead of months" quoted with source.
- **Six areas.** A six-column "beat" grid like a newspaper section strip (2 by 3 at 390 px), each area a heading with a rule above.
- **Plans and CTA.** Plans as a boxed sidebar "Four ways in"; CTA as a full-width rule-bordered box "Before the next date: start on sustain-nobility.com ↗" (proposal wording; the writer may soften it so it implies no legal deadline for any reader).

### 3.4 Grid Poster (`/d/grid/`)

- **Concept.** A bold Swiss-style poster: the headline question set very large on a strict 12-column grid; every section is a numbered panel.
- **Palette.** Light: white #ffffff, black #111111, signal red #c42d1a (5.6 on white; white on red 5.6). Dark: #111111, #f2f2f2, red #ff6b55 (6.7).
- **Type.** `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif`; h1 `clamp(2.6rem, 9vw, 7.5rem)`, weight 800, line height 0.95, tracking -0.03em; section numerals 6rem; body 18px regular. Flush left, ragged right, no centring.
- **Layout.** Visible 12-column grid lines in `--line` at 1366 px (decorative, 1px); content snaps to 3, 6 or 9 column spans. At 390 px a 4-column grid; the headline breaks after "tomorrow,".
- **Signature SVG.** A large question mark built from six black squares and one red dot, each square labelled faintly with one area; the red dot is "one check". Alt text names the six areas.
- **Flow.** Five huge numerals 1 to 5 across a ruled row, the step name under each in bold caps, detail in small type; a red return line under the row for monitoring.
- **Six areas.** A 3 by 2 block grid (2 by 3 at 390 px), each block a black-bordered square with the area name; the "most offerings cover one" paraphrase set in red beside it, with source.
- **Plans and CTA.** Plans as four columns divided by heavy rules; CTA as a full-bleed red band, white text "Start on sustain-nobility.com ↗".

### 3.5 Quiet Counsel (`/d/counsel/`)

- **Concept.** A calm consultancy page: generous space, serif text, one idea per screen, the tone of a considered letter.
- **Palette.** Light: stone #f4f1ea, ink #2a2a26, sage #46634f (5.9), clay #94532f (5.3), rule #d9d3c6. Dark: #1a1c19, ink #e8e4d9, sage #a7c4b1 (9.1), clay #e0a483 (8.0).
- **Type.** `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif` for all text, 19px body, line height 1.7; small caps (`font-variant: small-caps`) for labels; h1 2.6rem regular weight, not bold.
- **Layout.** A single centred column of 36rem with wide margins; sections separated by a short centred sage rule and `--s-9` space. Pull quotes of their published words, hung in the left margin at 1366 px.
- **Signature SVG.** A single continuous line drawn as a loop: five small circles on a closed curve (the flow), the loop closing from monitoring back to assessment. Thin 1.5px sage stroke; with `prefers-reduced-motion: no-preference` the line draws once on load via CSS `stroke-dashoffset` animation (static otherwise).
- **Flow.** The loop itself, with the five steps as a quiet numbered list beneath.
- **Six areas.** Six short paragraphs in two columns at 1366 px, each opening with the area name in small caps and clay; a hexagonal outline with six vertices, each labelled, introduces them.
- **Plans and CTA.** Plans as four "letters" with a ruled top edge; CTA as one sentence and one text link "Begin on sustain-nobility.com ↗", centred.

### 3.6 How the five differ (summary)

| Slug | Form | Type | Lead element | Flow | Six areas |
|---|---|---|---|---|---|
| board-paper | document | serif + mono | summary box | numbered paragraphs + swimlane | tick table |
| dial | dashboard | sans + mono | empty six-segment dial | progress rail of pills | dial segments |
| calendar | editorial | serif headlines | sourced date spine | short second timeline | beat strip |
| grid | poster | heavy grotesque | question mark of six squares | giant numerals | 3 by 2 blocks |
| counsel | letter | serif only | single-line loop | the loop | hexagon + paragraphs |

## 4. Accessibility and layout requirements

- Contrast WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text, UI borders and SVG strokes that carry meaning. Every pair above was measured; the developer re-checks with the validator or a script and records results in `team/rounds/2/build/`.
- Every page and design: `lang="en-GB"`, skip link, one h1, landmarks (`header`, `nav`, `main`, `footer`), notice bar inside `header` or before it with `role="region" aria-label="Proposal notice"`.
- Focus: `:focus-visible` 3px solid ring in the design's accent with 2px offset, visible on both themes; never removed. Tab order follows reading order.
- Figures: `role="img"` with `<title>` and `<desc>`, plus a text twin (list or table) in the DOM, not hidden from screen readers. Decorative SVG (thumbnails, grid lines) `aria-hidden="true"`.
- Text in SVG uses system font stacks and is real `<text>`, at least 14px effective at 390 px; where it would be smaller, the mobile SVG variant is used.
- Widths: checked at 390 px and 1366 px (also 768 px). No horizontal page scroll at 390 px; 16px gutters; tap targets at least 44 by 44 px.
- Motion: only the Quiet Counsel line draw and hover transitions, all inside `@media (prefers-reduced-motion: no-preference)`.
- No JS needed for any content or navigation. No forms (validator rule). No third-party requests: no web fonts, no CDNs, no images from their site.
- Dark mode via `prefers-color-scheme` on every page and design.
- External links marked with ↗ in text and announce "(opens sustain-nobility.com)" via visually hidden text on buttons.

## 5. Risks and how the designs avoid them

| Risk | Mitigation |
|---|---|
| A design is mistaken for their official site | Notice bar on every page and design, never dismissable; "proposal" in every `<title>`; footer states "made by AgentiCCells with their agreement"; domain is agenticcells.site; no logo or image of theirs; our monogram is our own drawing. |
| Readers try to take the check here | No forms; every action button opens https://www.sustain-nobility.com and says so. |
| Invented claims (clients, results, partners, prices) | No testimonials, logos of clients, counts or prices anywhere; partner figure says "illustration"; plans show "To be discussed" only where they say so, and nothing where they publish no price. |
| The dashboard design implies a score | Dial drawn empty, no numbers or colour scale, caption says no score is shown or implied. |
| The calendar design implies legal advice or a deadline for the reader | Dates only from `data/research.json` with sources and read dates; "not legal advice" line; CTA wording reviewed by the writer to avoid "you must". Unconfirmed dates (for example any changes proposed in the Commission's digital omnibus) are shown only as "status to be checked" with source. |
| Highlighting one plan or one area reads as their recommendation | No featured plan, no highlighted area in any design. |
| Naming a person | The founder placeholder is removed; a person is named only from a sourced research fact and after Dinis confirms. |
| A design name imitates a real brand | Names are descriptive common words (Board Paper, Readiness Dial, Deadline Calendar, Grid Poster, Quiet Counsel); the reviewer checks for clashes before build. Board Paper uses no government crest, classification marking or departmental style. |
| Their paraphrased words read as quotes | The "only one of legal, technical or policy" point is labelled a paraphrase with link; verbatim words go in quotation marks with source. |

## 6. For the developer and writer (proposal)

- Build all pages from `data/copy.json` and `data/research.json` so the five designs cannot drift from the main site.
- Add `/research/`, `/d/`, five `/d/<slug>/`, `/behind-the-scenes/`; update `llms.txt` and `index.md` with the new pages.
- Rename nav label "What makes it different" to "Six areas"; remove the featured plan; add the Partner Licensing wording and the registered office.
