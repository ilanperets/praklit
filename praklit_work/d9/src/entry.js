/* ===== מסך הכניסה החדש — שתי מערכות, כניסה והרשמה במסך אחד — pk9 ===== */
(function(){
if(window.PK9E)PK9E=null;
var E=PK9.E, LS=PK9.LS;
var X=window.PK9E={sys:LS.g('pk9_sys','study'),tab:'login',per:'student',err:''};
var IC={study:'<path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5"/>',firm:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 018 0v3"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',id:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.5"/><path d="M14 10h4M14 14h4M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2"/>',
 b1:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/>',b2:'<path d="M9 3a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 001 5 3 3 0 005 3V3zM15 3a3 3 0 013 3 3 3 0 012 5 3 3 0 01-1 5 3 3 0 01-5 3V3z"/>',b3:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',b4:'<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/>',
 f1:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',f2:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',f3:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .7 3.2 2.6 3.5 5.5"/>',f4:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>'};
function sv(k){return '<svg viewBox="0 0 24 24">'+IC[k]+'</svg>';}
var SYS={study:{n:'לימודים',who:'לסטודנטים למשפטים ולמתמחים',f:[['b1','23 קורסים מלאים','סיכומים, פסיקה ותרגול לכל שיעור'],['b2','המוח שלי','מעלים חומר — ומקבלים סיכום, מפה ושאלות'],['b3','מחברת ועורך PDF','כתיבה כמו ב-Word, סימון וחתימה כמו באקרובט'],['b4','לומדים בכיף','מבחן בזק, דו־קרב ושיעור חי בכיתה']],cta:'כניסה לפרקליט לימודים'},
 firm:{n:'משרד',who:'לעורכי דין ולמשרדים',f:[['f1','היום במשרד','משימות, דיונים ומועדים במבט אחד'],['f2','תיקים ומסמכים','כל תיק עם הצדדים, המסמכים והשעות'],['f3','לקוחות ולידים','מהפנייה הראשונה ועד הסכם שכר הטרחה'],['f4','גבייה וחשבוניות','מה שולם, מה פתוח ומה באיחור']],cta:'כניסה לפרקליט משרד'}};
function stats(){ var c=0,q=0,cs=0; try{ c=SUBJECTS.length; }catch(e){} try{ SUBJECTS.forEach(function(s){ try{cs+=(_concCases(s.id)||[]).length;}catch(e){} }); }catch(e){} try{ q=Object.keys(window.PK_WHY_ALLT||{}).length; }catch(e){}
  function r(n){ return n>=1000?(Math.floor(n/100)*100).toLocaleString('he-IL')+'+':String(n); } return [[c,'קורסים'],[r(cs),'פסקי דין וסעיפים'],[r(q),'שאלות עם הסבר']]; }
var ROT={study:['לומדים משפטים.','עוברים מבחנים.','מבינים פסיקה.','מתמחים בביטחון.'],firm:['מסודר.','בשליטה.','בזמן.','במקום אחד.']};
function greet(){ var h=new Date().getHours(); return h<5?'לילה טוב':h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב'; }
function floats(){ var F=X.sys==='study'?[
   ['f1','<span class="dot ok">✓</span><div><b>תשובה נכונה</b><em>ס׳ 25 · ניסיון לעבור עבירה</em></div>'],
   ['f2','<div class="ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="bg"/><circle cx="18" cy="18" r="15" class="fg"/></svg><b>82%</b></div><div><b>מוכנות למבחן</b><em>דיני עונשין</em></div>'],
   ['f3','<span class="dot fire">🔥</span><div><b>12 ימים ברצף</b><em>חזרה יומית של 5 דקות</em></div>']]:[
   ['f1','<span class="dot cal">09:30</span><div><b>דיון מחר</b><em>בית משפט השלום · תיק 214</em></div>'],
   ['f2','<div class="ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="bg"/><circle cx="18" cy="18" r="15" class="fg"/></svg><b>3/5</b></div><div><b>משימות להיום</b><em>שתיים נשארו</em></div>'],
   ['f3','<span class="dot ok">₪</span><div><b>חשבונית שולמה</b><em>הסכם שכר טרחה · ינואר</em></div>']];
  return '<div class="pk9e-floats" aria-hidden="true">'+F.map(function(f){return '<div class="pk9e-fl '+f[0]+'">'+f[1]+'</div>';}).join('')+'</div>'; }
function lawQuote(){ var it=null; try{ var L=STATUTES['חוק העונשין, התשל"ז-1977']||[]; it=L.find(function(x){return /^1 —/.test(x.s);}); }catch(e){}
  var t=it?it.t:'אין עבירה ואין עונש עליה אלא אם כן נקבעו בחוק או על-פיו.';
  return '<div class="pk9e-law"><span class="k">§ סעיף 1 · חוק העונשין</span><p>"'+E(t)+'"</p></div>'; }
function html(){ var S=SYS[X.sys], login=X.tab==='login';
  var brand='<div class="pk9e-brand"><div class="pk9e-wm">§</div><div class="pk9e-arcs"></div>'
   +'<div class="pk9e-logo"><span class="seal">§</span><div><b>פרקליט</b><em>מהסטודנט ועד הפרקליט</em></div></div>'+floats()
   +'<h1>'+(X.sys==='study'?'המקום שבו':'המשרד שלך,')+'<br><span class="pk9e-rot" id="pk9eRot"><span class="gold w on">'+ROT[X.sys][0]+'</span></span></h1>'
   +'<div class="pk9e-sys">'+['study','firm'].map(function(k){ var s=SYS[k]; return '<button class="'+(X.sys===k?'on':'')+'" onclick="PK9E.set(\''+k+'\')"><span class="ic">'+sv(k)+'</span><span class="tx"><small>פרקליט</small><b>'+s.n+'</b><em>'+s.who+'</em></span><span class="rd"></span></button>'; }).join('')+'</div>'
   +'<div class="pk9e-feat">'+S.f.map(function(f){return '<div><span>'+sv(f[0])+'</span><b>'+f[1]+'</b><em>'+f[2]+'</em></div>';}).join('')+'</div>'
   +(X.sys==='study'?'<div class="pk9e-stats">'+stats().map(function(s){return '<div><b>'+s[0]+'</b><span>'+s[1]+'</span></div>';}).join('')+'</div>':'<div class="pk9e-stats"><div><b>עברית</b><span>מימין לשמאל, מהיסוד</span></div><div><b>בכל מסך</b><span>מחשב, טאבלט וטלפון</span></div><div><b>במקום אחד</b><span>תיקים, יומן, לקוחות וגבייה</span></div></div>')
   +lawQuote()+'</div>';
  var per=X.sys==='study'?[['student','סטודנט'],['intern','מתמחה']]:[['lawyer','עורך דין']];
  if(per.map(function(p){return p[0];}).indexOf(X.per)<0)X.per=per[0][0];
  var form='<div class="pk9e-card"><div class="pk9e-ch"><span class="k">פרקליט · '+S.n+'</span><h2>'+(login?greet()+', ברוכים השבים':'פותחים חשבון')+'</h2><p>'+(login?'נכנסים וממשיכים בדיוק מאיפה שעצרת':'שתי דקות, ואת/ה בפנים')+'</p></div>'
   +'<div class="pk9e-tabs"><button class="'+(login?'on':'')+'" onclick="PK9E.tabTo(\'login\')">כניסה</button><button class="'+(!login?'on':'')+'" onclick="PK9E.tabTo(\'signup\')">הרשמה</button></div>'
   +(X.err?'<div class="pk9e-err">'+E(X.err)+'</div>':'')
   +(login?'':'<label class="pk9e-f"><span>'+sv('id')+'</span><input id="pk9eN" placeholder=" " autocomplete="name"><i>שם מלא</i></label>'
     +'<div class="pk9e-per">'+per.map(function(p){return '<button class="'+(X.per===p[0]?'on':'')+'" onclick="PK9E.per=\''+p[0]+'\';PK9E.draw()">'+p[1]+'</button>';}).join('')+'</div>')
   +'<label class="pk9e-f"><span>'+sv('user')+'</span><input id="pk9eU" placeholder=" " autocomplete="username" oninput="PK9E.chk()"><i>שם משתמש</i><b class="ok" id="pk9eUok">✓</b></label>'
   +'<label class="pk9e-f"><span>'+sv('lock')+'</span><input id="pk9eP" type="password" placeholder=" " autocomplete="'+(login?'current-password':'new-password')+'" onkeydown="PK9E.caps(event);if(event.key===\'Enter\')PK9E.go()" onkeyup="PK9E.caps(event)" oninput="PK9E.chk()"><i>סיסמה</i><button class="eye" type="button" onclick="var i=document.getElementById(\'pk9eP\');i.type=i.type===\'password\'?\'text\':\'password\'" title="הצגת סיסמה">'+sv('eye')+'</button></label><div class="pk9e-caps" id="pk9eCaps">⇪ מקש Caps Lock פעיל</div>'+(login?'':'<div class="pk9e-str" id="pk9eStr"><i></i><i></i><i></i><i></i><span>חוזק הסיסמה</span></div>')
   +(login?'<div class="pk9e-row"><label><input type="checkbox" checked> לזכור אותי</label><a onclick="PK9E.forgot()">שכחתי סיסמה</a></div>':'')
   +'<button class="pk9e-go" id="pk9eGo" onclick="PK9E.go()"><span class="t">'+(login?S.cta:'יצירת חשבון ב'+S.n)+'</span><span class="sp"></span><span class="ar">←</span></button>'
   +(window.PK9_PROD?'<div class="pk9e-trust"><span>🔒 פרטי לגמרי</span><span>📱 מחשב, טאבלט וטלפון</span><span>✦ בעברית מהיסוד</span></div>':'<div class="pk9e-or"><span>או בלי הרשמה</span></div>')
   +(window.PK9_PROD?'':'<div class="pk9e-demo">'+(X.sys==='study'?'<button onclick="PK9.enter(\'study\',\'student\')">כניסה לדמו כסטודנט</button><button onclick="PK9.enter(\'study\',\'intern\')">כניסה לדמו כמתמחה</button>':'<button onclick="PK9.enter(\'firm\',\'lawyer\')">כניסה לדמו של המשרד</button>')+'</div>')
   +'<div class="pk9e-ft">הנתונים שלך פרטיים ונשמרים במכשיר · <a>תקנון ופרטיות</a></div></div>';
  var seal='<div class="pk9e-stage"><div class="pk9e-glow"></div><svg class="pk9e-seal" viewBox="0 0 600 600"><defs><path id="pk9eC" d="M300,300 m-262,0 a262,262 0 1,1 524,0 a262,262 0 1,1 -524,0"/><linearGradient id="pk9eG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F1D78E"/><stop offset="1" stop-color="#9E7A2C"/></linearGradient></defs>'+'<circle cx="300" cy="300" r="292" class="r1"/><circle cx="300" cy="300" r="236" class="r2"/><circle cx="300" cy="300" r="226" class="r3"/>'+(function(){ var t=''; for(var i=0;i<72;i++){ var a=i*5*Math.PI/180, r1=i%6?284:276; t+='<line x1="'+(300+Math.cos(a)*r1).toFixed(1)+'" y1="'+(300+Math.sin(a)*r1).toFixed(1)+'" x2="'+(300+Math.cos(a)*292).toFixed(1)+'" y2="'+(300+Math.sin(a)*292).toFixed(1)+'" class="tk"/>'; } return t; })()+'<g class="spin"><text text-anchor="middle"><textPath href="#pk9eC" startOffset="50%">פרקליט ✦ מהסטודנט ועד הפרקליט ✦ לימודים ✦ משרד ✦ פרקליט ✦ מהסטודנט ועד הפרקליט ✦ לימודים ✦ משרד ✦</textPath></text></g></svg><div class="pk9e-rays"></div><div class="pk9e-dots"></div></div>';
  seal=seal.replace('<g class="spin">','<g class="spin2"><circle cx="300" cy="300" r="206" class="r4"/>'+(function(){ var t=''; for(var i=0;i<4;i++){ var a=i*Math.PI/2; t+='<text x="'+(300+Math.cos(a)*206).toFixed(1)+'" y="'+(300+Math.sin(a)*206+6).toFixed(1)+'" class="mk" text-anchor="middle">§</text>'; } return t; })()+'</g><g class="spin">');
  return '<canvas class="pk9e-dust" id="pk9eDust"></canvas><div class="pk9e-spot"></div><div class="pk9e-in'+(X.first?' first':'')+'">'+brand+'<div class="pk9e-side">'+seal+form+'</div></div><div class="pk9e-wipe" id="pk9eWipe"><div><span class="seal">§</span><b id="pk9eWelcome"></b></div></div>'; }
X.draw=function(){ var g=document.getElementById('pk9Gate'); if(!g)return; var _keepDust=true; var u=(document.getElementById('pk9eU')||{}).value||'', n=(document.getElementById('pk9eN')||{}).value||''; g.innerHTML=html(); var a=document.getElementById('pk9eU'); if(a)a.value=u; var b=document.getElementById('pk9eN'); if(b)b.value=n; fx(g); };
X.set=function(k){ X.sys=k; X.err=''; LS.s('pk9_sys',k); X.draw(); };
X.tabTo=function(t){ X.tab=t; X.err=''; X.draw(); };
X.forgot=function(){ X.err=window.PK9_PROD?'לאיפוס סיסמה פונים למנהל המערכת.':'לאיפוס סיסמה פונים למנהל המערכת. בדמו אפשר להיכנס בכפתורי הדמו.'; X.draw(); };
X.caps=function(e){ var c=document.getElementById('pk9eCaps'); if(c&&e.getModifierState)c.classList.toggle('in',e.getModifierState('CapsLock')); };
X.chk=function(){ var u=document.getElementById('pk9eU'), ok=document.getElementById('pk9eUok'); if(u&&ok)ok.classList.toggle('in',u.value.trim().length>=3);
  var st=document.getElementById('pk9eStr'), p=document.getElementById('pk9eP'); if(st&&p){ var v=p.value, n=0; if(v.length>=4)n++; if(v.length>=8)n++; if(/\d/.test(v)&&/[^\d]/.test(v))n++; if(/[^A-Za-z0-9\u0590-\u05FF]/.test(v)||/[A-Z]/.test(v))n++; st.dataset.n=v?n:0; st.querySelector('span').textContent=!v?'חוזק הסיסמה':['חלשה מאוד','חלשה','סבירה','טובה','חזקה'][n]; } };
X.go=async function(){ var u=(document.getElementById('pk9eU')||{}).value||'', p=(document.getElementById('pk9eP')||{}).value||'', b=document.getElementById('pk9eGo');
  if(b){ b.classList.add('busy'); await new Promise(function(r){setTimeout(r,450);}); }
  var err=X.tab==='login'?authLogin(u,p):authSignup(u,(document.getElementById('pk9eN')||{}).value||'',p,X.per);
  if(err){ X.err=err; X.draw(); var c=document.querySelector('.pk9e-card'); if(c){ c.classList.add('shake'); } return; }
  var cu=null; try{cu=currentUser();}catch(e){} var w=document.getElementById('pk9eWipe'), wl=document.getElementById('pk9eWelcome');
  if(b){ b.classList.remove('busy'); b.classList.add('done'); b.querySelector('.t').textContent='✓'; }
  if(w){ if(wl)wl.textContent=(X.tab==='login'?'ברוך שובך':'ברוך הבא')+(cu&&cu.name?', '+cu.name.split(' ')[0]:''); setTimeout(function(){w.classList.add('in');},250); await new Promise(function(r){setTimeout(r,1250);}); }
  LS.s('pk9_sys',X.sys); X.hide(); await enterApp(); try{ var cu=currentUser(); pkSetMode(X.sys==='firm'&&pkCanFirm()?'firm':'study'); }catch(e){} PK9.after(); };
X.show=function(){ var g=document.getElementById('pk9Gate'); if(!g){ g=document.createElement('div'); g.id='pk9Gate'; document.body.appendChild(g); } X.sys=LS.g('pk9_sys','study'); X.err=''; X.tab='login'; X.first=true; g.innerHTML=html(); X.first=false; fx(g); requestAnimationFrame(function(){ g.classList.add('in'); }); var ao=document.getElementById('authOv'); if(ao)ao.style.display='none'; };
X.hide=function(){ clearInterval(rotT); if(dustRAF)cancelAnimationFrame(dustRAF); var g=document.getElementById('pk9Gate'); if(g){ g.classList.remove('in'); setTimeout(function(){ if(!g.classList.contains('in'))g.remove(); },400); } };
/* ---------- אפקטים: מילים מתחלפות, אבק זהב, זרקור, הטיה, ספירה ---------- */
var rotI=0, rotT=null, dustRAF=null;
function fx(g){
  clearInterval(rotT); rotI=0; rotT=setInterval(function(){ var r=document.getElementById('pk9eRot'); if(!r){ clearInterval(rotT); return; } var W=ROT[X.sys]; rotI=(rotI+1)%W.length; var old=r.querySelector('.w.on'); var n=document.createElement('span'); n.className='gold w'; n.textContent=W[rotI]; r.appendChild(n); requestAnimationFrame(function(){ requestAnimationFrame(function(){ n.classList.add('on'); if(old){ old.classList.remove('on'); old.classList.add('out'); setTimeout(function(){old.remove();},700); } }); }); },2800);
  if(!g.dataset.fx){ g.dataset.fx=1;
    g.addEventListener('pointermove',function(e){ g.style.setProperty('--mx',e.clientX+'px'); g.style.setProperty('--my',e.clientY+'px');
      var c=g.querySelector('.pk9e-card'); if(c&&innerWidth>900){ var r=c.getBoundingClientRect(), dx=(e.clientX-(r.left+r.width/2))/r.width, dy=(e.clientY-(r.top+r.height/2))/r.height; if(Math.abs(dx)<1.4&&Math.abs(dy)<1.4)c.style.transform='perspective(1400px) rotateY('+(dx*4).toFixed(2)+'deg) rotateX('+(-dy*4).toFixed(2)+'deg)'; else c.style.transform=''; }
      var fl=g.querySelector('.pk9e-floats'); if(fl){ var px=(e.clientX/innerWidth-.5), py=(e.clientY/innerHeight-.5); fl.style.transform='translate('+(px*-18).toFixed(1)+'px,'+(py*-14).toFixed(1)+'px)'; } }); }
  dust(g);
  g.querySelectorAll('.pk9e-stats b').forEach(function(b){ var m=String(b.textContent).match(/^\+?([\d,]+)(\+?)$/); if(!m||b.dataset.c)return; b.dataset.c=1; var end=+m[1].replace(/,/g,''), plus=m[2], t0=performance.now(); (function step(t){ var k=Math.min(1,(t-t0)/1400), v=Math.round(end*(1-Math.pow(1-k,3))); b.textContent=v.toLocaleString('he-IL')+plus; if(k<1)requestAnimationFrame(step); })(t0); });
}
function dust(g){ var cv=g.querySelector('#pk9eDust'); if(!cv||innerWidth<900)return; if(dustRAF)cancelAnimationFrame(dustRAF); if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var ctx=cv.getContext('2d'), W,H, P=[]; function size(){ W=cv.width=innerWidth; H=cv.height=innerHeight; } size(); window.addEventListener('resize',size);
  for(var i=0;i<70;i++)P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.4,v:Math.random()*.25+.06,a:Math.random()*Math.PI*2,o:Math.random()*.5+.15});
  (function loop(){ if(!document.getElementById('pk9eDust'))return; ctx.clearRect(0,0,W,H); P.forEach(function(p){ p.y-=p.v; p.a+=.01; p.x+=Math.sin(p.a)*.2; if(p.y<-5){p.y=H+5;p.x=Math.random()*W;} ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283); ctx.fillStyle='rgba(233,200,120,'+(p.o*(.6+.4*Math.sin(p.a*2)))+')'; ctx.fill(); }); dustRAF=requestAnimationFrame(loop); })(); }
/* החלפת מסך הכניסה הישן */
try{ var _sa=window.showAuth; window.showAuth=function(){ X.show(); }; }catch(e){}
})();
