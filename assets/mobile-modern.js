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
      title.addEventListener('click',toggle);title.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
    });
    const grid=q('.measures-grid',measure);if(grid&&!grid.previousElementSibling?.classList.contains('mobile-section-kicker')){const k=document.createElement('div');k.className='mobile-section-kicker';k.textContent=ru()?'● Измерения':'● Measurements';grid.before(k)}
  }

  function numericInputs(measure){
    qa('.bp-inputs input',measure).forEach(x=>x.q�좷����q�b�y�