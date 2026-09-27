(()=>{
  'use strict';
  const mq=window.matchMedia('(max-width:720px)');
  let observer=null, timer=null, rebuilding=false, currentTab='measure';
  try{currentTab=localStorage.getItem('bp_mobile_tab')||'measure'}catch(_){}
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ru=()=>document.documentElement.lang!=='en';
  const pages=()=>qa('#app > .card');

  function proxyClick(id){ q('#'+id)?.click(); }

  function appBar(){
    let bar=q('#mobileAppBar');
    if(bar)return bar;
    bar=document.createElement('header');bar.id='mobileAppBar';
    bar.innerHTML=`<div class="mobile-brand-mark">♥</div><div class="mobile-brand-copy"><strong>${ru()?'Давление':'BP Diary'}</strong><span>${ru()?'личный дневник здоровья':'personal health diary'}</span></div><div class="mobile-top-actions"><button type="button" data-top="lang" aria-label="Language">${ru()?'EN':'RU'}</button><button type="button" data-top="theme" aria-label="Theme">☾</button></div>`;
    bar.addEventListener('click',e=>{const b=e.target.closest('button[data-top]');if(!b)return;if(b.dataset.top==='lang'){proxyClick('langSwitchBtn');setTimeout(refreshText,30)}else{document.body.classList.contains('dark')?proxyClick('lightThemeBtn'):proxyClick('darkThemeBtn');setTimeout(refreshText,30)}});
    document.body.prepend(bar);return bar;
  }

  function hero(measure){
    let h=q('#mobileMeasureHero',measure);if(h)return h;
    h=document.createElement('section');h.id='mobileMeasureHero';
    h.innerHTML=`<div class="mobile-hero-top"><div><div class="mobile-hero-eyebrow"></div><h2></h2></div><div class="mobile-hero-date"></div></div><div class="mobile-hero-chips"><span class="mobile-hero-chip" data-hero="patient"></span><span class="mobile-hero-chip" data-hero="context"></span><span class="mobile-hero-chip" data-hero="arm"></span></div>`;
    const panel=q('.form-panel',measure);measure.insertBefore(h,panel||measure.firstChild);return h;
  }

  function updateHero(measure){
    const h=q('#mobileMeasureHero',measure);if(!h)return;
    q('.mobile-hero-eyebrow',h).textContent=ru()?'НОВЫЙ ЗАМЕР':'NEW READING';
    q('h2',h).textContent=ru()?'Контроль давления':'Blood pressure check';
    const d=q('#recordDate')?.value||'';const tm=q('#recordTime')?.value||'';
    q('.mobile-hero-date',h).textContent=[d,tm.slice(0,5)].filter(Boolean).join(' · ')||(ru()?'Сегодня':'Today');
    q('[data-hero="patient"]',h).textContent='👤 '+(q('#patientSelect')?.selectedOptions?.[0]?.textContent|| (ru()?'Основной':'Main'));
    q('[data-hero="context"]',h).textContent='⌂ '+(q('#bpContext')?.selectedOptions?.[0]?.textContent||'');
    q('[data-hero="arm"]',h).textContent='↔ '+(q('#primaryArm')?.selectedOptions?.[0]?.textContent||'');
  }

  function accordions(measure){
    qa('.profile-section',measure).forEach((sec,i)=>{
      if(sec.dataset.mobileAccordion)return;sec.dataset.mobileAccordion='1';
      const title=q('.profile-section-title',sec);if(!title)return;
      title.setAttribute('role','button');title.setAttribute('tabindex','0');title.setAttribute('aria-expanded','false');
      if(!sec.hidden)sec.classList.add('mobile-collapsed');
      const toggle=()=>{if(sec.hidden)return;const collapsed=sec.classList.toggle('mobile-collapsed');title.setAttribute('aria-expanded',String(!collapsed));};
      title.addEventListener('click',toggle);title.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    });
    const grid=q('.measures-grid',measure);if(grid&&!grid.previousElementSibling?.classList.contains('mobile-section-kicker')){const k=document.createElement('div');k.className='mobile-section-kicker';k.textContent=ru()?'● Измерения':'● Measurements';grid.before(k);}
  }

  function numericInputs(measure){
    qa('.bp-inputs input',measure).forEach(x=>x.setAttribute('inputmode','numeric'));
    qa('input[type="number"]',measure).forEach(x=>x.setAttribute('inputmode',x.step&&x.step!=='1'?'decimal':'numeric'));
  }

  function chartEmpty(analysis,archive){
    const noRows=!q('#tableBody tr[data-id]',archive);
    qa('.chart-panel',analysis).forEach(p=>{
      p.classList.toggle('mobile-empty',noRows);let n=q('.mobile-chart-empty',p);
      if(noRows&&!n){n=document.createElement('div');n.className='mobile-chart-empty';p.appendChild(n)}
      if(n)n.textContent=ru()?'Добавьте измерения — график появится здесь':'Add readings — the chart will appear here';
      if(!noRows&&n)n.remove();
    });
  }

  function archiveCards(archive){
    let host=q('#mobileArchiveCards',archive);if(!host){host=document.createElement('div');host.id='mobileArchiveCards';const tc=q('.table-container',archive);archive.insertBefore(host,tc||null)}
    host.innerHTML='';
    const table=q('#recordsTable',archive);if(!table)return;
    const headers=qa('thead th',table).map(x=>x.textContent.trim());
    const rows=qa('tbody tr',table).filter(r=>r.dataset.id);
    if(!rows.length){host.innerHTML=`<div class="mobile-archive-empty">${ru()?'Пока нет сохранённых измерений':'No saved readings yet'}</div>`;return}
    rows.forEach(row=>{
      const cells=qa('td',row);if(!cells.length)return;
      const card=document.createElement('article');card.className='mobile-record-card';
      const date=(cells[0]?.textContent||'').trim();const avg=(cells[cells.length-2]?.textContent||'—').trim();
      const details=cells.slice(1,-2).map((c,i)=>`<div class="mobile-record-item"><small>${headers[i+1]||''}</small><span>${(c.textContent||'—').trim()||'—'}</span></div>`).join('');
      card.innerHTML=`<div class="mobile-record-head"><div class="mobile-record-date">${date}</div><div class="mobile-record-avg">${avg}</div></div><div class="mobile-record-grid">${details}</div><div class="mobile-record-actions"></div>`;
      const dest=q('.mobile-record-actions',card);qa('button',cells[cells.length-1]).forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.className=i?'danger':'outline';b.innerHTML=src.innerHTML||src.textContent;b.addEventListener('click',()=>src.click());dest.appendChild(b)});
      host.appendChild(card);
    });
  }

  function actionSheet(archive){
    let more=q('.mobile-archive-more',archive);if(!more){more=document.createElement('button');more.type='button';more.className='outline mobile-archive-more';more.innerHTML='⋯ <span></span>';q('.card-header',archive)?.appendChild(more)}
    q('span',more).textContent=ru()?'Действия':'Actions';
    let sheet=q('#mobileActionSheet');if(!sheet){sheet=document.createElement('div');sheet.id='mobileActionSheet';sheet.innerHTML='<div class="mobile-sheet-panel"><div class="mobile-sheet-handle"></div><div class="mobile-sheet-title"></div><div class="mobile-sheet-grid"></div></div>';document.body.appendChild(sheet);sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.classList.remove('open')})}
    q('.mobile-sheet-title',sheet).textContent=ru()?'Экспорт и данные':'Export & data';
    const grid=q('.mobile-sheet-grid',sheet);grid.innerHTML='';
    qa('.toolbar button',archive).forEach(src=>{const b=document.createElement('button');b.type='button';b.className=src.className;b.innerHTML=src.innerHTML;b.addEventListener('click',()=>{sheet.classList.remove('open');src.click()});grid.appendChild(b)});
    more.onclick=()=>sheet.classList.add('open');
  }

  function nav(){
    let n=q('#mobileBottomNav');if(!n){n=document.createElement('nav');n.id='mobileBottomNav';document.body.appendChild(n)}
    const items=ru()?[["measure","fa-stethoscope","Замер"],["analysis","fa-chart-line","Аналитика"],["archive","fa-box-archive","Архив"]]:[["measure","fa-stethoscope","Measure"],["analysis","fa-chart-line","Analytics"],["archive","fa-box-archive","Archive"]];
    n.innerHTML=items.map(([k,i,l])=>`<button type="button" data-tab="${k}"><i class="fas ${i}"></i><span>${l}</span></button>`).join('');
    n.onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)};
    return n;
  }

  function setTab(tab,scroll=true){
    if(!['measure','analysis','archive'].includes(tab))tab='measure';
    currentTab=tab;
    try{localStorage.setItem('bp_mobile_tab',tab)}catch(_){}
    qa('.mobile-page').forEach(p=>p.classList.toggle('mobile-hidden',p.dataset.mobilePage!==tab));
    qa('#mobileBottomNav [data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
    document.body.dataset.mobileTab=tab;if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }

  function refreshText(){
    if(!mq.matches)return;const ps=pages();if(ps.length<3)return;
    const [m,a,r]=ps;const bar=q('#mobileAppBar');if(bar){q('.mobile-brand-copy strong',bar).textContent=ru()?'Давление':'BP Diary';q('.mobile-brand-copy span',bar).textContent=ru()?'личный дневник здоровья':'personal health diary';q('[data-top="lang"]',bar).textContent=ru()?'EN':'RU'}
    updateHero(m);const kick=q('.mobile-section-kicker',m);if(kick)kick.textContent=ru()?'● Измерения':'● Measurements';nav();actionSheet(r);archiveCards(r);chartEmpty(a,r);
    setTab(currentTab,false);
  }

  function setup(){
    if(rebuilding||!mq.matches)return;if(!q('#app'))return;const ps=pages();if(ps.length<3)return;
    rebuilding=true;try{
      const [measure,analysis,archive]=ps;
      [[measure,'measure'],[analysis,'analysis'],[archive,'archive']].forEach(([p,k])=>{p.classList.add('mobile-page','mobile-page-'+k);p.dataset.mobilePage=k});
      document.body.classList.add('mobile-shell-ready');appBar();hero(measure);accordions(measure);numericInputs(measure);nav();actionSheet(archive);archiveCards(archive);chartEmpty(analysis,archive);updateHero(measure);
      ['recordDate','recordTime','patientSelect','bpContext','primaryArm'].forEach(id=>{const el=q('#'+id);if(el&&!el.dataset.mobileHeroBound){el.dataset.mobileHeroBound='1';el.addEventListener('change',()=>updateHero(measure));}});
      setTab(currentTab,false);
    }finally{
      rebuilding=false;
      const app=q('#app');
      if(observer&&app)observer.observe(app,{childList:true,subtree:true,characterData:true});
    }
  }

  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      if(observer)observer.disconnect();
      setup();
      if(mq.matches){const ps=pages();if(ps.length>=3){archiveCards(ps[2]);chartEmpty(ps[1],ps[2]);updateHero(ps[0])}}
      const app=q('#app');if(observer&&app)observer.observe(app,{childList:true,subtree:true,characterData:true});
    },60);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setup();
    const app=q('#app');
    if(app){observer=new MutationObserver(ms=>{if(ms.every(m=>m.target.closest?.('#mobileArchiveCards,#mobileActionSheet,.mobile-chart-empty')))return;schedule()});observer.observe(app,{childList:true,subtree:true,characterData:true})}
    mq.addEventListener?.('change',()=>location.reload());
  });
})();
