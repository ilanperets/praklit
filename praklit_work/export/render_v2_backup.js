// בונה סיכום / מרתון / שאלות אמריקאיות (Word) מתוך בלוקים שחולצו מהקורס
const fs=require('fs');
const D=require('docx');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,Header,Footer,PageNumber,PageBreak,LevelFormat,VerticalAlign,TableLayoutType}=D;
const FONT='Arial', W=10206; // רוחב תוכן (A4, שוליים 1.5ס"מ)
const PAL=['0B7FA0','1E4FA3','3949AB','B5304A','9A6B00','2E7D4F','6B3FA0','9C2F7E','0F7C7A','55741A','B83227','2C3E70','1E3A8A','7A4B12','0F766E'];
const KIND={law:{c:'7B4FD0',bg:'F4EFFF',bd:'C3B2D9',l:'§  לשון החוק'},warn:{c:'D64545',bg:'FDEEEE',bd:'E1ACB6',l:'!  שים לב'},key:{c:'2F6FD6',bg:'EEF4FF',bd:'A5B8DA',l:'✦  הגדרה'},tip:{c:'D99400',bg:'FFF7E3',bd:'D6C399',l:'★  טיפ למבחן'},case:{c:'23935A',bg:'EBF8F0',bd:'ABCBB8',l:'⚖  פסק דין'},ex:{c:'0F7C7A',bg:'E7F6F6',bd:'9FCAC9',l:'✎  דוגמה'}};
const INK='1F2430'; let COMPACT=false;
const none={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
const thin=(c='D9DEE8')=>({style:BorderStyle.SINGLE,size:4,color:c});
// ---------- טקסט ----------
function tr(r,o={}){ if(r.t==='\n')return new TextRun({break:1});
  return new TextRun({text:r.t,font:FONT,rightToLeft:true,size:o.size||20,bold:o.bold||r.b||false,italics:r.i||false,color:o.color||INK,highlight:(o.hl&&r.b)?'yellow':undefined}); }
function P(rs,o={}){ const ch=(typeof rs==='string'?[{t:rs}]:rs).map(r=>tr(r,o));
  return new Paragraph({children:ch,bidirectional:true,alignment:o.align,spacing:{before:o.before||0,after:o.after===undefined?80:o.after,line:o.line||276},keepNext:o.keepNext,keepLines:o.keepLines,indent:o.indent,border:o.border,shading:o.shading,pageBreakBefore:o.pageBreakBefore}); }
function txt(rs){return (rs||[]).map(r=>r.t).join('');}
function short(rs,max){ const s=txt(rs).replace(/\n/g,' '); if(s.length<=max)return rs;
  const w=s.slice(0,max); let k=-1; for(const m of w.matchAll(/[.!?;:](?=\s|$)|\)\s/g)){ k=m.index+1; } 
  let cutLen; if(k>max*0.45)cutLen=k; else { const sp=w.lastIndexOf(' '); cutLen=sp>0?sp:max; }
  let out=[],left=cutLen; for(const r of rs){ if(left<=0)break; const tt=r.t.slice(0,left); out.push({...r,t:tt}); left-=tt.length; }
  if(k<=max*0.45&&out.length)out[out.length-1].t+='…'; return out; }
// ---------- רשימות ----------
let olInst=0;
const NUM={config:[{reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.START,style:{paragraph:{indent:{left:540,hanging:270}}}},{level:1,format:LevelFormat.BULLET,text:'–',alignment:AlignmentType.START,style:{paragraph:{indent:{left:1000,hanging:270}}}}]},
 {reference:'dec',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.START,style:{paragraph:{indent:{left:540,hanging:360}}}},{level:1,format:LevelFormat.DECIMAL,text:'%2.',alignment:AlignmentType.START,style:{paragraph:{indent:{left:1000,hanging:360}}}}]}]};
function listParas(items,ordered,o={}){ const inst=++olInst; return items.map(it=>new Paragraph({children:it.r.map(r=>tr(r,o)),bidirectional:true,numbering:{reference:ordered?'dec':'bul',level:Math.min(it.lvl||0,1),instance:ordered?inst:undefined},spacing:{after:50,line:o.line||264}})); }
// ---------- טבלאות ----------
function cell(children,w,o={}){ return new TableCell({children,width:{size:w,type:WidthType.DXA},shading:o.fill?{type:ShadingType.CLEAR,fill:o.fill,color:'auto'}:undefined,borders:o.borders||{top:thin(),bottom:thin(),left:thin(),right:thin()},margins:o.margins||{top:50,bottom:50,left:90,right:90},verticalAlign:o.va||VerticalAlign.TOP,columnSpan:o.span}); }
function dataTable(rows,color,o={}){ const n=Math.max(...rows.map(r=>r.c.length)); const base=Math.floor(W/n); const cw=Array(n).fill(base); cw[n-1]+=W-base*n;
  const trs=rows.map((r,ri)=>new TableRow({cantSplit:true,tableHeader:r.h,children:cw.map((w,ci)=>{ const c=r.c[ci]||[]; return cell([P(c,{size:o.size||18,color:r.h?'FFFFFF':undefined,bold:r.h||(ci===0&&!!o.firstBold),after:0,line:o.tline||250,hl:o.hl&&!r.h})],w,{fill:r.h?color:(ci===0?'EEF1F8':(ri%2?'F7F8FC':'FFFFFF'))}); })}));
  return new Table({width:{size:W,type:WidthType.DXA},columnWidths:cw,visuallyRightToLeft:true,rows:trs}); }
function gap(h=100){return new Paragraph({spacing:{after:h},children:[]});}
// ---------- תיבות ----------
function box(kind,inner,o={}){ const k=KIND[kind]; const kids=[P([{t:o.label||k.l}],{size:16,bold:true,color:k.c,after:40,keepNext:true}),...inner];
  return new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],visuallyRightToLeft:true,rows:[new TableRow({cantSplit:o.cant!==false,children:[new TableCell({children:kids,width:{size:W,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:k.bg,color:'auto'},borders:{top:thin(k.bd),bottom:thin(k.bd),left:thin(k.bd),right:{style:BorderStyle.SINGLE,size:32,color:k.c}},margins:{top:COMPACT?55:90,bottom:COMPACT?55:90,left:150,right:170}})]})]}); }
function boxBlocks(blocks,o){ const out=[]; for(const b of blocks){ if(b.k==='p')out.push(P(b.r,{size:o.size||19,after:50,hl:o.hl})); else if(b.k==='ul'||b.k==='ol')out.push(...listParas(b.items,b.k==='ol',{size:o.size||19,hl:o.hl})); else if(b.k==='sub')out.push(P(b.r,{size:19,bold:true,after:40})); } return out.length?out:[P('',{})]; }
// ---------- כריכה / כותרות ----------
function cover(color,series,title,sub,desc,meta,credit){ 
  const big=new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],visuallyRightToLeft:true,rows:[new TableRow({height:{value:5200,rule:D.HeightRule.ATLEAST},children:[new TableCell({width:{size:W,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:color,color:'auto'},borders:{top:none,bottom:none,left:none,right:none},verticalAlign:VerticalAlign.CENTER,margins:{top:300,bottom:300,left:500,right:500},children:[
    P(series,{size:20,bold:true,color:'F3E3B0',after:200}),P(title,{size:76,bold:true,color:'FFFFFF',before:240,after:80,line:400}),P(sub,{size:44,bold:true,color:'F6DE9B',before:60,after:260,line:340}),P(desc,{size:22,color:'EEF2FF',after:200,line:320}),P(meta,{size:19,color:'D9E3FF',after:0})]})]})]});
  const cr=new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],visuallyRightToLeft:true,rows:[new TableRow({children:[new TableCell({width:{size:W,type:WidthType.DXA},borders:{top:thin(color),bottom:thin(color),left:thin(color),right:thin(color)},margins:{top:140,bottom:140,left:300,right:300},children:[P(credit[0],{size:17,color:'6B7280',after:20}),P(credit[1],{size:40,bold:true,color:color,after:0})]})]})]});
  return [new Paragraph({spacing:{before:1500},children:[]}),big,gap(500),cr]; }
function banner(n,title,color,first){ return [new Paragraph({pageBreakBefore:!first,spacing:{after:0},children:[]}),new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],visuallyRightToLeft:true,rows:[new TableRow({children:[new TableCell({width:{size:W,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:color,color:'auto'},borders:{top:none,bottom:{style:BorderStyle.SINGLE,size:24,color:'F1D78E'},left:none,right:none},margins:{top:150,bottom:150,left:300,right:300},children:[P('פרק '+n,{size:18,bold:true,color:'F6E7B8',after:20,keepNext:true}),P(title,{size:38,bold:true,color:'FFFFFF',after:0,keepNext:true})]})]})]}),gap(120)]; }
function secHead(rs,color){ return P(rs,{size:25,bold:true,color,before:COMPACT?120:220,after:COMPACT?60:110,keepNext:true,indent:{right:140},border:{right:{style:BorderStyle.SINGLE,size:36,color,space:8},bottom:{style:BorderStyle.SINGLE,size:4,color:'D9DEE8',space:3}}}); }
function subHead(rs,color){ return P(rs,{size:21,bold:true,color,before:COMPACT?70:140,after:COMPACT?40:70,keepNext:true,indent:{right:140},border:{right:{style:BorderStyle.SINGLE,size:16,color:'C9D2E6',space:8}}}); }
function toc(chapters,sub){ const rows=chapters.map(c=>new TableRow({cantSplit:true,children:[cell([P(c.title,{size:22,bold:true,after:0})],W-640,{fill:'F6F8FB',borders:{top:none,bottom:{style:BorderStyle.SINGLE,size:6,color:'FFFFFF'},left:none,right:none},margins:{top:110,bottom:110,left:160,right:160},va:VerticalAlign.CENTER}),cell([P(String(c.n),{size:22,bold:true,color:'FFFFFF',align:AlignmentType.CENTER,after:0})],640,{fill:PAL[(c.n-1)%PAL.length],borders:{top:none,bottom:{style:BorderStyle.SINGLE,size:6,color:'FFFFFF'},left:none,right:none},va:VerticalAlign.CENTER})]}));
  return [P('תוכן העניינים',{size:44,bold:true,after:60}),P(sub,{size:20,color:'6B7280',after:260}),new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W-640,640],visuallyRightToLeft:true,rows})]; }
function hdr(color,label){ return new Header({children:[new Paragraph({bidirectional:true,alignment:AlignmentType.START,spacing:{after:80},border:{bottom:{style:BorderStyle.SINGLE,size:12,color,space:3}},children:[new TextRun({text:label,font:FONT,size:15,color:'9CA3AF',rightToLeft:true})]})]}); }
function ftr(color,credit){ return new Footer({children:[new Paragraph({bidirectional:true,alignment:AlignmentType.CENTER,children:[new TextRun({text:credit+'  ·  עמוד ',font:FONT,size:15,color:'6B7280',rightToLeft:true}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:15,color:color,bold:true})]})]}); }
function doc(children,color,label,credit){ return new Document({creator:'פרקליט',title:label,numbering:NUM,styles:{default:{document:{run:{font:FONT,size:20}}}},sections:[{properties:{titlePage:true,page:{size:{width:11906,height:16838},margin:{top:907,bottom:907,left:850,right:850,header:397,footer:397}}},headers:{default:hdr(color,label),first:new Header({children:[new Paragraph({children:[]})]})},footers:{default:ftr(color,credit),first:new Footer({children:[new Paragraph({children:[]})]})},children}]}); }
// ---------- קלט ----------
const a=process.argv; const data=JSON.parse(fs.readFileSync(a[2],'utf8')); const outDir=a[3]; const course=a[4]||'דיני ראיות'; const credit=a[5]||'הוכן ע״י אילן פרץ';
const sel=(a[6]?a[6].split(',').map(Number):data.map(l=>l.n)); const L=data.filter(l=>sel.includes(l.n));
const totalMc=L.reduce((s,l)=>s+l.quiz.filter(q=>q.type==='mc').length,0);
const LET=['א','ב','ג','ד','ה','ו'];
// ================= סיכום מקיף =================
function treeTable(t,color){ if(!t||!t.options)return []; const rows=[{h:true,c:[[{t:'אם...'}],[{t:'התוצאה'}],[{t:'הערה'}]]}]; for(const o of t.options)rows.push({h:false,c:[[{t:o.label}],[{t:o.child.result,b:true}],[{t:o.child.note||''}]]});
  return [subHead([{t:'מפת החלטה: '+t.q}],color),dataTable(rows,color,{size:18}),gap(80)]; }
function caseCard(c){ const kids=[P([{t:c.name,b:true}],{size:20,color:'1D6E45',after:20,keepNext:true})]; if(c.tag)kids.push(P([{t:c.tag}],{size:16,color:'6B7280',after:50,keepNext:true}));
  if(c.bg&&c.bg.length)kids.push(P([{t:'הרקע: ',b:true},...c.bg],{size:18,after:40,line:260}));
  if(c.hold&&c.hold.length)kids.push(P([{t:(c.note?'עיקר: ':'ההלכה: '),b:true},...c.hold],{size:18,after:0,line:260}));
  return [box('case',kids,{label:c.note?'מקור':'פסק דין',cant:true}),gap(70)]; }
function buildSummary(){ const ch=[]; ch.push(...cover('1E3A8A','חוברת 1 · סיכום מלא',course,'הסיכום המקיף','כל חומר הקורס במקום אחד — מסודר, מוסבר לעומק, עם פסקי דין, סעיפי חוק, טבלאות השוואה וטיפים למבחן.',L.length+' פרקים',[ 'הוכן ונערך ע״י',credit.replace('הוכן ע״י ','')])); 
  ch.push(new Paragraph({pageBreakBefore:true,children:[]})); ch.push(...toc(L,'סיכום מקיף של כל חומר הקורס, פרק אחר פרק'));
  ch.push(gap(200)); ch.push(P([{t:'מקרא התיבות הצבעוניות:  '}],{size:17,bold:true,after:60})); 
  ch.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:Array(4).fill(W/4),visuallyRightToLeft:true,rows:[new TableRow({children:['law','warn','key','tip'].map(k=>cell([P([{t:KIND[k].l}],{size:17,bold:true,color:KIND[k].c,align:AlignmentType.CENTER,after:0})],W/4,{fill:KIND[k].bg,borders:{top:thin(KIND[k].c),bottom:thin(KIND[k].c),left:thin(KIND[k].c),right:thin(KIND[k].c)}}))})]}));
  L.forEach((l,i)=>{ const color=PAL[(l.n-1)%PAL.length]; ch.push(...banner(l.n,l.title,color,false));
    if(l.keypts.length)ch.push(box('key',listParas(l.keypts,false,{size:19}),{label:'במבט על — נקודות מפתח'}),gap(100));
    for(const b of l.full){ if(b.k==='h')ch.push(secHead(b.r,color)); else if(b.k==='sub')ch.push(subHead(b.r,color)); else if(b.k==='p')ch.push(P(b.r,{size:19,after:100,line:300}));
      else if(b.k==='ul'||b.k==='ol')ch.push(...listParas(b.items,b.k==='ol',{size:19,line:290})),ch.push(gap(50));
      else if(b.k==='table')ch.push(gap(30),dataTable(b.rows,color),gap(110));
      else if(b.k==='box')ch.push(box(b.kind,boxBlocks(b.blocks,{size:19})),gap(100)); }
    if(l.cases.length){ ch.push(secHead([{t:'פסקי דין וסעיפים מרכזיים'}],'2E7D4F')); l.cases.forEach(c=>ch.push(...caseCard(c))); }
    ch.push(...treeTable(l.tree,color)); });
  return doc(ch,'1E3A8A',course+' · הסיכום המקיף',credit); }
// ================= מרתון =================
function buildMarathon(){ COMPACT=true; const C='B5304A'; const ch=[]; const SZ=16, LN=238; ch.push(...cover(C,'חוברת 2 · מרתון',course,'מרתון למבחן','כל החומר בתמצית מוסברת: ההסבר, הכלל, הדוגמה והפסיקה — בטבלאות, שרשראות פסיקה ועצי החלטה.',L.length+' פרקים',['הוכן ונערך ע״י',credit.replace('הוכן ע״י ','')]));
  ch.push(new Paragraph({pageBreakBefore:true,children:[]})); ch.push(...toc(L,'סקירה מוסברת לפני מבחן')); ch.push(gap(160));
  L.forEach((l,li)=>{ const color=PAL[(l.n-1)%PAL.length]; const bn=banner(l.n,l.title,color,true); bn[0]=gap(li?160:0); ch.push(...bn);
    if(l.keypts.length)ch.push(box('tip',listParas(l.keypts,false,{size:SZ,line:LN}),{label:'★  חייבים לזכור'}),gap(30));
    let skip=false; for(const b of l.full){ if(b.k==='h'){ skip=/דוגמה מעשית|דוגמה לניתוח/.test(txt(b.r)); if(!skip)ch.push(secHead(b.r,color)); continue; } if(skip)continue; if(b.k==='sub')ch.push(subHead(b.r,color));
      else if(b.k==='p'){ if(b.r.some(r=>r.b))ch.push(P(short(b.r,190),{size:SZ,after:40,line:LN,hl:true})); }
      else if(b.k==='ul'||b.k==='ol')ch.push(...listParas(b.items.filter(i=>i.lvl===0).map(i=>({r:short(i.r,185),lvl:0})),b.k==='ol',{size:SZ,hl:true,line:LN})),ch.push(gap(20));
      else if(b.k==='table')ch.push(gap(20),dataTable(b.rows,color,{size:14,hl:true,tline:225,firstBold:true}),gap(40));
      else if(b.k==='box'){ if(b.kind==='law'){ /* הציטוט המלא בסיכום */ } else ch.push(box(b.kind,boxBlocks(b.blocks.map(x=>x.k==='p'?{...x,r:short(x.r,200)}:x),{size:SZ,hl:true}),{}),gap(30)); } }
    const cs=l.cases.filter(c=>!c.note); if(cs.length){ ch.push(secHead([{t:'שרשרת פסיקה — טבלת הלכות'}],'23935A')); const rows=[{h:true,c:[[{t:'פסק דין · נושא'}],[{t:'ההלכה'}]]}]; cs.forEach(c=>rows.push({h:false,c:[[{t:c.name,b:true},{t:'\n'+c.tag}],[...short(c.hold,175)]]})); const cw=[3200,7006]; ch.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:cw,visuallyRightToLeft:true,rows:rows.map((r,ri)=>new TableRow({cantSplit:true,tableHeader:r.h,children:cw.map((w,ci)=>cell([P(r.c[ci],{size:15,color:r.h?'FFFFFF':undefined,bold:r.h,after:0,line:235})],w,{fill:r.h?'23935A':(ri%2?'F3FAF6':'FFFFFF')}))}))}),gap(40)); }
    });
  COMPACT=false; return doc(ch,C,course+' · מרתון למבחן',credit); }
// ================= שאלות אמריקאיות =================
function buildQuestions(){ const C='0F766E'; const ch=[]; ch.push(...cover(C,'חוברת 3 · תרגול',course,'שאלות אמריקאיות פתורות','שאלות בסגנון מבחן מתחילת החומר ועד סופו, עם פתרון והסבר מלא לכל שאלה.','סה״כ '+totalMc+' שאלות פתורות',['הוכן ונערך ע״י',credit.replace('הוכן ע״י ','')]));
  let n=0; const answers=[]; const open=[];
  L.forEach((l,i)=>{ const color=PAL[(l.n-1)%PAL.length]; ch.push(...banner(l.n,l.title,color,i===0&&false));
    for(const q of l.quiz){ if(q.type==='open'){ open.push({l,q}); continue; } n++; const num=n;
      const content=[P([{t:q.q,b:true}],{size:20,after:70,keepNext:true,line:270}),...q.options.map((o,oi)=>P([{t:LET[oi]+'. ',b:true},{t:o}],{size:19,after:30,keepNext:oi<q.options.length-1,indent:{right:200},line:260}))];
      ch.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W-620,620],visuallyRightToLeft:true,rows:[new TableRow({cantSplit:true,children:[cell(content,W-620,{borders:{top:thin('C7D2E6'),bottom:thin('C7D2E6'),left:thin('C7D2E6'),right:none},margins:{top:80,bottom:70,left:140,right:140}}),cell([P(String(num),{size:22,bold:true,color:'FFFFFF',align:AlignmentType.CENTER,after:0})],620,{fill:color,borders:{top:thin(color),bottom:thin(color),left:none,right:thin(color)},va:VerticalAlign.TOP,margins:{top:90,bottom:60,left:40,right:40}})]})]}),gap(80));
      answers.push({num,l,q}); } });
  ch.push(new Paragraph({pageBreakBefore:true,children:[]})); ch.push(P('תשובות והסברים',{size:44,bold:true,color:C,after:60})); ch.push(P('התשובה הנכונה והנימוק לכל שאלה',{size:20,color:'6B7280',after:200}));
  let last=-1; for(const x of answers){ if(x.l.n!==last){ last=x.l.n; ch.push(secHead([{t:'פרק '+x.l.n+' · '+x.l.title}],PAL[(x.l.n-1)%PAL.length])); }
    ch.push(box('case',[P([{t:'שאלה '+x.num+' — התשובה הנכונה: ',b:true},{t:LET[x.q.correct],b:true,},{t:'  '+x.q.options[x.q.correct]}],{size:18,color:'1D6E45',after:30,keepNext:true,line:250}),P(x.q.explain||'',{size:18,after:0,line:255})],{label:' '}),gap(40)); }
  if(open.length){ ch.push(new Paragraph({pageBreakBefore:true,children:[]})); ch.push(P('שאלות פתוחות לתרגול',{size:44,bold:true,color:C,after:60})); ch.push(P('נסו לענות לפני שאתם קוראים את התשובה המנחה',{size:20,color:'6B7280',after:200}));
    open.forEach((x,i)=>{ ch.push(P([{t:(i+1)+'. ',b:true},{t:x.q.q,b:true}],{size:20,after:50,keepNext:true,before:100})); ch.push(box('key',[P(x.q.rubric||'',{size:18,after:0})],{label:'תשובה מנחה'}),gap(50)); }); }
  return doc(ch,C,course+' · שאלות אמריקאיות פתורות',credit); }
(async()=>{ fs.mkdirSync(outDir,{recursive:true});
  for(const [name,fn] of [['summary',buildSummary],['marathon',buildMarathon],['questions',buildQuestions]]){ const buf=await Packer.toBuffer(fn()); fs.writeFileSync(outDir+'/'+name+'.docx',buf); console.log(name,buf.length); } })();
