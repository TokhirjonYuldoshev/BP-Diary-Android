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
  ['V17 protected backup crypto',js.includes('encryptBackupPayload')&&js.includes('decryptBackupEnvelope')&&js.includes('AES-GCM')&&js.includes('PBKDF2')],
  ['V17 protected backup UI',js.includes('nativeSaveProtectedBackup')&&js.includes('nativeRestoreProtectedBackup')&&css.includes('#mobileSecretSheet')],
  ['V17 About removes duplicate shortcuts',!js.includes('data-about-action="settings"')&&!js.includes('data-about-action="backups"')],
  ['V17 pre-save safety warning',html.includes('confirmPreSaveSafety')&&html.includes('getPreSaveSafetyWarning')&&js.includes('bpPreSaveSafetyAlert')&&css.includes('#mobileSafetyAlertSheet')],
  ['V17 inline profile validation',html.includes('profileValidationSummary')&&css.includes('.profile-validation-summary')],
  ['V17 protected backup true modal',css.includes('#mobileSecretSheet{')&&css.includes('position:fixed!important')&&css.includes('z-index:38000!important')],
  ['V17 direct language cycle + UZ localization',js.includes('cycleMobileLanguage')&&js.includes('syncUzLocalizationObserver')&&js.includes("Key metrics and trends':'Asosiy ko‘rsatkichlar va trendlar")&&js.includes("pressureChart:'QB'")&&js.includes("weekdayChart:'Hafta kunlari'")],
  ['V17 live medical-field validation',source.includes('PROFILE_NUMERIC_RULES')&&source.includes('profileValidationReason')&&source.includes('profile-input-invalid')&&source.includes('profile-validation-error')],
  ['V17 measurement entry guardrails',source.includes('MEASUREMENT_ENTRY_LIMITS')&&source.includes('validateMeasurementInputs')&&source.includes('measurementEntryIssue')&&css.includes('measurement-input-invalid')&&css.includes('measurement-validation-error')],
  ['V17 Uzbek archive periods',js.includes("'7 kun'")&&js.includes("'30 kun'")&&js.includes("'90 kun'")&&js.includes("'Arxiv davri: '")],
  ['V17 full RU/EN/UZ user guide',js.includes('showGuideSheet')&&js.includes('Foydalanish qo‘llanmasi')&&js.includes('BP Diary user guide')&&css.includes('#mobileGuideSheet')&&css.includes('.mobile-guide-card')],
  ['V17 desktop-style mobile doctor report',source.includes('@page { size: A4 landscape')&&js.includes("orientation:'landscape'")&&js.includes('width:1123px;height:794px')&&js.includes("pdf.addPage('a4','landscape')")],
  ['V17 advanced reminder UI',js.includes('mobileReminderRepeats')&&js.includes('mobileReminderInterval')&&js.includes('mobileReminderSound')&&js.includes('mobileReminderVibrate')&&js.includes('testReminderSound')],
  ['V17 repeating native reminders',patch.includes('ACTION_REMINDER_REPEAT')&&patch.includes('ACTION_REMINDER_DONE')&&patch.includes('ACTION_REMINDER_SNOOZE')&&patch.includes('ACTION_REMINDER_TEST')&&patch.includes('getTimesCsv')&&patch.includes('IMPORTANCE_HIGH')&&patch.includes('DEFAULT_ALARM_ALERT_URI')&&patch.includes('testReminderSound')],
  ['V17 onboarding scenes',js.includes('onboardingIllustration')&&js.includes('data-scene="measure"')&&js.includes('data-scene="privacy"')&&js.includes('bp_v17_onboarding_done')],
  ['V17 system authentication lock',js.includes('toggleBiometricProtection')&&js.includes('V17_BACKGROUND_LOCK_MS=10000')&&js.includes('consumeScreenOffEvent')&&js.includes('privacyAuthInFlight')&&js.includes('schedulePrivacyResumeCheck')&&js.includes('startPrivacyWatchdog')&&!js.includes('function privacyOverlay()')],
  ['V17 pre-paint lock',html.includes('bp_biometric_lock_v17')&&css.includes('html.bp-prelocked body')],
  ['native biometric bridge',patch.includes('void getBiometricStatus')&&patch.includes('void authenticateBiometric')&&patch.includes('DEVICE_CREDENTIAL')&&patch.includes('androidx.biometric:biometric')],
  ['native privacy shield',patch.includes('void setPrivacyShield')&&patch.includes('FLAG_SECURE')&&patch.includes('bp_diary_privacy')&&patch.includes('screen_shield')],
  ['native screen-off lock signal',patch.includes('ACTION_SCREEN_OFF')&&patch.includes('consumeScreenOffEvent')&&patch.includes('backgroundApp')],
  ['native reminder scheduler',patch.includes('class ReminderScheduler')&&patch.includes('class ReminderReceiver')&&patch.includes('class ReminderRestoreReceiver')],
  ['notification permission handling',patch.includes('POST_NOTIFICATIONS')&&patch.includes('requestNotificationPermission')],
  ['receiver separation',patch.includes('android:name=".ReminderReceiver"')&&patch.includes('android:exported="false"')&&patch.includes('android:name=".ReminderRestoreReceiver"')&&patch.includes('android:exported="true"')],
  ['native update checker',patch.includes('void checkForUpdate')&&patch.includes('api.github.com/repos/TokhirjonYuldoshev/BP-Diary-Android/releases/latest')],
  ['system reminder restoration',patch.includes('BOOT_COMPLETED')&&patch.includes('MY_PACKAGE_REPLACED')&&patch.includes('ReminderRestoreReceiver')&&patch.includes('ReminderScheduler.scheduleNext')],
  ['reduced motion',css.includes('prefers-reduced-motion')],
  ['high contrast',css.includes('prefers-contrast:more')],
  ['keyboard focus',css.includes(':focus-visible')],
  ['offline PDF libraries',html.includes('vendor/pdf/html2canvas.min.js')&&html.includes('vendor/pdf/jspdf.umd.min.js')],
  ['V18 no embedded release signing',!patch.includes('signingConfig signingConfigs.bpDiaryStable')&&!patch.includes('storePassword "android"')],
  ['V18 no tracked legacy signer reference',!patch.includes('ci/debug.keystore.b64')&&!patch.includes('bp-diary-signing.p12')]
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
