# ספריית עזר לכתיבת פרקי דיני חוזים (מודל משפחה). כל פרק: TITLE, SUM(list html), CASES, QS, MAR.
import random,hashlib
G={'def':'✦ הגדרה','law':'§ סעיף','case':'⚖ פסק דין','tip':'★ טיפ למבחן','warn':'! שים לב','ex':'✎ דוגמה','key':'✔ שורה תחתונה'}
def h3(t): return '<h3>%s</h3>'%t
def h4(t): return '<h4>%s</h4>'%t
def p(t): return '<p>%s</p>'%t
def ul(*a): return '<ul>'+''.join('<li>%s</li>'%x for x in a)+'</ul>'
def ol(*a): return '<ol>'+''.join('<li>%s</li>'%x for x in a)+'</ol>'
def m(t): return '<mark>%s</mark>'%t
def box(k,title,body):
    if isinstance(body,(list,tuple)): body=ul(*body)
    elif not body.startswith('<'): body='<p>%s</p>'%body
    return '<div class="pkw-box %s"><b>%s — %s</b>%s</div>'%(k,G[k],title,body)
def tbl(head,rows):
    return '<table><tr>'+''.join('<th><b>%s</b></th>'%h for h in head)+'</tr>'+''.join('<tr>'+''.join('<td>%s</td>'%c for c in r)+'</tr>' for r in rows)+'</table>'
# שאלה: (q, נכונה, [3 מסיחים], הסבר) -> dict עם סדר אפשרויות דטרמיניסטי
def Q(q,right,wrong,e):
    assert len(wrong)==3,q[:40]
    o=[right]+list(wrong); r=random.Random(int(hashlib.md5(q.encode()).hexdigest()[:8],16)); r.shuffle(o)
    return {'q':q,'o':o,'c':o.index(right),'e':e}
# בלוקים למרתון
def mh(t): return {'k':'h','t':t,'lv':1}
def mp(h): return {'k':'p','h':h if h.startswith('<') else '<p>%s</p>'%h,'lv':1}
def mbx(c,t,body,lv=1): return {'k':'bx','c':c,'h':'<b>%s — %s</b> %s'%(G[c],t,body),'lv':lv}
def mt(head,rows,lv=1): return {'k':'t','head':['<b>%s</b>'%h for h in head],'rows':rows,'lv':lv}
