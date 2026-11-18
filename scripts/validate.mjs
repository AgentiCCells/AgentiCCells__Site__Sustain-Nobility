// Gate: fails the build on any problem. Never weaken a check to get a release out.
// From scripts/validate.mjs in the site repositories made by sites@AgentiCCells.dinis
// (2026-11-16); factory@ added the hub.json fields, the description check and the
// placeholder check (a seeded site must hold no __SITE_*__ placeholder).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const problems = [];
const fail = m => problems.push(m);
const hype = /\b(revolutionary|cutting[- ]edge|seamless(?:ly)?|world[- ]class|game[- ]changing)\b/i;
const isTemplate = existsSync('.factory-template');
if (!existsSync('_site')) { console.error('FAILED: _site/ is not built: run node scripts/build.mjs'); process.exit(1); }
const files = walk('_site');
const researchUrls = new Set();
if (existsSync('data/research.json')) {
  const r = JSON.parse(readFileSync('data/research.json', 'utf8'));
  for (const sec of r.sections || []) for (const x of sec.facts || []) if (x.url) researchUrls.add(x.url);
  for (const x of r.failed || []) if (x.url) researchUrls.add(x.url);
}
for (const f of [...files, 'hub.json', 'README.md']) {
  if (!existsSync(f) || !/\.(html|js|css|json|md)$/.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (line.includes('—')) fail(`${f}:${i + 1}: em dash`);
    const m = line.match(hype); if (m) fail(`${f}:${i + 1}: hype word "${m[0]}"`);
    if (!isTemplate && /__SITE_[A-Z]+__/.test(line)) fail(`${f}:${i + 1}: template placeholder left in a seeded site`);
  });
  if (f.endsWith('.html')) {
    if (!/<title>[^<]+<\/title>/.test(s)) fail(`${f}: no <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(s)) fail(`${f}: no description`);
    if (!/<html lang="/.test(s)) fail(`${f}: no lang on <html>`);
    // conductor.sustain-nobility@ (2026-11-18): the proposal takes no input and says what it is on every page.
    if (/<form[\s>]/i.test(s)) fail(`${f}: has a <form> (this proposal takes no sign-ups, assessments or personal data)`);
    // The notice must carry the agreed sentence (design review G1) and link their site. Replaced the earlier phrase
    // check on 2026-11-18 (live review F2): the sentence is stricter and the two together read twice.
    if (!isTemplate) {
      const at = s.search(/class="notice"/);
      const region = at < 0 ? '' : s.slice(at, at + 3000);
      const text = region.replace(/<span class="vh">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&#39;|&rsquo;|\u2019/g, "'").replace(/\s+/g, ' ');
      if (at < 0 || !text.includes("A proposal by AgentiCCells, made with SUSTAIN-NOBILITY's agreement; their official site is sustain-nobility.com.") || !/href="https:\/\/www\.sustain-nobility\.com/.test(region)) fail(`${f}: no proposal notice with the agreed sentence and a link to sustain-nobility.com`);
    }
    // conductor.sustain-nobility@ (2026-11-18, live review F4): an external link goes only to their site,
    // a source recorded in data/research.json, this site, or this team's own GitHub repositories.
    if (!isTemplate) for (const m of s.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"/g)) {
      const u = m[1].replace(/&amp;/g, '&');
      if (/^https:\/\/(www\.)?sustain-nobility\.com(\/|$)/.test(u)) continue;
      if (/^https:\/\/sustain-nobility\.agenticcells\.site(\/|$)/.test(u)) continue;
      if (/^https:\/\/github\.com\/AgentiCCells\//.test(u)) continue;
      if (researchUrls.has(u)) continue;
      fail(`${f}: external link to ${u} is not their site, a research source or this team's repository`);
    }
    for (const m of s.matchAll(/<script[^>]+src="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party script ${m[1]}`);
    for (const m of s.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party stylesheet ${m[1]}`);
    for (const m of s.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      const u = m[1]; if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
      const target = u.startsWith('/') ? join('_site', u) : join(dirname(f), u);
      if (!existsSync(target) && !existsSync(join(target, 'index.html'))) fail(`${f}: broken link ${u}`);
    }
  }
}
if (!existsSync('_site/version.json')) fail('no version.json');
if (!existsSync('_site/index.html')) fail('no index.html');
if (!isTemplate && !existsSync('_site/404.html')) fail('no 404.html (live review F1: the host default has no notice)');
try {
  const h = JSON.parse(readFileSync('hub.json', 'utf8'));
  for (const k of ['name', 'what_it_does', 'owner', 'repository', 'live_address', 'version_from']) if (typeof h[k] !== 'string' || !h[k].trim()) fail(`hub.json: ${k} must be a non-empty string`);
  if (h.version_from !== `${h.live_address}/version.json`) fail(`hub.json: version_from must be ${h.live_address}/version.json (the hub copies it verbatim)`);
  if (h.owner !== 'AgentiCCells') fail('hub.json: owner must be AgentiCCells');
  if (!h.licence || h.licence.code !== 'Apache-2.0' || h.licence.text !== 'CC BY 4.0') fail('hub.json: licence must be code Apache-2.0, text CC BY 4.0');
} catch (e) { fail(`hub.json is missing or not JSON (${e.message})`); }
if (problems.length) { console.error(problems.join('\n')); console.error(`FAILED: ${problems.length} problem(s)`); process.exit(1); }
console.log(`OK${isTemplate ? ' (template)' : ''}`);
