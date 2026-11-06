# שימוש: docxgen.py <dir> <id>
import sys,subprocess,zipfile,re,shutil
d,cid=sys.argv[1:3]
for n in ('summary','questions','marathon'):
    f='%s/%s_%s.docx'%(d,cid,n); subprocess.run(['pandoc','%s/b_%s.html'%(d,n),'-o',f],check=True)
    z=zipfile.ZipFile(f); o=zipfile.ZipFile(f+'.t','w',zipfile.ZIP_DEFLATED)
    for i in z.infolist():
        x=z.read(i.filename)
        if i.filename=='word/document.xml':
            s=x.decode('utf8'); s=re.sub(r'<w:pPr>',r'<w:pPr><w:bidi/>',s); s=re.sub(r'<w:p>(?!<w:pPr>)',r'<w:p><w:pPr><w:bidi/></w:pPr>',s)
            s=re.sub(r'<w:rPr>',r'<w:rPr><w:rtl/>',s); s=re.sub(r'<w:r>(?!<w:rPr>)',r'<w:r><w:rPr><w:rtl/></w:rPr>',s); x=s.encode('utf8')
        o.writestr(i,x)
    o.close(); shutil.move(f+'.t',f)
