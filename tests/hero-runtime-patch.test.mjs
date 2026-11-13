import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {zipTheme,patchRuntime,patches,hash} from '../scripts/patch-hero-runtime.mjs';
test('ZIP reference -> unique deterministic patch; unrelated or duplicate anchors rejected',()=>{
 const source=zipTheme(),result=patchRuntime(source);
 assert.equal(result,readFileSync(new URL('../public/demos/dala/js/theme.js',import.meta.url),'utf8'));
 const manifest=JSON.parse(readFileSync(new URL('../docs/canvas-transfer/SCROLL-RUNTIME-PATCH.json',import.meta.url)));
 assert.equal(hash(result),manifest.afterSha256);assert.equal(hash(source),manifest.beforeSha256);
 assert.throws(()=>patchRuntime(result));assert.throws(()=>patchRuntime(source+patches[0].before));
 assert.match(result,/bootstrap externo desactivado solo en copia/);
 for(const shader of source.matchAll(/"[^"\n]*void main[^"\n]*"/g))assert.ok(result.includes(shader[0]));
});
test('scoped API immutable, finite numeric input only, clamps, read-only uniforms reflect original pipeline',()=>{
 const cones={_loaded:true,_hasRendered:true,_material:{customUniforms:Array.from({length:14},()=>({value:0}))},_simulationPos:{material:{uniforms:{u_explode:{value:.25}}}},_simulationSpring:{material:{uniforms:{u_explode:{value:.2}}}}};
 const context={window:{},u:{WebGL:{onEnterSite(){},_cones:cones,globalUniforms:{uTime:{value:1}}}}};
 const code=patches[1].after.split(',void 0/*')[0];vm.runInNewContext(code,context);
 const api=context.window.__HERMES_HERO_SCROLL__;assert.ok(api.ready);assert.ok(Object.isFrozen(api));assert.ok(Object.isFrozen(api.state));
 for(const x of [NaN,Infinity,-Infinity,'2',null,undefined,{}])assert.equal(api.setProgress(x),false);
 assert.equal(api.setProgress(-3),true);assert.equal(context.u.hermesHeroProgress,0);
 api.setProgress(30);assert.equal(context.u.hermesHeroProgress,2.2);api.setProgress(1.65);assert.equal(context.u.hermesHeroProgress,1.65);
 assert.equal(api.state.simulationExplode,.25);assert.throws(()=>{api.ready=false});assert.throws(()=>{context.window.__HERMES_HERO_SCROLL__={}});
});

test('real CLI is idempotent twice and refuses unrelated destination edits without touching sources',()=>{
 const root=mkdtempSync(join(tmpdir(),'hermes-runtime-cli-'));
 const sourceFiles=['../scripts/patch-hero-runtime.mjs','../hermes-canvas-transfer-001-2026-11-10.zip','../public/demos/dala/js/theme.js','../docs/canvas-transfer/SCROLL-RUNTIME-PATCH.json'].map(p=>new URL(p,import.meta.url));
 const originalHashes=sourceFiles.map(p=>hash(readFileSync(p)));
 try {
  for(const path of ['scripts','public/demos/dala/js','docs/canvas-transfer'])mkdirSync(join(root,path),{recursive:true});
  copyFileSync(sourceFiles[0],join(root,'scripts/patch-hero-runtime.mjs'));
  copyFileSync(sourceFiles[1],join(root,'hermes-canvas-transfer-001-2026-11-10.zip'));
  const destination=join(root,'public/demos/dala/js/theme.js'),manifest=join(root,'docs/canvas-transfer/SCROLL-RUNTIME-PATCH.json');
  writeFileSync(destination,zipTheme());
  const run=()=>spawnSync(process.execPath,[join(root,'scripts/patch-hero-runtime.mjs')],{cwd:root,encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);
  const patched=readFileSync(destination),firstManifest=readFileSync(manifest);
  assert.equal(patched.toString(),patchRuntime(zipTheme()));
  const second=run();assert.equal(second.status,0,second.stderr);assert.equal(second.stdout,first.stdout);
  assert.deepEqual(readFileSync(destination),patched);assert.deepEqual(readFileSync(manifest),firstManifest);
  const unrelated=Buffer.concat([patched,Buffer.from('\n/* unrelated destination work */\n')]);writeFileSync(destination,unrelated);
  const rejected=run();assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/Refusing to overwrite unrelated edits/);
  assert.deepEqual(readFileSync(destination),unrelated);assert.deepEqual(readFileSync(manifest),firstManifest);
 } finally {
  rmSync(root,{recursive:true,force:true});
  assert.deepEqual(sourceFiles.map(p=>hash(readFileSync(p))),originalHashes,'repository sources must remain unchanged');
 }
});
