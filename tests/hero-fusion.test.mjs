import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('all hero breakpoint rules preserve the borderless shadow-free fusion', () => {
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
  const blocks = [...css.matchAll(/(?:^|\n)\s*\.hero\s*\{([^}]*)\}/g)].map(match => match[1]);
  assert.ok(blocks.length >= 3, 'inspect base, mobile and desktop rules');
  assert.match(blocks[0], /border-radius:\s*0\s*;/);
  assert.match(blocks[0], /border-bottom:\s*0\s*;/);
  assert.match(blocks[0], /box-shadow:\s*none\s*;/);
  for (const block of blocks) {
    for (const [, property, value] of block.matchAll(/(border(?:-[a-z-]+)?|box-shadow)\s*:\s*([^;]+);/g)) {
      assert.ok(/^(?:0(?:px)?|none)$/.test(value.trim()), property + ' must not reintroduce a visible hero edge: ' + value);
    }
  }
});
