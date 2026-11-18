// Writes the five designs under _site/d/<slug>/ and the chooser at _site/d/index.html,
// from data/copy.json and data/research.json. Run by build.mjs after generate.mjs.
// Node built-ins only; runs on import; cwd is the repository root.
// Stub by conductor.sustain-nobility@ (2026-11-18); written in round 2 by
// developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18, to PROPOSAL.md section 3
// under review conditions G1 to G8 and changes 19 to 25 (team/rounds/2/review/DESIGN.md).
//
// Rules this file keeps:
// - Every word comes from copy.json or research.json; every regulatory date comes from a
//   research.json fact's "dates" array (G6). No date is typed here.
// - A date whose "what" says it is an original staged date is labelled as replaced by
//   the amending regulation and is not drawn in any figure.
// - Every action links to https://www.sustain-nobility.com and says so (G3). No forms.
// - All data is HTML-escaped.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const C = JSON.parse(readFileSync('data/copy.json', 'utf8'));
const R = JSON.parse(readFileSync('data/research.json', 'utf8'));
const ORIGIN = 'https://sustain-nobility.agenticcells.site';
const THEIRS = 'https://www.sustain-nobility.com';

// ---------- data access ----------
const F = {};
(function walk(o) {
  if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === 'object') { if (typeof o.id === 'string' && (o.url || o.dates)) F[o.id] = o; for (const k in o) walk(o[k]); }
})(R.sections);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmt = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const time = iso => `<time datetime="${esc(iso)}">${esc(fmt(iso))}</time>`;
const NLA = C.not_legal_advice;

function srcInfo(id) {
  const f = F[id];
  if (!f) throw new Error(`designs: unknown fact id ${id}`);
  const s = Object.values(C.sources).find(s => (s.fact_ids || []).includes(id)) || Object.values(C.sources).find(s => s.url === f.url);
  const host = new URL(f.url).hostname.replace(/^www\./, '');
  return { url: f.url, read: f.read, title: s ? s.title : host, publisher: s ? s.publisher : host };
}

// Each page collects the facts it cites, for its Sources list.
let used;
const cite = id => { used.add(id); const s = srcInfo(id); return `<span class="cite">(<a href="${esc(s.url)}">${esc(s.title)}</a>, read ${esc(s.read)})</span>`; };
// Live review F6: their text holds straight double quotes; inside <q> show them as single quotation marks.
const inner = t => String(t).replace(/"([^"]*)"/g, '\u2018$1\u2019');
const q = item => `<q>${esc(inner(item.text))}</q>`;
const qc = item => `${item.lead_in ? esc(item.lead_in) + ' ' : ''}${q(item)} ${cite(item.fact_id)}`;
const ours = item => { (item.fact_ids || []).forEach(id => used.add(id)); return `<span class="lbl">${esc(item.label)}:</span> ${esc(item.text)}`; };
const sr = t => `<span class="vh"> ${esc(t)}</span>`;
const action = (key, cls = 'btn') => { const a = C.actions[key]; return `<a class="${cls}" href="${esc(a.href)}">${esc(a.text)}${sr(a.sr)}</a>`; };
const actionShort = (key, cls = 'btn') => { const a = C.actions[key]; return `<a class="${cls}" href="${esc(a.href)}">${esc(a.short || a.text)}${sr(a.sr)}</a>`; };
const planStart = (p, cls = 'btn') => `<a class="${cls}" href="${THEIRS}">${esc(p.start)}${sr('(opens their site)')}</a>`;

function sourcesList() {
  const byUrl = new Map();
  for (const id of used) { const s = srcInfo(id); if (!byUrl.has(s.url)) byUrl.set(s.url, s); }
  return `<ol class="sources">${[...byUrl.values()].map(s => `<li><a href="${esc(s.url)}">${esc(s.title)}</a>, ${esc(s.publisher)}. Read ${esc(s.read)}.</li>`).join('')}</ol>`;
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

// ---------- shared page parts ----------
const BASE_CSS_ = `*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--ink)}img,svg{max-width:100%;height:auto}
.vh{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;left:8px;top:-60px;z-index:10;padding:.75rem 1rem;background:var(--ink);color:var(--bg)}.skip:focus{top:8px}
a{color:var(--link)}a:hover{text-decoration-thickness:2px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.notice{font-size:.875rem;line-height:1.5}.notice a{color:inherit;font-weight:700}
.cite{font-size:.85em;color:var(--soft)}.cite a{color:inherit}
.lbl{font-weight:700}.replaced{font-weight:700}
.btn{display:inline-flex;align-items:center;min-height:44px;padding:.55rem 1.1rem;text-decoration:none;font-weight:700}
.designs-row{display:flex;flex-wrap:wrap;gap:.25rem 1rem;align-items:center}.designs-row a{display:inline-flex;align-items:center;min-height:44px}
.cur{font-weight:700}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`;
const BASE_CSS = () => BASE_CSS_ + VFLOW_CSS;

function head({ title, desc, path, css }) {
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
${BASE_CSS()}
${css}
</style>
</head>
<body>
<a class="skip" href="#main">${esc(C.nav.skip)}</a>
`;
}

// Live review F2: one notice, the same words as the main site; the link sits on sustain-nobility.com.
const noticeText = (() => { const t = C.notice; const i = t.indexOf('sustain-nobility.com'); if (i < 0) throw new Error('designs: notice has no sustain-nobility.com'); return `${esc(t.slice(0, i))}<a href="${esc(C.notice_link.href)}">sustain-nobility.com${sr(C.notice_link.sr)}</a>${esc(t.slice(i + 'sustain-nobility.com'.length))}`; })();
const noticeBar = () => `<div class="notice" role="region" aria-label="Proposal notice"><div class="notice-in">${noticeText}</div></div>`;

const brand = () => `<span class="brand">${esc(C.brand.wordmark)}<span class="vh">, a proposal</span> <span class="tag">${esc(C.brand.tag)}</span></span>`;
const theirBtn = (cls = 'their') => `<a class="${cls}" href="${esc(C.brand.their_site_button.href)}">${esc(C.brand.their_site_button.text)}${sr(C.brand.their_site_button.sr)}</a>`;

function switcher(slug) {
  const links = C.designs.map(d => d.slug === slug ? `<span class="cur" aria-current="page">${esc(d.name)}</span>` : `<a href="/d/${esc(d.slug)}/">${esc(d.name)}</a>`);
  return `<nav class="designs-row" aria-label="${esc(C.designs_page.switcher_label)}"><span>${esc(C.designs_page.switcher_label)}:</span> ${links.join(' ')} <a href="/d/">All designs</a> <a href="/">${esc(C.designs_page.main_card.name)}</a></nav>`;
}

function footer(slug) {
  const ft = C.footer;
  ft.office_fact_ids.forEach(id => used.add(id));
  return `<footer class="foot" id="footer">
<div class="foot-in">
<p><strong>${esc(ft.company)}</strong>. ${esc(ft.jurisdiction)} ${esc(ft.office)}.</p>
<p class="small">${esc(ft.source_line)}</p>
<p>${esc(ft.proposal_line)} <a href="${THEIRS}">sustain-nobility.com ↗${sr('(opens their official site)')}</a></p>
<p class="small">${esc(ft.licences)} <a href="/version.json">${esc(ft.version_label)} __VERSION__</a></p>
${switcher(slug)}
</div>
</footer>
</body>
</html>
`;
}

function founderBlock(hTag = 'h2', hCls = '') {
  return `<${hTag}${hCls ? ` class="${hCls}"` : ''}>${esc(founder.section_title)}</${hTag}>
<p><strong>${esc(founder.name)}</strong>, ${esc(founder.title)}. ${qc(founder.title_basis)}</p>
${founder.lines.map(l => `<p>${qc(l)}</p>`).join('\n')}
<p class="small">${esc(founder.agreement)}</p>`;
}

function plansNote() { used.add('c9'); return `<p class="small">${esc(C.plans_page.footnote)} ${cite('c9')}</p>`; }

function planBody(p, { showPrice = true } = {}) {
  const RL = C.plans_page.row_labels;
  return `${p.label ? `<p class="plabel">Their label: ${esc(p.label)}</p>` : ''}
${p.for ? `<p class="pfor"><q>${esc(p.for)}</q></p>` : ''}
${p.includes.length ? `<p class="phead">${esc(RL.includes)}</p><ul class="pinc">${p.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
${p.includes_note ? `<p class="small">${ours(p.includes_note)}</p>` : ''}
${p.start_quote ? `<p><q>${esc(p.start_quote)}</q></p>` : ''}
${showPrice ? `<p class="pprice"><span class="phead">${esc(RL.price)}:</span> ${esc(p.price)}</p>` : ''}
<p class="pstart">${planStart(p)}</p>`;
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
// It is aria-hidden: the horizontal figure carries the accessible name and the step list follows.
function vflow(k) {
  const h = 40 + steps.length * 84 + 40;
  return `<svg class="vflow" viewBox="0 0 360 ${h}" aria-hidden="true" focusable="false">
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
function showItems(tag = 'h3') {
  return C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="show"><p class="stag">${esc(s.tag)}</p><${tag}>${esc(s.title)}</${tag}><p><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></div>`; }).join('\n');
}
function ledeParas() { return C.home.lede.map(l => `<p class="lede">${l.kind === 'quote' ? qc(l) : ours(l)}</p>`).join('\n'); }
const eyebrow = () => { used.add(C.home.eyebrow_fact_id); return esc(C.home.eyebrow); };

function writePage(path, html) {
  if (html.includes('—')) throw new Error(`designs: em dash in ${path}`);
  const dir = join('_site', path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}
function pageMeta(d) {
  return { title: `${d.name}: ${C.brand.title_suffix}`, desc: `${d.line} ${C.brand.description}`, path: `/d/${d.slug}/` };
}

// ---------- 1. Board Paper ----------
function boardPaper() {
  const d = D['board-paper']; const T = C.design_text.board_paper; used = new Set();
  const css = `:root{--bg:#ece9e1;--paper:#fbfaf6;--ink:#1b1b1b;--soft:#55504a;--rule:#8f877a;--hair:#c9c3b6;--accent:#7a2430;--link:#7a2430;--focus:#7a2430}
@media (prefers-color-scheme:dark){:root{--bg:#0d0c0b;--paper:#161514;--ink:#e9e5dc;--soft:#b0a99d;--rule:#7d766b;--hair:#3a3631;--accent:#e8a0a8;--link:#e8a0a8;--focus:#e8a0a8}}
body{font:18px/1.6 Charter,"Bitstream Charter","Iowan Old Style",Cambria,Georgia,serif}
.notice{background:var(--paper);border-bottom:1px solid var(--hair);padding:.6rem 16px}.notice-in{max-width:58rem;margin:0 auto}
.top{max-width:58rem;margin:0 auto;padding:.75rem 16px;display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:space-between;align-items:center;font-size:.95rem}
.brand{font-variant:small-caps;letter-spacing:.06em;font-weight:700}.tag{font:700 .7rem ui-monospace,Menlo,Consolas,monospace;border:1px solid var(--rule);padding:.1rem .35rem;letter-spacing:.08em;text-transform:uppercase;font-variant:normal}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--accent);color:var(--accent);text-decoration:none}
.paper{position:relative;max-width:58rem;margin:0 auto 3rem;background:var(--paper);padding:2.5rem 16px 2rem;box-shadow:0 1px 0 var(--hair),0 0 0 1px var(--hair)}
@media (min-width:700px){.paper{padding:3.5rem 3rem 2.5rem}}
.fold{position:absolute;top:0;right:0;width:44px;height:44px}
.fold path{fill:var(--bg);stroke:var(--hair)}
.mono,.no,.note,.small{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.kicker{font-size:.8rem;letter-spacing:.06em;color:var(--soft);margin:0 0 1rem}
h1{font-size:2.1rem;line-height:1.2;margin:.25rem 0 1rem;font-weight:700;max-width:24ch}
h2{font-size:1.25rem;margin:2.5rem 0 .75rem;padding-top:.75rem;border-top:1px solid var(--rule);display:flex;gap:.75rem}
h2 .no{color:var(--accent);font-size:1rem;padding-top:.15rem}
.row{display:block;margin:0 0 1rem}.row p{margin:0}
.row .no{color:var(--soft);font-size:.85rem;margin-right:.5rem}
.note{display:block;font-size:.78rem;line-height:1.45;color:var(--soft);border-left:2px solid var(--hair);padding-left:.6rem;margin:.35rem 0 0}
.note .cite{font-size:1em}
@media (min-width:1100px){.row{display:grid;grid-template-columns:minmax(0,1fr) 12rem;gap:2rem;align-items:start}.note{margin:0}}
.small{font-size:.8rem;color:var(--soft)}
.summary{margin:1.5rem 0 2rem}.summary svg.hflowsvg{width:100%;max-width:44rem}
.s-frame{fill:none;stroke:var(--ink);stroke-width:1.5}.s-rule{stroke:var(--rule);stroke-width:1}
.s-lab{font:700 15px ui-monospace,Menlo,Consolas,monospace;fill:var(--accent)}.s-val{font:16px Charter,Georgia,serif;fill:var(--ink)}
figure{margin:1rem 0}figcaption{font-size:.85rem;color:var(--soft)}
.lane{width:100%}.l-box{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}.l-rule{stroke:var(--rule);stroke-width:1.5}.l-n{font:700 15px ui-monospace,Menlo,monospace;fill:var(--accent)}.l-t{font:16px Charter,Georgia,serif;fill:var(--ink)}.l-br{fill:none;stroke:var(--soft);stroke-width:1.5}.l-bt{font:14px ui-monospace,Menlo,monospace;fill:var(--soft)}.l-arc{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4}
table{border-collapse:collapse;width:100%;font-size:.95rem;margin:.5rem 0}caption{text-align:left;font-weight:700;padding:.25rem 0 .5rem}
th,td{border-top:1px solid var(--hair);padding:.55rem .5rem .55rem 0;text-align:left;vertical-align:top}thead th{border-top:2px solid var(--ink);font-size:.85rem}
td p{margin:.3rem 0}td.tick{text-align:center;width:7rem}.box{display:inline-block;width:1.1rem;height:1.1rem;border:1.5px solid var(--ink);position:relative;vertical-align:middle}.box::after{content:"";position:absolute;left:.3rem;top:.05rem;width:.35rem;height:.65rem;border:solid var(--accent);border-width:0 2px 2px 0;transform:rotate(45deg)}
.tablewrap{overflow-x:auto}
.pinc{margin:.25rem 0;padding-left:1.1rem}.plabel,.pfor,.phead,.pprice{margin:.2rem 0}.phead{font-weight:700}
.pfig svg{max-width:30rem}.f-line{stroke:var(--rule);stroke-width:1.5}.f-node{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}.f-txt{font:18px Charter,Georgia,serif;fill:var(--ink)}.f-hub{fill:var(--paper);stroke:var(--accent);stroke-width:2}.f-hubtxt{font:700 20px Charter,Georgia,serif;fill:var(--ink)}.f-small{font-weight:400;font-size:17px}
.decision{border:1.5px solid var(--ink);padding:1rem;margin:1rem 0}.decision .btn{border:1.5px solid var(--accent);color:var(--accent)}
.ptypes{padding-left:1.1rem}.btn{border:1.5px solid var(--accent);color:var(--accent)}
.sources{font-size:.85rem;padding-left:1.4rem}
.foot{max-width:58rem;margin:0 auto 2rem;padding:0 16px;font-size:.9rem}.foot .small{font-size:.8rem}`;
  const R_ = (no, body, note = '') => `<div class="row"><p><span class="no">${no}</span>${body}</p>${note ? `<span class="note">${note}</span>` : ''}</div>`;
  const noteCite = id => cite(id);
  // summary box: a wide version, and a stacked narrow twin under 600 px (aria-hidden)
  const valText = [headline.text, 'Four plans, set out as options A to D in section 5.', 'Their published words, and the dated sources in the annex.', T.next_step_text];
  const wideVals = valText.map(t => wrap(t, 52));
  let y = 0; const rowsSvg = [];
  T.summary_rows.forEach((lab, i) => {
    rowsSvg.push(`${i ? `<line class="s-rule" x1="0" y1="${y}" x2="640" y2="${y}"/>` : ''}<text class="s-lab" x="16" y="${y + 30}">${esc(lab)}</text><text class="s-val" y="${y + 30}">${tspans(wideVals[i], 170, 22)}</text>`);
    y += 26 + wideVals[i].length * 22;
  });
  const narVals = valText.map(t => wrap(t, 34));
  let ny = 0; const nRows = [];
  T.summary_rows.forEach((lab, i) => {
    nRows.push(`${i ? `<line class="s-rule" x1="0" y1="${ny}" x2="360" y2="${ny}"/>` : ''}<text class="s-lab" x="14" y="${ny + 28}">${esc(lab)}</text><text class="s-val" y="${ny + 52}">${tspans(narVals[i], 14, 22)}</text>`);
    ny += 46 + narVals[i].length * 22;
  });
  const summarySvg = `<figure class="summary"><svg class="hflowsvg" viewBox="0 0 640 ${y}" role="img" aria-labelledby="sb-t sb-d"><title id="sb-t">Summary box</title><desc id="sb-d">${esc(T.summary_rows.map((l, i) => `${l}: ${valText[i]}`).join('. '))}</desc><rect class="s-frame" x="1" y="1" width="638" height="${y - 2}"/><line class="s-rule" x1="154" y1="0" x2="154" y2="${y}"/>${rowsSvg.join('')}</svg><svg class="vflow" viewBox="0 0 360 ${ny}" aria-hidden="true" focusable="false"><rect class="s-frame" x="1" y="1" width="358" height="${ny - 2}"/>${nRows.join('')}</svg><figcaption>AgentiCCells's summary of this paper. The question is their published headline ${cite(hFact)}.</figcaption></figure>`;
  // swimlane
  const bx = i => 20 + i * 188;
  const lane = `<figure><svg class="lane hflowsvg" viewBox="0 0 960 250" role="img" aria-labelledby="ln-t ln-d"><title id="ln-t">${esc(C.flow.svg_title)}</title><desc id="ln-d">${esc(C.flow.svg_desc)}</desc>
<line class="l-rule" x1="10" y1="95" x2="950" y2="95"/>
${steps.map((s, i) => `<rect class="l-box" x="${bx(i)}" y="60" width="160" height="70"/><text class="l-n" x="${bx(i) + 12}" y="84">3.${s.n}</text><text class="l-t" x="${bx(i) + 12}" y="112">${esc(s.name)}</text>`).join('')}
<path class="l-arc" d="M${bx(4) + 80} 60 C ${bx(4) + 80} 30, ${bx(0) + 80} 30, ${bx(0) + 80} 56"/><text class="l-bt" x="480" y="20" text-anchor="middle">${esc(C.flow.return_label)}</text>
<path class="l-br" d="M${bx(0)} 150 v10 h${bx(2) + 160 - bx(0)} v-10"/><text class="l-bt" x="${bx(0)}" y="184">${esc(C.flow.brackets[0].text)}</text>
<path class="l-br" d="M${bx(3)} 150 v10 h160 v-10"/><text class="l-bt" x="${bx(3)}" y="184">${esc(C.flow.brackets[1].text)}</text>
</svg>${vflow({ line: 'l-rule', box: 'l-box', n: 'l-n', t: 'l-t', arc: 'l-arc', lt: 'l-bt' })}<figcaption>${flowCaption()}</figcaption></figure>`;
  const opts = plans.map((p, i) => {
    const cost = /discussed/i.test(p.price) ? T.cost_to_be_discussed : p.price;
    return `<tr><th scope="row">${esc(T.options_letters[i])}. ${esc(p.name)}</th><td>${esc(p.label || '')}</td><td>${p.for ? `<q>${esc(p.for)}</q>` : ''}${p.includes.length ? `<ul class="pinc">${p.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${p.includes_note ? `<span class="small">${ours(p.includes_note)}</span>` : ''}${p.start_quote ? `<p><q>${esc(p.start_quote)}</q></p>` : ''}</td><td>${esc(cost)}${cost === T.cost_not_published ? ` (read ${esc(F.c9.read)})` : ''}</td></tr>`;
  }).join('');
  const annex = rows.length ? `<section aria-labelledby="annex"><h2 id="annex"><span class="no">A</span>${esc(T.annex_title)}</h2>
<p class="small">${esc(C.context.timeline_note)}</p>
<div class="tablewrap"><table><thead><tr><th scope="col">Date</th><th scope="col">What the source says</th><th scope="col">Source</th></tr></thead><tbody>${rows.map(r => `<tr><td class="mono">${time(r.date)}</td><td>${rowWhat(r)}</td><td class="small">${rowSource(r)}</td></tr>`).join('')}</tbody></table></div>
<p><strong>${esc(NLA)}</strong></p></section>` : '';
  const body = `<header>${noticeBar()}<div class="top">${brand()}<span>${theirBtn()}</span></div></header>
<main id="main"><article class="paper">
<svg class="fold" viewBox="0 0 44 44" aria-hidden="true"><path d="M0 0H44V44Z"/></svg>
<p class="kicker">${esc(T.header)}</p>
<p class="small">${eyebrow()}</p>
<h1><q>${esc(headline.text)}</q></h1>
<p class="small">Their headline ${cite(hFact)}.</p>
${summarySvg}
<section aria-labelledby="p1"><h2 id="p1"><span class="no">1</span>The question</h2>
${R_('1.1', q(C.home.lede[0]), noteCite(C.home.lede[0].fact_id))}
${R_('1.2', ours(C.home.lede[1]), noteCite('c3'))}
${R_('1.3', q(C.home.question), noteCite(C.home.question.fact_id))}
</section>
<section aria-labelledby="p2"><h2 id="p2"><span class="no">2</span>${esc(C.home.show_title)}</h2>
${R_('2.0', ours(C.home.show_intro), noteCite('c3'))}
${C.home.show.map((s, i) => { s.fact_ids.forEach(id => used.add(id)); return R_(`2.${i + 1}`, `<strong>${esc(s.tag)}: ${esc(s.title)}.</strong> <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}`); }).join('')}
</section>
<section aria-labelledby="p3"><h2 id="p3"><span class="no">3</span>${esc(C.flow.title)}</h2>
${R_('3.0', ours(C.flow.intro), noteCite('c9'))}
${lane}
<h3 class="vh">${esc(C.flow.twin_heading)}</h3>
${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return R_(`3.${s.n}`, `<strong>${esc(s.name)}.</strong> <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}`, `Published: <q>${esc(s.published)}</q> ${cite(s.source_fact_ids[0])}`); }).join('')}
<p class="small">${esc(C.flow.footnote)}</p>
</section>
<section aria-labelledby="p4"><h2 id="p4"><span class="no">4</span>${esc(T.areas_table_title)}</h2>
${R_('4.1', qc(C.home.areas_intro))}
<div class="tablewrap"><table><thead><tr><th scope="col">Area, as published</th><th scope="col">${esc(C.areas_page.summary_label)}</th><th scope="col">${esc(T.areas_tick_head)}</th></tr></thead><tbody>${areas.map(a => { used.add(a.fact_id); return `<tr><th scope="row">${esc(a.name)}</th><td>${esc(a.text)}</td><td class="tick"><span class="box" aria-hidden="true"></span><span class="vh">Yes</span></td></tr>`; }).join('')}</tbody></table></div>
<p class="small">${esc(C.areas_page.caption)} ${cite('c6')}</p>
</section>
<section aria-labelledby="p5"><h2 id="p5"><span class="no">5</span>${esc(T.options_title)}</h2>
<div class="tablewrap"><table><thead><tr><th scope="col">Option</th><th scope="col">Their label</th><th scope="col">${esc(C.plans_page.row_labels.includes)}</th><th scope="col">${esc(T.cost_head)}</th></tr></thead><tbody>${opts}</tbody></table></div>
${plansNote()}
<p>${actionShort('start')} ${actionShort('call')}</p>
</section>
<section aria-labelledby="p6"><h2 id="p6"><span class="no">6</span>${esc(P.h1)}</h2>
${partnerText()}
${partnerFigure('pf')}
</section>
<section aria-labelledby="p7"><h2 id="p7"><span class="no">7</span>${esc(founder.section_title)}</h2>
${R_('7.1', `<strong>${esc(founder.name)}</strong>, ${esc(founder.title)}. ${q(founder.title_basis)}`, cite(founder.title_basis.fact_id))}
${founder.lines.map((l, i) => R_(`7.${i + 2}`, q(l), cite(l.fact_id))).join('')}
<p class="small">${esc(founder.agreement)}</p>
</section>
<section aria-labelledby="p8"><h2 id="p8"><span class="no">8</span>${esc(T.next_step_title)}</h2>
<div class="decision"><p>${esc(T.next_step_text)}</p><p>${action('start')}</p><p class="small">${esc(C.actions.note)}</p></div>
</section>
${annex}
<section aria-labelledby="srcs"><h2 id="srcs"><span class="no">B</span>Sources</h2>${sourcesList()}</section>
</article></main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer(d.slug));
}

// ---------- 2. Readiness Dial ----------
function dial() {
  const d = D.dial; const T = C.design_text.dial; used = new Set();
  const css = `:root{--bg:#f3f5f7;--panel:#ffffff;--ink:#0f1b24;--soft:#4a5966;--line:#c9d2da;--stroke:#5f6f7c;--teal:#0b6e69;--amber:#8a5200;--link:#0b6e69;--focus:#8a5200}
@media (prefers-color-scheme:dark){:root{--bg:#0b1218;--panel:#121c24;--ink:#e6edf2;--soft:#a9b7c2;--line:#2a3a47;--stroke:#7d8e9b;--teal:#4fd1c5;--amber:#f0b45a;--link:#4fd1c5;--focus:#f0b45a}}
body{font:17px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}time,.sn{font-variant-numeric:tabular-nums}
.notice{background:var(--panel);border-bottom:1px solid var(--line);padding:.6rem 16px}.notice-in{max-width:84rem;margin:0 auto}
.top{max-width:84rem;margin:0 auto;padding:.5rem 16px;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between}
.brand{font-weight:700;letter-spacing:.02em}.tag,.plab,.stag,.chip{font:700 .75rem ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}
.tag{color:var(--amber);border:1px solid var(--amber);border-radius:4px;padding:.1rem .4rem}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--teal);border-radius:6px;color:var(--teal);text-decoration:none;font-weight:600}
.dash{max-width:84rem;margin:0 auto;padding:16px;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}
.panel{grid-column:span 12;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:1.1rem 1.2rem}
.plab{color:var(--soft);margin:0 0 .5rem;display:block}
@media (min-width:900px){.s8{grid-column:span 8}.s4{grid-column:span 4}.s7{grid-column:span 7}.s5{grid-column:span 5}.s6{grid-column:span 6}.s3{grid-column:span 3}}
@media (min-width:600px) and (max-width:899px){.s4,.s3{grid-column:span 6}}
h1{font-size:clamp(1.6rem,3.2vw,2.5rem);line-height:1.15;margin:.25rem 0 .75rem;font-weight:700}
h2{font-size:1.15rem;margin:0 0 .6rem}h3{font-size:1.02rem;margin:.2rem 0 .4rem}
.lede{margin:.4rem 0}.small{font-size:.85rem;color:var(--soft)}
.status{border-left:4px solid var(--amber)}
.btn{background:var(--teal);color:var(--panel);border-radius:6px;margin:.25rem .25rem .25rem 0}
.btn2{display:inline-flex;align-items:center;min-height:44px;padding:.5rem 1rem;border:1px solid var(--teal);border-radius:6px;color:var(--teal);text-decoration:none;font-weight:700;margin:.25rem .25rem .25rem 0}
.stag{color:var(--teal);margin:0}
.rail{width:100%;max-width:960px;display:block;margin:.25rem 0 1rem}.r-line{stroke:var(--stroke);stroke-width:2}.r-pill{fill:var(--panel);stroke:var(--teal);stroke-width:2}.r-n{font:700 18px ui-monospace,Menlo,monospace;fill:var(--teal)}.r-t{font:600 17px system-ui,sans-serif;fill:var(--ink)}.r-loop{fill:none;stroke:var(--amber);stroke-width:2;stroke-dasharray:6 5}.r-lt{font:14px ui-monospace,Menlo,monospace;fill:var(--soft)}
.stepgrid{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:1fr}
@media (min-width:900px){.stepgrid{grid-template-columns:repeat(5,minmax(0,1fr))}}
.stepgrid li{border:1px solid var(--line);border-radius:8px;padding:.75rem;font-size:.92rem}.stepgrid .sn{font:700 .75rem ui-monospace,Menlo,monospace;color:var(--teal);letter-spacing:.1em}
.dialfig{margin:0}.dialfig svg{display:block;width:100%;max-width:30rem;margin:0 auto}
.d-seg{fill:none;stroke:var(--stroke);stroke-width:2}.d-ring{fill:none;stroke:var(--line);stroke-width:1}.d-c{font:600 30px system-ui,sans-serif;fill:var(--ink)}.d-c2{font:20px system-ui,sans-serif;fill:var(--soft)}
figcaption{font-size:.85rem;color:var(--soft);text-align:center}
.legend{padding-left:1.3rem;margin:.5rem 0}.legend li{margin:.4rem 0}.legend span{display:block;font-size:.88rem;color:var(--soft)}
.chip{display:inline-block;border:1px solid var(--amber);color:var(--amber);border-radius:999px;padding:.1rem .55rem}
.pinc{padding-left:1.1rem;margin:.25rem 0}.pinc li::marker{color:var(--teal)}.phead{font-weight:700;margin:.4rem 0 .1rem}.plabel{font:700 .85rem ui-monospace,Menlo,monospace;;color:var(--amber);margin:.1rem 0 .4rem}.pfor,.pprice{margin:.3rem 0}.pstart .btn{width:100%}
.pfig svg{max-width:28rem;display:block}.f-line{stroke:var(--stroke);stroke-width:2}.f-node{fill:var(--panel);stroke:var(--teal);stroke-width:2}.f-txt{font:600 18px system-ui,sans-serif;fill:var(--ink)}.f-hub{fill:var(--panel);stroke:var(--amber);stroke-width:2.5}.f-hubtxt{font:700 20px system-ui,sans-serif;fill:var(--ink)}.f-small{font-weight:400;font-size:17px}
.events{list-style:none;padding:0;margin:.5rem 0;display:grid;gap:10px;grid-template-columns:1fr}
@media (min-width:700px){.events{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:1100px){.events{grid-template-columns:repeat(3,minmax(0,1fr))}}
.events li{border:1px solid var(--line);border-radius:8px;padding:.7rem .8rem;font-size:.92rem}.events time{display:inline-block;font:700 .85rem ui-monospace,Menlo,monospace;background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:.1rem .6rem;margin-bottom:.3rem}
.events .src{display:block;font-size:.82rem;color:var(--soft);margin-top:.3rem}.events .src a{color:var(--link)}
.cta{text-align:left;border-top:4px solid var(--teal)}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{max-width:84rem;margin:0 auto 2rem;padding:0 16px;font-size:.9rem}.foot .small{font-size:.82rem}`;
  // rail
  const px = i => 95 + i * 192;
  const rail = `<svg class="rail hflowsvg" viewBox="0 0 960 150" role="img" aria-labelledby="rl-t rl-d"><title id="rl-t">${esc(C.flow.svg_title)}</title><desc id="rl-d">${esc(C.flow.svg_desc)}</desc>
<line class="r-line" x1="${px(0)}" y1="60" x2="${px(4)}" y2="60"/>
${steps.map((s, i) => `<rect class="r-pill" x="${px(i) - 84}" y="38" width="168" height="44" rx="22"/><text class="r-n" x="${px(i) - 66}" y="66">${s.n}</text><text class="r-t" x="${px(i) - 46}" y="66">${esc(s.name)}</text>`).join('')}
<path class="r-loop" d="M${px(4)} 82 C ${px(4)} 140, ${px(0)} 140, ${px(0)} 86"/><text class="r-lt" x="480" y="140" text-anchor="middle">${esc(C.flow.return_label)}</text>
</svg>${vflow({ line: 'r-line', box: 'r-pill', n: 'r-n', t: 'r-t', arc: 'r-loop', lt: 'r-lt', rx: 28 })}`;
  // dial: six empty segments
  const cx = 300, cy = 300, ro = 270, ri = 170, gap = 3;
  const pt = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)].map(n => n.toFixed(1));
  const seg = i => { const a0 = i * 60 + gap, a1 = (i + 1) * 60 - gap; const [x0, y0] = pt(ro, a0), [x1, y1] = pt(ro, a1), [x2, y2] = pt(ri, a1), [x3, y3] = pt(ri, a0); return `<path class="d-seg" d="M${x0} ${y0} A${ro} ${ro} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 0 0 ${x3} ${y3} Z"/>`; };
  used.add(C.dial_caption.fact_id);
  const cLines = wrap(C.dial_caption.centre, 15);
  const dialSvg = `<figure class="dialfig"><svg viewBox="0 0 600 600" role="img" aria-labelledby="dl-t dl-d"><title id="dl-t">${esc(C.areas_page.svg_title)}</title><desc id="dl-d">Six empty outlined segments, one per area, clockwise from the top: ${esc(areas.map(a => a.name).join('; '))}. Centre text: ${esc(C.dial_caption.centre)}</desc>
<circle class="d-ring" cx="${cx}" cy="${cy}" r="${ro + 14}"/>${[0, 1, 2, 3, 4, 5].map(seg).join('')}
<text class="d-c" y="${cy - (cLines.length - 1) * 19 + 10}" text-anchor="middle">${tspans(cLines, cx, 38)}</text>
</svg><figcaption>${esc(C.dial_caption.caption)}</figcaption></figure>`;
  const plansPanels = plans.map(p => `<section class="panel s3" aria-labelledby="pl-${esc(p.name.replace(/\W+/g, '-'))}"><span class="plab">Plan</span><h3 id="pl-${esc(p.name.replace(/\W+/g, '-'))}">${esc(p.name)}</h3>${p.name === 'Professional' ? `<p><span class="chip">${esc(T.essentials_chip)}</span></p>` : ''}${planBody(p).replace(`>${esc(C.plans_page.row_labels.includes)}<`, `>${esc(T.includes_label)}<`)}</section>`).join('\n');
  const events = rows.length ? `<section class="panel" aria-labelledby="ev"><span class="plab">Timeline</span><h2 id="ev">${esc(T.events_title)}</h2><p class="small">${esc(C.context.timeline_note)}</p>
<ol class="events">${rows.map(r => `<li>${time(r.date)}<br>${rowWhat(r)}<span class="src">${rowSource(r)}</span></li>`).join('')}</ol>
<p><strong>${esc(NLA)}</strong></p></section>` : '';
  const body = `<header>${noticeBar()}<div class="top">${brand()}<span>${theirBtn()}</span></div></header>
<main id="main" class="dash">
<section class="panel s8"><span class="plab">${eyebrow()}</span><h1><q>${esc(headline.text)}</q></h1><p class="small">${cite(hFact)}</p>${ledeParas()}</section>
<section class="panel s4 status" aria-labelledby="st"><span class="plab">Their site</span><h2 id="st">Where the check runs</h2><p>${esc(T.status_text)}</p><p>${actionShort('start')}</p><p class="small">${esc(C.actions.note)}</p></section>
<section class="panel" aria-labelledby="sh"><h2 id="sh">${esc(C.home.show_title)}</h2><p class="small">${ours(C.home.show_intro)}</p></section>
${C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="panel s4"><p class="stag">${esc(s.tag)}</p><h3>${esc(s.title)}</h3><p><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></div>`; }).join('\n')}
<section class="panel" aria-labelledby="fl"><span class="plab">Flow</span><h2 id="fl">${esc(C.flow.title)}</h2><p class="small">${ours(C.flow.intro)}</p>
${rail}
<ol class="stepgrid">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li><span class="sn">STEP ${s.n}</span><h3>${esc(s.name)}</h3><p>Published: <q>${esc(s.published)}</q></p><p class="small"><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></li>`; }).join('')}</ol>
<p class="small">${flowCaption()} ${esc(C.flow.footnote)}</p></section>
<section class="panel s7" aria-labelledby="ar"><span class="plab">Areas</span><h2 id="ar">${esc(C.home.areas_title)}</h2>${dialSvg}</section>
<section class="panel s5" aria-labelledby="lg"><span class="plab">Legend</span><h2 id="lg">What each area covers</h2>${areasIntro()}<p class="small">Clockwise from the top. ${esc(C.areas_page.summary_label)} under each name.</p>
<ol class="legend">${areas.map(a => { used.add(a.fact_id); return `<li><strong>${esc(a.name)}</strong><span>${esc(a.text)}</span></li>`; }).join('')}</ol><p class="small">${esc(C.areas_page.caption)} ${cite('c6')}</p></section>
<section class="panel" aria-labelledby="pp"><span class="plab">Plans</span><h2 id="pp">${esc(C.plans_page.h1)}</h2><p class="small">${ours(C.plans_page.intro)}</p></section>
${plansPanels}
<div class="panel">${plansNote()}</div>
<section class="panel s6" aria-labelledby="pa"><span class="plab">Partners</span><h2 id="pa">${esc(P.h1)}</h2>${partnerText()}</section>
<div class="panel s6">${partnerFigure('pf')}</div>
${events}
<section class="panel s6" aria-labelledby="fo">${founderBlock('h2').replace('<h2>', '<h2 id="fo">')}</section>
<section class="panel s6 cta" aria-labelledby="ct"><h2 id="ct">${q(C.home.cta.title)}</h2><p class="small">${cite(C.home.cta.title.fact_id)}</p><p>${esc(C.home.cta.text)}</p><p>${action('start')} ${action('partner', 'btn2')}</p></section>
<section class="panel" aria-labelledby="sr"><h2 id="sr">Sources</h2>${sourcesList()}</section>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer(d.slug));
}

// ---------- 3. Deadline Calendar ----------
function calendar() {
  const d = D.calendar; const T = C.design_text.calendar; used = new Set();
  const css = `:root{--bg:#f6f3ec;--ink:#1d1d1f;--soft:#55524b;--rule:#cfc8b8;--stroke:#7a7466;--blue:#1d3f73;--green:#2f6b3a;--link:#1d3f73;--focus:#1d3f73;--card:#fffdf8}
@media (prefers-color-scheme:dark){:root{--bg:#121417;--ink:#ebe7df;--soft:#b4afa5;--rule:#3a3d42;--stroke:#8a8f97;--blue:#8fb3ec;--green:#8fd19a;--link:#8fb3ec;--focus:#8fb3ec;--card:#1a1d21}}
body{font:18px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.serif,h1,h2,h3{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
.mono,time{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.notice{border-bottom:3px double var(--rule);padding:.6rem 16px}.notice-in{max-width:76rem;margin:0 auto}
.top{max-width:76rem;margin:0 auto;padding:.5rem 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem 1rem;border-bottom:1px solid var(--ink)}
.brand{font:700 1.05rem "Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.08em}.tag{font:700 .7rem ui-monospace,Menlo,monospace;color:var(--green);border:1px solid var(--green);padding:.05rem .35rem;letter-spacing:.08em;text-transform:uppercase}
.their{display:inline-flex;align-items:center;min-height:44px;min-width:44px;padding:0 .9rem;border:2px solid var(--blue);border-radius:4px;color:var(--blue);font-weight:700;text-decoration:none}
.mast{max-width:76rem;margin:0 auto;padding:2rem 16px 1.5rem;border-bottom:1px solid var(--rule)}
.kicker{font:700 .8rem ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin:0}
h1{font-size:clamp(2.1rem,5.4vw,4rem);line-height:1.05;margin:.4rem 0 1rem;max-width:20ch;font-weight:700}
.lede{max-width:40rem;font-size:1.08rem;margin:.4rem 0}
.ed{max-width:76rem;margin:0 auto;padding:0 16px;display:block}
@media (min-width:1000px){.ed{display:grid;grid-template-columns:20rem minmax(0,1fr);gap:3rem}.spinecol{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto;padding-bottom:1rem}}
.spinecol h2{font-size:1.2rem;margin:1.5rem 0 .25rem}
.scroller{border:1px solid var(--rule);background:var(--card);padding:.5rem}
.sv-h{display:block}.sv-v{display:none}
@media (max-width:999px){.scroller{overflow-x:auto}.sv-h{width:${Math.max(600, current.length * 150)}px;max-width:none}}
@media (min-width:1000px){.sv-h{display:none}.sv-v{display:block;width:100%}}
.sp-line{stroke:var(--ink);stroke-width:2}.sp-tick{fill:var(--card);stroke:var(--blue);stroke-width:2.5}.sp-d{font:700 15px ui-monospace,Menlo,monospace;fill:var(--ink)}.sp-n{font:14px ui-monospace,Menlo,monospace;fill:var(--soft)}.sp-read{font:italic 14px ui-monospace,Menlo,monospace;fill:var(--green)}.sp-rm{stroke:var(--green);stroke-width:2;stroke-dasharray:4 3}
.story{min-width:0;padding-bottom:2rem}.story section{border-top:1px solid var(--rule);padding:1.5rem 0}
.story h2{font-size:clamp(1.5rem,3vw,2.1rem);line-height:1.15;margin:.2rem 0 .75rem}
.story p,.story li{max-width:42rem}
.small{font-size:.85rem;color:var(--soft)}
.dlist{list-style:none;margin:0;padding:0;counter-reset:n}.dlist li{counter-increment:n;display:grid;grid-template-columns:2.2rem minmax(0,1fr);gap:.25rem .75rem;padding:.6rem 0;border-bottom:1px solid var(--rule)}
.dlist li::before{content:counter(n);font:700 .9rem ui-monospace,Menlo,monospace;color:var(--blue);padding-top:.15rem}
.dlist time{font-weight:700;display:block}.dlist .src{display:block;font-size:.85rem;color:var(--soft)}.dlist .src a{color:var(--link)}
.hflow svg.hflowsvg{width:100%}.h-line{stroke:var(--stroke);stroke-width:2}.h-dot{fill:var(--bg);stroke:var(--green);stroke-width:2.5}.h-n{font:700 18px ui-monospace,Menlo,monospace;fill:var(--green)}.h-t{font:700 22px "Iowan Old Style",Palatino,Georgia,serif;fill:var(--ink)}.h-p{font:18px ui-monospace,Menlo,monospace;fill:var(--soft)}.vflow .h-p{font-size:14px}.vflow .h-t{font-size:18px}.hflow{margin:1rem 0}.h-box{fill:var(--bg);stroke:var(--green);stroke-width:2}.h-arc{fill:none;stroke:var(--green);stroke-width:2;stroke-dasharray:5 4}
.steps{padding-left:1.3rem}.steps li{margin:.35rem 0}
.pull{font:italic 1.35rem/1.35 "Iowan Old Style",Palatino,Georgia,serif;border-left:4px solid var(--blue);padding-left:1rem;margin:1rem 0}
.beats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
@media (min-width:1200px){.beats{grid-template-columns:repeat(3,minmax(0,1fr))}}
.beats div{border-top:4px solid var(--ink);padding-top:.5rem}.beats h3{font-size:1.1rem;margin:.1rem 0 .3rem;line-height:1.2}.beats p{font-size:.92rem;margin:0}
.shows{display:grid;gap:1rem}@media (min-width:800px){.shows{grid-template-columns:repeat(3,minmax(0,1fr))}}
.show{border-top:2px solid var(--green);padding-top:.4rem}.stag{font:700 .8rem ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--green);margin:0}.show h3{margin:.1rem 0 .3rem}.show p{font-size:.95rem}
.side{border:2px solid var(--ink);background:var(--card);padding:1rem 1.2rem}
.side h2{border-bottom:1px solid var(--ink);padding-bottom:.4rem}
.pgrid{display:grid;gap:1rem}@media (min-width:800px){.pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.pgrid article{border-top:1px solid var(--rule);padding-top:.5rem}.pgrid h3{margin:0 0 .2rem}
.plabel{font:700 .85rem ui-monospace,Menlo,monospace;color:var(--blue);margin:0 0 .3rem}.phead{font-weight:700;margin:.4rem 0 0}.pinc{padding-left:1.1rem;margin:.2rem 0}.pfor,.pprice{margin:.3rem 0;font-size:.95rem}
.btn{border:2px solid var(--blue);color:var(--blue)}.btnp{background:var(--blue);color:var(--bg)}
.pfig svg{max-width:28rem}.f-line{stroke:var(--stroke);stroke-width:1.5}.f-node{fill:var(--card);stroke:var(--ink);stroke-width:1.5}.f-txt{font:18px system-ui,sans-serif;fill:var(--ink)}.f-hub{fill:var(--card);stroke:var(--blue);stroke-width:2.5}.f-hubtxt{font:700 20px "Iowan Old Style",Georgia,serif;fill:var(--ink)}.f-small{font-weight:400;font-size:17px}
figcaption{font-size:.85rem;color:var(--soft)}
.ctabox{border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);padding:1.5rem 0;margin:1rem 0}
.ctabox h2 a{color:var(--blue)}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{max-width:76rem;margin:0 auto 2rem;padding:1rem 16px 0;border-top:1px solid var(--ink);font-size:.9rem}.foot .small{font-size:.82rem}`;
  // spine: numbers match the list numbering (full list, including replaced rows)
  const numOf = r => rows.indexOf(r) + 1;
  const vH = 60 + current.length * 74 + 60;
  const spineV = `<svg class="sv-v" viewBox="0 0 300 ${vH}" role="img" aria-labelledby="spv-t spv-d"><title id="spv-t">${esc(T.spine_title)}</title><desc id="spv-d">${esc(current.map(r => `${fmt(r.date)}: ${r.what}`).join('. '))}</desc>
<line class="sp-line" x1="40" y1="30" x2="40" y2="${vH - 50}"/>
${current.map((r, i) => { const y = 60 + i * 74; return `<circle class="sp-tick" cx="40" cy="${y}" r="9"/><text class="sp-d" x="64" y="${y + 5}">${esc(fmt(r.date))}</text><text class="sp-n" x="64" y="${y + 27}">[${numOf(r)}] ${esc(srcInfo(r.id).publisher)}</text>`; }).join('')}
<line class="sp-rm" x1="20" y1="${vH - 34}" x2="60" y2="${vH - 34}"/><text class="sp-read" x="70" y="${vH - 29}">${esc(T.read_marker_label)} ${esc(R.read)}</text>
</svg>`;
  const hW = Math.max(600, current.length * 150);
  const spineH = `<svg class="sv-h" viewBox="0 0 ${hW} 150" role="img" aria-labelledby="sph-t sph-d"><title id="sph-t">${esc(T.spine_title)}</title><desc id="sph-d">${esc(current.map(r => `${fmt(r.date)}: ${r.what}`).join('. '))}</desc>
<line class="sp-line" x1="20" y1="40" x2="${hW - 20}" y2="40"/>
${current.map((r, i) => { const x = 40 + i * 150; return `<circle class="sp-tick" cx="${x}" cy="40" r="9"/><text class="sp-d" x="${x - 10}" y="78">${esc(fmt(r.date))}</text><text class="sp-n" x="${x - 10}" y="100">[${numOf(r)}] ${esc(srcInfo(r.id).publisher)}</text>`; }).join('')}
<text class="sp-read" x="30" y="136">${esc(T.read_marker_label)} ${esc(R.read)}</text>
</svg>`;
  // short flow timeline
  const fx = i => 110 + i * 185;
  const hflow = `<figure class="hflow"><svg class="hflowsvg" viewBox="0 0 960 205" role="img" aria-labelledby="hf-t hf-d"><title id="hf-t">${esc(C.flow.svg_title)}</title><desc id="hf-d">${esc(C.flow.svg_desc)}</desc>
<line class="h-line" x1="${fx(0)}" y1="50" x2="${fx(4)}" y2="50"/>
${steps.map((s, i) => `<circle class="h-dot" cx="${fx(i)}" cy="50" r="16"/><text class="h-n" x="${fx(i)}" y="56" text-anchor="middle">${s.n}</text><text class="h-t" x="${fx(i)}" y="100" text-anchor="middle">${esc(s.name)}</text>${s.published.length < 22 ? `<text class="h-p" x="${fx(i)}" y="${i % 2 ? 152 : 128}" text-anchor="middle">${esc(s.published)}</text>` : ''}`).join('')}
<text class="h-p" x="${fx(4) + 40}" y="190" text-anchor="end">${esc(C.flow.return_label)}</text>
</svg>${vflow({ line: 'h-line', box: 'h-box', n: 'h-n', t: 'h-t', arc: 'h-arc', lt: 'h-p' })}<figcaption>${flowCaption()}</figcaption></figure>`;
  const flowQ = T.flow_quote;
  const body = `<header>${noticeBar()}<div class="top">${brand()}${theirBtn()}</div></header>
<main id="main">
<div class="mast"><p class="kicker">${eyebrow()}</p><h1><q>${esc(headline.text)}</q></h1><p class="small">${cite(hFact)}</p>${ledeParas()}</div>
<div class="ed">
<aside class="spinecol" aria-labelledby="spine-h"><h2 id="spine-h">${esc(T.spine_title)}</h2><p class="small">Numbers match the list in the story.</p>
${rows.length ? `<div class="scroller" role="region" aria-label="${esc(T.scroller_label)}" tabindex="0">${spineV}${spineH}</div><p class="small">${esc(NLA)}</p>` : ''}</aside>
<div class="story">
<section aria-labelledby="why"><h2 id="why">${esc(C.home.why_now_title)}</h2>
<p class="pull">${q(C.home.question)}</p><p class="small">${cite(C.home.question.fact_id)}</p>
<p>${ours(C.home.why_now_intro)}</p>
${rows.length ? `<h3>${esc(T.list_title)}</h3><p class="small">${esc(C.context.timeline_note)}</p>
<ol class="dlist">${rows.map(r => `<li><div>${time(r.date)}${rowWhat(r)}<span class="src">${rowSource(r)}</span></div></li>`).join('')}</ol>
<p><strong>${esc(NLA)}</strong></p>` : ''}
</section>
<section aria-labelledby="flow"><h2 id="flow">${esc(T.flow_title)}</h2>
<p>${ours(C.flow.intro)}</p>
${hflow}
<p>Their site says the outputs come <q>${esc(flowQ.text)}</q> ${cite(flowQ.fact_id)}.</p>
<h3>${esc(C.flow.twin_heading)}</h3>${stepsList()}
<p class="small">${esc(C.flow.footnote)}</p>
</section>
<section aria-labelledby="show"><h2 id="show">${esc(C.home.show_title)}</h2><p class="small">${ours(C.home.show_intro)}</p><div class="shows">${showItems()}</div></section>
<section aria-labelledby="areas"><h2 id="areas">${esc(C.home.areas_title)}</h2>${areasIntro()}<p class="small">${esc(C.areas_page.summary_label)} under each name.</p>
<div class="beats">${areas.map(a => { used.add(a.fact_id); return `<div><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`; }).join('')}</div>
<p class="small">${esc(C.areas_page.caption)} ${cite('c6')}</p></section>
<section aria-labelledby="ways"><div class="side"><h2 id="ways">${esc(T.plans_title)}</h2><p class="small">${ours(C.plans_page.intro)}</p>
<div class="pgrid">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planBody(p)}</article>`).join('')}</div>${plansNote()}</div></section>
<section aria-labelledby="part"><h2 id="part">${esc(P.h1)}</h2>${partnerText()}${partnerFigure('pf')}</section>
<section aria-labelledby="fo">${founderBlock('h2').replace('<h2>', '<h2 id="fo">')}</section>
<section aria-labelledby="cta"><div class="ctabox"><h2 id="cta"><a href="${THEIRS}">${esc(C.calendar_cta.title)}${sr(C.actions.start.sr)}</a></h2><p>${esc(C.calendar_cta.text)}</p><p class="small">${esc(C.actions.note)}</p></div></section>
<section aria-labelledby="srcs"><h2 id="srcs">Sources</h2>${sourcesList()}</section>
</div></div>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer(d.slug));
}

// ---------- 4. Grid Poster ----------
function grid() {
  const d = D.grid; const T = C.design_text.grid; used = new Set();
  const css = `:root{--bg:#ffffff;--ink:#111111;--soft:#4d4d4d;--line:#ececec;--red:#c42d1a;--band:#c42d1a;--onband:#ffffff;--link:#111111;--focus:#c42d1a}
@media (prefers-color-scheme:dark){:root{--bg:#111111;--ink:#f2f2f2;--soft:#bdbdbd;--line:#222222;--red:#ff6b55;--band:#b3261e;--onband:#ffffff;--link:#f2f2f2;--focus:#ff6b55}}
body{font:18px/1.5 "Helvetica Neue",Helvetica,Arial,system-ui,sans-serif}
@media (min-width:1000px){body{background-image:repeating-linear-gradient(to right,transparent 0,transparent calc((100% - 2px)/12 - 1px),var(--line) calc((100% - 2px)/12 - 1px),var(--line) calc((100% - 2px)/12))}}
.notice{background:var(--ink);color:var(--bg);padding:.6rem 16px}.notice-in{max-width:90rem;margin:0 auto}.notice a{color:var(--bg)}
.notice a:focus-visible{outline-color:var(--bg)}
.wrap{max-width:90rem;margin:0 auto;padding:0 16px}
.top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem 1rem;padding:.75rem 0;border-bottom:4px solid var(--ink)}
.brand{font-weight:800;letter-spacing:-.01em;text-transform:uppercase}.tag{background:var(--red);color:#fff;font-size:.75rem;padding:.15rem .45rem;letter-spacing:.06em;text-transform:uppercase}
@media (prefers-color-scheme:dark){.tag{background:var(--band)}}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 1rem;border:2px solid var(--ink);color:var(--ink);font-weight:800;text-decoration:none}
.g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
@media (min-width:1000px){.g{grid-template-columns:repeat(12,minmax(0,1fr));gap:24px}}
.c3,.c6,.c9,.c12,.c4,.c8{grid-column:1/-1}
@media (min-width:1000px){.c3{grid-column:span 3}.c4{grid-column:span 4}.c6{grid-column:span 6}.c8{grid-column:span 8}.c9{grid-column:span 9}.c12{grid-column:span 12}}
.hero{padding:2rem 0 3rem}
.eyebrow{font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--red);margin:0 0 1rem}
h1{font-size:clamp(2.6rem,9vw,7.5rem);line-height:.95;letter-spacing:-.03em;font-weight:800;margin:0 0 1.5rem}
.hl-a{display:inline}
@media (max-width:600px){.hl-a{display:block}}
.lede{max-width:40rem}
.qm svg{width:100%;max-width:22rem;display:block}.qm-sq{fill:var(--ink)}.qm-dot{fill:var(--red)}
.panel{border-top:4px solid var(--ink);padding:1.5rem 0 3rem}
.num{font-size:clamp(3.5rem,8vw,6rem);font-weight:800;line-height:.9;letter-spacing:-.04em;color:var(--red);margin:0}
h2{font-size:clamp(1.8rem,3.6vw,3rem);line-height:1;letter-spacing:-.02em;font-weight:800;margin:0 0 1rem}
h3{font-size:1.1rem;text-transform:uppercase;letter-spacing:.04em;font-weight:800;margin:.25rem 0 .4rem}
.small{font-size:.85rem;color:var(--soft)}
.show{border-top:2px solid var(--ink);padding-top:.5rem}.stag{color:var(--red);font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.06em}
.giant{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px;border-bottom:4px solid var(--red);padding-bottom:1.5rem}
@media (min-width:1000px){.giant{grid-template-columns:repeat(5,minmax(0,1fr))}}
.giant li{border-top:2px solid var(--ink);padding-top:.4rem}.giant .n{display:block;font-size:clamp(4rem,9vw,7rem);font-weight:800;line-height:.9;letter-spacing:-.05em}.giant p{font-size:.9rem;margin:.3rem 0}
.ret{color:var(--red);font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.9rem;margin:.6rem 0 0}
.blocks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (min-width:1000px){.blocks{grid-template-columns:repeat(3,minmax(0,1fr))}}
.blocks div{border:3px solid var(--ink);aspect-ratio:1/1;padding:.75rem;display:flex;flex-direction:column;justify-content:space-between;min-height:9rem}
.blocks h3{font-size:clamp(.95rem,1.6vw,1.25rem);text-transform:none;letter-spacing:-.01em;line-height:1.1}.blocks p{font-size:.85rem;margin:0}
@media (max-width:600px){.blocks div{aspect-ratio:auto}}
.redq{color:var(--red);font-size:clamp(1.3rem,2.2vw,1.8rem);font-weight:800;line-height:1.15;letter-spacing:-.01em}
.redq .cite{font-weight:400;letter-spacing:0;font-size:.85rem;display:block;margin-top:.4rem}
.pcols{display:grid;grid-template-columns:1fr;gap:0}
@media (min-width:1000px){.pcols{grid-template-columns:repeat(4,minmax(0,1fr))}.pcols article{border-left:6px solid var(--ink);padding:0 1.25rem}.pcols article:first-child{border-left:0;padding-left:0}}
@media (max-width:999px){.pcols article{border-top:6px solid var(--ink);padding:.75rem 0 1.25rem}}
.pcols h3{font-size:1.5rem;text-transform:none;letter-spacing:-.02em}
.plabel{color:var(--red);font-weight:800;margin:0}.phead{font-weight:800;margin:.5rem 0 0}.pinc{padding-left:1.1rem;margin:.25rem 0}.pfor,.pprice{margin:.4rem 0;font-size:.95rem}
.btn{background:var(--ink);color:var(--bg)}
table{border-collapse:collapse;width:100%}th,td{text-align:left;vertical-align:top;padding:.6rem .5rem .6rem 0;border-top:2px solid var(--ink)}thead th{text-transform:uppercase;font-size:.85rem;letter-spacing:.04em}
td.d{font-weight:800;white-space:nowrap}td .src{display:block;font-size:.82rem;color:var(--soft)}td .src a{color:var(--soft)}
@media (max-width:700px){table,thead,tbody,tr,th,td{display:block}thead{position:absolute;left:-9999px}tr{border-top:2px solid var(--ink);padding:.5rem 0}td{border:0;padding:.15rem 0}}
.pfig svg{max-width:28rem}.f-line{stroke:var(--ink);stroke-width:2}.f-node{fill:var(--bg);stroke:var(--ink);stroke-width:3}.f-txt{font:800 18px "Helvetica Neue",Arial,sans-serif;fill:var(--ink)}.f-hub{fill:var(--red)}.f-hubtxt{font:800 20px "Helvetica Neue",Arial,sans-serif;fill:#fff}.f-small{font-weight:400;font-size:17px}
@media (prefers-color-scheme:dark){.f-hub{fill:var(--band)}}
figcaption{font-size:.85rem;color:var(--soft)}
.band{background:var(--band);color:var(--onband);padding:3rem 0;margin-top:1rem}
.band a{color:var(--onband)}.band .big{display:inline-flex;align-items:center;min-height:44px;font-size:clamp(1.8rem,5vw,4rem);font-weight:800;letter-spacing:-.03em;line-height:1}
.band :focus-visible{outline-color:var(--onband)}.band p{max-width:44rem}
.ptypes{padding-left:1.1rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{border-top:4px solid var(--ink);margin-top:0}.foot-in{max-width:90rem;margin:0 auto;padding:1rem 16px 2rem;font-size:.9rem}.foot .small{font-size:.82rem}`;
  const brk = T.headline_break_after; const idx = headline.text.indexOf(brk);
  const h1 = idx > 0 ? `<span class="hl-a">${esc(headline.text.slice(0, idx + brk.length))}</span> ${esc(headline.text.slice(idx + brk.length).trim())}` : esc(headline.text);
  // question mark of six squares and one red dot
  const sq = [[60, 0], [140, 0], [220, 60], [220, 140], [140, 200], [140, 280]];
  const qmSvg = `<svg viewBox="0 0 300 460" role="img" aria-labelledby="qm-t qm-d"><title id="qm-t">${esc(d.signature)}</title><desc id="qm-d">A question mark made of six squares, one for each area: ${esc(areas.map(a => a.name).join('; '))}. The dot beneath is one Readiness Check.</desc>
${sq.map(([x, y]) => `<rect class="qm-sq" x="${x}" y="${y}" width="72" height="72"/>`).join('')}<circle class="qm-dot" cx="176" cy="410" r="42"/></svg>`;
  const P_ = (n, id, title, inner) => `<section class="panel g" aria-labelledby="${id}"><div class="c3"><p class="num" aria-hidden="true">${String(n).padStart(2, '0')}</p></div><div class="c9"><h2 id="${id}">${title}</h2>${inner}</div></section>`;
  const body = `<header>${noticeBar()}<div class="wrap"><div class="top">${brand()}${theirBtn()}</div></div></header>
<main id="main" class="wrap">
<section class="hero g" aria-labelledby="h1"><div class="c9"><p class="eyebrow">${eyebrow()}</p><h1 id="h1"><q>${h1}</q></h1><p class="small">${cite(hFact)}</p>${ledeParas()}<p>${action('start')}</p><p class="small">${esc(C.actions.note)}</p></div><div class="c3 qm">${qmSvg}</div></section>
${P_(2, 'show', esc(C.home.show_title), `<p class="small">${ours(C.home.show_intro)}</p><div class="g">${C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<div class="c4 show"><p class="stag">${esc(s.tag)}</p><h3>${esc(s.title)}</h3><p><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></div>`; }).join('')}</div>`)}
${P_(3, 'flow', esc(C.flow.title), `<p class="small">${ours(C.flow.intro)}</p><ol class="giant">${steps.map(s => { s.source_fact_ids.forEach(id => used.add(id)); return `<li><span class="n" aria-hidden="true">${s.n}</span><h3><span class="vh">Step ${s.n}: </span>${esc(s.name)}</h3><p>Published: <q>${esc(s.published)}</q></p><p class="small"><span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p></li>`; }).join('')}</ol><p class="ret">${esc(C.flow.return_label)}</p><p class="small">${flowCaption()} ${esc(C.flow.footnote)}</p>`)}
${P_(4, 'areas', esc(C.home.areas_title), `<div class="g"><div class="c8"><div class="blocks">${areas.map(a => { used.add(a.fact_id); return `<div><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`; }).join('')}</div><p class="small">${esc(C.areas_page.summary_label)} under each name. ${esc(C.areas_page.caption)} ${cite('c6')}</p></div><div class="c4"><p class="redq">${qc(C.home.areas_intro)}</p></div></div>`)}
${P_(5, 'plans', esc(C.plans_page.h1), `<p class="small">${ours(C.plans_page.intro)}</p><div class="pcols">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planBody(p)}</article>`).join('')}</div>${plansNote()}`)}
${P_(6, 'part', esc(P.h1), `<div class="g"><div class="c6">${partnerText()}</div><div class="c6">${partnerFigure('pf')}</div></div>`)}
${rows.length ? P_(7, 'dates', esc(C.context.timeline_title), `<p class="small">${esc(C.context.timeline_note)}</p><table><thead><tr><th scope="col">Date</th><th scope="col">What the source says</th></tr></thead><tbody>${rows.map(r => `<tr><td class="d">${time(r.date)}</td><td>${rowWhat(r)}<span class="src">${rowSource(r)}</span></td></tr>`).join('')}</tbody></table><p><strong>${esc(NLA)}</strong></p>`) : ''}
${P_(8, 'fo', esc(founder.section_title), founderBlock('h3', 'vh'))}
${P_(9, 'srcs', 'Sources', sourcesList())}
</main>
<section class="band" aria-labelledby="cta"><div class="wrap"><h2 id="cta" class="vh">${esc(C.home.cta.title.text)}</h2><p><q>${esc(C.home.cta.title.text)}</q> ${cite(C.home.cta.title.fact_id)}</p><p><a class="big" href="${THEIRS}">${esc(T.cta_band)}${sr(C.actions.start.sr)}</a></p><p>${esc(C.home.cta.text)}</p><p>${action('partner', 'btnb')}</p></div></section>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css: css + '.btnb{display:inline-flex;align-items:center;min-height:44px;font-weight:800;border:2px solid var(--onband);padding:.5rem 1rem;text-decoration:none}.band .cite{color:var(--onband)}' }) + body + footer(d.slug));
}

// ---------- 5. Quiet Counsel ----------
function counsel() {
  const d = D.counsel; const T = C.design_text.counsel; used = new Set();
  const css = `:root{--bg:#f4f1ea;--ink:#2a2a26;--soft:#5a5850;--rule:#d9d3c6;--sage:#46634f;--clay:#94532f;--link:#46634f;--focus:#94532f}
@media (prefers-color-scheme:dark){:root{--bg:#1a1c19;--ink:#e8e4d9;--soft:#b9b4a8;--rule:#3a3d37;--sage:#a7c4b1;--clay:#e0a483;--link:#a7c4b1;--focus:#e0a483}}
body{font:19px/1.7 "Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif}
.notice{padding:.7rem 16px;border-bottom:1px solid var(--rule);text-align:center}.notice-in{max-width:44rem;margin:0 auto}
.top{max-width:36rem;margin:0 auto;padding:1rem 16px;display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:space-between;align-items:center}
.brand{font-variant:small-caps;letter-spacing:.1em}.tag{font-variant:small-caps;color:var(--clay);letter-spacing:.08em}
.their{display:inline-flex;align-items:center;min-height:44px;color:var(--sage)}
.col{max-width:36rem;margin:0 auto;padding:0 16px}
.wide{max-width:52rem}
.sc{font-variant:small-caps;letter-spacing:.06em;color:var(--clay)}
h1{font-size:clamp(1.9rem,4.4vw,2.6rem);line-height:1.25;font-weight:400;margin:2.5rem 0 1rem}
h2{font-size:1.5rem;font-weight:400;margin:0 0 1rem}h3{font-size:1.1rem;font-weight:400;margin:.5rem 0 .25rem}
.sep{border:0;width:4rem;height:1px;background:var(--sage);margin:5rem auto}
@media (max-width:700px){.sep{margin:3.5rem auto}}
.small{font-size:.85rem;color:var(--soft)}
.lede{margin:.6rem 0}
.pull{position:relative;font-style:italic;color:var(--ink);margin:1.5rem 0;padding-left:1rem;border-left:2px solid var(--clay)}
@media (min-width:1200px){.pull{float:left;width:14rem;margin:0 0 1rem -17rem;border-left:0;border-top:2px solid var(--clay);padding:.5rem 0 0;font-size:1rem;line-height:1.5}}
.loop svg{width:100%;max-width:30rem;display:block;margin:0 auto}.lp{fill:none;stroke:var(--sage);stroke-width:1.5}.lc{fill:var(--bg);stroke:var(--sage);stroke-width:1.5}.ln{font:24px "Iowan Old Style",Palatino,Georgia,serif;fill:var(--sage)}.lt{font:18px "Iowan Old Style",Palatino,Georgia,serif;fill:var(--ink)}.lr{font:italic 23px "Iowan Old Style",Palatino,Georgia,serif;fill:var(--soft)}
@media (prefers-reduced-motion:no-preference){.lp{stroke-dasharray:1;stroke-dashoffset:0;animation:draw 2.4s ease-out 1}@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}}
figcaption{font-size:.85rem;color:var(--soft);text-align:center}
.steps{padding-left:1.4rem}.steps li{margin:.5rem 0}
.hex svg{width:100%;max-width:22rem;display:block;margin:0 auto 1.5rem}.hx{fill:none;stroke:var(--sage);stroke-width:1.5}.hv{fill:var(--sage)}.ht{font:18px "Iowan Old Style",Palatino,Georgia,serif;fill:var(--ink)}
.two{columns:1}@media (min-width:900px){.two{columns:2;column-gap:3rem}}
.two p{break-inside:avoid;margin:0 0 1.2rem}
.letters article{border-top:1px solid var(--ink);padding:1rem 0 1.5rem}
.letters h3{font-size:1.3rem}.plabel{color:var(--clay);margin:0}.phead{font-variant:small-caps;letter-spacing:.06em;margin:.5rem 0 0}.pinc{padding-left:1.2rem;margin:.2rem 0}.pfor,.pprice{margin:.3rem 0}
.btn{color:var(--sage);text-decoration:underline;padding-left:0;font-weight:400}
.pfig svg{max-width:26rem;display:block;margin:0 auto}.f-line{stroke:var(--sage);stroke-width:1.5}.f-node{fill:var(--bg);stroke:var(--sage);stroke-width:1.5}.f-txt{font:18px "Iowan Old Style",Georgia,serif;fill:var(--ink)}.f-hub{fill:var(--bg);stroke:var(--clay);stroke-width:1.5}.f-hubtxt{font:20px "Iowan Old Style",Georgia,serif;fill:var(--ink)}.f-small{font-size:17px}
.dates{list-style:none;padding:0}.dates li{padding:.6rem 0;border-bottom:1px solid var(--rule)}.dates time{font-variant:small-caps;letter-spacing:.04em;color:var(--clay);display:block;font-variant-numeric:oldstyle-nums}.dates .src{display:block;font-size:.85rem;color:var(--soft)}.dates .src a{color:var(--link)}
.close{text-align:center}.close a{font-size:1.25rem;display:inline-flex;align-items:center;min-height:44px}
.show{margin:0 0 1.2rem}.stag{margin:0}
.ptypes{padding-left:1.2rem}
.sources{font-size:.85rem;padding-left:1.3rem}
.foot{max-width:36rem;margin:4rem auto 2rem;padding:1rem 16px 0;border-top:1px solid var(--rule);font-size:.9rem}.foot .small{font-size:.82rem}`;
  // loop through five circles on a closed curve
  const pts = [[300, 50], [520, 170], [450, 380], [150, 380], [80, 170]];
  const loopPath = 'M300 50 C 420 50, 520 90, 520 170 C 520 260, 500 330, 450 380 C 380 440, 220 440, 150 380 C 100 330, 80 260, 80 170 C 80 90, 180 50, 300 50 Z';
  const loopSvg = `<figure class="loop"><svg viewBox="40 14 520 440" role="img" aria-labelledby="lo-t lo-d"><title id="lo-t">${esc(C.flow.svg_title)}</title><desc id="lo-d">${esc(C.flow.svg_desc)}</desc>
<path class="lp" pathLength="1" d="${loopPath}"/>
${pts.map(([x, y], i) => `<circle class="lc" cx="${x}" cy="${y}" r="26"/><text class="ln" x="${x}" y="${y + 8}" text-anchor="middle">${steps[i].n}</text>`).join('')}
<text class="lr" y="236" text-anchor="middle">${tspans(wrap(C.flow.return_label, 18), 300, 30)}</text>
</svg><figcaption>${flowCaption()}</figcaption></figure>`;
  const hexR = 120, hc = [200, 170];
  const hv = [0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 - 90) * Math.PI / 180; return [hc[0] + hexR * Math.cos(a), hc[1] + hexR * Math.sin(a)]; });
  const hexSvg = `<figure class="hex"><svg viewBox="0 0 400 340" role="img" aria-labelledby="hx-t hx-d"><title id="hx-t">${esc(C.areas_page.svg_title)}</title><desc id="hx-d">A hexagon outline; each of its six corners stands for one area: ${esc(areas.map(a => a.name).join('; '))}.</desc>
<polygon class="hx" points="${hv.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}"/>${hv.map(([x, y], i) => `<circle class="hv" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/><text class="ht" x="${(hc[0] + (hexR + 22) * Math.cos((i * 60 - 90) * Math.PI / 180)).toFixed(1)}" y="${(hc[1] + (hexR + 22) * Math.sin((i * 60 - 90) * Math.PI / 180) + 5).toFixed(1)}" text-anchor="${i === 0 || i === 3 ? 'middle' : i < 3 ? 'start' : 'end'}">${i + 1}</text>`).join('')}
<text class="ht" x="200" y="176" text-anchor="middle">${esc(C.areas_page.centre)}</text></svg><figcaption>${esc(C.areas_page.caption)}</figcaption></figure>`;
  const pull = item => `<blockquote class="pull"><p><q>${esc(inner(item.text))}</q></p><footer class="small">${cite(item.fact_id)}</footer></blockquote>`;
  const body = `<header>${noticeBar()}<div class="top">${brand()}${theirBtn()}</div></header>
<main id="main">
<div class="col">
<p class="sc">${eyebrow()}</p>
<h1><q>${esc(headline.text)}</q></h1>
<p class="small">${cite(hFact)}</p>
${ledeParas()}
<hr class="sep">
<section aria-labelledby="fl"><h2 id="fl">${esc(C.flow.title)}</h2>
${pull(C.home.question)}
<p>${ours(C.flow.intro)}</p>
${loopSvg}
${stepsList()}
<p class="small">${esc(C.flow.footnote)}</p></section>
<hr class="sep">
<section aria-labelledby="sh"><h2 id="sh">${esc(C.home.show_title)}</h2><p class="small">${ours(C.home.show_intro)}</p>${C.home.show.map(s => { s.fact_ids.forEach(id => used.add(id)); return `<p class="show"><span class="sc">${esc(s.tag)}: ${esc(s.title)}.</span> <span class="lbl">${esc(s.label)}:</span> ${esc(s.text)}</p>`; }).join('')}</section>
<hr class="sep">
</div>
<section class="col wide" aria-labelledby="ar"><h2 id="ar">${esc(C.areas_page.h1)}</h2>
${pull(C.home.areas_intro)}
${hexSvg}
<p class="small">${esc(C.areas_page.summary_label)} after each name.</p>
<div class="two">${areas.map((a, i) => { used.add(a.fact_id); return `<p><span class="sc">${i + 1}. ${esc(a.name)}.</span> ${esc(a.text)}</p>`; }).join('')}</div>
<p class="small">${cite('c6')}</p></section>
<div class="col">
<hr class="sep">
<section aria-labelledby="pl"><h2 id="pl">${esc(C.plans_page.h1)}</h2><p class="small">${ours(C.plans_page.intro)}</p>
<div class="letters">${plans.map(p => `<article><h3>${esc(p.name)}</h3>${planBody(p)}</article>`).join('')}</div>${plansNote()}</section>
<hr class="sep">
<section aria-labelledby="pa"><h2 id="pa">${esc(P.h1)}</h2>${partnerText()}${partnerFigure('pf')}</section>
<hr class="sep">
<section aria-labelledby="fo">${founderBlock('h2').replace('<h2>', '<h2 id="fo">')}</section>
${rows.length ? `<hr class="sep"><section aria-labelledby="dt"><h2 id="dt">${esc(C.context.timeline_title)}</h2><p class="small">${esc(C.context.timeline_note)}</p>
<ol class="dates">${rows.map(r => `<li>${time(r.date)}${rowWhat(r)}<span class="src">${rowSource(r)}</span></li>`).join('')}</ol><p><strong>${esc(NLA)}</strong></p></section>` : ''}
<hr class="sep">
<section class="close" aria-labelledby="cl"><h2 id="cl" class="vh">${esc(C.home.cta.title.text)}</h2><p>${esc(T.cta_line)}</p><p><a href="${THEIRS}">${esc(T.cta_link)}${sr(C.actions.start.sr)}</a></p><p class="small">${esc(C.actions.note)}</p></section>
<hr class="sep">
<section aria-labelledby="sr"><h2 id="sr">Sources</h2>${sourcesList()}</section>
</div>
</main>`;
  writePage(`d/${d.slug}`, head({ ...pageMeta(d), css }) + body + footer(d.slug));
}

// ---------- chooser ----------
const THUMBS = {
  'board-paper': { sw: ['#fbfaf6', '#1b1b1b', '#7a2430'], svg: `<rect width="160" height="100" fill="#ece9e1"/><rect x="34" y="6" width="92" height="94" fill="#fbfaf6" stroke="#c9c3b6"/><path d="M114 6h12v12z" fill="#ece9e1" stroke="#c9c3b6"/><rect x="42" y="16" width="56" height="5" fill="#1b1b1b"/><rect x="42" y="28" width="76" height="26" fill="none" stroke="#1b1b1b"/><path d="M42 35h76M42 41h76M42 48h76M58 28v26" stroke="#c9c3b6"/><rect x="42" y="60" width="4" height="3" fill="#7a2430"/><path d="M50 61h48M50 67h52M50 73h44M50 79h50" stroke="#55504a"/><rect x="42" y="86" width="4" height="3" fill="#7a2430"/><path d="M50 87h40" stroke="#55504a"/>` },
  dial: { sw: ['#f3f5f7', '#0b6e69', '#8a5200'], svg: `<rect width="160" height="100" fill="#f3f5f7"/><rect x="6" y="6" width="96" height="26" rx="3" fill="#fff" stroke="#c9d2da"/><rect x="106" y="6" width="48" height="26" rx="3" fill="#fff" stroke="#c9d2da"/><rect x="106" y="6" width="3" height="26" fill="#8a5200"/><rect x="12" y="14" width="70" height="5" fill="#0f1b24"/><rect x="6" y="36" width="88" height="58" rx="3" fill="#fff" stroke="#c9d2da"/><g fill="none" stroke="#5f6f7c" stroke-width="1.5"><path d="M50 42a23 23 0 0 1 19.9 11.5"/><path d="M71.5 56.5a23 23 0 0 1 0 23"/><path d="M69.9 82.5A23 23 0 0 1 50 88"/><path d="M30.1 82.5A23 23 0 0 1 28.5 56.5"/><path d="M47 88a23 23 0 0 1-17-6"/><path d="M30.1 53.5A23 23 0 0 1 47 42"/></g><rect x="98" y="36" width="56" height="58" rx="3" fill="#fff" stroke="#c9d2da"/><path d="M104 46h42M104 54h36M104 62h40M104 70h30" stroke="#4a5966"/>` },
  calendar: { sw: ['#f6f3ec', '#1d3f73', '#2f6b3a'], svg: `<rect width="160" height="100" fill="#f6f3ec"/><rect x="8" y="8" width="110" height="9" fill="#1d1d1f"/><path d="M8 24h144" stroke="#1d1d1f"/><path d="M22 32v62" stroke="#1d1d1f" stroke-width="1.5"/><g fill="#f6f3ec" stroke="#1d3f73" stroke-width="2"><circle cx="22" cy="40" r="3"/><circle cx="22" cy="54" r="3"/><circle cx="22" cy="68" r="3"/><circle cx="22" cy="82" r="3"/></g><g stroke="#55524b"><path d="M30 40h18M30 54h18M30 68h18M30 82h18"/></g><path d="M60 32v62" stroke="#cfc8b8"/><rect x="68" y="32" width="70" height="7" fill="#1d1d1f"/><g stroke="#55524b"><path d="M68 46h82M68 52h78M68 58h82M68 64h60"/></g><rect x="68" y="72" width="84" height="20" fill="none" stroke="#1d1d1f" stroke-width="1.5"/><path d="M74 82h50" stroke="#2f6b3a" stroke-width="2"/>` },
  grid: { sw: ['#ffffff', '#111111', '#c42d1a'], svg: `<rect width="160" height="100" fill="#fff"/><g stroke="#ececec"><path d="M13 0v100M26 0v100M40 0v100M53 0v100M66 0v100M80 0v100M93 0v100M106 0v100M120 0v100M133 0v100M146 0v100"/></g><rect x="8" y="10" width="86" height="12" fill="#111"/><rect x="8" y="26" width="70" height="12" fill="#111"/><rect x="8" y="42" width="50" height="12" fill="#111"/><g fill="#111"><rect x="112" y="10" width="10" height="10"/><rect x="124" y="10" width="10" height="10"/><rect x="136" y="18" width="10" height="10"/><rect x="136" y="30" width="10" height="10"/><rect x="124" y="38" width="10" height="10"/><rect x="124" y="50" width="10" height="10"/></g><circle cx="129" cy="70" r="5" fill="#c42d1a"/><rect x="0" y="82" width="160" height="18" fill="#c42d1a"/><rect x="8" y="88" width="60" height="6" fill="#fff"/>` },
  counsel: { sw: ['#f4f1ea', '#46634f', '#94532f'], svg: `<rect width="160" height="100" fill="#f4f1ea"/><path d="M50 12h60" stroke="#2a2a26" stroke-width="3"/><path d="M58 20h44" stroke="#5a5850"/><path d="M80 32c18 0 30 8 30 20s-6 20-14 26c-10 7-22 7-32 0-8-6-14-14-14-26s12-20 30-20z" fill="none" stroke="#46634f" stroke-width="1.5"/><g fill="#f4f1ea" stroke="#46634f"><circle cx="80" cy="32" r="3"/><circle cx="110" cy="50" r="3"/><circle cx="98" cy="77" r="3"/><circle cx="62" cy="77" r="3"/><circle cx="50" cy="50" r="3"/></g><path d="M74 92h12" stroke="#46634f"/>` },
};
function chooser() {
  used = new Set();
  const css = `:root{--bg:#f8f6f0;--surface:#ffffff;--ink:#15211c;--soft:#4a5a53;--line:#d8d2c4;--green:#1f5c46;--gold:#85601c;--link:#1f5c46;--focus:#1f5c46;--notice:#fff3d1}
@media (prefers-color-scheme:dark){:root{--bg:#0e1814;--surface:#16231e;--ink:#ece8dd;--soft:#b3aea0;--line:#2c3c35;--green:#74c7a5;--gold:#dcb563;--link:#74c7a5;--focus:#dcb563;--notice:#2a2416}}
body{font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
h1,h2,.brand{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Charter,Georgia,serif}
.notice{background:var(--notice);border-bottom:1px solid var(--line);padding:.6rem 16px}.notice-in{max-width:72rem;margin:0 auto}
.top{background:var(--surface);border-bottom:1px solid var(--line)}.top-in{max-width:72rem;margin:0 auto;padding:.5rem 16px;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between}
.brand{font-weight:700;letter-spacing:.08em;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;min-height:44px}.tag{font:700 .72rem system-ui,sans-serif;color:var(--gold);border:1px solid var(--gold);border-radius:6px;padding:.05rem .4rem;margin-left:.4rem;letter-spacing:.06em;text-transform:uppercase}
.their{display:inline-flex;align-items:center;min-height:44px;padding:0 .9rem;border:1px solid var(--green);border-radius:6px;color:var(--green);text-decoration:none;font-weight:600}
main{max-width:72rem;margin:0 auto;padding:2rem 16px 3rem}
h1{font-size:clamp(2rem,5vw,3rem);line-height:1.15;margin:0 0 .5rem}.lede{font-size:1.15rem;color:var(--soft);margin:0 0 2rem;max-width:38rem}
.cards{list-style:none;margin:0;padding:0;display:grid;gap:16px;grid-template-columns:1fr}
@media (min-width:700px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:1100px){.cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:.5rem}
.card svg{display:block;width:100%;height:auto;border-radius:6px;border:1px solid var(--line)}
.card h2{font-size:1.35rem;margin:.25rem 0 0}.card h2 a{display:inline-flex;align-items:center;min-height:44px;color:var(--link)}
.card p{margin:0}.sig{font-size:.9rem;color:var(--soft)}
.sw{display:flex;gap:6px;margin-top:auto;padding-top:.5rem}.sw span{width:28px;height:14px;border-radius:3px;border:1px solid var(--line)}
.main-card{border-style:dashed}
table{border-collapse:collapse;width:100%;margin-top:2.5rem;font-size:.95rem}caption{text-align:left;font-weight:700;padding-bottom:.5rem;font-size:1.1rem}
th,td{text-align:left;vertical-align:top;border-top:1px solid var(--line);padding:.6rem .75rem .6rem 0}
.tw{overflow-x:auto}
.small{font-size:.85rem;color:var(--soft)}
.foot{background:var(--surface);border-top:1px solid var(--line)}.foot-in{max-width:72rem;margin:0 auto;padding:1.25rem 16px 2rem;font-size:.9rem}.foot .small{font-size:.82rem}`;
  const DP = C.designs_page;
  const card = d => { const t = THUMBS[d.slug]; return `<li class="card"><svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">${t.svg}</svg><h2><a href="/d/${esc(d.slug)}/">${esc(d.name)}</a></h2><p>${esc(d.line)}</p><p class="sig">${esc(d.signature)}</p><div class="sw" aria-hidden="true">${t.sw.map(c => `<span style="background:${c}"></span>`).join('')}</div></li>`; };
  const mainThumb = `<rect width="160" height="100" fill="#f8f6f0"/><rect width="160" height="10" fill="#fff3d1"/><rect y="10" width="160" height="44" fill="#10342a"/><rect x="10" y="20" width="80" height="7" fill="#fff"/><rect x="10" y="31" width="64" height="7" fill="#fff"/><rect x="10" y="43" width="30" height="7" rx="2" fill="#e3bf72"/><g fill="#fff" stroke="#d8d2c4"><rect x="10" y="62" width="44" height="30" rx="3"/><rect x="58" y="62" width="44" height="30" rx="3"/><rect x="106" y="62" width="44" height="30" rx="3"/></g>`;
  const html = head({ title: DP.title, desc: `${DP.lede} ${C.brand.description}`, path: '/d/', css }) + `<header>${noticeBar()}<div class="top"><div class="top-in"><a class="brand" href="/">${esc(C.brand.wordmark)}<span class="vh">, a proposal</span><span class="tag">${esc(C.brand.tag)}</span></a>${theirBtn()}</div></div></header>
<main id="main">
<h1>${esc(DP.h1)}</h1>
<p class="lede">${esc(DP.lede)}</p>
<ul class="cards">
${C.designs.map(card).join('\n')}
<li class="card main-card"><svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">${mainThumb}</svg><h2><a href="${esc(DP.main_card.href)}">${esc(DP.main_card.name)}</a></h2><p>${esc(DP.main_card.line)}</p><div class="sw" aria-hidden="true"><span style="background:#10342a"></span><span style="background:#e3bf72"></span><span style="background:#f8f6f0"></span></div></li>
</ul>
<div class="tw"><table><caption>How the five designs differ</caption><thead><tr>${DP.table_heads.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${C.designs.map(d => `<tr><th scope="row"><a href="/d/${esc(d.slug)}/">${esc(d.name)}</a></th><td>${esc(d.line)}</td><td>${esc(d.signature)}</td></tr>`).join('')}</tbody></table></div>
<p class="small">${esc(C.actions.note)} <a href="${THEIRS}">sustain-nobility.com ↗${sr('(opens their official site)')}</a></p>
</main>`;
  writePage('d', html + footer(null));
}

boardPaper();
dial();
calendar();
grid();
counsel();
chooser();
console.log(`designs: wrote /d/ and ${C.designs.length} designs (${rows.length} timeline rows, ${rows.length - current.length} marked as replaced)`);
