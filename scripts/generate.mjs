// Generate pages from data into _site/ (run by scripts/build.mjs after src/ is copied).
// Node built-ins only. Written by developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18.
//
// Writes _site/research/index.html from data/research.json. Nothing generated here is
// committed under src/. The notice, header and footer are taken from _site/index.html
// (copied from src/index.html) so every page shares one source for them.
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
const TITLES = { person: 'The founder, as published' };
const NOTES = {
  person: 'Named with their agreement (Dinis Cruz, 2026-11-18). Awards and titles are as their own pages publish them; we have not checked them against the awarding bodies.',
};

const publishable = f => {
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
if (!notice.includes(NOTICE_SENTENCE) || !notice.includes('made by AgentiCCells with their agreement')) throw new Error('generate: the notice in src/index.html lacks a required sentence');

const linkText = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + (x.pathname.length > 1 ? x.pathname : ''); } catch { return u; } };
const source = (url, read, kind) => {
  const where = /^https?:\/\//.test(url) ? `<a class="ext" rel="noopener" href="${esc(url)}">${esc(linkText(url))}</a>` : esc(url);
  return `<p class="src">Source: ${where}, read ${esc(read)}${kind ? `, ${esc(kind)}` : ''}.</p>`;
};
const fact = f => `<div class="fact" id="f-${esc(f.id)}">
<p>${esc(f.text)}</p>${f.quote ? `\n<p><q>${esc(f.quote)}</q></p>` : ''}
${source(f.url, f.read || r.read, f.kind)}
</div>`;

// Timeline: only from facts that carry "dates"; each date must be written in its fact's text.
const timeline = facts => {
  const rows = [];
  for (const f of facts) for (const d of f.dates || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) throw new Error(`generate: bad date ${d.date} on ${f.id}`);
    if (!f.text.includes(human(d.date))) throw new Error(`generate: ${human(d.date)} is not in the text of fact ${f.id}`);
    rows.push({ ...d, id: f.id });
  }
  if (!rows.length) return '';
  rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id, 'en', { numeric: true }));
  return `<h3 id="timeline">EU AI Act timeline</h3>
<table>
<caption class="small" style="caption-side:bottom;text-align:left;padding-top:.5rem">Built only from the dated facts in this section; each row links to its fact and source. Later rows can change earlier ones: read the facts before relying on a date. Not legal advice.</caption>
<thead><tr><th>Date</th><th>What</th><th>Fact</th></tr></thead>
<tbody>
${rows.map(x => `<tr><td>${esc(human(x.date))}</td><td>${esc(x.what)}</td><td><a href="#f-${esc(x.id)}">${esc(x.id)}</a></td></tr>`).join('\n')}
</tbody>
</table>`;
};

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
const open = (r.open || []).map(q => `<li>${esc(q)}</li>`).join('\n');

const title = 'Research on SUSTAIN-NOBILITY and its field (redesign proposal)';
const desc = `Sourced facts on SUSTAIN-NOBILITY Advisory Ltd, its founder as published, AI governance rules and similar tools, read on ${r.read} from public sources. Part of a redesign proposal made by AgentiCCells with their agreement.`;
const url = `${SITE}/research/`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SUSTAIN-NOBILITY (redesign proposal by AgentiCCells)">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${notice}
${header}

<main id="main">
<div class="wrap narrow">
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
<a class="btn btn-green ext" href="https://www.sustain-nobility.com">Go to sustain-nobility.com</a>
</div>
</div>
</main>

${footer}
</body>
</html>
`;

mkdirSync('_site/research', { recursive: true });
writeFileSync('_site/research/index.html', html);
console.log(`generated _site/research/index.html (${sections.map(s => s.id).join(', ')})`);
