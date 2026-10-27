# ממיר pack_<course>.js ל-blocks.json לפורמט שמעצב ה-PDF מכיר.
# שימוש: python3 pack_to_blocks.py <pack_X.js> <out.json>
import json,re,sys
from bs4 import BeautifulSoup
sys.path.insert(0,__import__('os').path.dirname(__file__))
from parse_course import parse,cases_parse,strip_lbl,trim
def load(path):
    s=open(path,encoding='utf-8').read()
    return json.loads(re.search(r'var P=(\{.*?\});\n',s,re.S).group(1))
def build(path,out):
    P=load(path); res=[]
    for l in P['lessons']:
        n=l['n']; soup=BeautifulSoup(l['partb'],'html.parser')
        full=parse(soup.children)
        title=P['road'][n-1][0] if n-1<len(P['road']) else 'שיעור %d'%n
        sents=[x.strip() for x in re.split(r'(?<=[.!?])\s+',l.get('simple','')) if x.strip()][:3]
        keypts=[[{'t':x,'b':False,'i':False}] for x in sents]
        cs=cases_parse(l.get('cases') or '')
        for c in cs: c['bg']=strip_lbl(c['bg']); c['hold']=strip_lbl(c['hold'])
        quiz=[{'type':'mc','q':q['q'],'options':q['o'],'correct':q['c'],'explain':(q.get('why') or [''])[q['c']] if q.get('why') else ''} for q in l.get('qs',[])]
        res.append({'n':n,'title':title,'full':full,'keypts':keypts,'cases':cs,'tree':None,'quiz':quiz})
    json.dump(res,open(out,'w',encoding='utf-8'),ensure_ascii=False)
    return P['cname'],res
if __name__=='__main__':
    c,r=build(sys.argv[1],sys.argv[2]); print(c,len(r),'פרקים',sum(len(l['quiz']) for l in r),'שאלות',sum(len(l['cases']) for l in r),'פסקי דין')
