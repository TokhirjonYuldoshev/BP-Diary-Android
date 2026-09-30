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
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Блокировка приложения|App lock/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Защита экрана|Screen privacy/);
  await expect(page.locator('#mobileSettingsSheet')).toContainText(/Защищённый бэкап|Protected backup/);
  await page.screenshot({path:shots+'/settings-privacy-light.png',fullPage:true});
});

test('V17 final control polish keeps reading selectors framed and centered',async({page})=>{
  const state=await page.evaluate(()=>{
    const stepper=document.querySelector('#mobileMeasureStepper');
    const buttons=[...document.querySelectorAll('#mobileMeasureStepper [data-round]')];
    return {
      role:stepper?.getAttribute('role')||'',
      label:stepper?.getAttribute('aria-label')||'',
      buttons:buttons.map(button=>{
        const s=getComputedStyle(button),r=button.getBoundingClientRect();
        return {
          border:parseFloat(s.borderTopWidth)||0,
          display:s.display,
          align:s.alignItems,
          justify:s.justifyContent,
          textAlign:s.textAlign,
          height:r.height,
          selected:button.getAttribute('aria-selected'),
          controls:button.getAttribute('aria-controls')||''
        };
      })
    };
  });
  expect(state.role).toBe('tablist');
  expect(state.label.length).toBeGreaterThan(0);
  expect(state.buttons).toHaveLength(3);
  expect(state.buttons.filter(x=>x.selected==='true')).toHaveLength(1);
  for(const button of state.buttons){
    expect(button.border).toBeGreaterThan(0);
    expect(button.display).toBe('flex');
    expect(button.align).toBe('center');
    expect(button.justify).toBe('center');
    expect(button.textAlign).toBe('center');
    expect(button.height).toBeGreaterThanOrEqual(44);
    expect(button.controls).toMatch(/^mobileMeasureRound[123]$/);
  }
  expect(Math.max(...state.buttons.map(x=>x.height))-Math.min(...state.buttons.map(x=>x.height))).toBeLessThanOrEqual(1);

  await page.locator('#mobileMeasureStepper [data-round="1"]').click();
  await expect(page.locator('#mobileMeasureStepper [data-round="1"]')).toHaveAttribute('aria-selected','true');
  await expect(page.locator('#mobileMeasureRound2')).toHaveClass(/mobile-round-active/);

  await page.locator('#mobileMeasureQuickActions [data-action="more"]').click();
  await expect(page.locator('#mobileMeasureActionSheet')).toHaveClass(/open/);
  const actionAlignment=await page.locator('#mobileMeasureActionSheet .mobile-sheet-grid button').first().evaluate(el=>{
    const s=getComputedStyle(el);return {justify:s.justifyContent,align:s.alignItems,text:s.textAlign};
  });
  expect(actionAlignment.justify).toBe('center');
  expect(actionAlignment.align).toBe('center');
  expect(actionAlignment.text).toBe('center');

  await page.screenshot({path:shots+'/measure-controls-polish-light.png',fullPage:true});
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
  const bio=page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Блокировка приложения|App lock/});
  await bio.click();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('bp_biometric_lock_v17'))).toBe('1');
  await expect(page.locator('#mobileSettingsSheet')).toHaveClass(/open/);

  const shield=page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Защита экрана|Screen privacy/});
  await expect(shield).toBeVisible();
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

test('V17 top language control cycles directly and UZ mobile UI has no known English leftovers',async({page})=>{
  const lang=page.locator('#mobileAppBar [data-top="lang"]');
  await expect(lang).toHaveText('RU');

  await lang.click();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.lang)).toBe('en');
  await expect(page.locator('#mobileSettingsSheet')).toHaveCount(0);
  await expect(lang).toHaveText('EN');
  await expect(page.locator('#mobileAppBar')).toContainText('Blood pressure diary');

  await lang.click();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.lang)).toBe('uz');
  await expect(lang).toHaveText('UZ');
  await expect(page.locator('#mobileAppBar')).toContainText('Qon bosimi kundaligi');
  await expect(page.locator('#mobileBottomNav')).toContainText('O‘lchov');
  await expect(page.locator('#mobileBottomNav')).toContainText('Tahlil');
  await expect(page.locator('#mobileBottomNav')).toContainText('Arxiv');

  await page.locator('#mobileBottomNav [data-tab="analysis"]').click();
  const analysis=page.locator('.mobile-page-analysis');
  await expect(analysis).toContainText('Asosiy ko‘rsatkichlar va trendlar');
  await expect(analysis).toContainText('Umumiy');
  await expect(analysis).toContainText('Grafiklar');
  await expect(analysis).toContainText(/Barcha ko‘rsatkichlar/);
  const analysisText=await analysis.innerText();
  for(const forbidden of ['Key metrics and trends','Overview','Charts','All metrics'])expect(analysisText).not.toContain(forbidden);

  await page.locator('#mobileBottomNav [data-tab="archive"]').click();
  await page.locator('.mobile-page-archive button').filter({hasText:/Amallar/}).first().click();
  const actionSheet=page.locator('#mobileActionSheet');
  await expect(actionSheet).toHaveClass(/open/);
  const actionText=await actionSheet.innerText();
  for(const forbidden of ['Restore protected','Doctor report / PDF','Restore backup','Delete all'])expect(actionText).not.toContain(forbidden);
  await expect(actionSheet).toContainText('Himoyalangan zaxira nusxa');
  await expect(actionSheet).toContainText('Shifokor hisoboti / PDF');
  await page.locator('#mobileActionSheet').click({position:{x:4,y:4}});
  await expect(actionSheet).not.toHaveClass(/open/);

  await page.locator('#mobileAppBar [data-top="settings"]').click();
  await expect(page.locator('#mobileSettingsSheet')).toContainText('Sozlamalar');
  const language=page.locator('#mobileSettingsSheet .mobile-settings-segment').first();
  await expect(language.locator('[data-value="uz"]')).toHaveAttribute('aria-pressed','true');
  const theme=page.locator('#mobileSettingsSheet .mobile-settings-segment').nth(1);
  await theme.locator('[data-value="dark"]').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.screenshot({path:shots+'/settings-language-theme-dark-uz.png',fullPage:true});
});

test('V17 protected backup is a true modal above navigation and closes cleanly',async({page})=>{
  await page.evaluate(()=>{
    window.Capacitor={Plugins:{NativeBridge:{
      saveTextFile:async(args)=>({name:args.fileName,uri:'content://test/protected'}),
      setPrivacyShield:async()=>({})
    }}};
  });

  const openProtected=async()=>{
    await page.locator('#mobileAppBar [data-top="settings"]').click();
    await page.locator('#mobileSettingsSheet .mobile-settings-row').filter({hasText:/Защищённый бэкап|Protected backup/}).click();
    await expect(page.locator('#mobileSecretSheet')).toHaveClass(/open/);
  };

  await openProtected();
  await expect(page.locator('#mobileSecretSheet')).toHaveCount(1);
  await expect(page.locator('body')).toHaveClass(/mobile-sheet-open/);

  const layout=await page.locator('#mobileSecretSheet').evaluate(sheet=>{
    const panel=sheet.querySelector('.mobile-sheet-panel');
    const actions=sheet.querySelector('.mobile-secret-actions');
    const nav=document.querySelector('#mobileBottomNav');
    const ss=getComputedStyle(sheet),ns=getComputedStyle(nav),ps=getComputedStyle(panel);
    const sr=sheet.getBoundingClientRect(),pr=panel.getBoundingClientRect();
    return {
      position:ss.position,z:Number(ss.zIndex)||0,navZ:Number(ns.zIndex)||0,navPointer:ns.pointerEvents,
      sheet:{left:sr.left,top:sr.top,right:sr.right,bottom:sr.bottom},
      panel:{left:pr.left,top:pr.top,right:pr.right,bottom:pr.bottom},
      overflowY:ps.overflowY,
      actionButtons:[...actions.querySelectorAll('button')].map(b=>b.getBoundingClientRect().height)
    };
  });
  expect(layout.position).toBe('fixed');
  expect(layout.z).toBeGreaterThan(layout.navZ);
  expect(layout.navPointer).toBe('none');
  expect(layout.sheet.left).toBeGreaterThanOrEqual(0);
  expect(layout.sheet.top).toBeGreaterThanOrEqual(0);
  expect(layout.sheet.right).toBeLessThanOrEqual(390);
  expect(layout.sheet.bottom).toBeLessThanOrEqual(844);
  expect(layout.panel.left).toBeGreaterThanOrEqual(0);
  expect(layout.panel.right).toBeLessThanOrEqual(390);
  expect(layout.panel.bottom).toBeLessThanOrEqual(844);
  expect(layout.actionButtons.every(v=>v>=44)).toBeTruthy();

  await page.locator('#mobileSecretSheet .mobile-sheet-close').click();
  await expect(page.locator('#mobileSecretSheet')).not.toHaveClass(/open/);
  await expect(page.locator('body')).not.toHaveClass(/mobile-sheet-open/);

  await openProtected();
  await expect(page.locator('#mobileSecretSheet')).toHaveCount(1);
  await page.locator('#mobileSecretSheet .mobile-secret-actions .outline').click();
  await expect(page.locator('#mobileSecretSheet')).not.toHaveClass(/open/);
});

test('V17 onboarding uses three new full illustrations and stays inside the viewport',async({page})=>{
  await page.locator('#mobileAppBar [data-top="about"]').click();
  await page.locator('#mobileAboutSheet [data-about-action="guide"]').click();
  await expect(page.locator('#mobileOnboarding')).toHaveClass(/open/);
  await expect(page.locator('.mobile-onboarding-top')).toBeVisible();
  await expect(page.locator('.mobile-onboarding-progress')).toBeVisible();
  await expect(page.locator('.mobile-onboarding-card')).toHaveClass(/is-first/);
  await expect(page.locator('.mobile-onboarding-scene')).toHaveAttribute('data-scene','measure');

  const box=await page.locator('.mobile-onboarding-card').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x+box.width).toBeLessThanOrEqual(390);
  expect(box.y+box.height).toBeLessThanOrEqual(844);

  await page.locator('.mobile-onboarding-next').click();
  await expect(page.locator('.mobile-onboarding-step')).toContainText('2');
  await expect(page.locator('.mobile-onboarding-scene')).toHaveAttribute('data-scene','report');
  await page.locator('.mobile-onboarding-next').click();
  await expect(page.locator('.mobile-onboarding-step')).toContainText('3');
  await expect(page.locator('.mobile-onboarding-scene')).toHaveAttribute('data-scene','privacy');
  await expect(page.locator('#mobileOnboarding')).toContainText('V17');
  await page.screenshot({path:shots+'/onboarding-v17-new-scenes.png',fullPage:true});
});

test('V17 fixed navigation and icon-only close controls stay centered and inside safe bounds',async({page})=>{
  const nav=await page.locator('#mobileBottomNav').evaluate(el=>{
    const r=el.getBoundingClientRect(),body=getComputedStyle(document.body);
    return {left:r.left,right:r.right,height:r.height,paddingBottom:parseFloat(body.paddingBottom)||0,viewport:innerWidth};
  });
  expect(nav.left).toBeGreaterThanOrEqual(0);
  expect(nav.right).toBeLessThanOrEqual(nav.viewport);
  expect(nav.paddingBottom).toBeGreaterThan(nav.height);

  await page.locator('#mobileAppBar [data-top="about"]').click();
  const aboutBounds=await page.locator('#mobileAboutSheet').evaluate(sheet=>{
    const panel=sheet.querySelector('.mobile-sheet-panel'),header=sheet.querySelector('.mobile-sheet-title');
    const sr=sheet.getBoundingClientRect(),pr=panel.getBoundingClientRect(),hr=header.getBoundingClientRect();
    return {sheet:{left:sr.left,right:sr.right},panel:{left:pr.left,right:pr.right},header:{left:hr.left,right:hr.right},viewport:innerWidth};
  });
  expect(aboutBounds.sheet.left).toBeGreaterThanOrEqual(0);
  expect(aboutBounds.sheet.right).toBeLessThanOrEqual(aboutBounds.viewport);
  expect(aboutBounds.panel.left).toBeGreaterThanOrEqual(0);
  expect(aboutBounds.panel.right).toBeLessThanOrEqual(aboutBounds.viewport);
  expect(aboutBounds.header.left).toBeGreaterThanOrEqual(aboutBounds.panel.left-1);
  expect(aboutBounds.header.right).toBeLessThanOrEqual(aboutBounds.panel.right+1);

  const close=await page.locator('#mobileAboutSheet .mobile-about-close').evaluate(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return {display:s.display,place:s.placeItems,width:r.width,height:r.height};
  });
  expect(close.display).toBe('grid');
  expect(close.place).toContain('center');
  expect(close.width).toBeGreaterThanOrEqual(44);
  expect(close.height).toBeGreaterThanOrEqual(44);

  const reportButton=await page.evaluate(()=>{
    const b=document.createElement('button');
    b.className='outline mobile-report-close';
    b.innerHTML='<svg viewBox="0 0 24 24"><path d="M19 12H5"/></svg>';
    document.body.appendChild(b);
    const s=getComputedStyle(b),r=b.getBoundingClientRect();
    const out={display:s.display,place:s.placeItems,width:r.width,height:r.height};
    b.remove();return out;
  });
  expect(reportButton.display).toBe('grid');
  expect(reportButton.place).toContain('center');
  expect(reportButton.width).toBeGreaterThanOrEqual(44);
  expect(reportButton.height).toBeGreaterThanOrEqual(44);
});

test('V17 uses the system authentication prompt with a 10 second background threshold',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('bp_biometric_lock_v17','1');
    window.__bpBioResolve=null;
    window.Capacitor={Plugins:{NativeBridge:{
      authenticateBiometric:async()=>new Promise(resolve=>{window.__bpBioResolve=resolve}),
      setPrivacyShield:async()=>({}),
      consumeScreenOffEvent:async()=>({screenOff:false}),
      backgroundApp:async()=>({}),
      addListener:async()=>({remove:async()=>{}})
    }}};
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await expect.poll(()=>page.evaluate(()=>typeof window.__bpBioResolve)).toBe('function');
  expect(await page.evaluate(()=>window.__bpPrivacyLockMs)).toBe(10000);
  expect(await page.locator('#mobilePrivacyLock').count()).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.classList.contains('bp-prelocked'))).toBe(true);
  await page.evaluate(()=>window.__bpBioResolve({authenticated:true}));
  await expect.poll(()=>page.evaluate(()=>document.documentElement.classList.contains('bp-prelocked'))).toBe(false);
});

test('V17 screen-off event hides content immediately and requires re-authentication on resume',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('bp_biometric_lock_v17','1');
    window.__screenAuthCalls=0;
    window.__screenOffCallback=null;
    window.Capacitor={Plugins:{NativeBridge:{
      authenticateBiometric:async()=>{window.__screenAuthCalls++;return {authenticated:true}},
      consumeScreenOffEvent:async()=>({screenOff:true}),
      setPrivacyShield:async()=>({}),
      backgroundApp:async()=>({}),
      addListener:async(name,callback)=>{if(name==='screenOff')window.__screenOffCallback=callback;return {remove:async()=>{}}}
    }}};
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toHaveClass(/mobile-shell-ready/);
  await expect.poll(()=>page.evaluate(()=>typeof window.__screenOffCallback)).toBe('function');

  await page.evaluate(()=>window.__screenOffCallback({screenOff:true}));
  await expect.poll(()=>page.evaluate(()=>document.documentElement.classList.contains('bp-prelocked'))).toBe(true);

  const before=await page.evaluate(()=>window.__screenAuthCalls);
  await page.evaluate(()=>window.__bpPrivacyResumeCheck());
  await expect.poll(()=>page.evaluate(()=>window.__screenAuthCalls)).toBeGreaterThan(before);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.classList.contains('bp-prelocked'))).toBe(false);
});
