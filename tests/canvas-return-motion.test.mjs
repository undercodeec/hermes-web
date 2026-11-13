import test from 'node:test';
import assert from 'node:assert/strict';
import {mapCanvasReturn} from '../src/app/canvas-return-motion.mjs';
test('return separates entry, travel, expansion; clamps and reverses geometry',()=>{
 const at=p=>mapCanvasReturn({top:1000-p*1180,height:1200},1000);
 assert.deepEqual(at(0),{phase:0,x:42,y:65,progress:0});
 assert.equal(at(.5).progress,0);assert.ok(at(.7).x<1e-8);
 assert.ok(at(.9).progress>1.1);assert.equal(at(1).progress,2.2);
 assert.deepEqual(at(.2),at(.2));assert.equal(at(-1).phase,0);assert.equal(at(2).phase,1);
 for(const rect of [{top:NaN,height:1200},{top:0,height:0}])assert.equal(mapCanvasReturn(rect,1000),null);
 assert.equal(mapCanvasReturn({top:0,height:1200},0),null);
});
