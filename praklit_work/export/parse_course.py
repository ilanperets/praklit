# מפרק את תוכן קורס (HTML מהמערכת) לבלוקים פשוטים לבניית Word/PDF
import json,re,sys
from bs4 import BeautifulSoup, NavigableString, Tag
COPY=re.compile(r'©\s*כל הזכויות')
def ws(s): return re.sub(r'\s+',' ',s)
def runs(node,b=False,i=False):
    out=[]
    for c in node.children:
        if isinstance(c,NavigableString):
            t=ws(str(c))
            if t: out.append({'t':t,'b':b,'i':i})
        elif isinstance(c,Tag):
            if c.name=='br': out.append({'t':'\n'})
            elif c.name in('b','strong'): out+=runs(c,True,i)
            elif c.name in('em','i'): out+=runs(c,b,True)
            else: out+=runs(c,b,i)
    return out
def trim(rs):
    rs=[r for r in rs if r.get('t')!='']
    if rs and 't' in rs[0] and rs[0]['t']!='\n': rs[0]['t']=rs[0]['t'].lstrip()
    if rs and rs[-1]['t']!='\n': rs[-1]['t']=rs[-1]['t'].rstrip()
    return [r for r in rs if r['t']!='']
def li_item(li):
    # פריט רשימה: טקסט + רשימות מקוננות
    sub=[]; 
    own=Tag(name='span')
    for c in list(li.children):
        if isinstance(c,Tag) and c.name in('ul','ol'): sub.append(c)
        else: own.append(c.__copy__() if hasattr(c,'__copy__') else c)
    return trim(runs(own)),sub
def parse(nodes):
    bl=[]
    for n in nodes:
        if isinstance(n,NavigableString):
            continue
        if not isinstance(n,Tag): continue
        cls=n.get('class') or []
        if n.name=='h3': bl.append({'k':'h','r':trim(runs(n))})
        elif n.name=='h4': bl.append({'k':'sub','r':trim(runs(n))})
        elif n.name=='p':
            if COPY.search(n.get_text()): continue
            if 'pkw-law' in cls: bl.append({'k':'box','kind':'law','blocks':[{'k':'p','r':trim(runs(n))}]})
            else:
                r=trim(runs(n))
                if r: bl.append({'k':'p','r':r})
        elif n.name in('ul','ol'):
            items=[]; 
            def walk(lst,lvl):
                for li in lst.find_all('li',recursive=False):
                    r,sub=li_item(li); items.append({'r':r,'lvl':lvl})
                    for s in sub: walk(s,lvl+1)
            walk(n,0)
            bl.append({'k':'ol' if n.name=='ol' else 'ul','items':items})
        elif n.name=='table':
            rows=[]
            for tr in n.find_all('tr'):
                cells=[trim(runs(td)) for td in tr.find_all(['th','td'],recursive=False)]
                isH=bool(tr.find('th'))
                rows.append({'h':isH,'c':cells})
            bl.append({'k':'table','rows':rows})
        elif n.name=='div':
            if 'pkw-box' in cls:
                kind='warn' if 'warn' in cls else 'tip' if 'tip' in cls else 'key'
                inner=parse(n.children)
                if not inner: inner=[{'k':'p','r':trim(runs(n))}]
                bl.append({'k':'box','kind':kind,'blocks':inner})
            elif 'pk-upg' in cls: continue
            else: bl+=parse(n.children)
    return bl
def split_lesson(html):
    soup=BeautifulSoup(html,'html.parser')
    kids=list(soup.children)
    idx=None
    for j,c in enumerate(kids):
        if isinstance(c,Tag) and 'pk-ev-mark' in (c.get('class') or []): idx=j; break
    short=kids[:idx] if idx is not None else []
    full=kids[idx+1:] if idx is not None else kids
    return short,full
def cases_parse(html):
    soup=BeautifulSoup(html,'html.parser'); out=[]
    for c in soup.find_all('div',class_='case',recursive=False) or soup.select('div.case'):
        if c.find(class_='cname'):
            out.append({'name':ws(c.find(class_='cname').get_text()).strip(),'tag':ws((c.find(class_='ctag') or Tag(name='x')).get_text()).strip(),
              'bg':trim(runs(c.select_one('.cbg'))) if c.select_one('.cbg') else [], 'hold':trim(runs(c.select_one('.chold'))) if c.select_one('.chold') else []})
        elif c.find('strong'):
            p=c.find('p'); out.append({'name':ws(c.find('strong').get_text()).strip(),'tag':'','bg':[],'hold':trim(runs(p)) if p else [],'note':True})
    return out
def strip_lbl(rs):
    # מוריד את התווית (הרקע/ההלכה) שנכנסה כטקסט ראשון
    if rs and rs[0]['t'] in('הרקע','ההלכה'): return rs[1:]
    return rs
def build(path_json, out_json, titles=None):
    d=json.load(open(path_json,encoding='utf-8')); res=[]
    for k in sorted(d,key=int):
        e=d[k]; short,full=split_lesson(e['summary'])
        sb=parse(short); title=next((''.join(r['t'] for r in b['r']) for b in sb if b['k']=='h'),'שיעור %d'%(int(k)+1))
        keypts=next((b for b in sb if b['k']=='ul'),None)
        cs=cases_parse(e['cases'] or '')
        for c in cs: c['bg']=strip_lbl(c['bg']); c['hold']=strip_lbl(c['hold'])
        res.append({'n':int(k)+1,'title':title,'full':parse(full),'keypts':keypts['items'] if keypts else [],'cases':cs,'tree':e.get('tree'),'quiz':e['quiz']['questions']})
    json.dump(res,open(out_json,'w',encoding='utf-8'),ensure_ascii=False)
    return res
if __name__=='__main__':
    r=build(sys.argv[1],sys.argv[2])
    for l in r: print(l['n'],l['title'],len(l['full']),'blocks',len(l['cases']),'cases',len([q for q in l['quiz'] if q['type']=='mc']),'mc')
