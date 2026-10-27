import asyncio
from h import session
W=lambda ms:"()=>new Promise(r=>setTimeout(r,%d))"%ms
st=[('_w',W(2500)),('_l',"async()=>{ authSignup('t'+Date.now()%1e5,'נועה','1234','student'); PK9E.hide(); await enterApp(); }"),('_w2',W(3000)),
('_c',"()=>openCourse('evidence')"),('_w3',W(1200)),('course',None),('_o',"()=>openLesson(8)"),('_w4',W(1200)),('_s',"()=>{var b=document.querySelector('#content table');if(b)b.scrollIntoView({block:'center'})}"),('_w5',W(500)),('lesson',None)]
o,e=asyncio.run(session('/home/claude/d9/main_new.html',st,login=False,prefix='tp_',size='phone'))
