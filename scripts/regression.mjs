import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const www=join(root,'www');
const version=JSON.parse(await readFile(join(root,'version.json'),'utf8'));
const files={
  source:join(root,'source','index.html'),
  html:join(www,'index.html'),
  js:join(www,'mobile-modern.js'),
  css:join(www,'mobile-modern.css'),
  patch:join(root,'scripts','patch-android.mjs')
};

const [source,html,js,css,patch]=await Promise.all([
  readFile(files.source,'utf8'),
  readFile(files.html,'utf8'),
  readFile(files.js,'utf8'),
  readFile(files.css,'utf8'),
  readFile(files.patch,'utf8')
]);

const sourceEntries=await readdir(join(root,'source'));
const legacyParts=sourceEntries.filter(name=>/^index\.part\d+\.b64$/i.test(name));
const expectedRelease=String(version.release||'');
const expectedVersion=String(version.versionName||'');
const expectedCode=String(version.versionCode||'');

const checks=[
  ['readable source/index.html',source.includes('<!DOCTYPE html>')||source.includes('<html')],
  ['legacy Base64 source removed',legacyParts.length===0],
  ['resolved release metadata',js.includes("const APP_RELEASE='"+expectedRelease+"'")&&js.includes("const APP_VERSION='"+expectedVersion+"'")&&js.includes("const APP_VERSION_CODE=Number('"+expectedCode+"')")],
  ['mobile navigation',js.includes('mobileBottomNav')],
  ['Android Back bridge',js.includes('__bpHandleAndroidBack')],
  ['doctor PDF sharing',js.includes('sharePdfBase64')&&js.includes('shareDoctorReportHtml')],
  ['report period selector',js.includes('openReportPeriodSheet')],
  ['automatic backups',js.includes('saveAutoBackup')&&js.includes('listAutoBackups')],
  ['onboarding',js.includes('showOnboarding')],
  ['archive search',js.includes('mobileArchiveSearch')&&js.includes('archiveTools')],
  ['accessible pages',js.includes('applyAccessibility')],
  ['dialog semantics',js.includes("setAttribute('aria-modal','true')")],
  ['cardio row correction',js.includes('mobile-cardio-row')&&css.includes('.date-time-row.mobile-cardio-row')],
  ['personal target frame',js.includes('mobile-target-shell')&&css.includes('.date-time-row.target-row.mobile-target-shell')],
  ['unified action buttons',js.includes('mobile-action-blue')],
  ['V16 settings screen',js.includes('showSettingsSheet')&&css.includes('#mobileSettingsSheet')],
  ['V16 native reminder UI',js.includes('showReminderSheet')&&js.includes('scheduleDailyReminder')&&css.includes('#mobileReminderSheet')],
  ['legacy reminder migration',js.includes('migrateLegacyReminderToNative')],
  ['V16 update checker UI',js.includes('checkForUpdates')&&js.includes('mobileUpdateSheet')],
  ['native reminder scheduler',patch.includes('class ReminderScheduler')&&patch.includes('class ReminderReceiver')],
  ['notification permission handling',patch.includes('POST_NOTIFICATIONS')&&patch.includes('requestNotificationPermission')],
  ['native update checker',patch.includes('void checkForUpdate')&&patch.includes('api.github.com/repos/TokhirjonYuldoshev/BP-Diary-Android/releases/latest')],
  ['reboot reminder restoration',patch.includes('BOOT_COMPLETED')&&patch.includes('ReminderScheduler.scheduleNext')],
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

if(js.includes('__BP_RELEASE__')||js.includes('__BP_VERSION_NAME__')||js.includes('__BP_VERSION_CODE__')){
  console.error('FAIL  unresolved version placeholder in prepared mobile JS');
  failed++;
}else{
  console.log('PASS  no unresolved version placeholders');
}

if(failed){
  console.error('\nRegression smoke failed: '+failed+' check(s).');
  process.exit(1);
}
console.log('\nRegression smoke: all '+checks.length+' feature/repository checks passed for '+expectedRelease+' '+expectedVersion+'.');
