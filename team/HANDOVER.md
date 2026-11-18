# Hand-over: SUSTAIN-NOBILITY redesign proposal

From conductor.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Live: https://sustain-nobility.agenticcells.site (v0.1.14, commit 6df087b, branch dev).

## What was asked
Dinis Cruz, 2026-11-18 ~02:20 UTC: a site for SUSTAIN-NOBILITY "way much better than they have with 5 designs", with "some cool research". The company and its founder agreed (Dinis, ~02:27 UTC).

## What exists
- The team: six roles in `team/` (ROLE.md and POLICY.md each), `team/WORKFLOW.md`, `team/scopes.json`. All ran as sub-agents of this one session; no other session or scheduled task was created.
- Round 1 (v0.1.6): 92 sourced facts in `data/research.json` (public sources only, no social networks), published at /research/. Key EU AI Act dates after Regulation (EU) 2026/1744 checked by the conductor on EUR-Lex.
- Round 2 (v0.1.9, fixed in v0.1.11): the full redesign (headline question, readiness check flow, six-area figure, four plans exactly as published with no prices, partner case, sourced regulatory timelines), five designs under /d/ with a chooser, behind the scenes with every commit, Use with AI, link previews, 404 with the notice.
- Round 3 (v0.1.14): live review fixes; the notice reads once.
- Gates, all stricter than at the start: the validator fails any page without the agreed notice sentence and link, with a form, or with an external link that is not their site, a research source, this site or github.com/AgentiCCells/; a 404 page must exist. Leak scan and commit trailers as before.

## How to change it
- Words: `src/` pages by hand (the developer's page-writing script was a one-off in scratchpad, not kept); `data/copy.json` feeds the five designs.
- Facts: `data/research.json` only; timelines are drawn from facts' `dates` and the build fails if a date is not in its fact's text.
- Release: `scripts/release.sh` (refuses with uncommitted changes; a clean `git worktree` of HEAD works when others are editing).

## Decisions for Dinis or the company
1. Their Terms of Use (served at /accessibility-statement on their site) forbid automated extraction and use of site content for AI without written permission. Does their agreement cover our agents reading and quoting their text? Until confirmed, all quotes stay as published, with links.
2. The founder's name and title: "Monica Maghami, Founder" as their About Us page says (used here), or another form. The Companies House legal name is not shown on the site.
3. Product name: "Readiness Check" (used here) or "Health Check" (also on their site).
4. Which design, if any, they prefer as the main design.
5. Whether to use their logo or images (none used; ask before any are).
6. Whether "Book a strategy call" may stay pointed at their home page (this site never links to their booking tool).

## Known gaps
- F11 on Board Paper and Calendar (see team/rounds/3.md).
- Policy gaps G1 to G3 in every POLICY.md: sub-agents inherit every tool; one signing key for all roles; dev is not protected.
- The factory and Marc Noah repositories could not be attached to this session (the request was refused); their public pages were read instead.
