/* ===== מחברת בתוך השיעור + מצגת לצד המחברת + קריאה נוחה — שכבה נוספת (add-only) ===== */
(function(){
if(window.PKSTUDY)return; var S=window.PKSTUDY={open:false,tab:'nb',slide:null,page:1,zoom:1.3};
function $(s,r){return (r||document).querySelector(s);} function esc(t){return String(t).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function lessonCtx(){ try{ if(typeof STATE==='undefined'||STATE.subject==null||STATE.lesson==null)return null; var sb=SUBJECTS.find(function(x){return x.id===STATE.subject;}); if(!sb)return null; var tp=(LESSON_TOPICS[sb.id]||[])[STATE.lesson]||('שיעור '+(STATE.lesson+1)); return {sb:sb,i:STATE.lesson,topic:tp}; }catch(e){return null;} }
function nbMode(){ return !!($('#pkwPaper')||$('#nbPaper')); }
function edEl(){ return $('#pkwPaper')||$('#nbPaper'); }
function nbNote(){ try{ var id=(window.PK9W&&PK9W.id&&$('#pkwPaper'))?PK9W.id:STATE.nbEditing; return STATE.notes.find(function(x){return x.id===id;})||null; }catch(e){return null;} }
function edSave(){ try{ if($('#pkwPaper')&&window.PK9W&&PK9W.save){ PK9W.save(); } else if($('#nbPaper')&&typeof nbBody==='function'){ nbBody(); } }catch(e){} }
var lastR=null; document.addEventListener('selectionchange',function(){ var e=edEl(); var sl=getSelection(); if(e&&sl&&sl.rangeCount&&e.contains(sl.anchorNode))lastR=sl.getRangeAt(0).cloneRange(); });
function putInEditor(h){ var e=edEl(); if(!e)return false; var frag=document.createRange().createContextualFragment(h);
  if(lastR&&e.contains(lastR.startContainer)){ try{ lastR.collapse(false); var pp=lastR.startContainer.nodeType===3?lastR.startContainer.parentNode:lastR.startContainer; if(pp&&pp.tagName==='P'&&e.contains(pp)&&pp!==e){ lastR.setStartAfter(pp); lastR.collapse(true); } lastR.insertNode(frag); }catch(x){ e.appendChild(frag); } } else e.appendChild(frag);
  try{ var ps=e.querySelectorAll('p'); var lp=ps[ps.length-1]; var bq=e.querySelectorAll('blockquote'); var lb=bq[bq.length-1]; var tgt=(lb&&lb.nextElementSibling&&lb.nextElementSibling.tagName==='P')?lb.nextElementSibling:lp; if(tgt){ e.focus(); var r=document.createRange(); r.selectNodeContents(tgt); r.collapse(true); var sl=getSelection(); sl.removeAllRanges(); sl.addRange(r); lastR=r.cloneRange(); } }catch(x){}
  edSave(); return true; }
/* ---- שמירת מצגות בין טעינות (IndexedDB) ---- */
function idb(cb){ try{ var r=indexedDB.open('pk9slides',1); r.onupgradeneeded=function(){ r.result.createObjectStore('f'); }; r.onsuccess=function(){ cb(r.result); }; r.onerror=function(){cb(null);}; }catch(e){cb(null);} }
function slKey(){ var n=nbMode()?nbNote():null; if(n)return 'n:'+n.id; var c=lessonCtx(); return c?('l:'+c.sb.id+':'+c.i):'x'; }
function slPut(buf,name){ idb(function(db){ if(!db)return; try{ db.transaction('f','readwrite').objectStore('f').put({buf:buf,name:name},slKey()); }catch(e){} }); }
function slGet(cb){ idb(function(db){ if(!db)return cb(null); try{ var q=db.transaction('f').objectStore('f').get(slKey()); q.onsuccess=function(){cb(q.result||null);}; q.onerror=function(){cb(null);}; }catch(e){cb(null);} }); }
function note(create){ var c=lessonCtx(); if(!c)return null; var key='pkn:'+c.sb.id+':'+c.i; var id=null; try{ id=localStorage.getItem('pk9_'+key); }catch(e){}
  var n=id&&STATE.notes.find(function(x){return x.id===id;}); if(n)return n; if(!create)return null;
  n={id:(typeof uid==='function'?uid():String(Date.now())),title:'סיכום שלי — '+c.sb.name+' · '+c.topic,body:'',subject:c.sb.id,courseId:c.sb.id,year:STATE.myYear,semester:STATE.mySem,tag:'',pin:false,ts:Date.now()}; STATE.notes.unshift(n); try{ localStorage.setItem('pk9_'+key,n.id); }catch(e){} try{persist();}catch(e){} return n; }
function save(){ var n=note(true); var ed=$('#pkEd'); if(!n||!ed)return; n.body=ed.innerHTML; n.ts=Date.now(); try{persist();}catch(e){} var st=$('#pkSv'); if(st){ st.textContent='נשמר ✓'; } }
var _t; function saveSoon(){ var st=$('#pkSv'); if(st)st.textContent='שומר…'; clearTimeout(_t); _t=setTimeout(save,500); }
function addQuote(txt,src,comment){ if(nbMode()){ var h0='<blockquote>'+esc(txt)+'<br><small>'+esc(src)+'</small></blockquote>'+(comment?'<p><b>הערה:</b> </p>':'<p><br></p>'); putInEditor(h0); toast('נוסף למחברת'); return; } var n=note(true); var h='<blockquote>'+esc(txt)+'<br><small>'+esc(src)+'</small></blockquote>'+(comment?'<p><b>הערה:</b> </p>':'<p><br></p>');
  if(!S.open){ S.open=true; paint(); }
  var ed=$('#pkEd'); if(!ed||S.tab!=='nb'){ n.body=(n.body||'')+h; n.ts=Date.now(); try{persist();}catch(e){} toast(comment?'נוסף למחברת. עוברים למחברת להערה':'נוסף למחברת'); if(comment){ S.tab='nb'; paint(); ed=$('#pkEd'); if(ed){ try{ var r0=document.createRange(); r0.selectNodeContents(ed.lastElementChild); r0.collapse(false); var s0=getSelection(); s0.removeAllRanges(); s0.addRange(r0); ed.focus(); }catch(e){} } } return; }
  ed.insertAdjacentHTML('beforeend',h); save(); try{ed.lastElementChild.scrollIntoView({block:'nearest'});}catch(e){} try{ var r=document.createRange(); r.selectNodeContents(ed.lastElementChild); r.collapse(false); var sl=getSelection(); sl.removeAllRanges(); sl.addRange(r); ed.focus(); }catch(e){} toast('נוסף למחברת'); }
function toast(t){ var d=$('#pkTo')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'pkTo'})); d.textContent=t; d.className='on'; clearTimeout(d._t); d._t=setTimeout(function(){d.className='';},1600); }
/* ---------- פאנל ---------- */
function panel(){ var p=$('#pkStudy'); if(!p){ p=document.createElement('div'); p.id='pkStudy'; document.body.appendChild(p); } return p; }
function paint(){ if(nbMode()&&S.open&&S.tab==='nb')S.tab='sl'; try{ if($('#pkEd')&&note(false)){ clearTimeout(_t); save(); } }catch(e){} var nbm=nbMode(); var c=lessonCtx(); var p=panel(); if((!c&&!nbm)||!S.open){ p.className=''; p.innerHTML=''; document.body.classList.remove('pk-split','pk-split2'); return; }
  document.body.classList.add(nbm?'pk-split2':'pk-split'); document.body.classList.toggle('pk-nbm',nbm); p.className='on';
  var n=nbm?nbNote():note(false); var head=nbm?'<div class="pks-h"><div class="pks-t"><b>📑 המצגת של המרצה</b><span>'+esc((n&&n.title)||'המחברת שלי')+'</span></div><button class="pks-x" onclick="PKSTUDY.close()" aria-label="סגירה">✕</button></div>'
   :'<div class="pks-h"><div class="pks-t"><b>'+esc(c.sb.name)+'</b><span>שיעור '+(c.i+1)+' · '+esc(c.topic)+'</span></div><button class="pks-x" onclick="PKSTUDY.close()" aria-label="סגירה">✕</button></div>'
   +'<div class="pks-tabs"><button class="'+(S.tab==='nb'?'on':'')+'" onclick="PKSTUDY.go(\'nb\')">📓 המחברת</button><button class="'+(S.tab==='sl'?'on':'')+'" onclick="PKSTUDY.go(\'sl\')">📑 מצגת / PDF</button></div>';
  var body;
  if(S.tab==='nb'){ body='<div class="pks-nb"><div class="pks-bar"><button onmousedown="event.preventDefault()" onclick="document.execCommand(\'bold\')"><b>B</b></button><button onmousedown="event.preventDefault()" onclick="document.execCommand(\'hiliteColor\',false,\'#FBEBA8\')">🖍</button><button onmousedown="event.preventDefault()" onclick="document.execCommand(\'insertUnorderedList\')">•</button><button onmousedown="event.preventDefault()" onclick="document.execCommand(\'formatBlock\',false,\'h3\')">כותרת</button><span id="pkSv" class="pks-sv"></span><a onclick="PKSTUDY.full()">פתיחה במחברת המלאה ←</a></div><div id="pkEd" class="pks-ed" contenteditable="true" data-ph="כתוב כאן סיכום. מסמן טקסט בשיעור או במצגת ולוחץ ״למחברת״, והוא נוסף לכאן עם המקור.">'+(n?n.body:'')+'</div></div>'; }
  else { body='<div class="pks-sl">'+(S.slide?'<div class="pks-nav"><button onclick="PKSTUDY.pg(-1)">→</button><span>עמוד '+S.page+' / '+S.slide.numPages+'</span><button onclick="PKSTUDY.pg(1)">←</button><button onclick="PKSTUDY.zm(-.2)">−</button><button onclick="PKSTUDY.zm(.2)">+</button><button onclick="PKSTUDY.pick()">קובץ אחר</button></div><div class="pks-pg" id="pkPg"></div>'
     :'<div class="pks-up"><div class="ic">📑</div><b>פותחים את המצגת של המרצה כאן</b><p>מעלים קובץ PDF (ב-PowerPoint: קובץ ← ייצוא ← PDF). אחר כך מסמנים טקסט ולוחצים ״למחברת״.</p><button class="btn gold" onclick="PKSTUDY.pick()">בחירת קובץ PDF</button></div>')+'<input type="file" id="pkFile" accept="application/pdf,.pdf" style="display:none"></div>'; }
  p.innerHTML=head+body;
  var ed=$('#pkEd'); if(ed){ ed.addEventListener('input',saveSoon); }
  var f=$('#pkFile'); if(f){ f.onchange=function(){ if(f.files&&f.files[0])loadFile(f.files[0]); }; }
  if(S.tab==='sl'&&S.slide)renderPage(); if(S.tab==='sl'&&!S.slide&&!S._rt){ S._rt=1; slGet(function(r){ S._rt=0; if(r&&r.buf&&!S.slide){ lib().then(function(L){ return L.getDocument({data:new Uint8Array(r.buf.slice(0))}).promise; }).then(function(doc){ S.slide=doc; S.page=1; S.fit=false; S.name=r.name; paint(); }).catch(function(){}); } }); } }
S.close=function(){ S.open=false; paint(); mark(); };
S.go=function(t){ S.tab=t; paint(); };
S.full=function(){ var n=note(true); try{ STATE.nbEditing=n.id; go('notebook'); S.open=false; paint(); }catch(e){} };
S.toggle=function(){ S.open=!S.open; paint(); mark(); };
S.pick=function(){ var f=$('#pkFile'); if(f)f.click(); };
S.pg=function(d){ if(!S.slide)return; S.page=Math.max(1,Math.min(S.slide.numPages,S.page+d)); paint(); };
S.zm=function(d){ S.zoom=Math.max(.7,Math.min(2.4,S.zoom+d)); paint(); };
/* ---------- PDF ---------- */
function lib(){ return new Promise(function(res,rej){ if(window.pdfjsLib)return res(window.pdfjsLib); var l=document.getElementById('pk6PdfLib'),w=document.getElementById('pk6PdfWorker'); if(!l||!w)return rej(new Error('no pdf lib'));
  var s=document.createElement('script'); s.src=URL.createObjectURL(new Blob([l.textContent],{type:'text/javascript'})); s.onload=function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([w.textContent],{type:'text/javascript'})); }catch(e){} res(window.pdfjsLib); }; s.onerror=function(){rej(new Error('load'));}; document.head.appendChild(s); }); }
function loadFile(file){ var rd=new FileReader(); rd.onload=function(){ var buf=rd.result.slice(0); lib().then(function(L){ return L.getDocument({data:new Uint8Array(rd.result)}).promise; }).then(function(doc){ S.slide=doc; S.page=1; S.fit=false; S.name=file.name; slPut(buf,file.name); paint(); }).catch(function(e){ try{console.warn('pkstudy',e&&e.message);}catch(x){} toast('לא הצלחתי לפתוח את הקובץ'); }); }; rd.readAsArrayBuffer(file); }
function renderPage(){ var box=$('#pkPg'); if(!box||!S.slide)return; S.slide.getPage(S.page).then(function(pg){ if(!S.fit){ var v1=pg.getViewport({scale:1}); S.zoom=Math.max(.7,(box.clientWidth-22)/v1.width); S.fit=true; } var vp=pg.getViewport({scale:S.zoom}); var cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height; cv.style.width=vp.width+'px'; cv.style.height=vp.height+'px'; var wrap=document.createElement('div'); wrap.className='pks-w'; wrap.style.width=vp.width+'px'; wrap.style.height=vp.height+'px'; wrap.appendChild(cv);
  var tl=document.createElement('div'); tl.className='textLayer'; tl.style.width=vp.width+'px'; tl.style.height=vp.height+'px'; wrap.appendChild(tl); box.innerHTML=''; box.appendChild(wrap);
  pg.render({canvasContext:cv.getContext('2d'),viewport:vp});
  pg.getTextContent().then(function(tc){ try{ var o={viewport:vp,container:tl,textDivs:[]}; o.textContentSource=tc; o.textContent=tc; var r=pdfjsLib.renderTextLayer(o); }catch(e){} }); }); }
/* ---------- סימון טקסט -> למחברת ---------- */
function bar(){ var b=$('#pkSel'); if(!b){ b=document.createElement('div'); b.id='pkSel'; b.innerHTML='<button data-a="q">📝 למחברת</button><button data-a="c">💬 הערה</button><button data-a="h">🖍 סמן</button><button data-a="k">🃏 כרטיסייה</button>'; document.body.appendChild(b);
  b.addEventListener('mousedown',function(e){e.preventDefault();}); b.addEventListener('touchstart',function(e){e.preventDefault();},{passive:false});
  b.addEventListener('click',function(e){ var a=e.target.getAttribute&&e.target.getAttribute('data-a'); if(!a)return; var t=b._t; var src=b._s; if(a==='h'){ hl(); } else if(a==='k'){ card(t,src); } else addQuote(t,src,a==='c'); b.className=''; if(!(nbMode()&&a!=='h'))try{getSelection().removeAllRanges();}catch(x){} }); } return b; }
function card(t,src){ try{ var f=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—')[0].trim():(lessonCtx()||{topic:''}).topic; var bk=t.indexOf('—')>2&&t.indexOf('—')<60?t.split('—').slice(1).join('—').trim():t; var C=PK9.LS.g('pk9_cards',[]); C.unshift({f:f.slice(0,140),b:bk.slice(0,500),src:src,ts:Date.now()}); PK9.LS.s('pk9_cards',C); toast('נוספה כרטיסייה לחזרה'); }catch(e){} }
function srcOf(node){ var c=lessonCtx(); var base=c?(c.sb.name+' · שיעור '+(c.i+1)):''; if(node&&node.closest&&node.closest('.pks-pg'))return 'מצגת'+(S.name?' ('+S.name.replace(/\.pdf$/i,'')+')':'')+' · עמוד '+S.page; var h=null; try{ var el=node.nodeType===3?node.parentElement:node; var hs=[].slice.call(document.querySelectorAll('#content h3,#content h4')); hs.forEach(function(x){ if(x.compareDocumentPosition(el)&4)h=x; }); }catch(e){} return base+(h?' · '+h.textContent.trim().slice(0,60):''); }
function inScope(n){ if(!n)return false; var el=n.nodeType===3?n.parentElement:n; if(!el||!el.closest)return false; if(el.closest('#pkStudy .pks-ed,#pkSel'))return false; return !!(el.closest('.pks-pg')||(el.closest('#content')&&lessonCtx())); }
function onSel(){ setTimeout(function(){ var sl=getSelection(); var b=bar(); if(!S.open||!sl||sl.isCollapsed||sl.toString().trim().length<4||!inScope(sl.anchorNode)){ b.className=''; return; }
  var r=sl.getRangeAt(0).getBoundingClientRect(); b._t=sl.toString().trim().replace(/\s+/g,' '); b._s=srcOf(sl.anchorNode); b.className='on'; var w=b.offsetWidth||250; b.style.top=Math.max(8,r.top-48)+'px'; b.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px'; },10); }
document.addEventListener('mouseup',onSel); document.addEventListener('touchend',onSel); document.addEventListener('keyup',function(e){ if(e.shiftKey)onSel(); });
document.addEventListener('scroll',function(){ var b=$('#pkSel'); if(b&&b.className==='on')onSel(); },true);
/* הדגשות קבועות (נשמרות לכל שיעור) */
function hlKey(){ var c=lessonCtx(); return c?'pk9_hl:'+c.sb.id+':'+c.i:null; }
function hlGet(){ try{ return JSON.parse(localStorage.getItem(hlKey())||'[]'); }catch(e){return [];} }
function hl(){ var sl=getSelection(); if(!sl.rangeCount)return; var t=sl.toString().trim().replace(/\s+/g,' '); if(!t||!hlKey()||!inScope(sl.anchorNode)||$('.pks-pg')&&$('.pks-pg').contains(sl.anchorNode))return; var L=hlGet(); if(L.indexOf(t)<0)L.push(t); try{ localStorage.setItem(hlKey(),JSON.stringify(L)); }catch(e){} applyHl(); toast('הודגש'); }
function applyHl(){ var k=hlKey(); if(!k)return; var root=$('#content'); if(!root)return; var L=hlGet(); if(!L.length)return; L.forEach(function(t){ if(root.querySelector('mark.pkm[data-t="'+t.slice(0,20).replace(/"/g,'')+'"]'))return; var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null); var nd; while((nd=w.nextNode())){ var i=nd.nodeValue.replace(/\s+/g,' ').indexOf(t); if(i<0){ var j=nd.nodeValue.indexOf(t.slice(0,Math.min(t.length,30))); if(j<0)continue; i=j; } try{ var idx=nd.nodeValue.indexOf(t.slice(0,Math.min(t.length,30))); if(idx<0)continue; var len=Math.min(t.length,nd.nodeValue.length-idx); var r=document.createRange(); r.setStart(nd,idx); r.setEnd(nd,idx+len); var m=document.createElement('mark'); m.className='pkm'; m.setAttribute('data-t',t.slice(0,20).replace(/"/g,'')); r.surroundContents(m); }catch(e){} break; } }); }
/* ---------- כפתור בכותרת השיעור + קריאה נוחה ---------- */
function mark(){ var b=$('#pkNbBtn'); if(b)b.classList.toggle('on',S.open); var b2=$('#pkSlBtn'); if(b2)b2.classList.toggle('on',!!(window.PKSUM&&PKSUM.open)); }
function injectNb(){ var tb=$('#pkwTop,.pkw-top,.pkw-bar')||null; var host=$('.nb-toolbar'); if($('#pkwPaper')){ host=$('.pkw-ribbon,.pkw-tools,#pkW .pkw-bar,#pkW header')||$('#pkW'); }
  if(!host||$('#pkSlBtn'))return; var b=document.createElement('button'); b.id='pkSlBtn'; b.className='pk-slbtn'; b.innerHTML='🎓 מצב סיכום'; b.onmousedown=function(e){e.preventDefault();}; b.onclick=function(){ if(window.PKSUM)PKSUM.toggle(); }; if($('#pkwPaper')){ b.className+=' fl'; document.getElementById('pkW').appendChild(b); } else host.insertBefore(b,host.firstChild); }
function inject(){ if(nbMode()){ injectNb(); if(S.open&&!$('#pkStudy.on'))paint(); mark(); return; } var oldb=$('#pkSlBtn'); if(oldb)oldb.remove(); var c=lessonCtx(); if(!c){ if(S.open){ S.open=false; paint(); } var b0=$('#pkNbBtn'); if(b0)b0.remove(); var r0=$('#pkRead'); if(r0)r0.remove(); return; }
  var tabs=$('.l5-tabs'); if(!tabs)return; if(!$('#pkNbBtn')){ var b=document.createElement('button'); b.id='pkNbBtn'; b.className='pk-nbbtn'; b.innerHTML='📓 מחברת'; b.onclick=S.toggle; tabs.appendChild(b); }
  if(!$('#pkRead')){ var d=document.createElement('div'); d.id='pkRead'; d.innerHTML='<button onclick="PKSTUDY.fs(-1)" aria-label="הקטנה">A−</button><button onclick="PKSTUDY.fs(1)" aria-label="הגדלה">A+</button>'; tabs.appendChild(d); }
  applyFs(); applyHl(); mark(); if(S.open&&!$('#pkStudy.on'))paint(); }
var FS=0; try{ FS=parseInt(localStorage.getItem('pk9_fs')||'0',10)||0; }catch(e){}
function applyFs(){ document.documentElement.style.setProperty('--pk-fs',(1+FS*.08)+'em'); document.body.classList.toggle('pk-fs',FS!==0); }
S.fs=function(d){ FS=Math.max(-2,Math.min(5,FS+d)); try{ localStorage.setItem('pk9_fs',String(FS)); }catch(e){} applyFs(); };
var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(inject,140); }).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(inject,400);
})();
