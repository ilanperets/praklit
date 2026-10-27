import asyncio,os,sys,json
from playwright.async_api import async_playwright
PROXY=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
SIZES={'desk':(1440,900),'phone':(390,844),'ipad':(1024,768)}
async def session(path,steps,size='desk',prefix='s_',persona='student',login=True,full=False):
    out={};errs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(proxy={'server':PROXY} if PROXY else None)
        W,H=SIZES[size]
        ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=1 if size=='desk' else 2,ignore_https_errors=True)
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
        pg.on('console',lambda m: errs.append('console:'+m.text[:200]) if m.type=='error' else None)
        await pg.goto('file://'+path); await pg.wait_for_timeout(2500)
        if login:
            await pg.evaluate("""async(per)=>{ if(currentUser())return; var e=authSignup('demo_'+per+Math.floor(Math.random()*1e4),'דנה כהן','1234',per); await enterApp(); }""",persona)
            await pg.wait_for_timeout(4500)
        for name,js in steps:
            if js is None:
                await pg.screenshot(path=prefix+name+'.png',full_page=full)
            elif name.startswith('_'):
                await pg.evaluate(js); await pg.wait_for_timeout(500)
            elif name.startswith('click:'):
                await pg.click(js); await pg.wait_for_timeout(500)
            else:
                out[name]=await pg.evaluate(js)
        await b.close()
    return out,errs
if __name__=='__main__':
    path=sys.argv[1]
    o,e=asyncio.run(session(path,[('dash',None)],prefix='base_'))
    print(e[:10])
