(()=>{
  'use strict';
  const mq=window.matchMedia('(max-width:720px)');
  let observer=null,setupTimer=null;

  const isRu=()=>document.documentElement.lang!=='en';
  const directCards=()=>Array.from(document.querySelectorAll('#app > .card'));

  function enhanceArchiveRows(archive){
    const table=archive?.querySelector('#recordsTable');
    if(!table)return;
    const headers=Array.from(table.querySelectorAll('thead th')).map(th=>th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row=>{
      const cells=Array.from(row.children);
      if(!row.dataset.id){
        row.classList.add('mobile-empty-row');
        return;
      }
      cells.forEach((cell,i)=>{
        if(headers[i])cell.dataset.label=headers[i];
        cell.classList.toggle('mobile-record-date',i===0);
        cell.classList.toggle('mobile-record-average',i===cells.length-2);
        cell.classList.toggle('mobile-record-actions',i===cells.length-1);
      });
    });
  }

  function hasVisibleArchiveRecords(archive){
    return !!archive?.querySelector('#tableBody tr[data-id]');
  }

  function updateEmptyCharts(analysis,archive){
    if(!mq.matches||!analysis)return;
    const empty=!hasVisibleArchiveRecords(archive);
    analysis.querySelectorAll('.chart-panel').forEach(panel=>{
      panel.classList.toggle('mobile-empty',empty);
      let note=panel.querySelector('.mobile-chart-empty');
      if(empty){
        if(!note){
          note=document.createElement('div');
          note.className='mobile-chart-empty';
          panel.appendChild(note);
        }
        note.textContent=isRu()?'Нет данных для графика':'No chart data';
      }else if(note){
        note.remove();
      }
    });
  }

  function setTab(tab,scroll=true){
    if(!['measure','analysis','archive'].includes(tab))tab='measure';
    try{localStorage.setItem('bp_mobile_tab',tab)}catch(_){}
    document.body.classList.remove('mobile-tab-measure','mobile-tab-analysis','mobile-tab-archive');
    document.body.classList.add('mobile-tab-'+tab);
    document.querySelectorAll('.mobile-page').forEach(el=>el.classList.toggle('mobile-hidden',el.dataset.mobilePage!==tab));
    document.querySelectorAll('#mobileBottomNav button[data-tab]').forEach(btn=>{
      const active=btn.dataset.tab===tab;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-current',active?'page':'false');
    });
    if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }

  function ensureArchiveMenu(archive){
    const header=archive?.querySelector('.card-header');
    const toolbar=header?.querySelector('.toolbar');
    if(!header||!toolbar||header.querySelector('.mobile-archive-more'))return;
    const more=document.createElement('button');
    more.type='button';
    more.className='outline mobile-archive-more';
    more.innerHTML='<i class="fas fa-sliders"></i><span>'+(isRu()?'Действия':'Actions')+'</span>';
    more.setAttribute('aria-expanded','false');
    more.addEventListener('click',()=>{
      const open=archive.classList.toggle('mobile-tools-open');
      more.setAttribute('aria-expanded',String(open));
    });
    header.insertBefore(more,toolbar);
  }

  function buildNav(){
    document.getElementById('mobileBottomNav')?.remove();
    const nav=document.createElement('nav');
    nav.id='mobileBottomNav';
    nav.setAttribute('aria-label',isRu()?'Навигация приложения':'App navigation');
    const items=isRu()
      ?[['measure','fa-stethoscope','Замер'],['analysis','fa-chart-line','Аналитика'],['archive','fa-box-archive','Архив']]
      :[['measure','fa-stethoscope','Measure'],['analysis','fa-chart-line','Analytics'],['archive','fa-box-archive','Archive']];
    nav.innerHTML=items.map(([key,icon,label])=>'<button type="button" data-tab="'+key+'"><i class="fas '+icon+'"></i><span>'+label+'</span></button>').join('');
    nav.addEventListener('click',e=>{
      const btn=e.target.closest('button[data-tab]');
      if(btn)setTab(btn.dataset.tab);
    });
    document.body.appendChild(nav);
  }

  function cleanupDesktop(){
    document.body.classList.remove('mobile-shell-ready','mobile-tab-measure','mobile-tab-analysis','mobile-tab-archive');
    document.getElementById('mobileBottomNav')?.remove();
    document.querySelectorAll('.mobile-page').forEach(el=>el.classList.remove('mobile-hidden'));
  }

  function setup(){
    if(!mq.matches){
      cleanupDesktop();
      return;
    }
    const cards=directCards();
    if(cards.length<3)return;
    const measure=cards[0],analysis=cards[1],archive=cards[2];
    [[measure,'measure'],[analysis,'analysis'],[archive,'archive']].forEach(([el,key])=>{
      el.classList.add('mobile-page','mobile-page-'+key);
      el.dataset.mobilePage=key;
    });
    ensureArchiveMenu(archive);
    enhanceArchiveRows(archive);
    updateEmptyCharts(analysis,archive);
    buildNav();
    document.body.classList.add('mobile-shell-ready');
    let saved='measure';
    try{saved=localStorage.getItem('bp_mobile_tab')||'measure'}catch(_){}
    setTab(saved,false);
  }

  function scheduleSetup(){
    clearTimeout(setupTimer);
    setupTimer=setTimeout(setup,50);
  }

  function startObserver(){
    const app=document.getElementById('app');
    if(!app)return;
    observer?.disconnect();
    observer=new MutationObserver(scheduleSetup);
    observer.observe(app,{childList:true,subtree:true,characterData:true});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    setup();
    startObserver();
    mq.addEventListener?.('change',scheduleSetup);
    window.addEventListener('resize',scheduleSetup,{passive:true});
  });
})();