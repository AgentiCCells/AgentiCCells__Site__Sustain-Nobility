# Round 4 copy notes

Writer: writer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Additions to `data/copy.json` for `team/rounds/4/design/PROPOSAL.md` (the designs picker, the main "Evidence Seal" direction and the five designs). Not committed. `board/HOLD.md`: absent.

Dinis Cruz, 2026-11-18 ~09:30 UTC: "Hi can you do a couple more rounds of design work on this site , since they don't look as good as the other ones we have done on hub.agenticcells.site also the five designs should be selectable and visiable in that nice popup window which gives a view of those designs (and their names/logic) in one go"

Read: `CLAUDE.md`, `team/writer/ROLE.md`, `team/rounds/4.md`, `team/rounds/4/design/PROPOSAL.md`, `data/copy.json`, `team/rounds/2/copy/NOTES.md`.

## Rules kept
- Additive only. No quote, plan, area, fact id or source was changed. The only existing strings changed are our own /d/ wording (title, h1, lede, main card line), as the brief asked.
- Every new string is our own wording about our designs or page furniture. None describes their offer in new terms, and none adds a fact, number, date or claim. "Six" counts our designs (main plus five) or their six published areas (c6), both already in the file.
- Checked: the JSON parses; no U+2014 or U+2013; none of the validator's hype words; `node scripts/validate.mjs` prints OK.

## Keys added or changed

| Key | Value or purpose | Note |
|---|---|---|
| `designs[].idea` (5) | Board Paper "a board meeting paper"; Readiness Dial "an empty dashboard"; Deadline Calendar "led by the sourced dates"; Grid Poster "a strict grid poster"; Quiet Counsel "a calm letter" | 2 to 5 words for the dialog card. The proposal's "a poster on a strict grid" was six words, so shortened. |
| `designs_page.title` | "Six designs: SUSTAIN-NOBILITY (redesign proposal)" | Changed; still contains "proposal". |
| `designs_page.h1` | "Six designs of the same proposal" | Changed. |
| `designs_page.lede` | "Same facts, six designs: the main design and five others. Pick one to see the whole page." | Changed; says Main now counts as one of the six. |
| `designs_page.main_card.slug`, `.short_name`, `.idea`, `.signature` | "main"; "Main"; "an evidence seal, the default"; "A seal of six equal segments, one per area, around one Readiness Check." | Added so /d/ can show Main like the other five. `name` stays "Main design" for existing uses; the picker and strip should use `short_name` or `picker.main.name`. |
| `designs_page.main_card.line` | "The full proposal site, in deep green and brass, drawn around one seal of six areas." | Changed from "green and gold" to match the round 4 palette. If the seal is not built, revert this line and the idea to "green and gold, the default". |
| `designs_page.table_caption` | "How the six designs differ" | Replaces the hard-coded "How the five designs differ" in `scripts/designs.mjs` (developer). |
| `designs_page.idea_label`, `.thumb_note` | "Idea"; "Each picture is a screenshot of the design's first screen." | For the /d/ cards. |
| `picker` (new object) | `chip` "Designs"; `title` "Six designs, the same facts"; `strip_label` "Same facts, six designs:"; `strip_aria` "Designs of this proposal"; `showing` "Showing"; `close` "Close"; `close_aria` "Close designs"; `foot_link` "All six designs on one page, with their concepts" to /d/; `main` {slug "main", name "Main", idea "an evidence seal, the default", href "/"}; `order` of the six slugs | Dialog title follows the conductor's brief ("Six designs, the same facts"); the proposal's mark-up had "Same facts, six designs" there, which is now the strip label. |
| `home.show_label` | "AgentiCCells's summary" | One group label for the Assess, Identify, Generate band (proposal 2.4.3). Each item keeps its `label` and `fact_ids`; the generator shows the group label once instead of per card. `show_label_note` explains this for the developer. |
| `home.seal` | `svg_title` "Six areas, one Readiness Check"; `svg_desc` lists the six area names exactly as in `areas`; `centre` "One Readiness Check"; `sub` "Six areas"; `legend_label` "The six areas, as their home page lists them" | Hero seal (2.4.1). No segment highlighted. |
| `home.why_now_ruler` | `title` "Sourced dates on a line of years"; `read_marker_label` "Read"; `scroller_label` "Dates from the sources, scrollable" | Horizontal ruler at 1366 (2.4.8). Dates still come from research.json only. |
| `plans_page.no_label` | "No label published on their site." | For the ledger's empty label cell (Advisory Services has `label: null`), visually a dash rule, read aloud as this. |
| `design_text.board_paper.paper_title`, `.meta`, `.margin_notes_label` | "Paper: AI governance readiness"; Prepared by AgentiCCells, Status Proposal; "Source notes" | Board paper header block. |
| `design_text.dial.channels`, `.readout_empty` | ["Areas", "Flow", "Plans"] (generator adds 01 to 03); "No reading shown" | Dial panel labels and empty readout tiles. |
| `design_text.counsel.opening`, `.sign_off` | "AI governance readiness, a proposal"; "Made by AgentiCCells with their agreement" | Letter opening and sign-off. |
| `design_text.shared.source_note_label`, `.source_note_sr` | "Source"; "Source note: see Sources" | Superscript note that replaces the "(SUSTAIN-NOBILITY home page, read 2026-11-18)" line under each design headline (3a). |

Already in the file and reused, not duplicated: the flow's return arc and brackets (`flow.return_label`, `flow.brackets`), the ledger row labels (`plans_page.row_labels`), `areas_page.centre`, `design_text.calendar.scroller_label`, `home.cta.title`, `notice`.

`home.designs_row` ("See five other designs of this proposal") is still true (five besides the one you are on) and is unchanged.

## For the reviewer
- The proposal asks whether colouring and italicising "accountable?" in their headline is acceptable. The words are unchanged; that is a design and review decision, not a copy change.
