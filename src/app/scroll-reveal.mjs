// No element is hidden or pre-transformed: animation is progressive enhancement.
export const REVEAL_SELECTOR = [
  ".proof-strip > p",
  ".proof-strip > div > span",
  ".section-heading > h2",
  ".section-heading > p",
  ".detail-row > .detail-copy",
  ".detail-row > .detail-visual",
  ".features-grid > .feature-card",
  ".journey-grid > li",
  ".footer-brand > p",
].join(", ");

// Normalize by the part that can fit in the viewport, not by a huge element's
// total area; otherwise an element taller than the viewport may never qualify.
export function isMeaningfullyVisible(rect, viewport) {
  const width = Math.max(0, Math.min(rect.right - rect.left, viewport.width));
  const height = Math.max(0, Math.min(rect.bottom - rect.top, viewport.height));
  if (!width || !height) return false;
  const visibleWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0));
  return (visibleWidth * visibleHeight) / (width * height) >= 0.18;
}

// Plans are transform-only, so content and contrast remain available even if
// an animation is interrupted. Horizontal travel is bounded by the viewport.
export function revealEffect(node, viewportWidth) {
  const matches = selector => typeof node.matches === "function" && node.matches(selector);
  const rect = node.getBoundingClientRect();
  const index = node.parentElement ? Array.from(node.parentElement.children).indexOf(node) : 0;
  const lateral = (direction, desired) => {
    const room = direction < 0 ? rect.left : viewportWidth - rect.right;
    return direction * Math.max(0, Math.min(desired, Math.floor(room) - 4));
  };
  let initial = "translateY(24px)", middle = "translateY(4px)", duration = 760, delay = 0;
  if (matches(".section-heading > h2")) {
    initial = "translateY(28px) scale(0.985)"; middle = "translateY(4px) scale(0.998)"; duration = 880;
  } else if (matches(".detail-row > .detail-copy, .detail-row > .detail-visual")) {
    const isCopy = matches(".detail-row > .detail-copy");
    const reversed = node.parentElement?.classList.contains("reversed");
    const direction = (isCopy ? -1 : 1) * (reversed ? -1 : 1);
    const x = lateral(direction, 32);
    initial = `translate(${x}px, 14px)`; middle = `translate(${x * 0.12}px, 2px)`; duration = 880;
  } else if (matches(".features-grid > .feature-card, .journey-grid > li")) {
    initial = "translateY(34px) scale(0.975)"; middle = "translateY(5px) scale(0.995)"; duration = 880;
    delay = Math.max(0, index % 3) * 70;
  } else if (matches(".proof-strip > div > span")) {
    const x = lateral(index % 2 ? 1 : -1, 20);
    initial = `translate(${x}px, 14px)`; middle = `translate(${x * 0.12}px, 2px)`; duration = 760;
    delay = Math.max(0, index % 3) * 50;
  }
  return {
    keyframes: [{ transform: initial, offset: 0 }, { transform: middle, offset: 0.72 }, { transform: "translate(0, 0) scale(1)", offset: 1 }],
    options: { duration, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
  };
}

export function startScrollReveal(win, doc) {
  if (!win.IntersectionObserver || !win.matchMedia) return () => {};
  const media = win.matchMedia("(prefers-reduced-motion: reduce)");
  if (!media || typeof media.addEventListener !== "function" || typeof media.removeEventListener !== "function") return () => {};
  const targets = [...doc.querySelectorAll(REVEAL_SELECTOR)];
  const seen = new Set();
  const animations = new Map();
  let disposed = false;

  const stop = node => {
    const animation = animations.get(node);
    if (animation) { animations.delete(node); animation.cancel(); }
  };
  const stopAll = () => { for (const node of [...animations.keys()]) stop(node); };
  const meaningfullyVisible = node => isMeaningfullyVisible(node.getBoundingClientRect(), { width: win.innerWidth, height: win.innerHeight });

  const onEntries = entries => {
    if (disposed || media.matches || doc.hidden) return;
    for (const entry of entries) {
      const node = entry.target;
      if (!entry.isIntersecting || seen.has(node) || !meaningfullyVisible(node)) continue;
      seen.add(node);
      observer.unobserve(node);
      if (node.contains(doc.activeElement) || typeof node.animate !== "function") continue;
      try {
        // Don't replace a pre-existing transform or interfere with another effect.
        if (typeof win.getComputedStyle === "function" && win.getComputedStyle(node).transform !== "none") continue;
        const effect = revealEffect(node, doc.documentElement?.clientWidth || win.innerWidth);
        const animation = node.animate(effect.keyframes, effect.options);
        animations.set(node, animation);
        animation.onfinish = animation.oncancel = () => animations.delete(node);
      } catch { /* Unsupported animation leaves the content unchanged. */ }
    }
  };
  // The inset makes the callback occur after the target has visibly entered,
  // while threshold zero still works for targets much taller than the viewport.
  const createObserver = () => {
    const inset = Math.max(0, Math.floor(win.innerHeight * 0.2));
    return new win.IntersectionObserver(onEntries, { rootMargin: `-${inset}px 0px -${inset}px 0px`, threshold: [0, 0.001, 0.01, 0.05, 0.1, 0.2, 0.4, 0.6, 1] });
  };
  let observer = createObserver();

  const skipAnchor = hash => {
    if (!hash || hash === "#") return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = doc.getElementById(id);
    if (!target) return;
    const area = target.closest("section, footer") || target;
    // The skip link targets the entire main; don't suppress all later sections.
    if (area === doc.querySelector("main")) { stopAll(); return; }
    for (const node of targets) if (area.contains(node) || node.contains(target)) {
      seen.add(node); observer.unobserve(node); stop(node);
    }
  };
  const observePending = (skipVisible = true) => {
    if (disposed || media.matches || doc.hidden) return;
    for (const node of targets) {
      if (seen.has(node)) continue;
      if (skipVisible && meaningfullyVisible(node)) { seen.add(node); continue; }
      observer.observe(node);
    }
  };
  const onMotionChange = () => {
    if (media.matches) { observer.disconnect(); stopAll(); }
    else observePending();
  };
  const onFocus = event => {
    for (const node of targets) if (node.contains(event.target)) {
      seen.add(node); observer.unobserve(node); stop(node);
    }
  };
  const onClick = event => {
    const link = event.target?.closest?.("a[href]");
    const href = link?.getAttribute("href");
    if (href?.startsWith("#")) skipAnchor(href);
  };
  const onHash = () => skipAnchor(win.location.hash);
  const onVisibility = () => {
    if (doc.hidden) { observer.disconnect(); stopAll(); }
    else observePending();
  };
  const onResize = () => {
    observer.disconnect(); stopAll();
    try { observer = createObserver(); }
    catch { return; } // A failed observer leaves all content in its normal state.
    observePending(false);
  };

  skipAnchor(win.location.hash);
  observePending();
  media.addEventListener("change", onMotionChange);
  doc.addEventListener("focusin", onFocus);
  doc.addEventListener("click", onClick, true);
  doc.addEventListener("visibilitychange", onVisibility);
  win.addEventListener("hashchange", onHash);
  win.addEventListener("resize", onResize);

  return () => {
    disposed = true; observer.disconnect(); stopAll();
    media.removeEventListener("change", onMotionChange);
    doc.removeEventListener("focusin", onFocus);
    doc.removeEventListener("click", onClick, true);
    doc.removeEventListener("visibilitychange", onVisibility);
    win.removeEventListener("hashchange", onHash);
    win.removeEventListener("resize", onResize);
  };
}
