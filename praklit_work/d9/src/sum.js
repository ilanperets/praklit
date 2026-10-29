/* מצב סיכום — שקופיות כדפי לימוד: שקופית + הערות לצדה, גלילה רציפה. PDF, עובד בלי אינטרנט */
(function(){ if(window.PKSUM)return;
var S=window.PKSUM={open:false,n:0,doc:null,name:'',notes:[],key:null,fs:0,cur:0};
function $(q,r){return (r||document).querySelector(q);} function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function toast(m){ try{ PK9.toast(m); }catch(e){} }
function edEl(){ return $('#pkwPaper')||$('#nbPaper'); }
function nid(){ try{ return ($('#pkwPaper')&&window.PK9W&&PK9W.id)||STATE.nbEditing||'x'; }catch(e){return 'x';} }
function idb(cb){ try{ var r=indexedDB.open('pk9slides',1); r.onupgradeneeded=function(){ r.result.createObjectStore('f'); }; r.onsuccess=function(){cb(r.result);}; r.onerror=function(){cb(null);}; }catch(e){cb(null);} }
function put(k,v){ idb(function(db){ if(!db)return; try{ db.transaction('f','readwrite').objectStore('f').put(v,k); }catch(e){} }); }
function get(k,cb){ idb(function(db){ if(!db)return cb(null); try{ var q=db.transaction('f').objectStore('f').get(k); q.onsuccess=function(){cb(q.result||null);}; q.onerror=function(){cb(null);}; }catch(e){cb(null);} }); }
function lib(){ return new Promise(function(res,rej){ if(window.pdfjsLib)return res(window.pdfjsLib); var l=document.getElementById('pk6PdfLib'),w=document.getElementById('pk6PdfWorker'); if(!l||!w)return rej(new Error('pdf'));
  var s=document.createElement('script'); s.src=URL.createObjectURL(new Blob([l.textContent],{type:'text/javascript'})); s.onload=function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([w.textContent],{type:'text/javascript'})); }catch(e){} res(window.pdfjsLib); }; s.onerror=function(){rej(new Error('pdf'));}; document.head.appendChild(s); }); }
var tm; function saveNotes(){ clearTimeout(tm); tm=setTimeout(function(){ put('sumn:'+S.key,{notes:S.notes,cur:S.cur}); },500); }
function root(){ var r=$('#pkSum'); if(r)return r; r=document.createElement('div'); r.id='pkSum'; document.body.appendChild(r);
  r.addEventListener('input',function(e){ var n=e.target.getAttribute&&e.target.getAttribute('data-n'); if(n!=null){ S.notes[+n]=e.target.innerHTML; var th=$('#pksTh'+n); if(th)th.classList.toggle('has',!!txt(S.notes[+n])); saveNotes(); } });
  ['mouseup','touchend','keyup'].forEach(function(ev){ document.addEventListener(ev,selSoon); });
  window.addEventListener('resize',function(){ if(S.open)layout(); });
  document.addEventListener('keydown',function(e){ if(S.open&&e.key==='Escape')S.close(); }); return r; }
function txt(h){ return (h||'').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').trim(); }
/* ---- פתיחה / סגירה ---- */
S.toggle=function(){ if(S.open)S.close(); else S.show(); };
S.show=function(){ S.open=true; S.key=nid(); var r=root(); r.className='on'; document.body.classList.add('pk-sum'); var b=$('#pkSlBtn'); if(b)b.classList.add('on');
  if(!S.doc){ get('sumf:'+S.key,function(f){ if(f&&f.buf){ get('sumn:'+S.key,function(nn){ S.notes=(nn&&nn.notes)||[]; S.cur=(nn&&nn.cur)||0; load(f.buf,f.name); }); } else paint(); }); } else paint(); };
S.close=function(){ var sc=$('#pksScroll'); S.open=false; var r=$('#pkSum'); if(r)r.className=''; document.body.classList.remove('pk-sum'); var b=$('#pkSlBtn'); if(b)b.classList.remove('on'); var a=$('#pksAdd'); if(a)a.className=''; };
S.pick=function(){ var f=$('#pksFile'); if(f)f.click(); };
S.file=function(inp){ var f=inp.files&&inp.files[0]; inp.value=''; if(!f)return; var nm=f.name||'';
  if(/\.pptx?$/i.test(nm)){ help(); return; }
  if(!(/\.pdf$/i.test(nm)||f.type==='application/pdf')){ toast('אפשר להעלות קובץ PDF'); return; }
  var rd=new FileReader(); rd.onload=function(){ S.notes=[]; S.cur=0; S.doc=null; put('sumf:'+S.key,{buf:rd.result.slice(0),name:nm}); put('sumn:'+S.key,{notes:[],cur:0}); load(rd.result,nm); }; rd.readAsArrayBuffer(f); };
function help(){ var m=$('#pksHelp'); if(m)m.remove(); m=document.createElement('div'); m.id='pksHelp'; m.innerHTML='<div class="pks-hb"><h3>המצגת שלך היא PowerPoint</h3><p>כדי שהשקופיות יוצגו בדיוק כמו במקור, שמור אותה קודם כ-PDF:</p><ol><li><b>PowerPoint:</b> קובץ ← ייצוא ← יצירת PDF</li><li><b>Keynote או PowerPoint באייפד:</b> שיתוף ← ייצוא ← PDF</li><li>חזור לכאן והעלה את ה-PDF</li></ol><button onclick="this.closest(\'#pksHelp\').remove()">הבנתי</button></div>'; document.body.appendChild(m); }
function load(buf,name){ S.name=name; lib().then(function(L){ return L.getDocument({data:new Uint8Array(buf.slice(0))}).promise; }).then(function(d){ S.doc=d; S.n=d.numPages; return d.getPage(1); }).then(function(pg){ var v=pg.getViewport({scale:1}); S.ar=v.height/v.width; paint(); }).catch(function(e){ try{console.warn('pksum',e&&e.message);}catch(x){} toast('לא הצלחתי לפתוח את הקובץ'); S.doc=null; paint(); }); }
/* ---- ציור ---- */
function paint(){ var r=root(); if(!S.open)return; var empty=!S.doc; var h='<input type="file" id="pksFile" accept=".pdf,.ppt,.pptx,application/pdf" hidden onchange="PKSUM.file(this)">';
  h+='<header class="pks-bar"><button class="pks-x" onclick="PKSUM.close()" aria-label="סגירה">‹ חזרה למחברת</button><div class="pks-ttl">'+(empty?'<b>מצב סיכום</b>':'<b>'+esc(S.name.replace(/\.pdf$/i,''))+'</b><span id="pksPos">שקופית '+(S.cur+1)+' מתוך '+S.n+'</span>')+'</div>'
    +(empty?'':'<div class="pks-act"><button class="pks-ic" onclick="PKSUM.fsz(-1)" aria-label="הקטן טקסט">א<small>−</small></button><button class="pks-ic" onclick="PKSUM.fsz(1)" aria-label="הגדל טקסט">א<small>+</small></button><button class="pks-ic" onclick="PKSUM.pick()" title="קובץ אחר">⇪</button><button class="pks-go" onclick="PKSUM.insert()">הכנס למחברת</button></div>')+'</header>';
  if(empty){ h+='<div class="pks-empty"><div class="pks-card"><div class="pks-ico">📑</div><h2>סכם תוך כדי צפייה במצגת</h2><p>העלה את המצגת של המרצה כ-PDF. לכל שקופית יהיה מקום לסיכום שלך לידה, והכול נשמר במכשיר ועובד גם בלי אינטרנט.</p><button class="pks-go" onclick="PKSUM.pick()">בחירת קובץ PDF</button><small onclick="PKSUM.help()">יש לך PowerPoint? איך שומרים כ-PDF</small></div></div>'; r.innerHTML=h; return; }
  h+='<div class="pks-body"><nav class="pks-rail" id="pksRail">'; for(var k=0;k<S.n;k++)h+='<button id="pksTh'+k+'" class="'+(txt(S.notes[k])?'has':'')+(k===S.cur?' on':'')+'" onclick="PKSUM.to('+k+')"><i></i>'+(k+1)+'</button>'; h+='</nav><main class="pks-scroll" id="pksScroll">';
  for(var j=0;j<S.n;j++){ h+='<section class="pks-row" id="pksR'+j+'" data-i="'+j+'"><div class="pks-sl"><div class="pks-pgbox" id="pksP'+j+'"><span class="pks-num">'+(j+1)+'</span></div></div><div class="pks-nt"><div class="pks-ned" data-n="'+j+'" contenteditable="true" data-ph="הסיכום שלך לשקופית '+(j+1)+'…" style="font-size:'+(17+S.fs*2)+'px">'+(S.notes[j]||'')+'</div></div></section>'; }
  h+='<div class="pks-end">סוף המצגת · '+S.n+' שקופיות</div></main></div>'; r.innerHTML=h; layout(); setTimeout(function(){ if(S.cur)S.to(S.cur,true); },60); watch(); }
S.help=help;
function layout(){ var sc=$('#pksScroll'); if(!sc||!S.doc)return; var boxes=sc.querySelectorAll('.pks-pgbox'); boxes.forEach(function(b){ b.style.aspectRatio='1 / '+S.ar; b.removeAttribute('data-r'); }); render(); }
var io;
function watch(){ var sc=$('#pksScroll'); if(!sc)return; if(io)io.disconnect(); io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=+e.target.getAttribute('data-i'); drawPage(i); } }); },{root:sc,rootMargin:'300px 0px'}); sc.querySelectorAll('.pks-row').forEach(function(r){ io.observe(r); });
  sc.addEventListener('scroll',onScroll,{passive:true}); }
var st; function onScroll(){ clearTimeout(st); st=setTimeout(function(){ var sc=$('#pksScroll'); if(!sc)return; var mid=sc.getBoundingClientRect().top+sc.clientHeight*.35; var rows=sc.querySelectorAll('.pks-row'),c=0; for(var i=0;i<rows.length;i++){ if(rows[i].getBoundingClientRect().top<=mid)c=i; } if(c!==S.cur){ S.cur=c; saveNotes(); var p=$('#pksPos'); if(p)p.textContent='שקופית '+(c+1)+' מתוך '+S.n; var on=$('#pksRail .on'); if(on)on.classList.remove('on'); var t=$('#pksTh'+c); if(t){ t.classList.add('on'); try{ var rl=$('#pksRail'); rl.scrollTop=t.offsetTop-rl.clientHeight/2; }catch(e){} } } },80); }
function render(){ var sc=$('#pksScroll'); if(!sc)return; sc.querySelectorAll('.pks-row').forEach(function(r){ var rc=r.getBoundingClientRect(),sr=sc.getBoundingClientRect(); if(rc.bottom>sr.top-300&&rc.top<sr.bottom+300)drawPage(+r.getAttribute('data-i')); }); }
function drawPage(i){ var box=$('#pksP'+i); if(!box||!S.doc)return; var w=box.clientWidth; if(!w)return; if(box.getAttribute('data-r')==String(w))return; box.setAttribute('data-r',String(w));
  S.doc.getPage(i+1).then(function(pg){ var v1=pg.getViewport({scale:1}); var s=w/v1.width; var dpr=Math.min(2.5,window.devicePixelRatio||1); var vp=pg.getViewport({scale:s}),vq=pg.getViewport({scale:s*dpr});
    var cv=document.createElement('canvas'); cv.width=vq.width; cv.height=vq.height; cv.style.cssText='width:100%;height:100%;display:block';
    var tl=document.createElement('div'); tl.className='textLayer'; tl.style.width=vp.width+'px'; tl.style.height=vp.height+'px';
    var old=box.querySelectorAll('canvas,.textLayer'); old.forEach(function(o){o.remove();}); box.insertBefore(cv,box.firstChild); box.appendChild(tl);
    pg.render({canvasContext:cv.getContext('2d'),viewport:vq});
    pg.getTextContent().then(function(tc){ try{ pdfjsLib.renderTextLayer({textContentSource:tc,textContent:tc,container:tl,viewport:vp,textDivs:[]}); }catch(e){} }); }); }
S.to=function(k,instant){ var r=$('#pksR'+k),sc=$('#pksScroll'); if(!r||!sc)return; sc.scrollTo({top:r.offsetTop-8,behavior:instant?'auto':'smooth'}); };
S.fsz=function(d){ S.fs=Math.max(-2,Math.min(6,S.fs+d)); document.querySelectorAll('.pks-ned').forEach(function(e){ e.style.fontSize=(17+S.fs*2)+'px'; }); };
/* ---- סימון טקסט -> להערה ---- */
var st2; function selSoon(){ clearTimeout(st2); st2=setTimeout(selBar,60); }
function selBar(){ var b=$('#pksAdd'); if(!S.open){ if(b)b.className=''; return; } var sl=getSelection(); var ok=sl&&!sl.isCollapsed&&sl.toString().trim().length>1; var an=ok&&(sl.anchorNode.nodeType===3?sl.anchorNode.parentElement:sl.anchorNode); var pb=ok&&an&&an.closest&&an.closest('.pks-pgbox'); ok=!!pb;
  if(!b){ b=document.createElement('button'); b.id='pksAdd'; b.textContent='הוסף להערה'; b.onmousedown=function(e){e.preventDefault();}; b.ontouchstart=function(e){e.preventDefault();}; b.onclick=function(){ var t=getSelection().toString().replace(/\s+/g,' ').trim(); var row=b._row; b.className=''; try{getSelection().removeAllRanges();}catch(x){} addQ(row,t); }; document.body.appendChild(b); }
  if(!ok){ b.className=''; return; } b._row=pb.parentNode.parentNode; var r=sl.getRangeAt(0).getBoundingClientRect(); b.className='on'; b.style.top=Math.max(8,r.top-46)+'px'; b.style.left=Math.max(8,Math.min(innerWidth-130,r.left+r.width/2-60))+'px'; }
function addQ(row,t){ var e=row&&row.querySelector('.pks-ned'); if(!e)return; var n=+e.getAttribute('data-n'); e.insertAdjacentHTML('beforeend','<blockquote>'+esc(t)+'</blockquote><p><br></p>'); S.notes[n]=e.innerHTML; saveNotes(); var th=$('#pksTh'+n); if(th)th.classList.add('has'); try{ e.focus(); var r=document.createRange(); r.selectNodeContents(e.lastElementChild); r.collapse(true); var sl=getSelection(); sl.removeAllRanges(); sl.addRange(r); }catch(x){} }
/* ---- הכנסה למחברת: תמונת שקופית + הסיכום ---- */
function thumb(k){ return S.doc.getPage(k+1).then(function(pg){ var v1=pg.getViewport({scale:1}); var vp=pg.getViewport({scale:640/v1.width}); var cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height; return pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise.then(function(){ return cv.toDataURL('image/jpeg',.72); }); }); }
S.insert=function(){ var idx=[]; for(var k=0;k<S.n;k++){ if(txt(S.notes[k]))idx.push(k); } if(!idx.length){ toast('עוד לא כתבת סיכום לאף שקופית'); return; }
  var ed=edEl(); if(!ed){ toast('פתח מחברת כדי להכניס'); return; } var out='<h3>📑 '+esc(S.name.replace(/\.pdf$/i,''))+'</h3>',j=0;
  (function nx(){ if(j>=idx.length){ ed.insertAdjacentHTML('beforeend',out+'<p><br></p>'); try{ if($('#pkwPaper')&&window.PK9W&&PK9W.save)PK9W.save(); else if(typeof nbBody==='function')nbBody(); }catch(x){} S.close(); toast('הסיכום נוסף למחברת'); try{ ed.scrollTop=ed.scrollHeight; }catch(x){} return; }
    var k=idx[j++]; thumb(k).then(function(u){ out+='<p><img src="'+u+'" style="max-width:100%;border:1px solid #ddd;border-radius:4px" alt="שקופית '+(k+1)+'"></p>'+S.notes[k]; nx(); }).catch(function(){ out+='<h4>שקופית '+(k+1)+'</h4>'+S.notes[k]; nx(); }); })(); };
})();
