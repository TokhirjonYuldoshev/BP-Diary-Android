import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const www=join(root,'www');
const files={
  html:join(www,'index.html'),
  js:join(www,'mobile-modern.js'),
  css:join(www,'mobile-modern.css'),
  patch:join(root,'scripts','patch-android.mjs')
};

const [html,js,css,patch]=await Promise.all([
  readFile(files.html,'utf8'),
  readFile(files.js,'utf8'),
  readFile(files.css,'utf8'),
  readFile(files.patch,'utf8')
]);

const checks=[
  ['V15 marker',js.includes('Android V15')],
  ['mobile navigation',js.includes('mobileBottomNav')],
  ['Android Back bridge',js.includes('__bpHandleAndroidBack')],
  ['doctor PDF sharing',js.includes('sharePdfBase64')&&js.includes('shareDoctorReportHtml')],
  ['report period selector',js.includes('openReportPeriodSheet')],
  ['automatic backups',js.includes('saveAutoBackup')&&js.includes('listAutoBackups')],
  ['onboarding',js.includes('showOnboarding')],
  ['archive search state',js.includes('bp_archive_search_v15')],
  ['archive search field',js.includes('mobileArchiveSearch')],
  ['archive filter/sort',js.includes('archiveTools')&&js.includes('mobileArchiveSort')],
  ['accessible pages',js.includes('applyAccessibility')],
  ['dialog semantics',js.includes("setAttribute('aria-modal','true')")],
  ['cardio row correction',js.includes('mobile-cardio-row')&&css.includes('.date-time-row.mobile-cardio-row')],
  ['personal target frame',js.includes('mobile-target-shell')&&css.includes('.date-time-row.target-row.mobile-target-shell')],
  ['reminder in header',js.includes('data-top="reminder"')],
  ['unified action buttons',js.includes('mobile-action-blue')],
  ['reduced motion',css.includes('prefers-reduced-motion')],
  ['high contrast',css.includes('prefers-contrast:more')],
  ['keyboard focus',css.includes(':focus-visible')],
  ['offline PDF libraries',html.includes('vendor/pdf/html2canvas.min.js')&&html.includes('vendor/pdf/jspdf.umd.min.js')],
  ['release signing configured',patch.includes('release')&&patch.includes('signingConfig signingConfigs.bpDiaryStable')],
  ['stable signer source',patch.includes('bp-diary-signing.p12')]
];

let failed=0;
for(const [name,ok] of checks){
  console.log((ok?'PASS':'FAIL')+'  '+name);
  if(!ok)failed++;
}

for(const [name,path] of Object.entries(files)){
  const size=(await stat(path)).size;
  console.log('INFO  '+name+' bytes: '+size);
  if(size<=0){console.error('FAIL  empty file: '+name);failed++}
}

const forbidden=[
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net/npm/chart.js',
  'cdn.sheetjs.com/xlsx-'
];
for(const url of forbidden){
  const found=html.includes(url);
  console.log((!found?'PASS':'FAIL')+'  no runtime dependency on '+url);
  if(found)failed++;
}

if(failed){
  console.error('\nV15 regression smoke failed: '+failed+' check(s).');
  process.exit(1);
}
console.log('\nV15 regression smoke: all '+checks.length+' feature checks passed.');
