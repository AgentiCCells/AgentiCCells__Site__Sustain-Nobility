# SUSTAIN-NOBILITY (redesign proposal)

A redesign proposal for SUSTAIN-NOBILITY Advisory Ltd, AI governance readiness for SMEs and their advisers, made by AgentiCCells with their agreement. It is not their official site: every action links to https://www.sustain-nobility.com.

- Live at https://sustain-nobility.agenticcells.site (version at /version.json).
- Pages: home, how it works, six areas, plans, partners, context, research, five designs under /d/, behind the scenes, use with AI (`llms.txt`, `index.md`), 404.
- Sources of truth: `src/` (hand-written pages and style), `data/research.json` (sourced facts, each with URL and read date), `data/copy.json` (words, with fact ids).
- Generated at build time into `_site/`: `/research/` and the timelines (`scripts/generate.mjs`), `/d/` (`scripts/designs.mjs`), `/behind-the-scenes/` (`scripts/behind.mjs`, from `team/` and git log).
- Team and rounds: `team/` (roles, policies, workflow, round reports, hand-over).
- Release: `scripts/release.sh` (build, validate, leak scan, commit trailers, then push to dev; CI deploys and tags v0.1.N).

Licences: code Apache-2.0; text CC BY 4.0.
