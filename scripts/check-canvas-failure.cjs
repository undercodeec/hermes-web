// Fault injection affects the iframe DOM getter in this browser only, not assets/runtime.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const watchdog=setTimeout(()=>{console.error('Fixture exceeded 70s');process.exit(1);},70000);
 const browser=await chromium.launch({executablePath:'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.PREVIEW_URL||'http://localhost:3000');
  const failBridge=async selector=>{
   await page.waitForFunction(selector=>document.querySelector(selector)?.dataset.scrollBridge==='ready',selector,{timeout:25000});
   await page.evaluate(selector=>{const frame=document.querySelector(selector);Object.defineProperty(frame,'contentWindow',{get(){throw Error('fixture bridge access denied');}});window.dispatchEvent(new Event('scroll'));},selector);
   await page.waitForFunction(selector=>!document.querySelector(selector),selector,{timeout:5000});
  };
  await failBridge('.hero iframe');
  await page.locator('.canvas-return-track').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await failBridge('.canvas-return-track iframe');
  const compact=await page.locator('.canvas-return-track').evaluate(e=>({height:e.offsetHeight,sticky:getComputedStyle(e.firstElementChild).position,failed:e.classList.contains('is-failed')}));assert.deepEqual(compact,{height:64,sticky:'relative',failed:true});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.canvas-return-track').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
  await page.emulateMedia({reducedMotion:'reduce'});await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(400);
  assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('.canvas-return-track').evaluate(e=>e.offsetHeight),64);assert.deepEqual(errors,[]);
  const result={date:'2026-11-10',scope:'Implementer fault-injected Chromium, not independent QA or visual approval',status:'passed',fault:'iframe contentWindow getter denied after bridge ready; bridge emits unavailable',heroRemoved:true,returnRemoved:true,compact,latchedAfterRevisitAndMediaChange:true,errors};
  fs.writeFileSync('/workspace/docs/canvas-transfer/FAILURE-FOCUSED-CHECK.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();clearTimeout(watchdog);}
})().catch(e=>{console.error(e);process.exit(1)});
