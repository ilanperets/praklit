/* ===== המחברת שלי · עורך מסמכים מלא (מסך מלא, כמו Word) — pk9 ===== */
(function(){
if(window.PK9W)return;
var E=PK9.E, LS=PK9.LS;
function AY(){ try{return ACAD_YEARS[ACAD_YEARS.length-1];}catch(e){return '';} } function SM(){ try{return SEMESTERS[0];}catch(e){return '';} }
var W=window.PK9W={id:null,zoom:100,nav:true,tab:'home',width:'a4',read:false,range:null};

/* ---------- חוק לפי קורס ---------- */
var LAWBY={crime:'חוק העונשין, התשל"ז-1977',contract:'חוק החוזים (חלק כללי), התשל"ג-1973',tort:'פקודת הנזיקין [נוסח חדש]',property:'חוק המקרקעין, התשכ"ט-1969',realestate:'חוק המקרקעין, התשכ"ט-1969',corp:'חוק החברות, התשנ"ט-1999',inherit:'חוק הירושה, התשכ"ה-1965',evidence:'פקודת הראיות [נוסח חדש], התשל"א-1971',crimproc:'חוק סדר הדין הפלילי [נוסח משולב], התשמ"ב-1982',civproc:'תקנות סדר הדין האזרחי, התשע"ט-2018',ethics:'כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ"ו-1986',labor:'חוק פיצויי פיטורים, התשכ"ג-1963',family:'חוק יחסי ממון בין בני זוג, התשל"ג-1973',tax:'פקודת מס הכנסה [נוסח חדש]',ip:'חוק זכות יוצרים, התשס"ח-2007'};
function lawOf(sid){ var k=LAWBY[sid]; try{ if(k&&STATUTES[k])return k; }catch(e){} return 'חוק העונשין, התשל"ז-1977'; }
function secFind(law,num){ try{ var L=STATUTES[law]||[]; num=String(num).replace(/["׳']/g,'').trim(); return L.find(function(x){return String(x.s).split(' — ')[0].trim()===num;})||null; }catch(e){return null;} }
function secTitle(it){ var p=String(it.s).split(' — '); return (p[1]||'').replace(/\][^\[]*\[|\[[^\]]*\]|\][^\]]*$/g,'').replace(/[\[\]]/g,'').trim(); }
function lawShort(l){ return String(l).replace(/,.*$/,'').replace(/\s*\[.*?\]/,''); }

/* ---------- תבניות ---------- */
function today(){ return new Date().toLocaleDateString('he-IL'); }
var TPL={
 blank:['מסמך ריק','דף נקי, רק כותרת','<h1>כותרת המסמך</h1><p><br></p>'],
 lesson:['סיכום שיעור','רעיון מרכזי, סעיפים, פסיקה ושאלות לחזרה',function(c){return '<h1>[נושא השיעור]</h1><p class="pkw-meta">'+c+' · שיעור __ · '+today()+'</p><h2>הרעיון המרכזי</h2><p>במשפט אחד או שניים: על מה השיעור ולמה זה חשוב.</p><h2>סעיפי חוק</h2><ul><li><b>ס׳ __</b> — מה הסעיף קובע</li><li><b>ס׳ __</b> — מה הסעיף קובע</li></ul><h2>פסיקה</h2><table class="pkw-tbl"><tr><th>פסק הדין</th><th>העובדות בקצרה</th><th>ההלכה</th></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><h2>מושגים</h2><ul><li><b>מושג</b> — הגדרה</li></ul><div class="pkw-box tip"><b>מה חשוב למבחן</b>הנקודה שהמרצה חזר עליה.</div><h2>שאלות לחזרה</h2><ol><li><br></li><li><br></li></ol>';}],
 sheet:['דף למבחן','עמוד אחד מרוכז: נושא, סעיף, הלכה',function(c){return '<h1>דף למבחן · '+c+'</h1><div class="pkw-box law"><b>סדר הפתרון</b>זיהוי הסוגיה ← הדין (סעיף + הלכה) ← יישום על העובדות ← מסקנה.</div><table class="pkw-tbl"><tr><th>נושא</th><th>סעיף</th><th>הלכה / פסק דין</th></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><h2>מלכודות נפוצות</h2><ul><li><br></li><li><br></li></ul><h2>משפטי פתיחה מוכנים</h2><ul><li>"השאלה המשפטית היא האם…"</li><li>"לפי ס׳ __, יש לבחון שלושה רכיבים…"</li></ul>';}],
 casebrief:['ניתוח פסק דין','עובדות, שאלה, הכרעה, הלכה, מיעוט',function(c){return '<h1>[שם פסק הדין]</h1><p class="pkw-meta">'+c+' · ערכאה: ___ · שנה: ___ · שופטים: ___</p><h2>העובדות</h2><p><br></p><h2>השאלה המשפטית</h2><p><br></p><h2>ההכרעה</h2><p><br></p><div class="pkw-box law"><b>ההלכה</b>במשפט אחד — מה נקבע.</div><h2>דעת המיעוט</h2><p><br></p><h2>משמעות למבחן</h2><ul><li>מתי לצטט את פסק הדין</li><li>במה הוא שונה מפסקי דין דומים</li></ul>';}],
 event:['שלד לאירועון','תרשים פתרון בפלילים, שלב אחר שלב',function(c){return '<h1>פתרון אירועון · [שם הדמות]</h1><p class="pkw-meta">'+c+' · שלד פתרון</p><div class="pkw-box tip"><b>לפני שמתחילים</b>מסמנים כל דמות וכל מעשה. לכל דמות — ניתוח נפרד.</div><h2>1. העבירה והסעיף</h2><p>איזו עבירה עולה מהעובדות? ס׳ __.</p><h2>2. היסוד העובדתי</h2><ul><li><b>מעשה / מחדל:</b> </li><li><b>נסיבות:</b> </li><li><b>תוצאה וקשר סיבתי</b> (אם עבירת תוצאה): </li></ul><h2>3. היסוד הנפשי</h2><ul><li><b>מודעות</b> לטיב המעשה ולנסיבות: </li><li><b>כוונה / פזיזות / רשלנות</b> כלפי התוצאה: </li></ul><h2>4. צדדים לעבירה</h2><p>מבצע עיקרי, בצוותא, באמצעות אחר, משדל, מסייע?</p><h2>5. שלב הביצוע</h2><p>הכנה, ניסיון (ס׳ 25) או עבירה מושלמת? חרטה (ס׳ 28)?</p><h2>6. סייגים לאחריות</h2><p>הגנה עצמית, צורך, כורח, טעות, קטינות, אי שפיות…</p><h2>7. מסקנה</h2><p><br></p>';}],
 course:['סיכום קורס','כותרת לכל שיעור — לפי הסילבוס של הקורס',function(c,sid){ var T=[]; try{T=(LESSON_TOPICS[sid]||[]);}catch(e){} return '<h1>סיכום קורס · '+c+'</h1><p class="pkw-meta">'+T.length+' שיעורים · נבנה אוטומטית מהסילבוס</p>'+T.map(function(t,i){return '<h2>'+(i+1)+'. '+E(t)+'</h2><p><br></p>';}).join(''); }]
};
W.sampleNote=function(){ return {id:(typeof uid==='function'?uid():String(Date.now())),pk9demo:2,title:'ניסיון לעבור עבירה — סיכום שיעור 6',subject:'crime',year:AY(),semester:SM(),tag:'#8A2E3A',pin:true,spacing:'1.9',updated:Date.now(),
 pk9c:[{id:'cdemo1',q:'ובמבחן מיישמים יותר ממבחן אחד על העובדות',t:'לבדוק במבחנים קודמים איזה מבחן המרצה הכי אוהב',who:'דנה כהן',ts:Date.now()-86400000,done:false}],
 body:'<h1>ניסיון לעבור עבירה</h1><p class="pkw-meta">דיני עונשין · שיעור 6 · הסיכום שלי</p><div class="pkw-toc" contenteditable="false"></div>'
 +'<h2>1. מה זה ניסיון</h2><p>ניסיון הוא עבירה בפני עצמה: העושה <b>התחיל לבצע</b> ולא השלים. מענישים עליו כי הסכנה כבר נוצרה.</p>'
 +'<div class="pkw-box law"><b>ס׳ 25 — נסיון מהו</b>"אדם מנסה לעבור עבירה אם, במטרה לבצעה, עשה מעשה שאין בו הכנה בלבד והעבירה לא הושלמה."<sup class="pkw-fn" data-f="fdemo1" contenteditable="false">1</sup></div>'
 +'<h2>2. שלושה רכיבים</h2><ol><li><b>מטרה לבצע</b> את העבירה.</li><li><b>מעשה שאין בו הכנה בלבד</b> — עבר את שלב ההכנה.</li><li><b>העבירה לא הושלמה</b>.</li></ol>'
 +'<h2>3. הכנה או ניסיון?</h2><p>הכנה לבדה — ככלל אינה עבירה. את הקו מסמנים בעזרת כמה מבחנים, <span class="pkw-cmt" data-c="cdemo1"><span style="background-color:#FFF0A8">ובמבחן מיישמים יותר ממבחן אחד על העובדות</span></span>.</p>'
 +'<table class="pkw-tbl"><tr><th>מבחן</th><th>השאלה שהוא שואל</th></tr><tr><td>הצעד האחרון</td><td>האם עשה כל מה שנדרש מצידו?</td></tr><tr><td>הקרבה</td><td>עד כמה המעשה קרוב להשלמת העבירה?</td></tr><tr><td>החד־משמעות</td><td>האם המעשה מעיד בבירור על המטרה לבצע?</td></tr></table>'
 +'<h2>4. ניסיון שלא יכול להצליח</h2><div class="pkw-box law"><b>ס׳ 26 — חוסר אפשרות לעשיית העבירה</b>"לענין נסיון, אין נפקה מינה אם עשיית העבירה לא היתה אפשרית מחמת מצב דברים שהמנסה לא היה מודע לו או טעה לגביו."</div><p>דוגמה: יד בכיס ריק, אקדח לא טעון — עדיין ניסיון.</p>'
 +'<h2>5. פטור עקב חרטה</h2><p>לפי ס׳ 28, מי שחדל <b>מחפץ נפשו בלבד ומתוך חרטה</b> — לא יישא באחריות לניסיון. אבל אם בדרך כבר השלים עבירה אחרת — יישא בה.</p>'
 +'<div class="pkw-box tip"><b>שים לב במבחן</b>לפי ס׳ 27, עונש חובה או עונש מזערי שנקבעו לעבירה <b>לא חלים</b> על ניסיון לעבור אותה.</div>'+'<section class="pkw-fns"><b contenteditable="false">הערות שוליים</b><ol><li data-f="fdemo1">חוק העונשין, התשל״ז-1977, פרק ה׳ (ס׳ 25–28).</li></ol></section>'}; };

/* ---------- עזרי עריכה ---------- */
function P(){ return document.getElementById('pkwPaper'); }
function note(){ return (STATE.notes||[]).find(function(n){return n.id===W.id;}); }
function saveRange(){ var s=window.getSelection(); if(s.rangeCount&&P()&&P().contains(s.anchorNode))W.range=s.getRangeAt(0).cloneRange(); }
function restore(){ var p=P(); if(!p)return; p.focus(); if(W.range){ var s=window.getSelection(); s.removeAllRanges(); s.addRange(W.range); } }
function ex(cmd,val){ restore(); try{document.execCommand('styleWithCSS',false,cmd==='hiliteColor'||cmd==='foreColor');}catch(e){} document.execCommand(cmd,false,val==null?null:val); saveRange(); changed(); sync(); }
function insertHTML(h){ restore(); document.execCommand('insertHTML',false,h); saveRange(); changed(); }
W.ex=ex; W.ins=insertHTML;
var _t=null;
function changed(){ var st=document.getElementById('pkwSaved'); if(st){st.textContent='שומר…';st.className='pkw-saved busy';} clearTimeout(_t); _t=setTimeout(save,600); clearTimeout(W._nt); W._nt=setTimeout(function(){navBuild();stats();},250); }
function save(){ var n=note(), p=P(); if(!n||!p)return; n.body=p.innerHTML; var t=document.getElementById('pkwTitle'); if(t)n.title=t.value; n.updated=Date.now(); try{persist();}catch(e){} snapVer();
  var st=document.getElementById('pkwSaved'); if(st){ st.textContent='נשמר · '+new Date().toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}); st.className='pkw-saved'; } }
W.save=save;
function stats(){ var p=P(), b=document.getElementById('pkwStat'); if(!p||!b)return; var txt=p.innerText||''; var w=(txt.match(/\S+/g)||[]).length; var pages=Math.max(1,Math.ceil(p.scrollHeight/1123));
  b.innerHTML='<span>'+pages+' '+(pages===1?'עמוד':'עמודים')+'</span><span>'+w.toLocaleString('he-IL')+' מילים</span><span>'+txt.replace(/\s/g,'').length.toLocaleString('he-IL')+' תווים</span><span>עברית</span>'; }
function sync(){ /* מצב כפתורים */ var bar=document.getElementById('pkwRib'); if(!bar)return; ['bold','italic','underline','strikeThrough','insertUnorderedList','insertOrderedList','justifyRight','justifyCenter','justifyLeft','justifyFull'].forEach(function(c){ var b=bar.querySelector('[data-c="'+c+'"]'); if(b){ var on=false; try{on=document.queryCommandState(c);}catch(e){} b.classList.toggle('on',on); } });
  var bl=document.getElementById('pkwBlock'); if(bl){ var v=''; try{v=String(document.queryCommandValue('formatBlock')||'').toLowerCase();}catch(e){} bl.value=(['h1','h2','h3','blockquote'].indexOf(v)>=0?v:'p'); } }

/* ---------- סרגל (ribbon) ---------- */
var IC={
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>',redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>',
 ul:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',ol:'<path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M4 9h3M4 14.5c.5-1 2.5-1 2.5.5S4 17 4 19h3"/>',
 check:'<rect x="3" y="4" width="6" height="6" rx="1.5"/><path d="M4.5 7l1.2 1.2L8 6M12 7h9M3 16h6v4H3zM12 18h9"/>',
 ar:'<path d="M3 6h18M9 10h12M3 14h18M9 18h12"/>',ac:'<path d="M3 6h18M6 10h12M3 14h18M6 18h12"/>',al:'<path d="M3 6h18M3 10h12M3 14h18M3 18h12"/>',aj:'<path d="M3 6h18M3 10h18M3 14h18M3 18h18"/>',
 ind:'<path d="M3 6h18M10 10h11M10 14h11M3 18h18M3 9l3 3-3 3"/>',outd:'<path d="M3 6h18M10 10h11M10 14h11M3 18h18M6 9l-3 3 3 3"/>',
 clear:'<path d="M4 7V5h12v2M10 5l-3 14M5 19h6M15 13l6 6M21 13l-6 6"/>',tbl:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
 link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',hr:'<path d="M3 12h18"/>',date:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',pb:'<path d="M6 3v6h12V3M6 21v-6h12v6M3 12h3M9 12h2M13 12h2M18 12h3"/>',
 law:'<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0zM8 21h8"/>',case:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/><path d="M8 7h8M8 11h6"/>',quote:'<path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/>',
 card:'<rect x="2" y="6" width="15" height="12" rx="2"/><path d="M7 3h13a2 2 0 012 2v10"/>',quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.8.6-1.5 1-1.5 2M12 17h.01"/>',event:'<path d="M5 3v18M5 4h11l-2 4 2 4H5"/>',
 nav:'<path d="M4 6h16M4 12h10M4 18h7"/>',zoomin:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M8 11h6M11 8v6"/>',zoomout:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M8 11h6"/>',read:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 speak:'<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14"/>',width:'<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>',full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 word:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13l1.5 5 2.5-4 2.5 4 1.5-5"/>',pdf:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M9 17v-4h1.5a1.5 1.5 0 010 3H9"/>',print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/>',
 box:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h10M7 14h6"/>',cmt:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',fn:'<path d="M5 18h9M5 14h14M5 10h14"/><path d="M17 4v6M15 6l2-2 2 2"/>',far:'<circle cx="10" cy="10" r="6"/><path d="M20 20l-5.5-5.5M7 10h6"/>',toc:'<path d="M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11"/>',ver:'<path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',sec:'<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0zM8 21h8"/>',cnt:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',rtl:'<path d="M10 4v16M14 4v16M10 4h6M7 4a3 3 0 000 6h3"/>',exp:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',back:'<path d="M9 18l6-6-6-6"/>'};
function sv(k){return '<svg viewBox="0 0 24 24">'+(IC[k]||'')+'</svg>';}
function B(c,label,title,arg,cls){ return '<button class="pkw-b '+(cls||'')+'" data-c="'+c+'" title="'+E(title||label)+'" onmousedown="event.preventDefault()" onclick="PK9W.cmd(\''+c+'\''+(arg!=null?',\''+arg+'\'':'')+')">'+label+'</button>'; }
function BL(c,ic,label,title){ return '<button class="pkw-bl" data-c="'+c+'" title="'+E(title||label)+'" onmousedown="event.preventDefault()" onclick="PK9W.cmd(\''+c+'\')">'+sv(ic)+'<span>'+label+'</span></button>'; }
function G(label,inner){ return '<div class="pkw-g"><div class="pkw-gi">'+inner+'</div><div class="pkw-gl">'+label+'</div></div>'; }
var FONTS=[['David Libre','דוד'],['Frank Ruhl Libre','פרנק רוהל'],['Noto Sans Hebrew','נוטו'],['Assistant','אסיסטנט'],['Heebo','היבו'],['Rubik','רוביק'],['Alef','אלף'],['Suez One','סואץ']];
var SIZES=[['2','10'],['3','12'],['4','14'],['5','18'],['6','24'],['7','32']];
var HL=['#FFF0A8','#D7F2D0','#FFD9DE','#D6E8FF','#F3E3C6','transparent'], TX=['#2A1A16','#8A2E3A','#5A1B24','#B8913C','#2E6B45','#1F4E8C','#7A6A5E','#9A2F2F'];
function ribbon(){
  var t=W.tab, h='';
  if(t==='home'){
    h=G('ביטול',B('undo',sv('undo'),'ביטול (Ctrl+Z)')+B('redo',sv('redo'),'בצע שוב (Ctrl+Y)'))
     +G('גופן','<div class="pkw-row"><select class="pkw-sel" id="pkwFont" title="גופן" onmousedown="PK9W.keep()" onchange="PK9W.cmd(\'fontName\',this.value)">'+FONTS.map(function(f){return '<option value="'+f[0]+'" style="font-family:\''+f[0]+'\'">'+f[1]+'</option>';}).join('')+'</select><select class="pkw-sel sm" title="גודל" onmousedown="PK9W.keep()" onchange="PK9W.cmd(\'fontSize\',this.value)">'+SIZES.map(function(z){return '<option value="'+z[0]+'"'+(z[0]==='3'?' selected':'')+'>'+z[1]+'</option>';}).join('')+'</select></div>'
        +'<div class="pkw-row">'+B('bold','<b>B</b>','מודגש (Ctrl+B)')+B('italic','<i>I</i>','נטוי (Ctrl+I)')+B('underline','<u>U</u>','קו תחתון (Ctrl+U)')+B('strikeThrough','<s>S</s>','קו חוצה')
        +'<span class="pkw-pop"><button class="pkw-b" title="צבע מרקר" onmousedown="event.preventDefault()" onclick="PK9W.pal(this)"><span class="pkw-hlc">ab</span></button><span class="pkw-palette">'+HL.map(function(c){return '<i style="background:'+(c==='transparent'?'repeating-linear-gradient(45deg,#ddd 0 3px,#fff 3px 6px)':c)+'" onmousedown="event.preventDefault()" onclick="PK9W.cmd(\'hiliteColor\',\''+c+'\')"></i>';}).join('')+'</span></span>'
        +'<span class="pkw-pop"><button class="pkw-b" title="צבע טקסט" onmousedown="event.preventDefault()" onclick="PK9W.pal(this)"><span class="pkw-txc">A</span></button><span class="pkw-palette">'+TX.map(function(c){return '<i style="background:'+c+'" onmousedown="event.preventDefault()" onclick="PK9W.cmd(\'foreColor\',\''+c+'\')"></i>';}).join('')+'</span></span>'
        +B('removeFormat',sv('clear'),'ניקוי עיצוב')+'</div>')
     +G('פסקה','<div class="pkw-row">'+B('insertUnorderedList',sv('ul'),'תבליטים')+B('insertOrderedList',sv('ol'),'מספור')+B('checklist',sv('check'),'רשימת משימות')+B('outdent',sv('outd'),'הקטנת כניסה')+B('indent',sv('ind'),'הגדלת כניסה')+'</div><div class="pkw-row">'+B('justifyRight',sv('ar'),'יישור לימין')+B('justifyCenter',sv('ac'),'מרכוז')+B('justifyLeft',sv('al'),'יישור לשמאל')+B('justifyFull',sv('aj'),'יישור לשני הצדדים')+'</div>')
     +G('כיוון ומרווח','<div class="pkw-row">'+B('dirRtl','ע←','כיוון מימין לשמאל')+B('dirLtr','→A','כיוון משמאל לימין (לציטוט באנגלית)')+'</div><div class="pkw-row"><select class="pkw-sel sm" title="מרווח שורות" onmousedown="PK9W.keep()" onchange="PK9W.cmd(\'spacing\',this.value)">'+[['1.5','צפוף'],['1.85','רגיל'],['2.2','מרווח']].map(function(z){var n=note(); return '<option value="'+z[0]+'"'+(function(){ var v=+((n&&n.spacing)||1.85); var best=[1.5,1.85,2.2].reduce(function(b,x){return Math.abs(x-v)<Math.abs(b-v)?x:b;}); return String(best)===z[0]?' selected':''; })()+'>'+z[1]+'</option>';}).join('')+'</select></div>')
     +G('סגנונות','<div class="pkw-styles">'+[['p','רגיל','st-p'],['h1','כותרת 1','st-h1'],['h2','כותרת 2','st-h2'],['h3','כותרת 3','st-h3'],['blockquote','ציטוט','st-q'],['law','סעיף / הלכה','st-law'],['tip','שים לב','st-tip']].map(function(s){return '<button class="pkw-st '+s[2]+'" onmousedown="event.preventDefault()" onclick="PK9W.cmd(\'style\',\''+s[0]+'\')">'+s[1]+'</button>';}).join('')+'</div><select id="pkwBlock" class="pkw-sel pkw-hide" onchange="PK9W.cmd(\'style\',this.value)"><option value="p">רגיל</option><option value="h1">כותרת 1</option><option value="h2">כותרת 2</option><option value="h3">כותרת 3</option><option value="blockquote">ציטוט</option></select>');
  } else if(t==='ins'){
    h=G('טבלאות','<span class="pkw-pop">'+BL('table','tbl','טבלה','הוספת טבלה')+'<span class="pkw-grid" id="pkwGrid"></span></span>')
     +G('איורים',BL('image','img','תמונה','תמונה מהמחשב או מהטלפון'))
     +G('תיבות',BL('box_law','box','סעיף / הלכה','תיבת סעיף או הלכה')+BL('box_tip','box','שים לב','תיבת הדגשה')+BL('box_ex','box','דוגמה','תיבת דוגמה'))
     +G('מסמך',BL('toc','toc','תוכן עניינים','תוכן עניינים שמתעדכן לבד')+BL('footnote','fn','הערת שוליים','מספר קטן בטקסט והערה בסוף המסמך'))
     +G('עוד',BL('createLink','link','קישור')+BL('hr','hr','קו מפריד')+BL('date','date','תאריך')+BL('pagebreak','pb','מעבר עמוד'));
  } else if(t==='legal'){
    h=G('חוק ופסיקה',BL('law','law','סעיף חוק','נוסח הסעיף מתוך מאגר החוקים')+BL('case','case','פסק דין','מתוך מאגר הפסיקה של פרקליט')+BL('quoteLesson','quote','ציטוט משיעור','פסקה מתוך סיכום השיעור, עם הפניה'))
     +G('ללמוד מהמסמך',BL('card','card','לכרטיסייה','הטקסט המסומן הופך לכרטיסיית חזרה')+BL('quiz','quiz','שאלות מהמסמך','שאלות בחירה מתוך מה שהדגשת'))
     +G('בדיקה',BL('secs','sec','סעיפים במסמך','כל הסעיפים שהזכרת — עם הנוסח'))
     +G('תבניות',BL('tplEvent','event','שלד אירועון','שלד פתרון אירועון בפלילים'));
  } else if(t==='rev'){
    h=G('הערות',BL('comment','cmt','הערה חדשה','מסמנים טקסט ומוסיפים הערה בצד')+BL('cmts','cmt','כל ההערות'))
     +G('עריכה',BL('far','far','חיפוש והחלפה')+BL('count','cnt','ספירת מילים'))
     +G('היסטוריה',BL('versions','ver','גרסאות','חוזרים לגרסה קודמת של המסמך'))
     +G('ייצוא',BL('export','exp','ייצוא מתקדם','PDF עם עמוד שער, תוכן עניינים ומספרי עמודים'));
  } else if(t==='view'){
    h=G('הצגה',BL('nav','nav','חלונית ניווט')+BL('width','width',W.width==='a4'?'דף רחב':'דף A4')+BL('read','read',W.read?'מצב עריכה':'מצב קריאה'))
     +G('זום',B('zoomOut',sv('zoomout'),'הקטנה')+'<span class="pkw-zv">'+W.zoom+'%</span>'+B('zoomIn',sv('zoomin'),'הגדלה'))
     +G('האזנה',BL('speak','speak',W.speaking?'עצור':'הקרא לי','המערכת מקריאה את המסמך'))
     +G('מסך',BL('fullscreen','full','מסך מלא','מסך מלא של הדפדפן'));
  }
  return h;
}
function ribbonRender(){ var r=document.getElementById('pkwRib'); if(r)r.innerHTML=ribbon(); document.querySelectorAll('#pkwTabs button').forEach(function(b){b.classList.toggle('on',b.dataset.t===W.tab);}); var g=document.getElementById('pkwGrid'); if(g)gridBuild(g); sync(); }
W.tabSet=function(t){ W.tab=t; ribbonRender(); };
W.keep=function(){ saveRange(); };
W.pal=function(btn){ var p=btn.parentNode.querySelector('.pkw-palette'); var open=!p.classList.contains('in'); document.querySelectorAll('.pkw-palette.in,.pkw-grid.in').forEach(function(x){x.classList.remove('in');}); if(open)p.classList.add('in'); };
function gridBuild(g){ var h=''; for(var r=1;r<=6;r++)for(var c=1;c<=7;c++)h+='<i data-r="'+r+'" data-c="'+c+'"></i>'; g.innerHTML='<div class="pkw-gridc">'+h+'</div><em>טבלה</em>';
  g.onmouseover=function(e){ var t=e.target; if(!t.dataset.r)return; var R=+t.dataset.r,C=+t.dataset.c; g.querySelectorAll('i').forEach(function(i){ i.classList.toggle('on',+i.dataset.r<=R&&+i.dataset.c<=C); }); g.querySelector('em').textContent=R+' × '+C; };
  g.onmousedown=function(e){e.preventDefault();}; g.onclick=function(e){ var t=e.target; if(!t.dataset.r)return; g.classList.remove('in'); var R=+t.dataset.r,C=+t.dataset.c; var h='<table class="pkw-tbl">'; for(var r=0;r<R;r++){ h+='<tr>'; for(var c=0;c<C;c++)h+=r===0?'<th><br></th>':'<td><br></td>'; h+='</tr>'; } insertHTML(h+'</table><p><br></p>'); }; }

/* ---------- פקודות ---------- */
W.cmd=function(c,v){
  if(c==='style'){ if(v==='law'||v==='tip'){ boxWrap(v); return; } ex('formatBlock','<'+v+'>'); return; }
  if(c==='fontName'||c==='fontSize'||c==='hiliteColor'||c==='foreColor'){ document.querySelectorAll('.pkw-palette.in').forEach(function(x){x.classList.remove('in');}); ex(c,v); return; }
  if(c==='checklist'){ insertHTML('<ul class="pkw-check"><li>משימה</li><li>משימה</li></ul>'); return; }
  if(c==='table'){ var g=document.getElementById('pkwGrid'); if(g){ var o=!g.classList.contains('in'); document.querySelectorAll('.pkw-palette.in,.pkw-grid.in').forEach(function(x){x.classList.remove('in');}); if(o)g.classList.add('in'); } return; }
  if(c==='image'){ saveRange(); var f=document.createElement('input'); f.type='file'; f.accept='image/*'; f.onchange=function(){ var file=f.files[0]; if(!file)return; var rd=new FileReader(); rd.onload=function(){ var im=new Image(); im.onload=function(){ var k=Math.min(1,1100/im.width), cv=document.createElement('canvas'); cv.width=im.width*k; cv.height=im.height*k; cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height); insertHTML('<img class="pkw-img" src="'+cv.toDataURL('image/jpeg',.82)+'"><p><br></p>'); }; im.src=rd.result; }; rd.readAsDataURL(file); }; f.click(); return; }
  if(c==='box_law'){ insertHTML('<div class="pkw-box law"><b>ס׳ __ / ההלכה</b>הנוסח או ההלכה כאן.</div><p><br></p>'); return; }
  if(c==='box_tip'){ insertHTML('<div class="pkw-box tip"><b>שים לב</b>הנקודה החשובה.</div><p><br></p>'); return; }
  if(c==='box_ex'){ insertHTML('<div class="pkw-box ex"><b>דוגמה</b>מקרה קצר שממחיש את הכלל.</div><p><br></p>'); return; }
  if(c==='createLink'){ saveRange(); var u=prompt('כתובת הקישור:','https://'); if(u)ex('createLink',u); return; }
  if(c==='hr'){ insertHTML('<hr><p><br></p>'); return; }
  if(c==='dirRtl'||c==='dirLtr'){ restore(); var sel=getSelection(); var n0=sel.anchorNode; var b=n0&&(n0.nodeType===3?n0.parentNode:n0); b=b&&b.closest&&b.closest('p,li,h1,h2,h3,blockquote,div,td'); if(b&&P().contains(b)&&b!==P()){ b.setAttribute('dir',c==='dirRtl'?'rtl':'ltr'); b.style.textAlign=c==='dirRtl'?'right':'left'; changed(); } return; }
  if(c==='spacing'){ var nn=note(); if(nn)nn.spacing=v; P().style.lineHeight=v; changed(); return; }
  if(c==='toc'){ insertHTML('<div class="pkw-toc" contenteditable="false"></div><p><br></p>'); tocUpd(); return; }
  if(c==='footnote'){ saveRange(); fnAdd(); return; }
  if(c==='secs'){ W.sideTab='secs'; if(!W.nav)W.cmd('nav'); navBuild(); return; }
  if(c==='comment'){ cmtAdd(); return; } if(c==='cmts'){ W.sideTab='cmts'; if(!W.nav)W.cmd('nav'); navBuild(); return; }
  if(c==='far'){ farDlg(); return; } if(c==='count'){ countDlg(); return; } if(c==='versions'){ verDlg(); return; } if(c==='export'){ save(); expDlg(); return; }
  if(c==='date'){ insertHTML(new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'&nbsp;'); return; }
  if(c==='pagebreak'){ insertHTML('<div class="pkw-pb" contenteditable="false"><span>מעבר עמוד</span></div><p><br></p>'); return; }
  if(c==='law'){ saveRange(); dlgLaw(); return; } if(c==='case'){ saveRange(); dlgCase(); return; } if(c==='quoteLesson'){ saveRange(); dlgQuote(); return; }
  if(c==='card'){ makeCard(); return; } if(c==='quiz'){ quiz(); return; }
  if(c==='tplEvent'){ var n=note(), sb=SUBJECTS.find(function(s){return s.id===(n&&n.subject);}); insertHTML(TPL.event[2](sb?sb.name:'')); return; }
  if(c==='nav'){ W.nav=!W.nav; document.getElementById('pkW').classList.toggle('nonav',!W.nav); return; }
  if(c==='width'){ W.width=W.width==='a4'?'wide':'a4'; document.getElementById('pkW').classList.toggle('wide',W.width==='wide'); ribbonRender(); return; }
  if(c==='read'){ W.read=!W.read; P().contentEditable=!W.read; document.getElementById('pkW').classList.toggle('reading',W.read); ribbonRender(); return; }
  if(c==='zoomIn'||c==='zoomOut'){ W.zoom=Math.max(60,Math.min(170,W.zoom+(c==='zoomIn'?10:-10))); zoom(); ribbonRender(); return; }
  if(c==='speak'){ speak(); return; }
  if(c==='fullscreen'){ try{ if(document.fullscreenElement)document.exitFullscreen(); else document.getElementById('pkW').requestFullscreen(); }catch(e){} return; }
  ex(c,v);
};
function boxWrap(kind){ restore(); var s=window.getSelection(); var txt=s.toString().trim(); var lab=kind==='law'?'סעיף / הלכה':'שים לב'; insertHTML('<div class="pkw-box '+kind+'"><b>'+lab+'</b>'+(txt?E(txt):'כותבים כאן…')+'</div><p><br></p>'); }
function zoom(){ var p=P(); if(p){ p.style.zoom=(W.zoom/100); } var z=document.getElementById('pkwZoomV'); if(z)z.textContent=W.zoom+'%'; var r=document.getElementById('pkwZoomR'); if(r)r.value=W.zoom; }
W.zoomTo=function(v){ W.zoom=+v; zoom(); };

/* ---------- ניווט ---------- */
function navBuild(){ var nv=document.getElementById('pkwNav'), p=P(); if(!nv||!p)return; var hs=p.querySelectorAll('h1,h2,h3'); tocUpd(); fnRenum();
  var st=W.sideTab||'nav', head='<div class="pkw-sth">'+[['nav','ניווט'],['cmts','הערות'],['secs','סעיפים']].map(function(t){ var c=t[0]==='cmts'?cmts().filter(function(x){return !x.done;}).length:0; return '<button class="'+(st===t[0]?'on':'')+'" onclick="PK9W.sideTab=\''+t[0]+'\';PK9W.nb()">'+t[1]+(c?'<i>'+c+'</i>':'')+'</button>'; }).join('')+'</div>';
  Array.prototype.forEach.call(hs,function(h,i){ h.dataset.k=i; });
  if(st==='cmts'){ nv.innerHTML=head+cmtPanel(); return; } if(st==='secs'){ nv.innerHTML=head+secPanel(); return; }
  nv.innerHTML=head+(hs.length?Array.prototype.map.call(hs,function(h,i){ h.dataset.k=i; return '<a class="l'+h.tagName[1]+'" onclick="PK9W.go('+i+')">'+E(h.textContent.trim()||'(כותרת ריקה)')+'</a>'; }).join(''):'<p class="pkw-navn">כותרות שתוסיף יופיעו כאן — לחיצה קופצת אליהן.</p>'); }
W.nb=navBuild;
W.go=function(i){ var h=P().querySelector('[data-k="'+i+'"]'); if(h)h.scrollIntoView({behavior:'smooth',block:'start'}); };

/* ---------- סעיף חי: ריחוף על "ס׳ 25" ---------- */
var tip=null, RX=/(?:סעיף|ס['׳"])\s?(\d{1,3}[א-ת]{0,3})/g;
function hoverSec(e){ var p=P(); if(!p||!document.caretRangeFromPoint)return; var r=document.caretRangeFromPoint(e.clientX,e.clientY); if(!r||r.startContainer.nodeType!==3){ hideTip(); return; }
  var tx=r.startContainer.nodeValue, off=r.startOffset, m, hit=null; RX.lastIndex=0; while((m=RX.exec(tx))){ if(off>=m.index&&off<=m.index+m[0].length){hit=m;break;} }
  if(!hit){ hideTip(); return; } var n=note(), law=lawOf(n&&n.subject), it=secFind(law,hit[1]);
  if(!tip){ tip=document.createElement('div'); tip.id='pkwTip'; document.body.appendChild(tip); }
  tip.innerHTML=it?('<b>ס׳ '+E(hit[1])+' · '+E(secTitle(it))+'</b><em>'+E(lawShort(law))+'</em><p>'+E(it.t.length>380?it.t.slice(0,380)+'…':it.t)+'</p>'):('<b>ס׳ '+E(hit[1])+'</b><em>'+E(lawShort(law))+'</em><p class="mut">הנוסח של הסעיף הזה עוד לא במאגר של פרקליט.</p>');
  tip.style.left=Math.min(window.innerWidth-370,Math.max(10,e.clientX-170))+'px'; tip.style.top=Math.min(window.innerHeight-tip.offsetHeight-14,e.clientY+18)+'px'; tip.classList.add('in'); }
function hideTip(){ if(tip)tip.classList.remove('in'); }

/* ---------- חלונות: סעיף, פסק דין, ציטוט ---------- */
function dlg(title,body,wide){ var d=document.getElementById('pkwDlg'); if(!d){ d=document.createElement('div'); d.id='pkwDlg'; document.getElementById('pkW').appendChild(d); }
  d.innerHTML='<div class="pkw-dbg" onclick="PK9W.dclose()"></div><div class="pkw-d'+(wide?' wide':'')+'"><div class="pkw-dh"><b>'+title+'</b><button onclick="PK9W.dclose()">✕</button></div><div class="pkw-db">'+body+'</div></div>'; d.classList.add('in'); return d; }
W.dclose=function(){ var d=document.getElementById('pkwDlg'); if(d)d.classList.remove('in'); };
function dlgLaw(){ var n=note(), law=lawOf(n&&n.subject); var laws=[]; try{laws=Object.keys(STATUTES).filter(function(k){return (STATUTES[k]||[]).length>5;}).sort();}catch(e){}
  var d=dlg('הוספת סעיף חוק','<label class="pkw-lab">החוק</label><select id="pkwLaw" class="pkw-in">'+laws.map(function(k){return '<option'+(k===law?' selected':'')+'>'+E(k)+'</option>';}).join('')+'</select><label class="pkw-lab">מספר הסעיף</label><input id="pkwSec" class="pkw-in" placeholder="למשל: 25" inputmode="numeric"><div id="pkwSecPrev" class="pkw-prev"><span class="mut">כותבים מספר סעיף — והנוסח מופיע כאן.</span></div><div class="pkw-dact"><button class="pk9-btn" id="pkwSecOk" disabled>הוספה למסמך</button><button class="pk9-btn ghost" onclick="PK9W.dclose()">ביטול</button></div>');
  var inp=d.querySelector('#pkwSec'), sel=d.querySelector('#pkwLaw'), pv=d.querySelector('#pkwSecPrev'), ok=d.querySelector('#pkwSecOk'), cur=null;
  function up(){ cur=secFind(sel.value,inp.value); ok.disabled=!cur; pv.innerHTML=cur?('<b>ס׳ '+E(inp.value)+' — '+E(secTitle(cur))+'</b><p>'+E(cur.t)+'</p>'):(inp.value?'<span class="mut">לא נמצא סעיף '+E(inp.value)+' בחוק הזה במאגר.</span>':'<span class="mut">כותבים מספר סעיף — והנוסח מופיע כאן.</span>'); }
  inp.oninput=up; sel.onchange=up; setTimeout(function(){inp.focus();},50);
  ok.onclick=function(){ if(!cur)return; W.dclose(); insertHTML('<div class="pkw-box law"><b>ס׳ '+E(inp.value)+' ל'+E(lawShort(sel.value))+' — '+E(secTitle(cur))+'</b>"'+E(cur.t)+'"</div><p><br></p>'); }; }
function allCases(){ if(W._cases)return W._cases; var out=[]; try{ SUBJECTS.forEach(function(s){ var cs=[]; try{cs=_concCases(s.id)||[];}catch(e){} cs.forEach(function(c){ var o=c.caseObj||{}; var n=String(o.n||c.name||'').replace(/^\s*:\s*/,'').trim(), r=String(o.r||'').replace(/^\s*:\s*/,'').trim(); if(n&&r.length>25&&!/^ס['׳]/.test(n))out.push({n:n,r:r,c:s.name,l:c.lt||''}); }); }); }catch(e){} W._cases=out; return out; }
function dlgCase(){ var d=dlg('הוספת פסק דין','<input id="pkwCq" class="pkw-in" placeholder="חיפוש לפי שם או נושא — למשל: יששכרוב, הגנה עצמית, אשם תורם"><div id="pkwCl" class="pkw-list"></div>',true);
  var q=d.querySelector('#pkwCq'), l=d.querySelector('#pkwCl'), A=allCases();
  function up(){ var v=q.value.trim(), R=(v?A.filter(function(x){return (x.n+' '+x.r+' '+x.l).indexOf(v)>=0;}):A).slice(0,40); l.innerHTML=R.length?R.map(function(x,i){return '<button data-i="'+A.indexOf(x)+'"><b>'+E(x.n)+'</b><em>'+E(x.c)+(x.l?' · '+E(x.l):'')+'</em><span>'+E(x.r.slice(0,170))+'</span></button>';}).join(''):'<p class="mut">לא נמצאו פסקי דין.</p>'; }
  q.oninput=up; up(); setTimeout(function(){q.focus();},50);
  l.onclick=function(e){ var b=e.target.closest('button'); if(!b)return; var x=A[+b.dataset.i]; W.dclose(); insertHTML('<div class="pkw-case"><b>'+E(x.n)+'</b><span class="pkw-cm">'+E(x.c)+'</span><p>'+E(x.r)+'</p></div><p><br></p>'); }; }
function lessonParas(sid,i){ var CC=(typeof CONTENT!=='undefined')?CONTENT:{}, CX=(typeof CONTENT_EXTRA!=='undefined')?CONTENT_EXTRA:{}; var a=(CC[sid]||{})[i]||{}, b=(CX[sid]||{})[i]||{}; var h=b.summary||a.summary||''; var d=document.createElement('div'); d.innerHTML=h; var out=[];
  d.querySelectorAll('p,li,h4,h3').forEach(function(x){ var t=x.textContent.replace(/\s+/g,' ').trim(); if(t.length>=25||/^H/.test(x.tagName))out.push({h:/^H/.test(x.tagName),t:t}); }); return out; }
function dlgQuote(preS,preL){ var n=note(), sid=preS||(n&&n.subject)||'crime'; 
  var d=dlg('ציטוט מתוך שיעור','<div class="pkw-2"><select id="pkwQs" class="pkw-in">'+SUBJECTS.map(function(s){return '<option value="'+s.id+'"'+(s.id===sid?' selected':'')+'>'+E(s.name)+'</option>';}).join('')+'</select><select id="pkwQl" class="pkw-in"></select></div><div id="pkwQp" class="pkw-list q"></div>',true);
  var S=d.querySelector('#pkwQs'), L=d.querySelector('#pkwQl'), Pp=d.querySelector('#pkwQp');
  function fillL(){ var TT=(LESSON_TOPICS[S.value]||[]); var sb=SUBJECTS.find(function(x){return x.id===S.value;}); var n=Math.max(TT.length,sb?sb.lessons:0); var h=''; for(var i=0;i<n;i++)h+='<option value="'+i+'">שיעור '+(i+1)+(TT[i]?' · '+E(TT[i]):'')+'</option>'; L.innerHTML=h; if(preL!=null){L.value=preL;preL=null;} fillP(); }
  function fillP(){ var ps=lessonParas(S.value,+L.value); Pp.innerHTML=ps.length?ps.map(function(p,i){return p.h?'<div class="qh">'+E(p.t)+'</div>':'<button data-i="'+i+'">'+E(p.t)+'</button>';}).join(''):'<p class="mut">אין עדיין סיכום לשיעור הזה.</p>'; Pp._ps=ps; }
  S.onchange=fillL; L.onchange=fillP; fillL();
  Pp.onclick=function(e){ var b=e.target.closest('button'); if(!b)return; var p=Pp._ps[+b.dataset.i]; var sb=SUBJECTS.find(function(x){return x.id===S.value;}); var tt=(LESSON_TOPICS[S.value]||[])[+L.value]||''; W.dclose(); insertHTML(quoteHTML(p.t,sb?sb.name:'',+L.value,tt)+'<p><br></p>'); }; }
function quoteHTML(t,cname,li,tt){ return '<blockquote class="pkw-q">'+E(t)+'<cite>'+E(cname)+' · שיעור '+(li+1)+(tt?' · '+E(tt):'')+'</cite></blockquote>'; }
W.quoteHTML=quoteHTML;

/* ---------- כרטיסייה ושאלות מהמסמך ---------- */
function makeCard(){ restore(); var s=window.getSelection(), t=s.toString().trim(); if(t.length<8){ PK9.toast('מסמנים במסמך משפט או הגדרה — ואז "לכרטיסייה"'); return; }
  var n=s.anchorNode, h=null, el=n&&(n.nodeType===3?n.parentNode:n); while(el&&el!==P()){ var pr=el; while(pr&&pr!==P()){ if(/^H[1-3]$/.test(pr.tagName)){h=pr;break;} pr=pr.previousElementSibling; } if(h)break; el=el.parentNode; }
  var front=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—')[0].trim():(h?h.textContent.trim():'מה נכון לגבי…'); var back=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—').slice(1).join('—').trim():t;
  var C=LS.g('pk9_cards',[]); var nn=note(); C.unshift({f:front.slice(0,140),b:back.slice(0,500),src:(nn?nn.title:''),ts:Date.now()}); LS.s('pk9_cards',C);
  try{ document.execCommand('hiliteColor',false,'#E9F2FF'); }catch(e){}
  PK9.toast('נוספה כרטיסייה: "'+front.slice(0,40)+'"','לכרטיסיות',function(){ W.close(); pkHubTab('h9Fun','all'); }); }
function quiz(){ var p=P(); var terms=[], seen={}; p.querySelectorAll('b,strong,mark,span[style*="background"]').forEach(function(x){ if(x.closest('h1,h2,h3,th')||(x.parentNode&&x.parentNode.classList&&x.parentNode.classList.contains('pkw-box')&&x===x.parentNode.firstElementChild))return; var t=x.textContent.replace(/\s+/g,' ').trim().replace(/[.:,;]$/,''); if(t.length>=2&&t.length<=30&&t.split(' ').length<=4&&!seen[t]&&!/^ס['׳]/.test(t)){ seen[t]=1; var blk=x.closest('p,li,td,div')||x.parentNode; terms.push({t:t,ctx:blk.textContent.replace(/\s+/g,' ').trim()}); } });
  var Q=terms.filter(function(x){return x.ctx.length>x.t.length+12&&x.ctx.length<300;}).slice(0,8).map(function(x){ var others=terms.filter(function(y){return y.t!==x.t;}).map(function(y){return y.t;}).sort(function(){return Math.random()-.5;}).slice(0,3); var opts=others.concat([x.t]).sort(function(){return Math.random()-.5;}); return {q:x.ctx.split(x.t).join(' _____ '),o:opts,c:opts.indexOf(x.t)}; }).filter(function(q){return q.o.length>=3;});
  if(Q.length<2){ PK9.toast('צריך לפחות 4 מילים מודגשות במסמך כדי לבנות שאלות'); return; }
  var d=dlg('שאלות מהמסמך שלך','<p class="mut" style="margin:0 0 12px">'+Q.length+' שאלות השלמה — נבנו מהמילים שהדגשת במסמך.</p><div class="pkw-qz">'+Q.map(function(q,i){return '<div class="pkw-qq" data-i="'+i+'"><p>'+(i+1)+'. '+E(q.q)+'</p><div>'+q.o.map(function(o,j){return '<button data-j="'+j+'">'+E(o)+'</button>';}).join('')+'</div></div>';}).join('')+'</div>',true);
  d.querySelector('.pkw-qz').onclick=function(e){ var b=e.target.closest('button'); if(!b)return; var box=b.closest('.pkw-qq'); if(box.classList.contains('done'))return; var q=Q[+box.dataset.i]; box.classList.add('done'); box.querySelectorAll('button').forEach(function(x,j){ if(j===q.c)x.classList.add('ok'); else if(x===b)x.classList.add('no'); }); }; }

/* ---------- הקראה ---------- */
function speak(){ var ss=window.speechSynthesis; if(!ss){ PK9.toast('הדפדפן הזה לא תומך בהקראה'); return; }
  if(W.speaking){ ss.cancel(); W.speaking=false; ribbonRender(); return; }
  var txt=P().innerText.replace(/\s+/g,' ').trim(); var parts=txt.match(/[^.!?\n]{1,220}[.!?]?/g)||[txt]; var vs=ss.getVoices(), v=vs.find(function(x){return /^he|iw/i.test(x.lang);});
  W.speaking=true; ribbonRender(); var i=0; (function next(){ if(!W.speaking||i>=parts.length){ W.speaking=false; ribbonRender(); return; } var u=new SpeechSynthesisUtterance(parts[i++]); u.lang='he-IL'; if(v)u.voice=v; u.rate=1; u.onend=next; u.onerror=function(){W.speaking=false;ribbonRender();}; ss.speak(u); })();
  if(!v)PK9.toast('אין קול עברי מותקן בדפדפן — ההקראה תהיה בקול ברירת המחדל'); }

/* ---------- ייצוא ---------- */
var PRINTCSS='.cover{height:24cm;display:flex;flex-direction:column;justify-content:center;text-align:center;page-break-after:always}.cover .k{font:600 10pt Assistant,sans-serif;letter-spacing:.2em;color:#B8913C}.cover .ct{font-size:30pt;border:none;margin:10pt 0}.cover .cl{width:60pt;height:2px;background:#B8913C;margin:6pt auto 18pt}.cover p{font:400 12pt Assistant,sans-serif;color:#5A4A40;margin:2pt}.xtoc{page-break-after:always}.xtoc ol,.pkw-toc ol{list-style:none;padding-right:0}.xtoc li.l3,.pkw-toc li.l3{margin-right:14pt;font-size:11pt;color:#5A4A40}.pkw-toc{border:1px solid #E6DCCD;padding:8pt 14pt;margin:8pt 0}.pkw-toc b{color:#5A1B24}sup.pkw-fn{color:#8A2E3A;font-size:8pt}.pkw-fns{border-top:1px solid #C9BBA6;margin-top:24pt;padding-top:6pt;font-size:10pt}.pkw-fns b{font:600 10pt Assistant,sans-serif;color:#7A6A5E}.cmn{font:italic 9pt Assistant,sans-serif;color:#8A2E3A;margin:0 4pt}body{font-family:"David Libre","Frank Ruhl Libre",serif;direction:rtl;color:#1E1412;line-height:1.75;font-size:12.5pt}h1{font-size:22pt;color:#5A1B24;font-weight:500;margin:0 0 4pt}h2{font-size:15pt;color:#5A1B24;font-weight:500;margin:16pt 0 4pt;border-bottom:1px solid #E6DCCD;padding-bottom:3pt}h3{font-size:13pt;color:#8A2E3A;margin:12pt 0 3pt}.pkw-meta{color:#8A7B70;font-size:10pt}table{border-collapse:collapse;width:100%;margin:8pt 0}th,td{border:1px solid #D9CDBB;padding:5pt 7pt;text-align:right;vertical-align:top}th{background:#F3EDE2}.pkw-box{border-right:4px solid #B8913C;background:#FBF6EA;padding:8pt 12pt;margin:8pt 0}.pkw-box.tip{border-color:#8A2E3A;background:#FBF0F0}.pkw-box.ex{border-color:#2E6B45;background:#EFF6F1}.pkw-box b{display:block;margin-bottom:2pt}blockquote{border-right:3px solid #D9B865;margin:8pt 0;padding:4pt 12pt;color:#4A3A32}cite{display:block;font-size:9pt;color:#8A7B70;font-style:normal;margin-top:3pt}.pkw-case{border:1px solid #E6DCCD;padding:8pt 12pt;margin:8pt 0}.pkw-cm{color:#8A7B70;font-size:9pt;margin-right:6pt}.pkw-pb{page-break-after:always;height:0;overflow:hidden}.pkw-pb span{display:none}img{max-width:100%}';
function docHTML(forWord,o){ o=o||{}; var n=note(), t=E((n&&n.title)||'מסמך'); var tmp=document.createElement('div'); tmp.innerHTML=P().innerHTML;
  if(!o.cm)tmp.querySelectorAll('.pkw-cmt').forEach(function(sp){ while(sp.firstChild)sp.parentNode.insertBefore(sp.firstChild,sp); sp.remove(); });
  else tmp.querySelectorAll('.pkw-cmt').forEach(function(sp){ var c=cmts().find(function(x){return x.id===sp.dataset.c;}); if(c&&c.t){ var m=document.createElement('span'); m.className='cmn'; m.textContent='['+c.who+': '+c.t+']'; sp.after(m); } });
  var body=tmp.innerHTML; var sb=SUBJECTS.find(function(x){return x.id===(n&&n.subject);});
  var cover=o.cover?'<div class="cover"><div class="k">פרקליט · '+E(sb?sb.name:'')+'</div><h1 class="ct">'+t+'</h1><div class="cl"></div><p>'+E(o.name||'')+'</p><p>'+new Date().toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})+'</p></div>':'';
  var hs=Array.prototype.filter.call(P().querySelectorAll('h2,h3'),function(h){return !h.closest('.pkw-toc');});
  var toc=o.toc&&hs.length?'<div class="xtoc"><h2>תוכן עניינים</h2><ol>'+hs.map(function(h){return '<li class="l'+h.tagName[1]+'">'+E(h.textContent.trim())+'</li>';}).join('')+'</ol></div>':'';
  var page='@page{size:A4;margin:2.3cm 2cm 2.2cm;'+(o.num?'@bottom-center{content:counter(page);font:10pt Assistant,sans-serif;color:#8A7B70}':'')+(o.head?'@top-right{content:"'+String((n&&n.title)||'').replace(/"/g,'')+'";font:9pt Assistant,sans-serif;color:#9A8B7E}':'')+'}@page:first{@top-right{content:none}@bottom-center{content:none}}';
  return '<html dir="rtl" lang="he"'+(forWord?' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"':'')+'><head><meta charset="utf-8"><title>'+t+'</title>'+(forWord?'<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->':'<link href="https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500&family=Frank+Ruhl+Libre:wght@400;500&family=Assistant:wght@400;600&display=swap" rel="stylesheet">')+'<style>'+page+PRINTCSS+'</style></head><body>'+cover+toc+body+'</body></html>'; }
W.exportWord=function(){ save(); var n=note(); var b=new Blob(['\ufeff'+docHTML(true)],{type:'application/msword'}); var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=((n&&n.title)||'מסמך').replace(/[\\/:*?"<>|]/g,'')+'.doc'; document.body.appendChild(a); a.click(); a.remove(); PK9.toast('הקובץ ירד — נפתח ב-Word'); };
W.exportPDF=function(o){ save(); var f=document.createElement('iframe'); f.style.cssText='position:fixed;width:0;height:0;border:0;left:-9999px'; document.body.appendChild(f); var d=f.contentWindow.document; d.open(); d.write(docHTML(false,o||LS.g('pk9_exp',{num:true}))); d.close(); W._lastExport=d.documentElement.outerHTML; setTimeout(function(){ try{f.contentWindow.focus();f.contentWindow.print();}catch(e){} setTimeout(function(){f.remove();},4000); },900); PK9.toast('בחלון ההדפסה בוחרים "שמירה כ-PDF"'); };

/* ---------- תוכן עניינים והערות שוליים ---------- */
function tocUpd(){ var p=P(); if(!p)return; var T=p.querySelectorAll('.pkw-toc'); if(!T.length)return; var hs=Array.prototype.filter.call(p.querySelectorAll('h1,h2,h3'),function(h){return !h.closest('.pkw-toc');});
  var html='<b>תוכן עניינים</b><ol>'+hs.filter(function(h){return h.tagName!=='H1';}).map(function(h){return '<li class="l'+h.tagName[1]+'">'+E(h.textContent.trim())+'</li>';}).join('')+'</ol>';
  T.forEach(function(t){ if(t.innerHTML!==html)t.innerHTML=html; }); }
function fnAdd(){ dlg('הערת שוליים','<p class="mut" style="margin:0 0 8px">ההערה תופיע בסוף המסמך, עם מספר קטן במקום שבו עמד הסמן.</p><textarea id="pkwFnT" class="pkw-in" style="height:110px;padding:10px" placeholder="למשל: ע״פ 1234/20 פלוני נ׳ מדינת ישראל, פס׳ 12."></textarea><div class="pkw-dact"><button class="pk9-btn" id="pkwFnOk">הוספה</button><button class="pk9-btn ghost" onclick="PK9W.dclose()">ביטול</button></div>');
  setTimeout(function(){ var t=document.getElementById('pkwFnT'); t&&t.focus(); },40);
  document.getElementById('pkwFnOk').onclick=function(){ var v=document.getElementById('pkwFnT').value.trim(); if(!v)return; W.dclose(); var id='f'+Date.now().toString(36); insertHTML('<sup class="pkw-fn" data-f="'+id+'" contenteditable="false">*</sup>&#8203;'); var p=P(), sec=p.querySelector('.pkw-fns'); if(!sec){ sec=document.createElement('section'); sec.className='pkw-fns'; sec.innerHTML='<b contenteditable="false">הערות שוליים</b><ol></ol>'; p.appendChild(sec); } var li=document.createElement('li'); li.dataset.f=id; li.textContent=v; sec.querySelector('ol').appendChild(li); fnRenum(); changed(); }; }
function fnRenum(){ var p=P(); if(!p)return; var sups=p.querySelectorAll('sup.pkw-fn'), sec=p.querySelector('.pkw-fns'); if(!sec){ return; } var ol=sec.querySelector('ol'); var lis={}; ol.querySelectorAll('li').forEach(function(li){ lis[li.dataset.f]=li; });
  var ord=[]; sups.forEach(function(su,k){ su.textContent=String(k+1); if(lis[su.dataset.f]){ ord.push(lis[su.dataset.f]); delete lis[su.dataset.f]; } }); Object.keys(lis).forEach(function(k){ lis[k].remove(); });
  ord.forEach(function(li){ ol.appendChild(li); }); if(!sups.length)sec.remove(); }
/* ---------- הערות (כמו "סקירה" ב-Word) ---------- */
function cmts(){ var n=note(); if(!n)return []; return n.pk9c||(n.pk9c=[]); }
function cmtAdd(){ restore(); var sel=getSelection(); if(!sel.rangeCount||sel.isCollapsed){ PK9.toast('מסמנים במסמך את הקטע שעליו רוצים להעיר'); return; } var r=sel.getRangeAt(0); if(!P().contains(r.commonAncestorContainer))return;
  var id='c'+Date.now().toString(36), sp=document.createElement('span'); sp.className='pkw-cmt'; sp.dataset.c=id; sp.appendChild(r.extractContents()); r.insertNode(sp); sel.removeAllRanges();
  var u=(typeof currentUser==='function'&&currentUser())||{}; cmts().push({id:id,q:sp.textContent.slice(0,120),t:'',who:u.name||'אני',ts:Date.now(),done:false}); W.sideTab='cmts'; if(!W.nav)W.cmd('nav'); changed(); navBuild(); setTimeout(function(){ var t=document.querySelector('.pkw-cm[data-c="'+id+'"] textarea'); if(t)t.focus(); },60); }
function cmtPanel(){ var C=cmts(); if(!C.length)return '<p class="pkw-navn">מסמנים טקסט במסמך ← "הערה חדשה" (בלשונית סקירה). ההערות נשמרות עם המסמך.</p>';
  return C.map(function(c){ return '<div class="pkw-cm'+(c.done?' done':'')+'" data-c="'+c.id+'"><div class="h"><b>'+E(c.who)+'</b><em>'+new Date(c.ts).toLocaleDateString('he-IL')+'</em></div><q onclick="PK9W.cmtGo(\''+c.id+'\')">'+E(c.q)+'</q><textarea placeholder="כותבים הערה…" oninput="PK9W.cmtSet(\''+c.id+'\',this.value)">'+E(c.t)+'</textarea><div class="a"><button onclick="PK9W.cmtDone(\''+c.id+'\')">'+(c.done?'פתיחה מחדש':'✓ טופל')+'</button><button onclick="PK9W.cmtDel(\''+c.id+'\')">מחיקה</button></div></div>'; }).join(''); }
W.cmtSet=function(id,v){ var c=cmts().find(function(x){return x.id===id;}); if(c){ c.t=v; changed(); } };
W.cmtGo=function(id){ var sp=P().querySelector('.pkw-cmt[data-c="'+id+'"]'); if(sp){ sp.scrollIntoView({behavior:'smooth',block:'center'}); sp.classList.add('flash'); setTimeout(function(){sp.classList.remove('flash');},1400); } };
W.cmtDone=function(id){ var c=cmts().find(function(x){return x.id===id;}); if(c){ c.done=!c.done; var sp=P().querySelector('.pkw-cmt[data-c="'+id+'"]'); if(sp)sp.classList.toggle('done',c.done); changed(); navBuild(); } };
W.cmtDel=function(id){ var n=note(); n.pk9c=cmts().filter(function(x){return x.id!==id;}); var sp=P().querySelector('.pkw-cmt[data-c="'+id+'"]'); if(sp){ while(sp.firstChild)sp.parentNode.insertBefore(sp.firstChild,sp); sp.remove(); } changed(); navBuild(); };
/* ---------- סעיפים במסמך ---------- */
function secPanel(){ var n=note(), law=lawOf(n&&n.subject), txt=P().innerText, seen={}, out=[], m; RX.lastIndex=0; while((m=RX.exec(txt))){ if(!seen[m[1]]){ seen[m[1]]=1; out.push(m[1]); } }
  if(!out.length)return '<p class="pkw-navn">לא הוזכרו סעיפים במסמך. כותבים "ס׳ 25" — והוא יופיע כאן עם הנוסח.</p>';
  return '<p class="pkw-navn" style="margin-bottom:8px">'+out.length+' סעיפים · '+E(lawShort(law))+'</p>'+out.map(function(x){ var it=secFind(law,x); return '<div class="pkw-sc'+(it?'':' miss')+'"><b>ס׳ '+E(x)+(it?' · '+E(secTitle(it)):'')+'</b><p>'+(it?E(it.t.length>220?it.t.slice(0,220)+'…':it.t):'הנוסח עוד לא במאגר של פרקליט')+'</p></div>'; }).join(''); }
/* ---------- חיפוש והחלפה, ספירה ---------- */
function farDlg(){ dlg('חיפוש והחלפה','<label class="pkw-lab">לחפש</label><input id="pkwF1" class="pkw-in"><label class="pkw-lab">להחליף ב-</label><input id="pkwF2" class="pkw-in"><div id="pkwFm" class="mut" style="margin-top:8px;font:400 13px var(--pk-ui)"></div><div class="pkw-dact"><button class="pk9-btn ghost" id="pkwFn">הבא</button><button class="pk9-btn" id="pkwFa">החלפת הכל</button></div>');
  var f1=document.getElementById('pkwF1'), f2=document.getElementById('pkwF2'), msg=document.getElementById('pkwFm'); setTimeout(function(){f1.focus();},40);
  f1.oninput=function(){ var q=f1.value; msg.textContent=q?((P().innerText.split(q).length-1)+' מופעים במסמך'):''; };
  document.getElementById('pkwFn').onclick=function(){ P().focus(); if(!window.find(f1.value,false,false,true))PK9.toast('לא נמצא'); };
  document.getElementById('pkwFa').onclick=function(){ var q=f1.value, r=f2.value; if(!q)return; var w=document.createTreeWalker(P(),NodeFilter.SHOW_TEXT), n, k=0; while((n=w.nextNode())){ if(n.nodeValue.indexOf(q)>=0){ k+=n.nodeValue.split(q).length-1; n.nodeValue=n.nodeValue.split(q).join(r); } } msg.textContent=k?'הוחלפו '+k+' מופעים':'לא נמצא'; changed(); }; }
function countDlg(){ var t=P().innerText||'', w=(t.match(/\S+/g)||[]).length, ch=t.replace(/\s/g,'').length, pa=P().querySelectorAll('p,li').length, pg=Math.max(1,Math.ceil(P().scrollHeight/1123));
  dlg('ספירת מילים','<div class="pkw-cnt">'+[[w.toLocaleString('he-IL'),'מילים'],[ch.toLocaleString('he-IL'),'תווים (בלי רווחים)'],[pa,'פסקאות'],[pg,'עמודים'],[Math.max(1,Math.round(w/200)),'דקות קריאה']].map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('')+'</div>'); }
/* ---------- גרסאות ---------- */
function verKey(){ return 'pk9_ver_'+W.id; }
function snapVer(force){ var n=note(); if(!n||!P())return; var V=LS.g(verKey(),[]); var body=P().innerHTML; if(V.length&&V[0].body===body)return; if(!force&&V.length&&Date.now()-V[0].ts<90000)return;
  V.unshift({ts:Date.now(),body:body,w:(P().innerText.match(/\S+/g)||[]).length}); try{ localStorage.setItem(verKey(),JSON.stringify(V.slice(0,20))); }catch(e){ LS.s(verKey(),V.slice(0,5)); } }
W.snap=snapVer;
function verDlg(){ snapVer(true); var V=LS.g(verKey(),[]);
  dlg('גרסאות של המסמך','<p class="mut" style="margin:0 0 10px">גרסה נשמרת לבד בכל כמה דקות של עבודה. אפשר לחזור לכל אחת מהן.</p><div class="pkw-ver">'+V.map(function(v,i){ return '<div><span class="d"></span><b>'+(i===0?'הגרסה הנוכחית':new Date(v.ts).toLocaleString('he-IL',{day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'}))+'</b><em>'+v.w+' מילים</em>'+(i?'<button onclick="PK9W.verPrev('+i+')">תצוגה</button><button class="r" onclick="PK9W.verRest('+i+')">שחזור</button>':'')+'</div>'; }).join('')+'</div><div id="pkwVp"></div>',true); }
W.verPrev=function(i){ var v=LS.g(verKey(),[])[i]; var el=document.getElementById('pkwVp'); if(v&&el)el.innerHTML='<div class="pkw-vprev">'+v.body+'</div>'; };
W.verRest=function(i){ var v=LS.g(verKey(),[])[i]; if(!v)return; snapVer(true); P().innerHTML=v.body; W.dclose(); changed(); navBuild(); PK9.toast('המסמך חזר לגרסה מ-'+new Date(v.ts).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})); };
/* ---------- ייצוא מתקדם ---------- */
function expDlg(){ var n=note(), u=(typeof currentUser==='function'&&currentUser())||{}; var o=LS.g('pk9_exp',{cover:true,toc:true,num:true,head:true,cm:false});
  dlg('ייצוא המסמך','<div class="pkw-exp"><div class="opts">'+[['cover','עמוד שער','שם המסמך, הקורס, השם שלך והתאריך'],['toc','תוכן עניינים','לפי הכותרות במסמך'],['num','מספרי עמודים','בתחתית כל עמוד'],['head','כותרת עליונה','שם המסמך בראש כל עמוד'],['cm','להשאיר הערות','ההערות שלך כמסגרת בצד הטקסט']].map(function(x){ return '<label><input type="checkbox" data-o="'+x[0]+'"'+(o[x[0]]?' checked':'')+'><span><b>'+x[1]+'</b><em>'+x[2]+'</em></span></label>'; }).join('')
   +'<label class="pkw-lab" style="margin-top:6px">השם שיופיע בעמוד השער</label><input id="pkwExN" class="pkw-in" value="'+E(u.name||'')+'"></div>'
   +'<div class="pv"><div class="pg cov"><i></i><b>'+E((n&&n.title)||'')+'</b><span></span></div><div class="pg"><i class="h"></i><i></i><i></i><i class="s"></i><i></i><em>1</em></div></div></div>'
   +'<div class="pkw-dact"><button class="pk9-btn" id="pkwExP">שמירה כ-PDF</button><button class="pk9-btn ghost" id="pkwExW">הורדה כ-Word</button></div>',true);
  function opts(){ var r={}; document.querySelectorAll('.pkw-exp input[data-o]').forEach(function(i){ r[i.dataset.o]=i.checked; }); LS.s('pk9_exp',r); r.name=document.getElementById('pkwExN').value; return r; }
  document.getElementById('pkwExP').onclick=function(){ var r=opts(); W.dclose(); W.exportPDF(r); };
  document.getElementById('pkwExW').onclick=function(){ opts(); W.dclose(); W.exportWord(); }; }
/* ---------- פתיחה וסגירה ---------- */
function shell(n){ var sb=SUBJECTS.find(function(s){return s.id===n.subject;});
  return '<div class="pkw-top"><button class="pkw-back" onclick="PK9W.close()">'+sv('back')+'<span>המחברת שלי</span></button>'
   +'<div class="pkw-doc"><input id="pkwTitle" value="'+E(n.title||'')+'" placeholder="שם המסמך" oninput="PK9W.changed()"><span class="pkw-crs">'+E(sb?sb.name:'כללי')+'</span></div>'
   +'<span id="pkwSaved" class="pkw-saved">נשמר</span>'
   +'<div class="pkw-acts"><button class="pkw-x" onclick="PK9W.exportWord()" title="הורדה כקובץ Word">'+sv('word')+'<span>Word</span></button><button class="pkw-x gold" onclick="PK9W.cmd(\'export\')" title="שמירה כ-PDF עם עמוד שער ומספרי עמודים">'+sv('pdf')+'<span>ייצוא PDF</span></button></div></div>'
   +'<div class="pkw-tabs" id="pkwTabs">'+[['home','בית'],['ins','הוספה'],['legal','משפטי'],['rev','סקירה'],['view','תצוגה']].map(function(t){return '<button data-t="'+t[0]+'" class="'+(W.tab===t[0]?'on':'')+'" onclick="PK9W.tabSet(\''+t[0]+'\')">'+t[1]+(t[0]==='legal'||t[0]==='rev'?'<i>חדש</i>':'')+'</button>';}).join('')+'</div>'
   +'<div class="pkw-rib" id="pkwRib"></div>'
   +'<div class="pkw-main"><aside class="pkw-nav" id="pkwNav"></aside><div class="pkw-desk" id="pkwDesk"><div class="pkw-paper" id="pkwPaper" contenteditable="true" spellcheck="true" dir="rtl"></div></div></div>'
   +'<div class="pkw-status"><div id="pkwStat"></div><div class="pkw-zoom"><button onclick="PK9W.cmd(\'zoomOut\')">−</button><input id="pkwZoomR" type="range" min="60" max="170" step="10" value="'+W.zoom+'" oninput="PK9W.zoomTo(this.value)"><button onclick="PK9W.cmd(\'zoomIn\')">+</button><span id="pkwZoomV">'+W.zoom+'%</span></div></div>'; }
W.changed=changed;
W.open=function(id,noFlush){ try{ if(!noFlush&&typeof nbFlush==='function')nbFlush(); }catch(e){}
  var n=(STATE.notes||[]).find(function(x){return x.id===id;}); if(!n)return; W.id=id; STATE.nbEditing=id;
  var o=document.getElementById('pkW'); if(!o){ o=document.createElement('div'); o.id='pkW'; document.body.appendChild(o); }
  if(window.innerWidth<900)W.nav=false;
  o.className=(W.nav?'':'nonav ')+(W.width==='wide'?'wide':''); o.innerHTML=shell(n); document.body.classList.add('pkw-open');
  var p=P(); p.innerHTML=n.body||'<h1>'+E(n.title||'')+'</h1><p><br></p>'; if(n.spacing&&+n.spacing>1.2&&+n.spacing<3)p.style.lineHeight=n.spacing; W.sideTab=W.sideTab||'nav'; setTimeout(function(){snapVer(true);},500);
  p.addEventListener('input',changed); p.addEventListener('keyup',function(){saveRange();sync();}); p.addEventListener('mouseup',function(){saveRange();sync();});
  p.addEventListener('mousemove',function(e){ clearTimeout(W._hv); W._hv=setTimeout(function(){hoverSec(e);},120); }); p.addEventListener('mouseleave',hideTip);
  p.addEventListener('click',function(e){ var cm=e.target.closest('.pkw-cmt'); if(cm){ W.sideTab='cmts'; if(!W.nav)W.cmd('nav'); navBuild(); var box=document.querySelector('.pkw-cm[data-c="'+cm.dataset.c+'"]'); if(box){ box.classList.add('flash'); box.scrollIntoView({block:'nearest'}); setTimeout(function(){box.classList.remove('flash');},1200); } } var li=e.target.closest('.pkw-check li'); if(li&&e.offsetX>li.clientWidth-26){ li.classList.toggle('done'); changed(); } });
  p.addEventListener('keydown',function(e){ if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();save();} });
  ribbonRender(); navBuild(); stats(); zoom(); setTimeout(function(){ requestAnimationFrame(function(){o.classList.add('in');}); },10);
  setTimeout(function(){ p.focus(); var r=document.createRange(); r.selectNodeContents(p); r.collapse(false); var s=getSelection(); s.removeAllRanges(); s.addRange(r); saveRange(); },60); };
W.close=function(){ save(); hideTip(); try{speechSynthesis.cancel();}catch(e){} W.speaking=false; var o=document.getElementById('pkW'); if(o){ o.classList.remove('in'); setTimeout(function(){o.remove();},250); } document.body.classList.remove('pkw-open'); try{ if(document.fullscreenElement)document.exitFullscreen(); }catch(e){} try{render();}catch(e){} };
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&document.getElementById('pkW')){ var d=document.getElementById('pkwDlg'); if(d&&d.classList.contains('in'))W.dclose(); else W.close(); } });
document.addEventListener('mousedown',function(e){ if(!e.target.closest('.pkw-pop'))document.querySelectorAll('.pkw-palette.in,.pkw-grid.in').forEach(function(x){x.classList.remove('in');}); });

/* ---------- גלריית תבניות (מחליפה את חלון ה"prompt" של סיכום חדש) ---------- */
W.gallery=function(){ var f=(STATE.nbFilter||{}); var sid=f.subject||'crime';
  var g=document.getElementById('pkwGal'); if(!g){ g=document.createElement('div'); g.id='pkwGal'; document.body.appendChild(g); }
  g.innerHTML='<div class="pkwg-bg" onclick="PK9W.galClose()"></div><div class="pkwg"><div class="pkwg-h"><div><div class="pk9-k">המחברת שלי</div><b>מסמך חדש</b></div><button onclick="PK9W.galClose()">✕</button></div>'
   +'<div class="pkwg-f"><select id="pkwGs" class="pkw-in">'+SUBJECTS.map(function(s){return '<option value="'+s.id+'"'+(s.id===sid?' selected':'')+'>'+E(s.name)+'</option>';}).join('')+'</select></div>'
   +'<div class="pkwg-g">'+Object.keys(TPL).map(function(k){ return '<button onclick="PK9W.newFrom(\''+k+'\')"><span class="pv pv-'+k+'"><i></i><i></i><i></i><i></i><i></i></span><b>'+TPL[k][0]+'</b><em>'+TPL[k][1]+'</em></button>'; }).join('')+'</div></div>';
  requestAnimationFrame(function(){g.classList.add('in');}); };
W.galClose=function(){ var g=document.getElementById('pkwGal'); if(g)g.classList.remove('in'); };
W.newFrom=function(k){ try{ if(typeof nbFlush==='function')nbFlush(); }catch(e){} var sid=(document.getElementById('pkwGs')||{}).value||'crime'; var sb=SUBJECTS.find(function(s){return s.id===sid;}); var cn=sb?sb.name:''; var t=TPL[k]; var body=typeof t[2]==='function'?t[2](cn,sid):t[2];
  var f=STATE.nbFilter||{}; var n={id:uid(),title:(k==='blank'?'מסמך חדש':t[0]+' · '+cn),subject:sid,year:f.year||AY(),semester:f.semester||SM(),body:body,tag:'',pin:false,spacing:'1.9',updated:Date.now()};
  STATE.notes.unshift(n); STATE.nbEditing=n.id; try{persist();}catch(e){} W.galClose(); W.open(n.id,true); };
W.openDemo=function(){ var n=(STATE.notes||[]).find(function(x){return x.pk9demo===2;}); if(!n){ n=W.sampleNote(); STATE.notes.unshift(n); try{persist();}catch(e){} } pkHub('h6Notes'); setTimeout(function(){W.open(n.id);},120); };
try{ window.nbNew=function(){ W.gallery(); }; }catch(e){}

/* ---------- כניסות מהמחברת ---------- */
PK9.hooks.push(function(){ var tb=document.querySelector('.nb-toolbar'); if(tb&&!tb.querySelector('.pk9-full')){ var b=document.createElement('button'); b.className='nb-tb pk9-full'; b.title='פתיחה כמסמך מלא'; b.innerHTML='<span>⛶ מסמך מלא</span>'; b.onclick=function(){ if(STATE.nbEditing)W.open(STATE.nbEditing); }; tb.insertBefore(b,tb.firstChild); }
  var wrap=document.getElementById('nbEditorWrap'); if(wrap&&!document.querySelector('.pk9-nbbar')&&STATE.nbEditing){ var n=note()||(STATE.notes||[]).find(function(x){return x.id===STATE.nbEditing;}); var bar=document.createElement('div'); bar.className='pk9-nbbar'; bar.innerHTML='<div><b>חדש: עורך מסמכים מלא</b><span>מסך מלא, דף A4, ניווט בכותרות, סעיפי חוק ופסקי דין בלחיצה, ייצוא ל-Word ול-PDF</span></div><button class="pk9-btn">פתיחה כמסמך מלא</button>'; bar.querySelector('button').onclick=function(){W.open(STATE.nbEditing);}; wrap.parentNode.insertBefore(bar,wrap.parentNode.firstChild); }
  document.querySelectorAll('.nb-note').forEach(function(el){ if(el.dataset.pk9)return; el.dataset.pk9=1; el.addEventListener('dblclick',function(){ setTimeout(function(){ if(STATE.nbEditing)W.open(STATE.nbEditing); },60); }); }); });

/* ---------- ציטוט מהשיעור: מסמנים טקסט ← "למחברת" ---------- */
var chip=null;
function chipHide(){ if(chip)chip.classList.remove('in'); }
document.addEventListener('mouseup',function(e){ setTimeout(function(){ if(e.target.closest&&e.target.closest('#pk9Chip'))return; var lc=document.getElementById('lessonContent'); if(!lc||typeof STATE==='undefined'||STATE.lesson==null){chipHide();return;}
  var s=window.getSelection(); var t=s.toString().trim(); if(t.length<12||!lc.contains(s.anchorNode)){ chipHide(); return; }
  var r=s.getRangeAt(0).getBoundingClientRect(); if(!chip){ chip=document.createElement('div'); chip.id='pk9Chip'; chip.innerHTML='<button data-a="n">✎ למחברת</button><button data-a="c">🃏 לכרטיסייה</button>'; document.body.appendChild(chip);
    chip.addEventListener('mousedown',function(ev){ev.preventDefault();}); chip.onclick=function(ev){ var b=ev.target.closest('button'); if(!b)return; var tx=chip._t; chipHide(); if(b.dataset.a==='n')toNote(tx); else toCard(tx); }; }
  chip._t=t; chip.style.left=Math.max(8,Math.min(window.innerWidth-230,r.left+r.width/2-110))+'px'; chip.style.top=Math.max(8,r.top-50)+'px'; chip.classList.add('in'); },10); });
document.addEventListener('scroll',chipHide,true);
function toNote(t){ var sid=STATE.subject, li=STATE.lesson; var sb=SUBJECTS.find(function(s){return s.id===sid;}); var tt=(LESSON_TOPICS[sid]||[])[li]||'';
  var n=(STATE.notes||[]).find(function(x){return x.pk9q===sid;}); if(!n){ n={id:uid(),pk9q:sid,title:'ציטוטים מהשיעורים · '+(sb?sb.name:''),subject:sid,year:AY(),semester:SM(),body:'<h1>ציטוטים מהשיעורים · '+E(sb?sb.name:'')+'</h1><p class="pkw-meta">כל מה שסימנת בשיעורים — עם הפניה למקור</p>',tag:'#B8913C',pin:false,updated:Date.now()}; STATE.notes.unshift(n); }
  n.body+='<h2>שיעור '+(li+1)+(tt?' · '+E(tt):'')+'</h2>'+quoteHTML(t,sb?sb.name:'',li,tt); n.updated=Date.now(); try{persist();}catch(e){}
  PK9.toast('נוסף למחברת · "ציטוטים מהשיעורים"','פתיחה',function(){ var id=n.id; STATE.subject=null; STATE.lesson=null; pkHub('h6Notes'); setTimeout(function(){W.open(id);},150); }); }
function toCard(t){ var sid=STATE.subject, li=STATE.lesson; var tt=(LESSON_TOPICS[sid]||[])[li]||''; var f=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—')[0].trim():tt; var b=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—').slice(1).join('—').trim():t;
  var C=LS.g('pk9_cards',[]); C.unshift({f:f.slice(0,140),b:b.slice(0,500),src:'שיעור '+(li+1)+(tt?' · '+tt:''),ts:Date.now()}); LS.s('pk9_cards',C); PK9.toast('נוספה כרטיסייה לחזרה','לכרטיסיות',function(){ STATE.subject=null; STATE.lesson=null; pkHubTab('h9Fun','all'); }); }
W.quoteDemo=function(){ try{ openCourse('crime'); setTimeout(function(){ openLesson(5); setTimeout(function(){ PK9.toast('מסמנים משפט בסיכום — ומופיע כפתור "למחברת"'); var lc=document.getElementById('lessonContent'); var p=lc&&Array.prototype.find.call(lc.querySelectorAll('p'),function(x){return !x.closest('.pk9-simple')&&x.textContent.trim().length>40;}); if(p){ var r=document.createRange(); r.selectNodeContents(p); var s=getSelection(); s.removeAllRanges(); s.addRange(r); p.scrollIntoView({block:'center'}); setTimeout(function(){ document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true})); },300); } },900); },300); }catch(e){} };
})();
