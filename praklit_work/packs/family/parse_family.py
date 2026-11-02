#!/usr/bin/env python3 -I
# מפרסר את שלוש חוברות דיני משפחה (docx) למבנה נתונים: פרקים (HTML), פסקי דין, שאלות, מרתון.
import re,sys,json,zipfile,html
from xml.etree import ElementTree as ET
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
def esc(t): return html.escape(t,quote=False)
def ptext(p): return ''.join(t.text or '' for t in p.iter(W+'t'))
def runs_html(p,skip=0):
    """HTML של פסקה: bold -> <b>, highlight -> <mark>."""
    out=[];n=0
    for r in p.iter(W+'r'):
        t=''.join(x.text or '' for x in r.findall(W+'t'))
        if not t: continue
        rp=r.find(W+'rPr'); b=rp is not None and rp.find(W+'b') is not None; hl=rp is not None and rp.find(W+'highlight') is not None
        s=esc(t)
        if hl: s='<mark>'+s+'</mark>'
        if b: s='<b>'+s+'</b>'
        out.append(s)
    h=''.join(out).replace('</b><b>','').replace('</mark><mark>','')
    return h
def load(path): return list(ET.fromstring(zipfile.ZipFile(path).read('word/document.xml')).find(W+'body'))
def pfill(p):
    pp=p.find(W+'pPr'); 
    if pp is None: return ''
    s=pp.find(W+'shd'); return s.get(W+'fill','') if s is not None else ''
def psz(p):
    r=p.find(W+'r')
    if r is None: return 0
    rp=r.find(W+'rPr'); 
    if rp is None: return 0
    s=rp.find(W+'sz'); return int(s.get(W+'val')) if s is not None else 0
LAB={'✦':'def','§':'law','⚖':'case','★':'tip','!':'warn','✎':'ex','✔':'key'}
def tbl_rows(t):
    return [[c for c in r.findall(W+'tc')] for r in t.findall(W+'tr')]
def cell_paras(c): return [p for p in c.findall(W+'p')]
def is_chapter(t):
    rows=tbl_rows(t)
    if len(rows)!=1 or len(rows[0])!=1: return None
    ps=[ptext(p).strip() for p in cell_paras(rows[0][0]) if ptext(p).strip()]
    if ps and re.match(r'^פרק \d+$',ps[0]) and len(ps)>=2: return (int(ps[0].split()[1]),ps[1])
    return None
def box_kind(t):
    rows=tbl_rows(t)
    if len(rows)!=1 or len(rows[0])!=1: return None
    ps=[p for p in cell_paras(rows[0][0])]
    if not ps: return None
    f=ptext(ps[0]).strip()
    if f and f[0] in LAB: return LAB[f[0]]
    return None
def split_label(p):
    t=ptext(p); 
    m=re.match(r'^\s*\S+\s+(.*?)\s*\|\s*(.*)$',t)
    return (m.group(1).strip(),m.group(2).strip()) if m else (t.strip(),'')
def inline_body_html(ps):
    out=[]; li=[]
    def flush():
        if li: out.append('<ul>'+''.join(li)+'</ul>'); li.clear()
    for p in ps:
        t=ptext(p).strip()
        if not t: continue
        h=runs_html(p)
        if re.match(r'^[●◦•]\s',t): 
            h=re.sub(r'^(<b>)?[●◦•]\s*','\\1',h,count=1); li.append('<li>'+h+'</li>')
        else: flush(); out.append('<p>'+h+'</p>')
    flush(); return ''.join(out)
def table_html(t):
    rows=tbl_rows(t); out=['<table>']
    for ri,r in enumerate(rows):
        tag='th' if ri==0 else 'td'; out.append('<tr>')
        for c in r:
            inner='<br>'.join(runs_html(p) for p in cell_paras(c) if ptext(p).strip())
            out.append('<%s>%s</%s>'%(tag,inner,tag))
        out.append('</tr>')
    out.append('</table>'); return ''.join(out)
def parse_summary(path):
    els=load(path); chapters=[]; cur=None; ul=[]; ol=[]
    def close_lists():
        if ul: cur['h'].append('<ul>'+''.join(ul)+'</ul>'); ul.clear()
        if ol: cur['h'].append('<ol>'+''.join(ol)+'</ol>'); ol.clear()
    for e in els:
        if e.tag==W+'tbl':
            ch=is_chapter(e)
            if ch:
                if cur: close_lists()
                cur={'n':ch[0],'title':ch[1],'h':[],'cases':[],'cnt':{}}; chapters.append(cur); continue
            if cur is None: continue
            close_lists(); k=box_kind(e)
            if k:
                ps=cell_paras(tbl_rows(e)[0][0]); lab,title=split_label(ps[0]); cur['cnt'][k]=cur['cnt'].get(k,0)+1
                if k=='case':
                    body=ps[1:]; full=' '.join(ptext(p) for p in body)
                    segs=[(''.join(x for x in [])) ]
                    cur['cases'].append({'n':title,'raw':[runs_html(p) for p in body],'text':full})
                    cur['h'].append('<div class="pkw-box case"><b>⚖ פסק דין — %s</b>%s</div>'%(esc(title),inline_body_html(body)))
                elif k=='law':
                    cur['h'].append('<p class="pkw-law"><b>%s</b><br>%s</p>'%(esc(title),'<br>'.join(runs_html(p) for p in ps[1:] if ptext(p).strip())))
                else:
                    names={'def':'✦ הגדרה','tip':'★ טיפ למבחן','warn':'! שים לב','ex':'✎ דוגמה','key':'✔ שורה תחתונה'}
                    hd=names[k]+(' — '+esc(title) if title else '')
                    cur['h'].append('<div class="pkw-box %s"><b>%s</b>%s</div>'%(k,hd,inline_body_html(ps[1:])))
            else:
                cur['h'].append(table_html(e)); cur['cnt']['table']=cur['cnt'].get('table',0)+1
            continue
        if e.tag!=W+'p' or cur is None: continue
        t=ptext(e).strip()
        if not t: continue
        fill=pfill(e); sz=psz(e)
        if sz==28:
            close_lists(); cur['h'].append('<h3>%s</h3>'%esc(t)); cur['cnt']['h3']=cur['cnt'].get('h3',0)+1; continue
        if t.startswith('▌'):
            close_lists(); cur['h'].append('<h4>%s</h4>'%esc(t.lstrip('▌ ').strip())); cur['cnt']['h4']=cur['cnt'].get('h4',0)+1; continue
        h=runs_html(e)
        if re.match(r'^●\s',t):
            if ol: close_lists()
            h=re.sub(r'^(<b>|<mark>)*●\s*','',h,count=1); ul.append('<li>'+h+'</li>'); continue
        if re.match(r'^◦\s',t):
            h=re.sub(r'^(<b>|<mark>)*◦\s*','',h,count=1)
            # רמה 2: נאגדת לתוך הפריט האחרון
            if ul:
                last=ul[-1]
                if last.endswith('</ul></li>'): ul[-1]=last[:-10]+'<li>'+h+'</li></ul></li>'
                else: ul[-1]=last[:-5]+'<ul><li>'+h+'</li></ul></li>'
            else: ul.append('<li>'+h+'</li>')
            continue
        m=re.match(r'^(\d+)\.\s',t)
        if m and psz(e) in (19,0) and len(t)<400 and (ol or m.group(1)=='1'):
            if ul: close_lists()
            h=re.sub(r'^(<b>|<mark>)*\d+\.\s*','',h,count=1); ol.append('<li>'+h+'</li>'); continue
        close_lists(); cur['h'].append('<p>'+h+'</p>')
    if cur: close_lists()
    return chapters


LET={'א':0,'ב':1,'ג':2,'ד':3}
def parse_questions(path):
    els=load(path); ch=0; chs={}; qs=[]; keys={}; expl={}
    cur_qs=None
    for e in els:
        if e.tag==W+'p':
            t=ptext(e).strip()
            if t.startswith('מפתח תשובות:'):
                for m in re.finditer(r'(\d+)-([אבגד])',t): keys[int(m.group(1))]=LET[m.group(2)]
            continue
        if e.tag!=W+'tbl': continue
        c=is_chapter(e)
        if c: ch=c[0]; chs[ch]=c[1]; continue
        rows=tbl_rows(e)
        if len(rows)!=1 or len(rows[0])!=1 or not ch: continue
        ps=[ptext(p).strip() for p in cell_paras(rows[0][0])]; ps=[p for p in ps if p]
        if not ps: continue
        m=re.match(r'^שאלה (\d+) — התשובה הנכונה: ([אבגד])$',ps[0])
        if m: expl[int(m.group(1))]=(LET[m.group(2)],' '.join(ps[1:])); continue
        m=re.match(r'^(\d+)\s+(.*)$',ps[0])
        if m and any(re.match(r'^\(א\)',x) for x in ps[1:]):
            n=int(m.group(1)); stem=[m.group(2)]; opts=[]
            for x in ps[1:]:
                mo=re.match(r'^\(([אבגד])\)\s*(.*)$',x)
                if mo: opts.append((LET[mo.group(1)],mo.group(2)))
                elif not opts: stem.append(x)
                else: opts[-1]=(opts[-1][0],opts[-1][1]+' '+x)
            qs.append({'n':n,'ch':ch,'q':' '.join(stem),'o':[o[1] for o in opts],'ol':[o[0] for o in opts]})
    return qs,keys,expl,chs
def check_questions(qs,keys,expl):
    errs=[]
    ns=[q['n'] for q in qs]
    if ns!=list(range(1,len(qs)+1)): errs.append('מספור לא רציף')
    for q in qs:
        if q['ol']!=[0,1,2,3]: errs.append('אפשרויות שגויות בשאלה %d'%q['n'])
        if q['n'] not in keys: errs.append('אין מפתח לשאלה %d'%q['n'])
        if q['n'] not in expl: errs.append('אין הסבר לשאלה %d'%q['n'])
        elif keys.get(q['n'])!=expl[q['n']][0]: errs.append('מפתח לא תואם להסבר בשאלה %d'%q['n'])
        if len(set(q['o']))<4: errs.append('אפשרויות כפולות בשאלה %d'%q['n'])
    return errs
def parse_marathon(path):
    els=load(path); sheets=[]; cur=None; bl=[]
    def flush_ul(ul):
        if ul: cur['blocks'].append({'k':'p','h':'<ul>'+''.join(ul)+'</ul>','lv':1}); ul.clear()
    ul=[]
    for e in els:
        if e.tag==W+'tbl':
            ch=is_chapter(e)
            if ch: flush_ul(ul) if cur else None; cur={'n':ch[0],'title':ch[1],'blocks':[]}; sheets.append(cur); continue
            if cur is None: continue
            flush_ul(ul); k=box_kind(e)
            if k:
                ps=cell_paras(tbl_rows(e)[0][0]); lab,title=split_label(ps[0])
                names={'def':'✦ הגדרה','tip':'★ טיפ למבחן','warn':'! שים לב','ex':'✎ דוגמה','key':'✔ שורה תחתונה','law':'§ לשון החוק','case':'⚖ פסק דין'}
                body='<br>'.join(runs_html(p) for p in ps[1:] if ptext(p).strip())
                cur['blocks'].append({'k':'bx','c':k,'h':'<b>%s%s</b> %s'%(names[k],(' — '+esc(title)) if title else '',body),'lv':1})
            else:
                rows=tbl_rows(e)
                cell=lambda c:'<br>'.join(runs_html(p) for p in cell_paras(c) if ptext(p).strip())
                head=[cell(c) for c in rows[0]]; rr=[[cell(c) for c in r] for r in rows[1:]]
                cur['blocks'].append({'k':'t','head':head,'rows':rr,'lv':1})
            continue
        if e.tag!=W+'p' or cur is None: continue
        t=ptext(e).strip()
        if not t: continue
        sz=psz(e)
        if sz==28: flush_ul(ul); cur['blocks'].append({'k':'h','t':esc(t),'lv':1}); continue
        if t.startswith('▌'): flush_ul(ul); cur['blocks'].append({'k':'h','t':esc(t.lstrip('▌ ').strip()),'lv':1}); continue
        h=runs_html(e)
        if re.match(r'^[●◦]\s',t): ul.append('<li>'+re.sub(r'^(<b>|<mark>)*[●◦]\s*','',h,count=1)+'</li>'); continue
        flush_ul(ul); cur['blocks'].append({'k':'p','h':h,'lv':1})
    if cur: flush_ul(ul)
    return sheets
def split_case(c):
    """מפצל פסק דין לעובדות / הלכה לפי תוויות (עובדות…: / הלכה…:)."""
    txt=html.unescape(' '.join(re.sub(r'<[^>]*>','',x) for x in c['raw'])).strip()
    mh=re.search(r'הלכה[^:]{0,25}:',txt); mf=re.search(r'עובדות[^:]{0,25}:',txt)
    if mh:
        pre=txt[:mh.start()].strip(); r=txt[mh.start():].strip()
        story=re.sub(r'^עובדות[^:]{0,25}:\s*','',pre).strip()
    elif mf: story=re.sub(r'^עובדות[^:]{0,25}:\s*','',txt).strip(); r=''
    else: story=''; r=txt
    r=re.sub(r'^הלכה:\s*','',r)
    return story,r

def norm(t): return re.sub(r'[^א-תA-Za-z0-9]','',re.sub(r'<[^>]*>','',html.unescape(t)))
def coverage(path,chapters):
    els=load(path); started=False; src=[]
    for e in els:
        if e.tag==W+'tbl' and is_chapter(e): started=True
        if started: src.append(''.join(t.text or '' for t in e.iter(W+'t')))
    a=len(norm(''.join(src))); b=sum(len(norm(''.join(c['h']))) for c in chapters)
    return a,b
if __name__=='__main__':
    ch=parse_summary(sys.argv[1]); print(len(ch),'chapters'); a,b=coverage(sys.argv[1],ch); print('chars src',a,'parsed',b,'cov %.2f%%'%(100*b/a))
    for c in ch: print(c['n'],c['title'][:40],'|h3',c['cnt'].get('h3',0),'cases',len(c['cases']),c['cnt'])
