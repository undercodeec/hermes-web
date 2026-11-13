// Implementer low-height regression; no source, clock or resource substitution.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const viewport=Number(process.env.LOW_WIDTH||320)===640?{width:640,height:280}:{width:320,height:480};
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const errors=[];
 try {
 const page=await browser.newPage({viewport,reducedMotion:'no-preference'});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));await page.goto(process.env.PREVIEW_URL||'http://localhost:3000');
 await page.waitForFunction(()=>[...document.fonts].some(f=>f.family==='Inter'&&f.status==='loaded'),null,{timeout:15000});
 const f=page.locator('figure.primary-preview'),elapsed=()=>f.getAttribute('data-elapsed').then(Number);
 const active=value=>page.waitForFunction(v=>document.querySelector('figure.primary-preview').dataset.active===v,String(value),{timeout:8000});
 // Deliberately leave cursor centered: scrolling demo under it is not a real pointer entry.
 await page.mouse.move(viewport.width/2,viewport.height/2);
 await f.evaluate(el=>{const r=el.getBoundingClientRect();scrollTo({top:scrollY+r.bottom-innerHeight*.7,behavior:'instant'})});await active(true);
 const surface=await f.evaluate(el=>{const r=el.getBoundingClientRect(),h=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(0,r.top));return {figureHeight:r.height,viewportHeight:innerHeight,wholeFigureRatio:h/r.height,availableSurfaceRatio:h/Math.min(r.height,innerHeight)}});
 assert.ok(surface.wholeFigureRatio<.35);assert.ok(surface.availableSurfaceRatio>.35);
 const before=await elapsed();await page.waitForTimeout(1600);assert.ok(await elapsed()>before+500,'stationary cursor must not suppress autoplay');
 await page.mouse.move(0,0);
 // Static setting is the explicit pause; native focus does not pause.
 await f.getByRole('checkbox',{name:'Vista estática'}).check();await active(false);const focused=await elapsed();await page.waitForTimeout(500);assert.equal(await elapsed(),focused);
 await f.getByRole('checkbox',{name:'Vista estática'}).uncheck();
 await f.evaluate(el=>{const r=el.getBoundingClientRect();scrollTo({top:scrollY+r.bottom-innerHeight*.7,behavior:'instant'})});await active(true);
 await page.waitForFunction(()=>document.querySelectorAll('figure.primary-preview [data-message-id]').length>=1,null,{timeout:8000});
 // Touch pointer movement must never create a sticky hover pause.
 await f.locator('.glass-frame').dispatchEvent('pointermove',{pointerType:'touch',clientX:10,clientY:10,movementX:1,movementY:1});await active(true);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await active(false);const off=await elapsed();await page.waitForTimeout(1500);assert.equal(await elapsed(),off);
 await f.evaluate(el=>{const r=el.getBoundingClientRect();scrollTo({top:scrollY+r.bottom-innerHeight*.7,behavior:'instant'})});await active(true);
 const returned=await elapsed();assert.ok(returned<off+500);await page.waitForTimeout(1200);assert.ok(await elapsed()>returned+500);
 const overflow=await f.evaluate(el=>el.scrollWidth-el.clientWidth);assert.ok(overflow<=1);assert.ok(await f.locator('[data-contact-id]').count()>=1);assert.deepEqual(errors,[]);
 const result={status:'passed',scope:'Implementer Chromium check, not independent QA',viewport,surface,focusedElapsed:focused,offscreenElapsed:off,returnElapsed:returned,errors,checks:['real font Inter loaded','autoplay at any intersection','stationary centered pointer after scroll does not pause','explicit static setting freezes and resumes','touch movement does not sticky-pause','offscreen pauses without catchup','selectable contacts and no overflow']};
 fs.writeFileSync('/workspace/docs/primary-preview/SEQUENTIAL-LOW-'+viewport.width+'x'+viewport.height+'.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
