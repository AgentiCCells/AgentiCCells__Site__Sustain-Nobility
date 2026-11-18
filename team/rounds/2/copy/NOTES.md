# Round 2 copy notes

Writer: writer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Wrote `data/copy.json` for the passed changes in `team/rounds/2/review/DESIGN.md`, under its conditions G1 to G8. Not committed. `board/HOLD.md`: absent.

Read: `CLAUDE.md`, `team/WORKFLOW.md`, `team/writer/ROLE.md`, `team/writer/POLICY.md`, `team/rounds/2/design/PROPOSAL.md`, `team/rounds/2/review/DESIGN.md`, `data/research.json`, `team/rounds/1/research/RESEARCH.md`, `src/*.html`. To copy their words verbatim, I also read the live home page (https://www.sustain-nobility.com) and About Us page (https://www.sustain-nobility.com/home) once each on 2026-11-18. The pages were saved only in the session scratchpad, not in the repository.

## How copy.json is built

- `kind: "quote"` means their words, verbatim, with a `fact_id` from `data/research.json`. `kind: "ours"` means our summary, with a `label` ("AgentiCCells's summary" or "AgentiCCells's note") that the generator must render. Proposals sit only in `proposals.items`, each starting with "Proposal:", for a dashed box labelled "Proposal".
- Line breaks and double spaces inside their HTML were collapsed to single spaces. Nothing else in a quote was changed, typos included.
- Button names in `home.buttons`, `home.cta.buttons`, `plans_page.buttons`, `calendar_cta.button` and `partners.button` point to `actions`. Every action has `href: https://www.sustain-nobility.com`, visible text that names sustain-nobility.com, and an `sr` phrase for visually hidden text (G3).
- No regulatory date, article number or status is typed in. Timelines take their entries from research.json by the fact ids listed in `home.why_now_fact_ids` and `context.timeline_fact_ids` (G6). The only dates in the file are source read dates and the year inside one of their own quotes (p3, see below). Every place that shows dates also carries "This is not legal advice."
- Checks run on the file: valid JSON; no U+2014 or U+2013; none of the validator's hype words; every fact id exists in research.json; every `quote` matches the live capture of their home or About Us page, except c24, which is taken from research.json (Disclaimer page, recorded there as quoted).

## Decisions, with the fact ids behind the words

| Copy | Decision | Fact ids |
|---|---|---|
| `notice`, `notice_short`, `footer.proposal_line` | Both carry "made by AgentiCCells with their agreement" and the G1 sentence "A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com." word for word. The validator's notice regex needs the first phrase followed by "sustain-nobility.com", and both strings satisfy it. | n/a |
| `brand` | Text wordmark plus a "Proposal" tag, "SUSTAIN-NOBILITY, a proposal". No monogram (change 17 failed). Each page `title` contains "proposal" (G2). | n/a |
| `home.eyebrow` | "AI Governance Readiness Check", their product name. | c1, c20 |
| `home.headline` | Their hero question, verbatim. | c1 |
| `home.lede[0]` | The sentence directly under their headline, verbatim. | c2 |
| `home.lede[1]` | Labelled as our summary of their check sentence. Only "in days instead of months" is quoted. Their full sentence reads "assess responsibly governance maturity", and the hero should not repeat that slip, so it is not quoted. | c3 |
| `home.show` | Tags are Assess, Identify and **Generate**. Their published verb is "generate"; "produce" was a paraphrase in round 1 and in c3. The card texts are labelled as our summary. | c3, c6, c9 |
| `home.question` | Their two-line "The question is no longer..." text, verbatim. | c7 |
| `home.audiences` | Their card headings "For SMEs" and "For Ecosystem partners", with each card's line verbatim. | c4 |
| `home.areas_intro`, `areas_page.lead_quote` | The "only one dimension" point is quoted verbatim, as change 7 requires. Their next line, "Real-world AI governance requires all three and more concommitantly.", is left out because of the misspelling and is listed as a proposal fix. | c5 |
| `home.cta.title` | The CTA uses their own question "Can you prove it is governed responsibly?" (quote) in place of the proposal line "Find out where your AI governance stands", so nothing suggests that this site assesses anything (change 10). | c7 |
| `flow.steps` | The step names (Assessment, Score, Snapshot, Report, Monitoring) are ours and labelled as ours. Each step carries the published wording in `published`. Step 5 quotes their fragmentary real-time sentence verbatim, and the caption says no plan is stated for it (change 5). | c9, c10, c24 |
| `flow.h1` | "From a 10-minute assessment to a board report". The number comes from "10-minute Assessment". | c9 |
| `areas` | The six names exactly as their list prints them, in sentence case ("Regulatory and legal risk"). The one-liners are our summaries; `areas_page.summary_label` must show with them. No area is highlighted. | c6 |
| `plans` | Copied from their home page on 2026-11-18: headings, labels, "for" lines and "Includes" lists, with their capitals and abbreviations ("10-minute Assessment", "Everything above", "30-min review call"). Labels: Diagnostic; Initial report; Custom (Scale); Advisory Services has none (`label: null`). Partner Licensing and Advisory Services show "To be discussed" and quote "Contact us to be discussed". Essentials and Professional show "No price published on their site." No plan is featured. A labelled note of ours explains "Everything above". | c9 |
| `partners` | The methodology sentence (their spelling "advisors") is quoted verbatim. Partner types are only the ones they name: advisors, law firms and ecosystem partners (c8), plus "Policy firms and SME consultancy" from the Professional card (c9). The figure is captioned "Illustration", with no count and no named partner. | c4, c8, c9 |
| `context` | All summaries are labelled as ours and carry fact ids. They contain no dates, article numbers or status words; those are rendered from research.json. The disclaimer quotes their own Disclaimer. | f1 to f32 as listed, c17, c23, c24 |
| `dial_caption` | Centre text exactly as change 21 requires: "Their check produces a Governance Score. This page shows none." The status panel says the page assesses nothing, in place of "not yet assessed". | c9 |
| `calendar_cta` | "Start on sustain-nobility.com ↗", with a line saying the dates are context, that whether any applies depends on the reader's situation, and "This is not legal advice." There is no "before the next date" or "you must" (change 22). | n/a |
| `design_text.board_paper` | The options and the recommended next step are labelled "our proposal, not their advice". Cost: "No price published" / "To be discussed" (change 20). | c9 |
| `founder` | "Monica Maghami", title "Founder", based on the About Us words "Founded by Monica Maghami" (p2). Two verbatim About Us lines follow (p5, p3). The founder is named with their agreement (Dinis, 2026-11-18 ~02:27 UTC: "Founder agreed too"). The founder is kept out of the footer (change 12: no personal name in the footer). | p2, p3, p5 |
| `footer` | Company name, "Registered in England and Wales." and "Registered Office: 128 City Road, London, England, EC1V 2NX", as their footer prints them, with a source line. | c28, c30 |
| `proposals.items` | Taken from RESEARCH.md "What this means for the copy". Each starts with "Proposal:" and none contains a date. The "what changed" item refers to fact ids, not dates. | as listed |
| `sources` | One entry per page cited, with url, read date, a main `fact_id` and all `fact_ids` drawn from it. | as listed |

## Readiness Check and Health Check

The copy says "Readiness Check" everywhere (their home page headline product, c1). Their site also says "AI Governance Health Check" on About Us and Our Tool (c20), and the Essentials card reads "AI governance health check for SMEs - initial executive snapshot summary". That card line is kept verbatim because it is their quote. The company should choose one name (see proposals).

## Differences from the review text (their published words win)

The review's change 8 gives plan wording that differs from the live page in small ways. The copy follows the live page:

- Professional label: published "Initial report" (lower-case r), not "Initial Report".
- Professional list: published "Everything above" and "30-min review call", not "everything in Essentials" and "30-minute review call".
- Partner Licensing: published heading "Partner Licensing - Custom (Scale)" and line "For SMEs, and supporting SME firms that intend to monitor AI governance process" (the review had "SME-supporting firms" and no "process").
- Essentials list: published "10-minute Assessment" (capital A).
- Partners: published "advisors", not "advisers"; the review's "SME consultancies" is published as "SME consultancy".

## For the researcher (not my scope; a request)

c3, c5, c6, c8 and c9 are recorded as paraphrased, but the copy quotes them verbatim from the live page. Please add `quote` fields to those facts in `data/research.json` so the quotes trace to a stored capture. The SMEs audience line ("Using AI but unsure about risks...") is also not in c4's `quote`. The exact strings are in `data/copy.json`.

## For the developer

- Render every `kind: "ours"` item with its `label`. Render proposals only in the Proposal box.
- Read `null` label and `null` for in Advisory Services as "show nothing", not "Advisory".
- The `designs` slugs match the proposal: board-paper, dial, calendar, grid, counsel.
- `grid.headline_break_after` is a CSS hint for 390 px only (change 23).

## Dinis or the company must confirm

1. **Terms of Use.** Their Terms forbid scraping and using site content to support AI systems without written permission (c27). Does their agreement cover our agents reading and quoting their site text? This copy quotes it extensively.
2. **Product name.** Readiness Check or Health Check (c20)?
3. **Founder wording.** Is "Monica Maghami, Founder" correct? Third-party pages use "Founder and CEO" (p8) and "CEO and Founder" (p9), and Companies House lists the role Director under another form of the name (p1). The copy uses only the About Us wording. Should the AI for Good line (p3, which includes a year and a number) stay? The Davos 100 Women line (p4) is left out because no public source was found and the two wordings differ (p12).
4. **Wording slips** on their site that the copy avoids quoting: "assess responsibly governance maturity" (c3), "concommitantly" (c5), the fragmentary real-time sentence (c10, quoted as published in flow step 5). Do they want these quoted as is, or corrected on their site first?
5. **The real-time diagnostic** (c10): is it live, and which plan includes it?
6. **Prices**: none are published. Will they be?
7. **Frameworks**: which UK and EU regulators and frameworks the check maps to (c17). The copy names none as theirs.
8. **"BOOK STRATEGY CALL"** (c11): the copy offers "Book a strategy call on sustain-nobility.com", linking their home page, not their booking tool. Is that acceptable to them?
