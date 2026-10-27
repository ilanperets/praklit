import json,sys,re,os
BASE='/mnt/user-data/outputs/פרקליט_מעודכן_2026_גיבוי_לפני_השדרוג.html'  # clean original — never the main file
OUT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/d9/demo.html'
PROD=len(sys.argv)>2 and sys.argv[2]=='prod'
faces=json.load(open('faces.json'))
MAP={ # family -> [(newname, weight-range)]
 'David Libre':None,'Frank Ruhl Libre':[('PK9 Frank','300 500')],'Assistant':[('PK9 Assistant','200 600')],
 'Heebo':[('PK9 Heebo','100 500'),('PK9 HeeboU','100 600')],'Noto Sans Hebrew':[('PK9 Noto','100 600')],'Rubik':[('PK9 Rubik','300 500'),('PK9 RubikU','300 500')]}
css=[]
for fam,w,src,ur,sub in faces:
    if fam=='David Libre':
        css.append("@font-face{font-family:'PK9 David';font-style:normal;font-weight:%s;font-display:swap;src:%s format('woff2');unicode-range:%s}"%('100 450' if w=='400' else '451 1000',src,ur))
    else:
        for nn,rg in MAP[fam]:
            css.append("@font-face{font-family:'%s';font-style:normal;font-weight:%s;font-display:swap;src:%s format('woff2');unicode-range:%s}"%(nn,rg,src,ur))
FONTCSS='\n'.join(css)+'''
body.pk9f-d5,body.pk9f-fr,body.pk9f-as,body.pk9f-hb,body.pk9f-rb{font-synthesis-weight:none;font-synthesis:none}
body.pk9f-d5{--pk-disp:'PK9 David','David Libre',serif!important;--serif:'PK9 David','David Libre',serif!important;--pk-ui:'PK9 Noto','Noto Sans Hebrew',sans-serif!important;--sans:'PK9 Noto','Noto Sans Hebrew',sans-serif!important}
body.pk9f-fr{--pk-disp:'PK9 Frank','Frank Ruhl Libre',serif!important;--serif:'PK9 Frank','Frank Ruhl Libre',serif!important;--pk-ui:'PK9 Noto','Noto Sans Hebrew',sans-serif!important;--sans:'PK9 Noto','Noto Sans Hebrew',sans-serif!important}
body.pk9f-as{--pk-disp:'PK9 Assistant','Assistant',sans-serif!important;--serif:'PK9 Assistant','Assistant',sans-serif!important;--pk-ui:'PK9 Assistant','Assistant',sans-serif!important;--sans:'PK9 Assistant','Assistant',sans-serif!important}
body.pk9f-rb{--pk-disp:'PK9 Rubik','Rubik',sans-serif!important;--serif:'PK9 Rubik','Rubik',sans-serif!important;--pk-ui:'PK9 RubikU','Rubik',sans-serif!important;--sans:'PK9 RubikU','Rubik',sans-serif!important}
body.pk9f-hb{--pk-disp:'PK9 Heebo','Heebo',sans-serif!important;--serif:'PK9 Heebo','Heebo',sans-serif!important;--pk-ui:'PK9 HeeboU','Heebo',sans-serif!important;--sans:'PK9 HeeboU','Heebo',sans-serif!important}
'''
def rd(p): return open(p,encoding='utf-8').read()
CSS=['core.css','entry.css','face.css','word.css','pdf.css','brain.css','fun.css','pack.css','login_lite.css']
import glob
JS=['core.js','entry.js','word.js','pdf.js','brain.js','fun.js','login_lite.js','logout.js']+sorted(os.path.basename(x) for x in glob.glob('src/pack_*.js'))
add=('<script>window.PK9_PROD=true;</script>\n' if PROD else '')+'<style id="pk9-css">\n'+FONTCSS+'\n'+'\n'.join(rd('src/'+f) for f in CSS if os.path.exists('src/'+f))+'\n</style>\n'
for f in JS:
    if os.path.exists('src/'+f): add+='<script id="pk9-'+f.replace('.js','')+'">\n'+rd('src/'+f)+'\n</script>\n'
import base64
add='<script id="pk9-pdflib">'+rd('vendor/package/dist/pdf-lib.min.js').replace('</script','<\\/script')+'</script>\n<script id="pk9-sample-pdf" type="application/pdf-base64">'+base64.b64encode(open('sample.pdf','rb').read()).decode()+'</script>\n'+add
s=rd(BASE); i=s.rfind('</body>')
s=s[:i]+add+s[i:]
s=s.replace('<title>','<title>דמו · ',1) if not PROD else s
open(OUT,'w',encoding='utf-8').write(s); print('built',OUT,len(s))
