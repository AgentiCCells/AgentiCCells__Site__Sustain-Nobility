// Thumbnails for the designs picker (round 4, proposal 1.4, review change 5).
// Run by hand after `node scripts/build.mjs`; not run by the build or CI. Then build again
// so _site/ carries the new pictures. Written by developer.sustain-nobility@AgentiCCells.dinis,
// 2026-11-18. Code Apache-2.0.
//
// Serves _site/ on 127.0.0.1 (our own built pages only), opens "/" and each "/d/<slug>/"
// in Chromium at 1280x800, deviceScaleFactor 1, light scheme, reduced motion, top of the
// page (the notice bar is in every shot), and writes src/assets/designs/<slug>.jpg
// ("main.jpg" for "/") at JPEG quality 72. Fails if a file is over 150 KB or a page
// scrolls sideways.
//
// Playwright is a local dev tool, not a dependency of the site. Use `playwright` or
// `playwright-core` if installed here, or point PLAYWRIGHT_MODULE at an install
// (e.g. /path/node_modules/playwright-core/index.mjs). CHROME_PATH picks a browser binary.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX = 150 * 1024;
const C = JSON.parse(readFileSync('data/copy.json', 'utf8'));
const slugs = C.picker.order;
const pathOf = s => s === C.picker.main.slug ? '/' : `/d/${s}/`;
if (!existsSync('_site/index.html')) { console.error('shots: build first (node scripts/build.mjs)'); process.exit(1); }

const load = async () => {
  if (process.env.PLAYWRIGHT_MODULE) return import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
  for (const m of ['playwright', 'playwright-core']) { try { return await import(m); } catch { /* next */ } }
  console.error('shots: Playwright not found; install it locally or set PLAYWRIGHT_MODULE'); process.exit(1);
};
const pw = await load();
const chromium = pw.chromium || pw.default?.chromium;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain', '.md': 'text/markdown' };
const server = createServer((req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let f = join('_site', p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
const problems = [];
mkdirSync('src/assets/designs', { recursive: true });
for (const s of slugs) {
  const page = await ctx.newPage();
  const resp = await page.goto(base + pathOf(s), { waitUntil: 'networkidle' });
  if (!resp || resp.status() !== 200) { problems.push(`${pathOf(s)}: HTTP ${resp && resp.status()} (is the page built?)`); await page.close(); continue; }
  await page.evaluate(() => document.fonts.ready);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (wide) problems.push(`${pathOf(s)}: scrolls sideways at 1280 px`);
  const buf = await page.screenshot({ type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 1280, height: 800 } });
  const out = `src/assets/designs/${s}.jpg`;
  writeFileSync(out, buf);
  console.log(`${out}: ${(buf.length / 1024).toFixed(1)} KB`);
  if (buf.length > MAX) problems.push(`${out} is ${(buf.length / 1024).toFixed(1)} KB, over 150 KB`);
  await page.close();
}
await browser.close();
server.close();
if (problems.length) { console.error(problems.join('\n')); console.error(`shots: FAILED (${problems.length})`); process.exit(1); }
console.log('shots: OK');
