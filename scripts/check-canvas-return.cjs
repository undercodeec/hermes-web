// Implementer technical check only; no visual approval or independent QA.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const wait=fn=>page.waitForFunction(fn,null,{timeout:25000});
 const inspect=()=>page.evaluate(()=>{const t=document.querySelector('.canvas-return-track'),b=t.querySelector('.return-brain'),f=b?.querySelector('iframe');return {top:t.getBoundingClientRect().top,height:t.offsetHeight,stickyTop:t.firstElementChild.getBoundingClientRect().top,frames:document.querySelectorAll('iframe').length,aria:t.getAttribute('aria-hidden'),pointer:getComputedStyle(t).pointerEvents,transform:b?.style.transform,progress:f?.contentWindow.__HERMES_HERO_SCROLL__?.state.progress,explode:f?.contentWindow.__HERMES_HERO_SCROLL__?.state.explode};});
 const position=phase=>page.evaluate(phase=>{const t=document.querySelector('.canvas-return-track'),r=t.getBoundingClientRect();scrollTo({top:scrollY+r.top-innerHeight+phase*(innerHeight+r.height*.15),behavior:'instant'});},phase);
 try {
 await page.goto(process.env.PREVIEW_URL||'http://localhost:3000');
 await wait(()=>document.querySelector('.hero iframe')?.dataset.scrollBridge==='ready');
 assert.equal(await page.locator('.canvas-return-track iframe').count(),0);
 await position(.45);await wait(()=>document.querySelector('.canvas-return-track iframe')?.dataset.scrollBridge==='ready');
 const entry=await inspect();assert.equal(entry.frames,1);assert.equal(entry.progress,0);assert.equal(entry.aria,'true');assert.equal(entry.pointer,'none');
 await position(.999);await wait(()=>document.querySelector('.canvas-return-track iframe')?.contentWindow.__HERMES_HERO_SCROLL__?.state.explode>.95);
 const exit=await inspect();assert.ok(exit.progress>2.18);assert.ok(Math.abs(exit.stickyTop)<1);assert.notEqual(entry.transform,exit.transform);
 await position(.5);await wait(()=>document.querySelector('.canvas-return-track iframe')?.contentWindow.__HERMES_HERO_SCROLL__?.state.explode<.05);
 const reverse=await inspect();assert.equal(reverse.progress,0);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await wait(()=>!document.querySelector('iframe'));
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await wait(()=>document.querySelector('.canvas-return-track iframe')?.dataset.scrollBridge==='ready');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await wait(()=>!document.querySelector('.canvas-return-track iframe'));await wait(()=>document.querySelector('.hero iframe')?.dataset.scrollBridge==='ready');assert.equal(await page.locator('iframe').count(),1);
 await page.emulateMedia({reducedMotion:'reduce'});await wait(()=>!document.querySelector('iframe'));assert.equal((await inspect()).height,0);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:900,height:800});await wait(()=>!document.querySelector('iframe'));assert.equal((await inspect()).height,0);
 await page.setViewportSize({width:1440,height:1000});await position(.5);await wait(()=>document.querySelector('.canvas-return-track iframe')?.dataset.scrollBridge==='ready');
 await page.evaluate(()=>document.querySelector('.canvas-return-track iframe').contentDocument.getElementById('canvas').dispatchEvent(new Event('webglcontextlost')));await wait(()=>!document.querySelector('.canvas-return-track iframe'));
 await position(.6);await page.waitForTimeout(400);assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('.canvas-return-track iframe').count(),0);assert.equal(await page.locator('.canvas-return-fallback').count(),1);assert.equal(await page.locator('.canvas-return-track').evaluate(e=>e.offsetHeight),64);
 assert.deepEqual(errors,[]);
 const result={date:'2026-11-10',scope:'Implementer technical Chromium, not independent QA or visual approval',status:'passed',browser:await browser.version(),entry,exit,reverse,checks:['deferred return, single runtime','original expansion and reverse','120vh stable track, sticky geometry','aria-hidden and no pointer hit test','controlled hidden unmount/remount','hero remount no simultaneous runtime','900px/reduced-motion zero track height and runtime','context loss latched fallback without retry'],errors};
 fs.writeFileSync('/workspace/docs/canvas-transfer/RETURN-TECHNICAL-CHECK.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
