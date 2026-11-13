const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:810,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.PREVIEW_URL||'http://localhost:3000');
 const f=page.locator('figure.primary-preview');await f.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('figure.primary-preview').dataset.active==='true',null,{timeout:10000});
 await page.evaluate(()=>{window.samples=[];const f=document.querySelector('figure.primary-preview');new MutationObserver(()=>{const t=Number(f.dataset.elapsed);window.samples.push({t,run:Number(f.dataset.run),rows:f.querySelectorAll('[data-contact-id]').length,selected:f.dataset.story,messages:f.querySelectorAll('[data-message-id]').length});}).observe(f,{attributes:true,childList:true,subtree:true});});
 await page.waitForFunction(()=>Number(document.querySelector('figure.primary-preview').dataset.elapsed)>10000,null,{timeout:15000});
 await f.locator('[data-contact-id=mateo]').click();
 await page.waitForFunction(()=>Number(document.querySelector('figure.primary-preview').dataset.elapsed)>49000,null,{timeout:45000});
 const samples=await page.evaluate(()=>window.samples);
 for(const s of samples.filter(s=>s.run===0))assert.equal(s.rows,1+[8150,15550,22950,30350,37750].filter(t=>s.t>=t).length);
 assert.ok(samples.some(s=>s.run===1&&s.rows===6));assert.equal(await f.getAttribute('data-story'),'mateo');assert.equal(await f.locator('[data-message-id]').count(),4);
 const bell=f.getByRole('button',{name:/Notificaciones:/});await bell.click();assert.equal(await bell.getAttribute('aria-expanded'),'true');assert.ok(!(await f.locator('[data-notification-id]').allTextContents()).some(s=>s.includes(' ? ')));
 await f.locator('[data-notification-id=sofia]').focus();await page.keyboard.press('Escape');assert.equal(await bell.getAttribute('aria-expanded'),'false');assert.ok(await bell.evaluate(e=>e===document.activeElement));
 await f.getByRole('checkbox',{name:'Vista estática'}).check();const frozen=await f.getAttribute('data-elapsed');await page.waitForTimeout(300);assert.equal(await f.getAttribute('data-elapsed'),frozen);assert.equal(await f.locator('[data-contact-id]').count(),6);assert.equal(await f.locator('[data-typing]').count(),0);
 const responsive=[];for(const width of [320,640,810,1440]){await page.setViewportSize({width,height:800});responsive.push({width,overflow:await f.evaluate(e=>e.scrollWidth-e.clientWidth)});assert.ok(responsive.at(-1).overflow<=1);}
 const reducedMotion=await require('./check-inbox-reduced.cjs').checkReducedInbox(browser,process.env.PREVIEW_URL||'http://localhost:3000');assert.deepEqual(errors,[]);
 const result={date:'2026-11-10',scope:'Implementer focused real-time Chromium, not independent QA or visual approval',status:'passed',browser:await browser.version(),activeTime:49000,sampleCount:samples.length,reducedMotion,rowTransitions:samples.filter((s,i)=>!i||s.rows!==samples[i-1].rows),responsive,errors,checks:['rows appear sequentially at new timestamps','six rows retained across cycle','manual selection and four-message bounded history retained','notification separator, Escape and focus restoration','explicit static freeze, no typing','isolated reduced motion without static setting; static responsive no horizontal overflow']};
 fs.writeFileSync('/workspace/docs/primary-preview/SEQUENTIAL-FOCUSED-CHECK.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
