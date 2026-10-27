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
 var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(function(){rm();badges();addSec();books();},120); }).observe(document.documentElement,{childList:true,subtree:true});
 function fixLessons(){ try{ SUBJECTS.forEach(function(s){ var t=LESSON_TOPICS&&LESSON_TOPICS[s.id]; if(t&&t.length&&s.lessons>t.length)s.lessons=t.length; }); }catch(e){} }
 var _R=window.render; if(typeof _R==='function'&&!_R.__pkc){ window.render=function(){ fixLessons(); return _R.apply(this,arguments); }; window.render.__pkc=1; }
 fixLessons(); badges(); rm();
})();
