import json,re,html,sys
P=json.load(open('/tmp/con_P.json',encoding='utf8'))
CSS="""@page{size:A4;margin:18mm}body{font-family:'Noto Sans Hebrew','David',Arial,sans-serif;direction:rtl;line-height:1.6;font-size:11pt}
h1{font-size:26pt;text-align:center;margin-top:60mm}h2{color:#1d3a6e;border-bottom:2px solid #1d3a6e;page-break-before:always}h3{color:#1d3a6e}
.pkw-box,.bx{border:1px solid #bbb;border-right:5px solid #1d3a6e;padding:6px 10px;margin:8px 0;background:#f6f8fc}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:4px}th{background:#e6ecf7}
mark{background:#fff3a0}.q{margin:10px 0;page-break-inside:avoid}.e{color:#145a2a}"""
def wrap(t,body): return '<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>%s</title><style>%s</style><body>%s</body></html>'%(t,CSS,body)
cover=lambda t,s:'<h1>%s</h1><p style="text-align:center;font-size:16pt">%s</p>'%(t,s)
H='אבגד'
L=P['lessons']; T=P['topics']
# סיכום
b=cover('דיני חוזים','חוברת סיכום')+'<h2>תוכן עניינים</h2><ol>'+''.join('<li>%s</li>'%t for t in T)+'</ol>'
for i,l in enumerate(L): b+='<h2>פרק %d: %s</h2>'%(i+1,T[i])+l['summary']
open('/tmp/b_summary.html','w',encoding='utf8').write(wrap('דיני חוזים — סיכום',b))
# שאלות
b=cover('דיני חוזים','חוברת שאלות ותשובות מנומקות')
for i,l in enumerate(L):
    b+='<h2>פרק %d: %s</h2>'%(i+1,T[i])
    for j,q in enumerate(l['qs']):
        b+='<div class="q"><b>%d. %s</b><ol type="א">%s</ol><div class="e">התשובה הנכונה: %s. %s</div></div>'%(j+1,q['q'],''.join('<li>%s</li>'%o for o in q['o']),H[q['c']],q['e'])
    if l['cases']:
        b+='<h3>פסיקה בפרק</h3>'+''.join('<div class="bx"><b>%s</b><br>%s<br><i>הלכה:</i> %s</div>'%(c['n'],c['story'],c['r']) for c in l['cases'])
open('/tmp/b_questions.html','w',encoding='utf8').write(wrap('דיני חוזים — שאלות',b))
# מרתון
b=cover('דיני חוזים','מרתון — תמצית מהירה למבחן')
for s in P['sheets']:
    if s.get('cover') or s['id']=='toc': continue
    b+='<h2>%s. %s</h2>'%(s['num'],s['title'])
    for k in s['blocks']:
        if k['k']=='h': b+='<h3>%s</h3>'%k['t']
        elif k['k']=='p': b+=k['h']
        elif k['k']=='bx': b+='<div class="bx">%s</div>'%k['h']
        elif k['k']=='t': b+='<table><tr>'+''.join('<th>%s</th>'%h for h in k['head'])+'</tr>'+''.join('<tr>'+''.join('<td>%s</td>'%c for c in r)+'</tr>' for r in k['rows'])+'</table>'
open('/tmp/b_marathon.html','w',encoding='utf8').write(wrap('דיני חוזים — מרתון',b))
