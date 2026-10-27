// מייצר שלוש חוברות PDF (סיכום / מרתון / שאלות) מ-HTML. שימוש:
// node render_html.js <blocks.json> <outDir> "<קורס>" "<קרדיט>" [fontsDir]
const fs=require('fs'),path=require('path'),cp=require('child_process');
const {chromium}=require('playwright');
const [,,BLK,OUT,COURSE,CREDIT,FONTS]=process.argv;
const FD=(FONTS||path.join(__dirname,'node_modules/@fontsource'))+'/';
const L=JSON.parse(fs.readFileSync(BLK,'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const LET=['א','ב','ג','ד','ה','ו'];
const txt=r=>r.map(x=>x.t).join('');
function short(rs,max){ if(txt(rs).replace(/\n/g,' ').length<=max)return rs; const out=[]; let n=0;
  for(const x of rs){ const t=x.t.replace(/\n/g,' '); if(n+t.length<=max){out.push({...x,t});n+=t.length;continue;}
    let cut=t.slice(0,max-n); const i=Math.max(cut.lastIndexOf('. '),cut.lastIndexOf('; '),cut.lastIndexOf(': ')); if(n+i>max*0.55)cut=cut.slice(0,i+1); else{cut=cut.replace(/\s+\S*$/,'')+'…';}
    out.push({...x,t:cut}); break; } return out; }
const runs=r=>r.map(x=>x.t==='\n'?'<br>':(x.b?`<b>${esc(x.t)}</b>`:esc(x.t))).join('');
const CSS=`
@font-face{font-family:A;font-weight:400;src:url(${FD}assistant/files/assistant-hebrew-400-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(${FD}assistant/files/assistant-hebrew-600-normal.woff2)}
@font-face{font-family:A;font-weight:700;src:url(${FD}assistant/files/assistant-hebrew-700-normal.woff2)}
@font-face{font-family:A;font-weight:800;src:url(${FD}assistant/files/assistant-hebrew-800-normal.woff2)}
*{box-sizing:border-box}
body{margin:0;font-family:A,sans-serif;color:#1F2430;direction:rtl}
p{font-size:10pt;line-height:1.62;margin:0 0 2.6mm;text-align:right}
b{font-weight:700;color:#4A1020}
.ch{background:linear-gradient(100deg,#5B1226,#7B1230);border:.8pt solid #B8913C;outline:1.2pt solid #5B1226;outline-offset:-3.2mm;border-radius:1.2mm;padding:5.2mm 7mm;margin:0 0 4mm;display:flex;align-items:center;gap:5mm;color:#fff;break-inside:avoid;break-after:avoid}
.ch .no{font-weight:700;font-size:10pt;letter-spacing:.1em;color:#E8D5A3;border:1pt solid #B8913C;border-radius:50%;width:11mm;height:11mm;display:flex;align-items:center;justify-content:center;flex:none}
.ch .tt{font-weight:800;font-size:19pt;line-height:1.1}.ch .sub{font-size:9pt;color:#E8D5A3;margin-top:1.4mm}
h2{font-weight:700;font-size:13.5pt;color:#5B1226;margin:6mm 0 2.4mm;display:flex;gap:2mm;align-items:baseline;padding-bottom:1.2mm;border-bottom:1.2pt solid #B8913C;break-after:avoid}
h2 .n{color:#B8913C}
h3{font-weight:700;font-size:11pt;color:#5B1226;margin:3.5mm 0 1.6mm;break-after:avoid}h3:before{content:'◆ ';color:#B8913C;font-size:8pt}
ul,ol{margin:0 0 2.6mm;padding:0 5mm 0 0;font-size:10pt;line-height:1.58}li{margin-bottom:1mm}ul ul,ol ul{margin:1mm 0}
.bx{border-radius:1.2mm;padding:2.4mm 4.5mm .8mm;margin:0 0 3mm;border:.7pt solid;break-inside:avoid}
.bx p{font-size:9.6pt;margin-bottom:1.8mm;line-height:1.58}.bx ul,.bx ol{font-size:9.6pt}
.lbl{font-size:8pt;font-weight:700;margin-bottom:.6mm}
.law{background:#FBF6EA;border-color:#E6D9B8;border-right:2.6pt solid #B8913C}.law .lbl{color:#8A6A1F}.law p{color:#3A3220}.law b{color:#6B4F10}
.key{background:#FBF3F4;border-color:#E6C9CE;border-right:2.6pt solid #7B1230}.key .lbl{color:#7B1230}
.tip{background:#FFF8E4;border-color:#EBDDB0;border-right:2.6pt solid #B8913C}.tip .lbl{color:#8A6A1F}.tip b{color:#6B4F10}
.warn{background:#FDF0F1;border-color:#F0CDD2;border-right:2.6pt solid #B0283F}.warn .lbl{color:#B0283F}.warn b{color:#B0283F}
table{width:100%;border-collapse:collapse;margin:1mm 0 3.5mm;font-size:9pt;border:.7pt solid #E6C9CE}
tr{break-inside:avoid}
th{background:#5B1226;color:#fff;font-weight:600;text-align:right;padding:1.8mm 3mm;border-bottom:1.6pt solid #B8913C}
td{padding:1.8mm 3mm;border-bottom:.6pt solid #EBDADD;vertical-align:top;line-height:1.5}
tr:nth-child(even) td{background:#FDFAFA}
td:first-child{font-weight:700;color:#5B1226;background:#FBF3F4!important}
.case{margin:0 0 3mm;border:.7pt solid #E6D9B8;border-radius:1.2mm;overflow:hidden;break-inside:avoid}
.case .hd{background:#5B1226;border-bottom:1.6pt solid #B8913C;color:#fff;padding:1.8mm 4mm;font-weight:700;font-size:10pt}.case .hd small{display:block;font-weight:400;color:#E8D5A3;font-size:8pt}
.case .rw{display:flex;border-top:.6pt solid #EBDDB0}.case .rw>div:first-child{width:18mm;flex:none;background:#FBF6EA;color:#8A6A1F;font-weight:700;font-size:8.5pt;padding:2mm 3mm}.case .rw>div:last-child{padding:2mm 3.5mm;font-size:9.4pt;line-height:1.55}
.q{display:flex;border:.7pt solid #E6C9CE;border-radius:1.4mm;overflow:hidden;margin:0 0 3.2mm;break-inside:avoid}
.q .num{width:11mm;flex:none;background:#5B1226;border-left:1.6pt solid #B8913C;color:#E8D5A3;font-weight:800;font-size:12pt;text-align:center;padding-top:2.4mm}
.q .bd{padding:2.4mm 4mm;flex:1}.q .qq{font-weight:700;font-size:10.2pt;line-height:1.5;margin-bottom:1.4mm;color:#2A1018}
.q .op{font-size:9.6pt;line-height:1.5;padding:.5mm 0;display:flex;gap:2mm}.q .op i{font-style:normal;font-weight:700;color:#B8913C;flex:none}
.ans{border-right:2.6pt solid #B8913C;background:#FBF6EA;border-radius:1.2mm;padding:2mm 4mm;margin:0 0 2.4mm;break-inside:avoid;font-size:9.4pt;line-height:1.55}.ans .t{font-weight:700;color:#5B1226}
.title2{font-weight:800;font-size:22pt;color:#5B1226;margin:0 0 1mm}.title3{font-size:10pt;color:#8A7F66;margin:0 0 5mm}
.pb{break-before:page}
.toc{margin-top:8mm}.toc .r{display:flex;align-items:center;gap:4mm;padding:2.6mm 4mm;border-bottom:.6pt solid #E6D9B8;font-size:11.5pt;font-weight:600;color:#3A1520}
.toc .r span{width:8mm;height:8mm;border-radius:50%;background:#5B1226;color:#E8D5A3;display:flex;align-items:center;justify-content:center;font-size:9.5pt;font-weight:700;border:1pt solid #B8913C}
body.cmp p{font-size:9.4pt;line-height:1.52;margin-bottom:1.7mm}body.cmp ul,body.cmp ol{font-size:9.4pt;line-height:1.48;margin-bottom:1.7mm}body.cmp .bx p{font-size:9.2pt}body.cmp h2{font-size:11.5pt;margin:3.2mm 0 1.4mm}body.cmp h3{font-size:9.6pt;margin:2mm 0 1mm}body.cmp table{font-size:8pt;margin-bottom:2mm}body.cmp td,body.cmp th{padding:1.1mm 2.4mm}body.cmp .ch{padding:3.2mm 6mm;margin-top:4mm}body.cmp .ch .tt{font-size:15pt}body.cmp .bx{padding:1.4mm 3.5mm .2mm;margin-bottom:1.8mm}body.cmp .case{margin-bottom:1.8mm}
`;
const html=(body,cls='')=>`<!doctype html><html lang=he dir=rtl><meta charset=utf-8><style>${CSS}</style><body class="${cls}">${body}</body></html>`;
const BL={law:'§ לשון החוק',warn:'! שים לב',key:'✦ הגדרה',tip:'★ טיפ למבחן'};
function list(b,cap){ let items=b.items.filter(i=>cap?i.lvl===0:true); if(cap)items=items.slice(0,cap.n); const tag=b.k==='ol'?'ol':'ul'; return `<${tag}>${items.map(i=>`<li style="${i.lvl?'margin-right:5mm;list-style:circle':''}">${runs(cap?short(i.r,cap.max):i.r)}</li>`).join('')}</${tag}>`; }
function inner(blocks,cap){ return blocks.map(x=>x.k==='p'?`<p>${runs(cap?short(x.r,cap):x.r)}</p>`:(x.k==='ul'||x.k==='ol')?list(x):'').join(''); }
function tbl(rows){ return `<table>${rows.map(r=>`<tr>${r.c.map(c=>`<${r.h?'th':'td'}>${runs(c)}</${r.h?'th':'td'}>`).join('')}</tr>`).join('')}</table>`; }
function chap(l,sub){ return `<div class=ch><div class=no>${String(l.n).padStart(2,'0')}</div><div><div class=tt>${esc(l.title)}</div>${sub?`<div class=sub>${sub}</div>`:''}</div></div>`; }
function h2(r){ const t=txt(r); const m=t.match(/^(\d+)\.\s*(.*)$/); return `<h2>${m?`<span class=n>${m[1]}</span>`:''}${esc(m?m[2]:t)}</h2>`; }
function tree(t){ if(!t||!t.options)return ''; return `<h3>מפת החלטה: ${esc(t.q)}</h3>`+tbl([{h:true,c:[[{t:'אם...'}],[{t:'התוצאה'}],[{t:'הערה'}]]},...t.options.map(o=>({h:false,c:[[{t:o.label}],[{t:o.child.result,b:true}],[{t:o.child.note||''}]]}))]); }
function caseCard(c){ return `<div class=case><div class=hd>${esc(c.name)}${c.tag?`<small>${esc(c.tag)}</small>`:''}</div>${c.bg&&c.bg.length?`<div class=rw><div>הרקע</div><div>${runs(c.bg)}</div></div>`:''}${c.hold&&c.hold.length?`<div class=rw><div>${c.note?'עיקר':'ההלכה'}</div><div>${runs(c.hold)}</div></div>`:''}</div>`; }
function summaryBody(){ let o=''; L.forEach((l,i)=>{ o+=`<div class="${i?'pb':''}">${chap(l,'פרק '+l.n)}`;
  if(l.keypts.length)o+=`<div class="bx key"><div class=lbl>במבט על · נקודות מפתח</div>${list({k:'ul',items:l.keypts.map(k=>({lvl:0,r:k.r||k}))})}</div>`;
  for(const b of l.full){ if(b.k==='h')o+=h2(b.r); else if(b.k==='sub')o+=`<h3>${runs(b.r)}</h3>`; else if(b.k==='p')o+=`<p>${runs(b.r)}</p>`; else if(b.k==='ul'||b.k==='ol')o+=list(b); else if(b.k==='table')o+=tbl(b.rows); else if(b.k==='box')o+=`<div class="bx ${b.kind}"><div class=lbl>${BL[b.kind]||''}</div>${inner(b.blocks)}</div>`; }
  if(l.cases.length)o+=`<h2><span class=n>⚖</span>פסקי דין וסעיפים מרכזיים</h2>`+l.cases.map(caseCard).join('');
  o+=tree(l.tree)+'</div>'; }); return o; }
function marathonBody(){ let o=''; L.forEach((l,i)=>{ o+=chap(l,'פרק '+l.n);
  if(l.keypts.length)o+=`<div class="bx tip"><div class=lbl>★ חייבים לזכור</div>${list({k:'ul',items:l.keypts.map(k=>({lvl:0,r:k.r||k}))})}</div>`;
  let skip=false; for(const b of l.full){ if(b.k==='h'){ skip=/דוגמה מעשית|דוגמה לניתוח/.test(txt(b.r)); if(!skip)o+=h2(b.r); continue; } if(skip)continue;
    if(b.k==='sub')o+=`<h3>${runs(b.r)}</h3>`; else if(b.k==='p'){ if(b.r.some(r=>r.b))o+=`<p>${runs(short(b.r,170))}</p>`; } else if(b.k==='ul'||b.k==='ol')o+=list(b,{n:5,max:150}); else if(b.k==='table')o+=tbl(b.rows);
    else if(b.k==='box'&&b.kind!=='law')o+=`<div class="bx ${b.kind}"><div class=lbl>${BL[b.kind]||''}</div>${inner(b.blocks,170)}</div>`; }
  const cs=l.cases.filter(c=>!c.note); if(cs.length)o+=`<h2><span class=n>⚖</span>שרשרת פסיקה</h2>`+tbl([{h:true,c:[[{t:'פסק דין · נושא'}],[{t:'ההלכה'}]]},...cs.map(c=>({h:false,c:[[{t:c.name,b:true},{t:'\n'+(c.tag||'')}],short(c.hold,150)]}))]); }); return o; }
function questionsBody(){ let o='',n=0; const ans=[],open=[];
  L.forEach((l,i)=>{ o+=`<div style="margin-top:${i?'5mm':'0'}">${chap(l,'שאלות')}`; for(const q of l.quiz){ if(q.type==='open'){open.push({l,q});continue;} n++; ans.push({n,l,q});
    o+=`<div class=q><div class=num>${n}</div><div class=bd><div class=qq>${esc(q.q)}</div>${q.options.map((t,k)=>`<div class=op><i>${LET[k]}.</i><span>${esc(t)}</span></div>`).join('')}</div></div>`; } o+='</div>'; });
  o+=`<div class=pb><div class=title2>תשובות והסברים</div><div class=title3>התשובה הנכונה והנימוק לכל שאלה</div>`; let last=-1;
  for(const x of ans){ if(x.l.n!==last){last=x.l.n; o+=`<h2><span class=n>${String(x.l.n).padStart(2,'0')}</span>${esc(x.l.title)}</h2>`;}
    o+=`<div class=ans><span class=t>שאלה ${x.n} · ${LET[x.q.correct]}. ${esc(x.q.options[x.q.correct])}</span><br>${esc(x.q.explain||'')}</div>`; } o+='</div>';
  if(open.length){ o+=`<div class=pb><div class=title2>שאלות פתוחות לתרגול</div><div class=title3>נסו לענות לפני שאתם קוראים את התשובה המנחה</div>`+open.map((x,i)=>`<p style="margin-top:4mm"><b>${i+1}. ${esc(x.q.q)}</b></p><div class="bx key"><div class=lbl>תשובה מנחה</div><p>${esc(x.q.rubric||'')}</p></div>`).join('')+'</div>'; }
  return {o,total:n}; }
function cover(tag,title2,desc,meta){ return `<style>@page{size:A4;margin:0}</style><div style="width:210mm;height:297mm;background:#FFFEFB;padding:16mm;direction:rtl"><div style="height:100%;background:linear-gradient(160deg,#5B1226,#3F0B1A);border:1.4pt solid #B8913C;outline:1.2pt solid #5B1226;outline-offset:-5mm;border-radius:2mm;padding:26mm 18mm;display:flex;flex-direction:column;color:#fff;position:relative">
<div style="color:#E8D5A3;font-size:11pt;font-weight:600;letter-spacing:.12em">${esc(tag)}</div><div style="width:34mm;height:1.6pt;background:#B8913C;margin:6mm 0"></div>
<div style="font-weight:800;font-size:46pt;line-height:1.05">${esc(COURSE)}</div><div style="font-weight:700;font-size:21pt;color:#E8D5A3;margin-top:4mm">${esc(title2)}</div>
<div style="font-size:12pt;line-height:1.7;color:#F3E6C8;margin-top:12mm;max-width:130mm">${esc(desc)}</div><div style="font-size:11pt;color:#E8D5A3;margin-top:8mm">${esc(meta)}</div>
<div style="margin-top:auto;border-top:1pt solid #B8913C;padding-top:5mm;display:flex;justify-content:space-between;align-items:flex-end"><div><div style="font-size:9pt;color:#E8D5A3">הוכן ונערך ע״י</div><div style="font-size:19pt;font-weight:800">${esc(CREDIT.replace('הוכן ע״י ',''))}</div></div><div style="font-size:30pt;color:#B8913C">§</div></div></div></div>`; }
function tocPage(sub){ return `<div class=title2>תוכן עניינים</div><div class=title3>${sub}</div><div class=toc>${L.map(l=>`<div class=r><span>${l.n}</span>${esc(l.title)}</div>`).join('')}</div>`; }
(async()=>{ fs.mkdirSync(OUT,{recursive:true}); const b=await chromium.launch(); const pg=await b.newPage();
  const render=async(file,body,cls,label,coverHtml)=>{ const tmp=OUT+'/_'+file;
    const go=async(h,pdf,opt)=>{ fs.writeFileSync(tmp+'.html',h); await pg.goto('file://'+path.resolve(tmp+'.html')); await pg.evaluate(()=>document.fonts.ready); await pg.pdf({path:pdf,format:'A4',printBackground:true,...opt}); };
    await go(html(coverHtml),tmp+'_cover.pdf',{margin:{top:0,bottom:0,left:0,right:0}});
    const hf=`<div style="font-family:DejaVu Sans,sans-serif;font-size:7px;color:#A39266;width:100%;padding:0 17mm;direction:rtl;display:flex;justify-content:space-between;border-bottom:.5px solid #E6D9B8;padding-bottom:6px;margin-top:6mm"><span>${esc(COURSE)} · ${label}</span><span>◆</span></div>`;
    const ft=`<div style="font-family:DejaVu Sans,sans-serif;font-size:7px;color:#A39266;width:100%;padding:0 17mm;direction:rtl;display:flex;justify-content:space-between"><span>${esc(CREDIT)}</span><span>עמוד <span class="pageNumber"></span></span></div>`;
    await go(html(body,cls),tmp+'_body.pdf',{displayHeaderFooter:true,headerTemplate:hf,footerTemplate:ft,margin:{top:'18mm',bottom:'16mm',left:'17mm',right:'17mm'}});
    cp.execSync(`pdfunite "${tmp}_cover.pdf" "${tmp}_body.pdf" "${OUT}/${file}.pdf"`); const pages=cp.execSync(`pdfinfo "${OUT}/${file}.pdf" | grep Pages`).toString().trim(); console.log(file,pages); };
  const q=questionsBody();
  await render('summary',tocPage('סיכום מקיף של כל חומר הקורס')+`<div class=pb></div>`+summaryBody(),'', 'הסיכום המקיף',cover('חוברת 1 · סיכום מלא','הסיכום המקיף','כל חומר הקורס במקום אחד — מסודר, מוסבר לעומק, עם פסקי דין, סעיפי חוק, טבלאות השוואה וטיפים למבחן.',L.length+' פרקים'));
  await render('marathon',tocPage('סקירה מוסברת לפני מבחן')+`<div style="height:6mm"></div>`+marathonBody(),'cmp','מרתון למבחן',cover('חוברת 2 · מרתון','מרתון למבחן','כל החומר בתמצית מוסברת: ההסבר, הכלל, הדוגמה והפסיקה — בנקודות, בטבלאות, ובמה שחשוב לזכור לפני שנכנסים לבחינה.',L.length+' פרקים'));
  await render('questions',q.o,'', 'שאלות אמריקאיות',cover('חוברת 3 · תרגול','שאלות אמריקאיות פתורות','שאלות בסגנון מבחן מתחילת החומר ועד סופו, עם פתרון והסבר מלא לכל שאלה.','סה״כ '+q.total+' שאלות פתורות'));
  await b.close(); })();
