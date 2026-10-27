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
 var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(function(){rm();badges();addSec();},120); }).observe(document.documentElement,{childList:true,subtree:true});
 function fixLessons(){ try{ SUBJECTS.forEach(function(s){ var t=LESSON_TOPICS&&LESSON_TOPICS[s.id]; if(t&&t.length&&s.lessons>t.length)s.lessons=t.length; }); }catch(e){} }
 var _R=window.render; if(typeof _R==='function'&&!_R.__pkc){ window.render=function(){ fixLessons(); return _R.apply(this,arguments); }; window.render.__pkc=1; }
 fixLessons(); badges(); rm();
})();
