/* ===== עורך PDF — סימון, טקסט, הערות, חתימה, עמודים, מיזוג, חיפוש, המרה — pk9 ===== */
(function(){
if(window.PK9P)return;
var E=PK9.E, LS=PK9.LS;
var P=window.PK9P={docs:[],pages:[],tool:'select',color:'#F7D44C',pc:'#8A2E3A',sw:2.2,zoom:1.15,cur:0,sel:null,undo:[],name:'',tab:'edit',side:'thumbs',dirty:false,texts:{}};
var HLC=['#F7D44C','#9BE39B','#FFB3C1','#9CCBFF'], PEN=['#8A2E3A','#1E3A8A','#2E6B45','#1E1412','#C2410C'];

/* ---------- טעינת ספריות ---------- */
function pdfjs(){ return new Promise(function(res,rej){ if(window.pdfjsLib)return res(window.pdfjsLib);
  var lib=document.getElementById('pk6PdfLib'), wk=document.getElementById('pk6PdfWorker');
  if(lib&&wk){ var s=document.createElement('script'); s.src=URL.createObjectURL(new Blob([lib.textContent],{type:'text/javascript'})); s.onload=function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([wk.textContent],{type:'text/javascript'})); }catch(e){} res(window.pdfjsLib); }; s.onerror=function(){rej(new Error('pdf.js'));}; document.head.appendChild(s); return; }
  rej(new Error('קורא ה-PDF לא זמין')); }); }
function b64bytes(b){ var s=atob(b), u=new Uint8Array(s.length); for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i); return u; }

/* ---------- אייקונים ---------- */
var IC={sel:'<path d="M5 3l14 8-6 2-2 6z"/>',hl:'<path d="M4 20h16"/><path d="M14.5 4.5l5 5L11 18H6v-5z"/>',pen:'<path d="M3 21c3-1 5-4 7-7s5-7 8-8c1 2-1 5-3 7s-6 5-12 8z"/>',text:'<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',note:'<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/>',rect:'<rect x="4" y="5" width="16" height="14" rx="1.5"/>',arrow:'<path d="M5 19L19 5M10 5h9v9"/>',
 v:'<path d="M4 12l5 5L20 6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',erase:'<path d="M7 21h12M4 15l9-9 6 6-7 7H7z"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>',
 rotr:'<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',rotl:'<path d="M4 11a8 8 0 112.3 5.7M4 4v7h7"/>',del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',blank:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M12 12v6M9 15h6"/>',
 merge:'<path d="M8 3v6a4 4 0 004 4h0a4 4 0 014 4v4M16 3v4M8 21v-4"/>',split:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M9 14h6M12 11l3 3-3 3"/>',sig:'<path d="M3 17c3 0 4-8 7-8s1 8 4 8 3-4 5-4M3 21h18"/>',stamp:'<path d="M9 3h6v6l3 3v3H6v-3l3-3zM5 19h14"/>',date:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 note2:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',brain:'<path d="M9 3a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 001 5 3 3 0 005 3V3zM15 3a3 3 0 013 3 3 3 0 012 5 3 3 0 01-1 5 3 3 0 01-5 3V3z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
 save:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/>',open:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',back:'<path d="M9 18l6-6-6-6"/>',thumbs:'<rect x="4" y="3" width="7" height="8" rx="1"/><rect x="13" y="3" width="7" height="8" rx="1"/><rect x="4" y="13" width="7" height="8" rx="1"/><rect x="13" y="13" width="7" height="8" rx="1"/>',cmts:'<path d="M4 5h16v11H9l-5 4z"/>'};
function sv(k){return '<svg viewBox="0 0 24 24">'+(IC[k]||'')+'</svg>';}
function T(k,ic,lab,title,on){ return '<button class="pkp-t'+(on?' on':'')+'" data-k="'+k+'" title="'+E(title||lab)+'" onclick="PK9P.cmd(\''+k+'\')">'+sv(ic)+'<span>'+lab+'</span></button>'; }
function G(lab,inner){ return '<div class="pkw-g"><div class="pkw-gi row">'+inner+'</div><div class="pkw-gl">'+lab+'</div></div>'; }

/* ---------- מעטפת ---------- */
function ribbon(){ var t=P.tab, h='';
  if(t==='edit'){ var tl=P.tool;
    h=G('בחירה',T('select','sel','בחירה','בחירה, הזזה ומחיקה של סימונים',tl==='select')+T('erase','erase','מחק','לוחצים על סימון כדי למחוק',tl==='erase')+T('undo','undo','ביטול','ביטול (Ctrl+Z)'))
     +G('סימון',T('hl','hl','מרקר','גוררים על הטקסט כדי לסמן',tl==='hl')+T('pen','pen','עט','ציור חופשי',tl==='pen')+T('rect','rect','מסגרת','',tl==='rect')+T('arrow','arrow','חץ','',tl==='arrow'))
     +G('הוספה',T('text','text','טקסט','לוחצים על הדף וכותבים',tl==='text')+T('note','note','הערה','פתק הערה צמוד לדף',tl==='note')+T('v','v','✓','',tl==='v')+T('x','x','✗','',tl==='x'))
     +G('צבע','<div class="pkp-cols">'+(tl==='hl'?HLC:PEN).map(function(c){ var on=(tl==='hl'?P.color:P.pc)===c; return '<i class="'+(on?'on':'')+'" style="background:'+c+'" onclick="PK9P.col(\''+c+'\')"></i>'; }).join('')+'</div>');
  } else if(t==='pages'){
    h=G('סיבוב',T('rotr','rotr','ימינה','סיבוב העמוד הנוכחי')+T('rotl','rotl','שמאלה'))
     +G('סדר',T('up','up','למעלה','הזזת העמוד אחורה')+T('down','down','למטה','הזזת העמוד קדימה')+T('del','del','מחיקה','מחיקת העמוד הנוכחי'))
     +G('הוספה',T('blank','blank','עמוד ריק')+T('merge','merge','מיזוג PDF','צירוף קובץ PDF נוסף לסוף'))
     +G('חילוץ',T('extract','split','עמוד ל-PDF','שמירת העמוד הנוכחי כקובץ נפרד'));
  } else if(t==='sign'){ var sg=LS.g('pk9_sig',null);
    h=G('החתימה שלי',(sg?'<button class="pkp-sigb'+(P.tool==='sig'?' on':'')+'" onclick="PK9P.cmd(\'sig\')" title="לוחצים ואז על המקום בדף"><img src="'+sg+'"></button>':'')+T('sigNew','sig',sg?'חתימה חדשה':'יצירת חתימה'))
     +G('חותמות',T('stDate','date','תאריך','חותמת תאריך היום',P.tool==='st:date')+T('stOk','stamp','התקבל','',P.tool==='st:ok')+T('stRev','stamp','נבדק','',P.tool==='st:rev')+T('stCopy','stamp','העתק נאמן','',P.tool==='st:copy'));
  } else if(t==='convert'){
    h=G('המרה',T('toNote','note2','למחברת','הטקסט של ה-PDF כמסמך במחברת')+T('toBrain','brain','למוח שלי','המוח שלי בונה ממנו נושאים ושאלות'))
     +G('חיפוש',T('find','search','חיפוש בטקסט'));
  } return h; }
function shell(){ return '<div class="pkw-top"><button class="pkw-back" onclick="PK9P.close()">'+sv('back')+'<span>המחברת שלי</span></button>'
  +'<div class="pkw-doc"><b class="pkp-name">'+E(P.name)+'</b><span class="pkw-crs" id="pkpCnt"></span></div><span id="pkpSaved" class="pkw-saved">'+(P.dirty?'שינויים לא שמורים':'הקובץ המקורי')+'</span>'
  +'<div class="pkw-acts"><button class="pkw-x" onclick="PK9P.pick()">'+sv('open')+'<span>פתיחה</span></button><button class="pkw-x" onclick="PK9P.print()">'+sv('print')+'<span>הדפסה</span></button><button class="pkw-x gold" onclick="PK9P.save()">'+sv('save')+'<span>שמירת PDF</span></button></div></div>'
  +'<div class="pkw-tabs" id="pkpTabs">'+[['edit','עריכה'],['pages','עמודים'],['sign','חתימה'],['convert','המרה וחיפוש']].map(function(t){return '<button data-t="'+t[0]+'" class="'+(P.tab===t[0]?'on':'')+'" onclick="PK9P.tabSet(\''+t[0]+'\')">'+t[1]+'</button>';}).join('')+'</div>'
  +'<div class="pkw-rib pkp-rib" id="pkpRib"></div>'
  +'<div class="pkw-main"><aside class="pkp-side" id="pkpSide"><div class="pkp-sh"><button data-s="thumbs" onclick="PK9P.sideSet(\'thumbs\')">'+sv('thumbs')+'עמודים</button><button data-s="cmts" onclick="PK9P.sideSet(\'cmts\')">'+sv('cmts')+'הערות</button><button data-s="find" onclick="PK9P.sideSet(\'find\')">'+sv('search')+'חיפוש</button></div><div class="pkp-sb" id="pkpSb"></div></aside>'
  +'<div class="pkw-desk pkp-desk" id="pkpDesk"></div></div>'
  +'<div class="pkw-status"><div id="pkpStat"></div><div class="pkw-zoom"><button onclick="PK9P.zoomBy(-.1)">−</button><input id="pkpZ" type="range" min="50" max="220" step="10" value="'+Math.round(P.zoom*100)+'" oninput="PK9P.zoomTo(this.value/100)"><button onclick="PK9P.zoomBy(.1)">+</button><span id="pkpZv">'+Math.round(P.zoom*100)+'%</span></div></div>'; }
function rib(){ var r=document.getElementById('pkpRib'); if(r)r.innerHTML=ribbon(); document.querySelectorAll('#pkpTabs button').forEach(function(b){b.classList.toggle('on',b.dataset.t===P.tab);}); var d=document.getElementById('pkpDesk'); if(d)d.dataset.tool=P.tool; }
P.tabSet=function(t){ P.tab=t; if(t!=='edit'&&t!=='sign'&&P.tool!=='select')P.tool='select'; rib(); };
P.col=function(c){ if(P.tool==='hl')P.color=c; else P.pc=c; rib(); };
function status(){ var s=document.getElementById('pkpStat'); if(s)s.innerHTML='<span>עמוד '+(P.cur+1)+' מתוך '+P.pages.length+'</span><span>'+P.pages.reduce(function(a,p){return a+p.ann.length;},0)+' סימונים</span>'; var c=document.getElementById('pkpCnt'); if(c)c.textContent=P.pages.length+' עמודים'; }
function dirty(){ P.dirty=true; var s=document.getElementById('pkpSaved'); if(s){ s.textContent='שינויים לא שמורים'; s.className='pkw-saved busy'; } status(); }

/* ---------- עמודים ותצוגה ---------- */
async function pdfPage(pg){ var d=P.docs[pg.d]; return d.pdf.getPage(pg.i+1); }
function vp(pdfp,pg,scale){ return pdfp.getViewport({scale:scale,rotation:(pdfp.rotate+pg.rot)%360}); }
async function measure(pg){ if(pg.blank){ var r=pg.rot%180?[842,595]:[595,842]; pg.w=r[0]; pg.h=r[1]; return; } var p=await pdfPage(pg), v=vp(p,pg,1); pg.w=v.width; pg.h=v.height; }
var io=null;
async function layout(){ var desk=document.getElementById('pkpDesk'); if(!desk)return; for(var i=0;i<P.pages.length;i++)await measure(P.pages[i]);
  desk.innerHTML=P.pages.map(function(pg,i){ return '<div class="pkp-page" data-i="'+i+'" style="width:'+(pg.w*P.zoom)+'px;height:'+(pg.h*P.zoom)+'px"><canvas></canvas><svg class="pkp-ov" viewBox="0 0 '+pg.w+' '+pg.h+'" preserveAspectRatio="none"></svg><span class="pkp-pn">'+(i+1)+'</span></div>'; }).join('');
  if(io)io.disconnect(); io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var el=e.target; if(!el.dataset.r)paint(+el.dataset.i,el); } }); },{root:desk,rootMargin:'600px'});
  desk.querySelectorAll('.pkp-page').forEach(function(el){ io.observe(el); var i=+el.dataset.i; drawAnn(i); bindPage(el,i); });
  desk.onscroll=function(){ var best=0, top=desk.getBoundingClientRect().top; desk.querySelectorAll('.pkp-page').forEach(function(el,i){ if(el.getBoundingClientRect().top-top<desk.clientHeight*.4)best=i; }); if(best!==P.cur){ P.cur=best; status(); markThumb(); } };
  status(); side(); }
async function paint(i,el){ var pg=P.pages[i]; if(!pg)return; el.dataset.r=1; var cv=el.querySelector('canvas'), dpr=Math.min(2,window.devicePixelRatio||1)*1.25;
  cv.width=pg.w*P.zoom*dpr; cv.height=pg.h*P.zoom*dpr; cv.style.width=pg.w*P.zoom+'px'; cv.style.height=pg.h*P.zoom+'px'; var g=cv.getContext('2d');
  if(pg.blank){ g.fillStyle='#fff'; g.fillRect(0,0,cv.width,cv.height); return; }
  var p=await pdfPage(pg); await p.render({canvasContext:g,viewport:vp(p,pg,P.zoom*dpr)}).promise; }
P.zoomTo=function(z){ P.zoom=Math.max(.5,Math.min(2.2,z)); var zv=document.getElementById('pkpZv'); if(zv)zv.textContent=Math.round(P.zoom*100)+'%'; var r=document.getElementById('pkpZ'); if(r)r.value=Math.round(P.zoom*100); var cur=P.cur; layout().then(function(){ P.goto(cur,true); }); };
P.zoomBy=function(d){ P.zoomTo(Math.round((P.zoom+d)*10)/10); };
P.goto=function(i,inst){ var el=document.querySelector('.pkp-page[data-i="'+i+'"]'); if(el)el.scrollIntoView({behavior:inst?'auto':'smooth',block:'start'}); P.cur=i; status(); markThumb(); };

/* ---------- סימונים: ציור ---------- */
function NS(t,a){ var e=document.createElementNS('http://www.w3.org/2000/svg',t); for(var k in a)e.setAttribute(k,a[k]); return e; }
function stampTxt(k){ var d=new Date().toLocaleDateString('he-IL'); return {date:d,ok:'התקבל · '+d,rev:'נבדק · '+d,copy:'העתק נאמן למקור'}[k]||k; }
function annEl(a,j){ var g=NS('g',{'data-j':j,'class':'pkp-a'+(P.sel&&P.sel.j===j&&P.sel.i===a._i?' sel':'')});
  if(a.t==='hl')g.appendChild(NS('rect',{x:a.x,y:a.y,width:a.w,height:a.h,fill:a.c,'fill-opacity':.42,style:'mix-blend-mode:multiply'}));
  else if(a.t==='rect')g.appendChild(NS('rect',{x:a.x,y:a.y,width:a.w,height:a.h,fill:'none',stroke:a.c,'stroke-width':a.sw,rx:2}));
  else if(a.t==='pen'){ g.appendChild(NS('path',{d:'M'+a.pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L'),fill:'none',stroke:a.c,'stroke-width':a.sw,'stroke-linecap':'round','stroke-linejoin':'round'})); }
  else if(a.t==='arrow'){ var ang=Math.atan2(a.y2-a.y1,a.x2-a.x1), L=10+a.sw*2; g.appendChild(NS('line',{x1:a.x1,y1:a.y1,x2:a.x2,y2:a.y2,stroke:a.c,'stroke-width':a.sw,'stroke-linecap':'round'})); g.appendChild(NS('path',{d:'M'+a.x2+' '+a.y2+' L'+(a.x2-L*Math.cos(ang-.45))+' '+(a.y2-L*Math.sin(ang-.45))+' L'+(a.x2-L*Math.cos(ang+.45))+' '+(a.y2-L*Math.sin(ang+.45))+'Z',fill:a.c})); }
  else if(a.t==='text'){ var t=NS('text',{x:a.x,y:a.y+a.fs,fill:a.c,'font-size':a.fs,'font-family':'Assistant, Noto Sans Hebrew, sans-serif',direction:'rtl','text-anchor':'start','font-weight':500}); String(a.s).split('\n').forEach(function(l,k){ var ts=NS('tspan',{x:a.x,dy:k?a.fs*1.3:0}); ts.textContent=l||' '; t.appendChild(ts); }); g.appendChild(t); }
  else if(a.t==='note'){ g.appendChild(NS('rect',{x:a.x-11,y:a.y-11,width:22,height:22,rx:4,fill:'#F7D44C',stroke:'#C9A227','stroke-width':1})); g.appendChild(NS('path',{d:'M'+(a.x-6)+' '+(a.y-4)+'h12M'+(a.x-6)+' '+(a.y+1)+'h12M'+(a.x-6)+' '+(a.y+6)+'h7',stroke:'#7A5A16','stroke-width':1.5})); }
  else if(a.t==='mark'){ g.appendChild(NS('path',{d:a.k==='v'?'M'+(a.x-9)+' '+a.y+' l6 7 l13 -15':'M'+(a.x-8)+' '+(a.y-8)+' l16 16 M'+(a.x+8)+' '+(a.y-8)+' l-16 16',fill:'none',stroke:a.c,'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'})); }
  else if(a.t==='stamp'){ var w=Math.max(90,a.s.length*7.6+26); g.appendChild(NS('rect',{x:a.x-w,y:a.y,width:w,height:30,rx:6,fill:'rgba(255,255,255,.6)',stroke:a.c,'stroke-width':2})); var st=NS('text',{x:a.x-w/2,y:a.y+20,fill:a.c,'font-size':14,'font-weight':700,'text-anchor':'middle','font-family':'Assistant, sans-serif'}); st.textContent=a.s; g.appendChild(st); a.w=w; }
  else if(a.t==='img'){ g.appendChild(NS('image',{href:a.src,x:a.x,y:a.y,width:a.w,height:a.h})); }
  return g; }
function bbox(a){ if(a.t==='hl'||a.t==='rect'||a.t==='img')return [a.x,a.y,a.w,a.h]; if(a.t==='pen'){ var xs=a.pts.map(function(p){return p[0];}), ys=a.pts.map(function(p){return p[1];}); return [Math.min.apply(0,xs),Math.min.apply(0,ys),Math.max.apply(0,xs)-Math.min.apply(0,xs),Math.max.apply(0,ys)-Math.min.apply(0,ys)]; }
  if(a.t==='arrow')return [Math.min(a.x1,a.x2),Math.min(a.y1,a.y2),Math.abs(a.x2-a.x1),Math.abs(a.y2-a.y1)]; if(a.t==='text'){ var ls=String(a.s).split('\n'); var w=Math.max.apply(0,ls.map(function(l){return l.length;}))*a.fs*.55; return [a.x-w,a.y,w,ls.length*a.fs*1.3+4]; }
  if(a.t==='stamp')return [a.x-(a.w||100),a.y,a.w||100,30]; return [a.x-12,a.y-12,24,24]; }
function drawAnn(i){ var el=document.querySelector('.pkp-page[data-i="'+i+'"] svg'); if(!el)return; el.innerHTML=''; P.pages[i].ann.forEach(function(a,j){ a._i=i; el.appendChild(annEl(a,j)); });
  if(P.sel&&P.sel.i===i){ var a=P.pages[i].ann[P.sel.j]; if(a){ var b=bbox(a); el.appendChild(NS('rect',{x:b[0]-4,y:b[1]-4,width:b[2]+8,height:b[3]+8,fill:'none',stroke:'#8A2E3A','stroke-width':1.2,'stroke-dasharray':'4 3',rx:3})); } } }
function snap(){ P.undo.push(JSON.stringify(P.pages.map(function(p){return p.ann;}))); if(P.undo.length>60)P.undo.shift(); }
function add(i,a){ snap(); P.pages[i].ann.push(a); drawAnn(i); dirty(); side(); }

/* ---------- סימונים: אינטראקציה ---------- */
function pt(e,svg,pg){ var r=svg.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*pg.w,(e.clientY-r.top)/r.height*pg.h]; }
function hit(i,x,y){ var A=P.pages[i].ann; for(var j=A.length-1;j>=0;j--){ var b=bbox(A[j]); if(x>=b[0]-6&&x<=b[0]+b[2]+6&&y>=b[1]-6&&y<=b[1]+b[3]+6)return j; } return -1; }
function bindPage(el,i){ var svg=el.querySelector('svg'), pg=P.pages[i], st=null;
  svg.addEventListener('pointerdown',function(e){ if(e.button)return; var p=pt(e,svg,pg), tl=P.tool; P.cur=i; status(); markThumb();
    if(tl==='select'){ var j=hit(i,p[0],p[1]); var prev=P.sel; P.sel=j>=0?{i:i,j:j}:null; if(prev&&prev.i!==i)drawAnn(prev.i); drawAnn(i); if(j>=0){ var a=pg.ann[j]; if(a.t==='note'){ noteOpen(i,j,e); } snap(); st={m:'move',p:p,o:JSON.stringify(a)}; svg.setPointerCapture(e.pointerId); } return; }
    if(tl==='erase'){ var k=hit(i,p[0],p[1]); if(k>=0){ snap(); pg.ann.splice(k,1); P.sel=null; drawAnn(i); dirty(); side(); } return; }
    if(tl==='text'){ textAt(el,i,p); return; }
    if(tl==='note'){ add(i,{t:'note',x:p[0],y:p[1],s:''}); noteOpen(i,pg.ann.length-1,e); P.tool='select'; rib(); return; }
    if(tl==='v'||tl==='x'){ add(i,{t:'mark',k:tl,x:p[0],y:p[1],c:tl==='v'?'#2E6B45':'#9A2F2F'}); return; }
    if(tl.indexOf('st:')===0){ add(i,{t:'stamp',x:p[0]+60,y:p[1]-15,s:stampTxt(tl.slice(3)),c:tl==='st:ok'?'#2E6B45':tl==='st:rev'?'#1E3A8A':'#8A2E3A'}); P.tool='select'; rib(); return; }
    if(tl==='sig'){ var src=LS.g('pk9_sig',null); if(!src)return; var im=new Image(); im.onload=function(){ var w=150, h=w*im.height/im.width; add(i,{t:'img',src:src,x:p[0]-w/2,y:p[1]-h/2,w:w,h:h}); P.tool='select'; rib(); }; im.src=src; return; }
    snap(); var a=tl==='hl'?{t:'hl',x:p[0],y:p[1],w:0,h:0,c:P.color}:tl==='rect'?{t:'rect',x:p[0],y:p[1],w:0,h:0,c:P.pc,sw:P.sw}:tl==='arrow'?{t:'arrow',x1:p[0],y1:p[1],x2:p[0],y2:p[1],c:P.pc,sw:P.sw}:{t:'pen',pts:[p],c:P.pc,sw:P.sw};
    pg.ann.push(a); st={m:'draw',a:a,p:p}; svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove',function(e){ if(!st)return; var p=pt(e,svg,pg);
    if(st.m==='draw'){ var a=st.a; if(a.t==='hl'||a.t==='rect'){ a.x=Math.min(st.p[0],p[0]); a.y=Math.min(st.p[1],p[1]); a.w=Math.abs(p[0]-st.p[0]); a.h=Math.abs(p[1]-st.p[1]); } else if(a.t==='arrow'){ a.x2=p[0]; a.y2=p[1]; } else a.pts.push(p); drawAnn(i); }
    else if(st.m==='move'){ var dx=p[0]-st.p[0], dy=p[1]-st.p[1], o=JSON.parse(st.o), a2=pg.ann[P.sel.j];
      if(a2.t==='pen')a2.pts=o.pts.map(function(q){return [q[0]+dx,q[1]+dy];}); else if(a2.t==='arrow'){ a2.x1=o.x1+dx; a2.y1=o.y1+dy; a2.x2=o.x2+dx; a2.y2=o.y2+dy; } else { a2.x=o.x+dx; a2.y=o.y+dy; } drawAnn(i); st.moved=true; } });
  svg.addEventListener('pointerup',function(){ if(!st)return; if(st.m==='draw'){ var a=st.a; if((a.t==='hl'||a.t==='rect')&&(a.w<4||a.h<3)){ pg.ann.pop(); P.undo.pop(); } else if(a.t==='pen'&&a.pts.length<2){ pg.ann.pop(); P.undo.pop(); } else { dirty(); side(); } drawAnn(i); } else if(st.m==='move'){ if(st.moved)dirty(); else P.undo.pop(); } st=null; });
  svg.addEventListener('dblclick',function(e){ var p=pt(e,svg,pg), j=hit(i,p[0],p[1]); if(j>=0&&pg.ann[j].t==='text'){ var a=pg.ann[j]; pg.ann.splice(j,1); drawAnn(i); textAt(el,i,[a.x,a.y],a); } }); }
function textAt(el,i,p,old){ var pg=P.pages[i]; var ta=document.createElement('textarea'); ta.className='pkp-ta'; ta.value=old?old.s:''; ta.style.right=((pg.w-p[0])*P.zoom)+'px'; ta.style.top=(p[1]*P.zoom)+'px'; ta.style.fontSize=((old?old.fs:14)*P.zoom)+'px'; ta.style.color=old?old.c:P.pc; el.appendChild(ta); setTimeout(function(){ta.focus();},10);
  ta.placeholder='כותבים כאן…'; ta.onpointerdown=function(e){e.stopPropagation();};
  ta.onblur=function(){ var v=ta.value.trim(); ta.remove(); if(v)add(i,{t:'text',x:p[0],y:p[1],s:v,c:old?old.c:P.pc,fs:old?old.fs:14}); else if(old){ dirty(); side(); } }; ta.onkeydown=function(e){ if(e.key==='Escape')ta.blur(); }; }
function noteOpen(i,j,e){ var a=P.pages[i].ann[j]; var d=document.getElementById('pkpNote'); if(!d){ d=document.createElement('div'); d.id='pkpNote'; document.getElementById('pkP').appendChild(d); }
  d.innerHTML='<div class="h"><b>הערה · עמוד '+(i+1)+'</b><button onclick="PK9P.noteDel('+i+','+j+')">מחיקה</button></div><textarea placeholder="כותבים הערה…">'+E(a.s||'')+'</textarea>'; d.style.left=Math.min(window.innerWidth-300,Math.max(10,e.clientX-140))+'px'; d.style.top=Math.min(window.innerHeight-220,e.clientY+16)+'px'; d.classList.add('in');
  var t=d.querySelector('textarea'); setTimeout(function(){t.focus();},20); t.oninput=function(){ a.s=t.value; dirty(); }; t.onblur=function(){ setTimeout(function(){ if(!d.contains(document.activeElement)){ d.classList.remove('in'); side(); } },150); }; }
P.noteDel=function(i,j){ snap(); P.pages[i].ann.splice(j,1); P.sel=null; drawAnn(i); dirty(); side(); var d=document.getElementById('pkpNote'); if(d)d.classList.remove('in'); };
document.addEventListener('keydown',function(e){ if(!document.getElementById('pkP'))return; var tag=(document.activeElement||{}).tagName; if(tag==='TEXTAREA'||tag==='INPUT')return;
  if((e.key==='Delete'||e.key==='Backspace')&&P.sel){ e.preventDefault(); snap(); P.pages[P.sel.i].ann.splice(P.sel.j,1); var i=P.sel.i; P.sel=null; drawAnn(i); dirty(); side(); }
  if((e.ctrlKey||e.metaKey)&&e.key==='z'){ e.preventDefault(); P.cmd('undo'); }
  if(e.key==='Escape'){ if(P.tool!=='select'){ P.tool='select'; rib(); } else P.close(); } });

/* ---------- צד: עמודים, הערות, חיפוש ---------- */
P.sideSet=function(s){ P.side=s; side(); if(s==='find')setTimeout(function(){ var q=document.getElementById('pkpQ'); if(q)q.focus(); },30); };
function side(){ var sb=document.getElementById('pkpSb'); if(!sb)return; document.querySelectorAll('.pkp-sh button').forEach(function(b){b.classList.toggle('on',b.dataset.s===P.side);});
  if(P.side==='thumbs'){ sb.innerHTML=P.pages.map(function(pg,i){ return '<div class="pkp-th'+(i===P.cur?' on':'')+'" draggable="true" data-i="'+i+'"><canvas></canvas><span>'+(i+1)+(pg.ann.length?' · '+pg.ann.length+' ✎':'')+'</span></div>'; }).join('');
    sb.querySelectorAll('.pkp-th').forEach(function(th){ var i=+th.dataset.i; thumb(i,th.querySelector('canvas')); th.onclick=function(){ P.goto(i); };
      th.ondragstart=function(e){ e.dataTransfer.setData('text/plain',i); th.classList.add('drag'); }; th.ondragend=function(){ th.classList.remove('drag'); };
      th.ondragover=function(e){ e.preventDefault(); th.classList.add('over'); }; th.ondragleave=function(){ th.classList.remove('over'); };
      th.ondrop=function(e){ e.preventDefault(); var from=+e.dataTransfer.getData('text/plain'); if(from===i)return; var m=P.pages.splice(from,1)[0]; P.pages.splice(i,0,m); P.cur=i; dirty(); layout().then(function(){P.goto(i,true);}); }; }); }
  else if(P.side==='cmts'){ var L=[]; P.pages.forEach(function(pg,i){ pg.ann.forEach(function(a,j){ if(a.t==='note'||a.t==='text')L.push({i:i,j:j,a:a}); }); });
    sb.innerHTML=L.length?L.map(function(x){ return '<div class="pkp-cm" onclick="PK9P.goto('+x.i+')"><em>עמוד '+(x.i+1)+' · '+(x.a.t==='note'?'הערה':'טקסט')+'</em><p>'+E(x.a.s||'(הערה ריקה)')+'</p></div>'; }).join(''):'<p class="pkp-emp">אין עדיין הערות. בלשונית "עריכה" ← "הערה", ולוחצים על הדף.</p>'; }
  else { sb.innerHTML='<div class="pkp-find"><input id="pkpQ" placeholder="חיפוש בטקסט של הקובץ…" value="'+E(P.q||'')+'" onkeydown="if(event.key===\'Enter\')PK9P.find(this.value)"><button onclick="PK9P.find(document.getElementById(\'pkpQ\').value)">'+sv('search')+'</button></div><div id="pkpFr">'+(P.fr||'<p class="pkp-emp">כותבים מילה או סעיף — ורואים באיזה עמוד הם מופיעים.</p>')+'</div>'; } }
async function thumb(i,cv){ var pg=P.pages[i]; var s=120/pg.w; cv.width=pg.w*s*2; cv.height=pg.h*s*2; cv.style.width=pg.w*s+'px'; cv.style.height=pg.h*s+'px'; var g=cv.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,cv.width,cv.height);
  if(!pg.blank){ var p=await pdfPage(pg); await p.render({canvasContext:g,viewport:vp(p,pg,s*2)}).promise; } g.save(); g.scale(s*2,s*2); pg.ann.forEach(function(a){ drawCv(g,a); }); g.restore(); }
function markThumb(){ document.querySelectorAll('.pkp-th').forEach(function(t){ t.classList.toggle('on',+t.dataset.i===P.cur); }); }
async function pageText(pg){ var key=pg.d+':'+pg.i; if(P.texts[key]!=null)return P.texts[key]; if(pg.blank)return ''; var p=await pdfPage(pg), tc=await p.getTextContent(); var L={};
  tc.items.forEach(function(it){ if(!it.str)return; var y=Math.round(it.transform[5]/3)*3; (L[y]=L[y]||[]).push({s:it.str,x:it.transform[4],w:it.width||0}); });
  var s=Object.keys(L).map(Number).sort(function(a,b){return b-a;}).map(function(y){ var A=L[y], rtl=A.some(function(a){return /[\u0590-\u05FF]/.test(a.s);});
    A.sort(function(a,b){ return rtl?(b.x+b.w)-(a.x+a.w):a.x-b.x; }); var out='', prev=null;
    A.forEach(function(a){ if(prev){ var gap=rtl?prev.x-(a.x+a.w):a.x-(prev.x+prev.w); if(gap>1.2&&!/\s$/.test(out)&&!/^\s/.test(a.s))out+=' '; } out+=a.s; prev=a; }); out=out.replace(/\s+/g,' ').trim(); if(rtl)out=out.replace(/[()\[\]]/g,function(c){return {'(':')',')':'(','[':']',']':'['}[c];}); return out; }).filter(Boolean).join('\n');
  P.texts[key]=s; return s; }
P.find=async function(q){ q=String(q||'').trim(); P.q=q; if(!q){ P.fr=''; side(); return; } var out=[];
  for(var i=0;i<P.pages.length;i++){ var t=(await pageText(P.pages[i])).replace(/\s+/g,' '); var k=t.indexOf(q), n=0; while(k>=0&&n<3){ out.push('<div class="pkp-fr" onclick="PK9P.goto('+i+')"><em>עמוד '+(i+1)+'</em><p>…'+E(t.slice(Math.max(0,k-50),k))+'<mark>'+E(q)+'</mark>'+E(t.slice(k+q.length,k+q.length+60))+'…</p></div>'); n++; k=t.indexOf(q,k+q.length); } }
  P.fr=out.length?'<p class="pkp-emp" style="margin:4px 2px 10px">'+out.length+' תוצאות</p>'+out.join(''):'<p class="pkp-emp">לא נמצא "'+E(q)+'" בקובץ.</p>'; side(); };

/* ---------- ציור על קנבס (לייצוא ולתמונות ממוזערות) ---------- */
var IMG={};
function drawCv(g,a){ g.save();
  if(a.t==='hl'){ g.globalAlpha=.42; g.globalCompositeOperation='multiply'; g.fillStyle=a.c; g.fillRect(a.x,a.y,a.w,a.h); }
  else if(a.t==='rect'){ g.strokeStyle=a.c; g.lineWidth=a.sw; g.strokeRect(a.x,a.y,a.w,a.h); }
  else if(a.t==='pen'){ g.strokeStyle=a.c; g.lineWidth=a.sw; g.lineCap='round'; g.lineJoin='round'; g.beginPath(); a.pts.forEach(function(p,k){ k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]); }); g.stroke(); }
  else if(a.t==='arrow'){ var ang=Math.atan2(a.y2-a.y1,a.x2-a.x1), L=10+a.sw*2; g.strokeStyle=g.fillStyle=a.c; g.lineWidth=a.sw; g.lineCap='round'; g.beginPath(); g.moveTo(a.x1,a.y1); g.lineTo(a.x2,a.y2); g.stroke(); g.beginPath(); g.moveTo(a.x2,a.y2); g.lineTo(a.x2-L*Math.cos(ang-.45),a.y2-L*Math.sin(ang-.45)); g.lineTo(a.x2-L*Math.cos(ang+.45),a.y2-L*Math.sin(ang+.45)); g.closePath(); g.fill(); }
  else if(a.t==='text'){ g.fillStyle=a.c; g.font='500 '+a.fs+'px Assistant, "Noto Sans Hebrew", sans-serif'; g.direction='rtl'; g.textAlign='right'; String(a.s).split('\n').forEach(function(l,k){ g.fillText(l,a.x,a.y+a.fs+k*a.fs*1.3); }); }
  else if(a.t==='note'){ g.fillStyle='#F7D44C'; g.strokeStyle='#C9A227'; g.fillRect(a.x-11,a.y-11,22,22); g.strokeRect(a.x-11,a.y-11,22,22); if(a.s){ g.font='12px Assistant, sans-serif'; g.direction='rtl'; g.textAlign='right'; var lines=wrap(g,a.s,170); var h=lines.length*16+12; g.fillStyle='rgba(255,248,214,.96)'; g.strokeStyle='#E2C766'; g.fillRect(a.x-200,a.y+14,190,h); g.strokeRect(a.x-200,a.y+14,190,h); g.fillStyle='#3A2A10'; lines.forEach(function(l,k){ g.fillText(l,a.x-16,a.y+32+k*16); }); } }
  else if(a.t==='mark'){ g.strokeStyle=a.c; g.lineWidth=3; g.lineCap='round'; g.lineJoin='round'; g.beginPath(); if(a.k==='v'){ g.moveTo(a.x-9,a.y); g.lineTo(a.x-3,a.y+7); g.lineTo(a.x+10,a.y-8); } else { g.moveTo(a.x-8,a.y-8); g.lineTo(a.x+8,a.y+8); g.moveTo(a.x+8,a.y-8); g.lineTo(a.x-8,a.y+8); } g.stroke(); }
  else if(a.t==='stamp'){ var w=a.w||Math.max(90,a.s.length*7.6+26); g.strokeStyle=g.fillStyle=a.c; g.lineWidth=2; g.beginPath(); if(g.roundRect)g.roundRect(a.x-w,a.y,w,30,6); else g.rect(a.x-w,a.y,w,30); g.stroke(); g.font='700 14px Assistant, sans-serif'; g.textAlign='center'; g.direction='rtl'; g.fillText(a.s,a.x-w/2,a.y+20); }
  else if(a.t==='img'&&IMG[a.src]){ g.drawImage(IMG[a.src],a.x,a.y,a.w,a.h); }
  g.restore(); }
function wrap(g,s,w){ var out=[]; String(s).split('\n').forEach(function(par){ var line=''; par.split(' ').forEach(function(wd){ var t=line?line+' '+wd:wd; if(g.measureText(t).width>w&&line){ out.push(line); line=wd; } else line=t; }); out.push(line); }); return out.slice(0,12); }
function preload(){ var srcs={}; P.pages.forEach(function(p){ p.ann.forEach(function(a){ if(a.t==='img')srcs[a.src]=1; }); }); return Promise.all(Object.keys(srcs).map(function(s){ return new Promise(function(r){ if(IMG[s])return r(); var im=new Image(); im.onload=function(){IMG[s]=im;r();}; im.onerror=r; im.src=s; }); })); }

/* ---------- בניית ה-PDF החדש ---------- */
async function build(only){ var L=window.PDFLib; if(!L)throw new Error('ספריית ה-PDF לא נטענה'); await preload(); try{ await document.fonts.load('500 14px Assistant'); }catch(e){}
  var out=await L.PDFDocument.create(), src=[]; for(var d=0;d<P.docs.length;d++)src.push(await L.PDFDocument.load(P.docs[d].bytes,{ignoreEncryption:true}));
  var list=only!=null?[P.pages[only]]:P.pages;
  for(var k=0;k<list.length;k++){ var pg=list[k], page;
    var intrinsic=0; if(!pg.blank){ var pp=await pdfPage(pg); intrinsic=pp.rotate||0; }
    if(pg.blank||pg.rot||intrinsic){ /* מסובב או ריק: מציירים את העמוד כתמונה באיכות גבוהה */
      var s=2.4, cv=document.createElement('canvas'); cv.width=pg.w*s; cv.height=pg.h*s; var g=cv.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,cv.width,cv.height);
      if(!pg.blank){ var p2=await pdfPage(pg); await p2.render({canvasContext:g,viewport:vp(p2,pg,s)}).promise; }
      g.save(); g.scale(s,s); pg.ann.forEach(function(a){drawCv(g,a);}); g.restore();
      var jpg=await out.embedJpg(await (await new Promise(function(r){cv.toBlob(r,'image/jpeg',.9);})).arrayBuffer()); page=out.addPage([pg.w,pg.h]); page.drawImage(jpg,{x:0,y:0,width:pg.w,height:pg.h}); continue; }
    var cp=(await out.copyPages(src[pg.d],[pg.i]))[0]; page=out.addPage(cp);
    if(pg.ann.length){ var s2=2.4, c2=document.createElement('canvas'); c2.width=pg.w*s2; c2.height=pg.h*s2; var g2=c2.getContext('2d'); g2.scale(s2,s2); pg.ann.forEach(function(a){drawCv(g2,a);});
      var png=await out.embedPng(await (await new Promise(function(r){c2.toBlob(r,'image/png');})).arrayBuffer()); var sz=page.getSize(); page.drawImage(png,{x:0,y:0,width:sz.width,height:sz.height}); } }
  out.setTitle(P.name); out.setProducer('פרקליט'); return await out.save(); }
function dl(bytes,name){ var b=new Blob([bytes],{type:'application/pdf'}), a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
function base(){ return String(P.name||'מסמך').replace(/\.pdf$/i,''); }
P.save=async function(){ PK9.toast('בונה את הקובץ…'); try{ var b=await build(); dl(b,base()+' - ערוך.pdf'); P.dirty=false; var s=document.getElementById('pkpSaved'); if(s){ s.textContent='נשמר · '+new Date().toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}); s.className='pkw-saved'; } PK9.toast('הקובץ ירד למחשב — עם כל הסימונים, החתימות והשינויים בעמודים'); }catch(e){ console.error(e); PK9.toast('לא הצלחתי לבנות את הקובץ: '+e.message); } };
P.print=async function(){ try{ var b=await build(); var u=URL.createObjectURL(new Blob([b],{type:'application/pdf'})); var f=document.createElement('iframe'); f.style.cssText='position:fixed;width:0;height:0;border:0;left:-9999px'; f.src=u; document.body.appendChild(f); f.onload=function(){ try{f.contentWindow.print();}catch(e){ window.open(u); } }; }catch(e){ PK9.toast('לא הצלחתי להדפיס'); } };

/* ---------- פקודות ---------- */
P.cmd=async function(k){ var i=P.cur, pg=P.pages[i];
  if(['select','erase','hl','pen','rect','arrow','text','note','v','x','sig'].indexOf(k)>=0){ if(k==='sig'&&!LS.g('pk9_sig',null)){ sigPad(); return; } P.tool=k; P.sel=null; rib(); P.pages.forEach(function(_,j){drawAnn(j);}); if(k==='sig')PK9.toast('לוחצים על המקום בדף שבו החתימה תופיע'); return; }
  if(k==='stDate'||k==='stOk'||k==='stRev'||k==='stCopy'){ P.tool='st:'+{stDate:'date',stOk:'ok',stRev:'rev',stCopy:'copy'}[k]; rib(); PK9.toast('לוחצים על הדף כדי להטביע את החותמת'); return; }
  if(k==='undo'){ var u=P.undo.pop(); if(!u)return; var A=JSON.parse(u); P.pages.forEach(function(p,j){ p.ann=A[j]||[]; drawAnn(j); }); P.sel=null; dirty(); side(); return; }
  if(k==='sigNew'){ sigPad(); return; }
  if(!pg)return;
  if(k==='rotr'||k==='rotl'){ if(pg.ann.length&&!confirm('בסיבוב העמוד הסימונים עליו יימחקו. להמשיך?'))return; pg.rot=(pg.rot+(k==='rotr'?90:270))%360; pg.ann=[]; dirty(); await layout(); P.goto(i,true); return; }
  if(k==='del'){ if(P.pages.length<2){ PK9.toast('אי אפשר למחוק את העמוד היחיד'); return; } P.pages.splice(i,1); P.cur=Math.min(i,P.pages.length-1); dirty(); await layout(); P.goto(P.cur,true); PK9.toast('העמוד נמחק'); return; }
  if(k==='up'||k==='down'){ var j=k==='up'?i-1:i+1; if(j<0||j>=P.pages.length)return; var t=P.pages[i]; P.pages[i]=P.pages[j]; P.pages[j]=t; dirty(); await layout(); P.goto(j,true); return; }
  if(k==='blank'){ P.pages.splice(i+1,0,{d:-1,i:0,rot:0,ann:[],blank:true}); dirty(); await layout(); P.goto(i+1,true); return; }
  if(k==='merge'){ pickFile(async function(f){ var by=new Uint8Array(await f.arrayBuffer()); var n=await addDoc(by); for(var q=0;q<n.pages;q++)P.pages.push({d:n.d,i:q,rot:0,ann:[]}); dirty(); await layout(); P.goto(P.pages.length-n.pages,true); PK9.toast('צורפו '+n.pages+' עמודים מ"'+f.name+'"'); }); return; }
  if(k==='extract'){ try{ var b=await build(i); dl(b,base()+' - עמוד '+(i+1)+'.pdf'); }catch(e){ PK9.toast('לא הצלחתי לחלץ'); } return; }
  if(k==='find'){ P.sideSet('find'); return; }
  if(k==='toNote'){ toNote(); return; } if(k==='toBrain'){ toBrain(); return; } };

/* ---------- חתימה ---------- */
function sigPad(){ var d=document.getElementById('pkpSig'); if(!d){ d=document.createElement('div'); d.id='pkpSig'; document.getElementById('pkP').appendChild(d); }
  d.innerHTML='<div class="bg" onclick="this.parentNode.classList.remove(\'in\')"></div><div class="box"><div class="h"><b>החתימה שלך</b><span>חותמים עם העכבר, האצבע או העט</span></div><canvas width="1000" height="360"></canvas><div class="line">X</div><div class="a"><button class="pk9-btn ghost" id="pkpSigC">ניקוי</button><span style="flex:1"></span><button class="pk9-btn ghost" onclick="this.closest(\'#pkpSig\').classList.remove(\'in\')">ביטול</button><button class="pk9-btn" id="pkpSigS">שמירת החתימה</button></div></div>'; d.classList.add('in');
  var cv=d.querySelector('canvas'), g=cv.getContext('2d'), dn=false, any=false; g.lineWidth=5; g.lineCap='round'; g.lineJoin='round'; g.strokeStyle='#1E2A55';
  function xy(e){ var r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*cv.width,(e.clientY-r.top)/r.height*cv.height]; }
  cv.onpointerdown=function(e){ dn=true; any=true; var p=xy(e); g.beginPath(); g.moveTo(p[0],p[1]); cv.setPointerCapture(e.pointerId); }; cv.onpointermove=function(e){ if(!dn)return; var p=xy(e); g.lineTo(p[0],p[1]); g.stroke(); }; cv.onpointerup=function(){ dn=false; };
  d.querySelector('#pkpSigC').onclick=function(){ g.clearRect(0,0,cv.width,cv.height); any=false; };
  d.querySelector('#pkpSigS').onclick=function(){ if(!any)return; var D=g.getImageData(0,0,cv.width,cv.height).data, x0=cv.width,y0=cv.height,x1=0,y1=0; for(var y=0;y<cv.height;y+=2)for(var x=0;x<cv.width;x+=2){ if(D[(y*cv.width+x)*4+3]>10){ if(x<x0)x0=x; if(y<y0)y0=y; if(x>x1)x1=x; if(y>y1)y1=y; } }
    var w=x1-x0+20, h=y1-y0+20, c2=document.createElement('canvas'); c2.width=w; c2.height=h; c2.getContext('2d').drawImage(cv,x0-10,y0-10,w,h,0,0,w,h); LS.s('pk9_sig',c2.toDataURL('image/png')); d.classList.remove('in'); P.tab='sign'; P.tool='sig'; rib(); PK9.toast('החתימה נשמרה. לוחצים על המקום בדף כדי לחתום'); }; }
P.sigDemo=function(){ /* חתימה לדוגמה לצורך הדמו */ var c=document.createElement('canvas'); c.width=420; c.height=140; var g=c.getContext('2d'); g.strokeStyle='#1E2A55'; g.lineWidth=4; g.lineCap='round'; g.beginPath(); g.moveTo(20,100); g.bezierCurveTo(60,10,90,130,130,60); g.bezierCurveTo(160,20,170,110,210,80); g.bezierCurveTo(240,60,250,100,290,70); g.bezierCurveTo(320,50,350,90,400,40); g.stroke(); g.beginPath(); g.moveTo(40,120); g.lineTo(380,112); g.lineWidth=2; g.stroke(); LS.s('pk9_sig',c.toDataURL('image/png')); };

/* ---------- המרה ---------- */
async function allText(){ var out=[]; for(var i=0;i<P.pages.length;i++){ var t=(await pageText(P.pages[i])).trim(); out.push(t); } return out; }
async function toNote(){ var T=await allText(); var body='<h1>'+E(base())+'</h1><p class="pkw-meta">הומר מ-PDF · '+P.pages.length+' עמודים · '+new Date().toLocaleDateString('he-IL')+'</p>'+T.map(function(t,i){ if(!t)return ''; return '<h2>עמוד '+(i+1)+'</h2>'+t.split(/\n+/).filter(function(l){return l.trim();}).map(function(l){return '<p>'+E(l.trim())+'</p>';}).join(''); }).join('');
  var n={id:uid(),title:base(),subject:'crime',year:'',semester:'',body:body,tag:'#1E3A8A',pin:false,spacing:'1.9',updated:Date.now()}; try{ n.year=ACAD_YEARS[ACAD_YEARS.length-1]; n.semester=SEMESTERS[0]; }catch(e){} STATE.notes.unshift(n); STATE.nbEditing=n.id; try{persist();}catch(e){}
  P.close(true); pkHubTab('h6Notes','notebook'); setTimeout(function(){ PK9W.open(n.id,true); },200); PK9.toast('ה-PDF הפך למסמך עריכה במחברת'); }
async function toBrain(){ var T=(await allText()).join('\n\n'); if(T.replace(/\s/g,'').length<200){ PK9.toast('אין בקובץ מספיק טקסט (אולי זו סריקה)'); return; }
  var box=document.createElement('div'); box.style.display='none'; box.innerHTML='<input id="br6Name"><textarea id="br6Txt"></textarea><select id="br6Course"><option value="crime">crime</option></select>'; document.body.appendChild(box);
  box.querySelector('#br6Name').value=base(); box.querySelector('#br6Txt').value=T; P.close(true); pkHub('h6Brain'); setTimeout(function(){ try{ br6Paste(); }catch(e){} box.remove(); PK9.toast('המוח שלי בנה מה-PDF נושאים, מונחים ושאלות'); },150); }

/* ---------- פתיחה וסגירה ---------- */
async function addDoc(bytes){ var lib=await pdfjs(); var pdf=await lib.getDocument({data:bytes.slice()}).promise; P.docs.push({bytes:bytes,pdf:pdf}); return {d:P.docs.length-1,pages:pdf.numPages}; }
function pickFile(cb){ var f=document.createElement('input'); f.type='file'; f.accept='application/pdf,.pdf'; f.onchange=function(){ if(f.files[0])cb(f.files[0]); }; f.click(); }
P.pick=function(){ pickFile(function(f){ f.arrayBuffer().then(function(b){ P.open(new Uint8Array(b),f.name); }); }); };
P.open=async function(bytes,name){ if(P.dirty&&document.getElementById('pkP')&&!confirm('יש שינויים שלא נשמרו. לפתוח קובץ אחר?'))return;
  P.docs=[]; P.pages=[]; P.undo=[]; P.texts={}; P.sel=null; P.cur=0; P.dirty=false; P.name=name||'מסמך.pdf'; P.tool='select'; P.fr=''; P.q='';
  var o=document.getElementById('pkP'); if(!o){ o=document.createElement('div'); o.id='pkP'; document.body.appendChild(o); }
  o.className='pkw-like'+(window.innerWidth<900?' noside':''); o.innerHTML=shell(); document.body.classList.add('pkw-open'); rib(); requestAnimationFrame(function(){ o.classList.add('in'); });
  document.getElementById('pkpDesk').innerHTML='<div class="pkp-load">פותח את הקובץ…</div>';
  try{ var n=await addDoc(bytes); for(var q=0;q<n.pages;q++)P.pages.push({d:0,i:q,rot:0,ann:[]}); if(window.innerWidth<900){ await measure(P.pages[0]); var dk=document.getElementById('pkpDesk'); P.zoom=Math.max(.4,(dk.clientWidth-14)/P.pages[0].w); var zv=document.getElementById('pkpZv'); if(zv)zv.textContent=Math.round(P.zoom*100)+'%'; } else P.zoom=1.15; await layout(); }catch(e){ console.error(e); document.getElementById('pkpDesk').innerHTML='<div class="pkp-load">לא הצלחתי לפתוח את הקובץ. ודאו שזה PDF תקין.</div>'; } };
P.close=function(force){ if(!force&&P.dirty&&!confirm('יש שינויים שלא נשמרו בקובץ. לצאת בלי לשמור?'))return; var o=document.getElementById('pkP'); if(o){ o.classList.remove('in'); setTimeout(function(){o.remove();},250); } document.body.classList.remove('pkw-open'); if(io)io.disconnect(); P.dirty=false; };
P.sample=function(){ var s=document.getElementById('pk9-sample-pdf'); return s?b64bytes(s.textContent.trim()):null; };
P.demo=function(){ var b=P.sample(); if(!b){ P.pick(); return; } try{ pkHubTab('h6Notes','pdf'); }catch(e){} P.open(b,'חוק העונשין - פרק ה׳ ושאלת תרגול.pdf'); };

/* ---------- לשונית "עורך PDF" במחברת ---------- */
window.pk9PdfHome=function(){ return '<div class="view"><div class="pkp-home"><div class="pkp-drop" id="pkpDrop" onclick="PK9P.pick()"><div class="ic">'+sv('note2')+'</div><b>גוררים לכאן קובץ PDF — או לוחצים לבחירה</b><span>סיכום, פסק דין, מבחן קודם, חוזה. הקובץ נפתח אצלך בדפדפן ולא עולה לשום שרת.</span><button class="pk9-btn" onclick="event.stopPropagation();PK9P.pick()">בחירת קובץ</button><a onclick="event.stopPropagation();PK9P.demo()">או פתיחת קובץ לדוגמה ←</a></div>'
  +'<div class="pkp-feats">'+[['hl','מסמנים','מרקר בארבעה צבעים, עט, מסגרות וחצים'],['note','מעירים','הערות צמודות ותיבות טקסט בעברית'],['sig','חותמים','חתימה אישית וחותמות תאריך, "התקבל", "העתק נאמן"'],['thumbs','מסדרים עמודים','גוררים, מסובבים, מוחקים, מוסיפים עמוד ריק'],['merge','ממזגים ומחלצים','מצרפים כמה קבצים לאחד או שומרים עמוד בודד'],['brain','ממירים','ל-Word במחברת או למוח שלי — ושם נבנות שאלות']].map(function(f){return '<div><span>'+sv(f[0])+'</span><b>'+f[1]+'</b><em>'+f[2]+'</em></div>';}).join('')+'</div></div></div>'; };
PK9.hooks.push(function(){ try{ var H=window.PK6_HUBS; if(H&&H.h6Notes&&!H.h6Notes.tabs.some(function(t){return t[0]==='pdf';})){ H.h6Notes.tabs.splice(1,0,['pdf','עורך PDF','pk9PdfHome']); try{render();}catch(e){} } }catch(e){}
  var dz=document.getElementById('pkpDrop'); if(dz&&!dz.dataset.b){ dz.dataset.b=1; dz.ondragover=function(e){e.preventDefault();dz.classList.add('over');}; dz.ondragleave=function(){dz.classList.remove('over');}; dz.ondrop=function(e){ e.preventDefault(); dz.classList.remove('over'); var f=e.dataTransfer.files[0]; if(f&&/pdf$/i.test(f.name))f.arrayBuffer().then(function(b){P.open(new Uint8Array(b),f.name);}); }; } });
})();
