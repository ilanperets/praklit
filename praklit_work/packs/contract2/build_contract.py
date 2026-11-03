#!/usr/bin/env python3
# בונה את בלוק ה-JS של קורס דיני חוזים (con11). שימוש: build_contract.py <out.html>
import sys,json,importlib,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
OUT=sys.argv[1]
ORDER=[1,2,3,4,5,6,7,8,9,12,13,14,15,10,11,16]
import re,hashlib
mods=[importlib.import_module('ch%02d'%i) for i in ORDER]
QX=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'qx.json'),encoding='utf8'))
def ren(txt,old,new): return re.sub(r'(?<![\d.])%d\.(\d+)(?=[ <])'%old,lambda mm:'%d.%s'%(new,mm.group(1)),txt)
for pos,m in enumerate(mods):
    old=m.N; new=pos+1
    m.SUM=[ren(x,old,new) for x in m.SUM]
    for b in m.MAR:
        for k in ('t','h'):
            if isinstance(b.get(k),str): b[k]=ren(b[k],old,new)
    m.N=new
    for x in QX:
        if x['ch']==old:
            ex={'q':x['q'],'o':x['o'],'c':x['c'],'e':x['e']}
            if ex['q'] not in [q['q'] for q in m.QS]: m.QS.append(ex)
topics=[m.TITLE for m in mods]; lessons=[]; nq=0; nc=0
for m in mods:
    assert len(m.QS)>=15,(m.N,len(m.QS))
    for q in m.QS: assert 0<=q['c']<4 and len(set(q['o']))==4,(m.N,q['q'][:30])
    qs=[]
    for q in m.QS:
        why=['','','','']; why[q['c']]=q['e']
        qs.append({'q':q['q'],'o':q['o'],'c':q['c'],'why':why,'e':q['e']})
    cases=[{'n':a,'story':b,'r':c,'facts':''} for a,b,c in m.CASES]
    lessons.append({'n':m.N,'summary':''.join(m.SUM),'qs':qs,'cases':cases}); nq+=len(qs); nc+=len(cases)

from html.parser import HTMLParser
def autoMar(sumhtml,cases):
    out=[]; 
    tokens=re.split(r'(<h3>.*?</h3>|<div class="pkw-box [a-z]+">.*?</div>(?=<|$)|<table>.*?</table>|<ul>.*?</ul>|<ol>.*?</ol>)',sumhtml,flags=re.S)
    for t in tokens:
        if not t or not t.strip(): continue
        if t.startswith('<h3>'): out.append({'k':'h','t':re.sub(r'<[^>]+>','',t),'lv':1})
        elif t.startswith('<div class="pkw-box'):
            k=re.match(r'<div class="pkw-box ([a-z]+)">',t).group(1); inner=t[t.index('>')+1:-6]
            if k in ('ex','case'): continue
            ttl=re.match(r'<b>(.*?)</b>',inner,flags=re.S); body=re.sub(r'<(?!/?b>|/?mark>)[^>]+>',' ',inner[ttl.end():] if ttl else inner)
            sents=re.split(r'(?<=[.!?:])\s+',re.sub(r'\s+',' ',body).strip()); cut=''
            for x in sents:
                if len(cut.split())>=20: break
                cut+=(' ' if cut else '')+x
            out.append({'k':'bx','c':k,'h':('<b>%s</b> '%ttl.group(1) if ttl else '')+cut,'lv':1})
        elif t.startswith('<table>'):
            rows=re.findall(r'<tr>(.*?)</tr>',t,flags=re.S); cells=[re.findall(r'<t[hd]>(.*?)</t[hd]>',r,flags=re.S) for r in rows]
            if cells: out.append({'k':'t','head':cells[0],'rows':cells[1:],'lv':1})
        else:
            m1=re.search(r'<p>(.*?)</p>',t,flags=re.S)
            for pm in re.findall(r'<p>(.*?)</p>',t,flags=re.S):
                first=re.split(r'(?<=[.!?:])\s',pm,maxsplit=1)[0]
                pass
    if cases:
        out.append({'k':'h','t':'שרשרת פסיקה בפרק','lv':1})
        out.append({'k':'t','head':['<b>פסק דין</b>','<b>ההלכה</b>'],'rows':[['<b>%s</b>'%a,c] for a,b,c in cases],'lv':1})
    return out
for m in mods:
    m.MAR=list(m.MAR)+autoMar(''.join(m.SUM),m.CASES)
sheets=[{'id':'cover','cover':True,'pg':1}]
toc=[['%d · %s'%(m.N,m.TITLE),str(i+3)] for i,m in enumerate(mods)]
sheets.append({'id':'toc','title':'תוכן עניינים','pg':2,'blocks':[{'k':'toc','items':toc,'lv':1}]})
for i,m in enumerate(mods): sheets.append({'id':'p%d'%m.N,'title':m.TITLE,'num':str(m.N),'pg':i+3,'blocks':m.MAR})
P={'topics':topics,'lessons':lessons,'sheets':sheets}
tail=r"""
var S=SUBJECTS.find(function(s){return s.id==='contract';}); if(!S)return;
S.lessons=P.topics.length; LESSON_TOPICS.contract=P.topics.slice();
CONTENT.contract=P.lessons.map(function(L){ return {summary:L.summary}; });
CONTENT_EXTRA.contract=P.lessons.map(function(L){ return {quiz:{questions:L.qs.map(function(q){return {type:'mc',q:q.q,options:q.o.slice(),correct:q.c,explain:q.e};})}}; });
var QB=[], CR=[];
P.lessons.forEach(function(L,i){ var tag='שיעור '+(i+1);
  L.qs.forEach(function(q){ QB.push({t:'mc',q:q.q,opts:q.o,correct:q.c,e:q.e,l:tag,src:'pack'}); });
  L.cases.forEach(function(c){ CR.push({n:c.n,r:c.r,story:c.story,facts:c.facts,l:tag,src:'pack'}); }); });
window.PK_CON_PACK={qbank:QB,crs:CR,sheets:P.sheets};
var _pkc=window.PKC; window.PKC=function(){ var r=_pkc.apply(this,arguments); try{ var cn=(typeof PK_CRS!=='undefined'?PK_CRS:''); if(cn==='דיני חוזים'&&r&&r._pack!=='con11'){ r.qbank=QB.map(function(q){return Object.assign({},q,{opts:q.opts.slice()});}); r.crs=CR.map(function(c){return Object.assign({},c);}); r.sheets=JSON.parse(JSON.stringify(P.sheets)); r._pack='con11'; r._pq=r.qbank.length; r._pc=r.crs.length; } if(cn==='דיני חוזים'&&r&&r._pack==='con11'&&(r.qbank.length!==r._pq||r.crs.length!==r._pc)){ r.qbank=r.qbank.filter(function(q){return q.src!=='sys';}); r.crs=r.crs.filter(function(c){return c.src!=='sys';}); r._pq=r.qbank.length; r._pc=r.crs.length; } }catch(e){} return r; };
try{ QBANK=null; }catch(e){}
var _om=window.openMarathon; if(typeof _om==='function'&&!_om._con){ var _om2=_om; window.openMarathon=function(sj){ try{ document.body.classList.toggle('pk-con-m',sj==='contract'); }catch(e){} return _om2.apply(this,arguments); }; window.openMarathon._con=1; window.openMarathon._fam=_om._fam; }
var _pub=window.PKCPUB; if(_pub) window.PKCPUB=function(){ if((typeof PK_CRS!=='undefined'?PK_CRS:'')==='דיני חוזים')return PKC(); return _pub.apply(this,arguments); };
})();}catch(e){console.error('con pack',e);}
"""
js='<script id="pk7-con-pack">\n/* ===== קורס דיני חוזים — גרסת החוברות (con11): %d פרקים, %d שאלות, %d כרטיסי פסיקה, מרתון מלא. ===== */\ntry{(function(){\nvar P=%s;'%(len(mods),nq,nc,json.dumps(P,ensure_ascii=False))+tail+'</script>\n<style id="pk9-con-css">\n'+open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'con.css'),encoding='utf8').read()+'</style>'
open(OUT,'w',encoding='utf8').write(js); print('pack',len(js)//1024,'KB;',len(mods),'lessons;',nq,'questions;',nc,'cases')
json.dump(P,open('/tmp/con_P.json','w',encoding='utf8'),ensure_ascii=False)
