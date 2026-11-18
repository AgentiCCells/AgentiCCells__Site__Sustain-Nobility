// Copy the self-hosted fonts of the main design from node_modules into src/assets/fonts/
// (review C4: files copied unmodified, each package's LICENSE beside them). Run by hand
// after `npm ci`; not run by the build or CI. Written by
// developer.sustain-nobility@AgentiCCells.dinis, 2026-11-18. Code Apache-2.0.
// Layout: src/assets/fonts/<family>/<file>.woff2 and src/assets/fonts/LICENSES/<package>.txt.
// Other designs may add their own families to FILES under the same layout.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
const FILES = {
  fraunces: ['fraunces-latin-600-normal.woff2', 'fraunces-latin-400-italic.woff2'],
  'public-sans': ['public-sans-latin-400-normal.woff2', 'public-sans-latin-600-normal.woff2'],
  'ibm-plex-mono': ['ibm-plex-mono-latin-500-normal.woff2'],
  // The five designs (round 4, scripts/designs.mjs).
  'source-serif-4': ['source-serif-4-latin-400-normal.woff2', 'source-serif-4-latin-400-italic.woff2', 'source-serif-4-latin-700-normal.woff2'],
  'ibm-plex-sans-condensed': ['ibm-plex-sans-condensed-latin-500-normal.woff2', 'ibm-plex-sans-condensed-latin-700-normal.woff2'],
  newsreader: ['newsreader-latin-400-normal.woff2', 'newsreader-latin-400-italic.woff2', 'newsreader-latin-600-normal.woff2'],
  archivo: ['archivo-latin-500-normal.woff2', 'archivo-latin-800-normal.woff2'],
  'eb-garamond': ['eb-garamond-latin-400-normal.woff2', 'eb-garamond-latin-400-italic.woff2', 'eb-garamond-latin-600-normal.woff2'],
};
mkdirSync('src/assets/fonts/LICENSES', { recursive: true });
for (const [pkg, files] of Object.entries(FILES)) {
  const base = `node_modules/@fontsource/${pkg}`;
  const { version } = JSON.parse(readFileSync(`${base}/package.json`, 'utf8'));
  mkdirSync(`src/assets/fonts/${pkg}`, { recursive: true });
  for (const f of files) copyFileSync(`${base}/files/${f}`, `src/assets/fonts/${pkg}/${f}`);
  copyFileSync(`${base}/LICENSE`, `src/assets/fonts/LICENSES/${pkg}.txt`);
  console.log(`@fontsource/${pkg}@${version}: ${files.join(', ')}`);
}
