import json,os,re
HERE=os.path.dirname(os.path.abspath(__file__))
def base(n):
    return json.load(open(os.path.join(HERE,'conv','%02d.json'%n)))
def compose(n,extras,after_marker='מילון מושגים'):
    """מכניס את extras (רשימת מחרוזות; כל אחת מתחילה ב-h3) לפני סעיף 'מילון מושגים'."""
    b=base(n); i=next((k for k,x in enumerate(b) if after_marker in x[:120]),len(b))
    return b[:i]+list(extras)+b[i:]

import random,hashlib
def _shuf(q):
    r=random.Random(int(hashlib.md5(q['q'].encode()).hexdigest()[:8],16)); idx=list(range(4)); r.shuffle(idx)
    return {'q':q['q'],'o':[q['o'][i] for i in idx],'c':idx.index(q['c']),'e':q['e']}
def mkqs(n,E,fix=None,new=()):
    """שאלות הבסיס (conv/qNN.json) + הסברים חדשים E (לפי אינדקס) + תיקונים fix{i:{...}} + שאלות חדשות (dict מ-Q)."""
    fix=fix or {}; base=json.load(open(os.path.join(HERE,'conv','q%02d.json'%n)))['qs']
    assert len(E)==len(base),(n,len(E),len(base))
    out=[]
    for i,q in enumerate(base):
        q=dict(q); q.update(fix.get(i,{})); q['e']=E[i]; assert len(q['e'])>=120,(n,i,len(q['e'])); out.append(_shuf(q))
    for x in new: assert len(x['e'])>=120,(n,x['q'][:30],len(x['e'])); out.append(x)
    return out
