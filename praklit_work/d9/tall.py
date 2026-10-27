import asyncio,sys,json
from h import session
W=lambda ms:"()=>new Promise(r=>setTimeout(r,%d))"%ms
F=sys.argv[1]
st=[('_w',W(2500)),('_l',"async()=>{ authSignup('t'+Date.now()%1e5,'נועה','1234','student'); PK9E.hide(); await enterApp(); }"),('_w2',W(3000))]
for sid in ['evidence','intro','tort','property','crimproc','civproc','corp','realestate','tax','crime']:
    st+=[('_c'+sid,"()=>openCourse('%s')"%sid),('_wc'+sid,W(1200)),('road_'+sid,"()=>!!document.getElementById('pkRoad_%s')"%sid)]
    for li in [0,2,14]:
        st+=[('_o%s%d'%(sid,li),"()=>openLesson(%d)"%li),('_wo%s%d'%(sid,li),W(900)),
             ('l_%s_%d'%(sid,li),"()=>({mark:!!document.querySelector('.pk-ev-mark'),law:document.querySelectorAll('#content .pkw-law').length,h:document.querySelectorAll('#content h3').length,len:document.querySelector('#content').innerText.length,nq:((((CONTENT_EXTRA['%s']||{})[%d]||{}).quiz||{}).questions||[]).length})"%(sid,li))]
    st+=[('_qz'+sid,"()=>{STATE.lessonTab='quiz';render();bindLesson();}"),('_wq'+sid,W(900)),('q_'+sid,"()=>(document.querySelector('#content h2, #content .qtext, #content [class*=qq]')||{innerText:''}).innerText.slice(0,60)"),
         ('_cs'+sid,"()=>{STATE.lessonTab='cases';render();bindLesson();}"),('_wcs'+sid,W(700)),('cases_'+sid,"()=>document.querySelectorAll('#content .case').length")]
st+=[('_shot',"()=>openCourse('civproc')"),('_ws',W(1200)),('civ_course',None),('_s2',"()=>openLesson(4)"),('_ws2',W(1200)),('civ_l5',None)]
o,e=asyncio.run(session(F,st,login=False,prefix='ta_'))
print(json.dumps(o,ensure_ascii=False,indent=0)); print('ERR',[x for x in e if 'TUNNEL' not in x and 'proxy' not in x][:10])
