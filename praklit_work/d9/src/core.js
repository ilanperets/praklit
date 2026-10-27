/* ===== פרקליט · שכבת הדמו pk9: שתי מערכות, גופן קל, מתיחת פנים, מדריך הדמו ===== */
(function(){
if(window.__pk9)return; window.__pk9=true;
var LS={g:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},s:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function heb(s){return (String(s||'').match(/[א-ת]/g)||[]).length;}
var PK9=window.PK9={LS:LS,E:E,heb:heb,hooks:[]};

/* ---------- טוסט ---------- */
PK9.toast=function(msg,act,fn){ var t=document.getElementById('pk9Toast'); if(!t){t=document.createElement('div');t.id='pk9Toast';document.body.appendChild(t);}
  t.innerHTML='<span>'+E(msg)+'</span>'+(act?'<button>'+E(act)+'</button>':''); var b=t.querySelector('button'); if(b)b.onclick=function(){t.classList.remove('in');fn&&fn();};
  t.classList.add('in'); clearTimeout(PK9._tt); PK9._tt=setTimeout(function(){t.classList.remove('in');},act?5200:2600); };

/* ---------- אחרי כל רינדור ---------- */
var _q=false; function runHooks(){ _q=false; PK9.hooks.forEach(function(f){ try{f();}catch(e){console.warn('pk9 hook',e);} }); }
PK9.after=function(){ if(_q)return; _q=true; requestAnimationFrame(runHooks); };
function watch(){ var c=document.getElementById('content'), n=document.getElementById('nav');
  var mo=new MutationObserver(function(){ PK9.after(); });
  if(c)mo.observe(c,{childList:true}); if(n)mo.observe(n,{childList:true}); PK9.after(); }

/* ---------- גופנים ---------- */
var FONTS=[
 ['as','אסיסטנט','נקי ונעים, דומה לטאהומה · מומלץ'],
 ['hb','היבו','מודרני ואוורירי'],
 ['rb','רוביק','עגול וידידותי'],
 ['fr','פרנק רוהל','כותרות בסריף עדין'],
 ['d5','דוד קל','דוד במשקל בינוני'],
 ['cur','נוכחי','דוד מודגש — כמו היום']];
PK9.FONTS=FONTS;
PK9.setFont=function(k){ FONTS.forEach(function(f){document.body.classList.remove('pk9f-'+f[0]);}); document.body.classList.add('pk9f-'+k); LS.s('pk9_font2',k); PK9.panelSync&&PK9.panelSync(); };
PK9.setFace=function(on){ document.body.classList.toggle('pk9-face',!!on); LS.s('pk9_face',!!on); PK9.panelSync&&PK9.panelSync(); };

/* ---------- שתי מערכות ---------- */
PK9.sys=function(){ var s=LS.g('pk9_sys',null); var u=null; try{u=currentUser();}catch(e){} if(u&&u.role!=='admin'){ if(u.persona==='student')return 'study'; if(!s)return u.persona==='lawyer'?'firm':'study'; } return s||'study'; };
function applySys(){ var s=PK9.sys(); var _u=null; try{_u=currentUser();}catch(e){} document.body.classList.toggle('pk9-admin',!!(_u&&_u.role==='admin')); document.body.classList.toggle('pk9-sys-study',s==='study'); document.body.classList.toggle('pk9-sys-firm',s==='firm');
  var tag=document.querySelector('#sidebar .brand .tag'); if(tag){ if(!tag.dataset.pk9o)tag.dataset.pk9o=tag.textContent; tag.textContent=s==='firm'?'משרד · לעורכי דין':'לימודים · סטודנטים ומתמחים'; tag.classList.add('pk9-tag'); }
}
PK9.hooks.push(applySys);

function demoUser(per){ var name={student:'דנה כהן',intern:'נועם לוי',lawyer:'מיכל ברק'}[per]||'דנה כהן';
  var un='demo_'+per; var u=(typeof uByName==='function')?uByName(un):null;
  if(!u){ authSignup(un,name,'demo1234',per); u=uByName(un); seed(u); }
  else { AUTH.session=u.id; authSave(); }
  return u; }
function seed(u){ /* נתוני דוגמה לדמו: ימי למידה, סיכום במחברת */
  try{ var log={}; var d=new Date(); for(var i=1;i<120;i++){ var x=new Date(d); x.setDate(d.getDate()-i); var r=Math.sin(i*1.7)+Math.cos(i*.6); if(r>-.35||i<6){ log[x.toISOString().slice(0,10)]=Math.round(15+Math.abs(r)*48+(i%5)*6); } }
    LS.s('pk9_seedlog_'+u.id,log); }catch(e){} }
PK9.enter=async function(sys,per){
  LS.s('pk9_sys',sys);
  var cur=(typeof currentUser==='function')?currentUser():null;
  if(!cur||String(cur.user).indexOf('demo_')!==0||cur.persona!==per){ if(cur){ try{AUTH.session=null;authSave();resetUserState();}catch(e){} } demoUser(per); await enterApp(); }
  try{ var u=currentUser(); var log=LS.g('pk9_seedlog_'+u.id,null); if(log&&STATE.studyLog&&!Object.keys(STATE.studyLog).length){ Object.assign(STATE.studyLog,log); persist(); } }catch(e){}
  try{ var u2=currentUser(); if(!(STATE.notes||[]).some(function(n){return n.pk9demo===2;})&&window.PK9W){ STATE.notes.unshift(PK9W.sampleNote()); persist(); } }catch(e){}
  try{ pkSetMode(sys==='firm'?'firm':'study'); }catch(e){ render(); }
  gateHide(); applySys(); PK9.after(); };

/* ---------- מסך הכניסה (entry.js) ---------- */
function gateShow(){ if(window.PK9E)PK9E.show(); }
function gateHide(){ if(window.PK9E)PK9E.hide(); }
PK9.gate=gateShow; PK9.gateLogin=gateShow;
/* ---------- מתמחה: מבחן הלשכה בלוח הבקרה ---------- */
PK9.hooks.push(function(){
  if(typeof STATE==='undefined'||STATE.view!=='dashboard'||STATE.subject)return;
  var u=currentUser&&currentUser(); if(!u||u.persona!=='intern'||PK9.sys()!=='study')return;
  var c=document.getElementById('content'); if(!c||c.querySelector('#pk9Intern'))return;
  var hero=c.querySelector('.st7-hero'); if(!hero)return;
  var d=LS.g('pk9_bar_date',''); var days=d?Math.ceil((new Date(d)-new Date())/864e5):null;
  var subj=[['ethics','אתיקה מקצועית'],['civproc','סדר דין אזרחי'],['crimproc','סדר דין פלילי'],['evidence','דיני ראיות'],['contract','דיני חוזים'],['crime','דיני עונשין']];
  var el=document.createElement('div'); el.id='pk9Intern'; el.className='pk9-int';
  el.innerHTML='<div class="pk9-int-h"><div><div class="pk9-k">מתמחה · הדרך למבחן הלשכה</div><h3>'+(days!=null&&days>=0?'עוד <b>'+days+'</b> ימים למבחן':'מתי המבחן שלך?')+'</h3><p>'+(days!=null&&days>=0?'כל יום — שאלת לשכה אחת, חוק אחד ותיק אחד מהמשרד.':'מגדירים תאריך, והמערכת בונה תוכנית חזרה עד המבחן.')+'</p></div>'
   +'<label class="pk9-int-d">תאריך המבחן<input type="date" value="'+E(d)+'" onchange="PK9.LS.s(\'pk9_bar_date\',this.value);render()"></label></div>'
   +'<div class="pk9-int-g">'+subj.map(function(s){ var S=(typeof SUBJECTS!=='undefined')?SUBJECTS.find(function(x){return x.id===s[0];}):null; var p=0; try{p=S?Math.round(subjProgress(S)):0;}catch(e){} return '<button onclick="openCourse(\''+s[0]+'\')"><b>'+s[1]+'</b><i><em style="width:'+Math.max(4,p)+'%"></em></i><span>'+p+'%</span></button>'; }).join('')+'</div>'
   +'<div class="pk9-int-a"><button class="pk9-btn" onclick="pkHubTab(\'h6Practice\',\'bar\')">מבחני לשכה קודמים</button><button class="pk9-btn ghost" onclick="pkHub(\'h6Law\')">חוק ופסיקה</button><button class="pk9-btn ghost" onclick="pkHubTab(\'h6Tools\',\'docs\')">כתבי טענות ומסמכים</button></div>';
  hero.parentNode.insertBefore(el,hero.nextSibling);
});

/* ---------- מה חדש (בגרסה האמיתית, פעם אחת) ---------- */
PK9.hooks.push(function(){ if(!window.PK9_PROD||typeof STATE==='undefined'||STATE.view!=='dashboard'||STATE.subject)return; if(LS.g('pk9_new_seen',0)>=1||PK9.sys()!=='study')return;
  var c=document.getElementById('content'); if(!c||c.querySelector('#pk9New'))return; var hero=c.querySelector('.st7-hero'); if(!hero)return;
  var el=document.createElement('div'); el.id='pk9New'; el.className='pk9-new';
  el.innerHTML='<div class="h"><div><div class="pk9-k">חדש בפרקליט</div><b>עשינו לך מקום ללמוד טוב יותר</b></div><button class="x" onclick="PK9.LS.s(\'pk9_new_seen\',1);this.closest(\'.pk9-new\').remove()" title="סגירה">✕</button></div><div class="g">'
   +[['📄','עורך מסמכים חכם','הערות, הערות שוליים, גרסאות וייצוא PDF',"pkHubTab('h6Notes','notebook')"],['📑','עורך PDF','סימון, חתימה, עמודים ומיזוג',"pkHubTab('h6Notes','pdf')"],['🧠','כלים חכמים במוח שלי','סיכום ב-3 רמות, השוואה ושאלות פתוחות',"pkHub('h6Brain')"],['⚡','לומדים בכיף','מבחן בזק, דו־קרב והלילה שלפני',"pkHub('h9Fun')"]].map(function(x){return '<button onclick="'+x[3]+'"><span>'+x[0]+'</span><b>'+x[1]+'</b><em>'+x[2]+'</em></button>';}).join('')+'</div>';
  hero.parentNode.insertBefore(el,hero.nextSibling); });

/* ---------- מדריך הדמו ---------- */
function sec(t,body){return '<div class="pk9p-s"><div class="pk9p-t">'+t+'</div>'+body+'</div>';}
function item(ic,t,s,js){return '<button class="pk9p-i" onclick="PK9.panel(false);'+js+'"><span class="ic">'+ic+'</span><span class="tx"><b>'+t+'</b><em>'+s+'</em></span><span class="go">←</span></button>';}
function panelHtml(){ var f=LS.g('pk9_font2','as'), face=document.body.classList.contains('pk9-face'), s=PK9.sys();
  var u=(typeof currentUser==='function')?currentUser():null;
  return '<div class="pk9p-hd"><div><div class="pk9-k">פרקליט · דמו</div><b>כל השדרוגים במקום אחד</b></div><button class="pk9p-x" onclick="PK9.panel(false)">✕</button></div><div class="pk9p-b">'
  +sec('שתי מערכות','<div class="pk9p-seg"><button class="'+(s==='study'?'on':'')+'" onclick="PK9.panel(false);PK9.enter(\'study\',\''+(u&&u.persona==='intern'?'intern':'student')+'\')">לימודים</button><button class="'+(s==='firm'?'on':'')+'" onclick="PK9.panel(false);PK9.enter(\'firm\',\'lawyer\')">משרד</button></div>'
    +(s==='study'?'<div class="pk9p-seg sm"><button class="'+(u&&u.persona!=='intern'?'on':'')+'" onclick="PK9.panel(false);PK9.enter(\'study\',\'student\')">סטודנט</button><button class="'+(u&&u.persona==='intern'?'on':'')+'" onclick="PK9.panel(false);PK9.enter(\'study\',\'intern\')">מתמחה</button></div>':'')
    +'<button class="pk9p-lnk" onclick="PK9.panel(false);PK9.gate()">למסך הכניסה החדש</button>')
  +sec('גופן','<div class="pk9p-fonts">'+FONTS.map(function(x){return '<button class="pk9p-f f-'+x[0]+(f===x[0]?' on':'')+'" onclick="PK9.setFont(\''+x[0]+'\')"><b>דיני עונשין</b><em>'+x[1]+' · '+x[2]+'</em></button>';}).join('')+'</div>')
  +sec('מתיחת פנים','<div class="pk9p-seg"><button class="'+(!face?'on':'')+'" onclick="PK9.setFace(false)">לפני</button><button class="'+(face?'on':'')+'" onclick="PK9.setFace(true)">אחרי</button></div><p class="pk9p-n">הבורדו הכהה נשאר — מלוטש יותר. כרטיסים רכים, משקלים קלים, יותר אוויר. המבנה ומיקום הכפתורים — כמו היום.</p>')
  +(s==='study'?sec('המחברת שלי',item('📄','עורך מסמכים חכם','מסך מלא כמו Word: הערות, הערות שוליים, גרסאות, ייצוא PDF','PK9W.openDemo()')+item('📑','עורך PDF','כמו אקרובט: סימון, חתימה, עמודים, מיזוג, חיפוש','PK9P.demo()')+item('✨','מסמך חדש מתבנית','סיכום שיעור, דף למבחן, ניתוח פסק דין, אירועון','PK9W.gallery()')+item('❝','ציטוט מהשיעור למחברת','מסמנים טקסט בשיעור ← "למחברת"','PK9W.quoteDemo()'))
    +sec('המוח שלי',item('🧠','כלים חכמים','סיכום ב-3 רמות, השוואה, שאלות פתוחות, כרטיסיות, מפה ועוד','PK9B.demo(\'tools\')')+item('🔎','מה חסר לך','מה יש בחומר שלך ומה עוד לא','PK9B.demo(\'gaps\')'))
    +sec('לומדים בכיף',item('⚡','מבחן בזק','10 שאלות ב-60 שניות','pkHubTab(\'h9Fun\',\'blitz\')')+item('⚖','הכרעה בהחלקה','אחראי או פטור? מחליקים ומקבלים הסבר','pkHubTab(\'h9Fun\',\'swipe\')')+item('⚔','דו־קרב','חמש שאלות, שניים, מי מהיר ומדויק יותר','pkHubTab(\'h9Fun\',\'duel\')')+item('🎓','שיעור חי','המרצה פותחת שאלה — כל אחד עונה מהמכשיר שלו','pkHubTab(\'h9Fun\',\'live\')')+item('🗓','המפה שלי','ימי למידה, תגים ומוכנות למבחן','pkHubTab(\'h9Fun\',\'map\')')+item('🌙','הלילה שלפני','רק הדף המרוכז — בלי שום דבר חדש','pkHubTab(\'h9Fun\',\'night\')')+item('💡','הסבר לי בפשטות','בכל שיעור — שתי שורות בשפה של חבר','PK9F.simpleDemo()'))
   :sec('המשרד','<p class="pk9p-n">במערכת המשרד עובדים כמו היום — רק בלי מעבר ללימודים, עם מתיחת הפנים והגופן החדש.</p>'))
  +'</div>'; }
PK9.panel=function(open){ var p=document.getElementById('pk9Panel'); if(!p){ p=document.createElement('div'); p.id='pk9Panel'; document.body.appendChild(p); var bg=document.createElement('div'); bg.id='pk9PanelBg'; bg.onclick=function(){PK9.panel(false);}; document.body.appendChild(bg); }
  if(open===undefined)open=!p.classList.contains('in'); if(open)p.innerHTML=panelHtml(); p.classList.toggle('in',open); document.getElementById('pk9PanelBg').classList.toggle('in',open); };
PK9.panelSync=function(){ var p=document.getElementById('pk9Panel'); if(p&&p.classList.contains('in'))p.innerHTML=panelHtml(); };

function boot(){
  if(window.PK9_PROD){ PK9.setFont('as'); document.body.classList.add('pk9-face'); watch();
    /* מסך הכניסה החדש — רק כשאין משתמש מחובר */
    var t0=Date.now(); (function chk(){ var u=null; try{u=currentUser();}catch(e){} if(u){ applySys(); PK9.after(); return; } var ao=document.getElementById('authOv'); if(ao&&ao.style.display!=='none'){ gateShow(); return; } if(Date.now()-t0<8000)setTimeout(chk,150); })();
  } else {
  PK9.setFont(LS.g('pk9_font2','as')); PK9.setFace(LS.g('pk9_face',true));
  var b=document.createElement('button'); b.id='pk9Fab'; b.innerHTML='<span>✦</span><b>מה חדש</b>'; b.onclick=function(){PK9.panel();}; document.body.appendChild(b);
  watch(); setTimeout(gateShow,250); }
  var _r=window.render; if(typeof _r==='function'){ window.render=function(){ var r=_r.apply(this,arguments); PK9.after(); return r; }; }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
})();
