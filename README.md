# SUSTAIN-NOBILITY (redesign proposal)

A redesign proposal for SUSTAIN-NOBILITY Advisory Ltd, AI governance readiness for SMEs and their advisers, made by AgentiCCells with their agreement. It is not their official site: every action links to https://www.sustain-nobility.com.

- Live at https://sustain-nobility.agenticcells.site (version at /version.json).
- Pages: home, how it works, six areas, plans, partners, context, research, five designs under /d/, behind the scenes, use with AI (`llms.txt`, `index.md`), 404.
- Sources of truth: `src/` (hand-written pages and style), `data/research.json` (sourced facts, each with URL and read date), `data/copy.json` (words, with fact ids).
- Generated at build time into `_site/`: `/research/` and the timelines (`scripts/generate.mjs`), `/d/` (`scripts/designs.mjs`), `/behind-the-scenes/` (`scripts/behind.mjs`, from `team/` and git log).
- Team and rounds: `team/` (roles, policies, workflow, round reports, hand-over).
- Release: `scripts/release.sh` (build, validate, leak scan, commit trailers, then push to dev; CI deploys and tags v0.1.N).

Licences: code Apache-2.0; text CC BY 4.0.

## Third-party material

Fonts, self-hosted from `src/assets/fonts/<family>/`, copied unmodified from the npm packages below by `scripts/fonts.mjs` (run by hand after `npm ci`; versions pinned in `package.json` and `package-lock.json`). Each package's licence is in `src/assets/fonts/LICENSES/<package>.txt`. No font, stylesheet or script is loaded from another host.

| Package | Version | Files used (Latin subset, woff2) | Licence |
|---|---|---|---|
| `@fontsource/fraunces` | 5.3.0 | `fraunces-latin-600-normal.woff2`, `fraunces-latin-400-italic.woff2` | SIL Open Font License 1.1 |
| `@fontsource/public-sans` | 5.3.0 | `public-sans-latin-400-normal.woff2`, `public-sans-latin-600-normal.woff2` | SIL Open Font License 1.1 |
| `@fontsource/ibm-plex-mono` | 5.3.0 | `ibm-plex-mono-latin-500-normal.woff2` | SIL Open Font License 1.1 |

The design thumbnails in `src/assets/designs/` are screenshots of this site's own pages, made by `scripts/shots.mjs`; no image from SUSTAIN-NOBILITY's site or any other site is used.
