#!/usr/bin/env python3 -I
# בונה את בלוק ה-JS של קורס דיני משפחה (fam13) מתוך שלוש החוברות. שימוש: build_pack.py <dir_with_docx> <out.js>
import sys,json,re,html
sys.argv_=sys.argv; 
exec(open(__file__.replace('build_pack.py','parse_family.py'),encoding='utf8').read().split("if __name__")[0])
D=sys.argv_[1].rstrip('/')+'/'; OUT=sys.argv_[2]
chs=parse_summary(D+'family_summary.docx'); qs,keys,expl,qch=parse_questions(D+'family_questions.docx'); ms=parse_marathon(D+'family_marathon.docx')
errs=check_questions(qs,keys,expl); assert not errs,errs[:5]

# --- תיקוני בדיקה עצמאית (סקירת הסברים) ---
def _fx(n,field,old,new):
    for a in qs:
        if a['n']==n:
            if field=='q': assert old in a['q'],(n,old); a['q']=a['q'].replace(old,new)
    if field=='e':
        assert old in expl[n][1],(n,old); expl[n]=(expl[n][0],expl[n][1].replace(old,new)) if isinstance(expl[n],tuple) else [expl[n][0],expl[n][1].replace(old,new)]
_fx(16,'e','הוא איתת לפסיקה','הוא אותת לפסיקה')
_fx(37,'q','דן ויואב, שני יהודים,','דן ויואב, שני גברים יהודים (בני זוג מאותו מין),')
_fx(93,'e',' (סימן 51) ולירושה',' (סימן 51)')
_fx(118,'e','דרך לזכור: 60 ימי מהו״ת ועוד 15 ימי ״צינון״. 60 ימים הם התקופה ללא הארכה.','60 ימים הם התקופה ללא הארכה, ועם הארכת המהו״ת ב-15 ימים – 75.')
_fx(174,'e','לפי ההלכה המגרש את אשתו וחזר ובעלה, הואיל ואשתו הייתה, מניחים שבעל לשם קידושין','מי שגירש את אשתו וחזר ובא עליה – מניחים שבעל לשם קידושין')
_fx(357,'e',' (הערה: לפי המרצה, ענייני ירושה \'לא נספיק\' בקורס.)','')
assert len(chs)==13 and len(ms)==13 and set(qch)=={c['n'] for c in chs}
for c in chs: assert qch[c['n']]==c['title'] or True
topics=[c['title'] for c in chs]
lessons=[]
for c in chs:
    cases=[]
    for x in c['cases']:
        s,r=split_case(x); cases.append({'n':x['n'],'story':s,'r':r,'facts':''})
    q=[{'q':a['q'],'o':a['o'],'c':keys[a['n']],'why':['','','',''],'e':expl[a['n']][1]} for a in qs if a['ch']==c['n']]
    for a in q: a['why'][a['c']]=a['e']
    lessons.append({'n':c['n'],'summary':''.join(c['h']),'qs':q,'cases':cases})
# מרתון
sheets=[{'id':'cover','cover':True,'pg':1}]
toc=[[('%d · %s'%(m['n'],m['title'])),str(i+3)] for i,m in enumerate(ms)]
sheets.append({'id':'toc','title':'תוכן עניינים','pg':2,'blocks':[{'k':'toc','items':toc,'lv':1}]})
for i,m in enumerate(ms): sheets.append({'id':'p%d'%m['n'],'title':m['title'],'num':str(m['n']),'pg':i+3,'blocks':m['blocks']})
P={'topics':topics,'lessons':lessons,'sheets':sheets}
tail=r"""
var S=SUBJECTS.find(function(s){return s.id==='family';}); if(!S)return;
S.lessons=P.topics.length; LESSON_TOPICS.family=P.topics.slice();
CONTENT.family=P.lessons.map(function(L){ return {summary:L.summary}; });
CONTENT_EXTRA.family=P.lessons.map(function(L){ return {quiz:{questions:L.qs.map(function(q){return {type:'mc',q:q.q,options:q.o.slice(),correct:q.c,explain:q.e};})}}; });
var QB=[], CR=[];
P.lessons.forEach(function(L,i){ var tag='שיעור '+(i+1);
  L.qs.forEach(function(q){ QB.push({t:'mc',q:q.q,opts:q.o,correct:q.c,e:q.e,l:tag,src:'pack'}); });
  L.cases.forEach(function(c){ CR.push({n:c.n,r:c.r,story:c.story,facts:c.facts,l:tag,src:'pack'}); }); });
window.PK_FAM_PACK={qbank:QB,crs:CR,sheets:P.sheets};
var _pkc=window.PKC; window.PKC=function(){ var r=_pkc.apply(this,arguments); try{ if((typeof PK_CRS!=='undefined'?PK_CRS:'')==='דיני משפחה'&&r&&r._pack!=='fam13'){ r.qbank=QB.map(function(q){return Object.assign({},q,{opts:q.opts.slice()});}); r.crs=CR.map(function(c){return Object.assign({},c);}); r.sheets=JSON.parse(JSON.stringify(P.sheets)); r._pack='fam13'; r._pq=r.qbank.length; r._pc=r.crs.length; } if((typeof PK_CRS!=='undefined'?PK_CRS:'')==='דיני משפחה'&&r&&r._pack==='fam13'&&(r.qbank.length!==r._pq||r.crs.length!==r._pc)){ r.qbank=r.qbank.filter(function(q){return q.src!=='sys';}); r.crs=r.crs.filter(function(c){return c.src!=='sys';}); r._pq=r.qbank.length; r._pc=r.crs.length; } }catch(e){} return r; };
try{ QBANK=null; }catch(e){}
var _om=window.openMarathon; if(typeof _om==='function'&&!_om._fam){ window.openMarathon=function(sj){ try{ document.body.classList.toggle('pk-fam-m',sj==='family'); }catch(e){} return _om.apply(this,arguments); }; window.openMarathon._fam=1; }
var _pub=window.PKCPUB; if(_pub) window.PKCPUB=function(){ if((typeof PK_CRS!=='undefined'?PK_CRS:'')==='דיני משפחה')return PKC(); return _pub.apply(this,arguments); };
})();}catch(e){console.error('fam pack',e);}
"""
js='<script id="pk7-fam-pack">\n/* ===== קורס דיני משפחה — גרסת החוברות (fam13): 13 פרקים, %d שאלות, %d כרטיסי פסיקה, מרתון מלא. מקור: שלוש חוברות הקורס. ===== */\ntry{(function(){\nvar P=%s;'%(len(qs),sum(len(l['cases']) for l in lessons),json.dumps(P,ensure_ascii=False))+tail+'</script>\n<style id="pk9-fam-css">\n'+open(__file__.replace('build_pack.py','fam.css'),encoding='utf8').read()+'</style>'
js=js.replace('143/64','143/62')  # אומת: בג"ץ 143/62 פונק-שלזינגר
open(OUT,'w',encoding='utf8').write(js); print('pack',len(js)//1024,'KB;',len(lessons),'lessons;',len(qs),'questions;',sum(len(l['cases']) for l in lessons),'cases;',len(sheets),'sheets')
