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


const frame = document.getElementById('brain-frame');
const wrapper = document.querySelector('.crm-login-brain');
let checkCanvas;
function revealCanvas() {
  if (showOriginalBrain(frame)) {
    clearInterval(checkCanvas);
    wrapper.classList.add('is-ready');
    frame.style.visibility = 'visible';
  }
}
checkCanvas = setInterval(revealCanvas, 100);
frame.addEventListener('load', revealCanvas);
revealCanvas();
window.addEventListener('pagehide', () => {
  clearInterval(checkCanvas);
  frame.removeEventListener('load', revealCanvas);
}, { once:true });
