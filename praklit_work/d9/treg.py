import asyncio,json
from h import session
W=lambda ms:"()=>new Promise(r=>setTimeout(r,%d))"%ms
st=[('_w',W(2500)),('entry',"()=>!!document.getElementById('pk9eC')"),('_l',"async()=>{ authSignup('t'+Date.now()%1e5,'נועה','1234','student'); PK9E.hide(); await enterApp(); }"),('_w2',W(3000)),
('mods',"()=>({W:typeof PK9W,P:typeof PK9P,B:typeof PK9B,F:typeof PK9F,hubs:Object.keys(window.PK6_HUBS||{}).length,packs:Object.keys(window.PK9_PACKS||{})})"),
('_h',"()=>{try{pkHub('h9Fun')}catch(e){return String(e)}}"),('_wh',W(1200)),('fun',None),
('_c',"()=>openCourse('contract')"),('_wc',W(1000)),('_o',"()=>openLesson(2)"),('_wo',W(1000)),('contract',"()=>document.querySelector('#content').innerText.length")]
o,e=asyncio.run(session('/home/claude/d9/main_new.html',st,login=False,prefix='tr_'))
print(json.dumps(o,ensure_ascii=False)); print([x for x in e if 'TUNNEL' not in x][:5])
