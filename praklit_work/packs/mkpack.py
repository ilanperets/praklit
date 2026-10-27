# Generic course-pack builder for פרקליט.
# usage: python3 mkpack.py <course_dir>   (course_dir has meta.py + l1.py..l15.py)
# writes /home/claude/d9/src/pack_<SID>.js and the shared /home/claude/d9/src/pack.css
import json, importlib.util, sys, os, re, hashlib, glob
D = os.path.abspath(sys.argv[1])
def load(path, name):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
meta = load(os.path.join(D, 'meta.py'), 'meta_' + os.path.basename(D))
files = sorted(glob.glob(os.path.join(D, 'l[0-9]*.py')), key=lambda p: int(re.findall(r'l(\d+)\.py', p)[0]))
LESSONS = [load(p, 'm_%s_%s' % (meta.SID, os.path.basename(p)[:-3])) for p in files]

def shuffle(q):
    """deterministic option shuffle so the correct answer is spread over A–D"""
    h = int(hashlib.md5(q['q'].encode()).hexdigest(), 16)
    perms = [[0,1,2,3],[1,0,3,2],[2,3,0,1],[3,2,1,0],[1,2,3,0],[2,0,1,3],[3,1,0,2],[0,3,2,1]]
    p = perms[h % len(perms)]
    o = [q['o'][i] for i in p]; w = [q['why'][i] for i in p]
    return {'q': q['q'], 'o': o, 'why': w, 'c': p.index(q['c'])}

def case_html(c):
    return ('<div class="case"><div class="chd"><span class="cname">' + c['n'] + '</span><span class="ctag">' + c['tag'] +
            '</span></div><div class="cbody"><div class="crow cbg"><span class="clbl">הרקע</span>' + c['story'] +
            '</div><div class="crow chold"><span class="clbl">ההלכה</span>' + c['hold'] + '</div></div></div>')
def plain(h): return re.sub(r'<[^>]+>', '', h)

for m in LESSONS:
    for q in m.QS: assert len(q['o']) == 4 and len(q['why']) == 4 and 0 <= q['c'] < 4, (m.N, q['q'])
ROAD = [list(r) for r in meta.ROAD]
for m in LESSONS:
    if getattr(m, 'SUB', '') and m.N - 1 < len(ROAD): ROAD[m.N - 1][1] = m.SUB
P = {'sid': meta.SID, 'cname': meta.CNAME, 'pack': meta.PACK, 'road': ROAD,
     'lessons': [{'n': m.N, 'partb': m.PARTB, 'cases': ''.join(case_html(c) for c in m.CASES),
                  'crs': [{'n': c['n'], 'r': plain(c['hold']), 'story': plain(c['story']), 'tag': c['tag']} for c in m.CASES],
                  'simple': m.SIMPLE, 'qs': [shuffle(q) for q in m.QS]} for m in LESSONS]}

JS = '''/* ===== קורס בהרחבה: ''' + meta.CNAME + ''' (תוכן חדש · בבדיקה) ===== */
try{(function(){
var P=''' + json.dumps(P, ensure_ascii=False).replace('</', '<\\/') + ''';
var sid=P.sid; if(typeof CONTENT==='undefined'||typeof CONTENT_EXTRA==='undefined')return;
if(!CONTENT_EXTRA[sid])CONTENT_EXTRA[sid]={};
var MARK='<div class="pk-upg pk-ev-mark"><span>השיעור המלא</span><em>תוכן חדש · בבדיקה</em></div>';
window.PK9_SIMPLE_BY=window.PK9_SIMPLE_BY||{}; window.PK9_SIMPLE_BY[sid]=window.PK9_SIMPLE_BY[sid]||{};
P.lessons.forEach(function(L){ var i=L.n-1; var old=CONTENT_EXTRA[sid][i]||{}; if(old._pack===P.pack)return;
  var base=(old.summary||((CONTENT[sid]||{})[i]||{}).summary||'');
  var nw=Object.assign({},old); nw._pack=P.pack; nw.summary=base+MARK+L.partb; nw.cases=(old.cases||'')+L.cases;
  var oq=(old.quiz&&old.quiz.questions)?old.quiz.questions:[]; var seen={}; L.qs.forEach(function(q){seen[q.q]=1;});
  nw.quiz=Object.assign({},old.quiz||{},{questions:L.qs.map(function(q){return {type:'mc',q:q.q,options:q.o.slice(),correct:q.c,explain:q.why[q.c]};}).concat(oq.filter(function(q){return !seen[q.q];}))});
  CONTENT_EXTRA[sid][i]=nw; L.qs.forEach(function(q){ try{ if(typeof PK_WHY_ALLT!=='undefined')PK_WHY_ALLT[q.q]=q.why; }catch(e){} });
  window.PK9_SIMPLE_BY[sid][i]=L.simple; });
var QB=[],CR=[]; P.lessons.forEach(function(L){ var tag='שיעור '+L.n; L.qs.forEach(function(q){ QB.push({t:'mc',q:q.q,opts:q.o,correct:q.c,e:q.why[q.c],l:tag,src:'pack'}); }); L.crs.forEach(function(c){ CR.push({n:c.n,r:c.r,story:c.story,l:tag,src:'pack'}); }); });
var _pkc=window.PKC; if(typeof _pkc==='function'){ window.PKC=function(){ var r=_pkc.apply(this,arguments); try{ if((typeof PK_CRS!=='undefined'?PK_CRS:'')===P.cname&&r&&!(r._packs&&r._packs[P.pack])){ r._packs=r._packs||{}; r._packs[P.pack]=1; r.qbank=r.qbank||[]; r.crs=r.crs||[]; var hq={}; QB.forEach(function(q){hq[q.q]=1;}); var hc={}; r.crs.forEach(function(c){hc[c.n]=1;}); r.qbank=QB.map(function(q){return Object.assign({},q,{opts:q.opts.slice()});}).concat(r.qbank.filter(function(q){return !hq[q.q];})); CR.forEach(function(c){ if(!hc[c.n])r.crs.push(Object.assign({},c)); }); } }catch(e){} return r; }; try{ PKC=window.PKC; }catch(e){} }
window.PK9_PACKS=window.PK9_PACKS||{}; window.PK9_PACKS[sid]={road:P.road,done:P.lessons.map(function(L){return L.n;}),pack:P.pack};
function road(){ if(typeof STATE==='undefined'||STATE.subject!==sid||STATE.lesson!=null)return; var c=document.getElementById('content'); if(!c||c.querySelector('#pkRoad_'+sid))return;
  var host=c.querySelector('.view')||c; var d=document.createElement('div'); d.id='pkRoad_'+sid; d.className='pk-ev-road';
  var done=window.PK9_PACKS[sid].done; var full=done.length>=P.road.length;
  d.innerHTML='<div class="h"><div><div class="k">'+P.cname+' · '+(full?'קורס מלא':'הקורס בהרחבה')+'</div><b>'+(full?'כל '+P.road.length+' השיעורים כתובים במלואם':done.length+' מתוך '+P.road.length+' שיעורים כבר מורחבים')+'</b><span>תוכן חדש שנכתב מהחוק ומהפסיקה · מסומן "בבדיקה" עד אישור</span></div><div class="bar"><i style="width:'+Math.round(done.length/P.road.length*100)+'%"></i></div></div>'
   +'<ol>'+P.road.map(function(r,k){ var ok=done.indexOf(k+1)>=0; return '<li class="'+(ok?'ok':'')+'" '+(ok?'onclick="openLesson('+k+')"':'')+'><span class="n">'+(k+1)+'</span><div><b>'+r[0]+'</b><em>'+r[1]+'</em></div><span class="st">'+(ok?'מלא · בבדיקה':'בתור')+'</span></li>'; }).join('')+'</ol>';
  host.insertBefore(d,host.firstChild?host.firstChild.nextSibling:null); }
setInterval(function(){ try{road();}catch(e){} },700);
})();}catch(e){console.error('pack',e);}
'''
out = '/home/claude/d9/src/pack_%s.js' % meta.SID
open(out, 'w', encoding='utf-8').write(JS)

CSS = '''.pk-ev-mark{display:flex;justify-content:space-between;align-items:center;margin:30px 0 10px;padding:11px 16px;border-radius:12px;background:#F6EFE0;border:1px solid #E2D3AE;color:#6B1E2A;font-weight:700}
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
#content .pkw-law{border-right:3px solid #B8913C;background:#FAF6EE;border-radius:4px 10px 10px 4px;padding:12px 16px;margin:12px 0;font-size:.97em;line-height:1.85;color:#3A2A22}
#content .pkw-box.warn{border-color:#B5652A;background:#FDF3EA}
#content .pkw-box.key{border-color:#2E6B45;background:#EFF6F1}
#content .pkw-box b{display:inline;font:inherit;font-weight:700;color:inherit;margin:0}
#content .pkw-box > b:first-child{display:block;font:700 14px var(--pk-ui);color:#7A3A1E;margin-bottom:4px}
#content .pkw-box > b:first-child + br{display:none}
#content .pkw-box.key > b:first-child{color:#2E6B45}#content .pkw-box.tip > b:first-child{color:#8A2E3A}
#content .pkw-box ul,#content .pkw-box ol{margin:6px 0 2px;padding-inline-start:20px}
#content h4{font-weight:700;margin:16px 0 6px;color:#5A1E28}
'''
open('/home/claude/d9/src/pack.css', 'w', encoding='utf-8').write(CSS)
print('pack', meta.SID, 'lessons', [m.N for m in LESSONS], 'qs', sum(len(m.QS) for m in LESSONS), 'cases', sum(len(m.CASES) for m in LESSONS), '->', out, len(JS))
