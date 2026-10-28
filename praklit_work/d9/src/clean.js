/* ניקוי מסכים (שכבה נוספת): הסרת "מה חדש" ותגיות "חדש"; "מצב עורך" עובר להגדרות (מנהל בלבד) */
(function(){
 function rm(){ var f=document.getElementById('pk9Fab'); if(f)f.remove(); }
 function badges(){ try{ document.querySelectorAll('aside *,nav *,.side *').forEach(function(e){ if(!e.children.length&&e.textContent.trim()==='חדש'&&e.offsetWidth<80)e.remove(); }); }catch(e){} }
 function addSec(){
  var nav=document.querySelector('.s7-nav'); if(!nav||nav.querySelector('[data-k="edit"]'))return;
  var adm=false; try{adm=isAdmin();}catch(e){} if(!adm)return;
  var acc=nav.querySelector('a[data-k="adm"]');
  var a=document.createElement('a'); a.setAttribute('data-k','edit'); a.setAttribute('onclick',"s7Go('edit')");
  a.innerHTML=(acc?acc.querySelector('svg').outerHTML:'')+'<span>כלי עריכה</span>';
  nav.insertBefore(a,acc||null);
  var sec=document.createElement('section'); sec.className='s7-sec'; sec.id='s7-edit';
  sec.innerHTML='<div class="s7-h"><span class="ic">'+(acc?acc.querySelector('svg').outerHTML:'')+'</span><div><b>כלי עריכה</b><span>עריכה ישירה של סיכומים, פסיקה ושאלות על המסך (מנהל בלבד)</span></div></div>'
   +'<div class="panel"><div class="s7-edit"><div><b>מצב מנהל ועורך</b><span>'+(window.PK_EDITMODE?'פעיל כעת':'כבוי')+' · עריכה ישירה על המסכים, כולל הבנק שלי</span></div><button class="btn sm gold" onclick="pkToggleEditMode();setTimeout(function(){go(\'settings\')},50)">'+(window.PK_EDITMODE?'כיבוי':'הפעלה')+'</button></div></div>';
  var after=document.getElementById('s7-adm'); after?after.parentNode.insertBefore(sec,after):nav.parentNode.appendChild(sec);
 }

 /* חוברות להורדה: סיכום מלא, מרתון, שאלות אמריקאיות — אותו מקום ואותו עיצוב בכל קורס */
 var BOOK_READY={};
 var IC={summary:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6M9 7h3"/>',marathon:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',questions:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>'};
 var BOOKS=[['summary','סיכום מלא'],['marathon','מרתון'],['questions','שאלות אמריקאיות']];
 function books(){
  try{
   var w=document.querySelector('.c6-tools'); if(!w||w.querySelector('#pkBooksChip'))return;
   var id=STATE&&STATE.subject; if(!id)return; var ready=!!BOOK_READY[id];
   var chip=document.createElement('button'); chip.id='pkBooksChip'; chip.className='pk-bkchip'+(ready?'':' off');
   chip.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 19h14"/></svg>חוברות';
   var pop=document.createElement('div'); pop.className='pk-bkpop';
   pop.innerHTML=BOOKS.map(function(b){return '<div class="r"><svg viewBox="0 0 24 24">'+IC[b[0]]+'</svg><span>'+b[1]+'</span>'+(ready?'<i><button>PDF</button><button>Word</button></i>':'<em>בהכנה</em>')+'</div>';}).join('')
    +(ready?'<div class="th"><button class="on">יוקרתי</button><button>דיני משפחה</button></div>':'<div class="nt">יופיעו כשתוכן הקורס יושלם</div>');
   chip.onclick=function(e){e.stopPropagation();pop.classList.toggle('on');};
   document.addEventListener('click',function(e){if(!pop.contains(e.target))pop.classList.remove('on');});
   var holder=document.createElement('span'); holder.className='pk-bkwrap'; holder.appendChild(chip); holder.appendChild(pop);
   w.insertBefore(holder,w.firstChild);
  }catch(e){}
 }

 /* לוח בקרה: פריסה מצומצמת, בלי כפילויות, התראת בחינה, ניסוח ניטרלי */
 function dash(){
  try{
   var v=document.querySelector('#content .st7'); if(!v||v.getAttribute('data-pkd'))return; v.setAttribute('data-pkd','1');
   var hero=v.querySelector('.st7-hero');
   /* התראת בחינה קרובה */
   try{ var ex=(STATE.exams||[]).filter(function(e){return daysUntil(e.date)>=0&&daysUntil(e.date)<=21;}).sort(function(a,b){return new Date(a.date)-new Date(b.date);})[0];
    if(ex&&hero){ var n=daysUntil(ex.date), sj=SUBJECTS.find(function(x){return x.id===ex.subject;});
     var al=document.createElement('div'); al.className='pkd-alert'+(n<=7?' hot':'');
     al.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><div><b>'+(n===0?'הבחינה היום':n===1?'הבחינה מחר':'בחינה בעוד '+n+' ימים')+'</b><span>'+(sj?sj.name:(ex.title||ex.name||''))+'</span></div><button onclick="pkHubTab(\'h6Track\',\'exams\')">לתוכנית</button>';
     hero.after(al);} }catch(e){}
   /* כפתור חזרה יומית כפול בכותרת */
   v.querySelectorAll('.st7-hact button').forEach(function(b){ if((b.getAttribute('onclick')||'').indexOf("'review'")>=0)b.remove(); });
   /* טיימר כפול בשורת הקיצורים */
   v.querySelectorAll('.st7-mc').forEach(function(b){ if(/טיימר ויומן/.test(b.textContent))b.remove(); });
   /* כרטיסים ריקים מתכווצים */
   v.querySelectorAll('.st7-card').forEach(function(c){ var k=c.querySelector('.st7-kpis'); if(k&&/^\s*0:00/.test(k.textContent)&&/—/.test(k.textContent)){c.classList.add('pkd-compact');var ch=c.querySelector('.st7-chart');if(ch)ch.style.display='none';}
    if(c.querySelector('.st7-empty')||(/הוספת תאריך בחינה/.test(c.textContent)&&!c.querySelector('ol,li')))c.classList.add('pkd-compact'); });
   /* מסך נקי למשתמש חדש: אזורים ריקים מוסתרים עד שיש בהם נתונים */
   var cards=[].slice.call(v.querySelectorAll('.st7-card'));
   cards.forEach(function(c){ var h=(c.querySelector('h3')||{}).textContent||'';
    var k=c.querySelector('.st7-kpis'); var emptyWeek=k&&/^\s*0:00/.test(k.textContent)&&/—/.test(k.textContent)&&/השבוע שלי/.test(h);
    var emptyWeak=/הנושאים שכדאי לחזק/.test(h)&&c.querySelector('.st7-empty');
    var emptyPlan=/התוכנית שלי לבחינה/.test(h)&&/הוספת תאריך בחינה/.test(c.textContent);
    if(emptyWeek||emptyWeak){c.style.display='none';}
    if(emptyPlan){ var row=document.createElement('div'); row.className='pkd-slim'; row.innerHTML='<span>אין עדיין תאריך בחינה — המערכת תחלק לך את השיעורים לימים</span><button onclick="pkHubTab(\'h6Track\',\'exams\')">הוספת תאריך בחינה</button>'; (hero.nextElementSibling&&hero.nextElementSibling.classList.contains('pkd-alert')?hero.nextElementSibling:hero).after(row); c.style.display='none'; } });
   v.querySelectorAll('.st7-g2').forEach(function(g){ var vis=[].slice.call(g.children).filter(function(c){return c.style.display!=='none';}); if(!vis.length)g.style.display='none'; else if(vis.length===1)g.style.gridTemplateColumns='1fr'; });
   /* ניסוח ניטרלי */
   var rep=[[/ומה שאת כבר שולטת בו/g,'ומה ששלטת בו'],[/אחרי תרגול, השאלות שתטעי בהן יופיעו כאן\./g,'אחרי תרגול, שאלות שנענו לא נכון יופיעו כאן.'],[/שאלות שטעית בהן,/g,'שאלות שנענו לא נכון,']];
   var w=document.createTreeWalker(v,NodeFilter.SHOW_TEXT),n2; while(n2=w.nextNode()){ rep.forEach(function(r){ n2.nodeValue=n2.nodeValue.replace(r[0],r[1]); }); }
   /* הקורסים שלי: אייקון במקום אות, וגם הקורס של "המשך ללמוד" */
   var cg=v.querySelector('.st7-cg');
   if(cg){ var have={}; cg.querySelectorAll('.st7-cc').forEach(function(b){var m=(b.getAttribute('onclick')||'').match(/openCourse\('([^']+)'\)/); if(m)have[m[1]]=b;});
    var cb=v.querySelector('.st7-cont button'), cm=cb&&(cb.getAttribute('onclick')||'').match(/openCourse\('([^']+)'\)/);
    if(cm&&!have[cm[1]]&&have[Object.keys(have)[0]]){ var sj2=SUBJECTS.find(function(x){return x.id===cm[1];}); if(sj2){ var cl=have[Object.keys(have)[0]].cloneNode(true); cl.setAttribute('onclick',"openCourse('"+sj2.id+"')"); cl.querySelector('b').textContent=sj2.name; cl.querySelector('small').textContent=sj2.lessons+' שיעורים'; cl.querySelectorAll('small')[1]&&(cl.querySelectorAll('small')[1].textContent=subjProgress(sj2)+'% הושלם'); cg.insertBefore(cl,cg.firstChild); have[sj2.id]=cl; } }
    Object.keys(have).forEach(function(id){ var m=have[id].querySelector('.mono'),sj=SUBJECTS.find(function(x){return x.id===id;}); if(m&&sj&&ICONS[sj.ic]){ m.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">'+ICONS[sj.ic]+'</svg>'; } }); }
  }catch(e){}
 }

 /* פסיקה וחוק: סינון נקי, בלי תג "חלקי", בלי הערות-ריקות */
 function law(){
  try{
   document.querySelectorAll('.cl6-s input').forEach(function(i){['border','background','box-shadow','outline'].forEach(function(p){i.style.setProperty(p,p==='background'?'transparent':(p==='border'||p==='outline'?'0':'none'),'important');});i.style.setProperty('border-radius','0','important');});
   var f=document.querySelector('.cl6-f'); if(!f)return;
   if(!document.getElementById('pkLawCourse')){
    var chips=[].slice.call(document.querySelectorAll('.cl6-cc button')); if(chips.length){
     var sel=document.createElement('select'); sel.id='pkLawCourse'; sel.className='pk-lawsel';
     chips.forEach(function(b){ var m=(b.getAttribute('onclick')||'').match(/cl6C\('([^']*)'\)/); var nm=b.textContent.replace(/\d+\s*$/,'').trim()||'הכל'; var n=(b.querySelector('b')||{}).textContent||''; var o=document.createElement('option'); o.value=m?m[1]:''; o.textContent=nm+(n?' ('+n+')':''); if(b.classList.contains('on'))o.selected=true; sel.appendChild(o); });
     sel.onchange=function(){ cl6C(sel.value); };
     var first=f.querySelector('select'); f.insertBefore(sel,first||null); } }
   var on=document.querySelector('.cl6-cc button.on'),sl=document.getElementById('pkLawCourse'); if(on&&sl){var m2=(on.getAttribute('onclick')||'').match(/cl6C\('([^']*)'\)/); if(m2)sl.value=m2[1];}
   var ap=document.querySelector('.gl6-act'); if(ap&&!ap.classList.contains('pk-lawact')){ap.classList.add('pk-lawact'); if(f.parentNode)f.parentNode.insertBefore(ap,f);}
   document.querySelectorAll('.cl6-t').forEach(function(b){if(b.textContent.trim()==='רק מלאים')b.textContent='תקצירים מלאים בלבד';});
   document.querySelectorAll('#cl6Res .pa').forEach(function(e){e.remove();});
   document.querySelectorAll('#cl6Res .fu').forEach(function(e){if(e.textContent.trim()==='מלא')e.textContent='תקציר מלא';});
   document.querySelectorAll('#cl6Res .cl6-c').forEach(function(c){var b=c.querySelector('.hd b'); if(b&&b.textContent.trim()==='הערה')c.style.display='none';});
  }catch(e){}
 }

 function lawIdx(){
  try{ document.querySelectorAll('.ix6-c').forEach(function(c){ if(c.getAttribute('data-pkx'))return; c.setAttribute('data-pkx','1');
    var m=c.textContent.match(/(\d+)\s*סעיפים/); if(m&&+m[1]<3){ var h=c.querySelector('div,span'); var t=document.createElement('em'); t.className='pk-ixprep'; t.textContent='בהכנה'; c.insertBefore(t,c.firstChild); } }); }catch(e){}
 }

 /* תרגול חכם: כפתור אחד שבוחר מה לתרגל היום */
 function today(){
  try{
   var body=document.querySelector('.h6-body'); var tabs=document.querySelector('.h6-tabs .on');
   if(!body||!tabs||!/סימולטור בחינה/.test(tabs.textContent))return;
   var host=body.querySelector('.view')||body; if(document.getElementById('pkToday'))return;
   var st=srsStats(), weak=(STATE.wrongQ||[]).length, due=st.due||0, nu=Math.min(5,st.nu||0);
   var tot=Math.min(24,due+Math.min(weak,12)+nu); if(!tot)tot=Math.min(10,st.total||10); var mins=Math.max(5,Math.round(tot*0.85));
   var ex=(STATE.exams||[]).filter(function(e){return daysUntil(e.date)>=0;}).sort(function(a,b){return new Date(a.date)-new Date(b.date);})[0];
   var d=document.createElement('div'); d.id='pkToday'; d.className='pk-today';
   d.innerHTML='<div class="tx"><small>התרגול של היום</small><b>'+mins+' דקות · '+tot+' שאלות</b><span>'+(ex?'המערכת בחרה לפי הטעויות, כרטיסי החזרה ותאריך הבחינה (בעוד '+daysUntil(ex.date)+' ימים)':'המערכת בחרה לפי הטעויות וכרטיסי החזרה שלך')+'</span>'
    +'<div class="ch">'+(weak?'<i>'+Math.min(weak,12)+' מהטעויות שלי</i>':'')+(due?'<i>'+due+' כרטיסי חזרה</i>':'')+(nu?'<i>'+nu+' שאלות חדשות</i>':'')+'</div></div>'
    +'<button class="q6-ap" onclick="srsStart()">התחל תרגול ←</button>';
   host.insertBefore(d,host.firstChild);
  }catch(e){}
 }

 /* מוכנות לבחינה בלוח הבקרה */
 function ready(){
  try{
   var v=document.querySelector('#content .st7'); if(!v||v.querySelector('#pkReady'))return;
   var courses=[].slice.call(v.querySelectorAll('.st7-cc')).map(function(b){var m=(b.getAttribute('onclick')||'').match(/openCourse\('([^']+)'\)/);return m&&SUBJECTS.find(function(x){return x.id===m[1];});}).filter(Boolean);
   var ex=(STATE.exams||[]).filter(function(e){return daysUntil(e.date)>=0;});
   ex.forEach(function(e){var s=SUBJECTS.find(function(x){return x.id===e.subject;}); if(s&&courses.indexOf(s)<0)courses.unshift(s);});
   var rows=courses.map(function(s){var e=ex.filter(function(x){return x.subject===s.id;}).sort(function(a,b){return new Date(a.date)-new Date(b.date);})[0]; return {s:s,r:pk6Ready(s),d:e?daysUntil(e.date):null};}).filter(function(x){return x.r>0||x.d!==null;});
   if(!rows.length)return;
   rows.sort(function(a,b){return (a.d===null)-(b.d===null)||(a.d||0)-(b.d||0)||a.r-b.r;}); rows=rows.slice(0,4);
   var col=function(r){return r>=75?'#C9A24A':r>=45?'#7B1230':'#B0283F';};
   var card=document.createElement('div'); card.id='pkReady'; card.className='st7-card pkr';
   card.innerHTML='<h3>המוכנות שלך לבחינה</h3><div class="st7-sub">מחושבת מכמה חומר כיסית ומדיוק התשובות שלך בתרגול</div><div class="pkr-g">'
    +rows.map(function(x){return '<button class="pkr-i" onclick="openCourse(\''+x.s.id+'\')"><span class="ring" style="background:conic-gradient('+col(x.r)+' 0 '+x.r+'%,#EFE7D6 0)"><i>'+x.r+'%</i></span><b>'+x.s.name+'</b><small>'+(x.d===null?'ללא תאריך בחינה':x.d===0?'הבחינה היום':'בחינה בעוד '+x.d+' ימים')+'</small></button>';}).join('')+'</div>';
   var cc=v.querySelector('.st7-cg'); var target=cc&&cc.closest('.st7-card'); if(target)target.parentNode.insertBefore(card,target); else v.appendChild(card);
  }catch(e){}
 }
 var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(function(){rm();badges();addSec();books();dash();law();lawIdx();today();ready();polish();lockPod();},120); }).observe(document.documentElement,{childList:true,subtree:true});

 /* ליטוש מסכים: חזרה יומית, מחברת ריקה, כותרת כפולה בכלים, יומן, ספרייה */
 var THIN=['דיני בנקאות','קניין רוחני','משפט בינלאומי','ירושה ועיזבון','הוצאה לפועל','משפט מסחרי','אתיקה מקצועית'];
 function polish(){ var body=document.querySelector('.h6-body'); if(!body)return;
  var rs=body.querySelector('.rv-stats');
  if(rs&&!rs.dataset.pkp){ rs.dataset.pkp=1; var due=parseInt((rs.querySelector('.rv-due .v')||{}).textContent,10)||0; var card=rs.nextElementSibling;
   if(!due&&card&&/כרטיסים מחכים/.test(card.textContent)){ var p=card.querySelector('p'), b=card.querySelector('button'); var tot=(card.textContent.match(/\d[\d,]*/)||[''])[0];
    if(p)p.innerHTML='<b>סיימת את החזרות להיום.</b><br><span style="color:#7a6a5a">אפשר להתקדם ולהתחיל ללמוד כרטיסים חדשים מהמאגר ('+tot+' כרטיסים).</span>'; if(b)b.textContent='▶ למד כרטיסים חדשים'; }
   var q=rs.parentNode.querySelectorAll('p'); q.forEach(function(x){ if(x.textContent.indexOf('יותr')>=0)x.textContent=x.textContent.replace('יותr','יותר'); }); }
  var nw=body.querySelector('.nb-wrap');
  if(nw){ var empty=/אין סיכומים/.test((nw.querySelector('.nb-list')||{}).textContent||'');
   var ex=body.querySelector('.pkn-empty');
   if(empty&&!ex){ nw.style.display='none'; var d=document.createElement('div'); d.className='pkn-empty'; d.innerHTML='<div class="ic">📓</div><h3>המחברת שלך ריקה</h3><p>כל סיכום, הערה או חומר שתוסיף יישמרו כאן, מסודרים לפי קורס ושנה.</p><div class="ac"><button class="btn gold" data-a="new">+ סיכום חדש</button><button class="btn" data-a="up">📎 העלה חומרים</button></div>'; nw.parentNode.insertBefore(d,nw);
    d.addEventListener('click',function(e){ var a=e.target.getAttribute&&e.target.getAttribute('data-a'); if(!a)return; var bs=[].slice.call(body.querySelectorAll('button')); var t=bs.find(function(x){return !x.closest('.pkn-empty')&&(a==='new'?/\+ סיכום חדש/.test(x.textContent):/העלה חומרים/.test(x.textContent));}); if(t)t.click(); }); }
   if(!empty&&ex){ ex.remove(); nw.style.display=''; } }
 
 body.querySelectorAll('h2.section').forEach(function(h){ var t=h.textContent.trim(); var hh=document.querySelector('.h6-ttl h1'); if(hh&&t===hh.textContent.trim()&&!h.closest('.cl6'))h.style.display='none'; });
  body.querySelectorAll('.pd-card').forEach(function(c){ if(c.dataset.pkp)return; if(/השבוע שלי/.test(c.textContent)&&/\b0\s*דק/.test(c.textContent)){ c.dataset.pkp=1; var h=document.createElement('p'); h.className='pkn-hint'; h.textContent='התחל את הטיימר כדי לראות כאן את ההתקדמות השבועית שלך.'; c.appendChild(h); } });
  body.querySelectorAll('.l4-row.l4-it').forEach(function(r){ if(r.dataset.pkp)return; r.dataset.pkp=1; var tx=r.textContent;
   if(THIN.some(function(n){return tx.indexOf(n)>=0;})){ var tg=document.createElement('em'); tg.className='pkn-prep'; tg.textContent='בהכנה'; var h=r.querySelector('b,strong,.l4-t,h3')||r.children[1]||r; h.appendChild(tg); }
   r.querySelectorAll('*').forEach(function(x){ if(!x.children.length&&x.textContent.trim()==='0%'){ x.textContent='טרם התחלת'; x.className+=' pkn-new'; } }); });
 }

 function lockPod(){ document.querySelectorAll('.l5-tabs .l5-tab,.tabs .tab').forEach(function(b){ if(b.dataset.pks)return; if(/setTab\(['"]podcast['"]\)/.test(b.getAttribute('onclick')||'')){ b.dataset.pks=1; b.classList.add('pkn-lock'); var e=document.createElement('em'); e.className='pkn-soon'; e.textContent='🔒 בקרוב'; b.appendChild(e); } });
  try{ if(typeof STATE!=='undefined'&&STATE.lessonTab==='podcast'&&typeof setTab==='function')setTab('summary'); }catch(e){} }
 var _ST=window.setTab; if(typeof _ST==='function'&&!_ST.__pkc){ window.setTab=function(t){ if(t==='podcast'){ try{ (window.PK9&&PK9.toast)?PK9.toast('הפודקאסט יהיה זמין בקרוב'):0; }catch(e){} return; } return _ST.apply(this,arguments); }; window.setTab.__pkc=1; }
 function fixLessons(){ try{ SUBJECTS.forEach(function(s){ var t=LESSON_TOPICS&&LESSON_TOPICS[s.id]; if(t&&t.length&&s.lessons>t.length)s.lessons=t.length; }); }catch(e){} }
 var _R=window.render; if(typeof _R==='function'&&!_R.__pkc){ window.render=function(){ fixLessons(); return _R.apply(this,arguments); }; window.render.__pkc=1; }
 fixLessons(); badges(); rm();
})();
