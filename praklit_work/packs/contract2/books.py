import json,re,html,sys
P=json.load(open('/tmp/con_P.json',encoding='utf8'))
PAL=['#1e4fa3','#0f766e','#7b4fd0','#d64545','#d9741f','#2e8b57','#3b4fa8','#b0348a','#b07d00','#0e7fa0','#c0392b','#5f8a1f','#1e3a8a','#8a3fa0','#1d7a66','#a85420']
def css(c): return """@page{size:A4;margin:12mm 0}table.w{width:100%%;border:0;border-collapse:collapse;margin:0}table.w td{border:0;padding:0}body{font-family:'Noto Sans Hebrew','Heebo','Arial',sans-serif;direction:rtl;line-height:1.95;font-size:12pt;color:#1b2430;margin:0}
.frame{position:fixed;top:1mm;bottom:1mm;left:9mm;right:9mm;border:1.6pt solid %s;border-radius:5px;pointer-events:none;z-index:-1}.frame:after{content:'';position:absolute;inset:1.6mm;border:.6pt solid #d4a93a;border-radius:3px}.cover{page-break-after:always;padding:2mm 18mm}.cb{background:linear-gradient(150deg,%s,#0b1630);border-top:5px solid #D9A93E;box-shadow:0 0 0 1.5pt #E9C46A inset;color:#fff;padding:14mm 12mm;border-radius:3px}.cb .k{color:#E9C46A;font-weight:700;font-size:11pt}.cb h1{font-size:40pt;margin:6mm 0 0}.cb h2{color:#E9C46A;border-bottom:1.5pt solid #D9A93E;display:inline-block;padding-bottom:2mm;font-size:22pt;margin:0 0 6mm;border:0;padding:0;page-break-before:avoid}.cb p{margin:2mm 0}.by{border:1px solid %s;background:#FBF6EA;border-color:#D9A93E;padding:5mm 7mm;margin-top:10mm;border-radius:3px}.by small{display:block;color:#666}.by b{font-size:22pt;color:%s}
.toc{page-break-after:always;padding:0 18mm}.toc h1{font-size:26pt;margin:4mm 0 2mm;color:%s}.toc .row{display:flex;flex-direction:row;align-items:stretch;background:#f2f3f5;margin:2.2mm 0;border-radius:2px;direction:rtl}.toc .n{color:#fff;font-weight:700;width:9mm;text-align:center;padding:2mm 0}.toc .t{padding:2mm 3mm;flex:1}
.ch{padding:0 22mm}.band{color:#fff;padding:5mm 7mm;margin:0 12mm 6mm;border-radius:4px;border-bottom:2.5pt solid #d4a93a;font-size:17pt;font-weight:700;page-break-before:always;break-before:page}.band small{display:block;font-size:9pt;opacity:.9}
h3{color:%s;border-right:4px solid %s;margin:8mm 0 3mm;font-size:13pt;background:#FBF6EA;border-bottom:1pt solid #D9A93E;padding:2mm 3mm;border-radius:2px}h4{color:%s}
.pkw-box,.bx{border:1px solid #cfd6e4;border-right:4px solid %s;padding:2.5mm 4mm;margin:3mm 0;background:#FBF6EA;border-radius:3px;font-size:11.5pt;page-break-inside:avoid;padding:4mm 6mm;margin:5mm 0}
table{border-collapse:collapse;width:100%%;margin:4mm 0;font-size:11pt}td,th{border:1px solid #b9c0cf;padding:2mm 3mm;vertical-align:top}th{background:#F3E9CB;color:#3a2a10}tr{page-break-inside:avoid}
mark{background:#fff0a0}.q{margin:4mm 0;page-break-inside:avoid;border-bottom:1px dotted #bbb;padding-bottom:3mm}.q ol{margin:2mm 0;list-style-type:hebrew}.e{color:#145a2a;background:#eef8f0;border-right:3px solid #2e9d62;padding:2mm 3mm;border-radius:3px}"""%((c,)*9)
SCALE={'סיכום':'body{font-size:13.6pt;line-height:2.15}.pkw-box,.bx{font-size:12.6pt}','מרתון':'body{font-size:10.2pt;line-height:1.7}.pkw-box,.bx,table{font-size:10.2pt!important}','שאלות':'body{font-size:9.6pt;line-height:1.5}.q{margin:2.5mm 0;padding-bottom:2mm}.q ol{margin:1mm 0}'}
def wrap(t,body,c): return '<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>%s</title><style>%s%s</style><body><div class="frame"></div><table class="w"><thead><tr><td style="height:10mm"></td></tr></thead><tfoot><tr><td style="height:10mm"></td></tr></tfoot><tbody><tr><td>%s</td></tr></tbody></table></body></html>'%(t,css(c),[v for k,v in SCALE.items() if k in t][0],body)
def cover(no,kind,sub,desc,cnt,c): return '<div class="cover"><div class="cb"><div class="k">חוברת %s · %s</div><h1>דיני חוזים</h1><h2>%s</h2><p>%s</p><p style="font-size:9pt;margin-top:8mm">%s</p></div><div class="by"><small>הוכן ונערך ע״י</small><b>אילן פרץ</b></div></div>'%(no,kind,sub,desc,cnt)
def toc(T,sub,c): return '<div class="toc"><h1>תוכן העניינים</h1><p style="color:#555">%s</p>'%sub+''.join('<div class="row"><div class="n" style="background:%s">%d</div><div class="t">%s</div></div>'%(PAL[i%16],i+1,t) for i,t in enumerate(T))+'</div>'
def band(i,t): return '<div class="band" style="background:%s"><small>פרק %d</small>%s</div>'%(PAL[i%16],i+1,t)
H='אבגד'
L=P['lessons']; T=P['topics']
nq=sum(len(l['qs']) for l in L); nc=sum(len(l['cases']) for l in L)
# סיכום
C='#1e3a8a'; b=cover('1','סיכום מלא','הסיכום המקיף','מושגים, סעיפי חוק, פסקי דין, טבלאות השוואה וטיפים למבחן','%d פרקים'%len(L),C)+toc(T,'סיכום לפי פרקים',C)
for i,l in enumerate(L): b+=band(i,T[i])+'<div class="ch">'+l['summary']+'</div>'
open('/tmp/b_summary.html','w',encoding='utf8').write(wrap('דיני חוזים — סיכום',b,C))
# מרתון
C='#b91c4b'; b=cover('2','מרתון','מרתון למבחן','טבלאות, שרשראות פסיקה, עצי החלטה ורשימות "חייבים לזכור"','%d פרקים'%len(L),C)+toc(T,'מרתון לפי פרקים',C)
for i,s_ in enumerate([x for x in P['sheets'] if not x.get('cover') and x['id']!='toc']):
    b+=band(i,s_['title'])+'<div class="ch">'
    for k in s_['blocks']:
        if k['k']=='h': b+='<h3>%s</h3>'%k['t']
        elif k['k']=='p': b+=k['h']
        elif k['k']=='bx': b+='<div class="bx">%s</div>'%k['h']
        elif k['k']=='t': b+='<table><tr>'+''.join('<th>%s</th>'%h for h in k['head'])+'</tr>'+''.join('<tr>'+''.join('<td>%s</td>'%c for c in r)+'</tr>' for r in k['rows'])+'</table>'
    b+='</div>'
open('/tmp/b_marathon.html','w',encoding='utf8').write(wrap('דיני חוזים — מרתון',b,C))
# שאלות
C='#0f766e'; b=cover('3','תרגול','שאלות אמריקאיות פתורות','שאלות בסגנון מבחן מתחילת החומר ועד סופו, עם פתרון והסבר מלא לכל שאלה, ופסיקה לכל פרק','סה״כ %d שאלות פתורות · %d פסקי דין'%(nq,nc),C)+toc(T,'שאלות אמריקאיות לפי פרקים · סה״כ %d שאלות'%nq,C)
for i,l in enumerate(L):
    b+=band(i,T[i])+'<div class="ch">'
    for j,q in enumerate(l['qs']):
        b+='<div class="q"><b>%d. %s</b><ol type="א">%s</ol><div class="e"><b>התשובה הנכונה: %s.</b> %s</div></div>'%(j+1,q['q'],''.join('<li>%s</li>'%o for o in q['o']),H[q['c']],q['e'])
    if l['cases']:
        b+='<h3>פסיקה בפרק</h3>'+''.join('<div class="bx"><b>%s</b><br>%s<br><i>הלכה:</i> %s</div>'%(c['n'],c['story'],c['r']) for c in l['cases'])
    b+='</div>'
open('/tmp/b_questions.html','w',encoding='utf8').write(wrap('דיני חוזים — שאלות',b,C))
