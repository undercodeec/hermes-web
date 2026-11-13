import { test } from "node:test";
import assert from "node:assert/strict";
import { REVEAL_SELECTOR, isMeaningfullyVisible, revealEffect, startScrollReveal } from "../src/app/scroll-reveal.mjs";

function harness({ reduced = false, hash = "" } = {}) {
  const listeners = () => {
    const events = new Map();
    return { events, addEventListener(type, fn) { events.set(type, fn); }, removeEventListener(type, fn) { if (events.get(type) === fn) events.delete(type); }, fire(type, event = {}) { events.get(type)?.(event); } };
  };
  const media = { ...listeners(), matches: reduced };
  let instance;
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.nodes = new Set(); this.disconnects = 0; instance = this; }
    observe(node) { this.nodes.add(node); }
    unobserve(node) { this.nodes.delete(node); }
    disconnect() { this.nodes.clear(); this.disconnects++; }
    emit(node) { if (this.nodes.has(node)) this.callback([{ target: node, isIntersecting: true }]); }
  }
  const node = (name, top) => ({
    name, top, height: 30, calls: [], children: new Set(),
    getBoundingClientRect() { return { top: this.top, bottom: this.top + this.height, left: 0, right: 100 }; },
    contains(child) { return child === this || this.children.has(child); },
    animate(keyframes, options) { const animation = { canceled: false, cancel() { this.canceled = true; this.oncancel?.(); } }; this.calls.push({ keyframes, options, animation }); return animation; },
  });
  const initial = node("initial", 20), later = node("later", 900), anchor = node("anchor", 1400), focusChild = {};
  later.children.add(focusChild);
  const area = { contains: item => item === anchor };
  const hashTarget = { closest: () => area };
  const main = { contains: () => true };
  const doc = { ...listeners(), hidden: false, activeElement: null, querySelectorAll: () => [initial, later, anchor], querySelector: () => main, getElementById: id => id === "section" ? hashTarget : null };
  const win = { ...listeners(), IntersectionObserver: Observer, innerHeight: 600, innerWidth: 800, location: { hash }, matchMedia: () => media };
  return { win, doc, media, initial, later, anchor, focusChild, get observer() { return instance; } };
}

test("initial content remains unchanged; subsequent entries animate once without opacity", () => {
  const h = harness(); const cleanup = startScrollReveal(h.win, h.doc);
  assert.equal(h.observer.nodes.has(h.initial), false);
  assert.equal(h.observer.nodes.has(h.later), true);
  assert.equal(h.initial.calls.length, 0);
  assert.equal(h.observer.options.rootMargin, "-120px 0px -120px 0px");
  h.later.top = 400;
  h.observer.emit(h.later); h.observer.emit(h.later);
  assert.equal(h.later.calls.length, 1);
  assert.deepEqual(h.later.calls[0].keyframes, [{ transform: "translateY(24px)", offset: 0 }, { transform: "translateY(4px)", offset: 0.72 }, { transform: "translate(0, 0) scale(1)", offset: 1 }]);
  assert.equal(h.later.calls[0].options.duration, 760);
  assert.equal(h.later.calls[0].options.fill, "backwards");
  assert.doesNotMatch(REVEAL_SELECTOR, /board|hero|primary-preview/);
  cleanup(); assert.equal(h.later.calls[0].animation.canceled, true);
  assert.equal(h.doc.events.size, 0); assert.equal(h.win.events.size, 0); assert.equal(h.media.events.size, 0);
});

test("headings, text, side panels and cards use distinct bounded plans without opacity", () => {
  const parent = { children: [], classList: { contains: () => false } };
  const make = (type, left = 40, right = 350) => {
    const node = { parentElement: parent, matches: selectors => selectors.split(", ").includes(type), getBoundingClientRect: () => ({ left, right, top: 100, bottom: 200 }) };
    parent.children.push(node); return node;
  };
  const heading = revealEffect(make(".section-heading > h2"), 390);
  const text = revealEffect(make(".section-heading > p"), 390);
  const panel = revealEffect(make(".detail-row > .detail-copy", 8, 382), 390);
  assert.notEqual(heading.keyframes[0].transform, text.keyframes[0].transform);
  assert.equal(panel.keyframes[0].transform, "translate(-4px, 14px)");
  const cardsParent = { children: [], classList: { contains: () => false } };
  const cards = Array.from({ length: 3 }, () => {
    const card = { parentElement: cardsParent, matches: selectors => selectors.split(", ").includes(".features-grid > .feature-card"), getBoundingClientRect: () => ({ left: 16, right: 374, top: 100, bottom: 400 }) };
    cardsParent.children.push(card); return card;
  });
  const plans = cards.map(card => revealEffect(card, 390));
  assert.deepEqual(plans.map(plan => plan.options.delay), [0, 70, 140]);
  assert.match(plans[0].keyframes[0].transform, /scale\(0\.975\)/);
  for (const plan of [heading, text, panel, ...plans]) {
    assert.ok(plan.keyframes.every(frame => !("opacity" in frame)));
    assert.ok(plan.options.duration + plan.options.delay <= 1020);
  }
});

test("a pre-existing transform is not replaced by reveal", () => {
  const h = harness(); h.win.getComputedStyle = () => ({ transform: "matrix(1, 0, 0, 1, 10, 0)" });
  const cleanup = startScrollReveal(h.win, h.doc); h.later.top = 400; h.observer.emit(h.later);
  assert.equal(h.later.calls.length, 0); cleanup();
});

test("focus and reduced motion cancel even a delayed card reveal", () => {
  const h = harness();
  h.later.matches = selectors => selectors.split(", ").includes(".features-grid > .feature-card");
  h.later.parentElement = { children: [{}, {}, h.later], classList: { contains: () => false } };
  const cleanup = startScrollReveal(h.win, h.doc); h.later.top = 400; h.observer.emit(h.later);
  assert.equal(h.later.calls[0].options.delay, 140);
  h.doc.fire("focusin", { target: h.focusChild });
  assert.equal(h.later.calls[0].animation.canceled, true);
  cleanup();
  const reduced = harness();
  reduced.later.matches = h.later.matches;
  reduced.later.parentElement = { children: [{}, {}, reduced.later], classList: { contains: () => false } };
  const stop = startScrollReveal(reduced.win, reduced.doc); reduced.later.top = 400; reduced.observer.emit(reduced.later);
  reduced.media.matches = true; reduced.media.fire("change");
  assert.equal(reduced.later.calls[0].animation.canceled, true); stop();
});

test("focus and anchor navigation cancel or skip their animations", () => {
  const h = harness(); const cleanup = startScrollReveal(h.win, h.doc);
  h.later.top = 400;
  h.observer.emit(h.later); h.doc.fire("focusin", { target: h.focusChild });
  assert.equal(h.later.calls[0].animation.canceled, true);
  h.doc.fire("click", { target: { closest: () => ({ getAttribute: () => "#section" }) } });
  assert.equal(h.observer.nodes.has(h.anchor), false);
  h.observer.emit(h.anchor); assert.equal(h.anchor.calls.length, 0);
  cleanup();
  const anchored = harness({ hash: "#section" }); const stop = startScrollReveal(anchored.win, anchored.doc);
  assert.equal(anchored.observer.nodes.has(anchored.anchor), false); stop();
});

test("reduced motion, visibility changes and unsupported APIs leave content visible", () => {
  const h = harness({ reduced: true }); const cleanup = startScrollReveal(h.win, h.doc);
  assert.equal(h.observer.nodes.size, 0);
  h.media.matches = false; h.media.fire("change"); assert.ok(h.observer.nodes.has(h.later));
  h.later.top = 400;
  h.observer.emit(h.later); h.media.matches = true; h.media.fire("change");
  assert.equal(h.later.calls[0].animation.canceled, true);
  assert.equal(h.observer.nodes.size, 0);
  h.media.matches = false; h.media.fire("change"); h.doc.hidden = true; h.doc.fire("visibilitychange");
  assert.equal(h.observer.nodes.size, 0); h.doc.hidden = false; h.doc.fire("visibilitychange");
  assert.ok(h.observer.nodes.has(h.anchor)); cleanup();
  assert.doesNotThrow(() => startScrollReveal({}, {})());
  const unsupported = harness(); unsupported.win.matchMedia = () => ({ matches: false });
  assert.doesNotThrow(() => startScrollReveal(unsupported.win, unsupported.doc)());
  assert.equal(unsupported.observer, undefined);
});

test("two visible pixels wait; a significant entry and a tall element reveal once", () => {
  const h = harness();
  h.later.height = 300; h.later.top = 598;
  h.anchor.height = 3000; h.anchor.top = 598;
  const cleanup = startScrollReveal(h.win, h.doc);
  assert.ok(h.observer.nodes.has(h.later)); assert.ok(h.observer.nodes.has(h.anchor));
  h.observer.emit(h.later); h.observer.emit(h.anchor);
  assert.equal(h.later.calls.length, 0); assert.equal(h.anchor.calls.length, 0);
  assert.ok(h.observer.nodes.has(h.later)); assert.ok(h.observer.nodes.has(h.anchor));
  h.later.top = 500; h.anchor.top = 450;
  h.observer.emit(h.later); h.observer.emit(h.anchor);
  h.observer.emit(h.later); h.observer.emit(h.anchor);
  assert.equal(h.later.calls.length, 1); assert.equal(h.anchor.calls.length, 1);
  assert.ok(isMeaningfullyVisible({ left: 0, right: 100, top: 450, bottom: 3450 }, { width: 800, height: 600 }));
  assert.equal(isMeaningfullyVisible({ left: 0, right: 100, top: 598, bottom: 3598 }, { width: 800, height: 600 }), false);
  cleanup();
});

test("resize rebuilds a single observer with a viewport-relative inset", () => {
  const h = harness(); const cleanup = startScrollReveal(h.win, h.doc), old = h.observer;
  h.later.top = 400; h.win.innerHeight = 900; h.win.fire("resize");
  assert.equal(old.disconnects, 1);
  assert.notEqual(h.observer, old);
  assert.equal(h.observer.options.rootMargin, "-180px 0px -180px 0px");
  assert.ok(h.observer.nodes.has(h.anchor));
  assert.ok(h.observer.nodes.has(h.later));
  h.observer.emit(h.later); assert.equal(h.later.calls.length, 1);
  cleanup();
});
