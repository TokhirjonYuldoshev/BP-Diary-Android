import { cp, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const root = process.cwd();
const www = join(root, 'www');

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function fetchTo(url, destination) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(destination, bytes);
  return bytes.length;
}

function injectBeforeRealHeadClose(html, snippet) {
  const lower = html.toLowerCase();
  const bodyOpen = lower.search(/<body\b/);
  if (bodyOpen < 0) throw new Error('Missing <body>');
  const headClose = lower.lastIndexOf('</head>', bodyOpen);
  if (headClose < 0) throw new Error('Missing real </head>');
  return html.slice(0, headClose) + snippet + '\n' + html.slice(headClose);
}

function injectBeforeRealBodyClose(html, snippet) {
  const lower = html.toLowerCase();
  const bodyClose = lower.lastIndexOf('</body>');
  if (bodyClose < 0) throw new Error('Missing real </body>');
  return html.slice(0, bodyClose) + snippet + '\n' + html.slice(bodyClose);
}

await ensureDir(www);

const parts = ['index.part01.b64','index.part02.b64','index.part03.b64','index.part04.b64'];
let encoded = '';
for (const name of parts) encoded += await readFile(join(root, 'source', name), 'utf8');

let html = gunzipSync(Buffer.from(encoded.trim(), 'base64')).toString('utf8');

await ensureDir(join(www, 'vendor', 'chart'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'css'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'webfonts'));
await ensureDir(join(www, 'vendor', 'xlsx'));

await cp(join(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.js'), join(www, 'vendor', 'chart', 'chart.umd.js'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'), join(www, 'vendor', 'fontawesome', 'css', 'all.min.css'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'), join(www, 'vendor', 'fontawesome', 'webfonts'), { recursive: true });

const xlsxUrl = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
const xlsxBytes = await fetchTo(xlsxUrl, join(www, 'vendor', 'xlsx', 'xlsx.full.min.js'));

const replacements = [
  ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', 'vendor/fontawesome/css/all.min.css'],
  ['https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js', 'vendor/chart/chart.umd.js'],
  ['https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js', 'vendor/chart/chart.umd.js'],
  ['https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js', 'vendor/xlsx/xlsx.full.min.js']
];
for (const [from, to] of replacements) html = html.split(from).join(to);

await cp(join(root, 'assets', 'mobile-modern.css'), join(www, 'mobile-modern.css'));
await cp(join(root, 'assets', 'mobile-modern.js'), join(www, 'mobile-modern.js'));

if (!html.includes('mobile-modern.css')) {
  html = injectBeforeRealHeadClose(html, '    <link rel="stylesheet" href="mobile-modern.css">');
}
if (!html.includes('mobile-modern.js')) {
  html = injectBeforeRealBodyClose(html, '    <script src="mobile-modern.js"></script>');
}
html = html.replace(
  'width=device-width, initial-scale=1.0, user-scalable=yes',
  'width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover'
);

await writeFile(join(www, 'index.html'), html, 'utf8');

for (const file of [
  join(www, 'index.html'),
  join(www, 'mobile-modern.css'),
  join(www, 'mobile-modern.js'),
  join(www, 'vendor', 'chart', 'chart.umd.js'),
  join(www, 'vendor', 'fontawesome', 'css', 'all.min.css'),
  join(www, 'vendor', 'xlsx', 'xlsx.full.min.js')
]) {
  const info = await stat(file);
  if (!info.size) throw new Error(`Prepared asset is empty: ${file}`);
}

for (const [from] of replacements) {
  if (html.includes(from)) throw new Error(`External runtime URL still present: ${from}`);
}
if (!html.includes('mobile-modern.css') || !html.includes('mobile-modern.js')) {
  throw new Error('Modern mobile shell was not injected');
}

const lower = html.toLowerCase();
const bodyOpen = lower.search(/<body\b/);
const realHeadClose = lower.lastIndexOf('</head>', bodyOpen);
const realBodyClose = lower.lastIndexOf('</body>');
const mobileCssPos = html.indexOf('mobile-modern.css');
const mobileJsPos = html.indexOf('<script src="mobile-modern.js"></script>');
if (!(mobileCssPos > 0 && mobileCssPos < realHeadClose)) throw new Error('Mobile CSS was injected outside the real <head>');
if (!(mobileJsPos > bodyOpen && mobileJsPos < realBodyClose)) throw new Error('Mobile JS was injected outside the real <body>');

console.log(`Prepared offline web app. HTML bytes: ${Buffer.byteLength(html)}; SheetJS bytes: ${xlsxBytes}`);
