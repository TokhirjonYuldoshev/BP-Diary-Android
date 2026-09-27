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
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>'
    }[name]||'';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
  }

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
    qa('#mobileAnalyticsTabs [data-mode]',analysis).forEach(b=>b.classList.toggle('active',b.dataset.mode===analyticsMode));
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
    qa('#mobileChartSelector [data-chart]',analysis).forEach(b=>b.classList.toggle('active',b.dataset.chart===activeMobileChart));
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
      host.innerHTML=mobileNoChartData(ru()?'Графики':'Charts',ru()?'Нет данных для выбранного периода':'No data for the selected period');
      return;
    }
    const labels=records.map(mobileDateLabel);
    const avgs=records.map(mobileRecordAverage);
    const titleMap=ru()?{
      pressureChart:'Динамика давления',pulseChart:'Динамика пульса',tempWeightChart:'Температура и вес',timeOfDayChart:'Среднее по времени суток',weekdayChart:'Среднее по дням недели'
    }:{
      pressureChart:'Blood pressure trend',pulseChart:'Pulse trend',tempWeightChart:'Temperature and weight',timeOfDayChart:'Average by time of day',weekdayChart:'Average by weekday'
    };
    const no=ru()?'Недостаточно данных для этого графика':'Not enough data for this chart';
    let body='',legend='';
    if(activeMobileChart==='pressureChart'){
      const sys=avgs.map(a=>Number(a.sys)||0),dia=avgs.map(a=>Number(a.dia)||0);
      body=mobileLineSvg([{values:sys},{values:dia}],labels,ru()?'мм рт. ст.':'mmHg');
      legend='<div class="mobile-native-legend"><span><i class="mchart-legend-0"></i>'+(ru()?'САД':'SYS')+'</span><span><i class="mchart-legend-1"></i>'+(ru()?'ДАД':'DIA')+'</span></div>';
    }else if(activeMobileChart==='pulseChart'){
      body=mobileLineSvg([{values:avgs.map(a=>Number(a.pulse)||0)}],labels,ru()?'уд/мин':'bpm');
    }else if(activeMobileChart==='tempWeightChart'){
      const temp=records.map(r=>Number(r.temperature)||0),weight=records.map(r=>Number(r.weight)||0);
      const tempSvg=mobileLineSvg([{values:temp}],labels,'°C',128);
      const weightSvg=mobileLineSvg([{values:weight}],labels,ru()?'кг':'kg',128);
      if(tempSvg||weightSvg)body='<div class="mobile-dual-charts">'+(tempSvg?'<div><small>'+(ru()?'Температура':'Temperature')+'</small>'+tempSvg+'</div>':'')+(weightSvg?'<div><small>'+(ru()?'Вес':'Weight')+'</small>'+weightSvg+'</div>':'')+'</div>';
    }else if(activeMobileChart==='timeOfDayChart'){
      const buckets=[[],[],[]];
      records.forEach((r,i)=>{const h=parseInt(String(r.time||'0').slice(0,2),10)||0;const v=Number(avgs[i].sys)||0;if(v>0)buckets[h<12?0:h<18?1:2].push(v)});
      const vals=buckets.map(a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0);
      body=mobileBarSvg(vals,ru()?['Утро','День','Вечер']:['AM','Day','PM'],ru()?'мм рт. ст.':'mmHg');
    }else if(activeMobileChart==='weekdayChart'){
      const sums=Array(7).fill(0),cnt=Array(7).fill(0);
      records.forEach((r,i)=>{const d=new Date(String(r.date)+'T12:00:00');if(Number.isNaN(d.getTime()))return;const k=(d.getDay()+6)%7,v=Number(avgs[i].sys)||0;if(v>0){sums[k]+=v;cnt[k]++}});
      const vals=sums.map((s,i)=>cnt[i]?s/cnt[i]:0);
      body=mobileBarSvg(vals,ru()?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],ru()?'мм рт. ст.':'mmHg');
    }
    if(!body){host.innerHTML=mobileNoChartData(titleMap[activeMobileChart]||'',no);return}
    host.innerHTML='<div class="mobile-native-chart-head"><strong>'+svgEsc(titleMap[activeMobileChart]||'')+'</strong><span>'+records.length+' '+(ru()?'сеанс.':'sessions')+'</span></div>'+legend+body;
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
      sheet.classList.add('open');
    };
  }

  let reportArmed=false,nativeWindowOpen=null;
  function installReportBridge(){
    if(window.__bpMobileReportBridge)return;window.__bpMobileReportBridge=true;nativeWindowOpen=window.open.bind(window);
    document.addEventListener('click',e=>{if(e.target.closest?.('#reportDoctorBtn')){reportArmed=true;setTimeout(()=>{reportArmed=false},80)}},true);
    window.open=function(url,target,features){
      if(mq.matches&&reportArmed&&String(url||'')===''&&String(target||'')==='_blank'){
        let html='';return{document:{write(s){html+=String(s||'')},close(){showMobileReport(html)}},close(){}};
      }
      return nativeWindowOpen(url,target,features);
    };
  }
  function showMobileReport(html){
    const clean=String(html||'').replace(/<script>[\s\S]*?window\.print\([\s\S]*?<\/script>/i,'');
    let v=q('#mobileReportViewer');if(!v){v=document.createElement('div');v.id='mobileReportViewer';v.className='mobile-report-viewer';v.innerHTML='<div class="mobile-report-toolbar"><button type="button" class="outline mobile-report-close"></button><strong></strong><button type="button" class="outline mobile-report-print"></button></div><iframe title="Doctor report"></iframe>';document.body.appendChild(v)}
    q('.mobile-report-close',v).innerHTML=svgIcon('arrowLeft');q('.mobile-report-close',v).setAttribute('aria-label',ru()?'Назад':'Back');
    q('strong',v).textContent=ru()?'Отчёт для врача':'Doctor report';q('.mobile-report-print',v).innerHTML=svgIcon('print')+'<span>'+(ru()?'Печать / PDF':'Print / PDF')+'</span>';
    const frame=q('iframe',v);frame.srcdoc=clean;v.classList.add('open');q('.mobile-report-close',v).onclick=()=>v.classList.remove('open');q('.mobile-report-print',v).onclick=()=>{try{frame.contentWindow?.focus();frame.contentWindow?.print()}catch(_){}};
  }


  function makeSheet(id,title){
    let s=q('#'+id);if(s)return s;
    s=document.createElement('div');s.id=id;s.innerHTML='<div class="mobile-sheet-panel"><div class="mobile-sheet-handle"></div><div class="mobile-sheet-title"></div><div class="mobile-sheet-grid"></div></div>';
    document.body.appendChild(s);s.addEventListener('click',e=>{if(e.target===s)s.classList.remove('open')});q('.mobile-sheet-title',s).textContent=title;return s;
  }

  function appBar(){
    let bar=q('#mobileAppBar');if(!bar){bar=document.createElement('header');bar.id='mobileAppBar';document.body.prepend(bar)}
    bar.innerHTML=`<div class="mobile-brand-mark">${svgIcon('heart')}</div><div class="mobile-brand-copy"><strong>${ru()?'Давление':'BP Diary'}</strong><span>${ru()?'личный дневник здоровья':'personal health diary'}</span></div><div class="mobile-top-actions"><button type="button" data-top="lang" aria-label="Language">${ru()?'EN':'RU'}</button><button type="button" data-top="theme" aria-label="Theme">${svgIcon(document.body.classList.contains('dark')?'sun':'moon')}</button></div>`;
    bar.onclick=e=>{const b=e.target.closest('button[data-top]');if(!b)return;if(b.dataset.top==='lang'){proxy('langSwitchBtn');setTimeout(()=>{try{window.updateAllAnalytics?.();window.updateUITexts?.()}catch(_){}setup(true);refreshText()},90)}else{document.body.classList.contains('dark')?proxy('lightThemeBtn'):proxy('darkThemeBtn');setTimeout(()=>{appBar();const ps=pages();if(ps[1])polishCharts(ps[1])},60)}};
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
    const box=q('.action-buttons',measure);if(!box)return;let quick=q('#mobileMeasureQuickActions',measure);if(!quick){quick=document.createElement('div');quick.id='mobileMeasureQuickActions';quick.innerHTML=`<button type="button" class="outline mobile-secondary-btn" data-action="clear">${svgIcon('eraser')}<span></span></button><button type="button" class="outline mobile-secondary-btn" data-action="more">${svgIcon('more')}<span></span></button>`;box.after(quick);quick.onclick=e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='clear')proxy('clearFormBtn');else q('#mobileMeasureActionSheet')?.classList.add('open')}}
    q('[data-action="clear"] span',quick).textContent=ru()?'Очистить':'Clear';q('[data-action="more"] span',quick).textContent=ru()?'Ещё':'More';
    const sheet=makeSheet('mobileMeasureActionSheet',ru()?'Дополнительные действия':'More actions');q('.mobile-sheet-title',sheet).textContent=ru()?'Дополнительные действия':'More actions';const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';['voiceBtn','speakRecordBtn','fillLastBtn'].forEach(id=>{const src=q('#'+id);if(!src)return;const b=document.createElement('button');b.type='button';b.className='outline';b.innerHTML=src.innerHTML;b.onclick=()=>{sheet.classList.remove('open');src.click()};g.appendChild(b)})
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
    const headers=qa('thead th',table).map(x=>x.textContent.trim()),rows=qa('tbody tr',table).filter(r=>r.dataset.id);if(!rows.length){host.innerHTML='<div class="mobile-archive-empty"><div class="mobile-empty-icon"><i class="fas fa-box-open"></i></div><strong>'+(ru()?'Архив пока пуст':'Archive is empty')+'</strong><span>'+(ru()?'После сохранения замера он появится здесь.':'Saved readings will appear here.')+'</span><button type="button"><i class="fas fa-plus"></i> '+(ru()?'Добавить замер':'Add reading')+'</button></div>';q('.mobile-archive-empty button',host).onclick=()=>setTab('measure');return}
    rows.slice().reverse().forEach(row=>{const cells=qa('td',row);if(!cells.length)return;const strong=q('strong',cells[0]);const date=strong?.textContent.trim()||'';let time='';cells[0].childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())time=n.textContent.trim()});const avg=parsePressure(cells[cells.length-2]?.textContent);const card=document.createElement('article');card.className='mobile-record-card';
      const details=cells.slice(1,-2).map((cell,i)=>{const p=parsePressure(cell.textContent);if(!p.bp||p.bp==='—')return '';return `<div class="mobile-record-item"><small>${headers[i+1]||''}</small><strong>${p.bp}</strong>${p.pulse?`<em>${ru()?'Пульс':'Pulse'} ${p.pulse}</em>`:''}</div>`}).filter(Boolean).join('');
      card.innerHTML=`<div class="mobile-record-head"><div class="mobile-record-date">${date}<span class="mobile-record-time">${time}</span></div><div class="mobile-record-avg"><strong>${avg.bp}</strong><small>${avg.pulse?(ru()?'Пульс ':'Pulse ')+avg.pulse:(ru()?'Среднее':'Average')}</small></div></div><div class="mobile-record-grid">${details}</div><div class="mobile-record-actions"></div>`;
      const dest=q('.mobile-record-actions',card);qa('button',cells[cells.length-1]).forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.className=i?'danger':'outline';b.innerHTML=svgIcon(i?'trash':'edit');b.setAttribute('aria-label',i?(ru()?'Удалить':'Delete'):(ru()?'Изменить':'Edit'));b.onclick=()=>src.click();dest.appendChild(b)});host.appendChild(card)});
  }

  function archiveSheet(archive){
    let sub=q('.mobile-screen-subtitle',archive);if(!sub){sub=document.createElement('div');sub.className='mobile-screen-subtitle';q('.card-header',archive)?.after(sub)}sub.textContent=ru()?'История измерений и экспорт данных':'Measurement history and data export';
    let more=q('.mobile-archive-more',archive);if(!more){more=document.createElement('button');more.type='button';more.className='outline mobile-archive-more';q('.card-header',archive)?.appendChild(more)}more.innerHTML=svgIcon('more')+'<span>'+(ru()?'Действия':'Actions')+'</span>';
    const sheet=makeSheet('mobileActionSheet',ru()?'Экспорт и данные':'Export & data');q('.mobile-sheet-title',sheet).textContent=ru()?'Экспорт и данные':'Export & data';const g=q('.mobile-sheet-grid',sheet);g.innerHTML='';qa('.toolbar button',archive).forEach(src=>{const b=document.createElement('button');b.type='button';b.className=src.className;b.innerHTML=src.innerHTML;b.onclick=()=>{sheet.classList.remove('open');src.click()};g.appendChild(b)});more.onclick=()=>sheet.classList.add('open')
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
          b.onclick=()=>{sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));sheet.classList.remove('open');setTimeout(()=>customScoreApplicability(),20)};
          grid.appendChild(b);
        });
        sheet.classList.add('open');
      };
    }
    trigger.innerHTML='<span>'+(sel.selectedOptions?.[0]?.textContent||'')+'</span>'+svgIcon('chevron');
  }

  function nav(){
    let n=q('#mobileBottomNav');if(!n){n=document.createElement('nav');n.id='mobileBottomNav';document.body.appendChild(n)}const items=ru()?[['measure','stethoscope','Замер'],['analysis','chart','Аналитика'],['archive','archive','Архив']]:[['measure','stethoscope','Measure'],['analysis','chart','Analytics'],['archive','archive','Archive']];n.innerHTML=items.map(([k,i,l])=>`<button type="button" data-tab="${k}">${svgIcon(i)}<span>${l}</span></button>`).join('');n.onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)};return n
  }
  function setTab(tab,scroll=true){if(!['measure','analysis','archive'].includes(tab))tab='measure';currentTab=tab;try{localStorage.setItem('bp_mobile_tab',tab)}catch(_){}qa('.mobile-page').forEach(p=>p.classList.toggle('mobile-hidden',p.dataset.mobilePage!==tab));qa('#mobileBottomNav [data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));document.body.dataset.mobileTab=tab;if(tab==='analysis'){const ps=pages();setTimeout(()=>{if(ps[1]){enhanceAnalysis(ps[1],ps[2]);refreshActiveChart(ps[1],true)}},80)}if(scroll)window.scrollTo({top:0,behavior:'smooth'})}

  function refreshText(){if(!mq.matches)return;const ps=pages();if(ps.length<3)return;const [m,a,r]=ps;appBar();updateHero(m);mobilePlaceholders(m);customScoreApplicability();polishControls(m);disclaimer();const kick=q('.mobile-section-kicker',m);if(kick)kick.textContent=ru()?'● Измерения':'● Measurements';measureStepper(m);measureActions(m);nav();archiveSheet(r);archiveCards(r);enhanceAnalysis(a,r);setTab(currentTab,false)}

  function setup(force=false){if(rebuilding||!mq.matches||!q('#app'))return;const ps=pages();if(ps.length<3)return;rebuilding=true;if(observer)observer.disconnect();try{const [m,a,r]=ps;[[m,'measure'],[a,'analysis'],[r,'archive']].forEach(([p,k])=>{p.classList.add('mobile-page','mobile-page-'+k);p.dataset.mobilePage=k});document.body.classList.add('mobile-shell-ready');installReportBridge();appBar();hero(m);accordions(m);mobilePlaceholders(m);customScoreApplicability();polishControls(m);measureStepper(m);measureActions(m);disclaimer();nav();archiveSheet(r);archiveCards(r);enhanceAnalysis(a,r);updateHero(m);['recordDate','recordTime','patientSelect','bpContext','primaryArm'].forEach(id=>{const el=q('#'+id);if(el&&!el.dataset.mobileHeroBound){el.dataset.mobileHeroBound='1';el.addEventListener('change',()=>updateHero(m))}});setTab(currentTab,false)}finally{rebuilding=false;const app=q('#app');if(observer&&app)observer.observe(app,{childList:true,subtree:true,characterData:true})}}
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>setup(),70)}
  document.addEventListener('DOMContentLoaded',()=>{setup(true);const app=q('#app');if(app){observer=new MutationObserver(ms=>{if(ms.every(m=>m.target.closest?.('#mobileArchiveCards,#mobileActionSheet,#mobileMeasureActionSheet,.mobile-chart-empty')))return;schedule()});observer.observe(app,{childList:true,subtree:true,characterData:true})}mq.addEventListener?.('change',()=>location.reload())});
})();
