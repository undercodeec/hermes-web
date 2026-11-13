import test from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroPointer, attachHeroPointerBridge } from '../src/app/hero-pointer-bridge.mjs';

test('mapping inverts translation, negative offset and scale; clips to inner viewport', () => {
  const rect = { left: -120, top: 230, width: 1100, height: 440 };
  assert.deepEqual(mapHeroPointer({clientX:430,clientY:450},rect,1000,400), {clientX:500,clientY:200});
  assert.deepEqual(mapHeroPointer({clientX:-999,clientY:999},rect,1000,400), {clientX:0,clientY:400});
  assert.equal(mapHeroPointer({clientX:0,clientY:0},{...rect,width:0},1000,400),null);
  assert.equal(mapHeroPointer({clientX:NaN,clientY:0},rect,1000,400),null);
});

class Target {
  listeners = new Map();
  addEventListener(type, fn, options) { assert.equal(options.passive,true); assert.equal(options.capture,true); this.listeners.set(type,fn); }
  removeEventListener(type, fn) { assert.equal(this.listeners.get(type),fn); this.listeners.delete(type); }
  fire(type, event = {}) { this.listeners.get(type)?.(event); }
}
function fixture() {
  const outer=new Target(), hero=new Target(), jobs=new Map(), events=[];
  let id=0, failures=0;
  outer.requestAnimationFrame=(fn)=>{jobs.set(++id,fn);return id;};
  outer.cancelAnimationFrame=(id)=>jobs.delete(id);
  hero.ownerDocument={defaultView:outer};
  const view={innerWidth:1000,innerHeight:400,MouseEvent:class {constructor(type,init){this.type=type;Object.assign(this,init);}},dispatchEvent:e=>events.push(e)};
  const frame={contentWindow:view,getBoundingClientRect:()=>({left:100,top:200,width:1100,height:440})};
  const stop=attachHeroPointerBridge(hero,frame,()=>failures++);
  const flush=()=>{const work=[...jobs.values()];jobs.clear();work.forEach(fn=>fn());};
  const move=(x,y,extra={})=>hero.fire('pointermove',{clientX:x,clientY:y,pointerType:'mouse',buttons:0,...extra});
  return {outer,hero,jobs,events,view,frame,stop,flush,move,get failures(){return failures;}};
}

test('coalesces text/CTA hover into one RAF and forwards only mousemove to receiving window',()=>{
  const f=fixture();
  f.move(200,250);f.move(650,420);
  assert.equal(f.jobs.size,1);
  f.hero.fire('pointerleave',{target:{}});assert.equal(f.jobs.size,1);
  f.flush();
  assert.equal(f.events.length,1);
  assert.equal(f.events[0].type,'mousemove');
  assert.equal(f.events[0].view,f.view);
  assert.equal(f.events[0].clientX,500);assert.equal(f.events[0].clientY,200);
  f.move(760,464);f.flush();
  assert.equal(f.events[1].movementX,100);assert.equal(f.events[1].movementY,40);
  f.move(0,0,{pointerType:'touch'});f.move(0,0,{pointerType:'pen'});f.move(0,0,{buttons:1});
  assert.equal(f.jobs.size,0);
  assert.deepEqual([...f.hero.listeners.keys()],['pointermove','pointerleave','pointercancel']);
  assert.ok(!f.outer.listeners.has('wheel'));f.stop();
});

test('leave cancels pending work, centers targets and zeros the final cones delta',()=>{
  const f=fixture();f.move(210,310);f.flush();f.move(400,400);
  f.hero.fire('pointerleave',{target:f.hero});assert.equal(f.jobs.size,0);
  assert.equal(f.events.length,3);
  assert.equal(f.events[1].clientX,500);assert.equal(f.events[1].clientY,200);
  assert.equal(f.events[2].movementX,0);assert.equal(f.events[2].movementY,0);
  f.hero.fire('pointerleave',{target:f.hero});assert.equal(f.events.length,3);f.stop();
});

test('scroll/blur/resize reset once; disposal removes all listeners and RAF idempotently',()=>{
  const f=fixture();f.move(220,220);f.flush();f.outer.fire('scroll');
  assert.equal(f.events.length,3);f.outer.fire('blur');f.outer.fire('resize');assert.equal(f.events.length,3);
  f.move(330,330);const queued=[...f.jobs.values()];f.stop();f.stop();
  assert.equal(f.jobs.size,0);assert.equal(f.hero.listeners.size,0);assert.equal(f.outer.listeners.size,0);
  queued.forEach(fn=>fn());assert.equal(f.events.length,3);
});

test('same-origin access failures invoke fallback; cleanup still works',()=>{
  const f=fixture();Object.defineProperty(f.frame,'contentWindow',{get(){throw Error('unavailable');}});
  f.move(200,300);f.flush();assert.equal(f.failures,1);assert.equal(f.events.length,0);f.stop();
});
