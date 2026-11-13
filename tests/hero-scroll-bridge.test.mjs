import test from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroScroll, resolveOriginalScroll, attachHeroScrollBridge } from '../src/app/hero-scroll-bridge.mjs';
test('native hero geometry maps 0 to 2.2; explosion 1.1 starts halfway, clamp and invalid inputs',()=>{
 assert.equal(mapHeroScroll({top:90,height:700}),0);
 assert.ok(Math.abs(mapHeroScroll({top:-245,height:700})-1.1)<1e-8);
 assert.equal(mapHeroScroll({top:-490,height:700}),2.2);
 assert.equal(mapHeroScroll({top:-9999,height:700}),2.2);
 for(const rect of [{top:0,height:0},{top:NaN,height:700},{top:0,height:Infinity}])assert.equal(mapHeroScroll(rect),null);
});
class Target {
 listeners=new Map();
 addEventListener(t,fn,options) { if(t!=='load') assert.equal(options.passive,true); this.listeners.set(t,fn); }
 removeEventListener(t,fn) { assert.equal(this.listeners.get(t),fn);this.listeners.delete(t); }
 fire(t) {this.listeners.get(t)?.();}
}
function fixture(){
 const outer=new Target(),frame=new Target(),jobs=new Map(),intervals=new Map(),timeouts=new Map(),sent=[],states=[];let id=0;
 outer.requestAnimationFrame=fn=>{jobs.set(++id,fn);return id};outer.cancelAnimationFrame=id=>jobs.delete(id);
 outer.setInterval=fn=>{intervals.set(++id,fn);return id};outer.clearInterval=id=>intervals.delete(id);
 outer.setTimeout=fn=>{timeouts.set(++id,fn);return id};outer.clearTimeout=id=>timeouts.delete(id);
 const runtime={ready:false,setProgress:value=>{sent.push(value);return true}};
 frame.contentWindow={__HERMES_HERO_SCROLL__:runtime};
 const rect={top:-245,height:700},hero={ownerDocument:{defaultView:outer},getBoundingClientRect:()=>rect};
 const flush=()=>{const all=[...jobs.values()];jobs.clear();all.forEach(fn=>fn())};
 const stop=attachHeroScrollBridge(hero,frame,s=>states.push(s));
 return {outer,frame,jobs,intervals,timeouts,sent,states,stop,flush,rect,enable(){runtime.ready=true},noAPI(){delete frame.contentWindow.__HERMES_HERO_SCROLL__}};
}
test('delayed renderer readiness applies current native position; missing API times out once',()=>{
 const f=fixture();f.flush();assert.deepEqual(f.states,['waiting']);assert.equal(f.sent.length,0);
 f.enable();[...f.intervals.values()].forEach(fn=>fn());f.flush();assert.deepEqual(f.states,['waiting','ready']);assert.equal(f.intervals.size,0);assert.equal(f.timeouts.size,0);assert.ok(Math.abs(f.sent[0]-1.1)<1e-8);f.stop();
 const g=fixture();g.enable();g.noAPI();g.flush();assert.equal(resolveOriginalScroll(g.frame),null);[...g.timeouts.values()].forEach(fn=>fn());assert.equal(g.states.at(-1),'unavailable');g.outer.fire('scroll');assert.equal(g.jobs.size,0);g.stop();
});
test('passive deltas coalesce; resize/reload synchronize; cleanup cancels every callback',()=>{
 const f=fixture();f.enable();f.flush();f.rect.top=-490;
 f.outer.fire('scroll');f.outer.fire('scroll');assert.equal(f.jobs.size,1);f.flush();assert.equal(f.sent.at(-1),2.2);
 f.outer.fire('resize');assert.equal(f.timeouts.size,1);f.flush();[...f.timeouts.values()].forEach(fn=>fn());f.flush();
 f.frame.fire('load');assert.equal(f.states.at(-1),'waiting');f.flush();assert.equal(f.states.at(-1),'ready');
 f.outer.fire('scroll');const queued=[...f.jobs.values()];const count=f.sent.length;f.stop();f.stop();queued.forEach(fn=>fn());
 assert.equal(f.sent.length,count);assert.equal(f.jobs.size,0);assert.equal(f.intervals.size,0);assert.equal(f.timeouts.size,0);assert.equal(f.outer.listeners.size,0);assert.equal(f.frame.listeners.size,0);
});
test('remount sync, reverse scroll, and access failures',()=>{
 const f=fixture();f.enable();f.flush();f.rect.top=90;f.outer.fire('scroll');f.flush();assert.equal(f.sent.at(-1),0);f.stop();
 const g=fixture();g.rect.top=-490;g.enable();g.flush();assert.equal(g.sent.at(-1),2.2);g.stop();
 const h=fixture();Object.defineProperty(h.frame,'contentWindow',{get(){throw Error('blocked')}});h.flush();assert.equal(h.states.at(-1),'unavailable');h.stop();
});
