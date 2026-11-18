# Round 5 build: main design and picker (brief items 1, 4, 5, 6, 10)

Developer: developer.sustain-nobility@AgentiCCells.dinis (main build), 2026-11-18, sub-agent of conductor.sustain-nobility@AgentiCCells.dinis. Built to `team/rounds/5.md` items 1, 4, 5, 6 and 10, from `team/rounds/4/review/LIVE.md`; conditions C1 to C5 in `team/rounds/4/review/DESIGN.md` still bind and were kept. Not committed. `board/HOLD.md`: absent. `scripts/designs.mjs` was not touched (the designs developer's file).

Dinis Cruz, 2026-11-18 ~09:30 UTC: "a couple more rounds of design work on this site".

All measurements below are mine, Playwright Chromium, deviceScaleFactor 1, on the built `_site/` served from 127.0.0.1, 2026-11-18.

## What changed

### 1. Phone header (390 px)
- `src/assets/picker.css`: below 600 px the "Same facts, six designs" strip is hidden (`display: none`). The Designs chip stays in every header and opens the dialog of all six; without JavaScript it is a link to /d/, which lists all six. This applies to every page that loads the picker, designs included.
- `src/style.css`: below 600 px the notice is 12 px with line height 1.42 and less padding. The whole sentence still shows: 85 px tall on main pages, scrollHeight equals clientHeight, no ellipsis or fixed height (C5). It is still first after the skip link, with the brass rule under it.
- Header below 600 px: row 1 is wordmark, Proposal tag (G2) and Designs chip; row 2 is the nav as a full-width row, edge to edge, scrolling sideways with a fade at the end. The "Their site" button is hidden below 600 px and the same link is the last nav item (`li.nav-their`, added to the header in every `src` page; the generated pages copy it from `src/index.html`). From 600 px the button shows and the nav item is hidden.
- Hero and inner page heads start closer under the header below 600 px.
- Result: home H1 top at 231 px (was 357); inner pages and the 404 page at 233 px; header ends at 181 px (was 262).

### 4. Home first screen at 1366 px
- Hero headline `clamp(2.6rem, 5vw, 4rem)`: 68 px (was 84.7 px). Hero columns 3fr / 2fr with the text column aligned to the top (it was centred against the taller ring column, which pushed it down), less top padding, ring 15 percent smaller (25.5rem).
- Result: H1 top at 237 px; the "Start the Readiness Check" button ends at 779 px, inside the first 800 px (was 984).

### 5. Lower home page
- Each band now has a different layout and one strong element: the c7 question set wide at up to 62 px with a thick brass rule, the summary offset right; the three verbs at poster scale on the tint ground; the flow (unchanged) on deep green; "Who it is for" as a compact band with the heading in a side column and the two groups as large names; six areas as an asymmetric split (claim and label in a sticky left column, six tiles in two columns with large serif numerals; all six alike, no area highlighted, C1 untouched); plans ledger (unchanged); the ruler; the founder's name at display size beside "About this proposal".
- Sources: on the page grid (`.src-grid`: heading in the left column, list beside it, from the same left gutter as the header) on home, /plans/, /partners/, /different/ and /how-it-works/. On home they sit before the final band, on the tint ground.
- Ruler (`scripts/generate.mjs`): year labels end at the last dated year (2024 to 2028); the axis still runs to 1 January after it so dates keep their true place. No orphan "2029". In CSS one label level is 8.8rem (the tallest label measured 136 px, 8rem, at 1000, 1366 and 1920 px) and the year row is shorter: ruler list 320 px (was 333 plus a taller year row).
- Close: the final band holds the closing quote on the left and the two buttons on the right, then a compact footer: three columns (company, our statement, footer nav) and a base row with the version, the licence and "See five other designs of this proposal". The licence line and the designs link moved into that row in every `src` page.
- Home page at 1366 px: 8,351 px tall (was 8,940).

### 6. Strip alignment
- `src/assets/picker.css`: the strip's inner row is `box-sizing: content-box; max-width: var(--pk-max, 72rem); padding: 4px var(--pk-pad, 16px); margin: 0 auto; justify-content: var(--pk-align, left)`.
- Variables, for every design to set on `:root` (or any ancestor of the strip):
  - `--pk-max`: the content width of the page's wrapper, without its side padding (default 72rem).
  - `--pk-pad`: the wrapper's side padding (default 16px; may change per breakpoint).
  - `--pk-align`: `left` (default) or `center`.
  - A wrapper `max-width: X; padding: 0 Y; margin: 0 auto` in content-box sets `--pk-max: X; --pk-pad: Y`. A border-box wrapper sets `--pk-max: calc(X - 2 * Y)`.
- The main site sets `--pk-max: calc(76rem - 2 * var(--gutter)); --pk-pad: var(--gutter); --pk-align: left`. Measured: strip content edge equals header content edge at 800 px (28 px), 1366 px (65 px left, 1301 px right) and 1600 px (182 px).

### 10. Picker thumbnails
- `scripts/picker.mjs` keeps `loading="lazy" decoding="async"` in the HTML, so a page that never opens the dialog does not download the six thumbnails. `src/assets/picker.js` switches all six to `loading="eager"` on pointer enter, focus or touch on the chip, and again just before `showModal()`.
- Measured on / at 390 and 1366 px, light and dark: 0 thumbnails loaded before opening; all six loaded (naturalWidth 1280) right after Enter on the chip.

## Checks
- `node scripts/build.mjs`: "picker: chip, strip and dialog on 16 page(s)", "built _site/ (dev)". `node scripts/validate.mjs`: OK. `node scripts/leak-scan.mjs`: OK (111 files, 84 binary skipped).
- No horizontal scroll on /, /how-it-works/, /different/, /plans/, /partners/, /context/, /research/, /use-with-ai/, /behind-the-scenes/, /404.html, /d/ and the five designs, at 390 and 1366 px, light and dark.
- Notice not clipped on any of those 16 pages at either width.
- Picker on / at 390 and 1366 px, light and dark: chip has `aria-haspopup="dialog"` after the script; Enter opens the dialog with focus on Close, six cards; 14 presses of Tab stay inside; Esc closes and focus returns to the chip.
- No em dash and no hype word in the changed files.

## For the conductor
- /d/calendar/ in dark mode at 390 px still shows the strip (`display: block`), so the designs file overrides `.dz-strip` there. That is in `scripts/designs.mjs` (other developer). The /d/ pages' H1 positions at 390 px (Board Paper 315, Dial 276, Calendar 578 to 664, Grid 326, Counsel 324, /d/ 293) are theirs to fix.
- Thumbnails were not retaken (`shots.mjs` not run, as briefed).

## Screenshots (deviceScaleFactor 1)
- `main-home-390.png`: first screen at 390 x 844, light.
- `main-home-1366-dark.png`: first screen at 1366 x 800, dark; the button is in view.
- `main-home-1366-full.jpg`: whole home page at 1366 px, light (JPEG quality 50).
