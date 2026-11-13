import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const component=readFileSync(new URL('../src/app/hero-canvas.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app/globals.css',import.meta.url),'utf8');
test('source contract: unavailable bridge status invokes existing terminal failure',()=>{
 assert.match(component,/frame.dataset.scrollBridge = value;\s*if \(value === 'unavailable'\) fail\(\);/);
 assert.match(component,/if \(disposed\) return;\s*disposed = true;\s*stopPolling\(\);\s*detachSceneListeners\(\);\s*setStatus\(["']failed["']\);\s*onFailure\(true\)/);
});
test('source contract: terminal return preserves host and uses compact nonsticky fallback',()=>{
 assert.ok(component.includes(`failed ? ' is-failed' : ''`));
 assert.ok(component.indexOf('if (returning) return')>component.lastIndexOf('}, [returning]);'));
 assert.match(css,/\.canvas-return-track\.is-failed\s*\{\s*height: 64px;/);
 assert.match(css,/\.canvas-return-track\.is-failed \.canvas-return-sticky\s*\{\s*position: relative; height: 100%;/);
});
