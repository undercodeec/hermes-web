import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { searchLiteral } from '../plugins/oc07-search/search.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'oc07-'));
  await mkdir(join(root, 'src'));
  await mkdir(join(root, '.oc07'));
  await writeFile(join(root, 'src', 'page.jsx'), 'alpha\nA.B\nalpha\n');
  await writeFile(join(root, 'src', '.env'), 'alpha');
  await writeFile(join(root, 'src', 'secret-token.txt'), 'alpha');
  await mkdir(join(root, 'src', 'clientes'));
  await writeFile(join(root, 'src', 'clientes', 'data.txt'), 'alpha');
  await writeFile(join(root, 'src', 'large.txt'), 'alpha'.repeat(20000));
  return root;
}

test('returns literal path:line only, with no source text', async () => {
  const root = await fixture();
  assert.deepEqual(await searchLiteral({ root, query: 'A.B' }), ['src/page.jsx:2']);
  assert.deepEqual(await searchLiteral({ root, query: 'missing' }), []);
  assert.deepEqual(await searchLiteral({ root, query: 'alpha', maxMatches: 1 }), ['src/page.jsx:1']);
});

test('rejects empty, absolute, traversal, and external directories', async () => {
  const root = await fixture();
  for (const query of ['', '   ']) await assert.rejects(searchLiteral({ root, query }));
  for (const directory of ['../src', '/src', 'C:/src', '//server/share', 'backend', 'src/../src']) {
    await assert.rejects(searchLiteral({ root, query: 'alpha', directory }));
  }
});

test('skips sensitive, large, linked and nested dependency files', async () => {
  const root = await fixture();
  const outside = await mkdtemp(join(tmpdir(), 'oc07-outside-'));
  await writeFile(join(outside, 'external.txt'), 'alpha');
  await mkdir(join(root, 'src', 'node_modules'));
  await writeFile(join(root, 'src', 'node_modules', 'dependency.js'), 'alpha');
  try { await symlink(outside, join(root, 'src', 'linked'), 'junction'); } catch { /* unavailable on this host */ }
  assert.deepEqual(await searchLiteral({ root, query: 'alpha' }), ['src/page.jsx:1', 'src/page.jsx:3']);
});

test('rejects a nested directory reached through a link', async (t) => {
  const root = await fixture();
  await mkdir(join(root, 'src', 'nested'));
  await writeFile(join(root, 'src', 'nested', 'data.txt'), 'alpha');
  try { await symlink(join(root, 'src'), join(root, 'src', 'alias'), 'junction'); }
  catch { t.skip('junction creation unavailable'); return; }
  await assert.rejects(searchLiteral({ root, query: 'alpha', directory: 'src/alias/nested' }));
});

test('respects file cap and rejects invalid limits', async () => {
  const root = await fixture();
  await writeFile(join(root, 'src', 'aaa.txt'), 'nothing');
  assert.deepEqual(await searchLiteral({ root, query: 'alpha', maxFiles: 1 }), []);
  await assert.rejects(searchLiteral({ root, query: 'alpha', maxMatches: 0 }));
});
