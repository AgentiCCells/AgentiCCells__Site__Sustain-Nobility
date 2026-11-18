// Writes the five designs under _site/d/<slug>/ and the chooser at _site/d/index.html,
// from data/copy.json and data/research.json. Run by build.mjs after generate.mjs.
// Node built-ins only; runs on import; cwd is the repository root.
// Stub by conductor.sustain-nobility@ (2026-11-18); written in round 2 by
// developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18, to PROPOSAL.md section 3
// under review conditions G1 to G8 and changes 19 to 25 (team/rounds/2/review/DESIGN.md).
// Rebuilt in round 4 by developer.sustain-nobility@AgentiCCells.dinis (designs build),
// 2026-11-18, to team/rounds/4/design/PROPOSAL.md section 3 under team/rounds/4/review/DESIGN.md
// (changes 15 to 20, conditions C1 to C5). Notes: team/rounds/4/build/DESIGNS.md.
// Second pass in round 5 by the same agent, 2026-11-18, to team/rounds/5.md items 2, 3, 6 to 9
// (critique: team/rounds/4/review/LIVE.md). Notes: team/rounds/5/build/DESIGNS.md.
//
// Rules this file keeps:
// - Every word comes from copy.json or research.json; every regulatory date comes from a
//   research.json fact's "dates" array (G6). No date is typed here.
// - A date whose "what" says it is an original staged date is labelled as replaced by
//   the amending regulation and is not drawn in any figure.
// - Every action links to https://www.sustain-nobility.com and says so (G3). No forms.
// - Their quoted words are set in one colour and one style throughout (review C2).
// - Source notes are superscript links named "Source N: title" to the page's Sources list (change 15).
// - All data is HTML-escaped.
// Contract with scripts/picker.mjs (runs last in the build): every page has the notice
// (class="notice") straight after the skip link, and the marker <!--designs-chip--> inside
// its <header>. The picker adds the "Same facts, six designs" strip after the notice, the
// Designs chip in place of the marker, a <dialog> before </body> and its stylesheet.
// Each page sets --pk-bg --pk-ink --pk-soft --pk-line --pk-accent for the picker.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const C = JSON.parse(readFileSync('data/copy.json', 'utf8'));
const R = JSON.parse(readFileSync('data/research.json', 'utf8'));
const ORIGIN = 'https://sustain-nobility.agenticcells.site';
const THEIRS = 'https://www.sustain-nobility.com';
const CHIP = '<!--designs-chip-->';

// ---------- data access ----------
const F = {};
(function walk(o) {
  if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === 'object') { if (typeof o.id === 'string' && (o.url || o.dates)) F[o.id] = o; for (const k in o) walk(o[k]); }
})(R.sections);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmt = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const fmtShort = iso => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1].slice(0, 3)}`; };
const time = iso => `<time datetime="${esc(iso)}">${esc(fmt(iso))}</time>`;
const NLA = C.not_legal_advice;
// Review change 13: a ledger cell with nothing published carries text, not a bare dash.
const NOT_PUBLISHED = 'Not published on their site.';

function srcInfo(id) {
  const f = F[id];
  if (!f) throw new Error(`designs: unknown fact id ${id}`);
  const s = Object.values(C.sources).find(s => (s.fact_ids || []).includes(id)) || Object.values(C.sources).find(s => s.url === f.url);
  const host = new URL(f.url).hostname.replace(/^www\./, '');
  return { url: f.url, read: f.read, title: s ? s.title : host, publisher: s ? s.publisher : host };
}

// Each page collects the facts it cites, for its Sources list, and numbers its sources in order of first note.
let used, nums;
const begin = () => { used = new Set(); nums = new Map(); C.footer.office_fact_ids.forEach(id => used.add(id)); };
const srcNo = url => { if (!nums.has(url)) nums.set(url, nums.size + 1); return nums.get(url); };
// Change 15 (a): the superscript is a link with an accessible name to a Sources entry with title, URL and read date.
const cite = id => { used.add(id); const s = srcInfo(id); const n = srcNo(s.url); return `<sup class="sn"><a href="#src-${n}" aria-label="${esc(`${C.design_text.shared.source_note_label} ${n}: ${s.title}, read ${s.read}`)}">${n}</a></sup>`; };
// Live review F6: their text holds straight double quotes; inside <q> show them as single quotation marks.
const inner = t => String(t).replace(/"([^"]*)"/g, '‘$1’');
const q = item => `<q>${esc(inner(item.text))}</q>`;
const qc = item => `${item.lead_in ? esc(item.lead_in) + ' ' : ''}${q(item)}${cite(item.fact_id)}`;
const ours = item => { (item.fact_ids || []).forEach(id => used.add(id)); return `<span class="lbl">${esc(item.label)}:</span> ${esc(item.text)}`; };
const sr = t => `<span class="vh"> ${esc(t)}</span>`;
const action = (key, cls = 'btn') => { const a = C.actions[key]; return `<a class="${cls}" href="${esc(a.href)}">${esc(a.text)}${sr(a.sr)}</a>`; };
const actionShort = (key, cls = 'btn') => { const a = C.actions[key]; return `<a class="${cls}" href="${esc(a.href)}">${esc(a.short || a.text)}${sr(a.sr)}</a>`; };
const planStart = (p, cls = 'btn') => `<a class="${cls}" href="${THEIRS}">${esc(p.start)}${sr('(opens their site)')}</a>`;

function sourcesList() {
  const byUrl = new Map();
  for (const id of used) { const s = srcInfo(id); if (!byUrl.has(s.url)) byUrl.set(s.url, s); }
  for (const url of byUrl.keys()) srcNo(url);
  const list = [...byUrl.values()].sort((a, b) => srcNo(a.url) - srcNo(b.url));
  return `<ol class="sources">${list.map(s => `<li id="src-${srcNo(s.url)}"><a href="${esc(s.url)}">${esc(s.title)}</a>, ${esc(s.publisher)}. Read ${esc(s.read)}.</li>`).join('')}</ol>`;
}

// Timeline rows, only from research.json dates arrays (G6).
const REPLACED = 'replaced by Regulation (EU) 2026/1744';
const rows = C.context.timeline_fact_ids
  .filter(id => F[id] && F[id].url && Array.isArray(F[id].dates))
  .flatMap(id => F[id].dates.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.what).map(d => ({ ...d, id, replaced: /original staged date/i.test(d.what) })))
  .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
const current = rows.filter(r => !r.replaced);
const rowSource = r => { used.add(r.id); const s = srcInfo(r.id); return `<a href="${esc(s.url)}">${esc(s.publisher)}: ${esc(s.title)}</a>, read ${esc(s.read)}`; };
const rowWhat = r => `${esc(r.what)}${r.replaced ? ` <strong class="replaced">(original date, ${esc(REPLACED)})</strong>` : ''}`;

// Small helpers for SVG text.
function wrap(text, n) {
  const out = []; let line = '';
  for (const w of String(text).split(/\s+/)) { if ((line + ' ' + w).trim().length > n && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); }
  if (line) out.push(line); return out;
}
const tspans = (lines, x, dy) => lines.map((l, i) => `<tspan x="${x}" dy="${i ? dy : 0}">${esc(l)}</tspan>`).join('');

const D = Object.fromEntries(C.designs.map(d => [d.slug, d]));
const headline = C.home.headline;
const founder = C.founder;
const steps = C.flow.steps;
const plans = C.plans;
const areas = C.areas;
const P = C.partners;
const hFact = headline.fact_id;
const RL = C.plans_page.row_labels;
const two = n => String(n).padStart(2, '0');

// ---------- fonts (self-hosted SIL OFL 1.1 @fontsource files, review C4) ----------
// Files are served from /assets/fonts/<package>/<file>.woff2; the list per design is in DESIGNS.md.
const FONT = {
  plexMono500: ['IBM Plex Mono', 'ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2', 500, 'normal'],
  publicSans400: ['Public Sans', 'public-sans', 'public-sans-latin-400-normal.woff2', 400, 'normal'],
  publicSans600: ['Public Sans', 'public-sans', 'public-sans-latin-600-normal.woff2', 600, 'normal'],
  fraunces600: ['Fraunces', 'fraunces', 'fraunces-latin-600-normal.woff2', 600, 'normal'],
  ss400: ['Source Serif 4', 'source-serif-4', 'source-serif-4-latin-400-normal.woff2', 400, 'normal'],
  ss400i: ['Source Serif 4', 'source-serif-4', 'source-serif-4-latin-400-italic.woff2', 400, 'italic'],
  ss700: ['Source Serif 4', 'source-serif-4', 'source-serif-4-latin-700-normal.woff2', 700, 'normal'],
  cond500: ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed', 'ibm-plex-sans-condensed-latin-500-normal.woff2', 500, 'normal'],
  cond700: ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed', 'ibm-plex-sans-condensed-latin-700-normal.woff2', 700, 'normal'],
  news400: ['Newsreader', 'newsreader', 'newsreader-latin-400-normal.woff2', 400, 'normal'],
  news400i: ['Newsreader', 'newsreader', 'newsreader-latin-400-italic.woff2', 400, 'italic'],
  news600: ['Newsreader', 'newsreader', 'newsreader-latin-600-normal.woff2', 600, 'normal'],
  arch500: ['Archivo', 'archivo', 'archivo-latin-500-normal.woff2', 500, 'normal'],
  arch800: ['Archivo', 'archivo', 'archivo-latin-800-normal.woff2', 800, 'normal'],
  ebg400: ['EB Garamond', 'eb-garamond', 'eb-garamond-latin-400-normal.woff2', 400, 'normal'],
  ebg400i: ['EB Garamond', 'eb-garamond', 'eb-garamond-latin-400-italic.woff2', 400, 'italic'],
  ebg600: ['EB Garamond', 'eb-garamond', 'eb-garamond-latin-600-normal.woff2', 600, 'normal'],
};
const fontFaces = keys => keys.map(k => { const [fam, pkg, file, w, st] = FONT[k]; return `@font-face{font-family:"${fam}";src:url(/assets/fonts/${pkg}/${file}) format("woff2");font-weight:${w};font-style:${st};font-display:swap}`; }).join('\n');
const DESIGN_FONTS = {
  'board-paper': ['ss400', 'ss400i', 'ss700', 'plexMono500'],
  dial: ['cond500', 'cond700', 'plexMono500'],
  calendar: ['news400', 'news400i', 'news600', 'plexMono500'],
  grid: ['arch500', 'arch800'],
  counsel: ['ebg400', 'ebg400i', 'ebg600', 'publicSans400'],
  chooser: ['fraunces600', 'publicSans400', 'publicSans600', 'plexMono500'],
};
const MONO = '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

// ---------- shared page parts ----------
const BASE_CSS_ = `*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--ink)}img,svg{max-width:100%;height:auto}
.vh{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;left:8px;top:-60px;z-index:10;padding:.75rem 1rem;background:var(--ink);color:var(--bg)}.skip:focus{top:8px}
a{color:var(--link)}a:hover{text-decoration-thickness:2px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.notice{font-size:.875rem;line-height:1.5}.notice a{color:inherit;font-weight:700;white-space:nowrap}.notice-in{margin:0 auto}
.sn{font-size:.6em;line-height:0;vertical-align:super;font-weight:400;font-style:normal;letter-spacing:0;margin-left:.08em}.sn a{color:var(--link);text-decoration:none;padding:0 .12em;border-bottom:1px solid currentColor}
.lbl{font-weight:700}.replaced{font-weight:700}
h1 .sn,h2 .sn,.pull .sn{font-size:.34em;margin-left:.15em}
.btn{display:inline-flex;align-items:center;min-height:44px;padding:.55rem 1.1rem;text-decoration:none;font-weight:700;border:2px solid transparent}
.top-r{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .75rem}
.foot-links{display:flex;flex-wrap:wrap;gap:0 1.25rem}.foot-links a{display:inline-flex;align-items:center;min-height:44px}
h1,h2,h3{overflow-wrap:break-word}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media (forced-colors:active){svg text{fill:CanvasText!important;stroke:none!important}svg :is(line,path,polyline){stroke:CanvasText!important;fill:none!important}svg :is(rect,circle,polygon,ellipse){stroke:CanvasText!important;fill:Canvas!important}svg .solid{fill:CanvasText!important}.btn,.their{border:2px solid ButtonText}}`;
// Round 5 (conductor, from the main-site developer): on phones the notice is tighter and the header
// is one row (wordmark over the Proposal tag, then the Designs chip and Their site), so each
// headline starts near 240 px at 390 px. Selectors are specific enough to win over each design's own.
const PHONE_CSS = `@media (max-width:599px){
body .notice{font-size:12px;line-height:1.42;padding-top:.4rem;padding-bottom:.45rem}
header.top .top-in{flex-wrap:nowrap;gap:.5rem;padding-top:3px;padding-bottom:3px}
header.top .brand{flex-direction:column;align-items:flex-start;justify-content:center;gap:1px;font-size:.9rem;letter-spacing:.03em;line-height:1.15;min-width:0}
header.top .tag{font-size:.6rem;padding:0 .3rem}
header.top .top-r{flex-wrap:nowrap;gap:.4rem;margin-left:auto}
header.top .dz-chip{padding:0 .65rem;font-size:.85rem}
header.top .their{padding:0 .6rem;font-size:.82rem;white-space:nowrap}}`;
const BASE_CSS = () => BASE_CSS_ + VFLOW_CSS + PHONE_CSS;

function head({ title, desc, path, css, fonts }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(C.brand.title_suffix)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
${fontFaces(fonts || [])}
${BASE_CSS()}
${css}
</style>
</head>
<body>
<a class="skip" href="#main">${esc(C.nav.skip)}</a>
`;
}

// Live review F2: one notice, the same words as the main site; the link sits on sustain-nobility.com.
// It is the first element after the skip link; the picker's strip goes straight after it.
const noticeText = (() => { const t = C.notice; const i = t.indexOf('sustain-nobility.com'); if (i < 0) throw new Error('designs: notice has no sustain-nobility.com'); return `${esc(t.slice(0, i))}<a href="${esc(C.notice_link.href)}">sustain-nobility.com${sr(C.notice_link.sr)}</a>${esc(t.slice(i + 'sustain-nobility.com'.length))}`; })();
const noticeBar = () => `<div class="notice" role="region" aria-label="Proposal notice"><div class="notice-in">${noticeText}</div></div>`;

const brand = () => `<a class="brand" href="/">${esc(C.brand.wordmark)}<span class="vh">, a proposal</span> <span class="tag">${esc(C.brand.tag)}</span></a>`;
const theirBtn = (cls = 'their') => `<a class="${cls}" href="${esc(C.brand.their_site_button.href)}">${esc(C.brand.their_site_button.text)}${sr(C.brand.their_site_button.sr)}</a>`;
// The header every design shares in structure; each styles it in its own tokens.
const header = (cls = 'top') => `${noticeBar()}
<header class="${cls}"><div class="top-in">${brand()}<span class="top-r">${CHIP}${theirBtn()}</span></div></header>`;

function footer() {
  const ft = C.footer;
  ft.office_fact_ids.forEach(id => used.add(id));
  return `<footer class="foot" id="footer">
<div class="foot-in">
<p><strong>${esc(ft.company)}</strong>. ${esc(ft.jurisdiction)} ${esc(ft.office)}.</p>
<p class="small">${esc(ft.source_line)}</p>
<p>${esc(ft.proposal_line)} <a href="${THEIRS}">sustain-nobility.com ↗${sr('(opens their official site)')}</a></p>
<p class="small">${esc(ft.licences)} <a href="/version.json">${esc(ft.version_label)} __VERSION__</a></p>
<p class="foot-links"><a href="/d/">${esc(C.designs_page.h1)}</a> <a href="/">${esc(C.designs_page.main_card.name)}</a></p>
</div>
</footer>
</body>
</html>
`;
}

function founderBlock(hTag = 'h2', hCls = '', id = '') {
  return `<${hTag}${hCls ? ` class="${hCls}"` : ''}${id ? ` id="${id}"` : ''}>${esc(founder.section_title)}</${hTag}>
<p><strong>${esc(founder.name)}</strong>, ${esc(founder.title)}. ${qc(founder.title_basis)}</p>
${founder.lines.map(l => `<p>${qc(l)}</p>`).join('\n')}
<p class="small">${esc(founder.agreement)}</p>`;
}

function plansNote() { used.add('c9'); return `<p class="small">${esc(C.plans_page.footnote)}${cite('c9')}</p>`; }

// A card: rows that are not published are left out (Calendar, Counsel).
function planBody(p, { showPrice = true } = {}) {
  return `${p.label ? `<p class="plabel">Their label: ${esc(p.label)}</p>` : ''}
${p.for ? `<p class="pfor"><q>${esc(p.for)}</q></p>` : ''}
${p.includes.length ? `<p class="phead">${esc(RL.includes)}</p><ul class="pinc">${p.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
${p.includes_note ? `<p class="small">${ours(p.includes_note)}</p>` : ''}
${p.start_quote ? `<p><q>${esc(p.start_quote)}</q></p>` : ''}
${showPrice ? `<p class="pprice"><span class="phead">${esc(RL.price)}:</span> ${esc(p.price)}</p>` : ''}
<p class="pstart">${planStart(p)}</p>`;
}
// A ledger: the same rows for every plan, in the main site's order; empty cells say so (Dial, Grid).
function planRows(p) {
  const none = t => `<span class="none">${esc(t)}</span>`;
  return `<dl class="prows">
<div><dt>Their label</dt><dd>${p.label ? esc(p.label) : none(C.plans_page.no_label)}</dd></div>
<div><dt>${esc(RL.for)}</dt><dd>${p.for ? `<q>${esc(p.for)}</q>` : none(NOT_PUBLISHED)}</dd></div>
<div><dt>${esc(RL.includes)}</dt><dd>${p.includes.length ? `<ul class="pinc">${p.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : none(NOT_PUBLISHED)}${p.includes_note ? `<p class="small">${ours(p.includes_note)}</p>` : ''}</dd></div>
<div><dt>${esc(RL.price)}</dt><dd>${esc(p.price)}</dd></div>
<div><dt>${esc(RL.start)}</dt><dd>${p.start_quote ? `<p class="squote"><q>${esc(p.start_quote)}</q></p>` : ''}${planStart(p)}</dd></div>
</dl>`;
}

function partnerFigure(id) {
  const sm = [[50, 50], [50, 150], [50, 250], [370, 50], [370, 150], [370, 250]];
  return `<figure class="pfig"><svg viewBox="0 0 420 300" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(P.figure_title)}</title><desc id="${id}-d">${esc(P.figure_desc)}</desc>
${sm.map(([x, y]) => `<line class="f-line" x1="210" y1="150" x2="${x}" y2="${y}"/>`).join('')}
${sm.map(([x, y]) => `<rect class="f-node" x="${x - 42}" y="${y - 24}" width="84" height="48" rx="6"/><text class="f-txt" x="${x}" y="${y + 6}" text-anchor="middle">SME</text>`).join('')}
<circle class="f-hub" cx="210" cy="150" r="66"/><text class="f-hubtxt" x="210" y="146" text-anchor="middle">Partner</text><text class="f-hubtxt f-small" x="210" y="172" text-anchor="middle">one check</text>
</svg><figcaption>${esc(P.figure_caption)}</figcaption></figure>`;
}

function partnerText() {
  return `<p>${qc(P.lede)}</p>
<p>${qc(P.method)}</p>
<p>${ours(P.types_intro)}</p>
<ul class="ptypes">${P.types.map(t => { used.add(t.fact_id); return `<li>${esc(t.name)}</li>`; }).join('')}</ul>
<p>${action(P.button)}</p>`;
}

// A vertical twin of a horizontal flow figure, shown under 600 px so SVG text stays legible.
// Round 3 F11: the twin is a named figure too, so a figure is announced at every width
// (display:none takes the hidden one out of the accessibility tree).
function vflow(k, id) {
  const h = 40 + steps.length * 84 + 40;
  return `<svg class="vflow" viewBox="0 0 360 ${h}" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(C.flow.svg_title)}</title><desc id="${id}-d">${esc(C.flow.svg_desc)}</desc>
<line class="${k.line}" x1="60" y1="40" x2="60" y2="${40 + (steps.length - 1) * 84 + 26}"/>
${steps.map((s, i) => { const y = 40 + i * 84; return `<rect class="${k.box}" x="20" y="${y}" width="250" height="56" rx="${k.rx || 0}"/><text class="${k.n}" x="40" y="${y + 35}">${s.n}</text><text class="${k.t}" x="76" y="${y + 35}">${esc(s.name)}</text>`; }).join('')}
<path class="${k.arc}" d="M270 ${40 + (steps.length - 1) * 84 + 28} C 350 ${40 + (steps.length - 1) * 84 + 28}, 350 68, 274 68"/>
<text class="${k.lt}" x="20" y="${h - 10}">${esc(C.flow.return_label)}</text></svg>`;
}
const VFLOW_CSS = `.vflow{display:none;width:100%;max-width:360px}@media (max-width:600px){.vflow{display:block!important}.hflowsvg{display:none!important}}`;

function stepsList(cls = 'steps') {
  return `<ol class="${cls}">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li><strong>${esc(s.name)}</strong>. Published: <q>${esc(s.published)}</q>${/[.?!]$/.test(s.published) ? '' : '.'} <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</li>`; }).join('')}</ol>`;
}
const flowCaption = () => { C.flow.brackets.forEach(b => used.add(b.fact_id)); return `${esc(C.flow.caption)}`; };

function areasIntro() { return `<p>${qc(C.home.areas_intro)}</p>`; }
// One "AgentiCCells's summary" label covers the three items (review change 13, G5).
function showItems(tag = 'h3', cls = 'show') {
  return C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="${cls}"><p class="stag">${esc(s.tag)}</p><${tag}>${esc(s.title)}</${tag}><p>${esc(s.text)}</p></div>`; }).join('\n');
}
const showLabel = () => `<p class="grouplbl lbl">${esc(C.home.show_label)}</p>`;
const ledeQuote = () => `<p class="lede">${qc(C.home.lede[0])}</p>`;
const ledeOurs = () => `<p class="lede">${ours(C.home.lede[1])}</p>`;
const ledeParas = () => ledeQuote() + '\n' + ledeOurs();
const eyebrow = () => { used.add(C.home.eyebrow_fact_id); return esc(C.home.eyebrow); };
const h1Quote = () => `<q>${esc(headline.text)}</q>${cite(hFact)}`;

function writePage(path, html) {
  if (html.includes('\u2014')) throw new Error(`designs: em dash in ${path}`);
  if (!/<header[^>]*>[\s\S]*<!--designs-chip-->[\s\S]*<\/header>/.test(html)) throw new Error(`designs: no designs chip marker in the header of ${path}`);
  const dir = join('_site', path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}
function pageMeta(d) {
  return { title: `${d.name}: ${C.brand.title_suffix}`, desc: `${d.line} ${C.brand.description}`, path: `/d/${d.slug}/`, fonts: DESIGN_FONTS[d.slug] };
}
// Round 5 (brief item 6): the picker strip reads --pk-max (content width of the header's
// inner box, without padding), --pk-pad (the header's side padding) and --pk-align
// (left or center), so it lines up with each design's own header margin.
const lay = (max, align = 'left') => `--pk-max:${max};--pk-pad:16px;--pk-align:${align}`;
const pk = (bg, ink, soft, line, accent) => `--pk-bg:${bg};--pk-ink:${ink};--pk-soft:${soft};--pk-line:${line};--pk-accent:${accent}`;

// ---------- 1. Board Paper ----------
// A paper for a board meeting: an A4-proportioned sheet on a desk, a ruled meta block,
// the summary box at full sheet width in the first screen, paragraph numbers hanging in
// the left margin and source notes level with their paragraph in the right margin.
function boardPaper() {
  const d = D['board-paper']; const T = C.design_text.board_paper; begin();
  const SERIF = '"Source Serif 4",Charter,"Bitstream Charter","Iowan Old Style",Cambria,Georgia,serif';
  const css = `:root{--bg:#d9d4c7;--paper:#fdfcf8;--ink:#1b1b1b;--soft:#57514a;--rule:#8f877a;--hair:#d6d0c3;--accent:#7a2430;--link:#7a2430;--focus:#7a2430;--deskink:#1b1b1b;${pk('#fdfcf8', '#1b1b1b', '#57514a', '#d6d0c3', '#7a2430')};${lay('68rem')}}
@media (prefers-color-scheme:dark){:root{--bg:#0b0a09;--paper:#181715;--ink:#ebe6dc;--soft:#b3ac9f;--rule:#7d766b;--hair:#3a3631;--accent:#eaa3ab;--link:#eaa3ab;--focus:#eaa3ab;--deskink:#ebe6dc;${pk('#181715', '#ebe6dc', '#b3ac9f', '#3a3631', '#eaa3ab')}}}
body{font:18px/1.6 ${SERIF}}
.mono,.no,.note,.small,.kicker,.meta th,.tag{font-family:${MONO}}
.notice{background:var(--paper);border-bottom:1px solid var(--hair);padding:.55rem 16px}.notice-in{max-width:68rem}
.top{padding:0 16px}.top-in{max-width:68rem;margin:0 auto;padding:.6rem 0;display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:space-between;align-items:center;color:var(--deskink)}
.brand{font-variant:small-caps;letter-spacing:.08em;font-weight:700;color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px}.tag{font-size:.68rem;font-weight:500;border:1px solid currentColor;padding:.1rem .35rem;letter-spacing:.1em;text-transform:uppercase;font-variant:normal}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--accent);background:var(--paper);color:var(--accent);text-decoration:none}
.desk{padding:1rem 12px 4rem}
.paper{position:relative;max-width:68rem;margin:0 auto;background:var(--paper);padding:2rem 18px 2.5rem;box-shadow:0 1px 2px rgba(0,0,0,.14),0 14px 40px rgba(0,0,0,.16)}
@media (min-width:800px){.paper{padding:3.25rem 4rem 3rem 6.5rem}}
.fold{position:absolute;top:0;right:0;width:48px;height:48px}.fold path{fill:var(--bg);stroke:var(--hair)}
.phead{display:grid;gap:1.25rem;border-bottom:4px double var(--ink);padding-bottom:1.5rem;margin-bottom:1.75rem}
@media (min-width:900px){.phead{grid-template-columns:minmax(0,1fr) 21rem;align-items:end;gap:2.5rem}}
.kicker{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin:0}
h1{font-size:clamp(2.25rem,4.8vw,3.75rem);line-height:1.04;letter-spacing:-.015em;margin:.5rem 0 0;font-weight:700;max-width:18ch}
.meta{border-collapse:collapse;width:100%;font-size:.95rem}.meta th,.meta td{border-top:1px solid var(--ink);padding:.45rem 0;text-align:left;vertical-align:baseline}.meta tr:last-child th,.meta tr:last-child td{border-bottom:1px solid var(--ink)}
.meta th{font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--soft);width:8rem;padding-right:.75rem}
.summary{width:100%;border-collapse:collapse;border:2px solid var(--ink);margin:0 0 .6rem}
.sumcap{font:500 .78rem ${MONO};letter-spacing:.14em;text-transform:uppercase;margin:0 0 .5rem;color:var(--soft)}
.summary th{font:500 .8rem ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--accent);text-align:left;vertical-align:top;padding:1.05rem 1rem;width:11rem;border-top:1px solid var(--hair);border-right:1px solid var(--rule)}
.summary td{padding:.85rem 1.1rem;font-size:1.2rem;line-height:1.4;border-top:1px solid var(--hair)}
.summary tr:first-child th,.summary tr:first-child td{border-top:0}
.summary .qrow td{font-size:clamp(1.45rem,2.6vw,2rem);line-height:1.2;font-weight:700;letter-spacing:-.01em;padding:1rem 1.1rem 1.1rem}
@media (max-width:640px){.summary,.summary tbody,.summary tr,.summary th,.summary td{display:block;width:auto}.summary th{border-right:0;padding:.8rem .9rem 0}.summary td{border-top:0;padding:.2rem .9rem .9rem}.summary tr+tr{border-top:1px solid var(--hair)}}
.sumnote{font-size:.85rem;color:var(--soft);margin:0 0 .5rem}
h2{position:relative;font-size:1.45rem;line-height:1.25;margin:2.75rem 0 1rem;padding-top:.8rem;border-top:1px solid var(--rule);display:flex;gap:.75rem}
h2 .no{color:var(--accent);font-size:1rem;padding-top:.3rem;font-weight:500}
@media (min-width:800px){h2 .no{position:absolute;left:-4.5rem;width:3.5rem;text-align:right}}
h3{font-size:1.1rem}
.row{position:relative;margin:0 0 1.15rem}.row p{margin:0}
.row .no{color:var(--soft);font-size:.8rem;margin-right:.5rem}
@media (min-width:800px){.row .no{position:absolute;left:-4.5rem;top:.3rem;width:3.5rem;text-align:right;margin:0}}
.note{display:block;font-size:.8rem;line-height:1.5;color:var(--soft);border-left:2px solid var(--hair);padding-left:.6rem;margin:.4rem 0 0}.note a{color:var(--link)}.note b{color:var(--accent);font-weight:500}
@media (min-width:1100px){.row{display:grid;grid-template-columns:minmax(0,1fr) 13.5rem;gap:2.5rem;align-items:start}.note{margin:.3rem 0 0;font-size:.78rem}}
/* Round 5 (brief item 9): scale varies: one display paragraph, one boxed decision, a compact two-column annex. */
.row.big p{font-size:clamp(1.5rem,2.6vw,2.1rem);line-height:1.22;font-weight:700;letter-spacing:-.01em}.row.big .no{font-size:.8rem;font-weight:500;letter-spacing:0}
.decision{font-size:1.25rem}.decision p:first-child{font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.2;font-weight:700;margin:0 0 .75rem}
.anncols{columns:2 22rem;column-gap:2.5rem;margin:.75rem 0}
.ann{break-inside:avoid;border-collapse:collapse;width:100%;font-size:.88rem;margin:0 0 1.25rem}.ann caption{text-align:left;font:700 1.6rem/1 ${SERIF};padding:.2rem 0 .4rem;border-bottom:2px solid var(--ink)}
.ann th,.ann td{border-bottom:1px solid var(--hair);padding:.45rem .5rem .45rem 0;text-align:left;vertical-align:top}.ann th{font:500 .8rem ${MONO};white-space:nowrap;width:5.5rem;color:var(--accent)}.ann .src{display:block;font-size:.76rem;color:var(--soft)}
.endp{margin:3rem 0 0;padding-top:.6rem;border-top:4px double var(--ink);font:500 .78rem ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--soft);text-align:center}
.small{font-size:.8rem;color:var(--soft)}
figure{margin:1rem 0}figcaption{font-size:.85rem;color:var(--soft)}
.lane{width:100%}.l-box{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}.l-rule{stroke:var(--rule);stroke-width:1.5}.l-n{font:500 15px ${MONO};fill:var(--accent)}.l-t{font:600 18px ${SERIF};fill:var(--ink)}.l-br{fill:none;stroke:var(--soft);stroke-width:1.5}.l-bt{font:14px ${MONO};fill:var(--soft)}.l-arc{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4}
table.t{border-collapse:collapse;width:100%;font-size:.95rem;margin:.5rem 0}
.t th,.t td{border-top:1px solid var(--hair);padding:.6rem .6rem .6rem 0;text-align:left;vertical-align:top}.t thead th{border-top:2px solid var(--ink);font:500 .72rem ${MONO};letter-spacing:.08em;text-transform:uppercase}
.t td p{margin:.3rem 0}.t td.tick{width:7rem;font-family:${MONO};font-size:.85rem}
.t .none{color:var(--soft);font-style:italic}
.tablewrap{overflow-x:auto}
.pinc{margin:.25rem 0;padding-left:1.1rem}
.pfig svg{max-width:30rem}.f-line{stroke:var(--rule);stroke-width:1.5}.f-node{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}.f-txt{font:18px ${SERIF};fill:var(--ink)}.f-hub{fill:var(--paper);stroke:var(--accent);stroke-width:2}.f-hubtxt{font:700 20px ${SERIF};fill:var(--ink)}.f-small{font-weight:400;font-size:17px}
.decision{border:2px solid var(--ink);padding:1.25rem 1.4rem;margin:1rem 0}
.btn{border:1.5px solid var(--accent);color:var(--accent);margin:.25rem .4rem .25rem 0}.btnp{background:var(--accent);color:var(--paper)}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.4rem}
.foot{max-width:calc(68rem + 24px);margin:0 auto 2rem;padding:0 12px;font-size:.9rem;color:var(--deskink)}.foot-in{border-top:1px solid var(--rule);padding:1rem 18px 0}@media (min-width:800px){.foot-in{padding:1rem 4rem 0 6.5rem}}.foot a{color:inherit}.foot .small{font-size:.8rem;color:inherit}`;
  const noteFor = id => { used.add(id); const s = srcInfo(id); const n = srcNo(s.url); return `<b>${n}</b> <a href="${esc(s.url)}">${esc(s.title)}</a>, read ${esc(s.read)}`; };
  const R_ = (no, body, noteId = '', cls = '') => `<div class="row${cls ? ` ${cls}` : ''}"><p><span class="no">${no}</span>${body}${noteId ? cite(noteId) : ''}</p>${noteId ? `<span class="note">${noteFor(noteId)}</span>` : ''}</div>`;
  const valText = ['Four plans, set out as options A to D in section 5.', 'Their published words, and the dated sources in the annex.', T.next_step_text];
  const meta = T.meta.map(m => `<tr><th scope="row">${esc(m.label)}</th><td>${esc(m.value)}${m.label === 'Prepared by' && !/proposal/i.test(m.value) ? ' (proposal)' : ''}</td></tr>`).join('') + `<tr><th scope="row">Sources read</th><td><time datetime="${esc(R.read)}">${esc(fmt(R.read))}</time></td></tr>`;
  const summary = `<p class="sumcap" id="sumcap">Summary box</p><table class="summary" aria-labelledby="sumcap"><tbody>
<tr class="qrow"><th scope="row">${esc(T.summary_rows[0])}</th><td>${h1Quote()}</td></tr>
${T.summary_rows.slice(1).map((l, i) => `<tr><th scope="row">${esc(l)}</th><td>${esc(valText[i])}</td></tr>`).join('\n')}
</tbody></table><p class="sumnote">AgentiCCells's summary of this paper. The question is their published headline.</p>`;
  // flow as a swimlane, with a named vertical twin under 600 px (F11)
  const bx = i => 20 + i * 188;
  const lane = `<figure><svg class="lane hflowsvg" viewBox="0 0 960 200" role="img" aria-labelledby="ln-t ln-d"><title id="ln-t">${esc(C.flow.svg_title)}</title><desc id="ln-d">${esc(C.flow.svg_desc)}</desc>
<line class="l-rule" x1="10" y1="95" x2="950" y2="95"/>
${steps.map((s, i) => `<rect class="l-box" x="${bx(i)}" y="60" width="160" height="70"/><text class="l-n" x="${bx(i) + 12}" y="84">3.${s.n}</text><text class="l-t" x="${bx(i) + 12}" y="114">${esc(s.name)}</text>`).join('')}
<path class="l-arc" d="M${bx(4) + 80} 60 C ${bx(4) + 80} 30, ${bx(0) + 80} 30, ${bx(0) + 80} 56"/><text class="l-bt" x="480" y="22" text-anchor="middle">${esc(C.flow.return_label)}</text>
<path class="l-br" d="M${bx(0)} 150 v10 h${bx(2) + 160 - bx(0)} v-10"/><text class="l-bt" x="${bx(0)}" y="184">${esc(C.flow.brackets[0].text)}</text>
<path class="l-br" d="M${bx(3)} 150 v10 h160 v-10"/><text class="l-bt" x="${bx(3)}" y="184">${esc(C.flow.brackets[1].text)}</text>
</svg>${vflow({ line: 'l-rule', box: 'l-box', n: 'l-n', t: 'l-t', arc: 'l-arc', lt: 'l-bt' }, 'lnv')}<figcaption>${flowCaption()}</figcaption></figure>`;
  const none = t => `<span class="none">${esc(t)}</span>`;
  const opts = plans.map((p, i) => `<tr><th scope="row">${esc(T.options_letters[i])}. ${esc(p.name)}</th><td>${p.label ? esc(p.label) : none(C.plans_page.no_label)}</td><td>${p.for ? `<q>${esc(p.for)}</q>` : ''}${p.includes.length ? `<ul class="pinc">${p.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${p.includes_note ? `<span class="small">${ours(p.includes_note)}</span>` : ''}${p.start_quote ? `<p><q>${esc(p.start_quote)}</q></p>` : ''}${!p.for && !p.includes.length && !p.start_quote ? none(NOT_PUBLISHED) : ''}</td><td>${esc(p.price)}</td></tr>`).join('');
  const annex = rows.length ? `<section aria-labelledby="annex"><h2 id="annex"><span class="no">A</span>${esc(T.annex_title)}</h2>
<p class="small">${esc(C.context.timeline_note)}</p>
<div class="anncols">${[...new Set(rows.map(r => r.date.slice(0, 4)))].map(y => `<table class="ann"><caption>${y}</caption><thead class="vh"><tr><th scope="col">Date</th><th scope="col">What the source says, and the source</th></tr></thead><tbody>${rows.filter(r => r.date.startsWith(y)).map(r => `<tr><th scope="row"><time datetime="${esc(r.date)}">${esc(fmtShort(r.date))}</time></th><td>${rowWhat(r)}<span class="src">${rowSource(r)}</span></td></tr>`).join('')}</tbody></table>`).join('')}</div>
<p><strong>${esc(NLA)}</strong></p></section>` : '';
  const body = `${header()}
<main id="main" class="desk"><article class="paper">
<svg class="fold" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M0 0H48V48Z"/></svg>
<div class="phead"><div><p class="kicker">${eyebrow()}</p><h1>${esc(T.paper_title)}</h1></div><table class="meta"><caption class="vh">About this paper</caption><tbody>${meta}</tbody></table></div>
${summary}
<section aria-labelledby="p1"><h2 id="p1"><span class="no">1</span>The question</h2>
${R_('1.1', q(C.home.lede[0]), C.home.lede[0].fact_id)}
${R_('1.2', ours(C.home.lede[1]), 'c3')}
${R_('1.3', q(C.home.question), C.home.question.fact_id, 'big')}
</section>
<section aria-labelledby="p2"><h2 id="p2"><span class="no">2</span>${esc(C.home.show_title)}</h2>
${R_('2.0', ours(C.home.show_intro), 'c3')}
${C.home.show.map((s, i) => { s.fact_ids.forEach(id => used.add(id)); return R_(`2.${i + 1}`, `<strong>${esc(s.tag)}: ${esc(s.title)}.</strong> <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}`); }).join('')}
</section>
<section aria-labelledby="p3"><h2 id="p3"><span class="no">3</span>${esc(C.flow.title)}</h2>
${R_('3.0', ours(C.flow.intro), 'c9')}
${lane}
<h3 class="vh">${esc(C.flow.twin_heading)}</h3>
${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<div class="row"><p><span class="no">3.${s.n}</span><strong>${esc(s.name)}.</strong> <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p><span class="note">Published: <q>${esc(s.published)}</q>${cite(s.source_fact_ids[0])}</span></div>`; }).join('')}
<p class="small">${esc(C.flow.footnote)}</p>
</section>
<section aria-labelledby="p4"><h2 id="p4"><span class="no">4</span>${esc(T.areas_table_title)}</h2>
${R_('4.1', `${esc(C.home.areas_intro.lead_in)} ${q(C.home.areas_intro)}`, C.home.areas_intro.fact_id)}
<div class="tablewrap"><table class="t"><thead><tr><th scope="col">Area, as published</th><th scope="col">${esc(C.areas_page.summary_label)}</th><th scope="col">${esc(T.areas_tick_head)}</th></tr></thead><tbody>${areas.map(a => { used.add(a.fact_id); return `<tr><th scope="row">${esc(a.name)}</th><td>${esc(a.text)}</td><td class="tick">Yes</td></tr>`; }).join('')}</tbody></table></div>
<p class="small">${esc(C.areas_page.caption)}${cite('c6')}</p>
</section>
<section aria-labelledby="p5"><h2 id="p5"><span class="no">5</span>${esc(T.options_title)}</h2>
<div class="tablewrap"><table class="t"><thead><tr><th scope="col">Option</th><th scope="col">Their label</th><th scope="col">${esc(RL.includes)}</th><th scope="col">${esc(T.cost_head)}</th></tr></thead><tbody>${opts}</tbody></table></div>
${plansNote()}
<p>${actionShort('start')} ${actionShort('call')}</p>
</section>
<section aria-labelledby="p6"><h2 id="p6"><span class="no">6</span>${esc(P.h1)}</h2>
${partnerText()}
${partnerFigure('pf')}
</section>
<section aria-labelledby="p7"><h2 id="p7"><span class="no">7</span>${esc(founder.section_title)}</h2>
${R_('7.1', `<strong>${esc(founder.name)}</strong>, ${esc(founder.title)}. ${q(founder.title_basis)}`, founder.title_basis.fact_id)}
${founder.lines.map((l, i) => R_(`7.${i + 2}`, q(l), l.fact_id)).join('')}
<p class="small">${esc(founder.agreement)}</p>
</section>
<section aria-labelledby="p8"><h2 id="p8"><span class="no">8</span>${esc(T.next_step_title)}</h2>
<div class="decision"><p>${esc(T.next_step_text)}</p><p>${action('start', 'btn btnp')}</p><p class="small">${esc(C.actions.note)}</p></div>
</section>
${annex}
<section aria-labelledby="srcs"><h2 id="srcs"><span class="no">B</span>Sources</h2>${sourcesList()}</section>
<p class="endp">End of paper</p>
</article></main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer());
}

// ---------- 2. Readiness Dial ----------
// An empty dashboard on a dark instrument panel (dark in both colour schemes). The first
// screen is the empty six-segment dial beside the headline. Review change 17: segment
// outlines and area numbers only; no readout bars, tick scale, needle, number or status colour.
function dial() {
  const d = D.dial; const T = C.design_text.dial; begin();
  const SANS = '"IBM Plex Sans Condensed","Arial Narrow","Roboto Condensed",system-ui,-apple-system,"Segoe UI",sans-serif';
  const css = `:root{color-scheme:dark;--bg:#0b1116;--panel:#111a21;--ink:#e8eef2;--soft:#a3b3bf;--line:#2a3945;--stroke:#7d93a3;--seg:#1f2c36;--teal:#5fd4c8;--amber:#f0b45a;--ondark:#04211e;--link:#5fd4c8;--focus:#f0b45a;${pk('#111a21', '#e8eef2', '#a3b3bf', '#2a3945', '#5fd4c8')};${lay('84rem')}}
body{font:17px/1.55 ${SANS};background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:22px 22px}
time,.sn,.num{font-variant-numeric:tabular-nums}
.chan,.tag,.plab,.stag,.chip,.mono{font-family:${MONO};font-weight:500;letter-spacing:.12em;text-transform:uppercase}
.notice{background:#060a0d;border-bottom:1px solid var(--line);padding:.55rem 16px}.notice-in{max-width:84rem}
.top{padding:0 16px}.top-in{max-width:84rem;margin:0 auto;padding:.5rem 0;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between}
.brand{font-weight:700;letter-spacing:.04em;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px;font-size:1.05rem}
.tag{font-size:.7rem;color:var(--amber);border:1px solid var(--amber);border-radius:4px;padding:.1rem .4rem}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--teal);border-radius:6px;color:var(--teal);text-decoration:none;font-weight:500}
.dash{max-width:calc(84rem + 32px);margin:0 auto;padding:8px 16px 16px;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:20px}
@media (min-width:960px){.panel{padding:2rem 2.25rem 2.25rem}}
.panel{position:relative;grid-column:span 12;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:1.25rem 1.3rem;min-width:0}
.panel::before,.panel::after{content:"";position:absolute;top:10px;width:6px;height:6px;border-radius:50%;background:var(--line)}.panel::before{left:10px}.panel::after{right:10px}
.chan{display:block;font-size:.75rem;color:var(--teal);margin:0 0 .6rem}
@media (min-width:900px){.s6{grid-column:span 6}.s3{grid-column:span 3}}
@media (min-width:600px) and (max-width:899px){.s3{grid-column:span 6}}
h1{font-size:clamp(2.2rem,4.3vw,3.6rem);line-height:1.04;margin:.2rem 0 1rem;font-weight:700;letter-spacing:-.01em}
h2{font-size:clamp(1.5rem,2.4vw,2rem);line-height:1.1;margin:0 0 .75rem;font-weight:700}h3{font-size:1.15rem;margin:.2rem 0 .4rem;font-weight:700}
.hero{display:grid;gap:1.5rem;padding:1.5rem 1.3rem 1.75rem}
@media (min-width:960px){.hero{grid-template-columns:minmax(0,5fr) minmax(0,7fr);align-items:center;gap:3rem;padding:2rem 2.5rem}.hero .dialfig{order:-1}}
.lede{margin:.5rem 0;max-width:40rem}.lede:first-of-type{font-size:1.2rem;line-height:1.45}
.small{font-size:.86rem;color:var(--soft)}
.btn{background:var(--teal);color:var(--ondark);border-radius:6px;margin:.25rem .4rem .25rem 0}
.btn2{display:inline-flex;align-items:center;min-height:44px;padding:.5rem 1rem;border:1px solid var(--teal);border-radius:6px;color:var(--teal);text-decoration:none;font-weight:700;margin:.25rem .4rem .25rem 0}
.acts{margin:1.25rem 0 .5rem}
.dialfig{margin:0}.dialfig svg{display:block;width:100%;max-width:30rem;margin:0 auto}
.d-seg{fill:var(--seg);stroke:var(--stroke);stroke-width:1.5}.d-rim{fill:none;stroke:var(--stroke);stroke-width:1}.d-n{font:500 24px ${MONO};fill:var(--ink)}.d-c{font:500 24px ${SANS};fill:var(--ink)}
.dialfig figcaption{font-size:.84rem;color:var(--soft);text-align:center;margin-top:.5rem}
.legend{list-style:none;margin:1rem 0 .5rem;padding:0;display:grid;gap:12px;grid-template-columns:1fr}
@media (min-width:640px){.legend{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:1000px){.legend{grid-template-columns:repeat(3,minmax(0,1fr))}}
.legend li{border:1px solid var(--line);border-radius:6px;padding:1rem 1.1rem 1.1rem;display:grid;grid-template-columns:5rem minmax(0,1fr);gap:.15rem .9rem;align-items:start}
.legend .num{font:500 3.4rem/1 ${MONO};color:var(--teal);grid-row:span 2;letter-spacing:-.04em}.legend strong{font-size:1.2rem;line-height:1.2}.legend span{font-size:.9rem;color:var(--soft)}
.grouplbl{font:500 .75rem ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--soft);margin:.5rem 0 .75rem}
.shows{display:grid;gap:12px;grid-template-columns:1fr}@media (min-width:800px){.shows{grid-template-columns:repeat(3,minmax(0,1fr))}}
.show{border:1px solid var(--line);border-radius:6px;padding:1.1rem 1.2rem}.show p{margin:.3rem 0}.stag{color:var(--amber);margin:0}.show .stag{font:700 clamp(2.2rem,4vw,3.4rem)/1 ${SANS};letter-spacing:-.01em;text-transform:none}
.rail{width:100%;display:block;margin:.75rem 0 1.5rem}.r-line{stroke:var(--stroke);stroke-width:2}.r-pill{fill:var(--panel);stroke:var(--teal);stroke-width:2}.r-n{font:500 18px ${MONO};fill:var(--teal)}.r-t{font:700 19px ${SANS};fill:var(--ink)}.r-loop{fill:none;stroke:var(--amber);stroke-width:2;stroke-dasharray:6 5}.r-lt{font:14px ${MONO};fill:var(--soft)}
.stepgrid{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:1fr}
@media (min-width:900px){.stepgrid{grid-template-columns:repeat(5,minmax(0,1fr))}}
.stepgrid li{border:1px solid var(--line);border-radius:6px;padding:.8rem;font-size:.94rem}.stepgrid .sn2{font:500 .75rem ${MONO};color:var(--teal);letter-spacing:.12em}.stepgrid p{margin:.3rem 0}
.plan h3{font-size:clamp(1.7rem,2.4vw,2.1rem);line-height:1.05;margin:0 0 .6rem}
.chip{display:inline-block;font-size:.7rem;border:1px solid var(--amber);color:var(--amber);border-radius:999px;padding:.1rem .55rem}
.prows{margin:0}.prows div{border-top:1px solid var(--line);padding:.55rem 0}.prows dt{font:500 .7rem ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--soft)}.prows dd{margin:.2rem 0 0}.prows .none{color:var(--soft)}.prows .squote{margin:0 0 .4rem}
.pinc{padding-left:1.1rem;margin:.25rem 0}.pinc li::marker{color:var(--teal)}
.plan .btn{width:100%;justify-content:center;text-align:center}
.pfig svg{max-width:34rem;width:100%;display:block}.f-line{stroke:var(--stroke);stroke-width:2}.f-node{fill:var(--panel);stroke:var(--teal);stroke-width:2}.f-txt{font:700 18px ${SANS};fill:var(--ink)}.f-hub{fill:var(--panel);stroke:var(--amber);stroke-width:2.5}.f-hubtxt{font:700 20px ${SANS};fill:var(--ink)}.f-small{font-weight:500;font-size:17px}
figcaption{font-size:.85rem;color:var(--soft)}
.years{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));margin:.75rem 0}
.yb{border-top:2px solid var(--teal);padding-top:.4rem}.ybig{font:500 clamp(2.6rem,4.5vw,3.8rem)/1 ${MONO};color:var(--teal);margin:0 0 .5rem;letter-spacing:-.04em}
.events{list-style:none;padding:0;margin:0}
.events li{border-top:1px solid var(--line);padding:.6rem 0;font-size:.95rem}.events time{display:inline-block;font:500 .82rem ${MONO};border:1px solid var(--line);border-radius:999px;padding:.1rem .6rem;margin-bottom:.3rem}
.events .src{display:block;font-size:.82rem;color:var(--soft);margin-top:.3rem}
.cta{border-top:3px solid var(--teal)}.cta h2{font-size:clamp(1.9rem,3.2vw,2.8rem);line-height:1.08}.fname{font:700 clamp(1.9rem,3.2vw,2.6rem)/1.05 ${SANS};margin:.25rem 0 .75rem}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{max-width:84rem;margin:0 auto 2rem;padding:0 16px;font-size:.9rem}.foot .small{font-size:.82rem}`;
  // rail (flow), with a named vertical twin (F11)
  const px = i => 95 + i * 192;
  const rail = `<svg class="rail hflowsvg" viewBox="0 0 960 150" role="img" aria-labelledby="rl-t rl-d"><title id="rl-t">${esc(C.flow.svg_title)}</title><desc id="rl-d">${esc(C.flow.svg_desc)}</desc>
<line class="r-line" x1="${px(0)}" y1="60" x2="${px(4)}" y2="60"/>
${steps.map((s, i) => `<rect class="r-pill" x="${px(i) - 84}" y="38" width="168" height="44" rx="22"/><text class="r-n" x="${px(i) - 66}" y="66">${s.n}</text><text class="r-t" x="${px(i) - 46}" y="66">${esc(s.name)}</text>`).join('')}
<path class="r-loop" d="M${px(4)} 82 C ${px(4)} 140, ${px(0)} 140, ${px(0)} 86"/><text class="r-lt" x="480" y="140" text-anchor="middle">${esc(C.flow.return_label)}</text>
</svg>${vflow({ line: 'r-line', box: 'r-pill', n: 'r-n', t: 'r-t', arc: 'r-loop', lt: 'r-lt', rx: 28 }, 'rlv')}`;
  // the dial: six empty outlined segments, area numbers on the rim, the status text in the centre
  const cx = 300, cy = 300, ro = 250, ri = 168, gap = 3;
  const pt = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)].map(n => n.toFixed(1));
  const seg = i => { const a0 = i * 60 + gap, a1 = (i + 1) * 60 - gap; const [x0, y0] = pt(ro, a0), [x1, y1] = pt(ro, a1), [x2, y2] = pt(ri, a1), [x3, y3] = pt(ri, a0); return `<path class="d-seg" d="M${x0} ${y0} A${ro} ${ro} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 0 0 ${x3} ${y3} Z"/>`; };
  const rimNo = i => { const [x, y] = pt(ro + 28, i * 60 + 30); return `<text class="d-n" x="${x}" y="${(+y + 7).toFixed(1)}" text-anchor="middle">${two(i + 1)}</text>`; };
  used.add(C.dial_caption.fact_id);
  const cLines = wrap(T.status_text, 22);
  const dialSvg = `<figure class="dialfig"><svg viewBox="0 0 600 600" role="img" aria-labelledby="dl-t dl-d"><title id="dl-t">${esc(C.areas_page.svg_title)}</title><desc id="dl-d">Six equal segments, all the same neutral tint and none marked, numbered 01 to 06, one per area, clockwise from the top: ${esc(areas.map((a, i) => `${two(i + 1)} ${a.name}`).join('; '))}. Centre text: ${esc(T.status_text)}</desc>
<circle class="d-rim" cx="${cx}" cy="${cy}" r="${ri - 12}"/>${[0, 1, 2, 3, 4, 5].map(seg).join('')}${[0, 1, 2, 3, 4, 5].map(rimNo).join('')}
<text class="d-c" y="${cy - (cLines.length - 1) * 16 + 8}" text-anchor="middle">${tspans(cLines, cx, 32)}</text>
</svg><figcaption>${esc(C.dial_caption.caption)}</figcaption></figure>`;
  const chan = i => `<span class="chan">${two(i + 1)} ${esc(T.channels[i])}</span>`;
  const plansPanels = plans.map(p => { const id = `pl-${p.name.replace(/\W+/g, '-')}`; return `<section class="panel s3 plan" aria-labelledby="${esc(id)}"><span class="chan">Plan</span><h3 id="${esc(id)}">${esc(p.name)}</h3>${p.name === 'Professional' ? `<p><span class="chip">${esc(T.essentials_chip)}</span></p>` : ''}${planRows(p).replace(`<dt>${esc(RL.includes)}</dt>`, `<dt>${esc(T.includes_label)}</dt>`)}</section>`; }).join('\n');
  const events = rows.length ? `<section class="panel" aria-labelledby="ev"><span class="chan">Timeline</span><h2 id="ev">${esc(T.events_title)}</h2><p class="small">${esc(C.context.timeline_note)}</p>
<div class="years">${[...new Set(rows.map(r => r.date.slice(0, 4)))].map(y => `<div class="yb"><p class="ybig" aria-hidden="true">${y}</p><ol class="events">${rows.filter(r => r.date.startsWith(y)).map(r => `<li>${time(r.date)}<br>${rowWhat(r)}<span class="src">${rowSource(r)}</span></li>`).join('')}</ol></div>`).join('')}</div>
<p><strong>${esc(NLA)}</strong></p></section>` : '';
  const body = `${header()}
<main id="main" class="dash">
<section class="panel hero" aria-labelledby="h1"><div><span class="chan">${eyebrow()}</span><h1 id="h1">${h1Quote()}</h1>${ledeQuote()}${ledeOurs()}<p class="acts">${actionShort('start')} ${actionShort('call', 'btn2')}</p><p class="small">${esc(C.actions.note)}</p></div>${dialSvg}</section>
<section class="panel" aria-labelledby="ar">${chan(0)}<h2 id="ar">${esc(C.home.areas_title)}</h2>${areasIntro()}<p class="small">Numbered as on the dial, clockwise from the top. ${esc(C.areas_page.summary_label)} under each name.</p>
<ol class="legend">${areas.map((a, i) => { used.add(a.fact_id); return `<li><span class="num" aria-hidden="true">${two(i + 1)}</span><strong>${esc(a.name)}</strong><span>${esc(a.text)}</span></li>`; }).join('')}</ol><p class="small">${esc(C.areas_page.caption)}${cite('c6')}</p></section>
<section class="panel" aria-labelledby="fl">${chan(1)}<h2 id="fl">${esc(C.flow.title)}</h2><p class="small">${ours(C.flow.intro)}</p>
${rail}
<ol class="stepgrid">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li><span class="sn2">STEP ${s.n}</span><h3>${esc(s.name)}</h3><p>Published: <q>${esc(s.published)}</q></p><p class="small"><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></li>`; }).join('')}</ol>
<p class="small">${flowCaption()} ${esc(C.flow.footnote)}</p></section>
<section class="panel" aria-labelledby="sh"><h2 id="sh">${esc(C.home.show_title)}</h2><p class="small">${ours(C.home.show_intro)}</p>${showLabel()}<div class="shows">${showItems()}</div></section>
<section class="panel" aria-labelledby="pp">${chan(2)}<h2 id="pp">${esc(C.plans_page.h1)}</h2><p class="small">${ours(C.plans_page.intro)}</p>${plansNote()}</section>
${plansPanels}
<section class="panel s6" aria-labelledby="pa"><span class="chan">Partners</span><h2 id="pa">${esc(P.h1)}</h2>${partnerText()}</section>
<div class="panel s6">${partnerFigure('pf')}</div>
${events}
<section class="panel s6" aria-labelledby="fo">${founderBlock('h2', '', 'fo').replace(`<p><strong>${esc(founder.name)}</strong>, `, `<p class="fname">${esc(founder.name)}</p><p>`)}</section>
<section class="panel s6 cta" aria-labelledby="ct"><h2 id="ct">${q(C.home.cta.title)}${cite(C.home.cta.title.fact_id)}</h2><p>${esc(C.home.cta.text)}</p><p>${action('start')} ${action('partner', 'btn2')}</p></section>
<section class="panel" aria-labelledby="sr"><h2 id="sr">Sources</h2>${sourcesList()}</section>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer());
}

// ---------- 3. Deadline Calendar ----------
// An editorial page led by the sourced dates. The first screen is a full-width ruler of
// years computed from research.json (G6): each current date a tick with its list number,
// the read date marked; the replaced date is listed, labelled, and not drawn.
function calendar() {
  const d = D.calendar; const T = C.design_text.calendar; begin();
  const SERIF = 'Newsreader,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif';
  const css = `:root{--bg:#f5f1e8;--card:#fffdf8;--ink:#1b1c1e;--soft:#55524b;--rule:#cfc8b8;--year:#8a7f68;--stroke:#7a7466;--blue:#1d3f73;--green:#2f6b3a;--link:#1d3f73;--focus:#1d3f73;${pk('#fffdf8', '#1b1c1e', '#55524b', '#cfc8b8', '#1d3f73')};${lay('84rem')}}
@media (prefers-color-scheme:dark){:root{--bg:#121417;--card:#1a1d21;--ink:#ece8df;--soft:#b4afa5;--rule:#3a3d42;--year:#6b717a;--stroke:#8a8f97;--blue:#9bbcf0;--green:#8fd19a;--link:#9bbcf0;--focus:#9bbcf0;${pk('#1a1d21', '#ece8df', '#b4afa5', '#3a3d42', '#9bbcf0')}}}
body{font:18px/1.6 ${SERIF}}
.mono,time,.kicker,.tag{font-family:${MONO};font-variant-numeric:tabular-nums}
.notice{border-bottom:3px double var(--rule);padding:.55rem 16px}.notice-in{max-width:84rem}
.top{padding:0 16px}.top-in{max-width:84rem;margin:0 auto;padding:.5rem 0;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem 1rem;border-bottom:2px solid var(--ink)}
.brand{font-weight:600;font-size:1.1rem;letter-spacing:.08em;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px}.tag{font-size:.68rem;font-weight:500;color:var(--green);border:1px solid var(--green);padding:.05rem .35rem;letter-spacing:.1em;text-transform:uppercase}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:2px solid var(--blue);border-radius:4px;color:var(--blue);font-weight:600;text-decoration:none}
.wrapc{max-width:84rem;margin:0 auto;padding:0 16px}
.ruler{margin:0;padding:.9rem 0 .4rem;border-bottom:1px solid var(--rule)}
.rhead{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem 1rem;align-items:baseline;margin:0 0 .25rem}
.rhead h2{font:500 .8rem ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin:0}
.scroller{overflow-x:auto}
.ru{display:block;width:100%;min-width:1100px}
@media (max-width:1100px){.ru{width:1100px}}
.ru-base{stroke:var(--ink);stroke-width:2}.ru-yr{stroke:var(--ink);stroke-width:2}.ru-year{font:600 60px ${SERIF};fill:var(--year);stroke:none;letter-spacing:-.01em}.ru-br{fill:none;stroke:var(--blue);stroke-width:1.5}
.ru-tick{stroke:var(--blue);stroke-width:1.5}.ru-dot{fill:var(--card);stroke:var(--blue);stroke-width:2.5}.ru-lab{font:500 15px ${MONO};fill:var(--ink)}.ru-n{fill:var(--blue)}
.ru-read{stroke:var(--green);stroke-width:2;stroke-dasharray:4 4}.ru-rl{font:500 14px ${MONO};fill:var(--green)}
.ruler figcaption{font-size:.85rem;color:var(--soft);margin:.25rem 0 0}
@media (max-width:599px){.wrapc{display:flex;flex-direction:column}.wrapc>.mast{order:-1}}
.mast{padding:1.1rem 0 1.75rem;border-bottom:1px solid var(--rule);display:grid;gap:1rem}
@media (min-width:1000px){.mast{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:1rem 3.5rem;align-items:end}}
.kicker{font-size:.8rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin:0 0 .5rem}
h1{font-size:clamp(2.3rem,5vw,4.4rem);line-height:1.02;margin:0;font-weight:600;letter-spacing:-.015em}
.mast .lede{font-size:1.1rem;margin:.4rem 0;max-width:34rem}
.ed{display:block}
@media (min-width:1000px){.ed{display:grid;grid-template-columns:22rem minmax(0,1fr);gap:3.5rem}.datecol{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto}}
.datecol{padding:1.5rem 0 1rem}
.datecol h2{font-size:1.4rem;margin:0 0 .25rem}
.small{font-size:.85rem;color:var(--soft)}
.dlist{list-style:none;margin:0;padding:0;counter-reset:n}.dlist li{counter-increment:n;display:grid;grid-template-columns:2rem minmax(0,1fr);gap:.25rem .6rem;padding:.6rem 0;border-bottom:1px solid var(--rule);font-size:.95rem;line-height:1.45}
.dlist li::before{content:counter(n);font:500 .9rem ${MONO};color:var(--blue);padding-top:.1rem}
.dlist time{font-weight:500;display:block}.dlist .src{display:block;font-size:.82rem;color:var(--soft)}
.story{min-width:0;padding-bottom:2rem}.story section{border-top:1px solid var(--rule);padding:1.75rem 0}.story section:first-child{border-top:0}
.story h2{font-size:clamp(1.6rem,3vw,2.3rem);line-height:1.12;margin:.1rem 0 .8rem;font-weight:600}
.story h3{font-size:1.2rem;font-weight:600}
.story p,.story li{max-width:44rem}
.hflow svg.hflowsvg{width:100%}.h-line{stroke:var(--stroke);stroke-width:2}.h-dot{fill:var(--bg);stroke:var(--green);stroke-width:2.5}.h-n{font:500 18px ${MONO};fill:var(--green)}.h-t{font:600 23px ${SERIF};fill:var(--ink)}.h-p{font:16px ${MONO};fill:var(--soft)}.vflow .h-p{font-size:14px}.vflow .h-t{font-size:19px}.hflow{margin:1rem 0}.h-box{fill:var(--bg);stroke:var(--green);stroke-width:2}.h-arc{fill:none;stroke:var(--green);stroke-width:2;stroke-dasharray:5 4}
.steps{padding-left:1.3rem}.steps li{margin:.35rem 0}
.pull{font:italic clamp(1.45rem,2.6vw,2rem)/1.3 ${SERIF};border-left:4px solid var(--blue);padding-left:1.1rem;margin:1rem 0}
.beats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
@media (min-width:1200px){.beats{grid-template-columns:repeat(3,minmax(0,1fr))}}
.beats div{border-top:4px solid var(--ink);padding-top:.5rem}.beats h3{font-size:1.15rem;margin:.1rem 0 .3rem;line-height:1.2}.beats p{font-size:.92rem;margin:0}
.grouplbl{font:500 .78rem ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--soft);margin:.5rem 0}
.shows{display:grid;gap:1rem}@media (min-width:800px){.shows{grid-template-columns:repeat(3,minmax(0,1fr))}}
.show{border-top:2px solid var(--green);padding-top:.4rem}.stag{font:500 .8rem ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin:0}.show h3{margin:.1rem 0 .3rem}.show p{font-size:.95rem}
.side{border:2px solid var(--ink);background:var(--card);padding:1.1rem 1.25rem}
.side h2{border-bottom:1px solid var(--ink);padding-bottom:.4rem}
.pgrid{display:grid;gap:1rem}@media (min-width:800px){.pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.pgrid article{border-top:1px solid var(--rule);padding-top:.5rem}.pgrid h3{margin:0 0 .2rem}
.plabel{font:500 .85rem ${MONO};color:var(--blue);margin:0 0 .3rem}.phead{font-weight:600;margin:.4rem 0 0}.pinc{padding-left:1.1rem;margin:.2rem 0}.pfor,.pprice{margin:.3rem 0;font-size:.95rem}
.btn{border:2px solid var(--blue);color:var(--blue)}
.pfig svg{max-width:28rem}.f-line{stroke:var(--stroke);stroke-width:1.5}.f-node{fill:var(--card);stroke:var(--ink);stroke-width:1.5}.f-txt{font:18px ${SERIF};fill:var(--ink)}.f-hub{fill:var(--card);stroke:var(--blue);stroke-width:2.5}.f-hubtxt{font:600 20px ${SERIF};fill:var(--ink)}.f-small{font-weight:400;font-size:17px}
figcaption{font-size:.85rem;color:var(--soft)}
.ctabox{border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);padding:1.5rem 0;margin:1rem 0}
.ctabox h2 a{color:var(--blue);display:inline-flex;align-items:center;min-height:44px}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{max-width:84rem;margin:0 auto 2rem;padding:0 16px}.foot-in{padding-top:1rem;border-top:2px solid var(--ink);font-size:.9rem}.foot .small{font-size:.82rem}`;
  // the ruler: years from the earliest to the latest current date, positions from the ISO dates
  const numOf = r => rows.indexOf(r) + 1;
  const W = 1300, pad = 24, yB = 126, H = 200;
  const ms = iso => Date.UTC(...iso.split('-').map((n, i) => i === 1 ? n - 1 : +n));
  const y0 = +current[0].date.slice(0, 4), y1 = +current[current.length - 1].date.slice(0, 4);
  const t0 = Date.UTC(y0, 0, 1), t1 = Date.UTC(y1 + 1, 0, 1);
  const X = t => pad + (t - t0) / (t1 - t0) * (W - 2 * pad);
  // Round 5 (brief item 8): dates closer than 32 units share one bracket and one label, so no labels collide.
  const groups = [];
  for (const r of current) { const x = X(ms(r.date)); const g = groups[groups.length - 1]; if (g && x - g.xs[g.xs.length - 1] < 32) { g.rs.push(r); g.xs.push(x); } else groups.push({ rs: [r], xs: [x] }); }
  const rowsY = [40, 68, 96]; const lastEnd = rowsY.map(() => -Infinity);
  const f1 = n => n.toFixed(1);
  const ticks = groups.map(({ rs, xs }) => {
    const nums = rs.map(numOf).join(', ');
    // A shared label carries the numbers only; each date is in the list below with its source.
    const dates = rs.length > 1 ? '' : fmtShort(rs[0].date);
    const x = xs[0], xe = xs[xs.length - 1];
    const w = (nums.length + (dates ? dates.length + 1 : 0)) * 9 + 8;
    let k = lastEnd.findIndex(e => e + 6 <= x); if (k < 0) k = lastEnd.indexOf(Math.min(...lastEnd));
    lastEnd[k] = x + 6 + w;
    const top = rowsY[k] + 7;
    const stems = xs.map(xi => `<line class="ru-tick" x1="${f1(xi)}" y1="${rs.length > 1 ? top + 6 : top}" x2="${f1(xi)}" y2="${yB}"/><circle class="ru-dot" cx="${f1(xi)}" cy="${yB}" r="6"/>`).join('');
    const bracket = rs.length > 1 ? `<path class="ru-br" d="M${f1(x)} ${top + 12} V${top} H${f1(xe)} V${top + 12}"/>` : '';
    return `${stems}${bracket}<text class="ru-lab" x="${f1(x + 6)}" y="${rowsY[k]}"><tspan class="ru-n">${nums}</tspan>${dates ? ` ${esc(dates)}` : ''}</text>`;
  }).join('');
  const years = []; for (let y = y0; y <= y1; y++) years.push(y);
  const xr = X(ms(R.read));
  const rulerSvg = `<svg class="ru" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="ru-t ru-d"><title id="ru-t">${esc(T.spine_title)}</title><desc id="ru-d">${esc(`Years ${y0} to ${y1}. ` + current.map(r => `${numOf(r)}: ${fmt(r.date)}, ${r.what}`).join('. ') + `. ${T.read_marker_label} ${fmt(R.read)}.`)}</desc>
${years.map(y => `<text class="ru-year" x="${(X(Date.UTC(y, 0, 1)) + 10).toFixed(1)}" y="${yB + 64}">${y}</text><line class="ru-yr" x1="${X(Date.UTC(y, 0, 1)).toFixed(1)}" y1="${yB - 10}" x2="${X(Date.UTC(y, 0, 1)).toFixed(1)}" y2="${yB + 18}"/>`).join('')}
<line class="ru-yr" x1="${W - pad}" y1="${yB - 10}" x2="${W - pad}" y2="${yB + 18}"/>
<line class="ru-base" x1="${pad}" y1="${yB}" x2="${W - pad}" y2="${yB}"/>
<line class="ru-read" x1="${xr.toFixed(1)}" y1="6" x2="${xr.toFixed(1)}" y2="${yB}"/><text class="ru-rl" x="${(xr + 8).toFixed(1)}" y="16">${esc(T.read_marker_label)} ${esc(fmtShort(R.read))} ${esc(R.read.slice(0, 4))}</text>
${ticks}
</svg>`;
  // short flow timeline, with a named vertical twin (F11)
  const fx = i => 110 + i * 185;
  const hflow = `<figure class="hflow"><svg class="hflowsvg" viewBox="0 0 960 205" role="img" aria-labelledby="hf-t hf-d"><title id="hf-t">${esc(C.flow.svg_title)}</title><desc id="hf-d">${esc(C.flow.svg_desc)}</desc>
<line class="h-line" x1="${fx(0)}" y1="50" x2="${fx(4)}" y2="50"/>
${steps.map((s, i) => `<circle class="h-dot" cx="${fx(i)}" cy="50" r="16"/><text class="h-n" x="${fx(i)}" y="56" text-anchor="middle">${s.n}</text><text class="h-t" x="${fx(i)}" y="100" text-anchor="middle">${esc(s.name)}</text>${s.published.length < 22 ? `<text class="h-p" x="${fx(i)}" y="${i % 2 ? 152 : 128}" text-anchor="middle">${esc(s.published)}</text>` : ''}`).join('')}
<text class="h-p" x="${fx(4) + 40}" y="190" text-anchor="end">${esc(C.flow.return_label)}</text>
</svg>${vflow({ line: 'h-line', box: 'h-box', n: 'h-n', t: 'h-t', arc: 'h-arc', lt: 'h-p' }, 'hfv')}<figcaption>${flowCaption()}</figcaption></figure>`;
  const flowQ = T.flow_quote;
  const body = `${header()}
<main id="main" class="wrapc">
${rows.length ? `<figure class="ruler" aria-labelledby="ru-h"><div class="rhead"><h2 id="ru-h">${esc(T.spine_title)}</h2><p class="small">${esc(NLA)}</p></div>
<div class="scroller" role="region" aria-label="${esc(T.scroller_label)}" tabindex="0">${rulerSvg}</div>
<figcaption>Numbers match the list of dates below, where each date has its source. Close dates share one bracket. The replaced date is in the list, not on the line.</figcaption></figure>` : ''}
<div class="mast"><div><p class="kicker">${eyebrow()}</p><h1>${h1Quote()}</h1></div><div>${ledeQuote()}${ledeOurs()}</div></div>
<div class="ed">
${rows.length ? `<aside class="datecol" aria-labelledby="dl-h"><h2 id="dl-h">${esc(T.list_title)}</h2><p class="small">${esc(C.context.timeline_note)}</p>
<ol class="dlist">${rows.map(r => `<li><div>${time(r.date)}${rowWhat(r)}<span class="src">${rowSource(r)}</span></div></li>`).join('')}</ol>
<p class="small"><strong>${esc(NLA)}</strong></p></aside>` : ''}
<div class="story">
<section aria-labelledby="why"><h2 id="why">${esc(C.home.why_now_title)}</h2>
<p class="pull">${q(C.home.question)}${cite(C.home.question.fact_id)}</p>
<p>${ours(C.home.why_now_intro)}</p>
</section>
<section aria-labelledby="flow"><h2 id="flow">${esc(T.flow_title)}</h2>
<p>${ours(C.flow.intro)}</p>
${hflow}
<p>Their site says the outputs come <q>${esc(flowQ.text)}</q>${cite(flowQ.fact_id)}.</p>
<h3>${esc(C.flow.twin_heading)}</h3>${stepsList()}
<p class="small">${esc(C.flow.footnote)}</p>
</section>
<section aria-labelledby="show"><h2 id="show">${esc(C.home.show_title)}</h2><p class="small">${ours(C.home.show_intro)}</p>${showLabel()}<div class="shows">${showItems()}</div></section>
<section aria-labelledby="areas"><h2 id="areas">${esc(C.home.areas_title)}</h2>${areasIntro()}<p class="small">${esc(C.areas_page.summary_label)} under each name.</p>
<div class="beats">${areas.map(a => { used.add(a.fact_id); return `<div><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`; }).join('')}</div>
<p class="small">${esc(C.areas_page.caption)}${cite('c6')}</p></section>
<section aria-labelledby="ways"><div class="side"><h2 id="ways">${esc(T.plans_title)}</h2><p class="small">${ours(C.plans_page.intro)}</p>
<div class="pgrid">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planBody(p)}</article>`).join('')}</div>${plansNote()}</div></section>
<section aria-labelledby="part"><h2 id="part">${esc(P.h1)}</h2>${partnerText()}${partnerFigure('pf')}</section>
<section aria-labelledby="fo">${founderBlock('h2', '', 'fo')}</section>
<section aria-labelledby="cta"><div class="ctabox"><h2 id="cta"><a href="${THEIRS}">${esc(C.calendar_cta.title)}${sr(C.actions.start.sr)}</a></h2><p>${esc(C.calendar_cta.text)}</p><p class="small">${esc(C.actions.note)}</p></div></section>
<section aria-labelledby="srcs"><h2 id="srcs">Sources</h2>${sourcesList()}</section>
</div></div>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer());
}

// ---------- 4. Grid Poster ----------
// A poster on a strict, visible 12-column grid in Archivo 800. The six-square question
// mark stands the full height of the headline; every section opens with an outlined
// ordinal (aria-hidden, decorative: change 19) bleeding off the left edge; the red band runs edge to edge.
function grid() {
  const d = D.grid; const T = C.design_text.grid; begin();
  const SANS = 'Archivo,"Helvetica Neue",Helvetica,Arial,system-ui,sans-serif';
  const css = `:root{--bg:#ffffff;--ink:#111111;--soft:#4d4d4d;--line:#e6e6e6;--red:#c42d1a;--band:#c42d1a;--onband:#ffffff;--link:#111111;--focus:#c42d1a;--bsoft:#bdbdbd;--bred:#ff6b55;${pk('#ffffff', '#111111', '#4d4d4d', '#e6e6e6', '#c42d1a')};${lay('calc(90rem - 32px)')}}
@media (prefers-color-scheme:dark){:root{--bg:#111111;--ink:#f2f2f2;--soft:#bdbdbd;--line:#262626;--red:#ff6b55;--band:#b3261e;--onband:#ffffff;--link:#f2f2f2;--focus:#ff6b55;--bsoft:#4d4d4d;--bred:#b3261e;${pk('#111111', '#f2f2f2', '#bdbdbd', '#333333', '#ff6b55')}}}
body{font:500 18px/1.5 ${SANS}}
.notice{background:var(--ink);color:var(--bg);padding:.55rem 16px}.notice-in{max-width:90rem}.notice a{color:var(--bg)}.notice a:focus-visible{outline-color:var(--bg)}
.wrap{max-width:90rem;margin:0 auto;padding:0 16px}
.top{padding:0 16px}.top-in{max-width:calc(90rem - 32px);margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem 1rem;padding:.6rem 0;border-bottom:6px solid var(--ink)}
.brand{font-weight:800;letter-spacing:-.01em;text-transform:uppercase;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px;font-size:1.1rem}.tag{background:var(--red);color:#fff;font-size:.72rem;padding:.15rem .45rem;letter-spacing:.06em}
@media (prefers-color-scheme:dark){.tag{background:var(--band)}}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 1rem;border:3px solid var(--ink);color:var(--ink);font-weight:800;text-decoration:none}
.pg{position:relative;z-index:0;overflow:hidden}
.pg::before{content:"";position:absolute;z-index:-1;top:0;bottom:0;left:max(16px,calc((100% - 90rem)/2 + 16px));right:max(16px,calc((100% - 90rem)/2 + 16px));background:repeating-linear-gradient(to right,var(--line) 0 1px,transparent 1px calc(100%/4));border-right:1px solid var(--line);pointer-events:none}
@media (min-width:1000px){.pg::before{background:repeating-linear-gradient(to right,var(--line) 0 1px,transparent 1px calc(100%/12))}}
.g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
@media (min-width:1000px){.g{grid-template-columns:repeat(12,minmax(0,1fr));gap:24px}}
.c3,.c4,.c6,.c8,.c9,.c12{grid-column:1/-1;min-width:0}
@media (min-width:1000px){.c3{grid-column:span 3}.c4{grid-column:span 4}.c6{grid-column:span 6}.c8{grid-column:span 8}.c9{grid-column:span 9}.c12{grid-column:span 12}}
.hero{padding:2rem 0 2.5rem}@media (max-width:599px){.hero{padding-top:1.1rem}}
.eyebrow{font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin:0 0 1rem;font-size:.95rem}
h1{font-size:clamp(2.6rem,11.4vw,6.4rem);line-height:.94;letter-spacing:-.035em;font-weight:800;margin:0;padding-left:.4em;text-indent:-.4em}
@media (min-width:1000px){h1{font-size:clamp(4rem,7vw,7rem)}}
h1 .sn{font-size:.22em;letter-spacing:0;vertical-align:top;position:relative;top:.4em}
.qm{display:flex;justify-content:flex-start}
.qm svg{display:block;height:auto;width:min(7.5rem,32vw)}
@media (min-width:1000px){.qm{order:2;align-self:stretch;justify-content:flex-start}.qm svg{width:auto;height:100%;max-height:34rem;max-width:100%}}
.qm-sq{fill:var(--ink)}.qm-dot{fill:var(--red)}
.hl{order:1}
@media (max-width:999px){.hero{position:relative}.qm{position:absolute;right:0;top:2rem}.qm svg{width:2.9rem}.eyebrow{padding-right:4rem;min-height:4.55rem;margin-bottom:.55rem}}
@media (max-width:599px){.qm{top:1.1rem}header.top .brand{white-space:nowrap;font-size:.76rem;letter-spacing:0}}
/* Round 5 (brief item 9): sections vary in scale: compact, standard, one full-bleed black band, one large numeral spread, one wide table. */
.chead{display:flex;align-items:flex-end;gap:.5rem 1.25rem;flex-wrap:wrap}.compact.g,.wide.g{row-gap:12px}.chead h2{margin:0 0 .35rem}
.compact{padding:1rem 0 2.25rem}.compact .num{font-size:clamp(3rem,6vw,5rem);margin:0;-webkit-text-stroke-width:1.5px}.compact h2{font-size:clamp(1.6rem,3vw,2.5rem)}
.wide .chead{align-items:flex-end}.wide .chead h2{font-size:clamp(2rem,5vw,4.6rem)}
.bleed{background:var(--ink);color:var(--bg);box-shadow:0 0 0 100vmax var(--ink);clip-path:inset(0 -100vmax);border-top:0;padding:3rem 0 4rem}
.bleed .num{-webkit-text-stroke-color:var(--bg)}.bleed a,.bleed .sn a{color:var(--bg)}.bleed .small{color:var(--bsoft)}.bleed :focus-visible{outline-color:var(--bg)}
.bleed .giant{border-bottom-color:var(--bred)}.bleed .giant li{border-top-color:var(--bg)}.bleed .giant .n{font-size:clamp(5rem,12vw,10.5rem)}.bleed .ret{color:var(--bred)}
.spread .num{color:var(--red);-webkit-text-stroke:0;font-size:clamp(7rem,20vw,19rem);line-height:.78;letter-spacing:-.07em}
.spread .blocks div{border-width:5px;aspect-ratio:auto;min-height:12rem}.spread .redq{max-width:30ch;margin:0 0 1.5rem}.spread .blocks h3{font-size:clamp(1.05rem,1.9vw,1.55rem)}
.ytab tbody{border-top:6px solid var(--ink)}.ytab th.y{font-size:clamp(2.4rem,5vw,4.4rem);line-height:.9;letter-spacing:-.04em;font-weight:800;width:12rem;padding-top:.5rem;border-top:0}
.ytab tbody tr:first-child td{border-top:0}.ytab td{border-top:1px solid var(--ink)}.ytab td.d{width:9rem}
@media (max-width:700px){.ytab tbody{display:block;border-top:6px solid var(--ink);padding-top:.25rem}.ytab th.y{display:block;width:auto;padding:.25rem 0 .5rem}.ytab tr{border-top:1px solid var(--ink)}.ytab tbody tr:first-child{border-top:0}}
.under{padding:1.5rem 0 3rem;border-top:6px solid var(--ink)}
.lede{max-width:40rem;margin:.3rem 0 .8rem}.under .c6:first-child .lede{font-size:1.3rem;line-height:1.35;font-weight:800;letter-spacing:-.01em}
.panel{border-top:6px solid var(--ink);padding:1.25rem 0 3.5rem}
.num{font-size:clamp(5.5rem,13vw,11rem);font-weight:800;line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:2px var(--ink);margin:0 0 0 -.12em}
@media (max-width:999px){.num{font-size:5.5rem;margin:0 0 .5rem -.1em}}
h2{font-size:clamp(2rem,4.2vw,3.6rem);line-height:.98;letter-spacing:-.03em;font-weight:800;margin:0 0 1rem}
h3{font-size:1.1rem;text-transform:uppercase;letter-spacing:.03em;font-weight:800;margin:.25rem 0 .4rem}
.small{font-size:.85rem;color:var(--soft)}
.grouplbl{font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:.85rem;margin:.5rem 0}
.show{border-top:3px solid var(--ink);padding-top:.5rem}.stag{color:var(--red);font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.06em}
.giant{list-style:none;margin:0;padding:0 0 1.5rem;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px;border-bottom:6px solid var(--red)}
@media (min-width:1000px){.giant{grid-template-columns:repeat(5,minmax(0,1fr))}}
.giant li{border-top:3px solid var(--ink);padding-top:.4rem}.giant .n{display:block;font-size:clamp(4rem,9vw,7.5rem);font-weight:800;line-height:.9;letter-spacing:-.05em}.giant p{font-size:.9rem;margin:.3rem 0}
.ret{color:var(--red);font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.95rem;margin:.6rem 0 0}
.blocks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (min-width:1000px){.blocks{grid-template-columns:repeat(3,minmax(0,1fr))}}
.blocks div{border:4px solid var(--ink);background:var(--bg);aspect-ratio:1/1;padding:.8rem;display:flex;flex-direction:column;justify-content:space-between;min-height:9rem}
.blocks .bn{font-weight:800;color:var(--red);font-size:.9rem}
.blocks h3{font-size:clamp(1rem,1.7vw,1.35rem);text-transform:none;letter-spacing:-.01em;line-height:1.1}.blocks p{font-size:.85rem;margin:0}
@media (max-width:600px){.blocks div{aspect-ratio:auto}}
.redq{color:var(--red);font-size:clamp(1.4rem,2.4vw,2rem);font-weight:800;line-height:1.12;letter-spacing:-.015em}
.pcols{display:grid;grid-template-columns:1fr;gap:0}
@media (min-width:1000px){.pcols{grid-template-columns:repeat(4,minmax(0,1fr))}.pcols article{border-left:6px solid var(--ink);padding:0 1.25rem}.pcols article:first-child{border-left:0;padding-left:0}}
@media (max-width:999px){.pcols article{border-top:6px solid var(--ink);padding:.75rem 0 1.25rem}}
.pcols h3{font-size:1.6rem;text-transform:none;letter-spacing:-.02em}
.prows{margin:0}.prows div{border-top:2px solid var(--ink);padding:.5rem 0}.prows dt{font-weight:800;text-transform:uppercase;font-size:.75rem;letter-spacing:.06em;color:var(--red)}.prows dd{margin:.15rem 0 0;font-size:.95rem}.prows .none{color:var(--soft)}.prows .squote{margin:0 0 .4rem}
.pinc{padding-left:1.1rem;margin:.25rem 0}
.btn{background:var(--ink);color:var(--bg)}
table{border-collapse:collapse;width:100%;background:var(--bg)}th,td{text-align:left;vertical-align:top;padding:.6rem .5rem .6rem 0;border-top:3px solid var(--ink)}thead th{text-transform:uppercase;font-size:.85rem;letter-spacing:.04em;font-weight:800}
td.d{font-weight:800;white-space:nowrap}td .src{display:block;font-size:.82rem;color:var(--soft)}td .src a{color:var(--soft)}
@media (max-width:700px){table,thead,tbody,tr,th,td{display:block}thead{position:absolute;left:-9999px}tr{border-top:3px solid var(--ink);padding:.5rem 0}td{border:0;padding:.15rem 0}}
.pfig svg{max-width:28rem}.f-line{stroke:var(--ink);stroke-width:2}.f-node{fill:var(--bg);stroke:var(--ink);stroke-width:3}.f-txt{font:800 18px ${SANS};fill:var(--ink)}.f-hub{fill:var(--red)}.f-hubtxt{font:800 20px ${SANS};fill:#fff}.f-small{font-weight:500;font-size:17px}
@media (prefers-color-scheme:dark){.f-hub{fill:var(--band)}}
figcaption{font-size:.85rem;color:var(--soft)}
.band{background:var(--band);color:var(--onband);padding:3.5rem 0}
.band a{color:var(--onband)}.band .big{display:inline-flex;align-items:center;min-height:44px;font-size:clamp(2rem,6vw,5rem);font-weight:800;letter-spacing:-.035em;line-height:1}
.band :focus-visible{outline-color:var(--onband)}.band p{max-width:44rem}.band .sn a{color:var(--onband)}
.btnb{display:inline-flex;align-items:center;min-height:44px;font-weight:800;border:3px solid var(--onband);padding:.5rem 1rem;text-decoration:none}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{border-top:6px solid var(--ink)}.foot-in{max-width:90rem;margin:0 auto;padding:1rem 16px 2rem;font-size:.9rem}.foot .small{font-size:.82rem}`;
  const brk = T.headline_break_after; const idx = headline.text.indexOf(brk);
  const h1 = idx > 0 ? `${esc(headline.text.slice(0, idx + brk.length))}<br>${esc(headline.text.slice(idx + brk.length).trim())}` : esc(headline.text);
  // question mark of six squares and one red dot
  const sq = [[60, 0], [140, 0], [220, 60], [220, 140], [140, 200], [140, 280]];
  const qmSvg = `<svg viewBox="0 0 300 460" role="img" aria-labelledby="qm-t qm-d"><title id="qm-t">${esc(d.signature)}</title><desc id="qm-d">A question mark made of six squares, one for each area: ${esc(areas.map(a => a.name).join('; '))}. The dot beneath is one Readiness Check.</desc>
${sq.map(([x, y]) => `<rect class="qm-sq solid" x="${x}" y="${y}" width="72" height="72"/>`).join('')}<circle class="qm-dot solid" cx="176" cy="410" r="42"/></svg>`;
  const P_ = (n, id, title, inner, v = 'std') => (v === 'compact' || v === 'wide')
    ? `<section class="panel g ${v}" aria-labelledby="${id}"><div class="c12 chead"><p class="num" aria-hidden="true">${two(n)}</p><h2 id="${id}">${title}</h2></div><div class="c12">${inner}</div></section>`
    : `<section class="panel g ${v}" aria-labelledby="${id}"><div class="${v === 'spread' ? 'c4' : 'c3'}"><p class="num" aria-hidden="true">${two(n)}</p></div><div class="${v === 'spread' ? 'c8' : 'c9'}"><h2 id="${id}">${title}</h2>${inner}</div></section>`;
  const years = [...new Set(rows.map(r => r.date.slice(0, 4)))];
  const ytab = `<table class="ytab"><thead><tr><th scope="col">Year</th><th scope="col">Date</th><th scope="col">What the source says</th></tr></thead>${years.map(y => { const yr = rows.filter(r => r.date.startsWith(y)); return `<tbody>${yr.map((r, i) => `<tr>${i ? '' : `<th scope="rowgroup" rowspan="${yr.length}" class="y">${y}</th>`}<td class="d"><time datetime="${esc(r.date)}">${esc(fmt(r.date).replace(/ \d{4}$/, ''))}</time></td><td>${rowWhat(r)}<span class="src">${rowSource(r)}</span></td></tr>`).join('')}</tbody>`; }).join('')}</table>`;
  const body = `${header()}
<div class="pg">
<main id="main" class="wrap">
<section class="hero g" aria-labelledby="h1"><div class="c4 qm">${qmSvg}</div><div class="c8 hl"><p class="eyebrow">${eyebrow()}</p><h1 id="h1"><q>${h1}</q>${cite(hFact)}</h1></div></section>
<div class="under g"><div class="c6">${ledeQuote()}</div><div class="c6">${ledeOurs()}<p>${action('start')}</p><p class="small">${esc(C.actions.note)}</p></div></div>
${P_(2, 'show', esc(C.home.show_title), `<p class="small">${ours(C.home.show_intro)}</p>${showLabel()}<div class="g">${C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="c4 show"><p class="stag">${esc(s.tag)}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`; }).join('')}</div>`, 'compact')}
${P_(3, 'flow', esc(C.flow.title), `<p class="small">${ours(C.flow.intro)}</p><ol class="giant">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li><span class="n" aria-hidden="true">${s.n}</span><h3><span class="vh">Step ${s.n}: </span>${esc(s.name)}</h3><p>Published: <q>${esc(s.published)}</q></p><p class="small"><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></li>`; }).join('')}</ol><p class="ret">${esc(C.flow.return_label)}</p><p class="small">${flowCaption()} ${esc(C.flow.footnote)}</p>`, 'bleed')}
${P_(4, 'areas', esc(C.home.areas_title), `<p class="redq">${qc(C.home.areas_intro)}</p><div class="blocks">${areas.map((a, i) => { used.add(a.fact_id); return `<div><span class="bn" aria-hidden="true">${two(i + 1)}</span><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`; }).join('')}</div><p class="small">${esc(C.areas_page.summary_label)} under each name. ${esc(C.areas_page.caption)}${cite('c6')}</p>`, 'spread')}
${P_(5, 'plans', esc(C.plans_page.h1), `<p class="small">${ours(C.plans_page.intro)}</p><div class="pcols">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planRows(p)}</article>`).join('')}</div>${plansNote()}`)}
${P_(6, 'part', esc(P.h1), `<div class="g"><div class="c6">${partnerText()}</div><div class="c6">${partnerFigure('pf')}</div></div>`, 'compact')}
${rows.length ? P_(7, 'dates', esc(C.context.timeline_title), `<p class="small">${esc(C.context.timeline_note)}</p>${ytab}<p><strong>${esc(NLA)}</strong></p>`, 'wide') : ''}
${P_(8, 'fo', esc(founder.section_title), founderBlock('h3', 'vh'), 'compact')}
${P_(9, 'srcs', 'Sources', sourcesList(), 'compact')}
</main>
</div>
<section class="band" aria-labelledby="cta"><div class="wrap"><h2 id="cta" class="vh">${esc(C.home.cta.title.text)}</h2><p><q>${esc(C.home.cta.title.text)}</q>${cite(C.home.cta.title.fact_id)}</p><p><a class="big" href="${THEIRS}">${esc(T.cta_band)}${sr(C.actions.start.sr)}</a></p><p>${esc(C.home.cta.text)}</p><p>${action('partner', 'btnb')}</p></div></section>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer());
}

// ---------- 5. Quiet Counsel ----------
// A calm letter, one idea per screen, set in EB Garamond on a 34rem measure. The signature
// is one continuous line down the left margin of the whole letter that loops round each of
// the five step numerals as it passes (aria-hidden; the steps are in the text). No animation.
// Review change 20: the sign-off is plain text, no signature styling and no personal name.
function counsel() {
  const d = D.counsel; const T = C.design_text.counsel; begin();
  const SERIF = '"EB Garamond",Garamond,"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif';
  const SANS = '"Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  const css = `:root{--bg:#f3efe6;--ink:#2a2a26;--soft:#5a5850;--rule:#d6cfc0;--sage:#46634f;--clay:#8c4d2b;--link:#46634f;--focus:#8c4d2b;--th:-3rem;${pk('#f3efe6', '#2a2a26', '#5a5850', '#d6cfc0', '#46634f')};${lay('42rem')}}
@media (prefers-color-scheme:dark){:root{--bg:#191b18;--ink:#e8e4d9;--soft:#b9b4a8;--rule:#3a3d37;--sage:#a7c4b1;--clay:#e0a483;--link:#a7c4b1;--focus:#e0a483;${pk('#191b18', '#e8e4d9', '#b9b4a8', '#3a3d37', '#a7c4b1')}}}
body{font:22px/1.6 ${SERIF}}
.notice,.small,.top,.foot,.sources,figcaption{font-family:${SANS}}
.notice{padding:.6rem 16px;border-bottom:1px solid var(--rule);text-align:center;font-size:.8rem}.notice-in{max-width:46rem}
.top{padding:0 16px;font-size:.95rem}.top-in{max-width:calc(34rem + 8rem);margin:0 auto;padding:.75rem 0;display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:space-between;align-items:center}
.brand{font:400 1.15rem ${SERIF};font-variant:small-caps;letter-spacing:.12em;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px}.tag{font-size:.85rem;color:var(--clay);letter-spacing:.08em}
.their{display:inline-flex;align-items:center;min-height:44px;color:var(--sage)}
.letter{position:relative}
.thread{position:absolute;top:0;bottom:0;left:calc(50% - 20rem);border-left:1.5px solid var(--sage);pointer-events:none}
.col{max-width:calc(34rem + 32px);margin:0 auto;padding:0 16px}
@media (max-width:760px){:root{--th:-28px}.thread{left:24px}.col{max-width:none;padding-left:52px}}
.scene{display:flex;flex-direction:column;justify-content:center;padding:2.6rem 16px}
.scene+.scene{border-top:1px solid var(--rule)}@media (max-width:599px){.scene:first-of-type{padding-top:1.25rem}}
@media (max-width:760px){.scene{padding-top:2.5rem;padding-bottom:2.5rem;padding-left:52px}}
.long{min-height:0}
.sc{font-variant:small-caps;letter-spacing:.08em;color:var(--clay);margin:0 0 .25rem}
.opening{font-size:1.05rem;letter-spacing:.14em}
h1{font-size:clamp(2.2rem,5vw,3.5rem);line-height:1.12;font-weight:400;margin:.6rem 0 1.5rem;padding-left:.35em;text-indent:-.35em}
h2{font-size:clamp(1.9rem,4vw,3rem);line-height:1.15;font-weight:400;margin:0 0 1.25rem}h3{font-size:1.35rem;font-weight:600;margin:.5rem 0 .25rem}
.small{font-size:.8rem;line-height:1.55;color:var(--soft)}
.lede{margin:.6rem 0}
.pull{font-style:italic;font-size:clamp(1.55rem,3.4vw,2.25rem);line-height:1.3;margin:0;padding-top:1.25rem;border-top:2px solid var(--sage);max-width:30ch}
.pull .sn{font-style:normal}
.tsteps{list-style:none;margin:2rem 0;padding:0}
.tsteps li{position:relative;margin:0 0 1.6rem;min-height:3rem}
.ring{position:absolute;left:calc(var(--th) - 27px);top:-.35rem;width:54px;height:54px}
@media (min-width:761px){.ring{left:calc(var(--th) - 32px);width:64px;height:64px;top:-.6rem}}@media (max-width:760px){.ring{left:calc(var(--th) - 22px);width:44px;height:44px;top:-.1rem}}
.ring circle{fill:var(--bg);stroke:var(--sage);stroke-width:1.5}.ring text{font:400 26px ${SERIF};fill:var(--sage)}
.tsteps strong{font-weight:600;font-size:1.2em}.tsteps p{margin:.2rem 0}
.hex{margin:1.25rem 0}.hexlist{display:none;margin:0 0 .75rem;padding-left:1.4rem;font-size:.9em}.hexlist li::marker{color:var(--clay)}@media (max-width:600px){.hexlist{display:block}.hex .ht{display:none}}.hex svg{width:100%;display:block}.hx{fill:none;stroke:var(--sage);stroke-width:1.5}.hv{fill:var(--sage)}.ht{font:21px ${SERIF};fill:var(--ink)}.hn{font:600 22px ${SERIF};fill:var(--clay)}.hc{font:italic 24px ${SERIF};fill:var(--ink)}
figcaption{font-size:.8rem;color:var(--soft);text-align:center}

.letters{display:grid;gap:0 1.75rem}@media (min-width:700px){.letters{grid-template-columns:repeat(2,minmax(0,1fr))}}
.letters article{border-top:1px solid var(--ink);padding:.75rem 0 1rem;font-size:.86em;line-height:1.5}.letters ul{margin:.1rem 0}.letters p{margin:.25rem 0}
.letters h3{font-size:1.5rem;font-weight:400}.plabel{color:var(--clay);margin:0;font-variant:small-caps;letter-spacing:.06em}.phead{font-variant:small-caps;letter-spacing:.06em;margin:.5rem 0 0}.pinc{padding-left:1.2rem;margin:.2rem 0}.pfor,.pprice{margin:.3rem 0}
.btn{color:var(--sage);text-decoration:underline;padding-left:0;font-weight:400}
.pfig{margin:1rem 0 0}.pfig svg{width:100%;display:block}.f-line{stroke:var(--sage);stroke-width:1.5}.f-node{fill:var(--bg);stroke:var(--sage);stroke-width:1.5}.f-txt{font:20px ${SERIF};fill:var(--ink)}.f-hub{fill:var(--bg);stroke:var(--clay);stroke-width:1.5}.f-hubtxt{font:22px ${SERIF};fill:var(--ink)}.f-small{font-size:19px}
.dates{border-collapse:collapse;width:100%;font-size:.78em;line-height:1.45;margin:.5rem 0 1rem}.dates th,.dates td{text-align:left;vertical-align:top;border-top:1px solid var(--rule);padding:.45rem .75rem .45rem 0}.dates th{font-weight:400;white-space:nowrap;color:var(--clay);font-variant-numeric:oldstyle-nums}.dates tr:last-child>*{border-bottom:1px solid var(--rule)}
.close{text-align:left}.close p{margin:.4rem 0}.close a{font-size:1.35rem;display:inline-flex;align-items:center;min-height:44px}
.signoff{margin:1.5rem 0 0!important;padding-top:.8rem;border-top:1px solid var(--rule)}
.grouplbl{font-variant:small-caps;letter-spacing:.08em;color:var(--clay);margin:.5rem 0}
.show{margin:0 0 1.2rem}.show p{margin:0}.stag{margin:0}
.ptypes{padding-left:1.2rem}
.sources{font-size:.8rem;padding-left:1.3rem}
.foot{max-width:calc(34rem + 32px);margin:2rem auto 2rem;padding:1rem 16px 0;border-top:1px solid var(--rule);font-size:.85rem}.foot .small{font-size:.78rem}
@media (max-width:760px){.foot{padding-left:52px}}`;
  // Round 5 (brief item 3): the areas figure fills the measure, with each area's name at its corner.
  const hexR = 122, hc = [300, 190];
  const hang = i => (i * 60 - 90) * Math.PI / 180;
  const hv = [0, 1, 2, 3, 4, 5].map(i => [hc[0] + hexR * Math.cos(hang(i)), hc[1] + hexR * Math.sin(hang(i))]);
  const hexLabel = (a, i) => {
    const [x, y] = hv[i]; const side = i === 0 || i === 3 ? 'middle' : i < 3 ? 'start' : 'end';
    const lx = side === 'middle' ? x : side === 'start' ? x + 18 : x - 18;
    const lines = wrap(a.name, side === 'middle' ? 44 : 15);
    const ly = i === 0 ? y - 16 - (lines.length - 1) * 24 : i === 3 ? y + 34 : y - (lines.length - 1) * 12 + 6;
    return `<text class="ht" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${side}"><tspan class="hn">${i + 1}</tspan> ${esc(lines[0])}${lines.slice(1).map(l => `<tspan x="${lx.toFixed(1)}" dy="24">${esc(l)}</tspan>`).join('')}</text>`;
  };
  const hexSvg = `<figure class="hex"><svg viewBox="0 0 600 384" role="img" aria-labelledby="hx-t hx-d"><title id="hx-t">${esc(C.areas_page.svg_title)}</title><desc id="hx-d">A hexagon outline; each of its six corners stands for one area, numbered clockwise from the top: ${esc(areas.map((a, i) => `${i + 1} ${a.name}`).join('; '))}. No area is highlighted.</desc>
<polygon class="hx" points="${hv.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}"/>${hv.map(([x, y]) => `<circle class="hv solid" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`).join('')}${areas.map((a, i) => { used.add(a.fact_id); return hexLabel(a, i); }).join('')}
<text class="hc" x="${hc[0]}" y="${hc[1] + 8}" text-anchor="middle">${esc(C.areas_page.centre)}</text></svg><ol class="hexlist">${areas.map(a => `<li>${esc(a.name)}</li>`).join('')}</ol><figcaption>${esc(C.areas_page.caption)}${cite('c6')}</figcaption></figure>`;
  const pull = item => `<blockquote class="pull"><p>${q(item)}${cite(item.fact_id)}</p></blockquote>`;
  const ring = n => `<svg class="ring" viewBox="0 0 54 54" aria-hidden="true" focusable="false"><circle cx="27" cy="27" r="25"/><text x="27" y="35" text-anchor="middle">${n}</text></svg>`;
  const tsteps = `<ol class="tsteps" role="list">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li>${ring(s.n)}<p><strong><span class="vh">Step ${s.n}: </span>${esc(s.name)}.</strong> Published: <q>${esc(s.published)}</q>${/[.?!]$/.test(s.published) ? '' : '.'}</p></li>`; }).join('')}</ol>`;
  const body = `${header()}
<main id="main" class="letter">
<div class="thread" aria-hidden="true"></div>
<section class="scene col" aria-labelledby="h1">
<p class="sc opening">${esc(T.opening)}</p>
<h1 id="h1">${h1Quote()}</h1>
${ledeQuote()}
</section>
<section class="scene col" aria-labelledby="why"><h2 id="why" class="vh">${esc(C.home.why_now_title)}</h2>
${pull(C.home.question)}
</section>
<section class="scene col" aria-labelledby="fl"><h2 id="fl">${esc(C.flow.title)}</h2>
${tsteps}
<p class="small">${flowCaption()} ${esc(C.flow.return_label)}.</p></section>
<section class="scene col" aria-labelledby="sh"><h2 id="sh">${esc(C.home.show_title)}</h2>${showLabel()}${C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="show"><p><span class="sc">${esc(s.tag)}: ${esc(s.title)}.</span> ${esc(s.text)}</p></div>`; }).join('')}</section>
<section class="scene col" aria-labelledby="ar"><h2 id="ar">${esc(C.areas_page.h1)}</h2>
${pull(C.home.areas_intro)}
${hexSvg}
</section>
<section class="scene col" aria-labelledby="pl"><h2 id="pl">${esc(C.plans_page.h1)}</h2>
<div class="letters">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planBody(p)}</article>`).join('')}</div>${plansNote()}</section>
<section class="scene col" aria-labelledby="pa"><h2 id="pa">${esc(P.h1)}</h2><p>${qc(P.lede)} ${esc(P.types.map(t => { used.add(t.fact_id); return t.name; }).join(', '))}.${cite('c8')}</p><p>${action(P.button)}</p>${partnerFigure('pf')}</section>
<section class="scene col" aria-labelledby="fo">${founderBlock('h2', '', 'fo')}</section>
${rows.length ? `<section class="scene col" aria-labelledby="dt"><h2 id="dt">${esc(C.context.timeline_title)}</h2><p class="small">${esc(C.context.timeline_note)}</p>
<table class="dates"><thead class="vh"><tr><th scope="col">Date</th><th scope="col">What the source says</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${time(r.date)}</th><td>${rowWhat(r)}${cite(r.id)}</td></tr>`).join('')}</tbody></table><p><strong>${esc(NLA)}</strong></p></section>` : ''}
<section class="scene col close" aria-labelledby="cl"><h2 id="cl" class="vh">${esc(C.home.cta.title.text)}</h2><p>${esc(T.cta_line)}</p><p><a href="${THEIRS}">${esc(T.cta_link)}${sr(C.actions.start.sr)}</a></p><p class="small">${esc(C.actions.note)}</p>
<p class="signoff">${esc(T.sign_off)}</p></section>
<section class="col long" aria-labelledby="sr"><h2 id="sr">Sources</h2>${sourcesList()}</section>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer());
}

// ---------- chooser ----------
// /d/: the six designs (main plus five) as screenshots of their first screens, made by
// scripts/shots.mjs from our own built pages (review change 5), in the main design's tokens.
function chooser() {
  begin();
  const DP = C.designs_page;
  const SERIF = 'Fraunces,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif';
  const SANS = '"Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  const css = `:root{--bg:#f4f1e8;--surface:#ffffff;--ink:#0f1f19;--soft:#4a5a52;--line:#d8d2c4;--green:#1f5c46;--brass:#7a5814;--deep:#0e3b2e;--ondeep:#f4f1e8;--notice:#0b1612;--link:#1f5c46;--focus:#1f5c46;${pk('#ffffff', '#0f1f19', '#4a5a52', '#d8d2c4', '#1f5c46')};${lay('76rem')}}
@media (prefers-color-scheme:dark){:root{--bg:#0b1612;--surface:#12211b;--ink:#ede8dc;--soft:#b5b0a2;--line:#2c3c35;--green:#7fcfae;--brass:#e0b860;--deep:#10241d;--ondeep:#f4f1e8;--notice:#050a08;--link:#7fcfae;--focus:#e0b860;${pk('#12211b', '#ede8dc', '#b5b0a2', '#2c3c35', '#7fcfae')}}}
body{font:17px/1.6 ${SANS}}
.mono,.eyebrow,.il,.tag{font-family:${MONO}}
.notice{background:var(--notice);color:var(--ondeep);padding:.6rem 16px;font-size:.84rem}.notice-in{max-width:76rem}.notice a{text-decoration-color:#e0b860}.notice a:focus-visible{outline-color:#e0b860}
.top{background:var(--bg);border-bottom:1px solid var(--line);padding:0 16px}.top-in{max-width:76rem;margin:0 auto;padding:.5rem 0;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between}
.brand{font:600 1.1rem ${SERIF};letter-spacing:.06em;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;min-height:44px}.tag{font-size:.68rem;font-weight:500;color:var(--brass);border:1px solid var(--brass);border-radius:4px;padding:.05rem .4rem;letter-spacing:.1em;text-transform:uppercase}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--green);border-radius:6px;color:var(--green);text-decoration:none;font-weight:600}
main{max-width:76rem;margin:0 auto;padding:3rem 16px 3.5rem}@media (max-width:599px){main{padding-top:1.25rem}}
.eyebrow{font-size:.8rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);margin:0 0 .75rem}
h1{font:600 clamp(2.4rem,6vw,4.6rem)/1.02 ${SERIF};letter-spacing:-.02em;margin:0 0 1rem;max-width:16ch}
.intro{display:grid;gap:.5rem;border-bottom:1px solid var(--line);padding-bottom:2rem}@media (min-width:1000px){.intro{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:3rem;align-items:end}.intro h1{margin:0}}
.lede{font-size:1.2rem;color:var(--soft);margin:0 0 .5rem;max-width:40rem}.small{font-size:.86rem;color:var(--soft)}
.cards{list-style:none;margin:2.25rem 0 0;padding:0;display:grid;gap:24px;grid-template-columns:1fr}
@media (min-width:760px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
.card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.card:hover,.card:focus-within{border-color:var(--green)}
.card img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top;border-bottom:1px solid var(--line);background:var(--bg)}
.txt{padding:1.1rem 1.25rem 1.3rem;display:flex;flex-direction:column;gap:.4rem}
.card h2{font:600 1.6rem/1.15 ${SERIF};margin:0}.card h2 a{color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;min-height:44px}
.card h2 a::after{content:"";position:absolute;inset:0;border-radius:14px}
.card h2 a:focus-visible{outline:none}.card:has(a:focus-visible){outline:3px solid var(--focus);outline-offset:2px}
.card p{margin:0}.idea{font-size:1.05rem}.il{font-size:.72rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--brass);margin-right:.5rem}.sig{font-size:.92rem;color:var(--soft)}
.def{font:500 .7rem ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--green)}
table{border-collapse:collapse;width:100%;margin-top:3rem;font-size:.96rem}caption{text-align:left;font:600 1.6rem ${SERIF};padding-bottom:.75rem}
th,td{text-align:left;vertical-align:top;border-top:1px solid var(--line);padding:.7rem .9rem .7rem 0}thead th{font:500 .72rem ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--soft);border-top:2px solid var(--ink)}
th a{display:inline-flex;align-items:center;min-height:44px}
.tw{overflow-x:auto}
.foot{background:var(--notice);color:var(--ondeep)}.foot a{color:var(--ondeep)}.foot-in{max-width:76rem;margin:0 auto;padding:1.5rem 16px 2rem;font-size:.9rem}.foot .small{font-size:.82rem;color:#b9d3c6}`;
  const M = DP.main_card;
  const items = C.picker.order.map(slug => slug === 'main'
    ? { slug: 'main', name: M.name, short: M.short_name, idea: M.idea, line: M.line, signature: M.signature, href: M.href, main: true }
    : { ...D[slug], short: D[slug].name, href: `/d/${slug}/` });
  const card = it => `<li class="card"><img src="/assets/designs/${esc(it.slug)}.jpg" width="1280" height="800" alt="${esc(`Screenshot of the first screen of the ${it.short} design`)}" loading="lazy" decoding="async"><div class="txt">${it.main ? `<p class="def">${esc(C.picker.main.name)}</p>` : ''}<h2><a href="${esc(it.href)}">${esc(it.name)}</a></h2><p class="idea"><span class="il">${esc(DP.idea_label)}</span>${esc(it.idea)}</p><p>${esc(it.line)}</p><p class="sig">${esc(it.signature)}</p></div></li>`;
  const html = head({ title: DP.title, desc: `${DP.lede} ${C.brand.description}`, path: '/d/', css, fonts: DESIGN_FONTS.chooser }) + `${header()}
<main id="main">
<div class="intro"><div><p class="eyebrow">${esc(C.picker.strip_label.replace(/:$/, ''))}</p>
<h1>${esc(DP.h1)}</h1></div>
<div><p class="lede">${esc(DP.lede)}</p>
<p class="small">${esc(DP.thumb_note)}</p></div></div>
<ul class="cards">
${items.map(card).join('\n')}
</ul>
<div class="tw"><table><caption>${esc(DP.table_caption)}</caption><thead><tr>${DP.table_heads.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${items.map(it => `<tr><th scope="row"><a href="${esc(it.href)}">${esc(it.name)}</a></th><td>${esc(it.line)}</td><td>${esc(it.signature)}</td></tr>`).join('')}</tbody></table></div>
<p class="small">${esc(C.actions.note)} <a href="${THEIRS}">sustain-nobility.com ↗${sr('(opens their official site)')}</a></p>
</main>`;
  writePage('d', html + footer());
}

boardPaper();
dial();
calendar();
grid();
counsel();
chooser();
console.log(`designs: wrote /d/ and ${C.designs.length} designs (${rows.length} timeline rows, ${rows.length - current.length} marked as replaced)`);
