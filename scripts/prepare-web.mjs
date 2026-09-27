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

await ensureDir(www);

const parts = ['index.part01.b64','index.part02.b64','index.part03.b64','index.part04.b64'];
let encoded = '';
for (const name of parts) encoded += await readFile(join(root, 'source', name), 'utf8');

let html = gunzipSync(Buffer.from(encoded.trim(), 'base64')).toString('utf8');

await ensureDir(join(www, 'vendor', 'chart'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'css'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'webfonts'));
await ensureDir(join(www, 'vendor', 'xlsx'));

await cp(
  join(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.js'),
  join(www, 'vendor', 'chart', 'chart.umd.js')
);
await cp(
  join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'),
  join(www, 'vendor', 'fontawesome', 'css', 'all.min.css')
);
await cp(
  join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
  join(www, 'vendor', 'fontawesome', 'webfonts'),
  { recursive: true }
);

const xlsxUrl = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
const xlsxBytes = await fetchTo(
  xlsxUrl,
  join(www, 'vendor', 'xlsx', 'xlsx.full.min.js')
);

// The installed Android app must not depend on external CDNs at runtime.
const replacements = [
  [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'vendor/fontawesome/css/all.min.css'
  ],
  [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'vendor/chart/chart.umd.js'
  ],
  [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
    'vendor/chart/chart.umd.js'
  ],
  [
    'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js',
    'vendor/xlsx/xlsx.full.min.js'
  ]
];

for (const [from, to] of replacements) {
  html = html.split(from).join(to);
}

await writeFile(join(www, 'index.html'), html, 'utf8');

for (const file of [
  join(www, 'index.html'),
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

console.log(
  `Prepared offline web app. HTML bytes: ${Buffer.byteLength(html)}; SheetJS bytes: ${xlsxBytes}`
);
