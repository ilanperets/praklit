// שימוש: node pdfgen.js <dir> <id> <name>
const {chromium}=require('playwright');const [dir,id,name]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const T={summary:['סיכום מלא','#1e3a8a'],questions:['שאלות אמריקאיות פתורות','#0f766e'],marathon:['מרתון','#b91c4b']};
for(const n in T){await p.goto('file://'+dir+'/b_'+n+'.html');
const hf='<div style="width:100%;font-size:7px;color:#666;padding:0 14mm;direction:rtl;font-family:Arial">';
await p.pdf({path:dir+'/'+id+'_'+n+'.pdf',format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'0',right:'0'},displayHeaderFooter:true,
headerTemplate:hf+name+' · '+T[n][0]+'</div>',
footerTemplate:hf+'<span style="color:'+T[n][1]+';font-weight:bold">הוכן ע״י אילן פרץ</span> · '+name+' · '+T[n][0]+' · עמוד <span class="pageNumber"></span></div>'});}
await b.close()})()
