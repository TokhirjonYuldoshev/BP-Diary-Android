import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE='http://127.0.0.1:4173';
const shots='artifacts/ui-v16';
// Final V16 visual-acceptance gate.

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

test('V16 mobile shell, profile cards, archive and settings remain structurally correct',async({page})=>{
  await expect(page.locator('#mobileAppBar [data-top="reminder"]')).toBeVisible();

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
      cardioTop:cr.top,
      previousBottom:prev?.bottom??0,
      widths:[cr.width,sr.width,tr.width],
      targetBorder:parseFloat(ts.borderTopWidth)||0,
      targetRadius:parseFloat(ts.borderTopLeftRadius)||0,
      targetPadding:parseFloat(ts.paddingTop)||0
    };
  });
  expect(layout).not.toBeNull();
  expect(layout.cardioTop).toBeGreaterThanOrEqual(layout.previousBottom-1);
  expect(Math.max(...layout.widths)-Math.min(...layout.widths)).toBeLessThanOrEqual(3);
  expect(layout.targetBorder).toBeGreaterThan(0);
  expect(layout.targetRadius).toBeGreaterThan(0);
  expect(layout.targetPadding).toBeGreaterThan(0);
  await page.screenshot({path:shots+'/measure-light.png',fullPage:true});

  await page.locator('#mobileBottomNav [data-tab="archive"]').click();
  await expect(page.locator('#mobileArchiveSearch')).toBeVisible();
  await expect(page.locator('#mobileArchiveSort')).toBeVisible();
  const clearSize=await page.locator('#mobileArchiveSearchClear').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height}});
  expect(clearSize.w).toBeGreaterThanOrEqual(44);
  expect(clearSize.h).toBeGreaterThanOrEqual(44);
  await page.screenshot({path:shots+'/archive-light.png',fullPage:true});

  await page.locator('#mobileAppBar [data-top="about"]').click();
  await expect(page.locator('#mobileAboutSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileAboutSheet')).toContainText('5.6.0');
  await page.locator('#mobileAboutSheet [data-about-action="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText('5.6.0');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('V16');
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Проверить обновления|Check for updates/);
  await page.waitForTimeout(80);
  const closeSize=await page.locator('#mobileSettingsSheet .mobile-sheet-close').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height}});
  expect(closeSize.w).toBeGreaterThanOrEqual(44);
  expect(closeSize.h).toBeGreaterThanOrEqual(44);
  await page.screenshot({path:shots+'/settings-light.png',fullPage:true});

  await page.locator('#mobileSettingsSheet .mobile-sheet-close').click();
  await page.locator('#mobileBottomNav [data-tab="measure"]').click();
  await page.locator('#mobileAppBar [data-top="theme"]').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.waitForTimeout(80);
  await page.screenshot({path:shots+'/measure-dark.png',fullPage:true});
});


test('V16 direct settings access, touch targets and bilingual UI remain usable',async({page})=>{
  const topButtons=page.locator('#mobileAppBar .mobile-top-actions button');
  await expect(topButtons).toHaveCount(4);
  const sizes=await topButtons.evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height,label:el.getAttribute('aria-label')}}));
  for(const size of sizes){
    expect(size.w).toBeGreaterThanOrEqual(44);
    expect(size.h).toBeGreaterThanOrEqual(44);
    expect(size.label).toBeTruthy();
  }
  const brandSize=await page.locator('#mobileAppBar .mobile-brand-mark').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height}});
  expect(brandSize.w).toBeGreaterThanOrEqual(44);
  expect(brandSize.h).toBeGreaterThanOrEqual(44);

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Настройки|Settings/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Напоминание|Reminder/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Авто-бэкапы|Auto-backups/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Проверить обновления|Check for updates/);
  await page.locator('#mobileSettingsSheet .mobile-sheet-close').click();

  await page.locator('#mobileAppBar [data-top="lang"]').click();
  await expect(page.locator('#mobileAppBar')).toContainText('Blood pressure diary');
  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Settings');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Reminder');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Check for updates');
  await page.waitForTimeout(80);
  await page.screenshot({path:shots+'/settings-en.png',fullPage:true});

  await page.evaluate(()=>{document.documentElement.style.fontSize='18px'});
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Check for updates');
  const largeTextOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(largeTextOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:shots+'/settings-en-large-text.png',fullPage:true});

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});


test('V16 native reminder bridge contract is wired correctly',async({page})=>{
  await page.evaluate(()=>{
    window.__bpNativeCalls=[];
    window.Capacitor={Plugins:{NativeBridge:{
      getReminderStatus:async()=>({enabled:true,time:'08:30',notificationsAllowed:true}),
      scheduleDailyReminder:async(args)=>{window.__bpNativeCalls.push({method:'scheduleDailyReminder',args});return {enabled:true,time:args.time,notificationsAllowed:true,nextTrigger:Date.now()+3600000}},
      cancelDailyReminder:async()=>{window.__bpNativeCalls.push({method:'cancelDailyReminder'});return {enabled:false,notificationsAllowed:true}},
      requestNotificationPermission:async()=>({allowed:true,requested:false})
    }}};
  });

  await page.locator('#mobileAppBar [data-top="reminder"]').click();
  await expect(page.locator('#mobileReminderSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileReminderTime')).toHaveValue('08:30');
  await expect(page.locator('#mobileReminderSheet')).toContainText(/Уведомления разрешены|Notifications allowed/);

  await page.locator('#mobileReminderTime').fill('08:45');
  await page.locator('#mobileReminderSheet button').filter({hasText:/Сохранить|Save/}).click();
  await expect(page.locator('#mobileReminderSheet')).not.toHaveClass(/open/);

  const calls=await page.evaluate(()=>window.__bpNativeCalls);
  expect(calls).toHaveLength(1);
  expect(calls[0].method).toBe('scheduleDailyReminder');
  expect(calls[0].args.time).toBe('08:45');
  expect(calls[0].args.title).toBe('BP Diary');
});

test('V16 update checker prevents downgrade and offers only a newer release',async({page})=>{
  await page.evaluate(()=>{
    window.__bpOpenedUrls=[];
    window.__bpLatest={tag:'v5.5.150',htmlUrl:'https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.5.150',apkUrl:''};
    window.Capacitor={Plugins:{NativeBridge:{
      checkForUpdate:async()=>window.__bpLatest,
      openUrl:async({url})=>{window.__bpOpenedUrls.push(url);return {}}
    }}};
  });

  const openUpdate=async()=>{
    await page.locator('#mobileAppBar [data-top="settings"]').click();
    await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);
    await page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Проверить обновления|Check for updates/}).click();
    await expect(page.locator('#mobileUpdateSheet')).toHaveClass(/open/);
  };

  await openUpdate();
  await expect(page.locator('#mobileUpdateSheet')).toContainText('5.5.150');
  await expect(page.locator('#mobileUpdateSheet')).toContainText(/актуальная версия|current version/i);
  await expect(page.locator('#mobileUpdateSheet .mobile-settings-primary')).toHaveCount(0);
  await page.locator('#mobileUpdateSheet .mobile-sheet-close').click();

  await page.evaluate(()=>{window.__bpLatest={tag:'v5.7.0',htmlUrl:'https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.7.0',apkUrl:''}});
  await openUpdate();
  await expect(page.locator('#mobileUpdateSheet')).toContainText('5.7.0');
  await expect(page.locator('#mobileUpdateSheet')).toContainText(/более новая версия|newer version/i);
  await expect(page.locator('#mobileUpdateSheet .mobile-settings-primary')).toHaveCount(1);
  await page.locator('#mobileUpdateSheet .mobile-settings-primary').click();

  const urls=await page.evaluate(()=>window.__bpOpenedUrls);
  expect(urls).toEqual(['https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.7.0']);
});
