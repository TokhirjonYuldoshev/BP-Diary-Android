(()=>{
  'use strict';
  const mq=window.matchMedia('(max-width:720px), (max-width:1100px) and (hover:none) and (pointer:coarse)');
  let observer=null,timer=null,rebuilding=false,currentTab='measure',activeRound=0;
  try{currentTab=localStorage.getItem('bp_mobile_tab')||'measure';activeRound=Number(localStorage.getItem('bp_mobile_round')||0)||0}catch(_){}
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ru=()=>document.documentElement.lang!=='en';
  const pages=()=>qa('#app > .card');
  const proxy=id=>q('#'+id)?.click();

  function makeSheet(id,title){
    let s=q('#'+id);if(s)return s;
    s=document.createElement('div');s.id=id;s.innerHTML='<div class="mobile-sheet-panel"><div class="mobile-sheet-handle"></div><div class="mobile-sheet-title"></div><div class="mobile-sheet-grid"></div></div>';
    document.body.appendChild(s);s.addEventListener('click',e=>{if(e.target===s)s.classList.remove('open')});q('.mobile-sheet-title',s).textContent=title;return s;
  }

  function appBar(){
    let bar=q('#mobileAppBar');if(!bar){bar=document.createElement('header');bar.id='mobileAppBar';document.body.prepend(bar)}
    bar.innerHTML=`<div class="mobile-brand-mark"><i class="fas fa-heart-pulse"></i></div><div class="mobile-brand-copy"><strong>${ru()?'Давление':'BP Diary'}</strong><span>${ru()?'личный дневник здоровья':'personal health diary'}</span></div><div class="mobile-top-actions"><button type="button" data-top="lang" aria-label="Language">${ru()?'EN':'RU'}</button><button type="button" data-top="theme" aria-label="Theme"><i class="fas ${document.body.classList.contains('dark')?'fa-sun':'fa-moon'}"></i></button></div>`;
    bar.onclick=e=>{const b=e.target.closest('button[data-top]');if(!b)return;if(b.dataset.top==='lang'){proxy('langSwitchBtn');setTimeout(()=>{setup(true);refreshText()},60)}else{document.body.classList.contains('dark')?proxy('lightThemeBtn'):proxy('darkThemeBtn');setTimeout(()=>appBar(),30)}};
    return bar;
  }

  function hero(measure){
    let h=q('#mobileMeasureHero',measure);if(!h){h=document.createElement('section');h.id='mobileMeasureHero';h.innerHTML='<div class="mobile-hero-top"><div><div class="mobile-hero-eyebrow"></div><h2></h2></div><div class="mobile-hero-date"></div></div><div class="mobile-hero-chips"><span class="mobile-hero-chip" data-hero="patient"></span><span class="mobile-hero-chip" data-hero="context"></span><span class="mobile-hero-chip" data-hero="arm"></span></div>';const panel=q('.form-panel',measure);measure.insertBefore(h,panel||measure.firstChild)}
    return h;
  }
  function updateHero(measure){
    const h=q('#mobileMeasureHero',measure);if(!h)return;
    q('.mobile-hero-eyebrow',h).textContent=ru()?'НОВЫЙ ЗАМЕР':'NEW READING';q('h2',h).textContent=ru()?'Контроль давления':'Blood pressure check';
    const d=q('#recordDate')?.value||'',tm=q('#recordTime')?.value||'';q('.mobile-hero-date',h).textContent=[d,tm.slice(0,5)].filter(Boolean).join(' · ')||(ru()?'Сегодня':'Today');
    q('[data-hero="patient"]',h).textContent='👤 '+(q('#patientSelect')?.selectedOptions?.[0]?.textContent||(ru()?'Основной':'Main'));
    q('[data-hero="context"]',h).textContent='⌂ '+(q('#bpContext')?.selectedOptions?.[0]?.textContent||'');q('[data-hero="arm"]',h).textContent='↔ '+(q('#primaryArm')?.selectedOptions?.[0]?.textContent||'');
    const id=q('#editIdField');if(id)id.placeholder=ru()?'авто':'auto';
  }

  function accordions(measure){
    qa('.profile-section',measure).forEach(sec=>{if(sec.dataset.mobileAccordion)return;sec.dataset.mobileAccordion='1';const title=q('.profile-section-title',sec);if(!title)return;title.setAttribute('role','button');title.setAttribute('tabindex','0');title.setAttribute('aria-expanded','false');if(!sec.hidden)sec.classList.add('mobile-collapsed');const toggle=()=>{if(sec.hidden)return;const c=sec.classList.toggle('mobile-collapsed');title.setAttribute('aria-expanded',String(!c))};title.addEventListener('click',toggle);title.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
    const grid=q('.measures-grid',measure);if(grid&&!grid.previousElementSibling?.classList.contains('mobile-section-kicker')){const k=document.createElement('div');k.className='mobile-section-kicker';k.textContent=ru()?'● Измерения':'● Measurements';grid.before(k)}
  }

  function mobilePlaceholders(measure){
    for(let i=1;i<=3;i++)for(const side of ['left','right']){const s=q(`#m${i}_${side}_sys`,measure),d=q(`#m${i}_${side}_dia`,measure),p=q(`#m${i}_${side}_pulse`,measure);if(s){s.setAttribute('inputmode','numeric');s.placeholder=ru()?'САД':'SYS'}if(d){d.setAttribute('inputmode','numeric');d.placeholder=ru()?'ДАД':'DIA'}if(p){p.setAttribute('inputmode','numeric');p.placeholder=ru()?'Пульс':'Pulse'}}
    qa('input[type="number"]',measure).forEach(x=>x.setAttribute('inputmode',x.step&&x.step!=='1'?'decimal':'numeric'));
  }

  function roundDone(card){return !!qa('.bp-inputs',card).find(row=>{const v=qa('input',row).map(x=>Number(x.value)||0);return v[0]>0&&v[1]>0})}
  function measureStepper(measure){
    const grid=q('.measures-grid',measure);if(!grid)return;let st=q('#mobileMeasureStepper',measure);if(!st){st=document.createElement('div');st.id='mobileMeasureStepper';grid.before(st)}
    st.innerHTML=[0,1,2].map(i=>`<button type="button" data-round="${i}">${ru()?'Замер':'Round'} ${i+1}</button>`).join('');
    st.onclick=e=>{const b=e.target.closest('[data-round]');if(!b)return;activeRound=Number(b.dataset.round);try{localStorage.setItem('bp_mobile_round',String(activeRound))}catch(_){}updateRound(measure)};
    if(!grid.dataset.mobileRoundBound){grid.dataset.mobileRoundBound='1';grid.addEventListener('input',()=>updateRound(measure))}
    updateRound(measure);
  }
  function updateRound(measure){
    const cards=qa('.measure-card',measure);if(!cards.length)return;if(activeRound<0||activeRound>=cards.length)activeRound=0;
    cards.forEach((c,i)=>c.classList.toggle('mobile-round-active',i===activeRound));qa('#mobileMeasureStepper [data-round]',measure).forEach((b,i)=>{b.classList.toggle('active',i===activeRound);b.classList.toggle('done',roundDone(cards[i]))})
  }

  function measureActions(measure){
    const box=q('.action-buttons',measure);if(!box)return;let quick=q('#mobileMeasureQuickActions',measure);if(!quick){quick=document.createElement('div');quick.id='mobileMeasureQuickActions';quick.innerHTML=`<button type="button" class="outline mobile-secondary-btn" data-action="clear"><i class="fas fa-eraser"></i><span></span></button><button type="button" class="outline mobile-secondary-btn" data-action="more"><i class="fas fa-ellipsis"></i><span></span></button>`;box.after(quick);quick.onclick=e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='clear')proxy('clearFormBtn');else q('#mobileMeasureActionSheet')?.classList.add('open')}}
    q('[data-action="clear"] span',quick).textContent=ru()?'Очистить':'Clear';q('[data-action="more"] span',quick).textContent=ru()?'Ещё':'More';
    const sheet=makeSheet('mobileMeasureActionSheet',ru()?'Дополнительные действия':'More actions');q('.mobile-sheet-title',sheet).textContent=ru()?'Дополнительные действия':'More actions';const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';['voiceBtn','speakRecordBtn','fillLastBtn'].forEach(id=>{const src=q('#'+id);if(!src)return;const b=document.createElement('button');b.type='button';b.className='outline';b.innerHTML=src.innerHTML;b.onclick=()=>{sheet.classList.remove('open');src.click()};g.appendChild(b)})
  }

  function disclaimer(){const n=q('#clinicalDisclaimer');if(!n||n.dataset.mobileNote)return;n.dataset.mobileNote='1';n.classList.add('mobile-note-collapsed');n.addEventListener('click',()=>{n.classList.toggle('mobile-note-open');n.classList.toggle('mobile-note-collapsed')})}

  function enhanceAnalysis(analysis,archive){
    if(!analysis)return;let sub=q('.mobile-screen-subtitle',analysis);if(!sub){sub=document.createElement('div');sub.className='mobile-screen-subtitle';q('.card-header',analysis)?.after(sub)}sub.textContent=ru()?'Тренды, цели и ключевые показатели':'Trends, targets and key metrics';
    qa('.analysis-card',analysis).forEach(c=>{c.classList.toggle('mobile-wide',(c.textContent||'').trim().length>95||!!q('.progress-bar-container',c)||!!q('.achievement-badge',c))});
    const count=qa('#tableBody tr[data-id]',archive).length;const cal=q('#calendarChart',analysis);if(cal){const wrap=cal.parentElement;wrap.classList.add('mobile-calendar-wrap');let note=q('.mobile-calendar-note',wrap);if(count<2){cal.style.display='none';if(!note){note=document.createElement('div');note.className='mobile-calendar-note';wrap.appendChild(note)}note.textContent=ru()?'Календарная динамика появится после нескольких сеансов':'Calendar trend appears after several sessions'}else{cal.style.display='';note?.remove()}}
    qa('.chart-panel',analysis).forEach(p=>{let n=q('.mobile-chart-empty',p);if(!count){p.classList.add('mobile-empty');if(!n){n=document.createElement('div');n.className='mobile-chart-empty';p.appendChild(n)}n.textContent=ru()?'Добавьте измерения — график появится здесь':'Add readings — the chart will appear here'}else{p.classList.remove('mobile-empty');n?.remove()}})
  }

  function parsePressure(text){const s=(text||'').trim();const m=s.match(/^(\d+)\/(\d+)(?:-(\d+|—))?$/);return m?{bp:`${m[1]}/${m[2]}`,pulse:m[3]&&m[3]!=='—'?m[3]:''}:{bp:s||'—',pulse:''}}
  function archiveCards(archive){
    let host=q('#mobileArchiveCards',archive);if(!host){host=document.createElement('div');host.id='mobileArchiveCards';const tc=q('.table-container',archive);archive.insertBefore(host,tc||null)}host.innerHTML='';const table=q('#recordsTable',archive);if(!table)return;
    const headers=qa('thead th',table).map(x=>x.textContent.trim()),rows=qa('tbody tr',table).filter(r=>r.dataset.id);if(!rows.length){host.innerHTML=`<div class="mobile-archive-empty">${ru()?'Пока нет сохранённых измерений':'No saved readings yet'}</div>`;return}
    rows.slice().reverse().forEach(row=>{const cells=qa('td',row);if(!cells.length)return;const strong=q('strong',cells[0]);const date=strong?.textContent.trim()||'';let time='';cells[0].childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())time=n.textContent.trim()});const avg=parsePressure(cells[cells.length-2]?.textContent);const card=document.createElement('article');card.className='mobile-record-card';
      const details=cells.slice(1,-2).map((c,i)=>{const p=parsePressure(c.textContent);return `<div class="mobile-record-item"><small>${headers[i+1]||''}</small><strong>${p.bp}</strong>${p.pulse?`<em>${ru()?'Пульс':'Pulse'} ${p.pulse}</em>`:''}</div>`}).join('');
      card.innerHTML=`<div class="mobile-record-head"><div class="mobile-record-date">${date}<span class="mobile-record-time">${time}</span></div><div class="mobile-record-avg"><strong>${avg.bp}</strong><small>${avg.pulse?(ru()?'Пульс ':'Pulse ')+avg.pulse:(ru()?'Среднее':'Average')}</small></div></div><div class="mobile-record-grid">${details}</div><div class="mobile-record-actions"></div>`;
      const dest=q('.mobile-record-actions',card);qa('button',cells[cells.length-1]).forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.className=i?'danger':'outline';b.innerHTML=src.innerHTML||src.textContent;b.onclick=()=>src.click();dest.appendChild(b)});host.appendChild(card)});
  }

  function archiveSheet(archive){
    let sub=q('.mobile-screen-subtitle',archive);if(!sub){sub=document.createElement('div');sub.className='mobile-screen-subtitle';q('.card-header',archive)?.after(sub)}sub.textContent=ru()?'История измерений и экспорт данных':'Measurement history and data export';
    let more=q('.mobile-archive-more',archive);if(!more){more=document.createElement('button');more.type='button';more.className='outline mobile-archive-more';q('.card-header',archive)?.appendChild(more)}more.innerHTML=`<i class="fas fa-ellipsis"></i><span>${ru()?'Действия':'Actions'}</span>`;
    const sheet=makeSheet('mobileActionSheet',ru()?'Экспорт и данные':'Export & data');q('.mobile-sheet-title',sheet).textContent=ru()?'Экспорт и данные':'Export & data';const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';qa('.toolbar button',archive).forEach(src=>{const b=document.createElement('button');b.type='button';b.className=src.className;b.innerHTML=src.innerHTML;b.onclick=()=>{sheet.classList.remove('open');src.click()};g.appendChild(b)});more.onclick=()=>sheet.classList.add('open')
  }

  function nav(){
    let n=q('#mobileBottomNav');if(!n){n=document.createElement('nav');n.id='mobileBottomNav';document.body.appendChild(n)}const items=ru()?[['measure','fa-stethoscope','Замер'],['analysis','fa-chart-line','Аналитика'],['archive','fa-box-archive','Архив']]:[['measure','fa-stethoscope','Measure'],['analysis','fa-chart-line','Analytics'],['archive','fa-box-archive','Archive']];n.innerHTML=items.map(([k,i,l])=>`<button type="button" data-tab="${k}"><i class="fas ${i}"></i><span>${l}</span></button>`).join('');n.onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)};return n
  }
  function setTab(tab,scroll=true){if(!['measure','analysis','archive'].includes(tab))tab='measure';currentTab=tab;try{localStorage.setItem('bp_mobile_tab',tab)}catch(_){}qa('.mobile-page').forEach(p=>p.classList.toggle('mobile-hidden',p.dataset.mobilePage!==tab));qa('#mobileBottomNav [data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));document.body.dataset.mobileTab=tab;if(scroll)window.scrollTo({top:0,behavior:'smooth'})}

  function refreshText(){if(!mq.matches)return;const ps=pages();if(ps.length<3)return;const [m,a,r]=ps;appBar();updateHero(m);mobilePlaceholders(m);const kick=q('.mobile-section-kicker',m);if(kick)kick.textContent=ru()?'● Измерения':'● Measurements';measureStepper(m);measureActions(m);nav();archiveSheet(r);archiveCards(r);enhanceAnalysis(a,r);setTab(currentTab,false)}

  function setup(force=false){if(rebuilding||!mq.matches||!q('#app'))return;const ps=pages();if(ps.length<3)return;rebuilding=true;if(observer)observer.disconnect();try{const [m,a,r]=ps;[[m,'measure'],[a,'analysis'],[r,'archive']].forEach(([p,k])=>{p.classList.add('mobile-page','mobile-page-'+k);p.dataset.mobilePage=k});document.body.classList.add('mobile-shell-ready');appBar();hero(m);accordions(m);mobilePlaceholders(m);measureStepper(m);measureActions(m);disclaimer();nav();archiveSheet(r);archiveCards(r);enhanceAnalysis(a,r);updateHero(m);['recordDate','recordTime','patientSelect','bpContext','primaryArm'].forEach(id=>{const el=q('#'+id);if(el&&!el.dataset.mobileHeroBound){el.dataset.mobileHeroBound='1';el.addEventListener('change',()=>updateHero(m))}});setTab(currentTab,false)}finally{rebuilding=false;const app=q('#app');if(observer&&app)observer.observe(app,{childList:true,subtree:true,characterData:true})}}
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>setup(),70)}
  document.addEventListener('DOMContentLoaded',()=>{setup(true);const app=q('#app');if(app){observer=new MutationObserver(ms=>{if(ms.every(m=>m.target.closest?.('#mobileArchiveCards,#mobileActionSheet,#mobileMeasureActionSheet,.mobile-chart-empty')))return;schedule()});observer.observe(app,{childList:true,subtree:true,characterData:true})}mq.addEventListener?.('change',()=>location.reload())});
})();
