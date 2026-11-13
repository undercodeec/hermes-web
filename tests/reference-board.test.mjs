import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createBoard, moveLead, nominalTotal, canAdvance, chooseRandomMove, anchorInRegion, separateCoincident } from "../src/app/reference-board-motion.mjs";

const component = readFileSync(new URL("../src/app/reference-board.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/reference-board.module.css", import.meta.url), "utf8");

test("reference board assets exist and scroll regions are keyboard-focusable", () => {
  const logos = [...component.matchAll(/"([a-zA-Z0-9]+\.(?:webp|png))"\]/g)].map(match => match[1]);
  assert.equal(logos.length, 14);
  for (const logo of logos) assert.ok(existsSync(new URL(`../public/board-reference/logos/${logo}`, import.meta.url)), logo);
  for (const name of ["jamie", "brian", "joe", "ray"]) assert.ok(existsSync(new URL(`../public/board-reference/avatars/${name}.webp`, import.meta.url)), name);
  assert.match(component, /className=\{styles\.board\} tabIndex=\{0\} role="region"/);
  assert.match(component, /className=\{styles\.cards\} tabIndex=\{0\} role="region"/);
  assert.match(css, /\.board:focus-visible,\.cards:focus-visible/);
});

test("board change leaves primary preview and hero canvas in place", () => {
  const page = readFileSync(new URL("../src/app/page.jsx", import.meta.url), "utf8");
  assert.match(page, /if \(main\) return <PrimaryPreview \/>;/);
  assert.equal((page.match(/<HeroCanvas \/>/g) || []).length, 1);
  assert.doesNotMatch(page, /<HeroCanvas returning/);
  assert.match(page, /<ReferenceBoard \/>/);
});

test("mobile miniature is decorative and a readable keyboard-accessible board remains available", () => {
  assert.match(component, /className=\{styles\.mobileIllustration\} aria-hidden="true"/);
  assert.match(component, /<details className=\{styles\.accessibleBoard\}>/);
  assert.match(component, /<summary>Ver tablero ampliado y accesible<\/summary>/);
  assert.match(component, /ghost\.animate/);
  assert.doesNotMatch(css, /@keyframes|animation\s*:/);
  assert.ok(component.indexOf('["Loops"') < component.indexOf('["Footprint"'));
  assert.ok(component.indexOf('["Footprint"') < component.indexOf('["Stripe"'));
});

test("seeded random moves preserve identity and totals without emptying or overfilling stages", () => {
  const initial = [4, 3, 5, 2].map((size, column) => ({ cards: Array.from({ length: size }, (_, i) => [`${column}-${i}`, `$${(column + 1) * 100} anual`]) }));
  const all = value => value.flatMap(column => column.cards.map(card => card[0])).sort();
  const originalIds = all(initial), originalTotal = initial.reduce((sum, column) => sum + nominalTotal(column.cards), 0);
  const run = seed => {
    let state = seed >>> 0, board = createBoard(initial), last = null;
    const rng = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32);
    const trace = [], destinations = new Set(), leads = new Set(), jumps = new Set();
    for (let i = 0; i < 3000; i++) {
      const move = chooseRandomMove(board, last, rng);
      assert.ok(move); assert.notEqual(move.id, last); assert.notEqual(move.source, move.target);
      assert.ok(board[move.source].cards.some(card => card[0] === move.id));
      const next = moveLead(board, move.id, move.target);
      assert.equal(next.findIndex(column => column.cards.some(card => card[0] === move.id)), move.target);
      assert.deepEqual(all(next), originalIds);
      assert.equal(next.reduce((sum, column) => sum + nominalTotal(column.cards), 0), originalTotal);
      assert.ok(next.every(column => column.cards.length >= 1 && column.cards.length <= 6));
      destinations.add(move.target); leads.add(move.id); jumps.add((move.target - move.source + board.length) % board.length); trace.push(`${move.id}:${move.target}`); last = move.id; board = next;
    }
    assert.equal(destinations.size, 4);
    assert.equal(leads.size, 14);
    assert.deepEqual([...jumps].sort(), [1, 2, 3]);
    assert.equal(moveLead(board, "inexistente", 0), board);
    assert.equal(moveLead(board, board[0].cards[0][0], 0), board);
    return trace;
  };
  const first = run(42);
  assert.deepEqual(first, run(42));
  assert.notDeepEqual(first, run(43));
  assert.deepEqual(initial.map(column => column.cards.length), [4, 3, 5, 2]);
});

test("random selection handles limited candidates and distinct destinations", () => {
  const board = [{ cards: [["A", "$1"], ["B", "$2"]] }, { cards: [["C", "$3"]] }, { cards: [["D", "$4"]] }];
  const left = chooseRandomMove(board, "A", () => 0);
  const right = chooseRandomMove(board, "A", () => .999);
  assert.equal(left.id, "B"); assert.equal(right.id, "B");
  assert.equal(left.target, 1); assert.equal(right.target, 2);
  assert.equal(chooseRandomMove([{ cards: [] }, { cards: [] }], null, () => 0), null);
});

test("pause, hidden tab, offscreen and reduced motion prevent automatic movement", () => {
  const playing = { visible: true, hidden: false, reduced: false, paused: false };
  assert.equal(canAdvance(playing), true);
  for (const override of [{ visible: false }, { hidden: true }, { reduced: true }, { reduced: null }, { paused: true }]) assert.equal(canAdvance({ ...playing, ...override }), false);
});

test("clipped endpoints anchor inside the visible board region", () => {
  const region = { left: 100, right: 600, top: 30, bottom: 400 };
  assert.deepEqual(anchorInRegion({ left: 220, top: 120 }, region, 120, 80), { left: 220, top: 120 });
  assert.deepEqual(anchorInRegion({ left: -300, top: -20 }, region, 120, 80), { left: 100, top: 30 });
  assert.deepEqual(anchorInRegion({ left: 1000, top: 800 }, region, 120, 80), { left: 480, top: 320 });
  assert.deepEqual(separateCoincident({ left: 480, top: 320 }, { left: 480, top: 320 }, region, 120, 80), { left: 462, top: 320 });
  assert.deepEqual(separateCoincident({ left: 150, top: 100 }, { left: 220, top: 100 }, region, 120, 80), { left: 150, top: 100 });
});

test("hidden or closed details do not create outside-body motion ghosts", () => {
  assert.match(component, /surface\.closest\("details:not\(\[open\]\)"\)/);
  assert.match(component, /style\.display === "none"/);
  assert.match(component, /layer\.appendChild\(ghost\)/);
  assert.doesNotMatch(component, /document\.body\.appendChild\(ghost\)/);
  assert.match(component, /host\.addEventListener\("toggle", cancel, true\)/);
  assert.match(component, /window\.addEventListener\("resize", cancel\)/);
  assert.match(css, /\.motionLayer\s*\{[^}]*overflow:hidden/);
});

test("small secondary text meets 4.5:1 on its board backgrounds", () => {
  function luminance(hex) {
    const rgb = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
    return rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  }
  for (const [fg, bg] of [["#596273", "#ffffff"], ["#596273", "#f1f7ff"], ["#596273", "#f0faf3"], ["#596273", "#fff5f5"], ["#505969", "#ffffff"]]) {
    assert.ok((luminance(bg) + .05) / (luminance(fg) + .05) >= 4.5, `${fg} on ${bg}`);
  }
});
