import json,importlib.util,sys,os,html
D=os.path.dirname(os.path.abspath(__file__))
def load(n):
    sp=importlib.util.spec_from_file_location(n,os.path.join(D,n+'.py')); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
LESSONS=[load(f) for f in ['l1','l4'] if os.path.exists(os.path.join(D,f+'.py'))]
ROAD=[
 ['קבילות מול משקל','רלוונטיות, כללי פסילה, ס׳ 53, מקבילות למשקל, ס׳ 56, תוספת ראייתית, התניה'],
 ['נטל ההוכחה ורף ההוכחה','נטל השכנוע ונטל הבאת הראיות, ספק סביר, מאזן ההסתברויות, נזק ראייתי'],
 ['עדות וחקירת עד','כשירות להעיד (ס׳ 2–4), חקירה ראשית, נגדית וחוזרת, עד עוין, ריענון זיכרון'],
 ['עדות שמיעה והחריגים','הגדרה, ס׳ 9, 10, 10א, 10ב, רשומה מוסדית, res gestae, אמרות נפטרים, חוקר ילדים'],
 ['הודאת נאשם וקבילותה','ס׳ 12 — חופשית ומרצון, משפט זוטא, דבר מה נוסף, מדובבים'],
 ['ראיות חפציות ומסמכים','הראיה הטובה ביותר, העתק צילומי, פלט מחשב, ראיות דיגיטליות'],
 ['חזקות שבדין ושבעובדה','חזקות חלוטות וניתנות לסתירה, העברת נטל'],
 ['ראיה נסיבתית','שלבי ההסקה, תרחיש חלופי, מעשים דומים ושיטת ביצוע'],
 ['חיסיונות','עו״ד–לקוח, רופא, פסיכולוג, כהן דת, עיתונאי, חיסיון ביטחוני'],
 ['החיסיון מפני הפללה עצמית','ס׳ 47, זכות השתיקה והשלכותיה'],
 ['עד מדינה','ס׳ 54א, טובת הנאה, דרישת סיוע'],
 ['זיהוי ומסדר זיהוי','מסדר זיהוי, זיהוי מתמונות, זיהוי ספונטני, משקל'],
 ['חוות דעת מומחה','ס׳ 20, מומחה מטעם ביהמ״ש, ראיות מדעיות'],
 ['פסילת ראיות שהושגו שלא כדין','יששכרוב, ס׳ 56א, פרי העץ המורעל'],
 ['דיני הראיות במשפט האזרחי','תצהירים, ס׳ 54, התניה, הימנעות מהבאת ראיה'],
]
def case_html(c):
    return '<div class="case"><div class="chd"><span class="cname">'+c['n']+'</span><span class="ctag">'+c['tag']+'</span></div><div class="cbody"><div class="crow cbg"><span class="clbl">הרקע</span>'+c['story']+'</div><div class="crow chold"><span class="clbl">ההלכה</span>'+c['hold']+'</div></div></div>'
import re
def plain(h): return re.sub(r'<[^>]+>','',h)
P={'lessons':[{'n':m.N,'partb':m.PARTB,'cases':''.join(case_html(c) for c in m.CASES),'crs':[{'n':c['n'],'r':plain(c['hold']),'story':plain(c['story']),'tag':c['tag']} for c in m.CASES],'simple':m.SIMPLE,'qs':m.QS} for m in LESSONS],'road':ROAD}
for m in LESSONS:
    for q in m.QS: assert len(q['o'])==4 and len(q['why'])==4 and 0<=q['c']<4, q['q']
JS='''/* ===== דיני ראיות — הרחבה (דמו · בבדיקה) ===== */
try{(function(){
var P='''+json.dumps(P,ensure_ascii=False)+''';
var sid='evidence'; if(typeof CONTENT==='undefined')return;
if(!CONTENT_EXTRA[sid])CONTENT_EXTRA[sid]={};
var MARK='<div class="pk-upg pk-ev-mark"><span>חלק ב׳ — הרחבה</span><em>תוכן חדש · בבדיקה</em></div>';
window.PK9_SIMPLE_BY=window.PK9_SIMPLE_BY||{}; window.PK9_SIMPLE_BY[sid]=window.PK9_SIMPLE_BY[sid]||{};
P.lessons.forEach(function(L){ var i=L.n-1; var old=CONTENT_EXTRA[sid][i]||{}; var base=(old.summary||((CONTENT[sid]||{})[i]||{}).summary||'');
  var nw=Object.assign({},old); nw.summary=base+MARK+L.partb; nw.cases=(old.cases||'')+L.cases;
  var oq=(old.quiz&&old.quiz.questions)?old.quiz.questions:[]; var seen={}; oq.forEach(function(q){seen[q.q]=1;});
  nw.quiz=Object.assign({},old.quiz||{},{questions:L.qs.filter(function(q){return !seen[q.q];}).map(function(q){return {type:'mc',q:q.q,options:q.o.slice(),correct:q.c,explain:q.why[q.c]};}).concat(oq)});
  CONTENT_EXTRA[sid][i]=nw; L.qs.forEach(function(q){ try{ if(window.PK_WHY_ALLT)PK_WHY_ALLT[q.q]=q.why; }catch(e){} });
  window.PK9_SIMPLE_BY[sid][i]=L.simple; });
var QB=[],CR=[]; P.lessons.forEach(function(L){ var tag='שיעור '+L.n; L.qs.forEach(function(q){ QB.push({t:'mc',q:q.q,opts:q.o,correct:q.c,e:q.why[q.c],l:tag,src:'pack'}); }); L.crs.forEach(function(c){ CR.push({n:c.n,r:c.r,story:c.story,l:tag,src:'pack'}); }); });
var _pkc=window.PKC; if(typeof _pkc==='function'){ window.PKC=function(){ var r=_pkc.apply(this,arguments); try{ if((typeof PK_CRS!=='undefined'?PK_CRS:'')==='דיני ראיות'&&r&&r._pack!=='ev1'){ r.qbank=r.qbank||[]; r.crs=r.crs||[]; var hq={}; r.qbank.forEach(function(q){hq[q.q]=1;}); var hc={}; r.crs.forEach(function(c){hc[c.n]=1;}); r.qbank=QB.filter(function(q){return !hq[q.q];}).map(function(q){return Object.assign({},q,{opts:q.opts.slice()});}).concat(r.qbank); CR.forEach(function(c){ if(!hc[c.n])r.crs.push(Object.assign({},c)); }); r._pack='ev1'; } }catch(e){} return r; }; try{ PKC=window.PKC; }catch(e){} }
window.PK9_EV_ROAD=P.road; window.PK9_EV_DONE=P.lessons.map(function(L){return L.n;});
/* כרטיס "הקורס בבנייה" בעמוד הקורס */
function road(){ if(typeof STATE==='undefined'||STATE.subject!==sid||STATE.lesson!=null)return; var c=document.getElementById('content'); if(!c||c.querySelector('#pkEvRoad'))return;
  var host=c.querySelector('.view')||c; var d=document.createElement('div'); d.id='pkEvRoad'; d.className='pk-ev-road';
  var done=window.PK9_EV_DONE;
  d.innerHTML='<div class="h"><div><div class="k">דיני ראיות · הקורס בהרחבה</div><b>'+done.length+' מתוך '+P.road.length+' שיעורים כבר מורחבים</b><span>תוכן חדש שנכתב מהחוק ומהפסיקה · מסומן "בבדיקה" עד אישור</span></div><div class="bar"><i style="width:'+Math.round(done.length/P.road.length*100)+'%"></i></div></div>'
   +'<ol>'+P.road.map(function(r,k){ var ok=done.indexOf(k+1)>=0; return '<li class="'+(ok?'ok':'')+'" '+(ok?'onclick="openLesson('+k+')"':'')+'><span class="n">'+(k+1)+'</span><div><b>'+r[0]+'</b><em>'+r[1]+'</em></div><span class="st">'+(ok?'מורחב · בבדיקה':'בתור')+'</span></li>'; }).join('')+'</ol>';
  host.insertBefore(d,host.firstChild.nextSibling); }
setInterval(function(){ try{road();}catch(e){} },700);
})();}catch(e){console.error('ev pack',e);}
'''
CSS='''.pk-ev-mark{display:flex;justify-content:space-between;align-items:center;margin:30px 0 10px;padding:11px 16px;border-radius:12px;background:#F6EFE0;border:1px solid #E2D3AE;color:#6B1E2A;font-weight:700}
.pk-ev-mark em{font-style:normal;font-size:12px;font-weight:600;background:#fff;border:1px solid #E2C9A6;border-radius:20px;padding:3px 10px;color:#9A6A10}
.pk-ev-road{background:#fff;border:1px solid #ECE4D7;border-radius:22px;padding:18px 20px;margin:0 0 18px;box-shadow:0 10px 28px -22px rgba(60,30,20,.3);font-family:var(--pk-ui)}
.pk-ev-road .h{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:12px;flex-wrap:wrap}.pk-ev-road .k{font:600 11.5px var(--pk-ui);letter-spacing:.12em;color:#B8913C}
.pk-ev-road b{display:block;font:600 18px var(--pk-disp);color:#3A1A1E}.pk-ev-road .h span{font:400 13px var(--pk-ui);color:#8A7B70}
.pk-ev-road .bar{width:220px;height:8px;border-radius:5px;background:#F1EBE0;overflow:hidden}.pk-ev-road .bar i{display:block;height:100%;background:#8A2E3A}
.pk-ev-road ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}
.pk-ev-road li{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:8px 12px;border-radius:12px;border:1px solid #F0E8DA;background:#FCFAF6}
.pk-ev-road li.ok{background:#FBF1F1;border-color:#E9C9CD;cursor:pointer}.pk-ev-road li.ok:hover{border-color:#8A2E3A}
.pk-ev-road .n{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#F1EAE0;font:600 12px var(--pk-ui);color:#7A6A5E}.pk-ev-road li.ok .n{background:#8A2E3A;color:#fff}
.pk-ev-road li b{font:600 14px var(--pk-ui);color:#2A1A16;display:block}.pk-ev-road li em{font:400 12px var(--pk-ui);font-style:normal;color:#8A7B70}
.pk-ev-road .st{font:600 11px var(--pk-ui);color:#9A8B7E;white-space:nowrap}.pk-ev-road li.ok .st{color:#8A2E3A}
@media (max-width:900px){.pk-ev-road ol{grid-template-columns:1fr}.pk-ev-road .bar{width:100%}}
'''
open('/home/claude/d9/src/ev.js','w').write(JS); open('/home/claude/d9/src/ev.css','w').write(CSS)
print('lessons',len(LESSONS),'qs',sum(len(m.QS) for m in LESSONS),'chars',len(JS))
