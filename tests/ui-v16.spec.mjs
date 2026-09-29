import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE='http://127.0.0.1:4173';
const shots='artifacts/ui-v16';

test.use({ viewport:{width:390,height:844}, deviceScaleFactor:1 });

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
  await page.screenshot({path:shots+'/archive-light.png',fullPage:true});

  await page.locator('#mobileAppBar [data-top="about"]').click();
  await expect(page.locator('#mobileAboutSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileAboutSheet')).toContainText('5.6.0');
  await page.locator('#mobileAboutSheet [data-about-action="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText('5.6.0');
  await expect(page.locator('#mobileSettingsSheet')).toContainText('V16');
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Проверить обновления|Check for updates/);
  await page.screenshot({path:shots+'/settings-light.png',fullPage:true});

  await page.locator('#mobileSettingsSheet .mobile-sheet-close').click();
  await page.locator('#mobileBottomNav [data-tab="measure"]').click();
  await page.locator('#mobileAppBar [data-top="theme"]').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.screenshot({path:shots+'/measure-dark.png',fullPage:true});
});
