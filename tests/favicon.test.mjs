import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("Hermes favicon is a valid multi-resolution ICO including browser tab sizes", () => {
  const icon = readFileSync(new URL("../src/app/favicon.ico", import.meta.url));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  const count = icon.readUInt16LE(4);
  assert.equal(count, 6);
  const sizes = [];
  for (let i = 0; i < count; i++) {
    const entry = 6 + i * 16;
    const width = icon[entry] || 256, height = icon[entry + 1] || 256;
    const length = icon.readUInt32LE(entry + 8), offset = icon.readUInt32LE(entry + 12);
    assert.equal(width, height);
    assert.ok(offset >= 6 + count * 16 && offset + length <= icon.length);
    assert.deepEqual([...icon.subarray(offset, offset + 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(icon.readUInt32BE(offset + 16), width);
    assert.equal(icon.readUInt32BE(offset + 20), height);
    sizes.push(width);
  }
  assert.deepEqual(sizes.sort((a, b) => a - b), [16, 32, 48, 64, 128, 256]);
});
