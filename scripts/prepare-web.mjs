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
const html = gunzipSync(Buffer.from(encoded.trim(), 'base64'));
await writeFile(join(www, 'index.html'), html);

await ensureDir(join(www, 'vendor', 'chart'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'css'));
await ensureDir(join(www, 'vendor', 'fontawesome', 'webfonts'));
await ensureDir(join(www, 'vendor', 'xlsx'));

await cp(join(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.js'), join(www, 'vendor', 'chart', 'chart.umd.js'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'), join(www, 'vendor', 'fontawesome', 'css', 'all.min.css'));
await cp(join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'), join(www, 'vendor', 'fontawesome', 'webfonts'), { recursive: true });

const xlsxUrl = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
const xlsxBytes = await fetchTo(xlsxUrl, join(www, 'vendor', 'xlsx', 'xlsx.full.min.js'));

for (const file of [
  join(www, 'index.html'),
  join(www, 'vendor', 'chart', 'chart.umd.js'),
  join(www, 'vendor', 'fontawesome', 'css', 'all.min.css'),
  join(www, 'vendor', 'xlsx', 'xlsx.full.min.js')
]) {
  const info = await stat(file);
  if (!info.size) throw new Error(`Prepared asset is empty: ${file}`);
}

console.log(`Prepared offline web app. HTML bytes: ${html.length}; SheetJS bytes: ${xlsxBytes}`);
