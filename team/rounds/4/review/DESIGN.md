# Round 4 design review: SUSTAIN-NOBILITY

Reviewer: reviewer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Reviewed: `team/rounds/4/design/PROPOSAL.md` and `hero-main.svg` against `CLAUDE.md`, `team/rounds/4.md`, `team/reviewer/POLICY.md`, `data/copy.json` and my round 2 conditions G1 to G8, which still bind. `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

## Amendment to G8 (fonts)
G8 said "No web fonts, CDNs or images from their site". Its aim was no third-party requests and nothing taken from their site. I amend it to allow self-hosted SIL OFL 1.1 fonts under condition 6 below. Everything else in G8 stands.

## Verdicts

| # | Change | Verdict | Conditions |
|---|---|---|---|
| 1 | Critique (section 0) | pass | Measurements, not facts about the company; nothing from it goes on a page. |
| 2 | Designs chip in every header (1.1) | pass with conditions | C3. 390 px header in two rows with nav scrolling inside its own region, no page scroll; links and chip 44 px high. Keep the visible "Proposal" tag beside the wordmark at every width (G2). |
| 3 | Strip "Same facts, six designs" (1.2) | pass with conditions | Links 44 px tall at 390 px (G8), at least 24 px with spacing at 1366 px. Strip sits after the notice, never before it. Names exactly as `copy.json designs[]`. |
| 4 | Dialog picker (1.3) | pass with conditions | C3. |
| 5 | Thumbnails, `scripts/shots.mjs` (1.4) | pass with conditions | Only our own built pages from `_site/` on 127.0.0.1; no image, logo or photo from their site or the model sites in the repository. Each shot includes the notice bar. Regenerate whenever a design changes; the proposed validator check (six files, width, height, alt on every `<img>`) is accepted as an added check. Playwright stays a local dev tool, not a runtime dependency. |
| 6 | /d/ chooser with screenshots (1.5) | pass with conditions | Same image rules as 5; names linked as text, images `alt=""`. "Main now counts as one of the six" is proposal wording for the writer. |
| 7 | "Evidence Seal" motif (2, 2.4.1) | pass with conditions | C1. Name changes. |
| 8 | Headline: brass italic "accountable?" (2.4.1) | fail | C2. |
| 9 | c7 quote in two colours (2.4.2) | fail | C2. Set the whole quote in one colour; size and italic across the whole quote are fine. |
| 10 | Fonts and budget (2.1, section 3 table, 4) | pass with conditions | C4. |
| 11 | Palette (2.2) | pass with conditions | Developer re-measures every pair in both themes, including SVG strokes and brass on `--deep`, and in forced-colours mode; record in `team/rounds/4/build/`. |
| 12 | Notice bar restyle (2.3) | pass with conditions | C5. |
| 13 | Home sections 2 to 11 (2.4) | pass with conditions | Assess/Identify/Generate: one "AgentiCCells's summary" label must visibly cover all three items (G5). Flow: return label and brackets only from `copy.json flow` (fact c9, c10); keep the caption that no plan is stated for step 5. Ledger: an empty cell carries text "Not published on their site" (visible or visually hidden), not a bare dash that reads as "none"; no plan highlighted; prices exactly as `copy.json`. Why now ruler: years and ticks computed from `research.json` only (G6), no hardcoded range; "This is not legal advice." under it. Area tiles: each fills only its own segment, all six identical in treatment. |
| 14 | Inner pages (2.5) | pass with conditions | The ring glyph only on /different/ (areas) and the home hero; not as a repeated corner glyph on every inner page, where it starts to act as a logo (C1). |
| 15 | Shared fixes for designs (3 a to e) | pass with conditions | (a) the superscript is a link with an accessible name ("Source 1") to a Sources entry holding title, URL and read date (G4); quotation marks stay round every quoted line. |
| 16 | Board Paper (3) | pass with conditions | Round 2 change 20 stands. Meta table: "Prepared by: AgentiCCells (proposal)", "Status: Proposal"; never SUSTAIN-NOBILITY as author. No crest or classification marking. |
| 17 | Readiness Dial (3) | pass with conditions | Drop the empty readout bars and the 10 degree tick scale: both read as a meter waiting for a score (round 2 change 21: no number, needle, scale or status colour). Segment outlines and area numbers only. Centre shows the full `design_text.dial.status_text`. |
| 18 | Deadline Calendar (3) | pass with conditions | Ruler years only from `research.json` (G6); round 2 change 22 scroller rules apply. |
| 19 | Grid Poster (3) | pass with conditions | Section numerals are ordinals only, `aria-hidden`; hairlines and outlined numerals meet 3:1 if they carry meaning, else decorative. |
| 20 | Quiet Counsel (3) | pass with conditions | Sign-off in plain text: no script or handwritten face, no personal name, no drawn signature; it must not read as SUSTAIN-NOBILITY signing or endorsing. Line `aria-hidden` with steps in text, as proposed. |
| 21 | Budgets and rules (4) | pass | |
| 22 | Round 5 plan (5) | pass | Item 7 (forced colours) is required in round 4, not deferred. |

## C1 The ring motif (change 7)
Their Disclaimer (fact c23, read 2026-11-18) says nothing on their site is "audit, assurance, certification or a guarantee of compliance". A drawn seal next to their name could read as a certification, accreditation or their logo, implying exactly what they disclaim. Allowed only as a labelled figure of the six areas:
- Call it "six-area ring" in code, copy and captions; never "seal", "stamp", "badge", "certified", "verified" or "approved".
- No circular or curved text, no tick or check mark, no ribbon, star, laurel, crest, serrated or perforated edge; drop the dotted outer ring in the mock-up.
- Not in the header, wordmark, favicon, social image, notice, footer or beside a CTA button; never as a standalone small mark.
- Visible caption under it, from the writer: "AgentiCCells's drawing of the six areas their Readiness Check covers. Not a mark, logo or certification of SUSTAIN-NOBILITY." Keep the `role="img"` name and the six-name description; no segment filled in the hero.

## C2 Their quoted words
Their headline and quotes are verbatim (G4). Changing the colour or style of one word adds emphasis they did not give. Set each quote in one colour and one style throughout; scale, weight and italic applied to the whole quote are fine. The H1 keeps its quotation marks (or a "quote" label) and source note; the mock-up omits both and must not be built as drawn.

## C3 Picker accessibility
`<dialog>` with `aria-labelledby`, opened by `showModal()` (background inert, Esc native), close button with visible text, backdrop click closes, focus moves into the dialog and returns to the opener on every `close` event. Without JS or without `HTMLDialogElement` the chip is a plain link to /d/: add `aria-haspopup="dialog"` and `aria-controls` from the script only, not in the HTML. Current card: `aria-current="page"` plus visible "Showing". No `<form>`. Scroll inside the dialog at 390 px; transition only under `no-preference`. Thumbnails of our own pages only (change 5).

## C4 Fonts
Only the listed `@fontsource` packages (all SIL OFL 1.1), version pinned in `package-lock.json` as actually installed, woff2 files copied unmodified by `scripts/fonts.mjs`, served from `/assets/fonts/`. Each package's `LICENSE` in `/assets/fonts/LICENSES/`, and package, version, files and licence in README "Third-party material". No Google Fonts or other external font, CSS or script request. At most 3 families and under 100 KB of fonts per page, measured on the built pages (Quiet Counsel's estimate must be measured).

## C5 Notice bar
Exact `copy.json notice` sentence, which matches G1, with the link; first after the skip link; `role="region" aria-label="Proposal notice"`; not dismissible, not sticky-hidden, never truncated or clipped (no ellipsis or fixed height that cuts text at 390 px). On the home page the notice and the `--deep` header must not merge into one band: keep a visible boundary (brass rule or contrasting ground) so the notice reads as our statement, not their branding. AA contrast in both themes.

## Nothing invented
The proposal adds no fact; idea lines for the picker are proposal wording for the writer. Every number on the built pages traces to `copy.json` or `research.json`.
