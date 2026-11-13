// Isolated preference check: never enables the explicit static setting.
const fs=require('node:fs'),assert=require('node:assert/strict');
async function checkReducedInbox(browser,url) {
 const page=await browser.newPage({viewport:{width:810,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.addInitScript(()=>{window.__intervalCalls=0;const original=window.setInterval;window.setInterval=(...args)=>{window.__intervalCalls++;return original(...args);};});
  await page.goto(url);
  const f=page.locator('figure.primary-preview');await f.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelectorAll('figure.primary-preview [data-contact-id]').length===6,null,{timeout:10000});
  assert.equal(await f.getByRole('checkbox',{name:'Vista estática'}).isChecked(),false);
  assert.equal(await f.getAttribute('data-active'),'false');assert.equal(await f.getAttribute('data-static'),'true');
  assert.equal(await f.locator('[data-message-id]').count(),4);assert.equal(await f.locator('[data-typing]').count(),0);
  const elapsed=await f.getAttribute('data-elapsed');await page.waitForTimeout(500);assert.equal(await f.getAttribute('data-elapsed'),elapsed);
  assert.equal(await page.evaluate(()=>window.__intervalCalls),0);assert.equal(await page.locator('iframe').count(),0);
  const animations=await f.evaluate(e=>e.getAnimations({subtree:true}).length);assert.equal(animations,0);assert.deepEqual(errors,[]);
  return {status:'passed',isolatedPage:true,preference:'reduce',explicitStaticChecked:false,rows:6,messages:4,elapsed:Number(elapsed),typing:0,intervalCalls:0,animations,errors};
 }finally{await page.close();}
}
module.exports={checkReducedInbox};
if(require.main===module)(async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const browser=await chromium.launch({executablePath:'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
 try{const result={scope:'Implementer isolated Chromium, not independent QA or visual approval',date:'2026-11-10',...await checkReducedInbox(browser,process.env.PREVIEW_URL||'http://localhost:3000')};fs.writeFileSync('/workspace/docs/primary-preview/REDUCED-ISOLATED-CHECK.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
