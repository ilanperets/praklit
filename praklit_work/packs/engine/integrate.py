#!/usr/bin/env python3
# שימוש: integrate.py <app_in.html> <app_out.html> id1 id2 ...  (חבילות /tmp/<id>_pack.html)
import sys,re
src,dst=sys.argv[1:3]; ids=sys.argv[3:]
a=open(src,encoding='utf8').read()
def rm_script(a,marker_re):
    m=re.search(marker_re,a); 
    if not m: return a,False
    s=a.rfind('<script',0,m.start()); e=a.index('</script>',m.start())+9
    return a[:s]+a[e:].lstrip('\n'),True
for cid in ids:
    # הסרת חבילות ישנות לאותו קורס
    if cid=='admin': a,_=rm_script(a,r'id="pk7-mnh-pack"')
    if cid=='intro': a,_=rm_script(a,r'/\* ===== קורס בהרחבה: מבוא למשפט')
    # הסרת גרסה קודמת של אותה חבילה
    a,_=rm_script(a,r'id="pk7-%s-pack"'%cid)
    a=re.sub(r'<style id="pk9-%s-css">.*?</style>\n?'%cid,'',a,flags=re.S)
    pack=open('/tmp/%s_pack.html'%cid,encoding='utf8').read()
    k=a.index('id="pk9-con-css"'); j=a.index('</style>',k)+8
    a=a[:j]+'\n'+pack.rstrip('\n')+a[j:]
if 'intro' in ids:
    a=a.replace("{id:'intro',name:'מבוא למשפט'","{id:'intro',name:'תורת המשפט'").replace("שיעורי <strong>מבוא למשפט</strong>","שיעורי <strong>תורת המשפט</strong>")
# חוברות
m=re.search(r"var BOOK_FILES=\{(.*?)\}\}; var BOOK_READY=\{(.*?)\};",a,flags=re.S)
files=m.group(1)+'}'; ready=m.group(2)
for cid in ids:
    if cid+':' not in files: files+=",%s:{summary:'%s_summary',marathon:'%s_marathon',questions:'%s_questions'}"%(cid,cid,cid,cid)
    if cid+':' not in ready: ready+=",%s:1"%cid
a=a[:m.start()]+"var BOOK_FILES={%s}; var BOOK_READY={%s};"%(files,ready)+a[m.end():]
open(dst,'w',encoding='utf8').write(a); print('ok',len(a)//1024,'KB')
