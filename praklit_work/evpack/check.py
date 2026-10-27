# בדיקת מבנה לקובץ שיעור: python3 check.py l2  (אפשר כמה)
import sys,re,os,importlib.util,collections
D=os.path.dirname(os.path.abspath(__file__))
ALLOWED_TAGS={'h3','h4','p','b','i','u','ul','ol','li','table','tr','th','td','div','span','br','em','strong','small'}
ALLOWED_CLASSES={'pkw-law','pkw-box tip','pkw-box warn','pkw-box key'}
def chk(name):
    sp=importlib.util.spec_from_file_location(name,os.path.join(D,name+'.py')); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    err=[]
    for a in ['N','SIMPLE','PARTB','CASES','QS']:
        if not hasattr(m,a): err.append('missing '+a)
    if err: return err
    txt=re.sub(r'<[^>]+>',' ',m.PARTB); w=len(txt.split())
    if w<1800: err.append('PARTB too short: %d words (min 1800)'%w)
    tags=set(t.lower() for t in re.findall(r'<([a-zA-Z0-9]+)',m.PARTB))
    bad=tags-ALLOWED_TAGS
    if bad: err.append('bad tags '+str(bad))
    for c in re.findall(r'class="([^"]*)"',m.PARTB):
        if c not in ALLOWED_CLASSES: err.append('bad class '+c)
    if re.search(r'href=|<a |<script|<img|style=',m.PARTB): err.append('links/scripts/styles not allowed')
    for t in ['h3','p','ul','ol','li','table','tr','td','th','div','b']:
        o=len(re.findall(r'<%s[\s>]'%t,m.PARTB)); c=len(re.findall(r'</%s>'%t,m.PARTB))
        if o!=c: err.append('unbalanced <%s>: %d open %d close'%(t,o,c))
    if len(m.QS)<20: err.append('need >=20 questions, got %d'%len(m.QS))
    qs=set()
    for q in m.QS:
        if not(len(q.get('o',[]))==4 and len(q.get('why',[]))==4 and q.get('c') in (0,1,2,3)): err.append('bad q '+q.get('q','?')[:40])
        if q['q'] in qs: err.append('dup q '+q['q'][:40])
        qs.add(q['q'])
        for y in q.get('why',[]):
            if len(y)<25: err.append('why too short in: '+q['q'][:40])
    cnt=collections.Counter(q['c'] for q in m.QS)
    if max(cnt.values())>len(m.QS)*0.45: err.append('correct answers not spread: %s'%dict(cnt))
    if len(m.CASES)<3: err.append('need >=3 CASES')
    for c in m.CASES:
        for k in ['n','tag','story','hold']:
            if not c.get(k): err.append('case missing '+k)
    if len(m.SIMPLE)<60: err.append('SIMPLE too short')
    return err,w,len(m.QS),len(m.CASES),dict(cnt)
for n in sys.argv[1:]:
    r=chk(n)
    if isinstance(r,list) or r[0]: print(n,'FAIL',r)
    else: print(n,'OK words=%d qs=%d cases=%d dist=%s'%r[1:])
