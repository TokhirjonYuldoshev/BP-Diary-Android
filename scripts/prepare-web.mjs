import { cp, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

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
  return { bytes, length: bytes.length };
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

const sourceHtml = join(root, 'source', 'index.html');
let html = await readFile(sourceHtml, 'utf8');
if (!html.trim()) throw new Error('source/index.html is empty');

const version = JSON.parse(await readFile(join(root, 'version.json'), 'utf8'));
if (!/^V\d+$/.test(String(version.release||''))) throw new Error('Invalid release label in version.json');
if (!/^\d+\.\d+\.\d+$/.test(String(version.versionName||''))) throw new Error('Invalid versionName in version.json');
if (!Number.isInteger(version.versionCode) || version.versionCode < 1) throw new Error('Invalid versionCode in version.json');

await ensureDir(join(www, 'vendor', 'chart'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'css'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'webfonts'));
await ensureDir(join(www, 'vendor', 'xlsx'));
await ensureDir(join(www, 'vendor', 'pdf'));

await cp(join(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.js'), join(www, 'vendor', 'chart', 'chart.umd.js'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'), join(www, 'vendor', 'fontawesome', 'css', 'all.min.css'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'), join(www, 'vendor', 'fontawesome', 'webfonts'), { recursive: true });

const xlsxUrl = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
const xlsxExpectedSha256 = '0dcbc967984de297bd4233cbb77febad8a396c72d8ac0cfab09094d6d7f6e805';
const xlsxFetch = await fetchTo(xlsxUrl, join(www, 'vendor', 'xlsx', 'xlsx.full.min.js'));
const xlsxSha256 = createHash('sha256').update(xlsxFetch.bytes).digest('hex');
if (xlsxSha256 !== xlsxExpectedSha256) {
  throw new Error(`SheetJS integrity mismatch: expected ${xlsxExpectedSha256}, got ${xlsxSha256}`);
}

const replacements = [
  ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', 'vendor/fontawesome/css/all.min.css'],
  ['https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js', 'vendor/chart/chart.umd.js'],
  ['https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js', 'vendor/chart/chart.umd.js'],
  ['https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js', 'vendor/xlsx/xlsx.full.min.js']
];
for (const [from, to] of replacements) html = html.split(from).join(to);

await cp(join(root, 'assets', 'mobile-modern.css'), join(www, 'mobile-modern.css'));
let mobileJs = await readFile(join(root, 'assets', 'mobile-modern.js'), 'utf8');
mobileJs = mobileJs
  .replaceAll('__BP_RELEASE__', String(version.release))
  .replaceAll('__BP_VERSION_NAME__', String(version.versionName))
  .replaceAll('__BP_VERSION_CODE__', String(version.versionCode));
if (mobileJs.includes('__BP_RELEASE__') || mobileJs.includes('__BP_VERSION_NAME__') || mobileJs.includes('__BP_VERSION_CODE__')) {
  throw new Error('Unresolved version placeholder in mobile-modern.js');
}
await writeFile(join(www, 'mobile-modern.js'), mobileJs, 'utf8');
await cp(join(root, 'node_modules', 'html2canvas', 'dist', 'html2canvas.min.js'), join(www, 'vendor', 'pdf', 'html2canvas.min.js'));
await cp(join(root, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'), join(www, 'vendor', 'pdf', 'jspdf.umd.min.js'));

if (!html.includes('mobile-modern.css')) {
  html = injectBeforeRealHeadClose(html, '    <link rel="stylesheet" href="mobile-modern.css">');
}
if (!html.includes('bp_biometric_lock_v17')) {
  html = injectBeforeRealHeadClose(html, '    <script>try{if(localStorage.getItem("bp_biometric_lock_v17")==="1")document.documentElement.classList.add("bp-prelocked")}catch(_){}</script>');
}
if (!html.includes('vendor/pdf/html2canvas.min.js')) {
  html = injectBeforeRealBodyClose(html, '    <script src="vendor/pdf/html2canvas.min.js"></script>\n    <script src="vendor/pdf/jspdf.umd.min.js"></script>');
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
  join(www, 'vendor', 'xlsx', 'xlsx.full.min.js'),
  join(www, 'vendor', 'pdf', 'html2canvas.min.js'),
  join(www, 'vendor', 'pdf', 'jspdf.umd.min.js')
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
if (!html.includes('vendor/pdf/html2canvas.min.js') || !html.includes('vendor/pdf/jspdf.umd.min.js')) {
  throw new Error('Offline PDF share libraries were not injected');
}

const lower = html.toLowerCase();
const bodyOpen = lower.search(/<body\b/);
const realHeadClose = lower.lastIndexOf('</head>', bodyOpen);
const realBodyClose = lower.lastIndexOf('</body>');
const mobileCssPos = html.indexOf('mobile-modern.css');
const mobileJsPos = html.indexOf('<script src="mobile-modern.js"></script>');
if (!(mobileCssPos > 0 && mobileCssPos < realHeadClose)) throw new Error('Mobile CSS was injected outside the real <head>');
if (!(mobileJsPos > bodyOpen && mobileJsPos < realBodyClose)) throw new Error('Mobile JS was injected outside the real <body>');

console.log(`Prepared offline web app ${version.release} ${version.versionName} (${version.versionCode}). HTML bytes: ${Buffer.byteLength(html)}; SheetJS bytes: ${xlsxFetch.length}; SheetJS SHA-256: ${xlsxSha256}`);
