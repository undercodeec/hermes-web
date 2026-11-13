// Deterministic local-copy patch. Source archive and upstream Intercom neutralization are untouched.
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const hash = value => createHash('sha256').update(value).digest('hex');
export function zipTheme() {
 const zip = readFileSync(new URL('../hermes-canvas-transfer-001-2026-11-10.zip', import.meta.url));
 if(hash(zip)!=='98fd988b3ca3662beaa83caf097d06a22bdc070eb2fd304cdd6c56e6e533a808') throw Error('Archive changed');
 const matches=[];
 for(let p=0;p<zip.length-46;p++) {
  if(zip.readUInt32LE(p)!==0x02014b50) continue;
  const name=zip.subarray(p+46,p+46+zip.readUInt16LE(p+28)).toString().replaceAll('\\','/');
  if(name!=='demos/dala/js/theme.js') continue;
  const offset=zip.readUInt32LE(p+42),start=offset+30+zip.readUInt16LE(offset+26)+zip.readUInt16LE(offset+28);
  const data=zip.subarray(start,start+zip.readUInt32LE(p+20));
  matches.push(zip.readUInt16LE(p+10)===8?inflateRawSync(data):data);
 }
 if(matches.length!==1 || hash(matches[0])!=='15d3adb4ad6450142a5fdfea7ab7d533a4055bc1590d2e2aec3a68cef259a8f8') throw Error('Unexpected baseline');
 return matches[0].toString();
}
export const patches=[
 {before:'this.globalUniforms.uTime.value=e,this._updateCamera()',after:'Number.isFinite(u.hermesHeroProgress)&&(u.sectionProgress=u.hermesHeroProgress,u.hermesHeroRenderedProgress=u.sectionProgress),this.globalUniforms.uTime.value=e,this._updateCamera()'},
 {before:'u.WebGL.onEnterSite(),void 0/* HERMES-CANVAS-TRANSFER-001',after:'u.WebGL.onEnterSite(),Object.defineProperty(window,"__HERMES_HERO_SCROLL__",{value:Object.freeze({get ready(){return !!(u.WebGL._cones._loaded&&u.WebGL._cones._hasRendered)},setProgress(e){if("number"!==typeof e||!Number.isFinite(e))return false;return u.hermesHeroProgress=Math.max(0,Math.min(2.2,e)),true},get state(){const e=u.WebGL._cones;return Object.freeze({progress:u.hermesHeroRenderedProgress,explode:e._material.customUniforms[13].value,simulationExplode:e._simulationPos.material.uniforms.u_explode.value,springExplode:e._simulationSpring.material.uniforms.u_explode.value,hasRendered:e._hasRendered,time:u.WebGL.globalUniforms.uTime.value})}})}),void 0/* HERMES-CANVAS-TRANSFER-001'}
];
export function patchRuntime(source) {
 for(const {before,after} of patches) {
  if(source.split(before).length!==2) throw Error('Patch anchor must occur exactly once: '+before);
  source=source.replace(before,after);
 }
 return source;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const source=zipTheme(),result=patchRuntime(source);
 const destination=new URL('../public/demos/dala/js/theme.js',import.meta.url);
 const current=readFileSync(destination,'utf8');
 if(current!==source&&current!==result) throw Error('Refusing to overwrite unrelated edits');
 writeFileSync(destination,result);
 writeFileSync(new URL('../docs/canvas-transfer/SCROLL-RUNTIME-PATCH.json',import.meta.url),JSON.stringify({date:'2026-11-10',source:'hermes-canvas-transfer-001-2026-11-10.zip :: demos/dala/js/theme.js',destination:'public/demos/dala/js/theme.js',beforeSha256:hash(source),afterSha256:hash(result),patches,scope:'Local copy only; original renderer pipeline. Intercom neutralization remains intact. API frozen, no auth or network access.'},null,2)+'\n');
 console.log(hash(result));
}
