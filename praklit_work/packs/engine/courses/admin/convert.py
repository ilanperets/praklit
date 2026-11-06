#!/usr/bin/env python3
# ממיר את הסיכומים הגולמיים (dumps/admin.json) למבנה pkw-box: conv/NN.json = רשימת מחרוזות HTML.
import json,re,os,sys
HERE=os.path.dirname(os.path.abspath(__file__)); ENG=os.path.dirname(os.path.dirname(HERE)); sys.path.insert(0,ENG)
from lib import box
D=json.load(open(os.path.join(ENG,'dumps','admin.json')))
BLK=re.compile(r'<(p|h3|h4|ul|ol|table|details)\b[^>]*>.*?</\1>',re.S)
def strip_lead(p):
    m=re.match(r'<p[^>]*>\s*<strong>(.*?)</strong>\s*(.*)</p>$',p,re.S)
    return (m.group(1).strip(),m.group(2).strip()) if m else (None,None)
def inner(p): return re.sub(r'^<p[^>]*>|</p>$','',p).strip()
CASE_LEAD=('הרקע','העובדות','ההכרעה','ההלכה','הנימוקים','המסקנה','התוצאה','השופט','הנשיא','השופטת','השאלה שנותרה','הסעד')
def cleantext(s):
    s=re.sub(r'שיעור (\d+)',r'פרק \1',s)
    for a,b in (('בשיעור','בפרק'),('השיעור','הפרק'),('שיעורים','פרקים'),('שיעור','פרק')): s=s.replace(a,b)
    s=re.sub(r'<p[^>]*margin-top:18px[^>]*>.*?</p>','',s,flags=re.S)
    return s
def undetails(b):
    # <details><summary>S</summary>BODY</details> -> <p><b>S</b></p>BODY
    m=re.match(r'<details>\s*<summary>(.*?)</summary>(.*)</details>$',b,re.S)
    s,body=m.group(1),m.group(2).strip()
    return '<p><b>%s</b></p>'%s+body
def split_blocks(raw):
    out=[];pos=0;TAG=re.compile(r'<(p|h3|h4|ul|ol|table|details)\b[^>]*>')
    while True:
        m=TAG.search(raw,pos)
        if not m:
            assert not raw[pos:].strip(),raw[pos:pos+200]; break
        assert not raw[pos:m.start()].strip(),raw[pos:m.start()][:200]
        tg=m.group(1); depth=1; q=m.end(); op=re.compile(r'<%s\b[^>]*>'%tg); cl='</%s>'%tg
        while depth:
            a=op.search(raw,q); c=raw.find(cl,q)
            if a and a.start()<c: depth+=1; q=a.end()
            else: depth-=1; q=c+len(cl)
        out.append(raw[m.start():q]); pos=q
    return out
def convert(raw,N):
    raw=cleantext(raw); blocks=split_blocks(raw)
    out=[]; k=[0]; cur=None   # cur: list of html pieces of current section
    def h3(t):
        k[0]+=1; return '<h3>%d.%d %s</h3>'%(N,k[0],t)
    i=0; sec=None; title_stack=''
    # first h3 is the chapter title: drop
    blocks=[b for b in blocks if not b.startswith('<h3>')]
    items=[]   # (kind, html)
    j=0
    while j<len(blocks):
        b=blocks[j]
        if b.startswith('<h4>'):
            t=re.sub(r'^<h4>|</h4>$','',b).strip()
            # collect section body
            body=[]; j+=1
            while j<len(blocks) and not blocks[j].startswith('<h4>'): body.append(blocks[j]); j+=1
            items.append(('sec',t,body)); continue
        items.append(('intro',None,[b])); j+=1
    res=[]
    intro=[x for kind,_,x in items if kind=='intro']
    if intro:
        res.append(h3('מבוא — למה זה חשוב ומה מקומו בתמונה הגדולה')); 
        res.append(''.join(sum(intro,[])))
    for kind,t,body in items:
        if kind!='sec': continue
        tt=re.sub(r'^\d+\.\s*','',t)
        if t.startswith('שאלה בסגנון המבחן'):
            html=''.join(undetails(x) if x.startswith('<details') else x for x in body)
            res.append(('EX',t,html)); continue
        if t=='שאלות לחשיבה':
            res.append(h3('שאלות לחשיבה')); res.append(''.join(undetails(x) if x.startswith('<details') else x for x in body)); continue
        if t=='טעויות נפוצות': tt='מלכודות נפוצות'
        if t=='נקודות מפתח למבחן':
            res.append(h3(tt)); res.append(box('key','עיקרי הפרק',''.join(body))); continue
        res.append(h3(tt)); res.append(secbody(body,tt,t=='טעויות נפוצות'))
    # merge EX into preceding output as separate box (wrapped under one h3)
    final=[]; exs=[x for x in res if isinstance(x,tuple)]
    for x in res:
        if isinstance(x,tuple): continue
        final.append(x)
    if exs:
        final.insert(0,None)
        # place exercises section before 'שאלות לחשיבה' if exists, else at end
    final=[x for x in final if x is not None]
    exhtml=''.join(box('ex',t,h) for _,t,h in exs)
    if exs:
        idx=next((n for n,x in enumerate(final) if x.startswith('<h3>') and 'שאלות לחשיבה' in x),len(final))
        final[idx:idx]=[h3('שאלות בסגנון המבחן'),exhtml]
    # SUM elements: each h3 starts an element
    sums=[];cur=''
    for x in final:
        if x.startswith('<h3>'):
            if cur: sums.append(cur)
            cur=x
        else: cur+=x
    if cur: sums.append(cur)
    return sums
def secbody(body,title,warn):
    out=[]; n=0
    while n<len(body):
        b=body[n]
        if b.startswith('<details'): out.append(undetails(b)); n+=1; continue
        if b.startswith('<ul>') and warn:
            out.append(box('warn','מלכודות נפוצות',b)); n+=1; continue
        if not b.startswith('<p'): out.append(b); n+=1; continue
        lead,rest=strip_lead(b)
        gold='border-inline-start' in b[:120]
        if lead and re.match(r'(הרקע|העובדות)',lead):
            grp=[inner(b)]; n+=1
            while n<len(body) and body[n].startswith('<p'):
                l2,_=strip_lead(body[n])
                if l2 and l2.startswith(CASE_LEAD) and not re.match(r'(הרקע|העובדות)',l2): grp.append(inner(body[n])); n+=1
                else: break
            out.append(box('case','עובדות והכרעה',''.join('<p>%s</p>'%g for g in grp))); continue
        if lead and lead.startswith(('טיפ','טיפ לזיהוי')):
            out.append(box('tip','מה לעשות במבחן','<p>%s</p>'%rest)); n+=1; continue
        if lead and (lead.startswith(('שים לב','שימו לב','זהירות','מלכודת'))):
            out.append(box('warn','מלכודת','<p>%s</p>'%rest)); n+=1; continue
        if lead and re.match(r"(סעיף|ס')",lead):
            out.append(box('law',re.sub(r"^(סעיף|ס')\s*",'',re.sub(r'<[^>]+>','',lead).rstrip(':')),'<p>%s</p>'%rest)); n+=1; continue
        if lead and lead.startswith(('הכלל','כלל פרשנות','המבחנים היום')) and gold:
            out.append(box('def',re.sub(r'<[^>]+>','',lead).rstrip(':'),'<p>%s</p>'%rest)); n+=1; continue
        if gold and b.startswith('<p style="border-inline-start:4px solid #C9A24A;padding:6px 12px;background:#FFFBF2"><strong>'):
            # definition-like paragraph
            m=re.match(r'<p[^>]*><strong>(.*?)</strong>(.*)</p>$',b,re.S)
            out.append(box('def',re.sub(r'<[^>]+>','',m.group(1)).rstrip(':'),'<p>%s</p>'%(m.group(1) if False else '<strong>%s</strong>%s'%(m.group(1),m.group(2))))); n+=1; continue
        if gold:
            out.append(box('law','ציטוט / הסעיף', '<p>%s</p>'%inner(b))); n+=1; continue
        out.append(b); n+=1
    return ''.join(out)
if __name__=='__main__':
    for i,s in enumerate(D['summ']):
        r=convert(s,i+1)
        json.dump(r,open(os.path.join(HERE,'conv','%02d.json'%(i+1)),'w'),ensure_ascii=False,indent=0)
        print(i+1,len(r),sum(map(len,r)))
