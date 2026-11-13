// Implementer browser regression. Real active time; no application/clock substitutions.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/tmp/hermes-browser/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/home/node/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const errors=[],consoleErrors=[],external=[],url=process.env.PREVIEW_URL||'http://localhost:3000';
 const result={scope:'Implementer technical regression, NOT independent QA or visual approval',duration:47400,date:'2026-11-10'};
 const setup=async options=>{const p=await browser.newPage(options);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});p.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('data:'))external.push(r.url())});await p.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));return p;};
 try {
  const ssr=await setup({javaScriptEnabled:false});await ssr.goto(url);assert.equal(await ssr.locator('figure.primary-preview [data-message-id]').count(),0);assert.equal(await ssr.locator('figure.primary-preview [data-contact-id]').count(),1);assert.equal(await ssr.locator('figure.primary-preview .chat-messages small').count(),0);await ssr.close();
  const page=await setup({viewport:{width:1440,height:1000}});await page.goto(url);
  await page.waitForFunction(()=>[...document.fonts].some(f=>f.family==='Inter'&&f.status==='loaded'));
  const f=page.locator('figure.primary-preview'),surface=f.locator('.glass-frame'),bell=f.getByRole('button',{name:/Notificaciones:/});
  const elapsed=()=>f.getAttribute('data-elapsed').then(Number),badge=()=>bell.locator('span').first().textContent().then(Number);
  const active=v=>page.waitForFunction(v=>document.querySelector('figure.primary-preview').dataset.active===v,String(v));
  await surface.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await active(true);
  // Capture every event, independent of the brief typing windows and browser driver latency.
  await page.evaluate(()=>{const f=document.querySelector('figure.primary-preview');window.__samples=[];let key='';const sample=()=>{const msgs=[...f.querySelectorAll('[data-message-id]')].map(m=>m.dataset.messageId),typing=f.querySelector('[data-typing]')?.dataset.typing??null,rows=f.querySelectorAll('[data-contact-id]').length;const k=[f.dataset.run,f.dataset.story,msgs.join(','),typing,rows].join(':');if(k===key)return;key=k;window.__samples.push({epoch:Number(f.dataset.run),selected:f.dataset.story,ids:msgs,typing,rows,t:Number(f.dataset.elapsed),height:f.getBoundingClientRect().height});};sample();new MutationObserver(sample).observe(f,{attributes:true,childList:true,subtree:true,characterData:true});});
  await f.locator('[data-contact-id="mateo"]').waitFor();await f.locator('[data-contact-id="mateo"]').click();
  assert.equal(await f.getAttribute('data-story'),'mateo');
  // Genuine hover and native focus never stop the clock.
  const r=await surface.boundingBox();await page.mouse.move(r.x+r.width/2,Math.max(20,r.y+100));await f.locator('[data-contact-id="mateo"]').focus();const hover=await elapsed();await page.waitForTimeout(1200);assert.ok(await elapsed()>hover+500,JSON.stringify({hover,after:await elapsed(),active:await f.getAttribute('data-active'),box:await f.boundingBox()}));await active(true);
  await page.waitForFunction(()=>document.querySelectorAll('figure.primary-preview [data-contact-id]').length===6);
  assert.equal(await f.getAttribute('data-story'),'mateo');
  const beforeOpen=await badge();await bell.click();assert.equal(await bell.getAttribute('aria-expanded'),'true');assert.ok(await badge()>=beforeOpen,'opening panel must not consume unread messages');
  await f.locator('[data-notification-id="sofia"]').focus();await page.keyboard.press('Escape');assert.equal(await bell.getAttribute('aria-expanded'),'false');assert.ok(await bell.evaluate(e=>e===document.activeElement));
  await bell.click();await f.locator('[data-notification-id="sofia"]').click();assert.equal(await f.getAttribute('data-story'),'sofia');assert.ok(await bell.evaluate(e=>e===document.activeElement));assert.equal(await bell.getAttribute('aria-expanded'),'false');
  await bell.click();await f.locator('.chat-title').click();assert.equal(await bell.getAttribute('aria-expanded'),'false');
  // Mark a row's published incoming messages read; no focus jumps on autoplay.
  await f.locator('[data-contact-id="andres"]').click();await f.locator('[data-contact-id="andres"]').focus();
  const focused=await page.evaluate(()=>document.activeElement.dataset.contactId);
  const beforeIncoming=await badge();await page.waitForFunction(n=>Number(document.querySelector('figure.primary-preview button[aria-controls=primary-notifications] span').textContent)>n,beforeIncoming,{timeout:65000});
  // Controlled hidden event (not an actual OS background tab).
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await active(false);const hidden=await elapsed();await page.waitForTimeout(700);assert.equal(await elapsed(),hidden);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await active(true);
  await f.evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().bottom+40,behavior:'instant'}));await active(false);const off=await elapsed();await page.waitForTimeout(700);assert.equal(await elapsed(),off);
  await surface.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await active(true);assert.ok(await elapsed()<off+300);
  await page.waitForFunction(()=>Number(document.querySelector('figure.primary-preview').dataset.elapsed)>44400);
  assert.equal(await f.locator('[data-message-id]').count(),4);
  const histories={};for(const id of ['lucia','mateo','sofia','diego','valentina','andres']){await f.locator(`[data-contact-id="${id}"]`).click();assert.equal(await f.locator('[data-message-id]').count(),4);histories[id]=await f.locator('[data-message-id]').allTextContents();assert.ok((await f.locator('.chat-title').textContent()).toLowerCase().includes(id==='andres'?'andrés':id==='lucia'?'lucía':id==='sofia'?'sofía':id));}
  // Keep Andrés chosen over the next boundary and first new arrivals.
  await f.locator('[data-contact-id="andres"]').focus();
  await page.waitForFunction(()=>Number(document.querySelector('figure.primary-preview').dataset.elapsed)>50500);
  assert.equal(await f.getAttribute('data-story'),'andres');assert.deepEqual(await f.locator('[data-message-id]').allTextContents(),histories.andres);assert.ok(await f.locator('[data-contact-id="andres"]').evaluate(e=>e===document.activeElement));
  const samples=await page.evaluate(()=>window.__samples);assert.ok(samples.some(s=>s.epoch===1));assert.ok(samples.filter(s=>s.epoch===1&&s.selected==='andres').every(s=>s.ids.length===4&&s.rows===6));for(const sample of samples.filter(s=>s.epoch===0))assert.equal(sample.rows,1+[8150,15550,22950,30350,37750].filter(t=>sample.t>=t).length);result.samples=samples;result.histories=histories;result.focusDuringAutoplay=focused;
  // Explicit static setting freezes clock and animation, exposes all histories.
  await f.getByRole('checkbox',{name:'Vista estática'}).check();await active(false);const stat=await elapsed();await page.waitForTimeout(400);assert.equal(await elapsed(),stat);assert.equal(await f.locator('[data-contact-id]').count(),6);assert.equal(await f.locator('[data-typing]').count(),0);
  const responsive=[];
  for(const [width,height]of [[320,480],[375,1000],[640,280],[810,1000],[1024,1000],[1440,1000]]){
   await page.setViewportSize({width,height});await f.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   const d=await f.evaluate(e=>{const messages=e.querySelector('.chat-messages'),mr=messages.getBoundingClientRect();return{overflow:e.scrollWidth-e.clientWidth,windowOverflow:e.querySelector('.crm-window').scrollWidth-e.querySelector('.crm-window').clientWidth,animations:e.getAnimations({subtree:true}).length,cropped:[...messages.children].some(b=>b.getBoundingClientRect().bottom>mr.bottom),minRowHeight:Math.min(...[...e.querySelectorAll('[data-contact-id]')].map(r=>r.getBoundingClientRect().height)),listDisplay:getComputedStyle(e.querySelector('.crm-list')).display};});
   assert.ok(d.overflow<=1,JSON.stringify({width,...d}));assert.ok(d.windowOverflow<=1);assert.equal(d.animations,0);assert.equal(d.cropped,false);assert.ok(d.minRowHeight>=44);assert.notEqual(d.listDisplay,'none');responsive.push({width,height,...d});
   for(const id of ['lucia','mateo','sofia','diego','valentina','andres']){await f.locator(`[data-contact-id="${id}"]`).click();assert.equal(await f.locator('[data-message-id]').count(),4);}
   if(width===375||width===1440)await f.screenshot({path:`/workspace/docs/primary-preview/SEQUENTIAL-STATIC-${width}.png`});
  }
  result.responsive=responsive;
  await page.setViewportSize({width:1440,height:1000});
  // All visible text, composited backgrounds; opacity checked separately.
  result.contrast=await f.evaluate(root=>{
   const rgba=s=>{const v=s.match(/[\d.]+/g).map(Number);return[v[0],v[1],v[2],v[3]??1]},over=(a,b)=>[0,1,2].map(i=>a[i]*a[3]+b[i]*(1-a[3])).concat(1);
   const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,b,i)=>a+b*[.2126,.7152,.0722][i],0);
   const rows=[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
   while(n=walker.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement,r=el.getBoundingClientRect();if(!r.width||!r.height||getComputedStyle(el).visibility==='hidden'||String(el.className).includes('srOnly'))continue;let bg=[255,255,255,1],chain=[];for(let p=el;p;p=p.parentElement)chain.unshift(p);for(const p of chain)bg=over(rgba(getComputedStyle(p).backgroundColor),bg);const fg=over(rgba(getComputedStyle(el).color),bg),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),opacity=chain.reduce((a,p)=>a*Number(getComputedStyle(p).opacity),1);rows.push({text:n.textContent.trim().slice(0,70),ratio,opacity});}return{min:Math.min(...rows.map(r=>r.ratio)),failures:rows.filter(r=>r.ratio<4.5||r.opacity<1),runs:rows.length};
  });assert.deepEqual(result.contrast.failures,[]);
  const reduce=await setup({reducedMotion:'reduce'});await reduce.addInitScript(()=>{window.__intervals=0;const original=window.setInterval;window.setInterval=(...args)=>{window.__intervals++;return original(...args)}});await reduce.goto(url);await reduce.waitForTimeout(400);assert.equal(await reduce.locator('figure.primary-preview [data-contact-id]').count(),6);assert.equal(await reduce.locator('figure.primary-preview [data-message-id]').count(),4);assert.equal(await reduce.evaluate(()=>window.__intervals),0);await reduce.close();
  assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);assert.deepEqual(external,[]);
  Object.assign(result,{status:'passed',browser:await browser.version(),pageErrors:errors,consoleErrors,externalRequests:external,clock:'real performance.now, 50ms interval; >50.5s active time',checks:['SSR one row and no published messages','six selectable chats; first arrivals accumulate rows','native focus/hover never freeze clock','bell open does not read; select reads; Escape restores focus; outside closes','incoming-only badge and per-chat panel','hidden controlled/offscreen freeze without reset/catchup','real round boundary preserves selection, focus, histories, six rows','static setting stops motion and clock; all six full histories accessible','fresh reduced-motion: zero intervals','responsive low/regular widths no overflow/crops; native rows >=44px','visible text computed contrast >=4.5; opacity 1','pageerror and console.error instrumented']});
  fs.writeFileSync('/workspace/docs/primary-preview/SEQUENTIAL-TECHNICAL-CHECK.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,samples:`${samples.length} samples`,histories:'six x four verified'},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
