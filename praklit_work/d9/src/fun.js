/* ===== לומדים בכיף — מבחן בזק, הכרעה בהחלקה, דו־קרב, שיעור חי, המפה שלי, הלילה שלפני, הסבר לי בפשטות — pk9 ===== */
(function(){
if(window.PK9F)return;
var E=PK9.E, LS=PK9.LS, heb=PK9.heb;
var F=window.PK9F={};
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; } return a; }
function sname(id){ var s=SUBJECTS.find(function(x){return x.id===id;}); return s?s.name:''; }
function stat(k,inc){ var S=LS.g('pk9_stats',{}); if(inc){ S[k]=(S[k]||0)+inc; LS.s('pk9_stats',S); } return S[k]||0; }

/* ---------- בנק השאלות ---------- */
var _pool={};
function pool(sid){ if(_pool[sid])return _pool[sid]; var out=[], seen={};
  function add(q,o,c,e,l){ if(!q||!o||o.length<3||c==null||c>=o.length||seen[q])return; seen[q]=1; out.push({q:q,o:o.slice(),c:c,e:e||'',l:l||''}); }
  try{ if(sid==='crime'&&window.PK_CR_PACK)PK_CR_PACK.qbank.forEach(function(x){ add(x.q,x.opts,x.correct,x.e,x.l); }); }catch(e){}
  try{ var S=SUBJECTS.find(function(x){return x.id===sid;}); var CC=(typeof CONTENT!=='undefined')?CONTENT:{}, CX=(typeof CONTENT_EXTRA!=='undefined')?CONTENT_EXTRA:{};
    for(var i=0;i<(S?S.lessons:0);i++){ [CC[sid],CX[sid]].forEach(function(C){ var L=C&&C[i]; if(!L||!L.quiz)return; var qs=Array.isArray(L.quiz)?L.quiz:(L.quiz.questions||[]); qs.forEach(function(x){ if(x.type&&x.type!=='mc')return; add(x.q,x.options,x.correct,x.explain,'שיעור '+(i+1)); }); }); } }catch(e){}
  try{ if(typeof EXTRA_QBANK!=='undefined'&&EXTRA_QBANK[sid])EXTRA_QBANK[sid].forEach(function(x){ add(x.q,x.options||x.opts,x.correct,x.explain||x.e,x.topic||x.l); }); }catch(e){}
  _pool[sid]=out; return out; }
function why(q,j){ var w=(window.PK_WHY_ALLT||{})[q.q]; if(w&&w[j]&&heb(w[j])>=12)return w[j]; if(j===q.c&&heb(q.e)>=12)return q.e; return ''; }
function goodQ(q){ var w=(window.PK_WHY_ALLT||{})[q.q]; return !!(w&&w.length>=q.o.length&&w.every(function(x){return heb(x)>=12;})); }
function courses(){ return SUBJECTS.filter(function(s){return pool(s.id).length>=20;}); }
function courseSel(cur,fn){ return '<select class="pk9f-sel" onchange="'+fn+'(this.value)">'+courses().map(function(s){return '<option value="'+s.id+'"'+(s.id===cur?' selected':'')+'>'+E(s.name)+' · '+pool(s.id).length+' שאלות</option>';}).join('')+'</select>'; }
var L4='אבגדה';

/* ---------- הסבר לי בפשטות — דיני עונשין ---------- */
var SIMPLE=[
 'אי אפשר להעניש על מעשה שלא היה אסור בחוק כשעשו אותו. העבירה והעונש חייבים להיות כתובים מראש (ס׳ 1), וחוק חדש שיוצר עבירה לא חל אחורה (ס׳ 3).',
 'מה האדם עשה בפועל: המעשה (או המחדל), הנסיבות, ולפעמים גם התוצאה (ס׳ 18). מחשבה לבדה, בלי מעשה, היא לא עבירה.',
 'מה היה בראש של העושה. ככלל צריך "מחשבה פלילית" — מודעות למעשה, לנסיבות ולאפשרות התוצאה (ס׳ 19–20).',
 'שלוש דרגות: כוונה — רצה שהתוצאה תקרה. פזיזות — ידע שזה עלול לקרות ולקח את הסיכון (באדישות או בקלות דעת). רשלנות — לא היה מודע, אבל אדם מן היישוב יכול היה להיות מודע (ס׳ 20–21).',
 'בעבירת התנהגות מספיק המעשה עצמו. בעבירת תוצאה צריך גם שהמעשה יגרום לתוצאה — ולכן בודקים קשר סיבתי.',
 'התחיל לבצע ולא השלים — זו כבר עבירה, אם עבר את שלב ההכנה ופעל במטרה לבצע (ס׳ 25). מי שעצר מרצונו ומתוך חרטה — פטור מהניסיון (ס׳ 28).',
 'לא רק מי שעשה בידיים: מבצע בצוותא, מבצע באמצעות אחר (ס׳ 29), משדל ששכנע (ס׳ 30) ומסייע שעזר (ס׳ 31) — לכל אחד אחריות משלו.',
 'הגנה עצמית — הודפים תקיפה שלא כדין, כשזה דרוש מיד. צורך — פוגעים כדי להציל מסכנה שנובעת ממצב דברים. בשניהם התגובה צריכה להיות סבירה.',
 'כורח — מישהו מאיים עליך ומכריח אותך לעבור עבירה. צידוק — עשית מה שהחוק או צו של רשות מוסמכת חייב או התיר. זוטי דברים — המעשה קל ערך מכדי להעניש עליו.',
 'מי שבגלל מחלה או ליקוי בכושרו השכלי לא יכול היה להבין את מה שעשה או להימנע ממנו — לא אחראי. גם ילד מתחת לגיל 12 לא אחראי פלילית.',
 'מאז הרפורמה של 2019 יש מדרג: רצח (ס׳ 300), רצח בנסיבות מחמירות, המתה באחריות מופחתת, המתה בקלות דעת, וגרימת מוות ברשלנות (ס׳ 304). מה שמבדיל ביניהן — מה היה בראש של העושה.',
 'גניבה — לוקחים דבר בלי הסכמת הבעלים ומתכוונים לשלול אותו ממנו לתמיד (ס׳ 383). שוד — גניבה עם אלימות או איום באלימות (ס׳ 402).',
 'הלב של עבירות המין הוא היעדר הסכמה חופשית. גם הסכמה שהושגה במרמה לגבי זהות העושה או מהות המעשה — לא נחשבת הסכמה (ס׳ 345).',
 'העונש צריך להתאים לחומרת העבירה ולאשמה של הנאשם — זה עקרון ההלימה. בית המשפט קובע טווח עונש הולם, ובתוכו מתחשב בנסיבות של האדם.',
 'חנינה — הנשיא מוסמך לחון או להקל בעונש. התיישנות — אחרי זמן שהחוק קבע, כבר אי אפשר להעמיד לדין על העבירה.',
 'נאשם יכול לטעון שההליך נגדו פסול — למשל "הגנה מן הצדק" (ס׳ 149(10) לחסד״פ), או לבקש לפסול ראיה שהושגה שלא כדין לפי הלכת יששכרוב.',
 'פותרים אירועון בסדר קבוע: מזהים עבירה וסעיף, בודקים יסוד עובדתי, יסוד נפשי, צדדים ושלב הביצוע, אחר כך סייגים — ורק בסוף מסקנה.'];
F.SIMPLE=SIMPLE;

/* ---------- הכרעה בהחלקה ---------- */
var SW=[
 {s:'דני, בן 11, לקח מחנות שוקולד ויצא בלי לשלם.',v:0,w:'קטינות: מי שעשה מעשה כשהיה מתחת לגיל 12 לא יישא באחריות פלילית.',r:'ס׳ 34ו'},
 {s:'רונית הותקפה ברחוב באולר, דחפה את התוקף בכל הכוח והוא נפל ונחבל.',v:0,w:'הגנה עצמית: מעשה שהיה דרוש באופן מיידי כדי להדוף תקיפה שלא כדין, שנשקפה ממנה סכנה מוחשית לגופה. התגובה סבירה.',r:'ס׳ 34י'},
 {s:'יוסי שכנע את חברו לפרוץ לדירה של שכן. החבר פרץ.',v:1,w:'יוסי הוא משדל — הביא אחר לידי עשיית עבירה בשכנוע. המשדל אחראי פלילית.',r:'ס׳ 30'},
 {s:'מיכל כיוונה אקדח לעבר אדם ולחצה על ההדק כדי להרוג אותו. היא לא ידעה שהאקדח לא טעון.',v:1,w:'זה ניסיון: לא משנה שהעבירה לא הייתה אפשרית בגלל מצב דברים שהמנסה לא היה מודע לו.',r:'ס׳ 25–26'},
 {s:'אבי התחיל לפרוץ למחסן. באמצע עצר — מרצונו ומתוך חרטה — והלך הביתה בלי לקחת דבר.',v:0,w:'פטור עקב חרטה — מהניסיון. שימו לב: אם בדרך כבר השלים עבירה אחרת (נניח, נזק למנעול) — יישא בה.',r:'ס׳ 28'},
 {s:'מטפס הרים נלכד בסופת שלגים, פרץ לבקתה ריקה ואכל מהמזון שבה כדי לשרוד.',v:0,w:'צורך: מעשה שהיה דרוש מיד כדי להציל חיים מסכנה שנובעת ממצב דברים, כשלא הייתה דרך אחרת.',r:'ס׳ 34יא'},
 {s:'שני שודדים כיוונו אקדח לראשו של נהג והכריחו אותו להסיע אותם מזירת השוד.',v:0,w:'כורח: נאלץ לעשות את המעשה כי נכפה עליו באיום שנשקפה ממנו סכנה מוחשית לחייו.',r:'ס׳ 34יב'},
 {s:'דנה לקחה מטרייה מהמתלה במשרד כשהייתה בטוחה שהיא שלה. התברר שהיא של עמית לעבודה.',v:0,w:'טעות במצב דברים: נבחנת כאילו המצב היה כפי שדימתה — ואז אין כאן כוונה לשלול דבר של אחר.',r:'ס׳ 34יח'},
 {s:'משה נתן לחברו מברג, בידיעה שהחבר מתכנן לפרוץ איתו לרכב. החבר פרץ.',v:1,w:'משה הוא מסייע — עשה מעשה כדי לאפשר את הביצוע או להקל עליו. המסייע אחראי, ועונשו מחצית מעונש העבירה.',r:'ס׳ 31–32'},
 {s:'אדם עבר עבירה וטען בבית המשפט: "לא ידעתי שזה אסור".',v:1,w:'טעות במצב משפטי ככלל לא פוטרת — אלא אם הייתה בלתי נמנעת באורח סביר. "לא ידעתי" לבדו לא מספיק.',r:'ס׳ 34יט'},
 {s:'שוטר עצר אדם לפי צו מעצר שהוציא בית משפט.',v:0,w:'צידוק: מי שפעל לפי חובה או סמכות שהדין נותן לו, או לפי צו של רשות מוסמכת, לא יישא באחריות.',r:'ס׳ 34יג'},
 {s:'אדם שבגלל מחלת נפש לא היה מסוגל להבין את מה שהוא עושה, תקף עובר אורח.',v:0,w:'אי שפיות הדעת: מי שבגלל מחלה או ליקוי שכלי היה חסר יכולת של ממש להבין את המעשה או להימנע ממנו — לא אחראי פלילית.',r:'ס׳ 34ח'},
 {s:'נחקק חוק שאוסר מעשה מסוים. אדם עשה את המעשה שבוע לפני שהחוק פורסם.',v:0,w:'אין עונשין למפרע: חיקוק שיוצר עבירה לא חל על מעשה שנעשה לפני פרסומו או תחילתו.',r:'ס׳ 3(א)'}];

/* ---------- רישום הלשונית והתפריט ---------- */
var ICON='<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9zM5 15l.7 1.6L7.3 17.3 5.7 18 5 19.6 4.3 18 2.7 17.3l1.6-.7z"/>';
function reg(){ try{ var H=window.PK6_HUBS; if(!H||H.h9Fun)return; H.h9Fun={name:'לומדים בכיף',tabs:[['all','הכל','pk9FunAll'],['blitz','מבחן בזק','pk9FunBlitz'],['swipe','הכרעה בהחלקה','pk9FunSwipe'],['duel','דו־קרב','pk9FunDuel'],['live','שיעור חי','pk9FunLive'],['map','המפה שלי','pk9FunMap'],['night','הלילה שלפני','pk9FunNight']]}; try{TITLES.h9Fun='לומדים בכיף';}catch(e){} }catch(e){} }
PK9.hooks.push(function(){ reg();
  var nav=document.getElementById('nav'); if(nav){ var br=nav.querySelector('.pk7-brain'); var it=nav.querySelector('.pk9-fun');
    if(br&&!it){ it=document.createElement('div'); it.className='nav-item pk9-fun'; it.title='לומדים בכיף'; it.innerHTML='<svg viewBox="0 0 24 24">'+ICON+'</svg><span>לומדים בכיף</span><span class="badge b6new">חדש</span>'; it.onclick=function(){ pkHub('h9Fun'); }; br.parentNode.insertBefore(it,br.nextSibling); }
    if(it)it.classList.toggle('active',typeof STATE!=='undefined'&&STATE.view==='h9Fun'&&!STATE.subject); }
  var hd=document.querySelector('.view.h6 .h6-hd'); if(hd&&typeof STATE!=='undefined'&&STATE.view==='h9Fun'){ var p=hd.querySelector('.h6-ttl p'); if(p&&!p.textContent)p.textContent='אתגרים קצרים, משחקים עם חברים ושקט לפני המבחן — מתוך החומר של הקורסים שלך'; var ic=hd.querySelector('.h6-ic'); if(ic&&!ic.dataset.pk9){ ic.dataset.pk9=1; ic.innerHTML='<svg viewBox="0 0 24 24">'+ICON+'</svg>'; } hd.classList.add('pk9f-hd'); }
  simpleInject(); });

/* ---------- הכל ---------- */
var TILES=[['blitz','⚡','מבחן בזק','10 שאלות · 60 שניות. כמה תספיק?'],['swipe','⚖','הכרעה בהחלקה','סיפור קצר — אחראי או פטור? מחליקים ומקבלים הסבר'],['duel','⚔','דו־קרב','5 שאלות מול יריב. מדויק ומהיר מנצח'],['live','🎓','שיעור חי','המרצה פותחת שאלה, כל אחד עונה מהמכשיר שלו'],['map','🗓','המפה שלי','ימי למידה, רצפים, תגים ומוכנות למבחן'],['night','🌙','הלילה שלפני','רק הדף המרוכז. בלי שום דבר חדש']];
function dayIdx(n){ var d=new Date(); var k=d.getFullYear()*372+d.getMonth()*31+d.getDate(); return k%n; }
window.pk9FunAll=function(){ var best=LS.g('pk9_blitz_best',null);
  var law='חוק העונשין, התשל"ז-1977', sec=null; try{ var Ls=(STATUTES[law]||[]).filter(function(x){return x.t&&x.t.length>60&&x.t.length<420&&/^\d+ —/.test(x.s)&&+x.s.split(' ')[0]<=420;}); sec=Ls[dayIdx(Ls.length)]; }catch(e){}
  var cs=[]; try{ cs=(_concCases('crime')||[]).map(function(c){return c.caseObj||{};}).filter(function(o){return o.n&&o.r&&o.r.length>40&&!/^\s*ס['׳]/.test(o.n);}); }catch(e){} var cd=cs.length?cs[dayIdx(cs.length)]:null;
  var C=LS.g('pk9_cards',[]);
  return '<div class="view pk9f">'
   +'<div class="pk9f-tiles">'+TILES.map(function(t){ var sub=t[0]==='blitz'&&best!=null?'<span class="pk9f-best">השיא שלך: '+best+'/10</span>':''; return '<button class="pk9f-tile t-'+t[0]+'" onclick="pkHubTab(\'h9Fun\',\''+t[0]+'\')"><span class="ic">'+t[1]+'</span><b>'+t[2]+'</b><em>'+t[3]+'</em>'+sub+'<span class="go">←</span></button>'; }).join('')+'</div>'
   +'<div class="pk9f-g2">'
   +(sec?'<div class="pk9f-card"><div class="pk9-k">סעיף היום · חוק העונשין</div><h3>ס׳ '+E(sec.s.split(' — ')[0])+' — '+E((sec.s.split(' — ')[1]||'').replace(/\s*[\[\]].*$/,''))+'</h3><p class="pk9f-q">"'+E(sec.t)+'"</p></div>':'')
   +(cd?'<div class="pk9f-card"><div class="pk9-k">פסק הדין של היום · דיני עונשין</div><h3>'+E(String(cd.n).replace(/^\s*:\s*/,''))+'</h3><p>'+E(String(cd.r).replace(/^\s*:\s*/,''))+'</p></div>':'')
   +'</div>'
   +'<div class="pk9f-card"><div class="pk9f-row"><div><div class="pk9-k">מהמחברת ומהשיעורים</div><h3>הכרטיסיות שלי</h3></div><span class="mut">'+(C.length?C.length+' כרטיסיות · לוחצים כדי להפוך':'')+'</span></div>'
   +(C.length?'<div class="pk9f-cards">'+C.slice(0,8).map(function(c,i){return '<div class="pk9f-fc" onclick="this.classList.toggle(\'flip\')"><div class="a"><b>'+E(c.f)+'</b><span>'+E(c.src||'')+'</span></div><div class="b">'+E(c.b)+'</div></div>';}).join('')+'</div>'
     :'<p class="mut">מסמנים משפט בשיעור או במחברת ← "לכרטיסייה". הכרטיסיות שלך יופיעו כאן.</p>')+'</div>'
   +'<div class="pk9f-card"><div class="pk9f-row"><div><div class="pk9-k">דיני עונשין</div><h3>הסבר לי בפשטות</h3></div><span class="mut">כל שיעור — בשתי שורות, בשפה של חבר</span></div><div class="pk9f-simple">'
   +SIMPLE.map(function(t,i){ var tt=(LESSON_TOPICS.crime||[])[i]||''; return '<details><summary><span>'+(i+1)+'</span>'+E(tt)+'</summary><p>'+E(t)+'</p><a onclick="PK9F.toLesson('+i+')">לשיעור המלא ←</a></details>'; }).join('')+'</div></div>'
   +'</div>'; };
F.toLesson=function(i){ try{ openCourse('crime'); setTimeout(function(){ openLesson(i); },200); }catch(e){} };

/* ---------- מבחן בזק ---------- */
var BZ=F.bz={sid:'crime',st:'start'};
function bzBody(){ var best=LS.g('pk9_blitz_best_'+BZ.sid,null);
  if(BZ.st==='start') return '<div class="pk9f-stage pk9f-bz"><div class="pk9f-hero"><span class="big">⚡</span><h2>מבחן בזק</h2><p>10 שאלות אמריקאיות, 60 שניות. עונים מהר — וההסברים מחכים בסוף.</p>'+courseSel(BZ.sid,'PK9F.bzCourse')+'<button class="pk9f-go" onclick="PK9F.bzStart()">יאללה, מתחילים</button>'+(best!=null?'<span class="pk9f-best">השיא שלך ב'+E(sname(BZ.sid))+': '+best+'/10</span>':'')+'</div></div>';
  if(BZ.st==='run'){ var q=BZ.qs[BZ.i]; return '<div class="pk9f-stage pk9f-bz"><div class="pk9f-bzt"><div class="ring" id="pk9Ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="bg"/><circle cx="22" cy="22" r="19" class="fg" id="pk9RingFg"/></svg><b id="pk9Left">'+BZ.left+'</b></div><div class="pr">'+BZ.qs.map(function(x,k){return '<i class="'+(k<BZ.i?(BZ.ans[k]===BZ.qs[k].c?'ok':'no'):k===BZ.i?'on':'')+'"></i>';}).join('')+'</div><div class="sc">'+BZ.score+' נכונות</div></div>'
    +'<div class="pk9f-q1"><span class="l">'+E(q.l||'')+'</span><h3>'+E(q.q)+'</h3><div class="pk9f-opts">'+q.o.map(function(o,j){return '<button onclick="PK9F.bzPick('+j+')"><span>'+L4[j]+'</span>'+E(o)+'</button>';}).join('')+'</div></div></div>'; }
  var wrong=BZ.qs.map(function(q,k){return {q:q,a:BZ.ans[k]};}).filter(function(x){return x.a!==x.q.c;}); var used=Math.min(60,Math.round((BZ.end-BZ.t0)/1000));
  var msg=BZ.score>=9?'מושלם כמעט. את/ה מוכן/ה.':BZ.score>=7?'יפה מאוד! עוד סיבוב ואתה בשיא.':BZ.score>=5?'לא רע. ההסברים למטה יעשו את ההבדל.':'זה בדיוק בשביל זה — ההסברים למטה.';
  return '<div class="pk9f-stage pk9f-bz"><div class="pk9f-res"><div class="sc"><b>'+BZ.score+'</b><span>/10</span></div><div><h2>'+(BZ.newBest?'שיא חדש! ':'')+msg+'</h2><p>'+(BZ.answered<10?'נגמר הזמן אחרי '+BZ.answered+' שאלות':'ענית על 10 שאלות ב-'+used+' שניות')+(best!=null?' · השיא שלך: '+best+'/10':'')+'</p><div class="pk9f-ra"><button class="pk9f-go" onclick="PK9F.bzStart()">עוד סיבוב</button><button class="pk9-btn ghost" onclick="PK9F.bz.st=\'start\';PK9F.paint()">החלפת קורס</button></div></div></div>'
   +(wrong.length?'<div class="pk9f-card"><h3>מה כדאי לחזור עליו · '+wrong.length+'</h3>'+wrong.map(function(x){ var w=why(x.q,x.q.c), wy=x.a!=null&&x.a>=0?why(x.q,x.a):''; return '<div class="pk9f-rv"><p class="q">'+E(x.q.q)+'</p>'+(x.a!=null&&x.a>=0?'<p class="you">הבחירה שלך: '+E(x.q.o[x.a])+(wy?' — '+E(wy):'')+'</p>':'<p class="you">לא הספקת לענות</p>')+'<p class="ok">התשובה הנכונה: '+E(x.q.o[x.q.c])+(w?' — '+E(w):'')+'</p></div>'; }).join('')+'</div>':'')+'</div>'; }
window.pk9FunBlitz=function(){ return '<div class="view pk9f" id="pk9FunBody">'+bzBody()+'</div>'; };
F.bzCourse=function(v){ BZ.sid=v; F.paint(); };
F.bzStart=function(){ var P=pool(BZ.sid); BZ.qs=shuffle(P).slice(0,10); BZ.i=0; BZ.score=0; BZ.ans=[]; BZ.left=60; BZ.t0=Date.now(); BZ.st='run'; BZ.newBest=false; BZ.answered=0; F.paint(); clearInterval(BZ.tm);
  BZ.tm=setInterval(function(){ BZ.left=Math.max(0,60-Math.floor((Date.now()-BZ.t0)/1000)); var l=document.getElementById('pk9Left'); if(l)l.textContent=BZ.left; var fg=document.getElementById('pk9RingFg'); if(fg){ fg.style.strokeDashoffset=(119.4*(1-BZ.left/60)); fg.classList.toggle('hot',BZ.left<=10); } if(BZ.left<=0)bzEnd(); if(!document.querySelector('.pk9f-bz'))clearInterval(BZ.tm); },250); };
F.bzPick=function(j){ if(BZ.lock)return; BZ.lock=true; var q=BZ.qs[BZ.i]; BZ.ans[BZ.i]=j; BZ.answered++; if(j===q.c)BZ.score++; stat('answered',1);
  var bs=document.querySelectorAll('.pk9f-opts button'); bs.forEach(function(b,k){ if(k===q.c)b.classList.add('ok'); else if(k===j)b.classList.add('no'); b.disabled=true; });
  setTimeout(function(){ BZ.lock=false; BZ.i++; if(BZ.i>=BZ.qs.length)bzEnd(); else F.paint(); },420); };
function bzEnd(){ if(BZ.st!=='run')return; clearInterval(BZ.tm); BZ.end=Date.now(); BZ.st='end'; var k='pk9_blitz_best_'+BZ.sid, b=LS.g(k,null); if(b==null||BZ.score>b){ BZ.newBest=b!=null; LS.s(k,BZ.score); } var g=LS.g('pk9_blitz_best',null); if(g==null||BZ.score>g)LS.s('pk9_blitz_best',BZ.score); stat('blitz',1); F.paint(); }
F.paint=function(){ var b=document.getElementById('pk9FunBody'); if(!b)return; var t=(window.PK6SEL||{}).h9Fun; b.innerHTML=t==='blitz'?bzBody():t==='swipe'?swBody():t==='duel'?duBody():t==='live'?lvBody():''; if(t==='swipe')swBind(); };

/* ---------- הכרעה בהחלקה ---------- */
var SWS=F.sw={i:0,ok:0,done:false,deck:null,rev:false};
function swBody(){ if(!SWS.deck)SWS.deck=shuffle(SW); var n=SWS.deck.length;
  if(SWS.i>=n) return '<div class="pk9f-stage"><div class="pk9f-res"><div class="sc"><b>'+SWS.ok+'</b><span>/'+n+'</span></div><div><h2>'+(SWS.ok>=n-1?'שופט/ת מלידה.':SWS.ok>=n*.7?'הכרעות טובות!':'עכשיו את/ה כבר מכיר/ה את הסייגים.')+'</h2><p>הכרעת ב-'+n+' מקרים מדיני עונשין.</p><div class="pk9f-ra"><button class="pk9f-go" onclick="PK9F.swReset()">עוד סיבוב</button></div></div></div></div>';
  var c=SWS.deck[SWS.i];
  return '<div class="pk9f-stage pk9f-sw"><div class="pk9f-swh"><div class="pr">'+SWS.deck.map(function(x,k){return '<i class="'+(k<SWS.i?'d':k===SWS.i?'on':'')+'"></i>';}).join('')+'</div><span>'+SWS.ok+' הכרעות נכונות</span></div>'
   +'<div class="pk9f-deck"><div class="pk9f-under"></div><div class="pk9f-sc'+(SWS.rev?' rev '+(SWS.right?'good':'bad'):'')+'" id="pk9Sw"><div class="lab l">אחראי</div><div class="lab r">פטור</div>'
   +(SWS.rev?'<div class="pk9f-back"><div class="v">'+(SWS.right?'✓ הכרעה נכונה':'✗ לא הפעם')+'</div><h3>'+(c.v?'אחראי פלילית':'פטור מאחריות')+'</h3><p>'+E(c.w)+'</p><span class="ref">'+E(c.r)+'</span></div>'
     :'<div class="pk9f-front"><div class="pk9-k">מקרה '+(SWS.i+1)+' מתוך '+n+'</div><p>'+E(c.s)+'</p><span class="hint">מחליקים ימינה — פטור · שמאלה — אחראי</span></div>')+'</div></div>'
   +(SWS.rev?'<div class="pk9f-swb"><button class="pk9f-go" onclick="PK9F.swNext()">למקרה הבא ←</button></div>':'<div class="pk9f-swb"><button class="pk9f-v yes" onclick="PK9F.swPick(0)">פטור ⟶</button><button class="pk9f-v no" onclick="PK9F.swPick(1)">⟵ אחראי</button></div>')+'</div>'; }
window.pk9FunSwipe=function(){ setTimeout(swBind,30); return '<div class="view pk9f" id="pk9FunBody">'+swBody()+'</div>'; };
function swBind(){ var el=document.getElementById('pk9Sw'); if(!el||SWS.rev||el.dataset.b)return; el.dataset.b=1; var x0=null,dx=0;
  el.addEventListener('pointerdown',function(e){ x0=e.clientX; dx=0; el.setPointerCapture(e.pointerId); el.style.transition='none'; });
  el.addEventListener('pointermove',function(e){ if(x0==null)return; dx=e.clientX-x0; el.style.transform='translateX('+dx+'px) rotate('+(dx/22)+'deg)'; el.classList.toggle('to-r',dx>40); el.classList.toggle('to-l',dx<-40); });
  el.addEventListener('pointerup',function(){ if(x0==null)return; x0=null; el.style.transition=''; if(Math.abs(dx)>110){ el.style.transform='translateX('+(dx>0?600:-600)+'px) rotate('+(dx/10)+'deg)'; el.style.opacity='0'; setTimeout(function(){ F.swPick(dx>0?0:1); },180); } else { el.style.transform=''; el.classList.remove('to-r','to-l'); } }); }
F.swPick=function(v){ var c=SWS.deck[SWS.i]; SWS.right=(v===c.v); if(SWS.right)SWS.ok++; SWS.rev=true; stat('swipe',1); F.paint(); };
F.swNext=function(){ SWS.rev=false; SWS.i++; F.paint(); };
F.swReset=function(){ SWS.i=0; SWS.ok=0; SWS.rev=false; SWS.deck=shuffle(SW); F.paint(); };

/* ---------- דו־קרב ---------- */
var DU=F.du={st:'start',sid:'crime'};
var BOT={n:'נועה',av:'נ'};
function duBody(){ if(DU.st==='start') return '<div class="pk9f-stage"><div class="pk9f-hero du"><div class="pk9f-vs"><div class="p me"><span>'+E((currentUser()||{}).name?currentUser().name.trim()[0]:'א')+'</span><b>את/ה</b></div><em>VS</em><div class="p bot"><span>'+BOT.av+'</span><b>'+BOT.n+'</b></div></div><h2>דו־קרב</h2><p>5 שאלות, 15 שניות לכל שאלה. תשובה נכונה = 100 נקודות + בונוס מהירות.</p>'+courseSel(DU.sid,'PK9F.duCourse')+'<button class="pk9f-go" onclick="PK9F.duStart()">לדו־קרב</button><span class="pk9f-note">בדמו מתמודדים מול '+BOT.n+' (יריבה ממוחשבת). בגרסה המלאה — שולחים קישור לחבר ומשחקים בזמן אמת.</span></div></div>';
  if(DU.st==='run'){ var q=DU.qs[DU.i];
    return '<div class="pk9f-stage pk9f-du"><div class="pk9f-board"><div class="p me"><span>את/ה</span><b>'+DU.me+'</b></div><div class="mid"><div class="t" id="pk9DuT">'+DU.left+'</div><span>שאלה '+(DU.i+1)+'/5</span></div><div class="p bot"><span>'+BOT.n+(DU.botA!=null?' · ענתה':' · חושבת…')+'</span><b>'+DU.bot+'</b></div></div>'
     +'<div class="pk9f-q1"><h3>'+E(q.q)+'</h3><div class="pk9f-opts">'+q.o.map(function(o,j){ var cls=''; if(DU.rev){ if(j===q.c)cls='ok'; else if(j===DU.myA)cls='no'; } else if(j===DU.myA)cls='sel'; return '<button class="'+cls+'" '+(DU.myA!=null||DU.rev?'disabled':'')+' onclick="PK9F.duPick('+j+')"><span>'+L4[j]+'</span>'+E(o)+(DU.rev&&j===DU.botA?'<i class="bt">'+BOT.av+'</i>':'')+'</button>'; }).join('')+'</div>'
     +(DU.rev?'<div class="pk9f-why">'+(why(q,q.c)?'<b>למה:</b> '+E(why(q,q.c)):'')+'</div>':'')+'</div></div>'; }
  var win=DU.me>DU.bot, tie=DU.me===DU.bot;
  return '<div class="pk9f-stage"><div class="pk9f-res"><div class="sc trophy">'+(win?'🏆':tie?'🤝':'⚔')+'</div><div><h2>'+(win?'ניצחת!':tie?'תיקו!':BOT.n+' ניצחה הפעם')+'</h2><p>את/ה: <b>'+DU.me+'</b> · '+BOT.n+': <b>'+DU.bot+'</b></p><div class="pk9f-ra"><button class="pk9f-go" onclick="PK9F.duStart()">משחק חוזר</button><button class="pk9-btn ghost" onclick="PK9F.du.st=\'start\';PK9F.paint()">החלפת קורס</button></div></div></div></div>'; }
window.pk9FunDuel=function(){ return '<div class="view pk9f" id="pk9FunBody">'+duBody()+'</div>'; };
F.duCourse=function(v){ DU.sid=v; F.paint(); };
F.duStart=function(){ DU.qs=shuffle(pool(DU.sid)).slice(0,5); DU.i=0; DU.me=0; DU.bot=0; DU.st='run'; duQ(); };
function duQ(){ DU.myA=null; DU.botA=null; DU.rev=false; DU.left=15; DU.t0=Date.now(); F.paint(); clearInterval(DU.tm); clearTimeout(DU.bt);
  var q=DU.qs[DU.i], bt=2500+Math.random()*7000; DU.bt=setTimeout(function(){ DU.botA=Math.random()<.68?q.c:shuffle([0,1,2,3].filter(function(k){return k!==q.c&&k<q.o.length;}))[0]; DU.botT=Math.max(0,15-Math.round(bt/1000)); if(DU.botA===q.c)DU.botPts=100+DU.botT*10; else DU.botPts=0; if(!DU.rev)F.paint(); duCheck(); },bt);
  DU.tm=setInterval(function(){ DU.left=Math.max(0,15-Math.floor((Date.now()-DU.t0)/1000)); var t=document.getElementById('pk9DuT'); if(t){ t.textContent=DU.left; t.classList.toggle('hot',DU.left<=5); } if(!document.querySelector('.pk9f-du')){ clearInterval(DU.tm); clearTimeout(DU.bt); return; } if(DU.left<=0)duReveal(); },250); }
F.duPick=function(j){ if(DU.myA!=null||DU.rev)return; DU.myA=j; DU.myT=DU.left; stat('answered',1); F.paint(); duCheck(); };
function duCheck(){ if(DU.myA!=null&&DU.botA!=null)setTimeout(duReveal,400); }
function duReveal(){ if(DU.rev)return; DU.rev=true; clearInterval(DU.tm); clearTimeout(DU.bt); var q=DU.qs[DU.i]; if(DU.myA===q.c)DU.me+=100+(DU.myT||0)*10; if(DU.botA!=null)DU.bot+=DU.botPts||0; F.paint();
  setTimeout(function(){ if(!document.querySelector('.pk9f-du'))return; DU.i++; if(DU.i>=DU.qs.length){ DU.st='end'; if(DU.me>DU.bot)stat('duelWin',1); F.paint(); } else duQ(); },3200); }

/* ---------- שיעור חי (הדמיה) ---------- */
var LV=F.lv={st:'idle',i:0,qs:null};
var NAMES=['נועה','איתי','שירה','עומר','מאיה','יונתן','תמר','אורי','ליה','דניאל','רוני','אדם','הדר','גיא','ענבר','אלון','מיכל','עידו','נגה','יואב','שקד','רועי','אביגיל','בן','יעל','אסף','דנה'];
function lvQs(){ if(LV.qs)return LV.qs; var P=pool('crime').filter(goodQ); LV.qs=shuffle(P).slice(0,6); return LV.qs; }
function lvBody(){ var Q=lvQs(); if(!Q.length)return '<div class="pk9f-card"><p class="mut">אין שאלות זמינות.</p></div>'; var q=Q[LV.i%Q.length]; var tot=(LV.dist||[]).reduce(function(a,b){return a+b;},0)+(LV.my!=null?1:0);
  var lect='<div class="pk9f-lect"><div class="bar"><span class="dot'+(LV.st==='open'?' live':'')+'"></span><b>מסך המרצה</b><em>דיני עונשין · כיתה 3</em><span class="cnt">'+(LV.st==='idle'?'28 מחוברים':tot+'/28 ענו')+'</span></div>'
   +'<div class="q"><span class="n">שאלה '+(LV.i+1)+'</span><h3>'+E(q.q)+'</h3></div>'
   +'<div class="dist">'+q.o.map(function(o,j){ var v=(LV.dist||[0,0,0,0])[j]+(LV.my===j?1:0); var pc=tot?Math.round(v/tot*100):0; return '<div class="r'+(LV.st==='rev'&&j===q.c?' ok':'')+'"><span class="k">'+L4[j]+'</span><span class="o">'+E(o)+'</span><i><em style="width:'+(LV.st==='idle'?0:pc)+'%"></em></i><b>'+(LV.st==='idle'?'':pc+'%')+'</b></div>'; }).join('')+'</div>'
   +'<div class="act">'+(LV.st==='idle'?'<button class="pk9f-go" onclick="PK9F.lvOpen()">פתיחת השאלה לכיתה</button>':LV.st==='open'?'<button class="pk9f-go" onclick="PK9F.lvReveal()">חשיפת התשובה</button><span class="mut">הסטודנטים עונים עכשיו מהמכשירים שלהם</span>':'<button class="pk9f-go" onclick="PK9F.lvNext()">לשאלה הבאה</button><span class="mut">'+(tot?Math.round((((LV.dist||[])[q.c]||0)+(LV.my===q.c?1:0))/tot*100):0)+'% מהכיתה צדקו</span>')+'</div></div>';
  var me=(currentUser()||{}).name||'את/ה';
  var ph='<div class="pk9f-phone"><div class="notch"></div><div class="scr"><div class="ph-h"><b>פרקליט</b><span>שיעור חי · דיני עונשין</span></div>';
  if(LV.st==='idle') ph+='<div class="ph-wait"><span class="pulse"></span><b>מחכים למרצה…</b><p>השאלה תופיע כאן ברגע שהמרצה תפתח אותה.</p></div>';
  else { ph+='<p class="ph-q">'+E(q.q)+'</p><div class="ph-o">'+q.o.map(function(o,j){ var cls=''; if(LV.st==='rev'){ if(j===q.c)cls='ok'; else if(j===LV.my)cls='no'; } else if(j===LV.my)cls='sel'; return '<button class="'+cls+'" '+(LV.st!=='open'?'disabled':'')+' onclick="PK9F.lvPick('+j+')"><span>'+L4[j]+'</span>'+E(o)+'</button>'; }).join('')+'</div>';
    if(LV.st==='open')ph+='<p class="ph-n">'+(LV.my!=null?'✓ התשובה נשלחה. אפשר לשנות עד החשיפה.':'בוחרים תשובה — רק את/ה רואה מה בחרת.')+'</p>';
    if(LV.st==='rev'){ var ok=LV.my===q.c; ph+='<div class="ph-r '+(LV.my==null?'none':ok?'good':'bad')+'"><b>'+(LV.my==null?'לא ענית על השאלה':ok?'✓ צדקת!':'✗ לא הפעם')+'</b>'+(LV.my!=null&&!ok&&why(q,LV.my)?'<p><u>למה '+L4[LV.my]+' לא נכונה:</u> '+E(why(q,LV.my))+'</p>':'')+(why(q,q.c)?'<p><u>'+(ok?'למה זו התשובה':'התשובה הנכונה — '+L4[q.c])+':</u> '+E(why(q,q.c))+'</p>':'')+'</div>'; } }
  ph+='</div></div>';
  return '<div class="pk9f-live"><div class="pk9f-livenote"><b>הדמיה של שיעור חי</b> — משמאל: מה שהמרצה מקרינה. מימין: הטלפון שלך. בגרסה המלאה כל סטודנט מתחבר מהמכשיר שלו (צריך שרת).</div><div class="pk9f-lg">'+lect+ph+'</div></div>'; }
window.pk9FunLive=function(){ return '<div class="view pk9f" id="pk9FunBody">'+lvBody()+'</div>'; };
F.lvOpen=function(){ LV.st='open'; LV.my=null; LV.dist=[0,0,0,0]; F.paint(); var q=lvQs()[LV.i%lvQs().length]; var n=0; clearInterval(LV.tm);
  LV.tm=setInterval(function(){ if(LV.st!=='open'||n>=27||!document.querySelector('.pk9f-live')){ clearInterval(LV.tm); return; } var k=1+Math.floor(Math.random()*3); for(var x=0;x<k&&n<27;x++,n++){ var r=Math.random(); var j=r<.62?q.c:shuffle([0,1,2,3].filter(function(z){return z!==q.c&&z<q.o.length;}))[0]; LV.dist[j]++; } F.paint(); },450); };
F.lvPick=function(j){ if(LV.st!=='open')return; LV.my=j; stat('answered',1); F.paint(); };
F.lvReveal=function(){ clearInterval(LV.tm); LV.st='rev'; stat('live',1); F.paint(); };
F.lvNext=function(){ LV.i++; LV.st='idle'; LV.my=null; LV.dist=null; F.paint(); };

/* ---------- המפה שלי ---------- */
window.pk9FunMap=function(){ var log=(typeof STATE!=='undefined'&&STATE.studyLog)||{}; var today=new Date(); today.setHours(0,0,0,0);
  var weeks=26, start=new Date(today); start.setDate(start.getDate()-(weeks*7-1)-start.getDay()+0);
  var cells='', tot=0, days=0, best=0, run=0;
  for(var w=0;w<weeks+1;w++){ cells+='<div class="wk">'; for(var d=0;d<7;d++){ var x=new Date(start); x.setDate(start.getDate()+w*7+d); if(x>today){ cells+='<i class="fut"></i>'; continue; } var k=x.toISOString().slice(0,10), v=log[k]||0; if(v>0){tot+=v;days++;run++;best=Math.max(best,run);}else run=0; var lv=v<=0?0:v<20?1:v<45?2:v<75?3:4; cells+='<i class="l'+lv+'" title="'+x.toLocaleDateString('he-IL')+' · '+v+' דקות"></i>'; } cells+='</div>'; }
  var streak=0; try{streak=streakDays();}catch(e){}
  var notes=(STATE.notes||[]).length, mats=0; try{ var u=currentUser(); mats=JSON.parse(localStorage.getItem('pk6_brain_'+(u?u.id:'guest'))||'[]').length; }catch(e){}
  var B=[['🔥','שבוע ברצף','7 ימי למידה רצופים',best>=7],['🏔','חודש ברצף','30 ימים רצופים',best>=30],['💯','100 שאלות','בכל סוגי התרגול',stat('answered')>=100],['⚡','מבחן בזק','סיבוב ראשון',stat('blitz')>=1],['⚖','שופט/ת','10 הכרעות בהחלקה',stat('swipe')>=10],['⚔','ניצחון ראשון','בדו־קרב',stat('duelWin')>=1],['🎓','בשיעור החי','3 שאלות בשיעור חי',stat('live')>=3],['📄','מסמך ראשון','במחברת',notes>=1],['🧠','המוח שלי','חומר ראשון שהעלית',mats>=1]];
  var R=[]; try{ R=SUBJECTS.map(function(s){return {s:s,v:pk6Ready(s)};}).filter(function(x){return x.v>0;}).sort(function(a,b){return b.v-a.v;}).slice(0,4); }catch(e){}
  if(!R.length){ try{ R=['crime','contract','tort','const'].map(function(id){var s=SUBJECTS.find(function(x){return x.id===id;}); return {s:s,v:pk6Ready(s)};}); }catch(e){} }
  return '<div class="view pk9f"><div class="pk9f-card"><div class="pk9f-row"><div><div class="pk9-k">חצי השנה האחרונה</div><h3>מפת הלמידה שלי</h3></div><div class="pk9f-kp"><div><b>'+Math.round(tot/60)+'</b><span>שעות</span></div><div><b>'+days+'</b><span>ימי למידה</span></div><div><b>'+streak+'</b><span>רצף נוכחי</span></div><div><b>'+best+'</b><span>הרצף הארוך</span></div></div></div>'
   +'<div class="pk9f-heat">'+cells+'</div><div class="pk9f-lg2"><span>פחות</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>יותר</span></div></div>'
   +'<div class="pk9f-g2"><div class="pk9f-card"><h3>התגים שלי</h3><p class="mut" style="margin:2px 0 12px">על הרגלים — לא על ציונים</p><div class="pk9f-badges">'+B.map(function(b){return '<div class="'+(b[3]?'on':'')+'"><span>'+b[0]+'</span><b>'+b[1]+'</b><em>'+b[2]+'</em></div>';}).join('')+'</div></div>'
   +'<div class="pk9f-card"><h3>מוכנות למבחן</h3><p class="mut" style="margin:2px 0 12px">שילוב של מה שקראת ומה שאת/ה כבר יודע/ת בתרגול</p><div class="pk9f-ready">'+R.map(function(x){ return '<div><div class="rg" style="background:conic-gradient(#8A2E3A '+(x.v*3.6)+'deg,#F1EBE0 0)"><b>'+x.v+'%</b></div><span>'+E(x.s.name)+'</span></div>'; }).join('')+'</div></div></div></div>'; };

/* ---------- הלילה שלפני ---------- */
var NT=F.nt={sid:'crime',mode:'night'};
var KEYSEC=[['1','אין עבירה ואין עונש אלא בחוק'],['3','אין עונשין למפרע'],['18','מבנה היסוד העובדתי'],['19–20','מחשבה פלילית: כוונה ופזיזות'],['21','רשלנות'],['25','ניסיון'],['28','פטור עקב חרטה'],['29–31','מבצע, משדל, מסייע'],['34י','הגנה עצמית'],['34יא','צורך'],['34יב','כורח'],['34טז','דרישת הסבירות'],['34יח','טעות במצב דברים'],['300','רצח']];
function firstPara(sid,i){ try{ var CC=(typeof CONTENT!=='undefined')?CONTENT:{}, CX=(typeof CONTENT_EXTRA!=='undefined')?CONTENT_EXTRA:{}; var h=((CX[sid]||{})[i]||{}).summary||((CC[sid]||{})[i]||{}).summary||''; var d=document.createElement('div'); d.innerHTML=h; var p=Array.prototype.find.call(d.querySelectorAll('p'),function(x){return x.textContent.trim().length>60;}); var t=p?p.textContent.replace(/\s+/g,' ').trim():''; return t.length>230?t.slice(0,228)+'…':t; }catch(e){return '';} }
window.pk9FunNight=function(){ stat('night',1); var sid=NT.sid, T=(LESSON_TOPICS[sid]||[]);
  var sel='<select class="pk9f-sel dark" onchange="PK9F.nt.sid=this.value;render()">'+SUBJECTS.filter(function(s){return (LESSON_TOPICS[s.id]||[]).length;}).map(function(s){return '<option value="'+s.id+'"'+(s.id===sid?' selected':'')+'>'+E(s.name)+'</option>';}).join('')+'</select>';
  var seg='<div class="pk9f-seg"><button class="'+(NT.mode==='night'?'on':'')+'" onclick="PK9F.nt.mode=\'night\';render()">הלילה שלפני</button><button class="'+(NT.mode==='week'?'on':'')+'" onclick="PK9F.nt.mode=\'week\';render()">שבוע לפני</button></div>';
  if(NT.mode==='week'){ var order=T.map(function(t,i){return i;}); var weak=[]; try{ var S=SUBJECTS.find(function(x){return x.id===sid;}); var M=pk6Mastery(sid); if(M&&M.byLesson)weak=Object.keys(M.byLesson).filter(function(k){return M.byLesson[k]<70;}).map(Number); }catch(e){}
    order.sort(function(a,b){ return (weak.indexOf(a)>=0?0:1)-(weak.indexOf(b)>=0?0:1)||a-b; }); var per=Math.ceil(order.length/5); var days=['היום','מחר','בעוד יומיים','בעוד 3 ימים','בעוד 4 ימים'];
    return '<div class="view pk9f"><div class="pk9f-night week"><div class="nh"><div><div class="pk9-k">'+E(sname(sid))+'</div><h2>שבוע לפני המבחן</h2><p>חמישה ימים של חזרה, יום של מבחן מדומה, ויום אחרון רגוע. הנושאים החלשים שלך — קודם.</p></div><div class="ctl">'+seg+sel+'</div></div>'
     +'<div class="pk9f-plan">'+days.map(function(d,k){ var L=order.slice(k*per,(k+1)*per); return L.length?'<div class="d"><b>'+d+'</b><ul>'+L.map(function(i){return '<li>'+(weak.indexOf(i)>=0?'<em>לחזק</em>':'')+E(T[i])+'</li>';}).join('')+'</ul><span>~'+L.length*25+' דקות</span></div>':''; }).join('')
     +'<div class="d ex"><b>יומיים לפני</b><ul><li>מבחן מדומה מלא, בתנאי מבחן</li><li>עוברים רק על הטעויות</li></ul><span>~3 שעות</span></div><div class="d calm"><b>יום לפני</b><ul><li>"הלילה שלפני" — הדף המרוכז בלבד</li><li>שינה מוקדמת</li></ul><span>~45 דקות</span></div></div></div></div>'; }
  var items=T.map(function(t,i){ var x=sid==='crime'?SIMPLE[i]:firstPara(sid,i); return '<li><b>'+(i+1)+'. '+E(t)+'</b>'+(x?'<p>'+E(x)+'</p>':'')+'</li>'; }).join('');
  return '<div class="view pk9f"><div class="pk9f-night"><div class="nh"><div><div class="pk9-k">'+E(sname(sid))+'</div><h2>הלילה שלפני</h2><p>אין כאן שום דבר חדש. רק מה שכבר למדת — מרוכז, בשקט. עוברים פעם אחת, וסוגרים.</p></div><div class="ctl">'+seg+sel+'</div></div>'
   +'<div class="pk9f-ng"><ol class="pk9f-nl">'+items+'</ol>'+(sid==='crime'?'<div class="pk9f-ns"><h4>הסעיפים שחייבים לזכור</h4>'+KEYSEC.map(function(s){return '<div><b>ס׳ '+s[0]+'</b><span>'+s[1]+'</span></div>';}).join('')+'</div>':'')+'</div>'
   +'<div class="pk9f-calm">🌙 שינה טובה שווה יותר משעה נוספת של חזרה. בהצלחה מחר.</div></div></div>'; };

/* ---------- הסבר לי בפשטות — בתוך השיעור ---------- */
function simpleInject(){ if(typeof STATE==='undefined'||!STATE.subject||STATE.lesson==null)return; var MAP=window.PK9_SIMPLE_BY||{}; var src=STATE.subject==='crime'?SIMPLE:MAP[STATE.subject]; if(!src)return; var lc=document.getElementById('lessonContent'); if(!lc||lc.querySelector('.pk9-simple')||STATE.lessonTab&&STATE.lessonTab!=='summary')return; var t=src[STATE.lesson]; if(!t)return;
  var d=document.createElement('div'); d.className='pk9-simple'; d.innerHTML='<button class="pk9-sb" onclick="this.parentNode.classList.toggle(\'open\')"><span>💡</span><b>הסבר לי בפשטות</b><em>השיעור בשתי שורות</em><i>⌄</i></button><div class="pk9-st"><p>'+E(t)+'</p></div>'; lc.insertBefore(d,lc.firstChild); }
F.simpleDemo=function(){ try{ openCourse('crime'); setTimeout(function(){ openLesson(5); setTimeout(function(){ var s=document.querySelector('.pk9-simple'); if(s){ s.classList.add('open'); s.scrollIntoView({block:'center'}); } },500); },250); }catch(e){} };
/* לפעמים השיעור מצויר אחרי render — מנטרים גם את תוכן השיעור */
setInterval(function(){ try{ simpleInject(); }catch(e){} },1200);
})();
