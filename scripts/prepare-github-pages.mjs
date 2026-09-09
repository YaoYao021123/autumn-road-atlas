import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const outputDir = process.argv[2] ?? 'dist/client';
const rawBase = process.env.GITHUB_PAGES_BASE ?? '/autumn-road-atlas/';
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
const textExtensions = new Set(['.html', '.rsc', '.js', '.css', '.json']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const topLevel = await readdir(outputDir, { withFileTypes: true });
const publicAssets = topLevel
  .filter(entry => entry.isFile() && !entry.name.startsWith('.'))
  .map(entry => entry.name)
  .filter(name => !textExtensions.has(name.slice(name.lastIndexOf('.'))));
// Self-hosted font subsets are nested public assets too.
publicAssets.push(...(await walk(join(outputDir, 'fonts'))).map(path=>relative(outputDir,path)));
// Rolldown also emits backtick strings; embedded RSC ends paths with an escaped
// quote. Match both without touching already-prefixed paths or remote URLs.
const assetPattern = publicAssets.length ? new RegExp(String.raw`(["'(\x60])\/(${publicAssets.map(escapeRegExp).join('|')})(?=[?"')\\\x60])`, 'g') : null;
const nextPattern = new RegExp(`(?<!${escapeRegExp(base.slice(0,-1))})/_next/`, 'g');

let rewritten = 0;
for (const path of await walk(outputDir)) {
  const extension = path.slice(path.lastIndexOf('.'));
  if (!textExtensions.has(extension)) continue;
  let contents = await readFile(path, 'utf8');
  const original = contents;
  contents = contents.replace(nextPattern, `${base}_next/`);
  // Vite's generated preload helper stores dependency paths without a leading
  // slash, then prefixes them at runtime. Give that helper the project base so
  // lazily loaded CSS and chunks also work from a GitHub Pages project URL.
  contents = contents.replaceAll('return`/`+e}', 'return`' + base + '`+e}');
  contents = contents.replaceAll('href="/"', `href="${base}"`);
  contents = contents.replaceAll('href=\\"/\\"', `href=\\"${base}\\"`);
  if (assetPattern) contents = contents.replace(assetPattern, `$1${base}$2`);
  if (contents !== original) {
    await writeFile(path, contents);
    rewritten += 1;
  }
}

await writeFile(join(outputDir, '.nojekyll'), '');
const output = relative(process.cwd(), outputDir) || outputDir;
console.log(`Prepared ${output} for GitHub Pages at ${base} (${rewritten} text assets rewritten).`);
