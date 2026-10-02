(()=>{
  'use strict';
  const mq=window.matchMedia('(max-width:720px), (max-width:1100px) and (hover:none) and (pointer:coarse)');
  let observer=null,timer=null,rebuilding=false,currentTab='measure',activeRound=0;
  try{currentTab=localStorage.getItem('bp_mobile_tab')||'measure';activeRound=Number(localStorage.getItem('bp_mobile_round')||0)||0}catch(_){}
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const appLang=()=>['ru','en','uz'].includes(document.documentElement.lang)?document.documentElement.lang:'ru';
  const ru=()=>appLang()==='ru';
  const uz=()=>appLang()==='uz';
  const l=(ruText,enText,uzText)=>uz()?(uzText??enText):(ru()?ruText:enText);
  const UZ_MOBILE_TEXT={
    'Measure':'O‘lchov','Analytics':'Tahlil','Archive':'Arxiv','Measurements':'O‘lchovlar','NEW READING':'YANGI O‘LCHOV',
    'Blood pressure check':'Qon bosimini nazorat qilish','Blood Pressure Diary':'Qon bosimi kundaligi','Today':'Bugun','Main':'Asosiy',
    'Clear':'Tozalash','More':'Yana','More actions':'Qo‘shimcha amallar','Actions':'Amallar','Data & actions':'Ma’lumotlar va amallar',
    'Search archive':'Arxivdan qidirish','Archive search and filters':'Arxiv qidiruvi va filtrlari','Archive is empty':'Arxiv bo‘sh',
    'Archive screen':'Arxiv ekrani','All':'Barchasi','All data':'Barcha ma’lumotlar','Overview':'Umumiy','Charts':'Grafiklar',
    'All metrics':'Barcha ko‘rsatkichlar','Key metrics and trends':'Asosiy ko‘rsatkichlar va trendlar','Filter':'Filtr','Reset':'Tiklash',
    'Add reading':'O‘lchov qo‘shish','Add readings — the chart will appear here':'O‘lchov qo‘shing — grafik shu yerda paydo bo‘ladi',
    'Measurement history and data':'O‘lchovlar tarixi va ma’lumotlar','Analytics screen':'Tahlil ekrani',
    'Analytics starts with your first reading':'Tahlil birinchi o‘lchovdan boshlanadi','Not enough data for this chart':'Bu grafik uchun ma’lumot yetarli emas',
    'Save a reading and metrics and charts will appear automatically.':'O‘lchovni saqlang — ko‘rsatkichlar va grafiklar avtomatik paydo bo‘ladi.',
    'Settings':'Sozlamalar','About':'Dastur haqida','Reminder':'Eslatma','Done':'Tayyor','Back':'Orqaga','Next':'Keyingi',
    'Start':'Boshlash','Skip':'O‘tkazib yuborish','Language':'Til','Theme':'Mavzu','Privacy':'Maxfiylik',
    'App':'Ilova','Android & data':'Android va ma’lumotlar','Protected backup':'Himoyalangan zaxira nusxa',
    'Restore protected':'Himoyalangan zaxirani tiklash','Restore protected backup':'Himoyalangan zaxirani tiklash',
    'Full backup':'To‘liq zaxira nusxa','Restore backup':'Zaxira nusxani tiklash','Restore backup?':'Zaxira nusxa tiklansinmi?',
    'Auto-backups':'Avto-zaxiralar','Automatic backups':'Avtomatik zaxira nusxalar','Create backup now':'Hozir zaxira nusxa yaratish',
    'No automatic backups yet.':'Hali avtomatik zaxira nusxa yo‘q.','Check for updates':'Yangilanishlarni tekshirish',
    'Doctor report':'Shifokor uchun hisobot','Doctor report / PDF':'Shifokor hisoboti / PDF','Doctor report period':'Shifokor hisoboti davri',
    'Preview & export':'Ko‘rish va eksport','Print':'Chop etish','Save PDF':'PDF saqlash','Save report as PDF':'Hisobotni PDF saqlash',
    'Share':'Ulashish','Share via':'Ulashish','Share doctor report':'Shifokor hisobotini ulashish','Cancel':'Bekor qilish',
    'Continue':'Davom etish','Confirm':'Tasdiqlash','Delete':'O‘chirish','Delete all':'Hammasini o‘chirish',
    'Delete all data?':'Barcha ma’lumotlar o‘chirilsinmi?','Edit':'Tahrirlash','Add':'Qo‘shish',
    'Password':'Parol','Repeat password':'Parolni takrorlang','Close':'Yopish','Save':'Saqlash',
    'SYS':'SAB','DIA':'DAB','Pulse':'Puls','Average':'O‘rtacha','Current reading':'Joriy o‘lchov',
    'Important medical information':'Muhim tibbiy ma’lumot','Newest first':'Avval yangilari','Oldest first':'Avval eskilari',
    'Clear search':'Qidiruvni tozalash','SCORE applicability':'SCORE qo‘llanishi','Manual region':'Hududni qo‘lda tanlash',
    'Manual region selection (fallback)':'Hududni qo‘lda tanlash (zaxira rejim)','Diary SBP average':'Kundalikdagi o‘rtacha SAB',
    'Daily reminder':'Kunlik eslatma','Time to measure your blood pressure':'Qon bosimini o‘lchash vaqti',
    'Allow notifications':'Bildirishnomalarga ruxsat berish','Notifications allowed':'Bildirishnomalarga ruxsat berilgan',
    'Notification permission required':'Bildirishnoma ruxsati kerak','Confirm the Android permission':'Android ruxsatini tasdiqlang',
    'Turn off':'O‘chirish','Update':'Yangilash','Installed':'O‘rnatilgan','Latest release':'So‘nggi reliz',
    'Open official release':'Rasmiy relizni ochish','You are running the current version.':'Sizda joriy versiya o‘rnatilgan.',
    'Checking for updates…':'Yangilanishlar tekshirilmoqda…','Loading…':'Yuklanmoqda…',
    'Custom period':'Maxsus davr','Custom report period':'Hisobot uchun maxsus davr','Report period':'Hisobot davri',
    'Last 7 days':'Oxirgi 7 kun','Last 14 days':'Oxirgi 14 kun','Last 30 days':'Oxirgi 30 kun','From':'Boshlanish','To':'Tugash',
    'PDF orientation':'PDF yo‘nalishi','Portrait':'Portret','Landscape':'Landshaft','PDF report is ready to share':'PDF hisobot ulashishga tayyor',
    'No data to share':'Ulashish uchun ma’lumot yo‘q','No data to speak':'Ovoz chiqarish uchun ma’lumot yo‘q',
    'Share via':'Ulashish','Health metrics chart':'Salomatlik ko‘rsatkichlari grafigi','Chart selector':'Grafik tanlash',
    'Temperature':'Harorat','Weight':'Vazn','Time':'Vaqt','Reading deleted':'O‘lchov o‘chirildi',
    'Add patient':'Bemor qo‘shish','Edit patient':'Bemorni tahrirlash','Delete patient':'Bemorni o‘chirish',
    'Measure screen':'O‘lchov ekrani','Current app data will be replaced by the selected backup file.':'Joriy ma’lumotlar tanlangan zaxira nusxa bilan almashtiriladi.',
    'Current data will be replaced by the selected automatic backup.':'Joriy ma’lumotlar tanlangan avtomatik zaxira bilan almashtiriladi.',
    'Restore auto-backup?':'Avto-zaxira tiklansinmi?','Auto-backup created':'Avto-zaxira yaratildi','Auto-backup restored':'Avto-zaxira tiklandi',
    'Backup restored. The app will restart.':'Zaxira nusxa tiklandi. Ilova qayta ishga tushiriladi.',
    'Backup function unavailable':'Zaxira nusxa funksiyasi mavjud emas','Invalid backup format':'Zaxira nusxa formati noto‘g‘ri',
    'Corrupted protected backup':'Himoyalangan zaxira buzilgan','Wrong password or corrupted file':'Parol noto‘g‘ri yoki fayl buzilgan',
    'Encryption is unavailable on this device':'Bu qurilmada shifrlash mavjud emas','Decryption is unavailable on this device':'Bu qurilmada shifrdan chiqarish mavjud emas',
    'Invalid encryption parameters':'Shifrlash parametrlari noto‘g‘ri','This is not a protected BP Diary backup':'Bu BP Diary himoyalangan zaxira nusxasi emas',
    'No data for the selected period':'Tanlangan davr uchun ma’lumot yo‘q','Check the date range':'Sana oralig‘ini tekshiring',
    'Check the time':'Vaqtni tekshiring','Reminder enabled':'Eslatma yoqildi','Reminder disabled':'Eslatma o‘chirildi',
    'Reminder unavailable':'Eslatma mavjud emas','Press Back again to exit':'Chiqish uchun Orqaga tugmasini yana bosing',
    'Native feature unavailable':'Mahalliy Android funksiyasi mavjud emas','Doctor report unavailable':'Shifokor hisoboti mavjud emas',
    'No readings match your search.':'Qidiruvga mos o‘lchov topilmadi.','Saved readings will appear here.':'Saqlangan o‘lchovlar shu yerda ko‘rinadi.',
    'Delete reading?':'O‘lchov o‘chirilsinmi?','All saved readings will be deleted. An automatic backup has already been created.':'Barcha saqlangan o‘lchovlar o‘chiriladi. Avtomatik zaxira nusxa yaratildi.',
    'This reading cannot be restored without a backup. An automatic backup has already been created.':'Bu o‘lchovni zaxira nusxasiz tiklab bo‘lmaydi. Avtomatik zaxira nusxa yaratildi.',
    'Say: systolic, diastolic, pulse':'Ayting: sistolik, diastolik, puls','bpm':'ur/min','sessions':'seans','mmHg':'mm sim. ust.',
    'SD (sample)':'SD (namuna)','auto':'avto'
  };
  function translateUzText(value){
    if(!uz())return String(value??'');
    let text=String(value??''),trimmed=text.trim();
    if(UZ_MOBILE_TEXT[trimmed])return text.replace(trimmed,UZ_MOBILE_TEXT[trimmed]);
    const rules=[
      [/^All metrics\s*\((\d+)\)$/i,'Barcha ko‘rsatkichlar ($1)'],
      [/^Shown:\s*(\d+)\s*\/\s*(\d+)$/i,'Ko‘rsatilgan: $1 / $2'],
      [/^Pulse\s+(\d+)$/i,'Puls $1'],
      [/^Reading\s+(\d+)$/i,'O‘lchov $1'],
      [/^Archive period:\s*(.+)$/i,'Arxiv davri: $1'],
      [/^Backup saved:\s*(.+)$/i,'Zaxira nusxa saqlandi: $1'],
      [/^Reminder scheduled around\s*(.+)$/i,'Eslatma taxminan $1 ga belgilandi'],
      [/^Could not ([^:]+):\s*(.*)$/i,'Amal bajarilmadi: $1. $2'],
      [/^Voice input unavailable:\s*(.*)$/i,'Ovozli kiritish mavjud emas: $1'],
      [/^Pulse\s*$/i,'Puls']
    ];
    for(const [re,repl] of rules)if(re.test(trimmed))return text.replace(trimmed,trimmed.replace(re,repl));
    return text;
  }
  let uzLocalizationObserver=null;
  function localizeUzTree(root=document){
    if(!uz()||!root)return;
    const scope=root.nodeType===1||root.nodeType===9?root:document;
    try{
      const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode())){
        const raw=node.nodeValue||'',translated=translateUzText(raw);
        if(translated!==raw)node.nodeValue=translated;
      }
      qa('[aria-label],[title],[placeholder]',scope).forEach(el=>{
        ['aria-label','title','placeholder'].forEach(attr=>{
          const value=el.getAttribute(attr);if(!value)return;
          const translated=translateUzText(value);if(translated!==value)el.setAttribute(attr,translated);
        });
      });
    }catch(_){}
  }
  function syncUzLocalizationObserver(){
    if(!uz()){
      if(uzLocalizationObserver){uzLocalizationObserver.disconnect();uzLocalizationObserver=null}
      return;
    }
    localizeUzTree(document);
    if(uzLocalizationObserver)return;
    uzLocalizationObserver=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData'){localizeUzTree(record.target.parentElement||document);continue}
        record.addedNodes?.forEach(node=>{if(node.nodeType===1)localizeUzTree(node);else if(node.nodeType===3)localizeUzTree(node.parentElement||document)});
      }
    });
    if(document.body)uzLocalizationObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  const pages=()=>qa('#app > .card');
  const proxy=id=>q('#'+id)?.click();
  const APP_RELEASE='__BP_RELEASE__';
  const APP_VERSION='__BP_VERSION_NAME__';
  const APP_VERSION_CODE=Number('__BP_VERSION_CODE__');

  function nativeBridge(){return window.Capacitor?.Plugins?.NativeBridge||null}
  async function nativeCall(method,args={}){
    const p=nativeBridge();
    if(!p||typeof p[method]!=='function')throw new Error(l('Нативная функция недоступна','Native feature unavailable','Mahalliy Android funksiyasi mavjud emas'));
    return await p[method](args);
  }

  const mobileNativeAlert=window.alert.bind(window);
  function personalRangeLooksValid(){
    const valid=(a,b,c,d)=>[a,b,c,d].every(Number.isFinite)&&a>0&&b>0&&c>0&&d>0&&a<c&&b<d;
    const dom=[
      Number(q('#targetSysMin')?.value),
      Number(q('#targetDiaMin')?.value),
      Number(q('#targetSys')?.value),
      Number(q('#targetDia')?.value)
    ];
    if(valid(...dom))return true;
    try{
      const all=JSON.parse(localStorage.getItem('bp_patient_settings')||'{}');
      const id=q('#patientSelect')?.value||localStorage.getItem('bp_current_patient')||'default';
      const s=all?.[id]||all?.default;
      if(!s)return false;
      return valid(Number(s.targetSysMin),Number(s.targetDiaMin),Number(s.targetSys),Number(s.targetDia));
    }catch(_){return false}
  }
  window.alert=function(message){
    const text=String(message??'');
    const rangeWarning=/Минимальные границы персонального диапазона должны быть ниже максимальных|minimum.+personal.+range.+maximum|personal.+range.+minimum.+maximum/i.test(text);
    if(mq.matches&&rangeWarning&&personalRangeLooksValid())return;
    return mobileNativeAlert(message);
  };
  function syncMobileSheetState(){
    const anyOpen=qa('[role="dialog"].open').some(el=>el.id!=='mobileOnboarding');
    document.body?.classList.toggle('mobile-sheet-open',anyOpen);
  }
  function openMobileSheet(sheet,{historyEntry=true}={}){
    if(!sheet)return;
    localizeUzTree(sheet);
    if(!sheet.classList.contains('open')){
      sheet.dataset.bpHistoryEntry=historyEntry?'1':'0';
      sheet.classList.add('open');
      syncMobileSheetState();
      if(historyEntry){try{history.pushState({bpMobileSheet:sheet.id},'')}catch(_){}}
    }
  }
  function closeMobileSheet(sheet,fromHistory=false){
    if(!sheet)return;
    const wasOpen=sheet.classList.contains('open');
    sheet.classList.remove('open');
    syncMobileSheetState();
    if(wasOpen&&typeof sheet.__onDismiss==='function'){
      const fn=sheet.__onDismiss;sheet.__onDismiss=null;
      try{fn()}catch(_){}
    }
    const ownsHistory=sheet.dataset.bpHistoryEntry==='1';
    delete sheet.dataset.bpHistoryEntry;
    if(wasOpen&&!fromHistory&&ownsHistory&&history.state?.bpMobileSheet===sheet.id){try{history.back()}catch(_){}}
  }
  window.addEventListener('popstate',()=>{
    const open=qa('#mobileAnalyticsSheet.open,#mobileActionSheet.open,#mobileMeasureActionSheet.open,#mobileChoiceSheet.open,#mobilePdfSheet.open,#mobileAboutSheet.open,#mobileConfirmSheet.open,#mobileReportPeriodSheet.open,#mobileCustomPeriodSheet.open,#mobileAutoBackupSheet.open,#mobileReminderSheet.open,#mobileSettingsSheet.open,#mobileUpdateSheet.open,#mobileSecretSheet.open,#mobileGuideSheet.open')
      .filter(el=>el.dataset.bpHistoryEntry!=='0').at(-1);
    if(open)closeMobileSheet(open,true);
  });


  function svgIcon(name){
    const p={
      heart:'<path d="M12 21s-7-4.35-9.2-8.3C1.1 9.7 2.2 6 5.7 5.2 8 4.7 10 6 12 8c2-2 4-3.3 6.3-2.8 3.5.8 4.6 4.5 2.9 7.5C19 16.65 12 21 12 21Z"/><path d="M7.5 12h2l1.1-2.2 2.2 4.4 1.1-2.2h2.6"/>',
      moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
      sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
      stethoscope:'<path d="M5 3v6a4 4 0 0 0 8 0V3"/><path d="M3.5 3H7M11 3h3.5M9 13v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="11" r="2"/>',
      chart:'<path d="M4 19V5M4 19h16"/><path d="m7 15 3-3 3 2 5-6"/>',
      archive:'<path d="M4 7h16v13H4z"/><path d="M3 4h18v3H3zM9 11h6"/>',
      edit:'<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
      trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      eraser:'<path d="m4 15 7-7 5 5-7 7H5l-1-1v-4Z"/><path d="m14 11 3-3 3 3-3 3"/>',
      more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
      chevron:'<path d="m8 10 4 4 4-4"/>',
      arrowLeft:'<path d="M19 12H5M10 7l-5 5 5 5"/>',
      print:'<path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
      filter:'<path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>',
      reset:'<path d="M4 10a8 8 0 1 1 2 8"/><path d="M4 4v6h6"/>',
      save:'<path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v5h7V4M8 20v-7h8v7"/>',
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
      share:'<path d="M8 12 16 5M10 5h6v6"/><path d="M19 13v6H5V7h6"/>',
      mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 10a6 6 0 0 0 12 0M12 16v5M9 21h6"/>',
      volume:'<path d="M5 10h4l4-4v12l-4-4H5z"/><path d="M16 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
      folder:'<path d="M3 7h7l2 2h9v10H3z"/><path d="M3 7V5h7l2 2"/>',
      restore:'<path d="M4 10a8 8 0 1 1 2 8"/><path d="M4 4v6h6"/>',
      document:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
      portrait:'<rect x="7" y="3" width="10" height="18" rx="1"/><path d="M10 18h4"/>',
      landscape:'<rect x="3" y="7" width="18" height="10" rx="1"/><path d="M17 10v4"/>',
      bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 4 4"/>',
      close:'<path d="M6 6l12 12M18 6 6 18"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.31.7.6 1 .3.28.68.49 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7.6Z"/>',
      update:'<path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 4v7h-7"/>',
      lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/>',
      shield:'<path d="M12 3 5 6v5c0 4.8 2.7 8.2 7 10 4.3-1.8 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
      key:'<circle cx="8" cy="15" r="3"/><path d="m10.5 12.5 8-8M15 8l2 2M17 6l2 2"/>'

    }[name]||'';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
  }

  function mobileToast(message,type='info',duration=2700){
    if(!mq.matches){mobileNativeAlert(String(message||''));return}
    let host=q('#mobileToastHost');
    if(!host){host=document.createElement('div');host.id='mobileToastHost';host.setAttribute('aria-live','polite');document.body.appendChild(host)}
    const display=uz()?translateUzText(String(message||'')):String(message||'');
    const key=type+'|'+display;
    let item=qa('.mobile-toast',host).find(el=>el.dataset.bpToastKey===key);
    const armRemoval=el=>{
      clearTimeout(el.__bpToastHideTimer);clearTimeout(el.__bpToastRemoveTimer);
      el.__bpToastHideTimer=setTimeout(()=>{
        el.classList.remove('show');
        el.__bpToastRemoveTimer=setTimeout(()=>{if(el.isConnected)el.remove()},220);
      },duration);
    };
    if(item){
      item.classList.add('show');
      armRemoval(item);
      return item;
    }
    while(host.children.length>=3)host.firstElementChild?.remove();
    item=document.createElement('div');item.className='mobile-toast '+type;item.dataset.bpToastKey=key;
    const icon=type==='success'?'✓':type==='error'?'!':'i';
    item.innerHTML='<span class="mobile-toast-icon">'+icon+'</span><span class="mobile-toast-text"></span>';
    q('.mobile-toast-text',item).textContent=display;
    host.appendChild(item);
    requestAnimationFrame(()=>item.classList.add('show'));
    armRemoval(item);
    return item;
  }

  function mobileConfirm({title,message,confirmLabel,cancelLabel,danger=true}){
    return new Promise(resolve=>{
      const sheet=makeSheet('mobileConfirmSheet',title||'');
      q('.mobile-sheet-title',sheet).textContent=title||'';
      const grid=q('.mobile-sheet-grid',sheet);grid.innerHTML='';
      const text=document.createElement('div');text.className='mobile-confirm-copy';text.textContent=message||'';
      const actions=document.createElement('div');actions.className='mobile-confirm-actions';
      const cancel=document.createElement('button');cancel.type='button';cancel.className='outline';cancel.textContent=cancelLabel||(ru()?'Отмена':'Cancel');
      const ok=document.createElement('button');ok.type='button';ok.className=danger?'danger':'mobile-primary-confirm';ok.textContent=confirmLabel||(ru()?'Подтвердить':'Confirm');
      actions.append(cancel,ok);grid.append(text,actions);
      let settled=false;
      const finish=value=>{if(settled)return;settled=true;sheet.__onDismiss=null;closeMobileSheet(sheet);resolve(value)};
      sheet.__onDismiss=()=>{if(!settled){settled=true;resolve(false)}};
      cancel.onclick=()=>finish(false);ok.onclick=()=>finish(true);
      openMobileSheet(sheet);
    });
  }

  window.bpPreSaveSafetyAlert=function(warning){
    return new Promise(resolve=>{
      const sheet=makeSheet('mobileSafetyAlertSheet',warning?.title||l('Важное предупреждение','Important warning','Muhim ogohlantirish'));
      q('.mobile-sheet-title',sheet).innerHTML='<span>'+l('⚠ Важное медицинское предупреждение','⚠ Important medical warning','⚠ Muhim tibbiy ogohlantirish')+'</span>';
      const grid=q('.mobile-sheet-grid',sheet);grid.innerHTML='';
      const card=document.createElement('div');
      card.className='mobile-safety-card '+(warning?.level==='critical'?'critical':'warning');
      card.innerHTML='<div class="mobile-safety-icon">!</div><div class="mobile-safety-body"><strong></strong><b></b><p></p><small></small></div>';
      q('strong',card).textContent=warning?.title||'';
      q('b',card).textContent=warning?.value||'';
      q('p',card).textContent=warning?.message||'';
      q('small',card).textContent=l(
        'BP Diary не ставит диагноз. Это предупреждение безопасности перед сохранением записи.',
        'BP Diary does not diagnose. This is a safety warning shown before saving the reading.',
        'BP Diary tashxis qo‘ymaydi. Bu yozuvni saqlashdan oldingi xavfsizlik ogohlantirishidir.'
      );
      const actions=document.createElement('div');actions.className='mobile-safety-actions';
      const back=document.createElement('button');back.type='button';back.className='outline';
      back.textContent=l('Вернуться к измерению','Review reading','O‘lchovni tekshirish');
      const save=document.createElement('button');save.type='button';save.className='mobile-safety-save';
      save.textContent=l('Сохранить всё равно','Save anyway','Baribir saqlash');
      actions.append(back,save);grid.append(card,actions);
      let settled=false;
      const finish=value=>{if(settled)return;settled=true;sheet.__onDismiss=null;closeMobileSheet(sheet);resolve(value)};
      sheet.__onDismiss=()=>{if(!settled){settled=true;resolve(false)}};
      back.onclick=()=>finish(false);save.onclick=()=>finish(true);
      openMobileSheet(sheet);
    });
  };

  function polishControls(measure){
    const add=q('#addPatientBtn');if(add){add.innerHTML=svgIcon('plus')+'<span>'+(ru()?'Добавить':'Add')+'</span>';add.setAttribute('aria-label',ru()?'Добавить пациента':'Add patient')}
    const edit=q('#editPatientBtn');if(edit){edit.innerHTML=svgIcon('edit');edit.setAttribute('aria-label',ru()?'Изменить пациента':'Edit patient');edit.title=edit.getAttribute('aria-label')}
    const del=q('#delPatientBtn');if(del){del.innerHTML=svgIcon('trash');del.setAttribute('aria-label',ru()?'Удалить пациента':'Delete patient');del.title=del.getAttribute('aria-label')}
    const save=q('#saveBtn');if(save)save.innerHTML=svgIcon('save')+'<span>'+(ru()?'Сохранить':'Save')+'</span>';const avg=q('#scoreSysFromDiaryBtn');if(avg){avg.innerHTML=svgIcon('chart')+'<span>'+(ru()?'Среднее САД из дневника':'Diary SBP average')+'</span>'}
    const adv=q('.advanced-score summary',measure);if(adv){adv.textContent=ru()?'Ручной выбор региона':'Manual region';adv.title=ru()?'Ручной выбор региона (резервный режим)':'Manual region selection (fallback)'}
  }

  let analyticsMode='overview';try{analyticsMode=localStorage.getItem('bp_mobile_analytics_mode')||'overview'}catch(_){}
  function analyticsTabs(analysis){
    let tabs=q('#mobileAnalyticsTabs',analysis);
    if(!tabs){
      tabs=document.createElement('div');tabs.id='mobileAnalyticsTabs';
      const sub=q('.mobile-screen-subtitle',analysis);(sub||q('.card-header',analysis))?.after(tabs);
    }
    tabs.innerHTML='<button type="button" data-mode="overview">'+svgIcon('chart')+'<span>'+(ru()?'Обзор':'Overview')+'</span></button><button type="button" data-mode="charts">'+svgIcon('chart')+'<span>'+(ru()?'Графики':'Charts')+'</span></button>';
    tabs.onclick=e=>{
      const b=e.target.closest('[data-mode]');if(!b)return;
      analyticsMode=b.dataset.mode;
      try{localStorage.setItem('bp_mobile_analytics_mode',analyticsMode)}catch(_){}
      applyAnalyticsMode(analysis);
      if(analyticsMode==='charts')setTimeout(()=>refreshActiveChart(analysis,true),60);
      setTimeout(()=>analysis.scrollIntoView({block:'start',behavior:'smooth'}),0);
    };
    applyAnalyticsMode(analysis);
  }

  function applyAnalyticsMode(analysis){
    if(!['overview','charts'].includes(analyticsMode))analyticsMode='overview';
    analysis.classList.toggle('mobile-mode-overview',analyticsMode==='overview');
    analysis.classList.toggle('mobile-mode-charts',analyticsMode==='charts');
    qa('#mobileAnalyticsTabs [data-mode]',analysis).forEach(b=>{const active=b.dataset.mode===analyticsMode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
    if(analyticsMode==='charts')setTimeout(()=>refreshActiveChart(analysis,false),40);
  }

  let activeMobileChart='pressureChart';
  try{activeMobileChart=localStorage.getItem('bp_mobile_chart')||'pressureChart'}catch(_){}

  function analyticsChartSelector(analysis){
    const ids=['pressureChart','pulseChart','tempWeightChart','timeOfDayChart','weekdayChart'];
    if(!ids.includes(activeMobileChart))activeMobileChart='pressureChart';
    let selector=q('#mobileChartSelector',analysis);
    if(!selector){
      selector=document.createElement('div');selector.id='mobileChartSelector';
      const stats=q('.stats-bar',analysis);
      (stats||q('#mobileAnalyticsTabs',analysis))?.after(selector);
    }
    const names=ru()?{
      pressureChart:'АД',pulseChart:'Пульс',tempWeightChart:'Темп./вес',timeOfDayChart:'Время суток',weekdayChart:'Дни недели'
    }:uz()?{
      pressureChart:'QB',pulseChart:'Puls',tempWeightChart:'Harorat/vazn',timeOfDayChart:'Kun vaqti',weekdayChart:'Hafta kunlari'
    }:{
      pressureChart:'BP',pulseChart:'Pulse',tempWeightChart:'Temp/weight',timeOfDayChart:'Day time',weekdayChart:'Weekdays'
    };
    selector.innerHTML=ids.map(id=>'<button type="button" data-chart="'+id+'">'+names[id]+'</button>').join('');
    selector.onclick=e=>{
      const b=e.target.closest('[data-chart]');if(!b)return;
      activeMobileChart=b.dataset.chart;
      try{localStorage.setItem('bp_mobile_chart',activeMobileChart)}catch(_){}
      applyChartSelection(analysis);
      renderMobileNativeChart(analysis);
    };
    let panel=q('#mobileNativeChartPanel',analysis);
    if(!panel){
      panel=document.createElement('section');panel.id='mobileNativeChartPanel';
      selector.after(panel);
    }
    applyChartSelection(analysis);
  }

  function applyChartSelection(analysis){
    qa('#mobileChartSelector [data-chart]',analysis).forEach(b=>{const active=b.dataset.chart===activeMobileChart;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  }

  function mobileFilteredRecords(){
    try{
      if(typeof window.getFilteredRecords==='function'){
        const arr=window.getFilteredRecords();
        return Array.isArray(arr)?arr:[];
      }
    }catch(_){}
    return [];
  }

  function mobileRecordAverage(rec){
    try{
      if(typeof window.computeGlobalAverage==='function')return window.computeGlobalAverage(rec.measures);
    }catch(_){}
    const vals=[];
    (rec?.measures||[]).forEach(m=>{
      ['left','right'].forEach(side=>{
        const x=m?.[side]||{};
        if(Number(x.sys)>0&&Number(x.dia)>0)vals.push({sys:Number(x.sys),dia:Number(x.dia),pulse:Number(x.pulse)||0});
      });
    });
    if(!vals.length)return{sys:0,dia:0,pulse:0};
    return{
      sys:vals.reduce((s,x)=>s+x.sys,0)/vals.length,
      dia:vals.reduce((s,x)=>s+x.dia,0)/vals.length,
      pulse:vals.filter(x=>x.pulse>0).length?vals.filter(x=>x.pulse>0).reduce((s,x)=>s+x.pulse,0)/vals.filter(x=>x.pulse>0).length:0
    };
  }

  function mobileDateLabel(rec){
    try{if(typeof window.formatDate==='function')return window.formatDate(rec.date)+' '+String(rec.time||'').slice(0,5)}catch(_){}
    return String(rec.date||'')+' '+String(rec.time||'').slice(0,5);
  }

  function svgEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function mobileLineSvg(series,labels,unit,height=220){
    const W=360,H=height,L=43,R=10,T=16,B=34,PW=W-L-R,PH=H-T-B;
    const all=series.flatMap(s=>s.values).filter(v=>Number.isFinite(v)&&v>0);
    if(!all.length)return '';
    let min=Math.min(...all),max=Math.max(...all);
    const pad=Math.max(5,(max-min)*.18||10);
    min=Math.floor((min-pad)/5)*5;max=Math.ceil((max+pad)/5)*5;
    if(max<=min)max=min+20;
    const x=i=>labels.length<=1?L+PW/2:L+(i/(labels.length-1))*PW;
    const y=v=>T+PH-((v-min)/(max-min))*PH;
    const grid=[0,.25,.5,.75,1].map(f=>{
      const yy=T+PH*f,val=Math.round(max-(max-min)*f);
      return '<line x1="'+L+'" y1="'+yy+'" x2="'+(W-R)+'" y2="'+yy+'" class="mchart-grid"/><text x="'+(L-6)+'" y="'+(yy+3)+'" text-anchor="end" class="mchart-axis">'+val+'</text>';
    }).join('');
    const paths=series.map((s,si)=>{
      const pts=s.values.map((v,i)=>Number.isFinite(v)&&v>0?[x(i),y(v)]:null);
      const segments=[];let cur=[];
      pts.forEach(p=>{if(p)cur.push(p);else if(cur.length){segments.push(cur);cur=[]}});if(cur.length)segments.push(cur);
      const lines=segments.map(seg=>seg.length===1?'':('<polyline points="'+seg.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" class="mchart-line mchart-series-'+si+'"/>')).join('');
      const dots=pts.filter(Boolean).map(p=>'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3" class="mchart-dot mchart-series-'+si+'"/>').join('');
      return lines+dots;
    }).join('');
    const first=labels[0]||'',last=labels[labels.length-1]||'';
    const xlabels=labels.length===1
      ?'<text x="'+(L+PW/2)+'" y="'+(H-8)+'" text-anchor="middle" class="mchart-axis">'+svgEsc(first)+'</text>'
      :'<text x="'+L+'" y="'+(H-8)+'" text-anchor="start" class="mchart-axis">'+svgEsc(first)+'</text><text x="'+(W-R)+'" y="'+(H-8)+'" text-anchor="end" class="mchart-axis">'+svgEsc(last)+'</text>';
    return '<svg class="mobile-native-svg" viewBox="0 0 '+W+' '+H+'" role="img"><text x="8" y="12" class="mchart-unit">'+svgEsc(unit)+'</text>'+grid+paths+xlabels+'</svg>';
  }

  function mobileBarSvg(values,labels,unit){
    const W=360,H=220,L=43,R=10,T=18,B=42,PW=W-L-R,PH=H-T-B;
    const valid=values.filter(v=>Number.isFinite(v)&&v>0);
    if(!valid.length)return '';
    const max=Math.ceil((Math.max(...valid)*1.15)/10)*10||10;
    const step=PW/Math.max(values.length,1),bw=Math.min(32,step*.58);
    const grid=[0,.25,.5,.75,1].map(f=>{
      const yy=T+PH*f,val=Math.round(max*(1-f));
      return '<line x1="'+L+'" y1="'+yy+'" x2="'+(W-R)+'" y2="'+yy+'" class="mchart-grid"/><text x="'+(L-6)+'" y="'+(yy+3)+'" text-anchor="end" class="mchart-axis">'+val+'</text>';
    }).join('');
    const bars=values.map((v,i)=>{
      const n=Number(v)||0,h=n>0?(n/max)*PH:0,xx=L+step*i+(step-bw)/2,yy=T+PH-h;
      const label=labels[i]||'';
      return '<rect x="'+xx.toFixed(1)+'" y="'+yy.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="5" class="mchart-bar"/><text x="'+(xx+bw/2).toFixed(1)+'" y="'+(H-17)+'" text-anchor="middle" class="mchart-axis">'+svgEsc(label)+'</text>';
    }).join('');
    return '<svg class="mobile-native-svg" viewBox="0 0 '+W+' '+H+'" role="img"><text x="8" y="12" class="mchart-unit">'+svgEsc(unit)+'</text>'+grid+bars+'</svg>';
  }

  function mobileNoChartData(title,msg){
    return '<div class="mobile-native-chart-head"><strong>'+svgEsc(title)+'</strong></div><div class="mobile-native-chart-empty">'+svgIcon('chart')+'<span>'+svgEsc(msg)+'</span></div>';
  }

  function renderMobileNativeChart(analysis){
    const host=q('#mobileNativeChartPanel',analysis);if(!host)return;
    const records=mobileFilteredRecords().slice().sort((a,b)=>String(a.date+a.time).localeCompare(String(b.date+b.time)));
    if(!records.length){
      host.innerHTML=mobileNoChartData(l('Графики','Charts','Grafiklar'),l('Нет данных для выбранного периода','No data for the selected period','Tanlangan davr uchun ma’lumot yo‘q'));
      return;
    }
    const labels=records.map(mobileDateLabel);
    const avgs=records.map(mobileRecordAverage);
    const titleMap=ru()?{
      pressureChart:'Динамика давления',pulseChart:'Динамика пульса',tempWeightChart:'Температура и вес',timeOfDayChart:'Среднее по времени суток',weekdayChart:'Среднее по дням недели'
    }:uz()?{
      pressureChart:'Qon bosimi dinamikasi',pulseChart:'Puls dinamikasi',tempWeightChart:'Harorat va vazn',timeOfDayChart:'Kun vaqti bo‘yicha o‘rtacha',weekdayChart:'Hafta kunlari bo‘yicha o‘rtacha'
    }:{
      pressureChart:'Blood pressure trend',pulseChart:'Pulse trend',tempWeightChart:'Temperature and weight',timeOfDayChart:'Average by time of day',weekdayChart:'Average by weekday'
    };
    const no=l('Недостаточно данных для этого графика','Not enough data for this chart','Bu grafik uchun ma’lumot yetarli emas');
    let body='',legend='';
    if(activeMobileChart==='pressureChart'){
      const sys=avgs.map(a=>Number(a.sys)||0),dia=avgs.map(a=>Number(a.dia)||0);
      body=mobileLineSvg([{values:sys},{values:dia}],labels,l('мм рт. ст.','mmHg','mm sim. ust.'));
      legend='<div class="mobile-native-legend"><span><i class="mchart-legend-0"></i>'+l('САД','SYS','SAB')+'</span><span><i class="mchart-legend-1"></i>'+l('ДАД','DIA','DAB')+'</span></div>';
    }else if(activeMobileChart==='pulseChart'){
      body=mobileLineSvg([{values:avgs.map(a=>Number(a.pulse)||0)}],labels,l('уд/мин','bpm','ur/min'));
    }else if(activeMobileChart==='tempWeightChart'){
      const temp=records.map(r=>Number(r.temperature)||0),weight=records.map(r=>Number(r.weight)||0);
      const tempSvg=mobileLineSvg([{values:temp}],labels,'°C',128);
      const weightSvg=mobileLineSvg([{values:weight}],labels,l('кг','kg','kg'),128);
      if(tempSvg||weightSvg)body='<div class="mobile-dual-charts">'+(tempSvg?'<div><small>'+l('Температура','Temperature','Harorat')+'</small>'+tempSvg+'</div>':'')+(weightSvg?'<div><small>'+l('Вес','Weight','Vazn')+'</small>'+weightSvg+'</div>':'')+'</div>';
    }else if(activeMobileChart==='timeOfDayChart'){
      const buckets=[[],[],[]];
      records.forEach((r,i)=>{const h=parseInt(String(r.time||'0').slice(0,2),10)||0;const v=Number(avgs[i].sys)||0;if(v>0)buckets[h<12?0:h<18?1:2].push(v)});
      const vals=buckets.map(a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0);
      body=mobileBarSvg(vals,ru()?['Утро','День','Вечер']:uz()?['Ertalab','Kunduz','Kechqurun']:['AM','Day','PM'],l('мм рт. ст.','mmHg','mm sim. ust.'));
    }else if(activeMobileChart==='weekdayChart'){
      const sums=Array(7).fill(0),cnt=Array(7).fill(0);
      records.forEach((r,i)=>{const d=new Date(String(r.date)+'T12:00:00');if(Number.isNaN(d.getTime()))return;const k=(d.getDay()+6)%7,v=Number(avgs[i].sys)||0;if(v>0){sums[k]+=v;cnt[k]++}});
      const vals=sums.map((s,i)=>cnt[i]?s/cnt[i]:0);
      body=mobileBarSvg(vals,ru()?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:uz()?['Du','Se','Ch','Pa','Ju','Sh','Ya']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],l('мм рт. ст.','mmHg','mm sim. ust.'));
    }
    if(!body){host.innerHTML=mobileNoChartData(titleMap[activeMobileChart]||'',no);return}
    host.innerHTML='<div class="mobile-native-chart-head"><strong>'+svgEsc(titleMap[activeMobileChart]||'')+'</strong><span>'+records.length+' '+l('сеанс.','sessions','seans')+'</span></div>'+legend+body;
  }

  function refreshActiveChart(analysis){
    if(!analysis||analyticsMode!=='charts')return;
    requestAnimationFrame(()=>renderMobileNativeChart(analysis));
  }

  function analyticsMoreSheet(analysis,cards){
    const extras=cards.slice(6);
    let btn=q('#mobileAnalyticsToggle',analysis);
    if(!extras.length){btn?.remove();return}
    if(!btn){
      btn=document.createElement('button');btn.id='mobileAnalyticsToggle';btn.type='button';btn.className='outline mobile-analytics-toggle';
      q('#proAnalysis',analysis)?.appendChild(btn);
    }
    btn.textContent=ru()?('Все показатели ('+cards.length+')'):('All metrics ('+cards.length+')');
    btn.onclick=()=>{
      const sheet=makeSheet('mobileAnalyticsSheet',ru()?'Все показатели':'All metrics');
      q('.mobile-sheet-title',sheet).textContent=ru()?'Все показатели':'All metrics';
      const grid=q('.mobile-sheet-grid',sheet);grid.innerHTML='';
      extras.forEach(card=>{
        const clone=card.cloneNode(true);
        clone.classList.remove('mobile-analytics-extra','mobile-wide');
        grid.appendChild(clone);
      });
      openMobileSheet(sheet);
    };
  }

  let reportArmed=false,nativeWindowOpen=null,reportNextAction='view';
  function cleanReportHtml(html){return String(html||'').replace(/<script>[\s\S]*?window\.print\([\s\S]*?<\/script>/i,'')}
  function orientedReportHtml(html,orientation){
    const clean=cleanReportHtml(html),portrait=orientation==='portrait';
    const css=portrait
      ?'<style id="mobilePrintOrientation">@page{size:A4 portrait;margin:8mm}html,body{background:#fff!important;color:#111!important}body{font-size:8.4pt}.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.kpi:last-child{grid-column:1/-1}.overview{grid-template-columns:repeat(2,minmax(0,1fr))}.overview>div{border-right:1px solid #ddd!important;border-bottom:1px solid #ddd!important}.overview>div:nth-child(2n){border-right:none!important}.overview .wide{grid-column:1/-1!important;border-right:none!important}table.data{font-size:5.8pt}table.data th,table.data td{padding:2px}</style>'
      :'<style id="mobilePrintOrientation">@page{size:A4 landscape;margin:8mm}html,body{background:#fff!important;color:#111!important}</style>';
    return clean.includes('</head>')?clean.replace('</head>',css+'</head>'):css+clean;
  }
  function installReportBridge(){
    if(window.__bpMobileReportBridge)return;window.__bpMobileReportBridge=true;nativeWindowOpen=window.open.bind(window);
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#reportDoctorBtn')){
        reportArmed=true;
        clearTimeout(window.__bpReportArmTimer);
        window.__bpReportArmTimer=setTimeout(()=>{reportArmed=false},3000);
      }
    },true);
    window.open=function(url,target,features){
      if(mq.matches&&reportArmed&&String(url||'')===''&&String(target||'')==='_blank'){
        let html='';return{document:{write(chunk){html+=String(chunk||'')},close(){
          const action=reportNextAction;reportNextAction='view';reportArmed=false;
          clearTimeout(window.__bpReportArmTimer);
          if(action==='share')shareDoctorReportHtml(html);else showMobileReport(html)
        }},close(){}};
      }
      return nativeWindowOpen(url,target,features);
    };
  }
  async function openPdfSaveSheet(clean){
    try{
      const date=new Date().toISOString().slice(0,10);
      await nativeCall('printHtml',{
        html:orientedReportHtml(clean,'landscape'),
        orientation:'landscape',
        jobName:'BP-Diary-Doctor-Report-'+date
      });
    }catch(err){
      mobileToast(l('Не удалось открыть сохранение PDF: ','Could not open PDF save: ','PDF saqlashni ochib bo‘lmadi: ')+(err?.message||err),'error',4200);
    }
  }

  function showMobileReport(html){
    const clean=cleanReportHtml(html);
    let v=q('#mobileReportViewer');
    if(!v){
      v=document.createElement('div');v.id='mobileReportViewer';v.className='mobile-report-viewer';
      v.innerHTML='<div class="mobile-report-topbar"><button type="button" class="outline mobile-report-close"></button><div class="mobile-report-heading"><strong></strong><span></span></div></div><div class="mobile-report-frame"><iframe title="Doctor report"></iframe></div><div class="mobile-report-actions"><button type="button" class="outline mobile-report-print-now"></button><button type="button" class="outline mobile-report-save"></button><button type="button" class="mobile-report-share-now"></button></div>';
      document.body.appendChild(v);
    }
    q('.mobile-report-close',v).innerHTML=svgIcon('arrowLeft');
    q('.mobile-report-close',v).setAttribute('aria-label',l('Назад','Back','Orqaga'));
    q('.mobile-report-heading strong',v).textContent=l('Отчёт для врача','Doctor report','Shifokor uchun hisobot');
    q('.mobile-report-heading span',v).textContent=l('Просмотр и экспорт','Preview & export','Ko‘rish va eksport');
    q('.mobile-report-print-now',v).innerHTML=svgIcon('print')+'<span>'+l('Печать','Print','Chop etish')+'</span>';
    q('.mobile-report-save',v).innerHTML=svgIcon('document')+'<span>'+l('Сохранить PDF','Save PDF','PDF saqlash')+'</span>';
    q('.mobile-report-share-now',v).innerHTML=svgIcon('share')+'<span>'+l('Поделиться','Share','Ulashish')+'</span>';
    const frame=q('iframe',v);frame.srcdoc=clean;v.classList.add('open');
    q('.mobile-report-close',v).onclick=()=>v.classList.remove('open');
    q('.mobile-report-print-now',v).onclick=async()=>{
      try{
        const date=new Date().toISOString().slice(0,10);
        await nativeCall('printHtml',{html:orientedReportHtml(clean,'landscape'),orientation:'landscape',jobName:'BP-Diary-Doctor-Report-'+date});
      }catch(err){mobileToast(l('Не удалось открыть печать: ','Could not open print: ','Chop etishni ochib bo‘lmadi: ')+(err?.message||err),'error',4200)}
    };
    q('.mobile-report-save',v).onclick=()=>openPdfSaveSheet(clean);
    q('.mobile-report-share-now',v).onclick=()=>shareDoctorReportHtml(clean);
  }

  function bytesToBase64(bytes){
    let out='',step=0x8000;
    for(let i=0;i<bytes.length;i+=step)out+=String.fromCharCode(...bytes.subarray(i,Math.min(i+step,bytes.length)));
    return btoa(out);
  }
  async function reportPdfBase64(html){
    if(typeof window.html2canvas!=='function'||!window.jspdf?.jsPDF)throw new Error(ru()?'Модуль PDF не загружен':'PDF module is not loaded');
    const frame=document.createElement('iframe');
    frame.setAttribute('aria-hidden','true');
    frame.style.cssText='position:fixed;left:-12000px;top:0;width:1123px;height:794px;border:0;opacity:.01;pointer-events:none;background:#fff;z-index:-1';
    document.body.appendChild(frame);
    try{
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(new Error(ru()?'Тайм-аут подготовки отчёта':'Report rendering timeout')),5000);
        frame.onload=()=>{clearTimeout(timeout);resolve()};
        frame.srcdoc=orientedReportHtml(html,'landscape');
      });
      const doc=frame.contentDocument;
      if(!doc?.documentElement||!doc.body)throw new Error(ru()?'Не удалось подготовить страницу отчёта':'Could not prepare report page');
      try{await doc.fonts?.ready}catch(_){}
      await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,120)));
      doc.documentElement.style.background='#fff';
      doc.body.style.background='#fff';
      doc.body.style.color='#111';
      const width=Math.max(1123,doc.documentElement.scrollWidth,doc.body.scrollWidth);
      const height=Math.max(794,doc.documentElement.scrollHeight,doc.body.scrollHeight);
      frame.style.width=width+'px';frame.style.height=height+'px';
      const canvas=await window.html2canvas(doc.documentElement,{
        backgroundColor:'#ffffff',
        scale:2,
        logging:false,
        useCORS:false,
        scrollX:0,
        scrollY:0,
        width,
        height,
        windowWidth:width,
        windowHeight:height
      });
      if(!canvas.width||!canvas.height)throw new Error(ru()?'PDF получился пустым':'Generated PDF is empty');
      const {jsPDF}=window.jspdf;
      const pdf=new jsPDF({orientation:'landscape',unit:'pt',format:'a4',compress:true});
      const pageW=pdf.internal.pageSize.getWidth(),pageH=pdf.internal.pageSize.getHeight(),margin=24;
      const targetW=pageW-margin*2,scale=targetW/canvas.width;
      const sourcePageHeight=Math.max(1,Math.floor((pageH-margin*2)/scale));
      let page=0;
      for(let y=0;y<canvas.height;y+=sourcePageHeight){
        const h=Math.min(sourcePageHeight,canvas.height-y);
        const slice=document.createElement('canvas');slice.width=canvas.width;slice.height=h;
        const ctx=slice.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,slice.width,slice.height);
        ctx.drawImage(canvas,0,y,canvas.width,h,0,0,canvas.width,h);
        if(page++)pdf.addPage('a4','landscape');
        pdf.addImage(slice.toDataURL('image/png'),'PNG',margin,margin,targetW,h*scale,undefined,'FAST');
      }
      const bytes=new Uint8Array(pdf.output('arraybuffer'));
      if(bytes.length<1000)throw new Error(ru()?'PDF получился пустым':'Generated PDF is empty');
      return bytesToBase64(bytes);
    }finally{frame.remove()}
  }
  async function shareDoctorReportHtml(html){
    try{
      const base64=await reportPdfBase64(html);
      const date=new Date().toISOString().slice(0,10);
      await nativeCall('sharePdfBase64',{base64,fileName:'BP-Diary-Doctor-Report-'+date+'.pdf',title:ru()?'Поделиться отчётом врача':'Share doctor report'});
      mobileToast(ru()?'Отчёт PDF готов к отправке':'PDF report is ready to share','success',2200);
    }catch(err){mobileToast((ru()?'Не удалось поделиться отчётом: ':'Could not share report: ')+(err?.message||err),'error',4300)}
  }
  function requestShareDoctorReport(){
    if(!nativeBridge()){mobileToast(ru()?'Нативная функция недоступна':'Native feature unavailable','error');return}
    if(!q('#reportDoctorBtn')){mobileToast(ru()?'Отчёт врача недоступен':'Doctor report unavailable','error');return}
    openReportPeriodSheet('share');
  }


  function makeSheet(id,title){
    let s=q('#'+id);
    if(!s){
      s=document.createElement('div');s.id=id;s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');
      s.innerHTML='<div class="mobile-sheet-panel" tabindex="-1"><div class="mobile-sheet-handle" aria-hidden="true"></div><div class="mobile-sheet-title"></div><div class="mobile-sheet-grid"></div></div>';
      document.body.appendChild(s);s.addEventListener('click',e=>{if(e.target===s)closeMobileSheet(s)});
    }
    const titleEl=q('.mobile-sheet-title',s);titleEl.textContent=title;titleEl.id=id+'Title';s.setAttribute('aria-labelledby',titleEl.id);
    return s;
  }

  function semverParts(value){
    const m=String(value||'').match(/(\d+)\.(\d+)\.(\d+)/);
    return m?[Number(m[1]),Number(m[2]),Number(m[3])]:[0,0,0];
  }
  function isNewerVersion(latest,current=APP_VERSION){
    const a=semverParts(latest),b=semverParts(current);
    for(let i=0;i<3;i++){if(a[i]>b[i])return true;if(a[i]<b[i])return false}
    return false;
  }
  function showUpdateSheet(info){
    const sheet=makeSheet('mobileUpdateSheet',ru()?'Обновление BP Diary':'BP Diary update');
    const title=q('.mobile-sheet-title',sheet);
    title.innerHTML='<span>'+(ru()?'Обновление':'Update')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+(ru()?'Закрыть':'Close')+'">×</button>';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
    const latest=String(info?.tag||info?.versionName||'').replace(/^v/i,'')||'—';
    const newer=isNewerVersion(latest);
    const card=document.createElement('section');card.className='mobile-update-card '+(newer?'available':'current');
    card.innerHTML='<div class="mobile-update-icon">'+svgIcon(newer?'update':'heart')+'</div>'+
      '<div><small>'+(ru()?'Установлено':'Installed')+'</small><strong>'+APP_VERSION+' · '+APP_RELEASE+'</strong></div>'+
      '<div><small>'+(ru()?'Последний релиз':'Latest release')+'</small><strong>'+latest+'</strong></div>'+
      '<p>'+(newer?(ru()?'Доступна более новая версия. Обновление устанавливается только по вашему выбору.':'A newer version is available. Installation only starts when you choose it.'):(ru()?'У вас установлена актуальная версия.':'You are running the current version.'))+'</p>';
    g.appendChild(card);
    if(newer){
      const open=document.createElement('button');open.type='button';open.className='mobile-settings-primary';
      open.innerHTML=svgIcon('update')+'<span>'+(ru()?'Открыть официальный релиз':'Open official release')+'</span>';
      open.onclick=async()=>{try{await nativeCall('openUrl',{url:info.htmlUrl||info.apkUrl})}catch(err){mobileToast(ru()?'Не удалось открыть релиз':'Could not open release','error')}};
      g.appendChild(open);
    }
    const done=document.createElement('button');done.type='button';done.className='outline';done.textContent=ru()?'Готово':'Done';done.onclick=()=>closeMobileSheet(sheet);g.appendChild(done);
    q('.mobile-sheet-close',sheet).onclick=()=>closeMobileSheet(sheet);
    openMobileSheet(sheet);
  }
  async function checkForUpdates({quiet=false}={}){
    if(!nativeBridge()||typeof nativeBridge().checkForUpdate!=='function'){
      if(!quiet)mobileToast(ru()?'Проверка обновлений доступна только в Android-приложении':'Update checks are available in the Android app','error');
      return null;
    }
    try{
      if(!quiet)mobileToast(ru()?'Проверяю обновления…':'Checking for updates…','info',1400);
      const info=await nativeCall('checkForUpdate',{});
      if(!quiet)showUpdateSheet(info);
      return info;
    }catch(err){
      if(!quiet)mobileToast((ru()?'Не удалось проверить обновления: ':'Could not check for updates: ')+(err?.message||err),'error',4200);
      return null;
    }
  }

  async function migrateLegacyReminderToNative(){
    if(!nativeBridge()||typeof nativeBridge().scheduleDailyReminder!=='function')return false;
    let legacy='',done=false;
    try{legacy=localStorage.getItem('bp_reminder_time')||'';done=localStorage.getItem('bp_v16_reminder_migrated')==='1'}catch(_){}
    if(done||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(legacy))return false;
    try{
      const status=await nativeCall('getReminderStatus',{});
      if(!status?.enabled){
        await nativeCall('scheduleDailyReminder',{time:legacy,title:'BP Diary',body:ru()?'Пора измерить артериальное давление':'Time to measure your blood pressure'});
      }
      try{
        localStorage.removeItem('bp_reminder_time');
        localStorage.setItem('bp_v16_reminder_migrated','1');
        sessionStorage.setItem('bp_v16_reminder_migrated_now','1');
      }catch(_){}
      return true;
    }catch(_){return false}
  }

  async function reminderStatus(){
    if(!nativeBridge()||typeof nativeBridge().getReminderStatus!=='function'){
      return {enabled:false,time:localStorage.getItem('bp_reminder_time')||'09:00',notificationsAllowed:false,native:false};
    }
    try{return {...await nativeCall('getReminderStatus',{}),native:true}}catch(_){return {enabled:false,time:'09:00',notificationsAllowed:false,native:true}}
  }
  async function showReminderSheet(){
    if(!nativeBridge()||typeof nativeBridge().scheduleDailyReminder!=='function'){
      const legacy=q('#reminderBtn');if(legacy){legacy.click();return}
      mobileToast(l('Напоминание недоступно','Reminder unavailable','Eslatma mavjud emas'),'error');return;
    }
    const sheet=makeSheet('mobileReminderSheet',l('Напоминания','Reminders','Eslatmalar'));
    q('.mobile-sheet-title',sheet).innerHTML='<span>'+l('Напоминания об измерении','Measurement reminders','O‘lchov eslatmalari')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='<div class="mobile-settings-loading">'+l('Загрузка…','Loading…','Yuklanmoqda…')+'</div>';
    openMobileSheet(sheet);q('.mobile-sheet-close',sheet).onclick=()=>closeMobileSheet(sheet);
    const status=await reminderStatus();
    g.innerHTML='';

    const card=document.createElement('section');card.className='mobile-reminder-card';
    card.innerHTML='<div class="mobile-reminder-bell">'+svgIcon('bell')+'</div><div><strong>'+l('Контроль давления','Blood pressure check','Qon bosimini nazorat qilish')+'</strong><p>'+l(
      'Задайте до трёх времён в день. Если первый сигнал пропущен, BP Diary может повторить его ещё 1–2 раза с выбранным интервалом.',
      'Set up to three daily times. If the first alert is missed, BP Diary can repeat it 1–2 more times at the selected interval.',
      'Kuniga uch vaqtgacha belgilang. Birinchi signal o‘tkazib yuborilsa, BP Diary tanlangan interval bilan yana 1–2 marta takrorlashi mumkin.'
    )+'</p></div>';
    g.appendChild(card);

    let times=String(status.times||status.time||'09:00').split(',').map(x=>x.trim()).filter(x=>/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(x)).slice(0,3);
    if(!times.length)times=['09:00'];
    while(times.length<3)times.push('');

    const timesWrap=document.createElement('div');timesWrap.className='mobile-reminder-times';
    timesWrap.innerHTML=times.map((time,index)=>'<label class="mobile-reminder-time-row"><span>'+l('Время '+(index+1),'Time '+(index+1),(index+1)+'-vaqt')+'</span><input type="time" data-reminder-time="'+index+'" value="'+time+'"></label>').join('');
    g.appendChild(timesWrap);

    const options=document.createElement('div');options.className='mobile-reminder-options';
    const repeatCount=Math.max(1,Math.min(3,Number(status.repeatCount)||1));
    const repeatInterval=[5,10,15,30].includes(Number(status.repeatInterval))?Number(status.repeatInterval):10;
    const sound=[1,2,3].includes(Number(status.sound))?Number(status.sound):2;
    options.innerHTML=
      '<label><span>'+l('Сигналов','Alerts','Signallar')+'</span><select id="mobileReminderRepeats">'+
        [1,2,3].map(n=>'<option value="'+n+'" '+(n===repeatCount?'selected':'')+'>'+n+'</option>').join('')+
      '</select></label>'+
      '<label><span>'+l('Интервал','Interval','Interval')+'</span><select id="mobileReminderInterval">'+
        [5,10,15,30].map(n=>'<option value="'+n+'" '+(n===repeatInterval?'selected':'')+'>'+n+' '+l('мин','min','daq')+'</option>').join('')+
      '</select></label>'+
      '<label><span>'+l('Мелодия','Sound','Ovoz')+'</span><select id="mobileReminderSound">'+
        '<option value="1" '+(sound===1?'selected':'')+'>'+l('1 · Мягкий системный','1 · System notification','1 · Tizim bildirishnomasi')+'</option>'+
        '<option value="2" '+(sound===2?'selected':'')+'>'+l('2 · Будильник','2 · Alarm','2 · Budilnik')+'</option>'+
        '<option value="3" '+(sound===3?'selected':'')+'>'+l('3 · Звонок','3 · Ringtone','3 · Qo‘ng‘iroq')+'</option>'+
      '</select></label>'+
      '<label class="mobile-reminder-vibrate"><input type="checkbox" id="mobileReminderVibrate" '+(status.vibrate===false?'':'checked')+'><span>'+l('Вибрация','Vibration','Vibratsiya')+'</span></label>';
    g.appendChild(options);

    const test=document.createElement('button');test.type='button';test.className='outline mobile-reminder-test';
    test.innerHTML=svgIcon('bell')+'<span>'+l('Проверить звук','Test sound','Ovozni tekshirish')+'</span>';
    test.onclick=async()=>{
      if(test.dataset.bpBusy==='1')return;
      const sound=String(q('#mobileReminderSound',sheet)?.value||'2');
      const vibrate=!!q('#mobileReminderVibrate',sheet)?.checked;
      test.dataset.bpBusy='1';test.disabled=true;test.setAttribute('aria-busy','true');
      try{
        const res=await nativeCall('testReminderSound',{sound,vibrate});
        if(res?.notificationsAllowed===false)mobileToast(l('Сначала разрешите уведомления Android','Allow Android notifications first','Avval Android bildirishnomalariga ruxsat bering'),'info',3200);
        else mobileToast(l('Тестовый сигнал отправлен','Test alert sent','Sinov signali yuborildi'),'success',1800);
      }catch(err){mobileToast(l('Не удалось проверить звук','Could not test sound','Ovozni tekshirib bo‘lmadi'),'error')}
      finally{
        setTimeout(()=>{test.disabled=false;delete test.dataset.bpBusy;test.removeAttribute('aria-busy')},900);
      }
    };
    g.appendChild(test);

    const perm=document.createElement('div');perm.className='mobile-settings-status '+(status.notificationsAllowed?'ok':'warn');
    perm.innerHTML='<span>'+(status.notificationsAllowed?'✓':'!')+'</span><div><b>'+(status.notificationsAllowed?l('Уведомления разрешены','Notifications allowed','Bildirishnomalarga ruxsat berilgan'):l('Нужно разрешение на уведомления','Notification permission required','Bildirishnoma ruxsati kerak'))+'</b><small>'+(status.enabled?l('Напоминания включены','Reminders enabled','Eslatmalar yoqilgan'):l('Напоминания выключены','Reminders disabled','Eslatmalar o‘chirilgan'))+'</small></div>';
    g.appendChild(perm);

    if(!status.notificationsAllowed){
      const allow=document.createElement('button');allow.type='button';allow.className='outline';
      allow.innerHTML=svgIcon('bell')+'<span>'+l('Разрешить уведомления','Allow notifications','Bildirishnomalarga ruxsat berish')+'</span>';
      allow.onclick=async()=>{try{await nativeCall('requestNotificationPermission',{});mobileToast(l('Подтвердите разрешение Android','Confirm the Android permission','Android ruxsatini tasdiqlang'),'info',2500)}catch(err){mobileToast(l('Не удалось запросить разрешение','Could not request permission','Ruxsat so‘rab bo‘lmadi'),'error')}};
      g.appendChild(allow);
    }

    const actions=document.createElement('div');actions.className='mobile-reminder-actions';
    const off=document.createElement('button');off.type='button';off.className='outline';off.textContent=l('Выключить','Turn off','O‘chirish');
    const save=document.createElement('button');save.type='button';save.className='mobile-settings-primary';save.textContent=l('Сохранить','Save','Saqlash');
    actions.append(off,save);g.appendChild(actions);
    off.disabled=!status.enabled;

    off.onclick=async()=>{try{
      await nativeCall('cancelDailyReminder',{});
      try{localStorage.removeItem('bp_reminder_time')}catch(_){}
      mobileToast(l('Напоминания выключены','Reminders turned off','Eslatmalar o‘chirildi'),'success');closeMobileSheet(sheet)
    }catch(err){mobileToast(l('Не удалось выключить напоминания','Could not disable reminders','Eslatmalarni o‘chirib bo‘lmadi'),'error')}};

    save.onclick=async()=>{
      const values=qa('[data-reminder-time]',sheet).map(x=>x.value.trim()).filter(Boolean);
      if(!values.length||values.some(time=>!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))){
        mobileToast(l('Проверьте время','Check the time','Vaqtni tekshiring'),'error');return;
      }
      const unique=[...new Set(values)].slice(0,3);
      const repeatCount=String(q('#mobileReminderRepeats',sheet)?.value||'1');
      const repeatInterval=String(q('#mobileReminderInterval',sheet)?.value||'10');
      const sound=String(q('#mobileReminderSound',sheet)?.value||'2');
      const vibrate=!!q('#mobileReminderVibrate',sheet)?.checked;
      try{
        const res=await nativeCall('scheduleDailyReminder',{
          times:unique.join(','),time:unique[0],repeatCount,repeatInterval,sound,vibrate,
          title:'BP Diary',
          body:l('Пора измерить артериальное давление','Time to measure your blood pressure','Qon bosimini o‘lchash vaqti'),
          doneLabel:l('Измерено','Done','O‘lchandi'),
          snoozeLabel:l('Напомнить позже','Remind later','Keyinroq eslatish')
        });
        try{localStorage.removeItem('bp_reminder_time')}catch(_){}
        mobileToast(l('Расписание напоминаний сохранено','Reminder schedule saved','Eslatma jadvali saqlandi'),'success',2600);
        if(res&&res.notificationsAllowed===false)mobileToast(l('Разрешите уведомления Android, чтобы сигналы появлялись','Allow Android notifications so alerts can appear','Signallar chiqishi uchun Android bildirishnomalariga ruxsat bering'),'info',3900);
        closeMobileSheet(sheet);
      }catch(err){mobileToast(l('Не удалось сохранить напоминания: ','Could not save reminders: ','Eslatmalarni saqlab bo‘lmadi: ')+(err?.message||err),'error',4200)}
    };
  }

  const V17_BIOMETRIC_KEY='bp_biometric_lock_v17';
  const V17_PRIVACY_SHIELD_KEY='bp_privacy_shield_v17';
  const V17_BACKUP_FORMAT='bp-diary-encrypted-backup';
  const V17_BACKUP_ITERATIONS=310000;
  let privacyPromptActive=false,privacyHiddenAt=0;

  function flagEnabled(key){try{return localStorage.getItem(key)==='1'}catch(_){return false}}
  function setFlag(key,value){try{value?localStorage.setItem(key,'1'):localStorage.removeItem(key)}catch(_){}}
  function cryptoReady(){return !!(window.crypto&&crypto.subtle&&window.TextEncoder&&window.TextDecoder)}
  function bytesToB64(bytes){
    let out='';const chunk=0x8000;
    for(let i=0;i<bytes.length;i+=chunk)out+=String.fromCharCode(...bytes.subarray(i,Math.min(bytes.length,i+chunk)));
    return btoa(out);
  }
  function b64ToBytes(value){
    const raw=atob(String(value||'')),out=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
    return out;
  }
  async function protectedBackupKey(password,salt,iterations=V17_BACKUP_ITERATIONS){
    const enc=new TextEncoder();
    const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey(
      {name:'PBKDF2',salt,iterations,hash:'SHA-256'},
      material,
      {name:'AES-GCM',length:256},
      false,
      ['encrypt','decrypt']
    );
  }
  async function encryptBackupPayload(payload,password){
    if(!cryptoReady())throw new Error(ru()?'Шифрование недоступно на этом устройстве':'Encryption is unavailable on this device');
    const salt=crypto.getRandomValues(new Uint8Array(16));
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const key=await protectedBackupKey(password,salt);
    const clear=new TextEncoder().encode(JSON.stringify(payload));
    const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,clear));
    return {
      format:V17_BACKUP_FORMAT,
      version:1,
      createdAt:new Date().toISOString(),
      cipher:'AES-GCM-256',
      kdf:'PBKDF2-SHA-256',
      iterations:V17_BACKUP_ITERATIONS,
      salt:bytesToB64(salt),
      iv:bytesToB64(iv),
      ciphertext:bytesToB64(cipher)
    };
  }
  async function decryptBackupEnvelope(envelope,password){
    if(!cryptoReady())throw new Error(ru()?'Расшифровка недоступна на этом устройстве':'Decryption is unavailable on this device');
    if(!envelope||envelope.format!==V17_BACKUP_FORMAT||Number(envelope.version)!==1)throw new Error(ru()?'Это не защищённый бэкап BP Diary':'This is not a protected BP Diary backup');
    const iterations=Number(envelope.iterations);
    if(!Number.isInteger(iterations)||iterations<100000||iterations>1000000)throw new Error(ru()?'Некорректные параметры шифрования':'Invalid encryption parameters');
    const salt=b64ToBytes(envelope.salt),iv=b64ToBytes(envelope.iv),cipher=b64ToBytes(envelope.ciphertext);
    if(salt.length!==16||iv.length!==12||!cipher.length)throw new Error(ru()?'Повреждённый защищённый бэкап':'Corrupted protected backup');
    const key=await protectedBackupKey(password,salt,iterations);
    try{
      const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
      return JSON.parse(new TextDecoder().decode(clear));
    }catch(_){
      throw new Error(ru()?'Неверный пароль или повреждённый файл':'Wrong password or corrupted file');
    }
  }

  let secretPromptState=null,protectedBackupBusy=false,protectedRestoreBusy=false;

  function askSecret({title,message,confirm=false,minLength=1}={}){
    if(secretPromptState){
      openMobileSheet(secretPromptState.sheet,{historyEntry:false});
      setTimeout(()=>q('#mobileSecretOne',secretPromptState.sheet)?.focus(),30);
      return Promise.resolve(null);
    }
    return new Promise(resolve=>{
      const sheet=makeSheet('mobileSecretSheet',title||'');
      const state={sheet};secretPromptState=state;
      q('.mobile-sheet-title',sheet).innerHTML='<span>'+(title||'')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
      const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
      const wrap=document.createElement('section');wrap.className='mobile-secret-card';
      wrap.innerHTML='<p class="mobile-secret-message"></p><label class="mobile-settings-field"><span>'+l('Пароль','Password','Parol')+'</span><input id="mobileSecretOne" type="password" autocomplete="new-password"></label>'+
        (confirm?'<label class="mobile-settings-field"><span>'+l('Повторите пароль','Repeat password','Parolni takrorlang')+'</span><input id="mobileSecretTwo" type="password" autocomplete="new-password"></label>':'')+
        '<small class="mobile-secret-note">'+(confirm?l('Пароль нигде не сохраняется. Если его забыть, расшифровать файл будет невозможно.','The password is never stored. If you forget it, the file cannot be decrypted.','Parol hech qayerda saqlanmaydi. Uni unutib qo‘ysangiz, faylni ochib bo‘lmaydi.'):'')+'</small>';
      q('.mobile-secret-message',wrap).textContent=message||'';
      const actions=document.createElement('div');actions.className='mobile-secret-actions';
      const cancel=document.createElement('button');cancel.type='button';cancel.className='outline';cancel.textContent=l('Отмена','Cancel','Bekor qilish');
      const ok=document.createElement('button');ok.type='button';ok.className='mobile-settings-primary';ok.textContent=l('Продолжить','Continue','Davom etish');
      actions.append(cancel,ok);g.append(wrap,actions);
      let settled=false;
      const finish=value=>{
        if(settled)return;
        settled=true;
        if(secretPromptState===state)secretPromptState=null;
        sheet.__onDismiss=null;
        closeMobileSheet(sheet);
        resolve(value);
      };
      sheet.__onDismiss=()=>{
        if(settled)return;
        settled=true;
        if(secretPromptState===state)secretPromptState=null;
        resolve(null);
      };
      q('.mobile-sheet-close',sheet).onclick=()=>finish(null);
      cancel.onclick=()=>finish(null);
      ok.onclick=()=>{
        const one=q('#mobileSecretOne',sheet)?.value||'',two=q('#mobileSecretTwo',sheet)?.value||'';
        if(one.length<minLength){mobileToast(l('Минимум символов: ','Minimum characters: ','Minimal belgilar soni: ')+minLength,'error');return}
        if(confirm&&one!==two){mobileToast(l('Пароли не совпадают','Passwords do not match','Parollar mos kelmadi'),'error');return}
        finish(one);
      };
      openMobileSheet(sheet,{historyEntry:false});
      setTimeout(()=>q('#mobileSecretOne',sheet)?.focus(),120);
    });
  }

  async function nativeSaveProtectedBackup(){
    if(protectedBackupBusy){
      if(secretPromptState?.sheet)openMobileSheet(secretPromptState.sheet);
      return;
    }
    protectedBackupBusy=true;
    try{
      const password=await askSecret({
        title:l('Защищённый бэкап','Protected backup','Himoyalangan zaxira nusxa'),
        message:l('Придумайте пароль. Данные будут зашифрованы AES‑GCM перед сохранением.','Choose a password. Data will be AES-GCM encrypted before saving.','Parol yarating. Saqlashdan oldin ma’lumotlar AES‑GCM bilan shifrlanadi.'),
        confirm:true,minLength:8
      });
      if(!password)return;
      mobileToast(l('Шифрую бэкап…','Encrypting backup…','Zaxira nusxa shifrlanmoqda…'),'info',1400);
      const envelope=await encryptBackupPayload(backupSnapshot(),password);
      const fileName='BP-Diary-protected-'+new Date().toISOString().slice(0,10)+'.bpbackup.json';
      const res=await nativeCall('saveTextFile',{content:JSON.stringify(envelope),fileName,mime:'application/json'});
      mobileToast(l('Защищённый бэкап сохранён: ','Protected backup saved: ','Himoyalangan zaxira nusxa saqlandi: ')+(res?.name||fileName),'success',3400);
    }catch(err){
      if(!/cancel/i.test(String(err?.message||'')))mobileToast(l('Не удалось создать защищённый бэкап: ','Could not create protected backup: ','Himoyalangan zaxira nusxani yaratib bo‘lmadi: ')+(err?.message||err),'error',4700)
    }finally{protectedBackupBusy=false}
  }

  async function nativeRestoreProtectedBackup(){
    if(protectedRestoreBusy){
      if(secretPromptState?.sheet)openMobileSheet(secretPromptState.sheet);
      return;
    }
    protectedRestoreBusy=true;
    try{
      const res=await nativeCall('openTextFile',{mime:'application/json',initialUri:''});
      const envelope=JSON.parse(res?.content||'');
      if(envelope?.format!==V17_BACKUP_FORMAT)throw new Error(l('Выбранный файл не является защищённым бэкапом BP Diary','Selected file is not a protected BP Diary backup','Tanlangan fayl BP Diary himoyalangan zaxira nusxasi emas'));
      const password=await askSecret({
        title:l('Расшифровать бэкап','Decrypt backup','Zaxira nusxani ochish'),
        message:l('Введите пароль, которым защищён этот файл.','Enter the password used to protect this file.','Faylni himoyalash uchun ishlatilgan parolni kiriting.'),
        confirm:false,minLength:1
      });
      if(!password)return;
      mobileToast(l('Проверяю и расшифровываю…','Verifying and decrypting…','Tekshirilmoqda va shifrdan chiqarilmoqda…'),'info',1500);
      const backup=await decryptBackupEnvelope(envelope,password);
      if(!await mobileConfirm({
        title:l('Восстановить защищённый бэкап?','Restore protected backup?','Himoyalangan zaxira tiklansinmi?'),
        message:l('Текущие данные приложения будут заменены расшифрованными данными из файла.','Current app data will be replaced by decrypted data from the selected file.','Ilovadagi joriy ma’lumotlar fayldagi ochilgan ma’lumotlar bilan almashtiriladi.'),
        confirmLabel:l('Восстановить','Restore','Tiklash'),danger:true
      }))return;
      await nativeAutoBackup('before-protected-restore',true);
      if(!restoreBackupObject(backup))throw new Error(l('Неверный формат данных внутри бэкапа','Invalid data inside backup','Zaxira nusxa ichidagi ma’lumot formati noto‘g‘ri'));
      try{localStorage.setItem('bp_v12_onboarding_done','1');localStorage.setItem('bp_v17_onboarding_done','1')}catch(_){}
      mobileToast(l('Защищённый бэкап восстановлен. Перезапускаю приложение.','Protected backup restored. Restarting the app.','Himoyalangan zaxira tiklandi. Ilova qayta ishga tushirilmoqda.'),'success',1900);
      setTimeout(()=>location.reload(),900);
    }catch(err){
      if(!/cancel/i.test(String(err?.message||'')))mobileToast(l('Не удалось восстановить защищённый бэкап: ','Could not restore protected backup: ','Himoyalangan zaxirani tiklab bo‘lmadi: ')+(err?.message||err),'error',4800)
    }finally{protectedRestoreBusy=false}
  }

  const V17_BACKGROUND_LOCK_MS=10000;
  let privacyNeedsAuth=false,privacyResumeTimer=null,privacyAuthInFlight=false,privacyIgnoreBackgroundUntil=0,privacyWatchdogTimer=null;
  function stopPrivacyWatchdog(){
    if(privacyWatchdogTimer){clearInterval(privacyWatchdogTimer);privacyWatchdogTimer=null}
  }
  function startPrivacyWatchdog(){
    if(privacyWatchdogTimer)return;
    privacyWatchdogTimer=setInterval(()=>{
      if(!flagEnabled(V17_BIOMETRIC_KEY)){stopPrivacyWatchdog();document.documentElement.classList.remove('bp-prelocked');return}
      if(!document.documentElement.classList.contains('bp-prelocked')){stopPrivacyWatchdog();return}
      if(document.visibilityState!=='visible'||privacyAuthInFlight||privacyPromptActive)return;
      checkPrivacyOnResume().catch(()=>{});
    },650);
  }

  async function biometricAuth(reason='unlock'){
    const bridge=nativeBridge();
    if(!bridge||typeof bridge.authenticateBiometric!=='function')throw new Error(l('Защита устройства недоступна','Device authentication unavailable','Qurilma himoyasi mavjud emas'));
    privacyAuthInFlight=true;
    try{
      return await nativeCall('authenticateBiometric',{
        title:'BP Diary',
        subtitle:reason==='settings'
          ?l('Подтвердите изменение защиты','Confirm privacy change','Himoya sozlamasini tasdiqlang')
          :l('Разблокируйте дневник','Unlock your diary','Kundalikni qulfdan chiqaring')
      });
    }finally{
      privacyAuthInFlight=false;
      privacyHiddenAt=Date.now();
      privacyIgnoreBackgroundUntil=Date.now()+1400;
    }
  }
  async function applyPrivacyShield(){
    const bridge=nativeBridge();if(!bridge||typeof bridge.setPrivacyShield!=='function')return;
    try{await nativeCall('setPrivacyShield',{enabled:flagEnabled(V17_PRIVACY_SHIELD_KEY)})}catch(_){}
  }
  async function lockApplication({automatic=true}={}){
    if(!flagEnabled(V17_BIOMETRIC_KEY)){
      privacyNeedsAuth=false;document.documentElement.classList.remove('bp-prelocked');stopPrivacyWatchdog();return true;
    }
    const bridge=nativeBridge();
    if(!bridge||typeof bridge.authenticateBiometric!=='function'){
      privacyNeedsAuth=false;document.documentElement.classList.remove('bp-prelocked');return true;
    }
    if(privacyPromptActive)return false;
    privacyPromptActive=true;privacyNeedsAuth=true;document.documentElement.classList.add('bp-prelocked');
    try{
      await biometricAuth('unlock');
      privacyNeedsAuth=false;document.documentElement.classList.remove('bp-prelocked');stopPrivacyWatchdog();
      return true;
    }catch(_){
      startPrivacyWatchdog();
      if(automatic){try{await nativeCall('backgroundApp',{})}catch(_){}}
      return false;
    }finally{privacyPromptActive=false}
  }
  async function toggleBiometricProtection(){
    const enabled=flagEnabled(V17_BIOMETRIC_KEY);
    try{
      const bridge=nativeBridge();if(!bridge||typeof bridge.getBiometricStatus!=='function')throw new Error(l('Защита устройства недоступна','Device authentication unavailable','Qurilma himoyasi mavjud emas'));
      const status=await nativeCall('getBiometricStatus',{});
      if(!status?.available)throw new Error(l('На устройстве не настроены биометрия или код блокировки','No biometric or device credential is configured','Qurilmada biometrika yoki ekran qulfi kodi sozlanmagan'));
      await biometricAuth('settings');
      setFlag(V17_BIOMETRIC_KEY,!enabled);
      mobileToast(!enabled
        ?l('Блокировка приложения включена','App lock enabled','Ilova qulfi yoqildi')
        :l('Блокировка приложения выключена','App lock disabled','Ilova qulfi o‘chirildi'),'success',2600);
      return !enabled;
    }catch(err){
      mobileToast(l('Не удалось изменить защиту: ','Could not change app protection: ','Himoyani o‘zgartirib bo‘lmadi: ')+(err?.message||err),'error',4500);
      return enabled;
    }
  }
  async function togglePrivacyShield(){
    const next=!flagEnabled(V17_PRIVACY_SHIELD_KEY);setFlag(V17_PRIVACY_SHIELD_KEY,next);await applyPrivacyShield();
    mobileToast(next
      ?l('Скриншоты и превью Recent Apps заблокированы','Screenshots and Recent Apps previews are blocked','Skrinshotlar va Recent Apps ko‘rinishi bloklandi')
      :l('Защита скриншотов выключена','Screenshot protection disabled','Skrinshot himoyasi o‘chirildi'),'success',3000);
    return next;
  }
  function schedulePrivacyResumeCheck(delay=80){
    const ignoreDelay=Math.max(0,privacyIgnoreBackgroundUntil-Date.now()+30);
    clearTimeout(privacyResumeTimer);
    privacyResumeTimer=setTimeout(checkPrivacyOnResume,Math.max(delay,ignoreDelay));
  }
  async function checkPrivacyOnResume(){
    if(privacyAuthInFlight){schedulePrivacyResumeCheck(140);return}
    if(Date.now()<privacyIgnoreBackgroundUntil){schedulePrivacyResumeCheck(80);return}
    if(!flagEnabled(V17_BIOMETRIC_KEY)){privacyNeedsAuth=false;document.documentElement.classList.remove('bp-prelocked');stopPrivacyWatchdog();return}
    let screenOff=false;
    try{screenOff=!!(await nativeCall('consumeScreenOffEvent',{}))?.screenOff}catch(_){}
    const elapsed=privacyHiddenAt?Date.now()-privacyHiddenAt:0;
    if(privacyNeedsAuth||screenOff||elapsed>=V17_BACKGROUND_LOCK_MS)await lockApplication({automatic:true});
  }
  window.__bpPrivacyResumeCheck=checkPrivacyOnResume;
  window.__bpPrivacyLockMs=V17_BACKGROUND_LOCK_MS;
  async function initPrivacyProtection(){
    await applyPrivacyShield();
    if(flagEnabled(V17_BIOMETRIC_KEY)){startPrivacyWatchdog();await lockApplication({automatic:true});}
    else{document.documentElement.classList.remove('bp-prelocked');stopPrivacyWatchdog();}
    privacyHiddenAt=Date.now();
    if(!document.documentElement.dataset.bpPrivacyBound){
      document.documentElement.dataset.bpPrivacyBound='1';
      const bridge=nativeBridge();
      if(bridge&&typeof bridge.addListener==='function'){
        try{
          Promise.resolve(bridge.addListener('screenOff',()=>{
            if(!flagEnabled(V17_BIOMETRIC_KEY))return;
            privacyNeedsAuth=true;
            document.documentElement.classList.add('bp-prelocked');
            startPrivacyWatchdog();
          })).catch(()=>{});
        }catch(_){}
      }
      document.addEventListener('visibilitychange',()=>{
        if(document.visibilityState==='hidden'){
          if(privacyAuthInFlight||Date.now()<privacyIgnoreBackgroundUntil)return;
          privacyHiddenAt=Date.now();return;
        }
        if(document.visibilityState==='visible')schedulePrivacyResumeCheck(80);
      });
      window.addEventListener('focus',()=>{
        if(document.visibilityState!=='visible')return;
        schedulePrivacyResumeCheck(90);
      });
      window.addEventListener('pageshow',()=>{
        if(document.visibilityState!=='visible')return;
        schedulePrivacyResumeCheck(90);
      });
    }
  }

  function switchMobileLanguage(code,{reopenSettings=false}={}){
    if(!['ru','en','uz'].includes(code)||code===appLang())return;
    try{window.setAppLanguage?.(code)}catch(_){proxy('langSwitchBtn')}
    setTimeout(()=>{
      try{window.updateAllAnalytics?.();window.updateUITexts?.()}catch(_){}
      setup(true);refreshText();syncUzLocalizationObserver();
      if(reopenSettings)showSettingsSheet();
    },120);
  }
  function cycleMobileLanguage(){
    const order=['ru','en','uz'],index=Math.max(0,order.indexOf(appLang()));
    switchMobileLanguage(order[(index+1)%order.length],{reopenSettings:false});
  }
  function switchMobileTheme(theme){
    const dark=theme==='dark';
    if(dark===document.body.classList.contains('dark'))return;
    proxy(dark?'darkThemeBtn':'lightThemeBtn');
    setTimeout(()=>{appBar();const ps=pages();if(ps[1])polishCharts(ps[1]);showSettingsSheet()},80);
  }
  function settingsSegment(values,current,onChange,label){
    const group=document.createElement('div');group.className='mobile-settings-segment';group.setAttribute('role','group');group.setAttribute('aria-label',label);
    values.forEach(([value,text])=>{
      const b=document.createElement('button');b.type='button';b.dataset.value=value;b.textContent=text;
      const active=value===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
      b.onclick=e=>{e.stopPropagation();onChange(value)};
      group.appendChild(b);
    });
    return group;
  }
  async function showSettingsSheet(){
    const sheet=makeSheet('mobileSettingsSheet',l('Настройки','Settings','Sozlamalar'));
    q('.mobile-sheet-title',sheet).innerHTML='<span>'+l('Настройки','Settings','Sozlamalar')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
    const version=document.createElement('section');version.className='mobile-settings-version';
    version.innerHTML='<div class="mobile-settings-version-icon">'+brandHeartIcon()+'</div><div><b>BP Diary '+APP_VERSION+'</b><small>'+APP_RELEASE+' · versionCode '+APP_VERSION_CODE+'</small></div>';
    g.appendChild(version);
    const section=(title)=>{const el=document.createElement('section');el.className='mobile-settings-section';el.innerHTML='<h3>'+title+'</h3><div class="mobile-settings-list"></div>';g.appendChild(el);return q('.mobile-settings-list',el)};
    const row=(icon,title,small,action)=>{
      const b=document.createElement('button');b.type='button';b.className='mobile-settings-row';
      b.innerHTML='<span class="mobile-settings-row-icon">'+icon+'</span><span><b>'+title+'</b><small>'+small+'</small></span><span>›</span>';
      b.onclick=action;return b;
    };

    const everyday=section(l('Напоминания и помощь','Reminders & help','Eslatmalar va yordam'));
    const reminder=row(svgIcon('bell'),l('Напоминания об измерении','Measurement reminders','O‘lchov eslatmalari'),l('До 3 времён в день · повторы · звук','Up to 3 daily times · repeats · sound','Kuniga 3 vaqtgacha · takror · ovoz'),()=>{closeMobileSheet(sheet);setTimeout(showReminderSheet,100)});
    const guide=row(svgIcon('info'),l('Руководство','User guide','Foydalanish qo‘llanmasi'),l('Что означают показатели и как пользоваться BP Diary','Understand values and how to use BP Diary','Ko‘rsatkichlar va BP Diary’dan foydalanish'),()=>{closeMobileSheet(sheet);setTimeout(showGuideSheet,100)});
    everyday.append(reminder,guide);

    const appearance=section(l('Интерфейс','Appearance','Interfeys'));
    const languageRow=document.createElement('div');languageRow.className='mobile-settings-control-row';
    languageRow.innerHTML='<span class="mobile-settings-row-icon">文</span><span class="mobile-settings-control-copy"><b>'+l('Язык','Language','Til')+'</b><small>'+l('Выберите язык интерфейса','Choose interface language','Interfeys tilini tanlang')+'</small></span>';
    languageRow.appendChild(settingsSegment([['ru','RU'],['en','EN'],['uz','UZ']],appLang(),value=>switchMobileLanguage(value,{reopenSettings:true}),l('Язык интерфейса','Interface language','Interfeys tili')));
    const themeRow=document.createElement('div');themeRow.className='mobile-settings-control-row';
    themeRow.innerHTML='<span class="mobile-settings-row-icon">'+svgIcon(document.body.classList.contains('dark')?'moon':'sun')+'</span><span class="mobile-settings-control-copy"><b>'+l('Тема','Theme','Mavzu')+'</b><small>'+l('Светлая или тёмная','Light or dark','Yorug‘ yoki qorong‘i')+'</small></span>';
    themeRow.appendChild(settingsSegment([['light',l('Светлая','Light','Yorug‘')],['dark',l('Тёмная','Dark','Qorong‘i')]],document.body.classList.contains('dark')?'dark':'light',switchMobileTheme,l('Тема приложения','App theme','Ilova mavzusi')));
    appearance.append(languageRow,themeRow);

    const data=section(l('Данные','Data','Ma’lumotlar'));
    const backups=row('↻',l('Авто-бэкапы','Auto-backups','Avto-zaxiralar'),l('До пяти локальных копий','Up to five local copies','Beshtagacha mahalliy nusxa'),()=>{closeMobileSheet(sheet);setTimeout(showAutoBackupSheet,100)});
    const full=row(svgIcon('save'),l('Полный бэкап','Full backup','To‘liq zaxira nusxa'),l('Обычный JSON для совместимости','Plain JSON for compatibility','Moslik uchun oddiy JSON'),()=>{closeMobileSheet(sheet);setTimeout(()=>q('#fullBackupBtn')?.click(),90)});
    const protectedSave=row(svgIcon('key'),l('Защищённый бэкап','Protected backup','Himoyalangan zaxira'),l('AES‑GCM + пароль · пароль не сохраняется','AES-GCM + password · password is never stored','AES‑GCM + parol · parol saqlanmaydi'),()=>{closeMobileSheet(sheet,true);setTimeout(nativeSaveProtectedBackup,100)});
    const protectedRestore=row(svgIcon('restore'),l('Восстановить защищённый','Restore protected backup','Himoyalangan zaxirani tiklash'),l('Выбрать зашифрованный файл','Choose an encrypted backup file','Shifrlangan faylni tanlang'),()=>{closeMobileSheet(sheet,true);setTimeout(nativeRestoreProtectedBackup,100)});
    data.append(backups,full,protectedSave,protectedRestore);

    const privacy=section(l('Дополнительно · приватность','Advanced · privacy','Qo‘shimcha · maxfiylik'));
    const biometric=document.createElement('button');biometric.type='button';biometric.className='mobile-settings-row';
    biometric.innerHTML='<span class="mobile-settings-row-icon">'+svgIcon('lock')+'</span><span><b>'+l('Блокировка приложения','App lock','Ilova qulfi')+'</b><small>'+(flagEnabled(V17_BIOMETRIC_KEY)
      ?l('Включена · 10 секунд в фоне или сразу после блокировки экрана','Enabled · 10 seconds in background or immediately after screen lock','Yoqilgan · fonda 10 soniya yoki ekran qulflanganda darhol')
      :l('Выключена','Disabled','O‘chirilgan'))+'</small></span><span class="mobile-settings-state '+(flagEnabled(V17_BIOMETRIC_KEY)?'on':'off')+'">'+(flagEnabled(V17_BIOMETRIC_KEY)?'ON':'OFF')+'</span>';
    biometric.onclick=async()=>{const current=flagEnabled(V17_BIOMETRIC_KEY);const next=await toggleBiometricProtection();if(next!==current)setTimeout(showSettingsSheet,80)};
    const shield=document.createElement('button');shield.type='button';shield.className='mobile-settings-row';
    shield.innerHTML='<span class="mobile-settings-row-icon">'+svgIcon('shield')+'</span><span><b>'+l('Защита экрана','Screen privacy','Ekran himoyasi')+'</b><small>'+(flagEnabled(V17_PRIVACY_SHIELD_KEY)
      ?l('Скриншоты и превью Recent Apps заблокированы','Screenshots and Recent Apps previews blocked','Skrinshotlar va Recent Apps ko‘rinishi bloklangan')
      :l('Скриншоты разрешены','Screenshots allowed','Skrinshotlarga ruxsat berilgan'))+'</small></span><span class="mobile-settings-state '+(flagEnabled(V17_PRIVACY_SHIELD_KEY)?'on':'off')+'">'+(flagEnabled(V17_PRIVACY_SHIELD_KEY)?'ON':'OFF')+'</span>';
    shield.onclick=async()=>{await togglePrivacyShield();setTimeout(showSettingsSheet,80)};
    privacy.append(biometric,shield);

    const app=section(l('Приложение','App','Ilova'));
    const update=row(svgIcon('update'),l('Проверить обновления','Check for updates','Yangilanishlarni tekshirish'),l('Только официальный GitHub Release','Official GitHub Release only','Faqat rasmiy GitHub Release'),()=>{closeMobileSheet(sheet);setTimeout(()=>checkForUpdates(),100)});
    const about=row(svgIcon('info'),l('О продукте','About','Dastur haqida'),'BP Diary · '+APP_RELEASE,()=>{closeMobileSheet(sheet);setTimeout(showAboutSheet,100)});
    app.append(update,about);
    q('.mobile-sheet-close',sheet).onclick=()=>closeMobileSheet(sheet);
    openMobileSheet(sheet);localizeUzTree(sheet);
  }

  function showGuideSheet(){
    const sheet=makeSheet('mobileGuideSheet',l('Руководство','User guide','Foydalanish qo‘llanmasi'));
    q('.mobile-sheet-title',sheet).innerHTML='<span>'+l('Руководство BP Diary','BP Diary user guide','BP Diary foydalanish qo‘llanmasi')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
    const guides={
      ru:[
        ['1. Новый замер','Перенесите значения с тонометра в поля САД, ДАД и Пульс. «Замер 1–3» объединяет повторные измерения одного сеанса. Приложение не позволит сохранить явно некорректный ввод.'],
        ['2. САД / SYS','Систолическое («верхнее») артериальное давление — первое число на тонометре.'],
        ['3. ДАД / DIA','Диастолическое («нижнее») артериальное давление — второе число на тонометре.'],
        ['4. Пульс','Частота сердечных сокращений в ударах в минуту. Если пульс не вводится, поле можно оставить пустым.'],
        ['5. Архив и аналитика','Архив хранит сеансы и позволяет искать и фильтровать их. Аналитика строится по сохранённым данным дневника.'],
        ['6. Отчёт для врача','Выберите период. Отчёт формируется в A4 альбомной ориентации, как на ПК: сводка, профиль и таблица измерений. Его можно просмотреть, сохранить, распечатать или отправить.'],
        ['7. Напоминания','Можно задать до трёх времён в день, 1–3 сигнала с интервалом, одну из трёх системных мелодий и вибрацию. В уведомлении доступны «Измерено» и «Напомнить позже».'],
        ['8. Резервные копии','Обычный JSON нужен для совместимости. Защищённый бэкап шифруется паролем; забытый пароль восстановить нельзя.'],
        ['Важно','BP Diary помогает вести дневник и готовить данные. Он не ставит диагноз и не заменяет рекомендации врача.']
      ],
      en:[
        ['1. New reading','Copy the monitor values into SYS, DIA and Pulse. Reading 1–3 groups repeated measurements in one session. Clearly invalid entry values cannot be saved.'],
        ['2. SYS','Systolic (“upper”) blood pressure — the first number shown by the monitor.'],
        ['3. DIA','Diastolic (“lower”) blood pressure — the second number shown by the monitor.'],
        ['4. Pulse','Heart rate in beats per minute. If pulse is not available, the field may be left empty.'],
        ['5. Archive & analytics','Archive stores sessions and supports search and filters. Analytics uses saved diary data.'],
        ['6. Doctor report','Choose a period. The report uses A4 landscape like the desktop version: summary, profile and full measurement table. Preview, save, print or share it.'],
        ['7. Reminders','Set up to three daily times, 1–3 alerts with an interval, one of three system sounds and vibration. Notifications provide Done and Remind later actions.'],
        ['8. Backups','Plain JSON keeps compatibility. Protected backup is encrypted with your password; a forgotten password cannot be recovered.'],
        ['Important','BP Diary helps keep a diary and prepare data. It does not diagnose conditions or replace medical advice.']
      ],
      uz:[
        ['1. Yangi o‘lchov','Tonometrdagi qiymatlarni SAB, DAB va Puls maydonlariga kiriting. O‘lchov 1–3 bitta seansdagi takroriy o‘lchovlarni birlashtiradi. Aniq noto‘g‘ri qiymatlarni saqlab bo‘lmaydi.'],
        ['2. SAB / SYS','Sistolik (“yuqori”) arterial bosim — tonometr ko‘rsatadigan birinchi son.'],
        ['3. DAB / DIA','Diastolik (“pastki”) arterial bosim — tonometr ko‘rsatadigan ikkinchi son.'],
        ['4. Puls','Yurak urish tezligi, bir daqiqadagi urishlar soni. Puls ma’lum bo‘lmasa, maydonni bo‘sh qoldirish mumkin.'],
        ['5. Arxiv va tahlil','Arxiv seanslarni saqlaydi, qidirish va filtrlash imkonini beradi. Tahlil saqlangan kundalik ma’lumotlari asosida tuziladi.'],
        ['6. Shifokor hisoboti','Davrni tanlang. Hisobot kompyuter versiyasidagidek A4 landshaft formatida: umumiy ma’lumot, profil va to‘liq o‘lchov jadvali. Uni ko‘rish, saqlash, chop etish yoki ulashish mumkin.'],
        ['7. Eslatmalar','Kuniga uch vaqtgacha, interval bilan 1–3 signal, uchta tizim ovozidan biri va vibratsiyani tanlash mumkin. Bildirishnomada “O‘lchandi” va “Keyinroq eslatish” amallari bor.'],
        ['8. Zaxira nusxalar','Oddiy JSON moslik uchun saqlanadi. Himoyalangan zaxira parol bilan shifrlanadi; unutilgan parolni tiklab bo‘lmaydi.'],
        ['Muhim','BP Diary kundalik yuritish va ma’lumot tayyorlashga yordam beradi. U tashxis qo‘ymaydi va shifokor tavsiyalarini almashtirmaydi.']
      ]
    };
    const list=guides[appLang()]||guides.en;
    const wrap=document.createElement('div');wrap.className='mobile-guide-list';
    wrap.innerHTML=list.map(([title,text])=>'<section class="mobile-guide-card"><h3>'+title+'</h3><p>'+text+'</p></section>').join('');
    const tour=document.createElement('button');tour.type='button';tour.className='outline mobile-guide-tour';tour.innerHTML=svgIcon('chevron')+'<span>'+l('Показать вводный тур','Show introduction tour','Kirish turini ko‘rsatish')+'</span>';
    tour.onclick=()=>{closeMobileSheet(sheet);setTimeout(()=>showOnboarding(true),100)};
    g.append(wrap,tour);
    q('.mobile-sheet-close',sheet).onclick=()=>closeMobileSheet(sheet);
    openMobileSheet(sheet);localizeUzTree(sheet);
  }

  function showAboutSheet(){
    const sheet=makeSheet('mobileAboutSheet',l('О продукте','About','Dastur haqida'));
    q('.mobile-sheet-title',sheet).innerHTML='<span>'+l('О продукте','About','Dastur haqida')+'</span><button type="button" class="mobile-about-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
    const g=q('.mobile-sheet-grid',sheet);
    g.innerHTML='<section class="mobile-about-hero"><div class="mobile-about-icon">'+brandHeartIcon()+'</div><strong>BP Diary</strong><span>'+l('Дневник артериального давления','Blood pressure diary','Qon bosimi kundaligi')+'</span><small>'+APP_VERSION+' · Android '+APP_RELEASE+'</small></section>'+
      '<section class="mobile-about-intro">'+l('Персональный дневник артериального давления с аналитикой, отчётами врачу, резервным копированием и голосовыми функциями.','A personal blood pressure diary with analytics, doctor reports, backups and voice features.','Tahlil, shifokor hisobotlari, zaxira nusxalar va ovozli funksiyalarga ega shaxsiy qon bosimi kundaligi.')+'</section>'+
      '<div class="mobile-about-list">'+
        '<button type="button" data-about-action="update"><span class="mobile-about-row-icon">'+svgIcon('update')+'</span><span><b>'+l('Проверить обновления','Check for updates','Yangilanishlarni tekshirish')+'</b><small>'+APP_VERSION+' · '+APP_RELEASE+'</small></span><span>›</span></button>'+
        '<button type="button" data-about-action="guide"><span class="mobile-about-row-icon">?</span><span><b>'+l('Руководство','User guide','Foydalanish qo‘llanmasi')+'</b><small>'+l('Показатели, замеры, отчёты и напоминания','Values, readings, reports and reminders','Ko‘rsatkichlar, o‘lchovlar, hisobot va eslatmalar')+'</small></span><span>›</span></button>'+
        '<button type="button" data-about-url="https://github.com/TokhirjonYuldoshev/BP-Diary-Android"><span class="mobile-about-row-icon">⌘</span><span><b>GitHub</b><small>TokhirjonYuldoshev/BP-Diary-Android</small></span><span>›</span></button>'+
        '<button type="button" data-about-url="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues"><span class="mobile-about-row-icon">?</span><span><b>'+l('Поддержка / обратная связь','Support / feedback','Yordam / fikr-mulohaza')+'</b><small>'+l('Сообщить об ошибке или предложить улучшение','Report a bug or suggest an improvement','Xato haqida xabar berish yoki taklif yuborish')+'</small></span><span>›</span></button>'+
        '<div class="mobile-about-row"><span class="mobile-about-row-icon">©</span><span><b>'+l('Разработчик','Developer','Dasturchi')+'</b><small>Tokhirjon Yuldoshev</small></span></div>'+
        '<div class="mobile-about-row"><span class="mobile-about-row-icon">§</span><span><b>'+l('Лицензия','License','Litsenziya')+'</b><small>'+l('Apache License 2.0','Apache License 2.0','Apache License 2.0')+'</small></span></div>'+
      '</div>'+
      '<div class="mobile-about-thanks">'+l('Спасибо, что используете BP Diary.','Thank you for using BP Diary.','BP Diary’dan foydalanganingiz uchun rahmat.')+'</div>'+
      '<button type="button" class="mobile-about-ok">'+l('Готово','Done','Tayyor')+'</button>';
    q('.mobile-about-close',sheet).onclick=()=>closeMobileSheet(sheet);
    q('.mobile-about-ok',sheet).onclick=()=>closeMobileSheet(sheet);
    const update=q('[data-about-action="update"]',sheet);if(update)update.onclick=()=>{closeMobileSheet(sheet);setTimeout(()=>checkForUpdates(),100)};
    const guide=q('[data-about-action="guide"]',sheet);if(guide)guide.onclick=()=>{closeMobileSheet(sheet);setTimeout(showGuideSheet,100)};
    qa('[data-about-url]',sheet).forEach(b=>b.onclick=async()=>{
      try{await nativeCall('openUrl',{url:b.dataset.aboutUrl})}
      catch(_){
        try{await navigator.clipboard.writeText(b.dataset.aboutUrl);mobileToast(l('Ссылка скопирована','Link copied','Havola nusxalandi'),'success')}
        catch(err){mobileToast(l('Не удалось открыть ссылку','Could not open link','Havolani ochib bo‘lmadi'),'error')}
      }
    });
    openMobileSheet(sheet);localizeUzTree(sheet);
  }

 
  let reportPeriodDays=Number(localStorage.getItem('bp_report_period_days')||30)||30;
  let archivePeriod=localStorage.getItem('bp_archive_period_v12')||'all';
  let archiveSort=localStorage.getItem('bp_archive_sort_v12')||'newest';
  let archiveSearch=localStorage.getItem('bp_archive_search_v15')||'';
  let onboardingIndex=0;

  function localIsoDate(date=new Date()){
    const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+d;
  }
  function dateMinusDays(days){
    const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-Math.max(0,Number(days)||0));return localIsoDate(d);
  }
  function applyCoreDateFilter(from,to){
    const analysis=pages()[1],group=q('.filter-group',analysis);
    const inputs=group?qa('input',group).slice(0,2):[];
    if(inputs.length<2)return false;
    inputs[0].value=from||'';inputs[1].value=to||'';
    inputs.forEach(x=>x.dispatchEvent(new Event('change',{bubbles:true})));
    const apply=q('#applyFilterBtn',group)||q('#applyFilterBtn');
    apply?.click();
    return true;
  }
  function resetCoreDateFilter(){
    const analysis=pages()[1],group=q('.filter-group',analysis);
    const reset=q('#resetFilterBtn',group)||q('#resetFilterBtn');
    if(reset){reset.click();return true}
    return applyCoreDateFilter('','');
  }
  function runDoctorReport(action='view',from='',to=''){
    if(!q('#reportDoctorBtn')){mobileToast(ru()?'Отчёт врача недоступен':'Doctor report unavailable','error');return}
    const analysis=pages()[1],group=q('.filter-group',analysis),inputs=group?qa('input',group).slice(0,2):[];
    const previous=inputs.length>=2?[inputs[0].value||'',inputs[1].value||'']:null;
    if(from||to)applyCoreDateFilter(from,to);else resetCoreDateFilter();
    reportNextAction=action==='share'?'share':'view';
    setTimeout(()=>{
      const live=q('#reportDoctorBtn');
      if(!live){mobileToast(ru()?'Не удалось открыть отчёт':'Could not open report','error');return}
      reportArmed=true;
      clearTimeout(window.__bpReportArmTimer);
      window.__bpReportArmTimer=setTimeout(()=>{reportArmed=false},3000);
      live.click();
      if(previous)setTimeout(()=>applyCoreDateFilter(previous[0],previous[1]),900);
    },260);
  }
  function openCustomReportPeriod(action){
    const sheet=makeSheet('mobileCustomPeriodSheet',ru()?'Свой период':'Custom period');
    q('.mobile-sheet-title',sheet).textContent=ru()?'Свой период отчёта':'Custom report period';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
    const wrap=document.createElement('div');wrap.className='mobile-custom-period';
    wrap.innerHTML='<label><span>'+(ru()?'С даты':'From')+'</span><input type="date" data-period="from"></label><label><span>'+(ru()?'По дату':'To')+'</span><input type="date" data-period="to"></label><div class="mobile-custom-period-actions"><button type="button" class="outline" data-period-action="cancel">'+(ru()?'Отмена':'Cancel')+'</button><button type="button" data-period-action="apply">'+(ru()?'Продолжить':'Continue')+'</button></div>';
    const today=localIsoDate(),from=dateMinusDays(29);
    q('[data-period="from"]',wrap).value=from;q('[data-period="to"]',wrap).value=today;
    q('[data-period-action="cancel"]',wrap).onclick=()=>closeMobileSheet(sheet);
    q('[data-period-action="apply"]',wrap).onclick=()=>{
      const f=q('[data-period="from"]',wrap).value,t=q('[data-period="to"]',wrap).value;
      if(!f||!t||f>t){mobileToast(ru()?'Проверьте даты периода':'Check the date range','error');return}
      closeMobileSheet(sheet);runDoctorReport(action,f,t);
    };
    g.appendChild(wrap);openMobileSheet(sheet);
  }
  function openReportPeriodSheet(action='view'){
    const sheet=makeSheet('mobileReportPeriodSheet',ru()?'Период отчёта':'Report period');
    q('.mobile-sheet-title',sheet).textContent=ru()?'Период отчёта врачу':'Doctor report period';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';
    const options=[
      [7,l('Последние 7 дней','Last 7 days','Oxirgi 7 kun')],
      [14,l('Последние 14 дней','Last 14 days','Oxirgi 14 kun')],
      [30,l('Последние 30 дней','Last 30 days','Oxirgi 30 kun')],
      [0,l('Все данные','All data','Barcha ma’lumotlar')],
      ['custom',l('Свой период','Custom period','Maxsus davr')]
    ];
    options.forEach(([value,label])=>{
      const b=document.createElement('button');b.type='button';b.className='outline mobile-period-option';
      b.innerHTML='<span>'+label+'</span>'+svgIcon('chevron');
      b.onclick=()=>{
        closeMobileSheet(sheet);
        if(value==='custom'){setTimeout(()=>openCustomReportPeriod(action),80);return}
        reportPeriodDays=Number(value)||0;try{localStorage.setItem('bp_report_period_days',String(reportPeriodDays))}catch(_){}
        if(reportPeriodDays>0)runDoctorReport(action,dateMinusDays(reportPeriodDays-1),localIsoDate());
        else runDoctorReport(action,'','');
      };
      g.appendChild(b);
    });
    openMobileSheet(sheet);
  }

  async function nativeAutoBackup(reason='auto',quiet=true){
    if(!nativeBridge()||typeof nativeBridge().saveAutoBackup!=='function')return null;
    try{
      const payload=backupSnapshot();
      const res=await nativeCall('saveAutoBackup',{content:JSON.stringify(payload),reason});
      try{localStorage.setItem('bp_v12_auto_backup_ts',String(Date.now()))}catch(_){}
      if(!quiet)mobileToast(ru()?'Авто-бэкап создан':'Auto-backup created','success');
      return res;
    }catch(err){
      if(!quiet)mobileToast((ru()?'Не удалось создать авто-бэкап: ':'Could not create auto-backup: ')+(err?.message||err),'error',4200);
      return null;
    }
  }
  function scheduleAutoBackup(reason='periodic'){
    let last=0;try{last=Number(localStorage.getItem('bp_v12_auto_backup_ts')||0)}catch(_){}
    if(Date.now()-last<12*60*60*1000&&reason==='periodic')return;
    setTimeout(()=>nativeAutoBackup(reason,true),900);
  }
  async function restoreInternalBackup(name){
    try{
      const res=await nativeCall('readAutoBackup',{name});
      const obj=JSON.parse(res?.content||'');
      const ok=await mobileConfirm({
        title:ru()?'Восстановить авто-бэкап?':'Restore auto-backup?',
        message:ru()?'Текущие данные будут заменены выбранной автоматической копией.':'Current data will be replaced by the selected automatic backup.',
        confirmLabel:ru()?'Восстановить':'Restore',danger:true
      });
      if(!ok)return;
      await nativeAutoBackup('before-auto-restore',true);
      if(!restoreBackupObject(obj))throw new Error(ru()?'Неверный формат бэкапа':'Invalid backup format');
      try{localStorage.setItem('bp_v12_onboarding_done','1');localStorage.setItem('bp_v17_onboarding_done','1')}catch(_){}
      mobileToast(ru()?'Авто-бэкап восстановлен':'Auto-backup restored','success',1800);
      setTimeout(()=>location.reload(),850);
    }catch(err){mobileToast((ru()?'Не удалось восстановить авто-бэкап: ':'Could not restore auto-backup: ')+(err?.message||err),'error',4500)}
  }
  async function showAutoBackupSheet(){
    const sheet=makeSheet('mobileAutoBackupSheet',ru()?'Авто-бэкапы':'Auto-backups');
    const title=q('.mobile-sheet-title',sheet);
    title.innerHTML='<span>'+l('Автоматические копии','Automatic backups','Avtomatik nusxalar')+'</span><button type="button" class="mobile-sheet-close" aria-label="'+l('Закрыть','Close','Yopish')+'">×</button>';
    q('.mobile-sheet-close',sheet).onclick=()=>closeMobileSheet(sheet);
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='<div class="mobile-backup-loading">'+(ru()?'Загрузка…':'Loading…')+'</div>';
    openMobileSheet(sheet);
    try{
      const res=await nativeCall('listAutoBackups',{});
      const items=Array.isArray(res?.items)?res.items:[];
      g.innerHTML='';
      const create=document.createElement('button');create.type='button';create.className='mobile-backup-create';
      create.innerHTML=svgIcon('save')+'<span>'+(ru()?'Создать копию сейчас':'Create backup now')+'</span>';
      create.onclick=async()=>{await nativeAutoBackup('manual-auto',false);showAutoBackupSheet()};
      g.appendChild(create);
      if(!items.length){
        const empty=document.createElement('div');empty.className='mobile-backup-empty';empty.textContent=ru()?'Автоматических копий пока нет.':'No automatic backups yet.';g.appendChild(empty);return;
      }
      items.forEach(item=>{
        const row=document.createElement('button');row.type='button';row.className='outline mobile-backup-item';
        const when=new Date(Number(item.modified)||Date.now()).toLocaleString(ru()?'ru-RU':'en-US');
        row.innerHTML='<span><b>'+when+'</b><small>'+svgEsc(item.reason||'auto')+' · '+Math.max(1,Math.round((Number(item.size)||0)/1024))+' KB</small></span><span>›</span>';
        row.onclick=()=>restoreInternalBackup(item.name);g.appendChild(row);
      });
    }catch(err){g.innerHTML='<div class="mobile-backup-empty">'+(ru()?'Авто-бэкапы недоступны':'Auto-backups unavailable')+'</div>'}
  }

  function parseArchiveDate(text){
    const s=String(text||'').trim();
    let m=s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if(m)return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),12).getTime();
    m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(m)return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12).getTime();
    const t=Date.parse(s);return Number.isFinite(t)?t:0;
  }
  function applyArchiveView(archive){
    const host=q('#mobileArchiveCards',archive);if(!host)return;
    const cards=qa('.mobile-record-card',host);
    const now=new Date();now.setHours(23,59,59,999);
    const days=archivePeriod==='all'?0:Number(archivePeriod)||0;
    const cutoff=days?now.getTime()-(days-1)*86400000:0;
    const needle=String(archiveSearch||'').trim().toLocaleLowerCase();
    cards.forEach(card=>{
      const dateOk=!cutoff||Number(card.dataset.dateMs||0)>=cutoff;
      const searchOk=!needle||String(card.dataset.search||card.textContent||'').toLocaleLowerCase().includes(needle);
      card.hidden=!(dateOk&&searchOk);
    });
    const sorted=cards.slice().sort((a,b)=>archiveSort==='oldest'?Number(a.dataset.dateMs||0)-Number(b.dataset.dateMs||0):Number(b.dataset.dateMs||0)-Number(a.dataset.dateMs||0));
    sorted.forEach(card=>host.appendChild(card));
    const visible=cards.filter(x=>!x.hidden).length;
    const count=q('.mobile-archive-count',archive);
    if(count)count.textContent=l('Показано: ','Shown: ','Ko‘rsatilgan: ')+visible+' / '+cards.length;
    qa('#mobileArchiveTools [data-archive-period]',archive).forEach(b=>b.classList.toggle('active',b.dataset.archivePeriod===archivePeriod));
    const sort=q('#mobileArchiveSort',archive);if(sort)sort.innerHTML=svgIcon('reset')+'<span>'+(archiveSort==='newest'?l('Сначала новые','Newest first','Avval yangilari'):l('Сначала старые','Oldest first','Avval eskilari'))+'</span>';
    const search=q('#mobileArchiveSearch',archive);if(search&&search.value!==archiveSearch)search.value=archiveSearch;
    let empty=q('#mobileArchiveNoResults',archive);
    if(!empty){empty=document.createElement('div');empty.id='mobileArchiveNoResults';empty.className='mobile-archive-no-results';empty.setAttribute('role','status');empty.setAttribute('aria-live','polite');host.before(empty)}
    empty.textContent=l('По вашему запросу ничего не найдено.','No readings match your search.','Qidiruvga mos o‘lchov topilmadi.');
    empty.hidden=visible!==0||cards.length===0;
  }
  function archiveTools(archive){
    let tools=q('#mobileArchiveTools',archive);
    const host=q('#mobileArchiveCards',archive);if(!host)return;
    if(!tools){
      tools=document.createElement('section');tools.id='mobileArchiveTools';tools.setAttribute('aria-label',ru()?'Поиск и фильтры архива':'Archive search and filters');
      tools.innerHTML='<label class="mobile-archive-search-wrap"><span class="sr-only"></span>'+svgIcon('search')+'<input id="mobileArchiveSearch" type="search" autocomplete="off" enterkeyhint="search"><button type="button" id="mobileArchiveSearchClear"></button></label><div class="mobile-archive-periods"><button type="button" data-archive-period="all"></button><button type="button" data-archive-period="7">7</button><button type="button" data-archive-period="30">30</button><button type="button" data-archive-period="90">90</button></div><button type="button" id="mobileArchiveSort" class="outline"></button><div class="mobile-archive-count" aria-live="polite"></div>';
      host.before(tools);
      const search=q('#mobileArchiveSearch',tools),clear=q('#mobileArchiveSearchClear',tools);
      search.addEventListener('input',()=>{archiveSearch=search.value||'';try{localStorage.setItem('bp_archive_search_v15',archiveSearch)}catch(_){}applyArchiveView(archive)});
      clear.onclick=()=>{archiveSearch='';search.value='';try{localStorage.removeItem('bp_archive_search_v15')}catch(_){}applyArchiveView(archive);search.focus()};
      tools.onclick=e=>{
        const p=e.target.closest('[data-archive-period]');
        if(p){archivePeriod=p.dataset.archivePeriod;try{localStorage.setItem('bp_archive_period_v12',archivePeriod)}catch(_){}applyArchiveView(archive);return}
        if(e.target.closest('#mobileArchiveSort')){archiveSort=archiveSort==='newest'?'oldest':'newest';try{localStorage.setItem('bp_archive_sort_v12',archiveSort)}catch(_){}applyArchiveView(archive)}
      };
    }
    const search=q('#mobileArchiveSearch',tools),clear=q('#mobileArchiveSearchClear',tools),searchLabel=q('.mobile-archive-search-wrap .sr-only',tools);
    if(search){search.placeholder=ru()?'Поиск по архиву':'Search archive';search.setAttribute('aria-label',search.placeholder);search.value=archiveSearch}
    if(searchLabel)searchLabel.textContent=ru()?'Поиск по архиву':'Search archive';
    if(clear){clear.innerHTML=svgIcon('close');clear.setAttribute('aria-label',ru()?'Очистить поиск':'Clear search');clear.title=clear.getAttribute('aria-label')}
    q('[data-archive-period="all"]',tools).textContent=l('Все','All','Barchasi');
    q('[data-archive-period="7"]',tools).textContent=l('7 дн.','7 d','7 kun');
    q('[data-archive-period="30"]',tools).textContent=l('30 дн.','30 d','30 kun');
    q('[data-archive-period="90"]',tools).textContent=l('90 дн.','90 d','90 kun');
    qa('[data-archive-period]',tools).forEach(b=>b.setAttribute('aria-label',l('Период архива: ','Archive period: ','Arxiv davri: ')+b.textContent.trim()));
    applyArchiveView(archive);
  }
  const V17_ONBOARDING_KEY='bp_v17_onboarding_done';
  function onboardingIllustration(scene){
    const common='viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';
    if(scene==='measure')return '<div class="mobile-onboarding-scene" data-scene="measure"><svg '+common+'><defs><linearGradient id="ob1" x1="60" y1="26" x2="260" y2="196" gradientUnits="userSpaceOnUse"><stop stop-color="#2BC8E4"/><stop offset="1" stop-color="#087FB7"/></linearGradient></defs><circle cx="160" cy="110" r="92" fill="#1BC1DF" opacity=".08"/><rect x="76" y="28" width="168" height="164" rx="30" fill="#0D2334" stroke="#4CCAE0" stroke-opacity=".35" stroke-width="2"/><rect x="96" y="50" width="128" height="80" rx="20" fill="#112F43"/><text x="112" y="84" fill="#A8C6D5" font-size="13" font-family="sans-serif">SYS</text><text x="173" y="84" fill="#A8C6D5" font-size="13" font-family="sans-serif">DIA</text><text x="108" y="112" fill="white" font-size="27" font-weight="700" font-family="sans-serif">120</text><text x="176" y="112" fill="white" font-size="27" font-weight="700" font-family="sans-serif">80</text><path d="M103 153h22l8-17 13 35 13-27 9 14h45" stroke="url(#ob1)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="240" cy="57" r="24" fill="url(#ob1)"/><path d="M229 57h8l3-8 6 16 4-8h6" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    if(scene==='report')return '<div class="mobile-onboarding-scene" data-scene="report"><svg '+common+'><defs><linearGradient id="ob2" x1="90" y1="24" x2="236" y2="196" gradientUnits="userSpaceOnUse"><stop stop-color="#36D4E5"/><stop offset="1" stop-color="#0A86C2"/></linearGradient></defs><circle cx="160" cy="110" r="92" fill="#1BC1DF" opacity=".07"/><path d="M93 25h104l34 34v133c0 10-8 18-18 18H93c-10 0-18-8-18-18V43c0-10 8-18 18-18Z" fill="#0D2334" stroke="#4CCAE0" stroke-opacity=".34" stroke-width="2"/><path d="M197 25v34h34" stroke="#4CCAE0" stroke-opacity=".55" stroke-width="2"/><rect x="101" y="73" width="104" height="11" rx="5.5" fill="#27485C"/><rect x="101" y="96" width="72" height="9" rx="4.5" fill="#27485C"/><path d="M103 154l25-19 20 12 29-35 27 17" stroke="url(#ob2)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="234" cy="159" r="30" fill="url(#ob2)"/><path d="M220 160h27M238 150l10 10-10 10" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    return '<div class="mobile-onboarding-scene" data-scene="privacy"><svg '+common+'><defs><linearGradient id="ob3" x1="91" y1="24" x2="230" y2="194" gradientUnits="userSpaceOnUse"><stop stop-color="#36D9E7"/><stop offset="1" stop-color="#067CB6"/></linearGradient></defs><circle cx="160" cy="110" r="94" fill="#1BC1DF" opacity=".07"/><path d="M160 27 224 53v49c0 48-25 81-64 101-39-20-64-53-64-101V53l64-26Z" fill="#0D2334" stroke="url(#ob3)" stroke-width="3"/><rect x="127" y="94" width="66" height="57" rx="15" fill="url(#ob3)"/><path d="M141 94V82c0-12 8-22 19-22s19 10 19 22v12" stroke="#DDF8FC" stroke-width="6" stroke-linecap="round"/><circle cx="160" cy="119" r="7" fill="white"/><path d="M160 126v12" stroke="white" stroke-width="5" stroke-linecap="round"/><rect x="208" y="145" width="72" height="42" rx="13" fill="#102D40" stroke="#42C9DF" stroke-opacity=".45"/><text x="224" y="171" fill="#BDECF4" font-size="13" font-weight="700" font-family="sans-serif">AES-GCM</text></svg></div>';
  }
  function showOnboarding(force=false){
    let done=false;try{done=localStorage.getItem(V17_ONBOARDING_KEY)==='1'}catch(_){}
    if(done&&!force)return;
    let view=q('#mobileOnboarding');
    if(view?.classList.contains('open')&&!force)return;
    if(!view){
      view=document.createElement('div');view.id='mobileOnboarding';view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');
      view.innerHTML='<div class="mobile-onboarding-card"><div class="mobile-onboarding-top"><div class="mobile-onboarding-brand"><span>'+brandHeartIcon()+'</span><div><b>BP Diary</b><small>V18 · Security & Trust</small></div></div><button type="button" class="mobile-onboarding-skip"></button></div><div class="mobile-onboarding-visual"></div><div class="mobile-onboarding-copy"><div class="mobile-onboarding-step"></div><h2></h2><p></p></div><div class="mobile-onboarding-progress"><span><i></i></span><b></b></div><div class="mobile-onboarding-actions"><button type="button" class="outline mobile-onboarding-back"></button><button type="button" class="mobile-onboarding-next"></button></div></div>';
      document.body.appendChild(view);
    }
    const slides=ru()?[
      {scene:'measure',title:'Измерения без лишних шагов',text:'Быстро записывайте давление и пульс, а история, аналитика и цели остаются рядом и работают офлайн.'},
      {scene:'report',title:'Готовый отчёт для врача',text:'Выберите период и сохраните, распечатайте или отправьте аккуратный PDF прямо с телефона.'},
      {scene:'privacy',title:'Приватность и защита V18',text:'Системная блокировка приложения, защита экрана и AES‑GCM бэкап помогают держать личные данные под вашим контролем.'}
    ]:uz()?[
      {scene:'measure',title:'O‘lchovlar ortiqcha bosqichlarsiz',text:'Qon bosimi va pulsni tez kiriting. Tarix, tahlil va maqsadlar yoningizda va oflayn ishlaydi.'},
      {scene:'report',title:'Shifokor uchun tayyor hisobot',text:'Davrni tanlang va tartibli PDF’ni telefondan saqlang, chop eting yoki ulashing.'},
      {scene:'privacy',title:'V18 maxfiylik va himoya',text:'Tizim blokirovkasi, ekran himoyasi va AES‑GCM zaxira nusxasi shaxsiy ma’lumotlarni nazoratda saqlashga yordam beradi.'}
    ]:[
      {scene:'measure',title:'Measurements without extra steps',text:'Record blood pressure and pulse quickly while history, analytics and goals stay close and work offline.'},
      {scene:'report',title:'A doctor-ready report',text:'Choose a period and save, print or share a polished PDF directly from your phone.'},
      {scene:'privacy',title:'V18 privacy & security',text:'System app lock, screen privacy and AES-GCM protected backups keep personal data under your control.'}
    ];
    onboardingIndex=0;
    const render=()=>{
      const x=slides[onboardingIndex],progress=((onboardingIndex+1)/slides.length)*100;
      q('.mobile-onboarding-card',view)?.classList.toggle('is-first',onboardingIndex===0);
      q('.mobile-onboarding-visual',view).innerHTML=onboardingIllustration(x.scene);
      q('.mobile-onboarding-step',view).textContent=ru()
        ?'Шаг '+(onboardingIndex+1)+' из '+slides.length
        :uz()?((onboardingIndex+1)+' / '+slides.length+' qadam')
        :'Step '+(onboardingIndex+1)+' of '+slides.length;
      q('h2',view).textContent=x.title;q('p',view).textContent=x.text;
      const bar=q('.mobile-onboarding-progress i',view);if(bar)bar.style.width=progress+'%';
      q('.mobile-onboarding-progress b',view).textContent=(onboardingIndex+1)+' / '+slides.length;
      q('.mobile-onboarding-back',view).textContent=l('Назад','Back','Orqaga');
      q('.mobile-onboarding-back',view).style.visibility=onboardingIndex?'visible':'hidden';
      q('.mobile-onboarding-next',view).textContent=onboardingIndex===slides.length-1?l('Начать','Start','Boshlash'):l('Далее','Next','Keyingi');
      q('.mobile-onboarding-skip',view).textContent=l('Пропустить','Skip','O‘tkazib yuborish');
      localizeUzTree(view);
    };
    const finish=()=>{view.classList.remove('open');try{localStorage.setItem(V17_ONBOARDING_KEY,'1')}catch(_){}};
    q('.mobile-onboarding-back',view).onclick=()=>{if(onboardingIndex>0){onboardingIndex--;render()}};
    q('.mobile-onboarding-next',view).onclick=()=>{if(onboardingIndex<slides.length-1){onboardingIndex++;render()}else finish()};
    q('.mobile-onboarding-skip',view).onclick=finish;
    render();view.classList.add('open');
  }

  function installV12Hooks(){
    if(window.__bpV12Hooks)return;window.__bpV12Hooks=true;
    document.addEventListener('click',e=>{
      const id=e.target.closest?.('button')?.id;
      if(id==='saveBtn')setTimeout(()=>nativeAutoBackup('after-save',true),1100);
    },true);
    scheduleAutoBackup('periodic');
    setTimeout(()=>showOnboarding(false),600);
  }

  function spokenNumbers(text){
    return (String(text||'').match(/\d+/g)||[]).map(Number).filter(Number.isFinite);
  }

  async function nativeVoiceInput(){
    try{
      const res=await nativeCall('recognizeSpeech',{
        lang:ru()?'ru-RU':uz()?'uz-UZ':'en-US',
        prompt:l('Скажите: систолическое, диастолическое, пульс','Say: systolic, diastolic, pulse','Ayting: sistolik, diastolik, puls')
      });
      const nums=spokenNumbers(res?.text);
      if(nums.length<3){mobileToast(l('Не удалось распознать три числа. Например: 120 80 70','Could not recognize three numbers. Example: 120 80 70','Uchta son aniqlanmadi. Masalan: 120 80 70'),'error',3800);return}
      const round=Math.min(2,Math.max(0,activeRound));
      const left=['sys','dia','pulse'].map(p=>q('#m'+(round+1)+'_left_'+p));
      const right=['sys','dia','pulse'].map(p=>q('#m'+(round+1)+'_right_'+p));
      const leftFilled=left.slice(0,2).every(x=>Number(x?.value)>0);
      const target=leftFilled?right:left;
      target.forEach((el,i)=>{if(el)el.value=String(nums[i]||'')});
      target.forEach(el=>el?.dispatchEvent(new Event('input',{bubbles:true})));
      const card=qa('.measure-card')[round];if(card)updateRound(card.closest('.mobile-page-measure')||pages()[0]);
    }catch(err){
      if(!/cancel/i.test(String(err?.message||'')))mobileToast((ru()?'Голосовой ввод недоступен: ':'Voice input unavailable: ')+(err?.message||err),'error',4200);
    }
  }

  function currentSpeakText(){
    const round=Math.min(2,Math.max(0,activeRound))+1;
    for(const side of ['left','right']){
      const s=Number(q('#m'+round+'_'+side+'_sys')?.value)||0;
      const d=Number(q('#m'+round+'_'+side+'_dia')?.value)||0;
      const p=Number(q('#m'+round+'_'+side+'_pulse')?.value)||0;
      if(s>0&&d>0){
        return ru()
          ?'Замер '+round+', '+(side==='left'?'левая рука':'правая рука')+'. Давление '+s+' на '+d+(p>0?'. Пульс '+p:'')+'.'
          :uz()
            ?'O‘lchov '+round+', '+(side==='left'?'chap qo‘l':'o‘ng qo‘l')+'. Qon bosimi '+s+' ga '+d+(p>0?'. Puls '+p:'')+'.'
            :'Reading '+round+', '+side+' arm. Blood pressure '+s+' over '+d+(p>0?'. Pulse '+p:'')+'.';
      }
    }
    const recs=mobileFilteredRecords().slice().sort((a,b)=>String(a.date+a.time).localeCompare(String(b.date+b.time)));
    const rec=recs.at(-1);if(!rec)return '';
    const a=mobileRecordAverage(rec);
    return ru()
      ?'Последняя запись '+mobileDateLabel(rec)+'. Среднее давление '+Math.round(a.sys)+' на '+Math.round(a.dia)+(a.pulse>0?'. Пульс '+Math.round(a.pulse):'')+'.'
      :uz()
        ?'Oxirgi yozuv '+mobileDateLabel(rec)+'. O‘rtacha qon bosimi '+Math.round(a.sys)+' ga '+Math.round(a.dia)+(a.pulse>0?'. Puls '+Math.round(a.pulse):'')+'.'
        :'Latest record '+mobileDateLabel(rec)+'. Average blood pressure '+Math.round(a.sys)+' over '+Math.round(a.dia)+(a.pulse>0?'. Pulse '+Math.round(a.pulse):'')+'.';
  }

  async function nativeSpeak(){
    const text=currentSpeakText();
    if(!text){mobileToast(ru()?'Нет данных для озвучивания':'No data to speak','info');return}
    try{await nativeCall('speak',{text,lang:ru()?'ru-RU':uz()?'uz-UZ':'en-US'})}
    catch(err){mobileToast((ru()?'Не удалось озвучить: ':'Could not speak: ')+(err?.message||err),'error',4000)}
  }

  function backupSnapshot(){
    if(typeof window.buildFullBackup==='function')return window.buildFullBackup();
    throw new Error(ru()?'Функция резервной копии недоступна':'Backup function unavailable');
  }

  async function nativeSaveBackup(){
    try{
      const payload=backupSnapshot();
      const fileName='BP-Diary-backup-'+new Date().toISOString().slice(0,10)+'.json';
      const res=await nativeCall('saveTextFile',{content:JSON.stringify(payload,null,2),fileName,mime:'application/json'});
      if(res?.uri)localStorage.setItem('bp_last_backup_uri',res.uri);
      if(res?.name)localStorage.setItem('bp_last_backup_name',res.name);
      mobileToast((ru()?'Бэкап сохранён: ':'Backup saved: ')+(res?.name||fileName),'success',3200);
    }catch(err){if(!/cancel/i.test(String(err?.message||'')))mobileToast((ru()?'Не удалось сохранить бэкап: ':'Could not save backup: ')+(err?.message||err),'error',4300)}
  }

  function restoreBackupObject(b){
    const before={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('bp_'))before[k]=localStorage.getItem(k)}
    const rollback=()=>{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&k.startsWith('bp_'))localStorage.removeItem(k)}Object.entries(before).forEach(([k,v])=>localStorage.setItem(k,v))};
    try{
      if(window.validateBackupV2?.(b)){
        for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&k.startsWith('bp_'))localStorage.removeItem(k)}
        const p=window.sanitizePatients(b.patients);
        localStorage.setItem('bp_patients',JSON.stringify(p));
        localStorage.setItem('bp_patient_settings',JSON.stringify(window.sanitizeSettings(b.patientSettings)));
        for(const [id,arr] of Object.entries(b.dataByPatient)){
          if(!Object.prototype.hasOwnProperty.call(p,id))continue;
          localStorage.setItem('bp_data_'+id,JSON.stringify(arr.map(r=>{const x=window.sanitizeRecord(r);x.patientId=id;return x})));
        }
        if(['light','dark'].includes(b.theme))localStorage.setItem('bp_theme',b.theme);
        if(/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(b.reminderTime||''))localStorage.setItem('bp_reminder_time',b.reminderTime);
        localStorage.setItem('bp_lang',b.currentLang==='en'?'en':'ru');
        return true;
      }
      return false;
    }catch(err){rollback();throw err}
  }

  async function nativeRestoreBackup(){
    try{
      const initialUri=localStorage.getItem('bp_last_backup_uri')||'';
      const res=await nativeCall('openTextFile',{mime:'application/json',initialUri});
      const b=JSON.parse(res?.content||'');
      if(!await mobileConfirm({
        title:ru()?'Восстановить бэкап?':'Restore backup?',
        message:ru()?'Текущие данные приложения будут заменены данными из выбранного файла.':'Current app data will be replaced by the selected backup file.',
        confirmLabel:ru()?'Восстановить':'Restore',
        danger:true
      }))return;
      await nativeAutoBackup('before-manual-restore',true);
      if(!restoreBackupObject(b))throw new Error(ru()?'Неверный формат бэкапа':'Invalid backup format');
      try{localStorage.setItem('bp_v12_onboarding_done','1');localStorage.setItem('bp_v17_onboarding_done','1')}catch(_){}
      if(res?.uri)localStorage.setItem('bp_last_backup_uri',res.uri);
      if(res?.name)localStorage.setItem('bp_last_backup_name',res.name);
      mobileToast(ru()?'Бэкап восстановлен. Приложение будет перезапущено.':'Backup restored. The app will restart.','success',1800);
      setTimeout(()=>location.reload(),850);
    }catch(err){if(!/cancel/i.test(String(err?.message||'')))mobileToast((ru()?'Не удалось восстановить бэкап: ':'Could not restore backup: ')+(err?.message||err),'error',4500)}
  }

  function shareSummaryText(){
    const recs=mobileFilteredRecords().slice().sort((a,b)=>String(a.date+a.time).localeCompare(String(b.date+b.time)));
    if(!recs.length)return '';
    const avgs=recs.map(mobileRecordAverage).filter(a=>a.sys>0&&a.dia>0);
    if(!avgs.length)return '';
    const s=Math.round(avgs.reduce((x,a)=>x+a.sys,0)/avgs.length);
    const d=Math.round(avgs.reduce((x,a)=>x+a.dia,0)/avgs.length);
    const pv=avgs.filter(a=>a.pulse>0);const p=pv.length?Math.round(pv.reduce((x,a)=>x+a.pulse,0)/pv.length):0;
    const patient=q('#patientSelect')?.selectedOptions?.[0]?.textContent||'';
    const period=mobileDateLabel(recs[0])+' — '+mobileDateLabel(recs.at(-1));
    const lines=ru()
      ?['Дневник давления','Пациент: '+patient,'Период: '+period,'Сеансов: '+recs.length,'Среднее АД: '+s+'/'+d+' мм рт. ст.'].concat(p?['Средний пульс: '+p+' уд/мин']:[])
      :['Blood Pressure Diary','Patient: '+patient,'Period: '+period,'Sessions: '+recs.length,'Average BP: '+s+'/'+d+' mmHg'].concat(p?['Average pulse: '+p+' bpm']:[]);
    return lines.join('\n');
  }

  async function nativeShare(){
    const text=shareSummaryText();if(!text){mobileToast(ru()?'Нет данных для отправки':'No data to share','info');return}
    try{await nativeCall('shareText',{text,subject:ru()?'Дневник давления':'Blood Pressure Diary',title:ru()?'Поделиться через':'Share via'})}
    catch(err){mobileToast((ru()?'Не удалось открыть меню «Поделиться»: ':'Could not open share menu: ')+(err?.message||err),'error',4200)}
  }

  function installNativeActions(){
    if(window.__bpNativeActionsInstalled)return;
    window.__bpNativeActionsInstalled=true;
    document.addEventListener('click',e=>{
      const id=e.target.closest?.('button')?.id;
      if(!['voiceBtn','speakRecordBtn','fullBackupBtn','restoreBackupBtn'].includes(id))return;
      if(!nativeBridge())return;
      e.preventDefault();e.stopImmediatePropagation();
      if(id==='voiceBtn')nativeVoiceInput();
      else if(id==='speakRecordBtn')nativeSpeak();
      else if(id==='fullBackupBtn')nativeSaveBackup();
      else if(id==='restoreBackupBtn')nativeRestoreBackup();
    },true);
  }

  function brandHeartIcon(){
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="bpHeart" x1="9" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff746e"/><stop offset=".48" stop-color="#ef3339"/><stop offset="1" stop-color="#b90e24"/></linearGradient><radialGradient id="bpGlow" cx=".25" cy=".18" r=".85"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffe9ec"/></radialGradient></defs><rect x="2" y="2" width="60" height="60" rx="18" fill="url(#bpGlow)"/><circle cx="32" cy="31" r="24" fill="#ffb7be" opacity=".18"/><path d="M32 55C26 49 10 39 10 24c0-9 6.6-15 15-15 4.9 0 8.7 2.2 11 6 2.3-3.8 6.1-6 11-6 8.4 0 15 6 15 15 0 15-16 25-30 31Z" fill="url(#bpHeart)"/><path d="M18 18c4-5 11-6 16-2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" opacity=".48"/><path d="M16 31h9l3-8 6 18 4-10 3 5h7" fill="none" stroke="#fff" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function appBar(){
    let bar=q('#mobileAppBar');if(!bar){bar=document.createElement('header');bar.id='mobileAppBar';document.body.prepend(bar)}
    const code=appLang().toUpperCase();
    bar.innerHTML=`<button type="button" class="mobile-brand-mark mobile-brand-button" data-top="about" aria-label="${l('О продукте','About','Dastur haqida')}">${brandHeartIcon()}</button><div class="mobile-brand-copy"><strong>BP Diary</strong><span>${l('Дневник артериального давления','Blood pressure diary','Qon bosimi kundaligi')}</span></div><div class="mobile-top-actions"><button type="button" data-top="reminder" aria-label="${l('Напоминание','Reminder','Eslatma')}" title="${l('Напоминание','Reminder','Eslatma')}">${svgIcon('bell')}</button><button type="button" data-top="settings" aria-label="${l('Настройки','Settings','Sozlamalar')}" title="${l('Настройки','Settings','Sozlamalar')}">${svgIcon('settings')}</button><button type="button" data-top="lang" aria-label="${l('Язык','Language','Til')}">${code}</button><button type="button" data-top="theme" aria-label="${l('Тема','Theme','Mavzu')}">${svgIcon(document.body.classList.contains('dark')?'sun':'moon')}</button></div>`;
    bar.onclick=e=>{
      const b=e.target.closest('button[data-top]');if(!b)return;
      if(b.dataset.top==='about')showAboutSheet();
      else if(b.dataset.top==='reminder')showReminderSheet();
      else if(b.dataset.top==='settings')showSettingsSheet();
      else if(b.dataset.top==='lang')cycleMobileLanguage();
      else{
        document.body.classList.contains('dark')?proxy('lightThemeBtn'):proxy('darkThemeBtn');
        setTimeout(()=>{appBar();const ps=pages();if(ps[1])polishCharts(ps[1])},60);
      }
    };
    localizeUzTree(bar);return bar;
  }


  function hero(measure){
    let h=q('#mobileMeasureHero',measure);if(!h){h=document.createElement('section');h.id='mobileMeasureHero';h.innerHTML='<div class="mobile-hero-top"><div><div class="mobile-hero-eyebrow"></div><h2></h2></div><div class="mobile-hero-date"></div></div><div class="mobile-hero-chips"><span class="mobile-hero-chip" data-hero="patient"></span><span class="mobile-hero-chip" data-hero="context"></span><span class="mobile-hero-chip" data-hero="arm"></span></div>';const panel=q('.form-panel',measure);measure.insertBefore(h,panel||measure.firstChild)}
    return h;
  }
  function updateHero(measure){
    const h=q('#mobileMeasureHero',measure);if(!h)return;
    q('.mobile-hero-eyebrow',h).textContent=l('НОВЫЙ ЗАМЕР','NEW READING','YANGI O‘LCHOV');q('h2',h).textContent=l('Контроль давления','Blood pressure check','Qon bosimini nazorat qilish');
    const d=q('#recordDate')?.value||'',tm=q('#recordTime')?.value||'';q('.mobile-hero-date',h).textContent=[d,tm.slice(0,5)].filter(Boolean).join(' · ')||l('Сегодня','Today','Bugun');
    q('[data-hero="patient"]',h).textContent='👤 '+(q('#patientSelect')?.selectedOptions?.[0]?.textContent||l('Основной','Main','Asosiy'));
    q('[data-hero="context"]',h).textContent='⌂ '+(q('#bpContext')?.selectedOptions?.[0]?.textContent||'');q('[data-hero="arm"]',h).textContent='↔ '+(q('#primaryArm')?.selectedOptions?.[0]?.textContent||'');
    const id=q('#editIdField');if(id)id.placeholder=ru()?'авто':'auto';
  }

  function accordions(measure){
    const sections=qa('.profile-section',measure);
    sections.forEach(sec=>{
      sec.classList.remove('mobile-profile-first');
      if(sec.dataset.mobileAccordion)return;
      sec.dataset.mobileAccordion='1';const title=q('.profile-section-title',sec);if(!title)return;
      title.setAttribute('role','button');title.setAttribute('tabindex','0');title.setAttribute('aria-expanded','false');
      if(!sec.hidden)sec.classList.add('mobile-collapsed');
      const toggle=()=>{if(sec.hidden)return;const c=sec.classList.toggle('mobile-collapsed');title.setAttribute('aria-expanded',String(!c))};
      title.addEventListener('click',toggle);title.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
    });

    const cardioTitle=q('[data-i18n="cardiovascularProfile"]',measure);
    const cardioRow=cardioTitle?.closest('.date-time-row');
    if(cardioRow)cardioRow.classList.add('mobile-cardio-row');

    const targetInput=q('#targetSysMinInput',measure);
    const targetRow=targetInput?.closest('.target-row');
    if(targetRow)targetRow.classList.add('mobile-target-shell');

    const grid=q('.measures-grid',measure);if(grid&&!grid.previousElementSibling?.classList.contains('mobile-section-kicker')){const k=document.createElement('div');k.className='mobile-section-kicker';k.textContent=ru()?'● Измерения':'● Measurements';grid.before(k)}
  }

  function mobilePlaceholders(measure){
    for(let i=1;i<=3;i++)for(const side of ['left','right']){const s=q(`#m${i}_${side}_sys`,measure),d=q(`#m${i}_${side}_dia`,measure),p=q(`#m${i}_${side}_pulse`,measure);if(s){s.setAttribute('inputmode','numeric');s.placeholder=ru()?'САД':'SYS'}if(d){d.setAttribute('inputmode','numeric');d.placeholder=ru()?'ДАД':'DIA'}if(p){p.setAttribute('inputmode','numeric');p.placeholder=ru()?'Пульс':'Pulse'}}
    qa('input[type="number"]',measure).forEach(x=>x.setAttribute('inputmode',x.step&&x.step!=='1'?'decimal':'numeric'));
  }

  function roundDone(card){return !!qa('.bp-inputs',card).find(row=>{const v=qa('input',row).map(x=>Number(x.value)||0);return v[0]>0&&v[1]>0})}
  function measureStepper(measure){
    const grid=q('.measures-grid',measure);if(!grid)return;let st=q('#mobileMeasureStepper',measure);if(!st){st=document.createElement('div');st.id='mobileMeasureStepper';grid.before(st)}
    st.setAttribute('role','tablist');
    st.setAttribute('aria-label',l('Выбор замера','Reading selector','O‘lchovni tanlash'));
    st.innerHTML=[0,1,2].map(i=>`<button type="button" role="tab" data-round="${i}">${l('Замер','Round','O‘lchov')} ${i+1}</button>`).join('');
    const selectRound=i=>{activeRound=Math.max(0,Math.min(2,Number(i)||0));try{localStorage.setItem('bp_mobile_round',String(activeRound))}catch(_){}updateRound(measure)};
    st.onclick=e=>{const b=e.target.closest('[data-round]');if(!b)return;selectRound(b.dataset.round)};
    st.onkeydown=e=>{
      const b=e.target.closest('[data-round]');if(!b)return;
      const current=Number(b.dataset.round);let next=current;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(current+1)%3;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(current+2)%3;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=2;
      else return;
      e.preventDefault();selectRound(next);q(`#mobileMeasureStepper [data-round="${next}"]`,measure)?.focus();
    };
    if(!grid.dataset.mobileRoundBound){grid.dataset.mobileRoundBound='1';grid.addEventListener('input',()=>updateRound(measure))}
    updateRound(measure);
  }
  function updateRound(measure){
    const cards=qa('.measure-card',measure);if(!cards.length)return;if(activeRound<0||activeRound>=cards.length)activeRound=0;
    cards.forEach((c,i)=>{if(!c.id)c.id=`mobileMeasureRound${i+1}`;c.classList.toggle('mobile-round-active',i===activeRound)});
    qa('#mobileMeasureStepper [data-round]',measure).forEach((b,i)=>{
      const active=i===activeRound;
      b.classList.toggle('active',active);b.classList.toggle('done',roundDone(cards[i]));
      b.setAttribute('aria-selected',String(active));b.setAttribute('aria-controls',cards[i]?.id||'');b.tabIndex=active?0:-1;
    })
  }

  function measureActions(measure){
    const box=q('.action-buttons',measure);if(!box)return;let quick=q('#mobileMeasureQuickActions',measure);if(!quick){quick=document.createElement('div');quick.id='mobileMeasureQuickActions';quick.innerHTML=`<button type="button" class="outline mobile-secondary-btn" data-action="clear">${svgIcon('eraser')}<span></span></button><button type="button" class="outline mobile-secondary-btn" data-action="more">${svgIcon('more')}<span></span></button>`;box.after(quick);quick.onclick=e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='clear')proxy('clearFormBtn');else openMobileSheet(q('#mobileMeasureActionSheet'))}}
    q('[data-action="clear"] span',quick).textContent=ru()?'Очистить':'Clear';q('[data-action="more"] span',quick).textContent=ru()?'Ещё':'More';
    const sheet=makeSheet('mobileMeasureActionSheet',ru()?'Дополнительные действия':'More actions');q('.mobile-sheet-title',sheet).textContent=ru()?'Дополнительные действия':'More actions';const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';['voiceBtn','speakRecordBtn','fillLastBtn'].forEach(id=>{const src=q('#'+id);if(!src)return;const b=document.createElement('button');b.type='button';b.className='outline';b.innerHTML=src.innerHTML;b.onclick=()=>{closeMobileSheet(sheet);src.click()};g.appendChild(b)})
  }

  function disclaimer(){
    const n=q('#clinicalDisclaimer');if(!n)return;
    if(!n.dataset.mobileNote){
      n.dataset.mobileNote='1';n.dataset.mobileFullText=n.textContent.trim();n.classList.add('mobile-note-collapsed');
      n.addEventListener('click',()=>{
        const opening=!n.classList.contains('mobile-note-open');
        n.classList.toggle('mobile-note-open',opening);n.classList.toggle('mobile-note-collapsed',!opening);
        n.textContent=opening?(n.dataset.mobileFullText||''):(ru()?'Важная медицинская информация':'Important medical information');
      });
    }
    compactDisclaimer();
  }

  function chartDeck(analysis){
    let deck=q('#mobileChartDeck',analysis);const panels=qa('.chart-panel',analysis);
    if(!panels.length)return;
    if(!deck){deck=document.createElement('div');deck.id='mobileChartDeck';panels[0].before(deck)}
    panels.forEach(p=>{if(p.parentElement!==deck)deck.appendChild(p)});
  }

  function polishFilterBar(analysis){
    const group=q('.filter-group',analysis);if(!group)return;
    const inputs=qa('input',group).slice(0,2);
    inputs.forEach((input,i)=>{
      let wrap=input.parentElement?.classList.contains('mobile-date-field')?input.parentElement:null;
      if(!wrap){
        wrap=document.createElement('label');wrap.className='mobile-date-field';
        const small=document.createElement('small');
        input.before(wrap);wrap.appendChild(small);wrap.appendChild(input);
      }
      let small=q('small',wrap);if(!small){small=document.createElement('small');wrap.prepend(small)}
      small.textContent=ru()?(i===0?'С даты':'По дату'):(i===0?'From':'To');
    });
    const apply=q('#applyFilterBtn',group)||q('#applyFilterBtn');
    if(apply)apply.innerHTML=svgIcon('filter')+'<span>'+(ru()?'Фильтр':'Filter')+'</span>';
    const reset=q('#resetFilterBtn',group)||q('#resetFilterBtn');
    if(reset)reset.innerHTML=svgIcon('reset')+'<span>'+(ru()?'Сброс':'Reset')+'</span>';
  }

  function polishCharts(analysis){
    if(!window.Chart)return;
    const dark=document.body.classList.contains('dark');
    try{
      Chart.defaults.font.size=9;
      Chart.defaults.color=dark?'#91a6b8':'#6c8190';
      Chart.defaults.borderColor=dark?'rgba(92,116,136,.18)':'rgba(99,125,141,.16)';
    }catch(_){}
    qa('canvas',analysis).forEach(canvas=>{
      let ch=null;try{ch=Chart.getChart(canvas)}catch(_){}
      if(!ch)return;
      try{
        ch.options.responsive=true;ch.options.maintainAspectRatio=false;ch.options.animation=false;
        ch.options.plugins=ch.options.plugins||{};
        ch.options.plugins.legend=ch.options.plugins.legend||{};
        ch.options.plugins.legend.position='bottom';
        ch.options.plugins.legend.labels={...(ch.options.plugins.legend.labels||{}),font:{size:9},boxWidth:10,boxHeight:6,padding:7,usePointStyle:true};
        ch.options.scales=ch.options.scales||{};
        Object.values(ch.options.scales).forEach(scale=>{
          scale.grid=scale.grid||{};scale.grid.color=dark?'rgba(116,139,158,.12)':'rgba(112,137,151,.12)';
          scale.ticks=scale.ticks||{};scale.ticks.font={size:9};scale.ticks.padding=3;scale.ticks.maxRotation=0;scale.ticks.autoSkip=true;scale.ticks.maxTicksLimit=5;
          if(scale.title?.display)scale.title.font={size:9};
        });
        if(canvas.id==='pressureChart'||canvas.id==='pulseChart')ch.data.datasets?.forEach(ds=>{ds.pointRadius=3;ds.pointHoverRadius=4;ds.borderWidth=2});
        ch.resize();ch.update('none');
      }catch(_){}
    });
  }

  function compactDisclaimer(){
    const n=q('#clinicalDisclaimer');if(!n)return;
    if(!n.dataset.mobileFullText)n.dataset.mobileFullText=n.textContent.trim();
    if(n.classList.contains('mobile-note-collapsed')&&!n.classList.contains('mobile-note-open')){
      n.textContent=ru()?'Важная медицинская информация':'Important medical information';
    }
  }

  function enhanceAnalysis(analysis,archive){
    if(!analysis)return;
    let sub=q('.mobile-screen-subtitle',analysis);
    if(!sub){sub=document.createElement('div');sub.className='mobile-screen-subtitle';q('.card-header',analysis)?.after(sub)}
    sub.textContent=ru()?'Ключевые показатели и динамика':'Key metrics and trends';

    analyticsTabs(analysis);
    polishFilterBar(analysis);
    analyticsChartSelector(analysis);

    const cards=qa('.analysis-card',analysis);
    cards.forEach((card,i)=>{
      card.classList.toggle('mobile-kpi-primary',i<4);
      card.classList.toggle('mobile-kpi-secondary',i>=4&&i<6);
      card.classList.toggle('mobile-analytics-extra',i>=6);
      card.classList.remove('mobile-wide');
    });
    analyticsMoreSheet(analysis,cards);

    const count=qa('#tableBody tr[data-id]',archive).length;
    analysis.classList.toggle('mobile-no-data',!count);
    let empty=q('#mobileAnalyticsEmpty',analysis);
    if(!count){
      if(!empty){
        empty=document.createElement('section');empty.id='mobileAnalyticsEmpty';
        const tabs=q('#mobileAnalyticsTabs',analysis);tabs?.after(empty);
      }
      empty.innerHTML='<div class="mobile-empty-icon">'+svgIcon('chart')+'</div><strong>'+(ru()?'Аналитика появится после первого замера':'Analytics starts with your first reading')+'</strong><span>'+(ru()?'Сохраните измерение — показатели и графики построятся автоматически.':'Save a reading and metrics and charts will appear automatically.')+'</span><button type="button">'+svgIcon('plus')+'<span>'+(ru()?'Добавить замер':'Add reading')+'</span></button>';
      q('button',empty).onclick=()=>setTab('measure');
    }else empty?.remove();

    const cal=q('#calendarChart',analysis);
    if(cal){const wrap=cal.parentElement;wrap.classList.add('mobile-calendar-wrap');wrap.style.display='none'}

    qa('.chart-panel',analysis).forEach(panel=>{
      let n=q('.mobile-chart-empty',panel);
      if(!count){
        panel.classList.add('mobile-empty');
        if(!n){n=document.createElement('div');n.className='mobile-chart-empty';panel.appendChild(n)}
        n.textContent=ru()?'Добавьте измерения — график появится здесь':'Add readings — the chart will appear here';
      }else{panel.classList.remove('mobile-empty');n?.remove()}
    });

    applyAnalyticsMode(analysis);
    applyChartSelection(analysis);
    setTimeout(()=>{
      polishCharts(analysis);
      if(analyticsMode==='charts')refreshActiveChart(analysis,true);
    },40);
  }

  function parsePressure(text){const s=(text||'').trim();const m=s.match(/^(\d+)\/(\d+)(?:-(\d+|—))?$/);return m?{bp:`${m[1]}/${m[2]}`,pulse:m[3]&&m[3]!=='—'?m[3]:''}:{bp:s||'—',pulse:''}}
  function archiveCards(archive){
    let host=q('#mobileArchiveCards',archive);if(!host){host=document.createElement('div');host.id='mobileArchiveCards';const tc=q('.table-container',archive);archive.insertBefore(host,tc||null)}host.innerHTML='';const table=q('#recordsTable',archive);if(!table)return;
    const headers=qa('thead th',table).map(x=>x.textContent.trim()),rows=qa('tbody tr',table).filter(r=>r.dataset.id);if(!rows.length){host.innerHTML='<div class="mobile-archive-empty"><div class="mobile-empty-icon"><i class="fas fa-box-open"></i></div><strong>'+l('Архив пока пуст','Archive is empty','Arxiv hozircha bo‘sh')+'</strong><span>'+l('После сохранения замера он появится здесь.','Saved readings will appear here.','Saqlangan o‘lchov shu yerda ko‘rinadi.')+'</span><button type="button"><i class="fas fa-plus"></i> '+l('Добавить замер','Add reading','O‘lchov qo‘shish')+'</button></div>';q('.mobile-archive-empty button',host).onclick=()=>setTab('measure');return}
    rows.slice().reverse().forEach(row=>{const cells=qa('td',row);if(!cells.length)return;const strong=q('strong',cells[0]);const date=strong?.textContent.trim()||'';let time='';cells[0].childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())time=n.textContent.trim()});const avg=parsePressure(cells[cells.length-2]?.textContent);const card=document.createElement('article');card.className='mobile-record-card';
      const details=cells.slice(1,-2).map((cell,i)=>{const p=parsePressure(cell.textContent);if(!p.bp||p.bp==='—')return '';return `<div class="mobile-record-item"><small>${headers[i+1]||''}</small><strong>${p.bp}</strong>${p.pulse?`<em>${l('Пульс','Pulse','Puls')} ${p.pulse}</em>`:''}</div>`}).filter(Boolean).join('');
      card.innerHTML=`<div class="mobile-record-head"><div class="mobile-record-date">${date}<span class="mobile-record-time">${time}</span></div><div class="mobile-record-avg"><strong>${avg.bp}</strong><small>${avg.pulse?l('Пульс ','Pulse ','Puls ')+avg.pulse:l('Среднее','Average','O‘rtacha')}</small></div></div><div class="mobile-record-grid">${details}</div><div class="mobile-record-actions"></div>`;
      card.dataset.dateMs=String(parseArchiveDate(date));
      card.dataset.search=[date,time,...cells.slice(0,-1).map(x=>x.textContent.trim())].join(' ').toLocaleLowerCase();
      card.setAttribute('aria-label',(ru()?'Запись ':'Reading ')+date+(time?' '+time:'')+', '+(ru()?'среднее давление ':'average blood pressure ')+avg.bp);
      const dest=q('.mobile-record-actions',card);qa('button',cells[cells.length-1]).forEach(src=>{const isDelete=src.classList.contains('delete-btn');const b=document.createElement('button');b.type='button';b.className=isDelete?'danger':'outline';b.innerHTML=svgIcon(isDelete?'trash':'edit');b.setAttribute('aria-label',isDelete?(ru()?'Удалить':'Delete'):(ru()?'Изменить':'Edit'));b.onclick=async()=>{if(isDelete){await nativeAutoBackup('before-delete-record',true);const ok=await mobileConfirm({title:ru()?'Удалить запись?':'Delete reading?',message:ru()?'Эту запись нельзя будет вернуть без резервной копии. Автоматическая копия уже создана.':'This reading cannot be restored without a backup. An automatic backup has already been created.',confirmLabel:ru()?'Удалить':'Delete',danger:true});if(!ok)return;src.click();mobileToast(ru()?'Запись удалена':'Reading deleted','success');return}src.click();activeRound=0;try{localStorage.setItem('bp_mobile_round','0')}catch(_){}setTab('measure');setTimeout(()=>{const m=pages()[0];if(m){updateRound(m);updateHero(m)}},40)};dest.appendChild(b)});host.appendChild(card)});archiveTools(archive);
  }

  function archiveSheet(archive){
    let sub=q('.mobile-screen-subtitle',archive);
    if(!sub){sub=document.createElement('div');sub.className='mobile-screen-subtitle';q('.card-header',archive)?.after(sub)}
    sub.textContent=l('История измерений и данные','Measurement history and data','O‘lchovlar tarixi va ma’lumotlar');
    let more=q('.mobile-archive-more',archive);
    if(!more){more=document.createElement('button');more.type='button';more.className='outline mobile-archive-more';q('.card-header',archive)?.appendChild(more)}
    more.innerHTML=svgIcon('more')+'<span>'+(ru()?'Действия':'Actions')+'</span>';
    const sheet=makeSheet('mobileActionSheet',ru()?'Данные и действия':'Data & actions');
    q('.mobile-sheet-title',sheet).textContent=ru()?'Данные и действия':'Data & actions';
    const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';

    const share=document.createElement('button');share.type='button';share.className='mobile-action-blue';
    share.innerHTML=svgIcon('share')+'<span>'+(ru()?'Поделиться':'Share')+'</span>';
    share.onclick=()=>{closeMobileSheet(sheet);setTimeout(()=>requestShareDoctorReport(),100)};g.appendChild(share);

    const auto=document.createElement('button');auto.type='button';auto.className='mobile-action-blue';auto.innerHTML=svgIcon('save')+'<span>'+(ru()?'Авто-бэкапы':'Auto-backups')+'</span>';auto.onclick=()=>{closeMobileSheet(sheet);setTimeout(()=>showAutoBackupSheet(),90)};g.appendChild(auto);
    const protectedSave=document.createElement('button');protectedSave.type='button';protectedSave.className='mobile-action-blue';protectedSave.innerHTML=svgIcon('key')+'<span>'+(ru()?'Защищённый бэкап':'Protected backup')+'</span>';protectedSave.onclick=()=>{closeMobileSheet(sheet,true);setTimeout(nativeSaveProtectedBackup,90)};g.appendChild(protectedSave);
    const protectedRestore=document.createElement('button');protectedRestore.type='button';protectedRestore.className='mobile-action-blue';protectedRestore.innerHTML=svgIcon('restore')+'<span>'+(ru()?'Восстановить защищённый':'Restore protected')+'</span>';protectedRestore.onclick=()=>{closeMobileSheet(sheet,true);setTimeout(nativeRestoreProtectedBackup,90)};g.appendChild(protectedRestore);
    const allowed=['reportDoctorBtn','fullBackupBtn','restoreBackupBtn','clearAllBtn'];
    allowed.forEach(id=>{
      const src=q('#'+id,archive);if(!src)return;
      const b=document.createElement('button');b.type='button';b.className=id==='clearAllBtn'?'danger':'mobile-action-blue';
      const labels={
        reportDoctorBtn:ru()?'Отчёт врачу / PDF':'Doctor report / PDF',
        fullBackupBtn:ru()?'Полный бэкап':'Full backup',
        restoreBackupBtn:ru()?'Восстановить бэкап':'Restore backup',
        clearAllBtn:ru()?'Удалить всё':'Delete all'
      };
      const icons={reportDoctorBtn:'document',fullBackupBtn:'save',restoreBackupBtn:'restore',clearAllBtn:'trash'};
      b.innerHTML=svgIcon(icons[id])+'<span>'+labels[id]+'</span>';
      b.onclick=async()=>{closeMobileSheet(sheet);if(id==='reportDoctorBtn'){setTimeout(()=>openReportPeriodSheet('view'),90);return}if(id==='clearAllBtn'){await nativeAutoBackup('before-delete-all',true);const ok=await mobileConfirm({title:ru()?'Удалить все данные?':'Delete all data?',message:ru()?'Все сохранённые измерения будут удалены. Автоматическая резервная копия уже создана.':'All saved readings will be deleted. An automatic backup has already been created.',confirmLabel:ru()?'Удалить всё':'Delete all',danger:true});if(!ok)return}src.click()};
      g.appendChild(b);
    });
    more.onclick=()=>openMobileSheet(sheet);
  }

  function customScoreApplicability(){
    const sel=q('#scoreApplicability');if(!sel)return;
    sel.style.display='none';
    let trigger=q('#mobileScoreApplicabilityTrigger');
    if(!trigger){
      trigger=document.createElement('button');trigger.type='button';trigger.id='mobileScoreApplicabilityTrigger';trigger.className='mobile-choice-trigger';
      sel.after(trigger);
      trigger.onclick=()=>{
        const sheet=makeSheet('mobileChoiceSheet',ru()?'Применимость SCORE':'SCORE applicability');
        q('.mobile-sheet-title',sheet).textContent=ru()?'Применимость SCORE':'SCORE applicability';
        const grid=q('.mobile-sheet-grid',sheet);grid.innerHTML='';
        Array.from(sel.options).forEach(opt=>{
          const b=document.createElement('button');b.type='button';b.className='outline mobile-choice-option'+(opt.value===sel.value?' active':'');
          b.innerHTML='<span>'+opt.textContent+'</span><i class="fas '+(opt.value===sel.value?'fa-circle-check':'fa-circle')+'"></i>';
          b.onclick=()=>{sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));closeMobileSheet(sheet);setTimeout(()=>customScoreApplicability(),20)};
          grid.appendChild(b);
        });
        openMobileSheet(sheet);
      };
    }
    trigger.innerHTML='<span>'+(sel.selectedOptions?.[0]?.textContent||'')+'</span>'+svgIcon('chevron');
  }

  function nav(){
    let n=q('#mobileBottomNav');
    if(!n){n=document.createElement('nav');n.id='mobileBottomNav';document.body.appendChild(n)}
    n.setAttribute('aria-label',l('Основная навигация','Main navigation','Asosiy navigatsiya'));
    const items=[
      ['measure','stethoscope',l('Замер','Measure','O‘lchov')],
      ['analysis','chart',l('Аналитика','Analytics','Tahlil')],
      ['archive','archive',l('Архив','Archive','Arxiv')]
    ];
    n.innerHTML=items.map(([k,i,label])=>`<button type="button" data-tab="${k}" aria-label="${label}">${svgIcon(i)}<span>${label}</span></button>`).join('');
    n.onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)};
    localizeUzTree(n);return n;
  }

  function setTab(tab,scroll=true){
    if(!['measure','analysis','archive'].includes(tab))tab='measure';
    currentTab=tab;try{localStorage.setItem('bp_mobile_tab',tab)}catch(_){}
    qa('.mobile-page').forEach(p=>p.classList.toggle('mobile-hidden',p.dataset.mobilePage!==tab));
    qa('#mobileBottomNav [data-tab]').forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
    document.body.dataset.mobileTab=tab;
    if(tab==='analysis'){const ps=pages();setTimeout(()=>{if(ps[1]){enhanceAnalysis(ps[1],ps[2]);refreshActiveChart(ps[1],true)}},80)}
    if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }

  let lastRootBack=0,backHintTimer=null;
  function showBackHint(){
    let hint=q('#mobileBackHint');
    if(!hint){hint=document.createElement('div');hint.id='mobileBackHint';document.body.appendChild(hint)}
    hint.textContent=ru()?'Нажмите ещё раз для выхода':'Press Back again to exit';
    hint.classList.add('show');
    clearTimeout(backHintTimer);backHintTimer=setTimeout(()=>hint.classList.remove('show'),1700);
  }
  function handleAndroidBack(){
    const onboard=q('#mobileOnboarding.open');
    if(onboard){
      if(onboardingIndex>0)q('.mobile-onboarding-back',onboard)?.click();
      else q('.mobile-onboarding-skip',onboard)?.click();
      return 'handled';
    }
    const open=qa('#mobileAnalyticsSheet.open,#mobileActionSheet.open,#mobileMeasureActionSheet.open,#mobileChoiceSheet.open,#mobilePdfSheet.open,#mobileAboutSheet.open,#mobileConfirmSheet.open,#mobileReportPeriodSheet.open,#mobileCustomPeriodSheet.open,#mobileAutoBackupSheet.open,#mobileReminderSheet.open,#mobileSettingsSheet.open,#mobileUpdateSheet.open,#mobileSecretSheet.open,#mobileGuideSheet.open').at(-1);
    if(open){closeMobileSheet(open);return 'handled'}
    const report=q('#mobileReportViewer.open');if(report){report.classList.remove('open');return 'handled'}
    const focused=document.activeElement;
    if(focused&&/^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)){focused.blur();return 'handled'}
    if(currentTab!=='measure'){setTab('measure');return 'handled'}
    if(activeRound>0){activeRound--;try{localStorage.setItem('bp_mobile_round',String(activeRound))}catch(_){}const m=pages()[0];if(m)updateRound(m);return 'handled'}
    const now=Date.now();
    if(now-lastRootBack<1800){lastRootBack=0;return 'exit'}
    lastRootBack=now;showBackHint();return 'handled';
  }
  window.__bpHandleAndroidBack=handleAndroidBack;

  function applyAccessibility(measure,analysis,archive){
    [[measure,ru()?'Экран замера':'Measure screen'],[analysis,ru()?'Экран аналитики':'Analytics screen'],[archive,ru()?'Экран архива':'Archive screen']].forEach(([el,label])=>{if(el){el.setAttribute('role','region');el.setAttribute('aria-label',label)}});
    qa('input,select,textarea',document).forEach(el=>{
      if(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby'))return;
      const label=el.closest('.field')?.querySelector('label')?.textContent?.trim()||el.previousElementSibling?.textContent?.trim()||el.placeholder||el.name||el.id;
      if(label)el.setAttribute('aria-label',label);
    });
    qa('button',document).forEach(btn=>{
      if(btn.getAttribute('aria-label')||btn.textContent.trim())return;
      const label=btn.title||btn.dataset.top||btn.id;
      if(label)btn.setAttribute('aria-label',label);
    });
    qa('.profile-section-title',measure).forEach((title,index)=>{
      const section=title.parentElement;if(!section)return;
      if(!section.id)section.id='mobileProfileSection'+(index+1);
      title.setAttribute('aria-controls',section.id);title.setAttribute('aria-label',title.textContent.trim());
    });
    const analyticsTabs=q('#mobileAnalyticsTabs',analysis);
    if(analyticsTabs){analyticsTabs.setAttribute('role','tablist');qa('[data-mode]',analyticsTabs).forEach(btn=>{btn.setAttribute('role','tab');btn.setAttribute('aria-selected',String(btn.classList.contains('active')))})}
    const chartSelector=q('#mobileChartSelector',analysis);
    if(chartSelector){chartSelector.setAttribute('role','group');chartSelector.setAttribute('aria-label',ru()?'Выбор графика':'Chart selector');qa('[data-chart]',chartSelector).forEach(btn=>btn.setAttribute('aria-pressed',String(btn.classList.contains('active'))))}
    qa('canvas',analysis).forEach(canvas=>{canvas.setAttribute('role','img');if(!canvas.getAttribute('aria-label'))canvas.setAttribute('aria-label',ru()?'График показателей':'Health metrics chart')});
    const hero=q('#mobileMeasureHero',measure);if(hero)hero.setAttribute('aria-label',ru()?'Текущий замер':'Current reading');
    const viewer=q('#mobileReportViewer');if(viewer){viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label',ru()?'Отчёт для врача':'Doctor report')}
    const navEl=q('#mobileBottomNav');if(navEl)navEl.setAttribute('aria-label',ru()?'Основная навигация':'Main navigation');
  }

  function refreshText(){if(!mq.matches)return;const ps=pages();if(ps.length<3)return;const [m,a,r]=ps;appBar();updateHero(m);mobilePlaceholders(m);customScoreApplicability();polishControls(m);disclaimer();const kick=q('.mobile-section-kicker',m);if(kick)kick.textContent=l('● Измерения','● Measurements','● O‘lchovlar');measureStepper(m);measureActions(m);nav();archiveSheet(r);archiveCards(r);archiveTools(r);enhanceAnalysis(a,r);applyAccessibility(m,a,r);setTab(currentTab,false);localizeUzTree(document);syncUzLocalizationObserver()}

  function setup(force=false){if(rebuilding||!mq.matches||!q('#app'))return;const ps=pages();if(ps.length<3)return;rebuilding=true;if(observer)observer.disconnect();try{const [m,a,r]=ps;[[m,'measure'],[a,'analysis'],[r,'archive']].forEach(([p,k])=>{p.classList.add('mobile-page','mobile-page-'+k);p.dataset.mobilePage=k});document.body.classList.add('mobile-shell-ready');installReportBridge();installNativeActions();appBar();hero(m);accordions(m);mobilePlaceholders(m);customScoreApplicability();polishControls(m);measureStepper(m);measureActions(m);disclaimer();nav();archiveSheet(r);archiveCards(r);archiveTools(r);enhanceAnalysis(a,r);updateHero(m);applyAccessibility(m,a,r);['recordDate','recordTime','patientSelect','bpContext','primaryArm'].forEach(id=>{const el=q('#'+id);if(el&&!el.dataset.mobileHeroBound){el.dataset.mobileHeroBound='1';el.addEventListener('change',()=>updateHero(m))}});setTab(currentTab,false);installV12Hooks();localizeUzTree(document)}finally{rebuilding=false;const app=q('#app');if(observer&&app)observer.observe(app,{childList:true,subtree:true,characterData:true})}}
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>setup(),70)}
  document.addEventListener('DOMContentLoaded',async()=>{
    await initPrivacyProtection();
    if(await migrateLegacyReminderToNative()){location.reload();return}
    setup(true);
    try{if(sessionStorage.getItem('bp_v16_reminder_migrated_now')==='1'){sessionStorage.removeItem('bp_v16_reminder_migrated_now');setTimeout(()=>mobileToast(ru()?'Напоминание перенесено в Android. Проверьте разрешение уведомлений через колокольчик.':'Reminder moved to Android. Check notification permission from the bell.', 'info',4300),450)}}catch(_){}
    const app=q('#app');if(app){observer=new MutationObserver(ms=>{if(ms.every(m=>m.target.closest?.('#mobileArchiveCards,#mobileActionSheet,#mobileMeasureActionSheet,.mobile-chart-empty')))return;schedule()});observer.observe(app,{childList:true,subtree:true,characterData:true})}
    mq.addEventListener?.('change',()=>location.reload())
  });
})();
