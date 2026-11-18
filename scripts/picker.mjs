// Designs picker on every built page (round 4, proposal 1.1 to 1.3, review C3).
// Run last by scripts/build.mjs, after every page exists in _site/. Node built-ins only.
// Written by developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Code Apache-2.0.
//
// For every _site/**/*.html it:
//  (a) replaces <!--designs-chip--> with the "Designs" chip, a plain link to /d/ that
//      /assets/picker.js turns into the dialog opener. A page without the marker fails
//      the build, unless it carries <!--no-designs-chip-->.
//  (b) inserts the "Same facts, six designs" strip right after the notice element.
//  (c) inserts the dialog and /assets/picker.js before </body>.
//  (d) links /assets/picker.css before </head>.
// Names and ideas come from data/copy.json (picker, designs[]); nothing is hard-coded here.
// Thumbnails are /assets/designs/<slug>.jpg, made by scripts/shots.mjs (run by hand).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const C = JSON.parse(readFileSync('data/copy.json', 'utf8'));
const P = C.picker;
if (!P || !Array.isArray(P.order)) throw new Error('picker: data/copy.json has no picker.order');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const bySlug = Object.fromEntries((C.designs || []).map(d => [d.slug, d]));
const designs = P.order.map(slug => {
  if (slug === P.main.slug) return { slug, name: P.main.name, idea: P.main.idea, href: P.main.href || '/' };
  const d = bySlug[slug];
  if (!d) throw new Error(`picker: picker.order names "${slug}", which is not in copy.json designs[]`);
  if (!d.idea) throw new Error(`picker: design "${slug}" has no idea line in copy.json`);
  return { slug, name: d.name, idea: d.idea, href: `/d/${slug}/` };
});

// Which design a page belongs to: /d/<slug>/... is that design, /d/ itself is none,
// every other page (home, inner pages, research, behind the scenes, 404) is Main.
const currentOf = rel => {
  const parts = rel.split(sep);
  if (parts[0] === 'd') {
    if (parts.length === 2 && parts[1] === 'index.html') return null;
    return designs.some(d => d.slug === parts[1]) ? parts[1] : null;
  }
  return P.main.slug;
};

const chip = `<a class="dz-chip" href="/d/" data-designs>${esc(P.chip)}</a>`;
const strip = cur => `<nav class="dz-strip" aria-label="${esc(P.strip_aria)}"><div class="dz-strip-in"><span class="dz-strip-label">${esc(P.strip_label)}</span>
${designs.map(d => `<a href="${d.href}"${d.slug === cur ? ' aria-current="page"' : ''}>${esc(d.name)}</a>`).join('\n')}
</div></nav>`;
const dialog = cur => `<dialog id="designs" class="dz-picker" aria-labelledby="designs-t"><div class="dz-in">
<div class="dz-head"><h2 id="designs-t">${esc(P.title)}</h2><button type="button" class="dz-close" aria-label="${esc(P.close_aria)}">${esc(P.close)}</button></div>
<ul class="dz-grid">
${designs.map(d => `<li><a href="${d.href}"${d.slug === cur ? ' aria-current="page"' : ''}><img src="/assets/designs/${d.slug}.jpg" width="1280" height="800" alt="" loading="lazy" decoding="async"><b>${esc(d.name)}</b>${d.slug === cur ? ` <span class="dz-now">${esc(P.showing)}</span>` : ''} <span class="dz-idea">${esc(d.idea)}</span></a></li>`).join('\n')}
</ul>
<p class="dz-foot"><a href="${esc(P.foot_link.href)}">${esc(P.foot_link.text)}</a></p>
</div></dialog>
<script src="/assets/picker.js" defer></script>`;

// End index of the element that opens at `start` (tag name `tag`), counting nested
// elements of the same name.
const closeOf = (s, start, tag) => {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(s))) {
    if (m[1]) { depth--; if (depth === 0) return m.index + m[0].length; } else depth++;
  }
  return -1;
};

const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const problems = [];
let n = 0;
for (const f of walk('_site').filter(p => p.endsWith('.html'))) {
  const rel = relative('_site', f);
  let s = readFileSync(f, 'utf8');
  if (s.includes('class="dz-picker"')) throw new Error(`picker: ${rel} already has the picker`);
  const cur = currentOf(rel);
  // (a) chip
  if (s.includes('<!--designs-chip-->')) s = s.replaceAll('<!--designs-chip-->', chip);
  else if (!s.includes('<!--no-designs-chip-->')) { problems.push(`${rel}: no <!--designs-chip--> marker in its header (or <!--no-designs-chip--> to opt out)`); continue; }
  // (b) strip after the notice element
  const open = s.match(/<([a-z][a-z0-9]*)\b[^>]*\bclass="notice"[^>]*>/i);
  if (!open) { problems.push(`${rel}: no element with class="notice" to put the designs strip after`); continue; }
  const end = closeOf(s, open.index, open[1]);
  if (end < 0) { problems.push(`${rel}: the notice element is not closed`); continue; }
  s = s.slice(0, end) + '\n' + strip(cur) + s.slice(end);
  // (c) dialog and script
  if (!s.includes('</body>')) { problems.push(`${rel}: no </body>`); continue; }
  s = s.replace('</body>', `${dialog(cur)}\n</body>`);
  // (d) stylesheet
  if (!s.includes('</head>')) { problems.push(`${rel}: no </head>`); continue; }
  s = s.replace('</head>', '<link rel="stylesheet" href="/assets/picker.css">\n</head>');
  writeFileSync(f, s);
  n++;
}
if (problems.length) { console.error(problems.join('\n')); throw new Error(`picker: ${problems.length} page(s) could not take the designs picker`); }
console.log(`picker: chip, strip and dialog on ${n} page(s)`);
