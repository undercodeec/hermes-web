// Wrapper-only adapter for the unchanged legacy window mousemove consumer.
export function mapHeroPointer(point, rect, width, height) {
  if (![point.clientX, point.clientY, rect.left, rect.top, rect.width, rect.height, width, height].every(Number.isFinite) ||
      rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return null;
  const clamp = (value, max) => Math.max(0, Math.min(max, value));
  // getBoundingClientRect includes translate, negative margins and CSS scale.
  // Text outside the decorative frame maps to its nearest viewport edge.
  return {
    clientX: clamp((point.clientX - rect.left) * width / rect.width, width),
    clientY: clamp((point.clientY - rect.top) * height / rect.height, height),
  };
}

export function attachHeroPointerBridge(hero, frame, onFailure) {
  const outer = hero.ownerDocument.defaultView;
  const options = { passive: true, capture: true };
  let disposed = false;
  let raf = null;
  let pending = null;
  let previous = null;
  let engaged = false;
  const cancel = () => {
    if (raf !== null) outer.cancelAnimationFrame(raf);
    raf = null;
    pending = null;
  };
  const send = (view, point) => {
    // Native MouseEvent constructor in the receiving realm; isTrusted remains false.
    view.dispatchEvent(new view.MouseEvent('mousemove', {
      ...point, view, bubbles: false, cancelable: false,
      movementX: previous ? point.clientX - previous.clientX : 0,
      movementY: previous ? point.clientY - previous.clientY : 0,
    }));
    previous = point;
  };
  const safely = (work) => {
    try { work(); } catch { cancel(); onFailure(); }
  };
  const reset = () => {
    cancel();
    if (!engaged || disposed) return;
    engaged = false;
    safely(() => {
      const view = frame.contentWindow;
      const center = { clientX: view.innerWidth / 2, clientY: view.innerHeight / 2 };
      // First centers camera/targets; second clears the cones' position delta.
      // There is no subscribed WebGL mouseleave consumer in the original bundle.
      send(view, center);
      send(view, center);
      previous = null;
    });
  };
  const move = (event) => {
    if (disposed || event.pointerType !== 'mouse' || event.buttons) return;
    pending = { clientX: event.clientX, clientY: event.clientY };
    if (raf !== null) return;
    raf = outer.requestAnimationFrame(() => {
      raf = null;
      const point = pending;
      pending = null;
      if (disposed) return;
      safely(() => {
        const view = frame.contentWindow;
        const mapped = mapHeroPointer(point, frame.getBoundingClientRect(), view.innerWidth, view.innerHeight);
        if (!mapped) { reset(); return; }
        engaged = true;
        send(view, mapped);
      });
    });
  };
  // Capture also observes descendant pointerleave; moving between text/CTA is not a hero exit.
  const leave = (event) => { if (event.target === hero) reset(); };
  hero.addEventListener('pointermove', move, options);
  hero.addEventListener('pointerleave', leave, options);
  hero.addEventListener('pointercancel', reset, options);
  outer.addEventListener('blur', reset, options);
  outer.addEventListener('scroll', reset, options);
  outer.addEventListener('resize', reset, options);
  return () => {
    if (disposed) return;
    disposed = true;
    cancel();
    hero.removeEventListener('pointermove', move, options);
    hero.removeEventListener('pointerleave', leave, options);
    hero.removeEventListener('pointercancel', reset, options);
    outer.removeEventListener('blur', reset, options);
    outer.removeEventListener('scroll', reset, options);
    outer.removeEventListener('resize', reset, options);
    previous = null;
  };
}
