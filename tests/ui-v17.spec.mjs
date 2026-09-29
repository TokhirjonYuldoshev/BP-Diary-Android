import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE='http://127.0.0.1:4173';
const shots='artifacts/ui-v17';

test.use({ viewport:{width:390,height:844}, deviceScaleFactor:1, reducedMotion:'reduce' });

test.beforeEach(async ({page})=>{
  await mkdir(shots,{recursive:true});
  await page.addInitScript(()=>{
    localStorage.setItem('bp_v12_onboarding_done','1');
    localStorage.setItem('bp_mobile_tab','measure');
  });
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toHaveClass(/mobile-shell-ready/);
  await expect(page.locator('#mobileAppBar')).toBeVisible();
  await expect(page.locator('#mobileBottomNav')).toBeVisible();
});

test('V17 preserves core mobile layout and exposes privacy settings',async({page})=>{
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const layout=await page.evaluate(()=>{
    const cardio=document.querySelector('.date-time-row.mobile-cardio-row');
    const target=document.querySelector('.date-time-row.target-row.mobile-target-shell');
    const score=[...document.querySelectorAll('.date-time-row')].find(el=>/SCORE2/i.test(el.textContent||''));
    if(!cardio||!target||!score)return null;
    const cr=cardio.getBoundingClientRect(),tr=target.getBoundingClientRect(),sr=score.getBoundingClientRect();
    const prev=cardio.previousElementSibling?.getBoundingClientRect?.();
    const ts=getComputedStyle(target);
    return {
      cardioTop:cr.top,previousBottom:prev?.bottom??0,widths:[cr.width,sr.width,tr.width],
      targetBorder:parseFloat(ts.borderTopWidth)||0,targetRadius:parseFloat(ts.borderTopLeftRadius)||0
    };
  });
  expect(layout).not.toBeNull();
  expect(layout.cardioTop).toBeGreaterThanOrEqual(layout.previousBottom-1);
  expect(Math.max(...layout.widths)-Math.min(...layout.widths)).toBeLessThanOrEqual(3);
  expect(layout.targetBorder).toBeGreaterThan(0);
  expect(layout.targetRadius).toBeGreaterThan(0);

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText('5.7.0');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('V17');
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Биометрическая блокировка|Biometric lock/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Защита экрана|Screen privacy/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Защищённый бэкап|Protected backup/);
  await page.screenshot({path:shots+'/settings-privacy-light.png',fullPage:true});
});

test('V17 biometric and screenshot privacy toggles use the native bridge',async({page})=>{
  await page.evaluate(()=>{
    window.__bpPrivacyCalls=[];
    window.Capacitor={Plugins:{NativeBridge:{
      getBiometricStatus:async()=>({available:true,status:0}),
      authenticateBiometric:async(args)=>{window.__bpPrivacyCalls.push({method:'authenticateBiometric',args});return {authenticated:true}},
      setPrivacyShield:async(args)=>{window.__bpPrivacyCalls.push({method:'setPrivacyShield',args});return args}
    }}};
  });

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  const bio=page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Биометрическая блокировка|Biometric lock/});
  await bio.click();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('bp_biometric_lock_v17'))).toBe('1');

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  const shield=page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Защита экрана|Screen privacy/});
  await shield.click();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('bp_privacy_shield_v17'))).toBe('1');

  const calls=await page.evaluate(()=>window.__bpPrivacyCalls);
  expect(calls.some(x=>x.method==='authenticateBiometric')).toBeTruthy();
  expect(calls.some(x=>x.method==='setPrivacyShield'&&x.args.enabled===true)).toBeTruthy();
});

test('V17 protected backup produces an encrypted envelope instead of plaintext backup data',async({page})=>{
  await page.evaluate(()=>{
    window.__bpSavedProtected=null;
    window.Capacitor={Plugins:{NativeBridge:{
      saveTextFile:async(args)=>{window.__bpSavedProtected=args;return {name:args.fileName,uri:'content://test/protected'}},
      setPrivacyShield:async()=>({})
    }}};
  });

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Защищённый бэкап|Protected backup/}).click();
  await expect(page.locator('#mobileSecretSheet')).toHaveClass(/open/);
  await page.locator('#mobileSecretOne').fill('Correct-Horse-17');
  await page.locator('#mobileSecretTwo').fill('Correct-Horse-17');
  await page.locator('#mobileSecretSheet .mobile-settings-primary').click();

  await expect.poll(()=>page.evaluate(()=>window.__bpSavedProtected!==null),{timeout:10000}).toBe(true);
  const saved=await page.evaluate(()=>window.__bpSavedProtected);
  expect(saved.fileName).toMatch(/\.bpbackup\.json$/);
  const envelope=JSON.parse(saved.content);
  expect(envelope.format).toBe('bp-diary-encrypted-backup');
  expect(envelope.version).toBe(1);
  expect(envelope.cipher).toBe('AES-GCM-256');
  expect(envelope.kdf).toBe('PBKDF2-SHA-256');
  expect(envelope.iterations).toBeGreaterThanOrEqual(300000);
  expect(typeof envelope.ciphertext).toBe('string');
  expect(envelope.ciphertext.length).toBeGreaterThan(20);
  expect(saved.content).not.toContain('"dataByPatient"');
  expect(saved.content).not.toContain('"patientSettings"');
});

test('V17 remains usable in dark theme and English',async({page})=>{
  await page.locator('#mobileAppBar [data-top="lang"]').click();
  await expect(page.locator('#mobileAppBar')).toContainText('Blood pressure diary');
  await page.locator('#mobileAppBar [data-top="theme"]').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Biometric lock');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Protected backup');
  await page.screenshot({path:shots+'/settings-privacy-dark-en.png',fullPage:true});
});


test('V17 cold-start biometric guard covers the diary until authentication succeeds',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('bp_biometric_lock_v17','1');
    window.__bpBioResolve=null;
    window.Capacitor={Plugins:{NativeBridge:{
      authenticateBiometric:async()=>new Promise(resolve=>{window.__bpBioResolve=resolve}),
      setPrivacyShield:async()=>({})
    }}};
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#mobilePrivacyLock')).toHaveClass(/open/);
  await expect(page.locator('#mobilePrivacyLock')).toContainText(/Приложение защищено|App locked/);
  const prelocked=await page.evaluate(()=>document.documentElement.classList.contains('bp-prelocked'));
  expect(prelocked).toBe(false);
  await expect.poll(()=>page.evaluate(()=>typeof window.__bpBioResolve)).toBe('function');
  await page.evaluate(()=>window.__bpBioResolve({authenticated:true}));
  await expect(page.locator('#mobilePrivacyLock')).not.toHaveClass(/open/);
});
