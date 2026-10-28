/* ===== המוח שלי · שדרוג: מילון, מפת נושאים, האזנה, דף למבחן, מה חסר, מה חוזר — pk9 ===== */
(function(){
if(window.PK9B)return;
var E=PK9.E, LS=PK9.LS;
var B=window.PK9B={tab:null};
function KEY(){ try{ var u=currentUser(); return 'pk6_brain_'+(u?u.id:'guest'); }catch(e){ return 'pk6_brain_guest'; } }
function load(){ try{return JSON.parse(localStorage.getItem(KEY())||'[]');}catch(e){return [];} }
function mat(){ if(typeof BR6==='undefined'||!BR6.sel)return null; var id=String(BR6.sel); if(id.indexOf('c_')===0){ var c=id.slice(2), L=load().filter(function(x){return x.course===c;}); if(!L.length)return null;
    var T=[],terms=[],seen={},text=''; L.forEach(function(m){ (m.a.topics||[]).forEach(function(t){T.push(t);}); (m.a.terms||[]).forEach(function(t){ if(!seen[t.t]){seen[t.t]=1;terms.push(t);} }); text+='\n'+(m.text||''); }); return {id:id,name:'כל החומרים',course:c,merged:true,text:text,a:{topics:T,terms:terms}}; }
  return load().find(function(x){return x.id===id;}); }
function cname(c){ var s=(typeof SUBJECTS!=='undefined')?SUBJECTS.find(function(x){return x.id===c;}):null; return s?s.name:''; }
function stars(n){ return '<span class="pk9b-st">'+'★★★'.slice(0,n)+'<i>'+'★★★'.slice(n)+'</i></span>'; }

/* ---------- חומר לדוגמה ---------- */
var S1='סיכום אישי · דיני עונשין · סייגים, ניסיון וצדדים\n\n## ניסיון לעבור עבירה\nניסיון — מעשה שאין בו הכנה בלבד, שנעשה במטרה לבצע עבירה, כשהעבירה לא הושלמה (ס׳ 25 לחוק העונשין).\nהכנה — שלב שקודם לניסיון, וככלל אינה עבירה.\nהקו בין הכנה לניסיון נקבע בפסיקה בעזרת כמה מבחנים: מבחן הצעד האחרון, מבחן הקרבה ומבחן החד-משמעות. במבחן נדרש ליישם יותר ממבחן אחד על העובדות.\nלפי ס׳ 26, אין נפקא מינה אם עשיית העבירה לא הייתה אפשרית מחמת מצב דברים שהמנסה לא היה מודע לו או טעה לגביו.\nפטור עקב חרטה — מי שחדל מהשלמת המעשה מחפץ נפשו בלבד ומתוך חרטה, לא יישא באחריות לניסיון (ס׳ 28). הפטור אינו גורע מאחריות לעבירה מושלמת אחרת שכבר בוצעה.\nלפי ס׳ 27, עונש חובה או עונש מזערי שנקבעו לעבירה לא חלים על ניסיון לעבור אותה.\n\n## צדדים לעבירה\nמבצע בצוותא — מי שמשתתף בביצוע העבירה תוך עשיית מעשים לביצועה (ס׳ 29).\nמבצע באמצעות אחר — מי שמבצע את העבירה בידי אדם אחר שמשמש לו כלי (ס׳ 29).\nמשדל — מי שמביא אחר לידי עשיית עבירה בשכנוע, בעידוד, בדרישה, בהפצרה או בהפעלת לחץ (ס׳ 30).\nמסייע — מי שעושה מעשה כדי לאפשר את הביצוע, להקל עליו או לאבטח אותו (ס׳ 31).\nעונשו של המסייע הוא מחצית העונש שנקבע לעבירה העיקרית (ס׳ 32).\n\n## הגנה עצמית\nהגנה עצמית — מעשה שהיה דרוש באופן מיידי כדי להדוף תקיפה שלא כדין, שנשקפה ממנה סכנה מוחשית של פגיעה בחיים, בחירות, בשלמות הגוף או ברכוש (ס׳ 34י).\nהתנאים שנבחנים: תקיפה שלא כדין, סכנה מוחשית, מיידיות, נחיצות התגובה וסבירותה.\nההגנה לא חלה על מי שהביא בהתנהגותו הפסולה לתקיפה, כשצפה מראש את האפשרות שהדברים יתפתחו כך.\n\n## צורך\nצורך — מעשה שהיה דרוש באופן מיידי כדי להציל חיים, חירות, שלמות גוף או רכוש מסכנה מוחשית של פגיעה חמורה, הנובעת ממצב דברים נתון, כשלא הייתה דרך אחרת (ס׳ 34יא).\nההבדל מהגנה עצמית: בצורך הסכנה נובעת ממצב דברים, ולא מתקיפה של אדם אחר. לכן לעיתים הפגיעה היא בצד שלישי תמים.\n\n## כורח\nכורח — מעשה שאדם נאלץ לעשותו כי נכפה עליו באיום, שנשקפה ממנו סכנה מוחשית של פגיעה חמורה בחיים, בחירות, בשלמות הגוף או ברכוש (ס׳ 34יב).\nבכורח האדם יודע שהוא עובר עבירה, אבל הבחירה נשללה ממנו בפועל.\n\n## דרישת הסבירות\nלפי ס׳ 34טז, הסייגים של הגנה עצמית, צורך וכורח לא יחולו כשהמעשה לא היה סביר בנסיבות העניין לשם מניעת הפגיעה.\nחריגה מהסביר — אינה פוטרת, אבל יכולה להשפיע על העונש.\n\n## טעות במצב דברים\nטעות במצב דברים — מי שעושה מעשה כשהוא מדמה מצב דברים שאינו קיים, יישא באחריות רק במידה שהיה נושא בה אילו המצב היה כפי שדימה (ס׳ 34יח).\nדוגמה: אדם שבטוח שמותקפים אותו, כשבפועל מדובר בהצגה, נבחן כאילו התקיפה הייתה אמיתית.\nטעות במצב משפטי — ככלל אינה פוטרת, אלא אם הייתה בלתי נמנעת באורח סביר (ס׳ 34יט).\n';
var S2='מבחן תרגול · דיני עונשין · נבנה לתרגול בלבד\n\n## שאלה 1 — ניסיון וחרטה\nראובן ושמעון תכננו לפרוץ לחנות. שמעון סיפק לראובן מברג ושמר בחוץ. ראובן התחיל לפרק את המנעול, ובאמצע — מתוך חרטה — עזב והלך הביתה.\nדונו באחריות ראובן לניסיון (ס׳ 25) ובפטור עקב חרטה (ס׳ 28). דונו באחריות שמעון כמסייע (ס׳ 31) או כמבצע בצוותא (ס׳ 29).\nהאם הנזק למנעול הוא עבירה מושלמת שהפטור עקב חרטה לא חל עליה?\n\n## שאלה 2 — הגנה עצמית\nלאה הלכה בלילה וראתה אדם רץ לעברה עם חפץ מבריק ביד. היא דחפה אותו בחוזקה והוא נפצע. התברר שהחפץ היה טלפון והוא רץ לתפוס אוטובוס.\nדונו בהגנה עצמית (ס׳ 34י), בדרישת הסבירות (ס׳ 34טז) ובטעות במצב דברים (ס׳ 34יח).\n\n## שאלה 3 — צורך או כורח\nמטפס הרים נלכד בסופה ופרץ לבקתה נעולה כדי למצוא מחסה ומזון. באותו ערב אדם אחר אולץ באיומי נשק להסיע שני שודדים.\nהבחינו בין צורך (ס׳ 34יא) לבין כורח (ס׳ 34יב). מה דין כל אחד מהם?\n\n## שאלה 4 — שידול\nדנה שכנעה את אחיה לגנוב אופניים מהחצר של השכן, והאח גנב.\nמה אחריותה של דנה כמשדלת (ס׳ 30)? מה היה הדין אילו האח לא היה מבצע את הגניבה?\n';
function addSample(name,text){ var box=document.createElement('div'); box.style.display='none'; box.innerHTML='<input id="br6Name"><textarea id="br6Txt"></textarea><select id="br6Course"><option value="crime">crime</option></select>'; document.body.appendChild(box);
  box.querySelector('#br6Name').value=name; box.querySelector('#br6Txt').value=text; box.querySelector('#br6Course').value='crime'; try{ br6Paste(); }catch(e){ console.warn(e); } box.remove(); }
B.demo=function(tab){ pkHub('h6Brain'); setTimeout(function(){ var L=load(); if(!L.some(function(m){return m.pk9;})){ addSample('מבחן תרגול — דיני עונשין',S2); addSample('הסיכום שלי — סייגים, ניסיון וצדדים',S1); try{ var LL=load(); LL.forEach(function(m){ if(/^(מבחן תרגול|הסיכום שלי) —/.test(m.name))m.pk9=1; }); localStorage.setItem(KEY(),JSON.stringify(LL)); }catch(e){} }
  var M=load().find(function(m){return /^הסיכום שלי —/.test(m.name);}); if(M){ BR6.sel=M.id; BR6.tab='guide'; B.tab=tab||'tools'; render(); try{document.getElementById('content').scrollTop=0;}catch(e){} } },120); };

/* ---------- מה חסר לך ---------- */
var STOP=' של את על עם אל גם כי אם או לא כל זה זו הוא היא יש אין בין לפי מן מה מי עד ו ה ב ל מ — - , '.split(' ');
function covered(text,topic){ var ws=topic.replace(/[(),.\-–—"׳']/g,' ').split(/\s+/).filter(function(w){return w.length>=3&&STOP.indexOf(w)<0;}); if(!ws.length)return 0; var hit=0;
  ws.forEach(function(w){ var w2=w.replace(/^[והבלמשכ](?=[א-ת]{3,})/,''); var stem=w2.length>4?w2.slice(0,w2.length-1):w2; if(text.indexOf(w)>=0||text.indexOf(w2)>=0||text.indexOf(stem)>=0)hit++; }); return hit/ws.length; }
function gapsHtml(m){ var c=m.course; if(!c)return '<div class="pk9b-card"><p class="mut">משייכים את החומר לקורס — ואז אפשר להשוות אותו לכל נושאי הקורס.</p></div>';
  var T=[]; try{T=LESSON_TOPICS[c]||[];}catch(e){} var text=(m.text||'')+' '+(m.a.topics||[]).map(function(t){return t.t;}).join(' ');
  var R=T.map(function(t,i){ var v=covered(text,t); return {t:t,i:i,v:v,s:v>=.6?'ok':v>=.25?'mid':'no'}; }); var ok=R.filter(function(r){return r.s==='ok';}).length, mid=R.filter(function(r){return r.s==='mid';}).length;
  var pc=T.length?Math.round((ok+mid*.5)/T.length*100):0;
  return '<div class="pk9b-card"><div class="pk9b-gh"><div class="pk9b-ring" style="background:conic-gradient(#8A2E3A '+(pc*3.6)+'deg,#F1EBE0 0)"><b>'+pc+'%</b></div><div><h3>מה החומר שלך מכסה — מתוך '+T.length+' הנושאים של '+E(cname(c))+'</h3><p>השוואה בין מה שכתוב בחומר שהעלית לבין נושאי הקורס. <b>'+ok+'</b> מכוסים, <b>'+mid+'</b> חלקית, <b>'+(T.length-ok-mid)+'</b> חסרים.</p></div></div>'
   +'<div class="pk9b-gaps">'+R.map(function(r){ return '<div class="g '+r.s+'"><span class="d"></span><b>'+(r.i+1)+'. '+E(r.t)+'</b><em>'+(r.s==='ok'?'מכוסה':r.s==='mid'?'חלקית':'חסר בחומר')+'</em>'+(r.s!=='ok'?'<button onclick="PK9B.toLesson(\''+c+'\','+r.i+')">לשיעור בקורס ←</button>':'')+'</div>'; }).join('')+'</div>'
   +'<p class="pk9b-note">ההשוואה לפי מילים ומושגים — כדאי לעבור על "חלקית" ולוודא.</p></div>'; }
B.toLesson=function(c,i){ try{ openCourse(c); setTimeout(function(){ openLesson(i); },200); }catch(e){} };

/* ---------- מילון ---------- */
function glossList(T,q){ var R=q?T.filter(function(t){return (t.t+' '+t.d).indexOf(q)>=0;}):T; return R.length?R.map(function(t,i){ var first=(i===0||R[i-1].t[0]!==t.t[0]); return '<div class="t"'+(first?' id="pk9g_'+t.t[0]+'"':'')+'><b>'+E(t.t)+'</b><p>'+E(t.d)+'</p></div>'; }).join(''):'<p class="mut">לא נמצאו מושגים.</p>'; }
function gterms(m){ return (m.a.terms||[]).slice().sort(function(a,b){return a.t.localeCompare(b.t,'he');}); }
function glossHtml(m){ var T=gterms(m); var letters={}; T.forEach(function(t){letters[t.t[0]]=1;});
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>מילון המושגים שלך · '+T.length+' מושגים</h3><input class="pk9b-in" placeholder="חיפוש מושג…" oninput="PK9B.gfilter(this.value)"></div>'
   +'<div class="pk9b-abc">'+Object.keys(letters).sort(function(a,b){return a.localeCompare(b,'he');}).map(function(l){return '<a onclick="var e=document.getElementById(\'pk9g_'+l+'\');e&&e.scrollIntoView({behavior:\'smooth\',block:\'center\'})">'+l+'</a>';}).join('')+'</div>'
   +'<div class="pk9b-gl" id="pk9GL">'+glossList(T,'')+'</div>'
   +'<div class="pk9b-act"><button class="pk9-btn ghost" onclick="PK9B.glossNote()">שמירה במחברת כמסמך</button></div></div>'; }
B.gfilter=function(q){ var m=mat(); var el=document.getElementById('pk9GL'); if(m&&el)el.innerHTML=glossList(gterms(m),q.trim()); };
B.glossNote=function(){ var m=mat(); if(!m)return; var T=(m.a.terms||[]).slice().sort(function(a,b){return a.t.localeCompare(b.t,'he');}); toNote('מילון מושגים · '+m.name,m.course,'<h1>מילון מושגים</h1><p class="pkw-meta">מתוך "'+E(m.name)+'" · נבנה במוח שלי</p><table class="pkw-tbl"><tr><th>מושג</th><th>הגדרה</th></tr>'+T.map(function(t){return '<tr><td><b>'+E(t.t)+'</b></td><td>'+E(t.d)+'</td></tr>';}).join('')+'</table>'); };

/* ---------- מפת נושאים ---------- */
function mapHtml(m){ var T=(m.a.topics||[]).slice(0,10), n=T.length; if(!n)return '<div class="pk9b-card"><p class="mut">לא זוהו נושאים בחומר.</p></div>';
  var W=860,H=520,cx=W/2,cy=H/2,R=Math.min(205,120+n*10); var sel=B.mt==null?0:B.mt;
  var nodes=T.map(function(t,i){ var a=-Math.PI/2+i*2*Math.PI/n; return {t:t,i:i,x:cx+Math.cos(a)*R*1.32,y:cy+Math.sin(a)*R,a:a}; });
  var svg='<svg viewBox="0 0 '+W+' '+H+'" class="pk9b-map">';
  nodes.forEach(function(nd){ var terms=(nd.t.terms||[]).slice(0,2); terms.forEach(function(tt,k){ var a=nd.a+(k?.22:-.22), x=cx+Math.cos(a)*R*1.32*1.0+Math.cos(nd.a)*80, y=cy+Math.sin(a)*R+Math.sin(nd.a)*58; svg+='<line x1="'+nd.x+'" y1="'+nd.y+'" x2="'+x+'" y2="'+y+'" class="lt"/><text x="'+x+'" y="'+(y+4)+'" class="tt">'+E(tt.t)+'</text>'; }); });
  nodes.forEach(function(nd){ svg+='<path d="M'+cx+' '+cy+' Q '+((cx+nd.x)/2+(nd.y-cy)*.08)+' '+((cy+nd.y)/2-(nd.x-cx)*.08)+' '+nd.x+' '+nd.y+'" class="ln'+(nd.i===sel?' on':'')+'"/>'; });
  svg+='<circle cx="'+cx+'" cy="'+cy+'" r="62" class="c0"/><text x="'+cx+'" y="'+(cy-4)+'" class="t0">'+E(m.merged?cname(m.course):'החומר שלי')+'</text><text x="'+cx+'" y="'+(cy+18)+'" class="t1">'+n+' נושאים</text>';
  nodes.forEach(function(nd){ var w=Math.min(190,Math.max(96,nd.t.t.length*8.6+30)), h=40; svg+='<g class="nd'+(nd.i===sel?' on':'')+'" onclick="PK9B.mt='+nd.i+';PK9B.paint()"><rect x="'+(nd.x-w/2)+'" y="'+(nd.y-h/2)+'" width="'+w+'" height="'+h+'" rx="20"/><text x="'+nd.x+'" y="'+(nd.y+5)+'">'+E(nd.t.t.length>22?nd.t.t.slice(0,21)+'…':nd.t.t)+'</text><circle cx="'+(nd.x+w/2-4)+'" cy="'+(nd.y-h/2+4)+'" r="9" class="sb"/><text x="'+(nd.x+w/2-4)+'" y="'+(nd.y-h/2+8)+'" class="sn">'+nd.t.stars+'</text></g>'; });
  svg+='</svg>'; var t=T[sel]||T[0];
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>מפת הנושאים של החומר</h3><span class="mut">לוחצים על נושא — ורואים את עיקרו. המספר = חשיבות למבחן (1–3).</span></div><div class="pk9b-mapw">'+svg+'</div>'
   +'<div class="pk9b-sel"><div class="h"><b>'+E(t.t)+'</b>'+stars(t.stars)+'</div><ul>'+(t.key||[]).map(function(k){return '<li>'+E(k)+'</li>';}).join('')+'</ul>'+((t.refs&&t.refs.secs&&t.refs.secs.length)?'<div class="refs">'+t.refs.secs.map(function(s){return '<span>'+E(s)+'</span>';}).join('')+'</div>':'')+'</div></div>'; }

/* ---------- האזנה ---------- */
function listenHtml(m){ var T=(m.a.topics||[]); var cur=B.li||0, on=!!B.speaking;
  return '<div class="pk9b-card pk9b-pod"><div class="pk9b-podh"><div class="pk9b-podc"><span>🎧</span></div><div><div class="pk9-k">האזנה</div><h3>'+E(m.name)+'</h3><p>המערכת מקריאה את עיקרי החומר שלך — נושא אחרי נושא. טוב לנסיעה, להליכה ולחזרה לפני שינה.</p></div></div>'
   +'<div class="pk9b-ctl"><button class="pk9b-play" onclick="PK9B.play()">'+(on?'❚❚ עצירה':'▶ השמעה')+'</button><button class="pk9-btn ghost" onclick="PK9B.skip(-1)">→ הקודם</button><button class="pk9-btn ghost" onclick="PK9B.skip(1)">הבא ←</button>'
   +'<label class="pk9b-rate">מהירות<select onchange="PK9B.rate=+this.value">'+[[.85,'איטי'],[1,'רגיל'],[1.2,'מהיר']].map(function(r){return '<option value="'+r[0]+'"'+((B.rate||1)===r[0]?' selected':'')+'>'+r[1]+'</option>';}).join('')+'</select></label></div>'
   +'<ol class="pk9b-tl">'+T.map(function(t,i){return '<li class="'+(i===cur?'on':'')+(i<cur?' done':'')+'" onclick="PK9B.li='+i+';PK9B.play(true)"><b>'+E(t.t)+'</b><span>'+(t.key||[]).length+' משפטי מפתח</span></li>';}).join('')+'</ol></div>'; }
function say(txt,done){ var ss=window.speechSynthesis; if(!ss){ PK9.toast('הדפדפן הזה לא תומך בהקראה'); B.speaking=false; return; } var u=new SpeechSynthesisUtterance(txt); u.lang='he-IL'; u.rate=B.rate||1; var v=ss.getVoices().find(function(x){return /^(he|iw)/i.test(x.lang);}); if(v)u.voice=v; u.onend=done; u.onerror=function(){B.speaking=false;B.paint();}; ss.speak(u); }
B.play=function(restart){ var m=mat(); if(!m)return; var ss=window.speechSynthesis; if(B.speaking&&!restart){ B.speaking=false; try{ss.cancel();}catch(e){} B.paint(); return; } try{ss.cancel();}catch(e){}
  B.speaking=true; B.paint(); var T=m.a.topics||[]; (function go(){ if(!B.speaking)return; var t=T[B.li||0]; if(!t){ B.speaking=false; B.li=0; B.paint(); return; } say('נושא '+((B.li||0)+1)+'. '+t.t+'. '+(t.key||[]).join(' '),function(){ if(!B.speaking)return; B.li=(B.li||0)+1; B.paint(); go(); }); })(); };
B.skip=function(d){ var m=mat(); if(!m)return; B.li=Math.max(0,Math.min((m.a.topics||[]).length-1,(B.li||0)+d)); if(B.speaking)B.play(true); else B.paint(); };

/* ---------- דף למבחן ---------- */
function sheetRows(m){ return (m.a.topics||[]).map(function(t){return t;}).sort(function(a,b){return b.stars-a.stars;}); }
function shorten(s,n){ s=String(s||''); return s.length>n?s.slice(0,n-1)+'…':s; }
function sheetHtml(m){ var R=sheetRows(m);
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>דף למבחן — עמוד אחד מרוכז</h3><div class="pk9b-act in"><button class="pk9-btn" onclick="PK9B.sheetNote()">פתיחה במחברת לעריכה</button><button class="pk9-btn ghost" onclick="PK9B.sheetPrint()">הדפסה</button></div></div>'
   +'<div class="pk9b-sheet" id="pk9Sheet"><div class="sh"><b>'+E(m.name)+'</b><span>'+E(cname(m.course))+' · דף למבחן</span></div><table><tr><th>נושא</th><th>העיקר</th><th>סעיפים</th></tr>'
   +R.map(function(t){ return '<tr><td><b>'+E(t.t)+'</b>'+stars(t.stars)+'</td><td>'+(t.key||[]).slice(0,2).map(function(k){return '<p>'+E(shorten(k,170))+'</p>';}).join('')+'</td><td>'+((t.refs&&t.refs.secs)||[]).slice(0,4).map(function(s){return '<span>'+E(s)+'</span>';}).join('')+'</td></tr>'; }).join('')+'</table></div></div>'; }
function sheetDoc(m){ var R=sheetRows(m); return '<h1>דף למבחן · '+E(cname(m.course)||m.name)+'</h1><p class="pkw-meta">נבנה מתוך "'+E(m.name)+'" במוח שלי</p><table class="pkw-tbl"><tr><th>נושא</th><th>העיקר</th><th>סעיפים</th></tr>'+R.map(function(t){return '<tr><td><b>'+E(t.t)+'</b></td><td>'+(t.key||[]).slice(0,2).map(function(k){return E(shorten(k,200));}).join('<br>')+'</td><td>'+((t.refs&&t.refs.secs)||[]).slice(0,4).map(E).join(', ')+'</td></tr>';}).join('')+'</table>'; }
B.sheetNote=function(){ var m=mat(); if(m)toNote('דף למבחן · '+(cname(m.course)||m.name),m.course,sheetDoc(m)); };
B.sheetPrint=function(){ var el=document.getElementById('pk9Sheet'); if(!el)return; var f=document.createElement('iframe'); f.style.cssText='position:fixed;width:0;height:0;border:0;left:-9999px'; document.body.appendChild(f); var d=f.contentWindow.document; d.open(); d.write('<html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Assistant,Arial,sans-serif;font-size:11pt;color:#1E1412}@page{size:A4;margin:1.5cm}.sh b{font-size:16pt;color:#5A1B24;display:block}.sh span{color:#8A7B70;font-size:9pt}table{width:100%;border-collapse:collapse;margin-top:8pt}th,td{border:1px solid #D9CDBB;padding:4pt 6pt;vertical-align:top;text-align:right}th{background:#F3EDE2}td p{margin:0 0 3pt}td span{display:inline-block;margin:0 0 2pt 4pt;color:#7A5A16}.pk9b-st i{opacity:.25;font-style:normal}</style></head><body>'+el.innerHTML+'</body></html>'); d.close(); setTimeout(function(){ try{f.contentWindow.print();}catch(e){} setTimeout(function(){f.remove();},4000); },500); };

function toNote(title,course,body){ var n={id:uid(),title:title,subject:course||'crime',year:'',semester:'',body:body,tag:'#B8913C',pin:false,spacing:'1.9',updated:Date.now()}; try{ n.year=ACAD_YEARS[ACAD_YEARS.length-1]; n.semester=SEMESTERS[0]; }catch(e){} STATE.notes.unshift(n); STATE.nbEditing=n.id; try{persist();}catch(e){}
  PK9.toast('נוצר מסמך במחברת','פתיחה',function(){ pkHub('h6Notes'); setTimeout(function(){ PK9W.open(n.id,true); },150); }); pkHub('h6Notes'); setTimeout(function(){ PK9W.open(n.id,true); },150); }

/* ---------- מה חוזר בחומרים (ברמת הקורס) ---------- */
function recurHtml(L){ var by={}; L.forEach(function(m){ (by[m.course||'']=by[m.course||'']||[]).push(m); });
  var out=''; Object.keys(by).forEach(function(c){ var G=by[c]; if(G.length<2)return; var cnt={}, occ={};
    G.forEach(function(m){ var seen={}; var rs=/(?:סעיף|ס['׳])\s*(\d{1,3}[א-ת]{0,3})/g, x; while((x=rs.exec(m.text||''))){ var k='ס׳ '+x[1]; occ[k]=(occ[k]||0)+1; if(!seen[k]){seen[k]=1;cnt[k]=(cnt[k]||0)+1;} }
      (m.a.terms||[]).forEach(function(t){ var k=t.t; G.forEach(function(o){ if(o!==m&&(o.text||'').indexOf(k)>=0){ var kk='מושג: '+k; if(!seen[kk]){seen[kk]=1;cnt[kk]=(cnt[kk]||0)+1; occ[kk]=(occ[kk]||0)+((o.text||'').split(k).length-1);} } }); }); });
    var R=Object.keys(cnt).filter(function(k){return cnt[k]>=2||/^מושג/.test(k);}).sort(function(a,b){return (occ[b]||0)-(occ[a]||0);}).slice(0,12); if(!R.length)return; var mx=Math.max.apply(null,R.map(function(k){return occ[k]||1;}));
    out+='<div class="pk9b-card pk9b-rec"><div class="pk9b-row"><h3>מה חוזר בחומרים שלך · '+E(cname(c)||'ללא קורס')+'</h3><span class="mut">מה מופיע ביותר מחומר אחד — סיכום, מבחן קודם, מצגת</span></div><div class="pk9b-bars">'
     +R.map(function(k){ var v=occ[k]||1; return '<div><b>'+E(k.replace(/^מושג: /,''))+'</b><i><em style="width:'+Math.round(v/mx*100)+'%"></em></i><span>'+v+' פעמים</span></div>'; }).join('')+'</div></div>'; });
  return out; }

/* ---------- הזרקה למסכי המוח ---------- */
/* ---------- כלים חכמים: סיכום ב-3 רמות, השוואה, שאלות פתוחות, כרטיסיות ---------- */
function shortS(s,n){ s=String(s||'').replace(/\s+/g,' ').trim(); if(s.length<=n)return s; var c=s.slice(0,n); var k=Math.max(c.lastIndexOf(','),c.lastIndexOf(' — '),c.lastIndexOf(';')); return (k>n*.5?c.slice(0,k):c.slice(0,c.lastIndexOf(' ')))+'…'; }
function levelsHtml(m){ var L=B.lv||'p', T=m.a.topics||[];
  var body=T.map(function(t){ var k=t.key||[]; if(L==='s')return '<li><b>'+E(t.t)+'</b> — '+E(shortS(k[0]||'',120))+'</li>'; if(L==='p')return '<div class="pk9b-lvp"><h4>'+E(t.t)+'</h4><p>'+E(k.slice(0,2).join(' '))+'</p></div>';
    return '<div class="pk9b-lvp"><h4>'+E(t.t)+stars(t.stars)+'</h4>'+k.map(function(x){return '<p>'+E(x)+'</p>';}).join('')+((t.terms||[]).length?'<div class="tm">'+t.terms.map(function(x){return '<span><b>'+E(x.t)+'</b> — '+E(shortS(x.d,90))+'</span>';}).join('')+'</div>':'')+((t.refs&&t.refs.secs&&t.refs.secs.length)?'<div class="refs">'+t.refs.secs.map(function(x){return '<span>'+E(x)+'</span>';}).join('')+'</div>':'')+'</div>'; }).join('');
  var w=function(h){ return (String(h).replace(/<[^>]+>/g,' ').match(/\S+/g)||[]).length; };
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>סיכום בשלוש רמות</h3><div class="pk9b-seg">'+[['s','במשפט אחד'],['p','בפסקה'],['f','מלא']].map(function(x){return '<button class="'+(L===x[0]?'on':'')+'" onclick="PK9B.lv=\''+x[0]+'\';PK9B.paint()">'+x[1]+'</button>';}).join('')+'</div></div>'
   +'<p class="mut" style="margin:-6px 0 14px">'+w(body)+' מילים · '+(L==='s'?'לחזרה של דקה לפני שנכנסים למבחן':L==='p'?'לחזרה רגילה':'לקריאה מלאה עם מונחים וסעיפים')+'</p>'
   +(L==='s'?'<ol class="pk9b-lvs">'+body+'</ol>':body)+'<div class="pk9b-act"><button class="pk9-btn ghost" onclick="PK9B.levelsNote()">פתיחה במחברת לעריכה</button></div></div>'; }
B.levelsNote=function(){ var m=mat(); if(!m)return; var L=B.lv||'p'; toNote('סיכום · '+m.name,m.course,'<h1>'+E(m.name)+'</h1><p class="pkw-meta">סיכום '+(L==='s'?'במשפט אחד לנושא':L==='p'?'בפסקה לנושא':'מלא')+' · נבנה במוח שלי</p>'+(m.a.topics||[]).map(function(t){ var k=t.key||[]; return '<h2>'+E(t.t)+'</h2>'+(L==='s'?'<p>'+E(shortS(k[0]||'',140))+'</p>':(L==='p'?k.slice(0,2):k).map(function(x){return '<p>'+E(x)+'</p>';}).join('')); }).join('')); };
function cmpHtml(m){ var T=m.a.topics||[]; if(!B.cs)B.cs=T.slice(0,3).map(function(t,i){return i;}); var S=B.cs.filter(function(i){return T[i];});
  var rows=[['מה זה',function(t){return E(shortS((t.key||[])[0]||'',190));}],['עוד חשוב לדעת',function(t){return E(shortS((t.key||[])[1]||'',170));}],['סעיפים',function(t){ return ((t.refs&&t.refs.secs)||[]).map(function(x){return '<span class="pk9b-tag">'+E(x)+'</span>';}).join(' ')||'—'; }],['מונחים',function(t){ return (t.terms||[]).slice(0,4).map(function(x){return E(x.t);}).join(' · ')||'—'; }],['חשיבות למבחן',function(t){return stars(t.stars);}]];
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>השוואה בין נושאים</h3><span class="mut">בוחרים עד 3 נושאים — והטבלה נבנית מהחומר שלך</span></div>'
   +'<div class="pk9b-chips">'+T.map(function(t,i){return '<button class="'+(S.indexOf(i)>=0?'on':'')+'" onclick="PK9B.csT('+i+')">'+E(t.t)+'</button>';}).join('')+'</div>'
   +'<div class="pk9b-cmpw"><table class="pk9b-cmp"><tr><th></th>'+S.map(function(i){return '<th>'+E(T[i].t)+'</th>';}).join('')+'</tr>'+rows.map(function(r){return '<tr><td class="rh">'+r[0]+'</td>'+S.map(function(i){return '<td>'+r[1](T[i])+'</td>';}).join('')+'</tr>';}).join('')+'</table></div>'
   +'<div class="pk9b-act"><button class="pk9-btn ghost" onclick="PK9B.cmpNote()">שמירה במחברת כטבלה</button></div></div>'; }
B.csT=function(i){ var a=B.cs||[]; var k=a.indexOf(i); if(k>=0)a.splice(k,1); else { a.push(i); if(a.length>3)a.shift(); } B.cs=a; B.paint(); };
B.cmpNote=function(){ var m=mat(); if(!m)return; var T=m.a.topics, S=(B.cs||[]).filter(function(i){return T[i];}); toNote('השוואה · '+S.map(function(i){return T[i].t;}).join(' / '),m.course,'<h1>השוואה בין נושאים</h1><p class="pkw-meta">מתוך "'+E(m.name)+'"</p><table class="pkw-tbl"><tr><th></th>'+S.map(function(i){return '<th>'+E(T[i].t)+'</th>';}).join('')+'</tr><tr><td><b>מה זה</b></td>'+S.map(function(i){return '<td>'+E((T[i].key||[])[0]||'')+'</td>';}).join('')+'</tr><tr><td><b>סעיפים</b></td>'+S.map(function(i){return '<td>'+E(((T[i].refs&&T[i].refs.secs)||[]).join(', '))+'</td>';}).join('')+'</tr><tr><td><b>מונחים</b></td>'+S.map(function(i){return '<td>'+E((T[i].terms||[]).map(function(x){return x.t;}).join(', '))+'</td>';}).join('')+'</tr></table>'); };
function openHtml(m){ var T=m.a.topics||[]; var i=B.oq==null?0:B.oq; var t=T[i]; if(!t)return '';
  var ans=(B.oa||{})[i]||''; var terms=(t.terms||[]).map(function(x){return x.t;}).concat(((t.refs&&t.refs.secs)||[])); var hit=terms.filter(function(x){ var y=x.replace(/^ס׳\s*/,''); return ans.indexOf(x)>=0||(y!==x&&ans.indexOf(y)>=0); });
  return '<div class="pk9b-card pk9b-oq"><div class="pk9b-row"><h3>שאלות פתוחות — כמו במבחן</h3><div class="pk9b-nav"><button onclick="PK9B.oqGo(-1)">→</button><span>'+(i+1)+' / '+T.length+'</span><button onclick="PK9B.oqGo(1)">←</button></div></div>'
   +'<div class="q"><span>שאלה '+(i+1)+' · '+E(t.t)+'</span><p>הסבירו את סוגיית "'+E(t.t)+'": מה הכלל, מה התנאים או המבחנים, ואילו סעיפים רלוונטיים. הדגימו על מקרה קצר.</p></div>'
   +'<textarea placeholder="כותבים כאן את התשובה שלכם, כמו במבחן…" oninput="PK9B.oaSet('+i+',this.value)">'+E(ans)+'</textarea>'
   +'<div class="pk9b-chk"><b>מה כדאי שיופיע בתשובה</b><div>'+(terms.length?terms.map(function(x){ return '<span class="'+(hit.indexOf(x)>=0?'ok':'')+'">'+(hit.indexOf(x)>=0?'✓ ':'')+E(x)+'</span>'; }).join(''):'<em>אין מונחים מוגדרים לנושא הזה</em>')+'</div>'+(ans.length>20&&terms.length?'<p>הזכרת '+hit.length+' מתוך '+terms.length+' — '+(hit.length>=terms.length*.7?'תשובה מקיפה.':hit.length>=terms.length*.4?'כדאי להוסיף את מה שחסר.':'חסרים מרכיבים מרכזיים.')+'</p>':'')+'</div>'
   +'<details class="pk9b-sk"'+(B.osk?' open':'')+' ontoggle="PK9B.osk=this.open"><summary>הצגת שלד התשובה</summary><ol><li><b>הכלל:</b> '+E((t.key||[])[0]||'')+'</li>'+((t.key||[]).slice(1,3).map(function(x){return '<li><b>פירוט:</b> '+E(x)+'</li>';}).join(''))+(((t.refs&&t.refs.secs)||[]).length?'<li><b>מקור:</b> '+E(t.refs.secs.join(', '))+'</li>':'')+'<li><b>יישום:</b> מחילים את התנאים על העובדות — אחד אחד.</li><li><b>מסקנה:</b> משפט אחד ברור.</li></ol><p class="mut">השלד נבנה מתוך החומר שלך — לא ממקור חיצוני.</p></details></div>'; }
B.oqGo=function(d){ var m=mat(); if(!m)return; var n=(m.a.topics||[]).length; B.oq=((B.oq||0)+d+n)%n; B.osk=false; B.paint(); };
B.oaSet=function(i,v){ B.oa=B.oa||{}; B.oa[i]=v; clearTimeout(B._ot); B._ot=setTimeout(function(){ var ta=document.querySelector('.pk9b-oq textarea'); var pos=ta?ta.selectionStart:0; B.paint(); var t2=document.querySelector('.pk9b-oq textarea'); if(t2){ t2.focus(); t2.setSelectionRange(pos,pos); } },700); };
function cardsHtml(m){ var T=(m.a.terms||[]); if(!T.length)return '<div class="pk9b-card"><p class="mut">לא זוהו מונחים בחומר.</p></div>';
  var K='pk9_fc_'+m.id, S=LS.g(K,{}); if(!B.fq||B.fqm!==m.id){ B.fqm=m.id; B.fq=T.map(function(t,i){return i;}).filter(function(i){return S[T[i].t]!=='y';}); if(!B.fq.length)B.fq=T.map(function(t,i){return i;}); B.ff=false; }
  var known=T.filter(function(t){return S[t.t]==='y';}).length, cur=T[B.fq[0]];
  return '<div class="pk9b-card"><div class="pk9b-row"><h3>כרטיסיות חזרה</h3><span class="mut">'+known+' מתוך '+T.length+' כבר ידועים · מה שלא ידעת — חוזר שוב בסוף</span></div><div class="pk9b-fbar"><i style="width:'+Math.round(known/T.length*100)+'%"></i></div>'
   +(cur?'<div class="pk9b-flip'+(B.ff?' on':'')+'" onclick="PK9B.ff=!PK9B.ff;PK9B.paint()"><div class="a"><span>מונח</span><b>'+E(cur.t)+'</b><em>לוחצים כדי להפוך</em></div><div class="b"><span>'+E(cur.t)+'</span><p>'+E(cur.d)+'</p></div></div>'
     +'<div class="pk9b-fact"><button class="no" onclick="PK9B.fc(0)">עוד לא ידעתי</button><button class="yes" onclick="PK9B.fc(1)">ידעתי ✓</button></div>':'<div class="pk9b-done">🎉 עברת על כל המונחים!<button class="pk9-btn ghost" onclick="localStorage.removeItem(\''+K+'\');PK9B.fq=null;PK9B.paint()">להתחיל מחדש</button></div>')+'</div>'; }
B.fc=function(y){ var m=mat(); if(!m)return; var T=m.a.terms, K='pk9_fc_'+m.id, S=LS.g(K,{}); var i=B.fq.shift(); S[T[i].t]=y?'y':'n'; LS.s(K,S); if(!y)B.fq.push(i); B.ff=false; B.paint(); };
var TOOLS=[['levels','סיכום בשלוש רמות','משפט, פסקה או מלא — לפי כמה זמן יש','≡'],['map','מפת נושאים','כל הנושאים והקשרים במבט אחד','◎'],['gloss','מילון מושגים','כל ההגדרות מהחומר, לפי א-ב','א'],['listen','האזנה','המערכת מקריאה את עיקרי החומר','♪'],['sheet','דף למבחן','עמוד אחד מרוכז להדפסה','▤'],['gaps','מה חסר לך','מה החומר מכסה מתוך נושאי הקורס','◔']];
function statsHtml(m){ var T=(m.a.topics||[]), n=T.length, tm=(m.a.terms||[]).length, sc={}; T.forEach(function(t){ ((t.refs&&t.refs.secs)||[]).forEach(function(x){sc[x]=1;}); });
  return '<div class="pk9b-stats"><div><b>'+n+'</b><span>נושאים זוהו</span></div><div><b>'+tm+'</b><span>מונחים</span></div><div><b>'+Object.keys(sc).length+'</b><span>סעיפי חוק</span></div><p>הכלים מסדרים ומדגישים את מה שכתוב בחומר שלך. ניתוח עמוק עם בינה מלאכותית יתווסף בשלב הבא.</p></div>'; }

/* ---------- שאלות תרגול משופרות (מסיחים דומים, בלי חיתוך ובלי רמזים) ---------- */
function qClean(d){ d=String(d||'').replace(/\s*\((?:ס['׳]|סעיף)[^)]*\)/g,'').replace(/\s*[.…]+\s*$/,'').replace(/\s+/g,' ').trim(); return d; }
function qCut(d,n){ d=qClean(d); if(d.length<=n)return d; var c=d.slice(0,n), k=Math.max(c.lastIndexOf(', '),c.lastIndexOf(' — '),c.lastIndexOf('; '),c.lastIndexOf('. ')); return (k>n*.55?c.slice(0,k):c.slice(0,c.lastIndexOf(' '))).replace(/[,;—\s]+$/,''); }
function qShuf(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function qNear(arr,key,len,n){ return arr.slice().sort(function(a,b){ return Math.abs(key(a).length-len)-Math.abs(key(b).length-len); }).slice(0,n); }
function betterQ(m){ var a=m.a; if(!a||a.q9||!a.terms||a.terms.length<4)return false; var T=a.terms, Q=[], tops=a.topics||[];
  T.forEach(function(tt){ var ti=0; tops.forEach(function(x,i){ if((x.terms||[]).some(function(y){return y.t===tt.t;}))ti=i; });
    var d=qCut(tt.d,200); if(d.length<20)return;
    var others=T.filter(function(x){return x.t!==tt.t&&qCut(x.d,200).length>=20;}); if(others.length<3)return;
    var dis=qNear(qShuf(others),function(x){return qCut(x.d,200);},d.length,3).map(function(x){return qCut(x.d,200);});
    var o=qShuf([d].concat(dis)); Q.push({ty:'mc',k:'הגדרה',ti:ti,q:'מהו "'+tt.t+'"?',o:o,c:o.indexOf(d),ex:tt.src||tt.d});
    var nm=qShuf(others).slice(0,3).map(function(x){return x.t;}), o2=qShuf([tt.t].concat(nm)); Q.push({ty:'mc',k:'איזה מונח',ti:ti,q:'איזה מונח מתאים להגדרה: "'+qCut(tt.d,170)+'"?',o:o2,c:o2.indexOf(tt.t),ex:tt.src||tt.d}); });
  (a.q||[]).forEach(function(q){ if(q.ty==='mc')return; if(q.ty==='tf'||q.k==='השלמה'){ if((q.o||[]).some(function(x){return /…/.test(x);}))return; } Q.push(q); });
  a.q=qShuf(Q.filter(function(q){return q.ty==='mc';})).concat(Q.filter(function(q){return q.ty!=='mc';})).slice(0,80); a.q9=1; return true; }
function upgradeQ(){ try{ var L=load(), ch=false; L.forEach(function(m){ if(betterQ(m))ch=true; }); if(ch)localStorage.setItem(KEY(),JSON.stringify(L)); }catch(e){} }
function tidyBrain(){ document.querySelectorAll('.br7-tabs button').forEach(function(b){ if(b.textContent.trim()==='שאל את החומר'){ b.textContent='חיפוש בחומר'; } });
  document.querySelectorAll('.br6-askh b').forEach(function(b){ if(b.textContent.trim()==='שאל את החומר')b.textContent='חיפוש בחומר'; });
  document.querySelectorAll('.br6-mode').forEach(function(d){ var t=(d.querySelector('b')||{}).textContent||''; if(t==='כרטיסיות מונחים'||t==='משחק התאמה')d.style.display='none'; }); }
function toolsHtml(m){ return '<div class="pk9b-card"><div class="pk9b-row"><div><div class="pk9-k">המוח שלי · כלים חכמים</div><h3>מה נעשה עם "'+E(m.name)+'"?</h3></div><span class="mut">נבנה מתוך החומר שלך, בלי שרת, ונשאר רק אצלך</span></div>'+statsHtml(m)+'<div class="pk9b-tools">'
  +TOOLS.map(function(t,k){return '<button onclick="PK9B.set(\''+t[0]+'\')"><span class="ic">'+t[3]+'</span><b>'+t[1]+''+'</b><em>'+t[2]+'</em></button>';}).join('')+'</div></div>'; }
B.set=function(t){ if(t!=='listen'&&B.speaking){ B.speaking=false; try{speechSynthesis.cancel();}catch(e){} } B.tab=t; B.paint(); try{document.querySelector('.br7-tabs').scrollIntoView({block:'nearest'});}catch(e){} };
B.paint=function(){ var host=document.querySelector('.br6.br7'); var hero=host&&host.querySelector('.br7-mhero'); if(!hero)return; var m=mat(); if(!m)return;
  var tabs=hero.querySelector('.br7-tabs'); if(tabs){ tabs.querySelectorAll('button').forEach(function(b){ if(b.dataset.pk9)b.classList.toggle('on',!!B.tab); else if(B.tab)b.classList.remove('on'); }); }
  if(!B.tab)return; var box=host.querySelector('.pk9b'); if(!box){ while(hero.nextSibling)hero.nextSibling.remove(); box=document.createElement('div'); box.className='pk9b'; host.appendChild(box); }
  var t=B.tab, tl=TOOLS.find(function(x){return x[0]===t;});
  var inner=t==='tools'?toolsHtml(m):t==='map'?mapHtml(m):t==='gloss'?glossHtml(m):t==='listen'?listenHtml(m):t==='sheet'?sheetHtml(m):t==='gaps'?gapsHtml(m):t==='levels'?levelsHtml(m):t==='cmp'?cmpHtml(m):t==='open'?openHtml(m):t==='cards'?cardsHtml(m):'';
  box.innerHTML=(t!=='tools'?'<a class="pk9b-back" onclick="PK9B.set(\'tools\')">→ כל הכלים החכמים</a>':'')+inner; };
PK9.hooks.push(function(){ if(typeof STATE==='undefined'||typeof BR6==='undefined')return; var host=document.querySelector('.br6.br7'); if(!host)return; upgradeQ(); tidyBrain();
  var hero=host.querySelector('.br7-mhero');
  if(hero){ var tabs=hero.querySelector('.br7-tabs'); if(tabs&&!tabs.querySelector('[data-pk9]')){ var b=document.createElement('button'); b.dataset.pk9='tools'; b.className='pk9b-tt'; b.innerHTML='✦ כלים חכמים<i class="pk9b-new">חדש</i>'; b.onclick=function(){ B.set('tools'); }; tabs.insertBefore(b,tabs.children[1]||null); }
    if(B.tab)B.paint(); return; }
  /* מסך הבית של המוח */
  if(!host.dataset.dz){ host.dataset.dz=1; var ov=null;
    host.addEventListener('dragover',function(e){ if(!e.dataTransfer||[].indexOf.call(e.dataTransfer.types||[],'Files')<0)return; e.preventDefault(); if(!ov){ ov=document.createElement('div'); ov.className='pk9b-dz'; ov.innerHTML='<div><span>🧠</span><b>משחררים כאן</b><em>PDF, Word או טקסט — והמוח שלי לומד אותו</em></div>'; document.body.appendChild(ov); } });
    document.addEventListener('dragleave',function(e){ if(ov&&(e.clientX<=0||e.clientY<=0||e.clientX>=innerWidth||e.clientY>=innerHeight)){ ov.remove(); ov=null; } });
    host.addEventListener('drop',function(e){ if(!e.dataTransfer||!e.dataTransfer.files.length)return; e.preventDefault(); if(ov){ ov.remove(); ov=null; } try{ br6Files({files:e.dataTransfer.files}); }catch(x){} }); }
  var L=load(); var h=host.querySelector('.br7-hero');
  if(h&&!host.querySelector('.pk9b-home')){ var d=document.createElement('div'); d.className='pk9b-home';
    d.innerHTML=(L.length?recurHtml(L):'')+(!L.some(function(m){return m.pk9;})?'<div class="pk9b-demo"><div><b>רוצה לראות איך זה עובד?</b><span>טוענים סיכום לדוגמה ומבחן תרגול בדיני עונשין — ורואים את כל הכלים החכמים.</span></div><button class="pk9-btn" onclick="PK9B.demo()">טעינת חומר לדוגמה</button></div>':'');
    if(d.innerHTML)h.parentNode.insertBefore(d,h.nextSibling); } });
function wrap(n,fn){ var o=window[n]; if(typeof o!=='function')return; window[n]=function(){ fn.apply(this,arguments); return o.apply(this,arguments); }; }
function boot(){ wrap('br6Tab',function(){ B.tab=null; }); wrap('br6Back',function(){ B.tab=null; B.speaking=false; try{speechSynthesis.cancel();}catch(e){} }); wrap('br6Open',function(){ B.tab=null; B.li=0; }); wrap('br6Course',function(){ B.tab=null; B.li=0; });
  ['br6Quiz','br6Exam','br6Fc'].forEach(function(n){ wrap(n,function(){ B.tab=null; }); }); }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,50);}); else setTimeout(boot,50);
})();
