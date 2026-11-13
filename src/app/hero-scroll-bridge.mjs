// Native parent scroll feeds the original WebGL update pipeline through the scoped local adapter.
export function mapHeroScroll(rect) {
  if (!Number.isFinite(rect.top) || !Number.isFinite(rect.height) || rect.height <= 0) return null;
  // Full shader expansion at 70% travel, while 30% of the hero is still visible.
  return 2.2 * Math.max(0, Math.min(1, -rect.top / (rect.height * 0.7)));
}

export function resolveOriginalScroll(frame) {
  const runtime = frame.contentWindow?.__HERMES_HERO_SCROLL__;
  if (!runtime?.ready || typeof runtime.setProgress !== 'function') return null;
  return runtime;
}

export function attachHeroScrollBridge(hero, frame, onStatus = () => {}, mapScroll = mapHeroScroll) {
  const outer = hero.ownerDocument.defaultView;
  const options = { passive: true };
  let disposed = false, raf = null, timer = null, deadline = null, settle = null, ready = false, blocked = false;
  const status = (value) => { if (!disposed) onStatus(value); };
  const stopPolling = () => { outer.clearInterval(timer); outer.clearTimeout(deadline); timer = deadline = null; };
  const apply = () => {
    raf = null;
    if (disposed || blocked) return;
    try {
      const runtime = resolveOriginalScroll(frame);
      if (!runtime) return;
      const target = mapScroll(hero.getBoundingClientRect(), outer.innerHeight);
      if (target === null || !runtime.setProgress(target)) return;
      if (!ready) { ready = true; stopPolling(); status('ready'); }
    } catch { blocked = true; stopPolling(); status('unavailable'); }
  };
  const schedule = () => {
    if (!disposed && !blocked && raf === null) raf = outer.requestAnimationFrame(apply);
  };
  const resize = () => {
    schedule();
    outer.clearTimeout(settle);
    // Legacy resize is debounced; re-read geometry after that resize without changing its layout.
    settle = outer.setTimeout(schedule, 250);
  };
  const load = () => { ready = false; blocked = false; stopPolling(); status('waiting'); poll(); };
  const poll = () => {
    timer = outer.setInterval(schedule, 100);
    deadline = outer.setTimeout(() => { blocked = true; stopPolling(); status('unavailable'); }, 20000);
    schedule();
  };
  outer.addEventListener('scroll', schedule, options);
  outer.addEventListener('resize', resize, options);
  frame.addEventListener('load', load);
  status('waiting');
  poll();
  return () => {
    if (disposed) return;
    disposed = true;
    stopPolling();
    outer.clearTimeout(settle);
    if (raf !== null) outer.cancelAnimationFrame(raf);
    outer.removeEventListener('scroll', schedule, options);
    outer.removeEventListener('resize', resize, options);
    frame.removeEventListener('load', load);
  };
}
