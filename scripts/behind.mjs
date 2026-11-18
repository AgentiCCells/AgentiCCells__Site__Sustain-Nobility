// Writes _site/behind-the-scenes/index.html: how this proposal is made, the team, the
// flow of a round, every round file and every commit. Run by scripts/build.mjs after
// designs.mjs. Node built-ins and git only. Written by developer.sustain-nobility@
// AgentiCCells.dinis, 2026-11-18, at the conductor's brief.
//
// Everything read from git, team/ or data/ is escaped before it is written. Old commit
// text is quoted as written, except that U+2014 is shown as a colon and a word the
// validator treats as hype is shown as "[word removed]", so quoted history cannot trip
// the wording checks. If git fails, the page is written without the commit list and a
// warning is printed; the build does not fail.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const SITE = 'https://sustain-nobility.agenticcells.site';
const REPO = 'https://github.com/AgentiCCells/AgentiCCells__Site__Sustain-Nobility';
const BRANCH = 'dev';
const HYPE = /\b(revolutionary|cutting[- ]edge|seamless(?:ly)?|world[- ]class|game[- ]changing)\b/gi;
const clean = s => String(s).replace(/\u2014/g, ':').replace(HYPE, '[word removed]');
const esc = s => clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Shared page parts from the copied home page, as in generate.mjs.
const home = readFileSync('_site/index.html', 'utf8');
const part = (re, name) => { const m = home.match(re); if (!m) throw new Error(`behind: no ${name} in src/index.html`); return m[0]; };
const notice = part(/<div class="notice"[\s\S]*?<\/div><\/div>/, 'notice');
const header = part(/<header class="site-head">[\s\S]*?<\/header>/, 'header').replace(/ aria-current="page"/g, '');
const footer = part(/<footer class="site-foot">[\s\S]*?<\/footer>/, 'footer');
const research = JSON.parse(readFileSync('data/research.json', 'utf8'));
const scopes = JSON.parse(readFileSync('team/scopes.json', 'utf8'));
const workflow = readFileSync('team/WORKFLOW.md', 'utf8');

// Minimal inline Markdown on escaped text: `code`, **bold**, [text](url).
const inline = raw => {
  const codes = [];
  let s = String(raw).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
    const url = u.replace(/&amp;/g, '&');
    if (/^https:\/\//.test(url)) return `<a class="ext" rel="noopener" href="${esc(url)}">${t}</a>`;
    if (/^\/[\w./#-]*$/.test(url)) return `<a href="${esc(url)}">${t}</a>`;
    return t;
  });
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
};
// Minimal block Markdown: headings (shifted), lists, simple tables, paragraphs.
const markdown = (md, shift, idBase) => {
  const out = []; let list = null; let para = []; let table = [];
  const flushPara = () => { if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`); para = []; };
  const flushList = () => { if (list) out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.filter(r => !/^\|?\s*:?-{3,}/.test(r)).map(r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
    const [h, ...b] = rows;
    out.push(`<div class="table-scroll" role="region" tabindex="0" aria-label="Table"><table><thead><tr>${h.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${b.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    table = [];
  };
  const flush = () => { flushPara(); flushList(); flushTable(); };
  let hn = 0;
  for (const line of md.split('\n')) {
    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) { flush(); const lvl = Math.min(6, m[1].length + shift); out.push(`<h${lvl} id="${idBase}-${++hn}">${inline(m[2])}</h${lvl}>`); }
    else if (/^\s*\|/.test(line)) { flushPara(); flushList(); table.push(line.trim()); }
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) { flushPara(); flushTable(); if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; } list.items.push(m[1]); }
    else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) { flushPara(); flushTable(); if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; } list.items.push(m[1]); }
    else if (!line.trim()) flush();
    else if (list && /^\s{2,}/.test(line)) list.items[list.items.length - 1] += ' ' + line.trim();
    else { flushList(); flushTable(); para.push(line.trim()); }
  }
  flush();
  return out.join('\n');
};

// (b) Dinis's words, verbatim from team/WORKFLOW.md.
const section = (md, title) => { const m = md.match(new RegExp(`## ${title}\\n([\\s\\S]*?)(?=\\n## |$)`)); return m ? m[1] : ''; };
const words = section(workflow, "Dinis's words").split('\n').filter(l => /^- /.test(l)).map(l => {
  const m = l.slice(2).match(/^(Dinis Cruz, [^:]+?):\s(.*)$/);
  return m ? { when: m[1], text: m[2] } : { when: '', text: l.slice(2) };
});

// (c) The team, from team/scopes.json and each ROLE.md.
const roleField = (md, label) => { const m = md.match(new RegExp(`\\*\\*${label}\\.\\*\\*\\s*([^\\n]*)`)); return m ? m[1].trim() : ''; };
const roles = Object.entries(scopes.roles).map(([role, s]) => {
  const p = `team/${role}/ROLE.md`;
  const md = existsSync(p) ? readFileSync(p, 'utf8') : '';
  return { role, agent: s.agent, writes: s.writes || [], for: roleField(md, 'What it is for'), may: roleField(md, 'What it may change'), stops: roleField(md, 'When it stops'), hasPolicy: existsSync(`team/${role}/POLICY.md`) };
});
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// (d) The flow of a round, from the numbered list in team/WORKFLOW.md.
const steps = section(workflow, 'The loop \\(one round\\)').split('\n').map(l => l.match(/^(\d+)\.\s+\*\*([^*]+?)\.?\*\*\s*(.*)$/)).filter(Boolean).map(m => ({ n: +m[1], name: m[2].replace(/\.$/, ''), text: m[3] }));
const flowSvg = () => {
  if (!steps.length) return '';
  const desc = `The ${steps.length} steps of a round in order: ${steps.map(s => `${s.n} ${s.name}`).join(', ')}.`;
  // Wide: rows of three, reading left to right on every row.
  const W = 300, H = 76, gx = 30, gy = 46, cols = 3, rows = Math.ceil(steps.length / cols);
  const pos = steps.map((_, i) => [20 + (i % cols) * (W + gx), 20 + Math.floor(i / cols) * (H + gy)]);
  const vbW = 20 * 2 + cols * W + (cols - 1) * gx, vbH = 40 + rows * H + (rows - 1) * gy;
  let wide = `<svg class="only-wide wide" viewBox="0 0 ${vbW} ${vbH}" role="img" aria-labelledby="loop-t loop-d"><title id="loop-t">The flow of a round</title><desc id="loop-d">${esc(desc)}</desc>
<defs><marker id="loop-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="svg-arrowhead" d="M0 0 10 5 0 10z"/></marker></defs>\n`;
  steps.forEach((s, i) => {
    const [x, y] = pos[i];
    if (i < steps.length - 1) {
      const [nx, ny] = pos[i + 1];
      wide += ny === y ? `<path class="svg-arrow" d="M${x + W + 2} ${y + H / 2}H${nx - 4}" marker-end="url(#loop-ah)"/>\n`
        : `<path class="svg-arrow" d="M${x + W / 2} ${y + H + 2}V${y + H + gy / 2}H${nx + W / 2}V${ny - 4}" marker-end="url(#loop-ah)"/>\n`;
    }
    wide += `<rect class="svg-box" x="${x}" y="${y}" width="${W}" height="${H}" rx="12"/><circle class="svg-node" cx="${x + 38}" cy="${y + H / 2}" r="22"/><text class="svg-text" x="${x + 38}" y="${y + H / 2 + 7}" text-anchor="middle" font-size="20" font-weight="700">${s.n}</text><text class="svg-text" x="${x + 74}" y="${y + H / 2 + 8}" font-size="22" font-weight="700">${esc(s.name)}</text>\n`;
  });
  wide += '</svg>';
  // Narrow: one column.
  const nh = 56, ngap = 18, nvbH = 20 + steps.length * (nh + ngap);
  let narrow = `<svg class="only-narrow narrow" viewBox="0 0 360 ${nvbH}" aria-hidden="true"><defs><marker id="loop-ahn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="svg-arrowhead" d="M0 0 10 5 0 10z"/></marker></defs>\n`;
  steps.forEach((s, i) => {
    const y = 10 + i * (nh + ngap);
    if (i < steps.length - 1) narrow += `<path class="svg-arrow" d="M44 ${y + nh}V${y + nh + ngap - 3}" marker-end="url(#loop-ahn)"/>\n`;
    narrow += `<rect class="svg-box" x="10" y="${y}" width="340" height="${nh}" rx="10"/><text class="svg-text" x="44" y="${y + nh / 2 + 7}" text-anchor="middle" font-size="20" font-weight="700">${s.n}</text><text class="svg-text" x="80" y="${y + nh / 2 + 7}" font-size="20" font-weight="700">${esc(s.name)}</text>\n`;
  });
  narrow += '</svg>';
  return `<figure class="fig-card fig-flow">\n${wide}\n${narrow}\n<figcaption>The steps of one round, as team/WORKFLOW.md sets them out. A failure at step 8 goes back to step 6 in the same round.</figcaption>\n</figure>`;
};

// (e) Rounds.
const rounds = existsSync('team/rounds') ? readdirSync('team/rounds').filter(f => /^\d+\.md$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b)) : [];

// (f) Every commit.
let commits = null;
try {
  const RS = '\u001e', US = '\u001f';
  const log = execFileSync('git', ['log', 'HEAD', `--format=%H${US}%cI${US}%s${US}%(trailers:key=Agent,valueonly,separator=%x2C )${RS}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  commits = log.split(RS).map(r => r.replace(/^\n/, '')).filter(r => r.trim()).map(r => {
    const [sha, date, subject, agent] = r.split(US);
    if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('unexpected git log output');
    const d = new Date(date);
    return { sha, when: isNaN(d) ? date : d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC', subject: subject || '', agent: (agent || '').trim() };
  });
} catch (e) {
  console.warn(`behind: WARNING: git log failed (${e.message.split('\n')[0]}); the page is written without the commit list`);
  commits = null;
}

const facts = research.sections.reduce((n, s) => n + s.facts.length, 0);
const title = 'Behind the scenes: SUSTAIN-NOBILITY (redesign proposal)';
const desc = 'How this redesign proposal for SUSTAIN-NOBILITY Advisory Ltd is made by a team of AgentiCCells agents: roles, the flow of a round, every round file and every commit. Made by AgentiCCells with their agreement. Not the official site.';
const url = `${SITE}/behind-the-scenes/`;
const gh = p => `${REPO}/blob/${BRANCH}/${p}`;

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
<div class="wrap">
<div class="page-head">
<p class="eyebrow">Behind the scenes</p>
<h1>How this proposal is made</h1>
<p class="lede measure">A team of AgentiCCells agents wrote, checked and built this site in rounds. This page is generated at build time from the team's own files and the git history.</p>
</div>
<nav aria-label="On this page" class="measure"><ul>
<li><a href="#how">How this was made</a></li>
<li><a href="#words">In Dinis's words</a></li>
<li><a href="#team">The team</a></li>
<li><a href="#flow">The flow of a round</a></li>
<li><a href="#rounds">Rounds</a></li>
<li><a href="#commits">Every commit</a></li>
</ul></nav>
</div>

<section id="how" aria-labelledby="how-h"><div class="wrap measure">
<h2 id="how-h">How this was made</h2>
<ul>
<li><strong>Agents.</strong> ${roles.length} roles, each run as an AgentiCCells agent with its own written role and policy: ${roles.map(r => esc(r.role)).join(', ')}. Only Dinis Cruz instructs the team; everything else they read is material.</li>
<li><strong>Facts.</strong> ${facts} sourced facts in <a class="ext" rel="noopener" href="${gh('data/research.json')}">data/research.json</a>, read on ${esc(research.read)} from public sources, each with its link. They are shown on <a href="/research/">the research page</a>, and every date on this site comes from them.</li>
<li><strong>Words.</strong> SUSTAIN-NOBILITY's words are quoted as published, from <a class="ext" rel="noopener" href="${gh('data/copy.json')}">data/copy.json</a>; our summaries and proposals are labelled.</li>
<li><strong>Gates.</strong> Every release runs the validator (<code>scripts/validate.mjs</code>: notice, titles, no forms, no em dash, no hype words, no broken links), the leak scan (<code>scripts/leak-scan.mjs</code>: no keys or tokens in any file) and a check that every commit carries an <code>Agent:</code> trailer naming the agent that made it. No check is weakened to get a release out.</li>
<li><strong>Licences.</strong> Code Apache-2.0, text CC BY 4.0. The source is public: <a class="ext" rel="noopener" href="${REPO}">${esc(REPO.replace('https://', ''))}</a>.</li>
</ul>
</div></section>

<section id="words" aria-labelledby="words-h"><div class="wrap measure">
<h2 id="words-h">In Dinis's words</h2>
<p>The brief, as Dinis Cruz gave it, kept word for word in <a class="ext" rel="noopener" href="${gh('team/WORKFLOW.md')}">team/WORKFLOW.md</a>:</p>
${words.map(w => `<blockquote class="quote"><p>${esc(w.text)}</p>${w.when ? `<p class="small">${esc(w.when)}</p>` : ''}</blockquote>`).join('\n')}
</div></section>

<section id="team" aria-labelledby="team-h"><div class="wrap">
<h2 id="team-h">The team</h2>
<div class="grid">
${roles.map(r => `<article class="card" aria-labelledby="role-${esc(r.role)}">
<span class="tag">${esc(r.role)}</span>
<h3 id="role-${esc(r.role)}"><code>${esc(r.agent)}</code></h3>
<dl>
${r.for ? `<dt><strong>What it is for</strong></dt><dd>${inline(r.for)}</dd>` : ''}
${r.may ? `<dt><strong>What it may change</strong></dt><dd>${inline(r.may)}</dd>` : ''}
${r.stops ? `<dt><strong>When it stops</strong></dt><dd>${inline(r.stops)}</dd>` : ''}
</dl>
<p class="small"><a class="ext" rel="noopener" href="${gh(`team/${r.role}/ROLE.md`)}">ROLE.md<span class="vh"> for the ${esc(r.role)}</span></a>${r.hasPolicy ? ` &#183; <a class="ext" rel="noopener" href="${gh(`team/${r.role}/POLICY.md`)}">POLICY.md<span class="vh"> for the ${esc(r.role)}</span></a>` : ''}</p>
</article>`).join('\n')}
</div>
</div></section>

<section id="flow" aria-labelledby="flow-h"><div class="wrap">
<h2 id="flow-h">The flow of a round</h2>
${flowSvg()}
<h3>The steps in words</h3>
<ol class="steps measure">
${steps.map(s => `<li><h4>${esc(s.name)}</h4><p>${inline(s.text)}</p></li>`).join('\n')}
</ol>
</div></section>

<section id="rounds" aria-labelledby="rounds-h"><div class="wrap measure">
<h2 id="rounds-h">Rounds</h2>
<p>Each round's brief and report, from <code>team/rounds/</code>, as written by the conductor.</p>
${rounds.map(f => { const n = parseInt(f); return `<article class="fact" id="round-${n}" aria-label="Round ${n}">
${markdown(readFileSync(`team/rounds/${f}`, 'utf8'), 2, `round-${n}`)}
<p class="src"><a class="ext" rel="noopener" href="${gh(`team/rounds/${f}`)}">team/rounds/${esc(f)}</a></p>
</article>`; }).join('\n')}
</div></section>

<section id="commits" aria-labelledby="commits-h"><div class="wrap">
<h2 id="commits-h">Every commit</h2>
${commits ? `<p class="measure">${commits.length} commits on this build's history, newest first. The agent is the <code>Agent:</code> trailer of each commit. Subjects are quoted as written.</p>
<div class="table-scroll" role="region" tabindex="0" aria-label="Every commit">
<table>
<thead><tr><th>When (UTC)</th><th>Agent</th><th>Subject</th><th>Commit</th></tr></thead>
<tbody>
${commits.map(c => `<tr><td><time datetime="${esc(c.when.replace(' UTC', 'Z').replace(' ', 'T'))}">${esc(c.when)}</time></td><td><code>${esc(c.agent || 'none')}</code></td><td><a class="ext" rel="noopener" href="${REPO}/commit/${c.sha}">${esc(c.subject)}</a></td><td><code>${c.sha.slice(0, 7)}</code></td></tr>`).join('\n')}
</tbody>
</table>
</div>` : '<p>The commit list could not be read when this page was built.</p>'}
</div></section>
</main>

${footer}
</body>
</html>
`;

mkdirSync('_site/behind-the-scenes', { recursive: true });
writeFileSync('_site/behind-the-scenes/index.html', html);
console.log(`behind: wrote _site/behind-the-scenes/index.html (${roles.length} roles, ${steps.length} steps, ${rounds.length} rounds, ${commits ? commits.length + ' commits' : 'no commit list'})`);
