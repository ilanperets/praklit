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
 var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(function(){rm();badges();addSec();books();dash();},120); }).observe(document.documentElement,{childList:true,subtree:true});
 function fixLessons(){ try{ SUBJECTS.forEach(function(s){ var t=LESSON_TOPICS&&LESSON_TOPICS[s.id]; if(t&&t.length&&s.lessons>t.length)s.lessons=t.length; }); }catch(e){} }
 var _R=window.render; if(typeof _R==='function'&&!_R.__pkc){ window.render=function(){ fixLessons(); return _R.apply(this,arguments); }; window.render.__pkc=1; }
 fixLessons(); badges(); rm();
})();
