// Generate pages from data into _site/ (run by scripts/build.mjs after src/ is copied).
// Node built-ins only. Written by developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18.
//
// Writes _site/research/index.html from data/research.json, and replaces the
// <!--TIMELINE:home--> and <!--TIMELINE:context--> markers in the copied pages with
// timelines built only from the "dates" arrays in data/research.json (review G6).
// Nothing generated here is committed under src/. The notice, header and footer are
// taken from _site/index.html (copied from src/index.html) so every page shares one
// source for them. Round 2 (developer.sustain-nobility@, 2026-11-18): timelines, the
// superseded-date rule, the director redaction, link-preview tags.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://sustain-nobility.agenticcells.site';
const r = JSON.parse(readFileSync('data/research.json', 'utf8'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const human = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

// Brief from conductor.sustain-nobility@ (2026-11-18): publish no fact about a person's
// significant control, shares or voting rights. A fact that mentions them is omitted,
// unless a redacted text is given below; the redacted text is checked against the rule too.
const PRIVATE = /significant control|\bshares?\b|voting rights|\bvot(?:es|ing)\b/i;
const REDACTED = {
  p1: 'Companies House records one officer, the director, appointed 25 July 2025.',
};
// Conductor's brief (2026-11-18): the founder's full legal name, as Companies House
// prints it, is not published; the record says "the director" (consistent with p1).
const LEGAL_NAME = /EGHRARI|GHAEM/i;
const RENAMED = {
  c33: 'Companies House officers: 1 officer, 0 resignations: the director, active, appointed on 25 July 2025. No occupation is shown.',
};
const OPEN_REPLACE = [[/Companies House shows the role Director under the name EGHRARI GHAEM-MAGHAMI, Monica;/, 'Companies House lists the director under a longer legal name;']];
const TITLES = { person: 'The founder, as published' };
const NOTES = {
  person: 'Named with their agreement (Dinis Cruz, 2026-11-18). Awards and titles are as their own pages publish them; we have not checked them against the awarding bodies.',
};

const publishable = f0 => {
  const f = RENAMED[f0.id] ? { ...f0, text: RENAMED[f0.id] } : f0;
  if (LEGAL_NAME.test(f.text) || LEGAL_NAME.test(f.quote || '')) {
    if (f.id === 'p1' || PRIVATE.test(f.text)) { /* handled by the redaction below */ } else throw new Error(`generate: fact ${f.id} carries the director's legal name; add it to RENAMED`);
  }
  if (!PRIVATE.test(f.text)) return f;
  const t = REDACTED[f.id];
  if (!t) return null;
  if (PRIVATE.test(t)) throw new Error(`generate: redacted text for ${f.id} still breaks the rule`);
  const { quote, ...rest } = f;
  return { ...rest, text: t, quote: quote && !PRIVATE.test(quote) ? quote : undefined };
};

// Shared page parts from the copied home page.
const home = readFileSync('_site/index.html', 'utf8');
const part = (re, name) => { const m = home.match(re); if (!m) throw new Error(`generate: no ${name} in src/index.html`); return m[0]; };
const notice = part(/<div class="notice"[\s\S]*?<\/div><\/div>/, 'notice');
let header = part(/<header class="site-head">[\s\S]*?<\/header>/, 'header');
const footer = part(/<footer class="site-foot">[\s\S]*?<\/footer>/, 'footer');
header = header.replace(/ aria-current="page"/g, '');
if (!header.includes('<a href="/research/">Research</a>')) throw new Error('generate: no Research item in the src/index.html nav');
header = header.replace('<a href="/research/">Research</a>', '<a href="/research/" aria-current="page">Research</a>');
const NOTICE_SENTENCE = "A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com.";
const noticeText = notice.replace(/<span class="vh">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '');
if (!noticeText.includes(NOTICE_SENTENCE)) throw new Error('generate: the notice in src/index.html lacks a required sentence');

const linkText = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + (x.pathname.length > 1 ? x.pathname : ''); } catch { return u; } };
const source = (url, read, kind) => {
  const where = /^https?:\/\//.test(url) ? `<a class="ext" rel="noopener" href="${esc(url)}">${esc(linkText(url))}</a>` : esc(url);
  return `<p class="src">Source: ${where}, read ${esc(read)}${kind ? `, ${esc(kind)}` : ''}.</p>`;
};
const fact = f => `<div class="fact" id="f-${esc(f.id)}">
<p>${esc(f.text)}</p>${f.quote ? `\n<p><q>${esc(f.quote)}</q></p>` : ''}
${source(f.url, f.read || r.read, f.kind)}
</div>`;

// Timeline rows: only from facts that carry "dates"; each date must be written in its
// fact's text and the fact must carry a source URL, or the build fails (review G6).
// A date that Regulation (EU) 2026/1744 replaced is never shown unlabelled next to the
// current one: SUPERSEDED names it, the fact that replaced it, and the label.
const SUPERSEDED = {
  'f2 2027-08-02': { by: 'f6', note: 'replaced by Regulation (EU) 2026/1744' },
};
const allFacts = r.sections.flatMap(s => s.facts);
const factById = Object.fromEntries(allFacts.map(f => [f.id, f]));
const copy = JSON.parse(readFileSync('data/copy.json', 'utf8'));
const publisherOf = url => Object.values(copy.sources || {}).find(s => s.url === url)?.publisher || linkText(url).split('/')[0];
const timelineRows = facts => {
  const rows = [];
  for (const f of facts) for (const d of f.dates || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) throw new Error(`generate: bad date ${d.date} on ${f.id}`);
    if (!f.text.includes(human(d.date))) throw new Error(`generate: ${human(d.date)} is not in the text of fact ${f.id}`);
    if (!/^https:\/\//.test(f.url || '')) throw new Error(`generate: dated fact ${f.id} has no source URL`);
    if (!d.what) throw new Error(`generate: a date on ${f.id} has no "what"`);
    const sup = SUPERSEDED[`${f.id} ${d.date}`];
    if (sup && !factById[sup.by]) throw new Error(`generate: ${f.id} ${d.date} is marked replaced by a missing fact ${sup.by}`);
    rows.push({ ...d, id: f.id, url: f.url, read: f.read || r.read, superseded: sup });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id, 'en', { numeric: true }));
  return rows;
};
for (const k of Object.keys(SUPERSEDED)) {
  const [id, date] = k.split(' ');
  if (!(factById[id]?.dates || []).some(d => d.date === date)) throw new Error(`generate: SUPERSEDED names ${k}, which research.json no longer holds; review the rule`);
}

// Research page: a table, superseded rows labelled.
const timeline = facts => {
  const rows = timelineRows(facts);
  if (!rows.length) return '';
  return `<h3 id="timeline">EU AI Act timeline</h3>
<div class="table-scroll" role="region" aria-label="EU AI Act timeline" tabindex="0">
<table>
<caption class="small" style="caption-side:bottom;text-align:left;padding-top:.5rem">Built only from the dated facts in this section; each row links to its fact and source. A date replaced by Regulation (EU) 2026/1744 is labelled as replaced. This is not legal advice.</caption>
<thead><tr><th>Date</th><th>What</th><th>Fact</th></tr></thead>
<tbody>
${rows.map(x => `<tr><td>${esc(human(x.date))}</td><td>${esc(x.what)}${x.superseded ? ` <strong>(${esc(x.superseded.note)}; see <a href="#f-${esc(x.superseded.by)}">${esc(x.superseded.by)}</a>)</strong>` : ''}</td><td><a href="#f-${esc(x.id)}">${esc(x.id)}</a></td></tr>`).join('\n')}
</tbody>
</table>
</div>`;
};

// Main-site timelines for <!--TIMELINE:home--> and <!--TIMELINE:context-->.
// The fact ids come from data/copy.json; the dates only from data/research.json.
// Home shows a short selection (HOME_ROWS) and drops replaced dates; context shows
// every row of its facts, with replaced dates labelled.
const HOME_ROWS = ['f1 2024-08-01', 'f4 2026-07-27', 'f1 2026-08-02', 'f6 2027-12-02', 'f6 2028-08-02'];
const NOT_ADVICE = copy.not_legal_advice || 'This is not legal advice.';
const tlList = rows => `<ol class="timeline">
${rows.map(x => `<li${x.superseded ? ' class="replaced"' : ''}><time datetime="${esc(x.date)}">${esc(human(x.date))}</time>${x.superseded ? `<span class="replaced-note">${esc(x.superseded.note.charAt(0).toUpperCase() + x.superseded.note.slice(1))}: see <a href="/research/#f-${esc(x.superseded.by)}">fact ${esc(x.superseded.by)}</a></span>` : ''}<span class="what">${esc(x.what)}</span><span class="tl-src"><a href="/research/#f-${esc(x.id)}">Fact ${esc(x.id)}</a> &#183; source: <a class="ext" rel="noopener" href="${esc(x.url)}">${esc(publisherOf(x.url))}</a>, read ${esc(x.read)}</span></li>`).join('\n')}
</ol>
<p class="nla">${esc(NOT_ADVICE)}</p>`;
const pickFacts = ids => (ids || []).map(id => factById[id]).filter(Boolean);
// Round 4 (proposal 2.4.8, review item 13): on wide screens the home rows also sit on a
// horizontal ruler of years. The range runs from 1 January of the earliest year to
// 1 January after the latest; every position is computed from the ISO dates, and the
// read date comes from research.json. Nothing is hard-coded. CSS shows the ruler from
// 1000 px and the list below that, so one of the two is read, never both.
const ruler = rows => {
  const t = iso => Date.UTC(...iso.split('-').map((n, i) => i === 1 ? n - 1 : +n));
  const y0 = +rows[0].date.slice(0, 4), y1 = +rows[rows.length - 1].date.slice(0, 4) + 1;
  const a = Date.UTC(y0, 0, 1), b = Date.UTC(y1, 0, 1);
  const x = iso => +((t(iso) - a) / (b - a) * 100).toFixed(2);
  // Each label is W percent wide, anchored left or right of its date. A search picks the
  // fewest levels such that labels on one level do not overlap and no label covers the
  // leader line of a label above it (at most 3^n * 2^n tries; n is small).
  const W = 18; // label width in percent (matches .ruler-item in style.css)
  const xs = rows.map(r => x(r.date));
  const span = (i, right) => right ? [xs[i] - W, xs[i]] : [xs[i], xs[i] + W];
  let best = null;
  for (let L = 1; L <= rows.length && !best; L++) {
    const lv = new Array(rows.length).fill(0), rt = new Array(rows.length).fill(false);
    const ok = () => {
      for (let i = 0; i < rows.length; i++) {
        const [a1, b1] = span(i, rt[i]);
        if (a1 < 0 || b1 > 100) return false;
        for (let j = 0; j < rows.length; j++) {
          if (i === j) continue;
          const [a2, b2] = span(j, rt[j]);
          if (lv[i] === lv[j] && a1 < b2 + 1 && a2 < b1 + 1) return false;
          if (lv[j] > lv[i] && xs[j] > a1 && xs[j] < b1) return false;
        }
      }
      return true;
    };
    const rec = i => {
      if (i === rows.length) return ok();
      for (let l = 0; l < L; l++) for (const r of [false, true]) { lv[i] = l; rt[i] = r; if (rec(i + 1)) return true; }
      return false;
    };
    if (rec(0)) best = { lv: [...lv], rt: [...rt], L };
  }
  if (!best) throw new Error('generate: the why-now ruler cannot place its labels');
  const ends = { length: best.L };
  const items = rows.map((r, i) => {
    const px = xs[i], right = best.rt[i], lv = best.lv[i];
    return `<li class="ruler-item ${right ? 'r' : 'l'}" style="${right ? `right:${(100 - px).toFixed(2)}%` : `left:${px}%`};--lv:${lv}"><time datetime="${esc(r.date)}">${esc(human(r.date))}</time><span class="what">${esc(r.what)}</span><span class="tl-src"><a href="/research/#f-${esc(r.id)}">Fact ${esc(r.id)}</a> &#183; source: <a class="ext" rel="noopener" href="${esc(r.url)}">${esc(publisherOf(r.url))}</a>, read ${esc(r.read)}</span></li>`;
  });
  // Round 5 (review item 5): year labels end at the last dated year; the axis still runs
  // to 1 January after it, so the last dates keep their true place, but no orphan label.
  const years = [];
  for (let y = y0; y < y1; y++) years.push(`<span class="ruler-year" style="left:${x(`${y}-01-01`)}%">${y}</span>`);
  const readAt = /^\d{4}-\d{2}-\d{2}$/.test(r.read) && r.read >= rows[0].date ? x(r.read) : null;
  const label = copy.home?.why_now_ruler || {};
  return `<div class="ruler" role="group" aria-label="${esc(label.title || 'Sourced dates on a line of years')}" style="--levels:${ends.length}">
<ol class="ruler-list" style="list-style:none;margin:0;padding:0">
${items.join('\n')}
</ol>
<div class="ruler-axis" aria-hidden="true">${rows.map(r => `<span class="ruler-dot" style="left:${x(r.date)}%"></span>`).join('')}${readAt !== null && readAt <= 100 ? `<span class="ruler-read" style="left:${readAt}%"><span>${esc(label.read_marker_label || 'Read')} ${esc(r.read)}</span></span>` : ''}</div>
<div class="ruler-years" aria-hidden="true">${years.join('')}</div>
</div>`;
};
const MARKERS = {
  home: () => {
    const rows = timelineRows(pickFacts(copy.home?.why_now_fact_ids)).filter(x => !x.superseded && HOME_ROWS.includes(`${x.id} ${x.date}`));
    return rows.length ? ruler(rows) + '\n' + tlList(rows) : '';
  },
  context: () => {
    const rows = timelineRows(pickFacts(copy.context?.timeline_fact_ids));
    return rows.length ? tlList(rows) : '';
  },
};
for (const [file, key] of [['_site/index.html', 'home'], ['_site/context/index.html', 'context']]) {
  let page;
  try { page = readFileSync(file, 'utf8'); } catch { continue; }
  const marker = `<!--TIMELINE:${key}-->`;
  if (!page.includes(marker)) throw new Error(`generate: ${file} has no ${marker}`);
  writeFileSync(file, page.replace(marker, MARKERS[key]()));
}

const sections = r.sections.map(s => {
  const facts = s.facts.map(publishable).filter(Boolean);
  const note = NOTES[s.id] ? `\n<p class="small">${esc(NOTES[s.id])}</p>` : '';
  const tl = s.id === 'field' ? '\n' + timeline(facts) + '\n<h3>The facts</h3>' : '';
  return { id: s.id, title: TITLES[s.id] || s.title, html: `<section id="${esc(s.id)}">
<h2>${esc(TITLES[s.id] || s.title)}</h2>${note}${tl}
${facts.map(fact).join('\n')}
</section>` };
});

const failed = (r.failed || []).map(f => `<li>${/^https?:\/\//.test(f.url) ? `<a class="ext" rel="noopener" href="${esc(f.url)}">${esc(linkText(f.url))}</a>` : esc(f.url)}: ${esc(f.why)}</li>`).join('\n');
const open = (r.open || []).map(q => OPEN_REPLACE.reduce((t, [re, to]) => t.replace(re, to), q)).map(q => {
  if (LEGAL_NAME.test(q)) throw new Error('generate: an open question carries the director\'s legal name; add it to OPEN_REPLACE');
  return `<li>${esc(q)}</li>`;
}).join('\n');

const title = 'Research on SUSTAIN-NOBILITY and its field (redesign proposal)';
const desc = `Sourced facts on SUSTAIN-NOBILITY Advisory Ltd, its founder as published, AI governance rules and similar tools, read on ${r.read} from public sources. Part of a redesign proposal made by AgentiCCells with their agreement.`;
const url = `${SITE}/research/`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SUSTAIN-NOBILITY (redesign proposal by AgentiCCells)">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="SUSTAIN-NOBILITY, a proposal: If your client's AI caused harm tomorrow, who would be accountable? A redesign proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${notice}
${header}

<main id="main">
<div class="wrap measure">
<div class="page-head">
<p class="eyebrow">Research, with sources</p>
<h1>What the public record says</h1>
<p class="lede">Facts on SUSTAIN-NOBILITY Advisory Ltd, its founder, the rules and standards in its field, and other readiness tools, each with its source and read date.</p>
</div>

<p>This page is AgentiCCells research for a redesign proposal, not SUSTAIN-NOBILITY's words. Every fact was read on ${esc(r.read)} from public web pages and public records only; no social networks were read. Each fact says whether it is quoted, paraphrased or a public record. It is not legal advice: rules in this area change, so check the source before relying on a date.</p>

<nav aria-label="On this page"><ul>
${sections.map(s => `<li><a href="#${esc(s.id)}">${esc(s.title)}</a></li>`).join('\n')}
<li><a href="#failed">Failed reads</a></li>
<li><a href="#open">Open questions</a></li>
</ul></nav>

${sections.map(s => s.html).join('\n\n')}

<section id="failed">
<h2>Failed reads</h2>
<p>Pages we tried to read and could not, and what that means for the facts above.</p>
<ul>
${failed}
</ul>
</section>

<section id="open">
<h2>Open questions</h2>
<p>Questions for SUSTAIN-NOBILITY, asked through Dinis Cruz. Until they answer, the site does not assume an answer.</p>
<ul>
${open}
</ul>
</section>

<div class="actions">
<a class="btn btn-gold ext" href="https://www.sustain-nobility.com">Go to sustain-nobility.com &#8599;<span class="vh"> (opens their site)</span></a>
</div>
</div>
</main>

${footer}
</body>
</html>
`;

if (LEGAL_NAME.test(html)) throw new Error('generate: the research page carries the director\'s legal name');
mkdirSync('_site/research', { recursive: true });
writeFileSync('_site/research/index.html', html);
console.log(`generated _site/research/index.html (${sections.map(s => s.id).join(', ')})`);
