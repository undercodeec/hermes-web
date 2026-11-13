"use client";

import { useEffect, useRef, useState } from "react";
import { mapCanvasReturn } from "./canvas-return-motion.mjs";
import { attachHeroScrollBridge } from "./hero-scroll-bridge.mjs";
import { attachHeroPointerBridge } from "./hero-pointer-bridge.mjs";

// Kept verbatim from the supplied wrapper: same-origin DOM isolation, not a new scene.
function showOriginalBrain(frame) {
  const document = frame.contentDocument;
  const canvas = document?.getElementById("canvas");
  if (!canvas) return false;

  const canvasLayer = canvas.closest("body > div");
  if (!canvasLayer) return false;

  document.documentElement.style.setProperty("overflow", "hidden", "important");
  document.documentElement.style.setProperty("height", "100%", "important");
  document.body.style.setProperty("overflow", "hidden", "important");
  document.body.style.setProperty("height", "100%", "important");
  document.body.style.setProperty("min-height", "0", "important");
  canvasLayer.classList.add("crm-login-brain-canvas");

  if (!document.getElementById("crm-login-brain-only")) {
    const style = document.createElement("style");
    style.id = "crm-login-brain-only";
    style.textContent = `
      html, body { height: 100% !important; min-height: 0 !important; overflow: hidden !important; background-color: transparent !important; }
      html { scrollbar-width: none !important; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; }
      body > :not(.crm-login-brain-canvas) { visibility: hidden !important; }
      .asscrollbar, [asscrollbar], [class*="scrollbar"] { display: none !important; }
      body > .crm-login-brain-canvas { position: fixed !important; inset: 0 !important; z-index: 1 !important; visibility: visible !important; }
    `;
    document.head.append(style);
  }

  for (const element of document.body.children) {
    if (element === canvasLayer) {
      element.style.setProperty("visibility", "visible", "important");
    } else {
      element.style.setProperty("visibility", "hidden", "important");
    }
  }
  return true;
}


function OriginalFrame({ onFailure, returning = false }) {
  const frameRef = useRef(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const frame = frameRef.current;
    let disposed = false;
    let revealed = false;
    let timer;
    let deadline;
    let observedDocument;
    let observedCanvas;
    let stopPointerBridge;
    let stopScrollBridge;
    const subscriptions = [];
    const listen = (target, event, handler, capture = false) => {
      target.addEventListener(event, handler, capture);
      subscriptions.push(() => target.removeEventListener(event, handler, capture));
    };
    const stopPolling = () => {
      clearInterval(timer);
      clearTimeout(deadline);
    };
    const detachSceneListeners = () => {
      stopPointerBridge?.();
      stopPointerBridge = undefined;
      stopScrollBridge?.();
      stopScrollBridge = undefined;
      subscriptions.splice(0).forEach((remove) => remove());
      observedDocument = undefined;
      observedCanvas = undefined;
    };
    const fail = () => {
      if (disposed) return;
      disposed = true;
      stopPolling();
      detachSceneListeners();
      setStatus("failed");
      onFailure(true); // Latch in the hero parent: visibility changes must not create a retry loop.
    };
    const reveal = () => {
      if (disposed) return;
      try {
        const doc = frame.contentDocument;
        if (!doc) return;
        if (doc !== observedDocument) {
          detachSceneListeners();
          revealed = false;
          observedDocument = doc;
          // Capture non-bubbling resource errors as soon as this document is observable.
          listen(doc, "error", fail, true);
          if (doc.defaultView) {
            listen(doc.defaultView, "error", fail);
            listen(doc.defaultView, "unhandledrejection", fail);
          }
        }
        const canvas = doc.getElementById("canvas");
        if (canvas && canvas !== observedCanvas) {
          observedCanvas = canvas;
          listen(canvas, "webglcontextlost", fail);
          listen(canvas, "webglcontextcreationerror", fail);
        }
        if (revealed || !showOriginalBrain(frame)) return;
        revealed = true;
        const hero = frame.closest(returning ? '.canvas-return-track' : '.hero');
        if (hero) {
          if (!returning) stopPointerBridge = attachHeroPointerBridge(hero, frame, fail);
          stopScrollBridge = attachHeroScrollBridge(hero, frame, (value) => {
            frame.dataset.scrollBridge = value;
            if (value === 'unavailable') fail();
          }, returning ? (rect, viewport) => {
            const motion = mapCanvasReturn(rect, viewport);
            if (!motion) return null;
            frame.parentElement.style.transform = 'translate3d(' + motion.x + 'vw,' + motion.y + 'vh,0)';
            return motion.progress;
          } : undefined);
        }
        stopPolling();
        // Keep error/context listeners alive after ready. No pixel/shader-success heuristic.
        setStatus("ready"); // Canvas exists; this does not certify that the scene rendered.
      } catch {
        fail();
      }
    };
    frame.addEventListener("load", reveal);
    frame.addEventListener("error", fail);
    timer = setInterval(reveal, 100);
    deadline = setTimeout(fail, 20000);
    reveal();
    return () => {
      disposed = true;
      stopPolling();
      detachSceneListeners();
      frame.removeEventListener("load", reveal);
      frame.removeEventListener("error", fail);
    };
  }, [onFailure, returning]);
  // Failure keeps the static hero background and removes the complete iframe runtime.
  if (status === "failed") return null;
  return (
    <div className={`${returning ? 'return-brain' : 'hero-brain'}${status === "ready" ? " is-ready" : ""}`}>
      <iframe ref={frameRef} src="/canvas/embed.html" title="Animación decorativa"
        aria-hidden="true" tabIndex={-1} />
    </div>
  );
}

export default function HeroCanvas({ returning = false }) {
  const hostRef = useRef(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let pageActive = true;
    const intersects = (host) => {
      const rect = host?.getBoundingClientRect();
      return rect && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const update = () => {
      // Re-read stable geometry: IO entries can be stale after rapid resize/scroll.
      // Return has priority if an unusually tall viewport could contain both hosts.
      const returnVisible = intersects(document.querySelector('.canvas-return-track'));
      setActive(media.matches && intersects(hostRef.current) && (returning || !returnVisible) && pageActive && !document.hidden);
    };
    const notify = () => window.dispatchEvent(new Event('hermes:canvas-visibility'));
    window.addEventListener('hermes:canvas-visibility', update);
    const observer = new IntersectionObserver(notify);
    const hide = () => { pageActive = false; update(); };
    const show = () => { pageActive = true; update(); };
    observer.observe(hostRef.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('hermes:canvas-visibility', update);
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
    };
  }, [returning]);
  if (returning) return <div className={`canvas-return-track${failed ? ' is-failed' : ''}`} ref={hostRef} aria-hidden='true'><div className='canvas-return-sticky'><div className='canvas-return-fallback' />{active && !failed && <OriginalFrame returning onFailure={setFailed} />}</div></div>;
  return <div className="hero-canvas-layer" ref={hostRef} aria-hidden="true">{active && !failed && <OriginalFrame onFailure={setFailed} />}</div>;
}
