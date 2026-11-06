#!/usr/bin/env python3
# יוצר שלד פרקים אחיד מתוך תוכן קיים במערכת (dump JSON). שימוש: scaffold.py <dump.json> <outdir>
# כל שיעור קיים => פרק; שאלות ופסיקה לפי תג השיעור. אחר כך מעמיקים כל פרק (SUM/MAR/הסברים) בלי לשנות את המבנה.
import json,sys,os,re
d=json.load(open(sys.argv[1],encoding='utf8')); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
def lesson_no(x):
    m=re.search(r'(\d+)',x or ''); return int(m.group(1)) if m else 0
for i,t in enumerate(d['topics']):
    n=i+1
    s=d['summ'][i] if i<len(d['summ']) else ''
    s=re.sub(r'^\s*<h3>.*?</h3>','',s,count=1,flags=re.S)
    k=[0]
    def hh(m):
        k[0]+=1; return '<h3>%d.%d %s</h3>'%(n,k[0],re.sub(r'<[^>]+>','',m.group(1)).strip())
    s=re.sub(r'<h4>(.*?)</h4>',hh,s,flags=re.S)
    if k[0]==0: s='<h3>%d.1 %s</h3>'%(n,t)+s
    qs=[];seen=set()
    for q in d['qb']:
        if lesson_no(q.get('l'))!=n or q.get('t')!='mc': continue
        o=q.get('opts') or []
        if len(o)!=4 or len(set(o))!=4 or not (0<=q.get('correct',-1)<4) or q['q'] in seen: continue
        seen.add(q['q']); qs.append({'q':q['q'],'o':o,'c':q['correct'],'e':q.get('e') or ''})
    cs=[(c['n'],c.get('story',''),c.get('r','')) for c in d['cs'] if lesson_no(c.get('l'))==n]
    src="# פרק %d (שלד אוטומטי מהתוכן הקיים; להעמקה)\nN=%d\nTITLE=%r\nSUM=[%r]\nCASES=%r\nQS=%r\nMAR=[]\n"%(n,n,t,s,cs,qs)
    open(os.path.join(out,'ch%02d.py'%n),'w',encoding='utf8').write(src)
print(d['id'],len(d['topics']),'chapters')
